# frontend/src/storm/StormLogin.tsx

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **7**.

## StormLogin

[frontend/src/storm/StormLogin.tsx:26](../../../../../frontend/src/storm/StormLogin.tsx#L26)

```typescript
StormLogin() => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

В теле вызывает `code.trim`, `resetEmail.trim`, `t`, `useAuthStore`, `useEffect`, `useLangStore`, `useState`, `useToastStore`; полный список ниже.

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

<details>
<summary>Прямые вызовы в теле</summary>

- `code.trim`
- `resetEmail.trim`
- `t`
- `useAuthStore`
- `useEffect`
- `useLangStore`
- `useState`
- `useToastStore`
- `username.trim`

</details>

## StormLogin.startSso

[frontend/src/storm/StormLogin.tsx:71](../../../../../frontend/src/storm/StormLogin.tsx#L71)

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

[frontend/src/storm/StormLogin.tsx:79](../../../../../frontend/src/storm/StormLogin.tsx#L79)

```typescript
async handleForgot(e: FormEvent) => Promise<void>
```

В теле вызывает `e.preventDefault`, `getApiErrorMessage`, `pushToast`, `requestPasswordReset`, `resetEmail.trim`, `setResetBusy`, `setStage`, `t`.

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
- `t`

</details>

## StormLogin.backToLogin

[frontend/src/storm/StormLogin.tsx:95](../../../../../frontend/src/storm/StormLogin.tsx#L95)

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

[frontend/src/storm/StormLogin.tsx:100](../../../../../frontend/src/storm/StormLogin.tsx#L100)

```typescript
async handleSubmit(e: FormEvent) => Promise<void>
```

В теле вызывает `e.preventDefault`, `err.message.trim`, `pushToast`, `setCode`, `setStage`, `signIn`, `t`, `username.trim`.

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
- `t`
- `username.trim`

</details>

## StormLogin.handleVerify

[frontend/src/storm/StormLogin.tsx:118](../../../../../frontend/src/storm/StormLogin.tsx#L118)

```typescript
async handleVerify(e: FormEvent) => Promise<void>
```

В теле вызывает `code.trim`, `completeTwoFactor`, `e.preventDefault`, `err.message.trim`, `pushToast`, `t`.

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
- `t`

</details>

## StormLogin.backToCredentials

[frontend/src/storm/StormLogin.tsx:130](../../../../../frontend/src/storm/StormLogin.tsx#L130)

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
