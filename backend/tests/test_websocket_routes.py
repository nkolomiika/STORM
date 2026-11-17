"""Проверки WebSocket через ASGI и FastAPI Depends, с подменой только БД."""
from contextlib import asynccontextmanager
from types import SimpleNamespace
from unittest.mock import AsyncMock

import pytest
from starlette.testclient import TestClient
from starlette.websockets import WebSocketDisconnect

from app.config import get_settings
from app.enums import UserRole
from app.main import app
from app.routers import websocket
from app.security import create_access_token
from app.ws_manager import ConnectionManager


@pytest.fixture
def websocket_client(monkeypatch):
    """Не запускает lifespan, реальную БД или внешние системы."""
    user = SimpleNamespace(id=42, role=UserRole.ADMIN, is_active=True, is_locked=False)
    db = SimpleNamespace(scalar=AsyncMock(return_value=user))

    @asynccontextmanager
    async def session():
        yield db

    manager = ConnectionManager()
    monkeypatch.setattr(websocket, 'SessionLocal', session)
    monkeypatch.setattr(websocket, 'ws_manager', manager)
    client = TestClient(app)
    try:
        yield client, manager, db
    finally:
        client.close()


@pytest.mark.parametrize('path', ['/ws/notifications', '/ws/projects-index', '/ws/projects/1'])
def test_websocket_dependencies_accept_connection_and_deliver_event(websocket_client, path):
    client, manager, db = websocket_client
    headers = {'cookie': 'access_token='+create_access_token(42),
               'origin': get_settings().csrf_origins[0]}
    with client.websocket_connect(path, headers=headers) as socket:
        socket.send_bytes(b'keepalive')
        payload = {'event': 'regression-test'}
        if path == '/ws/projects-index':
            socket.portal.call(manager.broadcast_projects_index, payload)
        else:
            socket.portal.call(manager.notify_user, 42, payload)
        assert socket.receive_json() == payload
    db.scalar.assert_awaited_once()
    assert not manager.rooms and not manager.user_sockets and not manager.projects_index_sockets


@pytest.mark.parametrize('path', ['/ws/notifications', '/ws/projects-index', '/ws/projects/1'])
def test_websocket_dependencies_do_not_bypass_authentication(websocket_client, path):
    client, _, db = websocket_client
    with pytest.raises(WebSocketDisconnect) as exc:
        with client.websocket_connect(path):
            pytest.fail('Анонимное соединение не должно приниматься')
    assert exc.value.code == 4401
    db.scalar.assert_not_awaited()


@pytest.mark.parametrize('path', ['/ws/projects/0', '/ws/projects/2147483648',
                                 '/ws/notifications?page=0', '/ws/notifications?q=%00',
                                 '/ws/notifications?'+'q'*500+'=%00'])
def test_websocket_invalid_parameters_close_without_asgi_exception(websocket_client, path):
    client, _, db = websocket_client
    with pytest.raises(WebSocketDisconnect) as exc:
        with client.websocket_connect(path):
            pytest.fail('Некорректные параметры не должны приниматься')
    assert exc.value.code == 1008
    assert len(exc.value.reason.encode('utf-8')) <= 123
    db.scalar.assert_not_awaited()


@pytest.mark.parametrize('prefix', ['/api/v1', '/api/v2'])
@pytest.mark.parametrize('suffix', ['/projects/0/hosts', '/projects/2147483648/hosts',
                                   '/projects?page=0', '/projects?q=%00'])
def test_shared_validation_preserves_http_422(websocket_client, prefix, suffix):
    client, _, db = websocket_client
    response = client.get(prefix+suffix)
    assert response.status_code == 422
    assert response.json()['detail']
    db.scalar.assert_not_awaited()
