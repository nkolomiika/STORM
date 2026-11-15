# frontend/src/storm/StormAppSecFields.tsx

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **6**.

## fio2fi

[frontend/src/storm/StormAppSecFields.tsx:17](../../../../../frontend/src/storm/StormAppSecFields.tsx#L17)

```typescript
fio2fi(s: string | null | undefined) => string
```

Отображаем только ФИ (Фамилия Имя) — первые два слова ФИО. Для IAM-логина
без пробелов возвращаем как есть. Хранимое значение (username) не меняется.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `s` | `string \| null \| undefined` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `string`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(s || "").trim`
- `(s || "").trim().split`
- `(s || "").trim().split(/\s+/).filter`
- `(s || "").trim().split(/\s+/).filter(Boolean).slice`
- `(s || "").trim().split(/\s+/).filter(Boolean).slice(0, 2).join`

</details>

## emptyAppsecFields

[frontend/src/storm/StormAppSecFields.tsx:31](../../../../../frontend/src/storm/StormAppSecFields.tsx#L31)

```typescript
emptyAppsecFields() => AppSecFieldsValue
```

Преобразование/вычисление в теле функции; тип результата и параметры приведены ниже, точное выражение доступно по ссылке на исходник.

Возвращает: `AppSecFieldsValue`.

## Typeahead

[frontend/src/storm/StormAppSecFields.tsx:40](../../../../../frontend/src/storm/StormAppSecFields.tsx#L40)

```typescript
Typeahead({ label, placeholder, value, fetchOptions, onPick, clearOnPick = false, }: { label: string; placeholder: string; value: string; fetchOptions: (q: string) => Promise<Opt[]>; onPick: (opt: Opt) => void; clearOnPick?: boolean; }) => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

В теле вызывает `opts.slice`, `opts.slice(0, 5).map`, `useEffect`, `useRef`, `useState`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `{ label, placeholder, value, fetchOptions, onPick, clearOnPick = false, }` | `{ label: string; placeholder: string; value: string; fetchOptions: (q: string) => Promise<Opt[]>; onPick: (opt: Opt) => void; clearOnPick?: boolean; }` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

<details>
<summary>Прямые вызовы в теле</summary>

- `opts.slice`
- `opts.slice(0, 5).map`
- `useEffect`
- `useRef`
- `useState`

</details>

## TicketField

[frontend/src/storm/StormAppSecFields.tsx:144](../../../../../frontend/src/storm/StormAppSecFields.tsx#L144)

```typescript
TicketField({ url, taskKey, onChange, t, }: { url: string; taskKey: string | null; onChange: (patch: { appsec_ticket_url: string | null; appsec_ticket_key: string | null }) => void; t: (s: string) => string; }) => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

В теле вызывает `looksLikeUrl`, `opts.map`, `t`, `useEffect`, `useId`, `useRef`, `useState`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `{ url, taskKey, onChange, t, }` | `{ url: string; taskKey: string \| null; onChange: (patch: { appsec_ticket_url: string \| null; appsec_ticket_key: string \| null }) => void; t: (s: string) => string; }` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

<details>
<summary>Прямые вызовы в теле</summary>

- `looksLikeUrl`
- `opts.map`
- `t`
- `useEffect`
- `useId`
- `useRef`
- `useState`

</details>

## TicketField.looksLikeUrl

[frontend/src/storm/StormAppSecFields.tsx:165](../../../../../frontend/src/storm/StormAppSecFields.tsx#L165)

```typescript
looksLikeUrl(s: string) => boolean
```

В теле вызывает `/^https?:\/\//i.test`, `s.trim`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `s` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `boolean`.

<details>
<summary>Прямые вызовы в теле</summary>

- `/^https?:\/\//i.test`
- `s.trim`

</details>

## StormAppSecFields

[frontend/src/storm/StormAppSecFields.tsx:257](../../../../../frontend/src/storm/StormAppSecFields.tsx#L257)

```typescript
StormAppSecFields({ value, onChange, works, t, }: { value: AppSecFieldsValue; onChange: (patch: Partial<AppSecFieldsValue>) => void; // true — показывать поля экспорта в Works (компонент/версия/исполнитель). // Поле тикета показывается всегда (нужно для отчёта независимо от Works). works: boolean; t: (s: string) => string; }) => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

В теле вызывает `fio2fi`, `t`, `value.appsec_versions.map`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `{ value, onChange, works, t, }` | `{ value: AppSecFieldsValue; onChange: (patch: Partial<AppSecFieldsValue>) => void; // true — показывать поля экспорта в Works (компонент/версия/исполнитель). // Поле тикета показывается всегда (нужно для отчёта независимо от Works). works: boolean; t: (s: string) => string; }` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

<details>
<summary>Прямые вызовы в теле</summary>

- `fio2fi`
- `t`
- `value.appsec_versions.map`

</details>
