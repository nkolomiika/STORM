"""Самодостаточный OpenID Connect клиент (Authorization Code + PKCE).

Реализует вход через корпоративную IAM (Keycloak-совместимый провайдер) без
сторонних OAuth-библиотек: discovery-документ и JWKS тянутся через httpx,
ID-токен проверяется python-jose (та же библиотека, что и для внутренних JWT).

Поток:
  1. build_authorization_request() — генерирует state/nonce/PKCE и URL авторизации;
     параметры транзакции кладём в короткоживущую подписанную cookie (см. роутер).
  2. браузер уходит на IdP, возвращается на /auth/callback?code&state.
  3. exchange_code() — меняем code на токены, проверяем ID-токен и достаём claims.
"""
from __future__ import annotations

import base64
import hashlib
import secrets
import time
from dataclasses import dataclass

import httpx
from jose import jwt
from jose.exceptions import JWTError

from app.config import Settings
from app.exceptions import UnauthorizedError

# Кэш discovery-документа и JWKS на процесс. Метаданные IdP практически не
# меняются; JWKS перечитываем при промахе по kid (ротация ключей).
_metadata_cache: dict[str, tuple[float, dict]] = {}
_jwks_cache: dict[str, dict] = {}
_METADATA_TTL = 3600.0


def _b64url(raw: bytes) -> str:
    """base64url без паддинга (формат PKCE и JWK)."""
    return base64.urlsafe_b64encode(raw).rstrip(b"=").decode("ascii")


@dataclass(frozen=True)
class AuthorizationRequest:
    """Данные для старта авторизации: куда редиректить и что запомнить в cookie."""

    url: str
    state: str
    nonce: str
    code_verifier: str


@dataclass(frozen=True)
class OidcIdentity:
    """Подтверждённая IdP личность пользователя (из ID-токена/userinfo)."""

    subject: str
    email: str | None
    username: str | None
    full_name: str | None
    email_verified: bool = False


class OidcClient:
    """OIDC-клиент, завязанный на настройки приложения."""

    def __init__(self, settings: Settings) -> None:
        self.settings = settings

    # ---- HTTP ----

    def _client(self) -> httpx.AsyncClient:
        return httpx.AsyncClient(verify=self.settings.sso_verify_tls, timeout=15.0)

    async def _metadata(self) -> dict:
        """Discovery-документ IdP (кэш на процесс с TTL)."""
        url = self.settings.sso_discovery_url
        if not url:
            raise UnauthorizedError("SSO не настроен")
        cached = _metadata_cache.get(url)
        now = time.monotonic()
        if cached and now - cached[0] < _METADATA_TTL:
            return cached[1]
        async with self._client() as client:
            resp = await client.get(url)
            resp.raise_for_status()
            data = resp.json()
        _metadata_cache[url] = (now, data)
        return data

    async def _jwks(self, *, force: bool = False) -> dict:
        """JWKS IdP. force=True перечитывает (ротация подписывающих ключей)."""
        meta = await self._metadata()
        jwks_uri = meta.get("jwks_uri")
        if not jwks_uri:
            raise UnauthorizedError("В метаданных IdP отсутствует jwks_uri")
        if not force and jwks_uri in _jwks_cache:
            return _jwks_cache[jwks_uri]
        async with self._client() as client:
            resp = await client.get(jwks_uri)
            resp.raise_for_status()
            data = resp.json()
        _jwks_cache[jwks_uri] = data
        return data

    # ---- Authorization request ----

    async def build_authorization_request(self, next_path: str | None = None) -> AuthorizationRequest:
        """Строит URL авторизации с PKCE (S256), state и nonce."""
        meta = await self._metadata()
        authorize_endpoint = meta.get("authorization_endpoint")
        if not authorize_endpoint:
            raise UnauthorizedError("В метаданных IdP отсутствует authorization_endpoint")

        state = secrets.token_urlsafe(24)
        nonce = secrets.token_urlsafe(24)
        code_verifier = _b64url(secrets.token_bytes(48))
        code_challenge = _b64url(hashlib.sha256(code_verifier.encode("ascii")).digest())

        params = {
            "response_type": "code",
            "client_id": self.settings.sso_client_id,
            "redirect_uri": self.settings.sso_redirect_uri,
            "scope": " ".join(self.settings.sso_scope_list),
            "state": state,
            "nonce": nonce,
            "code_challenge": code_challenge,
            "code_challenge_method": "S256",
        }
        url = f"{authorize_endpoint}?{httpx.QueryParams(params)}"
        return AuthorizationRequest(url=url, state=state, nonce=nonce, code_verifier=code_verifier)

    # ---- Callback ----

    async def exchange_code(self, code: str, code_verifier: str, nonce: str) -> OidcIdentity:
        """Меняет authorization code на токены, проверяет ID-токен и возвращает личность."""
        meta = await self._metadata()
        token_endpoint = meta.get("token_endpoint")
        if not token_endpoint:
            raise UnauthorizedError("В метаданных IdP отсутствует token_endpoint")

        data = {
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": self.settings.sso_redirect_uri,
            "client_id": self.settings.sso_client_id,
            "code_verifier": code_verifier,
        }
        if self.settings.sso_client_secret:
            data["client_secret"] = self.settings.sso_client_secret

        async with self._client() as client:
            resp = await client.post(token_endpoint, data=data, headers={"Accept": "application/json"})
        if resp.status_code != 200:
            raise UnauthorizedError("IdP отклонил обмен кода на токен")
        token = resp.json()
        id_token = token.get("id_token")
        if not id_token:
            raise UnauthorizedError("IdP не вернул id_token")

        claims = await self._verify_id_token(id_token, nonce, meta)

        email = claims.get(self.settings.sso_email_claim) or claims.get("email")
        email_verified = claims.get("email_verified") is True
        username = claims.get(self.settings.sso_username_claim) or claims.get("preferred_username")
        full_name = claims.get("name") or claims.get("given_name")

        # Если в ID-токене нет email/имени — добираем из userinfo.
        if (not email or not full_name) and meta.get("userinfo_endpoint") and token.get("access_token"):
            info = await self._userinfo(meta["userinfo_endpoint"], token["access_token"])
            if info and info.get("sub") != claims.get("sub"):
                raise UnauthorizedError("userinfo принадлежит другой IdP-личности")
            if not email:
                email_verified = info.get("email_verified") is True
            email = email or info.get(self.settings.sso_email_claim) or info.get("email")
            username = username or info.get(self.settings.sso_username_claim) or info.get("preferred_username")
            full_name = full_name or info.get("name")

        subject = claims.get("sub")
        if not isinstance(subject, str) or not subject:
            raise UnauthorizedError("В ID-токене отсутствует sub")
        return OidcIdentity(subject=subject, email=email if isinstance(email, str) else None,
                            username=username if isinstance(username, str) else None,
                            full_name=full_name if isinstance(full_name, str) else None,
                            email_verified=email_verified)

    async def _verify_id_token(self, id_token: str, nonce: str, meta: dict) -> dict:
        """Проверяет подпись (JWKS по kid), iss/aud/exp и nonce ID-токена."""
        try:
            header = jwt.get_unverified_header(id_token)
        except JWTError as exc:
            raise UnauthorizedError("Некорректный ID-токен") from exc
        kid = header.get("kid")
        algorithm = header.get("alg", "RS256")
        if algorithm not in {"RS256", "RS384", "RS512", "ES256", "ES384", "ES512"}:
            raise UnauthorizedError("Недопустимый алгоритм подписи ID-токена")

        key = await self._find_key(kid)
        if key.get("alg") and key["alg"] != algorithm:
            raise UnauthorizedError("Алгоритм ключа не совпадает с ID-токеном")
        issuer = meta.get("issuer") or self.settings.sso_issuer.rstrip("/")
        try:
            claims = jwt.decode(
                id_token,
                key,
                algorithms=[algorithm],
                audience=self.settings.sso_client_id,
                issuer=issuer,
                options={"verify_at_hash": False, "require_exp": True, "require_iat": True, "require_sub": True},
            )
        except JWTError as exc:
            raise UnauthorizedError("ID-токен недействителен или истёк") from exc

        if claims.get("nonce") != nonce:
            raise UnauthorizedError("Несовпадение nonce — возможна атака повтора")
        return claims

    async def _find_key(self, kid: str | None) -> dict:
        """Ищет JWK по kid; при промахе перечитывает JWKS (ротация ключей)."""
        for force in (False, True):
            jwks = await self._jwks(force=force)
            keys = jwks.get("keys", [])
            if kid:
                for jwk in keys:
                    if jwk.get("kid") == kid:
                        return jwk
            elif len(keys) == 1:
                return keys[0]
        raise UnauthorizedError("Не найден ключ подписи ID-токена")

    async def _userinfo(self, endpoint: str, access_token: str) -> dict:
        """Запрашивает userinfo (мягко — ошибки не валят вход)."""
        try:
            async with self._client() as client:
                resp = await client.get(endpoint, headers={"Authorization": f"Bearer {access_token}"})
            if resp.status_code == 200:
                return resp.json()
        except httpx.HTTPError:
            pass
        return {}
