# frontend/src/storm/StormMarkdown.tsx

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **4**.

## StormMarkdown

[frontend/src/storm/StormMarkdown.tsx:7](../../../../../frontend/src/storm/StormMarkdown.tsx#L7)

```typescript
StormMarkdown({ value }: { value: string }) => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

GFM-таблицы, списки и изображения; HTML и опасные URL не исполняются.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `{ value }` | `{ value: string }` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

<details>
<summary>Прямые вызовы в теле</summary>

- `normalizeMarkdownForRender`

</details>

## StormMarkdown.table

[frontend/src/storm/StormMarkdown.tsx:10](../../../../../frontend/src/storm/StormMarkdown.tsx#L10)

```typescript
table({ children }) => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

Преобразование/вычисление в теле функции; тип результата и параметры приведены ниже, точное выражение доступно по ссылке на исходник.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `{ children }` | `ClassAttributes<HTMLTableElement> & TableHTMLAttributes<HTMLTableElement> & ExtraProps` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

## StormMarkdown.a

[frontend/src/storm/StormMarkdown.tsx:11](../../../../../frontend/src/storm/StormMarkdown.tsx#L11)

```typescript
a({ href, children }) => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

Преобразование/вычисление в теле функции; тип результата и параметры приведены ниже, точное выражение доступно по ссылке на исходник.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `{ href, children }` | `ClassAttributes<HTMLAnchorElement> & AnchorHTMLAttributes<HTMLAnchorElement> & ExtraProps` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

## StormMarkdown.img

[frontend/src/storm/StormMarkdown.tsx:12](../../../../../frontend/src/storm/StormMarkdown.tsx#L12)

```typescript
img({ src, alt, title }) => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element | null
```

В теле вызывает `imageTitleSize`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `{ src, alt, title }` | `ClassAttributes<HTMLImageElement> & ImgHTMLAttributes<HTMLImageElement> & ExtraProps` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element \| null`.

<details>
<summary>Прямые вызовы в теле</summary>

- `imageTitleSize`

</details>
