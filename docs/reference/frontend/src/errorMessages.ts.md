# frontend/src/errorMessages.ts

Сгенерировано из объявлений кода. [Правила чтения](../../../METHODS.md).

Методов и именованных функций: **2**.

## safeErrorDetail

[frontend/src/errorMessages.ts:7](../../../../frontend/src/errorMessages.ts#L7)

```typescript
safeErrorDetail(value: string | null) => string | null
```

Отбрасывает HTML, диагностику библиотек, трассировки и слишком длинные ответы.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `value` | `string \| null` | `обязательный` | Входное значение преобразования/проверки. |

Возвращает: `string \| null`.

<details>
<summary>Прямые вызовы в теле</summary>

- `technical.test`

</details>

## errorMessageForCode

[frontend/src/errorMessages.ts:26](../../../../frontend/src/errorMessages.ts#L26)

```typescript
errorMessageForCode(code: unknown) => string | null
```

Разрешает только собственные коды справочника, исключая prototype-поля и произвольные ответы.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `code` | `unknown` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `string \| null`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Object.hasOwn`

</details>
