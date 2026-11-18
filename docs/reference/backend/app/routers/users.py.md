# backend/app/routers/users.py

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **24**.

## me

[backend/app/routers/users.py:32](../../../../../backend/app/routers/users.py#L32)

```python
async def me(current_user: User=Depends(get_current_user)) -> User
```

Возвращает профиль текущего пользователя.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |

Возвращает: `User`.

Dependencies: `get_current_user`.

Маршруты:

```python
router.get('/me', response_model=UserOut)
```

## my_profile

[backend/app/routers/users.py:38](../../../../../backend/app/routers/users.py#L38)

```python
async def my_profile(current_user: User=Depends(get_current_user)) -> User
```

Возвращает расширенный профиль текущего пользователя.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |

Возвращает: `User`.

Dependencies: `get_current_user`.

Маршруты:

```python
router.get('/me/profile', response_model=UserOut)
```

## update_my_profile

[backend/app/routers/users.py:44](../../../../../backend/app/routers/users.py#L44)

```python
async def update_my_profile(payload: UserProfileUpdate, request: Request, _: None=Depends(enforce_csrf), current_user: User=Depends(get_current_user), db: AsyncSession=Depends(get_db)) -> UserOut
```

Обновляет профиль текущего пользователя.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `payload` | `UserProfileUpdate` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `request` | `Request` | `обязательный` | HTTP-запрос Starlette/FastAPI. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `UserOut`.

Dependencies: `enforce_csrf`, `get_current_user`, `get_db`.

Маршруты:

```python
router.patch('/me', response_model=UserOut)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `UserOut.model_validate`
- `UserService`
- `UserService(db).update_own_profile`
- `get_client_ip`
- `payload.model_dump`

</details>

## change_my_password

[backend/app/routers/users.py:57](../../../../../backend/app/routers/users.py#L57)

```python
async def change_my_password(payload: OwnPasswordChangeRequest, request: Request, _: None=Depends(enforce_csrf), current_user: User=Depends(get_current_user), db: AsyncSession=Depends(get_db)) -> UserOut
```

Меняет пароль текущего пользователя.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `payload` | `OwnPasswordChangeRequest` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `request` | `Request` | `обязательный` | HTTP-запрос Starlette/FastAPI. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `UserOut`.

Dependencies: `enforce_csrf`, `get_current_user`, `get_db`.

Маршруты:

```python
router.patch('/me/password', response_model=UserOut)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `UserOut.model_validate`
- `UserService`
- `UserService(db).change_own_password`
- `get_client_ip`

</details>

## setup_my_2fa

[backend/app/routers/users.py:75](../../../../../backend/app/routers/users.py#L75)

```python
async def setup_my_2fa(request: Request, _: None=Depends(enforce_csrf), current_user: User=Depends(get_current_user), db: AsyncSession=Depends(get_db)) -> TwoFASetupResponse
```

Готовит привязку 2FA: секрет + otpauth-URI + QR (data-URL). Ещё не включает.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `request` | `Request` | `обязательный` | HTTP-запрос Starlette/FastAPI. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `TwoFASetupResponse`.

Dependencies: `enforce_csrf`, `get_current_user`, `get_db`.

Маршруты:

```python
router.post('/me/2fa/setup', response_model=TwoFASetupResponse)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `TwoFASetupResponse`
- `UserService`
- `UserService(db).setup_2fa`
- `get_client_ip`

</details>

## confirm_my_2fa

[backend/app/routers/users.py:87](../../../../../backend/app/routers/users.py#L87)

```python
async def confirm_my_2fa(payload: TwoFAConfirmRequest, request: Request, _: None=Depends(enforce_csrf), current_user: User=Depends(get_current_user), db: AsyncSession=Depends(get_db)) -> UserOut
```

Включает 2FA после ввода первого кода из приложения-аутентификатора.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `payload` | `TwoFAConfirmRequest` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `request` | `Request` | `обязательный` | HTTP-запрос Starlette/FastAPI. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `UserOut`.

Dependencies: `enforce_csrf`, `get_current_user`, `get_db`.

Маршруты:

```python
router.post('/me/2fa/confirm', response_model=UserOut)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `UserOut.model_validate`
- `UserService`
- `UserService(db).confirm_2fa`
- `get_client_ip`

</details>

## disable_my_2fa

[backend/app/routers/users.py:100](../../../../../backend/app/routers/users.py#L100)

```python
async def disable_my_2fa(payload: TwoFADisableRequest, request: Request, _: None=Depends(enforce_csrf), current_user: User=Depends(get_current_user), db: AsyncSession=Depends(get_db)) -> UserOut
```

Отключает 2FA текущему пользователю (требует пароль аккаунта).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `payload` | `TwoFADisableRequest` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `request` | `Request` | `обязательный` | HTTP-запрос Starlette/FastAPI. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `UserOut`.

Dependencies: `enforce_csrf`, `get_current_user`, `get_db`.

Маршруты:

```python
router.post('/me/2fa/disable', response_model=UserOut)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `UserOut.model_validate`
- `UserService`
- `UserService(db).disable_2fa`
- `get_client_ip`

</details>

## upload_my_avatar

[backend/app/routers/users.py:113](../../../../../backend/app/routers/users.py#L113)

```python
async def upload_my_avatar(request: Request, avatar: UploadFile=FastAPIFile(...), _: None=Depends(enforce_csrf), current_user: User=Depends(get_current_user), db: AsyncSession=Depends(get_db)) -> UserOut
```

Загружает новый аватар текущего пользователя.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `request` | `Request` | `обязательный` | HTTP-запрос Starlette/FastAPI. |
| `avatar` | `UploadFile` | `FastAPIFile(...)` | Определяется именем/типом и контрактом вызывающего кода. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `UserOut`.

Dependencies: `enforce_csrf`, `get_current_user`, `get_db`.

Маршруты:

```python
router.post('/me/avatar', response_model=UserOut)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `UserOut.model_validate`
- `UserService`
- `UserService(db).upload_avatar`
- `get_client_ip`

</details>

## delete_my_avatar

[backend/app/routers/users.py:126](../../../../../backend/app/routers/users.py#L126)

```python
async def delete_my_avatar(request: Request, _: None=Depends(enforce_csrf), current_user: User=Depends(get_current_user), db: AsyncSession=Depends(get_db)) -> UserOut
```

Удаляет аватар владельца сессии и возвращает обновлённый профиль.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `request` | `Request` | `обязательный` | HTTP-запрос Starlette/FastAPI. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `UserOut`.

Dependencies: `enforce_csrf`, `get_current_user`, `get_db`.

Маршруты:

```python
router.delete('/me/avatar', response_model=UserOut)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `UserOut.model_validate`
- `UserService`
- `UserService(db).delete_avatar`
- `get_client_ip`

</details>

## list_users

[backend/app/routers/users.py:138](../../../../../backend/app/routers/users.py#L138)

```python
async def list_users(page: int=Query(1, ge=1), size: int=Query(20, ge=1, le=200), _admin: User=Depends(require_admin), db: AsyncSession=Depends(get_db)) -> dict
```

Возвращает список пользователей для администратора.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `page` | `int` | `Query(1, ge=1)` | Номер страницы, начиная с 1. |
| `size` | `int` | `Query(20, ge=1, le=200)` | Число элементов страницы; верхняя граница задаётся маршрутом. |
| `_admin` | `User` | `Depends(require_admin)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `dict`.

Dependencies: `require_admin`, `get_db`.

Маршруты:

```python
router.get('', response_model=dict)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `PageParams`
- `UserOut.model_validate`
- `UserService`
- `UserService(db).list_users`
- `to_paginated_response`
- `to_paginated_response([UserOut.model_validate(it) for it in items], total, PageParams(page=page, size=size)).model_dump`

</details>

## _activation_url

[backend/app/routers/users.py:149](../../../../../backend/app/routers/users.py#L149)

```python
def _activation_url(job) -> str | None
```

Ссылка активации в ответе — только при выключенной почте (иначе уходит письмом).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `job` | `не аннотирован` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `str \| None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(getattr(job, 'payload', None) or {}).get`
- `getattr`

</details>

## _mail_preview_url

[backend/app/routers/users.py:156](../../../../../backend/app/routers/users.py#L156)

```python
def _mail_preview_url() -> str | None
```

URL веб-интерфейса для просмотра письма (MAIL_PREVIEW_URL). По умолчанию None.

Возвращает: `str \| None`.

## create_invitation

[backend/app/routers/users.py:162](../../../../../backend/app/routers/users.py#L162)

```python
async def create_invitation(payload: InvitationCreate, request: Request, _: None=Depends(enforce_csrf), admin: User=Depends(require_admin), db: AsyncSession=Depends(get_db)) -> InvitationSentOut
```

Приглашает пользователя по email: шлёт ссылку активации, User создаётся при активации.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `payload` | `InvitationCreate` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `request` | `Request` | `обязательный` | HTTP-запрос Starlette/FastAPI. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `admin` | `User` | `Depends(require_admin)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `InvitationSentOut`.

Dependencies: `enforce_csrf`, `require_admin`, `get_db`.

Маршруты:

```python
router.post('/invitations', response_model=InvitationSentOut, status_code=status.HTTP_201_CREATED)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `InvitationOut.model_validate`
- `InvitationSentOut`
- `UserService`
- `UserService(db).create_invitation`
- `_activation_url`
- `_mail_preview_url`
- `get_client_ip`
- `payload.model_dump`

</details>

## list_invitations

[backend/app/routers/users.py:180](../../../../../backend/app/routers/users.py#L180)

```python
async def list_invitations(_admin: User=Depends(require_admin), db: AsyncSession=Depends(get_db)) -> list[InvitationOut]
```

Список незавершённых приглашений (pending, в т.ч. истёкших).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `_admin` | `User` | `Depends(require_admin)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `list[InvitationOut]`.

Dependencies: `require_admin`, `get_db`.

Маршруты:

```python
router.get('/invitations', response_model=list[InvitationOut])
```

<details>
<summary>Прямые вызовы в теле</summary>

- `InvitationOut.model_validate`
- `InvitationOut.model_validate(item).model_copy`
- `UserService`
- `UserService(db).list_invitations`
- `deliveries.get`
- `invitation_delivery`

</details>

## resend_invitation

[backend/app/routers/users.py:192](../../../../../backend/app/routers/users.py#L192)

```python
async def resend_invitation(invitation_id: int, request: Request, _: None=Depends(enforce_csrf), admin: User=Depends(require_admin), db: AsyncSession=Depends(get_db)) -> InvitationSentOut
```

Перевыпускает ссылку приглашения и отправляет письмо заново.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `invitation_id` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `request` | `Request` | `обязательный` | HTTP-запрос Starlette/FastAPI. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `admin` | `User` | `Depends(require_admin)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `InvitationSentOut`.

Dependencies: `enforce_csrf`, `require_admin`, `get_db`.

Маршруты:

```python
router.post('/invitations/{invitation_id}/resend', response_model=InvitationSentOut)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `InvitationOut.model_validate`
- `InvitationSentOut`
- `UserService`
- `UserService(db).resend_invitation`
- `_activation_url`
- `_mail_preview_url`
- `get_client_ip`

</details>

## revoke_invitation

[backend/app/routers/users.py:210](../../../../../backend/app/routers/users.py#L210)

```python
async def revoke_invitation(invitation_id: int, request: Request, _: None=Depends(enforce_csrf), admin: User=Depends(require_admin), db: AsyncSession=Depends(get_db)) -> None
```

Отзывает приглашение — ссылка перестаёт работать.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `invitation_id` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `request` | `Request` | `обязательный` | HTTP-запрос Starlette/FastAPI. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `admin` | `User` | `Depends(require_admin)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `None`.

Dependencies: `enforce_csrf`, `require_admin`, `get_db`.

Маршруты:

```python
router.delete('/invitations/{invitation_id}', status_code=status.HTTP_204_NO_CONTENT)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `UserService`
- `UserService(db).revoke_invitation`
- `get_client_ip`

</details>

## search_users

[backend/app/routers/users.py:222](../../../../../backend/app/routers/users.py#L222)

```python
async def search_users(q: str=Query('', max_length=100), limit: int=Query(10, ge=1, le=25), _: User=Depends(get_current_user), db: AsyncSession=Depends(get_db)) -> list[UserSearchOut]
```

Ищет активных локальных пользователей STORM по логину или ФИО.

SSO-вход не подключает удалённый поиск IAM: в выдаче только пользователи БД.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `q` | `str` | `Query('', max_length=100)` | Определяется именем/типом и контрактом вызывающего кода. |
| `limit` | `int` | `Query(10, ge=1, le=25)` | Максимальное число возвращаемых записей. |
| `_` | `User` | `Depends(get_current_user)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `list[UserSearchOut]`.

Dependencies: `get_current_user`, `get_db`.

Маршруты:

```python
router.get('/search', response_model=list[UserSearchOut])
```

<details>
<summary>Прямые вызовы в теле</summary>

- `UserSearchOut.model_validate`
- `UserService`
- `UserService(db).search_users`

</details>

## get_user

[backend/app/routers/users.py:238](../../../../../backend/app/routers/users.py#L238)

```python
async def get_user(user_id: int, _admin: User=Depends(require_admin), db: AsyncSession=Depends(get_db)) -> UserOut
```

Возвращает пользователя по ID.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `user_id` | `int` | `обязательный` | ID пользователя. |
| `_admin` | `User` | `Depends(require_admin)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `UserOut`.

Dependencies: `require_admin`, `get_db`.

Маршруты:

```python
router.get('/{user_id}', response_model=UserOut)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `UserOut.model_validate`
- `UserService`
- `UserService(db).get_user`

</details>

## get_user_avatar

[backend/app/routers/users.py:249](../../../../../backend/app/routers/users.py#L249)

```python
async def get_user_avatar(user_id: int, _: User=Depends(get_current_user), db: AsyncSession=Depends(get_db)) -> Response
```

Возвращает изображение профиля авторизованному пользователю рабочего пространства.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `user_id` | `int` | `обязательный` | ID пользователя. |
| `_` | `User` | `Depends(get_current_user)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `Response`.

Dependencies: `get_current_user`, `get_db`.

Маршруты:

```python
router.get('/{user_id}/avatar')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `Response`
- `UserService`
- `UserService(db).download_avatar`

</details>

## update_user

[backend/app/routers/users.py:260](../../../../../backend/app/routers/users.py#L260)

```python
async def update_user(user_id: int, payload: UserUpdate, request: Request, _: None=Depends(enforce_csrf), admin: User=Depends(require_admin), db: AsyncSession=Depends(get_db)) -> UserOut
```

Обновляет пользователя.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `user_id` | `int` | `обязательный` | ID пользователя. |
| `payload` | `UserUpdate` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `request` | `Request` | `обязательный` | HTTP-запрос Starlette/FastAPI. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `admin` | `User` | `Depends(require_admin)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `UserOut`.

Dependencies: `enforce_csrf`, `require_admin`, `get_db`.

Маршруты:

```python
router.put('/{user_id}', response_model=UserOut)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `UserOut.model_validate`
- `UserService`
- `UserService(db).update_user`
- `get_client_ip`
- `payload.model_dump`

</details>

## delete_user

[backend/app/routers/users.py:274](../../../../../backend/app/routers/users.py#L274)

```python
async def delete_user(user_id: int, request: Request, _: None=Depends(enforce_csrf), admin: User=Depends(require_admin), db: AsyncSession=Depends(get_db)) -> None
```

Деактивирует пользователя (мягкое удаление: is_locked, строка сохраняется).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `user_id` | `int` | `обязательный` | ID пользователя. |
| `request` | `Request` | `обязательный` | HTTP-запрос Starlette/FastAPI. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `admin` | `User` | `Depends(require_admin)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `None`.

Dependencies: `enforce_csrf`, `require_admin`, `get_db`.

Маршруты:

```python
router.delete('/{user_id}', status_code=status.HTTP_204_NO_CONTENT)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `UserService`
- `UserService(db).delete_user`
- `get_client_ip`

</details>

## reactivate_user

[backend/app/routers/users.py:286](../../../../../backend/app/routers/users.py#L286)

```python
async def reactivate_user(user_id: int, request: Request, _: None=Depends(enforce_csrf), admin: User=Depends(require_admin), db: AsyncSession=Depends(get_db)) -> UserOut
```

Сразу возвращает пользователю доступ; письмо и SMTP не используются.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `user_id` | `int` | `обязательный` | ID пользователя. |
| `request` | `Request` | `обязательный` | HTTP-запрос Starlette/FastAPI. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `admin` | `User` | `Depends(require_admin)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `UserOut`.

Dependencies: `enforce_csrf`, `require_admin`, `get_db`.

Маршруты:

```python
router.post('/{user_id}/reactivate', response_model=UserOut, status_code=status.HTTP_200_OK)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `UserOut.model_validate`
- `UserService`
- `UserService(db).reactivate_user`
- `get_client_ip`

</details>

## reset_password

[backend/app/routers/users.py:299](../../../../../backend/app/routers/users.py#L299)

```python
async def reset_password(user_id: int, request: Request, _: None=Depends(enforce_csrf), admin: User=Depends(require_admin), db: AsyncSession=Depends(get_db)) -> PasswordResetOut
```

Сбрасывает пароль пользователя.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `user_id` | `int` | `обязательный` | ID пользователя. |
| `request` | `Request` | `обязательный` | HTTP-запрос Starlette/FastAPI. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `admin` | `User` | `Depends(require_admin)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `PasswordResetOut`.

Dependencies: `enforce_csrf`, `require_admin`, `get_db`.

Маршруты:

```python
router.patch('/{user_id}/password', response_model=PasswordResetOut, status_code=status.HTTP_200_OK)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `PasswordResetOut`
- `UserService`
- `UserService(db).reset_password`
- `get_client_ip`

</details>

## reset_2fa

[backend/app/routers/users.py:313](../../../../../backend/app/routers/users.py#L313)

```python
async def reset_2fa(user_id: int, request: Request, _: None=Depends(enforce_csrf), admin: User=Depends(require_admin), db: AsyncSession=Depends(get_db)) -> UserOut
```

Сбрасывает 2FA пользователю (например, при потере телефона).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `user_id` | `int` | `обязательный` | ID пользователя. |
| `request` | `Request` | `обязательный` | HTTP-запрос Starlette/FastAPI. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `admin` | `User` | `Depends(require_admin)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `UserOut`.

Dependencies: `enforce_csrf`, `require_admin`, `get_db`.

Маршруты:

```python
router.post('/{user_id}/2fa/reset', response_model=UserOut, status_code=status.HTTP_200_OK)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `UserOut.model_validate`
- `UserService`
- `UserService(db).admin_reset_2fa`
- `get_client_ip`

</details>
