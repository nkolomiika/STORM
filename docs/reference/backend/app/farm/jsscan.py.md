# backend/app/farm/jsscan.py

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **8**.

## redact

[backend/app/farm/jsscan.py:53](../../../../../backend/app/farm/jsscan.py#L53)

```python
def redact(value: str) -> str
```

Скрывает середину секрета: первые/последние 4 символа, между ними звёзды.

Полный секрет в БД не кладём — достаточно опознать находку и место.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `value` | `str` | `обязательный` | Входное значение преобразования/проверки. |

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `len`
- `value.strip`

</details>

## _snippet

[backend/app/farm/jsscan.py:64](../../../../../backend/app/farm/jsscan.py#L64)

```python
def _snippet(text: str, start: int, end: int, width: int=40) -> str
```

Контекст вокруг совпадения, одной строкой, без переносов.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `text` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `start` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `end` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `width` | `int` | `40` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `len`
- `max`
- `min`
- `re.sub`
- `re.sub('\\s+', ' ', text[left:right]).strip`
- `redact_context`

</details>

## redact_context

[backend/app/farm/jsscan.py:71](../../../../../backend/app/farm/jsscan.py#L71)

```python
def redact_context(text: str) -> str
```

Mask recognized secrets in context, including adjacent matches.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `text` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `pattern.sub`

</details>

## redact_context.replace

[backend/app/farm/jsscan.py:74](../../../../../backend/app/farm/jsscan.py#L74)

```python
def replace(match) -> не аннотирован
```

В теле вызывает `match.group`, `match.span`, `match.start`, `redact`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `match` | `не аннотирован` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `не аннотирован`.

<details>
<summary>Прямые вызовы в теле</summary>

- `match.group`
- `match.span`
- `match.start`
- `redact`

</details>

## find_secrets

[backend/app/farm/jsscan.py:82](../../../../../backend/app/farm/jsscan.py#L82)

```python
def find_secrets(text: str) -> list[Secret]
```

Находит секреты. Дедуп по значению: тот же ключ не дублится, а специфичный
паттерн (AKIA/AIza/…) выигрывает у общего generic_api_key — специфичные идут
в наборе раньше, поэтому первое совпадение по значению и остаётся.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `text` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `list[Secret]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Secret`
- `_snippet`
- `found.values`
- `list`
- `m.end`
- `m.group`
- `m.start`
- `pattern.finditer`
- `redact`

</details>

## _is_interesting_path

[backend/app/farm/jsscan.py:127](../../../../../backend/app/farm/jsscan.py#L127)

```python
def _is_interesting_path(path: str) -> bool
```

В теле вызывает `any`, `c.isalpha`, `len`, `low.endswith`, `path.lower`, `path.startswith`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `path` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `bool`.

<details>
<summary>Прямые вызовы в теле</summary>

- `any`
- `c.isalpha`
- `len`
- `low.endswith`
- `path.lower`
- `path.startswith`

</details>

## find_paths

[backend/app/farm/jsscan.py:140](../../../../../backend/app/farm/jsscan.py#L140)

```python
def find_paths(text: str) -> list[str]
```

Извлекает пути/URL из JS, отсекая статику и мусор. Порядок сохраняется.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `text` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `list[str]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `_PATH_RE.finditer`
- `_is_interesting_path`
- `m.group`
- `m.group(1).strip`
- `out.append`
- `seen.add`
- `set`

</details>

## extract_js_urls

[backend/app/farm/jsscan.py:166](../../../../../backend/app/farm/jsscan.py#L166)

```python
def extract_js_urls(html: str, base_url: str) -> list[str]
```

Абсолютные URL .js-файлов из HTML: <script src> + .js-ссылки, дедуп.

Относительные резолвятся через base_url. Отсекаются известные аналитические
CDN. http(s)-only — прочие схемы (data:, blob:) не наши.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `html` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `base_url` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `list[str]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `any`
- `m.group`
- `m.group(1).strip`
- `out.append`
- `parsed.netloc.lower`
- `parsed.path.lower`
- `parsed.path.lower().split`
- `parsed.path.lower().split('?')[0].endswith`
- `pattern.finditer`
- `raw.startswith`
- `seen.add`
- `set`
- `urljoin`
- `urlparse`

</details>
