# frontend/src/storm/useReconJobPolling.ts

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **1**.

## useReconJobPolling

[frontend/src/storm/useReconJobPolling.ts:15](../../../../../frontend/src/storm/useReconJobPolling.ts#L15)

```typescript
useReconJobPolling<T extends Job>(job: T | null, projectId: number | null, options: Options<T>) => void
```

Опрос задания: один таймер, отмена устаревшего ответа и повтор после сбоя.
Смена проекта/задания отменяет доставку результата. О сбое уведомляем один раз
до восстановления соединения; обработчик update управляет завершением задачи.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `job` | `T \| null` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `projectId` | `number \| null` | `обязательный` | ID проекта в API. |
| `options` | `Options<T>` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `["pending", "queued", "running"].includes`
- `useEffect`
- `useRef`

</details>
