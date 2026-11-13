# frontend/src/storm/StormResetPassword.tsx

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **2**.

## StormResetPassword

[frontend/src/storm/StormResetPassword.tsx:29](../../../../../frontend/src/storm/StormResetPassword.tsx#L29)

```typescript
StormResetPassword() => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

В теле вызывает `params.get`, `useEffect`, `useNavigate`, `useSearchParams`, `useState`, `useToastStore`.

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

<details>
<summary>Прямые вызовы в теле</summary>

- `params.get`
- `useEffect`
- `useNavigate`
- `useSearchParams`
- `useState`
- `useToastStore`

</details>

## StormResetPassword.handleSubmit

[frontend/src/storm/StormResetPassword.tsx:70](../../../../../frontend/src/storm/StormResetPassword.tsx#L70)

```typescript
async handleSubmit(e: FormEvent) => Promise<void>
```

В теле вызывает `confirmPasswordReset`, `e.preventDefault`, `getApiErrorMessage`, `navigate`, `pushToast`, `setSubmitting`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `e` | `FormEvent` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `confirmPasswordReset`
- `e.preventDefault`
- `getApiErrorMessage`
- `navigate`
- `pushToast`
- `setSubmitting`

</details>
