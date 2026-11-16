# backend/app/public_errors.py

Сгенерировано из объявлений кода. [Правила чтения](../../../METHODS.md).

Методов и именованных функций: **1**.

## public_message

[backend/app/public_errors.py:7](../../../../backend/app/public_errors.py#L7)

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
