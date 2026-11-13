# backend/app/ws_manager.py

Сгенерировано из объявлений кода. [Правила чтения](../../../METHODS.md).

Методов и именованных функций: **10**.

## ConnectionManager.__init__

[backend/app/ws_manager.py:9](../../../../backend/app/ws_manager.py#L9)

```python
def __init__(self) -> None
```

Создаёт экземпляр и сохраняет его зависимости; параметры перечислены ниже.

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `defaultdict`
- `set`

</details>

## ConnectionManager.connect

[backend/app/ws_manager.py:14](../../../../backend/app/ws_manager.py#L14)

```python
async def connect(self, project_id: int, websocket: WebSocket) -> None
```

Принимает соединение и регистрирует его в комнате проекта.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `websocket` | `WebSocket` | `обязательный` | Активное соединение Starlette WebSocket. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `self.rooms[project_id].add`
- `websocket.accept`

</details>

## ConnectionManager.disconnect

[backend/app/ws_manager.py:19](../../../../backend/app/ws_manager.py#L19)

```python
def disconnect(self, project_id: int, websocket: WebSocket) -> None
```

Удаляет соединение из комнаты проекта.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `websocket` | `WebSocket` | `обязательный` | Активное соединение Starlette WebSocket. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `self.rooms.pop`
- `self.rooms[project_id].discard`

</details>

## ConnectionManager.connect_projects_index

[backend/app/ws_manager.py:25](../../../../backend/app/ws_manager.py#L25)

```python
async def connect_projects_index(self, websocket: WebSocket) -> None
```

Подключает сокет к общему каналу списка проектов.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `websocket` | `WebSocket` | `обязательный` | Активное соединение Starlette WebSocket. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `self.projects_index_sockets.add`
- `websocket.accept`

</details>

## ConnectionManager.disconnect_projects_index

[backend/app/ws_manager.py:30](../../../../backend/app/ws_manager.py#L30)

```python
def disconnect_projects_index(self, websocket: WebSocket) -> None
```

Удаляет сокет из общего канала списка проектов.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `websocket` | `WebSocket` | `обязательный` | Активное соединение Starlette WebSocket. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `self.projects_index_sockets.discard`

</details>

## ConnectionManager.connect_user

[backend/app/ws_manager.py:34](../../../../backend/app/ws_manager.py#L34)

```python
async def connect_user(self, user_id: int, websocket: WebSocket) -> None
```

Подключает сокет к персональному каналу уведомлений пользователя.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `user_id` | `int` | `обязательный` | ID пользователя. |
| `websocket` | `WebSocket` | `обязательный` | Активное соединение Starlette WebSocket. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `self.user_sockets[user_id].add`
- `websocket.accept`

</details>

## ConnectionManager.disconnect_user

[backend/app/ws_manager.py:39](../../../../backend/app/ws_manager.py#L39)

```python
def disconnect_user(self, user_id: int, websocket: WebSocket) -> None
```

Удаляет сокет из персонального канала пользователя.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `user_id` | `int` | `обязательный` | ID пользователя. |
| `websocket` | `WebSocket` | `обязательный` | Активное соединение Starlette WebSocket. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `self.user_sockets.pop`
- `self.user_sockets[user_id].discard`

</details>

## ConnectionManager.broadcast

[backend/app/ws_manager.py:45](../../../../backend/app/ws_manager.py#L45)

```python
async def broadcast(self, project_id: int, payload: dict) -> None
```

Рассылает событие всем активным подключениям комнаты.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `payload` | `dict` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `self.disconnect`
- `self.rooms.get`
- `stale.append`
- `tuple`
- `ws.send_json`

</details>

## ConnectionManager.notify_user

[backend/app/ws_manager.py:59](../../../../backend/app/ws_manager.py#L59)

```python
async def notify_user(self, user_id: int, payload: dict) -> None
```

Рассылает персональное уведомление в персональный и проектные каналы пользователя.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `user_id` | `int` | `обязательный` | ID пользователя. |
| `payload` | `dict` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `getattr`
- `list`
- `self.disconnect`
- `self.disconnect_user`
- `self.rooms.items`
- `self.user_sockets.get`
- `stale.append`
- `stale_user_sockets.append`
- `tuple`
- `ws.send_json`

</details>

## ConnectionManager.broadcast_projects_index

[backend/app/ws_manager.py:81](../../../../backend/app/ws_manager.py#L81)

```python
async def broadcast_projects_index(self, payload: dict) -> None
```

Рассылает событие всем открытым страницам списка проектов.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `payload` | `dict` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `self.disconnect_projects_index`
- `set`
- `stale.append`
- `ws.send_json`

</details>
