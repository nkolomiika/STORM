# backend/app/farm/reverse.py

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **6**.

## ReverseFarmService.__init__

[backend/app/farm/reverse.py:33](../../../../../backend/app/farm/reverse.py#L33)

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

## ReverseFarmService._project_ips

[backend/app/farm/reverse.py:37](../../../../../backend/app/farm/reverse.py#L37)

```python
async def _project_ips(self, project_id: int) -> list[str]
```

Адреса, добавленные как IP (origin='ip') — их и резолвим обратно.

Единственное обращение к БД до делегирования; выполняется до gather внутри
фермы IP, поэтому конкурентного входа в сессию нет.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |

Возвращает: `list[str]`.

Прямые операции с БД: `self.db.scalars`.

<details>
<summary>Прямые вызовы в теле</summary>

- `and_`
- `out.append`
- `rows.all`
- `select`
- `select(HostIpAddress.ip_address).join`
- `select(HostIpAddress.ip_address).join(Host, Host.id == HostIpAddress.host_id).where`
- `self.db.scalars`

</details>

## ReverseFarmService._targets

[backend/app/farm/reverse.py:54](../../../../../backend/app/farm/reverse.py#L54)

```python
async def _targets(self, project_id: int, raw: str) -> list[str]
```

Вставленные IP (только литералы) либо, если пусто, все IP проекта.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `raw` | `str` | `обязательный` | Исходное значение до нормализации/разбора. |

Возвращает: `list[str]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `IpFarmService.parse_ip_targets`
- `list`
- `self._project_ips`

</details>

## ReverseFarmService.probe_and_import

[backend/app/farm/reverse.py:59](../../../../../backend/app/farm/reverse.py#L59)

```python
async def probe_and_import(self, project_id: int, raw: str, actor_id: int, *, transport=None, detector=None, skip_targets: list[str] | None=None) -> ReverseFarmResult
```

В теле вызывает `'\n'.join`, `IpFarmService`, `IpFarmService(self.db).probe_and_import`, `ReverseFarmResult`, `len`, `list`, `result.model_dump`, `self._targets`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `raw` | `str` | `обязательный` | Исходное значение до нормализации/разбора. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |
| `transport` | `не аннотирован` | `None` | Определяется именем/типом и контрактом вызывающего кода. |
| `detector` | `не аннотирован` | `None` | Определяется именем/типом и контрактом вызывающего кода. |
| `skip_targets` | `list[str] \| None` | `None` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `ReverseFarmResult`.

<details>
<summary>Прямые вызовы в теле</summary>

- `'\n'.join`
- `IpFarmService`
- `IpFarmService(self.db).probe_and_import`
- `ReverseFarmResult`
- `len`
- `list`
- `result.model_dump`
- `self._targets`
- `self.audit.log`
- `str`
- `ws_manager.broadcast`

</details>

## ReverseFarmService.create_job

[backend/app/farm/reverse.py:103](../../../../../backend/app/farm/reverse.py#L103)

```python
async def create_job(self, project_id: int, raw: str, actor_id: int) -> HostFarmJob
```

В теле вызывает `'\n'.join`, `HostFarmJob`, `ValidationError`, `len`, `self._targets`, `self.db.add`, `self.db.commit`, `self.db.refresh`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `raw` | `str` | `обязательный` | Исходное значение до нормализации/разбора. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |

Возвращает: `HostFarmJob`.

Прямые операции с БД: `self.db.add`, `self.db.commit`, `self.db.refresh`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValidationError('В проекте нет IP-адресов для обратного резолва')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `'\n'.join`
- `HostFarmJob`
- `ValidationError`
- `len`
- `self._targets`
- `self.db.add`
- `self.db.commit`
- `self.db.refresh`

</details>

## ReverseFarmService.get_job

[backend/app/farm/reverse.py:121](../../../../../backend/app/farm/reverse.py#L121)

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
