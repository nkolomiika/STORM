# backend/app/routers/farm.py

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **6**.

## start_host_farm

[backend/app/routers/farm.py:25](../../../../../backend/app/routers/farm.py#L25)

```python
async def start_host_farm(project_id: int, payload: HostFarmRequest, background_tasks: BackgroundTasks, _: None=Depends(enforce_csrf), current_user: User=Depends(get_current_user), _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> HostFarmJobOut
```

Парсит вставленный список (синхронно) и ставит пробив в фон.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `payload` | `HostFarmRequest` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `background_tasks` | `BackgroundTasks` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `HostFarmJobOut`.

Dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

Маршруты:

```python
router.post('/projects/{project_id}/host-farm', response_model=HostFarmJobOut, status_code=status.HTTP_202_ACCEPTED)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `HostFarmJobOut.model_validate`
- `HostFarmService`
- `HostFarmService(db).create_job`
- `enqueue_job`

</details>

## get_host_farm_job

[backend/app/routers/farm.py:41](../../../../../backend/app/routers/farm.py#L41)

```python
async def get_host_farm_job(project_id: int, job_id: int, _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> HostFarmJobOut
```

Статус фоновой задачи фермы хостов (фронт опрашивает до status=done).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `job_id` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `HostFarmJobOut`.

Dependencies: `require_project_access`, `get_db`.

Маршруты:

```python
router.get('/projects/{project_id}/host-farm/jobs/{job_id}', response_model=HostFarmJobOut)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `HostFarmJobOut.model_validate`
- `HostFarmService`
- `HostFarmService(db).get_job`

</details>

## start_ip_farm

[backend/app/routers/farm.py:57](../../../../../backend/app/routers/farm.py#L57)

```python
async def start_ip_farm(project_id: int, payload: IpFarmRequest, background_tasks: BackgroundTasks, _: None=Depends(enforce_csrf), current_user: User=Depends(get_current_user), _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> IpFarmJobOut
```

Парсит вставленный список адресов и ставит обратный резолв + пробив в фон.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `payload` | `IpFarmRequest` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `background_tasks` | `BackgroundTasks` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `IpFarmJobOut`.

Dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

Маршруты:

```python
router.post('/projects/{project_id}/ip-farm', response_model=IpFarmJobOut, status_code=status.HTTP_202_ACCEPTED)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `IpFarmJobOut.model_validate`
- `IpFarmService`
- `IpFarmService(db).create_job`
- `enqueue_job`

</details>

## get_ip_farm_job

[backend/app/routers/farm.py:73](../../../../../backend/app/routers/farm.py#L73)

```python
async def get_ip_farm_job(project_id: int, job_id: int, _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> IpFarmJobOut
```

Статус фоновой задачи фермы IP. Задачу чужого kind не отдаёт.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `job_id` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `IpFarmJobOut`.

Dependencies: `require_project_access`, `get_db`.

Маршруты:

```python
router.get('/projects/{project_id}/ip-farm/jobs/{job_id}', response_model=IpFarmJobOut)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `IpFarmJobOut.model_validate`
- `IpFarmService`
- `IpFarmService(db).get_job`

</details>

## start_js_farm

[backend/app/routers/farm.py:89](../../../../../backend/app/routers/farm.py#L89)

```python
async def start_js_farm(project_id: int, payload: JsFarmRequest, background_tasks: BackgroundTasks, _: None=Depends(enforce_csrf), current_user: User=Depends(get_current_user), _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> JsFarmJobOut
```

Снимает домены проекта (или из payload.raw) и ставит скан JS в фон.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `payload` | `JsFarmRequest` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `background_tasks` | `BackgroundTasks` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `JsFarmJobOut`.

Dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

Маршруты:

```python
router.post('/projects/{project_id}/js-farm', response_model=JsFarmJobOut, status_code=status.HTTP_202_ACCEPTED)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `JsFarmJobOut.model_validate`
- `JsFarmService`
- `JsFarmService(db).create_job`
- `enqueue_job`

</details>

## get_js_farm_job

[backend/app/routers/farm.py:105](../../../../../backend/app/routers/farm.py#L105)

```python
async def get_js_farm_job(project_id: int, job_id: int, _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> JsFarmJobOut
```

Статус фоновой задачи фермы JS. Задачу чужого kind не отдаёт.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `job_id` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `JsFarmJobOut`.

Dependencies: `require_project_access`, `get_db`.

Маршруты:

```python
router.get('/projects/{project_id}/js-farm/jobs/{job_id}', response_model=JsFarmJobOut)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `JsFarmJobOut.model_validate`
- `JsFarmService`
- `JsFarmService(db).get_job`

</details>
