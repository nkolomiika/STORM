from contextlib import aclosing
from io import BytesIO
from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock

import pytest
from PIL import Image
from sqlalchemy import select

from app.auth_limits import auth_attempts
from app.database import get_db
from app.main import app
from app.models import File, ProjectCredential
from app.security import create_access_token
from app.services import FileService

pytestmark = pytest.mark.asyncio


async def test_login_is_rate_limited_before_an_unbounded_password_bruteforce(api, monkeypatch):
    client, _ = api
    monkeypatch.setattr(auth_attempts, "limit", 2)
    for _ in range(2):
        assert (await client.post("auth/login", json={"username": "missing", "password": "wrong"})).status_code == 401
    blocked = await client.post("auth/login", json={"username": "missing", "password": "wrong"})
    assert blocked.status_code == 429 and int(blocked.headers["Retry-After"]) > 0


async def test_credentials_are_encrypted_and_not_copied_into_audit(api):
    from app.models import AuditLog
    client, ids = api
    secret = "secret-value-do-not-log"
    response = await client.post(f"projects/{ids['project']}/credentials", json={"username": "user", "password": secret})
    assert response.status_code == 201 and response.json()["password"] == secret
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        row = await db.get(ProjectCredential, response.json()["id"])
        assert secret not in row.password_encrypted
        log = await db.scalar(select(AuditLog).where(AuditLog.entity_type == "project_credential", AuditLog.entity_id == row.id))
        assert secret not in str(log.details)
    client.cookies.clear()
    client.cookies.set("access_token", create_access_token(ids["outsider"]))
    assert (await client.get(f"projects/{ids['project']}/credentials")).status_code == 403


async def test_foreign_file_download_is_denied_before_reading_storage(api, monkeypatch):
    from app.routers import files
    client, ids = api
    storage = MagicMock()
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        row = File(vulnerability_id=ids["foreign_vuln"], original_name="proof.txt", content_type="text/plain", size_bytes=1, minio_bucket="test", minio_key="proof", uploaded_by=ids["admin"])
        db.add(row)
        await db.commit()
        file_id = row.id
    monkeypatch.setattr(files, "FileService", lambda db: FileService(db, storage=storage))
    client.cookies.clear()
    client.cookies.set("access_token", create_access_token(ids["outsider"]))
    result = await client.get(f"files/{file_id}/download")
    assert result.status_code == 403
    storage.download_bytes.assert_not_called()
    storage.ensure_bucket.assert_not_called()


@pytest.mark.parametrize("content", [b"<script>alert(1)</script>", b"not an image", b""])
async def test_spoofed_image_mime_is_rejected_before_storage(api, content):
    client, ids = api
    result = await client.post(f"projects/{ids['project']}/images", files={"file": ("proof.png", content, "image/png")})
    assert result.status_code == 422, result.text


async def test_valid_image_uses_detected_mime_and_nosniff(api, monkeypatch):
    from app.routers import images
    client, ids = api
    blob = BytesIO()
    Image.new("RGB", (2, 2)).save(blob, format="PNG")
    storage = MagicMock()
    storage.download_with_content_type.return_value = (blob.getvalue(), "image/png")
    monkeypatch.setattr(images, "MinioStorage", lambda: storage)
    # Declared MIME is deliberately wrong; the stored type comes from bytes.
    result = await client.post(f"projects/{ids['project']}/images", files={"file": ("proof.jpg", blob.getvalue(), "image/jpeg")})
    assert result.status_code == 201, result.text
    stored = storage.upload_bytes_with_key.call_args.args
    assert stored[0].endswith(".png") and stored[2] == "image/png"
    response = await client.get("https://test.local" + result.json()["url"])
    assert response.status_code == 200 and response.headers["x-content-type-options"] == "nosniff"


@pytest.mark.parametrize("origin", ["null", "https://localhost.evil", "https://evil.example"])
async def test_untrusted_origins_cannot_mutate_with_cookies(api, origin):
    client, _ = api
    result = await client.post("projects", json={"name": "Forbidden"}, headers={"Origin": origin})
    assert result.status_code == 403


@pytest.mark.parametrize("origin", ["null", "https://evil.example", "https://localhost.evil"])
async def test_websocket_rejects_foreign_origin_before_database_lookup(api, monkeypatch, origin):
    from app.routers import websocket
    _, ids = api
    def unexpected_db():
        raise AssertionError("Foreign WebSocket must be rejected before DB access")
    monkeypatch.setattr(websocket, "SessionLocal", unexpected_db)
    socket = SimpleNamespace(headers={"origin": origin}, cookies={"access_token": create_access_token(ids["admin"])}, close=AsyncMock())
    assert await websocket._authenticate_websocket_user(socket) is None
    socket.close.assert_awaited_once_with(code=4403)


async def test_sso_username_collision_cannot_take_over_local_admin(api, monkeypatch):
    from app.config import get_settings
    from app.oidc import OidcIdentity
    from app.services import AuthService
    from app.enums import UserRole
    _, ids = api
    monkeypatch.setattr(get_settings(), "sso_auto_create_users", True)
    monkeypatch.setattr(get_settings(), "sso_default_role", "pentester")
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        identity = OidcIdentity(subject="another-person", email="another@example.com", username="tester", full_name="Another person", email_verified=True)
        _, _, user = await AuthService(db).login_via_sso(identity)
        assert user.id != ids["admin"] and user.role == UserRole.PENTESTER


async def test_unverified_sso_email_cannot_access_existing_account(api):
    from app.exceptions import UnauthorizedError
    from app.oidc import OidcIdentity
    from app.services import AuthService
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        identity = OidcIdentity(subject="unverified", email="tester@example.com", username="tester", full_name=None)
        with pytest.raises(UnauthorizedError, match="подтверждённый email"):
            await AuthService(db).login_via_sso(identity)


@pytest.mark.parametrize("endpoint", ["projects_index_ws", "notifications_ws", "project_ws"])
async def test_binary_websocket_frames_do_not_crash_or_leave_stale_connections(monkeypatch, endpoint):
    from app.routers import websocket
    from app.ws_manager import ConnectionManager
    from app.enums import UserRole
    manager = ConnectionManager()
    monkeypatch.setattr(websocket, "ws_manager", manager)
    monkeypatch.setattr(websocket, "_authenticate_websocket_user", AsyncMock(return_value=SimpleNamespace(id=1, role=UserRole.ADMIN)))
    class Socket:
        accept = AsyncMock()
        receive = AsyncMock(side_effect=[{"type": "websocket.receive", "bytes": b"\xff\x00"}, {"type": "websocket.disconnect", "code": 1000}])
    socket = Socket()
    function = getattr(websocket, endpoint)
    if endpoint == "project_ws":
        await function(socket, 1)
    else:
        await function(socket)
    assert not manager.rooms and not manager.user_sockets and not manager.projects_index_sockets


@pytest.mark.parametrize("project_id", [-1, 0, 2**31, 10**100])
async def test_websocket_project_ids_are_bounded_before_database_access(monkeypatch, project_id):
    from app.routers import websocket
    authenticate = AsyncMock()
    monkeypatch.setattr(websocket, "_authenticate_websocket_user", authenticate)
    socket = SimpleNamespace(close=AsyncMock())
    await websocket.project_ws(socket, project_id)
    socket.close.assert_awaited_once_with(code=4404)
    authenticate.assert_not_awaited()
