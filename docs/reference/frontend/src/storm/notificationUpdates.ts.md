# frontend/src/storm/notificationUpdates.ts

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **4**.

## subscribeNotificationUpdates

[frontend/src/storm/notificationUpdates.ts:2](../../../../../frontend/src/storm/notificationUpdates.ts#L2)

```typescript
subscribeNotificationUpdates(refresh: () => Promise<void>, pollMs = 30_000) => () => void
```

Keep the bell current across live events, reconnects and missed deliveries.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `refresh` | `() => Promise<void>` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `pollMs` | `number` | `30_000` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `() => void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `connect`
- `reload`
- `setInterval`
- `window.addEventListener`

</details>

## subscribeNotificationUpdates.reload

[frontend/src/storm/notificationUpdates.ts:8](../../../../../frontend/src/storm/notificationUpdates.ts#L8)

```typescript
async reload() => Promise<void>
```

В теле вызывает `refresh`, `reload`.

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `refresh`
- `reload`

</details>

## subscribeNotificationUpdates.connect

[frontend/src/storm/notificationUpdates.ts:15](../../../../../frontend/src/storm/notificationUpdates.ts#L15)

```typescript
connect() => void
```

В теле вызывает `setTimeout`, `socket.addEventListener`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setTimeout`
- `socket.addEventListener`

</details>

## subscribeNotificationUpdates.onFocus

[frontend/src/storm/notificationUpdates.ts:30](../../../../../frontend/src/storm/notificationUpdates.ts#L30)

```typescript
onFocus() => void
```

В теле вызывает `reload`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `reload`

</details>
