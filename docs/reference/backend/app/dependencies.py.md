# backend/app/dependencies.py

Сгенерировано из объявлений кода. [Правила чтения](../../../METHODS.md).

Методов и именованных функций: **10**.

## get_client_ip

[backend/app/dependencies.py:34](../../../../backend/app/dependencies.py#L34)

```python
def get_client_ip(request: Request) -> str | None
```

Возвращает IP клиента из запроса.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `request` | `Request` | `обязательный` | HTTP-запрос Starlette/FastAPI. |

Возвращает: `str \| None`.

## enforce_csrf

[backend/app/dependencies.py:41](../../../../backend/app/dependencies.py#L41)

```python
async def enforce_csrf(request: Request, origin: str | None=Header(default=None, alias='Origin')) -> None
```

Проверяет Origin для state-changing запросов.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `request` | `Request` | `обязательный` | HTTP-запрос Starlette/FastAPI. |
| `origin` | `str \| None` | `Header(default=None, alias='Origin')` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ForbiddenError('Недопустимый Origin')
ForbiddenError('Отсутствует заголовок Origin')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ForbiddenError`
- `request.method.upper`

</details>

## get_current_user

[backend/app/dependencies.py:51](../../../../backend/app/dependencies.py#L51)

```python
async def get_current_user(db: AsyncSession=Depends(get_db), access_token: str | None=Cookie(default=None)) -> User
```

Извлекает текущего пользователя из access cookie.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |
| `access_token` | `str \| None` | `Cookie(default=None)` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `User`.

Dependencies: `get_db`.

Прямые операции с БД: `db.scalar`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
UnauthorizedError('Пользователь не найден или деактивирован')
UnauthorizedError('Требуется авторизация')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `UnauthorizedError`
- `db.scalar`
- `decode_token`
- `select`
- `select(User).where`

</details>

## require_admin

[backend/app/dependencies.py:65](../../../../backend/app/dependencies.py#L65)

```python
async def require_admin(current_user: User=Depends(get_current_user)) -> User
```

Проверяет, что текущий пользователь является администратором.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |

Возвращает: `User`.

Dependencies: `get_current_user`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ForbiddenError('Недостаточно прав')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ForbiddenError`

</details>

## require_project_access

[backend/app/dependencies.py:72](../../../../backend/app/dependencies.py#L72)

```python
async def require_project_access(project_id: int, db: AsyncSession=Depends(get_db), current_user: User=Depends(get_current_user)) -> Project
```

Проверяет, что пользователь имеет доступ к проекту.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |

Возвращает: `Project`.

Dependencies: `get_db`, `get_current_user`.

Прямые операции с БД: `db.scalar`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ForbiddenError('Нет доступа к проекту')
ForbiddenError('Проект не найден или недоступен')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ForbiddenError`
- `and_`
- `db.scalar`
- `select`
- `select(Project).where`
- `select(ProjectMember).where`

</details>

## role_in

[backend/app/dependencies.py:96](../../../../backend/app/dependencies.py#L96)

```python
def role_in(user: User, allowed: Iterable[UserRole]) -> bool
```

Проверяет принадлежность роли пользователя допустимому набору.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `user` | `User` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `allowed` | `Iterable[UserRole]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `bool`.

## get_agent_token_context

[backend/app/dependencies.py:101](../../../../backend/app/dependencies.py#L101)

```python
async def get_agent_token_context(authorization: str | None=Header(default=None, alias='Authorization'), db: AsyncSession=Depends(get_db)) -> AgentTokenContext
```

Проверяет Bearer-токен `/api/v2` и возвращает его scopes/project grants.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `authorization` | `str \| None` | `Header(default=None, alias='Authorization')` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `AgentTokenContext`.

Dependencies: `get_db`.

Прямые операции с БД: `db.commit`, `db.scalar`, `db.scalars`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
UnauthorizedError('Agent API token истёк')
UnauthorizedError('Agent API token недействителен')
UnauthorizedError('Владелец agent token не найден или деактивирован')
UnauthorizedError('Требуется Bearer token')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `(await db.scalars(select(AgentApiTokenProjectGrant.project_id).where(AgentApiTokenProjectGrant.token_id == token_id))).all`
- `(await db.scalars(select(ProjectMember.project_id).where(ProjectMember.user_id == created_by))).all`
- `AgentTokenContext`
- `UnauthorizedError`
- `authorization.removeprefix`
- `authorization.removeprefix('Bearer ').strip`
- `authorization.startswith`
- `datetime.now`
- `db.commit`
- `db.scalar`
- `db.scalars`
- `hash_agent_token`
- `select`
- `select(AgentApiToken).where`
- `select(AgentApiTokenProjectGrant.project_id).where`
- `select(ProjectMember.project_id).where`
- `select(User).where`
- `set`

</details>

## require_agent_scope

[backend/app/dependencies.py:153](../../../../backend/app/dependencies.py#L153)

```python
def require_agent_scope(scope: str) -> не аннотирован
```

Преобразование/вычисление в теле функции; тип результата и параметры приведены ниже, точное выражение доступно по ссылке на исходник.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `scope` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `не аннотирован`.

## require_agent_scope.dependency

[backend/app/dependencies.py:154](../../../../backend/app/dependencies.py#L154)

```python
async def dependency(context: AgentTokenContext=Depends(get_agent_token_context)) -> AgentTokenContext
```

В теле вызывает `ForbiddenError`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `context` | `AgentTokenContext` | `Depends(get_agent_token_context)` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `AgentTokenContext`.

Dependencies: `get_agent_token_context`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ForbiddenError(f'Недостаточно прав agent token: требуется {scope}')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ForbiddenError`

</details>

## require_agent_project_access

[backend/app/dependencies.py:162](../../../../backend/app/dependencies.py#L162)

```python
async def require_agent_project_access(project_id: int, context: AgentTokenContext=Depends(get_agent_token_context), db: AsyncSession=Depends(get_db)) -> Project
```

В теле вызывает `ForbiddenError`, `db.scalar`, `select`, `select(Project).where`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `context` | `AgentTokenContext` | `Depends(get_agent_token_context)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `Project`.

Dependencies: `get_agent_token_context`, `get_db`.

Прямые операции с БД: `db.scalar`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ForbiddenError('Agent token не имеет доступа к проекту')
ForbiddenError('Проект не найден или недоступен')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ForbiddenError`
- `db.scalar`
- `select`
- `select(Project).where`

</details>
