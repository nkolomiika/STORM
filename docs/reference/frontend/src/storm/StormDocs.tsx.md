# frontend/src/storm/StormDocs.tsx

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **8**.

## pagesWord

[frontend/src/storm/StormDocs.tsx:27](../../../../../frontend/src/storm/StormDocs.tsx#L27)

```typescript
pagesWord(n: number) => string
```

Русское склонение: 1 страница / 2 страницы / 5 страниц.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `n` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `string`.

## bodySnippet

[frontend/src/storm/StormDocs.tsx:36](../../../../../frontend/src/storm/StormDocs.tsx#L36)

```typescript
bodySnippet(body: string, q: string) => string | null
```

Выдержка из тела главы вокруг первого совпадения — чтобы было видно, ЧЕМ
нашлось при поиске по содержимому. Markdown-разметка вычищается для читаемости.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `body` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `q` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `string \| null`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Math.max`
- `Math.min`
- `body .slice`
- `body .slice(start, end) .replace`
- `body .slice(start, end) .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1") // ссылки/картинки → текст .replace`
- `body .slice(start, end) .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1") // ссылки/картинки → текст .replace(/[`#>*_|[\]]/g, " ") // прочий markdown-шум .replace`
- `body .slice(start, end) .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1") // ссылки/картинки → текст .replace(/[`#>*_|[\]]/g, " ") // прочий markdown-шум .replace(/\s+/g, " ") .trim`
- `body.toLowerCase`
- `body.toLowerCase().indexOf`

</details>

## highlight

[frontend/src/storm/StormDocs.tsx:51](../../../../../frontend/src/storm/StormDocs.tsx#L51)

```typescript
highlight(text: string, q: string) => ReactNode
```

Подсвечивает вхождения запроса (регистронезависимо) в тексте.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `text` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `q` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `ReactNode`.

<details>
<summary>Прямые вызовы в теле</summary>

- `lower.indexOf`
- `out.push`
- `text.slice`
- `text.toLowerCase`

</details>

## StormDocs

[frontend/src/storm/StormDocs.tsx:74](../../../../../frontend/src/storm/StormDocs.tsx#L74)

```typescript
StormDocs({ isAdmin, onNavigateWorkspace }: Props) => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

В теле вызывает `DOC_GROUPS.find`, `DOC_GROUPS.map`, `DOC_GROUPS.map((g) => ({ ...g, chapters: visible.filter((c) => c.audience === g.audience && matches(c)), })).filter`, `groups.map`, `normalizeMarkdownForRender`, `pagesWord`, `query.trim`, `query.trim().toLowerCase`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `{ isAdmin, onNavigateWorkspace }` | `Props` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

<details>
<summary>Прямые вызовы в теле</summary>

- `DOC_GROUPS.find`
- `DOC_GROUPS.map`
- `DOC_GROUPS.map((g) => ({ ...g, chapters: visible.filter((c) => c.audience === g.audience && matches(c)), })).filter`
- `groups.map`
- `normalizeMarkdownForRender`
- `pagesWord`
- `query.trim`
- `query.trim().toLowerCase`
- `searchResults.map`
- `useMemo`
- `useState`
- `visible.filter`
- `visible.filter(matches).sort`
- `visible.find`

</details>

## StormDocs.matches

[frontend/src/storm/StormDocs.tsx:82](../../../../../frontend/src/storm/StormDocs.tsx#L82)

```typescript
matches(c: DocChapter) => boolean
```

В теле вызывает `c.body.toLowerCase`, `c.body.toLowerCase().includes`, `c.title.toLowerCase`, `c.title.toLowerCase().includes`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `c` | `DocChapter` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `boolean`.

<details>
<summary>Прямые вызовы в теле</summary>

- `c.body.toLowerCase`
- `c.body.toLowerCase().includes`
- `c.title.toLowerCase`
- `c.title.toLowerCase().includes`

</details>

## StormDocs.goHome

[frontend/src/storm/StormDocs.tsx:94](../../../../../frontend/src/storm/StormDocs.tsx#L94)

```typescript
goHome() => void
```

В теле вызывает `setActiveId`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setActiveId`

</details>

## StormDocs.openCategory

[frontend/src/storm/StormDocs.tsx:95](../../../../../frontend/src/storm/StormDocs.tsx#L95)

```typescript
openCategory(audience: string) => void
```

В теле вызывает `setActiveId`, `visible.find`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `audience` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setActiveId`
- `visible.find`

</details>

## StormDocs.toggleGroup

[frontend/src/storm/StormDocs.tsx:99](../../../../../frontend/src/storm/StormDocs.tsx#L99)

```typescript
toggleGroup(audience: string) => void
```

В теле вызывает `setCollapsed`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `audience` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setCollapsed`

</details>
