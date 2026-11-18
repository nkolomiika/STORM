"""Несуществующий тикет — 404, отказ внешнего API не маскируется как отсутствие."""
import httpx
import pytest

from test_tracker_spaces import native_tracker

pytestmark = pytest.mark.asyncio


@pytest.mark.parametrize('status,payload', [(404, {'message': 'private upstream details'}),
    (200, {'content': []}), (200, {'code': 'APPSEC-1', 'summary': 'Different ticket'})])
async def test_missing_task_returns_safe_404(api, monkeypatch, status, payload):
    client, _ = api
    native_tracker(monkeypatch, lambda request: httpx.Response(status, json=payload))
    response = await client.get('tasks/APPSEC-999999')
    assert response.status_code == 404, response.text
    assert response.json()['detail'] == 'Тикет не найден'
    assert response.json()['code'] == 'not_found'
    assert response.json()['request_id'] == response.headers['x-request-id']
    assert 'private upstream' not in response.text


async def test_invalid_ticket_key_is_404_without_external_request(api, monkeypatch):
    client, _ = api
    def unexpected(request):
        raise AssertionError('Invalid key must not contact Task Tracker')
    native_tracker(monkeypatch, unexpected)
    response = await client.get('tasks/STS-999999')
    assert response.status_code == 404 and response.json()['detail'] == 'Тикет не найден'


@pytest.mark.parametrize('status', [401, 403, 500])
async def test_tracker_failure_is_not_ticket_not_found(api, monkeypatch, status):
    client, _ = api
    native_tracker(monkeypatch, lambda request: httpx.Response(status, json={'message': 'private upstream details'}))
    response = await client.get('tasks/APPSEC-999999')
    assert response.status_code == 502
    assert response.json()['detail'] != 'Тикет не найден'
    assert response.json()['request_id']


async def test_missing_search_endpoint_remains_upstream_error(api, monkeypatch):
    client, _ = api
    native_tracker(monkeypatch, lambda request: httpx.Response(404, json={'message': 'Not found'}))
    response = await client.get('tasks')
    assert response.status_code == 502
