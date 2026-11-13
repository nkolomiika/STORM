# backend/app/farm/portscan.py

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **8**.

## parse_nmap_xml

[backend/app/farm/portscan.py:45](../../../../../backend/app/farm/portscan.py#L45)

```python
def parse_nmap_xml(xml: str) -> dict[str, list[int]]
```

{ip: [открытый tcp-порт, ...]} из nmap -oX. Битый XML → пусто.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `xml` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `dict[str, list[int]]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `ElementTree.fromstring`
- `addr.get`
- `host.iter`
- `int`
- `out.setdefault`
- `out.setdefault(ip, []).extend`
- `port.find`
- `port.get`
- `ports.append`
- `root.iter`
- `set`
- `sorted`
- `state.get`

</details>

## _run_nmap

[backend/app/farm/portscan.py:78](../../../../../backend/app/farm/portscan.py#L78)

```python
async def _run_nmap(ips: list[str]) -> tuple[dict[str, list[int]], str | None]
```

nmap по списку IP одной командой. Нет бинаря — тихо пусто (ошибки нет).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `ips` | `list[str]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `tuple[dict[str, list[int]], str \| None]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `asyncio.create_subprocess_exec`
- `asyncio.wait_for`
- `out.decode`
- `parse_nmap_xml`
- `proc.communicate`
- `shutil.which`
- `str`
- `type`

</details>

## PortScanFarmService._project_targets

[backend/app/farm/portscan.py:108](../../../../../backend/app/farm/portscan.py#L108)

```python
async def _project_targets(self, project_id: int) -> list[str]
```

Хосты проекта как цели скана: имя, либо IP у безымянных строк.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |

Возвращает: `list[str]`.

Прямые операции с БД: `self.db.scalars`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(hostname or ip or '').strip`
- `out.append`
- `rows.all`
- `select`
- `select(Host.hostname, Host.ip_address).where`
- `self.db.scalars`

</details>

## PortScanFarmService._upsert_scan_port

[backend/app/farm/portscan.py:120](../../../../../backend/app/farm/portscan.py#L120)

```python
async def _upsert_scan_port(self, host: Host, ip_row, port_number: int) -> bool
```

Порт как OPEN, НЕ трогая http_status/сервисы (их снимает веб-пробив).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `host` | `Host` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `ip_row` | `не аннотирован` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `port_number` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `bool`.

Прямые операции с БД: `self.db.add`, `self.db.flush`, `self.db.scalar`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Port`
- `and_`
- `select`
- `select(Port).where`
- `self.db.add`
- `self.db.flush`
- `self.db.scalar`

</details>

## PortScanFarmService._persist_scan

[backend/app/farm/portscan.py:146](../../../../../backend/app/farm/portscan.py#L146)

```python
async def _persist_scan(self, project_id: int, targets: dict[str, ParsedTarget], resolved: dict[str, ResolvedHost], scan: dict[str, list[int]], actor_id: int) -> PortScanResult
```

В теле вызывает `PortScanHostResult`, `PortScanResult`, `int`, `len`, `resolved.get`, `result.errors.append`, `result.hosts.append`, `result.model_dump`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `targets` | `dict[str, ParsedTarget]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `resolved` | `dict[str, ResolvedHost]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `scan` | `dict[str, list[int]]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |

Возвращает: `PortScanResult`.

Прямые операции с БД: `self.db.commit`, `self.db.rollback`.

<details>
<summary>Прямые вызовы в теле</summary>

- `PortScanHostResult`
- `PortScanResult`
- `int`
- `len`
- `resolved.get`
- `result.errors.append`
- `result.hosts.append`
- `result.model_dump`
- `scan.get`
- `self._ensure_ips`
- `self._find_or_create_host`
- `self._upsert_scan_port`
- `self.audit.log`
- `self.db.commit`
- `self.db.rollback`
- `str`
- `targets.items`
- `type`
- `ws_manager.broadcast`

</details>

## PortScanFarmService.probe_and_import

[backend/app/farm/portscan.py:200](../../../../../backend/app/farm/portscan.py#L200)

```python
async def probe_and_import(self, project_id: int, raw: str, actor_id: int, *, transport=None, detector=None, skip_targets: list[str] | None=None, scanner: Scanner | None=None) -> PortScanResult
```

В теле вызывает `ValidationError`, `len`, `list`, `resolved.values`, `result.errors.append`, `run`, `self._persist_scan`, `self._resolve_dns`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `raw` | `str` | `обязательный` | Исходное значение до нормализации/разбора. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |
| `transport` | `не аннотирован` | `None` | Определяется именем/типом и контрактом вызывающего кода. |
| `detector` | `не аннотирован` | `None` | Определяется именем/типом и контрактом вызывающего кода. |
| `skip_targets` | `list[str] \| None` | `None` | Определяется именем/типом и контрактом вызывающего кода. |
| `scanner` | `Scanner \| None` | `None` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `PortScanResult`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValidationError(f'Слишком много целей: {len(targets)} (максимум {settings.portscan_max_targets})')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ValidationError`
- `len`
- `list`
- `resolved.values`
- `result.errors.append`
- `run`
- `self._persist_scan`
- `self._resolve_dns`
- `self.parse_targets`
- `set`
- `sorted`
- `sum`
- `targets.items`
- `targets.keys`

</details>

## PortScanFarmService.create_job

[backend/app/farm/portscan.py:237](../../../../../backend/app/farm/portscan.py#L237)

```python
async def create_job(self, project_id: int, raw: str, actor_id: int) -> HostFarmJob
```

В теле вызывает `'\n'.join`, `HostFarmJob`, `ValidationError`, `len`, `list`, `self._project_targets`, `self.db.add`, `self.db.commit`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `raw` | `str` | `обязательный` | Исходное значение до нормализации/разбора. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |

Возвращает: `HostFarmJob`.

Прямые операции с БД: `self.db.add`, `self.db.commit`, `self.db.refresh`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValidationError('Не удалось распознать ни одной цели для скана портов')
ValidationError(f'Слишком много целей: {len(target_keys)} (максимум {settings.portscan_max_targets})')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `'\n'.join`
- `HostFarmJob`
- `ValidationError`
- `len`
- `list`
- `self._project_targets`
- `self.db.add`
- `self.db.commit`
- `self.db.refresh`
- `self.parse_targets`

</details>

## PortScanFarmService.get_job

[backend/app/farm/portscan.py:259](../../../../../backend/app/farm/portscan.py#L259)

```python
async def get_job(self, project_id: int, job_id: int) -> HostFarmJob
```

В теле вызывает `NotFoundError`, `and_`, `select`, `select(HostFarmJob).where`, `self.db.scalar`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `job_id` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `HostFarmJob`.

Прямые операции с БД: `self.db.scalar`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
NotFoundError('Задача scanner не найдена')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `NotFoundError`
- `and_`
- `select`
- `select(HostFarmJob).where`
- `self.db.scalar`

</details>
