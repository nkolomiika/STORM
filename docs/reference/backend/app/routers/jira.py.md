# backend/app/routers/jira.py

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **8**.

## get_jira_config

[backend/app/routers/jira.py:23](../../../../../backend/app/routers/jira.py#L23)

```python
async def get_jira_config(_admin: User=Depends(require_admin), db: AsyncSession=Depends(get_db)) -> JiraConfigOut | None
```

Обработчик маршрута; контракт запроса и ответа приведён в справочнике HTTP API.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `_admin` | `User` | `Depends(require_admin)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `JiraConfigOut \| None`.

Dependencies: `require_admin`, `get_db`.

Маршруты:

```python
router.get('/jira/config', response_model=JiraConfigOut | None)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `JiraIntegrationService`
- `JiraIntegrationService(db).get_config`

</details>

## upsert_jira_config

[backend/app/routers/jira.py:31](../../../../../backend/app/routers/jira.py#L31)

```python
async def upsert_jira_config(payload: JiraConfigUpsert, _: None=Depends(enforce_csrf), admin: User=Depends(require_admin), db: AsyncSession=Depends(get_db)) -> JiraConfigOut
```

Обработчик маршрута; контракт запроса и ответа приведён в справочнике HTTP API.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `payload` | `JiraConfigUpsert` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `admin` | `User` | `Depends(require_admin)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `JiraConfigOut`.

Dependencies: `enforce_csrf`, `require_admin`, `get_db`.

Маршруты:

```python
router.put('/jira/config', response_model=JiraConfigOut)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `JiraIntegrationService`
- `JiraIntegrationService(db).upsert_config`
- `payload.model_dump`

</details>

## get_project_jira_link

[backend/app/routers/jira.py:41](../../../../../backend/app/routers/jira.py#L41)

```python
async def get_project_jira_link(project_id: int, _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> ProjectJiraLinkOut | None
```

Обработчик маршрута; контракт запроса и ответа приведён в справочнике HTTP API.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `ProjectJiraLinkOut \| None`.

Dependencies: `require_project_access`, `get_db`.

Маршруты:

```python
router.get('/projects/{project_id}/jira-link', response_model=ProjectJiraLinkOut | None)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `JiraIntegrationService`
- `JiraIntegrationService(db).get_project_link`

</details>

## upsert_project_jira_link

[backend/app/routers/jira.py:50](../../../../../backend/app/routers/jira.py#L50)

```python
async def upsert_project_jira_link(project_id: int, payload: ProjectJiraLinkUpsert, _: None=Depends(enforce_csrf), admin: User=Depends(require_admin), db: AsyncSession=Depends(get_db)) -> ProjectJiraLinkOut
```

Обработчик маршрута; контракт запроса и ответа приведён в справочнике HTTP API.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `payload` | `ProjectJiraLinkUpsert` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `admin` | `User` | `Depends(require_admin)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `ProjectJiraLinkOut`.

Dependencies: `enforce_csrf`, `require_admin`, `get_db`.

Маршруты:

```python
router.put('/projects/{project_id}/jira-link', response_model=ProjectJiraLinkOut)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `JiraIntegrationService`
- `JiraIntegrationService(db).upsert_project_link`

</details>

## get_vulnerability_jira_link

[backend/app/routers/jira.py:61](../../../../../backend/app/routers/jira.py#L61)

```python
async def get_vulnerability_jira_link(project_id: int, vuln_id: int, _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> JiraIssueLinkOut | None
```

Обработчик маршрута; контракт запроса и ответа приведён в справочнике HTTP API.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `vuln_id` | `int` | `обязательный` | ID уязвимости. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `JiraIssueLinkOut \| None`.

Dependencies: `require_project_access`, `get_db`.

Маршруты:

```python
router.get('/projects/{project_id}/vulnerabilities/{vuln_id}/jira', response_model=JiraIssueLinkOut | None)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `JiraIntegrationService`
- `JiraIntegrationService(db).get_issue_link`

</details>

## export_vulnerability_to_jira

[backend/app/routers/jira.py:72](../../../../../backend/app/routers/jira.py#L72)

```python
async def export_vulnerability_to_jira(project_id: int, vuln_id: int, _: None=Depends(enforce_csrf), current_user: User=Depends(get_current_user), _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> JiraIssueLinkOut
```

Обработчик маршрута; контракт запроса и ответа приведён в справочнике HTTP API.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `vuln_id` | `int` | `обязательный` | ID уязвимости. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `JiraIssueLinkOut`.

Dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

Маршруты:

```python
router.post('/projects/{project_id}/vulnerabilities/{vuln_id}/jira/export', response_model=JiraIssueLinkOut)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `JiraIntegrationService`
- `JiraIntegrationService(db).export_vulnerability`

</details>

## list_jira_tasks

[backend/app/routers/jira.py:86](../../../../../backend/app/routers/jira.py#L86)

```python
async def list_jira_tasks(query: str | None=None, category: str | None=None, _user: User=Depends(get_current_user), db: AsyncSession=Depends(get_db)) -> JiraTaskListOut
```

Обработчик маршрута; контракт запроса и ответа приведён в справочнике HTTP API.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `query` | `str \| None` | `None` | Определяется именем/типом и контрактом вызывающего кода. |
| `category` | `str \| None` | `None` | Определяется именем/типом и контрактом вызывающего кода. |
| `_user` | `User` | `Depends(get_current_user)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `JiraTaskListOut`.

Dependencies: `get_current_user`, `get_db`.

Маршруты:

```python
router.get('/tasks', response_model=JiraTaskListOut)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `JiraIntegrationService`
- `JiraIntegrationService(db).list_tasks`

</details>

## get_jira_task

[backend/app/routers/jira.py:96](../../../../../backend/app/routers/jira.py#L96)

```python
async def get_jira_task(key: str, _user: User=Depends(get_current_user), db: AsyncSession=Depends(get_db)) -> JiraTaskDetailOut
```

Обработчик маршрута; контракт запроса и ответа приведён в справочнике HTTP API.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `key` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `_user` | `User` | `Depends(get_current_user)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `JiraTaskDetailOut`.

Dependencies: `get_current_user`, `get_db`.

Маршруты:

```python
router.get('/tasks/{key}', response_model=JiraTaskDetailOut)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `JiraIntegrationService`
- `JiraIntegrationService(db).get_task`

</details>
