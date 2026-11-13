# backend/app/oidc.py

Сгенерировано из объявлений кода. [Правила чтения](../../../METHODS.md).

Методов и именованных функций: **10**.

## _b64url

[backend/app/oidc.py:35](../../../../backend/app/oidc.py#L35)

```python
def _b64url(raw: bytes) -> str
```

base64url без паддинга (формат PKCE и JWK).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `raw` | `bytes` | `обязательный` | Исходное значение до нормализации/разбора. |

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `base64.urlsafe_b64encode`
- `base64.urlsafe_b64encode(raw).rstrip`
- `base64.urlsafe_b64encode(raw).rstrip(b'=').decode`

</details>

## OidcClient.__init__

[backend/app/oidc.py:64](../../../../backend/app/oidc.py#L64)

```python
def __init__(self, settings: Settings) -> None
```

Создаёт экземпляр и сохраняет его зависимости; параметры перечислены ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `settings` | `Settings` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

## OidcClient._client

[backend/app/oidc.py:69](../../../../backend/app/oidc.py#L69)

```python
def _client(self) -> httpx.AsyncClient
```

В теле вызывает `httpx.AsyncClient`.

Возвращает: `httpx.AsyncClient`.

<details>
<summary>Прямые вызовы в теле</summary>

- `httpx.AsyncClient`

</details>

## OidcClient._metadata

[backend/app/oidc.py:72](../../../../backend/app/oidc.py#L72)

```python
async def _metadata(self) -> dict
```

Discovery-документ IdP (кэш на процесс с TTL).

Возвращает: `dict`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
UnauthorizedError('SSO не настроен')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `UnauthorizedError`
- `_metadata_cache.get`
- `client.get`
- `resp.json`
- `resp.raise_for_status`
- `self._client`
- `time.monotonic`

</details>

## OidcClient._jwks

[backend/app/oidc.py:88](../../../../backend/app/oidc.py#L88)

```python
async def _jwks(self, *, force: bool=False) -> dict
```

JWKS IdP. force=True перечитывает (ротация подписывающих ключей).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `force` | `bool` | `False` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `dict`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
UnauthorizedError('В метаданных IdP отсутствует jwks_uri')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `UnauthorizedError`
- `client.get`
- `meta.get`
- `resp.json`
- `resp.raise_for_status`
- `self._client`
- `self._metadata`

</details>

## OidcClient.build_authorization_request

[backend/app/oidc.py:105](../../../../backend/app/oidc.py#L105)

```python
async def build_authorization_request(self, next_path: str | None=None) -> AuthorizationRequest
```

Строит URL авторизации с PKCE (S256), state и nonce.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `next_path` | `str \| None` | `None` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `AuthorizationRequest`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
UnauthorizedError('В метаданных IdP отсутствует authorization_endpoint')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `' '.join`
- `AuthorizationRequest`
- `UnauthorizedError`
- `_b64url`
- `code_verifier.encode`
- `hashlib.sha256`
- `hashlib.sha256(code_verifier.encode('ascii')).digest`
- `httpx.QueryParams`
- `meta.get`
- `secrets.token_bytes`
- `secrets.token_urlsafe`
- `self._metadata`

</details>

## OidcClient.exchange_code

[backend/app/oidc.py:132](../../../../backend/app/oidc.py#L132)

```python
async def exchange_code(self, code: str, code_verifier: str, nonce: str) -> OidcIdentity
```

Меняет authorization code на токены, проверяет ID-токен и возвращает личность.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `code` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `code_verifier` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `nonce` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `OidcIdentity`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
UnauthorizedError('IdP не вернул id_token')
UnauthorizedError('IdP отклонил обмен кода на токен')
UnauthorizedError('userinfo принадлежит другой IdP-личности')
UnauthorizedError('В ID-токене отсутствует sub')
UnauthorizedError('В метаданных IdP отсутствует token_endpoint')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `OidcIdentity`
- `UnauthorizedError`
- `claims.get`
- `client.post`
- `info.get`
- `isinstance`
- `meta.get`
- `resp.json`
- `self._client`
- `self._metadata`
- `self._userinfo`
- `self._verify_id_token`
- `token.get`

</details>

## OidcClient._verify_id_token

[backend/app/oidc.py:184](../../../../backend/app/oidc.py#L184)

```python
async def _verify_id_token(self, id_token: str, nonce: str, meta: dict) -> dict
```

Проверяет подпись (JWKS по kid), iss/aud/exp и nonce ID-токена.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `id_token` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `nonce` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `meta` | `dict` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `dict`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
UnauthorizedError('ID-токен недействителен или истёк')
UnauthorizedError('Алгоритм ключа не совпадает с ID-токеном')
UnauthorizedError('Недопустимый алгоритм подписи ID-токена')
UnauthorizedError('Некорректный ID-токен')
UnauthorizedError('Несовпадение nonce — возможна атака повтора')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `UnauthorizedError`
- `claims.get`
- `header.get`
- `jwt.decode`
- `jwt.get_unverified_header`
- `key.get`
- `meta.get`
- `self._find_key`
- `self.settings.sso_issuer.rstrip`

</details>

## OidcClient._find_key

[backend/app/oidc.py:215](../../../../backend/app/oidc.py#L215)

```python
async def _find_key(self, kid: str | None) -> dict
```

Ищет JWK по kid; при промахе перечитывает JWKS (ротация ключей).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `kid` | `str \| None` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `dict`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
UnauthorizedError('Не найден ключ подписи ID-токена')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `UnauthorizedError`
- `jwk.get`
- `jwks.get`
- `len`
- `self._jwks`

</details>

## OidcClient._userinfo

[backend/app/oidc.py:228](../../../../backend/app/oidc.py#L228)

```python
async def _userinfo(self, endpoint: str, access_token: str) -> dict
```

Запрашивает userinfo (мягко — ошибки не валят вход).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `endpoint` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `access_token` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `dict`.

<details>
<summary>Прямые вызовы в теле</summary>

- `client.get`
- `resp.json`
- `self._client`

</details>
