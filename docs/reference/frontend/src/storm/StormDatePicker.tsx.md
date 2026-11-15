# frontend/src/storm/StormDatePicker.tsx

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **9**.

## pad

[frontend/src/storm/StormDatePicker.tsx:21](../../../../../frontend/src/storm/StormDatePicker.tsx#L21)

```typescript
pad(n: number) => string
```

В теле вызывает `String`, `String(n).padStart`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `n` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `string`.

<details>
<summary>Прямые вызовы в теле</summary>

- `String`
- `String(n).padStart`

</details>

## toISO

[frontend/src/storm/StormDatePicker.tsx:22](../../../../../frontend/src/storm/StormDatePicker.tsx#L22)

```typescript
toISO(y: number, m: number, d: number) => string
```

В теле вызывает `pad`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `y` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `m` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `d` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `string`.

<details>
<summary>Прямые вызовы в теле</summary>

- `pad`

</details>

## toDisplay

[frontend/src/storm/StormDatePicker.tsx:24](../../../../../frontend/src/storm/StormDatePicker.tsx#L24)

```typescript
toDisplay(iso: string) => string
```

yyyy-mm-dd -> dd.mm.yyyy for display (matches the rest of the app).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `iso` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `string`.

<details>
<summary>Прямые вызовы в теле</summary>

- `iso.split`

</details>

## StormDatePicker

[frontend/src/storm/StormDatePicker.tsx:29](../../../../../frontend/src/storm/StormDatePicker.tsx#L29)

```typescript
StormDatePicker({ value, onChange, min, max, placeholder = "Select date", id }: Props) => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

В теле вызывает `WEEKDAYS[lang].map`, `cells.map`, `disabled`, `new Intl.DateTimeFormat(lang, { month: "long" }).format`, `t`, `toDisplay`, `toISO`, `today.getDate`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `{ value, onChange, min, max, placeholder = "Select date", id }` | `Props` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

<details>
<summary>Прямые вызовы в теле</summary>

- `WEEKDAYS[lang].map`
- `cells.map`
- `disabled`
- `new Intl.DateTimeFormat(lang, { month: "long" }).format`
- `t`
- `toDisplay`
- `toISO`
- `today.getDate`
- `today.getFullYear`
- `today.getMonth`
- `useEffect`
- `useLangStore`
- `useMemo`
- `useRef`
- `useState`

</details>

## StormDatePicker.onDown

[frontend/src/storm/StormDatePicker.tsx:55](../../../../../frontend/src/storm/StormDatePicker.tsx#L55)

```typescript
onDown(e: MouseEvent) => void
```

В теле вызывает `setOpen`, `wrapRef.current.contains`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `e` | `MouseEvent` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setOpen`
- `wrapRef.current.contains`

</details>

## StormDatePicker.onKey

[frontend/src/storm/StormDatePicker.tsx:58](../../../../../frontend/src/storm/StormDatePicker.tsx#L58)

```typescript
onKey(e: KeyboardEvent) => void
```

В теле вызывает `setOpen`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `e` | `KeyboardEvent` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setOpen`

</details>

## StormDatePicker.disabled

[frontend/src/storm/StormDatePicker.tsx:79](../../../../../frontend/src/storm/StormDatePicker.tsx#L79)

```typescript
disabled(iso: string) => boolean
```

Преобразование/вычисление в теле функции; тип результата и параметры приведены ниже, точное выражение доступно по ссылке на исходник.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `iso` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `boolean`.

## StormDatePicker.prevMonth

[frontend/src/storm/StormDatePicker.tsx:80](../../../../../frontend/src/storm/StormDatePicker.tsx#L80)

```typescript
prevMonth() => void
```

В теле вызывает `setView`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setView`

</details>

## StormDatePicker.nextMonth

[frontend/src/storm/StormDatePicker.tsx:81](../../../../../frontend/src/storm/StormDatePicker.tsx#L81)

```typescript
nextMonth() => void
```

В теле вызывает `setView`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setView`

</details>
