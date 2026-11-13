# backend/app/routers/notifications.py

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **4**.

## list_notifications

[backend/app/routers/notifications.py:16](../../../../../backend/app/routers/notifications.py#L16)

```python
async def list_notifications(page: int=Query(1, ge=1), size: int=Query(20, ge=1, le=200), is_read: bool | None=Query(default=None), current_user: User=Depends(get_current_user), db: AsyncSession=Depends(get_db)) -> PaginatedResponse[NotificationOut]
```

Возвращает уведомления текущего пользователя.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `page` | `int` | `Query(1, ge=1)` | Номер страницы, начиная с 1. |
| `size` | `int` | `Query(20, ge=1, le=200)` | Число элементов страницы; верхняя граница задаётся маршрутом. |
| `is_read` | `bool \| None` | `Query(default=None)` | Фильтр уведомлений; None не ограничивает прочитанность. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `PaginatedResponse[NotificationOut]`.

Dependencies: `get_current_user`, `get_db`.

Маршруты:

```python
router.get('', response_model=PaginatedResponse[NotificationOut])
```

<details>
<summary>Прямые вызовы в теле</summary>

- `NotificationService`
- `NotificationService(db).list`
- `PageParams`
- `to_paginated_response`

</details>

## unread_count

[backend/app/routers/notifications.py:29](../../../../../backend/app/routers/notifications.py#L29)

```python
async def unread_count(current_user: User=Depends(get_current_user), db: AsyncSession=Depends(get_db)) -> UnreadCountOut
```

Возвращает количество непрочитанных уведомлений.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `UnreadCountOut`.

Dependencies: `get_current_user`, `get_db`.

Маршруты:

```python
router.get('/unread-count', response_model=UnreadCountOut)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `NotificationService`
- `NotificationService(db).unread_count`
- `UnreadCountOut`

</details>

## mark_read

[backend/app/routers/notifications.py:39](../../../../../backend/app/routers/notifications.py#L39)

```python
async def mark_read(notification_id: int, _: None=Depends(enforce_csrf), current_user: User=Depends(get_current_user), db: AsyncSession=Depends(get_db)) -> NotificationOut
```

Помечает уведомление как прочитанное.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `notification_id` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `NotificationOut`.

Dependencies: `enforce_csrf`, `get_current_user`, `get_db`.

Маршруты:

```python
router.patch('/{notification_id}/read', response_model=NotificationOut)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `NotificationOut`
- `NotificationService`
- `NotificationService(db).mark_read`

</details>

## mark_all_read

[backend/app/routers/notifications.py:58](../../../../../backend/app/routers/notifications.py#L58)

```python
async def mark_all_read(_: None=Depends(enforce_csrf), current_user: User=Depends(get_current_user), db: AsyncSession=Depends(get_db)) -> None
```

Помечает все уведомления пользователя как прочитанные.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `current_user` | `User` | `Depends(get_current_user)` | Пользователь из dependency авторизации. |
| `db` | `AsyncSession` | `Depends(get_db)` | Асинхронная SQLAlchemy-сессия текущего запроса. |

Возвращает: `None`.

Dependencies: `enforce_csrf`, `get_current_user`, `get_db`.

Маршруты:

```python
router.patch('/read-all', status_code=status.HTTP_204_NO_CONTENT)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `NotificationService`
- `NotificationService(db).mark_all_read`

</details>
