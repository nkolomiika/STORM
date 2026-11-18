# backend/app/project_status_sync.py

Сгенерировано из объявлений кода. [Правила чтения](../../../METHODS.md).

Методов и именованных функций: **4**.

## project_status_for_task

[backend/app/project_status_sync.py:20](../../../../backend/app/project_status_sync.py#L20)

```python
def project_status_for_task(task: dict) -> ProjectStatus | None
```

Сопоставляет код/название APPSEC с шестью состояниями STORM; неизвестное сохраняет.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `task` | `dict` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `ProjectStatus \| None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `aliases.items`
- `re.sub`
- `re.sub('[\\s_-]+', ' ', str(value or '').casefold().replace('ё', 'е')).strip`
- `str`
- `str(value or '').casefold`
- `str(value or '').casefold().replace`
- `task.get`

</details>

## sync_project_statuses

[backend/app/project_status_sync.py:38](../../../../backend/app/project_status_sync.py#L38)

```python
async def sync_project_statuses(db: AsyncSession, tasks: list[dict]) -> int
```

Меняет только связанные проекты; условный UPDATE защищает от повторных фоновых событий.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `db` | `AsyncSession` | `обязательный` | Асинхронная SQLAlchemy-сессия текущего запроса. |
| `tasks` | `list[dict]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `int`.

Прямые операции с БД: `db.commit`, `db.execute`, `db.scalars`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(await db.scalars(select(Project).where(Project.appsec_ticket_key.in_(mapped)))).all`
- `AuditService`
- `AuditService(db).log`
- `Project.appsec_ticket_key.in_`
- `ProjectService`
- `ProjectService(db)._notify_project_status_changed`
- `changed.append`
- `datetime.now`
- `db.commit`
- `db.execute`
- `db.scalars`
- `len`
- `list`
- `logger.info`
- `mapped.items`
- `project_status_for_task`
- `select`
- `select(Project).where`
- `str`
- `task.get`
- `update`
- `update(Project).where`
- `update(Project).where(Project.id == project.id, Project.status == old, Project.appsec_ticket_key == project.appsec_ticket_key).values`
- `ws_manager.broadcast`
- `ws_manager.broadcast_projects_index`

</details>

## project_status_sync_loop

[backend/app/project_status_sync.py:71](../../../../backend/app/project_status_sync.py#L71)

```python
async def project_status_sync_loop(session_factory) -> None
```

Раз в минуту использует общий кэш APPSEC; без привязанных проектов внешних запросов нет.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `session_factory` | `не аннотирован` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

Прямые операции с БД: `db.rollback`, `db.scalars`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(await db.scalars(select(Project.appsec_ticket_key).where(Project.appsec_ticket_key.is_not(None)))).all`
- `Project.appsec_ticket_key.is_not`
- `TaskTrackerService`
- `TaskTrackerService()._snapshot`
- `asyncio.Semaphore`
- `asyncio.gather`
- `asyncio.sleep`
- `db.rollback`
- `db.scalars`
- `get_settings`
- `len`
- `logger.warning`
- `read_status`
- `select`
- `select(Project.appsec_ticket_key).where`
- `session_factory`
- `set`
- `sorted`
- `sync_project_statuses`
- `type`

</details>

## project_status_sync_loop.read_status

[backend/app/project_status_sync.py:94](../../../../backend/app/project_status_sync.py#L94)

```python
async def read_status(key: str) -> dict | None
```

В теле вызывает `TaskTrackerService`, `TaskTrackerService().get_task`, `logger.warning`, `type`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `key` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `dict \| None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `TaskTrackerService`
- `TaskTrackerService().get_task`
- `logger.warning`
- `type`

</details>
