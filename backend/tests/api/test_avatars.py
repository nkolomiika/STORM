"""Настоящий HTTP/БД аватара, локальный транспорт хранилища заменён на in-memory."""
from contextlib import aclosing
from io import BytesIO
from unittest.mock import Mock
from uuid import uuid4
from datetime import UTC, datetime

from PIL import Image
from minio.error import S3Error
import pytest

from app.database import get_db
from app.main import app
from app.enums import NotificationType
from app.models import Notification, ProjectMember, User
from app.security import create_access_token
from app.storage.minio_client import MinioStorage

pytestmark = pytest.mark.asyncio


def picture(kind='PNG'):
    data = BytesIO()
    Image.new('RGB', (16, 16), 'blue').save(data, format=kind)
    return data.getvalue()


async def old_avatar(ids):
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        (await db.get(User, ids['admin'])).avatar_minio_key = 'old-avatar'
        await db.commit()


@pytest.mark.parametrize('kind', ['PNG', 'JPEG', 'WEBP', 'GIF'])
async def test_valid_avatar_upload_and_download(api, monkeypatch, kind):
    client, ids = api
    content = picture(kind)
    uploaded = Mock(return_value='new-avatar')
    monkeypatch.setattr(MinioStorage, 'ensure_bucket', lambda self: None)
    monkeypatch.setattr(MinioStorage, 'upload_bytes', uploaded)
    monkeypatch.setattr(MinioStorage, 'download_bytes', lambda self, key: content)
    response = await client.post('users/me/avatar', files={'avatar': ('photo.bin', content, 'application/octet-stream')})
    assert response.status_code == 200, response.text
    assert response.json()['avatar_url'].startswith(f"/api/v1/users/{ids['admin']}/avatar?v=")
    mime = uploaded.call_args.args[1]
    assert mime.startswith('image/')
    downloaded = await client.get('https://test.local'+response.json()['avatar_url'])
    assert downloaded.status_code == 200 and downloaded.content == content
    assert downloaded.headers['content-type'].startswith(mime)


@pytest.mark.parametrize('content', [b'', b'<svg onload="alert(1)"></svg>', b'not-png', b'\x89PNG\r\n\x1a\nbroken'])
async def test_invalid_avatar_is_422_before_storage(api, content):
    client, _ = api
    response = await client.post('users/me/avatar', files={'avatar': ('photo.png', content, 'image/png')})
    assert response.status_code == 422, response.text
    assert response.json()['code'] == 'validation_error' and response.json()['request_id']


@pytest.mark.parametrize('stage', ['ensure_bucket', 'upload_bytes'])
async def test_storage_failure_is_controlled_and_keeps_previous_avatar(api, monkeypatch, stage):
    client, ids = api
    await old_avatar(ids)
    monkeypatch.setattr(MinioStorage, 'ensure_bucket', lambda self: None)
    def failure(*args):
        raise OSError('private storage diagnostic password=secret')
    monkeypatch.setattr(MinioStorage, stage, failure)
    response = await client.post('users/me/avatar', files={'avatar': ('photo.png', picture(), 'image/png')})
    assert response.status_code == 503, response.text
    assert response.json()['code'] == 'storage_unavailable'
    assert 'private' not in response.text and 'secret' not in response.text
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        assert (await (await anext(stream)).get(User, ids['admin'])).avatar_minio_key == 'old-avatar'


async def test_old_avatar_cleanup_failure_does_not_break_new_avatar(api, monkeypatch):
    client, ids = api
    await old_avatar(ids)
    monkeypatch.setattr(MinioStorage, 'ensure_bucket', lambda self: None)
    monkeypatch.setattr(MinioStorage, 'upload_bytes', lambda *args: 'new-avatar')
    def failure(*args):
        raise OSError('old object cleanup failed')
    monkeypatch.setattr(MinioStorage, 'delete', failure)
    response = await client.post('users/me/avatar', files={'avatar': ('photo.png', picture(), 'image/png')})
    assert response.status_code == 200, response.text
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        assert (await (await anext(stream)).get(User, ids['admin'])).avatar_minio_key == 'new-avatar'


@pytest.mark.parametrize('stage', ['ensure_bucket', 'upload_bytes_with_key'])
async def test_note_image_storage_failure_returns_safe_503(api, monkeypatch, stage):
    client, ids = api
    monkeypatch.setattr(MinioStorage, 'ensure_bucket', lambda self: None)
    def failure(*args):
        raise OSError('private storage diagnostic password=secret')
    monkeypatch.setattr(MinioStorage, stage, failure)
    response = await client.post(f"projects/{ids['project']}/images", files={'file': ('shot.png', picture(), 'image/png')})
    assert response.status_code == 503, response.text
    assert response.json()['code'] == 'storage_unavailable' and response.json()['request_id']
    assert 'private' not in response.text and 'secret' not in response.text


@pytest.mark.parametrize('code,status', [('NoSuchKey', 404), ('AccessDenied', 503), ('ServiceUnavailable', 503)])
async def test_note_image_missing_object_and_storage_outage_are_distinct(api, monkeypatch, code, status):
    client, ids = api
    def failure(*args):
        raise S3Error(code, 'private storage error', '', '', '', None)
    monkeypatch.setattr(MinioStorage, 'download_with_content_type', failure)
    response = await client.get(f"projects/{ids['project']}/images/{uuid4()}.png/download")
    assert response.status_code == status, response.text
    assert response.json()['request_id'] and 'private' not in response.text


async def test_user_and_project_member_lists_expose_the_same_protected_avatar(api):
    client, ids = api
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        user = await db.get(User, ids['outsider'])
        user.avatar_minio_key = 'test-avatar-key'
        user.avatar_uploaded_at = datetime.now(UTC)
        db.add(ProjectMember(project_id=ids['project'], user_id=user.id))
        await db.commit()
        url = user.avatar_url
    listing = await client.get('users')
    assert listing.status_code == 200, listing.text
    assert next(user for user in listing.json()['items'] if user['id'] == ids['outsider'])['avatar_url'] == url
    members = await client.get(f"projects/{ids['project']}/members")
    assert members.status_code == 200, members.text
    assert next(user for user in members.json() if user['user_id'] == ids['outsider'])['avatar_url'] == url
    client.cookies.clear()
    assert (await client.get('https://test.local'+url)).status_code == 401


async def test_actor_avatar_visible_to_recipient_until_owner_removes_it(api, monkeypatch):
    client, ids = api
    await old_avatar(ids)
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        db.add(Notification(user_id=ids['outsider'], actor_id=ids['admin'], project_id=ids['project'],
                            type=NotificationType.MENTION, context_data={'project_id': ids['project'], 'endpoint_path': '/example'}))
        await db.commit()
    image = picture()
    monkeypatch.setattr(MinioStorage, 'download_bytes', lambda self, key: image)
    remove = Mock()
    monkeypatch.setattr(MinioStorage, 'delete', remove)
    client.cookies.set('access_token', create_access_token(ids['outsider']))
    event = (await client.get('notifications')).json()['items'][0]['context']
    assert event['commenter_username'] == 'tester' and event['endpoint_path'] == '/example'
    url = 'https://test.local' + event['actor_avatar_url']
    assert (await client.get(url)).content == image
    assert (await client.delete(f"users/{ids['admin']}/avatar")).status_code == 405
    assert (await client.delete('users/me/avatar')).json()['avatar_url'] is None
    remove.assert_not_called()

    client.cookies.set('access_token', create_access_token(ids['admin']))
    for _ in range(2):
        deleted = await client.delete('users/me/avatar')
        assert deleted.status_code == 200 and deleted.json()['avatar_url'] is None
    remove.assert_called_once_with('old-avatar')
    client.cookies.set('access_token', create_access_token(ids['outsider']))
    assert (await client.get(url)).status_code == 404
    event = (await client.get('notifications')).json()['items'][0]['context']
    assert event['actor_avatar_url'] is None and event['commenter_username'] == 'tester'


async def test_avatar_delete_storage_failure_preserves_photo_for_retry(api, monkeypatch):
    client, ids = api
    await old_avatar(ids)
    remove = Mock(side_effect=[OSError('internal storage detail'), None])
    monkeypatch.setattr(MinioStorage, 'delete', remove)
    failed = await client.delete('users/me/avatar')
    assert failed.status_code == 503 and failed.json()['code'] == 'storage_unavailable'
    assert 'internal storage detail' not in failed.text
    assert (await client.get('users/me')).json()['avatar_url']
    assert (await client.delete('users/me/avatar')).json()['avatar_url'] is None


async def test_seeded_preview_user_is_serializable_and_repeatable(api, monkeypatch):
    from scripts.seed_ui_demo import seed_preview_user
    from sqlalchemy import func, select
    client, ids = api
    monkeypatch.setattr(MinioStorage, 'ensure_bucket', lambda *args: None)
    upload = Mock(return_value='demo-avatar-key')
    monkeypatch.setattr(MinioStorage, 'upload_bytes', upload)
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        for _ in range(2):
            await seed_preview_user(db, MinioStorage(), ids['project'])
            await db.commit()
        assert await db.scalar(select(func.count()).select_from(User).where(User.username == 'demo.avatar')) == 1
    upload.assert_called_once()
    response = await client.get('users')
    assert response.status_code == 200, response.text
    user = next(user for user in response.json()['items'] if user['username'] == 'demo.avatar')
    assert user['avatar_url'] and user['email'] == 'demo.avatar@example.com'
