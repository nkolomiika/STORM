# frontend/src/storm/StormSelect.tsx

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **3**.

## StormSelect

[frontend/src/storm/StormSelect.tsx:27](../../../../../frontend/src/storm/StormSelect.tsx#L27)

```typescript
StormSelect({ value, options, onChange, id, placeholder }: StormSelectProps) => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

В теле вызывает `options.find`, `options.map`, `t`, `useEffect`, `useLangStore`, `useRef`, `useState`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `{ value, options, onChange, id, placeholder }` | `StormSelectProps` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

<details>
<summary>Прямые вызовы в теле</summary>

- `options.find`
- `options.map`
- `t`
- `useEffect`
- `useLangStore`
- `useRef`
- `useState`

</details>

## StormSelect.onDown

[frontend/src/storm/StormSelect.tsx:37](../../../../../frontend/src/storm/StormSelect.tsx#L37)

```typescript
onDown(e: MouseEvent) => void
```

В теле вызывает `rootRef.current.contains`, `setOpen`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `e` | `MouseEvent` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `rootRef.current.contains`
- `setOpen`

</details>

## StormSelect.onKey

[frontend/src/storm/StormSelect.tsx:40](../../../../../frontend/src/storm/StormSelect.tsx#L40)

```typescript
onKey(e: KeyboardEvent) => void
```

В теле вызывает `e.stopPropagation`, `setOpen`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `e` | `KeyboardEvent` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `e.stopPropagation`
- `setOpen`

</details>
