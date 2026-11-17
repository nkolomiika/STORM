# frontend/src/storm/StormDocs.tsx

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **9**.

## t

[frontend/src/storm/StormDocs.tsx:29](../../../../../frontend/src/storm/StormDocs.tsx#L29)

```typescript
t(source: string, values?: Record<string, string | number>) => string
```

Интерфейс документации локализован; Markdown-содержимое всегда русское.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `source` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `values` | `Record<string, string \| number>` | `undefined (optional)` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `string`.

<details>
<summary>Прямые вызовы в теле</summary>

- `translate`

</details>

## pagesWord

[frontend/src/storm/StormDocs.tsx:34](../../../../../frontend/src/storm/StormDocs.tsx#L34)

```typescript
pagesWord(n: number) => string
```

Русское склонение: 1 страница / 2 страницы / 5 страниц.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `n` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `string`.

<details>
<summary>Прямые вызовы в теле</summary>

- `useLangStore.getState`

</details>

## bodySnippet

[frontend/src/storm/StormDocs.tsx:44](../../../../../frontend/src/storm/StormDocs.tsx#L44)

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

[frontend/src/storm/StormDocs.tsx:59](../../../../../frontend/src/storm/StormDocs.tsx#L59)

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

[frontend/src/storm/StormDocs.tsx:82](../../../../../frontend/src/storm/StormDocs.tsx#L82)

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
- `t`
- `useLangStore`
- `useMemo`
- `useState`
- `visible.filter`
- `visible.filter(matches).sort`
- `visible.find`

</details>

## StormDocs.matches

[frontend/src/storm/StormDocs.tsx:91](../../../../../frontend/src/storm/StormDocs.tsx#L91)

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

[frontend/src/storm/StormDocs.tsx:103](../../../../../frontend/src/storm/StormDocs.tsx#L103)

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

[frontend/src/storm/StormDocs.tsx:104](../../../../../frontend/src/storm/StormDocs.tsx#L104)

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

[frontend/src/storm/StormDocs.tsx:108](../../../../../frontend/src/storm/StormDocs.tsx#L108)

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
