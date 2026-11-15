"""Read-only Task Tracker/Works units using the native API and deployment auth."""
from copy import deepcopy
import asyncio
import json
from urllib.parse import quote

import httpx
from fastapi import HTTPException

from app.config import get_settings
from app.input_safety import validate_json_value
from app.tracker_spaces import is_project_ticket
from app.tracker_metadata import affected_versions, assignee_identity
from app.works import WorksClient, WorksError, _extract_items, _workflow_status_name, works_issue_url


def display(value) -> str:
    if isinstance(value, str): return value
    if isinstance(value, (int, float)): return str(value)
    if isinstance(value, dict):
        for key in ('displayName','name','title','summary','code','value','key'):
            if value.get(key) is not None: return display(value[key])
    return ''


def task_out(unit: dict) -> dict:
    attributes = unit.get('attributes') or unit.get('attrs') or {}
    if not isinstance(attributes, dict): attributes = {}
    key = display(unit.get('code') or unit.get('key') or unit.get('id'))
    status = _workflow_status_name(unit) or ''
    normalized = status.lower().replace('_',' ')
    category = 'done' if normalized in {'resolved','closed','cancelled','sent by mistake','закрыт','закрыта','решено','решена','отменена'} else 'inprogress' if normalized in {'in progress','problem analysis','в работе','анализ проблемы'} else 'todo' if normalized in {'open','new','need info','paused','открыт','открыта','новый','новая','требует информации'} else 'unknown'
    settings = get_settings()
    url = works_issue_url(quote(key, safe=''), space=settings.works_tasks_space) if key else ''
    labels = attributes.get('label') or attributes.get('labels') or []
    username, assignee = assignee_identity(attributes.get('assigned_to') or attributes.get('assignee'))
    versions = affected_versions(attributes)
    if any(len(item['code']) > 64 or len(item['name']) > 255 for item in versions):
        raise HTTPException(502, 'Task Tracker вернул некорректные данные затронутых версий')
    is_demo = bool(settings.works_tasks_demo_file)
    if is_demo:
        url = f"{settings.app_base_url.rstrip('/')}/tasks/{quote(key, safe='')}"
    return {'key':key, 'summary':display(unit.get('summary') or unit.get('title') or unit.get('name')), 'status':status, 'status_category':category, 'issue_type':display(unit.get('suit') or unit.get('type')), 'priority':display(attributes.get('priority')) or None, 'assignee':assignee, 'assignee_username':username, 'affected_versions':versions, 'is_demo':is_demo, 'reporter':display(attributes.get('reporter')) or None, 'updated':display(unit.get('updatedAt') or unit.get('updated') or unit.get('updated_at')), 'created':display(unit.get('createdAt') or unit.get('created') or unit.get('created_at')), 'description':description_text(unit.get('description')), 'labels':[display(label) for label in labels] if isinstance(labels,list) else [], 'url':url}


def read_demo_units(path: str):
    """Read bounded native-format fixtures explicitly enabled on a local server."""
    try:
        with open(path, 'rb') as source:
            content = source.read(1024 * 1024 + 1)
        if len(content) > 1024 * 1024:
            raise ValueError('Demo data exceeds limit')
        data = json.loads(content)
        validate_json_value(data)
        if not isinstance(data, (dict, list)):
            raise ValueError('Expected units')
        return data
    except (OSError, ValueError, RecursionError) as exc:
        raise HTTPException(503, 'Демо-тикеты не загружены: запустите seed_ui_demo') from exc


def description_text(value) -> str:
    if isinstance(value, str): return value
    if isinstance(value, dict):
        text = value.get('text')
        if isinstance(text,str): return text
        children = value.get('content')
        return '\n'.join(filter(None, (description_text(item) for item in children if isinstance(item, (dict, str))))) if isinstance(children, list) else ''
    return ''


class TaskTrackerService:
    async def _request(self, *, key: str | None = None, query: str = '') -> dict:
        settings = get_settings()
        if settings.works_tasks_demo_file:
            if settings.works_enabled:
                raise HTTPException(503, 'Демо-тикеты и реальная интеграция Task Tracker не могут быть включены одновременно')
            return await asyncio.to_thread(read_demo_units, settings.works_tasks_demo_file)
        if not settings.works_configured:
            raise HTTPException(503, 'Task Tracker не настроен: проверьте WORKS_ENABLED, WORKS_BASE_URL и WORKS_API_TOKEN')
        if key:
            path = settings.works_unit_find_path
            body = {'filters':{'units':[key]}, 'page':{'page':0,'size':1}}
        else:
            if settings.works_tasks_search_body is None:
                raise HTTPException(503, 'Для поиска задач Task Tracker требуется WORKS_TASKS_SEARCH_BODY — тело рабочего запроса unit/find из вашего инстанса')
            def has_space(value):
                if isinstance(value, str): return value in {'{space}', settings.works_tasks_space}
                if isinstance(value, dict): return any(has_space(item) for item in value.values())
                if isinstance(value, list): return any(has_space(item) for item in value)
                return False
            if not has_space(settings.works_tasks_search_body):
                raise HTTPException(503, 'WORKS_TASKS_SEARCH_BODY должен ограничивать поиск пространством APPSEC: используйте {space} в фильтре пространства')
            path = settings.works_tasks_search_path
            # Only exact string placeholders are replaced; query values stay JSON data.
            def expand(value):
                if isinstance(value,str): return {'{query}':query,'{space}':settings.works_tasks_space,'{tenant}':settings.works_tenant}.get(value,value)
                if isinstance(value,list): return [expand(item) for item in value]
                if isinstance(value,dict): return {key:expand(item) for key,item in value.items()}
                return value
            body = expand(deepcopy(settings.works_tasks_search_body))
        if not path.startswith('/') or path.startswith('//') or '://' in path:
            raise HTTPException(503, 'Task Tracker: путь поиска должен быть относительным к WORKS_BASE_URL')
        try:
            async with WorksClient() as client:
                response = await client._client.post(client._url(path), json=body)
                client._raise_for_status(response, 'task search')
                payload = response.json()
        except (WorksError,httpx.HTTPError,ValueError,RecursionError) as exc:
            message = exc.message if isinstance(exc,WorksError) else 'Task Tracker недоступен или вернул некорректный ответ'
            raise HTTPException(502,message) from exc
        try:
            validate_json_value(payload)
        except ValueError as exc:
            raise HTTPException(502, "Task Tracker вернул недопустимые данные") from exc
        if not isinstance(payload,(dict,list)):
            raise HTTPException(502,'Task Tracker вернул неожиданный формат ответа')
        return payload

    async def list_tasks(self, query: str | None = None, category: str | None = None) -> dict:
        data = await self._request(query=query or '')
        items = [task_out(unit) for unit in _extract_items(data) if isinstance(unit,dict) and is_project_ticket(display(unit.get('code') or unit.get('key')))]
        if query:
            needle = query.casefold()
            items = [item for item in items if needle in (item['key']+' '+item['summary']).casefold()]
        if category: items = [item for item in items if item['status_category']==category]
        page = data.get('page') if isinstance(data,dict) else None
        is_last = data.get('last', True) if isinstance(data,dict) else True
        if isinstance(page,dict): is_last = page.get('last',is_last)
        return {'items':items,'next_page_token':None,'is_last':bool(is_last)}

    async def get_task(self, key: str) -> dict:
        if not is_project_ticket(key):
            raise HTTPException(404, 'No task found in the APPSEC space')
        data = await self._request(key=key)
        items = _extract_items(data)
        unit = next((item for item in items if isinstance(item,dict) and display(item.get('code') or item.get('key'))==key),None)
        if unit is None: raise HTTPException(404,'No task found in the AppSec space')
        return task_out(unit)
