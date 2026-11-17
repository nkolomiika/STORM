"""Read-only Task Tracker/Works units using the native API and deployment auth."""
from copy import deepcopy
import asyncio
import json
import re
from urllib.parse import quote

import httpx
from fastapi import HTTPException

from app.config import get_settings
from app.input_safety import validate_json_value
from app.tracker_spaces import is_project_ticket
from app.tracker_metadata import affected_versions, assignee_identity, unit_attributes, component_references
from app.works import WorksClient, WorksError, _extract_items, _workflow_status_name, works_issue_url, tracker_service_error


def display(value) -> str:
    if isinstance(value, str): return value
    if isinstance(value, (int, float)): return str(value)
    if isinstance(value, dict):
        for key in ('displayName','name','title','summary','code','value','key'):
            if value.get(key) is not None: return display(value[key])
    return ''


def task_out(unit: dict) -> dict:
    """Проецирует AS21 unit в карточку: статус, отдельный логин/ФИО, все версии и текст."""
    attributes = {**unit_attributes(unit.get('attrs')), **unit_attributes(unit.get('attributes'))}
    key = display(unit.get('code') or unit.get('key') or unit.get('id'))
    status = _workflow_status_name({**unit, 'attributes': attributes}) or ''
    normalized = status.lower().replace('_',' ')
    category = 'done' if normalized in {'resolved','closed','cancelled','sent by mistake','закрыт','закрыта','решено','решена','отменена'} else 'inprogress' if normalized in {'in progress','problem analysis','в работе','анализ проблемы'} else 'todo' if normalized in {'open','new','need info','paused','открыт','открыта','новый','новая','требует информации'} else 'unknown'
    workflow = attributes.get('workflow_status')
    if isinstance(workflow, dict) and isinstance(workflow.get('statusType'), str):
        category = {'progress': 'inprogress', 'done': 'done', 'todo': 'todo'}.get(workflow.get('statusType'), category)
    settings = get_settings()
    product = attributes.get(settings.works_appsec_product_code_attribute, attributes.get('_product_code_by_name'))
    if isinstance(product, dict):
        product = product.get('code')
    product = product.strip() or None if isinstance(product, str) else None
    try:
        components = component_references(attributes.get(settings.works_appsec_component_attribute))
        component = components[0] if len(components) == 1 else None
        if product and len(product) > 255:
            raise ValueError('Слишком длинный код продукта')
    except ValueError as exc:
        raise HTTPException(502, 'Task Tracker вернул некорректные данные продукта или компонента') from exc
    url = works_issue_url(quote(key, safe=''), space=settings.works_tasks_space) if key else ''
    labels = attributes.get('label') or attributes.get('labels') or []
    username, assignee = assignee_identity(attributes.get('assigned_to') or attributes.get('assignee'))
    _, reporter = assignee_identity(attributes.get('reporter'))
    versions = affected_versions(attributes)
    if any(len(item['code']) > 64 or len(item['name']) > 255 for item in versions):
        raise HTTPException(502, 'Task Tracker вернул некорректные данные затронутых версий')
    is_demo = bool(settings.works_tasks_demo_file)
    if is_demo:
        url = f"{settings.app_base_url.rstrip('/')}/tasks/{quote(key, safe='')}"
    return {'key':key, 'summary':display(unit.get('summary') or unit.get('title') or unit.get('name')), 'status':status, 'status_category':category, 'issue_type':display(unit.get('suit') or unit.get('type')), 'priority':display(attributes.get('priority')) or None, 'assignee':assignee, 'assignee_username':username, 'affected_versions':versions, 'product_code': product, 'component': component, 'components': components, 'is_demo':is_demo, 'reporter':reporter or None, 'updated':display(unit.get('updatedAt') or unit.get('updated') or unit.get('updated_at')), 'created':display(unit.get('createdAt') or unit.get('created') or unit.get('created_at')), 'description':description_text(unit.get('descriptionPlain') or unit.get('description')), 'labels':[display(label) for label in labels] if isinstance(labels,list) else [], 'url':url}


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
    """Извлекает текст из ProseMirror-объекта или его JSON-строки; обычный текст сохраняет."""
    if isinstance(value, str):
        if value.lstrip().startswith('{'):
            try:
                parsed = json.loads(value)
                validate_json_value(parsed)
            except (ValueError, RecursionError):
                return ''
            if isinstance(parsed, dict) and parsed.get('type') == 'doc':
                return description_text(parsed)
        return value
    if isinstance(value, dict):
        if value.get('type') == 'hardBreak':
            return '\n'
        text = value.get('text')
        if isinstance(text,str): return text
        children = value.get('content')
        separator = '\n' if value.get('type') in {'doc', 'bulletList', 'orderedList'} else ''
        return separator.join(description_text(item) for item in children if isinstance(item, (dict, str))) if isinstance(children, list) else ''
    return ''


class TaskTrackerService:
    async def _request(self, *, key: str | None = None, query: str = '') -> dict:
        """Читает полную карточку GET unit/v2 или список через TQL-поиск AS21.

        Нативный TQL ограничен APPSEC и типом анализа. Пользовательский текст
        не вставляется внутрь TQL; подстановка параметров заменяет целые JSON-строки.
        Ошибки настройки возвращают 503, внешнего HTTP/формата — 502.
        """
        settings = get_settings()
        if settings.works_tasks_demo_file:
            if settings.works_enabled:
                raise HTTPException(503, 'Демо-тикеты и реальная интеграция Task Tracker не могут быть включены одновременно')
            return await asyncio.to_thread(read_demo_units, settings.works_tasks_demo_file)
        if not settings.works_configured:
            raise HTTPException(503, 'Task Tracker не настроен: проверьте WORKS_ENABLED, WORKS_BASE_URL и WORKS_API_TOKEN')
        if key:
            try:
                path = settings.works_unit_detail_path.format(key=quote(key, safe=''))
            except (KeyError, ValueError) as exc:
                raise HTTPException(503, 'Task Tracker: неверно настроен путь карточки задачи') from exc
            body = None
        else:
            if settings.works_tasks_search_body is None:
                raise HTTPException(503, 'Для поиска задач Task Tracker требуется WORKS_TASKS_SEARCH_BODY — тело рабочего запроса unit/find из вашего инстанса')
            def has_space(value):
                if isinstance(value, str):
                    return value in {'{space}', settings.works_tasks_space} or bool(re.fullmatch(
                        r'\s*space\s*=\s*'+re.escape(json.dumps(settings.works_tasks_space))+
                        r'\s+and\s+suit\s*=\s*"security_assessment_appsec"\s*', value, re.IGNORECASE))
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
                if key:
                    response = await client._client.get(client._url(path), params={'validatorEnabled': 'true'})
                else:
                    response = await client._client.post(client._url(path), json=body)
                client._raise_for_status(response, 'task search')
                payload = response.json()
        except WorksError as exc:
            raise tracker_service_error(exc) from exc
        except (httpx.HTTPError, ValueError, RecursionError) as exc:
            raise HTTPException(502, 'Task Tracker недоступен или вернул некорректный ответ') from exc
        try:
            validate_json_value(payload)
        except ValueError as exc:
            raise HTTPException(502, "Task Tracker вернул недопустимые данные") from exc
        if not isinstance(payload,(dict,list)):
            raise HTTPException(502,'Task Tracker вернул неожиданный формат ответа')
        return payload

    async def list_tasks(self, query: str | None = None, category: str | None = None) -> dict:
        if query and is_project_ticket(query.strip()):
            try:
                task = await self.get_task(query.strip())
            except HTTPException as exc:
                if exc.status_code != 404:
                    raise
                return {'items': [], 'next_page_token': None, 'is_last': True}
            return {'items': [task] if not category or task['status_category'] == category else [],
                    'next_page_token': None, 'is_last': True}
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
        if isinstance(data, dict) and display(data.get('code') or data.get('key')) == key:
            return task_out(data)
        items = _extract_items(data)
        unit = next((item for item in items if isinstance(item,dict) and display(item.get('code') or item.get('key'))==key),None)
        if unit is None: raise HTTPException(404,'No task found in the AppSec space')
        return task_out(unit)
