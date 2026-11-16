# backend/app/worker/recon_worker.py

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **5**.

## reclaim_stale_jobs

[backend/app/worker/recon_worker.py:33](../../../../../backend/app/worker/recon_worker.py#L33)

```python
async def reclaim_stale_jobs(db: AsyncSession, *, older_than_seconds: int, max_attempts: int, now: datetime | None=None) -> int
```

Возвращает застрявшие в queued/running задачи в pending.

Consumer стоит с requeue=False, а run_recon_job пропускает running/done —
поэтому краш воркера между публикацией и записью статуса (queued) или посреди
пробива (running) навсегда подвесил бы задачу: relay её не подхватит. Реклейм
по updated_at (обновляется на смене статуса) переигрывает такие задачи, пока
не исчерпаны попытки. Порог берётся с запасом больше времени пробива, чтобы не
задеть живую задачу параллельного воркера.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `db` | `AsyncSession` | `обязательный` | Асинхронная SQLAlchemy-сессия текущего запроса. |
| `older_than_seconds` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `max_attempts` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `now` | `datetime \| None` | `None` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `int`.

Прямые операции с БД: `db.commit`, `db.scalars`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(await db.scalars(select(HostFarmJob).where(and_(HostFarmJob.status.in_((ReconJobStatus.QUEUED, ReconJobStatus.RUNNING)), HostFarmJob.updated_at < cutoff, HostFarmJob.attempts < max_attempts)))).all`
- `HostFarmJob.status.in_`
- `and_`
- `datetime.now`
- `db.commit`
- `db.scalars`
- `len`
- `list`
- `logger.warning`
- `select`
- `select(HostFarmJob).where`
- `timedelta`

</details>

## wait_for_rabbitmq

[backend/app/worker/recon_worker.py:77](../../../../../backend/app/worker/recon_worker.py#L77)

```python
async def wait_for_rabbitmq(host: str, port: int, retry_delay: float=2.0) -> None
```

В теле вызывает `asyncio.open_connection`, `asyncio.sleep`, `logger.info`, `writer.close`, `writer.wait_closed`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `host` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `port` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `retry_delay` | `float` | `2.0` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `asyncio.open_connection`
- `asyncio.sleep`
- `logger.info`
- `writer.close`
- `writer.wait_closed`

</details>

## relay_pending_jobs

[backend/app/worker/recon_worker.py:98](../../../../../backend/app/worker/recon_worker.py#L98)

```python
async def relay_pending_jobs(channel: aio_pika.abc.AbstractChannel, queue_name: str) -> None
```

Публикует задачи со статусом pending и помечает их queued.

Задачи, упавшие с ошибкой, но не исчерпавшие попытки, тоже возвращаются в
очередь — сетевой сбой не должен хоронить импорт целиком.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `channel` | `aio_pika.abc.AbstractChannel` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `queue_name` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

Прямые операции с БД: `db.commit`, `db.scalars`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(await db.scalars(select(HostFarmJob).where(or_(HostFarmJob.status == ReconJobStatus.PENDING, and_(HostFarmJob.status == ReconJobStatus.FAILED, HostFarmJob.attempts < settings.recon_max_attempts))).order_by(HostFarmJob.created_at.asc()).limit(50))).all`
- `HostFarmJob.created_at.asc`
- `SessionLocal`
- `aio_pika.Message`
- `and_`
- `asyncio.sleep`
- `channel.default_exchange.publish`
- `datetime.now`
- `db.commit`
- `db.scalars`
- `list`
- `logger.info`
- `or_`
- `reclaim_stale_jobs`
- `select`
- `select(HostFarmJob).where`
- `select(HostFarmJob).where(or_(HostFarmJob.status == ReconJobStatus.PENDING, and_(HostFarmJob.status == ReconJobStatus.FAILED, HostFarmJob.attempts < settings.recon_max_attempts))).order_by`
- `select(HostFarmJob).where(or_(HostFarmJob.status == ReconJobStatus.PENDING, and_(HostFarmJob.status == ReconJobStatus.FAILED, HostFarmJob.attempts < settings.recon_max_attempts))).order_by(HostFarmJob.created_at.asc()).limit`
- `str`
- `str(job.id).encode`

</details>

## consume_recon_jobs

[backend/app/worker/recon_worker.py:148](../../../../../backend/app/worker/recon_worker.py#L148)

```python
async def consume_recon_jobs(queue: aio_pika.abc.AbstractQueue) -> None
```

В теле вызывает `int`, `message.body.decode`, `message.process`, `queue.iterator`, `run_recon_job`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `queue` | `aio_pika.abc.AbstractQueue` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `int`
- `message.body.decode`
- `message.process`
- `queue.iterator`
- `run_recon_job`

</details>

## main

[backend/app/worker/recon_worker.py:155](../../../../../backend/app/worker/recon_worker.py#L155)

```python
async def main() -> None
```

В теле вызывает `','.join`, `aio_pika.connect_robust`, `asyncio.create_task`, `asyncio.gather`, `asyncio.sleep`, `channel.declare_queue`, `channel.set_qos`, `connection.channel`; полный список ниже.

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `','.join`
- `aio_pika.connect_robust`
- `asyncio.create_task`
- `asyncio.gather`
- `asyncio.sleep`
- `channel.declare_queue`
- `channel.set_qos`
- `connection.channel`
- `consume_recon_jobs`
- `logger.exception`
- `logger.info`
- `logger.warning`
- `relay_pending_jobs`
- `socket.getaddrinfo`
- `sorted`
- `urlsplit`
- `wait_for_rabbitmq`

</details>
