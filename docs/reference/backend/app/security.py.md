# backend/app/security.py

Сгенерировано из объявлений кода. [Правила чтения](../../../METHODS.md).

Методов и именованных функций: **22**.

## hash_password

[backend/app/security.py:26](../../../../backend/app/security.py#L26)

```python
def hash_password(password: str) -> str
```

Хэширует пароль через bcrypt_sha256 без усечения на 72 байтах; проверка поддерживает прежний bcrypt.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `password` | `str` | `обязательный` | Пароль, передаваемый в операцию. |

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `pwd_context.hash`

</details>

## verify_password

[backend/app/security.py:31](../../../../backend/app/security.py#L31)

```python
def verify_password(plain_password: str, hashed_password: str) -> bool
```

Проверяет соответствие пароля его bcrypt-хэшу.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `plain_password` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `hashed_password` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `bool`.

<details>
<summary>Прямые вызовы в теле</summary>

- `pwd_context.verify`

</details>

## hash_refresh_token

[backend/app/security.py:39](../../../../backend/app/security.py#L39)

```python
def hash_refresh_token(token: str) -> str
```

Возвращает SHA-256 хэш refresh-токена.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `token` | `str` | `обязательный` | Токен операции; формат определяется вызывающим методом. |

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `hashlib.sha256`
- `hashlib.sha256(token.encode('utf-8')).hexdigest`
- `token.encode`

</details>

## hash_agent_token

[backend/app/security.py:44](../../../../backend/app/security.py#L44)

```python
def hash_agent_token(token: str) -> str
```

Возвращает SHA-256 хэш agent API token.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `token` | `str` | `обязательный` | Токен операции; формат определяется вызывающим методом. |

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `hashlib.sha256`
- `hashlib.sha256(token.encode('utf-8')).hexdigest`
- `token.encode`

</details>

## generate_invitation_token

[backend/app/security.py:49](../../../../backend/app/security.py#L49)

```python
def generate_invitation_token() -> str
```

Генерирует «сырой» токен активации для ссылки-приглашения.

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `secrets.token_urlsafe`

</details>

## hash_invitation_token

[backend/app/security.py:54](../../../../backend/app/security.py#L54)

```python
def hash_invitation_token(token: str) -> str
```

Возвращает SHA-256 хэш токена приглашения (в БД храним только хэш).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `token` | `str` | `обязательный` | Токен операции; формат определяется вызывающим методом. |

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `hashlib.sha256`
- `hashlib.sha256(token.encode('utf-8')).hexdigest`
- `token.encode`

</details>

## generate_password_reset_token

[backend/app/security.py:59](../../../../backend/app/security.py#L59)

```python
def generate_password_reset_token() -> str
```

Генерирует «сырой» токен для ссылки восстановления пароля.

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `secrets.token_urlsafe`

</details>

## hash_password_reset_token

[backend/app/security.py:64](../../../../backend/app/security.py#L64)

```python
def hash_password_reset_token(token: str) -> str
```

Возвращает SHA-256 хэш токена сброса пароля (в БД храним только хэш).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `token` | `str` | `обязательный` | Токен операции; формат определяется вызывающим методом. |

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `hashlib.sha256`
- `hashlib.sha256(token.encode('utf-8')).hexdigest`
- `token.encode`

</details>

## generate_reactivation_token

[backend/app/security.py:69](../../../../backend/app/security.py#L69)

```python
def generate_reactivation_token() -> str
```

Генерирует «сырой» токен для ссылки возврата деактивированного пользователя.

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `secrets.token_urlsafe`

</details>

## hash_reactivation_token

[backend/app/security.py:74](../../../../backend/app/security.py#L74)

```python
def hash_reactivation_token(token: str) -> str
```

Возвращает SHA-256 хэш токена возврата (в БД храним только хэш).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `token` | `str` | `обязательный` | Токен операции; формат определяется вызывающим методом. |

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `hashlib.sha256`
- `hashlib.sha256(token.encode('utf-8')).hexdigest`
- `token.encode`

</details>

## _encode_token

[backend/app/security.py:79](../../../../backend/app/security.py#L79)

```python
def _encode_token(subject: int, token_type: str, expires_delta: timedelta) -> str
```

В теле вызывает `datetime.now`, `datetime.now(UTC).timestamp`, `expire_at.timestamp`, `int`, `jwt.encode`, `secrets.token_hex`, `str`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `subject` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `token_type` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `expires_delta` | `timedelta` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `datetime.now`
- `datetime.now(UTC).timestamp`
- `expire_at.timestamp`
- `int`
- `jwt.encode`
- `secrets.token_hex`
- `str`

</details>

## create_access_token

[backend/app/security.py:95](../../../../backend/app/security.py#L95)

```python
def create_access_token(user_id: int) -> str
```

Генерирует короткоживущий access-токен.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `user_id` | `int` | `обязательный` | ID пользователя. |

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `_encode_token`
- `timedelta`

</details>

## create_refresh_token

[backend/app/security.py:100](../../../../backend/app/security.py#L100)

```python
def create_refresh_token(user_id: int) -> str
```

Генерирует долгоживущий refresh-токен.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `user_id` | `int` | `обязательный` | ID пользователя. |

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `_encode_token`
- `timedelta`

</details>

## create_2fa_pending_token

[backend/app/security.py:105](../../../../backend/app/security.py#L105)

```python
def create_2fa_pending_token(user_id: int) -> str
```

Генерирует короткоживущий токен «пароль принят, ждём код TOTP».

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `user_id` | `int` | `обязательный` | ID пользователя. |

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `_encode_token`
- `timedelta`

</details>

## decode_token

[backend/app/security.py:110](../../../../backend/app/security.py#L110)

```python
def decode_token(token: str, expected_type: str) -> int
```

Декодирует JWT и проверяет тип токена.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `token` | `str` | `обязательный` | Токен операции; формат определяется вызывающим методом. |
| `expected_type` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `int`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
UnauthorizedError('В токене отсутствует sub')
UnauthorizedError('Некорректный идентификатор пользователя')
UnauthorizedError('Некорректный тип токена')
UnauthorizedError('Токен недействителен или истёк')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `UnauthorizedError`
- `int`
- `jwt.decode`
- `payload.get`

</details>

## _fernet

[backend/app/security.py:132](../../../../backend/app/security.py#L132)

```python
def _fernet(secret: str | None=None) -> не аннотирован
```

Строит Fernet из постоянного секрета, сохраняя прежний алгоритм SHA-256.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `secret` | `str \| None` | `None` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `не аннотирован`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValueError('Не настроен независимый ключ шифрования данных')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `Fernet`
- `ValueError`
- `base64.urlsafe_b64encode`
- `hashlib.sha256`
- `hashlib.sha256(secret.encode('utf-8')).digest`
- `len`
- `secret.encode`
- `secret.strip`

</details>

## encrypt_secret

[backend/app/security.py:143](../../../../backend/app/security.py#L143)

```python
def encrypt_secret(value: str) -> str
```

Шифрует произвольный секрет для хранения в БД.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `value` | `str` | `обязательный` | Входное значение преобразования/проверки. |

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `_fernet`
- `_fernet().encrypt`
- `_fernet().encrypt(value.encode('utf-8')).decode`
- `value.encode`

</details>

## decrypt_secret

[backend/app/security.py:148](../../../../backend/app/security.py#L148)

```python
def decrypt_secret(value: str) -> str
```

Читает секрет активным или явно настроенным прежним ключом, не переписывая БД.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `value` | `str` | `обязательный` | Входное значение преобразования/проверки. |

Возвращает: `str`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
InvalidToken
```

<details>
<summary>Прямые вызовы в теле</summary>

- `_fernet`
- `_fernet(secret).decrypt`
- `_fernet(secret).decrypt(value.encode('utf-8')).decode`
- `dict.fromkeys`
- `isinstance`
- `value.encode`

</details>

## generate_totp_secret

[backend/app/security.py:167](../../../../backend/app/security.py#L167)

```python
def generate_totp_secret() -> str
```

Генерирует случайный base32-секрет TOTP.

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `pyotp.random_base32`

</details>

## verify_totp

[backend/app/security.py:172](../../../../backend/app/security.py#L172)

```python
def verify_totp(secret: str, code: str) -> bool
```

Проверяет 6-значный код TOTP с допуском на рассинхрон часов ±30с.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `secret` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `code` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `bool`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(code or '').replace`
- `(code or '').replace(' ', '').strip`
- `pyotp.TOTP`
- `pyotp.TOTP(secret).verify`

</details>

## totp_provisioning_uri

[backend/app/security.py:180](../../../../backend/app/security.py#L180)

```python
def totp_provisioning_uri(secret: str, account_name: str) -> str
```

Строит otpauth://-URI для добавления в приложение-аутентификатор.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `secret` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `account_name` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `pyotp.TOTP`
- `pyotp.TOTP(secret).provisioning_uri`

</details>

## totp_qr_png_data_url

[backend/app/security.py:185](../../../../backend/app/security.py#L185)

```python
def totp_qr_png_data_url(otpauth_uri: str) -> str
```

Рендерит otpauth-URI в QR-код и возвращает его как data:image/png;base64.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `otpauth_uri` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `BytesIO`
- `base64.b64encode`
- `base64.b64encode(buffer.getvalue()).decode`
- `buffer.getvalue`
- `img.save`
- `qrcode.make`

</details>
