"""Юнит-тесты SSO/OIDC: транзакционная cookie, подписанный tx-токен и свойства настроек.

Сетевой обмен с IdP здесь не проверяется (он живёт в OidcClient и требует внешний
провайдер) — покрываем детерминированную логику: формат cookie, round-trip tx-токена
и вывод discovery/redirect из настроек.
"""
import pytest
from fastapi import Response
from jose.exceptions import JWTError

from app.config import Settings
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

    assert settings.sso_redirect_uri == "https://storm.example.com/api/v1/auth/sso/callback"
    assert settings.sso_scope_list == ["openid", "profile", "email"]


def test_sso_not_configured_when_disabled_tc_sso_008() -> None:
    settings = Settings(sso_enabled=False, sso_issuer="https://iam.example.com/realms/storm", sso_client_id="storm")
    assert settings.sso_configured is False

    enabled = Settings(sso_enabled=True, sso_issuer="https://iam.example.com/realms/storm", sso_client_id="storm")
    assert enabled.sso_configured is True
