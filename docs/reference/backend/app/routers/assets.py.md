# backend/app/routers/assets.py

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **27**.

## list_host_creation_times

[backend/app/routers/assets.py:39](../../../../../backend/app/routers/assets.py#L39)

```python
async def list_host_creation_times(project_id: int, _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> list[datetime]
```

Даты создания всех хостов для графиков без IP, портов и эндпоинтов.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `list[datetime]`.

Dependencies: `require_project_access`, `get_db`.

Маршруты:

```python
router.get('/projects/{project_id}/host-creation-times', response_model=list[datetime])
```

<details>
<summary>Прямые вызовы в теле</summary>

- `AssetService`
- `AssetService(db).list_host_creation_times`

</details>

## list_hosts

[backend/app/routers/assets.py:49](../../../../../backend/app/routers/assets.py#L49)

```python
async def list_hosts(project_id: int, page: int=Query(1, ge=1), size: int=Query(20, ge=1, le=200), status_filter: HostStatus | None=Query(None, alias='status'), origin: str=Query('host', pattern='^(host|ip|all)$'), _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> PaginatedResponse[HostOut]
```

Возвращает список хостов проекта.

По умолчанию только origin=host: служебные родители адресов из фермы IP
в списке хостов не показываются. all — нужен фронту, чтобы одним запросом
наполнить и таблицу хостов, и таблицу IP.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `page` | `int` | `Query(1, ge=1)` | Номер страницы, начиная с 1. |
| `size` | `int` | `Query(20, ge=1, le=200)` | Число элементов страницы; верхняя граница задаётся маршрутом. |
| `status_filter` | `HostStatus \| None` | `Query(None, alias='status')` | Определяется именем/типом и контрактом вызывающего кода. |
| `origin` | `str` | `Query('host', pattern='^(host\|ip\|all)$')` | Определяется именем/типом и контрактом вызывающего кода. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `PaginatedResponse[HostOut]`.

Dependencies: `require_project_access`, `get_db`.

Маршруты:

```python
router.get('/projects/{project_id}/hosts', response_model=PaginatedResponse[HostOut])
```

<details>
<summary>Прямые вызовы в теле</summary>

- `AssetService`
- `AssetService(db).list_hosts`
- `HostOut.model_validate`
- `PageParams`
- `to_paginated_response`

</details>

## create_host

[backend/app/routers/assets.py:69](../../../../../backend/app/routers/assets.py#L69)

```python
async def create_host(project_id: int, payload: HostCreate, background_tasks: BackgroundTasks, _: None=Depends(enforce_csrf), current_user: User=Depends(get_current_user), _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> HostOut
```

Создаёт хост; probe=true запускает защищённую пробивку через очередь рекон-фермы.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `payload` | `HostCreate` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `background_tasks` | `BackgroundTasks` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `HostOut`.

Dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

Маршруты:

```python
router.post('/projects/{project_id}/hosts', response_model=HostOut, status_code=status.HTTP_201_CREATED)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `AssetService`
- `AssetService(db).create_host`
- `HostOut.model_validate`
- `payload.model_dump`

</details>

## get_host

[backend/app/routers/assets.py:84](../../../../../backend/app/routers/assets.py#L84)

```python
async def get_host(project_id: int, host_id: int, _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> dict
```

Возвращает хост с вложенными сущностями.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `host_id` | `int` | `обязательный` | ID родительского хоста. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `dict`.

Dependencies: `require_project_access`, `get_db`.

Маршруты:

```python
router.get('/projects/{project_id}/hosts/{host_id}')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `AssetService`
- `AssetService(db).get_host`

</details>

## update_host

[backend/app/routers/assets.py:95](../../../../../backend/app/routers/assets.py#L95)

```python
async def update_host(project_id: int, host_id: int, payload: HostUpdate, _: None=Depends(enforce_csrf), current_user: User=Depends(get_current_user), _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> HostOut
```

Обновляет хост.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `host_id` | `int` | `обязательный` | ID родительского хоста. |
| `payload` | `HostUpdate` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `HostOut`.

Dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

Маршруты:

```python
router.put('/projects/{project_id}/hosts/{host_id}', response_model=HostOut)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `AssetService`
- `AssetService(db).update_host`
- `HostOut.model_validate`
- `payload.model_dump`

</details>

## delete_host

[backend/app/routers/assets.py:110](../../../../../backend/app/routers/assets.py#L110)

```python
async def delete_host(project_id: int, host_id: int, _: None=Depends(enforce_csrf), current_user: User=Depends(get_current_user), _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> None
```

Удаляет хост.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `host_id` | `int` | `обязательный` | ID родительского хоста. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `None`.

Dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

Маршруты:

```python
router.delete('/projects/{project_id}/hosts/{host_id}', status_code=status.HTTP_204_NO_CONTENT)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `AssetService`
- `AssetService(db).delete_host`

</details>

## change_ip_address

[backend/app/routers/assets.py:124](../../../../../backend/app/routers/assets.py#L124)

```python
async def change_ip_address(project_id: int, old_ip: str, payload: IpAddressChangeRequest, background_tasks: BackgroundTasks, _: None=Depends(enforce_csrf), current_user: User=Depends(get_current_user), _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> dict
```

Обновляет IP проекта и ставит повторный пробив после сброса старых замеров.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `old_ip` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `payload` | `IpAddressChangeRequest` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `background_tasks` | `BackgroundTasks` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `dict`.

Dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

Маршруты:

```python
router.put('/projects/{project_id}/ip-addresses/{old_ip}', response_model=IpAddressChangeOut, status_code=status.HTTP_202_ACCEPTED)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `AssetService`
- `AssetService(db).change_ip_address`
- `enqueue_job`

</details>

## list_hidden_ips

[backend/app/routers/assets.py:141](../../../../../backend/app/routers/assets.py#L141)

```python
async def list_hidden_ips(project_id: int, _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> list[str]
```

Адреса, скрытые из списка IP этого проекта (фронт фильтрует по ним).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `list[str]`.

Dependencies: `require_project_access`, `get_db`.

Маршруты:

```python
router.get('/projects/{project_id}/hidden-ips', response_model=list[str])
```

<details>
<summary>Прямые вызовы в теле</summary>

- `AssetService`
- `AssetService(db).list_hidden_ips`

</details>

## hide_ip

[backend/app/routers/assets.py:151](../../../../../backend/app/routers/assets.py#L151)

```python
async def hide_ip(project_id: int, payload: HiddenIpCreate, _: None=Depends(enforce_csrf), current_user: User=Depends(get_current_user), _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> None
```

Скрывает адрес из списка IP: сносит отдельную IP-запись (origin='ip') с этим
адресом, но привязку к домен-хостам сохраняет.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `payload` | `HiddenIpCreate` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `None`.

Dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

Маршруты:

```python
router.post('/projects/{project_id}/hidden-ips', status_code=status.HTTP_204_NO_CONTENT)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `AssetService`
- `AssetService(db).hide_ip`

</details>

## unhide_ip

[backend/app/routers/assets.py:165](../../../../../backend/app/routers/assets.py#L165)

```python
async def unhide_ip(project_id: int, ip_address: str, _: None=Depends(enforce_csrf), current_user: User=Depends(get_current_user), _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> None
```

Снимает адрес со скрытия — снова показывается в списке IP.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `ip_address` | `str` | `обязательный` | IP-адрес; в AuditService — адрес клиента. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `None`.

Dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

Маршруты:

```python
router.delete('/projects/{project_id}/hidden-ips/{ip_address}', status_code=status.HTTP_204_NO_CONTENT)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `AssetService`
- `AssetService(db).unhide_ip`

</details>

## list_ports

[backend/app/routers/assets.py:178](../../../../../backend/app/routers/assets.py#L178)

```python
async def list_ports(project_id: int, host_id: int, _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> list[PortOut]
```

Возвращает список портов хоста.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `host_id` | `int` | `обязательный` | ID родительского хоста. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `list[PortOut]`.

Dependencies: `require_project_access`, `get_db`.

Маршруты:

```python
router.get('/projects/{project_id}/hosts/{host_id}/ports', response_model=list[PortOut])
```

<details>
<summary>Прямые вызовы в теле</summary>

- `AssetService`
- `AssetService(db).list_ports`
- `PortOut.model_validate`

</details>

## create_port

[backend/app/routers/assets.py:190](../../../../../backend/app/routers/assets.py#L190)

```python
async def create_port(project_id: int, host_id: int, payload: PortCreate, _: None=Depends(enforce_csrf), current_user: User=Depends(get_current_user), _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> PortOut
```

Создаёт порт хоста.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `host_id` | `int` | `обязательный` | ID родительского хоста. |
| `payload` | `PortCreate` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `PortOut`.

Dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

Маршруты:

```python
router.post('/projects/{project_id}/hosts/{host_id}/ports', response_model=PortOut, status_code=status.HTTP_201_CREATED)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `AssetService`
- `AssetService(db).create_port`
- `PortOut.model_validate`
- `payload.model_dump`

</details>

## get_port

[backend/app/routers/assets.py:205](../../../../../backend/app/routers/assets.py#L205)

```python
async def get_port(project_id: int, host_id: int, port_id: int, _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> PortOut
```

Возвращает порт.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `host_id` | `int` | `обязательный` | ID родительского хоста. |
| `port_id` | `int` | `обязательный` | ID родительского порта. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `PortOut`.

Dependencies: `require_project_access`, `get_db`.

Маршруты:

```python
router.get('/projects/{project_id}/hosts/{host_id}/ports/{port_id}', response_model=PortOut)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `AssetService`
- `AssetService(db).get_port`
- `PortOut.model_validate`

</details>

## update_port

[backend/app/routers/assets.py:218](../../../../../backend/app/routers/assets.py#L218)

```python
async def update_port(project_id: int, host_id: int, port_id: int, payload: PortUpdate, _: None=Depends(enforce_csrf), current_user: User=Depends(get_current_user), _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> PortOut
```

Обновляет порт.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `host_id` | `int` | `обязательный` | ID родительского хоста. |
| `port_id` | `int` | `обязательный` | ID родительского порта. |
| `payload` | `PortUpdate` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `PortOut`.

Dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

Маршруты:

```python
router.put('/projects/{project_id}/hosts/{host_id}/ports/{port_id}', response_model=PortOut)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `AssetService`
- `AssetService(db).update_port`
- `PortOut.model_validate`
- `payload.model_dump`

</details>

## delete_port

[backend/app/routers/assets.py:234](../../../../../backend/app/routers/assets.py#L234)

```python
async def delete_port(project_id: int, host_id: int, port_id: int, _: None=Depends(enforce_csrf), current_user: User=Depends(get_current_user), _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> None
```

Удаляет порт.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `host_id` | `int` | `обязательный` | ID родительского хоста. |
| `port_id` | `int` | `обязательный` | ID родительского порта. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `None`.

Dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

Маршруты:

```python
router.delete('/projects/{project_id}/hosts/{host_id}/ports/{port_id}', status_code=status.HTTP_204_NO_CONTENT)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `AssetService`
- `AssetService(db).delete_port`

</details>

## list_services

[backend/app/routers/assets.py:248](../../../../../backend/app/routers/assets.py#L248)

```python
async def list_services(project_id: int, host_id: int, port_id: int, _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> list[ServiceOut]
```

Возвращает список сервисов порта.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `host_id` | `int` | `обязательный` | ID родительского хоста. |
| `port_id` | `int` | `обязательный` | ID родительского порта. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `list[ServiceOut]`.

Dependencies: `require_project_access`, `get_db`.

Маршруты:

```python
router.get('/projects/{project_id}/hosts/{host_id}/ports/{port_id}/services', response_model=list[ServiceOut])
```

<details>
<summary>Прямые вызовы в теле</summary>

- `AssetService`
- `AssetService(db).list_services`
- `ServiceOut.model_validate`

</details>

## create_service

[backend/app/routers/assets.py:265](../../../../../backend/app/routers/assets.py#L265)

```python
async def create_service(project_id: int, host_id: int, port_id: int, payload: ServiceCreate, _: None=Depends(enforce_csrf), current_user: User=Depends(get_current_user), _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> ServiceOut
```

Создаёт сервис.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `host_id` | `int` | `обязательный` | ID родительского хоста. |
| `port_id` | `int` | `обязательный` | ID родительского порта. |
| `payload` | `ServiceCreate` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `ServiceOut`.

Dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

Маршруты:

```python
router.post('/projects/{project_id}/hosts/{host_id}/ports/{port_id}/services', response_model=ServiceOut, status_code=status.HTTP_201_CREATED)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `AssetService`
- `AssetService(db).create_service`
- `ServiceOut.model_validate`
- `payload.model_dump`

</details>

## update_service

[backend/app/routers/assets.py:281](../../../../../backend/app/routers/assets.py#L281)

```python
async def update_service(project_id: int, host_id: int, port_id: int, service_id: int, payload: ServiceUpdate, _: None=Depends(enforce_csrf), current_user: User=Depends(get_current_user), _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> ServiceOut
```

Обновляет сервис.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `host_id` | `int` | `обязательный` | ID родительского хоста. |
| `port_id` | `int` | `обязательный` | ID родительского порта. |
| `service_id` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `payload` | `ServiceUpdate` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `ServiceOut`.

Dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

Маршруты:

```python
router.put('/projects/{project_id}/hosts/{host_id}/ports/{port_id}/services/{service_id}', response_model=ServiceOut)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `AssetService`
- `AssetService(db).update_service`
- `ServiceOut.model_validate`
- `payload.model_dump`

</details>

## delete_service

[backend/app/routers/assets.py:305](../../../../../backend/app/routers/assets.py#L305)

```python
async def delete_service(project_id: int, host_id: int, port_id: int, service_id: int, _: None=Depends(enforce_csrf), current_user: User=Depends(get_current_user), _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> None
```

Удаляет сервис.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `host_id` | `int` | `обязательный` | ID родительского хоста. |
| `port_id` | `int` | `обязательный` | ID родительского порта. |
| `service_id` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `None`.

Dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

Маршруты:

```python
router.delete('/projects/{project_id}/hosts/{host_id}/ports/{port_id}/services/{service_id}', status_code=status.HTTP_204_NO_CONTENT)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `AssetService`
- `AssetService(db).delete_service`

</details>

## list_js_files

[backend/app/routers/assets.py:320](../../../../../backend/app/routers/assets.py#L320)

```python
async def list_js_files(project_id: int, page: int=Query(1, ge=1), size: int=Query(200, ge=1, le=1000), _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> PaginatedResponse[JsFileOut]
```

JS-файлы проекта с находками (пагинация) — раздел JS группирует по хосту на фронте.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `page` | `int` | `Query(1, ge=1)` | Номер страницы, начиная с 1. |
| `size` | `int` | `Query(200, ge=1, le=1000)` | Число элементов страницы; верхняя граница задаётся маршрутом. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `PaginatedResponse[JsFileOut]`.

Dependencies: `require_project_access`, `get_db`.

Маршруты:

```python
router.get('/projects/{project_id}/js-files', response_model=PaginatedResponse[JsFileOut])
```

<details>
<summary>Прямые вызовы в теле</summary>

- `AssetService`
- `AssetService(db).list_js_files`
- `JsFileOut.model_validate`
- `PageParams`
- `to_paginated_response`

</details>

## bulk_delete_js_files

[backend/app/routers/assets.py:336](../../../../../backend/app/routers/assets.py#L336)

```python
async def bulk_delete_js_files(project_id: int, payload: JsBulkDeleteRequest, _: None=Depends(enforce_csrf), current_user: User=Depends(get_current_user), _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> dict
```

Удаляет JS-находки проекта по списку id. Отдаёт {"deleted": N}.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `payload` | `JsBulkDeleteRequest` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `dict`.

Dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

Маршруты:

```python
router.post('/projects/{project_id}/js-files/bulk-delete', response_model=dict)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `AssetService`
- `AssetService(db).bulk_delete_js_files`

</details>

## delete_js_for_host

[backend/app/routers/assets.py:352](../../../../../backend/app/routers/assets.py#L352)

```python
async def delete_js_for_host(project_id: int, host_id: int, _: None=Depends(enforce_csrf), current_user: User=Depends(get_current_user), _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> None
```

Удаляет все JS-находки одного хоста в проекте.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `host_id` | `int` | `обязательный` | ID родительского хоста. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `None`.

Dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

Маршруты:

```python
router.delete('/projects/{project_id}/js-files/hosts/{host_id}', status_code=status.HTTP_204_NO_CONTENT)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `AssetService`
- `AssetService(db).delete_js_for_host`

</details>

## download_js_archive

[backend/app/routers/assets.py:365](../../../../../backend/app/routers/assets.py#L365)

```python
async def download_js_archive(project_id: int, host_id: int | None=Query(None), _project=Depends(require_project_access), _current_user: User=Depends(get_current_user), db: AsyncSession=Depends(get_db)) -> Response
```

Zip-архив найденных .js. Файлы в БД не хранятся — их URL докачиваются по
требованию через тот же SSRF-safe транспорт, что и скан. `host_id` сужает
архив до одного хоста; без него — все домены проекта.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `host_id` | `int \| None` | `Query(None)` | ID родительского хоста. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `_current_user` | `User` | `Depends(get_current_user)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `Response`.

Dependencies: `require_project_access`, `get_current_user`, `get_db`.

Маршруты:

```python
router.get('/projects/{project_id}/js-files/archive')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `JsFarmService`
- `JsFarmService(db).build_archive`
- `Response`
- `content_disposition`

</details>

## list_endpoints

[backend/app/routers/assets.py:384](../../../../../backend/app/routers/assets.py#L384)

```python
async def list_endpoints(project_id: int, host_id: int, _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> list[EndpointOut]
```

Возвращает endpoints хоста.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `host_id` | `int` | `обязательный` | ID родительского хоста. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `list[EndpointOut]`.

Dependencies: `require_project_access`, `get_db`.

Маршруты:

```python
router.get('/projects/{project_id}/hosts/{host_id}/endpoints', response_model=list[EndpointOut])
```

<details>
<summary>Прямые вызовы в теле</summary>

- `AssetService`
- `AssetService(db).list_endpoints`
- `EndpointOut.model_validate`

</details>

## create_endpoint

[backend/app/routers/assets.py:396](../../../../../backend/app/routers/assets.py#L396)

```python
async def create_endpoint(project_id: int, host_id: int, payload: EndpointCreate, _: None=Depends(enforce_csrf), current_user: User=Depends(get_current_user), _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> EndpointOut
```

Создаёт endpoint.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `host_id` | `int` | `обязательный` | ID родительского хоста. |
| `payload` | `EndpointCreate` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `EndpointOut`.

Dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

Маршруты:

```python
router.post('/projects/{project_id}/hosts/{host_id}/endpoints', response_model=EndpointOut, status_code=status.HTTP_201_CREATED)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `AssetService`
- `AssetService(db).create_endpoint`
- `EndpointOut.model_validate`
- `payload.model_dump`

</details>

## update_endpoint

[backend/app/routers/assets.py:411](../../../../../backend/app/routers/assets.py#L411)

```python
async def update_endpoint(project_id: int, host_id: int, endpoint_id: int, payload: EndpointUpdate, _: None=Depends(enforce_csrf), current_user: User=Depends(get_current_user), _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> EndpointOut
```

Обновляет endpoint.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `host_id` | `int` | `обязательный` | ID родительского хоста. |
| `endpoint_id` | `int` | `обязательный` | ID эндпоинта. |
| `payload` | `EndpointUpdate` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `EndpointOut`.

Dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

Маршруты:

```python
router.put('/projects/{project_id}/hosts/{host_id}/endpoints/{endpoint_id}', response_model=EndpointOut)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `AssetService`
- `AssetService(db).update_endpoint`
- `EndpointOut.model_validate`
- `payload.model_dump`

</details>

## delete_endpoint

[backend/app/routers/assets.py:427](../../../../../backend/app/routers/assets.py#L427)

```python
async def delete_endpoint(project_id: int, host_id: int, endpoint_id: int, _: None=Depends(enforce_csrf), current_user: User=Depends(get_current_user), _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> None
```

Удаляет endpoint.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `host_id` | `int` | `обязательный` | ID родительского хоста. |
| `endpoint_id` | `int` | `обязательный` | ID эндпоинта. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `None`.

Dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

Маршруты:

```python
router.delete('/projects/{project_id}/hosts/{host_id}/endpoints/{endpoint_id}', status_code=status.HTTP_204_NO_CONTENT)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `AssetService`
- `AssetService(db).delete_endpoint`

</details>
