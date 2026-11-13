# backend/app/routers/scanner.py

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **6**.

## start_subdomain_scan

[backend/app/routers/scanner.py:32](../../../../../backend/app/routers/scanner.py#L32)

```python
async def start_subdomain_scan(project_id: int, payload: SubFarmRequest, background_tasks: BackgroundTasks, _: None=Depends(enforce_csrf), current_user: User=Depends(get_current_user), _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> SubFarmJobOut
```

Снимает корни (или домены проекта) и ставит раскрытие поддоменов в фон.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `payload` | `SubFarmRequest` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `background_tasks` | `BackgroundTasks` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `SubFarmJobOut`.

Dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

Маршруты:

```python
router.post('/projects/{project_id}/scanner/subdomains', response_model=SubFarmJobOut, status_code=status.HTTP_202_ACCEPTED)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `SubFarmJobOut.model_validate`
- `SubdomainFarmService`
- `SubdomainFarmService(db).create_job`
- `enqueue_job`

</details>

## get_subdomain_job

[backend/app/routers/scanner.py:51](../../../../../backend/app/routers/scanner.py#L51)

```python
async def get_subdomain_job(project_id: int, job_id: int, _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> SubFarmJobOut
```

Статус задачи раскрытия поддоменов. Задачу чужого kind не отдаёт.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `job_id` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `SubFarmJobOut`.

Dependencies: `require_project_access`, `get_db`.

Маршруты:

```python
router.get('/projects/{project_id}/scanner/subdomains/jobs/{job_id}', response_model=SubFarmJobOut)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `SubFarmJobOut.model_validate`
- `SubdomainFarmService`
- `SubdomainFarmService(db).get_job`

</details>

## start_port_scan

[backend/app/routers/scanner.py:67](../../../../../backend/app/routers/scanner.py#L67)

```python
async def start_port_scan(project_id: int, payload: PortScanRequest, background_tasks: BackgroundTasks, _: None=Depends(enforce_csrf), current_user: User=Depends(get_current_user), _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> PortScanJobOut
```

Снимает цели (или хосты проекта) и ставит nmap-скан портов в фон.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `payload` | `PortScanRequest` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `background_tasks` | `BackgroundTasks` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `PortScanJobOut`.

Dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

Маршруты:

```python
router.post('/projects/{project_id}/scanner/port-scan', response_model=PortScanJobOut, status_code=status.HTTP_202_ACCEPTED)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `PortScanFarmService`
- `PortScanFarmService(db).create_job`
- `PortScanJobOut.model_validate`
- `enqueue_job`

</details>

## get_port_scan_job

[backend/app/routers/scanner.py:86](../../../../../backend/app/routers/scanner.py#L86)

```python
async def get_port_scan_job(project_id: int, job_id: int, _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> PortScanJobOut
```

Статус задачи скана портов. Задачу чужого kind не отдаёт.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `job_id` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `PortScanJobOut`.

Dependencies: `require_project_access`, `get_db`.

Маршруты:

```python
router.get('/projects/{project_id}/scanner/port-scan/jobs/{job_id}', response_model=PortScanJobOut)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `PortScanFarmService`
- `PortScanFarmService(db).get_job`
- `PortScanJobOut.model_validate`

</details>

## start_reverse_scan

[backend/app/routers/scanner.py:102](../../../../../backend/app/routers/scanner.py#L102)

```python
async def start_reverse_scan(project_id: int, payload: ReverseFarmRequest, background_tasks: BackgroundTasks, _: None=Depends(enforce_csrf), current_user: User=Depends(get_current_user), _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> ReverseFarmJobOut
```

Берёт IP (или все адреса проекта) и ставит обратный резолв с раскрытием
хостов в фон. Этот кросс-рекон намеренно НЕ делается при обычном «Add IPs».

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `payload` | `ReverseFarmRequest` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `background_tasks` | `BackgroundTasks` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `ReverseFarmJobOut`.

Dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

Маршруты:

```python
router.post('/projects/{project_id}/scanner/reverse', response_model=ReverseFarmJobOut, status_code=status.HTTP_202_ACCEPTED)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ReverseFarmJobOut.model_validate`
- `ReverseFarmService`
- `ReverseFarmService(db).create_job`
- `enqueue_job`

</details>

## get_reverse_scan_job

[backend/app/routers/scanner.py:122](../../../../../backend/app/routers/scanner.py#L122)

```python
async def get_reverse_scan_job(project_id: int, job_id: int, _project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> ReverseFarmJobOut
```

Статус задачи обратного резолва. Задачу чужого kind не отдаёт.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `job_id` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `ReverseFarmJobOut`.

Dependencies: `require_project_access`, `get_db`.

Маршруты:

```python
router.get('/projects/{project_id}/scanner/reverse/jobs/{job_id}', response_model=ReverseFarmJobOut)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ReverseFarmJobOut.model_validate`
- `ReverseFarmService`
- `ReverseFarmService(db).get_job`

</details>
