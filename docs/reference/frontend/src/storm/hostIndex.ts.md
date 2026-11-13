# frontend/src/storm/hostIndex.ts

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **1**.

## buildHostIndex

[frontend/src/storm/hostIndex.ts:7](../../../../../frontend/src/storm/hostIndex.ts#L7)

```typescript
buildHostIndex<T extends NamedHost>(hosts: readonly T[]) => { descendants: Map<number, T[]>; nestedIds: Set<number>; }
```

Строит индекс доменных суффиксов с сохранением порядка и всех уровней потомков. nestedIds не считает служебный origin=ip родителем. Используется через useMemo вместо повторных попарных сравнений хостов.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `hosts` | `readonly T[]` | `обязательный` | Набор хостов для обработки. |

Возвращает: `{ descendants: Map<number, T[]>; nestedIds: Set<number>; }`.

<details>
<summary>Прямые вызовы в теле</summary>

- `byName.get`
- `byName.set`
- `children.push`
- `descendants.get`
- `descendants.set`
- `group.push`
- `host.host.toLowerCase`
- `name.indexOf`
- `name.slice`
- `nestedIds.add`

</details>
