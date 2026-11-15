# backend/app/input_safety.py

Сгенерировано из объявлений кода. [Правила чтения](../../../METHODS.md).

Методов и именованных функций: **7**.

## normalize_ip_literal

[backend/app/input_safety.py:10](../../../../backend/app/input_safety.py#L10)

```python
def normalize_ip_literal(value: object) -> str
```

Принимает только IPv4/IPv6-литерал, без URL, порта или zone-id.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `value` | `object` | `обязательный` | Входное значение преобразования/проверки. |

Возвращает: `str`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValueError('Укажите корректный IPv4 или IPv6 адрес')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ValueError`
- `ip_address`
- `isinstance`
- `len`
- `str`
- `value.strip`

</details>

## validate_json_value

[backend/app/input_safety.py:20](../../../../backend/app/input_safety.py#L20)

```python
def validate_json_value(value: object, depth: int=0) -> None
```

Reject PostgreSQL-incompatible strings, nonfinite numbers and recursive YAML.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `value` | `object` | `обязательный` | Входное значение преобразования/проверки. |
| `depth` | `int` | `0` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValueError('NUL-символы недопустимы')
ValueError('NaN и Infinity недопустимы')
ValueError('Входные данные имеют слишком большую вложенность')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ValueError`
- `isinstance`
- `math.isfinite`
- `validate_json_value`
- `value.items`

</details>

## validate_request_parameters

[backend/app/input_safety.py:37](../../../../backend/app/input_safety.py#L37)

```python
async def validate_request_parameters(request: Request) -> None
```

Validate SQL-bound path IDs before authorization dependencies query the DB.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `request` | `Request` | `обязательный` | HTTP-запрос Starlette/FastAPI. |

Возвращает: `None`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
HTTPException(422, 'page: недопустимая страница')
HTTPException(422, f'{name}: NUL-символы недопустимы')
HTTPException(422, f'{name}: недопустимый идентификатор')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `HTTPException`
- `int`
- `name.endswith`
- `request.path_params.items`
- `request.query_params.multi_items`

</details>

## read_upload

[backend/app/input_safety.py:60](../../../../backend/app/input_safety.py#L60)

```python
async def read_upload(upload: UploadFile, limit: int) -> bytes
```

Read at most limit+1 bytes, including when Content-Length is absent.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `upload` | `UploadFile` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `limit` | `int` | `обязательный` | Максимальное число возвращаемых записей. |

Возвращает: `bytes`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
HTTPException(413, 'Размер файла превышает допустимый предел')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `HTTPException`
- `len`
- `upload.read`

</details>

## SecurityHeadersMiddleware.__init__

[backend/app/input_safety.py:70](../../../../backend/app/input_safety.py#L70)

```python
def __init__(self, app) -> не аннотирован
```

Создаёт экземпляр и сохраняет его зависимости; параметры перечислены ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `app` | `не аннотирован` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `не аннотирован`.

## SecurityHeadersMiddleware.__call__

[backend/app/input_safety.py:73](../../../../backend/app/input_safety.py#L73)

```python
async def __call__(self, scope, receive, send) -> не аннотирован
```

В теле вызывает `self.app`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `scope` | `не аннотирован` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `receive` | `не аннотирован` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `send` | `не аннотирован` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `не аннотирован`.

<details>
<summary>Прямые вызовы в теле</summary>

- `self.app`

</details>

## SecurityHeadersMiddleware.__call__.secure_send

[backend/app/input_safety.py:74](../../../../backend/app/input_safety.py#L74)

```python
async def secure_send(message) -> не аннотирован
```

В теле вызывает `headers.append`, `list`, `message.get`, `name.lower`, `send`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `message` | `не аннотирован` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `не аннотирован`.

<details>
<summary>Прямые вызовы в теле</summary>

- `headers.append`
- `list`
- `message.get`
- `name.lower`
- `send`

</details>
