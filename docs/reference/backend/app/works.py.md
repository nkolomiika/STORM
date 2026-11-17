# backend/app/works.py

Сгенерировано из объявлений кода. [Правила чтения](../../../METHODS.md).

Методов и именованных функций: **25**.

## WorksError.__init__

[backend/app/works.py:60](../../../../backend/app/works.py#L60)

```python
def __init__(self, message: str, detail: str='', *, status_code: int | None=None) -> не аннотирован
```

Создаёт экземпляр и сохраняет его зависимости; параметры перечислены ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `message` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `detail` | `str` | `''` | Определяется именем/типом и контрактом вызывающего кода. |
| `status_code` | `int \| None` | `None` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `не аннотирован`.

<details>
<summary>Прямые вызовы в теле</summary>

- `super`
- `super().__init__`

</details>

## tracker_service_error

[backend/app/works.py:67](../../../../backend/app/works.py#L67)

```python
def tracker_service_error(error: WorksError) -> UpstreamServiceError
```

Различает отказ авторизации и прав без выдачи тела внешнего ответа.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `error` | `WorksError` | `обязательный` | Перехваченное исключение/ответ ошибки. |

Возвращает: `UpstreamServiceError`.

<details>
<summary>Прямые вызовы в теле</summary>

- `UpstreamServiceError`

</details>

## priority_for_severity

[backend/app/works.py:76](../../../../backend/app/works.py#L76)

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

## criticality_for_severity

[backend/app/works.py:81](../../../../backend/app/works.py#L81)

```python
def criticality_for_severity(severity: str | None) -> str | None
```

Возвращает один код критичности STS для четырёх уровней CVSS из контракта.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `severity` | `str \| None` | `обязательный` | Критичность находки (Enum Severity). |

Возвращает: `str \| None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(severity or '').strip`
- `(severity or '').strip().lower`
- `SEVERITY_TO_CRITICALITY.get`

</details>

## text_to_prosemirror

[backend/app/works.py:86](../../../../backend/app/works.py#L86)

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

[backend/app/works.py:112](../../../../backend/app/works.py#L112)

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

[backend/app/works.py:119](../../../../backend/app/works.py#L119)

```python
def _extract_items(payload: Any) -> list[dict[str, Any]]
```

Достаёт список элементов из ответа find-эндпоинта (форма заранее неизвестна).

Ответ может быть списком, либо объектом со списком под одним из типовых
ключей (content/items/data/results/units/rows). Элементы иногда завёрнуты в
{"unit": {...}} — разворачиваем, сохраняя соседний массив AS21 attributes.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `payload` | `Any` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |

Возвращает: `list[dict[str, Any]]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `dict`
- `isinstance`
- `it.get`
- `out.append`
- `payload.get`
- `unit.get`
- `unit_attributes`

</details>

## _item_code_name

[backend/app/works.py:153](../../../../backend/app/works.py#L153)

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

[backend/app/works.py:160](../../../../backend/app/works.py#L160)

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

[backend/app/works.py:181](../../../../backend/app/works.py#L181)

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

## WorksClient._log_request

[backend/app/works.py:204](../../../../backend/app/works.py#L204)

```python
async def _log_request(request: httpx.Request) -> None
```

Логирует начало обращения без тела, query, заголовков и секретов.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `request` | `httpx.Request` | `обязательный` | HTTP-запрос Starlette/FastAPI. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `logger.info`
- `re.sub`
- `time.monotonic`

</details>

## WorksClient._log_response

[backend/app/works.py:211](../../../../backend/app/works.py#L211)

```python
async def _log_response(response: httpx.Response) -> None
```

Статус и длительность TT связываются с HTTP STORM через request_id.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `response` | `httpx.Response` | `обязательный` | HTTP-ответ, в котором могут устанавливаться cookie/заголовки. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `logger.info`
- `response.request.extensions.get`
- `time.monotonic`

</details>

## WorksClient.__aenter__

[backend/app/works.py:216](../../../../backend/app/works.py#L216)

```python
async def __aenter__(self) -> 'WorksClient'
```

Преобразование/вычисление в теле функции; тип результата и параметры приведены ниже, точное выражение доступно по ссылке на исходник.

Возвращает: `'WorksClient'`.

## WorksClient.__aexit__

[backend/app/works.py:219](../../../../backend/app/works.py#L219)

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

[backend/app/works.py:222](../../../../backend/app/works.py#L222)

```python
def _url(self, path: str) -> str
```

Преобразование/вычисление в теле функции; тип результата и параметры приведены ниже, точное выражение доступно по ссылке на исходник.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `path` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `str`.

## WorksClient._raise_for_status

[backend/app/works.py:226](../../../../backend/app/works.py#L226)

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
WorksError('Task Tracker отклонил запрос. Проверьте данные и попробуйте позже.', detail, status_code=resp.status_code)
WorksError('Не удалось подключиться к Task Tracker. Обратитесь к администратору.', detail, status_code=resp.status_code)
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

[backend/app/works.py:241](../../../../backend/app/works.py#L241)

```python
async def _find(self, path: str, query: str, limit: int, *, space: str | None=None) -> list[dict[str, str]]
```

Ищет справочные значения в выбранном пространстве AS21.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `path` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `query` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `limit` | `int` | `обязательный` | Максимальное число возвращаемых записей. |
| `space` | `str \| None` | `None` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `list[dict[str, str]]`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
WorksError('Task Tracker вернул некорректный справочник.')
WorksError('Works вернул не-JSON ответ.', resp.text[:500])
WorksError('Не удалось соединиться с Works.', str(exc))
```

<details>
<summary>Прямые вызовы в теле</summary>

- `WorksError`
- `_extract_items`
- `_item_code_name`
- `any`
- `data.get`
- `isinstance`
- `max`
- `min`
- `resp.json`
- `self._client.post`
- `self._raise_for_status`
- `self._url`
- `str`

</details>

## WorksClient.find_components

[backend/app/works.py:265](../../../../backend/app/works.py#L265)

```python
async def find_components(self, query: str='', limit: int=100) -> list[dict[str, str]]
```

Читает справочник компонентов формы STS по нативному plugin API.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `query` | `str` | `''` | Определяется именем/типом и контрактом вызывающего кода. |
| `limit` | `int` | `100` | Максимальное число возвращаемых записей. |

Возвращает: `list[dict[str, str]]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `self._find`

</details>

## WorksClient.find_versions

[backend/app/works.py:269](../../../../backend/app/works.py#L269)

```python
async def find_versions(self, query: str='', limit: int=100) -> list[dict[str, str]]
```

Читает справочник версий формы STS; версии тикета APPSEC загружаются отдельно.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `query` | `str` | `''` | Определяется именем/типом и контрактом вызывающего кода. |
| `limit` | `int` | `100` | Максимальное число возвращаемых записей. |

Возвращает: `list[dict[str, str]]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `self._find`

</details>

## WorksClient.find_product_codes

[backend/app/works.py:273](../../../../backend/app/works.py#L273)

```python
async def find_product_codes(self, query: str='', limit: int=100) -> list[dict[str, str]]
```

Читает taxonomy STS, сохраняя точный code (регистр, подчёркивания, числа).

Полный справочник кэшируется на минуту; ошибки не кэшируются. Кэш
ограничен восемью подключениями и сбрасывается сменой авторизации.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `query` | `str` | `''` | Определяется именем/типом и контрактом вызывающего кода. |
| `limit` | `int` | `100` | Максимальное число возвращаемых записей. |

Возвращает: `list[dict[str, str]]`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
WorksError('Task Tracker вернул некорректный справочник продуктов.')
WorksError('Не удалось загрузить коды продуктов из Task Tracker.')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `(code + ' ' + name).casefold`
- `(settings.works_api_token + '\x00' + settings.works_cookies).encode`
- `WorksError`
- `_product_catalog_cache.get`
- `_product_catalog_cache.pop`
- `any`
- `attribute.get`
- `dict.fromkeys`
- `hashlib.sha256`
- `hashlib.sha256((settings.works_api_token + '\x00' + settings.works_cookies).encode()).digest`
- `isinstance`
- `item.get`
- `item['code'].strip`
- `item['name'].strip`
- `iter`
- `len`
- `max`
- `min`
- `next`
- `payload.get`
- `query.strip`
- `query.strip().casefold`
- `resp.json`
- `self._client.get`
- `self._raise_for_status`
- `self._url`
- `time.monotonic`
- `tuple`

</details>

## WorksClient.get_ticket_status

[backend/app/works.py:309](../../../../backend/app/works.py#L309)

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

[backend/app/works.py:330](../../../../backend/app/works.py#L330)

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

[backend/app/works.py:349](../../../../backend/app/works.py#L349)

```python
async def create_bug_appsec(self, *, summary: str, description_text: str | None, assigned_to: str, reporter: str, priority: str, component: dict[str, str] | None, versions: list[dict[str, str]], product_code: str, severity: str, cvss_vector: str | None=None, components: list[dict[str, str]] | None=None, drafts_info: list[dict[str, str]] | None=None) -> dict[str, Any]
```

Создаёт STS по нативному контракту: продукт обязателен, критичность одна.

attributes.space сохраняет контекст APPSEC, верхний space задаёт STS.
Без вложений draftsInfo пуст; без описания description=null.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `summary` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `description_text` | `str \| None` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `assigned_to` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `reporter` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `priority` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `component` | `dict[str, str] \| None` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `versions` | `list[dict[str, str]]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `product_code` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `severity` | `str` | `обязательный` | Критичность находки (Enum Severity). |
| `cvss_vector` | `str \| None` | `None` | Определяется именем/типом и контрактом вызывающего кода. |
| `components` | `list[dict[str, str]] \| None` | `None` | Определяется именем/типом и контрактом вызывающего кода. |
| `drafts_info` | `list[dict[str, str]] \| None` | `None` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `dict[str, Any]`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
WorksError('Не удалось создать тикет в Works.', str(exc))
WorksError('Укажите корректный код продукта в настройках проекта.')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `WorksError`
- `_unit_ref`
- `criticality_for_severity`
- `cvss_vector.strip`
- `isinstance`
- `item.get`
- `len`
- `product_code.strip`
- `re.sub`
- `resp.json`
- `self._client.post`
- `self._raise_for_status`
- `self._url`
- `str`
- `text_to_prosemirror`
- `version.get`

</details>

## WorksClient.link_units

[backend/app/works.py:427](../../../../backend/app/works.py#L427)

```python
async def link_units(self, *, source: str, destination: str, link_type: str | None=None) -> dict[str, Any]
```

Создаёт связь между юнитами Works.

POST {works_link_path} с телом {"source", "destination", "type"}. Применяется
для связи от APPSEC-тикета проекта (source) к созданному STS-тикету
(destination). Один APPSEC может быть источником нескольких связей.
Возвращает JSON ответа Works.

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

[backend/app/works.py:453](../../../../backend/app/works.py#L453)

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
