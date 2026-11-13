# backend/app/messaging.py

Сгенерировано из объявлений кода. [Правила чтения](../../../METHODS.md).

Методов и именованных функций: **1**.

## publish_mail_job

[backend/app/messaging.py:10](../../../../backend/app/messaging.py#L10)

```python
async def publish_mail_job(job_id: int) -> None
```

В теле вызывает `Message`, `aio_pika.connect_robust`, `channel.declare_queue`, `channel.default_exchange.publish`, `connection.channel`, `str`, `str(job_id).encode`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `job_id` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Message`
- `aio_pika.connect_robust`
- `channel.declare_queue`
- `channel.default_exchange.publish`
- `connection.channel`
- `str`
- `str(job_id).encode`

</details>
