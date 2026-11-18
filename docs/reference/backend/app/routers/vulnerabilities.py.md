# backend/app/routers/vulnerabilities.py

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **10**.

## list_vulnerabilities

[backend/app/routers/vulnerabilities.py:26](../../../../../backend/app/routers/vulnerabilities.py#L26)

```python
async def list_vulnerabilities(project_id: int, page: int=Query(1, ge=1), size: int=Query(20, ge=1, le=200), severity: Severity | None=None, status_filter: VulnerabilityStatus | None=Query(None, alias='status'), _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> PaginatedResponse[VulnerabilityListOut]
```

Возвращает список уязвимостей проекта.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `page` | `int` | `Query(1, ge=1)` | Номер страницы, начиная с 1. |
| `size` | `int` | `Query(20, ge=1, le=200)` | Число элементов страницы; верхняя граница задаётся маршрутом. |
| `severity` | `Severity \| None` | `None` | Критичность находки (Enum Severity). |
| `status_filter` | `VulnerabilityStatus \| None` | `Query(None, alias='status')` | Определяется именем/типом и контрактом вызывающего кода. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `PaginatedResponse[VulnerabilityListOut]`.

Dependencies: `require_project_access`, `get_db`.

Маршруты:

```python
router.get('/projects/{project_id}/vulnerabilities', response_model=PaginatedResponse[VulnerabilityListOut])
```

<details>
<summary>Прямые вызовы в теле</summary>

- `PageParams`
- `VulnerabilityListOut.model_validate`
- `VulnerabilityListOut.model_validate(item).model_copy`
- `VulnerabilityService`
- `host_links.get`
- `issue_links.get`
- `service.host_links_for_page`
- `service.linked_issues_for_page`
- `service.list`
- `to_paginated_response`

</details>

## list_host_vulnerabilities

[backend/app/routers/vulnerabilities.py:45](../../../../../backend/app/routers/vulnerabilities.py#L45)

```python
async def list_host_vulnerabilities(project_id: int, host_id: int, page: int=Query(1, ge=1), size: int=Query(20, ge=1, le=200), severity: Severity | None=None, status_filter: VulnerabilityStatus | None=Query(None, alias='status'), _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> PaginatedResponse[VulnerabilityOut]
```

Возвращает список уязвимостей, привязанных к конкретному хосту.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `host_id` | `int` | `обязательный` | ID родительского хоста. |
| `page` | `int` | `Query(1, ge=1)` | Номер страницы, начиная с 1. |
| `size` | `int` | `Query(20, ge=1, le=200)` | Число элементов страницы; верхняя граница задаётся маршрутом. |
| `severity` | `Severity \| None` | `None` | Критичность находки (Enum Severity). |
| `status_filter` | `VulnerabilityStatus \| None` | `Query(None, alias='status')` | Определяется именем/типом и контрактом вызывающего кода. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `PaginatedResponse[VulnerabilityOut]`.

Dependencies: `require_project_access`, `get_db`.

Маршруты:

```python
router.get('/projects/{project_id}/hosts/{host_id}/vulnerabilities', response_model=PaginatedResponse[VulnerabilityOut])
```

<details>
<summary>Прямые вызовы в теле</summary>

- `PageParams`
- `VulnerabilityOut.model_validate`
- `VulnerabilityService`
- `VulnerabilityService(db).list_for_host`
- `to_paginated_response`

</details>

## create_vulnerability

[backend/app/routers/vulnerabilities.py:61](../../../../../backend/app/routers/vulnerabilities.py#L61)

```python
async def create_vulnerability(project_id: int, payload: VulnerabilityCreate, _: None=Depends(enforce_csrf), current_user: User=Depends(get_current_user), _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> VulnerabilityOut
```

Создаёт уязвимость.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `payload` | `VulnerabilityCreate` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `VulnerabilityOut`.

Dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

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

## get_vulnerability

[backend/app/routers/vulnerabilities.py:75](../../../../../backend/app/routers/vulnerabilities.py#L75)

```python
async def get_vulnerability(project_id: int, vuln_id: int, _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> dict
```

Возвращает подробную карточку уязвимости.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `vuln_id` | `int` | `обязательный` | ID уязвимости. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `dict`.

Dependencies: `require_project_access`, `get_db`.

Маршруты:

```python
router.get('/projects/{project_id}/vulnerabilities/{vuln_id}')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `FileOut.model_validate`
- `FileOut.model_validate(item).model_dump`
- `VulnerabilityAssetOut.model_validate`
- `VulnerabilityAssetOut.model_validate(item).model_dump`
- `VulnerabilityOut.model_validate`
- `VulnerabilityOut.model_validate(data['vulnerability']).model_dump`
- `VulnerabilityService`
- `VulnerabilityService(db).get`
- `VulnerabilityService(db).linked_issues_for_page`
- `links.get`
- `vuln.update`

</details>

## update_vulnerability

[backend/app/routers/vulnerabilities.py:93](../../../../../backend/app/routers/vulnerabilities.py#L93)

```python
async def update_vulnerability(project_id: int, vuln_id: int, payload: VulnerabilityUpdate, _: None=Depends(enforce_csrf), current_user: User=Depends(get_current_user), _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> VulnerabilityOut
```

Обновляет уязвимость.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `vuln_id` | `int` | `обязательный` | ID уязвимости. |
| `payload` | `VulnerabilityUpdate` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `VulnerabilityOut`.

Dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

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

## patch_vulnerability_status

[backend/app/routers/vulnerabilities.py:108](../../../../../backend/app/routers/vulnerabilities.py#L108)

```python
async def patch_vulnerability_status(project_id: int, vuln_id: int, payload: VulnerabilityStatusPatch, _: None=Depends(enforce_csrf), current_user: User=Depends(get_current_user), _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> VulnerabilityOut
```

Меняет статус уязвимости отдельным эндпоинтом.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `vuln_id` | `int` | `обязательный` | ID уязвимости. |
| `payload` | `VulnerabilityStatusPatch` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `VulnerabilityOut`.

Dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

Маршруты:

```python
router.patch('/projects/{project_id}/vulnerabilities/{vuln_id}/status', response_model=VulnerabilityOut)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `VulnerabilityOut.model_validate`
- `VulnerabilityService`
- `VulnerabilityService(db).patch_status`

</details>

## delete_vulnerability

[backend/app/routers/vulnerabilities.py:123](../../../../../backend/app/routers/vulnerabilities.py#L123)

```python
async def delete_vulnerability(project_id: int, vuln_id: int, _: None=Depends(enforce_csrf), current_user: User=Depends(get_current_user), _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> None
```

Удаляет уязвимость.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `vuln_id` | `int` | `обязательный` | ID уязвимости. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `None`.

Dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

Маршруты:

```python
router.delete('/projects/{project_id}/vulnerabilities/{vuln_id}', status_code=status.HTTP_204_NO_CONTENT)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `VulnerabilityService`
- `VulnerabilityService(db).delete`

</details>

## list_vulnerability_assets

[backend/app/routers/vulnerabilities.py:136](../../../../../backend/app/routers/vulnerabilities.py#L136)

```python
async def list_vulnerability_assets(project_id: int, vuln_id: int, _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> list[VulnerabilityAssetOut]
```

Возвращает привязанные активы уязвимости.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `vuln_id` | `int` | `обязательный` | ID уязвимости. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `list[VulnerabilityAssetOut]`.

Dependencies: `require_project_access`, `get_db`.

Маршруты:

```python
router.get('/projects/{project_id}/vulnerabilities/{vuln_id}/assets', response_model=list[VulnerabilityAssetOut])
```

<details>
<summary>Прямые вызовы в теле</summary>

- `VulnerabilityAssetOut.model_validate`
- `VulnerabilityService`
- `VulnerabilityService(db).list_assets`

</details>

## add_vulnerability_asset

[backend/app/routers/vulnerabilities.py:152](../../../../../backend/app/routers/vulnerabilities.py#L152)

```python
async def add_vulnerability_asset(project_id: int, vuln_id: int, payload: VulnerabilityAssetCreate, _: None=Depends(enforce_csrf), current_user: User=Depends(get_current_user), _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> VulnerabilityAssetOut
```

Привязывает актив к уязвимости.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `vuln_id` | `int` | `обязательный` | ID уязвимости. |
| `payload` | `VulnerabilityAssetCreate` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `VulnerabilityAssetOut`.

Dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

Маршруты:

```python
router.post('/projects/{project_id}/vulnerabilities/{vuln_id}/assets', response_model=VulnerabilityAssetOut, status_code=status.HTTP_201_CREATED)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `VulnerabilityAssetOut.model_validate`
- `VulnerabilityService`
- `VulnerabilityService(db).add_asset`

</details>

## delete_vulnerability_asset

[backend/app/routers/vulnerabilities.py:167](../../../../../backend/app/routers/vulnerabilities.py#L167)

```python
async def delete_vulnerability_asset(project_id: int, vuln_id: int, asset_link_id: int, _: None=Depends(enforce_csrf), current_user: User=Depends(get_current_user), _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> None
```

Удаляет связь уязвимости с активом.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `vuln_id` | `int` | `обязательный` | ID уязвимости. |
| `asset_link_id` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `None`.

Dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

Маршруты:

```python
router.delete('/projects/{project_id}/vulnerabilities/{vuln_id}/assets/{asset_link_id}', status_code=status.HTTP_204_NO_CONTENT)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `VulnerabilityService`
- `VulnerabilityService(db).delete_asset`

</details>
