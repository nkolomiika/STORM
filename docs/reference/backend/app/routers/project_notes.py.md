# backend/app/routers/project_notes.py

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **12**.

## list_project_notes

[backend/app/routers/project_notes.py:25](../../../../../backend/app/routers/project_notes.py#L25)

```python
async def list_project_notes(project_id: int, _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> list[ProjectNoteOut]
```

Обработчик маршрута; контракт запроса и ответа приведён в справочнике HTTP API.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `list[ProjectNoteOut]`.

Dependencies: `require_project_access`, `get_db`.

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

## list_project_notes_activity

[backend/app/routers/project_notes.py:35](../../../../../backend/app/routers/project_notes.py#L35)

```python
async def list_project_notes_activity(project_id: int, limit: int=Query(30, ge=1, le=200), _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> list[dict]
```

Журнал действий с заметками проекта (CREATE/UPDATE/DELETE)
с никнеймами авторов. Видим всем, у кого есть доступ к проекту,
в отличие от глобального /audit-logs (только для админов).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `limit` | `int` | `Query(30, ge=1, le=200)` | Максимальное число возвращаемых записей. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `list[dict]`.

Dependencies: `require_project_access`, `get_db`.

Маршруты:

```python
router.get('/projects/{project_id}/notes-activity', response_model=list[dict])
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ProjectNoteService`
- `ProjectNoteService(db).list_activity`

</details>

## create_project_note

[backend/app/routers/project_notes.py:49](../../../../../backend/app/routers/project_notes.py#L49)

```python
async def create_project_note(project_id: int, payload: ProjectNoteCreate, _: None=Depends(enforce_csrf), current_user: User=Depends(get_current_user), _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> ProjectNoteOut
```

Обработчик маршрута; контракт запроса и ответа приведён в справочнике HTTP API.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `payload` | `ProjectNoteCreate` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `ProjectNoteOut`.

Dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

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

## get_project_note

[backend/app/routers/project_notes.py:62](../../../../../backend/app/routers/project_notes.py#L62)

```python
async def get_project_note(project_id: int, note_id: int, _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> ProjectNoteOut
```

Обработчик маршрута; контракт запроса и ответа приведён в справочнике HTTP API.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `note_id` | `int` | `обязательный` | ID заметки. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `ProjectNoteOut`.

Dependencies: `require_project_access`, `get_db`.

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

## update_project_note

[backend/app/routers/project_notes.py:73](../../../../../backend/app/routers/project_notes.py#L73)

```python
async def update_project_note(project_id: int, note_id: int, payload: ProjectNoteUpdate, _: None=Depends(enforce_csrf), current_user: User=Depends(get_current_user), _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> ProjectNoteOut
```

Обработчик маршрута; контракт запроса и ответа приведён в справочнике HTTP API.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `note_id` | `int` | `обязательный` | ID заметки. |
| `payload` | `ProjectNoteUpdate` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `ProjectNoteOut`.

Dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

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

## move_project_note

[backend/app/routers/project_notes.py:87](../../../../../backend/app/routers/project_notes.py#L87)

```python
async def move_project_note(project_id: int, note_id: int, payload: ProjectNoteMove, _: None=Depends(enforce_csrf), current_user: User=Depends(get_current_user), _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> ProjectNoteOut
```

Обработчик маршрута; контракт запроса и ответа приведён в справочнике HTTP API.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `note_id` | `int` | `обязательный` | ID заметки. |
| `payload` | `ProjectNoteMove` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `ProjectNoteOut`.

Dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

Маршруты:

```python
router.patch('/projects/{project_id}/notes/{note_id}/move', response_model=ProjectNoteOut)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ProjectNoteOut.model_validate`
- `ProjectNoteService`
- `ProjectNoteService(db).move_note`

</details>

## reorder_project_notes

[backend/app/routers/project_notes.py:101](../../../../../backend/app/routers/project_notes.py#L101)

```python
async def reorder_project_notes(project_id: int, payload: ProjectNoteReorder, _: None=Depends(enforce_csrf), current_user: User=Depends(get_current_user), _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> list[ProjectNoteOut]
```

Обработчик маршрута; контракт запроса и ответа приведён в справочнике HTTP API.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `payload` | `ProjectNoteReorder` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `list[ProjectNoteOut]`.

Dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

Маршруты:

```python
router.patch('/projects/{project_id}/notes/reorder', response_model=list[ProjectNoteOut])
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ProjectNoteOut.model_validate`
- `ProjectNoteService`
- `ProjectNoteService(db).reorder_notes`
- `item.model_dump`

</details>

## delete_project_note

[backend/app/routers/project_notes.py:119](../../../../../backend/app/routers/project_notes.py#L119)

```python
async def delete_project_note(project_id: int, note_id: int, _: None=Depends(enforce_csrf), current_user: User=Depends(get_current_user), _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> None
```

Обработчик маршрута; контракт запроса и ответа приведён в справочнике HTTP API.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `note_id` | `int` | `обязательный` | ID заметки. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `None`.

Dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

Маршруты:

```python
router.delete('/projects/{project_id}/notes/{note_id}', status_code=status.HTTP_204_NO_CONTENT)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ProjectNoteService`
- `ProjectNoteService(db).delete_note`

</details>

## list_note_comments

[backend/app/routers/project_notes.py:131](../../../../../backend/app/routers/project_notes.py#L131)

```python
async def list_note_comments(project_id: int, note_id: int, page: int=Query(1, ge=1), size: int=Query(50, ge=1, le=200), _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> dict
```

Обработчик маршрута; контракт запроса и ответа приведён в справочнике HTTP API.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `note_id` | `int` | `обязательный` | ID заметки. |
| `page` | `int` | `Query(1, ge=1)` | Номер страницы, начиная с 1. |
| `size` | `int` | `Query(50, ge=1, le=200)` | Число элементов страницы; верхняя граница задаётся маршрутом. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `dict`.

Dependencies: `require_project_access`, `get_db`.

Маршруты:

```python
router.get('/projects/{project_id}/notes/{note_id}/comments', response_model=dict)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `PageParams`
- `ProjectNoteService`
- `ProjectNoteService(db).list_comments`
- `to_paginated_response`
- `to_paginated_response(items, total, PageParams(page=page, size=size)).model_dump`

</details>

## create_note_comment

[backend/app/routers/project_notes.py:148](../../../../../backend/app/routers/project_notes.py#L148)

```python
async def create_note_comment(project_id: int, note_id: int, payload: ProjectNoteCommentCreate, _: None=Depends(enforce_csrf), current_user: User=Depends(get_current_user), _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> ProjectNoteCommentOut
```

Обработчик маршрута; контракт запроса и ответа приведён в справочнике HTTP API.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `note_id` | `int` | `обязательный` | ID заметки. |
| `payload` | `ProjectNoteCommentCreate` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `ProjectNoteCommentOut`.

Dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

Маршруты:

```python
router.post('/projects/{project_id}/notes/{note_id}/comments', response_model=ProjectNoteCommentOut, status_code=status.HTTP_201_CREATED)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ProjectNoteService`
- `ProjectNoteService(db).create_comment`

</details>

## update_note_comment

[backend/app/routers/project_notes.py:161](../../../../../backend/app/routers/project_notes.py#L161)

```python
async def update_note_comment(project_id: int, note_id: int, comment_id: int, payload: ProjectNoteCommentUpdate, _: None=Depends(enforce_csrf), current_user: User=Depends(get_current_user), _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> ProjectNoteCommentOut
```

Обработчик маршрута; контракт запроса и ответа приведён в справочнике HTTP API.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `note_id` | `int` | `обязательный` | ID заметки. |
| `comment_id` | `int` | `обязательный` | ID комментария. |
| `payload` | `ProjectNoteCommentUpdate` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `ProjectNoteCommentOut`.

Dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

Маршруты:

```python
router.put('/projects/{project_id}/notes/{note_id}/comments/{comment_id}', response_model=ProjectNoteCommentOut)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ProjectNoteService`
- `ProjectNoteService(db).update_comment`

</details>

## delete_note_comment

[backend/app/routers/project_notes.py:175](../../../../../backend/app/routers/project_notes.py#L175)

```python
async def delete_note_comment(project_id: int, note_id: int, comment_id: int, _: None=Depends(enforce_csrf), current_user: User=Depends(get_current_user), _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> None
```

Обработчик маршрута; контракт запроса и ответа приведён в справочнике HTTP API.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `note_id` | `int` | `обязательный` | ID заметки. |
| `comment_id` | `int` | `обязательный` | ID комментария. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `None`.

Dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

Маршруты:

```python
router.delete('/projects/{project_id}/notes/{note_id}/comments/{comment_id}', status_code=status.HTTP_204_NO_CONTENT)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ProjectNoteService`
- `ProjectNoteService(db).delete_comment`

</details>
