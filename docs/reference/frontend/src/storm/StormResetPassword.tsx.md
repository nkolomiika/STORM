# frontend/src/storm/StormResetPassword.tsx

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **2**.

## StormResetPassword

[frontend/src/storm/StormResetPassword.tsx:30](../../../../../frontend/src/storm/StormResetPassword.tsx#L30)

```typescript
StormResetPassword() => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

В теле вызывает `params.get`, `t`, `useEffect`, `useLangStore`, `useNavigate`, `useSearchParams`, `useState`, `useToastStore`.

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

<details>
<summary>Прямые вызовы в теле</summary>

- `params.get`
- `t`
- `useEffect`
- `useLangStore`
- `useNavigate`
- `useSearchParams`
- `useState`
- `useToastStore`

</details>

## StormResetPassword.handleSubmit

[frontend/src/storm/StormResetPassword.tsx:72](../../../../../frontend/src/storm/StormResetPassword.tsx#L72)

```typescript
async handleSubmit(e: FormEvent) => Promise<void>
```

В теле вызывает `confirmPasswordReset`, `e.preventDefault`, `getApiErrorMessage`, `navigate`, `pushToast`, `setSubmitting`, `t`.

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
- `t`

</details>
