# backend/app/mail_delivery.py

Сгенерировано из объявлений кода. [Правила чтения](../../../METHODS.md).

Методов и именованных функций: **2**.

## mail_error_code

[backend/app/mail_delivery.py:12](../../../../backend/app/mail_delivery.py#L12)

```python
def mail_error_code(error: Exception) -> str
```

Классифицирует сбой SMTP/OAuth; технический текст не возвращается пользователю.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `error` | `Exception` | `обязательный` | Перехваченное исключение/ответ ошибки. |

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(type(error).__name__ + ' ' + str(error)).lower`
- `any`
- `str`
- `type`

</details>

## invitation_delivery

[backend/app/mail_delivery.py:18](../../../../backend/app/mail_delivery.py#L18)

```python
async def invitation_delivery(db: AsyncSession, invitations: list[Invitation]) -> dict[int, dict]
```

Возвращает последние состояния писем одним запросом, не загружая их payload/секреты.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `db` | `AsyncSession` | `обязательный` | Асинхронная SQLAlchemy-сессия текущего запроса. |
| `invitations` | `list[Invitation]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `dict[int, dict]`.

Прямые операции с БД: `db.execute`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(await db.execute(select(ranked).where(ranked.c.position == 1))).mappings`
- `(await db.execute(select(ranked).where(ranked.c.position == 1))).mappings().all`
- `MAIL_ERRORS.get`
- `MailJob.id.desc`
- `MailJob.last_error.is_not`
- `MailJob.last_error.is_not(None).label`
- `MailJob.payload['delivery_error_code'].as_string`
- `MailJob.payload['delivery_error_code'].as_string().label`
- `MailJob.payload['invitation_id'].as_integer`
- `MailJob.recipient_email.in_`
- `db.execute`
- `func.row_number`
- `func.row_number().over`
- `func.row_number().over(partition_by=identifier, order_by=MailJob.id.desc()).label`
- `identifier.in_`
- `identifier.label`
- `select`
- `select(identifier.label('invitation_id'), MailJob.status, MailJob.payload['delivery_error_code'].as_string().label('code'), MailJob.last_error.is_not(None).label('has_error'), func.row_number().over(partition_by=identifier, order_by=MailJob.id.desc()).label('position')).where`
- `select(identifier.label('invitation_id'), MailJob.status, MailJob.payload['delivery_error_code'].as_string().label('code'), MailJob.last_error.is_not(None).label('has_error'), func.row_number().over(partition_by=identifier, order_by=MailJob.id.desc()).label('position')).where(MailJob.template == 'invitation', MailJob.recipient_email.in_([item.email for item in invitations]), identifier.in_([item.id for item in invitations])).subquery`
- `select(ranked).where`

</details>
