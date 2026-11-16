# backend/app/farm/job_access.py

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **1**.

## get_recon_job

[backend/app/farm/job_access.py:8](../../../../../backend/app/farm/job_access.py#L8)

```python
async def get_recon_job(db: AsyncSession, project_id: int, job_id: int, kind: str, message: str='Задача фермы не найдена') -> HostFarmJob
```

Возвращает задание нужного вида/проекта или NotFoundError без раскрытия чужих данных.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `db` | `AsyncSession` | `обязательный` | Асинхронная SQLAlchemy-сессия текущего запроса. |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `job_id` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `kind` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `message` | `str` | `'Задача фермы не найдена'` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `HostFarmJob`.

Прямые операции с БД: `db.scalar`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
NotFoundError(message)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `NotFoundError`
- `db.scalar`
- `select`
- `select(HostFarmJob).where`

</details>
