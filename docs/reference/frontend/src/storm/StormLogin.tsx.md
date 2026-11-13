# frontend/src/storm/StormLogin.tsx

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **7**.

## StormLogin

[frontend/src/storm/StormLogin.tsx:25](../../../../../frontend/src/storm/StormLogin.tsx#L25)

```typescript
StormLogin() => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

В теле вызывает `code.trim`, `resetEmail.trim`, `useAuthStore`, `useEffect`, `useState`, `useToastStore`, `username.trim`.

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

<details>
<summary>Прямые вызовы в теле</summary>

- `code.trim`
- `resetEmail.trim`
- `useAuthStore`
- `useEffect`
- `useState`
- `useToastStore`
- `username.trim`

</details>

## StormLogin.startSso

[frontend/src/storm/StormLogin.tsx:69](../../../../../frontend/src/storm/StormLogin.tsx#L69)

```typescript
startSso() => void
```

В теле вызывает `window.location.assign`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `window.location.assign`

</details>

## StormLogin.handleForgot

[frontend/src/storm/StormLogin.tsx:77](../../../../../frontend/src/storm/StormLogin.tsx#L77)

```typescript
async handleForgot(e: FormEvent) => Promise<void>
```

В теле вызывает `e.preventDefault`, `getApiErrorMessage`, `pushToast`, `requestPasswordReset`, `resetEmail.trim`, `setResetBusy`, `setStage`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `e` | `FormEvent` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `e.preventDefault`
- `getApiErrorMessage`
- `pushToast`
- `requestPasswordReset`
- `resetEmail.trim`
- `setResetBusy`
- `setStage`

</details>

## StormLogin.backToLogin

[frontend/src/storm/StormLogin.tsx:93](../../../../../frontend/src/storm/StormLogin.tsx#L93)

```typescript
backToLogin() => void
```

В теле вызывает `setResetEmail`, `setStage`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setResetEmail`
- `setStage`

</details>

## StormLogin.handleSubmit

[frontend/src/storm/StormLogin.tsx:98](../../../../../frontend/src/storm/StormLogin.tsx#L98)

```typescript
async handleSubmit(e: FormEvent) => Promise<void>
```

В теле вызывает `e.preventDefault`, `err.message.trim`, `pushToast`, `setCode`, `setStage`, `signIn`, `username.trim`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `e` | `FormEvent` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `e.preventDefault`
- `err.message.trim`
- `pushToast`
- `setCode`
- `setStage`
- `signIn`
- `username.trim`

</details>

## StormLogin.handleVerify

[frontend/src/storm/StormLogin.tsx:116](../../../../../frontend/src/storm/StormLogin.tsx#L116)

```typescript
async handleVerify(e: FormEvent) => Promise<void>
```

В теле вызывает `code.trim`, `completeTwoFactor`, `e.preventDefault`, `err.message.trim`, `pushToast`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `e` | `FormEvent` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `code.trim`
- `completeTwoFactor`
- `e.preventDefault`
- `err.message.trim`
- `pushToast`

</details>

## StormLogin.backToCredentials

[frontend/src/storm/StormLogin.tsx:128](../../../../../frontend/src/storm/StormLogin.tsx#L128)

```typescript
backToCredentials() => void
```

В теле вызывает `setCode`, `setPassword`, `setStage`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setCode`
- `setPassword`
- `setStage`

</details>
