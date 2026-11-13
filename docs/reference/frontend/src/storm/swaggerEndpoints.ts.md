# frontend/src/storm/swaggerEndpoints.ts

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **5**.

## object

[frontend/src/storm/swaggerEndpoints.ts:4](../../../../../frontend/src/storm/swaggerEndpoints.ts#L4)

```typescript
object(value: unknown) => JsonObject
```

В теле вызывает `Array.isArray`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `value` | `unknown` | `обязательный` | Входное значение преобразования/проверки. |

Возвращает: `JsonObject`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Array.isArray`

</details>

## parseSwaggerDocuments

[frontend/src/storm/swaggerEndpoints.ts:8](../../../../../frontend/src/storm/swaggerEndpoints.ts#L8)

```typescript
parseSwaggerDocuments(documents: SwaggerDocument[], fallbackHost = "unknown") => { lines: string[]; warnings: string[]; versions: string[]; }
```

В теле вызывает `/^(1\.[012]|2\.0|3\.[012](?:\.\d+)?)$/.test`, `/^https?:\/\//i.test`, `Array.isArray`, `Object.entries`, `Object.entries(item).filter`, `String`, `[...warnings].join`, `add`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `documents` | `SwaggerDocument[]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `fallbackHost` | `string` | `"unknown"` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `{ lines: string[]; warnings: string[]; versions: string[]; }`.

Явные throw в теле:

```typescript
new Error("JSON filenames must be unique")
new Error(`Unsupported Swagger/OpenAPI version: ${String(version)}`)
error
new Error("This JSON is not a Swagger/OpenAPI document")
new Error([...warnings].join("; ") || "No endpoints found in JSON")
```

<details>
<summary>Прямые вызовы в теле</summary>

- `/^(1\.[012]|2\.0|3\.[012](?:\.\d+)?)$/.test`
- `/^https?:\/\//i.test`
- `Array.isArray`
- `Object.entries`
- `Object.entries(item).filter`
- `String`
- `[...warnings].join`
- `add`
- `documents.map`
- `method.toUpperCase`
- `object`
- `operations.push`
- `path.startsWith`
- `resolve`
- `schemes.map`
- `serverUrls`
- `version.startsWith`
- `versions.add`
- `warnings.add`

</details>

## parseSwaggerDocuments.resolve

[frontend/src/storm/swaggerEndpoints.ts:16](../../../../../frontend/src/storm/swaggerEndpoints.ts#L16)

```typescript
resolve(value: unknown, file: string, chain = new Set<string>()) => { value: JsonObject; file: string }
```

В теле вызывает `Object.entries`, `Object.entries(item).filter`, `Object.fromEntries`, `Object.hasOwn`, `chain.has`, `decodeURIComponent`, `decodeURIComponent(part).replace`, `decodeURIComponent(part).replace(/~1/g, "/").replace`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `value` | `unknown` | `обязательный` | Входное значение преобразования/проверки. |
| `file` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `chain` | `Set<string>` | `new Set<string>()` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `{ value: JsonObject; file: string }`.

Явные throw в теле:

```typescript
new Error("Circular endpoint reference")
new Error(`Upload the referenced JSON file: ${target}`)
new Error("Unsupported JSON reference")
new Error(`Endpoint reference not found: ${item.$ref}`)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `Object.entries`
- `Object.entries(item).filter`
- `Object.fromEntries`
- `Object.hasOwn`
- `chain.has`
- `decodeURIComponent`
- `decodeURIComponent(part).replace`
- `decodeURIComponent(part).replace(/~1/g, "/").replace`
- `files.get`
- `files.has`
- `item.$ref.split`
- `new URL(filename, `https://local.invalid/${file}`).pathname.slice`
- `object`
- `pointer.split`
- `pointer.split("/").slice`
- `pointer.startsWith`
- `resolve`

</details>

## parseSwaggerDocuments.serverUrls

[frontend/src/storm/swaggerEndpoints.ts:34](../../../../../frontend/src/storm/swaggerEndpoints.ts#L34)

```typescript
serverUrls(raw: unknown) => string[]
```

В теле вызывает `Array.isArray`, `raw.map`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `raw` | `unknown` | `обязательный` | Исходное значение до нормализации/разбора. |

Возвращает: `string[]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Array.isArray`
- `raw.map`

</details>

## parseSwaggerDocuments.add

[frontend/src/storm/swaggerEndpoints.ts:43](../../../../../frontend/src/storm/swaggerEndpoints.ts#L43)

```typescript
add(method: string, base: string, path: string) => void
```

В теле вызывает `/^https?:\/\//i.test`, `["https:", "http:"].includes`, `base.startsWith`, `lines.add`, `method.toUpperCase`, `methods.has`, `path.replace`, `url.pathname.replace`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `method` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `base` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `path` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

Явные throw в теле:

```typescript
new Error("Select a project host for relative URLs")
new Error("Only HTTP and HTTPS server URLs are supported")
new Error("Too many endpoints in JSON (maximum 10000)")
```

<details>
<summary>Прямые вызовы в теле</summary>

- `/^https?:\/\//i.test`
- `["https:", "http:"].includes`
- `base.startsWith`
- `lines.add`
- `method.toUpperCase`
- `methods.has`
- `path.replace`
- `url.pathname.replace`
- `warnings.add`

</details>
