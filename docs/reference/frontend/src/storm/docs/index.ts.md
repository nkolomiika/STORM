# frontend/src/storm/docs/index.ts

Сгенерировано из объявлений кода. [Правила чтения](../../../../../METHODS.md).

Методов и именованных функций: **1**.

## chaptersForRole

[frontend/src/storm/docs/index.ts:76](../../../../../../frontend/src/storm/docs/index.ts#L76)

```typescript
chaptersForRole(isAdmin: boolean) => DocChapter[]
```

Главы, доступные роли. Администратор видит всё; обычный пользователь видит
«Пользователь» и «Agent API» (токены выпускает любой в рамках своих прав),
но не «Администратор» (`audience: "admin"`).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `isAdmin` | `boolean` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `DocChapter[]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `DOC_CHAPTERS.filter`

</details>
