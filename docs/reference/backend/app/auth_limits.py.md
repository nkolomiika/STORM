# backend/app/auth_limits.py

Сгенерировано из объявлений кода. [Правила чтения](../../../METHODS.md).

Методов и именованных функций: **4**.

## AuthAttemptLimiter.__init__

[backend/app/auth_limits.py:11](../../../../backend/app/auth_limits.py#L11)

```python
def __init__(self, limit: int=20, window: float=60, max_keys: int=4096) -> не аннотирован
```

Создаёт экземпляр и сохраняет его зависимости; параметры перечислены ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `limit` | `int` | `20` | Максимальное число возвращаемых записей. |
| `window` | `float` | `60` | Определяется именем/типом и контрактом вызывающего кода. |
| `max_keys` | `int` | `4096` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `не аннотирован`.

<details>
<summary>Прямые вызовы в теле</summary>

- `OrderedDict`

</details>

## AuthAttemptLimiter.clear

[backend/app/auth_limits.py:17](../../../../backend/app/auth_limits.py#L17)

```python
def clear(self) -> None
```

В теле вызывает `self.buckets.clear`.

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `self.buckets.clear`

</details>

## AuthAttemptLimiter.check

[backend/app/auth_limits.py:20](../../../../backend/app/auth_limits.py#L20)

```python
def check(self, key: str, *, limit: int | None=None) -> None
```

В теле вызывает `HTTPException`, `bucket.append`, `bucket.popleft`, `deque`, `len`, `math.ceil`, `max`, `self.buckets.pop`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `key` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `limit` | `int \| None` | `None` | Максимальное число возвращаемых записей. |

Возвращает: `None`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
HTTPException(429, 'Слишком много попыток. Повторите позже', headers={'Retry-After': str(max(1, math.ceil(self.window - now + bucket[0])))})
```

<details>
<summary>Прямые вызовы в теле</summary>

- `HTTPException`
- `bucket.append`
- `bucket.popleft`
- `deque`
- `len`
- `math.ceil`
- `max`
- `self.buckets.pop`
- `self.buckets.popitem`
- `str`
- `time.monotonic`

</details>

## limit_auth_attempts

[backend/app/auth_limits.py:36](../../../../backend/app/auth_limits.py#L36)

```python
async def limit_auth_attempts(request: Request) -> None
```

Throttle per client and per account/link, without storing raw credentials.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `request` | `Request` | `обязательный` | HTTP-запрос Starlette/FastAPI. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `actor.strip`
- `actor.strip().casefold`
- `actor.strip().casefold().encode`
- `auth_attempts.check`
- `body.get`
- `getattr`
- `hashlib.sha256`
- `hashlib.sha256(actor.strip().casefold().encode()).hexdigest`
- `isinstance`
- `request.cookies.get`
- `request.json`
- `request.path_params.get`
- `request.scope.get`

</details>
