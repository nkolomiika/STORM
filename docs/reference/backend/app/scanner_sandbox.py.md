# backend/app/scanner_sandbox.py

Сгенерировано из объявлений кода. [Правила чтения](../../../METHODS.md).

Методов и именованных функций: **2**.

## scanner_options

[backend/app/scanner_sandbox.py:7](../../../../backend/app/scanner_sandbox.py#L7)

```python
def scanner_options(args: list[str]) -> tuple[list[str], dict]
```

В контейнере включает сетевой профиль непривилегированного сканера.

STORM_SCANNER_SANDBOX устанавливается неизменяемым entrypoint после firewall.
Дочерний процесс не получает JWT, ключ данных, cookie и пароли интеграций.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `args` | `list[str]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `tuple[list[str], dict]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `env.update`
- `os.environ.get`

</details>

## prepare_scanner_file

[backend/app/scanner_sandbox.py:21](../../../../backend/app/scanner_sandbox.py#L21)

```python
def prepare_scanner_file(path: str) -> None
```

Даёт инструменту доступ только к конкретному временному JS-файлу (0600).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `path` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `os.chown`
- `os.environ.get`

</details>
