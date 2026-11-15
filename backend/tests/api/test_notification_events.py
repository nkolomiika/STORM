from contextlib import aclosing
from datetime import date, timedelta
from unittest.mock import AsyncMock

import pytest
from sqlalchemy import func, select

from app.database import get_db
from app.enums import NotificationType, ProjectStatus
from app.main import app
from app.models import Notification, Project, ProjectMember, User
from app.notification_events import generate_deadline_notifications
from app.security import create_access_token
from app.ws_manager import ws_manager

pytestmark = pytest.mark.asyncio


async def add_recipient(api, username='Иван Иванов'):
    client, ids = api
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        (await db.get(User, ids['outsider'])).username = username
        await db.commit()
    response = await client.post(f"projects/{ids['project']}/members", json={'user_id':ids['outsider']})
    assert response.status_code == 201, response.text
    return username


async def recipient_events(api, kind='mention'):
    client, ids = api
    client.cookies.clear()
    client.cookies.set('access_token', create_access_token(ids['outsider']))
    response = await client.get('notifications')
    assert response.status_code == 200, response.text
    return [item for item in response.json()['items'] if item['type'] == kind]


@pytest.mark.parametrize('kind', ['comment', 'note_comment', 'endpoint_comment', 'note', 'finding', 'host', 'endpoint'])
async def test_unicode_mention_in_all_narrative_surfaces_is_delivered(api, kind, monkeypatch):
    client, ids = api
    username = await add_recipient(api)
    delivery = AsyncMock()
    monkeypatch.setattr(ws_manager, 'notify_user', delivery)
    project = ids['project']
    text = f'@{username}, проверь результат'
    if kind == 'comment':
        created = await client.post(f'projects/{project}/vulnerabilities', json={'title':'Mention target','host_id':ids['host']})
        url = f"projects/{project}/vulnerabilities/{created.json()['id']}/comments"
        response = await client.post(url, json={'content':text})
    elif kind in {'note', 'note_comment'}:
        created = await client.post(f'projects/{project}/notes', json={'title':'Mention target','content':text if kind=='note' else ''})
        response = created if kind=='note' else await client.post(f"projects/{project}/notes/{created.json()['id']}/comments", json={'content':text})
    elif kind == 'endpoint_comment':
        created = await client.post(f"projects/{project}/hosts/{ids['host']}/endpoints", json={'path':'/mentions','method':'GET'})
        response = await client.post(f"projects/{project}/hosts/{ids['host']}/endpoints/{created.json()['id']}/comments", json={'content':text})
    elif kind == 'host':
        response = await client.put(f"projects/{project}/hosts/{ids['host']}", json={'notes':text})
    elif kind == 'endpoint':
        response = await client.post(f"projects/{project}/hosts/{ids['host']}/endpoints", json={'path':'/mentioned-description','method':'GET','description':text})
    elif kind == 'finding':
        response = await client.post(f'projects/{project}/vulnerabilities', json={'title':'Mention target','host_id':ids['host'],'description':text})
    assert response.status_code in (200, 201), response.text
    delivery.assert_awaited()
    notifications = await recipient_events(api)
    assert len(notifications) == 1, notifications
    assert notifications[0]['context']['project_id'] == project
    assert notifications[0]['context']['commenter_username'] == 'tester'
    if kind == 'endpoint_comment':
        assert notifications[0]['context']['endpoint_path'] == '/mentions'
        assert notifications[0]['context']['host_id'] == ids['host']


@pytest.mark.parametrize('kind', ['comment', 'note_comment', 'note', 'finding'])
async def test_adding_tag_while_editing_notifies_once(api, kind):
    client, ids = api
    await add_recipient(api, 'recipient')
    project = ids['project']
    if kind == 'comment':
        finding = (await client.post(f'projects/{project}/vulnerabilities', json={'title':'Edit','host_id':ids['host']})).json()['id']
        root = f'projects/{project}/vulnerabilities/{finding}/comments'
        item = (await client.post(root, json={'content':'Before'})).json()['id']
        url, field = f'{root}/{item}', 'content'
    elif kind == 'note_comment':
        note = (await client.post(f'projects/{project}/notes', json={'title':'Edit'})).json()['id']
        root = f'projects/{project}/notes/{note}/comments'
        item = (await client.post(root, json={'content':'Before'})).json()['id']
        url, field = f'{root}/{item}', 'content'
    elif kind == 'note':
        item = (await client.post(f'projects/{project}/notes', json={'title':'Edit'})).json()['id']
        url, field = f'projects/{project}/notes/{item}', 'content'
    elif kind == 'finding':
        item = (await client.post(f'projects/{project}/vulnerabilities', json={'title':'Edit','host_id':ids['host']})).json()['id']
        url, field = f'projects/{project}/vulnerabilities/{item}', 'description'
    for text in ['Please @recipient review', 'Please @recipient review again']:
        response = await client.put(url, json={field:text})
        assert response.status_code == 200, response.text
    assert len(await recipient_events(api)) == 1


@pytest.mark.parametrize('state', ['not_member', 'locked', 'inactive', 'email'])
async def test_ineligible_users_and_email_addresses_do_not_receive_mentions(api, state):
    client, ids = api
    if state != 'not_member':
        await add_recipient(api, 'recipient')
    if state in {'locked', 'inactive'}:
        async with aclosing(app.dependency_overrides[get_db]()) as stream:
            db = await anext(stream)
            user = await db.get(User, ids['outsider'])
            if state=='locked': user.is_locked=True
            else: user.is_active=False
            await db.commit()
    text = 'email@recipient.example' if state=='email' else '@outsider' if state=='not_member' else '@recipient'
    response = await client.post(f"projects/{ids['project']}/notes", json={'title':'No unwanted mention','content':text})
    assert response.status_code == 201, response.text
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        assert await db.scalar(select(func.count()).select_from(Notification).where(Notification.type==NotificationType.MENTION)) == 0


@pytest.mark.parametrize('days,status,expected', [(2,ProjectStatus.ACTIVE,1),(1,ProjectStatus.FREEZE,1),(0,ProjectStatus.ACTIVE,1),(3,ProjectStatus.ACTIVE,0),(-1,ProjectStatus.ACTIVE,0),(2,ProjectStatus.ARCHIVED,0),(2,ProjectStatus.COMPLETED,0)])
async def test_deadlines_are_scoped_and_duplicate_safe(api, days, status, expected):
    _, ids = api
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        project = await db.get(Project, ids['project'])
        project.end_date = date(2026, 11, 14)+timedelta(days=days)
        project.status = status
        db.add(ProjectMember(project_id=project.id, user_id=ids['outsider']))
        await db.commit()
        first = await generate_deadline_notifications(db, date(2026,11,14))
        await db.commit()
        assert len(first) == expected
        assert await generate_deadline_notifications(db, date(2026,11,14)) == []
        await db.commit()
        assert await db.scalar(select(func.count()).select_from(Notification).where(Notification.type==NotificationType.PROJECT_DEADLINE)) == expected
        if expected:
            assert first[0].user_id == ids['outsider']
            assert first[0].context_data['deadline_date'] == project.end_date.isoformat()


@pytest.mark.parametrize('flag,value', [('is_active',False),('is_locked',True)])
async def test_deadline_skips_disabled_members(api, flag, value):
    _, ids = api
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        project = await db.get(Project,ids['project'])
        project.end_date = date(2026,11,16)
        setattr(await db.get(User,ids['outsider']),flag,value)
        db.add(ProjectMember(project_id=project.id,user_id=ids['outsider']))
        await db.commit()
        assert await generate_deadline_notifications(db,date(2026,11,14)) == []


async def test_concurrent_deadline_sweeps_create_only_one_reminder(api):
    import asyncio
    _,ids=api
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db=await anext(stream)
        (await db.get(Project,ids['project'])).end_date=date(2026,11,16)
        db.add(ProjectMember(project_id=ids['project'],user_id=ids['outsider']))
        await db.commit()
    async def run():
        async with aclosing(app.dependency_overrides[get_db]()) as stream:
            db=await anext(stream)
            events=await generate_deadline_notifications(db,date(2026,11,14))
            await db.commit()
            return len(events)
    assert sum(await asyncio.gather(run(),run()))==1


async def test_failed_note_audit_rolls_back_mention_and_does_not_deliver(api,monkeypatch):
    from sqlalchemy import event
    client,ids=api
    await add_recipient(api,'recipient')
    delivery=AsyncMock()
    monkeypatch.setattr(ws_manager,'notify_user',delivery)
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db=await anext(stream)
        engine=db.bind.sync_engine
        def fail(conn,cursor,statement,parameters,context,executemany):
            if statement.startswith('INSERT INTO audit_logs'):raise RuntimeError('Audit failed')
        event.listen(engine,'before_cursor_execute',fail)
        try:
            response=await client.post(f"projects/{ids['project']}/notes",json={'title':'Rollback tag','content':'@recipient review'})
        finally:event.remove(engine,'before_cursor_execute',fail)
        assert response.status_code==500
        assert await db.scalar(select(func.count()).select_from(Notification).where(Notification.type==NotificationType.MENTION))==0
        delivery.assert_not_awaited()
