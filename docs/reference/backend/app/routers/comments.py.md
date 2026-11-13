# backend/app/routers/comments.py

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **4**.

## list_comments

[backend/app/routers/comments.py:16](../../../../../backend/app/routers/comments.py#L16)

```python
async def list_comments(project_id: int, vuln_id: int, page: int=Query(1, ge=1), size: int=Query(50, ge=1, le=200), _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> PaginatedResponse[CommentOut]
```

Возвращает комментарии уязвимости.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `vuln_id` | `int` | `обязательный` | ID уязвимости. |
| `page` | `int` | `Query(1, ge=1)` | Номер страницы, начиная с 1. |
| `size` | `int` | `Query(50, ge=1, le=200)` | Число элементов страницы; верхняя граница задаётся маршрутом. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `PaginatedResponse[CommentOut]`.

Dependencies: `require_project_access`, `get_db`.

Маршруты:

```python
router.get('/projects/{project_id}/vulnerabilities/{vuln_id}/comments', response_model=PaginatedResponse[CommentOut])
```

<details>
<summary>Прямые вызовы в теле</summary>

- `CommentService`
- `CommentService(db).list`
- `PageParams`
- `to_paginated_response`

</details>

## create_comment

[backend/app/routers/comments.py:30](../../../../../backend/app/routers/comments.py#L30)

```python
async def create_comment(project_id: int, vuln_id: int, payload: CommentCreate, _: None=Depends(enforce_csrf), current_user: User=Depends(get_current_user), _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> CommentOut
```

Создаёт комментарий и обрабатывает упоминания.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `vuln_id` | `int` | `обязательный` | ID уязвимости. |
| `payload` | `CommentCreate` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `CommentOut`.

Dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

Маршруты:

```python
router.post('/projects/{project_id}/vulnerabilities/{vuln_id}/comments', response_model=CommentOut, status_code=status.HTTP_201_CREATED)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `CommentService`
- `CommentService(db).create`

</details>

## update_comment

[backend/app/routers/comments.py:44](../../../../../backend/app/routers/comments.py#L44)

```python
async def update_comment(project_id: int, vuln_id: int, comment_id: int, payload: CommentUpdate, _: None=Depends(enforce_csrf), current_user: User=Depends(get_current_user), _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> CommentOut
```

Редактирует комментарий.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `vuln_id` | `int` | `обязательный` | ID уязвимости. |
| `comment_id` | `int` | `обязательный` | ID комментария. |
| `payload` | `CommentUpdate` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `CommentOut`.

Dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

Маршруты:

```python
router.put('/projects/{project_id}/vulnerabilities/{vuln_id}/comments/{comment_id}', response_model=CommentOut)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `CommentService`
- `CommentService(db).update`

</details>

## delete_comment

[backend/app/routers/comments.py:59](../../../../../backend/app/routers/comments.py#L59)

```python
async def delete_comment(project_id: int, vuln_id: int, comment_id: int, _: None=Depends(enforce_csrf), current_user: User=Depends(get_current_user), _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> None
```

Удаляет комментарий.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `vuln_id` | `int` | `обязательный` | ID уязвимости. |
| `comment_id` | `int` | `обязательный` | ID комментария. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `None`.

Dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

Маршруты:

```python
router.delete('/projects/{project_id}/vulnerabilities/{vuln_id}/comments/{comment_id}', status_code=status.HTTP_204_NO_CONTENT)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `CommentService`
- `CommentService(db).delete`

</details>
