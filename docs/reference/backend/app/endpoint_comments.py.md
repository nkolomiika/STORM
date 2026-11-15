# backend/app/endpoint_comments.py

Сгенерировано из объявлений кода. [Правила чтения](../../../METHODS.md).

Методов и именованных функций: **5**.

## EndpointCommentService.__init__

[backend/app/endpoint_comments.py:12](../../../../backend/app/endpoint_comments.py#L12)

```python
def __init__(self, db: AsyncSession) -> None
```

Создаёт экземпляр и сохраняет его зависимости; параметры перечислены ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `db` | `AsyncSession` | `обязательный` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `None`.

## EndpointCommentService._ensure_endpoint

[backend/app/endpoint_comments.py:15](../../../../backend/app/endpoint_comments.py#L15)

```python
async def _ensure_endpoint(self, project_id: int, host_id: int, endpoint_id: int) -> None
```

Проверяет всю цепочку project → host → endpoint без загрузки дерева.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `host_id` | `int` | `обязательный` | ID родительского хоста. |
| `endpoint_id` | `int` | `обязательный` | ID эндпоинта. |

Возвращает: `None`.

Прямые операции с БД: `self.db.scalar`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
NotFoundError('Endpoint не найден')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `NotFoundError`
- `select`
- `select(Endpoint.id).join`
- `select(Endpoint.id).join(Host, Host.id == Endpoint.host_id).where`
- `self.db.scalar`

</details>

## EndpointCommentService._out

[backend/app/endpoint_comments.py:25](../../../../backend/app/endpoint_comments.py#L25)

```python
def _out(comment: EndpointComment, user: User) -> EndpointCommentOut
```

В теле вызывает `EndpointCommentOut`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `comment` | `EndpointComment` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `user` | `User` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `EndpointCommentOut`.

<details>
<summary>Прямые вызовы в теле</summary>

- `EndpointCommentOut`

</details>

## EndpointCommentService.list

[backend/app/endpoint_comments.py:32](../../../../backend/app/endpoint_comments.py#L32)

```python
async def list(self, project_id: int, host_id: int, endpoint_id: int, page: int, size: int) -> tuple[list[EndpointCommentOut], int]
```

Страница обсуждения, новые записи первыми; авторы читаются одним JOIN.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `host_id` | `int` | `обязательный` | ID родительского хоста. |
| `endpoint_id` | `int` | `обязательный` | ID эндпоинта. |
| `page` | `int` | `обязательный` | Номер страницы, начиная с 1. |
| `size` | `int` | `обязательный` | Число элементов страницы; верхняя граница задаётся маршрутом. |

Возвращает: `tuple[list[EndpointCommentOut], int]`.

Прямые операции с БД: `self.db.execute`, `self.db.scalar`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(await self.db.execute(select(EndpointComment, User).join(User, User.id == EndpointComment.user_id).where(EndpointComment.endpoint_id == endpoint_id).order_by(EndpointComment.created_at.desc(), EndpointComment.id.desc()).offset((page - 1) * size).limit(size))).all`
- `EndpointComment.created_at.desc`
- `EndpointComment.id.desc`
- `func.count`
- `select`
- `select(EndpointComment, User).join`
- `select(EndpointComment, User).join(User, User.id == EndpointComment.user_id).where`
- `select(EndpointComment, User).join(User, User.id == EndpointComment.user_id).where(EndpointComment.endpoint_id == endpoint_id).order_by`
- `select(EndpointComment, User).join(User, User.id == EndpointComment.user_id).where(EndpointComment.endpoint_id == endpoint_id).order_by(EndpointComment.created_at.desc(), EndpointComment.id.desc()).offset`
- `select(EndpointComment, User).join(User, User.id == EndpointComment.user_id).where(EndpointComment.endpoint_id == endpoint_id).order_by(EndpointComment.created_at.desc(), EndpointComment.id.desc()).offset((page - 1) * size).limit`
- `select(func.count()).select_from`
- `select(func.count()).select_from(EndpointComment).where`
- `self._ensure_endpoint`
- `self._out`
- `self.db.execute`
- `self.db.scalar`

</details>

## EndpointCommentService.create

[backend/app/endpoint_comments.py:44](../../../../backend/app/endpoint_comments.py#L44)

```python
async def create(self, project_id: int, host_id: int, endpoint_id: int, content: str, actor: User) -> EndpointCommentOut
```

Сохраняет комментарий и его аудит одной транзакцией.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `host_id` | `int` | `обязательный` | ID родительского хоста. |
| `endpoint_id` | `int` | `обязательный` | ID эндпоинта. |
| `content` | `str` | `обязательный` | Текст содержимого; формат определяется вызывающим сервисом. |
| `actor` | `User` | `обязательный` | Авторизованный инициатор операции. |

Возвращает: `EndpointCommentOut`.

Прямые операции с БД: `self.db.add`, `self.db.commit`, `self.db.flush`, `self.db.refresh`.

<details>
<summary>Прямые вызовы в теле</summary>

- `AuditLog`
- `EndpointComment`
- `notification_events.publish`
- `notification_events.queue_mentions`
- `self._ensure_endpoint`
- `self._out`
- `self.db.add`
- `self.db.commit`
- `self.db.flush`
- `self.db.refresh`
- `str`

</details>
