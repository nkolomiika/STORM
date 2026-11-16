# backend/app/farm/core.py

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **9**.

## ProbeTransport.handle_async_request

[backend/app/farm/core.py:66](../../../../../backend/app/farm/core.py#L66)

```python
async def handle_async_request(self, request: httpx.Request) -> httpx.Response
```

В теле вызывает `asyncio.to_thread`, `httpx.ConnectError`, `is_disallowed_ip`, `super`, `super().handle_async_request`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `request` | `httpx.Request` | `обязательный` | HTTP-запрос Starlette/FastAPI. |

Возвращает: `httpx.Response`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
httpx.ConnectError(f'DNS не разрешает {host}: {exc}')
httpx.ConnectError(f'{addr} для {host} запрещён (SSRF)')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `asyncio.to_thread`
- `httpx.ConnectError`
- `is_disallowed_ip`
- `super`
- `super().handle_async_request`

</details>

## resolve_scheme

[backend/app/farm/core.py:85](../../../../../backend/app/farm/core.py#L85)

```python
def resolve_scheme(existing: str | None, new: str | None, port: int) -> str
```

Конфликт схемы на один (host, port): https побеждает.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `existing` | `str \| None` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `new` | `str \| None` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `port` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `str`.

## parse_token

[backend/app/farm/core.py:92](../../../../../backend/app/farm/core.py#L92)

```python
def parse_token(token: str) -> tuple[str, bool, int | None, str | None] | None
```

(hostname, is_ip, port|None, scheme|None) или None, если токен невалиден.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `token` | `str` | `обязательный` | Токен операции; формат определяется вызывающим методом. |

Возвращает: `tuple[str, bool, int \| None, str \| None] \| None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(split.scheme or '').lower`
- `_HOSTNAME_RE.match`
- `host.encode`
- `host.encode('idna').decode`
- `host.lower`
- `host.lower().rstrip`
- `ipaddress.ip_address`
- `str`
- `urlsplit`

</details>

## parse_targets

[backend/app/farm/core.py:142](../../../../../backend/app/farm/core.py#L142)

```python
def parse_targets(raw: str) -> tuple[dict[str, ParsedTarget], list[str]]
```

Разбирает вставленный текст в {hostname: ParsedTarget} + список ошибок.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `raw` | `str` | `обязательный` | Исходное значение до нормализации/разбора. |

Возвращает: `tuple[dict[str, ParsedTarget], list[str]]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(raw or '').splitlines`
- `ParsedTarget`
- `entry.explicit_ports.get`
- `errors.append`
- `line.startswith`
- `line.strip`
- `parse_token`
- `re.split`
- `resolve_scheme`
- `seen_invalid.add`
- `set`
- `targets.get`
- `token.strip`

</details>

## candidates_for

[backend/app/farm/core.py:174](../../../../../backend/app/farm/core.py#L174)

```python
def candidates_for(tgt: ParsedTarget) -> list[ProbeCandidate]
```

Явные порты пробиваем как есть; при их отсутствии — курируемый топ веб-портов.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `tgt` | `ParsedTarget` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `list[ProbeCandidate]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `ProbeCandidate`
- `tgt.explicit_ports.items`

</details>

## trim_excess_ports

[backend/app/farm/core.py:187](../../../../../backend/app/farm/core.py#L187)

```python
def trim_excess_ports(targets: dict[str, ParsedTarget]) -> list[str]
```

Обрезает явные порты сверх лимита (оставляя младшие), возвращает ошибки.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `targets` | `dict[str, ParsedTarget]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `list[str]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `errors.append`
- `len`
- `sorted`
- `targets.items`

</details>

## build_transport

[backend/app/farm/core.py:202](../../../../../backend/app/farm/core.py#L202)

```python
def build_transport(transport: httpx.AsyncBaseTransport | None, limits: httpx.Limits) -> httpx.AsyncBaseTransport
```

В теле вызывает `ProbeTransport`, `httpx.AsyncHTTPTransport`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `transport` | `httpx.AsyncBaseTransport \| None` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `limits` | `httpx.Limits` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `httpx.AsyncBaseTransport`.

<details>
<summary>Прямые вызовы в теле</summary>

- `ProbeTransport`
- `httpx.AsyncHTTPTransport`

</details>

## probe_candidates

[backend/app/farm/core.py:212](../../../../../backend/app/farm/core.py#L212)

```python
async def probe_candidates(candidates: list[ProbeCandidate], *, transport: httpx.AsyncBaseTransport | None=None) -> list[ProbeResult]
```

HTTP-пробив кандидатов до корня `/`. БД не трогает.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `candidates` | `list[ProbeCandidate]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `transport` | `httpx.AsyncBaseTransport \| None` | `None` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `list[ProbeResult]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `asyncio.Semaphore`
- `asyncio.gather`
- `build_transport`
- `httpx.AsyncClient`
- `httpx.Limits`
- `httpx.Timeout`
- `probe_one`

</details>

## probe_candidates.probe_one

[backend/app/farm/core.py:230](../../../../../backend/app/farm/core.py#L230)

```python
async def probe_one(c: ProbeCandidate) -> ProbeResult
```

В теле вызывает `ProbeResult`, `client.stream`, `type`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `c` | `ProbeCandidate` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `ProbeResult`.

<details>
<summary>Прямые вызовы в теле</summary>

- `ProbeResult`
- `client.stream`
- `type`

</details>
