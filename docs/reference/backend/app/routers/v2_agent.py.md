# backend/app/routers/v2_agent.py

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **12**.

## list_agent_projects

[backend/app/routers/v2_agent.py:19](../../../../../backend/app/routers/v2_agent.py#L19)

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

[backend/app/routers/v2_agent.py:38](../../../../../backend/app/routers/v2_agent.py#L38)

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

[backend/app/routers/v2_agent.py:47](../../../../../backend/app/routers/v2_agent.py#L47)

```python
async def list_agent_hosts(project_id: int, page: int=Query(1, ge=1), size: int=Query(100, ge=1, le=200), _scope: AgentTokenContext=Depends(require_agent_scope('assets:read')), _project: Project=Depends(require_agent_project_access), db: AsyncSession=Depends(get_db)) -> dict
```

Обработчик маршрута; контракт запроса и ответа приведён в справочнике HTTP API.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `page` | `int` | `Query(1, ge=1)` | Номер страницы, начиная с 1. |
| `size` | `int` | `Query(100, ge=1, le=200)` | Число элементов страницы; верхняя граница задаётся маршрутом. |
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

[backend/app/routers/v2_agent.py:60](../../../../../backend/app/routers/v2_agent.py#L60)

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

## list_agent_notes

[backend/app/routers/v2_agent.py:71](../../../../../backend/app/routers/v2_agent.py#L71)

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

[backend/app/routers/v2_agent.py:82](../../../../../backend/app/routers/v2_agent.py#L82)

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

[backend/app/routers/v2_agent.py:94](../../../../../backend/app/routers/v2_agent.py#L94)

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

[backend/app/routers/v2_agent.py:106](../../../../../backend/app/routers/v2_agent.py#L106)

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

[backend/app/routers/v2_agent.py:119](../../../../../backend/app/routers/v2_agent.py#L119)

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

[backend/app/routers/v2_agent.py:133](../../../../../backend/app/routers/v2_agent.py#L133)

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

[backend/app/routers/v2_agent.py:154](../../../../../backend/app/routers/v2_agent.py#L154)

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

[backend/app/routers/v2_agent.py:166](../../../../../backend/app/routers/v2_agent.py#L166)

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
