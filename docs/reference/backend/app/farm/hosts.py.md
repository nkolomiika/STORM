# backend/app/farm/hosts.py

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **15**.

## HostFarmService.__init__

[backend/app/farm/hosts.py:42](../../../../../backend/app/farm/hosts.py#L42)

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

## HostFarmService._candidates_for

[backend/app/farm/hosts.py:51](../../../../../backend/app/farm/hosts.py#L51)

```python
def _candidates_for(self, tgt: ParsedTarget) -> list[ProbeCandidate]
```

В теле вызывает `core.candidates_for`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `tgt` | `ParsedTarget` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `list[ProbeCandidate]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `core.candidates_for`

</details>

## HostFarmService._resolve_dns

[backend/app/farm/hosts.py:56](../../../../../backend/app/farm/hosts.py#L56)

```python
async def _resolve_dns(self, hostnames: list[str]) -> dict[str, ResolvedHost]
```

В теле вызывает `resolve_forward`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `hostnames` | `list[str]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `dict[str, ResolvedHost]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `resolve_forward`

</details>

## HostFarmService._probe_all

[backend/app/farm/hosts.py:61](../../../../../backend/app/farm/hosts.py#L61)

```python
async def _probe_all(self, targets: dict[str, ParsedTarget], resolved: dict[str, ResolvedHost], *, transport=None) -> list[ProbeResult]
```

В теле вызывает `candidates.extend`, `core.probe_candidates`, `resolved.get`, `self._candidates_for`, `targets.items`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `targets` | `dict[str, ParsedTarget]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `resolved` | `dict[str, ResolvedHost]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `transport` | `не аннотирован` | `None` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `list[ProbeResult]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `candidates.extend`
- `core.probe_candidates`
- `resolved.get`
- `self._candidates_for`
- `targets.items`

</details>

## HostFarmService._find_or_create_host

[backend/app/farm/hosts.py:78](../../../../../backend/app/farm/hosts.py#L78)

```python
async def _find_or_create_host(self, project_id: int, tgt: ParsedTarget, r: ResolvedHost | None, status: HostStatus) -> tuple[Host, bool]
```

В теле вызывает `Host`, `and_`, `select`, `select(Host).options`, `select(Host).options(selectinload(Host.ip_addresses)).where`, `selectinload`, `self.db.add`, `self.db.flush`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `tgt` | `ParsedTarget` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `r` | `ResolvedHost \| None` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `status` | `HostStatus` | `обязательный` | Статус операции/ресурса; допустимые значения задаёт Enum или схема. |

Возвращает: `tuple[Host, bool]`.

Прямые операции с БД: `self.db.add`, `self.db.flush`, `self.db.scalar`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Host`
- `and_`
- `select`
- `select(Host).options`
- `select(Host).options(selectinload(Host.ip_addresses)).where`
- `selectinload`
- `self.db.add`
- `self.db.flush`
- `self.db.scalar`
- `set_committed_value`

</details>

## HostFarmService._ensure_ips

[backend/app/farm/hosts.py:106](../../../../../backend/app/farm/hosts.py#L106)

```python
async def _ensure_ips(self, host: Host, ips: list[str]) -> HostIpAddress | None
```

Заводит адреса хоста, сохраняя primary и существующие порты.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `host` | `Host` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `ips` | `list[str]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `HostIpAddress \| None`.

Прямые операции с БД: `self.db.add`, `self.db.flush`.

<details>
<summary>Прямые вызовы в теле</summary>

- `HostIpAddress`
- `any`
- `enumerate`
- `host.ip_addresses.append`
- `next`
- `self.db.add`
- `self.db.flush`
- `set_committed_value`

</details>

## HostFarmService._upsert_port

[backend/app/farm/hosts.py:128](../../../../../backend/app/farm/hosts.py#L128)

```python
async def _upsert_port(self, host: Host, ip_row: HostIpAddress, p: ProbeResult, state: PortState, techs: list[Tech] | None=None) -> bool
```

В теле вызывает `Port`, `and_`, `select`, `select(Port).where`, `self._replace_services`, `self.db.add`, `self.db.flush`, `self.db.scalar`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `host` | `Host` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `ip_row` | `HostIpAddress` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `p` | `ProbeResult` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `state` | `PortState` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `techs` | `list[Tech] \| None` | `None` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `bool`.

Прямые операции с БД: `self.db.add`, `self.db.flush`, `self.db.scalar`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Port`
- `and_`
- `select`
- `select(Port).where`
- `self._replace_services`
- `self.db.add`
- `self.db.flush`
- `self.db.scalar`

</details>

## HostFarmService._replace_services

[backend/app/farm/hosts.py:163](../../../../../backend/app/farm/hosts.py#L163)

```python
async def _replace_services(self, port: Port, techs: list[Tech] | None) -> None
```

Заменяет технологии порта на свежедетектированные.

techs=None — детект не запускался (whatweb выключен/недоступен): сервисы не
трогаем. techs=[] — детект прошёл, но ничего не нашёл: чистим (порт станет
«unknown»). Удаляем bulk-DELETE по port_id, не читая port.services —
ленивая загрузка связи в async-сессии упала бы с MissingGreenlet.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `port` | `Port` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `techs` | `list[Tech] \| None` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

Прямые операции с БД: `self.db.add`, `self.db.execute`, `self.db.flush`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Service`
- `delete`
- `delete(Service).where`
- `self.db.add`
- `self.db.execute`
- `self.db.flush`

</details>

## HostFarmService._write_ports

[backend/app/farm/hosts.py:178](../../../../../backend/app/farm/hosts.py#L178)

```python
async def _write_ports(self, host: Host, ip_row: HostIpAddress, probes: list[ProbeResult], techs_by_port: dict[tuple[str, int], list[Tech]]) -> tuple[list[HostFarmPortResult], int, int]
```

Пишет порты (общий код фермы хостов и IP): явные — всегда, выведенные —
только ответившие. Возвращает (результаты для ответа, created, updated).

techs=None у портов, для которых детект не запускался (не ответили / whatweb
выключен), — в _replace_services их сервисы не трогаем.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `host` | `Host` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `ip_row` | `HostIpAddress` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `probes` | `list[ProbeResult]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `techs_by_port` | `dict[tuple[str, int], list[Tech]]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `tuple[list[HostFarmPortResult], int, int]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `HostFarmPortResult`
- `int`
- `results.append`
- `self._upsert_port`
- `techs_by_port.get`

</details>

## HostFarmService._persist

[backend/app/farm/hosts.py:214](../../../../../backend/app/farm/hosts.py#L214)

```python
async def _persist(self, project_id: int, targets: dict[str, ParsedTarget], resolved: dict[str, ResolvedHost], probes: list[ProbeResult], actor_id: int, techs_by_port: dict[tuple[str, int], list[Tech]] | None=None) -> HostFarmResult
```

В теле вызывает `HostFarmHostResult`, `HostFarmResult`, `any`, `int`, `probes_by_host.get`, `probes_by_host.setdefault`, `probes_by_host.setdefault(p.hostname, []).append`, `resolved.get`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `targets` | `dict[str, ParsedTarget]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `resolved` | `dict[str, ResolvedHost]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `probes` | `list[ProbeResult]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |
| `techs_by_port` | `dict[tuple[str, int], list[Tech]] \| None` | `None` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `HostFarmResult`.

Прямые операции с БД: `self.db.commit`, `self.db.rollback`.

<details>
<summary>Прямые вызовы в теле</summary>

- `HostFarmHostResult`
- `HostFarmResult`
- `any`
- `int`
- `probes_by_host.get`
- `probes_by_host.setdefault`
- `probes_by_host.setdefault(p.hostname, []).append`
- `resolved.get`
- `result.errors.append`
- `result.hosts.append`
- `result.model_dump`
- `self._ensure_ips`
- `self._find_or_create_host`
- `self._write_ports`
- `self.audit.log`
- `self.db.commit`
- `self.db.rollback`
- `str`
- `targets.items`
- `type`
- `ws_manager.broadcast`

</details>

## HostFarmService.probe_and_import

[backend/app/farm/hosts.py:291](../../../../../backend/app/farm/hosts.py#L291)

```python
async def probe_and_import(self, project_id: int, raw: str, actor_id: int, *, transport=None, detector=None, skip_targets: list[str] | None=None, resolve_ips: bool=True) -> HostFarmResult
```

В теле вызывает `'\n'.join`, `IpFarmService`, `IpFarmService(self.db).probe_and_import`, `ValidationError`, `core.trim_excess_ports`, `detect_services`, `len`, `list`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `raw` | `str` | `обязательный` | Исходное значение до нормализации/разбора. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |
| `transport` | `не аннотирован` | `None` | Определяется именем/типом и контрактом вызывающего кода. |
| `detector` | `не аннотирован` | `None` | Определяется именем/типом и контрактом вызывающего кода. |
| `skip_targets` | `list[str] \| None` | `None` | Определяется именем/типом и контрактом вызывающего кода. |
| `resolve_ips` | `bool` | `True` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `HostFarmResult`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValidationError(f'Слишком много хостов: {len(targets)} (максимум {settings.farm_max_targets})')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `'\n'.join`
- `IpFarmService`
- `IpFarmService(self.db).probe_and_import`
- `ValidationError`
- `core.trim_excess_ports`
- `detect_services`
- `len`
- `list`
- `parse_errors.extend`
- `resolved.get`
- `resolved.values`
- `result.errors.extend`
- `self._persist`
- `self._probe_all`
- `self._resolve_dns`
- `self.parse_targets`
- `set`
- `sorted`
- `sum`
- `targets.items`
- `targets.keys`

</details>

## HostFarmService._existing_target_keys

[backend/app/farm/hosts.py:353](../../../../../backend/app/farm/hosts.py#L353)

```python
async def _existing_target_keys(self, project_id: int, targets: dict[str, ParsedTarget]) -> set[str]
```

Ключи целей, уже присутствующих в проекте (те же предикаты, что у
_find_or_create_host): домен — по hostname, IP-литерал — по ip_address.

Единственное обращение к БД, и оно синхронное в запросе (create_job),
поэтому конкурентного входа в сессию нет.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `targets` | `dict[str, ParsedTarget]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `set[str]`.

Прямые операции с БД: `self.db.scalars`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Host.hostname.in_`
- `Host.ip_address.in_`
- `and_`
- `existing.update`
- `rows.all`
- `select`
- `select(Host.hostname).where`
- `select(Host.ip_address).where`
- `self.db.scalars`
- `set`
- `targets.items`

</details>

## HostFarmService._ensure_skeletons

[backend/app/farm/hosts.py:379](../../../../../backend/app/farm/hosts.py#L379)

```python
async def _ensure_skeletons(self, project_id: int, targets: dict[str, ParsedTarget], existing: set[str]) -> None
```

Заводит хосты-заготовки (status unknown) сразу, чтобы список показался
мгновенно; статус/порты подтянет фоновый пробив. Уже добавленные (existing)
не трогаем — их и не пробиваем: повторный импорт их пропускает.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `targets` | `dict[str, ParsedTarget]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `existing` | `set[str]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

Прямые операции с БД: `self.db.add`, `self.db.commit`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Host`
- `self.db.add`
- `self.db.commit`
- `targets.items`

</details>

## HostFarmService.create_job

[backend/app/farm/hosts.py:399](../../../../../backend/app/farm/hosts.py#L399)

```python
async def create_job(self, project_id: int, raw: str, actor_id: int) -> HostFarmJob
```

В теле вызывает `HostFarmJob`, `HostFarmResult`, `HostFarmResult(hosts_skipped=len(existing)).model_dump`, `ValidationError`, `datetime.now`, `len`, `self._ensure_skeletons`, `self._existing_target_keys`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `raw` | `str` | `обязательный` | Исходное значение до нормализации/разбора. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |

Возвращает: `HostFarmJob`.

Прямые операции с БД: `self.db.add`, `self.db.commit`, `self.db.refresh`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValidationError('Не удалось распознать ни одного хоста')
ValidationError(f'Слишком много хостов: {len(targets)} (максимум {settings.farm_max_targets})')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `HostFarmJob`
- `HostFarmResult`
- `HostFarmResult(hosts_skipped=len(existing)).model_dump`
- `ValidationError`
- `datetime.now`
- `len`
- `self._ensure_skeletons`
- `self._existing_target_keys`
- `self.db.add`
- `self.db.commit`
- `self.db.refresh`
- `self.parse_targets`
- `sorted`

</details>

## HostFarmService.get_job

[backend/app/farm/hosts.py:431](../../../../../backend/app/farm/hosts.py#L431)

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
