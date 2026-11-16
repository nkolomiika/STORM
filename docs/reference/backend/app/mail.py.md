# backend/app/mail.py

Сгенерировано из объявлений кода. [Правила чтения](../../../METHODS.md).

Методов и именованных функций: **10**.

## load_logo_bytes

[backend/app/mail.py:42](../../../../backend/app/mail.py#L42)

```python
def load_logo_bytes() -> bytes | None
```

Читает PNG-логотип. None — если файла нет: письмо уйдёт без картинки.

Возвращает: `bytes \| None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `LOGO_PATH.read_bytes`

</details>

## _html_shell

[backend/app/mail.py:50](../../../../backend/app/mail.py#L50)

```python
def _html_shell(*, heading: str, intro: str, inner: str, outro: str) -> str
```

Общий каркас письма: шапка (лого SberTech + STORM), карточка, подвал.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `heading` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `intro` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `inner` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `outro` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `str`.

## _button

[backend/app/mail.py:92](../../../../backend/app/mail.py#L92)

```python
def _button(url: str, label: str) -> str
```

Кнопка-ссылка по центру. Внешняя таблица на всю ширину + align=center —
так её центрируют и Outlook, и клиенты, игнорирующие margin:auto.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `url` | `str` | `обязательный` | URL обрабатываемого ресурса. |
| `label` | `str` | `обязательный` | Текст подписи/сообщения проверки. |

Возвращает: `str`.

## build_temporary_password_email

[backend/app/mail.py:107](../../../../backend/app/mail.py#L107)

```python
def build_temporary_password_email(*, username: str, temporary_password: str) -> tuple[str, str, str]
```

Письмо со временным паролем. Возвращает (subject, text, html).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `username` | `str` | `обязательный` | Имя пользователя. |
| `temporary_password` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `tuple[str, str, str]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `_html_shell`

</details>

## build_invitation_email

[backend/app/mail.py:133](../../../../backend/app/mail.py#L133)

```python
def build_invitation_email(*, recipient_email: str, full_name: str | None, activation_url: str) -> tuple[str, str, str]
```

Письмо-приглашение с кнопкой активации. Возвращает (subject, text, html).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `recipient_email` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `full_name` | `str \| None` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `activation_url` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `tuple[str, str, str]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `_button`
- `_html_shell`

</details>

## build_password_reset_email

[backend/app/mail.py:160](../../../../backend/app/mail.py#L160)

```python
def build_password_reset_email(*, username: str, reset_url: str, expire_hours: int) -> tuple[str, str, str]
```

Письмо «забыли пароль» с кнопкой. Возвращает (subject, text, html).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `username` | `str` | `обязательный` | Имя пользователя. |
| `reset_url` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `expire_hours` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `tuple[str, str, str]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `_button`
- `_html_shell`

</details>

## build_reactivation_email

[backend/app/mail.py:189](../../../../backend/app/mail.py#L189)

```python
def build_reactivation_email(*, username: str, reactivate_url: str, expire_hours: int) -> tuple[str, str, str]
```

Письмо «с возвращением» — кнопка возвращает доступ. Возвращает (subject, text, html).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `username` | `str` | `обязательный` | Имя пользователя. |
| `reactivate_url` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `expire_hours` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `tuple[str, str, str]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `_button`
- `_html_shell`

</details>

## _get_oauth_access_token

[backend/app/mail.py:217](../../../../backend/app/mail.py#L217)

```python
async def _get_oauth_access_token() -> str
```

Получает короткоживущий access token для SMTP XOAUTH2 (с кешированием).

Провайдеро-независимо: Google (refresh_token) и Microsoft 365 / Exchange Online
(client_credentials — app-only, или refresh_token). Берём обобщённые SMTP_OAUTH_*;
если не заданы — падаем на GOOGLE_OAUTH_* (обратная совместимость).

Возвращает: `str`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
RuntimeError('SMTP_AUTH_METHOD=xoauth2 (grant_type=refresh_token) требует SMTP_OAUTH_REFRESH_TOKEN (или GOOGLE_OAUTH_REFRESH_TOKEN)')
RuntimeError('SMTP_AUTH_METHOD=xoauth2 требует SMTP_OAUTH_CLIENT_ID/SECRET (или GOOGLE_OAUTH_*) в .env')
RuntimeError('SMTP_OAUTH_GRANT_TYPE=client_credentials требует SMTP_OAUTH_SCOPE (напр. https://outlook.office365.com/.default)')
RuntimeError(f'OAuth2 token request failed ({response.status_code})')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `(settings.smtp_oauth_grant_type or 'refresh_token').strip`
- `RuntimeError`
- `_oauth_token_cache.get`
- `client.post`
- `data.get`
- `httpx.AsyncClient`
- `int`
- `max`
- `response.json`
- `settings.smtp_oauth_scope.strip`
- `time.monotonic`

</details>

## _send_via_xoauth2

[backend/app/mail.py:267](../../../../backend/app/mail.py#L267)

```python
async def _send_via_xoauth2(message: EmailMessage, *, use_tls: bool, start_tls: bool) -> None
```

Отправка через SMTP AUTH XOAUTH2 (Gmail и др. OAuth2-провайдеры).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `message` | `EmailMessage` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `use_tls` | `bool` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `start_tls` | `bool` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
aiosmtplib.SMTPAuthenticationError(response.code, response.message)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `_get_oauth_access_token`
- `aiosmtplib.SMTP`
- `aiosmtplib.SMTPAuthenticationError`
- `base64.b64encode`
- `f'user={username}\x01auth=Bearer {access_token}\x01\x01'.encode`
- `smtp.execute_command`
- `smtp.send_message`

</details>

## send_plain_text_email

[backend/app/mail.py:295](../../../../backend/app/mail.py#L295)

```python
async def send_plain_text_email(*, recipient_email: str, subject: str, body: str, html_body: str | None=None) -> None
```

Отправляет письмо. При наличии html_body уходит multipart/alternative:
текстовая часть — фолбэк для клиентов без HTML.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `recipient_email` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `subject` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `body` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `html_body` | `str \| None` | `None` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `EmailMessage`
- `_send_via_xoauth2`
- `aiosmtplib.send`
- `bool`
- `formataddr`
- `html_part.add_related`
- `load_logo_bytes`
- `message.add_alternative`
- `message.get_payload`
- `message.set_content`

</details>
