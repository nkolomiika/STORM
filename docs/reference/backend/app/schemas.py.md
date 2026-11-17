# backend/app/schemas.py

Сгенерировано из объявлений кода. [Правила чтения](../../../METHODS.md).

Методов и именованных функций: **15**.

## InputBaseModel.normalize_strings

[backend/app/schemas.py:33](../../../../backend/app/schemas.py#L33)

```python
def normalize_strings(cls, value: object, info: ValidationInfo) -> object
```

В теле вызывает `ValueError`, `all`, `cls.model_fields.get`, `field.is_required`, `int`, `isinstance`, `item.strip`, `name.endswith`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `value` | `object` | `обязательный` | Входное значение преобразования/проверки. |
| `info` | `ValidationInfo` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `object`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValueError('Идентификатор вне допустимого диапазона')
ValueError('Идентификатор не может быть boolean')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ValueError`
- `all`
- `cls.model_fields.get`
- `field.is_required`
- `int`
- `isinstance`
- `item.strip`
- `name.endswith`
- `validate_json_value`
- `value.strip`

</details>

## InputBaseModel.validate_integer_range

[backend/app/schemas.py:60](../../../../backend/app/schemas.py#L60)

```python
def validate_integer_range(cls, value: object) -> object
```

В теле вызывает `ValueError`, `isinstance`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `value` | `object` | `обязательный` | Входное значение преобразования/проверки. |

Возвращает: `object`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValueError('Целое число вне допустимого диапазона')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ValueError`
- `isinstance`

</details>

## AgentTokenCreate.require_expiration_timezone

[backend/app/schemas.py:122](../../../../backend/app/schemas.py#L122)

```python
def require_expiration_timezone(cls, value: datetime | None) -> datetime | None
```

В теле вызывает `ValueError`, `value.utcoffset`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `value` | `datetime \| None` | `обязательный` | Входное значение преобразования/проверки. |

Возвращает: `datetime \| None`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValueError('expires_at должен содержать часовой пояс')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ValueError`
- `value.utcoffset`

</details>

## ProjectCreate.validate_dates

[backend/app/schemas.py:344](../../../../backend/app/schemas.py#L344)

```python
def validate_dates(self) -> 'ProjectCreate'
```

В теле вызывает `ValueError`.

Возвращает: `'ProjectCreate'`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValueError('Дата окончания проекта не может быть раньше даты начала')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ValueError`

</details>

## ProjectUpdate.validate_dates

[backend/app/schemas.py:370](../../../../backend/app/schemas.py#L370)

```python
def validate_dates(self) -> 'ProjectUpdate'
```

В теле вызывает `ValueError`.

Возвращает: `'ProjectUpdate'`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValueError('Дата окончания проекта не может быть раньше даты начала')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ValueError`

</details>

## IpAddressChangeRequest.validate_ip

[backend/app/schemas.py:585](../../../../backend/app/schemas.py#L585)

```python
def validate_ip(cls, value) -> не аннотирован
```

В теле вызывает `normalize_ip_literal`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `value` | `не аннотирован` | `обязательный` | Входное значение преобразования/проверки. |

Возвращает: `не аннотирован`.

<details>
<summary>Прямые вызовы в теле</summary>

- `normalize_ip_literal`

</details>

## HostIpAddressOut._empty_hostnames

[backend/app/schemas.py:610](../../../../backend/app/schemas.py#L610)

```python
def _empty_hostnames(cls, value: object) -> object
```

Преобразование/вычисление в теле функции; тип результата и параметры приведены ниже, точное выражение доступно по ссылке на исходник.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `value` | `object` | `обязательный` | Входное значение преобразования/проверки. |

Возвращает: `object`.

## HostCreate.validate_target_defined

[backend/app/schemas.py:626](../../../../backend/app/schemas.py#L626)

```python
def validate_target_defined(self) -> 'HostCreate'
```

В теле вызывает `ValueError`, `merged.append`, `raw.strip`.

Возвращает: `'HostCreate'`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValueError('Нужно указать хотя бы один ip_address или hostname')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ValueError`
- `merged.append`
- `raw.strip`

</details>

## EndpointCreate.validate_endpoint_target_defined

[backend/app/schemas.py:759](../../../../backend/app/schemas.py#L759)

```python
def validate_endpoint_target_defined(self) -> 'EndpointCreate'
```

В теле вызывает `ValueError`.

Возвращает: `'EndpointCreate'`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValueError('Нужно указать path или request_raw')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ValueError`

</details>

## EndpointOut._coerce_optional_list

[backend/app/schemas.py:791](../../../../backend/app/schemas.py#L791)

```python
def _coerce_optional_list(cls, value: object) -> object
```

Преобразование/вычисление в теле функции; тип результата и параметры приведены ниже, точное выражение доступно по ссылке на исходник.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `value` | `object` | `обязательный` | Входное значение преобразования/проверки. |

Возвращает: `object`.

## VulnerabilityCreate.validate_cvss_version

[backend/app/schemas.py:825](../../../../backend/app/schemas.py#L825)

```python
def validate_cvss_version(cls, value: CvssVersion | None) -> CvssVersion | None
```

В теле вызывает `ValueError`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `value` | `CvssVersion \| None` | `обязательный` | Входное значение преобразования/проверки. |

Возвращает: `CvssVersion \| None`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValueError('Поддерживается только CVSS 4.0')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ValueError`

</details>

## VulnerabilityUpdate.validate_cvss_version

[backend/app/schemas.py:847](../../../../backend/app/schemas.py#L847)

```python
def validate_cvss_version(cls, value: CvssVersion | None) -> CvssVersion | None
```

В теле вызывает `ValueError`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `value` | `CvssVersion \| None` | `обязательный` | Входное значение преобразования/проверки. |

Возвращает: `CvssVersion \| None`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValueError('Поддерживается только CVSS 4.0')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ValueError`

</details>

## JsFileOut._empty_endpoints

[backend/app/schemas.py:1168](../../../../backend/app/schemas.py#L1168)

```python
def _empty_endpoints(cls, value: object) -> object
```

Преобразование/вычисление в теле функции; тип результата и параметры приведены ниже, точное выражение доступно по ссылке на исходник.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `value` | `object` | `обязательный` | Входное значение преобразования/проверки. |

Возвращает: `object`.

## StormImportEndpoint.validate_target_defined

[backend/app/schemas.py:1327](../../../../backend/app/schemas.py#L1327)

```python
def validate_target_defined(self) -> 'StormImportEndpoint'
```

В теле вызывает `ValueError`.

Возвращает: `'StormImportEndpoint'`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValueError('Каждый endpoint должен содержать path или request_raw')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ValueError`

</details>

## StormImportHost.validate_target_defined

[backend/app/schemas.py:1342](../../../../backend/app/schemas.py#L1342)

```python
def validate_target_defined(self) -> 'StormImportHost'
```

В теле вызывает `ValueError`.

Возвращает: `'StormImportHost'`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValueError('Каждая запись host должна содержать ip_address или hostname')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ValueError`

</details>
