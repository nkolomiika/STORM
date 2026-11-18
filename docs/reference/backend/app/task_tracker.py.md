# backend/app/task_tracker.py

Сгенерировано из объявлений кода. [Правила чтения](../../../METHODS.md).

Методов и именованных функций: **16**.

## is_closed_task

[backend/app/task_tracker.py:30](../../../../backend/app/task_tracker.py#L30)

```python
def is_closed_task(task: dict) -> bool
```

Закрытые задачи: завершённые статусы и явно поставленные на паузу.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `task` | `dict` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `bool`.

<details>
<summary>Прямые вызовы в теле</summary>

- `task['status'].strip`
- `task['status'].strip().casefold`

</details>

## page_metadata

[backend/app/task_tracker.py:35](../../../../backend/app/task_tracker.py#L35)

```python
def page_metadata(data: object, page: int, size: int, count: int) -> tuple[int | None, bool]
```

Читает варианты метаданных AS21, не продолжая пустую страницу бесконечно.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `data` | `object` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `page` | `int` | `обязательный` | Номер страницы, начиная с 1. |
| `size` | `int` | `обязательный` | Число элементов страницы; верхняя граница задаётся маршрутом. |
| `count` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `tuple[int \| None, bool]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `bool`
- `isinstance`
- `meta.get`
- `nested.get`
- `source.get`

</details>

## display

[backend/app/task_tracker.py:57](../../../../backend/app/task_tracker.py#L57)

```python
def display(value) -> str
```

В теле вызывает `display`, `isinstance`, `str`, `value.get`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `value` | `не аннотирован` | `обязательный` | Входное значение преобразования/проверки. |

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `display`
- `isinstance`
- `str`
- `value.get`

</details>

## task_out

[backend/app/task_tracker.py:66](../../../../backend/app/task_tracker.py#L66)

```python
def task_out(unit: dict) -> dict
```

Проецирует AS21 unit в карточку: статус, отдельный логин/ФИО, все версии и текст.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `unit` | `dict` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `dict`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
HTTPException(502, 'Task Tracker вернул некорректные данные затронутых версий')
HTTPException(502, 'Task Tracker вернул некорректные данные продукта или компонента')
ValueError('Слишком длинный код продукта')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `HTTPException`
- `ValueError`
- `_workflow_status_name`
- `affected_versions`
- `any`
- `assignee_identity`
- `attributes.get`
- `bool`
- `component_references`
- `description_text`
- `display`
- `get_settings`
- `isinstance`
- `len`
- `product.get`
- `product.strip`
- `quote`
- `settings.app_base_url.rstrip`
- `status.lower`
- `status.lower().replace`
- `unit.get`
- `unit_attributes`
- `workflow.get`
- `works_issue_url`
- `{'progress': 'inprogress', 'done': 'done', 'todo': 'todo'}.get`

</details>

## read_demo_units

[backend/app/task_tracker.py:101](../../../../backend/app/task_tracker.py#L101)

```python
def read_demo_units(path: str) -> не аннотирован
```

Read bounded native-format fixtures explicitly enabled on a local server.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `path` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `не аннотирован`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
HTTPException(503, 'Демо-тикеты не загружены: запустите seed_ui_demo')
ValueError('Demo data exceeds limit')
ValueError('Expected units')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `HTTPException`
- `ValueError`
- `isinstance`
- `json.loads`
- `len`
- `open`
- `source.read`
- `validate_json_value`

</details>

## description_text

[backend/app/task_tracker.py:117](../../../../backend/app/task_tracker.py#L117)

```python
def description_text(value) -> str
```

Извлекает текст из ProseMirror-объекта или его JSON-строки; обычный текст сохраняет.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `value` | `не аннотирован` | `обязательный` | Входное значение преобразования/проверки. |

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `description_text`
- `isinstance`
- `json.loads`
- `parsed.get`
- `separator.join`
- `validate_json_value`
- `value.get`
- `value.lstrip`
- `value.lstrip().startswith`

</details>

## TaskTrackerService.attach_project_access

[backend/app/task_tracker.py:144](../../../../backend/app/task_tracker.py#L144)

```python
async def attach_project_access(db: AsyncSession, user: User, tasks: list[dict]) -> None
```

Одним запросом отмечает существование проекта, скрывая ID недоступных.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `db` | `AsyncSession` | `обязательный` | Асинхронная SQLAlchemy-сессия текущего запроса. |
| `user` | `User` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `tasks` | `list[dict]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

Прямые операции с БД: `db.execute`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(await db.execute(select(Project.appsec_ticket_key, Project.id, ProjectMember.user_id).outerjoin(ProjectMember, and_(ProjectMember.project_id == Project.id, ProjectMember.user_id == user.id)).where(Project.appsec_ticket_key.in_(keys)).order_by(Project.id))).all`
- `Project.appsec_ticket_key.in_`
- `and_`
- `db.execute`
- `linked.get`
- `select`
- `select(Project.appsec_ticket_key, Project.id, ProjectMember.user_id).outerjoin`
- `select(Project.appsec_ticket_key, Project.id, ProjectMember.user_id).outerjoin(ProjectMember, and_(ProjectMember.project_id == Project.id, ProjectMember.user_id == user.id)).where`
- `select(Project.appsec_ticket_key, Project.id, ProjectMember.user_id).outerjoin(ProjectMember, and_(ProjectMember.project_id == Project.id, ProjectMember.user_id == user.id)).where(Project.appsec_ticket_key.in_(keys)).order_by`

</details>

## TaskTrackerService._request

[backend/app/task_tracker.py:161](../../../../backend/app/task_tracker.py#L161)

```python
async def _request(self, *, key: str | None=None, query: str='', page: int=0, page_size: int=20) -> dict
```

Читает полную карточку GET unit/v2 или список через TQL-поиск AS21.

Нативный TQL ограничен APPSEC и типом анализа. Пользовательский текст
не вставляется внутрь TQL; подстановка параметров заменяет целые JSON-строки.
Ошибки настройки возвращают 503, внешнего HTTP/формата — 502.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `key` | `str \| None` | `None` | Определяется именем/типом и контрактом вызывающего кода. |
| `query` | `str` | `''` | Определяется именем/типом и контрактом вызывающего кода. |
| `page` | `int` | `0` | Номер страницы, начиная с 1. |
| `page_size` | `int` | `20` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `dict`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
HTTPException(502, 'Task Tracker вернул недопустимые данные')
HTTPException(502, 'Task Tracker вернул неожиданный формат ответа')
HTTPException(502, 'Task Tracker недоступен или вернул некорректный ответ')
HTTPException(503, 'Task Tracker не настроен: проверьте WORKS_ENABLED, WORKS_BASE_URL и WORKS_API_TOKEN')
HTTPException(503, 'Task Tracker: неверно настроен путь карточки задачи')
HTTPException(503, 'Task Tracker: путь поиска должен быть относительным к WORKS_BASE_URL')
HTTPException(503, 'WORKS_TASKS_SEARCH_BODY должен ограничивать поиск пространством APPSEC: используйте {space} в фильтре пространства')
HTTPException(503, 'Демо-тикеты и реальная интеграция Task Tracker не могут быть включены одновременно')
HTTPException(503, 'Для поиска задач Task Tracker требуется WORKS_TASKS_SEARCH_BODY — тело рабочего запроса unit/find из вашего инстанса')
tracker_service_error(exc)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `HTTPException`
- `WorksClient`
- `asyncio.to_thread`
- `client._client.get`
- `client._client.post`
- `client._raise_for_status`
- `client._url`
- `deepcopy`
- `expand`
- `get_settings`
- `has_space`
- `isinstance`
- `path.startswith`
- `quote`
- `response.json`
- `settings.works_unit_detail_path.format`
- `tracker_service_error`
- `validate_json_value`

</details>

## TaskTrackerService._request.has_space

[backend/app/task_tracker.py:184](../../../../backend/app/task_tracker.py#L184)

```python
def has_space(value) -> не аннотирован
```

В теле вызывает `any`, `bool`, `has_space`, `isinstance`, `json.dumps`, `re.escape`, `re.fullmatch`, `value.values`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `value` | `не аннотирован` | `обязательный` | Входное значение преобразования/проверки. |

Возвращает: `не аннотирован`.

<details>
<summary>Прямые вызовы в теле</summary>

- `any`
- `bool`
- `has_space`
- `isinstance`
- `json.dumps`
- `re.escape`
- `re.fullmatch`
- `value.values`

</details>

## TaskTrackerService._request.expand

[backend/app/task_tracker.py:196](../../../../backend/app/task_tracker.py#L196)

```python
def expand(value) -> не аннотирован
```

В теле вызывает `expand`, `isinstance`, `value.items`, `{'{query}': query, '{space}': settings.works_tasks_space, '{tenant}': settings.works_tenant}.get`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `value` | `не аннотирован` | `обязательный` | Входное значение преобразования/проверки. |

Возвращает: `не аннотирован`.

<details>
<summary>Прямые вызовы в теле</summary>

- `expand`
- `isinstance`
- `value.items`
- `{'{query}': query, '{space}': settings.works_tasks_space, '{tenant}': settings.works_tenant}.get`

</details>

## TaskTrackerService._snapshot

[backend/app/task_tracker.py:225](../../../../backend/app/task_tracker.py#L225)

```python
async def _snapshot(self, refresh: bool=False) -> list[dict]
```

Кэширует общий индекс TT на 60 секунд для точных счётчиков обеих вкладок.

До 20 тысяч тикетов; страницы до 100, максимум четыре запроса одновременно.
Кэш разделён по event loop и отпечатку подключения, ошибки не кэшируются.
Проектные права добавляются отдельно на каждом HTTP-запросе.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `refresh` | `bool` | `False` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `list[dict]`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
HTTPException(502, 'Task Tracker не переключает страницы задач. Обратитесь к администратору.')
HTTPException(502, 'Слишком много задач Task Tracker. Уточните фильтр APPSEC в настройках интеграции.')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `HTTPException`
- `_extract_items`
- `_snapshots.pop`
- `_snapshots.setdefault`
- `asyncio.Lock`
- `asyncio.Semaphore`
- `asyncio.gather`
- `asyncio.get_running_loop`
- `cache.pop`
- `dict`
- `display`
- `entry.update`
- `get_settings`
- `hashlib.sha256`
- `hashlib.sha256(signature.encode()).digest`
- `indexed.values`
- `is_project_ticket`
- `isinstance`
- `iter`
- `json.dumps`
- `keys.difference`
- `len`
- `list`
- `loop.is_closed`
- `math.ceil`
- `next`
- `page_metadata`
- `range`
- `read`
- `seen.update`
- `self._request`
- `signature.encode`
- `task_out`
- `time.monotonic`
- `unit.get`
- `unit.items`
- `units.extend`

</details>

## TaskTrackerService._snapshot.read

[backend/app/task_tracker.py:269](../../../../backend/app/task_tracker.py#L269)

```python
async def read(page) -> не аннотирован
```

В теле вызывает `self._request`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `page` | `не аннотирован` | `обязательный` | Номер страницы, начиная с 1. |

Возвращает: `не аннотирован`.

<details>
<summary>Прямые вызовы в теле</summary>

- `self._request`

</details>

## TaskTrackerService._list_category

[backend/app/task_tracker.py:309](../../../../backend/app/task_tracker.py#L309)

```python
async def _list_category(self, category: str, page: int, query: str | None, sort: str, refresh: bool) -> dict
```

Сначала фильтрует и сортирует общий индекс, затем отдаёт 20 нужных тикетов.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `category` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `page` | `int` | `обязательный` | Номер страницы, начиная с 1. |
| `query` | `str \| None` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `sort` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `refresh` | `bool` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `dict`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(item['key'] + ' ' + item['summary']).casefold`
- `(query or '').strip`
- `(query or '').strip().casefold`
- `is_closed_task`
- `items.sort`
- `len`
- `self._snapshot`
- `str`
- `sum`

</details>

## TaskTrackerService._list_category.updated

[backend/app/task_tracker.py:318](../../../../backend/app/task_tracker.py#L318)

```python
def updated(item) -> не аннотирован
```

В теле вызывает `datetime.fromisoformat`, `datetime.fromisoformat(item['updated'].replace('Z', '+00:00')).timestamp`, `item['updated'].replace`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `item` | `не аннотирован` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `не аннотирован`.

<details>
<summary>Прямые вызовы в теле</summary>

- `datetime.fromisoformat`
- `datetime.fromisoformat(item['updated'].replace('Z', '+00:00')).timestamp`
- `item['updated'].replace`

</details>

## TaskTrackerService.list_tasks

[backend/app/task_tracker.py:330](../../../../backend/app/task_tracker.py#L330)

```python
async def list_tasks(self, query: str | None=None, category: str | None=None, page: int=0, sort: str='last', refresh: bool=False) -> dict
```

Читает следующую порцию из 20 тикетов, сохраняя метаданные пагинации AS21.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `query` | `str \| None` | `None` | Определяется именем/типом и контрактом вызывающего кода. |
| `category` | `str \| None` | `None` | Определяется именем/типом и контрактом вызывающего кода. |
| `page` | `int` | `0` | Номер страницы, начиная с 1. |
| `sort` | `str` | `'last'` | Определяется именем/типом и контрактом вызывающего кода. |
| `refresh` | `bool` | `False` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `dict`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(item['key'] + ' ' + item['summary']).casefold`
- `_extract_items`
- `display`
- `get_settings`
- `is_project_ticket`
- `isinstance`
- `len`
- `page_metadata`
- `query.casefold`
- `query.strip`
- `self._list_category`
- `self._request`
- `self.get_task`
- `str`
- `task_out`
- `unit.get`

</details>

## TaskTrackerService.get_task

[backend/app/task_tracker.py:360](../../../../backend/app/task_tracker.py#L360)

```python
async def get_task(self, key: str) -> dict
```

В теле вызывает `HTTPException`, `_extract_items`, `data.get`, `display`, `is_project_ticket`, `isinstance`, `item.get`, `next`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `key` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `dict`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
HTTPException(404, 'No task found in the APPSEC space')
HTTPException(404, 'No task found in the AppSec space')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `HTTPException`
- `_extract_items`
- `data.get`
- `display`
- `is_project_ticket`
- `isinstance`
- `item.get`
- `next`
- `self._request`
- `task_out`

</details>
