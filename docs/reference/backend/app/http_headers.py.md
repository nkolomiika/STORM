# backend/app/http_headers.py

Сгенерировано из объявлений кода. [Правила чтения](../../../METHODS.md).

Методов и именованных функций: **1**.

## content_disposition

[backend/app/http_headers.py:6](../../../../backend/app/http_headers.py#L6)

```python
def content_disposition(filename: str, disposition: Literal['inline', 'attachment']='attachment') -> str
```

Сохраняет имя файла через UTF-8 filename*, если оно требует экранирования.

Заголовки Starlette кодируются latin-1: кириллица в обычном filename иначе
вызывает UnicodeEncodeError и HTTP 500. Простые ASCII-имена не меняются.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `filename` | `str` | `обязательный` | Имя файла. |
| `disposition` | `Literal['inline', 'attachment']` | `'attachment'` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `quote`

</details>
