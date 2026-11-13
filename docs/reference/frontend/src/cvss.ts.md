# frontend/src/cvss.ts

Сгенерировано из объявлений кода. [Правила чтения](../../../METHODS.md).

Методов и именованных функций: **3**.

## normalizeCvssVector

[frontend/src/cvss.ts:5](../../../../frontend/src/cvss.ts#L5)

```typescript
normalizeCvssVector(version: Vulnerability["cvss_version"], vector: string | null | undefined) => string | null
```

В теле вызывает `normalized.replace`, `normalized.startsWith`, `raw.replace`, `vector.trim`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `version` | `Vulnerability["cvss_version"]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `vector` | `string \| null \| undefined` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `string \| null`.

<details>
<summary>Прямые вызовы в теле</summary>

- `normalized.replace`
- `normalized.startsWith`
- `raw.replace`
- `vector.trim`

</details>

## calculateCvssScore

[frontend/src/cvss.ts:17](../../../../frontend/src/cvss.ts#L17)

```typescript
calculateCvssScore(version: Vulnerability["cvss_version"], vector: string | null | undefined) => { normalizedVector: string | null; score: number | null }
```

В теле вызывает `calculateBaseScore`, `normalizeCvssVector`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `version` | `Vulnerability["cvss_version"]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `vector` | `string \| null \| undefined` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `{ normalizedVector: string \| null; score: number \| null }`.

<details>
<summary>Прямые вызовы в теле</summary>

- `calculateBaseScore`
- `normalizeCvssVector`

</details>

## severityFromCvssScore

[frontend/src/cvss.ts:38](../../../../frontend/src/cvss.ts#L38)

```typescript
severityFromCvssScore(score: number | null | undefined, fallback: Vulnerability["severity"] = "info") => Vulnerability["severity"]
```

В теле вызывает `Number.isNaN`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `score` | `number \| null \| undefined` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `fallback` | `Vulnerability["severity"]` | `"info"` | Запасное значение при отсутствии основного. |

Возвращает: `Vulnerability["severity"]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Number.isNaN`

</details>
