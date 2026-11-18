"""Создание с пробивкой, права, автоматические статусы и безопасный экспорт STS."""
from contextlib import aclosing, asynccontextmanager
from datetime import date
import json
from unittest.mock import AsyncMock
from types import SimpleNamespace

import httpx
import pytest
from sqlalchemy import func, select

from app.config import get_settings
from app.database import get_db
from app.enums import ProjectStatus
from app.main import app
from app.models import AuditLog, File, Host, HostFarmJob, Project, ProjectMember
from app.project_status_sync import project_status_for_task, sync_project_statuses
from app.security import create_access_token
from app.services import AuditService, FileService
from app.task_tracker import description_text
from test_crud import checked
from test_tracker_spaces import native_tracker, EXPORT_CVSS


@pytest.mark.asyncio
@pytest.mark.parametrize("hostname,expected", [("NEW.EXAMPLE", "new.example"), ("https://new.example/api", "new.example"), ("8.8.8.8", None)])
async def test_new_host_and_probe_job_are_saved_once(api, monkeypatch, hostname, expected):
    client, ids = api
    enqueue = []
    monkeypatch.setattr("app.farm.jobs.enqueue_job", lambda job, tasks: enqueue.append(job.id))
    response = checked(await client.post(f"projects/{ids['project']}/hosts", json={"hostname": hostname, "probe": True}), 201)
    assert response["hostname"] == expected
    assert len(enqueue) == 1
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        job = await db.get(HostFarmJob, enqueue[0])
        assert job.targets_total == 1 and job.skipped_targets == [] and job.status == "pending"
        assert await db.scalar(select(func.count()).select_from(Host).where(Host.project_id == ids['project'])) == 2
        assert response['id'] != ids['host']


@pytest.mark.asyncio
async def test_host_and_probe_rollback_together_on_failed_audit(api, monkeypatch):
    client, ids = api
    monkeypatch.setattr(AuditService, "log", AsyncMock(side_effect=RuntimeError("test rollback")))
    response = await client.post(f"projects/{ids['project']}/hosts", json={"hostname": "rollback.example", "probe": True})
    assert response.status_code == 500
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        assert not await db.scalar(select(Host.id).where(Host.hostname == "rollback.example"))
        assert await db.scalar(select(func.count()).select_from(HostFarmJob)) == 0


@pytest.mark.asyncio
async def test_parallel_automatic_host_creation_reuses_host_and_job(api, monkeypatch):
    import asyncio
    client, ids = api
    enqueued = []
    monkeypatch.setattr("app.farm.jobs.enqueue_job", lambda job, tasks: enqueued.append(job.id))
    root = f"projects/{ids['project']}/hosts"
    first, second = await asyncio.gather(*(client.post(root, json={"hostname": "parallel.example", "probe": True}) for _ in range(2)))
    assert first.status_code == second.status_code == 201
    assert first.json()['id'] == second.json()['id']
    assert len(enqueued) == 1


@pytest.mark.asyncio
@pytest.mark.parametrize('hostname', ['example.com;touch /tmp/x', 'one.example\ntwo.example'])
async def test_invalid_auto_probe_never_creates_a_host_or_job(api, hostname):
    client, ids = api
    response = await client.post(f"projects/{ids['project']}/hosts", json={"hostname": hostname, "probe": True})
    assert response.status_code == 422
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        assert await db.scalar(select(func.count()).select_from(HostFarmJob)) == 0
        assert await db.scalar(select(func.count()).select_from(Host).where(Host.project_id == ids['project'])) == 1


@pytest.mark.asyncio
async def test_member_can_edit_but_not_delete_or_manage_project(api):
    client, ids = api
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        db.add(ProjectMember(project_id=ids['project'], user_id=ids['outsider']))
        await db.commit()
    client.cookies.set('access_token', create_access_token(ids['outsider']))
    root = f"projects/{ids['project']}"
    assert checked(await client.put(root, json={"name": "Member edit"}))["name"] == "Member edit"
    assert checked(await client.get(root))["name"] == "Member edit"
    assert (await client.delete(root)).status_code == 403
    assert (await client.post(root + '/members', json={"user_id": ids['admin']})).status_code == 403
    assert (await client.put(f"projects/{ids['foreign_project']}", json={"name": "IDOR"})).status_code == 403


@pytest.mark.parametrize("status,expected", [("Тестирование", "active"), ("На паузе", "freeze"),
    ("handover_to_development", "handover_to_development"), ("Перепроверка уязвимостей", "vulnerability_recheck"),
    ("Выполнен", "completed"), ("Закрыт", "archived"), ("Неизвестный статус", None)])
def test_status_mapping(status, expected):
    assert project_status_for_task({"status": status}) == expected


@pytest.mark.asyncio
async def test_appsec_status_sync_preserves_dates_and_is_idempotent(api):
    _, ids = api
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        project = await db.get(Project, ids['project'])
        project.appsec_ticket_key = 'APPSEC-1'
        project.end_date = date(2026, 11, 20)
        await db.commit()
        tasks = [{"key": "APPSEC-1", "status": "Выполнен"}, {"key": "STS-1", "status": "Закрыт"}]
        assert await sync_project_statuses(db, tasks) == 1
        await db.refresh(project)
        assert project.status == ProjectStatus.COMPLETED and project.timeline_frozen_at is not None
        assert project.end_date == date(2026, 11, 20)
        assert await sync_project_statuses(db, tasks) == 0
        assert await db.scalar(select(func.count()).select_from(AuditLog).where(AuditLog.action == 'STATUS_CHANGE')) == 1
        assert await sync_project_statuses(db, [{"key": "APPSEC-1", "status": "Неизвестный"}]) == 0
        assert await sync_project_statuses(db, [{"key": "APPSEC-1", "status": "Тестирование"}]) == 1
        await db.refresh(project)
        assert project.status == ProjectStatus.ACTIVE and project.timeline_frozen_at is None


@pytest.mark.asyncio
async def test_background_sync_preserves_status_when_tracker_is_unavailable(api, monkeypatch):
    import asyncio
    from fastapi import HTTPException
    import app.project_status_sync as sync_module
    from app.task_tracker import TaskTrackerService
    _, ids = api
    native_tracker(monkeypatch, lambda request: (_ for _ in ()).throw(AssertionError('No external I/O')))
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        project = await db.get(Project, ids['project'])
        project.appsec_ticket_key = 'APPSEC-1'
        await db.commit()
    @asynccontextmanager
    async def sessions():
        async with aclosing(app.dependency_overrides[get_db]()) as stream:
            yield await anext(stream)
    snapshot = AsyncMock(side_effect=HTTPException(502, 'Task Tracker unavailable'))
    monkeypatch.setattr(TaskTrackerService, '_snapshot', snapshot)
    monkeypatch.setattr(sync_module, 'asyncio', SimpleNamespace(CancelledError=asyncio.CancelledError,
        sleep=AsyncMock(side_effect=asyncio.CancelledError)))
    with pytest.raises(asyncio.CancelledError):
        await sync_module.project_status_sync_loop(sessions)
    assert snapshot.await_count == 1
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        assert (await db.get(Project, ids['project'])).status == ProjectStatus.ACTIVE
        assert await db.scalar(select(func.count()).select_from(AuditLog).where(AuditLog.action == 'STATUS_CHANGE')) == 0


@pytest.mark.asyncio
async def test_background_sync_fetches_linked_card_missing_from_search(api, monkeypatch):
    import asyncio
    import app.project_status_sync as sync_module
    from app.task_tracker import TaskTrackerService
    _, ids = api
    native_tracker(monkeypatch, lambda request: (_ for _ in ()).throw(AssertionError('No external I/O')))
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        (await db.get(Project, ids['project'])).appsec_ticket_key = 'APPSEC-1'
        await db.commit()
    @asynccontextmanager
    async def sessions():
        async with aclosing(app.dependency_overrides[get_db]()) as stream:
            yield await anext(stream)
    monkeypatch.setattr(TaskTrackerService, '_snapshot', AsyncMock(return_value=[]))
    card = AsyncMock(return_value={"key": "APPSEC-1", "status": "Выполнен"})
    monkeypatch.setattr(TaskTrackerService, 'get_task', card)
    monkeypatch.setattr(sync_module, 'asyncio', SimpleNamespace(CancelledError=asyncio.CancelledError,
        Semaphore=asyncio.Semaphore, gather=asyncio.gather, sleep=AsyncMock(side_effect=asyncio.CancelledError)))
    with pytest.raises(asyncio.CancelledError):
        await sync_module.project_status_sync_loop(sessions)
    card.assert_awaited_once_with('APPSEC-1')
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        assert (await db.get(Project, ids['project'])).status == ProjectStatus.COMPLETED


@pytest.mark.asyncio
@pytest.mark.parametrize('kind,point', [('szi', '4.6.1.1'), ('pp', '3.4.1')])
async def test_sts_description_only_contains_report_reference_and_list_returns_link(api, monkeypatch, kind, point):
    client, ids = api
    calls = []
    def handler(request):
        body = json.loads(request.content)
        calls.append((request.url.path, body))
        if request.url.path.endswith('/bug_appsec/create'):
            return httpx.Response(200, json={'id': 'STS-700'})
        assert request.url.path.endswith('/link')
        return httpx.Response(200, json={})
    native_tracker(monkeypatch, handler)
    monkeypatch.setattr(get_settings(), 'works_report_kind', kind)
    monkeypatch.setattr(FileService, 'list', AsyncMock(side_effect=AssertionError('No attachment listing')))
    monkeypatch.setattr(FileService, 'download', AsyncMock(side_effect=AssertionError('No attachment downloads')))
    root = f"projects/{ids['project']}"
    checked(await client.put(root, json={'end_date': '2026-11-20', 'appsec_ticket_key': 'APPSEC-7', 'appsec_assignee': 'analyst',
        'appsec_product_code': 'evp', 'appsec_components': [{'code': 'uuid1', 'name': 'EVPC'}, {'code': 'uuid2', 'name': 'SECOND'}],
        'appsec_versions': [{'code': 'v1', 'name': 'Platform 1.0'}]}))
    checked(await client.post(root+'/vulnerabilities', json={'title': 'Main', 'host_id': ids['host'], **EXPORT_CVSS}), 201)
    zero = EXPORT_CVSS['cvss_vector'].replace('VC:H/VI:H/VA:H', 'VC:N/VI:N/VA:N')
    finding = checked(await client.post(root+'/vulnerabilities', json={'title': 'Info', 'host_id': ids['host'],
        'description': 'PRIVATE DESCRIPTION', 'impact': 'PRIVATE IMPACT', 'recommendations': 'PRIVATE REMEDIATION',
        'cvss_version': '4.0', 'cvss_vector': zero}), 201)
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        db.add(File(vulnerability_id=finding['id'], original_name='private-evidence.txt', content_type='text/plain',
                    size_bytes=10, minio_bucket='test', minio_key='private-evidence', uploaded_by=ids['admin']))
        await db.commit()
    exported = checked(await client.post(root+f"/vulnerabilities/{finding['id']}/works/export", json={}))
    creation = calls[0][1]
    assert description_text(creation['description']) == (
        'Провести анализ и устранить уязвимость SA-EVPC-201126/02, выявленную в ходе проведения анализа защищенности.\n'
        'Информация по уязвимости отправлена в почту ВП.\n'
        f'Пункт в отчете - {point}')
    assert creation['draftsInfo'] == []
    items = checked(await client.get(root+'/vulnerabilities'))['items']
    linked = next(item for item in items if item['id'] == finding['id'])
    assert linked['task_tracker_issue_url'] == exported['works_url']
    detail = checked(await client.get(root+f"/vulnerabilities/{finding['id']}"))
    assert detail['task_tracker_issue_key'] == 'STS-700'
    assert len(calls) == 2


@pytest.mark.asyncio
async def test_missing_finish_date_blocks_sts_before_network(api, monkeypatch):
    client, ids = api
    native_tracker(monkeypatch, lambda request: (_ for _ in ()).throw(AssertionError('Missing date must block HTTP')))
    root = f"projects/{ids['project']}"
    checked(await client.put(root, json={'appsec_ticket_key': 'APPSEC-7', 'appsec_assignee': 'analyst', 'appsec_product_code': 'evp',
        'appsec_components': [{'code': 'c1', 'name': 'EVPC'}], 'appsec_versions': [{'code': 'v1', 'name': 'Platform 1.0'}]}))
    finding = checked(await client.post(root+'/vulnerabilities', json={'title': 'Main', 'host_id': ids['host'], **EXPORT_CVSS}), 201)
    response = await client.post(root+f"/vulnerabilities/{finding['id']}/works/export", json={})
    assert response.status_code == 422
    assert 'дату окончания работ' in response.json()['detail']
    assert response.json()['request_id']
