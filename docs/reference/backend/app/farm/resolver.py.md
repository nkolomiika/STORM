# backend/app/farm/resolver.py

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **10**.

## ResolvedName.as_dict

[backend/app/farm/resolver.py:56](../../../../../backend/app/farm/resolver.py#L56)

```python
def as_dict(self) -> dict
```

Преобразование/вычисление в теле функции; тип результата и параметры приведены ниже, точное выражение доступно по ссылке на исходник.

Возвращает: `dict`.

## is_ip_literal

[backend/app/farm/resolver.py:67](../../../../../backend/app/farm/resolver.py#L67)

```python
def is_ip_literal(value: str) -> bool
```

В теле вызывает `ipaddress.ip_address`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `value` | `str` | `обязательный` | Входное значение преобразования/проверки. |

Возвращает: `bool`.

<details>
<summary>Прямые вызовы в теле</summary>

- `ipaddress.ip_address`

</details>

## order_addrs

[backend/app/farm/resolver.py:75](../../../../../backend/app/farm/resolver.py#L75)

```python
def order_addrs(infos: list) -> list[str]
```

Все адреса из getaddrinfo без дублей: сначала IPv4, затем IPv6.

Порядок значим — первый адрес становится primary у хоста, а IPv4 остаётся
предпочтительным для пробива (как и в исходной _pick_addr).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `infos` | `list` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `list[str]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `dict.fromkeys`
- `list`

</details>

## _getaddrinfo

[backend/app/farm/resolver.py:89](../../../../../backend/app/farm/resolver.py#L89)

```python
async def _getaddrinfo(host: str, timeout: float | None=None) -> list
```

В теле вызывает `asyncio.to_thread`, `asyncio.wait_for`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `host` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `timeout` | `float \| None` | `None` | Предельное время ожидания операции. |

Возвращает: `list`.

<details>
<summary>Прямые вызовы в теле</summary>

- `asyncio.to_thread`
- `asyncio.wait_for`

</details>

## resolve_forward

[backend/app/farm/resolver.py:96](../../../../../backend/app/farm/resolver.py#L96)

```python
async def resolve_forward(hostnames: list[str]) -> dict[str, ResolvedHost]
```

Резолвит имена в адреса. IP-литералы не резолвятся, но проходят SSRF-гейт.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `hostnames` | `list[str]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `dict[str, ResolvedHost]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `asyncio.Semaphore`
- `asyncio.gather`
- `dict`
- `resolve_one`

</details>

## resolve_forward.resolve_one

[backend/app/farm/resolver.py:100](../../../../../backend/app/farm/resolver.py#L100)

```python
async def resolve_one(host: str) -> tuple[str, ResolvedHost]
```

В теле вызывает `ResolvedHost`, `_getaddrinfo`, `any`, `is_disallowed_ip`, `is_ip_literal`, `order_addrs`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `host` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `tuple[str, ResolvedHost]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `ResolvedHost`
- `_getaddrinfo`
- `any`
- `is_disallowed_ip`
- `is_ip_literal`
- `order_addrs`

</details>

## merge_names

[backend/app/farm/resolver.py:123](../../../../../backend/app/farm/resolver.py#L123)

```python
def merge_names(names: list[ResolvedName]) -> list[ResolvedName]
```

Дедуп по имени: confirmed = OR, приоритет source — ptr над project.

Сортировка: подтверждённые выше, затем PTR над project, затем по алфавиту —
чтобы в UI первым шло самое достоверное имя.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `names` | `list[ResolvedName]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `list[ResolvedName]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `ResolvedName`
- `merged.get`
- `merged.values`
- `sorted`

</details>

## reverse_resolve

[backend/app/farm/resolver.py:144](../../../../../backend/app/farm/resolver.py#L144)

```python
async def reverse_resolve(ips: list[str], project_hostnames: list[str]) -> dict[str, ReverseResult]
```

Определяет, в какие имена резолвится каждый IP (PTR + сверка с проектом).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `ips` | `list[str]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `project_hostnames` | `list[str]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `dict[str, ReverseResult]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `ResolvedName`
- `ReverseResult`
- `addrs_of`
- `asyncio.Semaphore`
- `asyncio.gather`
- `candidates.update`
- `collected.extend`
- `dict`
- `forward.get`
- `h.lower`
- `h.lower().rstrip`
- `is_disallowed_ip`
- `merge_names`
- `ptr_by_ip.values`
- `ptr_names`
- `set`
- `sorted`
- `zip`

</details>

## reverse_resolve.addrs_of

[backend/app/farm/resolver.py:159](../../../../../backend/app/farm/resolver.py#L159)

```python
async def addrs_of(hostname: str) -> set[str]
```

Прямой резолв имени; при любой ошибке — пустое множество.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `hostname` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `set[str]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `_getaddrinfo`
- `order_addrs`
- `set`

</details>

## reverse_resolve.ptr_names

[backend/app/farm/resolver.py:168](../../../../../backend/app/farm/resolver.py#L168)

```python
async def ptr_names(ip: str) -> tuple[list[str], str | None]
```

В теле вызывает `asyncio.to_thread`, `asyncio.wait_for`, `dict.fromkeys`, `list`, `n.lower`, `n.lower().rstrip`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `ip` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `tuple[list[str], str \| None]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `asyncio.to_thread`
- `asyncio.wait_for`
- `dict.fromkeys`
- `list`
- `n.lower`
- `n.lower().rstrip`

</details>
