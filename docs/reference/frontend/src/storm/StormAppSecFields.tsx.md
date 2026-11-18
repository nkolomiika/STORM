# frontend/src/storm/StormAppSecFields.tsx

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **7**.

## fio2fi

[frontend/src/storm/StormAppSecFields.tsx:19](../../../../../frontend/src/storm/StormAppSecFields.tsx#L19)

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

[frontend/src/storm/StormAppSecFields.tsx:35](../../../../../frontend/src/storm/StormAppSecFields.tsx#L35)

```typescript
emptyAppsecFields() => AppSecFieldsValue
```

Преобразование/вычисление в теле функции; тип результата и параметры приведены ниже, точное выражение доступно по ссылке на исходник.

Возвращает: `AppSecFieldsValue`.

## appsecMetadataFromTask

[frontend/src/storm/StormAppSecFields.tsx:40](../../../../../frontend/src/storm/StormAppSecFields.tsx#L40)

```typescript
appsecMetadataFromTask(task?: TaskTrackerTask) => Partial<AppSecFieldsValue>
```

Переносит метаданные продукта из APPSEC, не подменяя исполнителя проекта.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `task` | `TaskTrackerTask` | `undefined (optional)` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Partial<AppSecFieldsValue>`.

## Typeahead

[frontend/src/storm/StormAppSecFields.tsx:56](../../../../../frontend/src/storm/StormAppSecFields.tsx#L56)

```typescript
Typeahead({ label, placeholder, value, fetchOptions, onPick, clearOnPick = false, onInputChange, codeAsValue = false, t, }: { label: string; placeholder: string; value: string; fetchOptions: (q: string) => Promise<Opt[]>; onPick: (opt: Opt) => void; clearOnPick?: boolean; onInputChange?: (value: string) => void; codeAsValue?: boolean; t: (s: string) => string; }) => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

В теле вызывает `opts.slice`, `opts.slice(0, 5).map`, `useEffect`, `useId`, `useRef`, `useState`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `{ label, placeholder, value, fetchOptions, onPick, clearOnPick = false, onInputChange, codeAsValue = false, t, }` | `{ label: string; placeholder: string; value: string; fetchOptions: (q: string) => Promise<Opt[]>; onPick: (opt: Opt) => void; clearOnPick?: boolean; onInputChange?: (value: string) => void; codeAsValue?: boolean; t: (s: string) => string; }` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

<details>
<summary>Прямые вызовы в теле</summary>

- `opts.slice`
- `opts.slice(0, 5).map`
- `useEffect`
- `useId`
- `useRef`
- `useState`

</details>

## TicketField

[frontend/src/storm/StormAppSecFields.tsx:177](../../../../../frontend/src/storm/StormAppSecFields.tsx#L177)

```typescript
TicketField({ url, taskKey, onChange, t, }: { url: string; taskKey: string | null; onChange: (patch: Partial<AppSecFieldsValue>) => void; t: (s: string) => string; }) => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

В теле вызывает `looksLikeUrl`, `opts.map`, `t`, `useEffect`, `useId`, `useRef`, `useState`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `{ url, taskKey, onChange, t, }` | `{ url: string; taskKey: string \| null; onChange: (patch: Partial<AppSecFieldsValue>) => void; t: (s: string) => string; }` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

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

[frontend/src/storm/StormAppSecFields.tsx:200](../../../../../frontend/src/storm/StormAppSecFields.tsx#L200)

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

[frontend/src/storm/StormAppSecFields.tsx:307](../../../../../frontend/src/storm/StormAppSecFields.tsx#L307)

```typescript
StormAppSecFields({ value, onChange, works, t, }: { value: AppSecFieldsValue; onChange: (patch: Partial<AppSecFieldsValue>) => void; // true — показывать поля экспорта в Works (компонент/версия/исполнитель). // Поле тикета показывается всегда (нужно для отчёта независимо от Works). works: boolean; t: (s: string) => string; }) => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

В теле вызывает `fio2fi`, `t`, `value.appsec_components.map`, `value.appsec_versions.map`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `{ value, onChange, works, t, }` | `{ value: AppSecFieldsValue; onChange: (patch: Partial<AppSecFieldsValue>) => void; // true — показывать поля экспорта в Works (компонент/версия/исполнитель). // Поле тикета показывается всегда (нужно для отчёта независимо от Works). works: boolean; t: (s: string) => string; }` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

<details>
<summary>Прямые вызовы в теле</summary>

- `fio2fi`
- `t`
- `value.appsec_components.map`
- `value.appsec_versions.map`

</details>
