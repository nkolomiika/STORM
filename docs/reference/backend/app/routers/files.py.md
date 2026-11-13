# backend/app/routers/files.py

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **4**.

## list_files

[backend/app/routers/files.py:17](../../../../../backend/app/routers/files.py#L17)

```python
async def list_files(project_id: int, vuln_id: int, _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> list[FileOut]
```

Возвращает список файлов уязвимости.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `vuln_id` | `int` | `обязательный` | ID уязвимости. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `list[FileOut]`.

Dependencies: `require_project_access`, `get_db`.

Маршруты:

```python
router.get('/projects/{project_id}/vulnerabilities/{vuln_id}/files', response_model=list[FileOut])
```

<details>
<summary>Прямые вызовы в теле</summary>

- `FileOut.model_validate`
- `FileService`
- `FileService(db).list`

</details>

## upload_file

[backend/app/routers/files.py:29](../../../../../backend/app/routers/files.py#L29)

```python
async def upload_file(project_id: int, vuln_id: int, file: UploadFile=UploadApiFile(...), _: None=Depends(enforce_csrf), current_user: User=Depends(get_current_user), _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> FileOut
```

Загружает файл доказательной базы.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `vuln_id` | `int` | `обязательный` | ID уязвимости. |
| `file` | `UploadFile` | `UploadApiFile(...)` | Определяется именем/типом и контрактом вызывающего кода. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `FileOut`.

Dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

Маршруты:

```python
router.post('/projects/{project_id}/vulnerabilities/{vuln_id}/files', response_model=FileOut, status_code=201)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `FileOut.model_validate`
- `FileService`
- `FileService(db).upload`

</details>

## download_file

[backend/app/routers/files.py:44](../../../../../backend/app/routers/files.py#L44)

```python
async def download_file(file_id: int, current_user: User=Depends(get_current_user), db: AsyncSession=Depends(get_db)) -> StreamingResponse
```

Отдаёт бинарный контент файла.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `file_id` | `int` | `обязательный` | ID метаданных файла в БД. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `StreamingResponse`.

Dependencies: `get_current_user`, `get_db`.

Маршруты:

```python
router.get('/files/{file_id}/download')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `FileService`
- `FileService(db).download`
- `StreamingResponse`
- `content_disposition`
- `iter`
- `meta.content_type.startswith`

</details>

## delete_file

[backend/app/routers/files.py:57](../../../../../backend/app/routers/files.py#L57)

```python
async def delete_file(project_id: int, vuln_id: int, file_id: int, _: None=Depends(enforce_csrf), current_user: User=Depends(get_current_user), _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> None
```

Удаляет файл уязвимости.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `vuln_id` | `int` | `обязательный` | ID уязвимости. |
| `file_id` | `int` | `обязательный` | ID метаданных файла в БД. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `None`.

Dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

Маршруты:

```python
router.delete('/projects/{project_id}/vulnerabilities/{vuln_id}/files/{file_id}', status_code=204)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `FileService`
- `FileService(db).delete`

</details>
