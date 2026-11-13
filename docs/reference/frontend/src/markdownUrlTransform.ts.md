# frontend/src/markdownUrlTransform.ts

Сгенерировано из объявлений кода. [Правила чтения](../../../METHODS.md).

Методов и именованных функций: **2**.

## markdownUrlTransform

[frontend/src/markdownUrlTransform.ts:9](../../../../frontend/src/markdownUrlTransform.ts#L9)

```typescript
markdownUrlTransform(url: string) => string
```

Разрешает data:image (вставка картинок в Markdown) и ведёт себя как {@link defaultUrlTransform} для остальных URL.
Whitelist: только base64-кодированные image/* с известными типами. data:text/html и любые иные mime отсекаются.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `url` | `string` | `обязательный` | URL обрабатываемого ресурса. |

Возвращает: `string`.

<details>
<summary>Прямые вызовы в теле</summary>

- `SAFE_IMAGE_DATA_URL_RE.test`
- `defaultUrlTransform`
- `trimmed.toLowerCase`
- `trimmed.toLowerCase().startsWith`
- `url.trim`

</details>

## normalizeMarkdownForRender

[frontend/src/markdownUrlTransform.ts:27](../../../../frontend/src/markdownUrlTransform.ts#L27)

```typescript
normalizeMarkdownForRender(value: string | null | undefined) => string
```

Нормализует markdown перед рендером: каждая markdown-картинка должна быть
отделена от соседнего текста пустой строкой, иначе react-markdown склеит их
в один абзац (картинка окажется на одной строке с текстом).

Используется как для просмотра, так и для legacy-данных, у которых при
сохранении не было `\n\n` вокруг картинок.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `value` | `string \| null \| undefined` | `обязательный` | Входное значение преобразования/проверки. |

Возвращает: `string`.

<details>
<summary>Прямые вызовы в теле</summary>

- `normalized.replace`
- `value.replace`

</details>
