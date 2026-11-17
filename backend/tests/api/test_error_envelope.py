"""Единый контракт ошибок, включая middleware, mounted API и HTTP-валидацию."""
import pytest

pytestmark = pytest.mark.asyncio


@pytest.mark.parametrize('method,path,payload,status', [
    ('GET', 'does-not-exist', None, 404),
    ('POST', 'projects', {'name': []}, 422),
    ('GET', 'projects/-1', None, 422),
    ('DELETE', 'auth/login', None, 405),
    ('POST', 'auth/login', {'username': 'absent', 'password': 'bad'}, 401),
])
async def test_all_http_errors_have_identical_fields_and_matching_request_id(api, method, path, payload, status):
    client, _ = api
    response = await client.request(method, path, json=payload)
    assert response.status_code == status, response.text
    body = response.json()
    assert set(body) == {'detail', 'code', 'request_id'}
    assert all(isinstance(value, str) and value for value in body.values())
    assert body['request_id'] == response.headers['x-request-id']


async def test_cors_preflight_error_also_has_envelope(api):
    client, _ = api
    response = await client.options('projects', headers={'Origin': 'https://evil.example', 'Access-Control-Request-Method': 'GET'})
    assert response.status_code == 400
    assert set(response.json()) == {'detail', 'code', 'request_id'}
    assert response.json()['request_id'] == response.headers['x-request-id']


async def test_mounted_agent_api_error_has_same_envelope(api):
    client, _ = api
    client.cookies.clear()
    response = await client.get('/api/v2/does-not-exist')
    assert response.status_code in (401, 404)
    assert set(response.json()) == {'detail', 'code', 'request_id'}
    assert response.json()['request_id'] == response.headers['x-request-id']
