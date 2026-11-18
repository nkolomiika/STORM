# backend/app/routers/projects.py

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **14**.

## list_projects

[backend/app/routers/projects.py:26](../../../../../backend/app/routers/projects.py#L26)

```python
async def list_projects(page: int=Query(1, ge=1), size: int=Query(20, ge=1, le=1000), status_filter: ProjectStatus | None=Query(None, alias='status'), current_user: User=Depends(get_current_user), db: AsyncSession=Depends(get_db)) -> dict
```

Возвращает список проектов с учётом прав доступа.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `page` | `int` | `Query(1, ge=1)` | Номер страницы, начиная с 1. |
| `size` | `int` | `Query(20, ge=1, le=1000)` | Число элементов страницы; верхняя граница задаётся маршрутом. |
| `status_filter` | `ProjectStatus \| None` | `Query(None, alias='status')` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `dict`.

Dependencies: `get_current_user`, `get_db`.

Маршруты:

```python
router.get('', response_model=dict)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `PageParams`
- `ProjectOut.model_validate`
- `ProjectService`
- `ProjectService(db).list_projects`
- `to_paginated_response`
- `to_paginated_response([ProjectOut.model_validate(it) for it in items], total, PageParams(page=page, size=size)).model_dump`

</details>

## create_project

[backend/app/routers/projects.py:41](../../../../../backend/app/routers/projects.py#L41)

```python
async def create_project(payload: ProjectCreate, request: Request, _: None=Depends(enforce_csrf), creator: User=Depends(require_project_creator), db: AsyncSession=Depends(get_db)) -> ProjectOut
```

Создаёт проект от имени admin/lead и добавляет автора в участники.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `payload` | `ProjectCreate` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `request` | `Request` | `обязательный` | HTTP-запрос Starlette/FastAPI. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `creator` | `User` | `Depends(require_project_creator)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `ProjectOut`.

Dependencies: `enforce_csrf`, `require_project_creator`, `get_db`.

Маршруты:

```python
router.post('', response_model=ProjectOut, status_code=status.HTTP_201_CREATED)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ProjectOut.model_validate`
- `ProjectService`
- `ProjectService(db).create_project`
- `get_client_ip`
- `payload.model_dump`

</details>

## list_project_folders

[backend/app/routers/projects.py:54](../../../../../backend/app/routers/projects.py#L54)

```python
async def list_project_folders(_: User=Depends(get_current_user), db: AsyncSession=Depends(get_db)) -> list[ProjectFolderOut]
```

Возвращает дерево папок проектов (плоским списком).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `_` | `User` | `Depends(get_current_user)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `list[ProjectFolderOut]`.

Dependencies: `get_current_user`, `get_db`.

Маршруты:

```python
router.get('/folders', response_model=list[ProjectFolderOut])
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ProjectFolderOut.model_validate`
- `ProjectService`
- `ProjectService(db).list_folders`

</details>

## create_project_folder

[backend/app/routers/projects.py:64](../../../../../backend/app/routers/projects.py#L64)

```python
async def create_project_folder(payload: ProjectFolderCreate, request: Request, _: None=Depends(enforce_csrf), admin: User=Depends(require_admin), db: AsyncSession=Depends(get_db)) -> ProjectFolderOut
```

Создаёт папку проекта (в т.ч. вложенную).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `payload` | `ProjectFolderCreate` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `request` | `Request` | `обязательный` | HTTP-запрос Starlette/FastAPI. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `admin` | `User` | `Depends(require_admin)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `ProjectFolderOut`.

Dependencies: `enforce_csrf`, `require_admin`, `get_db`.

Маршруты:

```python
router.post('/folders', response_model=ProjectFolderOut, status_code=status.HTTP_201_CREATED)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ProjectFolderOut.model_validate`
- `ProjectService`
- `ProjectService(db).create_folder`
- `get_client_ip`

</details>

## move_project_folder

[backend/app/routers/projects.py:77](../../../../../backend/app/routers/projects.py#L77)

```python
async def move_project_folder(folder_id: int, payload: ProjectFolderMove, request: Request, _: None=Depends(enforce_csrf), admin: User=Depends(require_admin), db: AsyncSession=Depends(get_db)) -> ProjectFolderOut
```

Перемещает папку проекта в другой раздел дерева.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `folder_id` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `payload` | `ProjectFolderMove` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `request` | `Request` | `обязательный` | HTTP-запрос Starlette/FastAPI. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `admin` | `User` | `Depends(require_admin)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `ProjectFolderOut`.

Dependencies: `enforce_csrf`, `require_admin`, `get_db`.

Маршруты:

```python
router.patch('/folders/{folder_id}/move', response_model=ProjectFolderOut)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ProjectFolderOut.model_validate`
- `ProjectService`
- `ProjectService(db).move_folder`
- `get_client_ip`

</details>

## delete_project_folder

[backend/app/routers/projects.py:91](../../../../../backend/app/routers/projects.py#L91)

```python
async def delete_project_folder(folder_id: int, request: Request, _: None=Depends(enforce_csrf), admin: User=Depends(require_admin), db: AsyncSession=Depends(get_db)) -> dict
```

Каскадно удаляет папку проекта со всеми подпапками и проектами.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `folder_id` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `request` | `Request` | `обязательный` | HTTP-запрос Starlette/FastAPI. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `admin` | `User` | `Depends(require_admin)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `dict`.

Dependencies: `enforce_csrf`, `require_admin`, `get_db`.

Маршруты:

```python
router.delete('/folders/{folder_id}', status_code=status.HTTP_200_OK)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ProjectService`
- `ProjectService(db).delete_folder`
- `get_client_ip`

</details>

## list_project_stats

[backend/app/routers/projects.py:104](../../../../../backend/app/routers/projects.py#L104)

```python
async def list_project_stats(current_user: User=Depends(get_current_user), db: AsyncSession=Depends(get_db)) -> list[dict]
```

Счётчики (хосты/уязвимости) по каждому доступному проекту — одним запросом.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `list[dict]`.

Dependencies: `get_current_user`, `get_db`.

Маршруты:

```python
router.get('/stats', response_model=list[dict])
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ProjectService`
- `ProjectService(db).list_project_stats`

</details>

## get_project

[backend/app/routers/projects.py:113](../../../../../backend/app/routers/projects.py#L113)

```python
async def get_project(project_id: int, _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> ProjectOut
```

Возвращает проект по ID.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `ProjectOut`.

Dependencies: `require_project_access`, `get_db`.

Маршруты:

```python
router.get('/{project_id}', response_model=ProjectOut)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ProjectOut.model_validate`
- `ProjectService`
- `ProjectService(db).get_project`

</details>

## update_project

[backend/app/routers/projects.py:124](../../../../../backend/app/routers/projects.py#L124)

```python
async def update_project(project_id: int, payload: ProjectUpdate, request: Request, _: None=Depends(enforce_csrf), current_user: User=Depends(get_current_user), db: AsyncSession=Depends(get_db)) -> ProjectOut
```

Обновляет карточку проекта: название, статус, сроки и привязку APPSEC.

Доступно админу, лиду проекта или его создателю (удаление — только админу).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `payload` | `ProjectUpdate` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `request` | `Request` | `обязательный` | HTTP-запрос Starlette/FastAPI. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `ProjectOut`.

Dependencies: `enforce_csrf`, `get_current_user`, `get_db`.

Маршруты:

```python
router.put('/{project_id}', response_model=ProjectOut)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ProjectOut.model_validate`
- `ProjectService`
- `get_client_ip`
- `payload.model_dump`
- `service.ensure_can_edit_project`
- `service.update_project`

</details>

## delete_project

[backend/app/routers/projects.py:143](../../../../../backend/app/routers/projects.py#L143)

```python
async def delete_project(project_id: int, request: Request, _: None=Depends(enforce_csrf), current_user: User=Depends(get_current_user), db: AsyncSession=Depends(get_db)) -> None
```

Удаляет проект, если инициатор — admin, создатель или lead-участник.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `request` | `Request` | `обязательный` | HTTP-запрос Starlette/FastAPI. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `None`.

Dependencies: `enforce_csrf`, `get_current_user`, `get_db`.

Маршруты:

```python
router.delete('/{project_id}', status_code=status.HTTP_204_NO_CONTENT)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ProjectService`
- `get_client_ip`
- `service.delete_project`
- `service.ensure_can_manage_members`

</details>

## list_members

[backend/app/routers/projects.py:157](../../../../../backend/app/routers/projects.py#L157)

```python
async def list_members(project_id: int, _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> list[ProjectMemberOut]
```

Возвращает участников проекта.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `list[ProjectMemberOut]`.

Dependencies: `require_project_access`, `get_db`.

Маршруты:

```python
router.get('/{project_id}/members', response_model=list[ProjectMemberOut])
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ProjectMemberOut.model_validate`
- `ProjectService`
- `ProjectService(db).list_members`

</details>

## add_member

[backend/app/routers/projects.py:168](../../../../../backend/app/routers/projects.py#L168)

```python
async def add_member(project_id: int, payload: ProjectMemberCreate, request: Request, _: None=Depends(enforce_csrf), current_user: User=Depends(get_current_user), db: AsyncSession=Depends(get_db)) -> dict
```

Добавляет участника в проект (админ, лид проекта или его создатель).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `payload` | `ProjectMemberCreate` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `request` | `Request` | `обязательный` | HTTP-запрос Starlette/FastAPI. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `dict`.

Dependencies: `enforce_csrf`, `get_current_user`, `get_db`.

Маршруты:

```python
router.post('/{project_id}/members', status_code=status.HTTP_201_CREATED)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ProjectService`
- `get_client_ip`
- `service.add_member`
- `service.ensure_can_manage_members`

</details>

## remove_member

[backend/app/routers/projects.py:183](../../../../../backend/app/routers/projects.py#L183)

```python
async def remove_member(project_id: int, user_id: int, request: Request, _: None=Depends(enforce_csrf), current_user: User=Depends(get_current_user), db: AsyncSession=Depends(get_db)) -> None
```

Удаляет участника из проекта (админ, лид проекта или его создатель).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `user_id` | `int` | `обязательный` | ID пользователя. |
| `request` | `Request` | `обязательный` | HTTP-запрос Starlette/FastAPI. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `None`.

Dependencies: `enforce_csrf`, `get_current_user`, `get_db`.

Маршруты:

```python
router.delete('/{project_id}/members/{user_id}', status_code=status.HTTP_204_NO_CONTENT)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ProjectService`
- `get_client_ip`
- `service.ensure_can_manage_members`
- `service.remove_member`

</details>

## list_project_activity

[backend/app/routers/projects.py:198](../../../../../backend/app/routers/projects.py#L198)

```python
async def list_project_activity(project_id: int, limit: int=Query(50, ge=1, le=200), _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> list[dict]
```

Активность проекта — доступна всем участникам проекта.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `limit` | `int` | `Query(50, ge=1, le=200)` | Максимальное число возвращаемых записей. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `list[dict]`.

Dependencies: `require_project_access`, `get_db`.

Маршруты:

```python
router.get('/{project_id}/activity', response_model=list[dict])
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ProjectService`
- `ProjectService(db).list_project_activity`

</details>
