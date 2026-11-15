# backend/app/tracker_metadata.py

Сгенерировано из объявлений кода. [Правила чтения](../../../METHODS.md).

Методов и именованных функций: **3**.

## assignee_identity

[backend/app/tracker_metadata.py:5](../../../../backend/app/tracker_metadata.py#L5)

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

- `isinstance`
- `next`
- `value.get`
- `value.strip`
- `value[key].strip`

</details>

## affected_versions

[backend/app/tracker_metadata.py:16](../../../../backend/app/tracker_metadata.py#L16)

```python
def affected_versions(attributes: dict) -> list[dict[str, str]]
```

Parse the native affects_version_s_crpv array without selecting one item.

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

[backend/app/tracker_metadata.py:41](../../../../backend/app/tracker_metadata.py#L41)

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
