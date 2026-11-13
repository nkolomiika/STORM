# frontend/src/storm/ImageCaret.ts

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **4**.

## imageCaretPosition

[frontend/src/storm/ImageCaret.ts:8](../../../../../frontend/src/storm/ImageCaret.ts#L8)

```typescript
imageCaretPosition(state: EditorState) => number | null
```

The browser can paint a full-height, split caret beside a non-editable image.
Keep the real text selection/input; replace only its visual indicator there.
A view decoration never becomes text in the document or saved Markdown.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `state` | `EditorState` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `number \| null`.

## imageCaretPlugin

[frontend/src/storm/ImageCaret.ts:15](../../../../../frontend/src/storm/ImageCaret.ts#L15)

```typescript
imageCaretPlugin() => Plugin<any>
```

Преобразование/вычисление в теле функции; тип результата и параметры приведены ниже, точное выражение доступно по ссылке на исходник.

Возвращает: `Plugin<any>`.

## imageCaretPlugin.attributes

[frontend/src/storm/ImageCaret.ts:18](../../../../../frontend/src/storm/ImageCaret.ts#L18)

```typescript
attributes(state) => Record<string, string>
```

В теле вызывает `imageCaretPosition`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `state` | `EditorState` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Record<string, string>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `imageCaretPosition`

</details>

## imageCaretPlugin.decorations

[frontend/src/storm/ImageCaret.ts:19](../../../../../frontend/src/storm/ImageCaret.ts#L19)

```typescript
decorations(state) => DecorationSet
```

В теле вызывает `Decoration.widget`, `DecorationSet.create`, `imageCaretPosition`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `state` | `EditorState` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `DecorationSet`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Decoration.widget`
- `DecorationSet.create`
- `imageCaretPosition`

</details>
