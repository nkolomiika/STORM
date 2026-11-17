# backend/app/task_tracker.py

Сгенерировано из объявлений кода. [Правила чтения](../../../METHODS.md).

Методов и именованных функций: **9**.

## display

[backend/app/task_tracker.py:18](../../../../backend/app/task_tracker.py#L18)

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

[backend/app/task_tracker.py:27](../../../../backend/app/task_tracker.py#L27)

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

[backend/app/task_tracker.py:62](../../../../backend/app/task_tracker.py#L62)

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

[backend/app/task_tracker.py:78](../../../../backend/app/task_tracker.py#L78)

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

## TaskTrackerService._request

[backend/app/task_tracker.py:102](../../../../backend/app/task_tracker.py#L102)

```python
async def _request(self, *, key: str | None=None, query: str='') -> dict
```

Читает полную карточку GET unit/v2 или список через TQL-поиск AS21.

Нативный TQL ограничен APPSEC и типом анализа. Пользовательский текст
не вставляется внутрь TQL; подстановка параметров заменяет целые JSON-строки.
Ошибки настройки возвращают 503, внешнего HTTP/формата — 502.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `key` | `str \| None` | `None` | Определяется именем/типом и контрактом вызывающего кода. |
| `query` | `str` | `''` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `dict`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
HTTPException(502, 'Task Tracker вернул недопустимые данные')
HTTPException(502, 'Task Tracker вернул неожиданный формат ответа')
HTTPException(502, message)
HTTPException(503, 'Task Tracker не настроен: проверьте WORKS_ENABLED, WORKS_BASE_URL и WORKS_API_TOKEN')
HTTPException(503, 'Task Tracker: неверно настроен путь карточки задачи')
HTTPException(503, 'Task Tracker: путь поиска должен быть относительным к WORKS_BASE_URL')
HTTPException(503, 'WORKS_TASKS_SEARCH_BODY должен ограничивать поиск пространством APPSEC: используйте {space} в фильтре пространства')
HTTPException(503, 'Демо-тикеты и реальная интеграция Task Tracker не могут быть включены одновременно')
HTTPException(503, 'Для поиска задач Task Tracker требуется WORKS_TASKS_SEARCH_BODY — тело рабочего запроса unit/find из вашего инстанса')
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
- `validate_json_value`

</details>

## TaskTrackerService._request.has_space

[backend/app/task_tracker.py:125](../../../../backend/app/task_tracker.py#L125)

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

[backend/app/task_tracker.py:137](../../../../backend/app/task_tracker.py#L137)

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

## TaskTrackerService.list_tasks

[backend/app/task_tracker.py:164](../../../../backend/app/task_tracker.py#L164)

```python
async def list_tasks(self, query: str | None=None, category: str | None=None) -> dict
```

В теле вызывает `(item['key'] + ' ' + item['summary']).casefold`, `_extract_items`, `bool`, `data.get`, `display`, `is_project_ticket`, `isinstance`, `page.get`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `query` | `str \| None` | `None` | Определяется именем/типом и контрактом вызывающего кода. |
| `category` | `str \| None` | `None` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `dict`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(item['key'] + ' ' + item['summary']).casefold`
- `_extract_items`
- `bool`
- `data.get`
- `display`
- `is_project_ticket`
- `isinstance`
- `page.get`
- `query.casefold`
- `query.strip`
- `self._request`
- `self.get_task`
- `task_out`
- `unit.get`

</details>

## TaskTrackerService.get_task

[backend/app/task_tracker.py:185](../../../../backend/app/task_tracker.py#L185)

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
