# frontend/src/storm/StormActivate.tsx

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **2**.

## StormActivate

[frontend/src/storm/StormActivate.tsx:38](../../../../../frontend/src/storm/StormActivate.tsx#L38)

```typescript
StormActivate() => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

В теле вызывает `USERNAME_RE.test`, `params.get`, `useAuthStore`, `useEffect`, `useMemo`, `useRef`, `useSearchParams`, `useState`; полный список ниже.

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

<details>
<summary>Прямые вызовы в теле</summary>

- `USERNAME_RE.test`
- `params.get`
- `useAuthStore`
- `useEffect`
- `useMemo`
- `useRef`
- `useSearchParams`
- `useState`
- `useToastStore`

</details>

## StormActivate.handleSubmit

[frontend/src/storm/StormActivate.tsx:125](../../../../../frontend/src/storm/StormActivate.tsx#L125)

```typescript
async handleSubmit(e: FormEvent) => Promise<void>
```

В теле вызывает `acceptInvitation`, `e.preventDefault`, `getApiErrorMessage`, `pushToast`, `refreshUser`, `setSubmitting`, `username.trim`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `e` | `FormEvent` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `acceptInvitation`
- `e.preventDefault`
- `getApiErrorMessage`
- `pushToast`
- `refreshUser`
- `setSubmitting`
- `username.trim`

</details>
