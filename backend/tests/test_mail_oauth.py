"""Юнит-тесты добычи OAuth2-токена для SMTP XOAUTH2.

Покрывают провайдеро-независимую функцию `_get_oauth_access_token`: путь
Microsoft 365 / Exchange Online (grant_type=client_credentials) и обратную
совместимость с Google (fallback на google_oauth_* + grant_type=refresh_token).
"""
import httpx
import pytest

import app.mail as mail


@pytest.fixture(autouse=True)
def _clear_token_cache():
    mail._oauth_token_cache.clear()
    yield
    mail._oauth_token_cache.clear()


def _patch_token_endpoint(monkeypatch, handler):
    """Инжектим MockTransport в httpx.AsyncClient, который создаёт mail.py."""
    orig = httpx.AsyncClient

    def factory(*args, **kwargs):
        kwargs["transport"] = httpx.MockTransport(handler)
        return orig(*args, **kwargs)

    monkeypatch.setattr(mail.httpx, "AsyncClient", factory)


def _set(monkeypatch, **fields):
    for key, value in fields.items():
        monkeypatch.setattr(mail.settings, key, value)


@pytest.mark.asyncio
async def test_oauth_client_credentials_microsoft(monkeypatch):
    seen: dict[str, str] = {}

    def handler(request: httpx.Request) -> httpx.Response:
        seen["url"] = str(request.url)
        seen["body"] = request.content.decode()
        return httpx.Response(200, json={"access_token": "ms-token", "expires_in": 3600})

    _patch_token_endpoint(monkeypatch, handler)
    _set(
        monkeypatch,
        smtp_oauth_client_id="cid",
        smtp_oauth_client_secret="sec",
        smtp_oauth_token_url="https://login.microsoftonline.com/tid/oauth2/v2.0/token",
        smtp_oauth_grant_type="client_credentials",
        smtp_oauth_scope="https://outlook.office365.com/.default",
        smtp_oauth_refresh_token="",
    )

    token = await mail._get_oauth_access_token()

    assert token == "ms-token"
    assert "login.microsoftonline.com" in seen["url"]
    assert "grant_type=client_credentials" in seen["body"]
    assert "outlook.office365.com" in seen["body"]
    # Токен кешируется — повторный вызов не ходит в сеть (хендлер упал бы на новом запросе).
    assert await mail._get_oauth_access_token() == "ms-token"


@pytest.mark.asyncio
async def test_oauth_client_credentials_requires_scope(monkeypatch):
    _set(
        monkeypatch,
        smtp_oauth_client_id="cid",
        smtp_oauth_client_secret="sec",
        smtp_oauth_grant_type="client_credentials",
        smtp_oauth_scope="",
        smtp_oauth_refresh_token="",
    )
    with pytest.raises(RuntimeError, match="SCOPE"):
        await mail._get_oauth_access_token()


@pytest.mark.asyncio
async def test_oauth_missing_client_creds_raises(monkeypatch):
    _set(
        monkeypatch,
        smtp_oauth_client_id="",
        smtp_oauth_client_secret="",
        google_oauth_client_id="",
        google_oauth_client_secret="",
    )
    with pytest.raises(RuntimeError, match="CLIENT_ID"):
        await mail._get_oauth_access_token()


@pytest.mark.asyncio
async def test_oauth_refresh_token_google_fallback(monkeypatch):
    # smtp_oauth_* пусты → используются google_oauth_* (обратная совместимость).
    seen: dict[str, str] = {}

    def handler(request: httpx.Request) -> httpx.Response:
        seen["url"] = str(request.url)
        seen["body"] = request.content.decode()
        return httpx.Response(200, json={"access_token": "g-token", "expires_in": 3600})

    _patch_token_endpoint(monkeypatch, handler)
    _set(
        monkeypatch,
        smtp_oauth_client_id="",
        smtp_oauth_client_secret="",
        smtp_oauth_token_url="",
        smtp_oauth_refresh_token="",
        smtp_oauth_grant_type="refresh_token",
        smtp_oauth_scope="",
        google_oauth_client_id="gid",
        google_oauth_client_secret="gsec",
        google_oauth_refresh_token="grt",
        google_oauth_token_uri="https://oauth2.googleapis.com/token",
    )

    token = await mail._get_oauth_access_token()

    assert token == "g-token"
    assert "oauth2.googleapis.com" in seen["url"]
    assert "grant_type=refresh_token" in seen["body"]
