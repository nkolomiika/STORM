# backend/app/cloudflare.py

Сгенерировано из объявлений кода. [Правила чтения](../../../METHODS.md).

Методов и именованных функций: **1**.

## is_cloudflare_ip

[backend/app/cloudflare.py:52](../../../../backend/app/cloudflare.py#L52)

```python
def is_cloudflare_ip(addr: str | None) -> bool
```

True, если адрес принадлежит опубликованным сетям Cloudflare.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `addr` | `str \| None` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `bool`.

<details>
<summary>Прямые вызовы в теле</summary>

- `any`
- `ipaddress.ip_address`

</details>
