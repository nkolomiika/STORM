# backend/app/exceptions.py

Сгенерировано из объявлений кода. [Правила чтения](../../../METHODS.md).

Методов и именованных функций: **1**.

## ServiceUnavailableError.__init__

[backend/app/exceptions.py:27](../../../../backend/app/exceptions.py#L27)

```python
def __init__(self, message: str, code: str='service_unavailable') -> None
```

Создаёт экземпляр и сохраняет его зависимости; параметры перечислены ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `message` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `code` | `str` | `'service_unavailable'` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `super`
- `super().__init__`

</details>
