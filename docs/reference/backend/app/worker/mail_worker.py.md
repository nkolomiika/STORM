# backend/app/worker/mail_worker.py

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **5**.

## wait_for_rabbitmq

[backend/app/worker/mail_worker.py:24](../../../../../backend/app/worker/mail_worker.py#L24)

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

[backend/app/worker/mail_worker.py:60](../../../../../backend/app/worker/mail_worker.py#L60)

```python
async def relay_pending_jobs(channel: aio_pika.abc.AbstractChannel, queue_name: str) -> None
```

В теле вызывает `(await db.scalars(select(MailJob).where(or_(MailJob.status == 'pending', and_(MailJob.status == 'failed', MailJob.attempts < settings.mail_max_attempts))).order_by(MailJob.created_at.asc()).limit(50))).all`, `MailJob.created_at.asc`, `SessionLocal`, `aio_pika.Message`, `and_`, `asyncio.sleep`, `channel.default_exchange.publish`, `datetime.now`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `channel` | `aio_pika.abc.AbstractChannel` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `queue_name` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

Прямые операции с БД: `db.commit`, `db.scalars`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(await db.scalars(select(MailJob).where(or_(MailJob.status == 'pending', and_(MailJob.status == 'failed', MailJob.attempts < settings.mail_max_attempts))).order_by(MailJob.created_at.asc()).limit(50))).all`
- `MailJob.created_at.asc`
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
- `select`
- `select(MailJob).where`
- `select(MailJob).where(or_(MailJob.status == 'pending', and_(MailJob.status == 'failed', MailJob.attempts < settings.mail_max_attempts))).order_by`
- `select(MailJob).where(or_(MailJob.status == 'pending', and_(MailJob.status == 'failed', MailJob.attempts < settings.mail_max_attempts))).order_by(MailJob.created_at.asc()).limit`
- `str`
- `str(job.id).encode`

</details>

## process_mail_job

[backend/app/worker/mail_worker.py:96](../../../../../backend/app/worker/mail_worker.py#L96)

```python
async def process_mail_job(job_id: int) -> None
```

Отправляет письмо, фиксирует ретрай и безопасный код ошибки для интерфейса.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `job_id` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

Прямые операции с БД: `db.commit`, `db.scalar`.

<details>
<summary>Прямые вызовы в теле</summary>

- `SessionLocal`
- `datetime.now`
- `db.commit`
- `db.scalar`
- `job.payload.get`
- `job.payload.items`
- `logger.exception`
- `logger.info`
- `mail_error_code`
- `redact_log`
- `select`
- `select(MailJob).where`
- `send_plain_text_email`
- `str`
- `time.monotonic`

</details>

## consume_mail_jobs

[backend/app/worker/mail_worker.py:135](../../../../../backend/app/worker/mail_worker.py#L135)

```python
async def consume_mail_jobs(queue: aio_pika.abc.AbstractQueue) -> None
```

В теле вызывает `int`, `message.body.decode`, `message.process`, `process_mail_job`, `queue.iterator`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `queue` | `aio_pika.abc.AbstractQueue` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `int`
- `message.body.decode`
- `message.process`
- `process_mail_job`
- `queue.iterator`

</details>

## main

[backend/app/worker/mail_worker.py:142](../../../../../backend/app/worker/mail_worker.py#L142)

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
- `consume_mail_jobs`
- `logger.exception`
- `logger.info`
- `logger.warning`
- `relay_pending_jobs`
- `socket.getaddrinfo`
- `sorted`
- `urlsplit`
- `wait_for_rabbitmq`

</details>
