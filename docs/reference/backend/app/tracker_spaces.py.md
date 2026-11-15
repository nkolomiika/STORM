# backend/app/tracker_spaces.py

Сгенерировано из объявлений кода. [Правила чтения](../../../METHODS.md).

Методов и именованных функций: **2**.

## is_project_ticket

[backend/app/tracker_spaces.py:10](../../../../backend/app/tracker_spaces.py#L10)

```python
def is_project_ticket(key: str) -> bool
```

Accept only a unit code in the configured assessment space (APPSEC).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `key` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `bool`.

<details>
<summary>Прямые вызовы в теле</summary>

- `bool`
- `get_settings`
- `re.escape`
- `re.fullmatch`

</details>

## normalize_project_ticket

[backend/app/tracker_spaces.py:15](../../../../backend/app/tracker_spaces.py#L15)

```python
def normalize_project_ticket(payload: dict, *, required: bool=False) -> None
```

Нормализует необязательную привязку APPSEC или отклоняет конфликт ключа и URL.

Пустые явно переданные поля очищают привязку. required запрещает пустой
тикет при экспорте. Существование задачи здесь не проверяется по сети.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `payload` | `dict` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `required` | `bool` | `False` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValidationError('Ключ тикета не совпадает со ссылкой APPSEC')
ValidationError('Некорректная ссылка на тикет APPSEC')
ValidationError('Проект должен быть привязан к тикету пространства APPSEC')
ValidationError('Укажите APPSEC-тикет проекта')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `(payload.get('appsec_ticket_key') or '').strip`
- `(payload.get('appsec_ticket_url') or '').strip`
- `ValidationError`
- `get_settings`
- `is_project_ticket`
- `parse_qs`
- `parse_qs(parsed.query).get`
- `parsed.path.rstrip`
- `parsed.path.rstrip('/').rsplit`
- `payload.get`
- `unquote`
- `urlsplit`
- `works_issue_url`
- `{'appsec_ticket_key', 'appsec_ticket_url'}.intersection`

</details>
