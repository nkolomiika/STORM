# backend/app/farm/core.py

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **13**.

## PublicNetworkBackend.__init__

[backend/app/farm/core.py:69](../../../../../backend/app/farm/core.py#L69)

```python
def __init__(self) -> не аннотирован
```

Создаёт экземпляр и сохраняет его зависимости; параметры перечислены ниже.

Возвращает: `не аннотирован`.

<details>
<summary>Прямые вызовы в теле</summary>

- `httpcore.AnyIOBackend`

</details>

## PublicNetworkBackend.connect_tcp

[backend/app/farm/core.py:72](../../../../../backend/app/farm/core.py#L72)

```python
async def connect_tcp(self, host, port, timeout=None, local_address=None, socket_options=None) -> не аннотирован
```

Никаких подключений к частично приватному или недоступному DNS-ответу.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `host` | `не аннотирован` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `port` | `не аннотирован` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `timeout` | `не аннотирован` | `None` | Предельное время ожидания операции. |
| `local_address` | `не аннотирован` | `None` | Определяется именем/типом и контрактом вызывающего кода. |
| `socket_options` | `не аннотирован` | `None` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `не аннотирован`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
httpcore.ConnectError('Цель недоступна или запрещена политикой сети')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `any`
- `asyncio.to_thread`
- `asyncio.wait_for`
- `dict.fromkeys`
- `httpcore.ConnectError`
- `is_disallowed_ip`
- `list`
- `self.backend.connect_tcp`

</details>

## PublicNetworkBackend.connect_unix_socket

[backend/app/farm/core.py:88](../../../../../backend/app/farm/core.py#L88)

```python
async def connect_unix_socket(self, *args, **kwargs) -> не аннотирован
```

Сканеры не имеют доступа к Unix-сокетам сервисов контейнера.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `args` | `не аннотирован` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `kwargs` | `не аннотирован` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `не аннотирован`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
httpcore.ConnectError('Цель недоступна или запрещена политикой сети')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `httpcore.ConnectError`

</details>

## PublicNetworkBackend.sleep

[backend/app/farm/core.py:92](../../../../../backend/app/farm/core.py#L92)

```python
async def sleep(self, seconds) -> не аннотирован
```

В теле вызывает `asyncio.sleep`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `seconds` | `не аннотирован` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `не аннотирован`.

<details>
<summary>Прямые вызовы в теле</summary>

- `asyncio.sleep`

</details>

## ProbeTransport.__init__

[backend/app/farm/core.py:98](../../../../../backend/app/farm/core.py#L98)

```python
def __init__(self, **kwargs) -> не аннотирован
```

Создаёт экземпляр и сохраняет его зависимости; параметры перечислены ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `kwargs` | `не аннотирован` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `не аннотирован`.

<details>
<summary>Прямые вызовы в теле</summary>

- `PublicNetworkBackend`
- `super`
- `super().__init__`

</details>

## resolve_scheme

[backend/app/farm/core.py:106](../../../../../backend/app/farm/core.py#L106)

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

[backend/app/farm/core.py:113](../../../../../backend/app/farm/core.py#L113)

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

[backend/app/farm/core.py:163](../../../../../backend/app/farm/core.py#L163)

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

[backend/app/farm/core.py:195](../../../../../backend/app/farm/core.py#L195)

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

[backend/app/farm/core.py:208](../../../../../backend/app/farm/core.py#L208)

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

[backend/app/farm/core.py:223](../../../../../backend/app/farm/core.py#L223)

```python
def build_transport(transport: httpx.AsyncBaseTransport | None, limits: httpx.Limits) -> httpx.AsyncBaseTransport
```

В теле вызывает `ProbeTransport`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `transport` | `httpx.AsyncBaseTransport \| None` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `limits` | `httpx.Limits` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `httpx.AsyncBaseTransport`.

<details>
<summary>Прямые вызовы в теле</summary>

- `ProbeTransport`

</details>

## probe_candidates

[backend/app/farm/core.py:231](../../../../../backend/app/farm/core.py#L231)

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

[backend/app/farm/core.py:249](../../../../../backend/app/farm/core.py#L249)

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
