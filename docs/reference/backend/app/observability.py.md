# backend/app/observability.py

Сгенерировано из объявлений кода. [Правила чтения](../../../METHODS.md).

Методов и именованных функций: **6**.

## redact_log

[backend/app/observability.py:16](../../../../backend/app/observability.py#L16)

```python
def redact_log(value: str) -> str
```

Убирает секреты из сообщений и traceback, сохраняя тип и место ошибки.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `value` | `str` | `обязательный` | Входное значение преобразования/проверки. |

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `_SECRET.sub`
- `re.sub`

</details>

## SafeLogFilter.filter

[backend/app/observability.py:29](../../../../backend/app/observability.py#L29)

```python
def filter(self, record: logging.LogRecord) -> bool
```

В теле вызывает `''.join`, `getattr`, `isinstance`, `len`, `record.getMessage`, `redact_log`, `request_id.get`, `traceback.format_exception`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `record` | `logging.LogRecord` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `bool`.

<details>
<summary>Прямые вызовы в теле</summary>

- `''.join`
- `getattr`
- `isinstance`
- `len`
- `record.getMessage`
- `redact_log`
- `request_id.get`
- `traceback.format_exception`

</details>

## configure_logging

[backend/app/observability.py:47](../../../../backend/app/observability.py#L47)

```python
def configure_logging() -> None
```

Настраивает фильтры существующих обработчиков без сброса чужой конфигурации.

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `SafeLogFilter`
- `any`
- `handler.addFilter`
- `handlers.extend`
- `isinstance`
- `logging.basicConfig`
- `logging.getLogger`
- `set`

</details>

## RequestLogMiddleware.__init__

[backend/app/observability.py:64](../../../../backend/app/observability.py#L64)

```python
def __init__(self, app) -> не аннотирован
```

Создаёт экземпляр и сохраняет его зависимости; параметры перечислены ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `app` | `не аннотирован` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `не аннотирован`.

## RequestLogMiddleware.__call__

[backend/app/observability.py:67](../../../../backend/app/observability.py#L67)

```python
async def __call__(self, scope, receive, send) -> не аннотирован
```

В теле вызывает `getattr`, `logger.log`, `request_id.reset`, `request_id.set`, `scope.get`, `scope.setdefault`, `scope['state'].get`, `self.app`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `scope` | `не аннотирован` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `receive` | `не аннотирован` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `send` | `не аннотирован` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `не аннотирован`.

<details>
<summary>Прямые вызовы в теле</summary>

- `getattr`
- `logger.log`
- `request_id.reset`
- `request_id.set`
- `scope.get`
- `scope.setdefault`
- `scope['state'].get`
- `self.app`
- `time.monotonic`
- `uuid4`

</details>

## RequestLogMiddleware.__call__.send_response

[backend/app/observability.py:75](../../../../backend/app/observability.py#L75)

```python
async def send_response(message) -> не аннотирован
```

В теле вызывает `identifier.encode`, `message.get`, `send`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `message` | `не аннотирован` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `не аннотирован`.

<details>
<summary>Прямые вызовы в теле</summary>

- `identifier.encode`
- `message.get`
- `send`

</details>
