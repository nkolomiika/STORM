"""Юнит-тесты SSO/OIDC: транзакционная cookie, подписанный tx-токен и свойства настроек.

Сеть и проверка внешних токенов подменяются: проверяем cookie, tx-токен,
вывод discovery/redirect и совпадение redirect_uri при авторизации и обмене кода.
"""
import pytest
import httpx
from urllib.parse import parse_qs, urlsplit
from unittest.mock import AsyncMock
from fastapi import Response
from jose.exceptions import JWTError

from app.config import Settings
from app.oidc import OidcClient
from app.routers.auth import (
    SSO_TX_COOKIE_PATH,
    _clear_sso_tx_cookie,
    _decode_sso_tx,
    _encode_sso_tx,
    _set_sso_tx_cookie,
)


def test_sso_tx_cookie_security_flags_tc_sso_001() -> None:
    response = Response()

    _set_sso_tx_cookie(response, "tx-value")

    cookie = next(item for item in response.headers.getlist("set-cookie") if item.startswith("sso_tx="))
    assert "HttpOnly" in cookie
    # Lax (не strict): callback приходит top-level переходом с домена IdP.
    assert "SameSite=lax" in cookie
    assert f"Path={SSO_TX_COOKIE_PATH}" in cookie


def test_sso_tx_cookie_cleared_with_zero_max_age_tc_sso_002() -> None:
    response = Response()

    _clear_sso_tx_cookie(response)

    cookie = next(item for item in response.headers.getlist("set-cookie") if item.startswith("sso_tx="))
    assert "Max-Age=0" in cookie


def test_sso_tx_token_round_trip_tc_sso_003() -> None:
    token = _encode_sso_tx("state-123", "nonce-456", "verifier-789")

    payload = _decode_sso_tx(token)

    assert payload["state"] == "state-123"
    assert payload["nonce"] == "nonce-456"
    assert payload["cv"] == "verifier-789"
    assert payload["type"] == "sso_tx"


def test_sso_tx_token_rejects_tampering_tc_sso_004() -> None:
    token = _encode_sso_tx("state", "nonce", "verifier")

    with pytest.raises(JWTError):
        _decode_sso_tx(token + "tampered")


def test_sso_discovery_url_derived_from_issuer_tc_sso_005() -> None:
    settings = Settings(sso_issuer="https://iam.example.com/realms/storm/")

    assert settings.sso_discovery_url == "https://iam.example.com/realms/storm/.well-known/openid-configuration"


def test_sso_metadata_url_overrides_issuer_tc_sso_006() -> None:
    settings = Settings(
        sso_issuer="https://iam.example.com/realms/storm",
        sso_metadata_url="https://idp.example.com/.well-known/openid-configuration",
    )

    assert settings.sso_discovery_url == "https://idp.example.com/.well-known/openid-configuration"


def test_sso_redirect_uri_and_scopes_tc_sso_007() -> None:
    settings = Settings(app_base_url="https://storm.example.com/", sso_scopes="openid profile email")

    assert settings.sso_redirect_uri == "https://storm.example.com/auth/callback"
    assert settings.sso_scope_list == ["openid", "profile", "email"]


def test_sso_not_configured_when_disabled_tc_sso_008() -> None:
    settings = Settings(sso_enabled=False, sso_issuer="https://iam.example.com/realms/storm", sso_client_id="storm")
    assert settings.sso_configured is False

    enabled = Settings(sso_enabled=True, sso_issuer="https://iam.example.com/realms/storm", sso_client_id="storm")
    assert enabled.sso_configured is True


@pytest.mark.asyncio
async def test_public_redirect_matches_authorization_and_token_exchange(monkeypatch):
    settings = Settings(app_base_url='https://storm.appsec.prod.sbt/', sso_redirect_base='',
                        sso_client_id='storm-test', sso_issuer='https://idp.example/realm')
    expected = 'https://storm.appsec.prod.sbt/auth/callback'
    client = OidcClient(settings)
    monkeypatch.setattr(client, '_metadata', AsyncMock(return_value={
        'authorization_endpoint': 'https://idp.example/authorize',
        'token_endpoint': 'https://idp.example/token',
    }))
    monkeypatch.setattr(client, '_verify_id_token', AsyncMock(return_value={
        'sub': 'test-user', 'email': 'user@example.test', 'email_verified': True,
        'preferred_username': 'test-user', 'name': 'Test User',
    }))
    requests = []

    def token_response(request):
        requests.append(request)
        return httpx.Response(200, json={'id_token': 'mock-id-token'})

    monkeypatch.setattr(client, '_client', lambda: httpx.AsyncClient(
        transport=httpx.MockTransport(token_response)))
    authorization = await client.build_authorization_request()
    assert parse_qs(urlsplit(authorization.url).query)['redirect_uri'] == [expected]
    await client.exchange_code('mock-code', authorization.code_verifier, authorization.nonce)
    assert len(requests) == 1
    assert parse_qs(requests[0].content.decode())['redirect_uri'] == [expected]


def test_redirect_base_overrides_app_base_without_changing_callback_path():
    settings = Settings(app_base_url='https://internal.example',
                        sso_redirect_base='https://public.example/')
    assert settings.sso_redirect_uri == 'https://public.example/auth/callback'


def test_legacy_callback_can_be_selected_explicitly():
    settings = Settings(app_base_url='https://public.example', sso_redirect_base='',
                        sso_callback_path='/api/v1/auth/sso/callback')
    assert settings.sso_redirect_uri == 'https://public.example/api/v1/auth/sso/callback'


@pytest.mark.asyncio
@pytest.mark.parametrize('callback', ['/auth/callback', '/api/v1/auth/sso/callback'])
async def test_sso_browser_round_trip_sends_transaction_cookie_to_callback(monkeypatch, callback):
    from app.config import get_settings
    from app.database import get_db
    from app.main import app
    from app.oidc import OidcIdentity
    from app.routers import auth

    settings = get_settings()
    for key, value in {'sso_enabled': True, 'sso_client_id': 'storm-test',
                       'sso_issuer': 'https://idp.example/realm', 'sso_metadata_url': '',
                       'sso_redirect_base': '', 'app_base_url': 'https://public.example',
                       'sso_callback_path': callback, 'cookie_secure': True}.items():
        monkeypatch.setattr(settings, key, value)
    monkeypatch.setattr(OidcClient, '_metadata', AsyncMock(return_value={
        'authorization_endpoint': 'https://idp.example/authorize'}))
    exchange = AsyncMock(return_value=OidcIdentity('test-user', 'user@example.test',
                                                  'test-user', 'Test User', True))
    monkeypatch.setattr(OidcClient, 'exchange_code', exchange)
    login = AsyncMock(return_value=('test-access', 'test-refresh', object()))
    monkeypatch.setattr(auth.AuthService, 'login_via_sso', login)

    async def no_database():
        yield object()

    app.dependency_overrides[get_db] = no_database
    try:
        async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app),
                                     base_url='https://public.example') as browser:
            browser.cookies.set('sso_tx', 'legacy-cookie', domain='public.example',
                                path='/api/v1/auth/sso')
            start = await browser.get('/api/v1/auth/sso/login')
            assert start.status_code == 303
            params = parse_qs(urlsplit(start.headers['location']).query)
            assert params['redirect_uri'] == ['https://public.example'+callback]
            transactions = [cookie for cookie in browser.cookies.jar if cookie.name == 'sso_tx']
            assert len(transactions) == 1 and transactions[0].path == '/'
            tx = _decode_sso_tx(transactions[0].value)
            response = await browser.get(callback, params={'code': 'test-code', 'state': params['state'][0]})
            assert response.status_code == 303
            assert response.headers['location'] == 'https://public.example/projects'
            exchange.assert_awaited_once_with('test-code', tx['cv'], tx['nonce'])
            login.assert_awaited_once()
            assert browser.cookies.get('access_token') == 'test-access'
            assert not [cookie for cookie in browser.cookies.jar if cookie.name == 'sso_tx']
    finally:
        app.dependency_overrides.pop(get_db, None)


@pytest.mark.asyncio
async def test_public_sso_callback_rejects_missing_state_cookie(monkeypatch):
    from app.database import get_db
    from app.main import app

    async def no_database():
        yield object()

    exchange = AsyncMock()
    monkeypatch.setattr(OidcClient, 'exchange_code', exchange)
    app.dependency_overrides[get_db] = no_database
    try:
        async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='https://public.example') as client:
            response = await client.get('/auth/callback?code=test&state=test')
        assert response.status_code == 303
        assert response.headers['location'].endswith('/login?sso_error=invalid_request')
        exchange.assert_not_awaited()
    finally:
        app.dependency_overrides.pop(get_db, None)
