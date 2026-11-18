# backend/app/notification_events.py

Сгенерировано из объявлений кода. [Правила чтения](../../../METHODS.md).

Методов и именованных функций: **9**.

## notification_cutoff

[backend/app/notification_events.py:18](../../../../backend/app/notification_events.py#L18)

```python
def notification_cutoff(now: datetime | None=None) -> datetime
```

Нижняя граница семи суток хранения, время UTC.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `now` | `datetime \| None` | `None` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `datetime`.

<details>
<summary>Прямые вызовы в теле</summary>

- `datetime.now`

</details>

## delete_expired_notifications

[backend/app/notification_events.py:23](../../../../backend/app/notification_events.py#L23)

```python
async def delete_expired_notifications(db, now: datetime | None=None, batch_size: int=1000) -> int
```

Удаляет ограниченную порцию старых уведомлений; транзакцию завершает вызывающий код.

SKIP LOCKED позволяет нескольким процессам обслуживания не ждать друг друга.
Индекс created_at ограничивает чтение старыми строками; новые записи сохраняются.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `db` | `не аннотирован` | `обязательный` | Асинхронная SQLAlchemy-сессия текущего запроса. |
| `now` | `datetime \| None` | `None` | Определяется именем/типом и контрактом вызывающего кода. |
| `batch_size` | `int` | `1000` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `int`.

Прямые операции с БД: `db.execute`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Notification.id.in_`
- `db.execute`
- `delete`
- `delete(Notification).where`
- `notification_cutoff`
- `select`
- `select(Notification.id).where`
- `select(Notification.id).where(Notification.created_at < notification_cutoff(now)).order_by`
- `select(Notification.id).where(Notification.created_at < notification_cutoff(now)).order_by(Notification.created_at, Notification.id).limit`
- `select(Notification.id).where(Notification.created_at < notification_cutoff(now)).order_by(Notification.created_at, Notification.id).limit(batch_size).with_for_update`

</details>

## queue_vulnerability_created

[backend/app/notification_events.py:36](../../../../backend/app/notification_events.py#L36)

```python
async def queue_vulnerability_created(db, project_id: int, vulnerability_id: int, actor_id: int) -> list[Notification]
```

Уведомляет активных участников проекта о новой находке, исключая автора.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `db` | `не аннотирован` | `обязательный` | Асинхронная SQLAlchemy-сессия текущего запроса. |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `vulnerability_id` | `int` | `обязательный` | ID уязвимости. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |

Возвращает: `list[Notification]`.

Прямые операции с БД: `db.add_all`, `db.scalars`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Notification`
- `User.is_active.is_`
- `User.is_locked.is_`
- `db.add_all`
- `db.scalars`
- `list`
- `select`
- `select(User.id).join`
- `select(User.id).join(ProjectMember, ProjectMember.user_id == User.id).where`

</details>

## mentioned_names

[backend/app/notification_events.py:50](../../../../backend/app/notification_events.py#L50)

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

[backend/app/notification_events.py:62](../../../../backend/app/notification_events.py#L62)

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

[backend/app/notification_events.py:73](../../../../backend/app/notification_events.py#L73)

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

[backend/app/notification_events.py:96](../../../../backend/app/notification_events.py#L96)

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

[backend/app/notification_events.py:105](../../../../backend/app/notification_events.py#L105)

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

[backend/app/notification_events.py:125](../../../../backend/app/notification_events.py#L125)

```python
async def deadline_loop(sessions, interval: float=60) -> None
```

Каждую минуту очищает старые уведомления и проверяет сроки проектов.

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
- `delete_expired_notifications`
- `generate_deadline_notifications`
- `logger.exception`
- `logger.info`
- `publish`
- `sessions`

</details>
