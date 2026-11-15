"""Каждый внутренний защищённый HTTP-метод: отказ без сессии и CSRF.

Матрица строится по зарегистрированным маршрутам, новые методы попадают автоматически.
Это проверка границы доступа, а не замена тестов бизнес-логики.
"""
import re

import httpx
import pytest
from fastapi.routing import APIRoute

from app.config import get_settings
from app.dependencies import enforce_csrf, get_agent_token_context, get_current_user
from app.main import app, agent_api_v2


def depends_on(dependant, call):
    return dependant.call is call or any(depends_on(child, call) for child in dependant.dependencies)


def protected_routes():
    external = {"works", "task_tracker", "farm", "scanner", "files", "images"}
    for target, prefix in [(app, ""), (agent_api_v2, "/api/v2")]:
        routes = []
        for registered in target.routes:
            if isinstance(registered, APIRoute):
                routes.append(registered)
            elif hasattr(registered, "effective_route_contexts"):
                # FastAPI 0.162 resolves included routers lazily. Effective
                # contexts include the mounted prefix and inherited Depends.
                routes.extend(route for route in registered.effective_route_contexts()
                              if isinstance(route.original_route, APIRoute))
        for route in routes:
            if route.endpoint.__module__.rsplit(".", 1)[-1] in external:
                continue
            if not any(depends_on(route.dependant, call) for call in [get_current_user, get_agent_token_context]):
                continue
            for method in sorted(route.methods):
                yield method, prefix + re.sub(r"\{[^}]+\}", "1", route.path), depends_on(route.dependant, enforce_csrf)


CASES = list(protected_routes())
assert len(CASES) >= 100, "Route discovery lost protected API methods"


@pytest.mark.asyncio
@pytest.mark.parametrize("method,path,csrf", CASES, ids=[f"{m} {p}" for m, p, _ in CASES])
async def test_each_internal_method_requires_authentication(method, path, csrf):
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="https://test.local") as client:
        response = await client.request(method, path, json={}, headers={"Origin": get_settings().csrf_origins[0]})
    assert response.status_code == 401, response.text


CSRF_CASES = [(m, p) for m, p, csrf in CASES if csrf]
assert len(CSRF_CASES) >= 50, "Route discovery lost CSRF-protected mutations"


@pytest.mark.asyncio
@pytest.mark.parametrize("method,path", CSRF_CASES, ids=[f"{m} {p}" for m, p in CSRF_CASES])
async def test_each_internal_mutation_rejects_untrusted_origin(method, path):
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="https://test.local") as client:
        response = await client.request(method, path, json={}, headers={"Origin": "https://untrusted.invalid"})
    assert response.status_code == 403, response.text
