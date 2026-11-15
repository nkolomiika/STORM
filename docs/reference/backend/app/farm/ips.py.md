# backend/app/farm/ips.py

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **7**.

## IpFarmService.parse_ip_targets

[backend/app/farm/ips.py:46](../../../../../backend/app/farm/ips.py#L46)

```python
def parse_ip_targets(raw: str) -> tuple[dict[str, ParsedTarget], list[str]]
```

Как parse_targets, но имена хостов отклоняются с подсказкой.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `raw` | `str` | `обязательный` | Исходное значение до нормализации/разбора. |

Возвращает: `tuple[dict[str, ParsedTarget], list[str]]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `core.parse_targets`
- `errors.append`
- `targets.items`

</details>

## IpFarmService._existing_target_keys

[backend/app/farm/ips.py:59](../../../../../backend/app/farm/ips.py#L59)

```python
async def _existing_target_keys(self, project_id: int, targets: dict[str, ParsedTarget]) -> set[str]
```

Адреса, уже заведённые строкой origin='ip' (те же предикаты, что у
_find_or_attach_host). Доменные хосты, чей адрес совпал, не в счёт: ферма
IP держит свои замеры на своих origin='ip' строках, повторным считается
только уже импортированный тем же способом адрес.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `targets` | `dict[str, ParsedTarget]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `set[str]`.

Прямые операции с БД: `self.db.scalars`.

<details>
<summary>Прямые вызовы в теле</summary>

- `HostIpAddress.ip_address.in_`
- `and_`
- `list`
- `rows.all`
- `select`
- `select(HostIpAddress.ip_address).join`
- `select(HostIpAddress.ip_address).join(Host, Host.id == HostIpAddress.host_id).where`
- `self.db.scalars`
- `set`
- `targets.keys`

</details>

## IpFarmService._load_project_hostnames

[backend/app/farm/ips.py:80](../../../../../backend/app/farm/ips.py#L80)

```python
async def _load_project_hostnames(self, project_id: int) -> list[str]
```

Имена хостов проекта — для перекрёстной сверки в обратном резолве.

Единственное обращение к БД до фазы записи, и оно выполняется ДО любого
gather: конкурентно входить в async-сессию нельзя.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |

Возвращает: `list[str]`.

Прямые операции с БД: `self.db.scalars`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Host.hostname.isnot`
- `and_`
- `rows.all`
- `select`
- `select(Host.hostname).where`
- `self.db.scalars`

</details>

## IpFarmService._find_or_attach_host

[backend/app/farm/ips.py:95](../../../../../backend/app/farm/ips.py#L95)

```python
async def _find_or_attach_host(self, project_id: int, ip: str, names: list[ResolvedName]) -> tuple[Host, bool, bool]
```

Куда положить адрес. Первое совпадение выигрывает:

1. существующий origin='ip' хост с этим адресом → переиспользуем
   (идемпотентный повторный скан);
2. иначе новый Host(origin='ip').

Раньше адрес подшивался к ДОМЕННОМУ хосту (по существующему адресу, по
legacy-зеркалу Host.ip_address, по подтверждённому PTR-имени). Но порты
висят на общем HostIpAddress, а _upsert_port ключуется на ip_address_id,
поэтому пробив по IP затирал порты, снятые пробивом по домену. Пользователь
хочет, чтобы статус по домену и по IP определялся раздельно — поэтому ферма
IP держит свои результаты на СВОИХ origin='ip' хостах и к доменным не
подшивается. Имена в колонке Hostname всё равно показываются: они приходят
из hostnames-JSON (reverse_resolve), а не из привязки портов, поэтому
параметр names здесь больше не нужен для привязки.

Возвращает (host, host_created, attached_to_existing).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `ip` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `names` | `list[ResolvedName]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `tuple[Host, bool, bool]`.

Прямые операции с БД: `self.db.add`, `self.db.flush`, `self.db.scalar`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Host`
- `and_`
- `select`
- `select(Host).options`
- `select(Host).options(selectinload(Host.ip_addresses)).join`
- `select(Host).options(selectinload(Host.ip_addresses)).join(HostIpAddress, HostIpAddress.host_id == Host.id).where`
- `select(Host).options(selectinload(Host.ip_addresses)).join(HostIpAddress, HostIpAddress.host_id == Host.id).where(and_(Host.project_id == project_id, Host.origin == 'ip', HostIpAddress.ip_address == ip)).order_by`
- `selectinload`
- `self.db.add`
- `self.db.flush`
- `self.db.scalar`
- `set_committed_value`

</details>

## IpFarmService._persist_ips

[backend/app/farm/ips.py:144](../../../../../backend/app/farm/ips.py#L144)

```python
async def _persist_ips(self, project_id: int, targets: dict[str, ParsedTarget], resolved: dict[str, ResolvedHost], reverse: dict[str, ReverseResult], probes: list[ProbeResult], actor_id: int, techs_by_port: dict[tuple[str, int], list[Tech]] | None=None) -> IpFarmResult
```

В теле вызывает `IpFarmIpResult`, `IpFarmResult`, `ReverseResult`, `RuntimeError`, `any`, `int`, `len`, `n.as_dict`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `targets` | `dict[str, ParsedTarget]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `resolved` | `dict[str, ResolvedHost]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `reverse` | `dict[str, ReverseResult]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `probes` | `list[ProbeResult]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |
| `techs_by_port` | `dict[tuple[str, int], list[Tech]] \| None` | `None` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `IpFarmResult`.

Прямые операции с БД: `self.db.commit`, `self.db.rollback`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
RuntimeError('не удалось завести адрес')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `IpFarmIpResult`
- `IpFarmResult`
- `ReverseResult`
- `RuntimeError`
- `any`
- `int`
- `len`
- `n.as_dict`
- `probes_by_ip.get`
- `probes_by_ip.setdefault`
- `probes_by_ip.setdefault(p.hostname, []).append`
- `resolved.get`
- `result.errors.append`
- `result.ips.append`
- `result.model_dump`
- `reverse.get`
- `self._ensure_ips`
- `self._find_or_attach_host`
- `self._write_ports`
- `self.audit.log`
- `self.db.commit`
- `self.db.rollback`
- `str`
- `type`
- `ws_manager.broadcast`

</details>

## IpFarmService.probe_and_import

[backend/app/farm/ips.py:236](../../../../../backend/app/farm/ips.py#L236)

```python
async def probe_and_import(self, project_id: int, raw: str, actor_id: int, *, transport=None, detector=None, skip_targets: list[str] | None=None, resolve_hosts: bool=True) -> IpFarmResult
```

В теле вызывает `'\n'.join`, `HostFarmService.probe_and_import`, `ValidationError`, `core.trim_excess_ports`, `detect_services`, `len`, `list`, `parse_errors.extend`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `raw` | `str` | `обязательный` | Исходное значение до нормализации/разбора. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |
| `transport` | `не аннотирован` | `None` | Определяется именем/типом и контрактом вызывающего кода. |
| `detector` | `не аннотирован` | `None` | Определяется именем/типом и контрактом вызывающего кода. |
| `skip_targets` | `list[str] \| None` | `None` | Определяется именем/типом и контрактом вызывающего кода. |
| `resolve_hosts` | `bool` | `True` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `IpFarmResult`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValidationError(f'Слишком много IP: {len(targets)} (максимум {settings.farm_max_targets})')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `'\n'.join`
- `HostFarmService.probe_and_import`
- `ValidationError`
- `core.trim_excess_ports`
- `detect_services`
- `len`
- `list`
- `parse_errors.extend`
- `resolved.values`
- `result.errors.extend`
- `reverse.values`
- `reverse_resolve`
- `self._load_project_hostnames`
- `self._persist_ips`
- `self._probe_all`
- `self._resolve_dns`
- `self.parse_ip_targets`
- `set`
- `sorted`
- `sum`
- `targets.items`
- `targets.keys`

</details>

## IpFarmService.create_job

[backend/app/farm/ips.py:293](../../../../../backend/app/farm/ips.py#L293)

```python
async def create_job(self, project_id: int, raw: str, actor_id: int, *, force: bool=False, commit: bool=True) -> HostFarmJob
```

В теле вызывает `HostFarmJob`, `IpFarmResult`, `IpFarmResult(ips_skipped=len(existing)).model_dump`, `ProjectHiddenIp.ip_address.in_`, `ValidationError`, `and_`, `datetime.now`, `delete`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `raw` | `str` | `обязательный` | Исходное значение до нормализации/разбора. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |
| `force` | `bool` | `False` | Определяется именем/типом и контрактом вызывающего кода. |
| `commit` | `bool` | `True` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `HostFarmJob`.

Прямые операции с БД: `self.db.add`, `self.db.commit`, `self.db.execute`, `self.db.flush`, `self.db.refresh`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValidationError('Не удалось распознать ни одного IP-адреса')
ValidationError(f'Слишком много IP: {len(targets)} (максимум {settings.farm_max_targets})')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `HostFarmJob`
- `IpFarmResult`
- `IpFarmResult(ips_skipped=len(existing)).model_dump`
- `ProjectHiddenIp.ip_address.in_`
- `ValidationError`
- `and_`
- `datetime.now`
- `delete`
- `delete(ProjectHiddenIp).where`
- `len`
- `list`
- `self._existing_target_keys`
- `self.db.add`
- `self.db.commit`
- `self.db.execute`
- `self.db.flush`
- `self.db.refresh`
- `self.parse_ip_targets`
- `set`
- `sorted`
- `targets.keys`

</details>
