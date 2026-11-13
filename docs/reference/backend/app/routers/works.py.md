# backend/app/routers/works.py

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **5**.

## get_works_config

[backend/app/routers/works.py:22](../../../../../backend/app/routers/works.py#L22)

```python
async def get_works_config(_user: User=Depends(get_current_user)) -> WorksConfigOut
```

Публичная конфигурация: доступен ли экспорт находок в Works (AppSec).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `_user` | `User` | `Depends(get_current_user)` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `WorksConfigOut`.

Dependencies: `get_current_user`.

Маршруты:

```python
router.get('/works/config', response_model=WorksConfigOut)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `WorksConfigOut`

</details>

## find_works_components

[backend/app/routers/works.py:28](../../../../../backend/app/routers/works.py#L28)

```python
async def find_works_components(q: str='', _user: User=Depends(get_current_user), db: AsyncSession=Depends(get_db)) -> list[WorksRefOut]
```

Typeahead по компонентам Works (имя→UUID). Пусто, если не настроено.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `q` | `str` | `''` | Определяется именем/типом и контрактом вызывающего кода. |
| `_user` | `User` | `Depends(get_current_user)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `list[WorksRefOut]`.

Dependencies: `get_current_user`, `get_db`.

Маршруты:

```python
router.get('/works/components', response_model=list[WorksRefOut])
```

<details>
<summary>Прямые вызовы в теле</summary>

- `WorksRefOut`
- `WorksService`
- `WorksService(db).find_components`

</details>

## find_works_versions

[backend/app/routers/works.py:39](../../../../../backend/app/routers/works.py#L39)

```python
async def find_works_versions(q: str='', _user: User=Depends(get_current_user), db: AsyncSession=Depends(get_db)) -> list[WorksRefOut]
```

Typeahead по версиям Works (имя→UUID). Пусто, если не настроено.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `q` | `str` | `''` | Определяется именем/типом и контрактом вызывающего кода. |
| `_user` | `User` | `Depends(get_current_user)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `list[WorksRefOut]`.

Dependencies: `get_current_user`, `get_db`.

Маршруты:

```python
router.get('/works/versions', response_model=list[WorksRefOut])
```

<details>
<summary>Прямые вызовы в теле</summary>

- `WorksRefOut`
- `WorksService`
- `WorksService(db).find_versions`

</details>

## get_vulnerability_works_link

[backend/app/routers/works.py:53](../../../../../backend/app/routers/works.py#L53)

```python
async def get_vulnerability_works_link(project_id: int, vuln_id: int, _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> WorksIssueLinkOut | None
```

Обработчик маршрута; контракт запроса и ответа приведён в справочнике HTTP API.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `vuln_id` | `int` | `обязательный` | ID уязвимости. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `WorksIssueLinkOut \| None`.

Dependencies: `require_project_access`, `get_db`.

Маршруты:

```python
router.get('/projects/{project_id}/vulnerabilities/{vuln_id}/works', response_model=WorksIssueLinkOut | None)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `WorksService`
- `WorksService(db).get_link`

</details>

## export_vulnerability_to_works

[backend/app/routers/works.py:67](../../../../../backend/app/routers/works.py#L67)

```python
async def export_vulnerability_to_works(project_id: int, vuln_id: int, payload: WorksExportRequest, _: None=Depends(enforce_csrf), current_user: User=Depends(get_current_user), _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> WorksIssueLinkOut
```

Обработчик маршрута; контракт запроса и ответа приведён в справочнике HTTP API.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `vuln_id` | `int` | `обязательный` | ID уязвимости. |
| `payload` | `WorksExportRequest` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `WorksIssueLinkOut`.

Dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

Маршруты:

```python
router.post('/projects/{project_id}/vulnerabilities/{vuln_id}/works/export', response_model=WorksIssueLinkOut)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `WorksService`
- `WorksService(db).export_vulnerability`

</details>
