# backend/app/routers/task_tracker.py

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **2**.

## list_tasks

[backend/app/routers/task_tracker.py:11](../../../../../backend/app/routers/task_tracker.py#L11)

```python
async def list_tasks(query: str | None=None, category: str | None=None, _user: User=Depends(get_current_user)) -> не аннотирован
```

Обработчик маршрута; контракт запроса и ответа приведён в справочнике HTTP API.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `query` | `str \| None` | `None` | Определяется именем/типом и контрактом вызывающего кода. |
| `category` | `str \| None` | `None` | Определяется именем/типом и контрактом вызывающего кода. |
| `_user` | `User` | `Depends(get_current_user)` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `не аннотирован`.

Dependencies: `get_current_user`.

Маршруты:

```python
router.get('/tasks', response_model=TaskTrackerTaskListOut)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `TaskTrackerService`
- `TaskTrackerService().list_tasks`

</details>

## get_task

[backend/app/routers/task_tracker.py:16](../../../../../backend/app/routers/task_tracker.py#L16)

```python
async def get_task(key: str, _user: User=Depends(get_current_user)) -> не аннотирован
```

Обработчик маршрута; контракт запроса и ответа приведён в справочнике HTTP API.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `key` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `_user` | `User` | `Depends(get_current_user)` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `не аннотирован`.

Dependencies: `get_current_user`.

Маршруты:

```python
router.get('/tasks/{key}', response_model=TaskTrackerTaskDetailOut)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `TaskTrackerService`
- `TaskTrackerService().get_task`

</details>
