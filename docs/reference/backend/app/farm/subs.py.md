# backend/app/farm/subs.py

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **16**.

## _normalize

[backend/app/farm/subs.py:49](../../../../../backend/app/farm/subs.py#L49)

```python
def _normalize(name: str) -> str
```

Имя хоста к каноничному виду: lower, без точки на конце и без '*.'-обёртки.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `name` | `str` | `обязательный` | Имя/название обрабатываемого объекта. |

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `name.startswith`
- `name.strip`
- `name.strip().lower`
- `name.strip().lower().rstrip`

</details>

## parse_roots

[backend/app/farm/subs.py:57](../../../../../backend/app/farm/subs.py#L57)

```python
def parse_roots(raw: str) -> list[str]
```

Корневые домены из вставленного текста: дедуп, без IP и комментариев.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `raw` | `str` | `обязательный` | Исходное значение до нормализации/разбора. |

Возвращает: `list[str]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(raw or '').splitlines`
- `_normalize`
- `is_ip_literal`
- `line.replace`
- `line.replace(',', ' ').split`
- `line.startswith`
- `line.strip`
- `out.append`

</details>

## in_scope

[backend/app/farm/subs.py:71](../../../../../backend/app/farm/subs.py#L71)

```python
def in_scope(name: str, root: str) -> bool
```

name принадлежит поддереву root (сам root тоже в scope).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `name` | `str` | `обязательный` | Имя/название обрабатываемого объекта. |
| `root` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `bool`.

<details>
<summary>Прямые вызовы в теле</summary>

- `name.endswith`

</details>

## parse_crtsh

[backend/app/farm/subs.py:76](../../../../../backend/app/farm/subs.py#L76)

```python
def parse_crtsh(raw_json: str, root: str) -> set[str]
```

Поддомены из JSON-ответа crt.sh (?output=json). Берём name_value каждого
сертификата (может содержать несколько имён через \n и wildcard '*.').

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `raw_json` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `root` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `set[str]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `_normalize`
- `entry.get`
- `found.add`
- `in_scope`
- `is_ip_literal`
- `isinstance`
- `json.loads`
- `set`
- `str`
- `str(value).splitlines`

</details>

## parse_subfinder

[backend/app/farm/subs.py:100](../../../../../backend/app/farm/subs.py#L100)

```python
def parse_subfinder(text: str, root: str) -> set[str]
```

Поддомены из subfinder -silent (по имени на строку).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `text` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `root` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `set[str]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(text or '').splitlines`
- `_normalize`
- `found.add`
- `in_scope`
- `is_ip_literal`
- `set`

</details>

## _fetch_crtsh

[backend/app/farm/subs.py:113](../../../../../backend/app/farm/subs.py#L113)

```python
async def _fetch_crtsh(root: str) -> tuple[set[str], str | None]
```

crt.sh по корню. Хост фиксированный (не пользовательский) — SSRF-transport
не нужен; таймаут ограничивает зависание.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `root` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `tuple[set[str], str \| None]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `client.get`
- `httpx.AsyncClient`
- `httpx.Timeout`
- `parse_crtsh`
- `set`
- `type`

</details>

## _run_subfinder

[backend/app/farm/subs.py:129](../../../../../backend/app/farm/subs.py#L129)

```python
async def _run_subfinder(root: str) -> tuple[set[str], str | None]
```

subfinder -d root -silent. Нет бинаря — тихо пропускаем (None-ошибки нет).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `root` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `tuple[set[str], str \| None]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `asyncio.create_subprocess_exec`
- `asyncio.wait_for`
- `out.decode`
- `parse_subfinder`
- `proc.communicate`
- `set`
- `shutil.which`
- `type`

</details>

## _default_collector

[backend/app/farm/subs.py:146](../../../../../backend/app/farm/subs.py#L146)

```python
async def _default_collector(roots: list[str]) -> dict[str, tuple[set[str], list[str], list[str]]]
```

Реальный сбор: crt.sh + subfinder по каждому корню, параллельно по корням.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `roots` | `list[str]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `dict[str, tuple[set[str], list[str], list[str]]]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `asyncio.gather`
- `dict`
- `one`

</details>

## _default_collector.one

[backend/app/farm/subs.py:148](../../../../../backend/app/farm/subs.py#L148)

```python
async def one(root: str) -> tuple[str, tuple[set[str], list[str], list[str]]]
```

В теле вызывает `_fetch_crtsh`, `_run_subfinder`, `errors.append`, `set`, `used.append`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `root` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `tuple[str, tuple[set[str], list[str], list[str]]]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `_fetch_crtsh`
- `_run_subfinder`
- `errors.append`
- `set`
- `used.append`

</details>

## SubdomainFarmService.__init__

[backend/app/farm/subs.py:179](../../../../../backend/app/farm/subs.py#L179)

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

</details>

## SubdomainFarmService._project_roots

[backend/app/farm/subs.py:183](../../../../../backend/app/farm/subs.py#L183)

```python
async def _project_roots(self, project_id: int) -> list[str]
```

Корни из доменных хостов проекта (origin=host, не IP-строки).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |

Возвращает: `list[str]`.

Прямые операции с БД: `self.db.scalars`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Host.hostname.isnot`
- `_normalize`
- `and_`
- `is_ip_literal`
- `roots.append`
- `rows.all`
- `select`
- `select(Host.hostname).where`
- `self.db.scalars`

</details>

## SubdomainFarmService._project_hostnames

[backend/app/farm/subs.py:197](../../../../../backend/app/farm/subs.py#L197)

```python
async def _project_hostnames(self, project_id: int) -> set[str]
```

В теле вызывает `Host.hostname.isnot`, `_normalize`, `and_`, `rows.all`, `select`, `select(Host.hostname).where`, `self.db.scalars`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |

Возвращает: `set[str]`.

Прямые операции с БД: `self.db.scalars`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Host.hostname.isnot`
- `_normalize`
- `and_`
- `rows.all`
- `select`
- `select(Host.hostname).where`
- `self.db.scalars`

</details>

## SubdomainFarmService._collect

[backend/app/farm/subs.py:205](../../../../../backend/app/farm/subs.py#L205)

```python
async def _collect(self, roots: list[str], collector: Collector | None) -> tuple[set[str], list[str], list[str]]
```

Слить источники по всем корням: (поддомены, источники, ошибки).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `roots` | `list[str]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `collector` | `Collector \| None` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `tuple[set[str], list[str], list[str]]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `by_root.values`
- `errors.extend`
- `run`
- `set`
- `used.append`

</details>

## SubdomainFarmService.probe_and_import

[backend/app/farm/subs.py:222](../../../../../backend/app/farm/subs.py#L222)

```python
async def probe_and_import(self, project_id: int, raw: str, actor_id: int, *, transport=None, detector=None, skip_targets: list[str] | None=None, collector: Collector | None=None) -> SubFarmResult
```

В теле вызывает `'\n'.join`, `HostFarmService`, `HostFarmService(self.db).probe_and_import`, `SubFarmResult`, `len`, `list`, `parse_roots`, `result.errors.extend`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `raw` | `str` | `обязательный` | Исходное значение до нормализации/разбора. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |
| `transport` | `не аннотирован` | `None` | Определяется именем/типом и контрактом вызывающего кода. |
| `detector` | `не аннотирован` | `None` | Определяется именем/типом и контрактом вызывающего кода. |
| `skip_targets` | `list[str] \| None` | `None` | Определяется именем/типом и контрактом вызывающего кода. |
| `collector` | `Collector \| None` | `None` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `SubFarmResult`.

<details>
<summary>Прямые вызовы в теле</summary>

- `'\n'.join`
- `HostFarmService`
- `HostFarmService(self.db).probe_and_import`
- `SubFarmResult`
- `len`
- `list`
- `parse_roots`
- `result.errors.extend`
- `result.model_dump`
- `self._collect`
- `self._project_hostnames`
- `self._project_roots`
- `self.audit.log`
- `sorted`
- `str`
- `ws_manager.broadcast`

</details>

## SubdomainFarmService.create_job

[backend/app/farm/subs.py:279](../../../../../backend/app/farm/subs.py#L279)

```python
async def create_job(self, project_id: int, raw: str, actor_id: int) -> HostFarmJob
```

В теле вызывает `'\n'.join`, `HostFarmJob`, `ValidationError`, `len`, `parse_roots`, `self._project_roots`, `self.db.add`, `self.db.commit`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `raw` | `str` | `обязательный` | Исходное значение до нормализации/разбора. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |

Возвращает: `HostFarmJob`.

Прямые операции с БД: `self.db.add`, `self.db.commit`, `self.db.refresh`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValidationError('Не удалось распознать ни одного корневого домена')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `'\n'.join`
- `HostFarmJob`
- `ValidationError`
- `len`
- `parse_roots`
- `self._project_roots`
- `self.db.add`
- `self.db.commit`
- `self.db.refresh`

</details>

## SubdomainFarmService.get_job

[backend/app/farm/subs.py:297](../../../../../backend/app/farm/subs.py#L297)

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
