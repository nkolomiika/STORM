# backend/app/tracker_metadata.py

Сгенерировано из объявлений кода. [Правила чтения](../../../METHODS.md).

Методов и именованных функций: **7**.

## unit_attributes

[backend/app/tracker_metadata.py:5](../../../../backend/app/tracker_metadata.py#L5)

```python
def unit_attributes(value: object) -> dict
```

Нормализует словарь или массив AS21 {attribute: {code}, value} без мутации.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `value` | `object` | `обязательный` | Входное значение преобразования/проверки. |

Возвращает: `dict`.

<details>
<summary>Прямые вызовы в теле</summary>

- `attribute.get`
- `dict`
- `entry.get`
- `isinstance`
- `result.setdefault`

</details>

## component_reference

[backend/app/tracker_metadata.py:26](../../../../backend/app/tracker_metadata.py#L26)

```python
def component_reference(value: object) -> dict[str, str] | None
```

Читает единственный компонент; при нескольких не выбирает его произвольно.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `value` | `object` | `обязательный` | Входное значение преобразования/проверки. |

Возвращает: `dict[str, str] \| None`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValueError('Некорректная ссылка на компонент')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ValueError`
- `isinstance`
- `len`
- `value.get`
- `value['code'].strip`

</details>

## component_references

[backend/app/tracker_metadata.py:43](../../../../backend/app/tracker_metadata.py#L43)

```python
def component_references(value: object) -> list[dict[str, str]]
```

Сохраняет все компоненты APPSEC в исходном порядке, удаляя дубли кодов.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `value` | `object` | `обязательный` | Входное значение преобразования/проверки. |

Возвращает: `list[dict[str, str]]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `component_reference`
- `isinstance`
- `result.append`
- `seen.add`
- `set`

</details>

## normalize_project_components

[backend/app/tracker_metadata.py:56](../../../../backend/app/tracker_metadata.py#L56)

```python
def normalize_project_components(payload: dict) -> None
```

Сохраняет массив компонентов; старые скалярные поля отражают первый элемент.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `payload` | `dict` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |

Возвращает: `None`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValidationError('Компоненты должны быть массивом')
ValidationError('У каждого компонента должен быть код')
ValidationError(str(exc))
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ValidationError`
- `any`
- `component_references`
- `isinstance`
- `payload.get`
- `str`
- `value.get`
- `value['code'].strip`
- `{'appsec_component_code', 'appsec_component_name'}.intersection`

</details>

## assignee_identity

[backend/app/tracker_metadata.py:78](../../../../backend/app/tracker_metadata.py#L78)

```python
def assignee_identity(value) -> tuple[str | None, str | None]
```

Keep the login separate from a display name; never use a bare name as ID.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `value` | `не аннотирован` | `обязательный` | Входное значение преобразования/проверки. |

Возвращает: `tuple[str \| None, str \| None]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `' '.join`
- `isinstance`
- `next`
- `value.get`
- `value.strip`
- `value[key].strip`

</details>

## affected_versions

[backend/app/tracker_metadata.py:91](../../../../backend/app/tracker_metadata.py#L91)

```python
def affected_versions(attributes: dict) -> list[dict[str, str]]
```

Читает все версии APPSEC из affects_version_s и прежних форматов AS21.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `attributes` | `dict` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `list[dict[str, str]]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `attributes.get`
- `isinstance`
- `next`
- `result.append`
- `seen.add`
- `set`
- `value.get`
- `value.strip`
- `value[key].strip`

</details>

## normalize_project_versions

[backend/app/tracker_metadata.py:118](../../../../backend/app/tracker_metadata.py#L118)

```python
def normalize_project_versions(payload: dict) -> None
```

Store arrays canonically; keep the old scalar fields as a compatibility view.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `payload` | `dict` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |

Возвращает: `None`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValidationError('Затронутые версии должны быть массивом')
ValidationError('У каждой затронутой версии должен быть код')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `(value.get('name') or code).strip`
- `ValidationError`
- `isinstance`
- `payload.get`
- `result.append`
- `seen.add`
- `set`
- `value.get`
- `value['code'].strip`
- `{'appsec_version_code', 'appsec_version_name'}.intersection`

</details>
