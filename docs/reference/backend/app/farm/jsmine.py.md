# backend/app/farm/jsmine.py

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **9**.

## _ready

[backend/app/farm/jsmine.py:40](../../../../../backend/app/farm/jsmine.py#L40)

```python
def _ready(enabled: bool, bin_name: str) -> bool
```

Инструмент годен, если майнинг включён и бинарь есть в PATH.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `enabled` | `bool` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `bin_name` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `bool`.

<details>
<summary>Прямые вызовы в теле</summary>

- `shutil.which`

</details>

## _norm_severity

[backend/app/farm/jsmine.py:47](../../../../../backend/app/farm/jsmine.py#L47)

```python
def _norm_severity(s: str) -> str
```

В теле вызывает `isinstance`, `s.strip`, `s.strip().lower`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `s` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `isinstance`
- `s.strip`
- `s.strip().lower`

</details>

## _dedup_secrets

[backend/app/farm/jsmine.py:60](../../../../../backend/app/farm/jsmine.py#L60)

```python
def _dedup_secrets(items: list[Secret]) -> list[Secret]
```

Дедуп по match_preview (как в Go-версии): пустые и повторы отбрасываем.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `items` | `list[Secret]` | `обязательный` | Набор элементов для обработки. |

Возвращает: `list[Secret]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `out.append`
- `seen.add`
- `set`

</details>

## _dedup_strings

[backend/app/farm/jsmine.py:72](../../../../../backend/app/farm/jsmine.py#L72)

```python
def _dedup_strings(items: list[str]) -> list[str]
```

В теле вызывает `out.append`, `seen.add`, `set`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `items` | `list[str]` | `обязательный` | Набор элементов для обработки. |

Возвращает: `list[str]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `out.append`
- `seen.add`
- `set`

</details>

## _run

[backend/app/farm/jsmine.py:83](../../../../../backend/app/farm/jsmine.py#L83)

```python
async def _run(bin_name: str, args: list[str], timeout: float) -> bytes
```

Запускает внешний инструмент, возвращает stdout.

Ненулевой код НЕ ошибка: trufflehog возвращает ненулевой код, когда что-то
нашёл, — stdout при этом валиден. На таймауте/сбое отдаём то, что успели.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `bin_name` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `args` | `list[str]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `timeout` | `float` | `обязательный` | Предельное время ожидания операции. |

Возвращает: `bytes`.

<details>
<summary>Прямые вызовы в теле</summary>

- `asyncio.create_subprocess_exec`
- `asyncio.wait_for`
- `proc.communicate`
- `proc.kill`
- `scanner_options`

</details>

## _parse_trufflehog

[backend/app/farm/jsmine.py:109](../../../../../backend/app/farm/jsmine.py#L109)

```python
def _parse_trufflehog(out: bytes) -> list[Secret]
```

В теле вызывает `Secret`, `isinstance`, `json.loads`, `jsscan.redact`, `line.startswith`, `m.get`, `out.decode`, `out.decode('utf-8', 'replace').splitlines`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `out` | `bytes` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `list[Secret]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Secret`
- `isinstance`
- `json.loads`
- `jsscan.redact`
- `line.startswith`
- `m.get`
- `out.decode`
- `out.decode('utf-8', 'replace').splitlines`
- `raw_line.strip`
- `res.append`

</details>

## _parse_jsluice_secrets

[backend/app/farm/jsmine.py:144](../../../../../backend/app/farm/jsmine.py#L144)

```python
def _parse_jsluice_secrets(out: bytes) -> list[Secret]
```

В теле вызывает `' '.join`, `Secret`, `_norm_severity`, `data.values`, `isinstance`, `json.dumps`, `json.loads`, `jsscan.redact`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `out` | `bytes` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `list[Secret]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `' '.join`
- `Secret`
- `_norm_severity`
- `data.values`
- `isinstance`
- `json.dumps`
- `json.loads`
- `jsscan.redact`
- `jsscan.redact_context`
- `m.get`
- `out.decode`
- `out.decode('utf-8', 'replace').splitlines`
- `raw_line.strip`
- `res.append`
- `snippet.replace`
- `str`

</details>

## _parse_jsluice_urls

[backend/app/farm/jsmine.py:177](../../../../../backend/app/farm/jsmine.py#L177)

```python
def _parse_jsluice_urls(out: bytes) -> list[str]
```

В теле вызывает `isinstance`, `json.loads`, `m.get`, `out.decode`, `out.decode('utf-8', 'replace').splitlines`, `raw_line.strip`, `res.append`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `out` | `bytes` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `list[str]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `isinstance`
- `json.loads`
- `m.get`
- `out.decode`
- `out.decode('utf-8', 'replace').splitlines`
- `raw_line.strip`
- `res.append`

</details>

## mine_js

[backend/app/farm/jsmine.py:195](../../../../../backend/app/farm/jsmine.py#L195)

```python
async def mine_js(text: str, cfg: JsMineConfig) -> tuple[list[Secret], list[str]]
```

Извлекает секреты и эндпоинты из одного JS-файла.

Источники объединяются: regex ВСЕГДА + jsluice/trufflehog, когда доступны.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `text` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `cfg` | `JsMineConfig` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `tuple[list[Secret], list[str]]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `_dedup_secrets`
- `_dedup_strings`
- `_parse_jsluice_secrets`
- `_parse_jsluice_urls`
- `_parse_trufflehog`
- `_ready`
- `_run`
- `args.append`
- `fh.write`
- `jsscan.find_paths`
- `jsscan.find_secrets`
- `os.fdopen`
- `os.path.exists`
- `os.remove`
- `prepare_scanner_file`
- `tempfile.mkstemp`

</details>
