"""Swagger/OpenAPI доступны только авторизованным пользователям.

Штатные маршруты документации FastAPI выключены, вместо них — свои, закрытые
зависимостью get_current_user. Проверяем оба приложения: основное API и
смонтированный на /v2 под-апп Agent API.
"""
import httpx
import pytest

from app.dependencies import get_current_user
from app.main import agent_api_v2, app

_DOC_PATHS = ("/api/v1/docs", "/api/v1/redoc", "/api/v1/openapi.json", "/api/v2/docs", "/api/v2/redoc", "/api/v2/openapi.json")


@pytest.mark.asyncio
async def test_docs_require_auth_when_anonymous():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        for path in _DOC_PATHS:
            resp = await client.get(path)
            assert resp.status_code == 401, f"{path} should be gated, got {resp.status_code}"


@pytest.mark.asyncio
async def test_docs_accessible_when_authenticated():
    async def _fake_user():
        return object()  # get_current_user подменён — тело Swagger/openapi его не читает

    app.dependency_overrides[get_current_user] = _fake_user
    agent_api_v2.dependency_overrides[get_current_user] = _fake_user
    try:
        transport = httpx.ASGITransport(app=app)
        async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
            for path in ("/api/v1/docs", "/api/v1/redoc", "/api/v1/openapi.json", "/api/v2/docs", "/api/v2/openapi.json"):
                resp = await client.get(path)
                assert resp.status_code == 200, f"{path} should be 200 for authed, got {resp.status_code}"

            schema = (await client.get("/api/v1/openapi.json")).json()
            assert schema["info"]["title"] == "STORM API"
            assert schema["paths"], "openapi.json должен содержать пути"

            v2_schema = (await client.get("/api/v2/openapi.json")).json()
            assert v2_schema["info"]["title"] == "STORM Agent API"
    finally:
        app.dependency_overrides.pop(get_current_user, None)
        agent_api_v2.dependency_overrides.pop(get_current_user, None)
