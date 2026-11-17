# frontend/src/storm/StormMarkdownEditor.tsx

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **4**.

## getMarkdown

[frontend/src/storm/StormMarkdownEditor.tsx:35](../../../../../frontend/src/storm/StormMarkdownEditor.tsx#L35)

```typescript
getMarkdown(storage: unknown) => string
```

tiptap-markdown hangs its serialiser off the editor's storage.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `storage` | `unknown` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `string`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(storage as { markdown?: { getMarkdown: () => string } }).markdown?.getMarkdown`

</details>

## StormMarkdownEditor

[frontend/src/storm/StormMarkdownEditor.tsx:38](../../../../../frontend/src/storm/StormMarkdownEditor.tsx#L38)

```typescript
StormMarkdownEditor({ value, onChange, placeholder = "", minHeight = 260, onImagePaste }: Props) => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

В теле вызывает `useEditor`, `useEffect`, `useMemo`, `useRef`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `{ value, onChange, placeholder = "", minHeight = 260, onImagePaste }` | `Props` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

<details>
<summary>Прямые вызовы в теле</summary>

- `useEditor`
- `useEffect`
- `useMemo`
- `useRef`

</details>

## StormMarkdownEditor.handlePaste

[frontend/src/storm/StormMarkdownEditor.tsx:78](../../../../../frontend/src/storm/StormMarkdownEditor.tsx#L78)

```typescript
handlePaste(_view, event) => boolean
```

В теле вызывает `Array.from`, `Array.from(event.clipboardData?.files ?? []).filter`, `cb`, `event.preventDefault`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `_view` | `EditorView` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `event` | `ClipboardEvent` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `boolean`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Array.from`
- `Array.from(event.clipboardData?.files ?? []).filter`
- `cb`
- `event.preventDefault`

</details>

## StormMarkdownEditor.onUpdate

[frontend/src/storm/StormMarkdownEditor.tsx:88](../../../../../frontend/src/storm/StormMarkdownEditor.tsx#L88)

```typescript
onUpdate({ editor: ed }) => void
```

В теле вызывает `getMarkdown`, `onChange`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `{ editor: ed }` | `{ editor: Editor; transaction: Transaction; appendedTransactions: Transaction[]; }` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `getMarkdown`
- `onChange`

</details>
