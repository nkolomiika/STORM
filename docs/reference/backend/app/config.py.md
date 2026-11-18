# backend/app/config.py

Сгенерировано из объявлений кода. [Правила чтения](../../../METHODS.md).

Методов и именованных функций: **15**.

## Settings._parse_sso_verify_tls

[backend/app/config.py:276](../../../../backend/app/config.py#L276)

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

[backend/app/config.py:289](../../../../backend/app/config.py#L289)

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

[backend/app/config.py:297](../../../../backend/app/config.py#L297)

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

[backend/app/config.py:302](../../../../backend/app/config.py#L302)

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

[backend/app/config.py:307](../../../../backend/app/config.py#L307)

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

[backend/app/config.py:314](../../../../backend/app/config.py#L314)

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

## Settings.validate_data_encryption_key

[backend/app/config.py:322](../../../../backend/app/config.py#L322)

```python
def validate_data_encryption_key(cls, value: str) -> str
```

Не допускает отсутствующий, пустой или короткий ключ данных.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `value` | `str` | `обязательный` | Входное значение преобразования/проверки. |

Возвращает: `str`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValueError('DATA_ENCRYPTION_KEY должен содержать минимум 32 символа')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ValueError`
- `len`
- `value.strip`

</details>

## Settings.reject_private_scan_targets

[backend/app/config.py:330](../../../../backend/app/config.py#L330)

```python
def reject_private_scan_targets(cls, value: bool) -> bool
```

Не допускает отключение SSRF-защиты настройкой окружения.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `value` | `bool` | `обязательный` | Входное значение преобразования/проверки. |

Возвращает: `bool`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValueError('Сканирование внутренних адресов запрещено политикой SSRF')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ValueError`

</details>

## Settings.validate_previous_encryption_keys

[backend/app/config.py:338](../../../../backend/app/config.py#L338)

```python
def validate_previous_encryption_keys(cls, values: list[str]) -> list[str]
```

Не допускает слабые ключи чтения; значения не включаются в сообщение ошибки.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `values` | `list[str]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `list[str]`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValueError('Предыдущие ключи шифрования должны содержать минимум 32 символа')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ValueError`
- `any`
- `len`

</details>

## Settings.validate_independent_encryption_keys

[backend/app/config.py:345](../../../../backend/app/config.py#L345)

```python
def validate_independent_encryption_keys(self) -> 'Settings'
```

Запрещает использование JWT-ключа как активного или прежнего ключа данных.

Возвращает: `'Settings'`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValueError('JWT_SECRET_KEY и ключи шифрования данных должны различаться')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ValueError`

</details>

## Settings.cors_origins

[backend/app/config.py:352](../../../../backend/app/config.py#L352)

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

[backend/app/config.py:357](../../../../backend/app/config.py#L357)

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

[backend/app/config.py:362](../../../../backend/app/config.py#L362)

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

[backend/app/config.py:367](../../../../backend/app/config.py#L367)

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

[backend/app/config.py:379](../../../../backend/app/config.py#L379)

```python
def get_settings() -> Settings
```

Возвращает кешированный объект настроек.

Возвращает: `Settings`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Settings`

</details>
