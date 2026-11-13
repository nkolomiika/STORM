# frontend/src/storm/imageSize.ts

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **2**.

## imageTitleSize

[frontend/src/storm/imageSize.ts:2](../../../../../frontend/src/storm/imageSize.ts#L2)

```typescript
imageTitleSize(raw: unknown) => { width: number | null; title: string; }
```

Размер хранится в title Markdown-картинки, не превращая заметку в HTML.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `raw` | `unknown` | `обязательный` | Исходное значение до нормализации/разбора. |

Возвращает: `{ width: number \| null; title: string; }`.

<details>
<summary>Прямые вызовы в теле</summary>

- `/(?:^|\s)\{width=(\d+)\}$/.exec`
- `Math.max`
- `Math.min`
- `Number`
- `value.slice`
- `value.slice(0, match.index).trimEnd`

</details>

## sizedImageTitle

[frontend/src/storm/imageSize.ts:9](../../../../../frontend/src/storm/imageSize.ts#L9)

```typescript
sizedImageTitle(title: unknown, width: unknown) => string
```

В теле вызывает `Math.max`, `Math.min`, `Math.round`, `Number.isFinite`, `imageTitleSize`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `title` | `unknown` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `width` | `unknown` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `string`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Math.max`
- `Math.min`
- `Math.round`
- `Number.isFinite`
- `imageTitleSize`

</details>
