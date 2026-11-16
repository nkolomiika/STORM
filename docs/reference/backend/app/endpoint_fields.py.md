# backend/app/endpoint_fields.py

Сгенерировано из объявлений кода. [Правила чтения](../../../METHODS.md).

Методов и именованных функций: **1**.

## merge_endpoint_fields

[backend/app/endpoint_fields.py:5](../../../../backend/app/endpoint_fields.py#L5)

```python
def merge_endpoint_fields(endpoint: Endpoint, payload: dict) -> None
```

Заполняет только пустые поля; не перезаписывает уже сохранённый запрос.

Используется ручным добавлением и обоими импортами. Транзакцией управляет
вызывающий сервис; функция не выполняет SQL и не меняет идентификатор.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `endpoint` | `Endpoint` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `payload` | `dict` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `getattr`
- `payload.get`
- `setattr`

</details>
