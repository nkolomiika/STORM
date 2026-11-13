"""Авторизация WebSocket: настоящий PostgreSQL, без startup и внешних систем."""
from contextlib import aclosing
from types import SimpleNamespace
from unittest.mock import AsyncMock

import pytest
from sqlalchemy import update
from sqlalchemy.ext.asyncio import async_sessionmaker

from app.database import get_db
from app.main import app
from app.models import User
from app.routers import websocket
from app.security import create_access_token, create_refresh_token

pytestmark = pytest.mark.asyncio


async def test_valid_websocket_cookie_reads_integer_id_and_delivers_notification(api, monkeypatch):
    from app.ws_manager import ConnectionManager
    client, ids = api
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        monkeypatch.setattr(websocket, "SessionLocal", async_sessionmaker(db.bind, expire_on_commit=False))
        socket = SimpleNamespace(cookies={"access_token": create_access_token(ids["admin"])},
                                 state=SimpleNamespace(), close=AsyncMock(), send_json=AsyncMock())
        user = await websocket._authenticate_websocket_user(socket)
        assert user.id == ids["admin"]
        assert socket.state.user_id == ids["admin"]
        assert isinstance(socket.state.user_id, int)
        socket.close.assert_not_awaited()
        # Объект Starlette WebSocket хешируем; SimpleNamespace — нет.
        class ProjectSocket:
            state = socket.state
            send_json = socket.send_json
        project_socket = ProjectSocket()
        manager = ConnectionManager()
        manager.rooms[ids["project"]].add(project_socket)
        payload = {"event": "notification"}
        await manager.notify_user(ids["admin"], payload)
        socket.send_json.assert_awaited_once_with(payload)


@pytest.mark.parametrize("kind", ["missing", "invalid", "refresh", "nonnumeric"])
async def test_invalid_websocket_cookie_closes_before_database_query(api, monkeypatch, kind):
    from jose import jwt
    from app.config import get_settings
    _, ids = api
    token = {"missing": None, "invalid": "bad-token", "refresh": create_refresh_token(ids["admin"]),
             "nonnumeric": jwt.encode({"sub": "not-a-number", "type": "access"}, get_settings().jwt_secret_key, algorithm="HS256")}[kind]
    socket = SimpleNamespace(cookies={"access_token": token} if token else {}, state=SimpleNamespace(), close=AsyncMock())
    def unexpected_db():
        raise AssertionError("Invalid authentication must not access the database")
    monkeypatch.setattr(websocket, "SessionLocal", unexpected_db)
    assert await websocket._authenticate_websocket_user(socket) is None
    socket.close.assert_awaited_once_with(code=4401)


@pytest.mark.parametrize("field", ["is_active", "is_locked"])
async def test_websocket_rejects_deactivated_or_locked_user(api, monkeypatch, field):
    _, ids = api
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        await db.execute(update(User).where(User.id == ids["admin"]).values(**{field: field == "is_locked"}))
        await db.commit()
        monkeypatch.setattr(websocket, "SessionLocal", async_sessionmaker(db.bind, expire_on_commit=False))
        socket = SimpleNamespace(cookies={"access_token": create_access_token(ids["admin"])}, state=SimpleNamespace(), close=AsyncMock())
        assert await websocket._authenticate_websocket_user(socket) is None
        socket.close.assert_awaited_once_with(code=4403)
