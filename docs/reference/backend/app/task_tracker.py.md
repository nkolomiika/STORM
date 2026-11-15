# backend/app/task_tracker.py

Сгенерировано из объявлений кода. [Правила чтения](../../../METHODS.md).

Методов и именованных функций: **9**.

## display

[backend/app/task_tracker.py:17](../../../../backend/app/task_tracker.py#L17)

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

[backend/app/task_tracker.py:26](../../../../backend/app/task_tracker.py#L26)

```python
def task_out(unit: dict) -> dict
```

В теле вызывает `HTTPException`, `_workflow_status_name`, `affected_versions`, `any`, `assignee_identity`, `attributes.get`, `bool`, `description_text`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `unit` | `dict` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `dict`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
HTTPException(502, 'Task Tracker вернул некорректные данные затронутых версий')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `HTTPException`
- `_workflow_status_name`
- `affected_versions`
- `any`
- `assignee_identity`
- `attributes.get`
- `bool`
- `description_text`
- `display`
- `get_settings`
- `isinstance`
- `len`
- `quote`
- `settings.app_base_url.rstrip`
- `status.lower`
- `status.lower().replace`
- `unit.get`
- `works_issue_url`

</details>

## read_demo_units

[backend/app/task_tracker.py:46](../../../../backend/app/task_tracker.py#L46)

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

[backend/app/task_tracker.py:62](../../../../backend/app/task_tracker.py#L62)

```python
def description_text(value) -> str
```

В теле вызывает `'\n'.join`, `description_text`, `filter`, `isinstance`, `value.get`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `value` | `не аннотирован` | `обязательный` | Входное значение преобразования/проверки. |

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `'\n'.join`
- `description_text`
- `filter`
- `isinstance`
- `value.get`

</details>

## TaskTrackerService._request

[backend/app/task_tracker.py:73](../../../../backend/app/task_tracker.py#L73)

```python
async def _request(self, *, key: str | None=None, query: str='') -> dict
```

В теле вызывает `HTTPException`, `WorksClient`, `asyncio.to_thread`, `client._client.post`, `client._raise_for_status`, `client._url`, `deepcopy`, `expand`; полный список ниже.

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
- `client._client.post`
- `client._raise_for_status`
- `client._url`
- `deepcopy`
- `expand`
- `get_settings`
- `has_space`
- `isinstance`
- `path.startswith`
- `response.json`
- `validate_json_value`

</details>

## TaskTrackerService._request.has_space

[backend/app/task_tracker.py:87](../../../../backend/app/task_tracker.py#L87)

```python
def has_space(value) -> не аннотирован
```

В теле вызывает `any`, `has_space`, `isinstance`, `value.values`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `value` | `не аннотирован` | `обязательный` | Входное значение преобразования/проверки. |

Возвращает: `не аннотирован`.

<details>
<summary>Прямые вызовы в теле</summary>

- `any`
- `has_space`
- `isinstance`
- `value.values`

</details>

## TaskTrackerService._request.expand

[backend/app/task_tracker.py:96](../../../../backend/app/task_tracker.py#L96)

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

[backend/app/task_tracker.py:120](../../../../backend/app/task_tracker.py#L120)

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
- `self._request`
- `task_out`
- `unit.get`

</details>

## TaskTrackerService.get_task

[backend/app/task_tracker.py:132](../../../../backend/app/task_tracker.py#L132)

```python
async def get_task(self, key: str) -> dict
```

В теле вызывает `HTTPException`, `_extract_items`, `display`, `is_project_ticket`, `isinstance`, `item.get`, `next`, `self._request`; полный список ниже.

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
- `display`
- `is_project_ticket`
- `isinstance`
- `item.get`
- `next`
- `self._request`
- `task_out`

</details>
