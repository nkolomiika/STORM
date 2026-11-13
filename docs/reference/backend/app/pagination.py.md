# backend/app/pagination.py

Сгенерировано из объявлений кода. [Правила чтения](../../../METHODS.md).

Методов и именованных функций: **2**.

## PageParams.offset

[backend/app/pagination.py:22](../../../../backend/app/pagination.py#L22)

```python
def offset(self) -> int
```

Смещение для SQL-запроса.

Возвращает: `int`.

## to_paginated_response

[backend/app/pagination.py:37](../../../../backend/app/pagination.py#L37)

```python
def to_paginated_response(items: list[T], total: int, params: PageParams) -> PaginatedResponse[T]
```

Собирает объект пагинации по данным и параметрам страницы.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `items` | `list[T]` | `обязательный` | Набор элементов для обработки. |
| `total` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `params` | `PageParams` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `PaginatedResponse[T]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `PaginatedResponse[T]`
- `ceil`
- `max`

</details>
