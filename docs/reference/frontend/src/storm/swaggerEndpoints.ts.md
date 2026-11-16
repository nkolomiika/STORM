# frontend/src/storm/swaggerEndpoints.ts

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **5**.

## object

[frontend/src/storm/swaggerEndpoints.ts:5](../../../../../frontend/src/storm/swaggerEndpoints.ts#L5)

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

[frontend/src/storm/swaggerEndpoints.ts:9](../../../../../frontend/src/storm/swaggerEndpoints.ts#L9)

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
new UserInputError("JSON filenames must be unique")
new UserInputError(`Unsupported Swagger/OpenAPI version: ${String(version)}`)
error
new UserInputError("This JSON is not a Swagger/OpenAPI document")
new UserInputError([...warnings].join("; ") || "No endpoints found in JSON")
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

[frontend/src/storm/swaggerEndpoints.ts:17](../../../../../frontend/src/storm/swaggerEndpoints.ts#L17)

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
new UserInputError("Circular endpoint reference")
new UserInputError(`Upload the referenced JSON file: ${target}`)
new UserInputError("Unsupported JSON reference")
new UserInputError(`Endpoint reference not found: ${item.$ref}`)
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

[frontend/src/storm/swaggerEndpoints.ts:35](../../../../../frontend/src/storm/swaggerEndpoints.ts#L35)

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

[frontend/src/storm/swaggerEndpoints.ts:44](../../../../../frontend/src/storm/swaggerEndpoints.ts#L44)

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
new UserInputError("Select a project host for relative URLs")
new UserInputError("Invalid server URL")
new UserInputError("Only HTTP and HTTPS server URLs are supported")
new UserInputError("Too many endpoints in JSON (maximum 10000)")
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
