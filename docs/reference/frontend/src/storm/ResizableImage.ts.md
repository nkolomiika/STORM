# frontend/src/storm/ResizableImage.ts

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **21**.

## addProseMirrorPlugins

[frontend/src/storm/ResizableImage.ts:10](../../../../../frontend/src/storm/ResizableImage.ts#L10)

```typescript
addProseMirrorPlugins() => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/prosemirror-state/dist/index").Plugin<any>[]
```

В теле вызывает `imageCaretPlugin`, `this.parent`.

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/prosemirror-state/dist/index").Plugin<any>[]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `imageCaretPlugin`
- `this.parent`

</details>

## addAttributes

[frontend/src/storm/ResizableImage.ts:13](../../../../../frontend/src/storm/ResizableImage.ts#L13)

```typescript
addAttributes() => { title: { default: null; parseHTML: (element: HTMLElement) => string | null; }; width: { default: null; parseHTML: (element: HTMLElement) => number | null; }; }
```

В теле вызывает `this.parent`.

Возвращает: `{ title: { default: null; parseHTML: (element: HTMLElement) => string \| null; }; width: { default: null; parseHTML: (element: HTMLElement) => number \| null; }; }`.

<details>
<summary>Прямые вызовы в теле</summary>

- `this.parent`

</details>

## addAttributes.parseHTML

[frontend/src/storm/ResizableImage.ts:16](../../../../../frontend/src/storm/ResizableImage.ts#L16)

```typescript
parseHTML(element: HTMLElement) => string | null
```

В теле вызывает `element.getAttribute`, `imageTitleSize`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `element` | `HTMLElement` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `string \| null`.

<details>
<summary>Прямые вызовы в теле</summary>

- `element.getAttribute`
- `imageTitleSize`

</details>

## addAttributes.parseHTML

[frontend/src/storm/ResizableImage.ts:19](../../../../../frontend/src/storm/ResizableImage.ts#L19)

```typescript
parseHTML(element: HTMLElement) => number | null
```

В теле вызывает `Number`, `element.getAttribute`, `imageTitleSize`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `element` | `HTMLElement` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `number \| null`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Number`
- `element.getAttribute`
- `imageTitleSize`

</details>

## addStorage

[frontend/src/storm/ResizableImage.ts:23](../../../../../frontend/src/storm/ResizableImage.ts#L23)

```typescript
addStorage() => { markdown: { serialize: (state: { write: (value: string) => void; esc: (value: string) => string; }, node: PMNode) => void; }; }
```

Преобразование/вычисление в теле функции; тип результата и параметры приведены ниже, точное выражение доступно по ссылке на исходник.

Возвращает: `{ markdown: { serialize: (state: { write: (value: string) => void; esc: (value: string) => string; }, node: PMNode) => void; }; }`.

## addStorage.serialize

[frontend/src/storm/ResizableImage.ts:24](../../../../../frontend/src/storm/ResizableImage.ts#L24)

```typescript
serialize(state: { write: (value: string) => void; esc: (value: string) => string }, node: PMNode) => void
```

В теле вызывает `String`, `String(node.attrs.src ?? "").replace`, `sizedImageTitle`, `state.esc`, `state.write`, `title.replace`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `state` | `{ write: (value: string) => void; esc: (value: string) => string }` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `node` | `PMNode` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `String`
- `String(node.attrs.src ?? "").replace`
- `sizedImageTitle`
- `state.esc`
- `state.write`
- `title.replace`

</details>

## addNodeView

[frontend/src/storm/ResizableImage.ts:30](../../../../../frontend/src/storm/ResizableImage.ts#L30)

```typescript
addNodeView() => ({ node, editor, getPos }: NodeViewRendererProps) => { dom: HTMLSpanElement; selectNode: () => void; deselectNode: () => void; update: (next: PMNode) => boolean; stopEvent: (event: Event) => boolean; ignoreMutation: () => true; destroy: () => void; }
```

Преобразование/вычисление в теле функции; тип результата и параметры приведены ниже, точное выражение доступно по ссылке на исходник.

Возвращает: `({ node, editor, getPos }: NodeViewRendererProps) => { dom: HTMLSpanElement; selectNode: () => void; deselectNode: () => void; update: (next: PMNode) => boolean; stopEvent: (event: Event) => boolean; ignoreMutation: () => true; destroy: () => void; }`.

## addNodeView.select

[frontend/src/storm/ResizableImage.ts:46](../../../../../frontend/src/storm/ResizableImage.ts#L46)

```typescript
select(selected: boolean) => void
```

В теле вызывает `dom.classList.toggle`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `selected` | `boolean` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `dom.classList.toggle`

</details>

## addNodeView.paint

[frontend/src/storm/ResizableImage.ts:50](../../../../../frontend/src/storm/ResizableImage.ts#L50)

```typescript
paint() => void
```

В теле вызывает `imageTitleSize`, `markdownUrlTransform`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `imageTitleSize`
- `markdownUrlTransform`

</details>

## addNodeView.selectImage

[frontend/src/storm/ResizableImage.ts:56](../../../../../frontend/src/storm/ResizableImage.ts#L56)

```typescript
selectImage() => void
```

В теле вызывает `editor.commands.setNodeSelection`, `editor.view.focus`, `getPos`, `select`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `editor.commands.setNodeSelection`
- `editor.view.focus`
- `getPos`
- `select`

</details>

## addNodeView.move

[frontend/src/storm/ResizableImage.ts:84](../../../../../frontend/src/storm/ResizableImage.ts#L84)

```typescript
move(next: PointerEvent) => void
```

В теле вызывает `Math.abs`, `Math.max`, `Math.min`, `Math.round`, `corner.endsWith`, `corner.startsWith`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `next` | `PointerEvent` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Math.abs`
- `Math.max`
- `Math.min`
- `Math.round`
- `corner.endsWith`
- `corner.startsWith`

</details>

## addNodeView.removeListeners

[frontend/src/storm/ResizableImage.ts:90](../../../../../frontend/src/storm/ResizableImage.ts#L90)

```typescript
removeListeners() => void
```

В теле вызывает `document.removeEventListener`, `window.removeEventListener`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `document.removeEventListener`
- `window.removeEventListener`

</details>

## addNodeView.finish

[frontend/src/storm/ResizableImage.ts:97](../../../../../frontend/src/storm/ResizableImage.ts#L97)

```typescript
finish() => void
```

В теле вызывает `editor.state.tr.setNodeMarkup`, `editor.view.dispatch`, `getPos`, `removeListeners`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `editor.state.tr.setNodeMarkup`
- `editor.view.dispatch`
- `getPos`
- `removeListeners`

</details>

## addNodeView.cancel

[frontend/src/storm/ResizableImage.ts:102](../../../../../frontend/src/storm/ResizableImage.ts#L102)

```typescript
cancel() => void
```

В теле вызывает `paint`, `removeListeners`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `paint`
- `removeListeners`

</details>

## addNodeView.outside

[frontend/src/storm/ResizableImage.ts:110](../../../../../frontend/src/storm/ResizableImage.ts#L110)

```typescript
outside(event: PointerEvent) => void
```

В теле вызывает `dom.contains`, `dom.parentElement?.contains`, `editor.commands.setTextSelection`, `editor.state.doc.resolve`, `editor.view.focus`, `getPos`, `image.getBoundingClientRect`, `select`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `event` | `PointerEvent` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `dom.contains`
- `dom.parentElement?.contains`
- `editor.commands.setTextSelection`
- `editor.state.doc.resolve`
- `editor.view.focus`
- `getPos`
- `image.getBoundingClientRect`
- `select`

</details>

## addNodeView.selectNode

[frontend/src/storm/ResizableImage.ts:128](../../../../../frontend/src/storm/ResizableImage.ts#L128)

```typescript
selectNode() => void
```

В теле вызывает `select`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `select`

</details>

## addNodeView.deselectNode

[frontend/src/storm/ResizableImage.ts:129](../../../../../frontend/src/storm/ResizableImage.ts#L129)

```typescript
deselectNode() => void
```

В теле вызывает `select`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `select`

</details>

## addNodeView.update

[frontend/src/storm/ResizableImage.ts:130](../../../../../frontend/src/storm/ResizableImage.ts#L130)

```typescript
update(next: PMNode) => boolean
```

В теле вызывает `paint`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `next` | `PMNode` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `boolean`.

<details>
<summary>Прямые вызовы в теле</summary>

- `paint`

</details>

## addNodeView.stopEvent

[frontend/src/storm/ResizableImage.ts:132](../../../../../frontend/src/storm/ResizableImage.ts#L132)

```typescript
stopEvent(event: Event) => boolean
```

В теле вызывает `dom.contains`, `event.type.startsWith`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `event` | `Event` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `boolean`.

<details>
<summary>Прямые вызовы в теле</summary>

- `dom.contains`
- `event.type.startsWith`

</details>

## addNodeView.ignoreMutation

[frontend/src/storm/ResizableImage.ts:133](../../../../../frontend/src/storm/ResizableImage.ts#L133)

```typescript
ignoreMutation() => true
```

Преобразование/вычисление в теле функции; тип результата и параметры приведены ниже, точное выражение доступно по ссылке на исходник.

Возвращает: `true`.

## addNodeView.destroy

[frontend/src/storm/ResizableImage.ts:134](../../../../../frontend/src/storm/ResizableImage.ts#L134)

```typescript
destroy() => void
```

В теле вызывает `cleanupDrag`, `document.removeEventListener`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `cleanupDrag`
- `document.removeEventListener`

</details>
