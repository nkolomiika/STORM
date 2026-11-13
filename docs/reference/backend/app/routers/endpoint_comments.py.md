# backend/app/routers/endpoint_comments.py

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **2**.

## list_endpoint_comments

[backend/app/routers/endpoint_comments.py:15](../../../../../backend/app/routers/endpoint_comments.py#L15)

```python
async def list_endpoint_comments(project_id: int, host_id: int, endpoint_id: int, page: int=Query(1, ge=1), size: int=Query(50, ge=1, le=200), _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> PaginatedResponse[EndpointCommentOut]
```

Сохранённые комментарии только указанного эндпоинта, новые первыми.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `host_id` | `int` | `обязательный` | ID родительского хоста. |
| `endpoint_id` | `int` | `обязательный` | ID эндпоинта. |
| `page` | `int` | `Query(1, ge=1)` | Номер страницы, начиная с 1. |
| `size` | `int` | `Query(50, ge=1, le=200)` | Число элементов страницы; верхняя граница задаётся маршрутом. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `PaginatedResponse[EndpointCommentOut]`.

Dependencies: `require_project_access`, `get_db`.

Маршруты:

```python
router.get('', response_model=PaginatedResponse[EndpointCommentOut])
```

<details>
<summary>Прямые вызовы в теле</summary>

- `EndpointCommentService`
- `EndpointCommentService(db).list`
- `PageParams`
- `to_paginated_response`

</details>

## create_endpoint_comment

[backend/app/routers/endpoint_comments.py:26](../../../../../backend/app/routers/endpoint_comments.py#L26)

```python
async def create_endpoint_comment(project_id: int, host_id: int, endpoint_id: int, payload: EndpointCommentCreate, _: None=Depends(enforce_csrf), current_user: User=Depends(get_current_user), _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> EndpointCommentOut
```

Добавляет комментарий; запись и аудит сохраняются в одной транзакции.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `host_id` | `int` | `обязательный` | ID родительского хоста. |
| `endpoint_id` | `int` | `обязательный` | ID эндпоинта. |
| `payload` | `EndpointCommentCreate` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `EndpointCommentOut`.

Dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

Маршруты:

```python
router.post('', response_model=EndpointCommentOut, status_code=status.HTTP_201_CREATED)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `EndpointCommentService`
- `EndpointCommentService(db).create`

</details>
