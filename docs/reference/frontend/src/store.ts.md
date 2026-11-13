# frontend/src/store.ts

Сгенерировано из объявлений кода. [Правила чтения](../../../METHODS.md).

Методов и именованных функций: **8**.

## initialize

[frontend/src/store.ts:41](../../../../frontend/src/store.ts#L41)

```typescript
async initialize() => Promise<void>
```

В теле вызывает `get`, `getMe`, `set`.

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `get`
- `getMe`
- `set`

</details>

## signIn

[frontend/src/store.ts:53](../../../../frontend/src/store.ts#L53)

```typescript
async signIn(username, password) => Promise<{ status: "2fa_required"; user?: undefined; } | { status: "ok"; user: User; }>
```

В теле вызывает `getApiErrorMessage`, `getMe`, `login`, `set`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `username` | `string` | `обязательный` | Имя пользователя. |
| `password` | `string` | `обязательный` | Пароль, передаваемый в операцию. |

Возвращает: `Promise<{ status: "2fa_required"; user?: undefined; } \| { status: "ok"; user: User; }>`.

Явные throw в теле:

```typescript
new Error(message)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `getApiErrorMessage`
- `getMe`
- `login`
- `set`

</details>

## completeTwoFactor

[frontend/src/store.ts:71](../../../../frontend/src/store.ts#L71)

```typescript
async completeTwoFactor(code) => Promise<User>
```

В теле вызывает `getApiErrorMessage`, `getMe`, `set`, `verifyTwoFactor`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `code` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<User>`.

Явные throw в теле:

```typescript
new Error(message)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `getApiErrorMessage`
- `getMe`
- `set`
- `verifyTwoFactor`

</details>

## signOut

[frontend/src/store.ts:84](../../../../frontend/src/store.ts#L84)

```typescript
async signOut() => Promise<void>
```

В теле вызывает `logout`, `set`.

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `logout`
- `set`

</details>

## setUser

[frontend/src/store.ts:88](../../../../frontend/src/store.ts#L88)

```typescript
setUser(user) => void
```

В теле вызывает `set`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `user` | `User \| null` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `set`

</details>

## refreshUser

[frontend/src/store.ts:89](../../../../frontend/src/store.ts#L89)

```typescript
async refreshUser() => Promise<User | null>
```

В теле вызывает `getMe`, `set`.

Возвращает: `Promise<User \| null>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `getMe`
- `set`

</details>

## pushToast

[frontend/src/store.ts:104](../../../../frontend/src/store.ts#L104)

```typescript
pushToast(message, severity = "error") => void
```

В теле вызывает `set`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `message` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `severity` | `ToastSeverity \| undefined` | `"error"` | Критичность находки (Enum Severity). |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `set`

</details>

## dismissToast

[frontend/src/store.ts:109](../../../../frontend/src/store.ts#L109)

```typescript
dismissToast(id) => void
```

В теле вызывает `set`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `id` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `set`

</details>
