# backend/app/routers/v2_agent.py

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **21**.

## list_agent_projects

[backend/app/routers/v2_agent.py:23](../../../../../backend/app/routers/v2_agent.py#L23)

```python
async def list_agent_projects(context: AgentTokenContext=Depends(require_agent_scope('projects:read')), db: AsyncSession=Depends(get_db)) -> list[ProjectOut]
```

Обработчик маршрута; контракт запроса и ответа приведён в справочнике HTTP API.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `context` | `AgentTokenContext` | `Depends(require_agent_scope('projects:read'))` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `list[ProjectOut]`.

Dependencies: `require_agent_scope('projects:read')`, `get_db`.

Маршруты:

```python
router.get('/projects', response_model=list[ProjectOut])
```

Прямые операции с БД: `db.scalars`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(await db.scalars(query)).all`
- `Project.created_at.desc`
- `Project.id.in_`
- `ProjectOut.model_validate`
- `db.scalars`
- `query.where`
- `select`
- `select(AgentApiTokenProjectGrant.project_id).where`
- `select(Project).order_by`

</details>

## get_agent_project

[backend/app/routers/v2_agent.py:42](../../../../../backend/app/routers/v2_agent.py#L42)

```python
async def get_agent_project(project_id: int, _scope: AgentTokenContext=Depends(require_agent_scope('projects:read')), project: Project=Depends(require_agent_project_access)) -> ProjectOut
```

Обработчик маршрута; контракт запроса и ответа приведён в справочнике HTTP API.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `_scope` | `AgentTokenContext` | `Depends(require_agent_scope('projects:read'))` | Определяется именем/типом и контрактом вызывающего кода. |
| `project` | `Project` | `Depends(require_agent_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `ProjectOut`.

Dependencies: `require_agent_scope('projects:read')`, `require_agent_project_access`.

Маршруты:

```python
router.get('/projects/{project_id}', response_model=ProjectOut)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ProjectOut.model_validate`

</details>

## list_agent_hosts

[backend/app/routers/v2_agent.py:51](../../../../../backend/app/routers/v2_agent.py#L51)

```python
async def list_agent_hosts(project_id: int, page: int=Query(1, ge=1), size: int=Query(100, ge=1, le=200), origin: str=Query('host', pattern='^(host|ip|all)$'), _scope: AgentTokenContext=Depends(require_agent_scope('assets:read')), _project: Project=Depends(require_agent_project_access), db: AsyncSession=Depends(get_db)) -> dict
```

Обработчик маршрута; контракт запроса и ответа приведён в справочнике HTTP API.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `page` | `int` | `Query(1, ge=1)` | Номер страницы, начиная с 1. |
| `size` | `int` | `Query(100, ge=1, le=200)` | Число элементов страницы; верхняя граница задаётся маршрутом. |
| `origin` | `str` | `Query('host', pattern='^(host\|ip\|all)$')` | Определяется именем/типом и контрактом вызывающего кода. |
| `_scope` | `AgentTokenContext` | `Depends(require_agent_scope('assets:read'))` | Определяется именем/типом и контрактом вызывающего кода. |
| `_project` | `Project` | `Depends(require_agent_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `dict`.

Dependencies: `require_agent_scope('assets:read')`, `require_agent_project_access`, `get_db`.

Маршруты:

```python
router.get('/projects/{project_id}/hosts', response_model=dict)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `AssetService`
- `AssetService(db).list_hosts`
- `HostOut.model_validate`
- `PageParams`
- `to_paginated_response`
- `to_paginated_response([HostOut.model_validate(item) for item in items], total, PageParams(page=page, size=size)).model_dump`

</details>

## get_agent_host

[backend/app/routers/v2_agent.py:65](../../../../../backend/app/routers/v2_agent.py#L65)

```python
async def get_agent_host(project_id: int, host_id: int, _scope: AgentTokenContext=Depends(require_agent_scope('assets:read')), _project: Project=Depends(require_agent_project_access), db: AsyncSession=Depends(get_db)) -> dict
```

Обработчик маршрута; контракт запроса и ответа приведён в справочнике HTTP API.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `host_id` | `int` | `обязательный` | ID родительского хоста. |
| `_scope` | `AgentTokenContext` | `Depends(require_agent_scope('assets:read'))` | Определяется именем/типом и контрактом вызывающего кода. |
| `_project` | `Project` | `Depends(require_agent_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `dict`.

Dependencies: `require_agent_scope('assets:read')`, `require_agent_project_access`, `get_db`.

Маршруты:

```python
router.get('/projects/{project_id}/hosts/{host_id}', response_model=dict)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `AssetService`
- `AssetService(db).get_host`

</details>

## create_agent_host

[backend/app/routers/v2_agent.py:76](../../../../../backend/app/routers/v2_agent.py#L76)

```python
async def create_agent_host(project_id: int, payload: HostCreate, context: AgentTokenContext=Depends(require_agent_scope('assets:write')), _project: Project=Depends(require_agent_project_access), db: AsyncSession=Depends(get_db)) -> HostOut
```

Создаёт хост с IP-адресами без запуска сканеров или DNS-запросов.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `payload` | `HostCreate` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `context` | `AgentTokenContext` | `Depends(require_agent_scope('assets:write'))` | Определяется именем/типом и контрактом вызывающего кода. |
| `_project` | `Project` | `Depends(require_agent_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `HostOut`.

Dependencies: `require_agent_scope('assets:write')`, `require_agent_project_access`, `get_db`.

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

## list_agent_endpoints

[backend/app/routers/v2_agent.py:89](../../../../../backend/app/routers/v2_agent.py#L89)

```python
async def list_agent_endpoints(project_id: int, host_id: int, _scope: AgentTokenContext=Depends(require_agent_scope('assets:read')), _project: Project=Depends(require_agent_project_access), db: AsyncSession=Depends(get_db)) -> list[EndpointOut]
```

Читает эндпоинты хоста, принадлежащего доступному проекту.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `host_id` | `int` | `обязательный` | ID родительского хоста. |
| `_scope` | `AgentTokenContext` | `Depends(require_agent_scope('assets:read'))` | Определяется именем/типом и контрактом вызывающего кода. |
| `_project` | `Project` | `Depends(require_agent_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `list[EndpointOut]`.

Dependencies: `require_agent_scope('assets:read')`, `require_agent_project_access`, `get_db`.

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

## get_agent_endpoint

[backend/app/routers/v2_agent.py:102](../../../../../backend/app/routers/v2_agent.py#L102)

```python
async def get_agent_endpoint(project_id: int, host_id: int, endpoint_id: int, _scope: AgentTokenContext=Depends(require_agent_scope('assets:read')), _project: Project=Depends(require_agent_project_access), db: AsyncSession=Depends(get_db)) -> EndpointOut
```

Читает один эндпоинт с проверкой всей цепочки проект → хост → эндпоинт.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `host_id` | `int` | `обязательный` | ID родительского хоста. |
| `endpoint_id` | `int` | `обязательный` | ID эндпоинта. |
| `_scope` | `AgentTokenContext` | `Depends(require_agent_scope('assets:read'))` | Определяется именем/типом и контрактом вызывающего кода. |
| `_project` | `Project` | `Depends(require_agent_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `EndpointOut`.

Dependencies: `require_agent_scope('assets:read')`, `require_agent_project_access`, `get_db`.

Маршруты:

```python
router.get('/projects/{project_id}/hosts/{host_id}/endpoints/{endpoint_id}', response_model=EndpointOut)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `AssetService`
- `AssetService(db).get_endpoint`
- `EndpointOut.model_validate`

</details>

## create_agent_endpoint

[backend/app/routers/v2_agent.py:115](../../../../../backend/app/routers/v2_agent.py#L115)

```python
async def create_agent_endpoint(project_id: int, host_id: int, payload: EndpointCreate, context: AgentTokenContext=Depends(require_agent_scope('assets:write')), _project: Project=Depends(require_agent_project_access), db: AsyncSession=Depends(get_db)) -> EndpointOut
```

Сохраняет разобранный запрос эндпоинта; сам HTTP-запрос не отправляется.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `host_id` | `int` | `обязательный` | ID родительского хоста. |
| `payload` | `EndpointCreate` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `context` | `AgentTokenContext` | `Depends(require_agent_scope('assets:write'))` | Определяется именем/типом и контрактом вызывающего кода. |
| `_project` | `Project` | `Depends(require_agent_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `EndpointOut`.

Dependencies: `require_agent_scope('assets:write')`, `require_agent_project_access`, `get_db`.

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

## list_agent_ip_addresses

[backend/app/routers/v2_agent.py:129](../../../../../backend/app/routers/v2_agent.py#L129)

```python
async def list_agent_ip_addresses(project_id: int, page: int=Query(1, ge=1), size: int=Query(100, ge=1, le=200), host_id: int | None=Query(None, ge=1), _scope: AgentTokenContext=Depends(require_agent_scope('assets:read')), _project: Project=Depends(require_agent_project_access), db: AsyncSession=Depends(get_db)) -> PaginatedResponse[HostIpAddressOut]
```

Читает страницу всех привязок IP проекта, при необходимости по одному хосту.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `page` | `int` | `Query(1, ge=1)` | Номер страницы, начиная с 1. |
| `size` | `int` | `Query(100, ge=1, le=200)` | Число элементов страницы; верхняя граница задаётся маршрутом. |
| `host_id` | `int \| None` | `Query(None, ge=1)` | ID родительского хоста. |
| `_scope` | `AgentTokenContext` | `Depends(require_agent_scope('assets:read'))` | Определяется именем/типом и контрактом вызывающего кода. |
| `_project` | `Project` | `Depends(require_agent_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `PaginatedResponse[HostIpAddressOut]`.

Dependencies: `require_agent_scope('assets:read')`, `require_agent_project_access`, `get_db`.

Маршруты:

```python
router.get('/projects/{project_id}/ip-addresses', response_model=PaginatedResponse[HostIpAddressOut])
```

<details>
<summary>Прямые вызовы в теле</summary>

- `AssetService`
- `AssetService(db).list_ip_addresses`
- `HostIpAddressOut.model_validate`
- `PageParams`
- `to_paginated_response`

</details>

## get_agent_ip_address

[backend/app/routers/v2_agent.py:144](../../../../../backend/app/routers/v2_agent.py#L144)

```python
async def get_agent_ip_address(project_id: int, ip_id: int, _scope: AgentTokenContext=Depends(require_agent_scope('assets:read')), _project: Project=Depends(require_agent_project_access), db: AsyncSession=Depends(get_db)) -> HostIpAddressOut
```

Читает IP проекта с портами и сервисами без обращения к самому адресу.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `ip_id` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `_scope` | `AgentTokenContext` | `Depends(require_agent_scope('assets:read'))` | Определяется именем/типом и контрактом вызывающего кода. |
| `_project` | `Project` | `Depends(require_agent_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `HostIpAddressOut`.

Dependencies: `require_agent_scope('assets:read')`, `require_agent_project_access`, `get_db`.

Маршруты:

```python
router.get('/projects/{project_id}/ip-addresses/{ip_id}', response_model=HostIpAddressOut)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `AssetService`
- `AssetService(db).get_ip_address`
- `HostIpAddressOut.model_validate`

</details>

## create_agent_ip_address

[backend/app/routers/v2_agent.py:156](../../../../../backend/app/routers/v2_agent.py#L156)

```python
async def create_agent_ip_address(project_id: int, payload: AgentIpAddressCreate, context: AgentTokenContext=Depends(require_agent_scope('assets:write')), _project: Project=Depends(require_agent_project_access), db: AsyncSession=Depends(get_db)) -> HostIpAddressOut
```

Добавляет IPv4/IPv6 к хосту либо отдельным активом, не запуская разведку.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `payload` | `AgentIpAddressCreate` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `context` | `AgentTokenContext` | `Depends(require_agent_scope('assets:write'))` | Определяется именем/типом и контрактом вызывающего кода. |
| `_project` | `Project` | `Depends(require_agent_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `HostIpAddressOut`.

Dependencies: `require_agent_scope('assets:write')`, `require_agent_project_access`, `get_db`.

Маршруты:

```python
router.post('/projects/{project_id}/ip-addresses', response_model=HostIpAddressOut, status_code=status.HTTP_201_CREATED)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `AssetService`
- `AssetService(db).create_ip_address`
- `HostIpAddressOut.model_validate`
- `payload.model_dump`

</details>

## list_agent_credentials

[backend/app/routers/v2_agent.py:169](../../../../../backend/app/routers/v2_agent.py#L169)

```python
async def list_agent_credentials(project_id: int, response: Response, _scope: AgentTokenContext=Depends(require_agent_scope('credentials:read')), _project: Project=Depends(require_agent_project_access), db: AsyncSession=Depends(get_db)) -> list[ProjectCredentialOut]
```

Читает креды только с отдельным scope; запрещает кэширование ответа с паролями.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `response` | `Response` | `обязательный` | HTTP-ответ, в котором могут устанавливаться cookie/заголовки. |
| `_scope` | `AgentTokenContext` | `Depends(require_agent_scope('credentials:read'))` | Определяется именем/типом и контрактом вызывающего кода. |
| `_project` | `Project` | `Depends(require_agent_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `list[ProjectCredentialOut]`.

Dependencies: `require_agent_scope('credentials:read')`, `require_agent_project_access`, `get_db`.

Маршруты:

```python
router.get('/projects/{project_id}/credentials', response_model=list[ProjectCredentialOut])
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ProjectCredentialOut.model_validate`
- `ProjectCredentialService`
- `ProjectCredentialService(db).list_credentials`

</details>

## get_agent_credential

[backend/app/routers/v2_agent.py:182](../../../../../backend/app/routers/v2_agent.py#L182)

```python
async def get_agent_credential(project_id: int, credential_id: int, response: Response, _scope: AgentTokenContext=Depends(require_agent_scope('credentials:read')), _project: Project=Depends(require_agent_project_access), db: AsyncSession=Depends(get_db)) -> ProjectCredentialOut
```

Читает одну учётную запись проекта; ответ с паролем не кэшируется.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `credential_id` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `response` | `Response` | `обязательный` | HTTP-ответ, в котором могут устанавливаться cookie/заголовки. |
| `_scope` | `AgentTokenContext` | `Depends(require_agent_scope('credentials:read'))` | Определяется именем/типом и контрактом вызывающего кода. |
| `_project` | `Project` | `Depends(require_agent_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `ProjectCredentialOut`.

Dependencies: `require_agent_scope('credentials:read')`, `require_agent_project_access`, `get_db`.

Маршруты:

```python
router.get('/projects/{project_id}/credentials/{credential_id}', response_model=ProjectCredentialOut)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ProjectCredentialOut.model_validate`
- `ProjectCredentialService`
- `ProjectCredentialService(db).get_credential`

</details>

## list_agent_notes

[backend/app/routers/v2_agent.py:196](../../../../../backend/app/routers/v2_agent.py#L196)

```python
async def list_agent_notes(project_id: int, _scope: AgentTokenContext=Depends(require_agent_scope('notes:read')), _project: Project=Depends(require_agent_project_access), db: AsyncSession=Depends(get_db)) -> list[ProjectNoteOut]
```

Обработчик маршрута; контракт запроса и ответа приведён в справочнике HTTP API.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `_scope` | `AgentTokenContext` | `Depends(require_agent_scope('notes:read'))` | Определяется именем/типом и контрактом вызывающего кода. |
| `_project` | `Project` | `Depends(require_agent_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `list[ProjectNoteOut]`.

Dependencies: `require_agent_scope('notes:read')`, `require_agent_project_access`, `get_db`.

Маршруты:

```python
router.get('/projects/{project_id}/notes', response_model=list[ProjectNoteOut])
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ProjectNoteOut.model_validate`
- `ProjectNoteService`
- `ProjectNoteService(db).list_notes`

</details>

## get_agent_note

[backend/app/routers/v2_agent.py:207](../../../../../backend/app/routers/v2_agent.py#L207)

```python
async def get_agent_note(project_id: int, note_id: int, _scope: AgentTokenContext=Depends(require_agent_scope('notes:read')), _project: Project=Depends(require_agent_project_access), db: AsyncSession=Depends(get_db)) -> ProjectNoteOut
```

Обработчик маршрута; контракт запроса и ответа приведён в справочнике HTTP API.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `note_id` | `int` | `обязательный` | ID заметки. |
| `_scope` | `AgentTokenContext` | `Depends(require_agent_scope('notes:read'))` | Определяется именем/типом и контрактом вызывающего кода. |
| `_project` | `Project` | `Depends(require_agent_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `ProjectNoteOut`.

Dependencies: `require_agent_scope('notes:read')`, `require_agent_project_access`, `get_db`.

Маршруты:

```python
router.get('/projects/{project_id}/notes/{note_id}', response_model=ProjectNoteOut)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ProjectNoteOut.model_validate`
- `ProjectNoteService`
- `ProjectNoteService(db).get_note`

</details>

## create_agent_note

[backend/app/routers/v2_agent.py:219](../../../../../backend/app/routers/v2_agent.py#L219)

```python
async def create_agent_note(project_id: int, payload: ProjectNoteCreate, context: AgentTokenContext=Depends(require_agent_scope('notes:write')), _project: Project=Depends(require_agent_project_access), db: AsyncSession=Depends(get_db)) -> ProjectNoteOut
```

Обработчик маршрута; контракт запроса и ответа приведён в справочнике HTTP API.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `payload` | `ProjectNoteCreate` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `context` | `AgentTokenContext` | `Depends(require_agent_scope('notes:write'))` | Определяется именем/типом и контрактом вызывающего кода. |
| `_project` | `Project` | `Depends(require_agent_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `ProjectNoteOut`.

Dependencies: `require_agent_scope('notes:write')`, `require_agent_project_access`, `get_db`.

Маршруты:

```python
router.post('/projects/{project_id}/notes', response_model=ProjectNoteOut, status_code=status.HTTP_201_CREATED)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ProjectNoteOut.model_validate`
- `ProjectNoteService`
- `ProjectNoteService(db).create_note`
- `payload.model_dump`

</details>

## update_agent_note

[backend/app/routers/v2_agent.py:231](../../../../../backend/app/routers/v2_agent.py#L231)

```python
async def update_agent_note(project_id: int, note_id: int, payload: ProjectNoteUpdate, context: AgentTokenContext=Depends(require_agent_scope('notes:write')), _project: Project=Depends(require_agent_project_access), db: AsyncSession=Depends(get_db)) -> ProjectNoteOut
```

Обработчик маршрута; контракт запроса и ответа приведён в справочнике HTTP API.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `note_id` | `int` | `обязательный` | ID заметки. |
| `payload` | `ProjectNoteUpdate` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `context` | `AgentTokenContext` | `Depends(require_agent_scope('notes:write'))` | Определяется именем/типом и контрактом вызывающего кода. |
| `_project` | `Project` | `Depends(require_agent_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `ProjectNoteOut`.

Dependencies: `require_agent_scope('notes:write')`, `require_agent_project_access`, `get_db`.

Маршруты:

```python
router.put('/projects/{project_id}/notes/{note_id}', response_model=ProjectNoteOut)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ProjectNoteOut.model_validate`
- `ProjectNoteService`
- `ProjectNoteService(db).update_note`
- `payload.model_dump`

</details>

## list_agent_host_vulnerabilities

[backend/app/routers/v2_agent.py:244](../../../../../backend/app/routers/v2_agent.py#L244)

```python
async def list_agent_host_vulnerabilities(project_id: int, host_id: int, page: int=Query(1, ge=1), size: int=Query(100, ge=1, le=200), _scope: AgentTokenContext=Depends(require_agent_scope('vulns:read')), _project: Project=Depends(require_agent_project_access), db: AsyncSession=Depends(get_db)) -> dict
```

Обработчик маршрута; контракт запроса и ответа приведён в справочнике HTTP API.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `host_id` | `int` | `обязательный` | ID родительского хоста. |
| `page` | `int` | `Query(1, ge=1)` | Номер страницы, начиная с 1. |
| `size` | `int` | `Query(100, ge=1, le=200)` | Число элементов страницы; верхняя граница задаётся маршрутом. |
| `_scope` | `AgentTokenContext` | `Depends(require_agent_scope('vulns:read'))` | Определяется именем/типом и контрактом вызывающего кода. |
| `_project` | `Project` | `Depends(require_agent_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `dict`.

Dependencies: `require_agent_scope('vulns:read')`, `require_agent_project_access`, `get_db`.

Маршруты:

```python
router.get('/projects/{project_id}/hosts/{host_id}/vulnerabilities', response_model=dict)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `PageParams`
- `VulnerabilityOut.model_validate`
- `VulnerabilityService`
- `VulnerabilityService(db).list_for_host`
- `to_paginated_response`
- `to_paginated_response([VulnerabilityOut.model_validate(item) for item in items], total, PageParams(page=page, size=size)).model_dump`

</details>

## get_agent_host_vulnerability

[backend/app/routers/v2_agent.py:258](../../../../../backend/app/routers/v2_agent.py#L258)

```python
async def get_agent_host_vulnerability(project_id: int, host_id: int, vulnerability_id: int, _scope: AgentTokenContext=Depends(require_agent_scope('vulns:read')), _project: Project=Depends(require_agent_project_access), db: AsyncSession=Depends(get_db)) -> VulnerabilityOut
```

Обработчик маршрута; контракт запроса и ответа приведён в справочнике HTTP API.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `host_id` | `int` | `обязательный` | ID родительского хоста. |
| `vulnerability_id` | `int` | `обязательный` | ID уязвимости. |
| `_scope` | `AgentTokenContext` | `Depends(require_agent_scope('vulns:read'))` | Определяется именем/типом и контрактом вызывающего кода. |
| `_project` | `Project` | `Depends(require_agent_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `VulnerabilityOut`.

Dependencies: `require_agent_scope('vulns:read')`, `require_agent_project_access`, `get_db`.

Маршруты:

```python
router.get('/projects/{project_id}/hosts/{host_id}/vulnerabilities/{vulnerability_id}', response_model=VulnerabilityOut)
```

Прямые операции с БД: `db.scalar`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
NotFoundError('Уязвимость не найдена на указанном хосте')
NotFoundError('Хост не принадлежит указанному проекту')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `NotFoundError`
- `VulnerabilityOut.model_validate`
- `VulnerabilityService`
- `VulnerabilityService(db).get`
- `and_`
- `any`
- `db.scalar`
- `select`
- `select(Host.id).where`

</details>

## create_agent_vulnerability

[backend/app/routers/v2_agent.py:279](../../../../../backend/app/routers/v2_agent.py#L279)

```python
async def create_agent_vulnerability(project_id: int, payload: VulnerabilityCreate, context: AgentTokenContext=Depends(require_agent_scope('vulns:write')), _project: Project=Depends(require_agent_project_access), db: AsyncSession=Depends(get_db)) -> VulnerabilityOut
```

Обработчик маршрута; контракт запроса и ответа приведён в справочнике HTTP API.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `payload` | `VulnerabilityCreate` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `context` | `AgentTokenContext` | `Depends(require_agent_scope('vulns:write'))` | Определяется именем/типом и контрактом вызывающего кода. |
| `_project` | `Project` | `Depends(require_agent_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `VulnerabilityOut`.

Dependencies: `require_agent_scope('vulns:write')`, `require_agent_project_access`, `get_db`.

Маршруты:

```python
router.post('/projects/{project_id}/vulnerabilities', response_model=VulnerabilityOut, status_code=status.HTTP_201_CREATED)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `VulnerabilityOut.model_validate`
- `VulnerabilityService`
- `VulnerabilityService(db).create`
- `payload.model_dump`

</details>

## update_agent_vulnerability

[backend/app/routers/v2_agent.py:291](../../../../../backend/app/routers/v2_agent.py#L291)

```python
async def update_agent_vulnerability(project_id: int, vuln_id: int, payload: VulnerabilityUpdate, context: AgentTokenContext=Depends(require_agent_scope('vulns:write')), _project: Project=Depends(require_agent_project_access), db: AsyncSession=Depends(get_db)) -> VulnerabilityOut
```

Обработчик маршрута; контракт запроса и ответа приведён в справочнике HTTP API.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `vuln_id` | `int` | `обязательный` | ID уязвимости. |
| `payload` | `VulnerabilityUpdate` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `context` | `AgentTokenContext` | `Depends(require_agent_scope('vulns:write'))` | Определяется именем/типом и контрактом вызывающего кода. |
| `_project` | `Project` | `Depends(require_agent_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `VulnerabilityOut`.

Dependencies: `require_agent_scope('vulns:write')`, `require_agent_project_access`, `get_db`.

Маршруты:

```python
router.put('/projects/{project_id}/vulnerabilities/{vuln_id}', response_model=VulnerabilityOut)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `VulnerabilityOut.model_validate`
- `VulnerabilityService`
- `VulnerabilityService(db).update`
- `payload.model_dump`

</details>
