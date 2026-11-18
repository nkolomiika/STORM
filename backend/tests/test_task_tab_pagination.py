"""Порция содержит 20 тикетов выбранной вкладки, а не 20 смешанных тикетов."""
import asyncio
from datetime import UTC, datetime, timedelta
from types import SimpleNamespace
from unittest.mock import AsyncMock

from fastapi import HTTPException
import pytest

from app.config import get_settings
from app.task_tracker import TaskTrackerService, is_closed_task, task_out


def unit(index):
    closed = index % 2 == 1
    status = 'Paused' if closed and index % 5 == 0 else 'Resolved' if closed else 'Open'
    return {'code': f'APPSEC-{index+1}', 'summary': f'Ticket {index+1}',
            'updatedAt': (datetime(2026, 1, 1, tzinfo=UTC)+timedelta(hours=index)).isoformat(),
            'attributes': {'workflow_status': {'name': status}}}


@pytest.mark.asyncio
async def test_selected_tab_paginates_after_filtering_and_reports_its_own_total(monkeypatch):
    monkeypatch.setattr(TaskTrackerService, '_snapshot', AsyncMock(return_value=[task_out(unit(i)) for i in range(90)]))
    service = TaskTrackerService()
    for category in ['active', 'closed']:
        pages = [await service.list_tasks(category=category, page=page) for page in range(3)]
        assert [len(page['items']) for page in pages] == [20, 20, 5]
        assert all(page['total'] == 45 and page['active_total'] == 45 and page['closed_total'] == 45 for page in pages)
        assert [page['next_page_token'] for page in pages] == ['1', '2', None]
        assert all(is_closed_task(task) == (category == 'closed') for page in pages for task in page['items'])
        assert len({task['key'] for page in pages for task in page['items']}) == 45


@pytest.mark.asyncio
async def test_search_and_sort_are_applied_before_the_page_limit(monkeypatch):
    items = [task_out(unit(i)) for i in range(90)]
    for item in items[30:]:
        item['summary'] = 'API assessment'
    monkeypatch.setattr(TaskTrackerService, '_snapshot', AsyncMock(return_value=items))
    result = await TaskTrackerService().list_tasks(category='active', query='api', sort='first')
    assert len(result['items']) == 20 and result['total'] == 30
    assert result['active_total'] == 30 and result['closed_total'] == 30
    assert result['items'][0]['key'] == 'APPSEC-31'


@pytest.mark.asyncio
async def test_snapshot_is_shared_between_tabs_bounded_in_parallel_and_invalidated(monkeypatch):
    requests = []
    active = peak = 0
    async def request(self, *, page=0, page_size=20, **kwargs):
        nonlocal active, peak
        requests.append((page, page_size))
        active += 1
        peak = max(peak, active)
        await asyncio.sleep(0)
        active -= 1
        return {'content': [unit(i) for i in range(page*page_size, min((page+1)*page_size, 550))],
                'totalElements': 550, 'hasNext': (page+1)*page_size < 550}
    monkeypatch.setattr(TaskTrackerService, '_request', request)
    clock = [100]
    monkeypatch.setattr('app.task_tracker.time', SimpleNamespace(monotonic=lambda: clock[0]))
    service = TaskTrackerService()
    first, closed = await asyncio.gather(service.list_tasks(category='active'), service.list_tasks(category='closed'))
    assert len(requests) == 6 and peak <= 4
    assert first['total'] == 275 and closed['total'] == 275
    first['items'][0]['project_id'] = 123
    fresh = await service.list_tasks(category='active')
    assert 'project_id' not in fresh['items'][0]
    assert len(requests) == 6
    await service.list_tasks(category='active', refresh=True)
    assert len(requests) == 12
    clock[0] += 61
    await service.list_tasks(category='active')
    assert len(requests) == 18
    monkeypatch.setattr(get_settings(), 'works_api_token', 'another-test-only-token')
    await service.list_tasks(category='closed')
    assert len(requests) == 24


@pytest.mark.asyncio
async def test_snapshot_does_not_cache_failures_or_accept_infinite_repeated_pages(monkeypatch):
    request = AsyncMock(return_value={'content': [unit(i) for i in range(100)], 'hasNext': True})
    monkeypatch.setattr(TaskTrackerService, '_request', request)
    for _ in range(2):
        with pytest.raises(HTTPException, match='не переключает страницы'):
            await TaskTrackerService().list_tasks(category='active')
    assert request.await_count == 4


@pytest.mark.asyncio
async def test_snapshot_stops_before_fetching_unbounded_native_results(monkeypatch):
    request = AsyncMock(return_value={'content': [unit(0)], 'hasNext': True, 'totalElements': 20_001})
    monkeypatch.setattr(TaskTrackerService, '_request', request)
    with pytest.raises(HTTPException, match='Слишком много'):
        await TaskTrackerService().list_tasks(category='active')
    request.assert_awaited_once()


@pytest.mark.asyncio
async def test_strict_tql_page_size_falls_back_to_confirmed_twenty(monkeypatch):
    from app.exceptions import UpstreamServiceError
    from app.works import WorksError
    calls = []
    async def request(self, *, page=0, page_size=20, **kwargs):
        calls.append((page, page_size))
        if page_size > 20:
            raise UpstreamServiceError('Safe error') from WorksError('Safe error', status_code=422)
        return {'content': [unit(i) for i in range(page*20, min((page+1)*20, 45))],
                'totalElements': 45, 'hasNext': (page+1)*20 < 45}
    monkeypatch.setattr(TaskTrackerService, '_request', request)
    result = await TaskTrackerService().list_tasks(category='active')
    assert len(result['items']) == 20 and result['total'] == 23
    assert calls[0:2] == [(0, 100), (0, 20)]
    assert sorted(calls[2:]) == [(1, 20), (2, 20)]
