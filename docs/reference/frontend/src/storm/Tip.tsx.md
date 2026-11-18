# frontend/src/storm/Tip.tsx

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **3**.

## Tip

[frontend/src/storm/Tip.tsx:5](../../../../../frontend/src/storm/Tip.tsx#L5)

```typescript
Tip({ label, children }: { label: string; children: ReactNode }) => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

Общая подсказка для кнопок действий, включая недоступные.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `{ label, children }` | `{ label: string; children: ReactNode }` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

<details>
<summary>Прямые вызовы в теле</summary>

- `createPortal`
- `useEffect`
- `useRef`
- `useState`

</details>

## Tip.restoreTitles

[frontend/src/storm/Tip.tsx:7](../../../../../frontend/src/storm/Tip.tsx#L7)

```typescript
restoreTitles() => void
```

В теле вызывает `titles.current.clear`, `titles.current.forEach`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `titles.current.clear`
- `titles.current.forEach`

</details>

## Tip.hide

[frontend/src/storm/Tip.tsx:12](../../../../../frontend/src/storm/Tip.tsx#L12)

```typescript
hide() => void
```

В теле вызывает `restoreTitles`, `setBox`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `restoreTitles`
- `setBox`

</details>
