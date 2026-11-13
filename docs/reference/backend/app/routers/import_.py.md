# backend/app/routers/import_.py

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **3**.

## import_project_data

[backend/app/routers/import_.py:18](../../../../../backend/app/routers/import_.py#L18)

```python
async def import_project_data(project_id: int, file: UploadFile=UploadApiFile(...), _: None=Depends(enforce_csrf), current_user: User=Depends(get_current_user), _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> ImportResult
```

Импортирует JSON-структуру активов в проект.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `file` | `UploadFile` | `UploadApiFile(...)` | Определяется именем/типом и контрактом вызывающего кода. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `ImportResult`.

Dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

Маршруты:

```python
router.post('/projects/{project_id}/import', response_model=ImportResult)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ImportService`
- `ImportService(db).import_json`
- `read_upload`

</details>

## import_openapi_file

[backend/app/routers/import_.py:32](../../../../../backend/app/routers/import_.py#L32)

```python
async def import_openapi_file(project_id: int, host_id: int, file: UploadFile=UploadApiFile(...), _: None=Depends(enforce_csrf), current_user: User=Depends(get_current_user), _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> OpenApiImportResult
```

Импортирует OpenAPI/Swagger JSON/YAML в endpoint-структуру конкретного хоста.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `host_id` | `int` | `обязательный` | ID родительского хоста. |
| `file` | `UploadFile` | `UploadApiFile(...)` | Определяется именем/типом и контрактом вызывающего кода. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `OpenApiImportResult`.

Dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

Маршруты:

```python
router.post('/projects/{project_id}/hosts/{host_id}/import-openapi', response_model=OpenApiImportResult)
```

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValidationError('Нужно выбрать Swagger/OpenAPI файл')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ImportService`
- `ImportService(db).import_openapi`
- `ValidationError`
- `read_upload`

</details>

## export_openapi_file

[backend/app/routers/import_.py:49](../../../../../backend/app/routers/import_.py#L49)

```python
async def export_openapi_file(project_id: int, host_id: int, current_user: User=Depends(get_current_user), _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> JSONResponse
```

Экспортирует эндпоинты хоста в OpenAPI 3.0 JSON.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `host_id` | `int` | `обязательный` | ID родительского хоста. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `JSONResponse`.

Dependencies: `get_current_user`, `require_project_access`, `get_db`.

Маршруты:

```python
router.get('/projects/{project_id}/hosts/{host_id}/export-openapi')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ImportService`
- `ImportService(db).export_openapi`
- `JSONResponse`

</details>
