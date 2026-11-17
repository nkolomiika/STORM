"""Справочники формы проекта: реальный HTTP STORM, транспорт TT подменён."""
import json

import httpx
import pytest

from app.config import get_settings

pytestmark = pytest.mark.asyncio
PATHS = [
    ('components', '/swtr/extension/plugin/v2/rest/api/sber_components_plugin/v1/component/find'),
    ('versions', '/swtr/extension/plugin/v2/rest/api/swtr_task_tracker_plugin/v1/version/find'),
]


def tracker_transport(monkeypatch, handler):
    settings = get_settings()
    for key, value in {'works_enabled': True, 'works_api_token': 'test-service-token',
                       'works_base_url': 'https://tracker.example/swtr', 'works_cookies': 'api_swtr_as21=true',
                       'works_space': 'APPSEC', 'works_tasks_space': 'APPSEC'}.items():
        monkeypatch.setattr(settings, key, value)
    original_client = httpx.AsyncClient
    monkeypatch.setattr('app.works.httpx.AsyncClient', lambda *args, **kwargs:
                        original_client(*args, transport=httpx.MockTransport(handler), **kwargs))


@pytest.mark.parametrize('kind,path', PATHS)
async def test_project_reference_requests_match_native_sts_body(api, monkeypatch, kind, path):
    client, _ = api
    query = 'Platform "тест" / beta.2'
    requests = []
    def handler(request):
        requests.append(request)
        assert request.method == 'POST' and request.url.path == path
        assert json.loads(request.content) == {
            'space': 'STS', 'withArchived': False, 'withDeleted': False,
            'query': query, 'page': {'page': 0, 'size': 100},
        }
        assert request.headers['authorization'] == 'Bearer test-service-token'
        assert request.headers['origin'] == 'https://tracker.example'
        assert 'api_swtr_as21=true' in request.headers['cookie']
        return httpx.Response(200, json={'content': [{'code': 'ref-1', 'name': 'Full name 1.0-beta.2'},
                                                    {'code': 'ref-2'}],
                                        'pageSize': 100, 'pageNumber': 0, 'hasNext': True})
    tracker_transport(monkeypatch, handler)
    response = await client.get('works/'+kind, params={'q': query})
    assert response.status_code == 200, response.text
    assert response.json() == [{'code': 'ref-1', 'name': 'Full name 1.0-beta.2'},
                               {'code': 'ref-2', 'name': 'ref-2'}]
    assert len(requests) == 1


@pytest.mark.parametrize('kind,_path', PATHS)
@pytest.mark.parametrize('status', [403, 422, 500])
async def test_upstream_reference_failure_is_not_a_form_validation_error(api, monkeypatch, kind, _path, status):
    client, _ = api
    tracker_transport(monkeypatch, lambda _: httpx.Response(status, text='private password=do-not-expose'))
    response = await client.get('works/'+kind, params={'q': 'test'})
    assert response.status_code == 502, response.text
    assert response.json()['code'] == 'task_tracker_unavailable'
    assert 'private' not in response.text and 'do-not-expose' not in response.text


@pytest.mark.parametrize('kind,_path', PATHS)
async def test_missing_reference_configuration_is_explicit(api, monkeypatch, kind, _path):
    client, _ = api
    monkeypatch.setattr(get_settings(), 'works_enabled', False)
    response = await client.get('works/'+kind, params={'q': 'test'})
    assert response.status_code == 503
    assert response.json()['code'] == 'task_tracker_not_configured'


@pytest.mark.parametrize('kind,_path', PATHS)
@pytest.mark.parametrize('failure', ['timeout', 'invalid-json', 'invalid-shape'])
async def test_reference_transport_and_format_errors_are_controlled(api, monkeypatch, kind, _path, failure):
    client, _ = api
    def handler(request):
        if failure == 'timeout':
            raise httpx.ReadTimeout('private timeout diagnostic', request=request)
        if failure == 'invalid-json':
            return httpx.Response(200, text='<html>private response</html>')
        return httpx.Response(200, json={'content': None})
    tracker_transport(monkeypatch, handler)
    response = await client.get('works/'+kind, params={'q': 'test'})
    assert response.status_code == 502
    assert response.json()['code'] == 'task_tracker_unavailable'
    assert 'private' not in response.text
