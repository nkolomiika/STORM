# frontend/src/storm/projectExport.ts

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **1**.

## missingStsProjectFields

[frontend/src/storm/projectExport.ts:4](../../../../../frontend/src/storm/projectExport.ts#L4)

```typescript
missingStsProjectFields(project: Project) => string[]
```

Названия отсутствующих полей для локализованного уведомления перед экспортом.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project` | `Project` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `string[]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `missing.push`
- `project.appsec_assignee?.trim`
- `project.appsec_ticket_key?.trim`
- `project.appsec_ticket_url?.trim`
- `project.appsec_version_code?.trim`

</details>
