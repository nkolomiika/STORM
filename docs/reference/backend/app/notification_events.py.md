# backend/app/notification_events.py

Сгенерировано из объявлений кода. [Правила чтения](../../../METHODS.md).

Методов и именованных функций: **6**.

## mentioned_names

[backend/app/notification_events.py:17](../../../../backend/app/notification_events.py#L17)

```python
def mentioned_names(content: str, names: list[str]) -> set[str]
```

Match full usernames, Unicode/FIO and explicit @{full name} or @"full name".

Longest names win; email addresses and longer usernames are not mentions.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `content` | `str` | `обязательный` | Текст содержимого; формат определяется вызывающим сервисом. |
| `names` | `list[str]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `set[str]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `'|'.join`
- `match.groups`
- `next`
- `pattern.finditer`
- `re.compile`
- `re.escape`
- `set`
- `sorted`

</details>

## mentioned_users

[backend/app/notification_events.py:29](../../../../backend/app/notification_events.py#L29)

```python
async def mentioned_users(db, project_id: int, content: str) -> list[User]
```

В теле вызывает `(await db.scalars(select(User).outerjoin(ProjectMember, and_(ProjectMember.user_id == User.id, ProjectMember.project_id == project_id)).where(User.is_active.is_(True), User.is_locked.is_(False), or_(ProjectMember.user_id.is_not(None), User.role == UserRole.ADMIN)))).all`, `ProjectMember.user_id.is_not`, `User.is_active.is_`, `User.is_locked.is_`, `and_`, `db.scalars`, `list`, `mentioned_names`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `db` | `не аннотирован` | `обязательный` | Асинхронная SQLAlchemy-сессия текущего запроса. |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `content` | `str` | `обязательный` | Текст содержимого; формат определяется вызывающим сервисом. |

Возвращает: `list[User]`.

Прямые операции с БД: `db.scalars`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(await db.scalars(select(User).outerjoin(ProjectMember, and_(ProjectMember.user_id == User.id, ProjectMember.project_id == project_id)).where(User.is_active.is_(True), User.is_locked.is_(False), or_(ProjectMember.user_id.is_not(None), User.role == UserRole.ADMIN)))).all`
- `ProjectMember.user_id.is_not`
- `User.is_active.is_`
- `User.is_locked.is_`
- `and_`
- `db.scalars`
- `list`
- `mentioned_names`
- `or_`
- `select`
- `select(User).outerjoin`
- `select(User).outerjoin(ProjectMember, and_(ProjectMember.user_id == User.id, ProjectMember.project_id == project_id)).where`

</details>

## queue_mentions

[backend/app/notification_events.py:40](../../../../backend/app/notification_events.py#L40)

```python
async def queue_mentions(db, project_id: int, content: str, actor_id: int, context: dict, *, previous: str='', users=None) -> list[Notification]
```

Queue newly introduced tags in the caller's transaction; publish after commit.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `db` | `не аннотирован` | `обязательный` | Асинхронная SQLAlchemy-сессия текущего запроса. |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `content` | `str` | `обязательный` | Текст содержимого; формат определяется вызывающим сервисом. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |
| `context` | `dict` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `previous` | `str` | `''` | Определяется именем/типом и контрактом вызывающего кода. |
| `users` | `не аннотирован` | `None` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `list[Notification]`.

Прямые операции с БД: `db.add`, `db.execute`, `db.scalar`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(await db.execute(select(Endpoint.path, Endpoint.method, Host.hostname).join(Host, Host.id == Endpoint.host_id).where(Endpoint.id == data['endpoint_id'], Host.project_id == project_id))).one`
- `Notification`
- `bool`
- `data.get`
- `data.update`
- `db.add`
- `db.execute`
- `db.scalar`
- `events.append`
- `mentioned_names`
- `mentioned_users`
- `select`
- `select(Endpoint.path, Endpoint.method, Host.hostname).join`
- `select(Endpoint.path, Endpoint.method, Host.hostname).join(Host, Host.id == Endpoint.host_id).where`
- `select(Project.name).where`
- `select(User.username).where`

</details>

## publish

[backend/app/notification_events.py:63](../../../../backend/app/notification_events.py#L63)

```python
async def publish(events: list[Notification]) -> None
```

A failed socket cannot turn a committed write into HTTP 500.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `events` | `list[Notification]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `logger.exception`
- `str`
- `ws_manager.notify_user`

</details>

## generate_deadline_notifications

[backend/app/notification_events.py:72](../../../../backend/app/notification_events.py#L72)

```python
async def generate_deadline_notifications(db, today: date | None=None) -> list[Notification]
```

Notify active members once per project end date, within two calendar days.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `db` | `не аннотирован` | `обязательный` | Асинхронная SQLAlchemy-сессия текущего запроса. |
| `today` | `date \| None` | `None` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `list[Notification]`.

Прямые операции с БД: `db.execute`, `db.scalars`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(await db.execute(select(Project.id, Project.name, Project.end_date, User.id).join(ProjectMember, ProjectMember.project_id == Project.id).join(User, User.id == ProjectMember.user_id).where(Project.end_date >= today, Project.end_date <= today + timedelta(days=2), Project.status.notin_([ProjectStatus.COMPLETED, ProjectStatus.ARCHIVED]), User.is_active.is_(True), User.is_locked.is_(False)))).all`
- `(await db.scalars(statement)).all`
- `Project.status.notin_`
- `User.is_active.is_`
- `User.is_locked.is_`
- `datetime.now`
- `datetime.now(UTC).date`
- `db.execute`
- `db.scalars`
- `end_date.isoformat`
- `insert`
- `insert(Notification).values`
- `insert(Notification).values(values).on_conflict_do_nothing`
- `insert(Notification).values(values).on_conflict_do_nothing(index_elements=[Notification.dedupe_key]).returning`
- `list`
- `select`
- `select(Project.id, Project.name, Project.end_date, User.id).join`
- `select(Project.id, Project.name, Project.end_date, User.id).join(ProjectMember, ProjectMember.project_id == Project.id).join`
- `select(Project.id, Project.name, Project.end_date, User.id).join(ProjectMember, ProjectMember.project_id == Project.id).join(User, User.id == ProjectMember.user_id).where`
- `timedelta`

</details>

## deadline_loop

[backend/app/notification_events.py:92](../../../../backend/app/notification_events.py#L92)

```python
async def deadline_loop(sessions, interval: float=60) -> None
```

Catch up after restarts and recheck dates without mail or scan workers.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `sessions` | `не аннотирован` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `interval` | `float` | `60` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

Прямые операции с БД: `db.commit`.

<details>
<summary>Прямые вызовы в теле</summary>

- `asyncio.sleep`
- `db.commit`
- `generate_deadline_notifications`
- `logger.exception`
- `publish`
- `sessions`

</details>
