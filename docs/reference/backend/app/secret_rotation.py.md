# backend/app/secret_rotation.py

Сгенерировано из объявлений кода. [Правила чтения](../../../METHODS.md).

Методов и именованных функций: **2**.

## SecretRotationError.__init__

[backend/app/secret_rotation.py:25](../../../../backend/app/secret_rotation.py#L25)

```python
def __init__(self, result: RotationResult) -> не аннотирован
```

Создаёт экземпляр и сохраняет его зависимости; параметры перечислены ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `result` | `RotationResult` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `не аннотирован`.

<details>
<summary>Прямые вызовы в теле</summary>

- `super`
- `super().__init__`

</details>

## rotate_stored_secrets

[backend/app/secret_rotation.py:30](../../../../backend/app/secret_rotation.py#L30)

```python
async def rotate_stored_secrets(db: AsyncSession, *, legacy_keys: list[str] | None=None, apply: bool=False) -> RotationResult
```

Проверяет все записи; при apply атомарно перешифровывает старые.

Вызывать с новой сессией, при остановленных процессах, пишущих секреты.
Исторические ключи, включая прежний JWT, передаются только этой утилите.
Чтение идёт страницами по 500 строк. Нечитаемая запись отменяет весь перенос.
Повторный запуск не меняет уже перенесённые значения и время их обновления.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `db` | `AsyncSession` | `обязательный` | Асинхронная SQLAlchemy-сессия текущего запроса. |
| `legacy_keys` | `list[str] \| None` | `None` | Определяется именем/типом и контрактом вызывающего кода. |
| `apply` | `bool` | `False` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `RotationResult`.

Прямые операции с БД: `db.begin`, `db.execute`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
SecretRotationError(result)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `(await db.execute(query)).all`
- `RotationResult`
- `SecretRotationError`
- `_fernet`
- `active.decrypt`
- `active.decrypt(ciphertext.encode()).decode`
- `active.encrypt`
- `active.encrypt(plaintext.encode('utf-8')).decode`
- `ciphertext.encode`
- `db.begin`
- `db.execute`
- `dict.fromkeys`
- `field.is_not`
- `get_settings`
- `hasattr`
- `plaintext.encode`
- `previous.decrypt`
- `previous.decrypt(ciphertext.encode()).decode`
- `query.with_for_update`
- `select`
- `select(model.id, field).where`
- `select(model.id, field).where(model.id > last_id, field.is_not(None)).order_by`
- `select(model.id, field).where(model.id > last_id, field.is_not(None)).order_by(model.id).limit`
- `update`
- `update(model).where`
- `update(model).where(model.id == identifier).values`

</details>
