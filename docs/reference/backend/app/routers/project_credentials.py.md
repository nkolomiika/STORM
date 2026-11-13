# backend/app/routers/project_credentials.py

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **4**.

## list_project_credentials

[backend/app/routers/project_credentials.py:19](../../../../../backend/app/routers/project_credentials.py#L19)

```python
async def list_project_credentials(project_id: int, _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> list[ProjectCredentialOut]
```

Обработчик маршрута; контракт запроса и ответа приведён в справочнике HTTP API.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `list[ProjectCredentialOut]`.

Dependencies: `require_project_access`, `get_db`.

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

## create_project_credential

[backend/app/routers/project_credentials.py:33](../../../../../backend/app/routers/project_credentials.py#L33)

```python
async def create_project_credential(project_id: int, payload: ProjectCredentialCreate, _: None=Depends(enforce_csrf), current_user: User=Depends(get_current_user), _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> ProjectCredentialOut
```

Обработчик маршрута; контракт запроса и ответа приведён в справочнике HTTP API.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `payload` | `ProjectCredentialCreate` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `ProjectCredentialOut`.

Dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

Маршруты:

```python
router.post('/projects/{project_id}/credentials', response_model=ProjectCredentialOut, status_code=status.HTTP_201_CREATED)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ProjectCredentialOut.model_validate`
- `ProjectCredentialService`
- `ProjectCredentialService(db).create_credential`
- `payload.model_dump`

</details>

## update_project_credential

[backend/app/routers/project_credentials.py:46](../../../../../backend/app/routers/project_credentials.py#L46)

```python
async def update_project_credential(project_id: int, credential_id: int, payload: ProjectCredentialUpdate, _: None=Depends(enforce_csrf), current_user: User=Depends(get_current_user), _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> ProjectCredentialOut
```

Обработчик маршрута; контракт запроса и ответа приведён в справочнике HTTP API.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `credential_id` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `payload` | `ProjectCredentialUpdate` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `ProjectCredentialOut`.

Dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

Маршруты:

```python
router.put('/projects/{project_id}/credentials/{credential_id}', response_model=ProjectCredentialOut)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ProjectCredentialOut.model_validate`
- `ProjectCredentialService`
- `ProjectCredentialService(db).update_credential`
- `payload.model_dump`

</details>

## delete_project_credential

[backend/app/routers/project_credentials.py:65](../../../../../backend/app/routers/project_credentials.py#L65)

```python
async def delete_project_credential(project_id: int, credential_id: int, _: None=Depends(enforce_csrf), current_user: User=Depends(get_current_user), _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> None
```

Обработчик маршрута; контракт запроса и ответа приведён в справочнике HTTP API.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `credential_id` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `None`.

Dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

Маршруты:

```python
router.delete('/projects/{project_id}/credentials/{credential_id}', status_code=status.HTTP_204_NO_CONTENT)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ProjectCredentialService`
- `ProjectCredentialService(db).delete_credential`

</details>
