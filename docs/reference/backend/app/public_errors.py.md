# backend/app/public_errors.py

Сгенерировано из объявлений кода. [Правила чтения](../../../METHODS.md).

Методов и именованных функций: **2**.

## error_payload

[backend/app/public_errors.py:10](../../../../backend/app/public_errors.py#L10)

```python
def error_payload(status: int, detail: object, identifier: str, code: object=None) -> dict
```

Единый совместимый формат всех HTTP-ошибок: текст, код и request_id.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `status` | `int` | `обязательный` | Статус операции/ресурса; допустимые значения задаёт Enum или схема. |
| `detail` | `object` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `identifier` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `code` | `object` | `None` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `dict`.

<details>
<summary>Прямые вызовы в теле</summary>

- `ERROR_CODES.get`
- `isinstance`
- `public_message`
- `re.fullmatch`

</details>

## public_message

[backend/app/public_errors.py:18](../../../../backend/app/public_errors.py#L18)

```python
def public_message(value: object, fallback: str='Не удалось выполнить действие. Попробуйте ещё раз.') -> str
```

Возвращает только короткое бизнес-сообщение без технических подробностей.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `value` | `object` | `обязательный` | Входное значение преобразования/проверки. |
| `fallback` | `str` | `'Не удалось выполнить действие. Попробуйте ещё раз.'` | Запасное значение при отсутствии основного. |

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `TECHNICAL_MESSAGE.search`
- `isinstance`
- `len`
- `value.strip`

</details>
