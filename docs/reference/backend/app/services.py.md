# backend/app/services.py

Сгенерировано из объявлений кода. [Правила чтения](../../../METHODS.md).

Методов и именованных функций: **254**.

## _sanitize_filename

[backend/app/services.py:160](../../../../backend/app/services.py#L160)

```python
def _sanitize_filename(raw: str | None, fallback: str='file.bin') -> str
```

Удаляет path separators, null-bytes и control-chars из оригинального имени файла.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `raw` | `str \| None` | `обязательный` | Исходное значение до нормализации/разбора. |
| `fallback` | `str` | `'file.bin'` | Запасное значение при отсутствии основного. |

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `''.join`
- `ch.isprintable`
- `name.lstrip`
- `os.path.basename`
- `os.path.basename(str(raw).replace('\\', '/')).strip`
- `str`
- `str(raw).replace`

</details>

## AuditService.__init__

[backend/app/services.py:175](../../../../backend/app/services.py#L175)

```python
def __init__(self, db: AsyncSession) -> None
```

Создаёт экземпляр и сохраняет его зависимости; параметры перечислены ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `db` | `AsyncSession` | `обязательный` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `None`.

## AuditService.log

[backend/app/services.py:178](../../../../backend/app/services.py#L178)

```python
async def log(self, action: str, *, user_id: int | None=None, entity_type: str | None=None, entity_id: int | None=None, details: dict | None=None, ip_address: str | None=None, commit: bool=True) -> None
```

Добавляет запись аудита в текущую транзакцию. По умолчанию выполняет commit; commit=False ограничивается flush и позволяет сохранить несколько изменений и записей аудита одним внешним commit.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `action` | `str` | `обязательный` | Тип события аудита. |
| `user_id` | `int \| None` | `None` | ID пользователя. |
| `entity_type` | `str \| None` | `None` | Тип сущности в журнале аудита. |
| `entity_id` | `int \| None` | `None` | ID сущности в журнале, если событие связано с записью. |
| `details` | `dict \| None` | `None` | Дополнительный контекст события. |
| `ip_address` | `str \| None` | `None` | IP-адрес; в AuditService — адрес клиента. |
| `commit` | `bool` | `True` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

Прямые операции с БД: `self.db.add`, `self.db.commit`, `self.db.flush`.

<details>
<summary>Прямые вызовы в теле</summary>

- `AuditLog`
- `datetime.now`
- `logging.getLogger`
- `logging.getLogger('storm.audit').info`
- `self.db.add`
- `self.db.commit`
- `self.db.flush`

</details>

## AgentTokenService.__init__

[backend/app/services.py:219](../../../../backend/app/services.py#L219)

```python
def __init__(self, db: AsyncSession) -> None
```

Создаёт экземпляр и сохраняет его зависимости; параметры перечислены ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `db` | `AsyncSession` | `обязательный` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `AuditService`

</details>

## AgentTokenService._member_project_ids

[backend/app/services.py:223](../../../../backend/app/services.py#L223)

```python
async def _member_project_ids(self, user_id: int) -> set[int]
```

Проекты, где пользователь состоит участником (для не-админа = его доступ).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `user_id` | `int` | `обязательный` | ID пользователя. |

Возвращает: `set[int]`.

Прямые операции с БД: `self.db.scalars`.

<details>
<summary>Прямые вызовы в теле</summary>

- `rows.all`
- `select`
- `select(ProjectMember.project_id).where`
- `self.db.scalars`
- `set`

</details>

## AgentTokenService._project_ids_for_token

[backend/app/services.py:228](../../../../backend/app/services.py#L228)

```python
async def _project_ids_for_token(self, token_id: int) -> list[int]
```

В теле вызывает `list`, `rows.all`, `select`, `select(AgentApiTokenProjectGrant.project_id).where`, `self.db.scalars`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `token_id` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `list[int]`.

Прямые операции с БД: `self.db.scalars`.

<details>
<summary>Прямые вызовы в теле</summary>

- `list`
- `rows.all`
- `select`
- `select(AgentApiTokenProjectGrant.project_id).where`
- `self.db.scalars`

</details>

## AgentTokenService._serialize_token

[backend/app/services.py:235](../../../../backend/app/services.py#L235)

```python
def _serialize_token(token: AgentApiToken, project_ids: list[int]) -> dict
```

Сериализует AgentApiToken в dict со всеми полями (включая nullable, отсутствующие в __dict__).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `token` | `AgentApiToken` | `обязательный` | Токен операции; формат определяется вызывающим методом. |
| `project_ids` | `list[int]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `dict`.

## AgentTokenService.list_tokens

[backend/app/services.py:252](../../../../backend/app/services.py#L252)

```python
async def list_tokens(self, actor_id: int) -> list[dict]
```

Токены, выпущенные этим пользователем (каждый видит только свои).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |

Возвращает: `list[dict]`.

Прямые операции с БД: `self.db.scalars`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(await self.db.scalars(select(AgentApiToken).where(AgentApiToken.created_by == actor_id).order_by(AgentApiToken.created_at.desc()))).all`
- `AgentApiToken.created_at.desc`
- `result.append`
- `select`
- `select(AgentApiToken).where`
- `select(AgentApiToken).where(AgentApiToken.created_by == actor_id).order_by`
- `self._project_ids_for_token`
- `self._serialize_token`
- `self.db.scalars`

</details>

## AgentTokenService.create_token

[backend/app/services.py:266](../../../../backend/app/services.py#L266)

```python
async def create_token(self, payload: dict, actor: User) -> tuple[dict, str]
```

В теле вызывает `', '.join`, `(await self.db.scalars(select(Project.id).where(Project.id.in_(project_ids)))).all`, `AgentApiToken`, `AgentApiTokenProjectGrant`, `ForbiddenError`, `Project.id.in_`, `ValidationError`, `any`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `payload` | `dict` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `actor` | `User` | `обязательный` | Авторизованный инициатор операции. |

Возвращает: `tuple[dict, str]`.

Прямые операции с БД: `self.db.add`, `self.db.flush`, `self.db.refresh`, `self.db.scalars`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ForbiddenError(f"Нет доступа к проектам: {', '.join(map(str, forbidden))} — токен не может превышать ваши права")
ValidationError('Список project_ids содержит несуществующие проекты')
ValidationError('Срок действия токена уже истёк')
ValidationError(f"Неизвестные scope: {', '.join(unknown)}")
```

<details>
<summary>Прямые вызовы в теле</summary>

- `', '.join`
- `(await self.db.scalars(select(Project.id).where(Project.id.in_(project_ids)))).all`
- `AgentApiToken`
- `AgentApiTokenProjectGrant`
- `ForbiddenError`
- `Project.id.in_`
- `ValidationError`
- `any`
- `bool`
- `datetime.now`
- `dict.fromkeys`
- `hash_agent_token`
- `list`
- `map`
- `payload.get`
- `secrets.token_urlsafe`
- `select`
- `select(Project.id).where`
- `self._member_project_ids`
- `self._project_ids_for_token`
- `self._serialize_token`
- `self.audit.log`
- `self.db.add`
- `self.db.flush`
- `self.db.refresh`
- `self.db.scalars`
- `set`

</details>

## AgentTokenService.revoke_token

[backend/app/services.py:320](../../../../backend/app/services.py#L320)

```python
async def revoke_token(self, token_id: int, actor: User) -> None
```

В теле вызывает `ForbiddenError`, `NotFoundError`, `select`, `select(AgentApiToken).where`, `self.audit.log`, `self.db.delete`, `self.db.flush`, `self.db.scalar`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `token_id` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `actor` | `User` | `обязательный` | Авторизованный инициатор операции. |

Возвращает: `None`.

Прямые операции с БД: `self.db.delete`, `self.db.flush`, `self.db.scalar`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ForbiddenError('Можно удалять только свои токены')
NotFoundError('Agent API token не найден')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ForbiddenError`
- `NotFoundError`
- `select`
- `select(AgentApiToken).where`
- `self.audit.log`
- `self.db.delete`
- `self.db.flush`
- `self.db.scalar`

</details>

## WorksService.__init__

[backend/app/services.py:341](../../../../backend/app/services.py#L341)

```python
def __init__(self, db: AsyncSession) -> None
```

Создаёт экземпляр и сохраняет его зависимости; параметры перечислены ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `db` | `AsyncSession` | `обязательный` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `AuditService`

</details>

## WorksService.find_components

[backend/app/services.py:345](../../../../backend/app/services.py#L345)

```python
async def find_components(self, q: str='') -> list[dict[str, str]]
```

Получает компоненты формы проекта из справочника STS.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `q` | `str` | `''` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `list[dict[str, str]]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `self._find_reference`

</details>

## WorksService.find_product_codes

[backend/app/services.py:349](../../../../backend/app/services.py#L349)

```python
async def find_product_codes(self, q: str='') -> list[dict[str, str]]
```

Подсказки по taxonomy product_code_list_sts формы bug_appsec.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `q` | `str` | `''` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `list[dict[str, str]]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `self._find_reference`

</details>

## WorksService._find_reference

[backend/app/services.py:353](../../../../backend/app/services.py#L353)

```python
async def _find_reference(self, kind: Literal['components', 'versions', 'product_codes'], q: str) -> list[dict[str, str]]
```

Отделяет отказ внешнего справочника от ошибки пользовательских полей.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `kind` | `Literal['components', 'versions', 'product_codes']` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `q` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `list[dict[str, str]]`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ServiceUnavailableError('Подключение к Task Tracker пока не настроено.', 'task_tracker_not_configured')
tracker_service_error(exc)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `(item['name'] + ' ' + item['code']).casefold`
- `ServiceUnavailableError`
- `TaskTrackerService`
- `TaskTrackerService()._request`
- `WorksClient`
- `_extract_items`
- `affected_versions`
- `attributes.get`
- `component_references`
- `getattr`
- `getattr(wc, 'find_' + kind)`
- `isinstance`
- `logging.getLogger`
- `logging.getLogger('storm.works').warning`
- `q.casefold`
- `references.values`
- `tracker_service_error`
- `unit.get`
- `unit_attributes`
- `value.get`

</details>

## WorksService.find_versions

[backend/app/services.py:383](../../../../backend/app/services.py#L383)

```python
async def find_versions(self, q: str='') -> list[dict[str, str]]
```

Версии формы проекта из реального TT либо явно включённого локального демо.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `q` | `str` | `''` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `list[dict[str, str]]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `self._find_reference`

</details>

## WorksService.get_link

[backend/app/services.py:387](../../../../backend/app/services.py#L387)

```python
async def get_link(self, project_id: int, vulnerability_id: int) -> WorksIssueLink | None
```

Проверяет родительский проект до чтения ссылки и синхронизации с TT.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `vulnerability_id` | `int` | `обязательный` | ID уязвимости. |

Возвращает: `WorksIssueLink \| None`.

Прямые операции с БД: `self.db.commit`, `self.db.refresh`, `self.db.scalar`.

<details>
<summary>Прямые вызовы в теле</summary>

- `WorksClient`
- `get_vulnerability`
- `getattr`
- `logging.getLogger`
- `logging.getLogger('storm.works').warning`
- `select`
- `select(WorksIssueLink).where`
- `self.db.commit`
- `self.db.refresh`
- `self.db.scalar`
- `wc.get_ticket_status`

</details>

## WorksService._extract_key

[backend/app/services.py:411](../../../../backend/app/services.py#L411)

```python
def _extract_key(response: Any) -> str
```

Достаёт код/ключ созданного тикета из ответа Works (форма заранее неизвестна).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `response` | `Any` | `обязательный` | HTTP-ответ, в котором могут устанавливаться cookie/заголовки. |

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `isinstance`
- `re.escape`
- `re.fullmatch`
- `response.get`
- `unit.get`

</details>

## WorksService.export_vulnerability

[backend/app/services.py:426](../../../../backend/app/services.py#L426)

```python
async def export_vulnerability(self, project_id: int, vuln_id: int, user: User, assignee: str | None) -> WorksIssueLink
```

Создаёт один тикет STS для находки и сохраняет его связь с проектом.

Сначала проверяет обязательные метаданные. Блокировка строки находки
сериализует повторные экспорты; уже сохранённая связь возвращается без
внешнего запроса. Сбой внешнего API не оставляет локальную связь.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `vuln_id` | `int` | `обязательный` | ID уязвимости. |
| `user` | `User` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `assignee` | `str \| None` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `WorksIssueLink`.

Прямые операции с БД: `self.db.add`, `self.db.commit`, `self.db.refresh`, `self.db.scalar`, `self.db.scalars`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
NotFoundError('Проект не найден')
NotFoundError('Уязвимость не найдена')
ValidationError('Для индекса уязвимости заполните дату окончания работ в проекте')
ValidationError('Заполните данные по проекту. Не заполнено: ' + ', '.join(missing))
ValidationError('Интеграция с Works не настроена или отключена')
ValidationError('Находки Unrealized не экспортируются в Task Tracker')
ValidationError('Не указан исполнитель (assignee) для экспорта в AppSec')
ValidationError(exc.message)
WorksError('Task Tracker не вернул корректный ключ созданного STS-тикета.')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `', '.join`
- `(await self.db.scalars(select(Host).where(Host.project_id == project_id).order_by(Host.id))).all`
- `(await self.db.scalars(select(Vulnerability).where(Vulnerability.project_id == project_id).order_by(Vulnerability.id))).all`
- `(await self.db.scalars(select(VulnerabilityAsset).join(Vulnerability, Vulnerability.id == VulnerabilityAsset.vulnerability_id).where(Vulnerability.project_id == project_id).order_by(VulnerabilityAsset.id))).all`
- `(project.appsec_assignee or '').strip`
- `(project.appsec_component_code or '').strip`
- `(project.appsec_product_code or '').strip`
- `(project.appsec_ticket_key or project.appsec_ticket_url or '').strip`
- `(project.appsec_version_code or '').strip`
- `NotFoundError`
- `ValidationError`
- `WorksClient`
- `WorksError`
- `WorksIssueLink`
- `finding_references`
- `list`
- `logging.getLogger`
- `logging.getLogger('storm.works').info`
- `logging.getLogger('storm.works').warning`
- `missing.append`
- `normalize_project_ticket`
- `priority_for_severity`
- `select`
- `select(Host).where`
- `select(Host).where(Host.project_id == project_id).order_by`
- `select(Project).where`
- `select(Vulnerability).where`
- `select(Vulnerability).where(Vulnerability.id == vuln_id, Vulnerability.project_id == project_id).with_for_update`
- `select(Vulnerability).where(Vulnerability.project_id == project_id).order_by`
- `select(VulnerabilityAsset).join`
- `select(VulnerabilityAsset).join(Vulnerability, Vulnerability.id == VulnerabilityAsset.vulnerability_id).where`
- `select(VulnerabilityAsset).join(Vulnerability, Vulnerability.id == VulnerabilityAsset.vulnerability_id).where(Vulnerability.project_id == project_id).order_by`
- `select(WorksIssueLink).where`
- `self._extract_key`
- `self.audit.log`
- `self.db.add`
- `self.db.commit`
- `self.db.refresh`
- `self.db.scalar`
- `self.db.scalars`
- `wc.create_bug_appsec`
- `wc.link_units`
- `works_issue_url`

</details>

## AuthService.__init__

[backend/app/services.py:574](../../../../backend/app/services.py#L574)

```python
def __init__(self, db: AsyncSession) -> None
```

Создаёт экземпляр и сохраняет его зависимости; параметры перечислены ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `db` | `AsyncSession` | `обязательный` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `AuditService`

</details>

## AuthService._issue_session

[backend/app/services.py:578](../../../../backend/app/services.py#L578)

```python
async def _issue_session(self, user_id: int) -> tuple[str, str]
```

Создаёт пару access/refresh токенов и сохраняет refresh в БД.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `user_id` | `int` | `обязательный` | ID пользователя. |

Возвращает: `tuple[str, str]`.

Прямые операции с БД: `self.db.add`, `self.db.flush`.

<details>
<summary>Прямые вызовы в теле</summary>

- `RefreshToken`
- `create_access_token`
- `create_refresh_token`
- `datetime.now`
- `hash_refresh_token`
- `self.db.add`
- `self.db.flush`
- `timedelta`

</details>

## AuthService.issue_session_for_user

[backend/app/services.py:588](../../../../backend/app/services.py#L588)

```python
async def issue_session_for_user(self, user_id: int) -> tuple[str, str]
```

Выдаёт сессию без проверки пароля — для активации приглашения (пароль только что задан).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `user_id` | `int` | `обязательный` | ID пользователя. |

Возвращает: `tuple[str, str]`.

Прямые операции с БД: `self.db.commit`.

<details>
<summary>Прямые вызовы в теле</summary>

- `self._issue_session`
- `self.db.commit`

</details>

## AuthService.login_via_sso

[backend/app/services.py:594](../../../../backend/app/services.py#L594)

```python
async def login_via_sso(self, identity: 'OidcIdentity', ip_address: str | None=None) -> tuple[str, str, User]
```

Вход по подтверждённой IdP-личности: находит/заводит пользователя и выдаёт сессию.

Локальная 2FA при SSO не запрашивается — второй фактор обеспечивает сам
провайдер (IAM). Пользователь ищется только по подтверждённому email.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `identity` | `'OidcIdentity'` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `ip_address` | `str \| None` | `None` | IP-адрес; в AuditService — адрес клиента. |

Возвращает: `tuple[str, str, User]`.

Прямые операции с БД: `self.db.scalar`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
UnauthorizedError('IdP должен передать подтверждённый email')
UnauthorizedError('IdP не передал email — автосоздание пользователя невозможно')
UnauthorizedError('IdP передал некорректный email')
UnauthorizedError('Пользователь деактивирован')
UnauthorizedError('Пользователь не найден. Обратитесь к администратору за доступом.')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `(identity.email or '').strip`
- `(identity.email or '').strip().lower`
- `(identity.username or '').strip`
- `TypeAdapter`
- `TypeAdapter(EmailStr).validate_python`
- `UnauthorizedError`
- `func.lower`
- `len`
- `select`
- `select(User).where`
- `self._issue_session`
- `self._provision_sso_user`
- `self.audit.log`
- `self.db.scalar`
- `str`
- `str(TypeAdapter(EmailStr).validate_python(email)).lower`

</details>

## AuthService._provision_sso_user

[backend/app/services.py:630](../../../../backend/app/services.py#L630)

```python
async def _provision_sso_user(self, *, email: str, username: str | None, full_name: str | None) -> User
```

Создаёт локального пользователя при первом входе через SSO.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `email` | `str` | `обязательный` | Email пользователя/получателя. |
| `username` | `str \| None` | `обязательный` | Имя пользователя. |
| `full_name` | `str \| None` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `User`.

Прямые операции с БД: `self.db.add`, `self.db.flush`, `self.db.refresh`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(username or email.split('@', 1)[0]).strip`
- `User`
- `datetime.now`
- `email.split`
- `hash_password`
- `secrets.token_urlsafe`
- `self._unique_username`
- `self.audit.log`
- `self.db.add`
- `self.db.flush`
- `self.db.refresh`
- `settings.sso_default_role.strip`
- `settings.sso_default_role.strip().lower`

</details>

## AuthService._unique_username

[backend/app/services.py:653](../../../../backend/app/services.py#L653)

```python
async def _unique_username(self, base: str) -> str
```

Подбирает свободный username (SSO-claim может конфликтовать с существующим).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `base` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `str`.

Прямые операции с БД: `self.db.scalar`.

<details>
<summary>Прямые вызовы в теле</summary>

- `range`
- `secrets.token_hex`
- `select`
- `select(User).where`
- `self.db.scalar`

</details>

## AuthService.login

[backend/app/services.py:664](../../../../backend/app/services.py#L664)

```python
async def login(self, username: str, password: str, ip_address: str | None=None) -> LoginOutcome
```

Проверяет учётные данные. При включённом 2FA возвращает challenge вместо сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `username` | `str` | `обязательный` | Имя пользователя. |
| `password` | `str` | `обязательный` | Пароль, передаваемый в операцию. |
| `ip_address` | `str \| None` | `None` | IP-адрес; в AuditService — адрес клиента. |

Возвращает: `LoginOutcome`.

Прямые операции с БД: `self.db.scalar`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
UnauthorizedError('Неверный логин или пароль')
UnauthorizedError('Пользователь деактивирован')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `LoginOutcome`
- `UnauthorizedError`
- `create_2fa_pending_token`
- `select`
- `select(User).where`
- `self._issue_session`
- `self.audit.log`
- `self.db.scalar`
- `verify_password`

</details>

## AuthService.verify_2fa

[backend/app/services.py:681](../../../../backend/app/services.py#L681)

```python
async def verify_2fa(self, pending_token: str | None, code: str, ip_address: str | None=None) -> tuple[str, str, User]
```

Завершает вход: сверяет TOTP-код по pending-токену и выдаёт сессию.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `pending_token` | `str \| None` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `code` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `ip_address` | `str \| None` | `None` | IP-адрес; в AuditService — адрес клиента. |

Возвращает: `tuple[str, str, User]`.

Прямые операции с БД: `self.db.scalar`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ServiceUnavailableError('Не удалось прочитать данные 2FA. Обратитесь к администратору.', 'secret_decryption_failed')
UnauthorizedError('Двухфакторная аутентификация не настроена')
UnauthorizedError('Неверный код подтверждения')
UnauthorizedError('Пользователь не найден или деактивирован')
UnauthorizedError('Сессия подтверждения истекла — войдите заново')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ServiceUnavailableError`
- `UnauthorizedError`
- `decode_token`
- `decrypt_secret`
- `select`
- `select(User).where`
- `self._issue_session`
- `self.audit.log`
- `self.db.scalar`
- `verify_totp`

</details>

## AuthService.refresh

[backend/app/services.py:702](../../../../backend/app/services.py#L702)

```python
async def refresh(self, refresh_token: str | None, ip_address: str | None=None) -> tuple[str, str]
```

Обновляет access-токен по валидному refresh-cookie с ротацией refresh-токена.

Возвращает (new_access_token, new_refresh_token).
Старый refresh-токен помечается как revoked. Если приходит уже отозванный токен —
отзываем все активные токены пользователя как защиту от token reuse / replay-атаки.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `refresh_token` | `str \| None` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `ip_address` | `str \| None` | `None` | IP-адрес; в AuditService — адрес клиента. |

Возвращает: `tuple[str, str]`.

Прямые операции с БД: `self.db.add`, `self.db.commit`, `self.db.execute`, `self.db.flush`, `self.db.scalar`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
UnauthorizedError('Refresh token недействителен')
UnauthorizedError('Refresh token отсутствует')
UnauthorizedError('Refresh token уже использован')
UnauthorizedError('Пользователь деактивирован')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `RefreshToken`
- `RefreshToken.revoked_at.is_`
- `UnauthorizedError`
- `and_`
- `create_access_token`
- `create_refresh_token`
- `datetime.now`
- `decode_token`
- `hash_refresh_token`
- `select`
- `select(RefreshToken).where`
- `select(User).where`
- `self.audit.log`
- `self.db.add`
- `self.db.commit`
- `self.db.execute`
- `self.db.flush`
- `self.db.scalar`
- `timedelta`
- `update`
- `update(RefreshToken).where`
- `update(RefreshToken).where(and_(RefreshToken.user_id == user_id, RefreshToken.revoked_at.is_(None))).values`

</details>

## AuthService.logout

[backend/app/services.py:745](../../../../backend/app/services.py#L745)

```python
async def logout(self, user_id: int, ip_address: str | None=None) -> None
```

Отзывает все активные refresh-токены пользователя.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `user_id` | `int` | `обязательный` | ID пользователя. |
| `ip_address` | `str \| None` | `None` | IP-адрес; в AuditService — адрес клиента. |

Возвращает: `None`.

Прямые операции с БД: `self.db.execute`, `self.db.flush`.

<details>
<summary>Прямые вызовы в теле</summary>

- `RefreshToken.revoked_at.is_`
- `and_`
- `datetime.now`
- `self.audit.log`
- `self.db.execute`
- `self.db.flush`
- `update`
- `update(RefreshToken).where`
- `update(RefreshToken).where(and_(RefreshToken.user_id == user_id, RefreshToken.revoked_at.is_(None))).values`

</details>

## UserService.__init__

[backend/app/services.py:759](../../../../backend/app/services.py#L759)

```python
def __init__(self, db: AsyncSession) -> None
```

Создаёт экземпляр и сохраняет его зависимости; параметры перечислены ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `db` | `AsyncSession` | `обязательный` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `AuditService`
- `MinioStorage`

</details>

## UserService._normalized_admin_email

[backend/app/services.py:765](../../../../backend/app/services.py#L765)

```python
def _normalized_admin_email() -> str
```

В теле вызывает `configured_email.split`.

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `configured_email.split`

</details>

## UserService._generate_temporary_password

[backend/app/services.py:772](../../../../backend/app/services.py#L772)

```python
def _generate_temporary_password() -> str
```

В теле вызывает `secrets.token_urlsafe`.

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `secrets.token_urlsafe`

</details>

## UserService._ensure_mail_delivery_enabled

[backend/app/services.py:776](../../../../backend/app/services.py#L776)

```python
def _ensure_mail_delivery_enabled() -> None
```

В теле вызывает `ServiceUnavailableError`, `bool`, `logging.getLogger`, `logging.getLogger('storm.mail').warning`, `settings.smtp_host.strip`.

Возвращает: `None`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ServiceUnavailableError('Отправка писем пока не настроена. Обратитесь к администратору.', 'mail_not_configured')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ServiceUnavailableError`
- `bool`
- `logging.getLogger`
- `logging.getLogger('storm.mail').warning`
- `settings.smtp_host.strip`

</details>

## UserService._ensure_unique_identity

[backend/app/services.py:782](../../../../backend/app/services.py#L782)

```python
async def _ensure_unique_identity(self, *, username: str | None=None, email: str | None=None, exclude_user_id: int | None=None) -> None
```

В теле вызывает `ConflictError`, `clauses.append`, `or_`, `query.where`, `select`, `select(User).where`, `self.db.scalar`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `username` | `str \| None` | `None` | Имя пользователя. |
| `email` | `str \| None` | `None` | Email пользователя/получателя. |
| `exclude_user_id` | `int \| None` | `None` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

Прямые операции с БД: `self.db.scalar`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ConflictError('Username or email is already taken')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ConflictError`
- `clauses.append`
- `or_`
- `query.where`
- `select`
- `select(User).where`
- `self.db.scalar`

</details>

## UserService._enqueue_temporary_password_mail

[backend/app/services.py:803](../../../../backend/app/services.py#L803)

```python
async def _enqueue_temporary_password_mail(self, *, user: User, temporary_password: str, actor_id: int | None) -> MailJob
```

В теле вызывает `MailJob`, `build_temporary_password_email`, `self.db.add`, `self.db.flush`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `user` | `User` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `temporary_password` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `actor_id` | `int \| None` | `обязательный` | ID инициатора для аудита и уведомлений. |

Возвращает: `MailJob`.

Прямые операции с БД: `self.db.add`, `self.db.flush`.

<details>
<summary>Прямые вызовы в теле</summary>

- `MailJob`
- `build_temporary_password_email`
- `self.db.add`
- `self.db.flush`

</details>

## UserService._publish_mail_job

[backend/app/services.py:826](../../../../backend/app/services.py#L826)

```python
async def _publish_mail_job(self, job: MailJob) -> None
```

Публикует задание; при сбое брокера сохраняет его для повторной доставки.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `job` | `MailJob` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

Прямые операции с БД: `self.db.commit`.

<details>
<summary>Прямые вызовы в теле</summary>

- `datetime.now`
- `logging.getLogger`
- `logging.getLogger('storm.mail').exception`
- `logging.getLogger('storm.mail').info`
- `publish_mail_job`
- `redact_log`
- `self.db.commit`
- `str`

</details>

## UserService.bootstrap_admin

[backend/app/services.py:843](../../../../backend/app/services.py#L843)

```python
async def bootstrap_admin(self) -> None
```

Создаёт стартового администратора при пустой таблице users.

Возвращает: `None`.

Прямые операции с БД: `self.db.add`, `self.db.commit`, `self.db.scalar`.

<details>
<summary>Прямые вызовы в теле</summary>

- `User`
- `admin_user.email.split`
- `datetime.now`
- `func.count`
- `hash_password`
- `or_`
- `select`
- `select(User).where`
- `select(func.count()).select_from`
- `self._normalized_admin_email`
- `self.db.add`
- `self.db.commit`
- `self.db.scalar`

</details>

## UserService.list_users

[backend/app/services.py:873](../../../../backend/app/services.py#L873)

```python
async def list_users(self, page: int, size: int) -> tuple[list[User], int]
```

Возвращает список пользователей с пагинацией.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `page` | `int` | `обязательный` | Номер страницы, начиная с 1. |
| `size` | `int` | `обязательный` | Число элементов страницы; верхняя граница задаётся маршрутом. |

Возвращает: `tuple[list[User], int]`.

Прямые операции с БД: `self.db.scalar`, `self.db.scalars`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(await self.db.scalars(select(User).order_by(User.created_at.desc(), User.id.desc()).offset((page - 1) * size).limit(size))).all`
- `User.created_at.desc`
- `User.id.desc`
- `func.count`
- `list`
- `select`
- `select(User).order_by`
- `select(User).order_by(User.created_at.desc(), User.id.desc()).offset`
- `select(User).order_by(User.created_at.desc(), User.id.desc()).offset((page - 1) * size).limit`
- `select(func.count()).select_from`
- `self.db.scalar`
- `self.db.scalars`

</details>

## UserService.search_users

[backend/app/services.py:881](../../../../backend/app/services.py#L881)

```python
async def search_users(self, q: str, limit: int=10) -> list[User]
```

Поиск активных пользователей по username ИЛИ ФИО (full_name) — для тайпхеда
исполнителя. Пустой q возвращает первых по алфавиту (ФИО, затем username).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `q` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `limit` | `int` | `10` | Максимальное число возвращаемых записей. |

Возвращает: `list[User]`.

Прямые операции с БД: `self.db.scalars`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(await self.db.scalars(stmt)).all`
- `(q or '').strip`
- `User.full_name.ilike`
- `User.is_active.is_`
- `User.is_locked.is_`
- `User.username.ilike`
- `func.coalesce`
- `func.lower`
- `list`
- `max`
- `min`
- `or_`
- `select`
- `select(User).where`
- `self.db.scalars`
- `stmt.order_by`
- `stmt.order_by(func.lower(func.coalesce(User.full_name, User.username))).limit`
- `stmt.where`

</details>

## UserService.get_user

[backend/app/services.py:894](../../../../backend/app/services.py#L894)

```python
async def get_user(self, user_id: int) -> User
```

Возвращает пользователя по идентификатору.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `user_id` | `int` | `обязательный` | ID пользователя. |

Возвращает: `User`.

Прямые операции с БД: `self.db.scalar`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
NotFoundError('User not found')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `NotFoundError`
- `select`
- `select(User).where`
- `self.db.scalar`

</details>

## UserService._enqueue_invitation_mail

[backend/app/services.py:907](../../../../backend/app/services.py#L907)

```python
async def _enqueue_invitation_mail(self, *, invitation: Invitation, raw_token: str, actor_id: int | None) -> MailJob
```

В теле вызывает `MailJob`, `build_invitation_email`, `self.db.add`, `self.db.flush`, `settings.app_base_url.rstrip`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `invitation` | `Invitation` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `raw_token` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `actor_id` | `int \| None` | `обязательный` | ID инициатора для аудита и уведомлений. |

Возвращает: `MailJob`.

Прямые операции с БД: `self.db.add`, `self.db.flush`.

<details>
<summary>Прямые вызовы в теле</summary>

- `MailJob`
- `build_invitation_email`
- `self.db.add`
- `self.db.flush`
- `settings.app_base_url.rstrip`

</details>

## UserService.create_invitation

[backend/app/services.py:927](../../../../backend/app/services.py#L927)

```python
async def create_invitation(self, payload: dict, actor_id: int, ip_address: str | None=None) -> tuple[Invitation, MailJob]
```

Создаёт приглашение и ставит письмо со ссылкой активации в очередь.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `payload` | `dict` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |
| `ip_address` | `str \| None` | `None` | IP-адрес; в AuditService — адрес клиента. |

Возвращает: `tuple[Invitation, MailJob]`.

Прямые операции с БД: `self.db.add`, `self.db.flush`, `self.db.refresh`, `self.db.scalar`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ConflictError('A user with this email already exists')
ConflictError('Приглашение для этого email уже отправлено — используйте повторную отправку')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ConflictError`
- `Invitation`
- `and_`
- `datetime.now`
- `generate_invitation_token`
- `hash_invitation_token`
- `payload.get`
- `select`
- `select(Invitation).where`
- `select(User).where`
- `self._enqueue_invitation_mail`
- `self._ensure_mail_delivery_enabled`
- `self._publish_mail_job`
- `self.audit.log`
- `self.db.add`
- `self.db.flush`
- `self.db.refresh`
- `self.db.scalar`
- `timedelta`

</details>

## UserService.list_invitations

[backend/app/services.py:969](../../../../backend/app/services.py#L969)

```python
async def list_invitations(self) -> list[Invitation]
```

Незавершённые приглашения (pending, в т.ч. истёкшие) для админ-панели.

Возвращает: `list[Invitation]`.

Прямые операции с БД: `self.db.scalars`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(await self.db.scalars(select(Invitation).where(Invitation.status == 'pending').order_by(Invitation.created_at.desc()))).all`
- `Invitation.created_at.desc`
- `list`
- `select`
- `select(Invitation).where`
- `select(Invitation).where(Invitation.status == 'pending').order_by`
- `self.db.scalars`

</details>

## UserService._get_invitation

[backend/app/services.py:978](../../../../backend/app/services.py#L978)

```python
async def _get_invitation(self, invitation_id: int) -> Invitation
```

В теле вызывает `NotFoundError`, `select`, `select(Invitation).where`, `self.db.scalar`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `invitation_id` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Invitation`.

Прямые операции с БД: `self.db.scalar`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
NotFoundError('Приглашение не найдено')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `NotFoundError`
- `select`
- `select(Invitation).where`
- `self.db.scalar`

</details>

## UserService.resend_invitation

[backend/app/services.py:984](../../../../backend/app/services.py#L984)

```python
async def resend_invitation(self, invitation_id: int, actor_id: int, ip_address: str | None=None) -> tuple[Invitation, MailJob]
```

Перевыпускает токен приглашения, продлевает срок и снова шлёт письмо.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `invitation_id` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |
| `ip_address` | `str \| None` | `None` | IP-адрес; в AuditService — адрес клиента. |

Возвращает: `tuple[Invitation, MailJob]`.

Прямые операции с БД: `self.db.flush`, `self.db.refresh`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ConflictError('Приглашение уже принято')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ConflictError`
- `datetime.now`
- `generate_invitation_token`
- `hash_invitation_token`
- `self._enqueue_invitation_mail`
- `self._ensure_mail_delivery_enabled`
- `self._get_invitation`
- `self._publish_mail_job`
- `self.audit.log`
- `self.db.flush`
- `self.db.refresh`
- `timedelta`

</details>

## UserService.revoke_invitation

[backend/app/services.py:1008](../../../../backend/app/services.py#L1008)

```python
async def revoke_invitation(self, invitation_id: int, actor_id: int, ip_address: str | None=None) -> None
```

Отзывает приглашение — ссылка перестаёт работать.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `invitation_id` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |
| `ip_address` | `str \| None` | `None` | IP-адрес; в AuditService — адрес клиента. |

Возвращает: `None`.

Прямые операции с БД: `self.db.flush`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ConflictError('Приглашение уже принято — отозвать нельзя')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ConflictError`
- `self._get_invitation`
- `self.audit.log`
- `self.db.flush`

</details>

## UserService._load_invitation_by_token

[backend/app/services.py:1024](../../../../backend/app/services.py#L1024)

```python
async def _load_invitation_by_token(self, raw_token: str, *, for_update: bool=False) -> Invitation | None
```

В теле вызывает `hash_invitation_token`, `query.with_for_update`, `select`, `select(Invitation).where`, `self.db.scalar`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `raw_token` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `for_update` | `bool` | `False` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Invitation \| None`.

Прямые операции с БД: `self.db.scalar`.

<details>
<summary>Прямые вызовы в теле</summary>

- `hash_invitation_token`
- `query.with_for_update`
- `select`
- `select(Invitation).where`
- `self.db.scalar`

</details>

## UserService.get_invitation_info

[backend/app/services.py:1028](../../../../backend/app/services.py#L1028)

```python
async def get_invitation_info(self, raw_token: str) -> dict
```

Публичные данные для страницы активации (email/имя) или причина отказа.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `raw_token` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `dict`.

<details>
<summary>Прямые вызовы в теле</summary>

- `self._load_invitation_by_token`

</details>

## UserService.check_invitation_username_available

[backend/app/services.py:1040](../../../../backend/app/services.py#L1040)

```python
async def check_invitation_username_available(self, raw_token: str, username: str) -> bool
```

Проверяет свободен ли username. Требует валидного токена (без открытой энумерации).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `raw_token` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `username` | `str` | `обязательный` | Имя пользователя. |

Возвращает: `bool`.

Прямые операции с БД: `self.db.scalar`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
UnauthorizedError('Приглашение недействительно или истекло')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `UnauthorizedError`
- `select`
- `select(User).where`
- `self._load_invitation_by_token`
- `self.db.scalar`

</details>

## UserService.accept_invitation

[backend/app/services.py:1048](../../../../backend/app/services.py#L1048)

```python
async def accept_invitation(self, raw_token: str, username: str, password: str, ip_address: str | None=None) -> User
```

Активация: приглашённый задаёт username+пароль, создаётся пользователь.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `raw_token` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `username` | `str` | `обязательный` | Имя пользователя. |
| `password` | `str` | `обязательный` | Пароль, передаваемый в операцию. |
| `ip_address` | `str \| None` | `None` | IP-адрес; в AuditService — адрес клиента. |

Возвращает: `User`.

Прямые операции с БД: `self.db.add`, `self.db.flush`, `self.db.refresh`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
UnauthorizedError('Приглашение недействительно или истекло')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `UnauthorizedError`
- `User`
- `datetime.now`
- `hash_password`
- `self._ensure_unique_identity`
- `self._load_invitation_by_token`
- `self.audit.log`
- `self.db.add`
- `self.db.flush`
- `self.db.refresh`

</details>

## UserService._enqueue_password_reset_mail

[backend/app/services.py:1087](../../../../backend/app/services.py#L1087)

```python
async def _enqueue_password_reset_mail(self, *, user: User, raw_token: str) -> MailJob
```

В теле вызывает `MailJob`, `build_password_reset_email`, `self.db.add`, `self.db.flush`, `settings.app_base_url.rstrip`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `user` | `User` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `raw_token` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `MailJob`.

Прямые операции с БД: `self.db.add`, `self.db.flush`.

<details>
<summary>Прямые вызовы в теле</summary>

- `MailJob`
- `build_password_reset_email`
- `self.db.add`
- `self.db.flush`
- `settings.app_base_url.rstrip`

</details>

## UserService.request_password_reset

[backend/app/services.py:1107](../../../../backend/app/services.py#L1107)

```python
async def request_password_reset(self, email: str, ip_address: str | None=None) -> None
```

Отправляет ссылку восстановления, если такой пользователь есть.

Ничего не возвращает и не бросает при отсутствии пользователя: иначе
форма «забыли пароль» стала бы оракулом для перебора существующих email.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `email` | `str` | `обязательный` | Email пользователя/получателя. |
| `ip_address` | `str \| None` | `None` | IP-адрес; в AuditService — адрес клиента. |

Возвращает: `None`.

Прямые операции с БД: `self.db.add`, `self.db.execute`, `self.db.flush`, `self.db.scalar`.

<details>
<summary>Прямые вызовы в теле</summary>

- `PasswordResetToken`
- `PasswordResetToken.used_at.is_`
- `and_`
- `datetime.now`
- `generate_password_reset_token`
- `hash_password_reset_token`
- `select`
- `select(User).where`
- `self._enqueue_password_reset_mail`
- `self._ensure_mail_delivery_enabled`
- `self._publish_mail_job`
- `self.audit.log`
- `self.db.add`
- `self.db.execute`
- `self.db.flush`
- `self.db.scalar`
- `timedelta`
- `update`
- `update(PasswordResetToken).where`
- `update(PasswordResetToken).where(and_(PasswordResetToken.user_id == user.id, PasswordResetToken.used_at.is_(None))).values`

</details>

## UserService._load_reset_token

[backend/app/services.py:1150](../../../../backend/app/services.py#L1150)

```python
async def _load_reset_token(self, raw_token: str, *, for_update: bool=False) -> PasswordResetToken | None
```

В теле вызывает `hash_password_reset_token`, `query.with_for_update`, `select`, `select(PasswordResetToken).where`, `self.db.scalar`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `raw_token` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `for_update` | `bool` | `False` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `PasswordResetToken \| None`.

Прямые операции с БД: `self.db.scalar`.

<details>
<summary>Прямые вызовы в теле</summary>

- `hash_password_reset_token`
- `query.with_for_update`
- `select`
- `select(PasswordResetToken).where`
- `self.db.scalar`

</details>

## UserService.get_password_reset_info

[backend/app/services.py:1154](../../../../backend/app/services.py#L1154)

```python
async def get_password_reset_info(self, raw_token: str) -> dict
```

Проверяет ссылку до показа формы нового пароля.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `raw_token` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `dict`.

Прямые операции с БД: `self.db.scalar`.

<details>
<summary>Прямые вызовы в теле</summary>

- `select`
- `select(User).where`
- `self._load_reset_token`
- `self.db.scalar`

</details>

## UserService.confirm_password_reset

[backend/app/services.py:1168](../../../../backend/app/services.py#L1168)

```python
async def confirm_password_reset(self, raw_token: str, new_password: str, ip_address: str | None=None) -> User
```

Ставит новый пароль по одноразовой ссылке и гасит все сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `raw_token` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `new_password` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `ip_address` | `str \| None` | `None` | IP-адрес; в AuditService — адрес клиента. |

Возвращает: `User`.

Прямые операции с БД: `self.db.execute`, `self.db.flush`, `self.db.refresh`, `self.db.scalar`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
UnauthorizedError('Ссылка недействительна или истекла')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `RefreshToken.revoked_at.is_`
- `UnauthorizedError`
- `and_`
- `datetime.now`
- `hash_password`
- `select`
- `select(User).where`
- `self._load_reset_token`
- `self.audit.log`
- `self.db.execute`
- `self.db.flush`
- `self.db.refresh`
- `self.db.scalar`
- `update`
- `update(RefreshToken).where`
- `update(RefreshToken).where(and_(RefreshToken.user_id == user.id, RefreshToken.revoked_at.is_(None))).values`

</details>

## UserService.reactivate_user

[backend/app/services.py:1198](../../../../backend/app/services.py#L1198)

```python
async def reactivate_user(self, user_id: int, actor_id: int, ip_address: str | None=None) -> User
```

Сразу разблокирует пользователя без письма и гасит прежние ссылки возврата.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `user_id` | `int` | `обязательный` | ID пользователя. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |
| `ip_address` | `str \| None` | `None` | IP-адрес; в AuditService — адрес клиента. |

Возвращает: `User`.

Прямые операции с БД: `self.db.execute`, `self.db.flush`, `self.db.refresh`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValidationError('The user is not deactivated')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `AccountReactivationToken.used_at.is_`
- `ValidationError`
- `and_`
- `datetime.now`
- `self.audit.log`
- `self.db.execute`
- `self.db.flush`
- `self.db.refresh`
- `self.get_user`
- `update`
- `update(AccountReactivationToken).where`
- `update(AccountReactivationToken).where(and_(AccountReactivationToken.user_id == user.id, AccountReactivationToken.used_at.is_(None))).values`

</details>

## UserService._load_reactivation_token

[backend/app/services.py:1216](../../../../backend/app/services.py#L1216)

```python
async def _load_reactivation_token(self, raw_token: str, *, for_update: bool=False) -> AccountReactivationToken | None
```

В теле вызывает `hash_reactivation_token`, `query.with_for_update`, `select`, `select(AccountReactivationToken).where`, `self.db.scalar`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `raw_token` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `for_update` | `bool` | `False` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `AccountReactivationToken \| None`.

Прямые операции с БД: `self.db.scalar`.

<details>
<summary>Прямые вызовы в теле</summary>

- `hash_reactivation_token`
- `query.with_for_update`
- `select`
- `select(AccountReactivationToken).where`
- `self.db.scalar`

</details>

## UserService.get_reactivation_info

[backend/app/services.py:1220](../../../../backend/app/services.py#L1220)

```python
async def get_reactivation_info(self, raw_token: str) -> dict
```

Публичная проверка ссылки-возврата до показа кнопки входа.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `raw_token` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `dict`.

Прямые операции с БД: `self.db.scalar`.

<details>
<summary>Прямые вызовы в теле</summary>

- `select`
- `select(User).where`
- `self._load_reactivation_token`
- `self.db.scalar`

</details>

## UserService.complete_reactivation

[backend/app/services.py:1235](../../../../backend/app/services.py#L1235)

```python
async def complete_reactivation(self, raw_token: str, ip_address: str | None=None) -> User
```

Разблокирует аккаунт по одноразовой ссылке и возвращает пользователя
(сессию выдаёт auth-роутер поверх этого).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `raw_token` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `ip_address` | `str \| None` | `None` | IP-адрес; в AuditService — адрес клиента. |

Возвращает: `User`.

Прямые операции с БД: `self.db.flush`, `self.db.refresh`, `self.db.scalar`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
UnauthorizedError('Ссылка недействительна или истекла')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `UnauthorizedError`
- `datetime.now`
- `select`
- `select(User).where`
- `self._load_reactivation_token`
- `self.audit.log`
- `self.db.flush`
- `self.db.refresh`
- `self.db.scalar`

</details>

## UserService.update_user

[backend/app/services.py:1257](../../../../backend/app/services.py#L1257)

```python
async def update_user(self, user_id: int, payload: dict, actor_id: int, ip_address: str | None=None) -> User
```

Обновляет данные пользователя.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `user_id` | `int` | `обязательный` | ID пользователя. |
| `payload` | `dict` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |
| `ip_address` | `str \| None` | `None` | IP-адрес; в AuditService — адрес клиента. |

Возвращает: `User`.

Прямые операции с БД: `self.db.flush`, `self.db.refresh`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValidationError("An admin can't change a user's email — the user must change it themselves")
ValidationError("The username can't be changed — it's tied to the user")
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ValidationError`
- `payload.items`
- `payload.pop`
- `self._ensure_unique_identity`
- `self.audit.log`
- `self.db.flush`
- `self.db.refresh`
- `self.get_user`
- `setattr`

</details>

## UserService.update_own_profile

[backend/app/services.py:1277](../../../../backend/app/services.py#L1277)

```python
async def update_own_profile(self, user_id: int, payload: dict, ip_address: str | None=None) -> User
```

В теле вызывает `payload.get`, `payload.items`, `self._ensure_unique_identity`, `self.audit.log`, `self.db.flush`, `self.db.refresh`, `self.get_user`, `setattr`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `user_id` | `int` | `обязательный` | ID пользователя. |
| `payload` | `dict` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `ip_address` | `str \| None` | `None` | IP-адрес; в AuditService — адрес клиента. |

Возвращает: `User`.

Прямые операции с БД: `self.db.flush`, `self.db.refresh`.

<details>
<summary>Прямые вызовы в теле</summary>

- `payload.get`
- `payload.items`
- `self._ensure_unique_identity`
- `self.audit.log`
- `self.db.flush`
- `self.db.refresh`
- `self.get_user`
- `setattr`

</details>

## UserService.delete_user

[backend/app/services.py:1290](../../../../backend/app/services.py#L1290)

```python
async def delete_user(self, user_id: int, actor_id: int, ip_address: str | None=None) -> None
```

«Удаляет» пользователя — на деле деактивирует (мягкое удаление).

Строку не стираем: за пользователем тянутся его проекты, находки, заметки и
т.п. с FK RESTRICT — реальный DELETE упирался бы в них и падал 500. Вместо
этого выставляем is_locked, чтобы вход был закрыт (см. get_current_user и
login), и отзываем активные refresh-токены, чтобы блокировка сработала сразу.
Всё авторство и связи при этом сохраняются.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `user_id` | `int` | `обязательный` | ID пользователя. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |
| `ip_address` | `str \| None` | `None` | IP-адрес; в AuditService — адрес клиента. |

Возвращает: `None`.

Прямые операции с БД: `self.db.execute`, `self.db.flush`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValidationError("You can't block yourself")
```

<details>
<summary>Прямые вызовы в теле</summary>

- `RefreshToken.revoked_at.is_`
- `ValidationError`
- `and_`
- `datetime.now`
- `self.audit.log`
- `self.db.execute`
- `self.db.flush`
- `self.get_user`
- `update`
- `update(RefreshToken).where`
- `update(RefreshToken).where(and_(RefreshToken.user_id == user.id, RefreshToken.revoked_at.is_(None))).values`

</details>

## UserService.reset_password

[backend/app/services.py:1311](../../../../backend/app/services.py#L1311)

```python
async def reset_password(self, user_id: int, actor_id: int, ip_address: str | None=None) -> User
```

Сбрасывает пароль пользователя, выставляет временный пароль и отправляет его по почте.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `user_id` | `int` | `обязательный` | ID пользователя. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |
| `ip_address` | `str \| None` | `None` | IP-адрес; в AuditService — адрес клиента. |

Возвращает: `User`.

Прямые операции с БД: `self.db.execute`, `self.db.flush`.

<details>
<summary>Прямые вызовы в теле</summary>

- `RefreshToken.revoked_at.is_`
- `and_`
- `datetime.now`
- `hash_password`
- `self._enqueue_temporary_password_mail`
- `self._ensure_mail_delivery_enabled`
- `self._generate_temporary_password`
- `self._publish_mail_job`
- `self.audit.log`
- `self.db.execute`
- `self.db.flush`
- `self.get_user`
- `update`
- `update(RefreshToken).where`
- `update(RefreshToken).where(and_(RefreshToken.user_id == user.id, RefreshToken.revoked_at.is_(None))).values`

</details>

## UserService.change_own_password

[backend/app/services.py:1336](../../../../backend/app/services.py#L1336)

```python
async def change_own_password(self, user_id: int, *, current_password: str, new_password: str, ip_address: str | None=None) -> User
```

В теле вызывает `RefreshToken.revoked_at.is_`, `UnauthorizedError`, `and_`, `datetime.now`, `hash_password`, `self.audit.log`, `self.db.execute`, `self.db.flush`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `user_id` | `int` | `обязательный` | ID пользователя. |
| `current_password` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `new_password` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `ip_address` | `str \| None` | `None` | IP-адрес; в AuditService — адрес клиента. |

Возвращает: `User`.

Прямые операции с БД: `self.db.execute`, `self.db.flush`, `self.db.refresh`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
UnauthorizedError('Текущий пароль указан неверно')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `RefreshToken.revoked_at.is_`
- `UnauthorizedError`
- `and_`
- `datetime.now`
- `hash_password`
- `self.audit.log`
- `self.db.execute`
- `self.db.flush`
- `self.db.refresh`
- `self.get_user`
- `update`
- `update(RefreshToken).where`
- `update(RefreshToken).where(and_(RefreshToken.user_id == user.id, RefreshToken.revoked_at.is_(None))).values`
- `verify_password`

</details>

## UserService.setup_2fa

[backend/app/services.py:1359](../../../../backend/app/services.py#L1359)

```python
async def setup_2fa(self, user_id: int, ip_address: str | None=None) -> tuple[str, str, str]
```

Готовит привязку TOTP: генерирует секрет (хранит зашифрованным, но пока не
включает) и возвращает (secret, otpauth_uri, qr_png_data_url).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `user_id` | `int` | `обязательный` | ID пользователя. |
| `ip_address` | `str \| None` | `None` | IP-адрес; в AuditService — адрес клиента. |

Возвращает: `tuple[str, str, str]`.

Прямые операции с БД: `self.db.commit`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValidationError('Двухфакторная аутентификация уже включена')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ValidationError`
- `encrypt_secret`
- `generate_totp_secret`
- `self.db.commit`
- `self.get_user`
- `totp_provisioning_uri`
- `totp_qr_png_data_url`

</details>

## UserService.confirm_2fa

[backend/app/services.py:1372](../../../../backend/app/services.py#L1372)

```python
async def confirm_2fa(self, user_id: int, code: str, ip_address: str | None=None) -> User
```

Включает 2FA после проверки первого кода из приложения-аутентификатора.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `user_id` | `int` | `обязательный` | ID пользователя. |
| `code` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `ip_address` | `str \| None` | `None` | IP-адрес; в AuditService — адрес клиента. |

Возвращает: `User`.

Прямые операции с БД: `self.db.flush`, `self.db.refresh`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ServiceUnavailableError('Не удалось прочитать данные 2FA. Повторите настройку или обратитесь к администратору.', 'secret_decryption_failed')
ValidationError('Двухфакторная аутентификация уже включена')
ValidationError('Неверный код из приложения-аутентификатора')
ValidationError('Сначала запросите настройку 2FA')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ServiceUnavailableError`
- `ValidationError`
- `datetime.now`
- `decrypt_secret`
- `self.audit.log`
- `self.db.flush`
- `self.db.refresh`
- `self.get_user`
- `verify_totp`

</details>

## UserService.disable_2fa

[backend/app/services.py:1392](../../../../backend/app/services.py#L1392)

```python
async def disable_2fa(self, user_id: int, password: str, ip_address: str | None=None) -> User
```

Отключает 2FA (требует пароль аккаунта). Активные сессии не сбрасываем —
отключение второго фактора не должно разлогинивать пользователя.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `user_id` | `int` | `обязательный` | ID пользователя. |
| `password` | `str` | `обязательный` | Пароль, передаваемый в операцию. |
| `ip_address` | `str \| None` | `None` | IP-адрес; в AuditService — адрес клиента. |

Возвращает: `User`.

Прямые операции с БД: `self.db.flush`, `self.db.refresh`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
UnauthorizedError('Пароль указан неверно')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `UnauthorizedError`
- `self.audit.log`
- `self.db.flush`
- `self.db.refresh`
- `self.get_user`
- `verify_password`

</details>

## UserService.admin_reset_2fa

[backend/app/services.py:1406](../../../../backend/app/services.py#L1406)

```python
async def admin_reset_2fa(self, user_id: int, actor_id: int, ip_address: str | None=None) -> User
```

Сбрасывает 2FA пользователю от имени администратора (потеря телефона).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `user_id` | `int` | `обязательный` | ID пользователя. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |
| `ip_address` | `str \| None` | `None` | IP-адрес; в AuditService — адрес клиента. |

Возвращает: `User`.

Прямые операции с БД: `self.db.execute`, `self.db.flush`, `self.db.refresh`.

<details>
<summary>Прямые вызовы в теле</summary>

- `RefreshToken.revoked_at.is_`
- `and_`
- `datetime.now`
- `self.audit.log`
- `self.db.execute`
- `self.db.flush`
- `self.db.refresh`
- `self.get_user`
- `update`
- `update(RefreshToken).where`
- `update(RefreshToken).where(and_(RefreshToken.user_id == user.id, RefreshToken.revoked_at.is_(None))).values`

</details>

## UserService._lock_avatar_owner

[backend/app/services.py:1422](../../../../backend/app/services.py#L1422)

```python
async def _lock_avatar_owner(self, user_id: int) -> User
```

Загружает актуальный ключ под блокировкой строки для смены или удаления фото.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `user_id` | `int` | `обязательный` | ID пользователя. |

Возвращает: `User`.

Прямые операции с БД: `self.db.get`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
NotFoundError('User not found')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `NotFoundError`
- `self.db.get`

</details>

## UserService.upload_avatar

[backend/app/services.py:1429](../../../../backend/app/services.py#L1429)

```python
async def upload_avatar(self, user_id: int, upload: UploadFile, ip_address: str | None=None) -> User
```

Проверяет реальное изображение; прежний аватар удаляет после сохранения нового.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `user_id` | `int` | `обязательный` | ID пользователя. |
| `upload` | `UploadFile` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `ip_address` | `str \| None` | `None` | IP-адрес; в AuditService — адрес клиента. |

Возвращает: `User`.

Прямые операции с БД: `self.db.commit`, `self.db.flush`, `self.db.refresh`, `self.db.rollback`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ServiceUnavailableError('Не удалось загрузить аватар: хранилище временно недоступно.', 'storage_unavailable')
ValidationError('Аватар должен быть корректным изображением PNG, JPEG, WEBP или GIF, не более 16 мегапикселей')
ValueError('Unsupported avatar')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `BytesIO`
- `PillowImage.MIME.get`
- `PillowImage.open`
- `ServiceUnavailableError`
- `ValidationError`
- `ValueError`
- `_sanitize_filename`
- `asyncio.to_thread`
- `datetime.now`
- `getattr`
- `image.verify`
- `logging.getLogger`
- `logging.getLogger('storm.storage').warning`
- `read_upload`
- `self._lock_avatar_owner`
- `self.audit.log`
- `self.db.commit`
- `self.db.flush`
- `self.db.refresh`
- `self.db.rollback`
- `type`

</details>

## UserService.delete_avatar

[backend/app/services.py:1472](../../../../backend/app/services.py#L1472)

```python
async def delete_avatar(self, user_id: int, ip_address: str | None=None) -> User
```

Удаляет сохранённое фото владельца. Повторный вызов возвращает тот же профиль.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `user_id` | `int` | `обязательный` | ID пользователя. |
| `ip_address` | `str \| None` | `None` | IP-адрес; в AuditService — адрес клиента. |

Возвращает: `User`.

Прямые операции с БД: `self.db.commit`, `self.db.refresh`, `self.db.rollback`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ServiceUnavailableError('Не удалось удалить аватар. Попробуйте позже.', 'storage_unavailable')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ServiceUnavailableError`
- `asyncio.to_thread`
- `logging.getLogger`
- `logging.getLogger('storm.storage').warning`
- `self._lock_avatar_owner`
- `self.audit.log`
- `self.db.commit`
- `self.db.refresh`
- `self.db.rollback`
- `type`

</details>

## UserService.download_avatar

[backend/app/services.py:1494](../../../../backend/app/services.py#L1494)

```python
async def download_avatar(self, user_id: int) -> tuple[User, bytes]
```

В теле вызывает `NotFoundError`, `ServiceUnavailableError`, `asyncio.to_thread`, `self.get_user`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `user_id` | `int` | `обязательный` | ID пользователя. |

Возвращает: `tuple[User, bytes]`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
NotFoundError('Аватар не найден')
ServiceUnavailableError('Хранилище аватаров временно недоступно.', 'storage_unavailable')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `NotFoundError`
- `ServiceUnavailableError`
- `asyncio.to_thread`
- `self.get_user`

</details>

## ProjectService.__init__

[backend/app/services.py:1512](../../../../backend/app/services.py#L1512)

```python
def __init__(self, db: AsyncSession) -> None
```

Создаёт экземпляр и сохраняет его зависимости; параметры перечислены ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `db` | `AsyncSession` | `обязательный` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `AuditService`

</details>

## ProjectService._validate_project_dates

[backend/app/services.py:1517](../../../../backend/app/services.py#L1517)

```python
def _validate_project_dates(start_date: date | None, end_date: date | None) -> None
```

В теле вызывает `ValidationError`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `start_date` | `date \| None` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `end_date` | `date \| None` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValidationError('Дата окончания проекта не может быть раньше даты начала')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ValidationError`

</details>

## ProjectService._normalize_project_folder

[backend/app/services.py:1522](../../../../backend/app/services.py#L1522)

```python
def _normalize_project_folder(folder: str | None) -> str
```

В теле вызывает `(folder or '').strip`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `folder` | `str \| None` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(folder or '').strip`

</details>

## ProjectService._normalize_folder_segment

[backend/app/services.py:1527](../../../../backend/app/services.py#L1527)

```python
def _normalize_folder_segment(name: str) -> str
```

В теле вызывает `ValidationError`, `name.strip`, `name.strip().strip`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `name` | `str` | `обязательный` | Имя/название обрабатываемого объекта. |

Возвращает: `str`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValidationError("Название папки не должно содержать '/'")
ValidationError('Название папки не может быть пустым')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ValidationError`
- `name.strip`
- `name.strip().strip`

</details>

## ProjectService.list_projects

[backend/app/services.py:1535](../../../../backend/app/services.py#L1535)

```python
async def list_projects(self, current_user: User, page: int, size: int, status: str | None=None) -> tuple[list[Project], int]
```

Возвращает список проектов с учётом доступа.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `current_user` | `User` | `обязательный` | Пользователь из dependency авторизации. |
| `page` | `int` | `обязательный` | Номер страницы, начиная с 1. |
| `size` | `int` | `обязательный` | Число элементов страницы; верхняя граница задаётся маршрутом. |
| `status` | `str \| None` | `None` | Статус операции/ресурса; допустимые значения задаёт Enum или схема. |

Возвращает: `tuple[list[Project], int]`.

Прямые операции с БД: `self.db.scalar`, `self.db.scalars`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(await self.db.scalars(query.order_by(Project.created_at.desc()).offset((page - 1) * size).limit(size))).all`
- `Project.created_at.desc`
- `func.count`
- `list`
- `query.join`
- `query.join(ProjectMember, ProjectMember.project_id == Project.id).where`
- `query.order_by`
- `query.order_by(Project.created_at.desc()).offset`
- `query.order_by(Project.created_at.desc()).offset((page - 1) * size).limit`
- `query.subquery`
- `query.where`
- `select`
- `select(func.count()).select_from`
- `self.db.scalar`
- `self.db.scalars`

</details>

## ProjectService.get_project

[backend/app/services.py:1547](../../../../backend/app/services.py#L1547)

```python
async def get_project(self, project_id: int) -> Project
```

Читает проект через общую проверку существования; авторизацию выполняет API.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |

Возвращает: `Project`.

<details>
<summary>Прямые вызовы в теле</summary>

- `get_project`

</details>

## ProjectService._ensure_ticket_available

[backend/app/services.py:1551](../../../../backend/app/services.py#L1551)

```python
async def _ensure_ticket_available(self, key: str | None, project_id: int | None=None) -> None
```

Запрещает повторную привязку APPSEC, в том числе при параллельном создании.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `key` | `str \| None` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `project_id` | `int \| None` | `None` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |

Возвращает: `None`.

Прямые операции с БД: `self.db.execute`, `self.db.scalar`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ConflictError('По этому APPSEC-тикету уже создан проект')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ConflictError`
- `func.hashtextextended`
- `func.pg_advisory_xact_lock`
- `query.limit`
- `query.where`
- `select`
- `select(Project.id).where`
- `self.db.execute`
- `self.db.scalar`

</details>

## ProjectService.create_project

[backend/app/services.py:1562](../../../../backend/app/services.py#L1562)

```python
async def create_project(self, payload: dict, actor_id: int, ip_address: str | None=None) -> Project
```

Создаёт проект и членство его автора одной транзакцией с аудитом.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `payload` | `dict` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |
| `ip_address` | `str \| None` | `None` | IP-адрес; в AuditService — адрес клиента. |

Возвращает: `Project`.

Прямые операции с БД: `self.db.add`, `self.db.flush`, `self.db.refresh`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValidationError('Поле description проекта удалено')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `Project`
- `ProjectMember`
- `ValidationError`
- `normalize_project_components`
- `normalize_project_ticket`
- `normalize_project_versions`
- `payload.get`
- `self._ensure_ticket_available`
- `self._normalize_project_folder`
- `self._validate_project_dates`
- `self.audit.log`
- `self.db.add`
- `self.db.flush`
- `self.db.refresh`
- `str`
- `ws_manager.broadcast_projects_index`

</details>

## ProjectService.update_project

[backend/app/services.py:1584](../../../../backend/app/services.py#L1584)

```python
async def update_project(self, project_id: int, payload: dict, actor_id: int, ip_address: str | None=None) -> Project
```

Обновляет проект.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `payload` | `dict` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |
| `ip_address` | `str \| None` | `None` | IP-адрес; в AuditService — адрес клиента. |

Возвращает: `Project`.

Прямые операции с БД: `self.db.commit`, `self.db.flush`, `self.db.refresh`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValidationError('Поле description проекта удалено')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ValidationError`
- `datetime.now`
- `key.startswith`
- `normalize_project_components`
- `normalize_project_ticket`
- `normalize_project_versions`
- `payload.get`
- `payload.items`
- `self._ensure_ticket_available`
- `self._normalize_project_folder`
- `self._notify_project_status_changed`
- `self._validate_project_dates`
- `self.audit.log`
- `self.db.commit`
- `self.db.flush`
- `self.db.refresh`
- `self.get_project`
- `setattr`
- `str`
- `ws_manager.broadcast`
- `ws_manager.broadcast_projects_index`

</details>

## ProjectService._notify_project_status_changed

[backend/app/services.py:1638](../../../../backend/app/services.py#L1638)

```python
async def _notify_project_status_changed(self, project: Project, actor_id: int | None) -> None
```

Повод №4: статус проекта изменился — сообщаем его участникам.

Кроме того, кто менял: он и так знает.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project` | `Project` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `actor_id` | `int \| None` | `обязательный` | ID инициатора для аудита и уведомлений. |

Возвращает: `None`.

Прямые операции с БД: `self.db.add`, `self.db.commit`, `self.db.scalars`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(await self.db.scalars(select(ProjectMember.user_id).where(ProjectMember.project_id == project.id))).all`
- `Notification`
- `getattr`
- `list`
- `select`
- `select(ProjectMember.user_id).where`
- `self.db.add`
- `self.db.commit`
- `self.db.scalars`
- `str`
- `ws_manager.notify_user`

</details>

## ProjectService.delete_project

[backend/app/services.py:1677](../../../../backend/app/services.py#L1677)

```python
async def delete_project(self, project_id: int, actor_id: int, ip_address: str | None=None) -> None
```

Удаляет проект и связанные сущности.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |
| `ip_address` | `str \| None` | `None` | IP-адрес; в AuditService — адрес клиента. |

Возвращает: `None`.

Прямые операции с БД: `self.db.delete`, `self.db.flush`.

<details>
<summary>Прямые вызовы в теле</summary>

- `self.audit.log`
- `self.db.delete`
- `self.db.flush`
- `self.get_project`
- `str`
- `ws_manager.broadcast`
- `ws_manager.broadcast_projects_index`

</details>

## ProjectService.list_project_stats

[backend/app/services.py:1688](../../../../backend/app/services.py#L1688)

```python
async def list_project_stats(self, current_user: User) -> list[dict]
```

Счётчики по каждому доступному проекту одним запросом.

Возвращает hosts_count / open_findings / total_findings + статус, чтобы
UI мог агрегировать по вкладке (активные/архивные) без N+1 запросов.
Видимость та же, что и у списка проектов: не-админ видит только свои.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `current_user` | `User` | `обязательный` | Пользователь из dependency авторизации. |

Возвращает: `list[dict]`.

Прямые операции с БД: `self.db.execute`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(await self.db.execute(stmt)).all`
- `Host.project_id.label`
- `Vulnerability.project_id.label`
- `Vulnerability.status.in_`
- `func.coalesce`
- `func.count`
- `func.count().filter`
- `func.count().filter(Vulnerability.status.in_(_OPEN_VULN_STATUSES)).label`
- `func.count().label`
- `getattr`
- `select`
- `select(Host.project_id.label('project_id'), func.count().label('hosts_count')).where`
- `select(Host.project_id.label('project_id'), func.count().label('hosts_count')).where(Host.origin != 'ip').group_by`
- `select(Host.project_id.label('project_id'), func.count().label('hosts_count')).where(Host.origin != 'ip').group_by(Host.project_id).subquery`
- `select(Project.id, Project.status, func.coalesce(hosts_sq.c.hosts_count, 0), func.coalesce(vulns_sq.c.total_findings, 0), func.coalesce(vulns_sq.c.open_findings, 0)).outerjoin`
- `select(Project.id, Project.status, func.coalesce(hosts_sq.c.hosts_count, 0), func.coalesce(vulns_sq.c.total_findings, 0), func.coalesce(vulns_sq.c.open_findings, 0)).outerjoin(hosts_sq, hosts_sq.c.project_id == Project.id).outerjoin`
- `select(Vulnerability.project_id.label('project_id'), func.count().label('total_findings'), func.count().filter(Vulnerability.status.in_(_OPEN_VULN_STATUSES)).label('open_findings')).group_by`
- `select(Vulnerability.project_id.label('project_id'), func.count().label('total_findings'), func.count().filter(Vulnerability.status.in_(_OPEN_VULN_STATUSES)).label('open_findings')).group_by(Vulnerability.project_id).subquery`
- `self.db.execute`
- `stmt.join`
- `stmt.join(ProjectMember, ProjectMember.project_id == Project.id).where`

</details>

## ProjectService.list_members

[backend/app/services.py:1739](../../../../backend/app/services.py#L1739)

```python
async def list_members(self, project_id: int) -> list[dict]
```

Возвращает список участников проекта.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |

Возвращает: `list[dict]`.

Прямые операции с БД: `self.db.execute`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(await self.db.execute(select(ProjectMember, User).join(User, User.id == ProjectMember.user_id).where(ProjectMember.project_id == project_id).order_by(ProjectMember.added_at.desc()))).all`
- `ProjectMember.added_at.desc`
- `select`
- `select(ProjectMember, User).join`
- `select(ProjectMember, User).join(User, User.id == ProjectMember.user_id).where`
- `select(ProjectMember, User).join(User, User.id == ProjectMember.user_id).where(ProjectMember.project_id == project_id).order_by`
- `self.db.execute`

</details>

## ProjectService._is_project_manager

[backend/app/services.py:1762](../../../../backend/app/services.py#L1762)

```python
async def _is_project_manager(self, project: Project, actor: User) -> bool
```

Админ, создатель проекта или лид-участник.

Роль лида глобальная (User.project_role), но возможности она открывает
только внутри проектов, где пользователь действительно состоит.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project` | `Project` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `actor` | `User` | `обязательный` | Авторизованный инициатор операции. |

Возвращает: `bool`.

Прямые операции с БД: `self.db.scalar`.

<details>
<summary>Прямые вызовы в теле</summary>

- `and_`
- `select`
- `select(ProjectMember).where`
- `self.db.scalar`

</details>

## ProjectService.ensure_can_manage_members

[backend/app/services.py:1779](../../../../backend/app/services.py#L1779)

```python
async def ensure_can_manage_members(self, project_id: int, actor: User) -> Project
```

Составом команды управляют: админ, создатель проекта или лид-участник.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `actor` | `User` | `обязательный` | Авторизованный инициатор операции. |

Возвращает: `Project`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ForbiddenError('Управлять участниками может админ, лид проекта или его создатель')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ForbiddenError`
- `self._is_project_manager`
- `self.get_project`

</details>

## ProjectService.ensure_can_edit_project

[backend/app/services.py:1786](../../../../backend/app/services.py#L1786)

```python
async def ensure_can_edit_project(self, project_id: int, actor: User) -> Project
```

Карточку проекта редактируют админ, создатель и любой участник проекта.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `actor` | `User` | `обязательный` | Авторизованный инициатор операции. |

Возвращает: `Project`.

Прямые операции с БД: `self.db.scalar`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ForbiddenError('Изменять проект может только его участник')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ForbiddenError`
- `select`
- `select(ProjectMember.id).where`
- `self.db.scalar`
- `self.get_project`

</details>

## ProjectService.add_member

[backend/app/services.py:1797](../../../../backend/app/services.py#L1797)

```python
async def add_member(self, project_id: int, user_id: int, actor_id: int, ip_address: str | None=None) -> dict
```

Добавляет пользователя в участники проекта.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `user_id` | `int` | `обязательный` | ID пользователя. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |
| `ip_address` | `str \| None` | `None` | IP-адрес; в AuditService — адрес клиента. |

Возвращает: `dict`.

Прямые операции с БД: `self.db.add`, `self.db.flush`, `self.db.refresh`, `self.db.scalar`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ConflictError('Пользователь уже участник проекта')
NotFoundError('User not found')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ConflictError`
- `NotFoundError`
- `Notification`
- `ProjectMember`
- `and_`
- `select`
- `select(ProjectMember).where`
- `select(User).where`
- `self.audit.log`
- `self.db.add`
- `self.db.flush`
- `self.db.refresh`
- `self.db.scalar`
- `self.get_project`
- `str`
- `ws_manager.notify_user`

</details>

## ProjectService.remove_member

[backend/app/services.py:1848](../../../../backend/app/services.py#L1848)

```python
async def remove_member(self, project_id: int, user_id: int, actor_id: int, ip_address: str | None=None) -> None
```

Удаляет пользователя из участников проекта.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `user_id` | `int` | `обязательный` | ID пользователя. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |
| `ip_address` | `str \| None` | `None` | IP-адрес; в AuditService — адрес клиента. |

Возвращает: `None`.

Прямые операции с БД: `self.db.delete`, `self.db.flush`, `self.db.scalar`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
NotFoundError('Участник не найден')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `NotFoundError`
- `and_`
- `select`
- `select(ProjectMember).where`
- `select(User.username).where`
- `self.audit.log`
- `self.db.delete`
- `self.db.flush`
- `self.db.scalar`
- `str`

</details>

## ProjectService.list_project_activity

[backend/app/services.py:1870](../../../../backend/app/services.py#L1870)

```python
async def list_project_activity(self, project_id: int, limit: int=50) -> list[dict]
```

Активность проекта: события по всем его сущностям.

Доступна любому участнику проекта (в отличие от глобального журнала
`/audit-logs`, который остаётся админским). Скоуп собирается по
entity_id каждой сущности проекта + fallback на details.project_id.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `limit` | `int` | `50` | Максимальное число возвращаемых записей. |

Возвращает: `list[dict]`.

Прямые операции с БД: `self.db.execute`, `self.db.scalars`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(await self.db.execute(stmt)).all`
- `(await self.db.scalars(select(Vulnerability).where(Vulnerability.id.in_(vuln_ids)))).all`
- `AuditLog.created_at.desc`
- `AuditLog.details['project_id'].as_string`
- `AuditLog.entity_id.in_`
- `AuditLog.entity_type.is_not`
- `Endpoint.host_id.in_`
- `Port.host_id.in_`
- `Service.port_id.in_`
- `Vulnerability.id.in_`
- `and_`
- `entry.created_at.isoformat`
- `getattr`
- `or_`
- `out.append`
- `select`
- `select(AuditLog, User.username).outerjoin`
- `select(AuditLog, User.username).outerjoin(User, User.id == AuditLog.user_id).where`
- `select(AuditLog, User.username).outerjoin(User, User.id == AuditLog.user_id).where(AuditLog.entity_type.is_not(None)).where`
- `select(AuditLog, User.username).outerjoin(User, User.id == AuditLog.user_id).where(AuditLog.entity_type.is_not(None)).where(scope).order_by`
- `select(AuditLog, User.username).outerjoin(User, User.id == AuditLog.user_id).where(AuditLog.entity_type.is_not(None)).where(scope).order_by(AuditLog.created_at.desc()).limit`
- `select(Endpoint.id).where`
- `select(Host.id).where`
- `select(Port.id).where`
- `select(ProjectMember.id).where`
- `select(ProjectNote.id).where`
- `select(Service.id).where`
- `select(Vulnerability).where`
- `select(Vulnerability.id).where`
- `self.db.execute`
- `self.db.scalars`
- `self.get_project`
- `str`
- `vulns_by_id.get`

</details>

## ProjectService.list_folders

[backend/app/services.py:1935](../../../../backend/app/services.py#L1935)

```python
async def list_folders(self) -> list[ProjectFolder]
```

Возвращает список папок проектов.

Возвращает: `list[ProjectFolder]`.

Прямые операции с БД: `self.db.scalars`.

<details>
<summary>Прямые вызовы в теле</summary>

- `ProjectFolder.path.asc`
- `list`
- `rows.all`
- `select`
- `select(ProjectFolder).order_by`
- `self.db.scalars`

</details>

## ProjectService.create_folder

[backend/app/services.py:1940](../../../../backend/app/services.py#L1940)

```python
async def create_folder(self, name: str, parent_id: int | None, actor_id: int, ip_address: str | None=None) -> ProjectFolder
```

Создаёт новую папку проекта (в т.ч. вложенную).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `name` | `str` | `обязательный` | Имя/название обрабатываемого объекта. |
| `parent_id` | `int \| None` | `обязательный` | ID родителя; None обозначает корень, если допускается контрактом. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |
| `ip_address` | `str \| None` | `None` | IP-адрес; в AuditService — адрес клиента. |

Возвращает: `ProjectFolder`.

Прямые операции с БД: `self.db.add`, `self.db.flush`, `self.db.refresh`, `self.db.scalar`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ConflictError('Папка с таким путём уже существует')
NotFoundError('Родительская папка не найдена')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ConflictError`
- `NotFoundError`
- `ProjectFolder`
- `select`
- `select(ProjectFolder).where`
- `self._normalize_folder_segment`
- `self.audit.log`
- `self.db.add`
- `self.db.flush`
- `self.db.refresh`
- `self.db.scalar`
- `str`
- `ws_manager.broadcast_projects_index`

</details>

## ProjectService.move_folder

[backend/app/services.py:1962](../../../../backend/app/services.py#L1962)

```python
async def move_folder(self, folder_id: int, new_parent_id: int | None, actor_id: int, ip_address: str | None=None) -> ProjectFolder
```

Перемещает папку и пересчитывает пути дочерних папок и проектов.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `folder_id` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `new_parent_id` | `int \| None` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |
| `ip_address` | `str \| None` | `None` | IP-адрес; в AuditService — адрес клиента. |

Возвращает: `ProjectFolder`.

Прямые операции с БД: `self.db.flush`, `self.db.refresh`, `self.db.scalar`, `self.db.scalars`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ConflictError('В целевой папке уже есть папка с таким именем')
NotFoundError('Папка не найдена')
NotFoundError('Родительская папка не найдена')
ValidationError('Нельзя переместить папку в её дочернюю папку')
ValidationError('Нельзя переместить папку в саму себя')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `(await self.db.scalars(select(Project).where(or_(Project.folder == old_path, Project.folder.like(f'{old_path}/%'))))).all`
- `(await self.db.scalars(select(ProjectFolder).where(or_(ProjectFolder.path == old_path, ProjectFolder.path.like(f'{old_path}/%'))))).all`
- `ConflictError`
- `NotFoundError`
- `Project.folder.like`
- `ProjectFolder.path.like`
- `ValidationError`
- `and_`
- `len`
- `new_parent.path.startswith`
- `or_`
- `select`
- `select(Project).where`
- `select(ProjectFolder).where`
- `self.audit.log`
- `self.db.flush`
- `self.db.refresh`
- `self.db.scalar`
- `self.db.scalars`
- `str`
- `ws_manager.broadcast_projects_index`

</details>

## ProjectService.delete_folder

[backend/app/services.py:2035](../../../../backend/app/services.py#L2035)

```python
async def delete_folder(self, folder_id: int, actor_id: int, ip_address: str | None=None) -> dict
```

Каскадно удаляет папку, все её подпапки и все проекты внутри.

Возвращает счётчики удалённых сущностей для аудита.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `folder_id` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |
| `ip_address` | `str \| None` | `None` | IP-адрес; в AuditService — адрес клиента. |

Возвращает: `dict`.

Прямые операции с БД: `self.db.execute`, `self.db.flush`, `self.db.scalar`, `self.db.scalars`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
NotFoundError('Папка не найдена')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `(await self.db.scalars(select(Project.id).where(or_(Project.folder == path, Project.folder.like(f'{path}/%'))))).all`
- `(await self.db.scalars(select(ProjectFolder.id).where(or_(ProjectFolder.path == path, ProjectFolder.path.like(f'{path}/%'))))).all`
- `NotFoundError`
- `Project.folder.like`
- `Project.id.in_`
- `ProjectFolder.id.in_`
- `ProjectFolder.path.like`
- `delete`
- `delete(Project).where`
- `delete(ProjectFolder).where`
- `len`
- `list`
- `or_`
- `select`
- `select(Project.id).where`
- `select(ProjectFolder).where`
- `select(ProjectFolder.id).where`
- `self.audit.log`
- `self.db.execute`
- `self.db.flush`
- `self.db.scalar`
- `self.db.scalars`
- `str`
- `ws_manager.broadcast_projects_index`

</details>

## AssetService.__init__

[backend/app/services.py:2091](../../../../backend/app/services.py#L2091)

```python
def __init__(self, db: AsyncSession) -> None
```

Создаёт экземпляр и сохраняет его зависимости; параметры перечислены ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `db` | `AsyncSession` | `обязательный` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `AuditService`

</details>

## AssetService._normalize_endpoint_query_params

[backend/app/services.py:2096](../../../../backend/app/services.py#L2096)

```python
def _normalize_endpoint_query_params(raw_params: list[dict] | None) -> list[dict]
```

В теле вызывает `bool`, `isinstance`, `item.get`, `normalized.append`, `str`, `str(description).strip`, `str(item.get('name') or '').strip`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `raw_params` | `list[dict] \| None` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `list[dict]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `bool`
- `isinstance`
- `item.get`
- `normalized.append`
- `str`
- `str(description).strip`
- `str(item.get('name') or '').strip`

</details>

## AssetService._normalize_endpoint_path

[backend/app/services.py:2141](../../../../backend/app/services.py#L2141)

```python
def _normalize_endpoint_path(path_value: str | None) -> str | None
```

В теле вызывает `'/'.join`, `(path_only or '/').strip`, `AssetService._UUID_PATH_SEGMENT_RE.fullmatch`, `AssetService._parse_request_target_token`, `normalized.endswith`, `normalized.split`, `normalized.startswith`, `re.sub`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `path_value` | `str \| None` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `str \| None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `'/'.join`
- `(path_only or '/').strip`
- `AssetService._UUID_PATH_SEGMENT_RE.fullmatch`
- `AssetService._parse_request_target_token`
- `normalized.endswith`
- `normalized.split`
- `normalized.startswith`
- `re.sub`
- `str`

</details>

## AssetService._normalize_endpoint_headers

[backend/app/services.py:2157](../../../../backend/app/services.py#L2157)

```python
def _normalize_endpoint_headers(raw_headers: list[dict] | None) -> list[dict]
```

В теле вызывает `isinstance`, `item.get`, `normalized.append`, `str`, `str(item.get('name') or '').strip`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `raw_headers` | `list[dict] \| None` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `list[dict]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `isinstance`
- `item.get`
- `normalized.append`
- `str`
- `str(item.get('name') or '').strip`

</details>

## AssetService._sanitize_parsed_header_pairs

[backend/app/services.py:2170](../../../../backend/app/services.py#L2170)

```python
def _sanitize_parsed_header_pairs(pairs: list[tuple[str, str]]) -> list[dict]
```

Strip noisy/sensitive headers; Cookie/Authorization placeholders.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `pairs` | `list[tuple[str, str]]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `list[dict]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `name.strip`
- `name.strip().lower`
- `out.append`
- `value.strip`

</details>

## AssetService._sanitize_stored_header_items

[backend/app/services.py:2192](../../../../backend/app/services.py#L2192)

```python
def _sanitize_stored_header_items(raw: list[dict] | None) -> list[dict]
```

В теле вызывает `AssetService._sanitize_parsed_header_pairs`, `isinstance`, `item.get`, `pairs.append`, `str`, `str(item.get('name') or '').strip`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `raw` | `list[dict] \| None` | `обязательный` | Исходное значение до нормализации/разбора. |

Возвращает: `list[dict]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `AssetService._sanitize_parsed_header_pairs`
- `isinstance`
- `item.get`
- `pairs.append`
- `str`
- `str(item.get('name') or '').strip`

</details>

## AssetService._parse_request_target_token

[backend/app/services.py:2205](../../../../backend/app/services.py#L2205)

```python
def _parse_request_target_token(path_token: str) -> tuple[str, list[tuple[str, str]]]
```

В теле вызывает `list`, `parse_qsl`, `path_token.strip`, `token.startswith`, `urlparse`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `path_token` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `tuple[str, list[tuple[str, str]]]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `list`
- `parse_qsl`
- `path_token.strip`
- `token.startswith`
- `urlparse`

</details>

## AssetService._apply_structured_request_payload

[backend/app/services.py:2215](../../../../backend/app/services.py#L2215)

```python
def _apply_structured_request_payload(payload: dict) -> dict
```

В теле вызывает `AssetService._normalize_endpoint_headers`, `AssetService._normalize_endpoint_path`, `AssetService._normalize_endpoint_query_params`, `AssetService._sanitize_stored_header_items`, `payload.get`, `request_body.strip`, `str`, `str(payload.get('request_content_type', '')).strip`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `payload` | `dict` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |

Возвращает: `dict`.

<details>
<summary>Прямые вызовы в теле</summary>

- `AssetService._normalize_endpoint_headers`
- `AssetService._normalize_endpoint_path`
- `AssetService._normalize_endpoint_query_params`
- `AssetService._sanitize_stored_header_items`
- `payload.get`
- `request_body.strip`
- `str`
- `str(payload.get('request_content_type', '')).strip`

</details>

## AssetService._apply_raw_request_payload

[backend/app/services.py:2232](../../../../backend/app/services.py#L2232)

```python
def _apply_raw_request_payload(payload: dict) -> dict
```

В теле вызывает `AssetService._normalize_endpoint_path`, `AssetService._parse_request_target_token`, `AssetService._sanitize_parsed_header_pairs`, `ValidationError`, `body.strip`, `h_name.strip`, `header_block.split`, `header_lines[0].split`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `payload` | `dict` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |

Возвращает: `dict`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValidationError("request_raw должен содержать request line вида 'METHOD /path HTTP/1.1'")
ValidationError('request_raw должен содержать HTTP-версию в request line')
ValidationError('request_raw пустой')
ValidationError('request_raw содержит неподдерживаемый HTTP-метод')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `AssetService._normalize_endpoint_path`
- `AssetService._parse_request_target_token`
- `AssetService._sanitize_parsed_header_pairs`
- `ValidationError`
- `body.strip`
- `h_name.strip`
- `header_block.split`
- `header_lines[0].split`
- `header_lines[0].strip`
- `header_pairs.append`
- `http_part.startswith`
- `len`
- `line.partition`
- `line.strip`
- `name.lower`
- `payload.get`
- `payload.pop`
- `re.split`
- `request_line[0].upper`
- `request_line[2].upper`
- `str`
- `str(request_raw).replace`
- `value.strip`

</details>

## AssetService._ensure_host

[backend/app/services.py:2285](../../../../backend/app/services.py#L2285)

```python
async def _ensure_host(self, project_id: int, host_id: int) -> None
```

Проверяет существование хоста в указанном проекте одним SELECT id; не загружает его дочерние коллекции. Используется как защита вложенных CRUD-операций.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `host_id` | `int` | `обязательный` | ID родительского хоста. |

Возвращает: `None`.

Прямые операции с БД: `self.db.scalar`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
NotFoundError('Хост не найден')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `NotFoundError`
- `select`
- `select(Host.id).where`
- `self.db.scalar`

</details>

## AssetService._get_host

[backend/app/services.py:2290](../../../../backend/app/services.py#L2290)

```python
async def _get_host(self, project_id: int, host_id: int) -> Host
```

Загружает хост с IP → портами → сервисами и эндпоинтами для сериализации HostOut. Не использовать как простую проверку доступа: объём данных зависит от всего дерева хоста.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `host_id` | `int` | `обязательный` | ID родительского хоста. |

Возвращает: `Host`.

Прямые операции с БД: `self.db.scalar`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
NotFoundError('Хост не найден')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `NotFoundError`
- `and_`
- `select`
- `select(Host).options`
- `select(Host).options(selectinload(Host.ip_addresses).selectinload(HostIpAddress.ports).selectinload(Port.services), selectinload(Host.endpoints)).where`
- `selectinload`
- `selectinload(Host.ip_addresses).selectinload`
- `selectinload(Host.ip_addresses).selectinload(HostIpAddress.ports).selectinload`
- `self.db.scalar`

</details>

## AssetService._normalize_host_ip_entries

[backend/app/services.py:2304](../../../../backend/app/services.py#L2304)

```python
def _normalize_host_ip_entries(primary_ip: str | None, raw_entries: list[str | dict] | None) -> list[dict]
```

В теле вызывает `add_entry`, `bool`, `entries.insert`, `isinstance`, `primary_ip.strip`, `raw.get`, `set`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `primary_ip` | `str \| None` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `raw_entries` | `list[str \| dict] \| None` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `list[dict]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `add_entry`
- `bool`
- `entries.insert`
- `isinstance`
- `primary_ip.strip`
- `raw.get`
- `set`

</details>

## AssetService._normalize_host_ip_entries.add_entry

[backend/app/services.py:2311](../../../../backend/app/services.py#L2311)

```python
def add_entry(ip_address: str | None, label: str | None=None, is_primary: bool=False) -> None
```

В теле вызывает `(ip_address or '').strip`, `entries.append`, `seen.add`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `ip_address` | `str \| None` | `обязательный` | IP-адрес; в AuditService — адрес клиента. |
| `label` | `str \| None` | `None` | Текст подписи/сообщения проверки. |
| `is_primary` | `bool` | `False` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(ip_address or '').strip`
- `entries.append`
- `seen.add`

</details>

## AssetService._replace_host_ip_addresses

[backend/app/services.py:2346](../../../../backend/app/services.py#L2346)

```python
async def _replace_host_ip_addresses(self, host: Host, entries: list[dict]) -> None
```

В теле вызывает `HostIpAddress`, `bool`, `entry.get`, `existing.get`, `existing.items`, `list`, `next`, `result_rows.append`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `host` | `Host` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `entries` | `list[dict]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

Прямые операции с БД: `self.db.add`, `self.db.delete`.

<details>
<summary>Прямые вызовы в теле</summary>

- `HostIpAddress`
- `bool`
- `entry.get`
- `existing.get`
- `existing.items`
- `list`
- `next`
- `result_rows.append`
- `self.db.add`
- `self.db.delete`
- `set_committed_value`

</details>

## AssetService._get_port

[backend/app/services.py:2384](../../../../backend/app/services.py#L2384)

```python
async def _get_port(self, host_id: int, port_id: int) -> Port
```

В теле вызывает `NotFoundError`, `and_`, `select`, `select(Port).options`, `select(Port).options(selectinload(Port.services)).where`, `selectinload`, `self.db.scalar`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `host_id` | `int` | `обязательный` | ID родительского хоста. |
| `port_id` | `int` | `обязательный` | ID родительского порта. |

Возвращает: `Port`.

Прямые операции с БД: `self.db.scalar`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
NotFoundError('Порт не найден')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `NotFoundError`
- `and_`
- `select`
- `select(Port).options`
- `select(Port).options(selectinload(Port.services)).where`
- `selectinload`
- `self.db.scalar`

</details>

## AssetService.list_host_creation_times

[backend/app/services.py:2390](../../../../backend/app/services.py#L2390)

```python
async def list_host_creation_times(self, project_id: int) -> list[datetime]
```

Даты всех хостов проекта для графиков, включая служебные origin=ip.

Совпадает с created_at из list_hosts(origin=all) без загрузки ORM-деревьев.
Повторяющиеся даты сохраняются: каждая соответствует отдельному хосту.
Доступ к проекту проверяет dependency HTTP-маршрута.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |

Возвращает: `list[datetime]`.

Прямые операции с БД: `self.db.scalars`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(await self.db.scalars(select(Host.created_at).where(Host.project_id == project_id).order_by(Host.created_at.desc()))).all`
- `Host.created_at.desc`
- `list`
- `select`
- `select(Host.created_at).where`
- `select(Host.created_at).where(Host.project_id == project_id).order_by`
- `self.db.scalars`

</details>

## AssetService.list_hosts

[backend/app/services.py:2401](../../../../backend/app/services.py#L2401)

```python
async def list_hosts(self, project_id: int, page: int, size: int, status: str | None, origin: str='host') -> tuple[list[Host], int]
```

Возвращает страницу полных деревьев хостов и total. origin=host скрывает служебных родителей IP, origin=all включает их. Размер страницы ограничивает хосты, но не число вложенных эндпоинтов.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `page` | `int` | `обязательный` | Номер страницы, начиная с 1. |
| `size` | `int` | `обязательный` | Число элементов страницы; верхняя граница задаётся маршрутом. |
| `status` | `str \| None` | `обязательный` | Статус операции/ресурса; допустимые значения задаёт Enum или схема. |
| `origin` | `str` | `'host'` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `tuple[list[Host], int]`.

Прямые операции с БД: `self.db.scalar`, `self.db.scalars`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(await self.db.scalars(items_query)).all`
- `Host.created_at.desc`
- `base_query.options`
- `base_query.options(selectinload(Host.ip_addresses).selectinload(HostIpAddress.ports).selectinload(Port.services), selectinload(Host.endpoints)).order_by`
- `base_query.options(selectinload(Host.ip_addresses).selectinload(HostIpAddress.ports).selectinload(Port.services), selectinload(Host.endpoints)).order_by(Host.created_at.desc()).offset`
- `base_query.options(selectinload(Host.ip_addresses).selectinload(HostIpAddress.ports).selectinload(Port.services), selectinload(Host.endpoints)).order_by(Host.created_at.desc()).offset((page - 1) * size).limit`
- `base_query.subquery`
- `base_query.where`
- `func.count`
- `list`
- `select`
- `select(Host).where`
- `select(func.count()).select_from`
- `selectinload`
- `selectinload(Host.ip_addresses).selectinload`
- `selectinload(Host.ip_addresses).selectinload(HostIpAddress.ports).selectinload`
- `self.db.scalar`
- `self.db.scalars`

</details>

## AssetService.create_host

[backend/app/services.py:2426](../../../../backend/app/services.py#L2426)

```python
async def create_host(self, project_id: int, payload: dict, actor_id: int, *, background_tasks: BackgroundTasks | None=None) -> Host
```

Создаёт хост и, при probe=true, атомарно сохраняет задачу защищённой пробивки.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `payload` | `dict` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |
| `background_tasks` | `BackgroundTasks \| None` | `None` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Host`.

Прямые операции с БД: `self.db.add`, `self.db.execute`, `self.db.flush`, `self.db.scalar`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValidationError('Не удалось запустить проверку хоста. Попробуйте ещё раз.')
ValidationError('Укажите корректное имя хоста или IP-адрес')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `BackgroundTasks`
- `Host`
- `HostFarmService`
- `HostFarmService(self.db).create_job`
- `HostFarmService.parse_targets`
- `ValidationError`
- `enqueue_job`
- `func.lower`
- `iter`
- `len`
- `next`
- `notification_events.publish`
- `notification_events.queue_mentions`
- `payload.get`
- `payload.pop`
- `select`
- `select(Host.id).where`
- `select(Host.id).where(Host.project_id == project_id, match).order_by`
- `select(Host.id).where(Host.project_id == project_id, match).order_by(Host.id).limit`
- `self._get_host`
- `self._normalize_host_ip_entries`
- `self._replace_host_ip_addresses`
- `self.audit.log`
- `self.db.add`
- `self.db.execute`
- `self.db.flush`
- `self.db.scalar`
- `set_committed_value`
- `str`
- `targets.values`
- `text`
- `ws_manager.broadcast`

</details>

## AssetService.get_host

[backend/app/services.py:2473](../../../../backend/app/services.py#L2473)

```python
async def get_host(self, project_id: int, host_id: int) -> dict
```

В теле вызывает `(await self.db.scalars(select(Endpoint).where(Endpoint.host_id == host.id))).all`, `select`, `select(Endpoint).where`, `self._get_host`, `self.db.scalars`, `sorted`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `host_id` | `int` | `обязательный` | ID родительского хоста. |

Возвращает: `dict`.

Прямые операции с БД: `self.db.scalars`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(await self.db.scalars(select(Endpoint).where(Endpoint.host_id == host.id))).all`
- `select`
- `select(Endpoint).where`
- `self._get_host`
- `self.db.scalars`
- `sorted`

</details>

## AssetService.update_host

[backend/app/services.py:2544](../../../../backend/app/services.py#L2544)

```python
async def update_host(self, project_id: int, host_id: int, payload: dict, actor_id: int) -> Host
```

Обновляет явно переданные поля хоста и при наличии IP-полей заменяет набор адресов. Сейчас None в обычных полях пропускается; это зарегистрировано как спорное поведение. Сохранение и аудит выполняются раздельными commit.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `host_id` | `int` | `обязательный` | ID родительского хоста. |
| `payload` | `dict` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |

Возвращает: `Host`.

Прямые операции с БД: `self.db.flush`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValidationError('Нужно указать хотя бы один IP-адрес или hostname')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ValidationError`
- `getattr`
- `notification_events.publish`
- `notification_events.queue_mentions`
- `payload.items`
- `payload.pop`
- `self._get_host`
- `self._normalize_host_ip_entries`
- `self._replace_host_ip_addresses`
- `self.audit.log`
- `self.db.flush`
- `setattr`
- `str`
- `ws_manager.broadcast`

</details>

## AssetService.change_ip_address

[backend/app/services.py:2565](../../../../backend/app/services.py#L2565)

```python
async def change_ip_address(self, project_id: int, old_ip: str, new_ip: str, actor_id: int) -> dict
```

Меняет IP во всех привязках проекта, сбрасывает замеры и атомарно ставит перепроверку.

Имена хостов и другие адреса не меняются. Порты/технологии изменяемого IP
удаляются вместе с привязками находок к устаревшим портам/сервисам.
Повторный пробив принудительный, даже если origin=ip уже существует.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `old_ip` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `new_ip` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |

Возвращает: `dict`.

Прямые операции с БД: `self.db.add`, `self.db.commit`, `self.db.execute`, `self.db.flush`, `self.db.rollback`, `self.db.scalar`, `self.db.scalars`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ConflictError('IP-адрес был изменён параллельно; обновите страницу')
ConflictError('Дождитесь завершения текущей проверки этого IP-адреса')
ConflictError('Этот IP-адрес уже есть в проекте')
NotFoundError('IP-адрес не найден')
NotFoundError('Проект не найден')
ValidationError('Укажите другой IP-адрес')
ValidationError(str(exc))
```

<details>
<summary>Прямые вызовы в теле</summary>

- `(await self.db.execute(select(HostIpAddress, Host).join(Host, Host.id == HostIpAddress.host_id).where(Host.project_id == project_id, HostIpAddress.ip_address.in_(old_values)).with_for_update(of=(Host, HostIpAddress)))).all`
- `(await self.db.scalars(select(HostFarmJob.raw).where(HostFarmJob.project_id == project_id, HostFarmJob.kind == ReconJobKind.IPS, HostFarmJob.status.in_([ReconJobStatus.PENDING, ReconJobStatus.QUEUED, ReconJobStatus.RUNNING])))).all`
- `ConflictError`
- `Host`
- `Host.ip_address.in_`
- `HostFarmJob.status.in_`
- `HostIpAddress`
- `HostIpAddress.ip_address.in_`
- `IpFarmService`
- `IpFarmService(self.db).create_job`
- `IpFarmService.parse_ip_targets`
- `NotFoundError`
- `Port.ip_address_id.in_`
- `ProjectHiddenIp.ip_address.in_`
- `Service.port_id.in_`
- `ValidationError`
- `VulnerabilityAsset.asset_id.in_`
- `and_`
- `delete`
- `delete(Port).where`
- `delete(ProjectHiddenIp).where`
- `delete(VulnerabilityAsset).where`
- `len`
- `new_ip.strip`
- `normalize_ip_literal`
- `old_ip.strip`
- `or_`
- `select`
- `select(Host.id).outerjoin`
- `select(Host.id).outerjoin(HostIpAddress, HostIpAddress.host_id == Host.id).where`
- `select(Host.id).outerjoin(HostIpAddress, HostIpAddress.host_id == Host.id).where(Host.project_id == project_id, or_(HostIpAddress.ip_address.in_(new_values), Host.ip_address.in_(new_values))).limit`
- `select(HostFarmJob.raw).where`
- `select(HostIpAddress, Host).join`
- `select(HostIpAddress, Host).join(Host, Host.id == HostIpAddress.host_id).where`
- `select(HostIpAddress, Host).join(Host, Host.id == HostIpAddress.host_id).where(Host.project_id == project_id, HostIpAddress.ip_address.in_(old_values)).with_for_update`
- `select(Port.id).where`
- `select(Project.id).where`
- `select(Project.id).where(Project.id == project_id).with_for_update`
- `select(Service.id).where`
- `self.audit.log`
- `self.db.add`
- `self.db.commit`
- `self.db.execute`
- `self.db.flush`
- `self.db.rollback`
- `self.db.scalar`
- `self.db.scalars`
- `sorted`
- `str`
- `ws_manager.broadcast`

</details>

## AssetService.delete_host

[backend/app/services.py:2646](../../../../backend/app/services.py#L2646)

```python
async def delete_host(self, project_id: int, host_id: int, actor_id: int) -> None
```

В теле вызывает `self._get_host`, `self.audit.log`, `self.db.delete`, `self.db.flush`, `str`, `ws_manager.broadcast`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `host_id` | `int` | `обязательный` | ID родительского хоста. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |

Возвращает: `None`.

Прямые операции с БД: `self.db.delete`, `self.db.flush`.

<details>
<summary>Прямые вызовы в теле</summary>

- `self._get_host`
- `self.audit.log`
- `self.db.delete`
- `self.db.flush`
- `str`
- `ws_manager.broadcast`

</details>

## AssetService.list_hidden_ips

[backend/app/services.py:2661](../../../../backend/app/services.py#L2661)

```python
async def list_hidden_ips(self, project_id: int) -> list[str]
```

В теле вызывает `list`, `rows.all`, `select`, `select(ProjectHiddenIp.ip_address).where`, `self.db.scalars`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |

Возвращает: `list[str]`.

Прямые операции с БД: `self.db.scalars`.

<details>
<summary>Прямые вызовы в теле</summary>

- `list`
- `rows.all`
- `select`
- `select(ProjectHiddenIp.ip_address).where`
- `self.db.scalars`

</details>

## AssetService.hide_ip

[backend/app/services.py:2667](../../../../backend/app/services.py#L2667)

```python
async def hide_ip(self, project_id: int, ip_address: str, actor_id: int) -> None
```

«Удаляет» адрес из списка IP: сносит отдельные IP-хосты (origin='ip') с
этим адресом и запоминает адрес как скрытый. Домен-хосты не трогаются.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `ip_address` | `str` | `обязательный` | IP-адрес; в AuditService — адрес клиента. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |

Возвращает: `None`.

Прямые операции с БД: `self.db.add`, `self.db.delete`, `self.db.flush`, `self.db.scalar`, `self.db.scalars`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValidationError('Не указан IP-адрес')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `(ip_address or '').strip`
- `ProjectHiddenIp`
- `ValidationError`
- `and_`
- `dict.fromkeys`
- `list`
- `select`
- `select(Host).join`
- `select(Host).join(HostIpAddress, HostIpAddress.host_id == Host.id).where`
- `select(ProjectHiddenIp).where`
- `self.audit.log`
- `self.db.add`
- `self.db.delete`
- `self.db.flush`
- `self.db.scalar`
- `self.db.scalars`
- `standalone.all`
- `str`
- `ws_manager.broadcast`

</details>

## AssetService.unhide_ip

[backend/app/services.py:2696](../../../../backend/app/services.py#L2696)

```python
async def unhide_ip(self, project_id: int, ip_address: str, actor_id: int) -> None
```

Снимает адрес со скрытия — он снова показывается в списке IP (если хоть
один хост его несёт). Тем же пользуется явное «Add IPs» (см. фермy IP).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `ip_address` | `str` | `обязательный` | IP-адрес; в AuditService — адрес клиента. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |

Возвращает: `None`.

Прямые операции с БД: `self.db.execute`, `self.db.flush`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(ip_address or '').strip`
- `and_`
- `delete`
- `delete(ProjectHiddenIp).where`
- `self.audit.log`
- `self.db.execute`
- `self.db.flush`
- `str`
- `ws_manager.broadcast`

</details>

## AssetService.list_ports

[backend/app/services.py:2711](../../../../backend/app/services.py#L2711)

```python
async def list_ports(self, project_id: int, host_id: int, ip_address_id: int | None=None) -> list[Port]
```

В теле вызывает `(await self.db.scalars(query)).all`, `list`, `query.where`, `select`, `select(Port).options`, `select(Port).options(selectinload(Port.services)).where`, `select(Port).options(selectinload(Port.services)).where(Port.host_id == host_id).order_by`, `selectinload`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `host_id` | `int` | `обязательный` | ID родительского хоста. |
| `ip_address_id` | `int \| None` | `None` | ID адреса HostIpAddress, а не строковое представление IP. |

Возвращает: `list[Port]`.

Прямые операции с БД: `self.db.scalars`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(await self.db.scalars(query)).all`
- `list`
- `query.where`
- `select`
- `select(Port).options`
- `select(Port).options(selectinload(Port.services)).where`
- `select(Port).options(selectinload(Port.services)).where(Port.host_id == host_id).order_by`
- `selectinload`
- `self._ensure_host`
- `self.db.scalars`

</details>

## AssetService._get_host_ip

[backend/app/services.py:2718](../../../../backend/app/services.py#L2718)

```python
async def _get_host_ip(self, host_id: int, ip_address_id: int) -> HostIpAddress
```

В теле вызывает `ValidationError`, `and_`, `select`, `select(HostIpAddress).where`, `self.db.scalar`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `host_id` | `int` | `обязательный` | ID родительского хоста. |
| `ip_address_id` | `int` | `обязательный` | ID адреса HostIpAddress, а не строковое представление IP. |

Возвращает: `HostIpAddress`.

Прямые операции с БД: `self.db.scalar`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValidationError('IP-адрес не принадлежит указанному хосту')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ValidationError`
- `and_`
- `select`
- `select(HostIpAddress).where`
- `self.db.scalar`

</details>

## AssetService.create_port

[backend/app/services.py:2728](../../../../backend/app/services.py#L2728)

```python
async def create_port(self, project_id: int, host_id: int, payload: dict, actor_id: int) -> Port
```

В теле вызывает `ConflictError`, `Port`, `and_`, `select`, `select(Port).where`, `self._ensure_host`, `self._get_host_ip`, `self._get_port`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `host_id` | `int` | `обязательный` | ID родительского хоста. |
| `payload` | `dict` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |

Возвращает: `Port`.

Прямые операции с БД: `self.db.add`, `self.db.flush`, `self.db.refresh`, `self.db.scalar`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ConflictError('Порт с таким номером и протоколом уже существует на этом IP')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ConflictError`
- `Port`
- `and_`
- `select`
- `select(Port).where`
- `self._ensure_host`
- `self._get_host_ip`
- `self._get_port`
- `self.audit.log`
- `self.db.add`
- `self.db.flush`
- `self.db.refresh`
- `self.db.scalar`
- `str`
- `ws_manager.broadcast`

</details>

## AssetService.get_port

[backend/app/services.py:2751](../../../../backend/app/services.py#L2751)

```python
async def get_port(self, project_id: int, host_id: int, port_id: int) -> Port
```

В теле вызывает `self._ensure_host`, `self._get_port`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `host_id` | `int` | `обязательный` | ID родительского хоста. |
| `port_id` | `int` | `обязательный` | ID родительского порта. |

Возвращает: `Port`.

<details>
<summary>Прямые вызовы в теле</summary>

- `self._ensure_host`
- `self._get_port`

</details>

## AssetService.update_port

[backend/app/services.py:2755](../../../../backend/app/services.py#L2755)

```python
async def update_port(self, project_id: int, host_id: int, port_id: int, payload: dict, actor_id: int) -> Port
```

В теле вызывает `ConflictError`, `and_`, `payload.get`, `payload.items`, `select`, `select(Port).where`, `self._ensure_host`, `self._get_host_ip`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `host_id` | `int` | `обязательный` | ID родительского хоста. |
| `port_id` | `int` | `обязательный` | ID родительского порта. |
| `payload` | `dict` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |

Возвращает: `Port`.

Прямые операции с БД: `self.db.flush`, `self.db.refresh`, `self.db.scalar`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ConflictError('Порт с таким номером и протоколом уже существует на этом IP')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ConflictError`
- `and_`
- `payload.get`
- `payload.items`
- `select`
- `select(Port).where`
- `self._ensure_host`
- `self._get_host_ip`
- `self._get_port`
- `self.audit.log`
- `self.db.flush`
- `self.db.refresh`
- `self.db.scalar`
- `setattr`
- `str`
- `ws_manager.broadcast`

</details>

## AssetService.delete_port

[backend/app/services.py:2784](../../../../backend/app/services.py#L2784)

```python
async def delete_port(self, project_id: int, host_id: int, port_id: int, actor_id: int) -> None
```

В теле вызывает `self._ensure_host`, `self._get_port`, `self.audit.log`, `self.db.delete`, `self.db.flush`, `str`, `ws_manager.broadcast`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `host_id` | `int` | `обязательный` | ID родительского хоста. |
| `port_id` | `int` | `обязательный` | ID родительского порта. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |

Возвращает: `None`.

Прямые операции с БД: `self.db.delete`, `self.db.flush`.

<details>
<summary>Прямые вызовы в теле</summary>

- `self._ensure_host`
- `self._get_port`
- `self.audit.log`
- `self.db.delete`
- `self.db.flush`
- `str`
- `ws_manager.broadcast`

</details>

## AssetService.list_services

[backend/app/services.py:2792](../../../../backend/app/services.py#L2792)

```python
async def list_services(self, project_id: int, host_id: int, port_id: int) -> list[Service]
```

В теле вызывает `(await self.db.scalars(select(Service).where(Service.port_id == port_id).order_by(Service.created_at.desc()))).all`, `Service.created_at.desc`, `list`, `select`, `select(Service).where`, `select(Service).where(Service.port_id == port_id).order_by`, `self._ensure_host`, `self._get_port`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `host_id` | `int` | `обязательный` | ID родительского хоста. |
| `port_id` | `int` | `обязательный` | ID родительского порта. |

Возвращает: `list[Service]`.

Прямые операции с БД: `self.db.scalars`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(await self.db.scalars(select(Service).where(Service.port_id == port_id).order_by(Service.created_at.desc()))).all`
- `Service.created_at.desc`
- `list`
- `select`
- `select(Service).where`
- `select(Service).where(Service.port_id == port_id).order_by`
- `self._ensure_host`
- `self._get_port`
- `self.db.scalars`

</details>

## AssetService.create_service

[backend/app/services.py:2797](../../../../backend/app/services.py#L2797)

```python
async def create_service(self, project_id: int, host_id: int, port_id: int, payload: dict, actor_id: int) -> Service
```

В теле вызывает `Service`, `self._ensure_host`, `self._get_port`, `self.audit.log`, `self.db.add`, `self.db.flush`, `self.db.refresh`, `str`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `host_id` | `int` | `обязательный` | ID родительского хоста. |
| `port_id` | `int` | `обязательный` | ID родительского порта. |
| `payload` | `dict` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |

Возвращает: `Service`.

Прямые операции с БД: `self.db.add`, `self.db.flush`, `self.db.refresh`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Service`
- `self._ensure_host`
- `self._get_port`
- `self.audit.log`
- `self.db.add`
- `self.db.flush`
- `self.db.refresh`
- `str`
- `ws_manager.broadcast`

</details>

## AssetService.update_service

[backend/app/services.py:2808](../../../../backend/app/services.py#L2808)

```python
async def update_service(self, project_id: int, host_id: int, port_id: int, service_id: int, payload: dict, actor_id: int) -> Service
```

В теле вызывает `NotFoundError`, `and_`, `payload.items`, `select`, `select(Service).where`, `self._ensure_host`, `self._get_port`, `self.audit.log`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `host_id` | `int` | `обязательный` | ID родительского хоста. |
| `port_id` | `int` | `обязательный` | ID родительского порта. |
| `service_id` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `payload` | `dict` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |

Возвращает: `Service`.

Прямые операции с БД: `self.db.flush`, `self.db.refresh`, `self.db.scalar`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
NotFoundError('Сервис не найден')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `NotFoundError`
- `and_`
- `payload.items`
- `select`
- `select(Service).where`
- `self._ensure_host`
- `self._get_port`
- `self.audit.log`
- `self.db.flush`
- `self.db.refresh`
- `self.db.scalar`
- `setattr`
- `str`
- `ws_manager.broadcast`

</details>

## AssetService.delete_service

[backend/app/services.py:2825](../../../../backend/app/services.py#L2825)

```python
async def delete_service(self, project_id: int, host_id: int, port_id: int, service_id: int, actor_id: int) -> None
```

В теле вызывает `NotFoundError`, `and_`, `select`, `select(Service).where`, `self._ensure_host`, `self._get_port`, `self.audit.log`, `self.db.delete`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `host_id` | `int` | `обязательный` | ID родительского хоста. |
| `port_id` | `int` | `обязательный` | ID родительского порта. |
| `service_id` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |

Возвращает: `None`.

Прямые операции с БД: `self.db.delete`, `self.db.flush`, `self.db.scalar`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
NotFoundError('Сервис не найден')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `NotFoundError`
- `and_`
- `select`
- `select(Service).where`
- `self._ensure_host`
- `self._get_port`
- `self.audit.log`
- `self.db.delete`
- `self.db.flush`
- `self.db.scalar`
- `str`
- `ws_manager.broadcast`

</details>

## AssetService.list_endpoints

[backend/app/services.py:2836](../../../../backend/app/services.py#L2836)

```python
async def list_endpoints(self, project_id: int, host_id: int) -> list[Endpoint]
```

В теле вызывает `(await self.db.scalars(select(Endpoint).where(Endpoint.host_id == host_id).order_by(Endpoint.created_at.desc()))).all`, `Endpoint.created_at.desc`, `list`, `select`, `select(Endpoint).where`, `select(Endpoint).where(Endpoint.host_id == host_id).order_by`, `self._ensure_host`, `self.db.scalars`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `host_id` | `int` | `обязательный` | ID родительского хоста. |

Возвращает: `list[Endpoint]`.

Прямые операции с БД: `self.db.scalars`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(await self.db.scalars(select(Endpoint).where(Endpoint.host_id == host_id).order_by(Endpoint.created_at.desc()))).all`
- `Endpoint.created_at.desc`
- `list`
- `select`
- `select(Endpoint).where`
- `select(Endpoint).where(Endpoint.host_id == host_id).order_by`
- `self._ensure_host`
- `self.db.scalars`

</details>

## AssetService.get_endpoint

[backend/app/services.py:2840](../../../../backend/app/services.py#L2840)

```python
async def get_endpoint(self, project_id: int, host_id: int, endpoint_id: int) -> Endpoint
```

Читает эндпоинт только внутри указанного хоста и проекта.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `host_id` | `int` | `обязательный` | ID родительского хоста. |
| `endpoint_id` | `int` | `обязательный` | ID эндпоинта. |

Возвращает: `Endpoint`.

Прямые операции с БД: `self.db.scalar`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
NotFoundError('Эндпоинт не найден')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `NotFoundError`
- `select`
- `select(Endpoint).where`
- `self._ensure_host`
- `self.db.scalar`

</details>

## AssetService.list_ip_addresses

[backend/app/services.py:2848](../../../../backend/app/services.py#L2848)

```python
async def list_ip_addresses(self, project_id: int, page: int, size: int, host_id: int | None=None) -> tuple[list[HostIpAddress], int]
```

Страница IP проекта; один адрес у разных хостов — разные привязки.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `page` | `int` | `обязательный` | Номер страницы, начиная с 1. |
| `size` | `int` | `обязательный` | Число элементов страницы; верхняя граница задаётся маршрутом. |
| `host_id` | `int \| None` | `None` | ID родительского хоста. |

Возвращает: `tuple[list[HostIpAddress], int]`.

Прямые операции с БД: `self.db.scalar`, `self.db.scalars`.

<details>
<summary>Прямые вызовы в теле</summary>

- `HostIpAddress.created_at.desc`
- `HostIpAddress.id.desc`
- `func.count`
- `list`
- `query.options`
- `query.options(selectinload(HostIpAddress.ports).selectinload(Port.services)).order_by`
- `query.options(selectinload(HostIpAddress.ports).selectinload(Port.services)).order_by(HostIpAddress.created_at.desc(), HostIpAddress.id.desc()).offset`
- `query.options(selectinload(HostIpAddress.ports).selectinload(Port.services)).order_by(HostIpAddress.created_at.desc(), HostIpAddress.id.desc()).offset((page - 1) * size).limit`
- `query.subquery`
- `query.where`
- `select`
- `select(HostIpAddress).join`
- `select(HostIpAddress).join(Host).where`
- `select(func.count()).select_from`
- `selectinload`
- `selectinload(HostIpAddress.ports).selectinload`
- `self._ensure_host`
- `self.db.scalar`
- `self.db.scalars`

</details>

## AssetService.get_ip_address

[backend/app/services.py:2865](../../../../backend/app/services.py#L2865)

```python
async def get_ip_address(self, project_id: int, ip_id: int) -> HostIpAddress
```

Читает IP с портами и сервисами, проверяя проект родительского хоста.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `ip_id` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `HostIpAddress`.

Прямые операции с БД: `self.db.scalar`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
NotFoundError('IP-адрес не найден')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `NotFoundError`
- `select`
- `select(HostIpAddress).join`
- `select(HostIpAddress).join(Host).where`
- `select(HostIpAddress).join(Host).where(Host.project_id == project_id, HostIpAddress.id == ip_id).options`
- `selectinload`
- `selectinload(HostIpAddress.ports).selectinload`
- `self.db.scalar`

</details>

## AssetService.create_ip_address

[backend/app/services.py:2875](../../../../backend/app/services.py#L2875)

```python
async def create_ip_address(self, project_id: int, payload: dict, actor_id: int) -> HostIpAddress
```

Сохраняет IP без сетевых обращений; повторная привязка не меняет данные.

Без host_id создаёт служебный хост origin=ip. Блокировка родителя
сериализует добавления адресов и выбор primary у существующего хоста.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `payload` | `dict` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |

Возвращает: `HostIpAddress`.

Прямые операции с БД: `self.db.add`, `self.db.execute`, `self.db.flush`, `self.db.scalar`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
NotFoundError('Хост не найден')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `Host`
- `HostIpAddress`
- `NotFoundError`
- `bool`
- `payload.get`
- `select`
- `select(Host).where`
- `select(Host).where(Host.id == host_id, Host.project_id == project_id).with_for_update`
- `select(HostIpAddress).where`
- `select(HostIpAddress.id).where`
- `select(HostIpAddress.id).where(HostIpAddress.host_id == host_id).limit`
- `self.audit.log`
- `self.db.add`
- `self.db.execute`
- `self.db.flush`
- `self.db.scalar`
- `self.get_ip_address`
- `str`
- `update`
- `update(HostIpAddress).where`
- `update(HostIpAddress).where(HostIpAddress.host_id == host_id).values`
- `ws_manager.broadcast`

</details>

## AssetService.list_js_files

[backend/app/services.py:2913](../../../../backend/app/services.py#L2913)

```python
async def list_js_files(self, project_id: int, offset: int=0, limit: int=200) -> tuple[list[dict], int]
```

Возвращает страницу JS-файлов с секретами и hostname. Сортировка: secret_count DESC, url; имена хостов запрашиваются только для текущей страницы. Возвращает (items, total).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `offset` | `int` | `0` | Число пропускаемых записей. |
| `limit` | `int` | `200` | Максимальное число возвращаемых записей. |

Возвращает: `tuple[list[dict], int]`.

Прямые операции с БД: `self.db.execute`, `self.db.scalar`, `self.db.scalars`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(await self.db.execute(select(Host.id, Host.hostname).where(Host.project_id == project_id, Host.id.in_(host_ids)))).all`
- `(await self.db.scalars(select(JsFile).options(selectinload(JsFile.secrets)).where(JsFile.project_id == project_id).order_by(JsFile.secret_count.desc(), JsFile.url).offset(offset).limit(limit))).all`
- `Host.id.in_`
- `JsFile.secret_count.desc`
- `dict`
- `func.count`
- `host_names.get`
- `select`
- `select(Host.id, Host.hostname).where`
- `select(JsFile).options`
- `select(JsFile).options(selectinload(JsFile.secrets)).where`
- `select(JsFile).options(selectinload(JsFile.secrets)).where(JsFile.project_id == project_id).order_by`
- `select(JsFile).options(selectinload(JsFile.secrets)).where(JsFile.project_id == project_id).order_by(JsFile.secret_count.desc(), JsFile.url).offset`
- `select(JsFile).options(selectinload(JsFile.secrets)).where(JsFile.project_id == project_id).order_by(JsFile.secret_count.desc(), JsFile.url).offset(offset).limit`
- `select(func.count()).select_from`
- `select(func.count()).select_from(JsFile).where`
- `selectinload`
- `self.db.execute`
- `self.db.scalar`
- `self.db.scalars`

</details>

## AssetService._delete_js_where

[backend/app/services.py:2970](../../../../backend/app/services.py#L2970)

```python
async def _delete_js_where(self, project_id: int, extra) -> int
```

Удаляет JsFile проекта по доп. условию, снимая секреты явно.

Core-DELETE не триггерит ORM-каскад, а на каскад БД полагаться нельзя
(SQLite в тестах без PRAGMA его не применит), поэтому сначала чистим
js_secrets по подзапросу, затем сами файлы. Возвращает число файлов.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `extra` | `не аннотирован` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `int`.

Прямые операции с БД: `self.db.execute`, `self.db.flush`.

<details>
<summary>Прямые вызовы в теле</summary>

- `JsSecret.js_file_id.in_`
- `and_`
- `delete`
- `delete(JsFile).where`
- `delete(JsSecret).where`
- `int`
- `select`
- `select(JsFile.id).where`
- `self.db.execute`
- `self.db.flush`

</details>

## AssetService.delete_js_for_host

[backend/app/services.py:2984](../../../../backend/app/services.py#L2984)

```python
async def delete_js_for_host(self, project_id: int, host_id: int, actor_id: int) -> int
```

Удаляет JS-находки указанного хоста в проекте. Возвращает число файлов.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `host_id` | `int` | `обязательный` | ID родительского хоста. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |

Возвращает: `int`.

<details>
<summary>Прямые вызовы в теле</summary>

- `self._delete_js_where`
- `self.audit.log`
- `str`
- `ws_manager.broadcast`

</details>

## AssetService.bulk_delete_js_files

[backend/app/services.py:3001](../../../../backend/app/services.py#L3001)

```python
async def bulk_delete_js_files(self, project_id: int, ids: list[int], actor_id: int) -> int
```

Удаляет JS-находки проекта по списку id одним запросом (скоуп проекта в SQL).

Чужие/несуществующие id не удаляются. Пустой список — no-op.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `ids` | `list[int]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |

Возвращает: `int`.

<details>
<summary>Прямые вызовы в теле</summary>

- `JsFile.id.in_`
- `int`
- `isinstance`
- `self._delete_js_where`
- `self.audit.log`
- `sorted`
- `str`
- `str(i).lstrip`
- `str(i).lstrip('-').isdigit`
- `ws_manager.broadcast`

</details>

## AssetService.create_endpoint

[backend/app/services.py:3024](../../../../backend/app/services.py#L3024)

```python
async def create_endpoint(self, project_id: int, host_id: int, payload: dict, actor_id: int) -> Endpoint
```

Разбирает raw/structured request, нормализует путь и проверяет дубликат (host, path, method). При совпадении дополняет незаполненные поля существующей записи; иначе создаёт эндпоинт.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `host_id` | `int` | `обязательный` | ID родительского хоста. |
| `payload` | `dict` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |

Возвращает: `Endpoint`.

Прямые операции с БД: `self.db.add`, `self.db.flush`, `self.db.refresh`, `self.db.scalar`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Endpoint`
- `and_`
- `dict`
- `merge_endpoint_fields`
- `notification_events.publish`
- `notification_events.queue_mentions`
- `payload.get`
- `select`
- `select(Endpoint).where`
- `self._apply_raw_request_payload`
- `self._apply_structured_request_payload`
- `self._ensure_host`
- `self.audit.log`
- `self.db.add`
- `self.db.flush`
- `self.db.refresh`
- `self.db.scalar`
- `str`
- `ws_manager.broadcast`

</details>

## AssetService.update_endpoint

[backend/app/services.py:3058](../../../../backend/app/services.py#L3058)

```python
async def update_endpoint(self, project_id: int, host_id: int, endpoint_id: int, payload: dict, actor_id: int) -> Endpoint
```

Применяет raw/structured request к существующему эндпоинту, проверяет конфликт нового method/path. Пустые поля запроса могут очищаться; нормализация UUID в пути сохраняется.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `host_id` | `int` | `обязательный` | ID родительского хоста. |
| `endpoint_id` | `int` | `обязательный` | ID эндпоинта. |
| `payload` | `dict` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |

Возвращает: `Endpoint`.

Прямые операции с БД: `self.db.flush`, `self.db.refresh`, `self.db.scalar`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ConflictError('Эндпоинт с таким методом и path уже существует')
NotFoundError('Endpoint не найден')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ConflictError`
- `NotFoundError`
- `and_`
- `dict`
- `notification_events.publish`
- `notification_events.queue_mentions`
- `payload.get`
- `payload.items`
- `select`
- `select(Endpoint).where`
- `self._apply_raw_request_payload`
- `self._apply_structured_request_payload`
- `self._ensure_host`
- `self.audit.log`
- `self.db.flush`
- `self.db.refresh`
- `self.db.scalar`
- `setattr`
- `str`
- `ws_manager.broadcast`

</details>

## AssetService.delete_endpoint

[backend/app/services.py:3090](../../../../backend/app/services.py#L3090)

```python
async def delete_endpoint(self, project_id: int, host_id: int, endpoint_id: int, actor_id: int) -> None
```

В теле вызывает `NotFoundError`, `and_`, `f"{(endpoint.method.value if endpoint.method else '')} {endpoint.path}".strip`, `select`, `select(Endpoint).where`, `self._ensure_host`, `self.audit.log`, `self.db.delete`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `host_id` | `int` | `обязательный` | ID родительского хоста. |
| `endpoint_id` | `int` | `обязательный` | ID эндпоинта. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |

Возвращает: `None`.

Прямые операции с БД: `self.db.delete`, `self.db.flush`, `self.db.scalar`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
NotFoundError('Endpoint не найден')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `NotFoundError`
- `and_`
- `f"{(endpoint.method.value if endpoint.method else '')} {endpoint.path}".strip`
- `select`
- `select(Endpoint).where`
- `self._ensure_host`
- `self.audit.log`
- `self.db.delete`
- `self.db.flush`
- `self.db.scalar`
- `str`
- `ws_manager.broadcast`

</details>

## VulnerabilityService.__init__

[backend/app/services.py:3105](../../../../backend/app/services.py#L3105)

```python
def __init__(self, db: AsyncSession) -> None
```

Создаёт экземпляр и сохраняет его зависимости; параметры перечислены ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `db` | `AsyncSession` | `обязательный` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `AuditService`

</details>

## VulnerabilityService._get_vuln

[backend/app/services.py:3109](../../../../backend/app/services.py#L3109)

```python
async def _get_vuln(self, project_id: int, vuln_id: int) -> Vulnerability
```

В теле вызывает `NotFoundError`, `and_`, `select`, `select(Vulnerability).where`, `self._hydrate_workflow_steps`, `self.db.scalar`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `vuln_id` | `int` | `обязательный` | ID уязвимости. |

Возвращает: `Vulnerability`.

Прямые операции с БД: `self.db.scalar`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
NotFoundError('Уязвимость не найдена')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `NotFoundError`
- `and_`
- `select`
- `select(Vulnerability).where`
- `self._hydrate_workflow_steps`
- `self.db.scalar`

</details>

## VulnerabilityService._split_steps_text

[backend/app/services.py:3120](../../../../backend/app/services.py#L3120)

```python
def _split_steps_text(text: str) -> list[str]
```

Разбивает текстовые шаги воспроизведения на отдельные шаги.

Каждый пункт («1. …») — отдельный шаг: на фронте у него своя карточка.
Если нумерации нет, абзацы/строки тоже считаем отдельными шагами, а весь
текст одной строкой остаётся одним шагом.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `text` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `list[str]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `VulnerabilityService._STEP_MARKER_RE.sub`
- `VulnerabilityService._STEP_MARKER_RE.sub('', line).strip`
- `line.strip`
- `steps.append`
- `text.replace`
- `text.replace('\r', '').split`

</details>

## VulnerabilityService._hydrate_workflow_steps

[backend/app/services.py:3143](../../../../backend/app/services.py#L3143)

```python
def _hydrate_workflow_steps(vuln: Vulnerability) -> None
```

Достраивает workflow_steps для находок, у которых есть только текст.

Такое приходит из старых данных, импорта и агентов: раскладываем текст по
отдельным шагам, иначе весь список схлопывается в одно поле в карточке.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `vuln` | `Vulnerability` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `VulnerabilityService._split_steps_text`
- `hasattr`
- `set_committed_value`
- `str`
- `uuid4`

</details>

## VulnerabilityService._normalize_workflow_steps

[backend/app/services.py:3161](../../../../backend/app/services.py#L3161)

```python
def _normalize_workflow_steps(steps: list[dict] | None) -> list[dict]
```

В теле вызывает `int`, `normalized.append`, `raw_step.get`, `str`, `str(raw_step.get('description', '')).strip`, `str(raw_step.get('endpoint_request_raw', '')).strip`, `uuid4`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `steps` | `list[dict] \| None` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `list[dict]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `int`
- `normalized.append`
- `raw_step.get`
- `str`
- `str(raw_step.get('description', '')).strip`
- `str(raw_step.get('endpoint_request_raw', '')).strip`
- `uuid4`

</details>

## VulnerabilityService._workflow_steps_to_text

[backend/app/services.py:3183](../../../../backend/app/services.py#L3183)

```python
def _workflow_steps_to_text(steps: list[dict]) -> str | None
```

В теле вызывает `'\n\n'.join`, `blocks.append`, `enumerate`, `len`, `step.get`, `str`, `str(step.get('description', '')).strip`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `steps` | `list[dict]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `str \| None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `'\n\n'.join`
- `blocks.append`
- `enumerate`
- `len`
- `step.get`
- `str`
- `str(step.get('description', '')).strip`

</details>

## VulnerabilityService._normalize_cvss_vector

[backend/app/services.py:3200](../../../../backend/app/services.py#L3200)

```python
def _normalize_cvss_vector(version: str | None, vector: str | None) -> str | None
```

В теле вызывает `getattr`, `normalized.lstrip`, `normalized.startswith`, `re.sub`, `vector.strip`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `version` | `str \| None` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `vector` | `str \| None` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `str \| None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `getattr`
- `normalized.lstrip`
- `normalized.startswith`
- `re.sub`
- `vector.strip`

</details>

## VulnerabilityService._calculate_cvss_score

[backend/app/services.py:3213](../../../../backend/app/services.py#L3213)

```python
def _calculate_cvss_score(version: str | None, vector: str | None) -> tuple[str | None, float | None]
```

В теле вызывает `CVSS4`, `CVSS4(normalized_vector).scores`, `ValidationError`, `VulnerabilityService._normalize_cvss_vector`, `float`, `getattr`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `version` | `str \| None` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `vector` | `str \| None` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `tuple[str \| None, float \| None]`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValidationError('Поддерживается только CVSS 4.0')
ValidationError(f'Некорректный CVSS вектор: {exc}')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `CVSS4`
- `CVSS4(normalized_vector).scores`
- `ValidationError`
- `VulnerabilityService._normalize_cvss_vector`
- `float`
- `getattr`

</details>

## VulnerabilityService._apply_calculated_cvss_fields

[backend/app/services.py:3228](../../../../backend/app/services.py#L3228)

```python
def _apply_calculated_cvss_fields(payload: dict, *, current_version: str | None=None, current_vector: str | None=None) -> None
```

Вычисляет CVSS; при пустом векторе (включая пробелы) очищает версию и балл.

При частичном обновлении использует текущий вектор. Явный балл без
корректного вектора отклоняет, критичность выводится из результата.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `payload` | `dict` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `current_version` | `str \| None` | `None` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_vector` | `str \| None` | `None` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValidationError('CVSS score рассчитывается автоматически и требует корректный CVSS 4.0 вектор')
ValidationError('Для расчёта CVSS укажите версию 4.0 и корректный вектор')
ValidationError('Для расчёта CVSS укажите корректный CVSS 4.0 вектор')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `(payload.get('cvss_vector') or '').strip`
- `ValidationError`
- `VulnerabilityService._calculate_cvss_score`
- `getattr`
- `payload.get`

</details>

## VulnerabilityService._severity_from_cvss_score

[backend/app/services.py:3262](../../../../backend/app/services.py#L3262)

```python
def _severity_from_cvss_score(score: float | None) -> Severity
```

Преобразование/вычисление в теле функции; тип результата и параметры приведены ниже, точное выражение доступно по ссылке на исходник.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `score` | `float \| None` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Severity`.

## VulnerabilityService._resolve_workflow_step_endpoints

[backend/app/services.py:3276](../../../../backend/app/services.py#L3276)

```python
async def _resolve_workflow_step_endpoints(self, project_id: int, host_id: int, steps: list[dict]) -> list[dict]
```

В теле вызывает `AssetService._apply_raw_request_payload`, `AssetService._apply_structured_request_payload`, `Endpoint`, `and_`, `dict`, `endpoint_payload.get`, `int`, `next_step.get`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `host_id` | `int` | `обязательный` | ID родительского хоста. |
| `steps` | `list[dict]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `list[dict]`.

Прямые операции с БД: `self.db.add`, `self.db.flush`, `self.db.scalar`.

<details>
<summary>Прямые вызовы в теле</summary>

- `AssetService._apply_raw_request_payload`
- `AssetService._apply_structured_request_payload`
- `Endpoint`
- `and_`
- `dict`
- `endpoint_payload.get`
- `int`
- `next_step.get`
- `resolved_steps.append`
- `select`
- `select(Endpoint).where`
- `self.db.add`
- `self.db.flush`
- `self.db.scalar`
- `str`
- `str(endpoint_request_raw).strip`

</details>

## VulnerabilityService._get_primary_host_id

[backend/app/services.py:3325](../../../../backend/app/services.py#L3325)

```python
async def _get_primary_host_id(self, vuln_id: int) -> int
```

В теле вызывает `ValidationError`, `and_`, `select`, `select(VulnerabilityAsset.asset_id).where`, `select(VulnerabilityAsset.asset_id).where(and_(VulnerabilityAsset.vulnerability_id == vuln_id, VulnerabilityAsset.asset_type == AssetType.HOST)).limit`, `self.db.scalar`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `vuln_id` | `int` | `обязательный` | ID уязвимости. |

Возвращает: `int`.

Прямые операции с БД: `self.db.scalar`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValidationError('Уязвимость должна быть привязана хотя бы к одному хосту')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ValidationError`
- `and_`
- `select`
- `select(VulnerabilityAsset.asset_id).where`
- `select(VulnerabilityAsset.asset_id).where(and_(VulnerabilityAsset.vulnerability_id == vuln_id, VulnerabilityAsset.asset_type == AssetType.HOST)).limit`
- `self.db.scalar`

</details>

## VulnerabilityService._validate_workflow_step_images

[backend/app/services.py:3335](../../../../backend/app/services.py#L3335)

```python
async def _validate_workflow_step_images(self, vulnerability_id: int | None, steps: list[dict] | None) -> None
```

В теле вызывает `', '.join`, `(await self.db.scalars(select(File.id).where(and_(File.vulnerability_id == vulnerability_id, File.id.in_(list(image_ids)))))).all`, `File.id.in_`, `ValidationError`, `and_`, `int`, `list`, `select`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `vulnerability_id` | `int \| None` | `обязательный` | ID уязвимости. |
| `steps` | `list[dict] \| None` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

Прямые операции с БД: `self.db.scalars`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValidationError('Нельзя указывать image_file_ids до загрузки файлов уязвимости')
ValidationError(f"workflow_steps.image_file_ids содержат файлы, не принадлежащие уязвимости: {', '.join(missing_ids)}")
```

<details>
<summary>Прямые вызовы в теле</summary>

- `', '.join`
- `(await self.db.scalars(select(File.id).where(and_(File.vulnerability_id == vulnerability_id, File.id.in_(list(image_ids)))))).all`
- `File.id.in_`
- `ValidationError`
- `and_`
- `int`
- `list`
- `select`
- `select(File.id).where`
- `self.db.scalars`
- `set`
- `sorted`
- `step.get`
- `str`

</details>

## VulnerabilityService.list

[backend/app/services.py:3359](../../../../backend/app/services.py#L3359)

```python
async def list(self, project_id: int, page: int, size: int, severity: str | None, status: str | None) -> tuple[list[Vulnerability], int]
```

В теле вызывает `(await self.db.scalars(query.order_by(Vulnerability.created_at.desc(), Vulnerability.id.desc()).offset((page - 1) * size).limit(size))).all`, `Vulnerability.created_at.desc`, `Vulnerability.id.desc`, `func.count`, `list`, `query.order_by`, `query.order_by(Vulnerability.created_at.desc(), Vulnerability.id.desc()).offset`, `query.order_by(Vulnerability.created_at.desc(), Vulnerability.id.desc()).offset((page - 1) * size).limit`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `page` | `int` | `обязательный` | Номер страницы, начиная с 1. |
| `size` | `int` | `обязательный` | Число элементов страницы; верхняя граница задаётся маршрутом. |
| `severity` | `str \| None` | `обязательный` | Критичность находки (Enum Severity). |
| `status` | `str \| None` | `обязательный` | Статус операции/ресурса; допустимые значения задаёт Enum или схема. |

Возвращает: `tuple[list[Vulnerability], int]`.

Прямые операции с БД: `self.db.scalar`, `self.db.scalars`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(await self.db.scalars(query.order_by(Vulnerability.created_at.desc(), Vulnerability.id.desc()).offset((page - 1) * size).limit(size))).all`
- `Vulnerability.created_at.desc`
- `Vulnerability.id.desc`
- `func.count`
- `list`
- `query.order_by`
- `query.order_by(Vulnerability.created_at.desc(), Vulnerability.id.desc()).offset`
- `query.order_by(Vulnerability.created_at.desc(), Vulnerability.id.desc()).offset((page - 1) * size).limit`
- `query.subquery`
- `query.where`
- `select`
- `select(Vulnerability).where`
- `select(func.count()).select_from`
- `self._hydrate_workflow_steps`
- `self.db.scalar`
- `self.db.scalars`

</details>

## VulnerabilityService.host_links_for_page

[backend/app/services.py:3371](../../../../backend/app/services.py#L3371)

```python
async def host_links_for_page(self, items: list[Vulnerability]) -> dict[int, int]
```

Одним запросом возвращает первый связанный хост для каждой находки переданной страницы. При нескольких связях выбирает минимальный ID связи. Убирает HTTP-запрос карточки на каждую строку списка.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `items` | `list[Vulnerability]` | `обязательный` | Набор элементов для обработки. |

Возвращает: `dict[int, int]`.

Прямые операции с БД: `self.db.execute`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(await self.db.execute(select(VulnerabilityAsset.vulnerability_id, VulnerabilityAsset.asset_id).where(VulnerabilityAsset.vulnerability_id.in_([item.id for item in items]), VulnerabilityAsset.asset_type == AssetType.HOST).order_by(VulnerabilityAsset.id))).all`
- `VulnerabilityAsset.vulnerability_id.in_`
- `links.setdefault`
- `select`
- `select(VulnerabilityAsset.vulnerability_id, VulnerabilityAsset.asset_id).where`
- `select(VulnerabilityAsset.vulnerability_id, VulnerabilityAsset.asset_id).where(VulnerabilityAsset.vulnerability_id.in_([item.id for item in items]), VulnerabilityAsset.asset_type == AssetType.HOST).order_by`
- `self.db.execute`

</details>

## VulnerabilityService.linked_issues_for_page

[backend/app/services.py:3386](../../../../backend/app/services.py#L3386)

```python
async def linked_issues_for_page(self, items: list[Vulnerability]) -> dict[int, dict]
```

Одним запросом получает сохранённые STS-ссылки страницы без обращений в TT.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `items` | `list[Vulnerability]` | `обязательный` | Набор элементов для обработки. |

Возвращает: `dict[int, dict]`.

Прямые операции с БД: `self.db.scalars`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(await self.db.scalars(select(WorksIssueLink).where(WorksIssueLink.vulnerability_id.in_([item.id for item in items])))).all`
- `WorksIssueLink.vulnerability_id.in_`
- `select`
- `select(WorksIssueLink).where`
- `self.db.scalars`

</details>

## VulnerabilityService.list_for_host

[backend/app/services.py:3395](../../../../backend/app/services.py#L3395)

```python
async def list_for_host(self, project_id: int, host_id: int, page: int, size: int, severity: str | None, status: str | None) -> tuple[list[Vulnerability], int]
```

В теле вызывает `(await self.db.scalars(query.order_by(Vulnerability.created_at.desc(), Vulnerability.id.desc()).offset((page - 1) * size).limit(size))).all`, `NotFoundError`, `Vulnerability.created_at.desc`, `Vulnerability.id.desc`, `and_`, `func.count`, `list`, `query.order_by`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `host_id` | `int` | `обязательный` | ID родительского хоста. |
| `page` | `int` | `обязательный` | Номер страницы, начиная с 1. |
| `size` | `int` | `обязательный` | Число элементов страницы; верхняя граница задаётся маршрутом. |
| `severity` | `str \| None` | `обязательный` | Критичность находки (Enum Severity). |
| `status` | `str \| None` | `обязательный` | Статус операции/ресурса; допустимые значения задаёт Enum или схема. |

Возвращает: `tuple[list[Vulnerability], int]`.

Прямые операции с БД: `self.db.scalar`, `self.db.scalars`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
NotFoundError('Хост не найден')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `(await self.db.scalars(query.order_by(Vulnerability.created_at.desc(), Vulnerability.id.desc()).offset((page - 1) * size).limit(size))).all`
- `NotFoundError`
- `Vulnerability.created_at.desc`
- `Vulnerability.id.desc`
- `and_`
- `func.count`
- `list`
- `query.order_by`
- `query.order_by(Vulnerability.created_at.desc(), Vulnerability.id.desc()).offset`
- `query.order_by(Vulnerability.created_at.desc(), Vulnerability.id.desc()).offset((page - 1) * size).limit`
- `query.subquery`
- `query.where`
- `select`
- `select(Host.id).where`
- `select(Vulnerability).join`
- `select(Vulnerability).join(VulnerabilityAsset, VulnerabilityAsset.vulnerability_id == Vulnerability.id).where`
- `select(func.count()).select_from`
- `self._hydrate_workflow_steps`
- `self.db.scalar`
- `self.db.scalars`

</details>

## VulnerabilityService.create

[backend/app/services.py:3423](../../../../backend/app/services.py#L3423)

```python
async def create(self, project_id: int, payload: dict, actor_id: int) -> Vulnerability
```

Создаёт находку хоста; без CVSS задаёт unrealized, иначе выводит критичность из балла.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `payload` | `dict` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |

Возвращает: `Vulnerability`.

Прямые операции с БД: `self.db.add`, `self.db.flush`, `self.db.refresh`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValidationError('Уязвимость должна быть привязана к конкретному хосту')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `'\n'.join`
- `ValidationError`
- `Vulnerability`
- `VulnerabilityAsset`
- `getattr`
- `notification_events.publish`
- `notification_events.queue_mentions`
- `notification_events.queue_vulnerability_created`
- `payload.get`
- `payload.pop`
- `self._apply_calculated_cvss_fields`
- `self._assert_asset_in_project`
- `self._normalize_workflow_steps`
- `self._resolve_workflow_step_endpoints`
- `self._severity_from_cvss_score`
- `self._validate_workflow_step_images`
- `self._workflow_steps_to_text`
- `self.audit.log`
- `self.db.add`
- `self.db.flush`
- `self.db.refresh`
- `str`
- `ws_manager.broadcast`

</details>

## VulnerabilityService.get

[backend/app/services.py:3455](../../../../backend/app/services.py#L3455)

```python
async def get(self, project_id: int, vuln_id: int) -> dict
```

В теле вызывает `(await self.db.scalars(select(File).where(File.vulnerability_id == vuln.id))).all`, `(await self.db.scalars(select(VulnerabilityAsset).where(VulnerabilityAsset.vulnerability_id == vuln.id))).all`, `func.count`, `list`, `select`, `select(File).where`, `select(VulnerabilityAsset).where`, `select(func.count()).select_from`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `vuln_id` | `int` | `обязательный` | ID уязвимости. |

Возвращает: `dict`.

Прямые операции с БД: `self.db.scalar`, `self.db.scalars`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(await self.db.scalars(select(File).where(File.vulnerability_id == vuln.id))).all`
- `(await self.db.scalars(select(VulnerabilityAsset).where(VulnerabilityAsset.vulnerability_id == vuln.id))).all`
- `func.count`
- `list`
- `select`
- `select(File).where`
- `select(VulnerabilityAsset).where`
- `select(func.count()).select_from`
- `select(func.count()).select_from(Comment).where`
- `self._get_vuln`
- `self.db.scalar`
- `self.db.scalars`

</details>

## VulnerabilityService.update

[backend/app/services.py:3462](../../../../backend/app/services.py#L3462)

```python
async def update(self, project_id: int, vuln_id: int, payload: dict, actor_id: int) -> Vulnerability
```

Обновляет находку и пересчитывает критичность; очистка CVSS возвращает unrealized.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `vuln_id` | `int` | `обязательный` | ID уязвимости. |
| `payload` | `dict` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |

Возвращает: `Vulnerability`.

Прямые операции с БД: `self.db.flush`, `self.db.refresh`.

<details>
<summary>Прямые вызовы в теле</summary>

- `'\n'.join`
- `getattr`
- `notification_events.publish`
- `notification_events.queue_mentions`
- `payload.get`
- `payload.items`
- `self._apply_calculated_cvss_fields`
- `self._get_primary_host_id`
- `self._get_vuln`
- `self._normalize_workflow_steps`
- `self._notify_vuln_status_changed`
- `self._resolve_workflow_step_endpoints`
- `self._severity_from_cvss_score`
- `self._validate_workflow_step_images`
- `self._workflow_steps_to_text`
- `self.audit.log`
- `self.db.flush`
- `self.db.refresh`
- `setattr`
- `str`
- `ws_manager.broadcast`

</details>

## VulnerabilityService.patch_status

[backend/app/services.py:3498](../../../../backend/app/services.py#L3498)

```python
async def patch_status(self, project_id: int, vuln_id: int, status: str, actor_id: int) -> Vulnerability
```

В теле вызывает `self._get_vuln`, `self._notify_vuln_status_changed`, `self.audit.log`, `self.db.flush`, `self.db.refresh`, `str`, `ws_manager.broadcast`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `vuln_id` | `int` | `обязательный` | ID уязвимости. |
| `status` | `str` | `обязательный` | Статус операции/ресурса; допустимые значения задаёт Enum или схема. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |

Возвращает: `Vulnerability`.

Прямые операции с БД: `self.db.flush`, `self.db.refresh`.

<details>
<summary>Прямые вызовы в теле</summary>

- `self._get_vuln`
- `self._notify_vuln_status_changed`
- `self.audit.log`
- `self.db.flush`
- `self.db.refresh`
- `str`
- `ws_manager.broadcast`

</details>

## VulnerabilityService._notify_vuln_status_changed

[backend/app/services.py:3516](../../../../backend/app/services.py#L3516)

```python
async def _notify_vuln_status_changed(self, vuln: Vulnerability, actor_id: int) -> None
```

Повод №3: статус находки изменился — сообщаем тому, кто её завёл.

Автору находки, и только если статус менял кто-то другой.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `vuln` | `Vulnerability` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |

Возвращает: `None`.

Прямые операции с БД: `self.db.add`, `self.db.commit`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Notification`
- `getattr`
- `self.db.add`
- `self.db.commit`
- `str`
- `ws_manager.notify_user`

</details>

## VulnerabilityService.delete

[backend/app/services.py:3551](../../../../backend/app/services.py#L3551)

```python
async def delete(self, project_id: int, vuln_id: int, actor_id: int) -> None
```

В теле вызывает `self._get_vuln`, `self.audit.log`, `self.db.delete`, `self.db.flush`, `str`, `ws_manager.broadcast`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `vuln_id` | `int` | `обязательный` | ID уязвимости. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |

Возвращает: `None`.

Прямые операции с БД: `self.db.delete`, `self.db.flush`.

<details>
<summary>Прямые вызовы в теле</summary>

- `self._get_vuln`
- `self.audit.log`
- `self.db.delete`
- `self.db.flush`
- `str`
- `ws_manager.broadcast`

</details>

## VulnerabilityService.list_assets

[backend/app/services.py:3559](../../../../backend/app/services.py#L3559)

```python
async def list_assets(self, project_id: int, vuln_id: int) -> list[VulnerabilityAsset]
```

В теле вызывает `(await self.db.scalars(select(VulnerabilityAsset).where(VulnerabilityAsset.vulnerability_id == vuln_id))).all`, `list`, `select`, `select(VulnerabilityAsset).where`, `self._get_vuln`, `self.db.scalars`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `vuln_id` | `int` | `обязательный` | ID уязвимости. |

Возвращает: `list[VulnerabilityAsset]`.

Прямые операции с БД: `self.db.scalars`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(await self.db.scalars(select(VulnerabilityAsset).where(VulnerabilityAsset.vulnerability_id == vuln_id))).all`
- `list`
- `select`
- `select(VulnerabilityAsset).where`
- `self._get_vuln`
- `self.db.scalars`

</details>

## VulnerabilityService._assert_asset_in_project

[backend/app/services.py:3563](../../../../backend/app/services.py#L3563)

```python
async def _assert_asset_in_project(self, project_id: int, asset_type: AssetType, asset_id: int) -> None
```

В теле вызывает `ValidationError`, `and_`, `select`, `select(Endpoint.id).join`, `select(Endpoint.id).join(Host, Endpoint.host_id == Host.id).where`, `select(Host.id).where`, `select(Port.id).join`, `select(Port.id).join(Host, Port.host_id == Host.id).where`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `asset_type` | `AssetType` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `asset_id` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

Прямые операции с БД: `self.db.scalar`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValidationError('Актив не найден или принадлежит другому проекту')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ValidationError`
- `and_`
- `select`
- `select(Endpoint.id).join`
- `select(Endpoint.id).join(Host, Endpoint.host_id == Host.id).where`
- `select(Host.id).where`
- `select(Port.id).join`
- `select(Port.id).join(Host, Port.host_id == Host.id).where`
- `select(Service.id).join`
- `select(Service.id).join(Port, Service.port_id == Port.id).join`
- `select(Service.id).join(Port, Service.port_id == Port.id).join(Host, Port.host_id == Host.id).where`
- `self.db.scalar`

</details>

## VulnerabilityService.add_asset

[backend/app/services.py:3584](../../../../backend/app/services.py#L3584)

```python
async def add_asset(self, project_id: int, vuln_id: int, asset_type: AssetType, asset_id: int, actor_id: int) -> VulnerabilityAsset
```

В теле вызывает `ConflictError`, `VulnerabilityAsset`, `and_`, `select`, `select(VulnerabilityAsset).where`, `self._assert_asset_in_project`, `self._get_vuln`, `self.audit.log`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `vuln_id` | `int` | `обязательный` | ID уязвимости. |
| `asset_type` | `AssetType` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `asset_id` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |

Возвращает: `VulnerabilityAsset`.

Прямые операции с БД: `self.db.add`, `self.db.flush`, `self.db.refresh`, `self.db.scalar`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ConflictError('Связь уже существует')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ConflictError`
- `VulnerabilityAsset`
- `and_`
- `select`
- `select(VulnerabilityAsset).where`
- `self._assert_asset_in_project`
- `self._get_vuln`
- `self.audit.log`
- `self.db.add`
- `self.db.flush`
- `self.db.refresh`
- `self.db.scalar`
- `str`
- `ws_manager.broadcast`

</details>

## VulnerabilityService.delete_asset

[backend/app/services.py:3614](../../../../backend/app/services.py#L3614)

```python
async def delete_asset(self, project_id: int, vuln_id: int, link_id: int, actor_id: int) -> None
```

В теле вызывает `NotFoundError`, `ValidationError`, `and_`, `func.count`, `select`, `select(VulnerabilityAsset).where`, `select(func.count()).select_from`, `select(func.count()).select_from(VulnerabilityAsset).where`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `vuln_id` | `int` | `обязательный` | ID уязвимости. |
| `link_id` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |

Возвращает: `None`.

Прямые операции с БД: `self.db.delete`, `self.db.flush`, `self.db.scalar`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
NotFoundError('Связь не найдена')
ValidationError('Уязвимость должна оставаться привязанной хотя бы к одному хосту')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `NotFoundError`
- `ValidationError`
- `and_`
- `func.count`
- `select`
- `select(VulnerabilityAsset).where`
- `select(func.count()).select_from`
- `select(func.count()).select_from(VulnerabilityAsset).where`
- `self._get_vuln`
- `self.audit.log`
- `self.db.delete`
- `self.db.flush`
- `self.db.scalar`
- `str`
- `ws_manager.broadcast`

</details>

## FileService.__init__

[backend/app/services.py:3646](../../../../backend/app/services.py#L3646)

```python
def __init__(self, db: AsyncSession, storage: MinioStorage | None=None) -> None
```

Создаёт экземпляр и сохраняет его зависимости; параметры перечислены ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `db` | `AsyncSession` | `обязательный` | Асинхронная SQLAlchemy-сессия текущего запроса. |
| `storage` | `MinioStorage \| None` | `None` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `AuditService`
- `MinioStorage`

</details>

## FileService._ensure_vuln

[backend/app/services.py:3651](../../../../backend/app/services.py#L3651)

```python
async def _ensure_vuln(self, project_id: int, vuln_id: int) -> Vulnerability
```

Проверяет существование находки и принадлежность проекту.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `vuln_id` | `int` | `обязательный` | ID уязвимости. |

Возвращает: `Vulnerability`.

<details>
<summary>Прямые вызовы в теле</summary>

- `get_vulnerability`

</details>

## FileService.list

[backend/app/services.py:3655](../../../../backend/app/services.py#L3655)

```python
async def list(self, project_id: int, vuln_id: int) -> list[File]
```

В теле вызывает `(await self.db.scalars(select(File).where(File.vulnerability_id == vuln_id).order_by(File.uploaded_at.desc()))).all`, `File.uploaded_at.desc`, `list`, `select`, `select(File).where`, `select(File).where(File.vulnerability_id == vuln_id).order_by`, `self._ensure_vuln`, `self.db.scalars`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `vuln_id` | `int` | `обязательный` | ID уязвимости. |

Возвращает: `list[File]`.

Прямые операции с БД: `self.db.scalars`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(await self.db.scalars(select(File).where(File.vulnerability_id == vuln_id).order_by(File.uploaded_at.desc()))).all`
- `File.uploaded_at.desc`
- `list`
- `select`
- `select(File).where`
- `select(File).where(File.vulnerability_id == vuln_id).order_by`
- `self._ensure_vuln`
- `self.db.scalars`

</details>

## FileService.upload

[backend/app/services.py:3659](../../../../backend/app/services.py#L3659)

```python
async def upload(self, project_id: int, vuln_id: int, upload: UploadFile, actor_id: int) -> File
```

В теле вызывает `File`, `ValidationError`, `_sanitize_filename`, `asyncio.to_thread`, `len`, `magic.from_buffer`, `read_upload`, `self._ensure_vuln`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `vuln_id` | `int` | `обязательный` | ID уязвимости. |
| `upload` | `UploadFile` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |

Возвращает: `File`.

Прямые операции с БД: `self.db.add`, `self.db.flush`, `self.db.refresh`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValidationError('Неподдерживаемый тип файла')
ValidationError('Размер файла превышает 50 МБ')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `File`
- `ValidationError`
- `_sanitize_filename`
- `asyncio.to_thread`
- `len`
- `magic.from_buffer`
- `read_upload`
- `self._ensure_vuln`
- `self.audit.log`
- `self.db.add`
- `self.db.flush`
- `self.db.refresh`
- `str`
- `ws_manager.broadcast`

</details>

## FileService.download

[backend/app/services.py:3686](../../../../backend/app/services.py#L3686)

```python
async def download(self, file_id: int, current_user: User) -> tuple[File, bytes]
```

В теле вызывает `ForbiddenError`, `NotFoundError`, `and_`, `asyncio.to_thread`, `select`, `select(File).where`, `select(ProjectMember).where`, `select(Vulnerability).where`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `file_id` | `int` | `обязательный` | ID метаданных файла в БД. |
| `current_user` | `User` | `обязательный` | Пользователь из dependency авторизации. |

Возвращает: `tuple[File, bytes]`.

Прямые операции с БД: `self.db.scalar`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ForbiddenError('Нет доступа к файлу')
NotFoundError('Уязвимость не найдена')
NotFoundError('Файл не найден')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ForbiddenError`
- `NotFoundError`
- `and_`
- `asyncio.to_thread`
- `select`
- `select(File).where`
- `select(ProjectMember).where`
- `select(Vulnerability).where`
- `self.db.scalar`

</details>

## FileService.delete

[backend/app/services.py:3704](../../../../backend/app/services.py#L3704)

```python
async def delete(self, project_id: int, vuln_id: int, file_id: int, actor_id: int) -> None
```

В теле вызывает `NotFoundError`, `and_`, `asyncio.to_thread`, `select`, `select(File).where`, `self._ensure_vuln`, `self.audit.log`, `self.db.delete`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `vuln_id` | `int` | `обязательный` | ID уязвимости. |
| `file_id` | `int` | `обязательный` | ID метаданных файла в БД. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |

Возвращает: `None`.

Прямые операции с БД: `self.db.delete`, `self.db.flush`, `self.db.scalar`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
NotFoundError('Файл не найден')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `NotFoundError`
- `and_`
- `asyncio.to_thread`
- `select`
- `select(File).where`
- `self._ensure_vuln`
- `self.audit.log`
- `self.db.delete`
- `self.db.flush`
- `self.db.scalar`
- `str`
- `ws_manager.broadcast`

</details>

## CommentService.__init__

[backend/app/services.py:3721](../../../../backend/app/services.py#L3721)

```python
def __init__(self, db: AsyncSession) -> None
```

Создаёт экземпляр и сохраняет его зависимости; параметры перечислены ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `db` | `AsyncSession` | `обязательный` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `AuditService`

</details>

## CommentService._ensure_vuln

[backend/app/services.py:3725](../../../../backend/app/services.py#L3725)

```python
async def _ensure_vuln(self, project_id: int, vuln_id: int) -> Vulnerability
```

Проверяет существование находки и принадлежность проекту.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `vuln_id` | `int` | `обязательный` | ID уязвимости. |

Возвращает: `Vulnerability`.

<details>
<summary>Прямые вызовы в теле</summary>

- `get_vulnerability`

</details>

## CommentService._extract_mentions

[backend/app/services.py:3729](../../../../backend/app/services.py#L3729)

```python
async def _extract_mentions(self, project_id: int, content: str) -> list[User]
```

В теле вызывает `notification_events.mentioned_users`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `content` | `str` | `обязательный` | Текст содержимого; формат определяется вызывающим сервисом. |

Возвращает: `list[User]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `notification_events.mentioned_users`

</details>

## CommentService.list

[backend/app/services.py:3732](../../../../backend/app/services.py#L3732)

```python
async def list(self, project_id: int, vuln_id: int, page: int, size: int) -> tuple[list[CommentOut], int]
```

Возвращает страницу комментариев и total после проверки принадлежности уязвимости проекту. Авторы загружаются JOIN, упоминания — одним запросом на страницу; SQL-запросов нет внутри цикла вывода.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `vuln_id` | `int` | `обязательный` | ID уязвимости. |
| `page` | `int` | `обязательный` | Номер страницы, начиная с 1. |
| `size` | `int` | `обязательный` | Число элементов страницы; верхняя граница задаётся маршрутом. |

Возвращает: `tuple[list[CommentOut], int]`.

Прямые операции с БД: `self.db.execute`, `self.db.scalar`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(await self.db.execute(select(Comment, User).join(User, User.id == Comment.user_id).where(Comment.vulnerability_id == vuln_id).order_by(Comment.created_at.asc()).offset((page - 1) * size).limit(size))).all`
- `(await self.db.execute(select(CommentMention.comment_id, User.id, User.username).join(User, User.id == CommentMention.user_id).where(CommentMention.comment_id.in_([comment.id for comment, _ in rows])))).all`
- `Comment.created_at.asc`
- `CommentMention.comment_id.in_`
- `CommentOut`
- `MentionOut`
- `func.count`
- `mentions_by_comment.get`
- `mentions_by_comment.setdefault`
- `mentions_by_comment.setdefault(comment_id, []).append`
- `result.append`
- `select`
- `select(Comment, User).join`
- `select(Comment, User).join(User, User.id == Comment.user_id).where`
- `select(Comment, User).join(User, User.id == Comment.user_id).where(Comment.vulnerability_id == vuln_id).order_by`
- `select(Comment, User).join(User, User.id == Comment.user_id).where(Comment.vulnerability_id == vuln_id).order_by(Comment.created_at.asc()).offset`
- `select(Comment, User).join(User, User.id == Comment.user_id).where(Comment.vulnerability_id == vuln_id).order_by(Comment.created_at.asc()).offset((page - 1) * size).limit`
- `select(CommentMention.comment_id, User.id, User.username).join`
- `select(CommentMention.comment_id, User.id, User.username).join(User, User.id == CommentMention.user_id).where`
- `select(func.count()).select_from`
- `select(func.count()).select_from(Comment).where`
- `self._ensure_vuln`
- `self.db.execute`
- `self.db.scalar`

</details>

## CommentService.create

[backend/app/services.py:3773](../../../../backend/app/services.py#L3773)

```python
async def create(self, project_id: int, vuln_id: int, content: str, actor: User) -> CommentOut
```

В теле вызывает `Comment`, `CommentMention`, `CommentOut`, `MentionOut`, `Notification`, `mention_models.append`, `self._ensure_vuln`, `self._extract_mentions`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `vuln_id` | `int` | `обязательный` | ID уязвимости. |
| `content` | `str` | `обязательный` | Текст содержимого; формат определяется вызывающим сервисом. |
| `actor` | `User` | `обязательный` | Авторизованный инициатор операции. |

Возвращает: `CommentOut`.

Прямые операции с БД: `self.db.add`, `self.db.flush`, `self.db.refresh`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Comment`
- `CommentMention`
- `CommentOut`
- `MentionOut`
- `Notification`
- `mention_models.append`
- `self._ensure_vuln`
- `self._extract_mentions`
- `self.audit.log`
- `self.db.add`
- `self.db.flush`
- `self.db.refresh`
- `str`
- `ws_manager.broadcast`
- `ws_manager.notify_user`

</details>

## CommentService.update

[backend/app/services.py:3830](../../../../backend/app/services.py#L3830)

```python
async def update(self, project_id: int, vuln_id: int, comment_id: int, content: str, actor: User) -> CommentOut
```

В теле вызывает `CommentMention`, `CommentOut`, `ForbiddenError`, `MentionOut`, `NotFoundError`, `and_`, `delete`, `delete(CommentMention).where`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `vuln_id` | `int` | `обязательный` | ID уязвимости. |
| `comment_id` | `int` | `обязательный` | ID комментария. |
| `content` | `str` | `обязательный` | Текст содержимого; формат определяется вызывающим сервисом. |
| `actor` | `User` | `обязательный` | Авторизованный инициатор операции. |

Возвращает: `CommentOut`.

Прямые операции с БД: `self.db.add`, `self.db.execute`, `self.db.flush`, `self.db.refresh`, `self.db.scalar`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ForbiddenError('Можно редактировать только свой комментарий')
NotFoundError('Комментарий не найден')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `CommentMention`
- `CommentOut`
- `ForbiddenError`
- `MentionOut`
- `NotFoundError`
- `and_`
- `delete`
- `delete(CommentMention).where`
- `mention_models.append`
- `notification_events.publish`
- `notification_events.queue_mentions`
- `select`
- `select(Comment).where`
- `self._ensure_vuln`
- `self._extract_mentions`
- `self.audit.log`
- `self.db.add`
- `self.db.execute`
- `self.db.flush`
- `self.db.refresh`
- `self.db.scalar`
- `str`
- `ws_manager.broadcast`

</details>

## CommentService.delete

[backend/app/services.py:3865](../../../../backend/app/services.py#L3865)

```python
async def delete(self, project_id: int, vuln_id: int, comment_id: int, actor: User) -> None
```

В теле вызывает `ForbiddenError`, `NotFoundError`, `and_`, `select`, `select(Comment).where`, `self._ensure_vuln`, `self.audit.log`, `self.db.delete`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `vuln_id` | `int` | `обязательный` | ID уязвимости. |
| `comment_id` | `int` | `обязательный` | ID комментария. |
| `actor` | `User` | `обязательный` | Авторизованный инициатор операции. |

Возвращает: `None`.

Прямые операции с БД: `self.db.delete`, `self.db.flush`, `self.db.scalar`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ForbiddenError('Можно удалить только свой комментарий')
NotFoundError('Комментарий не найден')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ForbiddenError`
- `NotFoundError`
- `and_`
- `select`
- `select(Comment).where`
- `self._ensure_vuln`
- `self.audit.log`
- `self.db.delete`
- `self.db.flush`
- `self.db.scalar`
- `str`
- `ws_manager.broadcast`

</details>

## ProjectNoteService.__init__

[backend/app/services.py:3883](../../../../backend/app/services.py#L3883)

```python
def __init__(self, db: AsyncSession) -> None
```

Создаёт экземпляр и сохраняет его зависимости; параметры перечислены ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `db` | `AsyncSession` | `обязательный` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `AuditService`

</details>

## ProjectNoteService._lock_tree

[backend/app/services.py:3887](../../../../backend/app/services.py#L3887)

```python
async def _lock_tree(self, project_id: int) -> None
```

Сериализует изменение структуры и названий заметок одного проекта.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |

Возвращает: `None`.

Прямые операции с БД: `self.db.scalar`.

<details>
<summary>Прямые вызовы в теле</summary>

- `select`
- `select(Project.id).where`
- `select(Project.id).where(Project.id == project_id).with_for_update`
- `self.db.scalar`

</details>

## ProjectNoteService._ensure_project

[backend/app/services.py:3891](../../../../backend/app/services.py#L3891)

```python
async def _ensure_project(self, project_id: int) -> Project
```

Возвращает проект или NotFoundError без загрузки его дочерних сущностей.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |

Возвращает: `Project`.

<details>
<summary>Прямые вызовы в теле</summary>

- `get_project`

</details>

## ProjectNoteService._get_note

[backend/app/services.py:3895](../../../../backend/app/services.py#L3895)

```python
async def _get_note(self, project_id: int, note_id: int) -> ProjectNote
```

В теле вызывает `NotFoundError`, `and_`, `select`, `select(ProjectNote).where`, `self.db.scalar`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `note_id` | `int` | `обязательный` | ID заметки. |

Возвращает: `ProjectNote`.

Прямые операции с БД: `self.db.scalar`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
NotFoundError('Страница заметки не найдена')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `NotFoundError`
- `and_`
- `select`
- `select(ProjectNote).where`
- `self.db.scalar`

</details>

## ProjectNoteService._ensure_parent

[backend/app/services.py:3901](../../../../backend/app/services.py#L3901)

```python
async def _ensure_parent(self, project_id: int, parent_id: int | None) -> ProjectNote | None
```

В теле вызывает `NotFoundError`, `and_`, `select`, `select(ProjectNote).where`, `self.db.scalar`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `parent_id` | `int \| None` | `обязательный` | ID родителя; None обозначает корень, если допускается контрактом. |

Возвращает: `ProjectNote \| None`.

Прямые операции с БД: `self.db.scalar`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
NotFoundError('Родительская страница не найдена')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `NotFoundError`
- `and_`
- `select`
- `select(ProjectNote).where`
- `self.db.scalar`

</details>

## ProjectNoteService._ensure_unique_title

[backend/app/services.py:3911](../../../../backend/app/services.py#L3911)

```python
async def _ensure_unique_title(self, project_id: int, parent_id: int | None, title: str, *, exclude_note_id: int | None=None) -> None
```

В теле вызывает `ConflictError`, `ProjectNote.parent_id.is_`, `and_`, `query.where`, `select`, `select(ProjectNote).where`, `self.db.scalar`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `parent_id` | `int \| None` | `обязательный` | ID родителя; None обозначает корень, если допускается контрактом. |
| `title` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `exclude_note_id` | `int \| None` | `None` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

Прямые операции с БД: `self.db.scalar`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ConflictError('В этом разделе уже есть страница с таким названием')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ConflictError`
- `ProjectNote.parent_id.is_`
- `and_`
- `query.where`
- `select`
- `select(ProjectNote).where`
- `self.db.scalar`

</details>

## ProjectNoteService._next_sort_order

[backend/app/services.py:3932](../../../../backend/app/services.py#L3932)

```python
async def _next_sort_order(self, project_id: int, parent_id: int | None) -> int
```

В теле вызывает `ProjectNote.parent_id.is_`, `and_`, `func.max`, `int`, `select`, `select(func.max(ProjectNote.sort_order)).where`, `self.db.scalar`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `parent_id` | `int \| None` | `обязательный` | ID родителя; None обозначает корень, если допускается контрактом. |

Возвращает: `int`.

Прямые операции с БД: `self.db.scalar`.

<details>
<summary>Прямые вызовы в теле</summary>

- `ProjectNote.parent_id.is_`
- `and_`
- `func.max`
- `int`
- `select`
- `select(func.max(ProjectNote.sort_order)).where`
- `self.db.scalar`

</details>

## ProjectNoteService._ensure_not_descendant_move

[backend/app/services.py:3943](../../../../backend/app/services.py#L3943)

```python
async def _ensure_not_descendant_move(self, project_id: int, note_id: int, new_parent_id: int | None) -> None
```

В теле вызывает `ValidationError`, `and_`, `select`, `select(ProjectNote.parent_id).where`, `self.db.scalar`, `set`, `visited.add`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `note_id` | `int` | `обязательный` | ID заметки. |
| `new_parent_id` | `int \| None` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

Прямые операции с БД: `self.db.scalar`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValidationError('Нельзя переместить страницу в её дочернюю страницу')
ValidationError('Обнаружен цикл в дереве заметок')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ValidationError`
- `and_`
- `select`
- `select(ProjectNote.parent_id).where`
- `self.db.scalar`
- `set`
- `visited.add`

</details>

## ProjectNoteService.list_notes

[backend/app/services.py:3957](../../../../backend/app/services.py#L3957)

```python
async def list_notes(self, project_id: int) -> list[ProjectNote]
```

В теле вызывает `ProjectNote.parent_id.asc`, `ProjectNote.parent_id.asc().nullsfirst`, `ProjectNote.sort_order.asc`, `ProjectNote.title.asc`, `list`, `rows.all`, `select`, `select(ProjectNote).where`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |

Возвращает: `list[ProjectNote]`.

Прямые операции с БД: `self.db.scalars`.

<details>
<summary>Прямые вызовы в теле</summary>

- `ProjectNote.parent_id.asc`
- `ProjectNote.parent_id.asc().nullsfirst`
- `ProjectNote.sort_order.asc`
- `ProjectNote.title.asc`
- `list`
- `rows.all`
- `select`
- `select(ProjectNote).where`
- `select(ProjectNote).where(ProjectNote.project_id == project_id).order_by`
- `self._ensure_project`
- `self.db.scalars`

</details>

## ProjectNoteService.list_activity

[backend/app/services.py:3966](../../../../backend/app/services.py#L3966)

```python
async def list_activity(self, project_id: int, limit: int=30) -> list[dict]
```

Журнал CREATE/UPDATE/DELETE действий с заметками этого проекта.

Подцепляем audit-записи двумя путями, чтобы покрыть и новые, и старые
записи журнала:
  1) details.project_id == project_id — новый формат (после миграции UI):
     единственный надёжный способ узнать проект для DELETE-записей,
     где самой заметки уже нет в БД.
  2) entity_id IN (заметки этого проекта) — fallback для старых
     CREATE/UPDATE записей без project_id в details.
Title берём из details или из самой заметки (если она ещё жива).
Username — через outer join к users (может быть NULL для удалённых).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `limit` | `int` | `30` | Максимальное число возвращаемых записей. |

Возвращает: `list[dict]`.

Прямые операции с БД: `self.db.execute`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(await self.db.execute(stmt)).all`
- `AuditLog.action.in_`
- `AuditLog.created_at.desc`
- `AuditLog.details['project_id'].as_string`
- `AuditLog.entity_id.in_`
- `details.get`
- `entry.created_at.isoformat`
- `or_`
- `out.append`
- `select`
- `select(AuditLog, User.username, ProjectNote.title).outerjoin`
- `select(AuditLog, User.username, ProjectNote.title).outerjoin(User, User.id == AuditLog.user_id).outerjoin`
- `select(AuditLog, User.username, ProjectNote.title).outerjoin(User, User.id == AuditLog.user_id).outerjoin(ProjectNote, ProjectNote.id == AuditLog.entity_id).where`
- `select(AuditLog, User.username, ProjectNote.title).outerjoin(User, User.id == AuditLog.user_id).outerjoin(ProjectNote, ProjectNote.id == AuditLog.entity_id).where(AuditLog.entity_type == 'project_note').where`
- `select(AuditLog, User.username, ProjectNote.title).outerjoin(User, User.id == AuditLog.user_id).outerjoin(ProjectNote, ProjectNote.id == AuditLog.entity_id).where(AuditLog.entity_type == 'project_note').where(AuditLog.action.in_(('CREATE', 'UPDATE', 'DELETE'))).where`
- `select(AuditLog, User.username, ProjectNote.title).outerjoin(User, User.id == AuditLog.user_id).outerjoin(ProjectNote, ProjectNote.id == AuditLog.entity_id).where(AuditLog.entity_type == 'project_note').where(AuditLog.action.in_(('CREATE', 'UPDATE', 'DELETE'))).where(or_(AuditLog.details['project_id'].as_string() == str(project_id), AuditLog.entity_id.in_(project_note_ids))).order_by`
- `select(AuditLog, User.username, ProjectNote.title).outerjoin(User, User.id == AuditLog.user_id).outerjoin(ProjectNote, ProjectNote.id == AuditLog.entity_id).where(AuditLog.entity_type == 'project_note').where(AuditLog.action.in_(('CREATE', 'UPDATE', 'DELETE'))).where(or_(AuditLog.details['project_id'].as_string() == str(project_id), AuditLog.entity_id.in_(project_note_ids))).order_by(AuditLog.created_at.desc()).limit`
- `select(ProjectNote.id).where`
- `self._ensure_project`
- `self.db.execute`
- `str`

</details>

## ProjectNoteService.get_note

[backend/app/services.py:4016](../../../../backend/app/services.py#L4016)

```python
async def get_note(self, project_id: int, note_id: int) -> ProjectNote
```

В теле вызывает `self._get_note`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `note_id` | `int` | `обязательный` | ID заметки. |

Возвращает: `ProjectNote`.

<details>
<summary>Прямые вызовы в теле</summary>

- `self._get_note`

</details>

## ProjectNoteService.create_note

[backend/app/services.py:4019](../../../../backend/app/services.py#L4019)

```python
async def create_note(self, project_id: int, payload: dict, actor_id: int) -> ProjectNote
```

В теле вызывает `ProjectNote`, `chr`, `notification_events.publish`, `notification_events.queue_mentions`, `payload.get`, `self._ensure_parent`, `self._ensure_project`, `self._ensure_unique_title`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `payload` | `dict` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |

Возвращает: `ProjectNote`.

Прямые операции с БД: `self.db.add`, `self.db.flush`, `self.db.refresh`.

<details>
<summary>Прямые вызовы в теле</summary>

- `ProjectNote`
- `chr`
- `notification_events.publish`
- `notification_events.queue_mentions`
- `payload.get`
- `self._ensure_parent`
- `self._ensure_project`
- `self._ensure_unique_title`
- `self._lock_tree`
- `self._next_sort_order`
- `self.audit.log`
- `self.db.add`
- `self.db.flush`
- `self.db.refresh`
- `str`
- `str(payload['title']).strip`
- `ws_manager.broadcast`

</details>

## ProjectNoteService.update_note

[backend/app/services.py:4056](../../../../backend/app/services.py#L4056)

```python
async def update_note(self, project_id: int, note_id: int, payload: dict, actor_id: int) -> ProjectNote
```

В теле вызывает `chr`, `notification_events.publish`, `notification_events.queue_mentions`, `payload.get`, `self._ensure_unique_title`, `self._get_note`, `self._lock_tree`, `self.audit.log`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `note_id` | `int` | `обязательный` | ID заметки. |
| `payload` | `dict` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |

Возвращает: `ProjectNote`.

Прямые операции с БД: `self.db.flush`, `self.db.refresh`.

<details>
<summary>Прямые вызовы в теле</summary>

- `chr`
- `notification_events.publish`
- `notification_events.queue_mentions`
- `payload.get`
- `self._ensure_unique_title`
- `self._get_note`
- `self._lock_tree`
- `self.audit.log`
- `self.db.flush`
- `self.db.refresh`
- `str`
- `str(next_title).strip`
- `ws_manager.broadcast`

</details>

## ProjectNoteService.move_note

[backend/app/services.py:4086](../../../../backend/app/services.py#L4086)

```python
async def move_note(self, project_id: int, note_id: int, parent_id: int | None, actor_id: int) -> ProjectNote
```

В теле вызывает `ValidationError`, `self._ensure_not_descendant_move`, `self._ensure_parent`, `self._ensure_unique_title`, `self._get_note`, `self._lock_tree`, `self._next_sort_order`, `self.audit.log`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `note_id` | `int` | `обязательный` | ID заметки. |
| `parent_id` | `int \| None` | `обязательный` | ID родителя; None обозначает корень, если допускается контрактом. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |

Возвращает: `ProjectNote`.

Прямые операции с БД: `self.db.flush`, `self.db.refresh`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValidationError('Нельзя переместить страницу в саму себя')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ValidationError`
- `self._ensure_not_descendant_move`
- `self._ensure_parent`
- `self._ensure_unique_title`
- `self._get_note`
- `self._lock_tree`
- `self._next_sort_order`
- `self.audit.log`
- `self.db.flush`
- `self.db.refresh`
- `str`
- `ws_manager.broadcast`

</details>

## ProjectNoteService.reorder_notes

[backend/app/services.py:4106](../../../../backend/app/services.py#L4106)

```python
async def reorder_notes(self, project_id: int, parent_id: int | None, items: list[dict], actor_id: int) -> list[ProjectNote]
```

В теле вызывает `(await self.db.scalars(select(ProjectNote).where(and_(ProjectNote.project_id == project_id, ProjectNote.parent_id.is_(None) if parent_id is None else ProjectNote.parent_id == parent_id)))).all`, `(await self.db.scalars(select(ProjectNote).where(and_(ProjectNote.project_id == project_id, ProjectNote.parent_id.is_(None) if parent_id is None else ProjectNote.parent_id == parent_id)).order_by(ProjectNote.sort_order.asc(), ProjectNote.title.asc()))).all`, `ProjectNote.parent_id.is_`, `ProjectNote.sort_order.asc`, `ProjectNote.title.asc`, `ValidationError`, `and_`, `int`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `parent_id` | `int \| None` | `обязательный` | ID родителя; None обозначает корень, если допускается контрактом. |
| `items` | `list[dict]` | `обязательный` | Набор элементов для обработки. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |

Возвращает: `list[ProjectNote]`.

Прямые операции с БД: `self.db.flush`, `self.db.scalars`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValidationError('Для ручной сортировки нужно передать полный набор sibling-страниц')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `(await self.db.scalars(select(ProjectNote).where(and_(ProjectNote.project_id == project_id, ProjectNote.parent_id.is_(None) if parent_id is None else ProjectNote.parent_id == parent_id)))).all`
- `(await self.db.scalars(select(ProjectNote).where(and_(ProjectNote.project_id == project_id, ProjectNote.parent_id.is_(None) if parent_id is None else ProjectNote.parent_id == parent_id)).order_by(ProjectNote.sort_order.asc(), ProjectNote.title.asc()))).all`
- `ProjectNote.parent_id.is_`
- `ProjectNote.sort_order.asc`
- `ProjectNote.title.asc`
- `ValidationError`
- `and_`
- `int`
- `list`
- `select`
- `select(ProjectNote).where`
- `select(ProjectNote).where(and_(ProjectNote.project_id == project_id, ProjectNote.parent_id.is_(None) if parent_id is None else ProjectNote.parent_id == parent_id)).order_by`
- `self._ensure_parent`
- `self._lock_tree`
- `self.audit.log`
- `self.db.flush`
- `self.db.scalars`
- `set`
- `sibling_map.keys`
- `str`
- `ws_manager.broadcast`

</details>

## ProjectNoteService.delete_note

[backend/app/services.py:4147](../../../../backend/app/services.py#L4147)

```python
async def delete_note(self, project_id: int, note_id: int, actor_id: int) -> None
```

В теле вызывает `ConflictError`, `ProjectNote.parent_id.is_`, `ProjectNote.title.in_`, `select`, `select(ProjectNote.id).where`, `select(ProjectNote.id).where(ProjectNote.project_id == project_id, ProjectNote.parent_id.is_(None) if note.parent_id is None else ProjectNote.parent_id == note.parent_id, ProjectNote.title.in_(children)).limit`, `select(ProjectNote.title).where`, `self._get_note`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `note_id` | `int` | `обязательный` | ID заметки. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |

Возвращает: `None`.

Прямые операции с БД: `self.db.delete`, `self.db.execute`, `self.db.flush`, `self.db.scalar`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ConflictError('Нельзя удалить страницу: после переноса дочерних страниц совпадут названия. Переименуйте страницы или переместите их перед удалением')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ConflictError`
- `ProjectNote.parent_id.is_`
- `ProjectNote.title.in_`
- `select`
- `select(ProjectNote.id).where`
- `select(ProjectNote.id).where(ProjectNote.project_id == project_id, ProjectNote.parent_id.is_(None) if note.parent_id is None else ProjectNote.parent_id == note.parent_id, ProjectNote.title.in_(children)).limit`
- `select(ProjectNote.title).where`
- `self._get_note`
- `self._lock_tree`
- `self.audit.log`
- `self.db.delete`
- `self.db.execute`
- `self.db.flush`
- `self.db.scalar`
- `str`
- `update`
- `update(ProjectNote).where`
- `update(ProjectNote).where(ProjectNote.parent_id == note_id).values`
- `ws_manager.broadcast`

</details>

## ProjectNoteService._get_comment

[backend/app/services.py:4184](../../../../backend/app/services.py#L4184)

```python
async def _get_comment(self, project_id: int, note_id: int, comment_id: int) -> ProjectNoteComment
```

В теле вызывает `NotFoundError`, `and_`, `select`, `select(ProjectNoteComment).where`, `self.db.scalar`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `note_id` | `int` | `обязательный` | ID заметки. |
| `comment_id` | `int` | `обязательный` | ID комментария. |

Возвращает: `ProjectNoteComment`.

Прямые операции с БД: `self.db.scalar`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
NotFoundError('Комментарий не найден')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `NotFoundError`
- `and_`
- `select`
- `select(ProjectNoteComment).where`
- `self.db.scalar`

</details>

## ProjectNoteService.list_comments

[backend/app/services.py:4198](../../../../backend/app/services.py#L4198)

```python
async def list_comments(self, project_id: int, note_id: int, page: int, size: int) -> tuple[list[ProjectNoteCommentOut], int]
```

В теле вызывает `(await self.db.execute(select(ProjectNoteComment, User).join(User, User.id == ProjectNoteComment.user_id).where(and_(ProjectNoteComment.project_id == project_id, ProjectNoteComment.note_id == note_id)).order_by(ProjectNoteComment.created_at.asc()).offset((page - 1) * size).limit(size))).all`, `ProjectNoteComment.created_at.asc`, `ProjectNoteCommentOut`, `and_`, `func.count`, `int`, `select`, `select(ProjectNoteComment, User).join`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `note_id` | `int` | `обязательный` | ID заметки. |
| `page` | `int` | `обязательный` | Номер страницы, начиная с 1. |
| `size` | `int` | `обязательный` | Число элементов страницы; верхняя граница задаётся маршрутом. |

Возвращает: `tuple[list[ProjectNoteCommentOut], int]`.

Прямые операции с БД: `self.db.execute`, `self.db.scalar`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(await self.db.execute(select(ProjectNoteComment, User).join(User, User.id == ProjectNoteComment.user_id).where(and_(ProjectNoteComment.project_id == project_id, ProjectNoteComment.note_id == note_id)).order_by(ProjectNoteComment.created_at.asc()).offset((page - 1) * size).limit(size))).all`
- `ProjectNoteComment.created_at.asc`
- `ProjectNoteCommentOut`
- `and_`
- `func.count`
- `int`
- `select`
- `select(ProjectNoteComment, User).join`
- `select(ProjectNoteComment, User).join(User, User.id == ProjectNoteComment.user_id).where`
- `select(ProjectNoteComment, User).join(User, User.id == ProjectNoteComment.user_id).where(and_(ProjectNoteComment.project_id == project_id, ProjectNoteComment.note_id == note_id)).order_by`
- `select(ProjectNoteComment, User).join(User, User.id == ProjectNoteComment.user_id).where(and_(ProjectNoteComment.project_id == project_id, ProjectNoteComment.note_id == note_id)).order_by(ProjectNoteComment.created_at.asc()).offset`
- `select(ProjectNoteComment, User).join(User, User.id == ProjectNoteComment.user_id).where(and_(ProjectNoteComment.project_id == project_id, ProjectNoteComment.note_id == note_id)).order_by(ProjectNoteComment.created_at.asc()).offset((page - 1) * size).limit`
- `select(func.count()).select_from`
- `select(func.count()).select_from(ProjectNoteComment).where`
- `self._get_note`
- `self.db.execute`
- `self.db.scalar`

</details>

## ProjectNoteService.create_comment

[backend/app/services.py:4233](../../../../backend/app/services.py#L4233)

```python
async def create_comment(self, project_id: int, note_id: int, content: str, actor: User) -> ProjectNoteCommentOut
```

В теле вызывает `CommentService`, `CommentService(self.db)._extract_mentions`, `Notification`, `ProjectNoteComment`, `ProjectNoteCommentOut`, `self._get_note`, `self.audit.log`, `self.db.add`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `note_id` | `int` | `обязательный` | ID заметки. |
| `content` | `str` | `обязательный` | Текст содержимого; формат определяется вызывающим сервисом. |
| `actor` | `User` | `обязательный` | Авторизованный инициатор операции. |

Возвращает: `ProjectNoteCommentOut`.

Прямые операции с БД: `self.db.add`, `self.db.flush`, `self.db.refresh`.

<details>
<summary>Прямые вызовы в теле</summary>

- `CommentService`
- `CommentService(self.db)._extract_mentions`
- `Notification`
- `ProjectNoteComment`
- `ProjectNoteCommentOut`
- `self._get_note`
- `self.audit.log`
- `self.db.add`
- `self.db.flush`
- `self.db.refresh`
- `str`
- `ws_manager.broadcast`
- `ws_manager.notify_user`

</details>

## ProjectNoteService.update_comment

[backend/app/services.py:4294](../../../../backend/app/services.py#L4294)

```python
async def update_comment(self, project_id: int, note_id: int, comment_id: int, content: str, actor: User) -> ProjectNoteCommentOut
```

В теле вызывает `ForbiddenError`, `ProjectNoteCommentOut`, `notification_events.publish`, `notification_events.queue_mentions`, `self._get_comment`, `self.audit.log`, `self.db.flush`, `self.db.refresh`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `note_id` | `int` | `обязательный` | ID заметки. |
| `comment_id` | `int` | `обязательный` | ID комментария. |
| `content` | `str` | `обязательный` | Текст содержимого; формат определяется вызывающим сервисом. |
| `actor` | `User` | `обязательный` | Авторизованный инициатор операции. |

Возвращает: `ProjectNoteCommentOut`.

Прямые операции с БД: `self.db.flush`, `self.db.refresh`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ForbiddenError('Можно редактировать только свой комментарий')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ForbiddenError`
- `ProjectNoteCommentOut`
- `notification_events.publish`
- `notification_events.queue_mentions`
- `self._get_comment`
- `self.audit.log`
- `self.db.flush`
- `self.db.refresh`
- `str`
- `ws_manager.broadcast`

</details>

## ProjectNoteService.delete_comment

[backend/app/services.py:4333](../../../../backend/app/services.py#L4333)

```python
async def delete_comment(self, project_id: int, note_id: int, comment_id: int, actor: User) -> None
```

В теле вызывает `ForbiddenError`, `self._get_comment`, `self.audit.log`, `self.db.delete`, `self.db.flush`, `str`, `ws_manager.broadcast`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `note_id` | `int` | `обязательный` | ID заметки. |
| `comment_id` | `int` | `обязательный` | ID комментария. |
| `actor` | `User` | `обязательный` | Авторизованный инициатор операции. |

Возвращает: `None`.

Прямые операции с БД: `self.db.delete`, `self.db.flush`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ForbiddenError('Можно удалить только свой комментарий')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ForbiddenError`
- `self._get_comment`
- `self.audit.log`
- `self.db.delete`
- `self.db.flush`
- `str`
- `ws_manager.broadcast`

</details>

## ProjectCredentialService.__init__

[backend/app/services.py:4359](../../../../backend/app/services.py#L4359)

```python
def __init__(self, db: AsyncSession) -> None
```

Создаёт экземпляр и сохраняет его зависимости; параметры перечислены ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `db` | `AsyncSession` | `обязательный` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `AuditService`

</details>

## ProjectCredentialService._ensure_project

[backend/app/services.py:4363](../../../../backend/app/services.py#L4363)

```python
async def _ensure_project(self, project_id: int) -> Project
```

Возвращает проект или NotFoundError без загрузки его дочерних сущностей.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |

Возвращает: `Project`.

<details>
<summary>Прямые вызовы в теле</summary>

- `get_project`

</details>

## ProjectCredentialService._get_credential

[backend/app/services.py:4367](../../../../backend/app/services.py#L4367)

```python
async def _get_credential(self, project_id: int, credential_id: int) -> ProjectCredential
```

В теле вызывает `NotFoundError`, `and_`, `select`, `select(ProjectCredential).where`, `self.db.scalar`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `credential_id` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `ProjectCredential`.

Прямые операции с БД: `self.db.scalar`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
NotFoundError('Учётные данные не найдены')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `NotFoundError`
- `and_`
- `select`
- `select(ProjectCredential).where`
- `self.db.scalar`

</details>

## ProjectCredentialService._read_password

[backend/app/services.py:4378](../../../../backend/app/services.py#L4378)

```python
def _read_password(credential: ProjectCredential) -> str | None
```

Недоступный пароль помечает отдельно, сохраняя шифртекст и остальные строки.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `credential` | `ProjectCredential` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `str \| None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `decrypt_secret`
- `logging.getLogger`
- `logging.getLogger('storm.credentials').warning`

</details>

## ProjectCredentialService._serialize

[backend/app/services.py:4388](../../../../backend/app/services.py#L4388)

```python
def _serialize(credential: ProjectCredential) -> dict
```

Отдаёт креды с расшифрованным паролем (для ProjectCredentialOut).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `credential` | `ProjectCredential` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `dict`.

<details>
<summary>Прямые вызовы в теле</summary>

- `ProjectCredentialService._read_password`

</details>

## ProjectCredentialService.list_credentials

[backend/app/services.py:4404](../../../../backend/app/services.py#L4404)

```python
async def list_credentials(self, project_id: int) -> list[dict]
```

В теле вызывает `ProjectCredential.created_at.asc`, `ProjectCredential.id.asc`, `rows.all`, `select`, `select(ProjectCredential).where`, `select(ProjectCredential).where(ProjectCredential.project_id == project_id).order_by`, `self._ensure_project`, `self._serialize`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |

Возвращает: `list[dict]`.

Прямые операции с БД: `self.db.scalars`.

<details>
<summary>Прямые вызовы в теле</summary>

- `ProjectCredential.created_at.asc`
- `ProjectCredential.id.asc`
- `rows.all`
- `select`
- `select(ProjectCredential).where`
- `select(ProjectCredential).where(ProjectCredential.project_id == project_id).order_by`
- `self._ensure_project`
- `self._serialize`
- `self.db.scalars`

</details>

## ProjectCredentialService.get_credential

[backend/app/services.py:4413](../../../../backend/app/services.py#L4413)

```python
async def get_credential(self, project_id: int, credential_id: int) -> dict
```

Возвращает одну учётную запись, проверяя её принадлежность проекту.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `credential_id` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `dict`.

<details>
<summary>Прямые вызовы в теле</summary>

- `self._get_credential`
- `self._serialize`

</details>

## ProjectCredentialService.create_credential

[backend/app/services.py:4417](../../../../backend/app/services.py#L4417)

```python
async def create_credential(self, project_id: int, payload: dict, actor_id: int) -> dict
```

В теле вызывает `ProjectCredential`, `encrypt_secret`, `payload.get`, `self._ensure_project`, `self._serialize`, `self.audit.log`, `self.db.add`, `self.db.flush`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `payload` | `dict` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |

Возвращает: `dict`.

Прямые операции с БД: `self.db.add`, `self.db.flush`, `self.db.refresh`.

<details>
<summary>Прямые вызовы в теле</summary>

- `ProjectCredential`
- `encrypt_secret`
- `payload.get`
- `self._ensure_project`
- `self._serialize`
- `self.audit.log`
- `self.db.add`
- `self.db.flush`
- `self.db.refresh`
- `str`

</details>

## ProjectCredentialService.update_credential

[backend/app/services.py:4440](../../../../backend/app/services.py#L4440)

```python
async def update_credential(self, project_id: int, credential_id: int, payload: dict, actor_id: int) -> dict
```

В теле вызывает `encrypt_secret`, `payload.get`, `self._get_credential`, `self._serialize`, `self.audit.log`, `self.db.flush`, `self.db.refresh`, `str`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `credential_id` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `payload` | `dict` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |

Возвращает: `dict`.

Прямые операции с БД: `self.db.flush`, `self.db.refresh`.

<details>
<summary>Прямые вызовы в теле</summary>

- `encrypt_secret`
- `payload.get`
- `self._get_credential`
- `self._serialize`
- `self.audit.log`
- `self.db.flush`
- `self.db.refresh`
- `str`

</details>

## ProjectCredentialService.delete_credential

[backend/app/services.py:4461](../../../../backend/app/services.py#L4461)

```python
async def delete_credential(self, project_id: int, credential_id: int, actor_id: int) -> None
```

В теле вызывает `self._get_credential`, `self.audit.log`, `self.db.delete`, `self.db.flush`, `str`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `credential_id` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |

Возвращает: `None`.

Прямые операции с БД: `self.db.delete`, `self.db.flush`.

<details>
<summary>Прямые вызовы в теле</summary>

- `self._get_credential`
- `self.audit.log`
- `self.db.delete`
- `self.db.flush`
- `str`

</details>

## NotificationService.__init__

[backend/app/services.py:4479](../../../../backend/app/services.py#L4479)

```python
def __init__(self, db: AsyncSession) -> None
```

Создаёт экземпляр и сохраняет его зависимости; параметры перечислены ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `db` | `AsyncSession` | `обязательный` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `None`.

## NotificationService._contexts

[backend/app/services.py:4482](../../../../backend/app/services.py#L4482)

```python
async def _contexts(self, notifications: list[Notification]) -> dict[int, NotificationContext]
```

Обогащает только уведомления текущей страницы. Делает не более трёх общих запросов: комментарии находок, комментарии заметок, события проекта/статуса. Отсутствующий предмет оставляет context пустым.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `notifications` | `list[Notification]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `dict[int, NotificationContext]`.

Прямые операции с БД: `self.db.execute`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(await self.db.execute(select(Comment.id, Vulnerability.id, Vulnerability.title, Vulnerability.project_id, User, host_id).select_from(Comment).options(actor_fields).join(Vulnerability, Vulnerability.id == Comment.vulnerability_id).join(User, User.id == Comment.user_id).where(Comment.id.in_(comment_ids)))).all`
- `(await self.db.execute(select(Notification.id, Notification.vulnerability_id, Vulnerability.title, project_id, Project.name, User, Notification.status).select_from(Notification).options(actor_fields).outerjoin(Vulnerability, Vulnerability.id == Notification.vulnerability_id).outerjoin(Project, Project.id == project_id).outerjoin(User, User.id == Notification.actor_id).where(Notification.id.in_(event_ids)))).all`
- `(await self.db.execute(select(ProjectNoteComment.id, ProjectNote.id, ProjectNote.title, ProjectNote.project_id, User).select_from(ProjectNoteComment).options(actor_fields).join(ProjectNote, ProjectNote.id == ProjectNoteComment.note_id).join(User, User.id == ProjectNoteComment.user_id).where(ProjectNoteComment.id.in_(note_comment_ids)))).all`
- `Comment.id.in_`
- `Notification.id.in_`
- `NotificationContext`
- `NotificationContext.model_validate`
- `ProjectNoteComment.id.in_`
- `comment_contexts.get`
- `contexts.get`
- `func.coalesce`
- `load_only`
- `note_contexts.get`
- `select`
- `select(Comment.id, Vulnerability.id, Vulnerability.title, Vulnerability.project_id, User, host_id).select_from`
- `select(Comment.id, Vulnerability.id, Vulnerability.title, Vulnerability.project_id, User, host_id).select_from(Comment).options`
- `select(Comment.id, Vulnerability.id, Vulnerability.title, Vulnerability.project_id, User, host_id).select_from(Comment).options(actor_fields).join`
- `select(Comment.id, Vulnerability.id, Vulnerability.title, Vulnerability.project_id, User, host_id).select_from(Comment).options(actor_fields).join(Vulnerability, Vulnerability.id == Comment.vulnerability_id).join`
- `select(Comment.id, Vulnerability.id, Vulnerability.title, Vulnerability.project_id, User, host_id).select_from(Comment).options(actor_fields).join(Vulnerability, Vulnerability.id == Comment.vulnerability_id).join(User, User.id == Comment.user_id).where`
- `select(Notification.id, Notification.vulnerability_id, Vulnerability.title, project_id, Project.name, User, Notification.status).select_from`
- `select(Notification.id, Notification.vulnerability_id, Vulnerability.title, project_id, Project.name, User, Notification.status).select_from(Notification).options`
- `select(Notification.id, Notification.vulnerability_id, Vulnerability.title, project_id, Project.name, User, Notification.status).select_from(Notification).options(actor_fields).outerjoin`
- `select(Notification.id, Notification.vulnerability_id, Vulnerability.title, project_id, Project.name, User, Notification.status).select_from(Notification).options(actor_fields).outerjoin(Vulnerability, Vulnerability.id == Notification.vulnerability_id).outerjoin`
- `select(Notification.id, Notification.vulnerability_id, Vulnerability.title, project_id, Project.name, User, Notification.status).select_from(Notification).options(actor_fields).outerjoin(Vulnerability, Vulnerability.id == Notification.vulnerability_id).outerjoin(Project, Project.id == project_id).outerjoin`
- `select(Notification.id, Notification.vulnerability_id, Vulnerability.title, project_id, Project.name, User, Notification.status).select_from(Notification).options(actor_fields).outerjoin(Vulnerability, Vulnerability.id == Notification.vulnerability_id).outerjoin(Project, Project.id == project_id).outerjoin(User, User.id == Notification.actor_id).where`
- `select(ProjectNoteComment.id, ProjectNote.id, ProjectNote.title, ProjectNote.project_id, User).select_from`
- `select(ProjectNoteComment.id, ProjectNote.id, ProjectNote.title, ProjectNote.project_id, User).select_from(ProjectNoteComment).options`
- `select(ProjectNoteComment.id, ProjectNote.id, ProjectNote.title, ProjectNote.project_id, User).select_from(ProjectNoteComment).options(actor_fields).join`
- `select(ProjectNoteComment.id, ProjectNote.id, ProjectNote.title, ProjectNote.project_id, User).select_from(ProjectNoteComment).options(actor_fields).join(ProjectNote, ProjectNote.id == ProjectNoteComment.note_id).join`
- `select(ProjectNoteComment.id, ProjectNote.id, ProjectNote.title, ProjectNote.project_id, User).select_from(ProjectNoteComment).options(actor_fields).join(ProjectNote, ProjectNote.id == ProjectNoteComment.note_id).join(User, User.id == ProjectNoteComment.user_id).where`
- `select(VulnerabilityAsset.asset_id).where`
- `select(VulnerabilityAsset.asset_id).where(VulnerabilityAsset.vulnerability_id == Vulnerability.id, VulnerabilityAsset.asset_type == AssetType.HOST).correlate`
- `select(VulnerabilityAsset.asset_id).where(VulnerabilityAsset.vulnerability_id == Vulnerability.id, VulnerabilityAsset.asset_type == AssetType.HOST).correlate(Vulnerability).limit`
- `select(VulnerabilityAsset.asset_id).where(VulnerabilityAsset.vulnerability_id == Vulnerability.id, VulnerabilityAsset.asset_type == AssetType.HOST).correlate(Vulnerability).limit(1).scalar_subquery`
- `self.db.execute`

</details>

## NotificationService.list

[backend/app/services.py:4559](../../../../backend/app/services.py#L4559)

```python
async def list(self, user_id: int, page: int, size: int, is_read: bool | None) -> tuple[list[NotificationOut], int]
```

Возвращает страницу уведомлений пользователя за последние семь суток, с необязательным фильтром is_read и контекстом. Истёкшие строки не входят в total; порядок created_at DESC, id DESC устойчив при равных датах. Число запросов зависит от типов контекста, а не от размера страницы.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `user_id` | `int` | `обязательный` | ID пользователя. |
| `page` | `int` | `обязательный` | Номер страницы, начиная с 1. |
| `size` | `int` | `обязательный` | Число элементов страницы; верхняя граница задаётся маршрутом. |
| `is_read` | `bool \| None` | `обязательный` | Фильтр уведомлений; None не ограничивает прочитанность. |

Возвращает: `tuple[list[NotificationOut], int]`.

Прямые операции с БД: `self.db.scalar`, `self.db.scalars`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(await self.db.scalars(query.order_by(Notification.created_at.desc(), Notification.id.desc()).offset((page - 1) * size).limit(size))).all`
- `Notification.created_at.desc`
- `Notification.id.desc`
- `NotificationOut`
- `contexts.get`
- `func.count`
- `notification_events.notification_cutoff`
- `query.order_by`
- `query.order_by(Notification.created_at.desc(), Notification.id.desc()).offset`
- `query.order_by(Notification.created_at.desc(), Notification.id.desc()).offset((page - 1) * size).limit`
- `query.subquery`
- `query.where`
- `result.append`
- `select`
- `select(Notification).where`
- `select(func.count()).select_from`
- `self._contexts`
- `self.db.scalar`
- `self.db.scalars`

</details>

## NotificationService.unread_count

[backend/app/services.py:4585](../../../../backend/app/services.py#L4585)

```python
async def unread_count(self, user_id: int) -> int
```

В теле вызывает `Notification.is_read.is_`, `and_`, `func.count`, `notification_events.notification_cutoff`, `select`, `select(func.count()).select_from`, `select(func.count()).select_from(Notification).where`, `self.db.scalar`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `user_id` | `int` | `обязательный` | ID пользователя. |

Возвращает: `int`.

Прямые операции с БД: `self.db.scalar`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Notification.is_read.is_`
- `and_`
- `func.count`
- `notification_events.notification_cutoff`
- `select`
- `select(func.count()).select_from`
- `select(func.count()).select_from(Notification).where`
- `self.db.scalar`

</details>

## NotificationService.mark_read

[backend/app/services.py:4590](../../../../backend/app/services.py#L4590)

```python
async def mark_read(self, notification_id: int, user_id: int) -> Notification
```

В теле вызывает `NotFoundError`, `and_`, `notification_events.notification_cutoff`, `select`, `select(Notification).where`, `self.db.commit`, `self.db.refresh`, `self.db.scalar`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `notification_id` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `user_id` | `int` | `обязательный` | ID пользователя. |

Возвращает: `Notification`.

Прямые операции с БД: `self.db.commit`, `self.db.refresh`, `self.db.scalar`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
NotFoundError('Уведомление не найдено')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `NotFoundError`
- `and_`
- `notification_events.notification_cutoff`
- `select`
- `select(Notification).where`
- `self.db.commit`
- `self.db.refresh`
- `self.db.scalar`

</details>

## NotificationService.mark_all_read

[backend/app/services.py:4601](../../../../backend/app/services.py#L4601)

```python
async def mark_all_read(self, user_id: int) -> None
```

В теле вызывает `notification_events.notification_cutoff`, `self.db.commit`, `self.db.execute`, `update`, `update(Notification).where`, `update(Notification).where(Notification.user_id == user_id, Notification.created_at >= notification_events.notification_cutoff()).values`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `user_id` | `int` | `обязательный` | ID пользователя. |

Возвращает: `None`.

Прямые операции с БД: `self.db.commit`, `self.db.execute`.

<details>
<summary>Прямые вызовы в теле</summary>

- `notification_events.notification_cutoff`
- `self.db.commit`
- `self.db.execute`
- `update`
- `update(Notification).where`
- `update(Notification).where(Notification.user_id == user_id, Notification.created_at >= notification_events.notification_cutoff()).values`

</details>

## ImportService.__init__

[backend/app/services.py:4609](../../../../backend/app/services.py#L4609)

```python
def __init__(self, db: AsyncSession) -> None
```

Создаёт экземпляр и сохраняет его зависимости; параметры перечислены ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `db` | `AsyncSession` | `обязательный` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `None`.

## ImportService._find_matching_host

[backend/app/services.py:4612](../../../../backend/app/services.py#L4612)

```python
async def _find_matching_host(self, project_id: int, host_data) -> Host | None
```

В теле вызывает `(await self.db.scalars(select(Host).where(and_(Host.project_id == project_id, or_(*clauses))))).all`, `ValidationError`, `and_`, `clauses.append`, `len`, `list`, `or_`, `select`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `host_data` | `не аннотирован` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Host \| None`.

Прямые операции с БД: `self.db.scalars`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValidationError(f"Найдено несколько host для ip/hostname ({host_data.ip_address or '-'} / {host_data.hostname or '-'})")
```

<details>
<summary>Прямые вызовы в теле</summary>

- `(await self.db.scalars(select(Host).where(and_(Host.project_id == project_id, or_(*clauses))))).all`
- `ValidationError`
- `and_`
- `clauses.append`
- `len`
- `list`
- `or_`
- `select`
- `select(Host).where`
- `self.db.scalars`

</details>

## ImportService._merge_host_fields

[backend/app/services.py:4641](../../../../backend/app/services.py#L4641)

```python
def _merge_host_fields(host: Host, host_data) -> None
```

Преобразование/вычисление в теле функции; тип результата и параметры приведены ниже, точное выражение доступно по ссылке на исходник.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `host` | `Host` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `host_data` | `не аннотирован` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

## ImportService._merge_service_fields

[backend/app/services.py:4652](../../../../backend/app/services.py#L4652)

```python
def _merge_service_fields(service: Service, service_data) -> None
```

Преобразование/вычисление в теле функции; тип результата и параметры приведены ниже, точное выражение доступно по ссылке на исходник.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `service` | `Service` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `service_data` | `не аннотирован` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

## ImportService._decode_text_payload

[backend/app/services.py:4660](../../../../backend/app/services.py#L4660)

```python
def _decode_text_payload(payload: bytes) -> str
```

В теле вызывает `ValidationError`, `payload.decode`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `payload` | `bytes` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |

Возвращает: `str`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValidationError('Файл должен быть в кодировке UTF-8')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ValidationError`
- `payload.decode`

</details>

## ImportService._validate_openapi_payload

[backend/app/services.py:4667](../../../../backend/app/services.py#L4667)

```python
def _validate_openapi_payload(payload: bytes) -> None
```

В теле вызывает `ValidationError`, `len`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `payload` | `bytes` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |

Возвращает: `None`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValidationError('Swagger/OpenAPI файл превышает 2 МБ')
ValidationError('Swagger/OpenAPI файл пуст')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ValidationError`
- `len`

</details>

## ImportService._parse_relaxed_openapi_scalar

[backend/app/services.py:4674](../../../../backend/app/services.py#L4674)

```python
def _parse_relaxed_openapi_scalar(raw_value: str) -> object
```

В теле вызывает `int`, `raw_value.strip`, `raw_value.strip().rstrip`, `raw_value.strip().rstrip(',').strip`, `re.fullmatch`, `value.lower`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `raw_value` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `object`.

<details>
<summary>Прямые вызовы в теле</summary>

- `int`
- `raw_value.strip`
- `raw_value.strip().rstrip`
- `raw_value.strip().rstrip(',').strip`
- `re.fullmatch`
- `value.lower`

</details>

## ImportService._parse_relaxed_openapi_object

[backend/app/services.py:4691](../../../../backend/app/services.py#L4691)

```python
def _parse_relaxed_openapi_object(cls, lines: list[str], index: int) -> tuple[dict, int]
```

В теле вызывает `cls._parse_relaxed_openapi_array`, `cls._parse_relaxed_openapi_object`, `cls._parse_relaxed_openapi_scalar`, `len`, `line.endswith`, `line[:-1].rstrip`, `lines[index].strip`, `normalized.endswith`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `lines` | `list[str]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `index` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `tuple[dict, int]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `cls._parse_relaxed_openapi_array`
- `cls._parse_relaxed_openapi_object`
- `cls._parse_relaxed_openapi_scalar`
- `len`
- `line.endswith`
- `line[:-1].rstrip`
- `lines[index].strip`
- `normalized.endswith`
- `normalized.split`
- `normalized[:-1].strip`
- `parts[0].strip`

</details>

## ImportService._parse_relaxed_openapi_array

[backend/app/services.py:4724](../../../../backend/app/services.py#L4724)

```python
def _parse_relaxed_openapi_array(cls, lines: list[str], index: int) -> tuple[list[object], int]
```

В теле вызывает `cls._parse_relaxed_openapi_array`, `cls._parse_relaxed_openapi_object`, `cls._parse_relaxed_openapi_scalar`, `len`, `line.endswith`, `line[:-1].rstrip`, `lines[index].strip`, `result.append`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `lines` | `list[str]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `index` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `tuple[list[object], int]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `cls._parse_relaxed_openapi_array`
- `cls._parse_relaxed_openapi_object`
- `cls._parse_relaxed_openapi_scalar`
- `len`
- `line.endswith`
- `line[:-1].rstrip`
- `lines[index].strip`
- `result.append`

</details>

## ImportService._normalize_relaxed_openapi_mime

[backend/app/services.py:4747](../../../../backend/app/services.py#L4747)

```python
def _normalize_relaxed_openapi_mime(value: str) -> str
```

В теле вызывает `len`, `text.startswith`, `value.strip`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `value` | `str` | `обязательный` | Входное значение преобразования/проверки. |

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `len`
- `text.startswith`
- `value.strip`

</details>

## ImportService._normalize_relaxed_openapi_ref

[backend/app/services.py:4757](../../../../backend/app/services.py#L4757)

```python
def _normalize_relaxed_openapi_ref(value: str) -> str
```

В теле вызывает `len`, `text.startswith`, `text[len(compact):].strip`, `value.strip`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `value` | `str` | `обязательный` | Входное значение преобразования/проверки. |

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `len`
- `text.startswith`
- `text[len(compact):].strip`
- `value.strip`

</details>

## ImportService._normalize_relaxed_openapi_path_key

[backend/app/services.py:4768](../../../../backend/app/services.py#L4768)

```python
def _normalize_relaxed_openapi_path_key(cls, raw_path: str, path_item: object) -> str
```

В теле вызывает `first_tag.lower`, `isinstance`, `len`, `operation.get`, `path_item.values`, `re.sub`, `str`, `str(raw_path or '').strip`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `raw_path` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `path_item` | `object` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `first_tag.lower`
- `isinstance`
- `len`
- `operation.get`
- `path_item.values`
- `re.sub`
- `str`
- `str(raw_path or '').strip`
- `str(tags[0] or '').strip`
- `str(tags[0] or '').strip().strip`
- `text.lower`
- `text.lower().startswith`
- `text.lstrip`
- `text.startswith`
- `text[len(first_tag):].lstrip`

</details>

## ImportService._normalize_relaxed_openapi_document

[backend/app/services.py:4796](../../../../backend/app/services.py#L4796)

```python
def _normalize_relaxed_openapi_document(cls, value: object, key: str | None=None) -> object
```

В теле вызывает `base_path.lstrip`, `cls._normalize_relaxed_openapi_document`, `cls._normalize_relaxed_openapi_mime`, `cls._normalize_relaxed_openapi_path_key`, `cls._normalize_relaxed_openapi_ref`, `isinstance`, `normalized['basePath'].strip`, `normalized['paths'].items`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `value` | `object` | `обязательный` | Входное значение преобразования/проверки. |
| `key` | `str \| None` | `None` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `object`.

<details>
<summary>Прямые вызовы в теле</summary>

- `base_path.lstrip`
- `cls._normalize_relaxed_openapi_document`
- `cls._normalize_relaxed_openapi_mime`
- `cls._normalize_relaxed_openapi_path_key`
- `cls._normalize_relaxed_openapi_ref`
- `isinstance`
- `normalized['basePath'].strip`
- `normalized['paths'].items`
- `value.items`
- `value.strip`

</details>

## ImportService._load_relaxed_openapi_document

[backend/app/services.py:4820](../../../../backend/app/services.py#L4820)

```python
def _load_relaxed_openapi_document(cls, raw_text: str) -> dict
```

В теле вызывает `ValidationError`, `cls._normalize_relaxed_openapi_document`, `cls._parse_relaxed_openapi_object`, `isinstance`, `len`, `line.strip`, `lines[index].strip`, `raw_text.splitlines`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `raw_text` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `dict`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValidationError('Swagger/OpenAPI документ должен быть объектом')
ValidationError('Swagger/OpenAPI файл должен быть валидным JSON или YAML')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ValidationError`
- `cls._normalize_relaxed_openapi_document`
- `cls._parse_relaxed_openapi_object`
- `isinstance`
- `len`
- `line.strip`
- `lines[index].strip`
- `raw_text.splitlines`

</details>

## ImportService._load_json_or_yaml_document

[backend/app/services.py:4837](../../../../backend/app/services.py#L4837)

```python
def _load_json_or_yaml_document(cls, raw_text: str) -> dict
```

В теле вызывает `ValidationError`, `any`, `cls._load_relaxed_openapi_document`, `isinstance`, `json.loads`, `raw_text.strip`, `str`, `validate_json_value`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `raw_text` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `dict`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValidationError('Swagger/OpenAPI документ должен быть объектом')
ValidationError('Swagger/OpenAPI файл должен быть валидным JSON или YAML')
ValidationError('Swagger/OpenAPI файл пуст')
ValidationError('YAML aliases не поддерживаются; используйте $ref')
ValidationError(str(exc))
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ValidationError`
- `any`
- `cls._load_relaxed_openapi_document`
- `isinstance`
- `json.loads`
- `raw_text.strip`
- `str`
- `validate_json_value`
- `yaml.safe_load`
- `yaml.scan`

</details>

## ImportService._resolve_json_pointer

[backend/app/services.py:4863](../../../../backend/app/services.py#L4863)

```python
def _resolve_json_pointer(document: dict, ref: str) -> object
```

В теле вызывает `ValidationError`, `isinstance`, `raw_token.replace`, `raw_token.replace('~1', '/').replace`, `ref.startswith`, `ref[2:].split`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `document` | `dict` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `ref` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `object`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValidationError("Поддерживаются только локальные $ref вида '#/...'")
ValidationError(f'Swagger/OpenAPI содержит битую ссылку $ref: {ref}')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ValidationError`
- `isinstance`
- `raw_token.replace`
- `raw_token.replace('~1', '/').replace`
- `ref.startswith`
- `ref[2:].split`

</details>

## ImportService._resolve_openapi_ref

[backend/app/services.py:4875](../../../../backend/app/services.py#L4875)

```python
def _resolve_openapi_ref(cls, document: dict, value: object, depth: int=0) -> object
```

В теле вызывает `ValidationError`, `cls._resolve_json_pointer`, `cls._resolve_openapi_ref`, `dict`, `isinstance`, `merged.update`, `value.get`, `value.items`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `document` | `dict` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `value` | `object` | `обязательный` | Входное значение преобразования/проверки. |
| `depth` | `int` | `0` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `object`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValidationError('Swagger/OpenAPI содержит слишком глубокую цепочку $ref')
ValidationError('Некорректный $ref в Swagger/OpenAPI документе')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ValidationError`
- `cls._resolve_json_pointer`
- `cls._resolve_openapi_ref`
- `dict`
- `isinstance`
- `merged.update`
- `value.get`
- `value.items`

</details>

## ImportService._normalize_openapi_path

[backend/app/services.py:4891](../../../../backend/app/services.py#L4891)

```python
def _normalize_openapi_path(path_value: str, prefix: str) -> str
```

В теле вызывает `AssetService._normalize_endpoint_path`, `path_value.lstrip`, `prefix.rstrip`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `path_value` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `prefix` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `AssetService._normalize_endpoint_path`
- `path_value.lstrip`
- `prefix.rstrip`

</details>

## ImportService._extract_openapi_host

[backend/app/services.py:4896](../../../../backend/app/services.py#L4896)

```python
def _extract_openapi_host(document: dict) -> str | None
```

В теле вызывает `document.get`, `isinstance`, `re.sub`, `re.sub('^https?://', '', swagger_host, flags=re.IGNORECASE).split`, `server.get`, `str`, `str(document.get('host') or '').strip`, `str(server.get('url') or '').strip`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `document` | `dict` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `str \| None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `document.get`
- `isinstance`
- `re.sub`
- `re.sub('^https?://', '', swagger_host, flags=re.IGNORECASE).split`
- `server.get`
- `str`
- `str(document.get('host') or '').strip`
- `str(server.get('url') or '').strip`
- `urlsplit`

</details>

## ImportService._extract_openapi_path_prefix

[backend/app/services.py:4915](../../../../backend/app/services.py#L4915)

```python
def _extract_openapi_path_prefix(document: dict) -> str
```

В теле вызывает `document.get`, `isinstance`, `server.get`, `str`, `str(document.get('basePath') or '').strip`, `str(server.get('url') or '').strip`, `urlsplit`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `document` | `dict` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `document.get`
- `isinstance`
- `server.get`
- `str`
- `str(document.get('basePath') or '').strip`
- `str(server.get('url') or '').strip`
- `urlsplit`

</details>

## ImportService._serialize_openapi_example

[backend/app/services.py:4934](../../../../backend/app/services.py#L4934)

```python
def _serialize_openapi_example(value: object) -> str | None
```

В теле вызывает `isinstance`, `json.dumps`, `str`, `value.strip`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `value` | `object` | `обязательный` | Входное значение преобразования/проверки. |

Возвращает: `str \| None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `isinstance`
- `json.dumps`
- `str`
- `value.strip`

</details>

## ImportService._build_openapi_example_from_schema

[backend/app/services.py:4947](../../../../backend/app/services.py#L4947)

```python
def _build_openapi_example_from_schema(cls, document: dict, schema: object, depth: int=0) -> object
```

В теле вызывает `cls._build_openapi_example_from_schema`, `cls._resolve_openapi_ref`, `isinstance`, `properties.items`, `resolved.get`, `str`, `str(resolved.get('format') or '').lower`, `str(resolved.get('type') or '').lower`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `document` | `dict` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `schema` | `object` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `depth` | `int` | `0` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `object`.

<details>
<summary>Прямые вызовы в теле</summary>

- `cls._build_openapi_example_from_schema`
- `cls._resolve_openapi_ref`
- `isinstance`
- `properties.items`
- `resolved.get`
- `str`
- `str(resolved.get('format') or '').lower`
- `str(resolved.get('type') or '').lower`

</details>

## ImportService._extract_openapi_query_params

[backend/app/services.py:4990](../../../../backend/app/services.py#L4990)

```python
def _extract_openapi_query_params(cls, document: dict, path_item: dict, operation: dict) -> list[dict]
```

В теле вызывает `bool`, `cls._build_openapi_example_from_schema`, `cls._resolve_openapi_ref`, `cls._serialize_openapi_example`, `collected.append`, `isinstance`, `operation.get`, `path_item.get`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `document` | `dict` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `path_item` | `dict` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `operation` | `dict` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `list[dict]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `bool`
- `cls._build_openapi_example_from_schema`
- `cls._resolve_openapi_ref`
- `cls._serialize_openapi_example`
- `collected.append`
- `isinstance`
- `operation.get`
- `path_item.get`
- `resolved.get`
- `seen.add`
- `set`
- `str`
- `str(resolved.get('description') or '').strip`
- `str(resolved.get('in') or '').lower`
- `str(resolved.get('name') or '').strip`

</details>

## ImportService._collect_openapi_form_params

[backend/app/services.py:5027](../../../../backend/app/services.py#L5027)

```python
def _collect_openapi_form_params(cls, document: dict, path_item: dict, operation: dict) -> list[dict]
```

В теле вызывает `cls._resolve_openapi_ref`, `form_params.append`, `isinstance`, `operation.get`, `path_item.get`, `resolved.get`, `str`, `str(resolved.get('in') or '').lower`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `document` | `dict` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `path_item` | `dict` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `operation` | `dict` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `list[dict]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `cls._resolve_openapi_ref`
- `form_params.append`
- `isinstance`
- `operation.get`
- `path_item.get`
- `resolved.get`
- `str`
- `str(resolved.get('in') or '').lower`

</details>

## ImportService._extract_openapi_request_details

[backend/app/services.py:5045](../../../../backend/app/services.py#L5045)

```python
def _extract_openapi_request_details(cls, document: dict, path_item: dict, operation: dict) -> tuple[str | None, str | None]
```

В теле вызывает `'&'.join`, `'\n'.join`, `body_param.get`, `cls._build_openapi_example_from_schema`, `cls._collect_openapi_form_params`, `cls._resolve_openapi_ref`, `cls._serialize_openapi_example`, `content.items`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `document` | `dict` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `path_item` | `dict` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `operation` | `dict` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `tuple[str \| None, str \| None]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `'&'.join`
- `'\n'.join`
- `body_param.get`
- `cls._build_openapi_example_from_schema`
- `cls._collect_openapi_form_params`
- `cls._resolve_openapi_ref`
- `cls._serialize_openapi_example`
- `content.items`
- `content_schema.get`
- `content_type.startswith`
- `document.get`
- `example.get`
- `examples.values`
- `isinstance`
- `next`
- `operation.get`
- `pairs.append`
- `param.get`
- `resolved.get`
- `str`
- `str(content_type or '').strip`
- `str(item).strip`
- `str(param.get('name') or '').strip`

</details>

## ImportService.import_openapi

[backend/app/services.py:5108](../../../../backend/app/services.py#L5108)

```python
async def import_openapi(self, project_id: int, host_id: int, payload: bytes, actor_id: int) -> OpenApiImportResult
```

В теле вызывает `'\n\n'.join`, `AuditService`, `AuditService(self.db).log`, `Endpoint`, `NotFoundError`, `OpenApiImportResult`, `ValidationError`, `and_`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `host_id` | `int` | `обязательный` | ID родительского хоста. |
| `payload` | `bytes` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |

Возвращает: `OpenApiImportResult`.

Прямые операции с БД: `self.db.add`, `self.db.flush`, `self.db.rollback`, `self.db.scalar`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
NotFoundError('Хост не найден')
ValidationError('Swagger/OpenAPI документ содержит слишком много paths для импорта')
ValidationError('В Swagger/OpenAPI документе не найдено методов для импорта')
ValidationError('В Swagger/OpenAPI документе отсутствует объект paths')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `'\n\n'.join`
- `AuditService`
- `AuditService(self.db).log`
- `Endpoint`
- `NotFoundError`
- `OpenApiImportResult`
- `ValidationError`
- `and_`
- `bool`
- `document.get`
- `isinstance`
- `len`
- `merge_endpoint_fields`
- `method_name.startswith`
- `method_name.upper`
- `operation.get`
- `path_item.items`
- `path_value.strip`
- `paths.items`
- `raw_method_name.lower`
- `raw_method_name.upper`
- `result.errors.append`
- `result.model_dump`
- `select`
- `select(Endpoint).where`
- `select(Host).where`
- `self._decode_text_payload`
- `self._extract_openapi_host`
- `self._extract_openapi_path_prefix`
- `self._extract_openapi_query_params`
- `self._extract_openapi_request_details`
- `self._load_json_or_yaml_document`
- `self._normalize_openapi_path`
- `self._resolve_openapi_ref`
- `self._validate_openapi_payload`
- `self.db.add`
- `self.db.flush`
- `self.db.rollback`
- `self.db.scalar`
- `spec_host.lower`
- `str`
- `str(operation.get('description') or '').strip`
- `str(operation.get('summary') or '').strip`
- `value.lower`
- `ws_manager.broadcast`

</details>

## ImportService.export_openapi

[backend/app/services.py:5227](../../../../backend/app/services.py#L5227)

```python
async def export_openapi(self, project_id: int, host_id: int) -> dict
```

Собирает OpenAPI 3.0 документ из эндпоинтов хоста.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `host_id` | `int` | `обязательный` | ID родительского хоста. |

Возвращает: `dict`.

Прямые операции с БД: `self.db.scalar`, `self.db.scalars`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
NotFoundError('Хост не найден')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `(endpoint.description or '').strip`
- `(endpoint.method.value if endpoint.method else 'GET').lower`
- `(endpoint.request_body or '').strip`
- `(endpoint.request_content_type or 'application/json').strip`
- `NotFoundError`
- `and_`
- `bool`
- `content_type.endswith`
- `content_type.lower`
- `description.partition`
- `document['paths'].setdefault`
- `endpoints_result.all`
- `first_line.strip`
- `isinstance`
- `json.loads`
- `parameters.append`
- `raw_header.get`
- `raw_param.get`
- `rest.strip`
- `select`
- `select(Endpoint).where`
- `select(Endpoint).where(Endpoint.host_id == host.id).order_by`
- `select(Host).where`
- `self.db.scalar`
- `self.db.scalars`
- `str`
- `str(raw_header.get('name') or '').strip`
- `str(raw_param.get('description') or '').strip`
- `str(raw_param.get('name') or '').strip`

</details>

## ImportService.import_json

[backend/app/services.py:5315](../../../../backend/app/services.py#L5315)

```python
async def import_json(self, project_id: int, payload: bytes, actor_id: int) -> ImportResult
```

Импортирует данные атомарно: при ошибке откатывает всё.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `payload` | `bytes` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `actor_id` | `int` | `обязательный` | ID инициатора для аудита и уведомлений. |

Возвращает: `ImportResult`.

Прямые операции с БД: `self.db.add`, `self.db.flush`, `self.db.rollback`, `self.db.scalar`, `self.db.scalars`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValidationError('Каждый endpoint должен содержать path или request_raw')
ValidationError('Невалидный JSON-файл')
ValidationError('Невозможно импортировать порты: у хоста нет IP-адресов')
ValidationError(f'JSON импорта не соответствует схеме STORM: {exc}')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `(await self.db.scalars(select(HostIpAddress).where(HostIpAddress.host_id == host.id))).all`
- `AssetService._apply_raw_request_payload`
- `AssetService._apply_structured_request_payload`
- `AuditService`
- `AuditService(self.db).log`
- `Endpoint`
- `Host`
- `HostIpAddress`
- `ImportResult`
- `Port`
- `Service`
- `StormImportPayload.model_validate`
- `ValidationError`
- `and_`
- `any`
- `endpoint_payload.get`
- `host_ips.append`
- `item.model_dump`
- `json.loads`
- `list`
- `merge_endpoint_fields`
- `next`
- `payload.decode`
- `result.model_dump`
- `select`
- `select(Endpoint).where`
- `select(HostIpAddress).where`
- `select(Port).where`
- `select(Service).where`
- `self._find_matching_host`
- `self._merge_host_fields`
- `self._merge_service_fields`
- `self.db.add`
- `self.db.flush`
- `self.db.rollback`
- `self.db.scalar`
- `self.db.scalars`
- `str`
- `ws_manager.broadcast`

</details>

## ReportService.__init__

[backend/app/services.py:5467](../../../../backend/app/services.py#L5467)

```python
def __init__(self, db: AsyncSession) -> None
```

Создаёт экземпляр и сохраняет его зависимости; параметры перечислены ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `db` | `AsyncSession` | `обязательный` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `MinioStorage`

</details>

## ReportService._collect_project_data

[backend/app/services.py:5471](../../../../backend/app/services.py#L5471)

```python
async def _collect_project_data(self, project_id: int) -> dict
```

В теле вызывает `(await self.db.execute(select(User.username).join(ProjectMember, ProjectMember.user_id == User.id).where(ProjectMember.project_id == project_id))).all`, `(await self.db.scalars(select(File).where(File.vulnerability_id.in_(vulnerability_ids)))).all`, `(await self.db.scalars(select(Host).where(Host.project_id == project_id).order_by(Host.id))).all`, `(await self.db.scalars(select(Port).join(Host, Port.host_id == Host.id).where(Host.project_id == project_id))).all`, `(await self.db.scalars(select(ProjectCredential).where(ProjectCredential.project_id == project_id).order_by(ProjectCredential.created_at.asc(), ProjectCredential.id.asc()))).all`, `(await self.db.scalars(select(Vulnerability).where(Vulnerability.project_id == project_id).order_by(Vulnerability.id))).all`, `(await self.db.scalars(select(VulnerabilityAsset).where(VulnerabilityAsset.vulnerability_id.in_(vulnerability_ids)).order_by(VulnerabilityAsset.id))).all`, `File.vulnerability_id.in_`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |

Возвращает: `dict`.

Прямые операции с БД: `self.db.execute`, `self.db.scalar`, `self.db.scalars`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
NotFoundError('Проект не найден')
ServiceUnavailableError('Не удалось расшифровать сохранённые пароли для отчёта. Обратитесь к администратору.', 'secret_decryption_failed')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `(await self.db.execute(select(User.username).join(ProjectMember, ProjectMember.user_id == User.id).where(ProjectMember.project_id == project_id))).all`
- `(await self.db.scalars(select(File).where(File.vulnerability_id.in_(vulnerability_ids)))).all`
- `(await self.db.scalars(select(Host).where(Host.project_id == project_id).order_by(Host.id))).all`
- `(await self.db.scalars(select(Port).join(Host, Port.host_id == Host.id).where(Host.project_id == project_id))).all`
- `(await self.db.scalars(select(ProjectCredential).where(ProjectCredential.project_id == project_id).order_by(ProjectCredential.created_at.asc(), ProjectCredential.id.asc()))).all`
- `(await self.db.scalars(select(Vulnerability).where(Vulnerability.project_id == project_id).order_by(Vulnerability.id))).all`
- `(await self.db.scalars(select(VulnerabilityAsset).where(VulnerabilityAsset.vulnerability_id.in_(vulnerability_ids)).order_by(VulnerabilityAsset.id))).all`
- `File.vulnerability_id.in_`
- `NotFoundError`
- `ProjectCredential.created_at.asc`
- `ProjectCredential.id.asc`
- `ProjectCredentialService._read_password`
- `ServiceUnavailableError`
- `VulnerabilityAsset.vulnerability_id.in_`
- `credentials.append`
- `list`
- `select`
- `select(File).where`
- `select(Host).where`
- `select(Host).where(Host.project_id == project_id).order_by`
- `select(Port).join`
- `select(Port).join(Host, Port.host_id == Host.id).where`
- `select(Project).where`
- `select(ProjectCredential).where`
- `select(ProjectCredential).where(ProjectCredential.project_id == project_id).order_by`
- `select(User.username).join`
- `select(User.username).join(ProjectMember, ProjectMember.user_id == User.id).where`
- `select(Vulnerability).where`
- `select(Vulnerability).where(Vulnerability.project_id == project_id).order_by`
- `select(VulnerabilityAsset).where`
- `select(VulnerabilityAsset).where(VulnerabilityAsset.vulnerability_id.in_(vulnerability_ids)).order_by`
- `self.db.execute`
- `self.db.scalar`
- `self.db.scalars`

</details>

## ReportService._build_report_indexes

[backend/app/services.py:5532](../../../../backend/app/services.py#L5532)

```python
def _build_report_indexes(data: dict) -> dict
```

В теле вызывает `assets_by_vuln_id.setdefault`, `assets_by_vuln_id.setdefault(asset.vulnerability_id, []).append`, `files_by_vuln_id.setdefault`, `files_by_vuln_id.setdefault(file_meta.vulnerability_id, []).append`, `ports_by_host_id.setdefault`, `ports_by_host_id.setdefault(port.host_id, []).append`, `severity_stats.get`, `status_stats.get`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `data` | `dict` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `dict`.

<details>
<summary>Прямые вызовы в теле</summary>

- `assets_by_vuln_id.setdefault`
- `assets_by_vuln_id.setdefault(asset.vulnerability_id, []).append`
- `files_by_vuln_id.setdefault`
- `files_by_vuln_id.setdefault(file_meta.vulnerability_id, []).append`
- `ports_by_host_id.setdefault`
- `ports_by_host_id.setdefault(port.host_id, []).append`
- `severity_stats.get`
- `status_stats.get`

</details>

## ReportService._resolve_step_files

[backend/app/services.py:5564](../../../../backend/app/services.py#L5564)

```python
def _resolve_step_files(step: dict, files_by_id: dict[int, File]) -> list[File]
```

В теле вызывает `files_by_id.get`, `int`, `resolved.append`, `step.get`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `step` | `dict` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `files_by_id` | `dict[int, File]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `list[File]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `files_by_id.get`
- `int`
- `resolved.append`
- `step.get`

</details>

## ReportService._is_image_file

[backend/app/services.py:5577](../../../../backend/app/services.py#L5577)

```python
def _is_image_file(file_meta: File) -> bool
```

В теле вызывает `file_meta.content_type.startswith`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `file_meta` | `File` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `bool`.

<details>
<summary>Прямые вызовы в теле</summary>

- `file_meta.content_type.startswith`

</details>

## ReportService._normalize_report_image_bytes

[backend/app/services.py:5581](../../../../backend/app/services.py#L5581)

```python
def _normalize_report_image_bytes(image_bytes: bytes) -> bytes | None
```

В теле вызывает `BytesIO`, `ImageOps.exif_transpose`, `PillowImage.open`, `normalized.convert`, `output.getvalue`, `save_image.convert`, `save_image.getbands`, `save_image.save`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `image_bytes` | `bytes` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `bytes \| None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `BytesIO`
- `ImageOps.exif_transpose`
- `PillowImage.open`
- `normalized.convert`
- `output.getvalue`
- `save_image.convert`
- `save_image.getbands`
- `save_image.save`

</details>

## ReportService._download_report_images

[backend/app/services.py:5597](../../../../backend/app/services.py#L5597)

```python
async def _download_report_images(self, files: list[File]) -> dict[int, bytes]
```

В теле вызывает `asyncio.to_thread`, `self._is_image_file`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `files` | `list[File]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `dict[int, bytes]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `asyncio.to_thread`
- `self._is_image_file`

</details>

## ReportService.generate

[backend/app/services.py:5611](../../../../backend/app/services.py#L5611)

```python
async def generate(self, project_id: int, kind: Literal['szi', 'pp']) -> bytes
```

Генерирует Word-отчёт указанного типа.

``kind`` — `szi` (отчёт на сертификацию) или `pp` (внутренняя приёмка).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `kind` | `Literal['szi', 'pp']` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `bytes`.

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValidationError('Неподдерживаемый тип отчёта')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `ValidationError`
- `VulnerabilityService._hydrate_workflow_steps`
- `asyncio.to_thread`
- `self._build_report_indexes`
- `self._collect_project_data`
- `self._download_report_images`

</details>
