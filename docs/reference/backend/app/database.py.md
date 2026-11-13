# backend/app/database.py

Сгенерировано из объявлений кода. [Правила чтения](../../../METHODS.md).

Методов и именованных функций: **1**.

## get_db

[backend/app/database.py:17](../../../../backend/app/database.py#L17)

```python
async def get_db() -> AsyncGenerator[AsyncSession, None]
```

DI-фабрика для получения асинхронной сессии БД.

Возвращает: `AsyncGenerator[AsyncSession, None]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `SessionLocal`

</details>
