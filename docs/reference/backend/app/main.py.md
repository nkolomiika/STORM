# backend/app/main.py

Сгенерировано из объявлений кода. [Правила чтения](../../../METHODS.md).

Методов и именованных функций: **17**.

## _register_protected_docs

[backend/app/main.py:60](../../../../backend/app/main.py#L60)

```python
def _register_protected_docs(fastapi_app: FastAPI, *, openapi_route: str, docs_route: str, redoc_route: str) -> None
```

Регистрирует Swagger UI / ReDoc / openapi.json, доступные только после входа.

Каждый маршрут зависит от get_current_user (сессионная cookie access_token):
без неё FastAPI вернёт 401. Браузер авторизованного пользователя шлёт cookie
автоматически и к странице Swagger, и к её запросу openapi.json. openapi_url
для UI строим с учётом root_path — чтобы работало и для под-аппа, смонтированного
на /v2.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `fastapi_app` | `FastAPI` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `openapi_route` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `docs_route` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `redoc_route` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

## _register_protected_docs._openapi_json

[backend/app/main.py:71](../../../../backend/app/main.py#L71)

```python
async def _openapi_json(_: object=Depends(get_current_user)) -> JSONResponse
```

Обработчик маршрута; контракт запроса и ответа приведён в справочнике HTTP API.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `_` | `object` | `Depends(get_current_user)` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `JSONResponse`.

Dependencies: `get_current_user`.

Маршруты:

```python
fastapi_app.get(openapi_route, include_in_schema=False)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `JSONResponse`
- `fastapi_app.openapi`

</details>

## _register_protected_docs._swagger_ui

[backend/app/main.py:75](../../../../backend/app/main.py#L75)

```python
async def _swagger_ui(request: Request, _: object=Depends(get_current_user)) -> не аннотирован
```

Обработчик маршрута; контракт запроса и ответа приведён в справочнике HTTP API.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `request` | `Request` | `обязательный` | HTTP-запрос Starlette/FastAPI. |
| `_` | `object` | `Depends(get_current_user)` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `не аннотирован`.

Dependencies: `get_current_user`.

Маршруты:

```python
fastapi_app.get(docs_route, include_in_schema=False)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `get_swagger_ui_html`
- `request.scope.get`
- `request.scope.get('root_path', '').rstrip`

</details>

## _register_protected_docs._redoc

[backend/app/main.py:80](../../../../backend/app/main.py#L80)

```python
async def _redoc(request: Request, _: object=Depends(get_current_user)) -> не аннотирован
```

Обработчик маршрута; контракт запроса и ответа приведён в справочнике HTTP API.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `request` | `Request` | `обязательный` | HTTP-запрос Starlette/FastAPI. |
| `_` | `object` | `Depends(get_current_user)` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `не аннотирован`.

Dependencies: `get_current_user`.

Маршруты:

```python
fastapi_app.get(redoc_route, include_in_schema=False)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `get_redoc_html`
- `request.scope.get`
- `request.scope.get('root_path', '').rstrip`

</details>

## _register_routes

[backend/app/main.py:93](../../../../backend/app/main.py#L93)

```python
def _register_routes() -> None
```

В теле вызывает `_register_protected_docs`, `agent_api_v2.include_router`, `app.include_router`, `app.mount`.

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `_register_protected_docs`
- `agent_api_v2.include_router`
- `app.include_router`
- `app.mount`

</details>

## _register_error_handlers

[backend/app/main.py:128](../../../../backend/app/main.py#L128)

```python
def _register_error_handlers() -> None
```

В теле вызывает `_target.add_exception_handler`.

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `_target.add_exception_handler`

</details>

## _register_error_handlers._format_request_validation

[backend/app/main.py:129](../../../../backend/app/main.py#L129)

```python
def _format_request_validation(exc: RequestValidationError) -> str
```

В теле вызывает `'.'.join`, `'; '.join`, `exc.errors`, `item.get`, `item.get('ctx', {}).get`, `messages.append`, `str`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `exc` | `RequestValidationError` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `'.'.join`
- `'; '.join`
- `exc.errors`
- `item.get`
- `item.get('ctx', {}).get`
- `messages.append`
- `str`

</details>

## _register_error_handlers.request_validation_handler

[backend/app/main.py:154](../../../../backend/app/main.py#L154)

```python
async def request_validation_handler(_: Request, exc: RequestValidationError) -> JSONResponse
```

В теле вызывает `JSONResponse`, `_format_request_validation`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `_` | `Request` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `exc` | `RequestValidationError` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `JSONResponse`.

<details>
<summary>Прямые вызовы в теле</summary>

- `JSONResponse`
- `_format_request_validation`

</details>

## _register_error_handlers.not_found_handler

[backend/app/main.py:157](../../../../backend/app/main.py#L157)

```python
async def not_found_handler(_: Request, exc: NotFoundError) -> JSONResponse
```

В теле вызывает `JSONResponse`, `str`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `_` | `Request` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `exc` | `NotFoundError` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `JSONResponse`.

<details>
<summary>Прямые вызовы в теле</summary>

- `JSONResponse`
- `str`

</details>

## _register_error_handlers.unauthorized_handler

[backend/app/main.py:160](../../../../backend/app/main.py#L160)

```python
async def unauthorized_handler(_: Request, exc: UnauthorizedError) -> JSONResponse
```

В теле вызывает `JSONResponse`, `str`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `_` | `Request` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `exc` | `UnauthorizedError` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `JSONResponse`.

<details>
<summary>Прямые вызовы в теле</summary>

- `JSONResponse`
- `str`

</details>

## _register_error_handlers.forbidden_handler

[backend/app/main.py:163](../../../../backend/app/main.py#L163)

```python
async def forbidden_handler(_: Request, exc: ForbiddenError) -> JSONResponse
```

В теле вызывает `JSONResponse`, `str`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `_` | `Request` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `exc` | `ForbiddenError` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `JSONResponse`.

<details>
<summary>Прямые вызовы в теле</summary>

- `JSONResponse`
- `str`

</details>

## _register_error_handlers.conflict_handler

[backend/app/main.py:166](../../../../backend/app/main.py#L166)

```python
async def conflict_handler(_: Request, exc: ConflictError) -> JSONResponse
```

В теле вызывает `JSONResponse`, `str`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `_` | `Request` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `exc` | `ConflictError` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `JSONResponse`.

<details>
<summary>Прямые вызовы в теле</summary>

- `JSONResponse`
- `str`

</details>

## _register_error_handlers.validation_handler

[backend/app/main.py:169](../../../../backend/app/main.py#L169)

```python
async def validation_handler(_: Request, exc: ValidationError) -> JSONResponse
```

В теле вызывает `JSONResponse`, `str`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `_` | `Request` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `exc` | `ValidationError` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `JSONResponse`.

<details>
<summary>Прямые вызовы в теле</summary>

- `JSONResponse`
- `str`

</details>

## _register_error_handlers.app_error_handler

[backend/app/main.py:172](../../../../backend/app/main.py#L172)

```python
async def app_error_handler(_: Request, exc: StormError) -> JSONResponse
```

В теле вызывает `JSONResponse`, `str`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `_` | `Request` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `exc` | `StormError` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `JSONResponse`.

<details>
<summary>Прямые вызовы в теле</summary>

- `JSONResponse`
- `str`

</details>

## startup

[backend/app/main.py:193](../../../../backend/app/main.py#L193)

```python
async def startup() -> None
```

Инициализирует БД, MinIO и стартового администратора.

Возвращает: `None`.

Прямые операции с БД: `conn.execute`, `conn.run_sync`.

<details>
<summary>Прямые вызовы в теле</summary>

- `MinioStorage`
- `MinioStorage().ensure_bucket`
- `SessionLocal`
- `UserService`
- `add_missing`
- `conn.execute`
- `conn.run_sync`
- `engine.begin`
- `service.bootstrap_admin`
- `text`

</details>

## startup.add_missing

[backend/app/main.py:275](../../../../backend/app/main.py#L275)

```python
async def add_missing(table: str, columns: dict[str, str]) -> None
```

SQLite не умеет ADD COLUMN IF NOT EXISTS — проверяем через PRAGMA.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `table` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `columns` | `dict[str, str]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

Прямые операции с БД: `conn.execute`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(await conn.execute(text(f'PRAGMA table_info({table})'))).fetchall`
- `columns.items`
- `conn.execute`
- `text`

</details>

## health

[backend/app/main.py:330](../../../../backend/app/main.py#L330)

```python
async def health() -> dict
```

Healthcheck эндпоинт для проверки доступности сервиса.

Возвращает: `dict`.

Маршруты:

```python
app.get('/health')
```
