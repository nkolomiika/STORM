# backend/app/main.py

Сгенерировано из объявлений кода. [Правила чтения](../../../METHODS.md).

Методов и именованных функций: **15**.

## _register_protected_docs

[backend/app/main.py:72](../../../../backend/app/main.py#L72)

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

[backend/app/main.py:83](../../../../backend/app/main.py#L83)

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

[backend/app/main.py:87](../../../../backend/app/main.py#L87)

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

[backend/app/main.py:92](../../../../backend/app/main.py#L92)

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

[backend/app/main.py:106](../../../../backend/app/main.py#L106)

```python
def _register_routes() -> None
```

В теле вызывает `_register_protected_docs`, `agent_api_v2.include_router`, `app.add_api_route`, `app.include_router`, `app.mount`.

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `_register_protected_docs`
- `agent_api_v2.include_router`
- `app.add_api_route`
- `app.include_router`
- `app.mount`

</details>

## _register_error_handlers

[backend/app/main.py:143](../../../../backend/app/main.py#L143)

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

[backend/app/main.py:144](../../../../backend/app/main.py#L144)

```python
def _format_request_validation(exc: RequestValidationError) -> str
```

В теле вызывает `'.'.join`, `'; '.join`, `exc.errors`, `item.get`, `item.get('ctx', {}).get`, `item.get('msg', '').removeprefix`, `messages.append`, `public_message`; полный список ниже.

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
- `item.get('msg', '').removeprefix`
- `messages.append`
- `public_message`
- `str`
- `{'extra_forbidden': 'Это поле не поддерживается', 'json_invalid': 'Не удалось прочитать данные запроса. Проверьте формат JSON', 'enum': 'Выберите одно из допустимых значений', 'string_type': 'Введите текст', 'int_parsing': 'Введите целое число', 'int_type': 'Введите целое число', 'list_type': 'Ожидается список значений', 'string_pattern_mismatch': 'Проверьте формат поля'}.get`

</details>

## _register_error_handlers.request_validation_handler

[backend/app/main.py:178](../../../../backend/app/main.py#L178)

```python
async def request_validation_handler(request: Request, exc: RequestValidationError) -> JSONResponse
```

В теле вызывает `JSONResponse`, `_format_request_validation`, `error_payload`, `exc.errors`, `getattr`, `len`, `logger.warning`, `sorted`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `request` | `Request` | `обязательный` | HTTP-запрос Starlette/FastAPI. |
| `exc` | `RequestValidationError` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `JSONResponse`.

<details>
<summary>Прямые вызовы в теле</summary>

- `JSONResponse`
- `_format_request_validation`
- `error_payload`
- `exc.errors`
- `getattr`
- `len`
- `logger.warning`
- `sorted`

</details>

## _register_error_handlers.app_error_handler

[backend/app/main.py:182](../../../../backend/app/main.py#L182)

```python
async def app_error_handler(_: Request, exc: StormError) -> JSONResponse
```

В теле вызывает `JSONResponse`, `isinstance`, `logger.warning`, `next`, `public_message`, `str`, `str(exc).strip`, `type`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `_` | `Request` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `exc` | `StormError` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `JSONResponse`.

<details>
<summary>Прямые вызовы в теле</summary>

- `JSONResponse`
- `isinstance`
- `logger.warning`
- `next`
- `public_message`
- `str`
- `str(exc).strip`
- `type`

</details>

## _register_error_handlers.http_error_handler

[backend/app/main.py:195](../../../../backend/app/main.py#L195)

```python
async def http_error_handler(_: Request, exc: StarletteHTTPException) -> JSONResponse
```

В теле вызывает `JSONResponse`, `any`, `logger.warning`, `public_message`, `str`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `_` | `Request` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `exc` | `StarletteHTTPException` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `JSONResponse`.

<details>
<summary>Прямые вызовы в теле</summary>

- `JSONResponse`
- `any`
- `logger.warning`
- `public_message`
- `str`

</details>

## _register_error_handlers.unexpected_error_handler

[backend/app/main.py:205](../../../../backend/app/main.py#L205)

```python
async def unexpected_error_handler(request: Request, exc: Exception) -> JSONResponse
```

В теле вызывает `JSONResponse`, `getattr`, `logger.error`, `type`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `request` | `Request` | `обязательный` | HTTP-запрос Starlette/FastAPI. |
| `exc` | `Exception` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `JSONResponse`.

<details>
<summary>Прямые вызовы в теле</summary>

- `JSONResponse`
- `getattr`
- `logger.error`
- `type`

</details>

## startup

[backend/app/main.py:228](../../../../backend/app/main.py#L228)

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
- `asyncio.create_task`
- `conn.execute`
- `conn.run_sync`
- `deadline_loop`
- `engine.begin`
- `service.bootstrap_admin`
- `text`

</details>

## startup.add_missing

[backend/app/main.py:325](../../../../backend/app/main.py#L325)

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

## shutdown_notifications

[backend/app/main.py:386](../../../../backend/app/main.py#L386)

```python
async def shutdown_notifications() -> None
```

В теле вызывает `getattr`, `suppress`, `task.cancel`.

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `getattr`
- `suppress`
- `task.cancel`

</details>

## health

[backend/app/main.py:395](../../../../backend/app/main.py#L395)

```python
async def health() -> dict
```

Healthcheck эндпоинт для проверки доступности сервиса.

Возвращает: `dict`.

Маршруты:

```python
app.get('/health')
```
