"""Read-only Task Tracker/Works units using the native API and deployment auth."""
from copy import deepcopy
import asyncio
import hashlib
import json
import math
import re
import time
from datetime import datetime
from weakref import WeakKeyDictionary
from urllib.parse import quote

import httpx
from fastapi import HTTPException
from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.enums import UserRole
from app.exceptions import UpstreamServiceError
from app.models import Project, ProjectMember, User
from app.input_safety import validate_json_value
from app.tracker_spaces import is_project_ticket
from app.tracker_metadata import affected_versions, assignee_identity, unit_attributes, component_references
from app.works import WorksClient, WorksError, _extract_items, _workflow_status_name, works_issue_url, tracker_service_error

_snapshots = WeakKeyDictionary()


def is_closed_task(task: dict) -> bool:
    """Закрытые задачи: завершённые статусы и явно поставленные на паузу."""
    return task['status_category'] == 'done' or task['status'].strip().casefold() in {'paused', 'на паузе'}


def page_metadata(data: object, page: int, size: int, count: int) -> tuple[int | None, bool]:
    """Читает варианты метаданных AS21, не продолжая пустую страницу бесконечно."""
    meta = data if isinstance(data, dict) else {}
    nested = meta.get('page') if isinstance(meta.get('page'), dict) else {}
    total = nested.get('totalElements', meta.get('totalElements', meta.get('total')))
    total = total if isinstance(total, int) and not isinstance(total, bool) and total >= 0 else None
    has_next = None
    for source in (nested, meta):
        if isinstance(source.get('hasNext'), bool):
            has_next = source['hasNext']
            break
        if isinstance(source.get('last'), bool):
            has_next = not source['last']
            break
    if has_next is None:
        has_next = (page+1)*size < total if total is not None else count >= size
    has_next = bool(has_next and count > 0)
    if total is None and not has_next:
        total = page*size + count
    return total, has_next


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
    PAGE_SIZE = 20

    @staticmethod
    async def attach_project_access(db: AsyncSession, user: User, tasks: list[dict]) -> None:
        """Одним запросом отмечает существование проекта, скрывая ID недоступных."""
        if not tasks:
            return
        keys = {task['key'] for task in tasks}
        rows = (await db.execute(select(Project.appsec_ticket_key, Project.id, ProjectMember.user_id)
            .outerjoin(ProjectMember, and_(ProjectMember.project_id == Project.id, ProjectMember.user_id == user.id))
            .where(Project.appsec_ticket_key.in_(keys)).order_by(Project.id))).all()
        linked: dict[str, int | None] = {}
        for key, project_id, member_id in rows:
            accessible_id = project_id if user.role == UserRole.ADMIN or member_id is not None else None
            if key not in linked or linked[key] is None:
                linked[key] = accessible_id
        for task in tasks:
            task['project_exists'] = task['key'] in linked
            task['project_id'] = linked.get(task['key'])

    async def _request(self, *, key: str | None = None, query: str = '', page: int = 0, page_size: int = 20) -> dict:
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
            body['page'] = {'page': page, 'size': page_size}
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

    async def _snapshot(self, refresh: bool = False) -> list[dict]:
        """Кэширует общий индекс TT на 60 секунд для точных счётчиков обеих вкладок.

        До 20 тысяч тикетов; страницы до 100, максимум четыре запроса одновременно.
        Кэш разделён по event loop и отпечатку подключения, ошибки не кэшируются.
        Проектные права добавляются отдельно на каждом HTTP-запросе.
        """
        settings = get_settings()
        if settings.works_tasks_demo_file:
            data = await self._request()
            return [task_out(unit) for unit in _extract_items(data) if is_project_ticket(display(unit.get('code') or unit.get('key')))]
        signature = json.dumps([settings.works_base_url, settings.works_api_token, settings.works_cookies,
                                settings.works_tasks_space, settings.works_tenant, settings.works_tasks_search_path,
                                settings.works_tasks_search_body], sort_keys=True)
        key = hashlib.sha256(signature.encode()).digest()
        for loop in list(_snapshots):
            if loop.is_closed():
                _snapshots.pop(loop, None)
        cache = _snapshots.setdefault(asyncio.get_running_loop(), {})
        if key not in cache:
            if len(cache) >= 4:
                cache.pop(next(iter(cache)))
            cache[key] = {'lock': asyncio.Lock(), 'expires': 0, 'items': []}
        entry = cache[key]
        async with entry['lock']:
            if not refresh and time.monotonic() < entry['expires']:
                return [dict(item) for item in entry['items']]
            requested_size = 100
            try:
                first = await self._request(page=0, page_size=requested_size)
            except UpstreamServiceError as exc:
                if not isinstance(exc.__cause__, WorksError) or exc.__cause__.status_code != 422:
                    raise
                # Подтверждённый размер TQL из production-запроса — 20.
                requested_size = self.PAGE_SIZE
                first = await self._request(page=0, page_size=requested_size)
            units = _extract_items(first)
            total, has_next = page_metadata(first, 0, requested_size, len(units))
            size = len(units) if units and len(units) < requested_size and (has_next or (total is not None and total > len(units))) else requested_size
            total, has_next = page_metadata(first, 0, size, len(units))
            if total is not None and total > 20_000:
                raise HTTPException(502, 'Слишком много задач Task Tracker. Уточните фильтр APPSEC в настройках интеграции.')
            if has_next and total is not None:
                semaphore = asyncio.Semaphore(4)
                async def read(page):
                    async with semaphore:
                        return await self._request(page=page, page_size=size)
                pages = await asyncio.gather(*(read(page) for page in range(1, math.ceil(total/size))))
                seen = {display(unit.get('code') or unit.get('key')) for unit in units}
                for data in pages:
                    batch = _extract_items(data)
                    keys = {display(unit.get('code') or unit.get('key')) for unit in batch}
                    if batch and not keys.difference(seen):
                        raise HTTPException(502, 'Task Tracker не переключает страницы задач. Обратитесь к администратору.')
                    units.extend(batch)
                    seen.update(keys)
            elif has_next:
                page = 1
                seen = {display(unit.get('code') or unit.get('key')) for unit in units}
                while has_next:
                    if page*size >= 20_000:
                        raise HTTPException(502, 'Слишком много задач Task Tracker. Уточните фильтр APPSEC в настройках интеграции.')
                    data = await self._request(page=page, page_size=size)
                    batch = _extract_items(data)
                    keys = {display(unit.get('code') or unit.get('key')) for unit in batch}
                    if batch and not keys.difference(seen):
                        raise HTTPException(502, 'Task Tracker не переключает страницы задач. Обратитесь к администратору.')
                    units.extend(batch)
                    seen.update(keys)
                    _, has_next = page_metadata(data, page, size, len(batch))
                    page += 1
            if len(units) > 20_000:
                raise HTTPException(502, 'Слишком много задач Task Tracker. Уточните фильтр APPSEC в настройках интеграции.')
            indexed = {}
            for unit in units:
                if not is_project_ticket(display(unit.get('code') or unit.get('key'))):
                    continue
                # Описания нужны карточке, а не индексу списка: не держим их в памяти.
                compact = {k: v for k, v in unit.items() if k not in {'description', 'descriptionPlain'}}
                task = task_out(compact)
                indexed[task['key']] = task
            entry.update(items=list(indexed.values()), expires=time.monotonic()+60)
            return [dict(item) for item in entry['items']]

    async def _list_category(self, category: str, page: int, query: str | None, sort: str, refresh: bool) -> dict:
        """Сначала фильтрует и сортирует общий индекс, затем отдаёт 20 нужных тикетов."""
        items = await self._snapshot(refresh)
        needle = (query or '').strip().casefold()
        if needle:
            items = [item for item in items if needle in (item['key']+' '+item['summary']).casefold()]
        closed_total = sum(is_closed_task(item) for item in items)
        active_total = len(items)-closed_total
        items = [item for item in items if is_closed_task(item) == (category == 'closed')]
        def updated(item):
            try:
                return datetime.fromisoformat(item['updated'].replace('Z', '+00:00')).timestamp()
            except (ValueError, TypeError, OverflowError, OSError):
                return 0
        items.sort(key=lambda item: (updated(item), item['key']), reverse=sort != 'first')
        total = len(items)
        end = (page+1)*self.PAGE_SIZE
        return {'items': items[page*self.PAGE_SIZE:end], 'total': total,
                'next_page_token': str(page+1) if end < total else None, 'is_last': end >= total,
                'active_total': active_total, 'closed_total': closed_total}

    async def list_tasks(self, query: str | None = None, category: str | None = None, page: int = 0, sort: str = 'last', refresh: bool = False) -> dict:
        """Читает следующую порцию из 20 тикетов, сохраняя метаданные пагинации AS21."""
        if category in {'active', 'closed'}:
            return await self._list_category(category, page, query, sort, refresh)
        if query and is_project_ticket(query.strip()):
            try:
                task = await self.get_task(query.strip())
            except HTTPException as exc:
                if exc.status_code != 404:
                    raise
                return {'items': [], 'next_page_token': None, 'is_last': True, 'total': 0}
            selected = [task] if not category or task['status_category'] == category else []
            return {'items': selected if page == 0 else [],
                    'next_page_token': None, 'is_last': True, 'total': len(selected)}
        data = await self._request(query=query or '', page=page)
        raw_count = len(_extract_items(data))
        items = [task_out(unit) for unit in _extract_items(data) if isinstance(unit,dict) and is_project_ticket(display(unit.get('code') or unit.get('key')))]
        if query:
            needle = query.casefold()
            items = [item for item in items if needle in (item['key']+' '+item['summary']).casefold()]
        if category: items = [item for item in items if item['status_category']==category]
        if get_settings().works_tasks_demo_file:
            total = len(items)
            return {'items': items[page*self.PAGE_SIZE:(page+1)*self.PAGE_SIZE],
                    'next_page_token': str(page+1) if (page+1)*self.PAGE_SIZE < total else None,
                    'is_last': (page+1)*self.PAGE_SIZE >= total, 'total': total}
        total, has_next = page_metadata(data, page, self.PAGE_SIZE, raw_count)
        return {'items': items, 'next_page_token': str(page+1) if has_next else None,
                'is_last': not has_next, 'total': total}

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
