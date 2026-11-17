# backend/app/routers/auth.py

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **25**.

## _set_auth_cookies

[backend/app/routers/auth.py:47](../../../../../backend/app/routers/auth.py#L47)

```python
def _set_auth_cookies(response: Response, access_token: str, refresh_token: str) -> None
```

Устанавливает access и refresh cookie в ответ.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `response` | `Response` | `обязательный` | HTTP-ответ, в котором могут устанавливаться cookie/заголовки. |
| `access_token` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `refresh_token` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `response.set_cookie`

</details>

## _clear_auth_cookies

[backend/app/routers/auth.py:69](../../../../../backend/app/routers/auth.py#L69)

```python
def _clear_auth_cookies(response: Response) -> None
```

Очищает auth-cookie в браузере.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `response` | `Response` | `обязательный` | HTTP-ответ, в котором могут устанавливаться cookie/заголовки. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `response.set_cookie`

</details>

## _set_twofa_cookie

[backend/app/routers/auth.py:83](../../../../../backend/app/routers/auth.py#L83)

```python
def _set_twofa_cookie(response: Response, pending_token: str) -> None
```

Ставит короткоживущую cookie для второго шага логина (ввод TOTP-кода).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `response` | `Response` | `обязательный` | HTTP-ответ, в котором могут устанавливаться cookie/заголовки. |
| `pending_token` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `response.set_cookie`

</details>

## _clear_twofa_cookie

[backend/app/routers/auth.py:96](../../../../../backend/app/routers/auth.py#L96)

```python
def _clear_twofa_cookie(response: Response) -> None
```

Убирает промежуточную 2FA-cookie.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `response` | `Response` | `обязательный` | HTTP-ответ, в котором могут устанавливаться cookie/заголовки. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `response.set_cookie`

</details>

## login

[backend/app/routers/auth.py:110](../../../../../backend/app/routers/auth.py#L110)

```python
async def login(payload: LoginRequest, response: Response, request: Request, _: None=Depends(enforce_csrf), db: AsyncSession=Depends(get_db)) -> LoginResponse
```

Первый шаг логина. При включённом 2FA возвращает challenge вместо сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `payload` | `LoginRequest` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `response` | `Response` | `обязательный` | HTTP-ответ, в котором могут устанавливаться cookie/заголовки. |
| `request` | `Request` | `обязательный` | HTTP-запрос Starlette/FastAPI. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `LoginResponse`.

Dependencies: `enforce_csrf`, `get_db`.

Маршруты:

```python
router.post('/login', response_model=LoginResponse, status_code=status.HTTP_200_OK, dependencies=[Depends(limit_auth_attempts)])
```

<details>
<summary>Прямые вызовы в теле</summary>

- `AuthService`
- `LoginResponse`
- `_set_auth_cookies`
- `_set_twofa_cookie`
- `get_client_ip`
- `service.login`

</details>

## verify_2fa

[backend/app/routers/auth.py:130](../../../../../backend/app/routers/auth.py#L130)

```python
async def verify_2fa(payload: TwoFAVerifyRequest, response: Response, request: Request, _: None=Depends(enforce_csrf), twofa_token: str | None=Cookie(default=None), db: AsyncSession=Depends(get_db)) -> LoginResponse
```

Второй шаг логина: сверяет TOTP-код и выдаёт полноценную сессию.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `payload` | `TwoFAVerifyRequest` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `response` | `Response` | `обязательный` | HTTP-ответ, в котором могут устанавливаться cookie/заголовки. |
| `request` | `Request` | `обязательный` | HTTP-запрос Starlette/FastAPI. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `twofa_token` | `str \| None` | `Cookie(default=None)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `LoginResponse`.

Dependencies: `enforce_csrf`, `get_db`.

Маршруты:

```python
router.post('/2fa/verify', response_model=LoginResponse, status_code=status.HTTP_200_OK, dependencies=[Depends(limit_auth_attempts)])
```

<details>
<summary>Прямые вызовы в теле</summary>

- `AuthService`
- `LoginResponse`
- `_clear_twofa_cookie`
- `_set_auth_cookies`
- `get_client_ip`
- `service.verify_2fa`

</details>

## invitation_info

[backend/app/routers/auth.py:148](../../../../../backend/app/routers/auth.py#L148)

```python
async def invitation_info(token: str, db: AsyncSession=Depends(get_db)) -> InvitationInfoOut
```

Публичная проверка ссылки-приглашения: валидна ли и на какой email.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `token` | `str` | `обязательный` | Токен операции; формат определяется вызывающим методом. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `InvitationInfoOut`.

Dependencies: `get_db`.

Маршруты:

```python
router.get('/invitations/{token}', response_model=InvitationInfoOut)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `InvitationInfoOut`
- `UserService`
- `UserService(db).get_invitation_info`

</details>

## invitation_username_available

[backend/app/routers/auth.py:158](../../../../../backend/app/routers/auth.py#L158)

```python
async def invitation_username_available(token: str, username: str=Query(..., min_length=3, max_length=100), db: AsyncSession=Depends(get_db)) -> UsernameAvailabilityOut
```

Проверка занятости username на странице активации (нужен валидный токен).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `token` | `str` | `обязательный` | Токен операции; формат определяется вызывающим методом. |
| `username` | `str` | `Query(..., min_length=3, max_length=100)` | Имя пользователя. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `UsernameAvailabilityOut`.

Dependencies: `get_db`.

Маршруты:

```python
router.get('/invitations/{token}/username-available', response_model=UsernameAvailabilityOut)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `UserService`
- `UserService(db).check_invitation_username_available`
- `UsernameAvailabilityOut`

</details>

## accept_invitation

[backend/app/routers/auth.py:169](../../../../../backend/app/routers/auth.py#L169)

```python
async def accept_invitation(token: str, payload: InvitationAcceptRequest, response: Response, request: Request, _: None=Depends(enforce_csrf), db: AsyncSession=Depends(get_db)) -> LoginResponse
```

Активация приглашения: приглашённый задаёт username+пароль и сразу входит.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `token` | `str` | `обязательный` | Токен операции; формат определяется вызывающим методом. |
| `payload` | `InvitationAcceptRequest` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `response` | `Response` | `обязательный` | HTTP-ответ, в котором могут устанавливаться cookie/заголовки. |
| `request` | `Request` | `обязательный` | HTTP-запрос Starlette/FastAPI. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `LoginResponse`.

Dependencies: `enforce_csrf`, `get_db`.

Маршруты:

```python
router.post('/invitations/{token}/accept', response_model=LoginResponse, status_code=status.HTTP_201_CREATED, dependencies=[Depends(limit_auth_attempts)])
```

<details>
<summary>Прямые вызовы в теле</summary>

- `AuthService`
- `AuthService(db).issue_session_for_user`
- `LoginResponse`
- `UserService`
- `_set_auth_cookies`
- `get_client_ip`
- `service.accept_invitation`

</details>

## request_password_reset

[backend/app/routers/auth.py:187](../../../../../backend/app/routers/auth.py#L187)

```python
async def request_password_reset(payload: PasswordResetRequest, request: Request, _: None=Depends(enforce_csrf), db: AsyncSession=Depends(get_db)) -> PasswordResetRequestOut
```

«Забыли пароль»: шлёт ссылку на email.

Всегда отвечает 200, даже если такого пользователя нет — иначе по коду
ответа можно было бы перебирать существующие адреса.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `payload` | `PasswordResetRequest` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `request` | `Request` | `обязательный` | HTTP-запрос Starlette/FastAPI. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `PasswordResetRequestOut`.

Dependencies: `enforce_csrf`, `get_db`.

Маршруты:

```python
router.post('/password-reset/request', response_model=PasswordResetRequestOut, status_code=status.HTTP_200_OK, dependencies=[Depends(limit_auth_attempts)])
```

<details>
<summary>Прямые вызовы в теле</summary>

- `PasswordResetRequestOut`
- `UserService`
- `UserService(db).request_password_reset`
- `get_client_ip`

</details>

## password_reset_info

[backend/app/routers/auth.py:204](../../../../../backend/app/routers/auth.py#L204)

```python
async def password_reset_info(token: str, db: AsyncSession=Depends(get_db)) -> PasswordResetInfoOut
```

Проверяет ссылку до показа формы нового пароля.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `token` | `str` | `обязательный` | Токен операции; формат определяется вызывающим методом. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `PasswordResetInfoOut`.

Dependencies: `get_db`.

Маршруты:

```python
router.get('/password-reset/{token}', response_model=PasswordResetInfoOut)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `PasswordResetInfoOut`
- `UserService`
- `UserService(db).get_password_reset_info`

</details>

## confirm_password_reset

[backend/app/routers/auth.py:213](../../../../../backend/app/routers/auth.py#L213)

```python
async def confirm_password_reset(token: str, payload: PasswordResetConfirmRequest, request: Request, response: Response, _: None=Depends(enforce_csrf), db: AsyncSession=Depends(get_db)) -> Response
```

Ставит новый пароль по ссылке. Сессию не выдаём — пользователь входит сам.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `token` | `str` | `обязательный` | Токен операции; формат определяется вызывающим методом. |
| `payload` | `PasswordResetConfirmRequest` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `request` | `Request` | `обязательный` | HTTP-запрос Starlette/FastAPI. |
| `response` | `Response` | `обязательный` | HTTP-ответ, в котором могут устанавливаться cookie/заголовки. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `Response`.

Dependencies: `enforce_csrf`, `get_db`.

Маршруты:

```python
router.post('/password-reset/{token}', status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(limit_auth_attempts)])
```

<details>
<summary>Прямые вызовы в теле</summary>

- `UserService`
- `UserService(db).confirm_password_reset`
- `_clear_auth_cookies`
- `get_client_ip`

</details>

## reactivation_info

[backend/app/routers/auth.py:230](../../../../../backend/app/routers/auth.py#L230)

```python
async def reactivation_info(token: str, db: AsyncSession=Depends(get_db)) -> ReactivationInfoOut
```

Публичная проверка ссылки-возврата до показа кнопки входа.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `token` | `str` | `обязательный` | Токен операции; формат определяется вызывающим методом. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `ReactivationInfoOut`.

Dependencies: `get_db`.

Маршруты:

```python
router.get('/reactivate/{token}', response_model=ReactivationInfoOut)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ReactivationInfoOut`
- `UserService`
- `UserService(db).get_reactivation_info`

</details>

## complete_reactivation

[backend/app/routers/auth.py:239](../../../../../backend/app/routers/auth.py#L239)

```python
async def complete_reactivation(token: str, response: Response, request: Request, _: None=Depends(enforce_csrf), db: AsyncSession=Depends(get_db)) -> LoginResponse
```

Возврат по ссылке: разблокирует аккаунт и сразу выдаёт сессию.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `token` | `str` | `обязательный` | Токен операции; формат определяется вызывающим методом. |
| `response` | `Response` | `обязательный` | HTTP-ответ, в котором могут устанавливаться cookie/заголовки. |
| `request` | `Request` | `обязательный` | HTTP-запрос Starlette/FastAPI. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `LoginResponse`.

Dependencies: `enforce_csrf`, `get_db`.

Маршруты:

```python
router.post('/reactivate/{token}', response_model=LoginResponse, status_code=status.HTTP_200_OK, dependencies=[Depends(limit_auth_attempts)])
```

<details>
<summary>Прямые вызовы в теле</summary>

- `AuthService`
- `AuthService(db).issue_session_for_user`
- `LoginResponse`
- `UserService`
- `UserService(db).complete_reactivation`
- `_set_auth_cookies`
- `get_client_ip`

</details>

## refresh

[backend/app/routers/auth.py:255](../../../../../backend/app/routers/auth.py#L255)

```python
async def refresh(response: Response, request: Request, _: None=Depends(enforce_csrf), refresh_token: str | None=Cookie(default=None), db: AsyncSession=Depends(get_db)) -> RefreshResponse
```

Обновляет пару cookie-токенов с ротацией refresh-токена.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `response` | `Response` | `обязательный` | HTTP-ответ, в котором могут устанавливаться cookie/заголовки. |
| `request` | `Request` | `обязательный` | HTTP-запрос Starlette/FastAPI. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `refresh_token` | `str \| None` | `Cookie(default=None)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `RefreshResponse`.

Dependencies: `enforce_csrf`, `get_db`.

Маршруты:

```python
router.post('/refresh', response_model=RefreshResponse, status_code=status.HTTP_200_OK)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `AuthService`
- `RefreshResponse`
- `_set_auth_cookies`
- `get_client_ip`
- `service.refresh`

</details>

## _frontend_url

[backend/app/routers/auth.py:284](../../../../../backend/app/routers/auth.py#L284)

```python
def _frontend_url(path: str) -> str
```

Абсолютный адрес страницы фронтенда (SPA) для финального редиректа.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `path` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `settings.app_base_url.rstrip`

</details>

## _sso_error_url

[backend/app/routers/auth.py:289](../../../../../backend/app/routers/auth.py#L289)

```python
def _sso_error_url(code: str) -> str
```

URL экрана входа с пометкой об ошибке SSO (фронтенд покажет тост).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `code` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `_frontend_url`

</details>

## _encode_sso_tx

[backend/app/routers/auth.py:294](../../../../../backend/app/routers/auth.py#L294)

```python
def _encode_sso_tx(state: str, nonce: str, code_verifier: str) -> str
```

Подписывает параметры транзакции SSO коротким JWT (ключ — JWT_SECRET_KEY).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `state` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `nonce` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `code_verifier` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(now + timedelta(seconds=SSO_TX_TTL_SECONDS)).timestamp`
- `datetime.now`
- `int`
- `jwt.encode`
- `now.timestamp`
- `timedelta`

</details>

## _decode_sso_tx

[backend/app/routers/auth.py:308](../../../../../backend/app/routers/auth.py#L308)

```python
def _decode_sso_tx(token: str) -> dict
```

Проверяет и декодирует cookie sso_tx.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `token` | `str` | `обязательный` | Токен операции; формат определяется вызывающим методом. |

Возвращает: `dict`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
JWTError('Некорректный тип транзакционного токена')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `JWTError`
- `jwt.decode`
- `payload.get`

</details>

## _set_sso_tx_cookie

[backend/app/routers/auth.py:316](../../../../../backend/app/routers/auth.py#L316)

```python
def _set_sso_tx_cookie(response: Response, token: str) -> None
```

В теле вызывает `response.delete_cookie`, `response.set_cookie`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `response` | `Response` | `обязательный` | HTTP-ответ, в котором могут устанавливаться cookie/заголовки. |
| `token` | `str` | `обязательный` | Токен операции; формат определяется вызывающим методом. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `response.delete_cookie`
- `response.set_cookie`

</details>

## _clear_sso_tx_cookie

[backend/app/routers/auth.py:331](../../../../../backend/app/routers/auth.py#L331)

```python
def _clear_sso_tx_cookie(response: Response) -> None
```

В теле вызывает `response.delete_cookie`, `response.set_cookie`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `response` | `Response` | `обязательный` | HTTP-ответ, в котором могут устанавливаться cookie/заголовки. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `response.delete_cookie`
- `response.set_cookie`

</details>

## sso_config

[backend/app/routers/auth.py:346](../../../../../backend/app/routers/auth.py#L346)

```python
async def sso_config() -> SsoConfigOut
```

Публичная конфигурация SSO: показывать ли кнопку входа и с какой надписью.

Возвращает: `SsoConfigOut`.

Маршруты:

```python
router.get('/sso/config', response_model=SsoConfigOut)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `SsoConfigOut`

</details>

## sso_login

[backend/app/routers/auth.py:354](../../../../../backend/app/routers/auth.py#L354)

```python
async def sso_login() -> RedirectResponse
```

Старт входа через SSO: редирект на страницу авторизации IdM.

Возвращает: `RedirectResponse`.

Маршруты:

```python
router.get('/sso/login')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `OidcClient`
- `RedirectResponse`
- `_encode_sso_tx`
- `_set_sso_tx_cookie`
- `_sso_error_url`
- `client.build_authorization_request`
- `logger.exception`

</details>

## sso_callback

[backend/app/routers/auth.py:370](../../../../../backend/app/routers/auth.py#L370)

```python
async def sso_callback(request: Request, state: str | None=Query(default=None), code: str | None=Query(default=None), error: str | None=Query(default=None), sso_tx: str | None=Cookie(default=None), db: AsyncSession=Depends(get_db)) -> RedirectResponse
```

Возврат от IdP: сверяет state, меняет код на токены и выдаёт обычную сессию.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `request` | `Request` | `обязательный` | HTTP-запрос Starlette/FastAPI. |
| `state` | `str \| None` | `Query(default=None)` | Определяется именем/типом и контрактом вызывающего кода. |
| `code` | `str \| None` | `Query(default=None)` | Определяется именем/типом и контрактом вызывающего кода. |
| `error` | `str \| None` | `Query(default=None)` | Перехваченное исключение/ответ ошибки. |
| `sso_tx` | `str \| None` | `Cookie(default=None)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `RedirectResponse`.

Dependencies: `get_db`.

Маршруты:

```python
router.get('/sso/callback')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `AuthService`
- `AuthService(db).login_via_sso`
- `OidcClient`
- `OidcClient(settings).exchange_code`
- `RedirectResponse`
- `_clear_sso_tx_cookie`
- `_decode_sso_tx`
- `_frontend_url`
- `_set_auth_cookies`
- `_sso_error_url`
- `get_client_ip`
- `logger.exception`
- `logger.warning`
- `secrets.compare_digest`
- `str`
- `tx.get`

</details>

## logout

[backend/app/routers/auth.py:412](../../../../../backend/app/routers/auth.py#L412)

```python
async def logout(response: Response, request: Request, _: None=Depends(enforce_csrf), current_user: User=Depends(get_current_user), db: AsyncSession=Depends(get_db)) -> Response
```

Отзывает токены и очищает cookie в браузере.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `response` | `Response` | `обязательный` | HTTP-ответ, в котором могут устанавливаться cookie/заголовки. |
| `request` | `Request` | `обязательный` | HTTP-запрос Starlette/FastAPI. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `Response`.

Dependencies: `enforce_csrf`, `get_current_user`, `get_db`.

Маршруты:

```python
router.post('/logout', status_code=status.HTTP_204_NO_CONTENT)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `AuthService`
- `AuthService(db).logout`
- `_clear_auth_cookies`
- `get_client_ip`

</details>
