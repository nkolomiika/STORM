# backend/app/farm/fingerprint.py

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **13**.

## url_for

[backend/app/farm/fingerprint.py:56](../../../../../backend/app/farm/fingerprint.py#L56)

```python
def url_for(p: ProbeResult) -> str
```

Преобразование/вычисление в теле функции; тип результата и параметры приведены ниже, точное выражение доступно по ссылке на исходник.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `p` | `ProbeResult` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `str`.

## _url_key

[backend/app/farm/fingerprint.py:61](../../../../../backend/app/farm/fingerprint.py#L61)

```python
def _url_key(u: str) -> tuple[str, str, int]
```

(scheme, host, port) с раскрытым дефолтным портом — для матчинга вывода
инструмента (который нормализует URL) обратно на нашу цель.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `u` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `tuple[str, str, int]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(s.hostname or '').lower`
- `(s.scheme or 'http').lower`
- `urlsplit`

</details>

## has_cloudflare

[backend/app/farm/fingerprint.py:75](../../../../../backend/app/farm/fingerprint.py#L75)

```python
def has_cloudflare(techs: list[Tech]) -> bool
```

Есть ли среди технологий Cloudflare — для вывода CF-флага по детекту.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `techs` | `list[Tech]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `bool`.

<details>
<summary>Прямые вызовы в теле</summary>

- `any`
- `t.name.lower`

</details>

## _split_tech

[backend/app/farm/fingerprint.py:83](../../../../../backend/app/farm/fingerprint.py#L83)

```python
def _split_tech(raw: str) -> Tech
```

'Nginx:1.25.3' → Tech(Nginx, 1.25.3); 'Cloudflare' / 'HTTP/3' → без версии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `raw` | `str` | `обязательный` | Исходное значение до нормализации/разбора. |

Возвращает: `Tech`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Tech`
- `name.strip`
- `raw.strip`
- `s.rpartition`
- `ver.strip`
- `ver[0].isdigit`

</details>

## parse_httpx_jsonl

[backend/app/farm/fingerprint.py:93](../../../../../backend/app/farm/fingerprint.py#L93)

```python
def parse_httpx_jsonl(raw: str) -> dict[str, list[Tech]]
```

httpx -json (JSONL) → {url: [Tech]}. Стек из tech + webserver + cdn_name.

cdn_name/webserver добавляем как технологию, если их ещё нет: так Cloudflare
попадёт в чипы (и во флаг CF) даже когда httpx не положил его в tech.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `raw` | `str` | `обязательный` | Исходное значение до нормализации/разбора. |

Возвращает: `dict[str, list[Tech]]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(raw or '').splitlines`
- `Tech`
- `_split_tech`
- `entry.get`
- `isinstance`
- `json.loads`
- `line.strip`
- `list`
- `str`
- `str(val).lower`
- `str(val).strip`
- `str(val).strip().capitalize`
- `t.name.lower`
- `techs.setdefault`
- `techs.values`

</details>

## _run_httpx

[backend/app/farm/fingerprint.py:126](../../../../../backend/app/farm/fingerprint.py#L126)

```python
async def _run_httpx(urls: list[str]) -> dict[str, list[Tech]]
```

В теле вызывает `'\n'.join`, `'\n'.join(urls).encode`, `asyncio.create_subprocess_exec`, `asyncio.wait_for`, `int`, `len`, `out.decode`, `parse_httpx_jsonl`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `urls` | `list[str]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `dict[str, list[Tech]]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `'\n'.join`
- `'\n'.join(urls).encode`
- `asyncio.create_subprocess_exec`
- `asyncio.wait_for`
- `int`
- `len`
- `out.decode`
- `parse_httpx_jsonl`
- `proc.communicate`
- `str`

</details>

## parse_whatweb_json

[backend/app/farm/fingerprint.py:155](../../../../../backend/app/farm/fingerprint.py#L155)

```python
def parse_whatweb_json(raw: str) -> list[Tech]
```

Стек из whatweb --log-json для одной цели (запасной движок).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `raw` | `str` | `обязательный` | Исходное значение до нормализации/разбора. |

Возвращает: `list[Tech]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(plugins if isinstance(plugins, dict) else {}).items`
- `(raw or '').strip`
- `Tech`
- `entries.append`
- `entry.get`
- `info.get`
- `isinstance`
- `json.loads`
- `label.lower`
- `line.strip`
- `line.strip().rstrip`
- `list`
- `raw.splitlines`
- `str`
- `strings[0].split`
- `strings[0].split('/')[0].strip`
- `techs.values`

</details>

## _run_whatweb_one

[backend/app/farm/fingerprint.py:200](../../../../../backend/app/farm/fingerprint.py#L200)

```python
async def _run_whatweb_one(url: str) -> list[Tech]
```

В теле вызывает `asyncio.create_subprocess_exec`, `asyncio.wait_for`, `int`, `out.decode`, `parse_whatweb_json`, `proc.communicate`, `str`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `url` | `str` | `обязательный` | URL обрабатываемого ресурса. |

Возвращает: `list[Tech]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `asyncio.create_subprocess_exec`
- `asyncio.wait_for`
- `int`
- `out.decode`
- `parse_whatweb_json`
- `proc.communicate`
- `str`

</details>

## _run_whatweb

[backend/app/farm/fingerprint.py:218](../../../../../backend/app/farm/fingerprint.py#L218)

```python
async def _run_whatweb(urls: list[str]) -> dict[str, list[Tech]]
```

В теле вызывает `asyncio.Semaphore`, `asyncio.gather`, `dict`, `one`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `urls` | `list[str]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `dict[str, list[Tech]]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `asyncio.Semaphore`
- `asyncio.gather`
- `dict`
- `one`

</details>

## _run_whatweb.one

[backend/app/farm/fingerprint.py:221](../../../../../backend/app/farm/fingerprint.py#L221)

```python
async def one(u: str) -> tuple[str, list[Tech]]
```

В теле вызывает `_run_whatweb_one`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `u` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `tuple[str, list[Tech]]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `_run_whatweb_one`

</details>

## _pick_engine

[backend/app/farm/fingerprint.py:231](../../../../../backend/app/farm/fingerprint.py#L231)

```python
def _pick_engine() -> Callable[[list[str]], Awaitable[dict[str, list[Tech]]]] | None
```

Движок по настройке с фолбэком; None — ни один бинарь не установлен.

Возвращает: `Callable[[list[str]], Awaitable[dict[str, list[Tech]]]] \| None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `shutil.which`

</details>

## _regate_external

[backend/app/farm/fingerprint.py:244](../../../../../backend/app/farm/fingerprint.py#L244)

```python
async def _regate_external(responding: list[ProbeResult], resolver: Resolver) -> list[ProbeResult]
```

Свежий резолв ответивших хостов; оставляет только внешне-резолвящиеся.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `responding` | `list[ProbeResult]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `resolver` | `Resolver` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `list[ProbeResult]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `list`
- `resolved.items`
- `resolver`

</details>

## detect_services

[backend/app/farm/fingerprint.py:252](../../../../../backend/app/farm/fingerprint.py#L252)

```python
async def detect_services(probes: list[ProbeResult], *, detector: Callable[[list[str]], Awaitable[dict[str, list[Tech]]]] | None=None, resolver: Resolver | None=None) -> dict[tuple[str, int], list[Tech]]
```

Технологии ответивших портов: {(hostname, port): [Tech]}.

Пустой словарь = детект выключен либо инструмент не установлен: сервисы тогда
не трогаем, порт остаётся «unknown». detector — сиид для тестов (urls → {url: [Tech]}).

Ре-гейт: детект-бинарь (httpx-pd/whatweb) ходит на цель сам, в обход нашего
SSRF-transport и резолвит имя независимо. Между пробивом и детектом DNS мог
ребайндиться на внутренний адрес — поэтому свежим резолвом отсекаем хосты,
теперь резолвящиеся во внутреннее/битое. Это сужает окно (нужно выиграть
гонку дважды), но не закрывает TOCTOU полностью — бинарь резолвит ещё раз сам.
resolver — сиид для тестов; в проде по умолчанию resolve_forward (внешний-only).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `probes` | `list[ProbeResult]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `detector` | `Callable[[list[str]], Awaitable[dict[str, list[Tech]]]] \| None` | `None` | Определяется именем/типом и контрактом вызывающего кода. |
| `resolver` | `Resolver \| None` | `None` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `dict[tuple[str, int], list[Tech]]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `_pick_engine`
- `_regate_external`
- `_url_key`
- `by_key.get`
- `engine_out.items`
- `run`
- `url_for`

</details>
