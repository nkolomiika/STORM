# backend/app/routers/audit_logs.py

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **1**.

## list_audit_logs

[backend/app/routers/audit_logs.py:17](../../../../../backend/app/routers/audit_logs.py#L17)

```python
async def list_audit_logs(page: int=Query(1, ge=1), size: int=Query(50, ge=1, le=200), user_id: int | None=None, username: str | None=None, action: str | None=None, entity_type: str | None=None, entity_id: int | None=None, ip_address: str | None=None, query: str | None=None, created_from: str | None=None, created_to: str | None=None, _admin: User=Depends(require_admin), db: AsyncSession=Depends(get_db)) -> dict
```

Возвращает журнал действий с фильтрацией.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `page` | `int` | `Query(1, ge=1)` | Номер страницы, начиная с 1. |
| `size` | `int` | `Query(50, ge=1, le=200)` | Число элементов страницы; верхняя граница задаётся маршрутом. |
| `user_id` | `int \| None` | `None` | ID пользователя. |
| `username` | `str \| None` | `None` | Имя пользователя. |
| `action` | `str \| None` | `None` | Тип события аудита. |
| `entity_type` | `str \| None` | `None` | Тип сущности в журнале аудита. |
| `entity_id` | `int \| None` | `None` | ID сущности в журнале, если событие связано с записью. |
| `ip_address` | `str \| None` | `None` | IP-адрес; в AuditService — адрес клиента. |
| `query` | `str \| None` | `None` | Определяется именем/типом и контрактом вызывающего кода. |
| `created_from` | `str \| None` | `None` | Определяется именем/типом и контрактом вызывающего кода. |
| `created_to` | `str \| None` | `None` | Определяется именем/типом и контрактом вызывающего кода. |
| `_admin` | `User` | `Depends(require_admin)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `dict`.

Dependencies: `require_admin`, `get_db`.

Маршруты:

```python
router.get('', response_model=dict)
```

Прямые операции с БД: `db.execute`, `db.scalar`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(await db.execute(stmt.order_by(AuditLog.created_at.desc()).offset((page - 1) * size).limit(size))).all`
- `AuditLog.action.ilike`
- `AuditLog.created_at.desc`
- `AuditLog.details['source'].as_string`
- `AuditLog.entity_type.ilike`
- `AuditLog.ip_address.ilike`
- `AuditLogOut.model_validate`
- `PageParams`
- `User.username.ilike`
- `action.strip`
- `and_`
- `cast`
- `cast(AuditLog.details, Text).ilike`
- `conditions.append`
- `created_from.replace`
- `created_to.replace`
- `datetime.fromisoformat`
- `db.execute`
- `db.scalar`
- `entity_type.strip`
- `func.count`
- `ip_address.strip`
- `isinstance`
- `not_`
- `or_`
- `query.strip`
- `select`
- `select(AuditLog, User.username).outerjoin`
- `select(func.count()).select_from`
- `stmt.order_by`
- `stmt.order_by(AuditLog.created_at.desc()).offset`
- `stmt.order_by(AuditLog.created_at.desc()).offset((page - 1) * size).limit`
- `stmt.subquery`
- `stmt.where`
- `to_paginated_response`
- `to_paginated_response(payload, total_count, PageParams(page=page, size=size)).model_dump`
- `username.strip`

</details>
