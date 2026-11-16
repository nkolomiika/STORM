# backend/app/works.py

Сгенерировано из объявлений кода. [Правила чтения](../../../METHODS.md).

Методов и именованных функций: **20**.

## WorksError.__init__

[backend/app/works.py:45](../../../../backend/app/works.py#L45)

```python
def __init__(self, message: str, detail: str='') -> не аннотирован
```

Создаёт экземпляр и сохраняет его зависимости; параметры перечислены ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `message` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `detail` | `str` | `''` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `не аннотирован`.

<details>
<summary>Прямые вызовы в теле</summary>

- `super`
- `super().__init__`

</details>

## priority_for_severity

[backend/app/works.py:51](../../../../backend/app/works.py#L51)

```python
def priority_for_severity(severity: str | None) -> str
```

CVSS-критичность → приоритет Works; неизвестное → trivial (info).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `severity` | `str \| None` | `обязательный` | Критичность находки (Enum Severity). |

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(severity or '').strip`
- `(severity or '').strip().lower`
- `SEVERITY_TO_PRIORITY.get`

</details>

## text_to_prosemirror

[backend/app/works.py:56](../../../../backend/app/works.py#L56)

```python
def text_to_prosemirror(text: str | None) -> dict[str, Any]
```

Простой текст (с переносами) → ProseMirror/TipTap doc, как ждёт Works.

Полноценный markdown не конвертируем — каждый абзац (разделённый пустой
строкой) кладём отдельным paragraph. Пустой текст → один пустой paragraph.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `text` | `str \| None` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `dict[str, Any]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(text or '').replace`
- `(text or '').replace('\r\n', '\n').strip`
- `b.strip`
- `paragraphs.append`
- `raw.split`
- `str`
- `uuid.uuid4`

</details>

## _unit_ref

[backend/app/works.py:82](../../../../backend/app/works.py#L82)

```python
def _unit_ref(code: str | None, name: str | None) -> dict[str, Any] | None
```

Ссылка на справочный юнит (компонент/версия): {code, name, title}.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `code` | `str \| None` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `name` | `str \| None` | `обязательный` | Имя/название обрабатываемого объекта. |

Возвращает: `dict[str, Any] \| None`.

## _extract_items

[backend/app/works.py:89](../../../../backend/app/works.py#L89)

```python
def _extract_items(payload: Any) -> list[dict[str, Any]]
```

Достаёт список элементов из ответа find-эндпоинта (форма заранее неизвестна).

Ответ может быть списком, либо объектом со списком под одним из типовых
ключей (content/items/data/results/units/rows). Элементы иногда завёрнуты в
{"unit": {...}} — разворачиваем.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `payload` | `Any` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |

Возвращает: `list[dict[str, Any]]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `isinstance`
- `it.get`
- `out.append`
- `payload.get`

</details>

## _item_code_name

[backend/app/works.py:113](../../../../backend/app/works.py#L113)

```python
def _item_code_name(item: dict[str, Any]) -> dict[str, str]
```

Из элемента find-ответа вытаскиваем code (UUID) + name.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `item` | `dict[str, Any]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `dict[str, str]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `item.get`
- `str`

</details>

## _workflow_status_name

[backend/app/works.py:120](../../../../backend/app/works.py#L120)

```python
def _workflow_status_name(item: dict[str, Any]) -> str | None
```

Имя workflow_status из юнита (форма ответа заранее неизвестна).

Статус лежит либо в attributes/attrs как {name, code} (или строкой), либо
прямо на юните. Возвращаем человекочитаемое имя (или код).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `item` | `dict[str, Any]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `str \| None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `container.get`
- `isinstance`
- `item.get`
- `status.get`
- `str`

</details>

## WorksClient.__init__

[backend/app/works.py:141](../../../../backend/app/works.py#L141)

```python
def __init__(self) -> None
```

Создаёт экземпляр и сохраняет его зависимости; параметры перечислены ниже.

Возвращает: `None`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
WorksError('Интеграция с Works не настроена.')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `WorksError`
- `httpx.AsyncClient`
- `settings.works_api_token.strip`
- `settings.works_base_url.rstrip`
- `settings.works_base_url.split`
- `settings.works_base_url.split('/swtr')[0].rstrip`
- `token.lower`
- `token.lower().startswith`
- `token[7:].strip`

</details>

## WorksClient.__aenter__

[backend/app/works.py:163](../../../../backend/app/works.py#L163)

```python
async def __aenter__(self) -> 'WorksClient'
```

Преобразование/вычисление в теле функции; тип результата и параметры приведены ниже, точное выражение доступно по ссылке на исходник.

Возвращает: `'WorksClient'`.

## WorksClient.__aexit__

[backend/app/works.py:166](../../../../backend/app/works.py#L166)

```python
async def __aexit__(self, *exc: Any) -> None
```

В теле вызывает `self._client.aclose`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `exc` | `Any` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `self._client.aclose`

</details>

## WorksClient._url

[backend/app/works.py:169](../../../../backend/app/works.py#L169)

```python
def _url(self, path: str) -> str
```

Преобразование/вычисление в теле функции; тип результата и параметры приведены ниже, точное выражение доступно по ссылке на исходник.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `path` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `str`.

## WorksClient._raise_for_status

[backend/app/works.py:173](../../../../backend/app/works.py#L173)

```python
def _raise_for_status(resp: httpx.Response, what: str) -> None
```

В теле вызывает `WorksError`, `logger.info`, `logger.warning`, `resp.elapsed.total_seconds`, `round`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `resp` | `httpx.Response` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `what` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
WorksError('Task Tracker отклонил запрос. Проверьте данные и попробуйте позже.', detail)
WorksError('Не удалось подключиться к Task Tracker. Обратитесь к администратору.', detail)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `WorksError`
- `logger.info`
- `logger.warning`
- `resp.elapsed.total_seconds`
- `round`

</details>

## WorksClient._find

[backend/app/works.py:188](../../../../backend/app/works.py#L188)

```python
async def _find(self, path: str, query: str, limit: int) -> list[dict[str, str]]
```

В теле вызывает `WorksError`, `_extract_items`, `_item_code_name`, `max`, `min`, `resp.json`, `self._client.post`, `self._raise_for_status`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `path` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `query` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `limit` | `int` | `обязательный` | Максимальное число возвращаемых записей. |

Возвращает: `list[dict[str, str]]`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
WorksError('Works вернул не-JSON ответ.', resp.text[:500])
WorksError('Не удалось соединиться с Works.', str(exc))
```

<details>
<summary>Прямые вызовы в теле</summary>

- `WorksError`
- `_extract_items`
- `_item_code_name`
- `max`
- `min`
- `resp.json`
- `self._client.post`
- `self._raise_for_status`
- `self._url`
- `str`

</details>

## WorksClient.find_components

[backend/app/works.py:207](../../../../backend/app/works.py#L207)

```python
async def find_components(self, query: str='', limit: int=50) -> list[dict[str, str]]
```

В теле вызывает `self._find`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `query` | `str` | `''` | Определяется именем/типом и контрактом вызывающего кода. |
| `limit` | `int` | `50` | Максимальное число возвращаемых записей. |

Возвращает: `list[dict[str, str]]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `self._find`

</details>

## WorksClient.find_versions

[backend/app/works.py:210](../../../../backend/app/works.py#L210)

```python
async def find_versions(self, query: str='', limit: int=50) -> list[dict[str, str]]
```

В теле вызывает `self._find`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `query` | `str` | `''` | Определяется именем/типом и контрактом вызывающего кода. |
| `limit` | `int` | `50` | Максимальное число возвращаемых записей. |

Возвращает: `list[dict[str, str]]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `self._find`

</details>

## WorksClient.get_ticket_status

[backend/app/works.py:213](../../../../backend/app/works.py#L213)

```python
async def get_ticket_status(self, key: str) -> str | None
```

Текущий workflow_status тикета по ключу (напр. STS-594003).

Используем тот же unit-find, что и qg-sa: фильтр по units=[key].

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `key` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `str \| None`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
WorksError('Не удалось получить статус тикета из Works.', str(exc))
```

<details>
<summary>Прямые вызовы в теле</summary>

- `WorksError`
- `_extract_items`
- `_workflow_status_name`
- `resp.json`
- `self._client.post`
- `self._raise_for_status`
- `self._url`
- `str`

</details>

## WorksClient.upload_draft_file

[backend/app/works.py:234](../../../../backend/app/works.py#L234)

```python
async def upload_draft_file(self, *, draft_id: str, filename: str, content: bytes, content_type: str | None, relative_path: str) -> str
```

Загружает файл в черновик; возвращает fileId для draftsInfo.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `draft_id` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `filename` | `str` | `обязательный` | Имя файла. |
| `content` | `bytes` | `обязательный` | Текст содержимого; формат определяется вызывающим сервисом. |
| `content_type` | `str \| None` | `обязательный` | MIME-тип содержимого. |
| `relative_path` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `str`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
WorksError('Не удалось загрузить файл в Works.', str(exc))
```

<details>
<summary>Прямые вызовы в теле</summary>

- `WorksError`
- `self._client.post`
- `self._raise_for_status`
- `self._url`
- `str`
- `uuid.uuid4`

</details>

## WorksClient.create_bug_appsec

[backend/app/works.py:253](../../../../backend/app/works.py#L253)

```python
async def create_bug_appsec(self, *, summary: str, description_text: str | None, assigned_to: str, reporter: str, priority: str, component: dict[str, str] | None, versions: list[dict[str, str]], drafts_info: list[dict[str, str]] | None=None) -> dict[str, Any]
```

Создаёт тикет bug_appsec в space STS. Возвращает JSON ответа Works.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `summary` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `description_text` | `str \| None` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `assigned_to` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `reporter` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `priority` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `component` | `dict[str, str] \| None` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `versions` | `list[dict[str, str]]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `drafts_info` | `list[dict[str, str]] \| None` | `None` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `dict[str, Any]`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
WorksError('Не удалось создать тикет в Works.', str(exc))
```

<details>
<summary>Прямые вызовы в теле</summary>

- `WorksError`
- `_unit_ref`
- `component.get`
- `resp.json`
- `self._client.post`
- `self._raise_for_status`
- `self._url`
- `str`
- `text_to_prosemirror`
- `uuid.uuid4`
- `version.get`

</details>

## WorksClient.link_units

[backend/app/works.py:315](../../../../backend/app/works.py#L315)

```python
async def link_units(self, *, source: str, destination: str, link_type: str | None=None) -> dict[str, Any]
```

Создаёт связь между юнитами Works.

POST {works_link_path} с телом {"source", "destination", "type"}. Применяется
для привязки созданного STS-тикета (bug_appsec) к APPSEC-тикету проекта
(запросу на АЗ). Возвращает JSON ответа Works.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `source` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `destination` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `link_type` | `str \| None` | `None` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `dict[str, Any]`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
WorksError('Не удалось создать связь тикетов в Works.', str(exc))
```

<details>
<summary>Прямые вызовы в теле</summary>

- `WorksError`
- `resp.json`
- `self._client.post`
- `self._raise_for_status`
- `self._url`
- `str`

</details>

## works_issue_url

[backend/app/works.py:340](../../../../backend/app/works.py#L340)

```python
def works_issue_url(key: str, *, space: str | None=None) -> str
```

Ссылка на тикет Works в UI.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `key` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `space` | `str \| None` | `None` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `settings.works_issue_url_template.format`

</details>
