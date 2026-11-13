"""Рассылка выдерживает отключение клиентов во время await send_json."""
import asyncio
from types import SimpleNamespace

import pytest

from app.ws_manager import ConnectionManager


class Socket:
    def __init__(self, user_id=42, on_send=None, fail=False):
        self.state = SimpleNamespace(user_id=user_id)
        self.on_send = on_send
        self.fail = fail
        self.messages = []

    async def send_json(self, payload):
        await asyncio.sleep(0)
        if self.on_send:
            self.on_send(self)
        if self.fail:
            raise RuntimeError("Connection closed")
        self.messages.append(payload)


@pytest.mark.asyncio
@pytest.mark.parametrize("channel", ["project", "user", "notification_project"])
async def test_disconnect_during_send_does_not_abort_broadcast(channel):
    manager = ConnectionManager()
    if channel == "user":
        remove = lambda socket: manager.disconnect_user(42, socket)
        sockets = manager.user_sockets[42]
    else:
        remove = lambda socket: manager.disconnect(1, socket)
        sockets = manager.rooms[1]
    first, second = Socket(on_send=remove), Socket(on_send=remove)
    sockets.update([first, second])
    payload = {"event": "updated"}
    if channel == "project":
        await manager.broadcast(1, payload)
    else:
        await manager.notify_user(42, payload)
    assert first.messages == second.messages == [payload]
    assert not manager.rooms and not manager.user_sockets


@pytest.mark.asyncio
@pytest.mark.parametrize("channel", ["project", "user"])
async def test_closed_socket_is_removed_without_skipping_healthy_client(channel):
    manager = ConnectionManager()
    good, closed = Socket(), Socket(fail=True)
    sockets = manager.rooms[1] if channel == "project" else manager.user_sockets[42]
    sockets.update([good, closed])
    payload = {"event": "notification"}
    if channel == "project":
        await manager.broadcast(1, payload)
        assert manager.rooms[1] == {good}
    else:
        await manager.notify_user(42, payload)
        assert manager.user_sockets[42] == {good}
    assert good.messages == [payload]
