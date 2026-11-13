# backend/app/routers/agent_tokens.py

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **3**.

## list_agent_tokens

[backend/app/routers/agent_tokens.py:15](../../../../../backend/app/routers/agent_tokens.py#L15)

```python
async def list_agent_tokens(user: User=Depends(get_current_user), db: AsyncSession=Depends(get_db)) -> list[dict]
```

Возвращает agent API tokens текущего пользователя без секретных значений.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `user` | `User` | `Depends(get_current_user)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `list[dict]`.

Dependencies: `get_current_user`, `get_db`.

Маршруты:

```python
router.get('', response_model=list[AgentTokenOut])
```

<details>
<summary>Прямые вызовы в теле</summary>

- `AgentTokenService`
- `AgentTokenService(db).list_tokens`

</details>

## create_agent_token

[backend/app/routers/agent_tokens.py:24](../../../../../backend/app/routers/agent_tokens.py#L24)

```python
async def create_agent_token(payload: AgentTokenCreate, _: None=Depends(enforce_csrf), user: User=Depends(get_current_user), db: AsyncSession=Depends(get_db)) -> dict
```

Создаёт agent API token; значение token возвращается только один раз.

Права токена не могут превышать права создателя: не-админ может выдать доступ
только к проектам, где он участник (см. AgentTokenService.create_token и
request-time проверку require_agent_project_access).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `payload` | `AgentTokenCreate` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `user` | `User` | `Depends(get_current_user)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `dict`.

Dependencies: `enforce_csrf`, `get_current_user`, `get_db`.

Маршруты:

```python
router.post('', response_model=AgentTokenCreateResponse, status_code=status.HTTP_201_CREATED)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `AgentTokenService`
- `AgentTokenService(db).create_token`
- `payload.model_dump`

</details>

## revoke_agent_token

[backend/app/routers/agent_tokens.py:41](../../../../../backend/app/routers/agent_tokens.py#L41)

```python
async def revoke_agent_token(token_id: int, _: None=Depends(enforce_csrf), user: User=Depends(get_current_user), db: AsyncSession=Depends(get_db)) -> None
```

Отзывает agent API token (свой — любой пользователь, чужой — только админ).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `token_id` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `user` | `User` | `Depends(get_current_user)` | Определяется именем/типом и контрактом вызывающего кода. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `None`.

Dependencies: `enforce_csrf`, `get_current_user`, `get_db`.

Маршруты:

```python
router.delete('/{token_id}', status_code=status.HTTP_204_NO_CONTENT)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `AgentTokenService`
- `AgentTokenService(db).revoke_token`

</details>
