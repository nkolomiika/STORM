# frontend/src/storm/SwaggerEndpointImport.tsx

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **5**.

## readJson

[frontend/src/storm/SwaggerEndpointImport.tsx:11](../../../../../frontend/src/storm/SwaggerEndpointImport.tsx#L11)

```typescript
readJson(file: File) => Promise<unknown>
```

Преобразование/вычисление в теле функции; тип результата и параметры приведены ниже, точное выражение доступно по ссылке на исходник.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `file` | `File` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<unknown>`.

## SwaggerEndpointImport

[frontend/src/storm/SwaggerEndpointImport.tsx:21](../../../../../frontend/src/storm/SwaggerEndpointImport.tsx#L21)

```typescript
SwaggerEndpointImport({ onParsed, disabled = false }: { disabled?: boolean; onParsed: (lines: string[]) => void }) => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

В теле вызывает `createPortal`, `t`, `useEffect`, `useRef`, `useState`, `useToastStore`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `{ onParsed, disabled = false }` | `{ disabled?: boolean; onParsed: (lines: string[]) => void }` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

<details>
<summary>Прямые вызовы в теле</summary>

- `createPortal`
- `t`
- `useEffect`
- `useRef`
- `useState`
- `useToastStore`

</details>

## SwaggerEndpointImport.close

[frontend/src/storm/SwaggerEndpointImport.tsx:31](../../../../../frontend/src/storm/SwaggerEndpointImport.tsx#L31)

```typescript
close() => void
```

В теле вызывает `setBusy`, `setOpen`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setBusy`
- `setOpen`

</details>

## SwaggerEndpointImport.onKey

[frontend/src/storm/SwaggerEndpointImport.tsx:34](../../../../../frontend/src/storm/SwaggerEndpointImport.tsx#L34)

```typescript
onKey(event: KeyboardEvent) => void
```

В теле вызывает `setBusy`, `setOpen`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `event` | `KeyboardEvent` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setBusy`
- `setOpen`

</details>

## SwaggerEndpointImport.load

[frontend/src/storm/SwaggerEndpointImport.tsx:38](../../../../../frontend/src/storm/SwaggerEndpointImport.tsx#L38)

```typescript
async load(files: File[]) => Promise<void>
```

В теле вызывает `Promise.all`, `files.map`, `files.reduce`, `files.some`, `getApiErrorMessage`, `onParsed`, `parseSwaggerDocuments`, `pushToast`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `files` | `File[]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<void>`.

Явные throw в теле:

```typescript
new UserInputError(t("Choose up to 32 JSON files, 2 MB each, 8 MB total"))
new UserInputError(t("Choose JSON files"))
```

<details>
<summary>Прямые вызовы в теле</summary>

- `Promise.all`
- `files.map`
- `files.reduce`
- `files.some`
- `getApiErrorMessage`
- `onParsed`
- `parseSwaggerDocuments`
- `pushToast`
- `setBusy`
- `setOpen`
- `t`

</details>
