# backend/app/routers/task_tracker.py

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **2**.

## list_tasks

[backend/app/routers/task_tracker.py:14](../../../../../backend/app/routers/task_tracker.py#L14)

```python
async def list_tasks(query: str | None=None, category: str | None=None, page_number: int=Query(0, ge=0, le=1000000), sort: Literal['first', 'last']='last', refresh: bool=False, _user: User=Depends(get_current_user), db: AsyncSession=Depends(get_db)) -> не аннотирован
```

Возвращает по 20 тикетов и доступные пользователю связи с проектами.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `query` | `str \| None` | `None` | Определяется именем/типом и контрактом вызывающего кода. |
| `category` | `str \| None` | `None` | Определяется именем/типом и контрактом вызывающего кода. |
| `page_number` | `int` | `Query(0, ge=0, le=1000000)` | Определяется именем/типом и контрактом вызывающего кода. |
| `sort` | `Literal['first', 'last']` | `'last'` | Определяется именем/типом и контрактом вызывающего кода. |
| `refresh` | `bool` | `False` | Определяется именем/типом и контрактом вызывающего кода. |
| `_user` | `User` | `Depends(get_current_user)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `не аннотирован`.

Dependencies: `get_current_user`, `get_db`.

Маршруты:

```python
router.get('/tasks', response_model=TaskTrackerTaskListOut)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `TaskTrackerService`
- `service.attach_project_access`
- `service.list_tasks`

</details>

## get_task

[backend/app/routers/task_tracker.py:23](../../../../../backend/app/routers/task_tracker.py#L23)

```python
async def get_task(key: str, _user: User=Depends(get_current_user), db: AsyncSession=Depends(get_db)) -> не аннотирован
```

Читает карточку; ID связанного проекта отдаёт только при наличии доступа.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `key` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `_user` | `User` | `Depends(get_current_user)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `не аннотирован`.

Dependencies: `get_current_user`, `get_db`.

Маршруты:

```python
router.get('/tasks/{key}', response_model=TaskTrackerTaskDetailOut)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `TaskTrackerService`
- `service.attach_project_access`
- `service.get_task`

</details>
