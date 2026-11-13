# backend/app/routers/websocket.py

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **5**.

## _wait_for_disconnect

[backend/app/routers/websocket.py:17](../../../../../backend/app/routers/websocket.py#L17)

```python
async def _wait_for_disconnect(websocket: WebSocket) -> None
```

Accept text/binary keepalives; a binary frame must not leak a connection.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `websocket` | `WebSocket` | `обязательный` | Активное соединение Starlette WebSocket. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `websocket.receive`

</details>

## _authenticate_websocket_user

[backend/app/routers/websocket.py:28](../../../../../backend/app/routers/websocket.py#L28)

```python
async def _authenticate_websocket_user(websocket: WebSocket) -> User | None
```

В теле вызывает `SessionLocal`, `db.scalar`, `decode_token`, `get_settings`, `getattr`, `getattr(websocket, 'headers', {}).get`, `select`, `select(User).where`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `websocket` | `WebSocket` | `обязательный` | Активное соединение Starlette WebSocket. |

Возвращает: `User \| None`.

Прямые операции с БД: `db.scalar`.

<details>
<summary>Прямые вызовы в теле</summary>

- `SessionLocal`
- `db.scalar`
- `decode_token`
- `get_settings`
- `getattr`
- `getattr(websocket, 'headers', {}).get`
- `select`
- `select(User).where`
- `setattr`
- `websocket.close`
- `websocket.cookies.get`

</details>

## projects_index_ws

[backend/app/routers/websocket.py:55](../../../../../backend/app/routers/websocket.py#L55)

```python
async def projects_index_ws(websocket: WebSocket) -> None
```

Общий WebSocket-канал списка проектов для real-time обновлений.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `websocket` | `WebSocket` | `обязательный` | Активное соединение Starlette WebSocket. |

Возвращает: `None`.

Маршруты:

```python
router.websocket('/ws/projects-index')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `_authenticate_websocket_user`
- `_wait_for_disconnect`
- `ws_manager.connect_projects_index`
- `ws_manager.disconnect_projects_index`

</details>

## notifications_ws

[backend/app/routers/websocket.py:69](../../../../../backend/app/routers/websocket.py#L69)

```python
async def notifications_ws(websocket: WebSocket) -> None
```

Персональный WebSocket-канал уведомлений текущего пользователя.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `websocket` | `WebSocket` | `обязательный` | Активное соединение Starlette WebSocket. |

Возвращает: `None`.

Маршруты:

```python
router.websocket('/ws/notifications')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `_authenticate_websocket_user`
- `_wait_for_disconnect`
- `ws_manager.connect_user`
- `ws_manager.disconnect_user`

</details>

## project_ws

[backend/app/routers/websocket.py:83](../../../../../backend/app/routers/websocket.py#L83)

```python
async def project_ws(websocket: WebSocket, project_id: int) -> None
```

WebSocket-канал проекта с авторизацией по access cookie.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `websocket` | `WebSocket` | `обязательный` | Активное соединение Starlette WebSocket. |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |

Возвращает: `None`.

Маршруты:

```python
router.websocket('/ws/projects/{project_id}')
```

Прямые операции с БД: `db.scalar`.

<details>
<summary>Прямые вызовы в теле</summary>

- `SessionLocal`
- `_authenticate_websocket_user`
- `_wait_for_disconnect`
- `and_`
- `db.scalar`
- `select`
- `select(ProjectMember).where`
- `websocket.close`
- `ws_manager.connect`
- `ws_manager.disconnect`

</details>
