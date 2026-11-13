# backend/app/farm/jobs.py

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **3**.

## _cap_result

[backend/app/farm/jobs.py:49](../../../../../backend/app/farm/jobs.py#L49)

```python
def _cap_result(payload: dict, limit: int) -> dict
```

Обрезает детальные списки result до limit — размер блоба не зависит от
числа целей. Счётчики (hosts_created, ports_created, …) — отдельные скаляры и
не трогаются, поэтому итоги остаются точными.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `payload` | `dict` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `limit` | `int` | `обязательный` | Максимальное число возвращаемых записей. |

Возвращает: `dict`.

<details>
<summary>Прямые вызовы в теле</summary>

- `isinstance`
- `len`
- `payload.get`

</details>

## run_recon_job

[backend/app/farm/jobs.py:60](../../../../../backend/app/farm/jobs.py#L60)

```python
async def run_recon_job(job_id: int) -> None
```

Прогон задачи по одному лишь id.

Цели, тип и автор берутся из самой задачи: воркер живёт в другом процессе и
получает из очереди только id. Сессия своя — сессия запроса к этому моменту
уже закрыта.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `job_id` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

Прямые операции с БД: `db.commit`, `db.rollback`, `db.scalar`.

<details>
<summary>Прямые вызовы в теле</summary>

- `SessionLocal`
- `_SERVICES.get`
- `_cap_result`
- `datetime.now`
- `db.commit`
- `db.rollback`
- `db.scalar`
- `logger.exception`
- `logger.warning`
- `result.model_dump`
- `select`
- `select(HostFarmJob).where`
- `service_cls`
- `service_cls(db).probe_and_import`
- `str`

</details>

## enqueue_job

[backend/app/farm/jobs.py:124](../../../../../backend/app/farm/jobs.py#L124)

```python
def enqueue_job(job: HostFarmJob, background_tasks: BackgroundTasks) -> None
```

Отдаёт задачу исполнителю: очередь (recon-worker) либо BackgroundTasks.

В режиме очереди делать ничего не нужно — задача уже лежит в БД со
статусом pending, её подхватит relay воркера.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `job` | `HostFarmJob` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `background_tasks` | `BackgroundTasks` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `background_tasks.add_task`

</details>
