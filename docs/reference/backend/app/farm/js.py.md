# backend/app/farm/js.py

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **14**.

## JsFarmService.__init__

[backend/app/farm/js.py:66](../../../../../backend/app/farm/js.py#L66)

```python
def __init__(self, db: AsyncSession) -> None
```

Создаёт экземпляр и сохраняет его зависимости; параметры перечислены ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `db` | `AsyncSession` | `обязательный` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `AuditService`
- `JsMineConfig`

</details>

## JsFarmService._project_domains

[backend/app/farm/js.py:80](../../../../../backend/app/farm/js.py#L80)

```python
async def _project_domains(self, project_id: int) -> list[str]
```

Домены проекта: хосты с hostname и origin=host (не служебные IP-строки).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |

Возвращает: `list[str]`.

Прямые операции с БД: `self.db.scalars`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(h or '').strip`
- `(h or '').strip().lower`
- `Host.hostname.isnot`
- `and_`
- `is_ip_literal`
- `rows.all`
- `seen.append`
- `select`
- `select(Host.hostname).where`
- `self.db.scalars`

</details>

## JsFarmService._parse_raw

[backend/app/farm/js.py:96](../../../../../backend/app/farm/js.py#L96)

```python
def _parse_raw(raw: str) -> list[str]
```

В теле вызывает `(raw or '').splitlines`, `line.strip`, `line.strip().lower`, `out.append`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `raw` | `str` | `обязательный` | Исходное значение до нормализации/разбора. |

Возвращает: `list[str]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(raw or '').splitlines`
- `line.strip`
- `line.strip().lower`
- `out.append`

</details>

## JsFarmService._fetch

[backend/app/farm/js.py:106](../../../../../backend/app/farm/js.py#L106)

```python
async def _fetch(self, client: httpx.AsyncClient, url: str, *, max_bytes: int) -> tuple[str | None, bytes | None, str | None, str | None]
```

GET с капом размера. Возвращает (content_type, body, status, error).

status: ok | too_large | failed. Тело читаем потоково и обрываем на лимите.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `client` | `httpx.AsyncClient` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `url` | `str` | `обязательный` | URL обрабатываемого ресурса. |
| `max_bytes` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `tuple[str \| None, bytes \| None, str \| None, str \| None]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `b''.join`
- `chunks.append`
- `client.stream`
- `len`
- `resp.aiter_bytes`
- `resp.headers.get`
- `type`

</details>

## JsFarmService._discover_and_scan

[backend/app/farm/js.py:130](../../../../../backend/app/farm/js.py#L130)

```python
async def _discover_and_scan(self, domains: list[str], *, transport: httpx.AsyncBaseTransport | None=None) -> tuple[list[ScannedFile], list[str]]
```

Фазы 2–3 без БД: находит .js по доменам, качает и грепает.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `domains` | `list[str]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `transport` | `httpx.AsyncBaseTransport \| None` | `None` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `tuple[list[ScannedFile], list[str]]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `asyncio.Semaphore`
- `asyncio.gather`
- `build_transport`
- `discover`
- `httpx.AsyncClient`
- `httpx.Limits`
- `httpx.Timeout`
- `jobs.append`
- `len`
- `list`
- `resolve_forward`
- `scan`

</details>

## JsFarmService._discover_and_scan.discover

[backend/app/farm/js.py:149](../../../../../backend/app/farm/js.py#L149)

```python
async def discover(domain: str) -> tuple[str, list[str]]
```

В теле вызывает `body.decode`, `errors.append`, `jsscan.extract_js_urls`, `resolved.get`, `self._fetch`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `domain` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `tuple[str, list[str]]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `body.decode`
- `errors.append`
- `jsscan.extract_js_urls`
- `resolved.get`
- `self._fetch`

</details>

## JsFarmService._discover_and_scan.scan

[backend/app/farm/js.py:177](../../../../../backend/app/farm/js.py#L177)

```python
async def scan(domain: str, url: str) -> ScannedFile
```

В теле вызывает `ScannedFile`, `body.decode`, `hashlib.sha256`, `hashlib.sha256(body).hexdigest`, `jsmine.mine_js`, `len`, `self._fetch`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `domain` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `url` | `str` | `обязательный` | URL обрабатываемого ресурса. |

Возвращает: `ScannedFile`.

<details>
<summary>Прямые вызовы в теле</summary>

- `ScannedFile`
- `body.decode`
- `hashlib.sha256`
- `hashlib.sha256(body).hexdigest`
- `jsmine.mine_js`
- `len`
- `self._fetch`

</details>

## JsFarmService._persist

[backend/app/farm/js.py:203](../../../../../backend/app/farm/js.py#L203)

```python
async def _persist(self, project_id: int, files: list[ScannedFile], errors: list[str], actor_id: int, targets: list[str] | None=None) -> JsFarmResult
```

В теле вызывает `JsFarmFileResult`, `JsFarmResult`, `JsFile`, `JsSecret`, `and_`, `datetime.now`, `host.hostname.lower`, `host_by_name.get`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `files` | `list[ScannedFile]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `errors` | `list[str]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |
| `targets` | `list[str] \| None` | `None` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `JsFarmResult`.

Прямые операции с БД: `self.db.add`, `self.db.commit`, `self.db.delete`, `self.db.flush`, `self.db.rollback`, `self.db.scalar`, `self.db.scalars`.

<details>
<summary>Прямые вызовы в теле</summary>

- `JsFarmFileResult`
- `JsFarmResult`
- `JsFile`
- `JsSecret`
- `and_`
- `datetime.now`
- `host.hostname.lower`
- `host_by_name.get`
- `host_by_name.setdefault`
- `len`
- `list`
- `result.errors.append`
- `result.files.append`
- `result.model_dump`
- `rows.all`
- `select`
- `select(Host).where`
- `select(JsFile).options`
- `select(JsFile).options(selectinload(JsFile.secrets)).where`
- `selectinload`
- `self.audit.log`
- `self.db.add`
- `self.db.commit`
- `self.db.delete`
- `self.db.flush`
- `self.db.rollback`
- `self.db.scalar`
- `self.db.scalars`
- `sorted`
- `str`
- `type`
- `ws_manager.broadcast`

</details>

## JsFarmService.probe_and_import

[backend/app/farm/js.py:299](../../../../../backend/app/farm/js.py#L299)

```python
async def probe_and_import(self, project_id: int, raw: str, actor_id: int, *, transport: httpx.AsyncBaseTransport | None=None) -> JsFarmResult
```

В теле вызывает `JsFarmResult`, `self._discover_and_scan`, `self._parse_raw`, `self._persist`, `self._project_domains`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `raw` | `str` | `обязательный` | Исходное значение до нормализации/разбора. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |
| `transport` | `httpx.AsyncBaseTransport \| None` | `None` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `JsFarmResult`.

<details>
<summary>Прямые вызовы в теле</summary>

- `JsFarmResult`
- `self._discover_and_scan`
- `self._parse_raw`
- `self._persist`
- `self._project_domains`

</details>

## JsFarmService.create_job

[backend/app/farm/js.py:308](../../../../../backend/app/farm/js.py#L308)

```python
async def create_job(self, project_id: int, raw: str, actor_id: int) -> HostFarmJob
```

В теле вызывает `'\n'.join`, `HostFarmJob`, `ValidationError`, `len`, `self._parse_raw`, `self._project_domains`, `self.audit.log`, `self.db.add`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `raw` | `str` | `обязательный` | Исходное значение до нормализации/разбора. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |

Возвращает: `HostFarmJob`.

Прямые операции с БД: `self.db.add`, `self.db.flush`, `self.db.refresh`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValidationError('В проекте нет доменов для скана JS')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `'\n'.join`
- `HostFarmJob`
- `ValidationError`
- `len`
- `self._parse_raw`
- `self._project_domains`
- `self.audit.log`
- `self.db.add`
- `self.db.flush`
- `self.db.refresh`
- `str`

</details>

## JsFarmService.get_job

[backend/app/farm/js.py:330](../../../../../backend/app/farm/js.py#L330)

```python
async def get_job(self, project_id: int, job_id: int) -> HostFarmJob
```

Читает только задание данного вида и проекта.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `job_id` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `HostFarmJob`.

<details>
<summary>Прямые вызовы в теле</summary>

- `get_recon_job`

</details>

## JsFarmService._entry_name

[backend/app/farm/js.py:337](../../../../../backend/app/farm/js.py#L337)

```python
def _entry_name(url: str, used: set[str]) -> str
```

Путь файла внутри архива: `<host>/<имя.js>`, коллизии разводятся суффиксом.

Берём хост и последний сегмент пути из самого URL — Host-join не нужен, а
группировка по домену совпадает с тем, как раздел JS показывает файлы.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `url` | `str` | `обязательный` | URL обрабатываемого ресурса. |
| `used` | `set[str]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `base.replace`
- `base.replace('/', '_').replace`
- `base.rpartition`
- `posixpath.basename`
- `unquote`
- `urlparse`
- `used.add`

</details>

## JsFarmService.build_archive

[backend/app/farm/js.py:361](../../../../../backend/app/farm/js.py#L361)

```python
async def build_archive(self, project_id: int, host_id: int | None=None, *, transport: httpx.AsyncBaseTransport | None=None) -> tuple[str, bytes]
```

Собирает zip из сохранённых URL JS-файлов, докачивая их по требованию.

Файлы в БД не хранятся (скан в памяти), поэтому архив — это повторное
скачивание известных URL через тот же SSRF-safe транспорт, что и скан.
Контент может отличаться от момента скана (ключ мог быть ротирован).
Скоуп: один хост (`host_id`) или все домены проекта.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `host_id` | `int \| None` | `None` | ID родительского хоста. |
| `transport` | `httpx.AsyncBaseTransport \| None` | `None` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `tuple[str, bytes]`.

Прямые операции с БД: `self.db.scalars`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
NotFoundError('Нет JS-файлов для скачивания')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `(await self.db.scalars(select(JsFile).where(and_(*conds)).order_by(JsFile.url))).all`
- `NotFoundError`
- `and_`
- `asyncio.Semaphore`
- `asyncio.gather`
- `buf.getvalue`
- `build_transport`
- `conds.append`
- `grab`
- `httpx.AsyncClient`
- `httpx.Limits`
- `httpx.Timeout`
- `io.BytesIO`
- `select`
- `select(JsFile).where`
- `select(JsFile).where(and_(*conds)).order_by`
- `self._entry_name`
- `self.db.scalars`
- `set`
- `urlparse`
- `zf.writestr`
- `zipfile.ZipFile`

</details>

## JsFarmService.build_archive.grab

[backend/app/farm/js.py:396](../../../../../backend/app/farm/js.py#L396)

```python
async def grab(url: str) -> tuple[str, bytes | None]
```

В теле вызывает `self._fetch`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `url` | `str` | `обязательный` | URL обрабатываемого ресурса. |

Возвращает: `tuple[str, bytes \| None]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `self._fetch`

</details>
