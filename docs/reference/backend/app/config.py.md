# backend/app/config.py

Сгенерировано из объявлений кода. [Правила чтения](../../../METHODS.md).

Методов и именованных функций: **11**.

## Settings._parse_sso_verify_tls

[backend/app/config.py:268](../../../../backend/app/config.py#L268)

```python
def _parse_sso_verify_tls(cls, v) -> не аннотирован
```

'true'/'false' -> bool, иначе путь к PEM-файлу с CA.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `v` | `не аннотирован` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `не аннотирован`.

<details>
<summary>Прямые вызовы в теле</summary>

- `isinstance`
- `v.strip`
- `v.strip().lower`

</details>

## Settings.sso_discovery_url

[backend/app/config.py:281](../../../../backend/app/config.py#L281)

```python
def sso_discovery_url(self) -> str
```

Адрес OIDC discovery-документа (из SSO_METADATA_URL или issuer).

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `self.sso_issuer.strip`
- `self.sso_issuer.strip().rstrip`
- `self.sso_metadata_url.strip`

</details>

## Settings.sso_configured

[backend/app/config.py:289](../../../../backend/app/config.py#L289)

```python
def sso_configured(self) -> bool
```

Достаточно ли настроек, чтобы показывать и обслуживать вход через SSO.

Возвращает: `bool`.

<details>
<summary>Прямые вызовы в теле</summary>

- `bool`

</details>

## Settings.sso_scope_list

[backend/app/config.py:294](../../../../backend/app/config.py#L294)

```python
def sso_scope_list(self) -> list[str]
```

Список запрашиваемых scope (из строки через пробел/запятую).

Возвращает: `list[str]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `s.strip`
- `self.sso_scopes.replace`
- `self.sso_scopes.replace(',', ' ').split`

</details>

## Settings.sso_redirect_uri

[backend/app/config.py:299](../../../../backend/app/config.py#L299)

```python
def sso_redirect_uri(self) -> str
```

Абсолютный redirect_uri для callback (должен совпадать с настройкой IdP).

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(self.sso_redirect_base.strip() or self.app_base_url).rstrip`
- `self.sso_redirect_base.strip`

</details>

## Settings.validate_secret_key

[backend/app/config.py:306](../../../../backend/app/config.py#L306)

```python
def validate_secret_key(cls, value: str) -> str
```

Проверяет минимальную длину JWT-секрета.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `value` | `str` | `обязательный` | Входное значение преобразования/проверки. |

Возвращает: `str`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValueError('JWT_SECRET_KEY должен содержать минимум 32 символа')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ValueError`
- `len`

</details>

## Settings.cors_origins

[backend/app/config.py:313](../../../../backend/app/config.py#L313)

```python
def cors_origins(self) -> list[str]
```

Возвращает список разрешённых CORS-источников.

Возвращает: `list[str]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `origin.strip`
- `self.backend_cors_origins.split`

</details>

## Settings.csrf_origins

[backend/app/config.py:318](../../../../backend/app/config.py#L318)

```python
def csrf_origins(self) -> list[str]
```

Возвращает список разрешённых Origin для CSRF-проверки.

Возвращает: `list[str]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `origin.strip`
- `self.csrf_allowed_origins.split`

</details>

## Settings.works_configured

[backend/app/config.py:323](../../../../backend/app/config.py#L323)

```python
def works_configured(self) -> bool
```

Достаточно ли настроек, чтобы экспортировать тикеты в Works.

Возвращает: `bool`.

<details>
<summary>Прямые вызовы в теле</summary>

- `bool`
- `self.works_api_token.strip`
- `self.works_base_url.strip`

</details>

## Settings.works_cookies_dict

[backend/app/config.py:328](../../../../backend/app/config.py#L328)

```python
def works_cookies_dict(self) -> dict[str, str]
```

Статические cookie Works ("k1=v1; k2=v2") → dict.

Возвращает: `dict[str, str]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `k.strip`
- `part.split`
- `self.works_cookies.split`
- `v.strip`

</details>

## get_settings

[backend/app/config.py:340](../../../../backend/app/config.py#L340)

```python
def get_settings() -> Settings
```

Возвращает кешированный объект настроек.

Возвращает: `Settings`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Settings`

</details>
