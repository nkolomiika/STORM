# backend/app/entity_access.py

Сгенерировано из объявлений кода. [Правила чтения](../../../METHODS.md).

Методов и именованных функций: **2**.

## get_project

[backend/app/entity_access.py:8](../../../../backend/app/entity_access.py#L8)

```python
async def get_project(db: AsyncSession, project_id: int) -> Project
```

Возвращает проект или NotFoundError; авторизацию выполняет dependency API.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `db` | `AsyncSession` | `обязательный` | Асинхронная SQLAlchemy-сессия текущего запроса. |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |

Возвращает: `Project`.

Прямые операции с БД: `db.scalar`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
NotFoundError('Проект не найден')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `NotFoundError`
- `db.scalar`
- `select`
- `select(Project).where`

</details>

## get_vulnerability

[backend/app/entity_access.py:16](../../../../backend/app/entity_access.py#L16)

```python
async def get_vulnerability(db: AsyncSession, project_id: int, vuln_id: int) -> Vulnerability
```

Возвращает находку только указанного проекта или NotFoundError.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `db` | `AsyncSession` | `обязательный` | Асинхронная SQLAlchemy-сессия текущего запроса. |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `vuln_id` | `int` | `обязательный` | ID уязвимости. |

Возвращает: `Vulnerability`.

Прямые операции с БД: `db.scalar`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
NotFoundError('Уязвимость не найдена')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `NotFoundError`
- `db.scalar`
- `select`
- `select(Vulnerability).where`

</details>
