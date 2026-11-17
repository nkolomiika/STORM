"""Справочники формы проекта: реальный HTTP STORM, транспорт TT подменён."""
import json

import httpx
import pytest

from app.config import get_settings

pytestmark = pytest.mark.asyncio
PATHS = [
    ('components', '/swtr/extension/plugin/v2/rest/api/sber_components_plugin/v1/component/find'),
    ('product-codes', '/swtr/rest/api/suit/v1/bug_appsec'),
    ('versions', '/swtr/extension/plugin/v2/rest/api/swtr_task_tracker_plugin/v1/version/find'),
]


def tracker_transport(monkeypatch, handler):
    from app.works import _product_catalog_cache
    _product_catalog_cache.clear()
    settings = get_settings()
    for key, value in {'works_enabled': True, 'works_api_token': 'test-service-token',
                       'works_base_url': 'https://tracker.example/swtr', 'works_cookies': 'api_swtr_as21=true',
                       'works_space': 'APPSEC', 'works_tasks_space': 'APPSEC'}.items():
        monkeypatch.setattr(settings, key, value)
    original_client = httpx.AsyncClient
    monkeypatch.setattr('app.works.httpx.AsyncClient', lambda *args, **kwargs:
                        original_client(*args, transport=httpx.MockTransport(handler), **kwargs))


@pytest.mark.parametrize('kind,path', [pair for pair in PATHS if pair[0] != 'product-codes'])
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
@pytest.mark.parametrize('status', [401, 403, 422, 500])
async def test_upstream_reference_failure_is_not_a_form_validation_error(api, monkeypatch, kind, _path, status):
    client, _ = api
    tracker_transport(monkeypatch, lambda _: httpx.Response(status, text='private password=do-not-expose'))
    response = await client.get('works/'+kind, params={'q': 'test'})
    assert response.status_code == 502, response.text
    assert response.json()['code'] == {401: 'task_tracker_auth_failed', 403: 'task_tracker_forbidden'}.get(status, 'task_tracker_unavailable')
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


async def test_product_catalog_preserves_native_codes_and_filters_cached_schema(api, monkeypatch):
    client, _ = api
    values = [{'code': 'dbc', 'name': 'DBC'}, {'code': '_am', 'name': '#AM'},
              {'code': 'AIS', 'name': 'AIS'}, {'code': '285902', 'name': 'OST'}]
    requests = []
    def handler(request):
        requests.append(request)
        assert request.method == 'GET'
        assert request.url.path == '/swtr/rest/api/suit/v1/bug_appsec'
        assert dict(request.url.params) == {'validatorEnabled': 'true'}
        return httpx.Response(200, json={'attributes': [
            {'code': 'customfield_24900', 'directoryValues': [{'code': 'wrong', 'name': 'Wrong'}]},
            {'code': 'product_code_list_sts', 'directoryValues': values}]})
    tracker_transport(monkeypatch, handler)
    response = await client.get('works/product-codes')
    assert response.status_code == 200 and response.json() == values
    for query, expected in [('DBc', values[:1]), ('#am', values[1:2]), ('aIs', values[2:3]), ('OST', values[3:]), ('not-found', [])]:
        result = await client.get('works/product-codes', params={'q': query})
        assert result.status_code == 200 and result.json() == expected
    assert len(requests) == 1
    # Смена подключения/авторизации не должна выдавать кэш прежней учётки.
    monkeypatch.setattr(get_settings(), 'works_api_token', 'another-service-token')
    assert (await client.get('works/product-codes')).status_code == 200
    assert len(requests) == 2


async def test_catalog_failure_is_not_cached_and_requires_login(api, monkeypatch):
    client, _ = api
    calls = []
    def handler(request):
        calls.append(request)
        if len(calls) == 1:
            return httpx.Response(401, text='private')
        return httpx.Response(200, json={'attributes': [{'code': 'product_code_list_sts', 'directoryValues': []}]})
    tracker_transport(monkeypatch, handler)
    assert (await client.get('works/product-codes')).status_code == 502
    assert (await client.get('works/product-codes')).json() == []
    assert len(calls) == 2
    client.cookies.clear()
    assert (await client.get('works/product-codes')).status_code == 401
    assert len(calls) == 2


@pytest.mark.parametrize('values', [None, {}, ['not-object'], [{'code': 'x'}], [{'code': 123, 'name': 'bad'}]])
async def test_invalid_product_taxonomy_returns_safe_error(api, monkeypatch, values):
    client, _ = api
    tracker_transport(monkeypatch, lambda _: httpx.Response(200, json={
        'attributes': [{'code': 'product_code_list_sts', 'directoryValues': values}]}))
    response = await client.get('works/product-codes')
    assert response.status_code == 502
    assert response.json()['code'] == 'task_tracker_unavailable'


@pytest.mark.parametrize('status,code', [(401, 'task_tracker_auth_failed'), (403, 'task_tracker_forbidden')])
async def test_tasks_auth_errors_use_same_safe_codes(api, monkeypatch, status, code):
    client, _ = api
    tracker_transport(monkeypatch, lambda _: httpx.Response(status, text='private password=do-not-expose'))
    response = await client.get('tasks')
    assert response.status_code == 502, response.text
    assert response.json()['code'] == code
    assert 'private' not in response.text and 'do-not-expose' not in response.text


async def test_tt_requests_are_logged_with_request_id_without_headers_or_body(api, monkeypatch, caplog):
    import logging
    from app.observability import configure_logging
    configure_logging()
    caplog.set_level(logging.INFO, logger='storm.works')
    client, _ = api
    tracker_transport(monkeypatch, lambda _: httpx.Response(200, json={'content': []}))
    response = await client.get('works/components', params={'q': 'private-search-query'})
    assert response.status_code == 200
    assert 'task_tracker_request_started' in caplog.text and 'task_tracker_response' in caplog.text
    assert response.headers['x-request-id'] in caplog.text
    assert 'private-search-query' not in caplog.text and 'test-service-token' not in caplog.text
