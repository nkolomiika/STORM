from unittest.mock import AsyncMock

import httpx
import pytest
from fastapi import HTTPException

from app.config import get_settings
from app.task_tracker import TaskTrackerService, description_text, task_out
from app.works import WorksClient
from app.tracker_metadata import affected_versions, assignee_identity


def test_native_unit_mapping_and_document_text():
    unit = {'code':'APPSEC-42','summary':'Проверить API','suit':{'name':'Assessment'},'attributes':{'workflow_status':{'name':'В работе'},'assigned_to':{'name':'Иван Иванов'},'priority':{'name':'Высокий'}},'description':{'type':'doc','content':[{'type':'paragraph','content':[{'type':'text','text':'Проверка авторизации'}]}]}}
    output = task_out(unit)
    assert output['key']=='APPSEC-42' and output['summary']=='Проверить API'
    assert output['status_category']=='inprogress' and output['assignee']=='Иван Иванов'
    assert output['description']=='Проверка авторизации'
    assert description_text({'content':None}) == ''


@pytest.mark.asyncio
async def test_missing_native_configuration_is_explicit_and_does_not_send_requests(monkeypatch):
    monkeypatch.setattr(get_settings(),'works_enabled',False)
    with pytest.raises(HTTPException) as exc:
        await TaskTrackerService().list_tasks()
    assert exc.value.status_code==503
    assert 'WORKS_' in exc.value.detail


@pytest.mark.asyncio
async def test_search_body_is_required_instead_of_guessing_an_incompatible_api(monkeypatch):
    settings=get_settings()
    monkeypatch.setattr(settings,'works_enabled',True)
    monkeypatch.setattr(settings,'works_api_token','test-only')
    monkeypatch.setattr(settings,'works_base_url','https://tracker.example')
    monkeypatch.setattr(settings,'works_tasks_search_body',None)
    with pytest.raises(HTTPException) as exc:await TaskTrackerService().list_tasks()
    assert exc.value.status_code==503 and 'WORKS_TASKS_SEARCH_BODY' in exc.value.detail


@pytest.mark.asyncio
async def test_native_search_uses_deployment_body_and_keeps_query_as_json_data(monkeypatch):
    settings=get_settings()
    monkeypatch.setattr(settings, 'works_tasks_search_path', '/rest/api/unit/v3/find')
    for key,value in {'works_enabled':True,'works_api_token':'test-only','works_base_url':'https://tracker.example','works_tasks_search_body':{'space':'{space}','query':'{query}','page':{'page':0,'size':10}},'works_tasks_space':'APPSEC'}.items():monkeypatch.setattr(settings,key,value)
    response=httpx.Response(200,json={'content':[{'code':'APPSEC-1','summary':'demo'}]},request=httpx.Request('POST','https://tracker.example/rest/api/unit/v3/find'))
    post=AsyncMock(return_value=response)
    async def enter(self):
        self._client=type('Client',(),{'post':post})()
        return self
    monkeypatch.setattr(WorksClient,'__aenter__',enter)
    monkeypatch.setattr(WorksClient,'__aexit__',AsyncMock())
    payload='" OR 1=1 {space}'
    result=await TaskTrackerService().list_tasks(query=payload)
    assert result['items']==[]
    kwargs=post.await_args.kwargs
    assert kwargs['json']['query']==payload
    assert kwargs['json']['space']=='APPSEC'
    assert post.await_args.args[0].endswith('/rest/api/unit/v3/find')
    assert settings.works_tasks_search_body['query']=='{query}'


@pytest.mark.asyncio
async def test_native_tql_body_is_fixed_and_user_search_cannot_change_its_expression(monkeypatch):
    from app.config import Settings
    settings = get_settings()
    body = Settings.model_fields['works_tasks_search_body'].get_default(call_default_factory=True)
    for key, value in {'works_enabled': True, 'works_api_token': 'test-only',
                       'works_base_url': 'https://tracker.example/swtr',
                       'works_tasks_search_path': '/rest/api/unit/v3/find/tql',
                       'works_tasks_space': 'APPSEC', 'works_tasks_search_body': body}.items():
        monkeypatch.setattr(settings, key, value)
    captured = []
    def handler(request):
        import json
        captured.append(json.loads(request.content))
        assert request.url.path == '/swtr/rest/api/unit/v3/find/tql'
        return httpx.Response(200, json={'content': []})
    def init(self):
        self._base = settings.works_base_url
        self._client = httpx.AsyncClient(transport=httpx.MockTransport(handler))
    monkeypatch.setattr(WorksClient, '__init__', init)
    await TaskTrackerService().list_tasks(query='" or space = "STS" or summary = "{space}')
    assert len(captured) == 1
    assert captured[0] == body
    assert body['query'] == 'space = "APPSEC" and suit = "security_assessment_appsec"'
    assert body['timeZone'] == 'Europe/Moscow'
    assert 'affects_version_s' in body['attributes']


@pytest.mark.parametrize('value', [None, [], 'progress', {'statusType': []}])
def test_malformed_workflow_metadata_never_raises(value):
    assert task_out({'code': 'APPSEC-1', 'attributes': {'workflow_status': value}})['status_category'] == 'unknown'


def test_prosemirror_string_and_plain_description_are_rendered_as_text():
    import json
    document = {'type': 'doc', 'content': [{'type': 'paragraph', 'content': [
        {'type': 'text', 'text': 'Тестовое описание'}]}]}
    assert description_text(json.dumps(document)) == 'Тестовое описание'
    assert description_text('{broken json') == ''
    assert task_out({'code': 'APPSEC-1', 'description': '{broken json',
                     'descriptionPlain': 'Готовый текст'})['description'] == 'Готовый текст'


def test_native_card_keeps_every_affected_version_and_assignee_login():
    unit = {'code': 'APPSEC-3', 'attributes': {'assigned_to': {'username': 'analyst.login', 'displayName': 'Иван Иванов'}, 'affects_version_s_crpv': [{'code': 'v1', 'name': 'Platform 1.0'}, {'code': 'v2', 'title': 'Platform 2.0'}]}}
    result = task_out(unit)
    assert result['assignee'] == 'Иван Иванов'
    assert result['assignee_username'] == 'analyst.login'
    assert result['affected_versions'] == [{'code': 'v1', 'name': 'Platform 1.0'}, {'code': 'v2', 'name': 'Platform 2.0'}]


@pytest.mark.parametrize('value,expected', [
    (None, (None, None)), ('analyst.login', ('analyst.login', 'analyst.login')),
    ({'login': 'analyst.login', 'name': 'Иван Иванов'}, ('analyst.login', 'Иван Иванов')),
    ({'name': 'Иван Иванов', 'id': 'opaque-id'}, (None, 'Иван Иванов')),
    ([], (None, None)),
])
def test_display_name_is_not_confused_with_login(value, expected):
    assert assignee_identity(value) == expected


def test_version_parser_handles_optional_native_fields_and_deduplicates_by_code():
    assert affected_versions({}) == []
    assert affected_versions({'affects_version_s_crpv': None}) == []
    assert affected_versions({'affects_version': [{'id': 'v1', 'name': 'One'}]}) == [{'code': 'v1', 'name': 'One'}]
    assert affected_versions({'affects_version_s_crpv': [None, {}, 'v1', {'code': 'v1', 'name': 'Duplicate'}, {'uuid': 'v2', 'title': 'Two'}]}) == [{'code': 'v1', 'name': 'v1'}, {'code': 'v2', 'name': 'Two'}]


def test_invalid_external_version_metadata_is_a_502_instead_of_response_500():
    with pytest.raises(HTTPException) as exc:
        task_out({'code': 'APPSEC-3', 'attributes': {'affects_version_s_crpv': [{'code': 'x' * 100, 'name': 'Too long'}]}})
    assert exc.value.status_code == 502


@pytest.mark.asyncio
@pytest.mark.parametrize('metadata,count,next_token,total', [
    ({'hasNext': True, 'totalElements': 45}, 20, '1', 45),
    ({'hasNext': False, 'totalElements': 20}, 20, None, 20),
    ({'page': {'last': False, 'totalElements': 45}}, 20, '1', 45),
    ({'last': True}, 5, None, 5),
    ({}, 20, '1', None),
    ({}, 5, None, 5),
    ({'hasNext': True}, 0, None, 0),
])
async def test_pagination_metadata_does_not_drop_pages_or_loop_on_empty_response(monkeypatch, metadata, count, next_token, total):
    response = {'content': [{'code': f'APPSEC-{i+1}', 'summary': 'Ticket'} for i in range(count)], **metadata}
    monkeypatch.setattr(TaskTrackerService, '_request', AsyncMock(return_value=response))
    result = await TaskTrackerService().list_tasks()
    assert result['next_page_token'] == next_token
    assert result['is_last'] is (next_token is None)
    assert result['total'] == total


@pytest.mark.asyncio
async def test_demo_tickets_are_paginated_instead_of_all_rendering_at_once(monkeypatch, tmp_path):
    import json
    path = tmp_path/'tickets.json'
    path.write_text(json.dumps({'content': [{'code': f'APPSEC-{i+1}', 'summary': f'Demo {i+1}'} for i in range(45)]}))
    monkeypatch.setattr(get_settings(), 'works_enabled', False)
    monkeypatch.setattr(get_settings(), 'works_tasks_demo_file', str(path))
    results = [await TaskTrackerService().list_tasks(page=page) for page in range(3)]
    assert [len(result['items']) for result in results] == [20, 20, 5]
    assert [result['next_page_token'] for result in results] == ['1', '2', None]
    assert all(result['total'] == 45 for result in results)
