# backend/app/routers/reports.py

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **5**.

## _safe_filename

[backend/app/routers/reports.py:18](../../../../../backend/app/routers/reports.py#L18)

```python
def _safe_filename(name: str) -> str
```

Возвращает имя файла с разрешёнными ASCII-символами для Content-Disposition.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `name` | `str` | `обязательный` | Имя/название обрабатываемого объекта. |

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `''.join`
- `(name or '').strip`
- `ch.isalnum`
- `ch.isascii`

</details>

## _content_disposition

[backend/app/routers/reports.py:24](../../../../../backend/app/routers/reports.py#L24)

```python
def _content_disposition(project_name: str, suffix: str) -> str
```

В теле вызывает `(project_name or 'report').strip`, `_safe_filename`, `quote`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_name` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `suffix` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(project_name or 'report').strip`
- `_safe_filename`
- `quote`

</details>

## _stream_word_report

[backend/app/routers/reports.py:32](../../../../../backend/app/routers/reports.py#L32)

```python
async def _stream_word_report(*, project_id: int, project: Project, db: AsyncSession, kind: str) -> StreamingResponse
```

В теле вызывает `ReportService`, `ReportService(db).generate`, `StreamingResponse`, `_content_disposition`, `iter`, `report_product_name`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `project` | `Project` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `обязательный` | Асинхронная SQLAlchemy-сессия текущего запроса. |
| `kind` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `StreamingResponse`.

<details>
<summary>Прямые вызовы в теле</summary>

- `ReportService`
- `ReportService(db).generate`
- `StreamingResponse`
- `_content_disposition`
- `iter`
- `report_product_name`

</details>

## generate_szi_report

[backend/app/routers/reports.py:41](../../../../../backend/app/routers/reports.py#L41)

```python
async def generate_szi_report(project_id: int, _: None=Depends(enforce_csrf), _user: User=Depends(get_current_user), project: Project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> StreamingResponse
```

Генерирует Word-отчёт «СЗИ» (для сертификации) по шаблону.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `_user` | `User` | `Depends(get_current_user)` | Определяется именем/типом и контрактом вызывающего кода. |
| `project` | `Project` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `StreamingResponse`.

Dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

Маршруты:

```python
router.post('/projects/{project_id}/reports/szi')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `_stream_word_report`

</details>

## generate_pp_report

[backend/app/routers/reports.py:53](../../../../../backend/app/routers/reports.py#L53)

```python
async def generate_pp_report(project_id: int, _: None=Depends(enforce_csrf), _user: User=Depends(get_current_user), project: Project=Depends(require_project_access), db: AsyncSession=Depends(get_db)) -> StreamingResponse
```

Генерирует Word-отчёт «ПП» (внутренняя приёмка) по шаблону.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `_user` | `User` | `Depends(get_current_user)` | Определяется именем/типом и контрактом вызывающего кода. |
| `project` | `Project` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `StreamingResponse`.

Dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

Маршруты:

```python
router.post('/projects/{project_id}/reports/pp')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `_stream_word_report`

</details>
