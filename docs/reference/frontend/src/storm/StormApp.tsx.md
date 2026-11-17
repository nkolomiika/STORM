# frontend/src/storm/StormApp.tsx

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **325**.

## getApiErrorMessage

[frontend/src/storm/StormApp.tsx:200](../../../../../frontend/src/storm/StormApp.tsx#L200)

```typescript
getApiErrorMessage(error: unknown, fallback: string) => string
```

В теле вызывает `rawGetApiErrorMessage`, `t`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `error` | `unknown` | `обязательный` | Перехваченное исключение/ответ ошибки. |
| `fallback` | `string` | `обязательный` | Запасное значение при отсутствии основного. |

Возвращает: `string`.

<details>
<summary>Прямые вызовы в теле</summary>

- `rawGetApiErrorMessage`
- `t`

</details>

## stop

[frontend/src/storm/StormApp.tsx:722](../../../../../frontend/src/storm/StormApp.tsx#L722)

```typescript
stop(e: { stopPropagation: () => void }) => void
```

В теле вызывает `e.stopPropagation`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `e` | `{ stopPropagation: () => void }` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `e.stopPropagation`

</details>

## cap

[frontend/src/storm/StormApp.tsx:723](../../../../../frontend/src/storm/StormApp.tsx#L723)

```typescript
cap(s: string) => string
```

В теле вызывает `s.charAt`, `s.charAt(0).toUpperCase`, `s.slice`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `s` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `string`.

<details>
<summary>Прямые вызовы в теле</summary>

- `s.charAt`
- `s.charAt(0).toUpperCase`
- `s.slice`

</details>

## Collapse

[frontend/src/storm/StormApp.tsx:732](../../../../../frontend/src/storm/StormApp.tsx#L732)

```typescript
Collapse({ open, children }: { open: boolean; children: ReactNode }) => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

Преобразование/вычисление в теле функции; тип результата и параметры приведены ниже, точное выражение доступно по ссылке на исходник.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `{ open, children }` | `{ open: boolean; children: ReactNode }` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

## FilePreview

[frontend/src/storm/StormApp.tsx:745](../../../../../frontend/src/storm/StormApp.tsx#L745)

```typescript
FilePreview({ file, onClose }: { file: ApiVulnFile; onClose: () => void }) => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").ReactPortal
```

В теле вызывает `/(json|xml|javascript|x-sh|yaml|csv|html)/.test`, `Math.round`, `createPortal`, `ct.startsWith`, `t`, `useEffect`, `useState`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `{ file, onClose }` | `{ file: ApiVulnFile; onClose: () => void }` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").ReactPortal`.

<details>
<summary>Прямые вызовы в теле</summary>

- `/(json|xml|javascript|x-sh|yaml|csv|html)/.test`
- `Math.round`
- `createPortal`
- `ct.startsWith`
- `t`
- `useEffect`
- `useState`

</details>

## Tip

[frontend/src/storm/StormApp.tsx:818](../../../../../frontend/src/storm/StormApp.tsx#L818)

```typescript
Tip({ label, children }: { label: string; children: ReactNode }) => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

В теле вызывает `createPortal`, `useState`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `{ label, children }` | `{ label: string; children: ReactNode }` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

<details>
<summary>Прямые вызовы в теле</summary>

- `createPortal`
- `useState`

</details>

## toggleIn

[frontend/src/storm/StormApp.tsx:855](../../../../../frontend/src/storm/StormApp.tsx#L855)

```typescript
toggleIn<T>(arr: T[], v: T) => T[]
```

Multi-select filter toggle: add the value if absent, drop it if already held.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `arr` | `T[]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `v` | `T` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `T[]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `arr.filter`
- `arr.includes`

</details>

## fstr

[frontend/src/storm/StormApp.tsx:857](../../../../../frontend/src/storm/StormApp.tsx#L857)

```typescript
fstr(v: string | string[] | undefined) => string
```

Coerce an editor-form value (string or tag-array) to a plain string.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `v` | `string \| string[] \| undefined` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `string`.

## toDispDate

[frontend/src/storm/StormApp.tsx:860](../../../../../frontend/src/storm/StormApp.tsx#L860)

```typescript
toDispDate(s?: string) => string
```

dd.mm.yyyy → yyyy-mm-dd (for <input type=date>) and back.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `s` | `string` | `undefined (optional)` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `string`.

<details>
<summary>Прямые вызовы в теле</summary>

- `String`
- `String(s).match`

</details>

## fmtDateTime

[frontend/src/storm/StormApp.tsx:867](../../../../../frontend/src/storm/StormApp.tsx#L867)

```typescript
fmtDateTime(s?: string | null) => string
```

ISO-таймстамп → «ДД.ММ.ГГГГ, ЧЧ:ММ» (привлекательнее сырого ISO).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `s` | `string \| null` | `undefined (optional)` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `string`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Number.isNaN`
- `String`
- `dt.getDate`
- `dt.getFullYear`
- `dt.getHours`
- `dt.getMinutes`
- `dt.getMonth`
- `dt.getTime`
- `p`

</details>

## fmtDateTime.p

[frontend/src/storm/StormApp.tsx:871](../../../../../frontend/src/storm/StormApp.tsx#L871)

```typescript
p(n: number) => string
```

В теле вызывает `String`, `String(n).padStart`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `n` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `string`.

<details>
<summary>Прямые вызовы в теле</summary>

- `String`
- `String(n).padStart`

</details>

## pathFor

[frontend/src/storm/StormApp.tsx:882](../../../../../frontend/src/storm/StormApp.tsx#L882)

```typescript
pathFor(s: { view: ViewId; nav: NavId; openProjectId: number | null; section: SectionId; reconView: ReconView; profileTab: ProfileTab; openVulnId: number | null; openNoteId: number | null; openHostId: number | null; openIp: string | null; openJsFileId: number | null; tasksOpenKey: string | null; }) => string
```

Build the URL path that represents the current navigation state.

The open vulnerability is part of the path (`…/vulns/{id}`) so that a finding
can be deep-linked — that is what notification and activity-feed links point
at. Keep this in sync with `navStateFromPath`: any field encoded here must be
parsed back there, or the round-trip through the router will drop it.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `s` | `{ view: ViewId; nav: NavId; openProjectId: number \| null; section: SectionId; reconView: ReconView; profileTab: ProfileTab; openVulnId: number \| null; openNoteId: number \| null; openHostId: number \| null; openIp: string \| null; openJsFileId: number \| null; tasksOpenKey: string \| null; }` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `string`.

<details>
<summary>Прямые вызовы в теле</summary>

- `encodeURIComponent`

</details>

## navStateFromPath

[frontend/src/storm/StormApp.tsx:919](../../../../../frontend/src/storm/StormApp.tsx#L919)

```typescript
navStateFromPath(path: string) => Partial<StormState>
```

Parse a URL path back into the navigation-state fields it encodes.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `path` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Partial<StormState>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Number`
- `Number.isFinite`
- `["security", "api", "customizing"].includes`
- `decodeURIComponent`
- `entityId`
- `path.split`
- `path.split("/").filter`

</details>

## navStateFromPath.entityId

[frontend/src/storm/StormApp.tsx:939](../../../../../frontend/src/storm/StormApp.tsx#L939)

```typescript
entityId() => number | null
```

`/…/vulns/7` → 7; a missing or non-numeric segment → null.

Возвращает: `number \| null`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Number`
- `Number.isFinite`

</details>

## initialsOf

[frontend/src/storm/StormApp.tsx:987](../../../../../frontend/src/storm/StormApp.tsx#L987)

```typescript
initialsOf(name: string) => string
```

В теле вызывает `(parts[0] || "U").slice`, `(parts[0] || "U").slice(0, 2).toUpperCase`, `(parts[0][0] + parts[1][0]).toUpperCase`, `name.trim`, `name.trim().split`, `name.trim().split(/[^A-Za-zА-Яа-яЁё0-9]+/).filter`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `name` | `string` | `обязательный` | Имя/название обрабатываемого объекта. |

Возвращает: `string`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(parts[0] || "U").slice`
- `(parts[0] || "U").slice(0, 2).toUpperCase`
- `(parts[0][0] + parts[1][0]).toUpperCase`
- `name.trim`
- `name.trim().split`
- `name.trim().split(/[^A-Za-zА-Яа-яЁё0-9]+/).filter`

</details>

## computeCvss4

[frontend/src/storm/StormApp.tsx:1002](../../../../../frontend/src/storm/StormApp.tsx#L1002)

```typescript
computeCvss4(vector?: string) => { score: number; sev: Severity } | null
```

CVSS 4.0 scorer.

Раньше здесь была упрощённая формула из прототипа (сумма весов), которая
расходилась со спецификацией: например
CVSS:4.0/AV:L/AC:L/AT:P/PR:L/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N давала 8.8
вместо 7.3. Реальный CVSS 4.0 считается по MacroVector-таблицам, поэтому
используем спецификационную реализацию из ../cvss — ту же оценку выдаёт и
бэкенд (библиотека cvss), так что превью и сохранённое значение совпадают.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `vector` | `string` | `undefined (optional)` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `{ score: number; sev: Severity } \| null`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(vector || "").trim`
- `/^CVSS:4\.0\//i.test`
- `Number.isNaN`
- `calculateCvssScore`
- `severityFromCvssScore`

</details>

## renderMarkdown

[frontend/src/storm/StormApp.tsx:1011](../../../../../frontend/src/storm/StormApp.tsx#L1011)

```typescript
renderMarkdown(src: string) => ReactNode
```

Единый безопасный GFM-рендерер для заметок и Markdown-полей.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `src` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `ReactNode`.

## cumulativeSpark

[frontend/src/storm/StormApp.tsx:1029](../../../../../frontend/src/storm/StormApp.tsx#L1029)

```typescript
cumulativeSpark(timestamps: (string | null | undefined)[], startMs: number, endMs: number, w = 111, h = 30, pad = 3) => string
```

Cumulative-count sparkline driven by real "added at" timestamps.

X is the engagement window [start, end]; the line is drawn only up to today,
so an unfinished project stops partway across the card. Y is the running
number of entities created at or before each sampled instant — every add
pushes the line up, and a burst of adds shows as a steeper climb.

`startMs`/`endMs` are epoch millis (NaN when the project has no dates set); we
then fall back to the entities' own first/last timestamps so the card still
renders something meaningful.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `timestamps` | `(string \| null \| undefined)[]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `startMs` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `endMs` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `w` | `number` | `111` | Определяется именем/типом и контрактом вызывающего кода. |
| `h` | `number` | `30` | Определяется именем/типом и контрактом вызывающего кода. |
| `pad` | `number` | `3` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `string`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Date.now`
- `Math.max`
- `Math.min`
- `Math.round`
- `Number.isFinite`
- `pts.join`
- `pts.push`
- `timestamps .map`
- `timestamps .map((t) => Date.parse(t ?? "")) .filter`
- `timestamps .map((t) => Date.parse(t ?? "")) .filter((t) => Number.isFinite(t)) .sort`

</details>

## sparkArea

[frontend/src/storm/StormApp.tsx:1077](../../../../../frontend/src/storm/StormApp.tsx#L1077)

```typescript
sparkArea(points: string, w: number, h = 30) => string
```

Замыкает спарклайн вниз до базовой линии — заливка того же цвета под графиком.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `points` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `w` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `h` | `number` | `30` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `string`.

## toStormMethod

[frontend/src/storm/StormApp.tsx:1091](../../../../../frontend/src/storm/StormApp.tsx#L1091)

```typescript
toStormMethod(m: ApiEndpoint["method"]) => Method
```

Сохраняем HTTP-метод без подмены HEAD/OPTIONS/TRACE/QUERY на GET.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `m` | `ApiEndpoint["method"]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Method`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(STORM_METHODS as string[]).includes`

</details>

## isFarmJobInFlight

[frontend/src/storm/StormApp.tsx:1097](../../../../../frontend/src/storm/StormApp.tsx#L1097)

```typescript
isFarmJobInFlight(status: string) => boolean
```

A farm job still worth polling. `pending`/`queued` are the recon-worker's
pre-run states — a job sits there until the worker picks it off the queue.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `status` | `string` | `обязательный` | Статус операции/ресурса; допустимые значения задаёт Enum или схема. |

Возвращает: `boolean`.

## toStormPort

[frontend/src/storm/StormApp.tsx:1102](../../../../../frontend/src/storm/StormApp.tsx#L1102)

```typescript
toStormPort(p: ApiPortWithServices) => Host["ports"][number]
```

Ports live under each IP on the backend; Storm shows them flat per host.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `p` | `ApiPortWithServices` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Host["ports"][number]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(p.services ?? []).map`

</details>

## toStormPorts

[frontend/src/storm/StormApp.tsx:1113](../../../../../frontend/src/storm/StormApp.tsx#L1113)

```typescript
toStormPorts(h: ApiHost) => Host["ports"]
```

В теле вызывает `h.ip_addresses.flatMap`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `h` | `ApiHost` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Host["ports"]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `h.ip_addresses.flatMap`

</details>

## toStormHost

[frontend/src/storm/StormApp.tsx:1117](../../../../../frontend/src/storm/StormApp.tsx#L1117)

```typescript
toStormHost(h: ApiHost, endpoints: Endpoint[] = []) => Host
```

В теле вызывает `h.ip_addresses.map`, `toStormPorts`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `h` | `ApiHost` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `endpoints` | `Endpoint[]` | `[]` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Host`.

<details>
<summary>Прямые вызовы в теле</summary>

- `h.ip_addresses.map`
- `toStormPorts`

</details>

## toStormVuln

[frontend/src/storm/StormApp.tsx:1138](../../../../../frontend/src/storm/StormApp.tsx#L1138)

```typescript
toStormVuln(v: ApiVulnerability, hostName: string) => Vuln
```

Backend workflow steps carry ids/endpoints/images; Storm's editor shows the text only.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `v` | `ApiVulnerability` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `hostName` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Vuln`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(() => { const rows = v.workflow_steps.map((s) => ({ desc: s.description || "", ids: s.image_file_ids || [] })); while (rows.length && !rows[rows.length - 1].desc.trim() && rows[rows.length - 1].ids.length === 0) rows.pop(); const stepImages: Record<number, number[]> = {}; rows.forEach((r, i) => { if (r.ids.length) stepImages[i] = r.ids; }); return { steps: rows.map((r) => r.desc), stepImages }; })`

</details>

## toStormNote

[frontend/src/storm/StormApp.tsx:1167](../../../../../frontend/src/storm/StormApp.tsx#L1167)

```typescript
toStormNote(n: ProjectNote) => Note
```

В теле вызывает `(n.updated_at || n.created_at || "").slice`, `toDispDate`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `n` | `ProjectNote` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Note`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(n.updated_at || n.created_at || "").slice`
- `toDispDate`

</details>

## toStormCred

[frontend/src/storm/StormApp.tsx:1177](../../../../../frontend/src/storm/StormApp.tsx#L1177)

```typescript
toStormCred(c: ApiProjectCredential) => Cred
```

В теле вызывает `(c.updated_at || c.created_at || "").slice`, `toDispDate`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `c` | `ApiProjectCredential` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Cred`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(c.updated_at || c.created_at || "").slice`
- `toDispDate`

</details>

## toStormMember

[frontend/src/storm/StormApp.tsx:1189](../../../../../frontend/src/storm/StormApp.tsx#L1189)

```typescript
toStormMember(m: ApiProjectMember, idx: number) => Member
```

В теле вызывает `initialsOf`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `m` | `ApiProjectMember` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `idx` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Member`.

<details>
<summary>Прямые вызовы в теле</summary>

- `initialsOf`

</details>

## actDetail

[frontend/src/storm/StormApp.tsx:1266](../../../../../frontend/src/storm/StormApp.tsx#L1266)

```typescript
actDetail(a: ProjectActivityItem, k: string) => string
```

В теле вызывает `String`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `a` | `ProjectActivityItem` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `k` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `string`.

<details>
<summary>Прямые вызовы в теле</summary>

- `String`

</details>

## activityLine

[frontend/src/storm/StormApp.tsx:1281](../../../../../frontend/src/storm/StormApp.tsx#L1281)

```typescript
activityLine(a: ProjectActivityItem, resolve: ActivityResolver) => ActivityLine
```

В теле вызывает `Array.isArray`, `String`, `a.details.targets.filter`, `actDetail`, `resolve`, `t`, `targets.join`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `a` | `ProjectActivityItem` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `resolve` | `ActivityResolver` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `ActivityLine`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Array.isArray`
- `String`
- `a.details.targets.filter`
- `actDetail`
- `resolve`
- `t`
- `targets.join`

</details>

## activitySubject

[frontend/src/storm/StormApp.tsx:1327](../../../../../frontend/src/storm/StormApp.tsx#L1327)

```typescript
activitySubject(type: string, n: number) => string
```

What the action applied to, straight after the verb: "3 IP addresses", "finding".

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `type` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `n` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `string`.

<details>
<summary>Прямые вызовы в теле</summary>

- `activityNoun`
- `type.replace`

</details>

## groupActivity

[frontend/src/storm/StormApp.tsx:1336](../../../../../frontend/src/storm/StormApp.tsx#L1336)

```typescript
groupActivity(items: ProjectActivityItem[], resolve: ActivityResolver = () => null) => ActivityGroup[]
```

В теле вызывает `flush`, `items .filter`, `items .filter((a) => !ACT_HIDDEN.has(a.entity_type || "")) .forEach`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `items` | `ProjectActivityItem[]` | `обязательный` | Набор элементов для обработки. |
| `resolve` | `ActivityResolver` | `() => null` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `ActivityGroup[]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `flush`
- `items .filter`
- `items .filter((a) => !ACT_HIDDEN.has(a.entity_type || "")) .forEach`

</details>

## groupActivity.flush

[frontend/src/storm/StormApp.tsx:1339](../../../../../frontend/src/storm/StormApp.tsx#L1339)

```typescript
flush() => void
```

В теле вызывает `activitySubject`, `activityVerb`, `bucket.map`, `first.action.toLowerCase`, `first.action.toLowerCase().replace`, `groups.push`, `relTime`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `activitySubject`
- `activityVerb`
- `bucket.map`
- `first.action.toLowerCase`
- `first.action.toLowerCase().replace`
- `groups.push`
- `relTime`

</details>

## elapsedPct

[frontend/src/storm/StormApp.tsx:1386](../../../../../frontend/src/storm/StormApp.tsx#L1386)

```typescript
elapsedPct(startISO: string, endISO: string) => number
```

Percentage of the engagement window that has elapsed (the overview progress bar).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `startISO` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `endISO` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `number`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Date.now`
- `Date.parse`
- `Math.max`
- `Math.min`
- `Math.round`
- `Number.isFinite`

</details>

## StormApp

[frontend/src/storm/StormApp.tsx:1394](../../../../../frontend/src/storm/StormApp.tsx#L1394)

```typescript
StormApp() => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

В теле вызывает `(() => { const g = state.activityModalKey ? activityGroups.find((x) => x.key === state.activityModalKey) : undefined; const close = () => setState({ activityModalKey: null }); return modalShell( !!g, close, 60, 620, <> <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "var(--st-text)", letterSpacing: "-.4px" }}> {g ? `${g.actor === "System" ? t("System") : g.actor} ${t(g.verb)} ${g.subject}` : ""} </h2> {g && <div className="mono" style={{ marginTop: 6, fontSize: 11.5, color: "var(--st-text-faint)" }}>{g.time}</div>} <div style={{ marginTop: 16, background: "var(--st-code-bg)", borderRadius: 10, padding: "12px 13px", display: "flex", flexDirection: "column", gap: 6, maxHeight: 420, overflow: "auto" }}> {g?.lines.map((l) => activityLineRow(l, g.tone))} </div> <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}> <button className="clk" onClick={close} style={{ height: 40, padding: "0 20px", border: "1px solid var(--st-border)", borderRadius: 10, background: "var(--st-surface)", font: "700 13px Inter,sans-serif", color: "var(--st-text-2)", cursor: "pointer" }}>{t("Close")}</button> </div> </> ); })`, `(() => { const total = vulns.length; const pct = state.taskTrackerBulkTotal > 0 ? Math.round((state.taskTrackerBulkDone / state.taskTrackerBulkTotal) * 100) : 0; return ( <> <h2 style={{ margin: 0, fontSize: 21, fontWeight: 800, color: "var(--st-text)", letterSpacing: "-.4px" }}>{t("Export all to Task Tracker")}</h2> <div style={{ marginTop: 16 }}> {state.taskTrackerBulkFinished ? ( <div style={{ border: "1px solid var(--st-success-soft)", background: "var(--st-success-soft)", borderRadius: 12, padding: "14px 16px" }}> <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}><Icon name="check-circle" size={18} color="var(--st-success)" sw={2.2} /><span style={{ font: "700 13.5px Inter,sans-serif", color: "var(--st-text)" }}>{t("Export finished")}</span></div> <div style={{ font: "600 13px Inter,sans-serif", color: "var(--st-text-2)", lineHeight: 1.7 }}> {t("Created:")} <b>{state.taskTrackerBulkCreated}</b><br /> {t("Already linked (skipped):")} <b>{state.taskTrackerBulkSkipped}</b><br /> {t("Failed:")} <b style={{ color: state.taskTrackerBulkFailed ? "var(--st-danger)" : "var(--st-text-2)" }}>{state.taskTrackerBulkFailed}</b> </div> </div> ) : state.taskTrackerBulkRunning ? ( <div> <div style={{ font: "600 13px Inter,sans-serif", color: "var(--st-text-2)", marginBottom: 10 }}>{t("Exporting")} {state.taskTrackerBulkDone} / {state.taskTrackerBulkTotal}…</div> <div style={{ height: 8, background: "var(--st-divider)", borderRadius: 6, overflow: "hidden" }}> <div style={{ width: `${pct}%`, height: "100%", background: "var(--st-accent)", transition: "width .2s" }} /> </div> </div> ) : ( <div style={{ font: "600 13px Inter,sans-serif", color: "var(--st-text-2)", lineHeight: 1.5 }}> {t("This will create a Task Tracker issue (in To Do) for each of the")} <b style={{ color: "var(--st-text)" }}>{total}</b> {t("listed")} {total === 1 ? t("vulnerability") : t("vulnerabilities")} {t("(page filters apply). Already-linked findings are skipped.")} </div> )} </div> <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 22 }}> {state.taskTrackerBulkFinished ? ( <> {state.taskTrackerBulkProjectUrl && ( <a className="clk" href={state.taskTrackerBulkProjectUrl} target="_blank" rel="noreferrer" style={{ height: 42, padding: "0 20px", borderRadius: 11, background: "var(--st-accent-2)", color: "var(--st-on-accent)", font: "700 13.5px Inter,sans-serif", display: "inline-flex", alignItems: "center", textDecoration: "none" }}>{t("Open Task Tracker")}</a> )} <button className="clk" onClick={closeBulkTaskTracker} style={{ height: 42, padding: "0 20px", border: "1px solid var(--st-border)", borderRadius: 11, background: "var(--st-surface)", font: "700 13.5px Inter,sans-serif", color: "var(--st-text-2)" }}>{t("Done")}</button> </> ) : ( <> <button className="clk" onClick={closeBulkTaskTracker} disabled={state.taskTrackerBulkRunning} style={{ height: 42, padding: "0 20px", border: "1px solid var(--st-border)", borderRadius: 11, background: "var(--st-surface)", font: "700 13.5px Inter,sans-serif", color: "var(--st-text-2)", cursor: state.taskTrackerBulkRunning ? "default" : "pointer" }}>{t("Cancel")}</button> <button className="clk" onClick={doBulkTaskTrackerExport} disabled={state.taskTrackerBulkRunning || total === 0} style={{ height: 42, padding: "0 22px", border: "none", borderRadius: 11, background: state.taskTrackerBulkRunning || total === 0 ? "var(--st-accent-muted)" : "var(--st-accent-2)", color: "var(--st-on-accent)", font: "700 13.5px Inter,sans-serif", cursor: state.taskTrackerBulkRunning || total === 0 ? "default" : "pointer" }}> {state.taskTrackerBulkRunning ? t("Exporting…") : `${t("Export")} ${total}`} </button> </> )} </div> </> ); })`, `(() => { const v = state.taskTrackerExportVulnId != null ? d.vulns.find((x) => x.id === state.taskTrackerExportVulnId) : undefined; const link = state.taskTrackerExportLink; const isLinked = !!(link && link.status === "linked" && link.task_tracker_issue_key); const exportDisabled = state.taskTrackerExportBusy || state.taskTrackerExportChecking; return ( <> <h2 style={{ margin: 0, fontSize: 21, fontWeight: 800, color: "var(--st-text)", letterSpacing: "-.4px" }}>{t("Export to Task Tracker")}</h2> {v && ( <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16, padding: "12px 14px", border: "1px solid var(--st-divider)", borderRadius: 12 }}> <span style={{ font: "700 10px Inter,sans-serif", textTransform: "uppercase", letterSpacing: ".5px", borderRadius: 7, padding: "4px 9px", background: SEV[v.sev].bg, color: SEV[v.sev].color, flex: "none" }}>{t(v.sev)}</span> <div style={{ minWidth: 0 }}> <div style={{ font: "600 14px Inter,sans-serif", color: "var(--st-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.title}</div> <div className="mono" style={{ fontSize: 12, color: "var(--st-text-3)", marginTop: 2 }}>{v.host}</div> </div> </div> )} {/* Статус-блок рендерим ТОЛЬКО когда есть что показать (проверка / уже экспортировано / ошибка). Иначе — без пустого зарезервированного пространства: карточка находки идёт сразу к кнопкам. */} {(state.taskTrackerExportChecking || isLinked || state.taskTrackerExportError) && ( <div style={{ marginTop: 16 }}> {state.taskTrackerExportChecking ? ( <div style={{ font: "600 13px Inter,sans-serif", color: "var(--st-text-3)" }}>{t("Checking status…")}</div> ) : isLinked ? ( <div style={{ display: "flex", alignItems: "center", gap: 10, border: "1px solid var(--st-success-soft)", background: "var(--st-success-soft)", borderRadius: 12, padding: "13px 15px" }}> <Icon name="check-circle" size={18} color="var(--st-success)" sw={2.2} /> <div style={{ font: "600 13.5px Inter,sans-serif", color: "var(--st-text)" }}> {t("Already exported:")}{" "} <a href={link!.task_tracker_issue_url} target="_blank" rel="noreferrer" style={{ color: "var(--st-accent)", fontWeight: 700 }}>{link!.task_tracker_issue_key}</a> </div> </div> ) : ( <div style={{ color: "var(--st-danger)", font: "600 12.5px Inter,sans-serif" }}>{state.taskTrackerExportError}</div> )} </div> )} <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 22 }}> {isLinked ? ( <> <a className="clk" href={link!.task_tracker_issue_url} target="_blank" rel="noreferrer" style={{ height: 42, padding: "0 20px", borderRadius: 11, background: "var(--st-accent-2)", color: "var(--st-on-accent)", font: "700 13.5px Inter,sans-serif", display: "inline-flex", alignItems: "center", textDecoration: "none" }}>{t("Open in Task Tracker")}</a> <button className="clk" onClick={closeTaskTrackerExport} style={{ height: 42, padding: "0 20px", border: "1px solid var(--st-border)", borderRadius: 11, background: "var(--st-surface)", font: "700 13.5px Inter,sans-serif", color: "var(--st-text-2)" }}>{t("Done")}</button> </> ) : ( <> <button className="clk" onClick={closeTaskTrackerExport} style={{ height: 42, padding: "0 20px", border: "1px solid var(--st-border)", borderRadius: 11, background: "var(--st-surface)", font: "700 13.5px Inter,sans-serif", color: "var(--st-text-2)" }}>{t("Cancel")}</button> <button className="clk" onClick={doTaskTrackerExport} disabled={exportDisabled} style={{ height: 42, padding: "0 22px", border: "none", borderRadius: 11, background: exportDisabled ? "var(--st-accent-muted)" : "var(--st-accent-2)", color: "var(--st-on-accent)", font: "700 13.5px Inter,sans-serif", cursor: exportDisabled ? "default" : "pointer" }}> {state.taskTrackerExportBusy ? t("Exporting…") : t("Export")} </button> </> )} </div> </> ); })`, `([ { id: "projects" as const, icon: "folder" as const, label: "Projects", onClick: selProjects }, { id: "tasks" as const, icon: "check-square" as const, label: "Tasks", onClick: () => setState({ nav: "tasks", view: "list", tasksOpenKey: null }) }, { id: "docs" as const, icon: "doc" as const, label: "Docs", onClick: () => setState({ nav: "docs", view: "list" }) }, ...(isAdmin ? [{ id: "members" as const, icon: "users" as const, label: "Members", onClick: selWSMembers }] : []), ]).map`, `(["critical", "high", "medium", "low", "info", "unrealized"] as Severity[]).map`, `(state.apiJsFiles ?? []).map`, `(state.apiMembers ?? []).some`, `(state.apiProjects ?? []).map`; полный список ниже.

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(() => { const g = state.activityModalKey ? activityGroups.find((x) => x.key === state.activityModalKey) : undefined; const close = () => setState({ activityModalKey: null }); return modalShell( !!g, close, 60, 620, <> <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "var(--st-text)", letterSpacing: "-.4px" }}> {g ? `${g.actor === "System" ? t("System") : g.actor} ${t(g.verb)} ${g.subject}` : ""} </h2> {g && <div className="mono" style={{ marginTop: 6, fontSize: 11.5, color: "var(--st-text-faint)" }}>{g.time}</div>} <div style={{ marginTop: 16, background: "var(--st-code-bg)", borderRadius: 10, padding: "12px 13px", display: "flex", flexDirection: "column", gap: 6, maxHeight: 420, overflow: "auto" }}> {g?.lines.map((l) => activityLineRow(l, g.tone))} </div> <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}> <button className="clk" onClick={close} style={{ height: 40, padding: "0 20px", border: "1px solid var(--st-border)", borderRadius: 10, background: "var(--st-surface)", font: "700 13px Inter,sans-serif", color: "var(--st-text-2)", cursor: "pointer" }}>{t("Close")}</button> </div> </> ); })`
- `(() => { const total = vulns.length; const pct = state.taskTrackerBulkTotal > 0 ? Math.round((state.taskTrackerBulkDone / state.taskTrackerBulkTotal) * 100) : 0; return ( <> <h2 style={{ margin: 0, fontSize: 21, fontWeight: 800, color: "var(--st-text)", letterSpacing: "-.4px" }}>{t("Export all to Task Tracker")}</h2> <div style={{ marginTop: 16 }}> {state.taskTrackerBulkFinished ? ( <div style={{ border: "1px solid var(--st-success-soft)", background: "var(--st-success-soft)", borderRadius: 12, padding: "14px 16px" }}> <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}><Icon name="check-circle" size={18} color="var(--st-success)" sw={2.2} /><span style={{ font: "700 13.5px Inter,sans-serif", color: "var(--st-text)" }}>{t("Export finished")}</span></div> <div style={{ font: "600 13px Inter,sans-serif", color: "var(--st-text-2)", lineHeight: 1.7 }}> {t("Created:")} <b>{state.taskTrackerBulkCreated}</b><br /> {t("Already linked (skipped):")} <b>{state.taskTrackerBulkSkipped}</b><br /> {t("Failed:")} <b style={{ color: state.taskTrackerBulkFailed ? "var(--st-danger)" : "var(--st-text-2)" }}>{state.taskTrackerBulkFailed}</b> </div> </div> ) : state.taskTrackerBulkRunning ? ( <div> <div style={{ font: "600 13px Inter,sans-serif", color: "var(--st-text-2)", marginBottom: 10 }}>{t("Exporting")} {state.taskTrackerBulkDone} / {state.taskTrackerBulkTotal}…</div> <div style={{ height: 8, background: "var(--st-divider)", borderRadius: 6, overflow: "hidden" }}> <div style={{ width: `${pct}%`, height: "100%", background: "var(--st-accent)", transition: "width .2s" }} /> </div> </div> ) : ( <div style={{ font: "600 13px Inter,sans-serif", color: "var(--st-text-2)", lineHeight: 1.5 }}> {t("This will create a Task Tracker issue (in To Do) for each of the")} <b style={{ color: "var(--st-text)" }}>{total}</b> {t("listed")} {total === 1 ? t("vulnerability") : t("vulnerabilities")} {t("(page filters apply). Already-linked findings are skipped.")} </div> )} </div> <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 22 }}> {state.taskTrackerBulkFinished ? ( <> {state.taskTrackerBulkProjectUrl && ( <a className="clk" href={state.taskTrackerBulkProjectUrl} target="_blank" rel="noreferrer" style={{ height: 42, padding: "0 20px", borderRadius: 11, background: "var(--st-accent-2)", color: "var(--st-on-accent)", font: "700 13.5px Inter,sans-serif", display: "inline-flex", alignItems: "center", textDecoration: "none" }}>{t("Open Task Tracker")}</a> )} <button className="clk" onClick={closeBulkTaskTracker} style={{ height: 42, padding: "0 20px", border: "1px solid var(--st-border)", borderRadius: 11, background: "var(--st-surface)", font: "700 13.5px Inter,sans-serif", color: "var(--st-text-2)" }}>{t("Done")}</button> </> ) : ( <> <button className="clk" onClick={closeBulkTaskTracker} disabled={state.taskTrackerBulkRunning} style={{ height: 42, padding: "0 20px", border: "1px solid var(--st-border)", borderRadius: 11, background: "var(--st-surface)", font: "700 13.5px Inter,sans-serif", color: "var(--st-text-2)", cursor: state.taskTrackerBulkRunning ? "default" : "pointer" }}>{t("Cancel")}</button> <button className="clk" onClick={doBulkTaskTrackerExport} disabled={state.taskTrackerBulkRunning || total === 0} style={{ height: 42, padding: "0 22px", border: "none", borderRadius: 11, background: state.taskTrackerBulkRunning || total === 0 ? "var(--st-accent-muted)" : "var(--st-accent-2)", color: "var(--st-on-accent)", font: "700 13.5px Inter,sans-serif", cursor: state.taskTrackerBulkRunning || total === 0 ? "default" : "pointer" }}> {state.taskTrackerBulkRunning ? t("Exporting…") : `${t("Export")} ${total}`} </button> </> )} </div> </> ); })`
- `(() => { const v = state.taskTrackerExportVulnId != null ? d.vulns.find((x) => x.id === state.taskTrackerExportVulnId) : undefined; const link = state.taskTrackerExportLink; const isLinked = !!(link && link.status === "linked" && link.task_tracker_issue_key); const exportDisabled = state.taskTrackerExportBusy || state.taskTrackerExportChecking; return ( <> <h2 style={{ margin: 0, fontSize: 21, fontWeight: 800, color: "var(--st-text)", letterSpacing: "-.4px" }}>{t("Export to Task Tracker")}</h2> {v && ( <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16, padding: "12px 14px", border: "1px solid var(--st-divider)", borderRadius: 12 }}> <span style={{ font: "700 10px Inter,sans-serif", textTransform: "uppercase", letterSpacing: ".5px", borderRadius: 7, padding: "4px 9px", background: SEV[v.sev].bg, color: SEV[v.sev].color, flex: "none" }}>{t(v.sev)}</span> <div style={{ minWidth: 0 }}> <div style={{ font: "600 14px Inter,sans-serif", color: "var(--st-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.title}</div> <div className="mono" style={{ fontSize: 12, color: "var(--st-text-3)", marginTop: 2 }}>{v.host}</div> </div> </div> )} {/* Статус-блок рендерим ТОЛЬКО когда есть что показать (проверка / уже экспортировано / ошибка). Иначе — без пустого зарезервированного пространства: карточка находки идёт сразу к кнопкам. */} {(state.taskTrackerExportChecking || isLinked || state.taskTrackerExportError) && ( <div style={{ marginTop: 16 }}> {state.taskTrackerExportChecking ? ( <div style={{ font: "600 13px Inter,sans-serif", color: "var(--st-text-3)" }}>{t("Checking status…")}</div> ) : isLinked ? ( <div style={{ display: "flex", alignItems: "center", gap: 10, border: "1px solid var(--st-success-soft)", background: "var(--st-success-soft)", borderRadius: 12, padding: "13px 15px" }}> <Icon name="check-circle" size={18} color="var(--st-success)" sw={2.2} /> <div style={{ font: "600 13.5px Inter,sans-serif", color: "var(--st-text)" }}> {t("Already exported:")}{" "} <a href={link!.task_tracker_issue_url} target="_blank" rel="noreferrer" style={{ color: "var(--st-accent)", fontWeight: 700 }}>{link!.task_tracker_issue_key}</a> </div> </div> ) : ( <div style={{ color: "var(--st-danger)", font: "600 12.5px Inter,sans-serif" }}>{state.taskTrackerExportError}</div> )} </div> )} <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 22 }}> {isLinked ? ( <> <a className="clk" href={link!.task_tracker_issue_url} target="_blank" rel="noreferrer" style={{ height: 42, padding: "0 20px", borderRadius: 11, background: "var(--st-accent-2)", color: "var(--st-on-accent)", font: "700 13.5px Inter,sans-serif", display: "inline-flex", alignItems: "center", textDecoration: "none" }}>{t("Open in Task Tracker")}</a> <button className="clk" onClick={closeTaskTrackerExport} style={{ height: 42, padding: "0 20px", border: "1px solid var(--st-border)", borderRadius: 11, background: "var(--st-surface)", font: "700 13.5px Inter,sans-serif", color: "var(--st-text-2)" }}>{t("Done")}</button> </> ) : ( <> <button className="clk" onClick={closeTaskTrackerExport} style={{ height: 42, padding: "0 20px", border: "1px solid var(--st-border)", borderRadius: 11, background: "var(--st-surface)", font: "700 13.5px Inter,sans-serif", color: "var(--st-text-2)" }}>{t("Cancel")}</button> <button className="clk" onClick={doTaskTrackerExport} disabled={exportDisabled} style={{ height: 42, padding: "0 22px", border: "none", borderRadius: 11, background: exportDisabled ? "var(--st-accent-muted)" : "var(--st-accent-2)", color: "var(--st-on-accent)", font: "700 13.5px Inter,sans-serif", cursor: exportDisabled ? "default" : "pointer" }}> {state.taskTrackerExportBusy ? t("Exporting…") : t("Export")} </button> </> )} </div> </> ); })`
- `([ { id: "projects" as const, icon: "folder" as const, label: "Projects", onClick: selProjects }, { id: "tasks" as const, icon: "check-square" as const, label: "Tasks", onClick: () => setState({ nav: "tasks", view: "list", tasksOpenKey: null }) }, { id: "docs" as const, icon: "doc" as const, label: "Docs", onClick: () => setState({ nav: "docs", view: "list" }) }, ...(isAdmin ? [{ id: "members" as const, icon: "users" as const, label: "Members", onClick: selWSMembers }] : []), ]).map`
- `(["critical", "high", "medium", "low", "info", "unrealized"] as Severity[]).map`
- `(state.apiJsFiles ?? []).map`
- `(state.apiMembers ?? []).some`
- `(state.apiProjects ?? []).map`
- `API_SCOPES.map`
- `Object.fromEntries`
- `PROJECT_STATUS_ORDER.map`
- `REPORT_KINDS.map`
- `String`
- `VSTATUS_OPEN.reduce`
- `VSTATUS_ORDER.map`
- `[...ipRowsByAddr.values()] // Скрытые («удалённые» из списка) адреса не показываем — привязка к хостам при // этом сохранена на бэке, адрес просто не значится во вкладке IP. .filter`
- `[...ipRowsByAddr.values()] // Скрытые («удалённые» из списка) адреса не показываем — привязка к хостам при // этом сохранена на бэке, адрес просто не значится во вкладке IP. .filter((row0) => !state.hiddenIps.includes(row0.ip)) .map`
- `[...ipRowsByAddr.values()] // Скрытые («удалённые» из списка) адреса не показываем — привязка к хостам при // этом сохранена на бэке, адрес просто не значится во вкладке IP. .filter((row0) => !state.hiddenIps.includes(row0.ip)) .map((row0) => { // Bare-IP measurement wins; domain probe is the fallback for addresses only // ever resolved from a domain. const meas = row0.ipMeas ?? row0.domainMeas ?? { ports: [], status: "unknown" as Host["status"] }; const row = { ...row0, ports: meas.ports, status: meas.status }; // Dedup names across every host that carries the address; a name confirmed // by any of them is confirmed. PTR entries win over a bare host name. const byName = new Map<string, { hostname: string; source: string; confirmed: boolean }>(); for (const n of row.names) { const cur = byName.get(n.hostname); if (!cur) byName.set(n.hostname, { ...n }); else { cur.confirmed = cur.confirmed || n.confirmed; if (cur.source !== "ptr" && n.source === "ptr") cur.source = n.source; } } const names = [...byName.values()].sort( (a, b) => Number(b.confirmed) - Number(a.confirmed) || a.hostname.localeCompare(b.hostname), ); return { ...row, names }; }) .filter`
- `[...ipRowsByAddr.values()] // Скрытые («удалённые» из списка) адреса не показываем — привязка к хостам при // этом сохранена на бэке, адрес просто не значится во вкладке IP. .filter((row0) => !state.hiddenIps.includes(row0.ip)) .map((row0) => { // Bare-IP measurement wins; domain probe is the fallback for addresses only // ever resolved from a domain. const meas = row0.ipMeas ?? row0.domainMeas ?? { ports: [], status: "unknown" as Host["status"] }; const row = { ...row0, ports: meas.ports, status: meas.status }; // Dedup names across every host that carries the address; a name confirmed // by any of them is confirmed. PTR entries win over a bare host name. const byName = new Map<string, { hostname: string; source: string; confirmed: boolean }>(); for (const n of row.names) { const cur = byName.get(n.hostname); if (!cur) byName.set(n.hostname, { ...n }); else { cur.confirmed = cur.confirmed || n.confirmed; if (cur.source !== "ptr" && n.source === "ptr") cur.source = n.source; } } const names = [...byName.values()].sort( (a, b) => Number(b.confirmed) - Number(a.confirmed) || a.hostname.localeCompare(b.hostname), ); return { ...row, names }; }) .filter( (row) => !ipQ || row.ip.toLowerCase().includes(ipQ) || row.names.some((n) => n.hostname.toLowerCase().includes(ipQ)), ) // Same status filter as hosts. The Status *column* is gone from this table, // but filtering by HTTP code still answers a real question here. .filter`
- `[...ipRowsByAddr.values()] // Скрытые («удалённые» из списка) адреса не показываем — привязка к хостам при // этом сохранена на бэке, адрес просто не значится во вкладке IP. .filter((row0) => !state.hiddenIps.includes(row0.ip)) .map((row0) => { // Bare-IP measurement wins; domain probe is the fallback for addresses only // ever resolved from a domain. const meas = row0.ipMeas ?? row0.domainMeas ?? { ports: [], status: "unknown" as Host["status"] }; const row = { ...row0, ports: meas.ports, status: meas.status }; // Dedup names across every host that carries the address; a name confirmed // by any of them is confirmed. PTR entries win over a bare host name. const byName = new Map<string, { hostname: string; source: string; confirmed: boolean }>(); for (const n of row.names) { const cur = byName.get(n.hostname); if (!cur) byName.set(n.hostname, { ...n }); else { cur.confirmed = cur.confirmed || n.confirmed; if (cur.source !== "ptr" && n.source === "ptr") cur.source = n.source; } } const names = [...byName.values()].sort( (a, b) => Number(b.confirmed) - Number(a.confirmed) || a.hostname.localeCompare(b.hostname), ); return { ...row, names }; }) .filter( (row) => !ipQ || row.ip.toLowerCase().includes(ipQ) || row.names.some((n) => n.hostname.toLowerCase().includes(ipQ)), ) // Same status filter as hosts. The Status *column* is gone from this table, // but filtering by HTTP code still answers a real question here. .filter((row) => matchesStatusFilters(row.ports, row.status, state.ipFilters)) .map`
- `[...new Set(jsFilesFiltered.map((f) => f.host))].map`
- `allProjects .filter`
- `allProjects .filter((p) => (state.tab === "active" ? !isArchivedStatus(p.status) : isArchivedStatus(p.status))) .filter`
- `allProjects.filter`
- `computeCvss4`
- `d.members.map`
- `d.notes.find`
- `d.vulns .map`
- `d.vulns .map((v, idx) => ({ v, idx })) .filter`
- `d.vulns .map((v, idx) => ({ v, idx })) .filter( ({ v }) => (!vfA || v.author.toLowerCase().includes(vfA)) && (vfS.length === 0 || vfS.includes(v.status)) && (vfSev.length === 0 || vfSev.includes(v.sev)) && (!vfQ || v.host.toLowerCase().includes(vfQ) || v.title.toLowerCase().includes(vfQ)) ) // Newest first: a just-added finding lands at the top, not buried at the end. // idx is captured above, so edit/delete still address the right d.vulns entry. .sort`
- `d.vulns .map((v, idx) => ({ v, idx })) .filter( ({ v }) => (!vfA || v.author.toLowerCase().includes(vfA)) && (vfS.length === 0 || vfS.includes(v.status)) && (vfSev.length === 0 || vfSev.includes(v.sev)) && (!vfQ || v.host.toLowerCase().includes(vfQ) || v.title.toLowerCase().includes(vfQ)) ) // Newest first: a just-added finding lands at the top, not buried at the end. // idx is captured above, so edit/delete still address the right d.vulns entry. .sort((a, b) => b.v.id - a.v.id) .map`
- `d.vulns.filter`
- `d.vulns.find`
- `d.vulns.forEach`
- `datesInvalid`
- `editorFields.map`
- `efCfg.filter`
- `efCfg.map`
- `elapsedPct`
- `endpointGroups.reduce`
- `fileBase`
- `fstr`
- `fstr(state.editorForm.ip).trim`
- `groupActivity`
- `hosts .map`
- `hosts .map((h, idx) => ({ h, idx })) .filter`
- `hosts.find`
- `hosts.forEach`
- `initialsOf`
- `ipRowsByAddr.values`
- `ipsRows.find`
- `isFarmJobInFlight`
- `jsFiles.filter`
- `jsFiles.find`
- `jsFilesFiltered.map`
- `meAvatar`
- `modalFooter`
- `modalShell`
- `new Date().toISOString`
- `new Date().toISOString().slice`
- `notifs.filter`
- `notifs.map`
- `projRows.sort`
- `renderDetail`
- `renderNoAccessPage`
- `renderProfile`
- `renderProjects`
- `renderTasks`
- `renderWorkspaceMembers`
- `secStyle`
- `state.apiProjects?.find`
- `state.epHostQuery.trim`
- `state.epHostQuery.trim().toLowerCase`
- `state.epPathQuery.trim`
- `state.epPathQuery.trim().toLowerCase`
- `state.ipQuery.trim`
- `state.ipQuery.trim().toLowerCase`
- `state.jsQuery.trim`
- `state.jsQuery.trim().toLowerCase`
- `state.newName.trim`
- `state.noteForm.title.trim`
- `state.notifs.map`
- `state.query.trim`
- `state.query.trim().toLowerCase`
- `state.vulnFilterAuthor.trim`
- `state.vulnFilterAuthor.trim().toLowerCase`
- `state.vulnFilterHost.trim`
- `state.vulnFilterHost.trim().toLowerCase`
- `state.workspaceUsers.filter`
- `stsMissing.map`
- `stsMissing.map((field) => t(field)).join`
- `t`
- `toDispDate`
- `useAuthStore`
- `useEffect`
- `useLangStore`
- `useLocation`
- `useMemo`
- `useNavigate`
- `useReconJobPolling`
- `useRef`
- `useState`
- `useThemeStore`
- `useToastStore`
- `vdCvss.score.toFixed`
- `vfPill`

</details>

## StormApp.sync

[frontend/src/storm/StormApp.tsx:1398](../../../../../frontend/src/storm/StormApp.tsx#L1398)

```typescript
sync() => void
```

В теле вызывает `setStateRaw`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setStateRaw`

</details>

## StormApp.setState

[frontend/src/storm/StormApp.tsx:1414](../../../../../frontend/src/storm/StormApp.tsx#L1414)

```typescript
setState(patch: Partial<StormState> | ((s: StormState) => Partial<StormState>)) => void
```

В теле вызывает `setStateRaw`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `patch` | `Partial<StormState> \| ((s: StormState) => Partial<StormState>)` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setStateRaw`

</details>

## StormApp.toggle

[frontend/src/storm/StormApp.tsx:1416](../../../../../frontend/src/storm/StormApp.tsx#L1416)

```typescript
toggle(k: keyof StormState) => void
```

В теле вызывает `setStateRaw`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `k` | `keyof StormState` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setStateRaw`

</details>

## StormApp.clearAvatarPick

[frontend/src/storm/StormApp.tsx:1452](../../../../../frontend/src/storm/StormApp.tsx#L1452)

```typescript
clearAvatarPick() => void
```

В теле вызывает `setAvatarFile`, `setAvatarPreview`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setAvatarFile`
- `setAvatarPreview`

</details>

## StormApp.onAvatarPick

[frontend/src/storm/StormApp.tsx:1460](../../../../../frontend/src/storm/StormApp.tsx#L1460)

```typescript
onAvatarPick(e: ChangeEvent<HTMLInputElement>) => void
```

В теле вызывает `AVATAR_TYPES.includes`, `pushToast`, `setAvatarFile`, `setAvatarPreview`, `t`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `e` | `ChangeEvent<HTMLInputElement>` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `AVATAR_TYPES.includes`
- `pushToast`
- `setAvatarFile`
- `setAvatarPreview`
- `t`

</details>

## StormApp.submitAvatar

[frontend/src/storm/StormApp.tsx:1479](../../../../../frontend/src/storm/StormApp.tsx#L1479)

```typescript
async submitAvatar() => Promise<void>
```

В теле вызывает `apiUploadMyAvatar`, `clearAvatarPick`, `getApiErrorMessage`, `pushToast`, `setAvatarUploading`, `setUser`, `t`.

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `apiUploadMyAvatar`
- `clearAvatarPick`
- `getApiErrorMessage`
- `pushToast`
- `setAvatarUploading`
- `setUser`
- `t`

</details>

## StormApp.meAvatar

[frontend/src/storm/StormApp.tsx:1495](../../../../../frontend/src/storm/StormApp.tsx#L1495)

```typescript
meAvatar(size: number, fontPx: number, text: string, src: string | null = authUser?.avatar_url ?? null) => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

Круг-аватар текущего пользователя: фото, если оно есть, иначе инициалы.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `size` | `number` | `обязательный` | Число элементов страницы; верхняя граница задаётся маршрутом. |
| `fontPx` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `text` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `src` | `string \| null` | `authUser?.avatar_url ?? null` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

## StormApp.handleProjectError

[frontend/src/storm/StormApp.tsx:1522](../../../../../frontend/src/storm/StormApp.tsx#L1522)

```typescript
handleProjectError(e: unknown, fallback: string) => void
```

Any request that 403s for the open project flips the no-access screen on.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `e` | `unknown` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `fallback` | `string` | `обязательный` | Запасное значение при отсутствии основного. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `getApiErrorMessage`
- `getApiErrorStatus`
- `pushToast`
- `setStateRaw`

</details>

## StormApp.reloadProjects

[frontend/src/storm/StormApp.tsx:1531](../../../../../frontend/src/storm/StormApp.tsx#L1531)

```typescript
reloadProjects() => void
```

В теле вызывает `setStateRaw`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setStateRaw`

</details>

## StormApp.reloadUsers

[frontend/src/storm/StormApp.tsx:1631](../../../../../frontend/src/storm/StormApp.tsx#L1631)

```typescript
reloadUsers() => void
```

В теле вызывает `setStateRaw`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setStateRaw`

</details>

## StormApp.reloadHosts

[frontend/src/storm/StormApp.tsx:1688](../../../../../frontend/src/storm/StormApp.tsx#L1688)

```typescript
reloadHosts() => void
```

В теле вызывает `setStateRaw`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setStateRaw`

</details>

## StormApp.reloadJsFiles

[frontend/src/storm/StormApp.tsx:1730](../../../../../frontend/src/storm/StormApp.tsx#L1730)

```typescript
reloadJsFiles() => void
```

В теле вызывает `setStateRaw`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setStateRaw`

</details>

## StormApp.reloadJsFilesThrottled

[frontend/src/storm/StormApp.tsx:1732](../../../../../frontend/src/storm/StormApp.tsx#L1732)

```typescript
reloadJsFilesThrottled() => void
```

В теле вызывает `Date.now`, `reloadJsFiles`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Date.now`
- `reloadJsFiles`

</details>

## StormApp.hostFarmDoneToast

[frontend/src/storm/StormApp.tsx:1780](../../../../../frontend/src/storm/StormApp.tsx#L1780)

```typescript
hostFarmDoneToast(r: NonNullable<ApiHostFarmJob["result"]>) => void
```

В теле вызывает `pushToast`, `t`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `r` | `NonNullable<ApiHostFarmJob["result"]>` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `pushToast`
- `t`

</details>

## StormApp.ipFarmDoneToast

[frontend/src/storm/StormApp.tsx:1788](../../../../../frontend/src/storm/StormApp.tsx#L1788)

```typescript
ipFarmDoneToast(r: NonNullable<ApiIpFarmJob["result"]>) => void
```

В теле вызывает `pushToast`, `t`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `r` | `NonNullable<ApiIpFarmJob["result"]>` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `pushToast`
- `t`

</details>

## StormApp.update

[frontend/src/storm/StormApp.tsx:1799](../../../../../frontend/src/storm/StormApp.tsx#L1799)

```typescript
update(next) => void
```

В теле вызывает `hostFarmDoneToast`, `pushToast`, `reloadHosts`, `setStateRaw`, `t`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `next` | `HostFarmJob` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `hostFarmDoneToast`
- `pushToast`
- `reloadHosts`
- `setStateRaw`
- `t`

</details>

## StormApp.retry

[frontend/src/storm/StormApp.tsx:1805](../../../../../frontend/src/storm/StormApp.tsx#L1805)

```typescript
retry() => void
```

В теле вызывает `setStateRaw`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setStateRaw`

</details>

## StormApp.error

[frontend/src/storm/StormApp.tsx:1806](../../../../../frontend/src/storm/StormApp.tsx#L1806)

```typescript
error(error) => void
```

В теле вызывает `getApiErrorMessage`, `pushToast`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `error` | `unknown` | `обязательный` | Перехваченное исключение/ответ ошибки. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `getApiErrorMessage`
- `pushToast`

</details>

## StormApp.update

[frontend/src/storm/StormApp.tsx:1811](../../../../../frontend/src/storm/StormApp.tsx#L1811)

```typescript
update(next) => void
```

В теле вызывает `ipFarmDoneToast`, `pushToast`, `reloadHosts`, `setStateRaw`, `t`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `next` | `IpFarmJob` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `ipFarmDoneToast`
- `pushToast`
- `reloadHosts`
- `setStateRaw`
- `t`

</details>

## StormApp.retry

[frontend/src/storm/StormApp.tsx:1817](../../../../../frontend/src/storm/StormApp.tsx#L1817)

```typescript
retry() => void
```

В теле вызывает `setStateRaw`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setStateRaw`

</details>

## StormApp.error

[frontend/src/storm/StormApp.tsx:1818](../../../../../frontend/src/storm/StormApp.tsx#L1818)

```typescript
error(error) => void
```

В теле вызывает `getApiErrorMessage`, `pushToast`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `error` | `unknown` | `обязательный` | Перехваченное исключение/ответ ошибки. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `getApiErrorMessage`
- `pushToast`

</details>

## StormApp.update

[frontend/src/storm/StormApp.tsx:1823](../../../../../frontend/src/storm/StormApp.tsx#L1823)

```typescript
update(next) => void
```

В теле вызывает `isFarmJobInFlight`, `pushToast`, `reloadJsFiles`, `reloadJsFilesThrottled`, `setStateRaw`, `t`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `next` | `JsFarmJob` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `isFarmJobInFlight`
- `pushToast`
- `reloadJsFiles`
- `reloadJsFilesThrottled`
- `setStateRaw`
- `t`

</details>

## StormApp.retry

[frontend/src/storm/StormApp.tsx:1829](../../../../../frontend/src/storm/StormApp.tsx#L1829)

```typescript
retry() => void
```

В теле вызывает `setStateRaw`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setStateRaw`

</details>

## StormApp.error

[frontend/src/storm/StormApp.tsx:1830](../../../../../frontend/src/storm/StormApp.tsx#L1830)

```typescript
error(error) => void
```

В теле вызывает `getApiErrorMessage`, `pushToast`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `error` | `unknown` | `обязательный` | Перехваченное исключение/ответ ошибки. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `getApiErrorMessage`
- `pushToast`

</details>

## StormApp.subdomainsOf

[frontend/src/storm/StormApp.tsx:1839](../../../../../frontend/src/storm/StormApp.tsx#L1839)

```typescript
subdomainsOf(host: Host) => Host[]
```

В теле вызывает `hostIndex.descendants.get`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `host` | `Host` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Host[]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `hostIndex.descendants.get`

</details>

## StormApp.reloadMembers

[frontend/src/storm/StormApp.tsx:1843](../../../../../frontend/src/storm/StormApp.tsx#L1843)

```typescript
reloadMembers() => void
```

В теле вызывает `setStateRaw`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setStateRaw`

</details>

## StormApp.reloadVulns

[frontend/src/storm/StormApp.tsx:1873](../../../../../frontend/src/storm/StormApp.tsx#L1873)

```typescript
reloadVulns() => void
```

В теле вызывает `setStateRaw`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setStateRaw`

</details>

## StormApp.reloadNotes

[frontend/src/storm/StormApp.tsx:1910](../../../../../frontend/src/storm/StormApp.tsx#L1910)

```typescript
reloadNotes() => void
```

В теле вызывает `setStateRaw`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setStateRaw`

</details>

## StormApp.reloadCreds

[frontend/src/storm/StormApp.tsx:1936](../../../../../frontend/src/storm/StormApp.tsx#L1936)

```typescript
reloadCreds() => void
```

В теле вызывает `setStateRaw`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setStateRaw`

</details>

## StormApp.canEditProjectRow

[frontend/src/storm/StormApp.tsx:2013](../../../../../frontend/src/storm/StormApp.tsx#L2013)

```typescript
canEditProjectRow(row: ApiProjectRow) => boolean
```

Преобразование/вычисление в теле функции; тип результата и параметры приведены ниже, точное выражение доступно по ссылке на исходник.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `row` | `ApiProjectRow` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `boolean`.

## StormApp.selProjects

[frontend/src/storm/StormApp.tsx:2019](../../../../../frontend/src/storm/StormApp.tsx#L2019)

```typescript
selProjects() => void
```

В теле вызывает `setState`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.openProject

[frontend/src/storm/StormApp.tsx:2031](../../../../../frontend/src/storm/StormApp.tsx#L2031)

```typescript
openProject(id: number) => void
```

В теле вызывает `setState`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `id` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.openProfile

[frontend/src/storm/StormApp.tsx:2033](../../../../../frontend/src/storm/StormApp.tsx#L2033)

```typescript
openProfile() => void
```

В теле вызывает `setState`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.selWSMembers

[frontend/src/storm/StormApp.tsx:2034](../../../../../frontend/src/storm/StormApp.tsx#L2034)

```typescript
selWSMembers() => void
```

В теле вызывает `setState`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.reloadActivity

[frontend/src/storm/StormApp.tsx:2037](../../../../../frontend/src/storm/StormApp.tsx#L2037)

```typescript
reloadActivity() => void
```

В теле вызывает `setStateRaw`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setStateRaw`

</details>

## StormApp.loadActivity

[frontend/src/storm/StormApp.tsx:2038](../../../../../frontend/src/storm/StormApp.tsx#L2038)

```typescript
loadActivity(pid: number) => void
```

В теле вызывает `(async () => { try { const items = await apiGetProjectActivity(pid, 50); setStateRaw((s) => ({ ...s, activity: items, activityLoading: false })); } catch (e) { if (getApiErrorStatus(e) === 403 || getApiErrorStatus(e) === 404) { setStateRaw((s) => ({ ...s, activity: [], activityLoading: false, accessDenied: true })); return; } setStateRaw((s) => ({ ...s, activity: [], activityError: getApiErrorMessage(e, "Couldn't load activity"), activityLoading: false })); } })`, `setStateRaw`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `pid` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(async () => { try { const items = await apiGetProjectActivity(pid, 50); setStateRaw((s) => ({ ...s, activity: items, activityLoading: false })); } catch (e) { if (getApiErrorStatus(e) === 403 || getApiErrorStatus(e) === 404) { setStateRaw((s) => ({ ...s, activity: [], activityLoading: false, accessDenied: true })); return; } setStateRaw((s) => ({ ...s, activity: [], activityError: getApiErrorMessage(e, "Couldn't load activity"), activityLoading: false })); } })`
- `setStateRaw`

</details>

## StormApp.setSection

[frontend/src/storm/StormApp.tsx:2059](../../../../../frontend/src/storm/StormApp.tsx#L2059)

```typescript
setSection(s: SectionId) => void
```

A section tab always lands on that section's list, never on a card left open in it.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `s` | `SectionId` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.selRecon

[frontend/src/storm/StormApp.tsx:2061](../../../../../frontend/src/storm/StormApp.tsx#L2061)

```typescript
selRecon(v: ReconView) => void
```

В теле вызывает `setState`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `v` | `ReconView` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.reloadTasks

[frontend/src/storm/StormApp.tsx:2122](../../../../../frontend/src/storm/StormApp.tsx#L2122)

```typescript
reloadTasks() => void
```

В теле вызывает `(async () => { try { const res = await apiGetTasks({}); setStateRaw((s) => ({ ...s, tasksRows: res.items, tasksLoading: false })); } catch (e) { setStateRaw((s) => ({ ...s, tasksRows: [], tasksLoading: false, tasksError: getApiErrorMessage(e, "Couldn't load tasks from Task Tracker") })); } })`, `setState`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(async () => { try { const res = await apiGetTasks({}); setStateRaw((s) => ({ ...s, tasksRows: res.items, tasksLoading: false })); } catch (e) { setStateRaw((s) => ({ ...s, tasksRows: [], tasksLoading: false, tasksError: getApiErrorMessage(e, "Couldn't load tasks from Task Tracker") })); } })`
- `setState`

</details>

## StormApp.onKeyDown

[frontend/src/storm/StormApp.tsx:2215](../../../../../frontend/src/storm/StormApp.tsx#L2215)

```typescript
onKeyDown(e: KeyboardEvent) => void
```

В теле вызывает `Array.from`, `document.querySelectorAll`, `open .reduce`, `open .reduce((top, el) => (parseInt(getComputedStyle(el).zIndex) || 0) >= (parseInt(getComputedStyle(top).zIndex) || 0) ? el : top ) .click`, `setStateRaw`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `e` | `KeyboardEvent` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Array.from`
- `document.querySelectorAll`
- `open .reduce`
- `open .reduce((top, el) => (parseInt(getComputedStyle(el).zIndex) || 0) >= (parseInt(getComputedStyle(top).zIndex) || 0) ? el : top ) .click`
- `setStateRaw`

</details>

## StormApp.datesInvalid

[frontend/src/storm/StormApp.tsx:2236](../../../../../frontend/src/storm/StormApp.tsx#L2236)

```typescript
datesInvalid(startISO: string, endISO: string) => boolean
```

The backend rejects this too (422) — checked here so the form says so before submitting.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `startISO` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `endISO` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `boolean`.

## StormApp.emptyProjectDraft

[frontend/src/storm/StormApp.tsx:2239](../../../../../frontend/src/storm/StormApp.tsx#L2239)

```typescript
emptyProjectDraft() => { newName: string; newStart: string; newEnd: string; newNameError: boolean; newAppsec: AppSecFieldsValue; }
```

В теле вызывает `emptyAppsecFields`.

Возвращает: `{ newName: string; newStart: string; newEnd: string; newNameError: boolean; newAppsec: AppSecFieldsValue; }`.

<details>
<summary>Прямые вызовы в теле</summary>

- `emptyAppsecFields`

</details>

## StormApp.openNewProject

[frontend/src/storm/StormApp.tsx:2240](../../../../../frontend/src/storm/StormApp.tsx#L2240)

```typescript
openNewProject() => void
```

В теле вызывает `emptyProjectDraft`, `setState`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `emptyProjectDraft`
- `setState`

</details>

## StormApp.closeNewProject

[frontend/src/storm/StormApp.tsx:2244](../../../../../frontend/src/storm/StormApp.tsx#L2244)

```typescript
closeNewProject() => void
```

В теле вызывает `emptyProjectDraft`, `setState`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `emptyProjectDraft`
- `setState`

</details>

## StormApp.createProject

[frontend/src/storm/StormApp.tsx:2249](../../../../../frontend/src/storm/StormApp.tsx#L2249)

```typescript
async createProject() => Promise<void>
```

В теле вызывает `apiCreateProject`, `datesInvalid`, `emptyProjectDraft`, `getApiErrorMessage`, `pushToast`, `reloadProjects`, `setState`, `state.newName.trim`; полный список ниже.

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `apiCreateProject`
- `datesInvalid`
- `emptyProjectDraft`
- `getApiErrorMessage`
- `pushToast`
- `reloadProjects`
- `setState`
- `state.newName.trim`
- `t`

</details>

## StormApp.loadProjAppsec

[frontend/src/storm/StormApp.tsx:2284](../../../../../frontend/src/storm/StormApp.tsx#L2284)

```typescript
loadProjAppsec(id: number | null) => void
```

В теле вызывает `apiGetProject`, `apiGetProject(id) .then`, `apiGetProject(id) .then((p) => setState({ projEditAppsec: { appsec_components: p.appsec_components?.length ? p.appsec_components : p.appsec_component_code ? [{ code: p.appsec_component_code, name: p.appsec_component_name || p.appsec_component_code }] : [], appsec_product_code: p.appsec_product_code ?? null, appsec_component_code: p.appsec_component_code, appsec_component_name: p.appsec_component_name, appsec_versions: p.appsec_versions?.length ? p.appsec_versions : p.appsec_version_code ? [{ code: p.appsec_version_code, name: p.appsec_version_name || p.appsec_version_code }] : [], appsec_assignee_name: p.appsec_assignee_name ?? null, appsec_assignee: p.appsec_assignee, appsec_ticket_url: p.appsec_ticket_url, appsec_ticket_key: p.appsec_ticket_key, }, }) ) .catch`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `id` | `number \| null` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `apiGetProject`
- `apiGetProject(id) .then`
- `apiGetProject(id) .then((p) => setState({ projEditAppsec: { appsec_components: p.appsec_components?.length ? p.appsec_components : p.appsec_component_code ? [{ code: p.appsec_component_code, name: p.appsec_component_name || p.appsec_component_code }] : [], appsec_product_code: p.appsec_product_code ?? null, appsec_component_code: p.appsec_component_code, appsec_component_name: p.appsec_component_name, appsec_versions: p.appsec_versions?.length ? p.appsec_versions : p.appsec_version_code ? [{ code: p.appsec_version_code, name: p.appsec_version_name || p.appsec_version_code }] : [], appsec_assignee_name: p.appsec_assignee_name ?? null, appsec_assignee: p.appsec_assignee, appsec_ticket_url: p.appsec_ticket_url, appsec_ticket_key: p.appsec_ticket_key, }, }) ) .catch`

</details>

## StormApp.openProjEditRow

[frontend/src/storm/StormApp.tsx:2305](../../../../../frontend/src/storm/StormApp.tsx#L2305)

```typescript
openProjEditRow(row: ApiProjectRow) => void
```

В теле вызывает `loadProjAppsec`, `setState`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `row` | `ApiProjectRow` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `loadProjAppsec`
- `setState`

</details>

## StormApp.openProjEdit

[frontend/src/storm/StormApp.tsx:2318](../../../../../frontend/src/storm/StormApp.tsx#L2318)

```typescript
openProjEdit() => void
```

В теле вызывает `loadProjAppsec`, `setState`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `loadProjAppsec`
- `setState`

</details>

## StormApp.closeProjEdit

[frontend/src/storm/StormApp.tsx:2330](../../../../../frontend/src/storm/StormApp.tsx#L2330)

```typescript
closeProjEdit() => void
```

В теле вызывает `setState`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.saveProjEdit

[frontend/src/storm/StormApp.tsx:2331](../../../../../frontend/src/storm/StormApp.tsx#L2331)

```typescript
async saveProjEdit() => Promise<void>
```

В теле вызывает `apiUpdateProject`, `datesInvalid`, `getApiErrorMessage`, `pushToast`, `reloadProjects`, `setState`, `state.projEditName.trim`, `t`.

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `apiUpdateProject`
- `datesInvalid`
- `getApiErrorMessage`
- `pushToast`
- `reloadProjects`
- `setState`
- `state.projEditName.trim`
- `t`

</details>

## StormApp.askDeleteProject

[frontend/src/storm/StormApp.tsx:2355](../../../../../frontend/src/storm/StormApp.tsx#L2355)

```typescript
askDeleteProject(row: ApiProjectRow) => void
```

В теле вызывает `setState`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `row` | `ApiProjectRow` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.openExportModal

[frontend/src/storm/StormApp.tsx:2361](../../../../../frontend/src/storm/StormApp.tsx#L2361)

```typescript
openExportModal() => void
```

В теле вызывает `setState`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.closeExportModal

[frontend/src/storm/StormApp.tsx:2362](../../../../../frontend/src/storm/StormApp.tsx#L2362)

```typescript
closeExportModal() => void
```

В теле вызывает `setState`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.downloadText

[frontend/src/storm/StormApp.tsx:2368](../../../../../frontend/src/storm/StormApp.tsx#L2368)

```typescript
downloadText(text: string, filename: string, mime = "text/plain") => void
```

В теле вызывает `URL.createObjectURL`, `URL.revokeObjectURL`, `a.click`, `a.remove`, `document.body.appendChild`, `document.createElement`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `text` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `filename` | `string` | `обязательный` | Имя файла. |
| `mime` | `string` | `"text/plain"` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `URL.createObjectURL`
- `URL.revokeObjectURL`
- `a.click`
- `a.remove`
- `document.body.appendChild`
- `document.createElement`

</details>

## StormApp.slug

[frontend/src/storm/StormApp.tsx:2379](../../../../../frontend/src/storm/StormApp.tsx#L2379)

```typescript
slug(s: string) => string
```

В теле вызывает `(s.replace(/[^\w.-]+/g, "_").replace(/^_+|_+$/g, "") || "export").slice`, `s.replace`, `s.replace(/[^\w.-]+/g, "_").replace`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `s` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `string`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(s.replace(/[^\w.-]+/g, "_").replace(/^_+|_+$/g, "") || "export").slice`
- `s.replace`
- `s.replace(/[^\w.-]+/g, "_").replace`

</details>

## StormApp.exportTextLines

[frontend/src/storm/StormApp.tsx:2382](../../../../../frontend/src/storm/StormApp.tsx#L2382)

```typescript
exportTextLines(text: string) => string[]
```

Non-empty, trimmed lines of the editable pane — what actually gets written.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `text` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `string[]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `text.split`
- `text.split(/\r?\n/).map`
- `text.split(/\r?\n/).map((l) => l.trim()).filter`

</details>

## StormApp.exportLinesFor

[frontend/src/storm/StormApp.tsx:2388](../../../../../frontend/src/storm/StormApp.tsx#L2388)

```typescript
exportLinesFor(scope: ExportScope) => string[]
```

В теле вызывает `endpointGroups.flatMap`, `f.secrets.map`, `hostsList.forEach`, `ipsRows.flatMap`, `jsFiles.filter`, `line.trim`, `out.push`, `rows.flatMap`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `scope` | `ExportScope` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `string[]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `endpointGroups.flatMap`
- `f.secrets.map`
- `hostsList.forEach`
- `ipsRows.flatMap`
- `jsFiles.filter`
- `line.trim`
- `out.push`
- `rows.flatMap`
- `uniq.add`
- `uniq.has`

</details>

## StormApp.exportLinesFor.add

[frontend/src/storm/StormApp.tsx:2422](../../../../../frontend/src/storm/StormApp.tsx#L2422)

```typescript
add(x: Host) => void
```

В теле вызывает `rows.push`, `seen.add`, `seen.has`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `x` | `Host` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `rows.push`
- `seen.add`
- `seen.has`

</details>

## StormApp.endpointLinesToOpenApi

[frontend/src/storm/StormApp.tsx:2437](../../../../../frontend/src/storm/StormApp.tsx#L2437)

```typescript
endpointLinesToOpenApi(lines: string[]) => string
```

Rebuilds the OpenAPI doc from the edited lines, so edits reach the JSON too.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `lines` | `string[]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `string`.

<details>
<summary>Прямые вызовы в теле</summary>

- `JSON.stringify`
- `lines.forEach`

</details>

## StormApp.doReconExport

[frontend/src/storm/StormApp.tsx:2467](../../../../../frontend/src/storm/StormApp.tsx#L2467)

```typescript
doReconExport() => void
```

В теле вызывает `closeReconExport`, `downloadText`, `endpointLinesToOpenApi`, `exportTextLines`, `lines.join`, `slug`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `closeReconExport`
- `downloadText`
- `endpointLinesToOpenApi`
- `exportTextLines`
- `lines.join`
- `slug`

</details>

## StormApp.openReconExport

[frontend/src/storm/StormApp.tsx:2484](../../../../../frontend/src/storm/StormApp.tsx#L2484)

```typescript
openReconExport(scope: ExportScope) => void
```

В теле вызывает `exportLinesFor`, `exportLinesFor(scope).join`, `setState`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `scope` | `ExportScope` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `exportLinesFor`
- `exportLinesFor(scope).join`
- `setState`

</details>

## StormApp.closeReconExport

[frontend/src/storm/StormApp.tsx:2486](../../../../../frontend/src/storm/StormApp.tsx#L2486)

```typescript
closeReconExport() => void
```

В теле вызывает `setState`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.doExport

[frontend/src/storm/StormApp.tsx:2487](../../../../../frontend/src/storm/StormApp.tsx#L2487)

```typescript
async doExport() => Promise<void>
```

В теле вызывает `URL.createObjectURL`, `URL.revokeObjectURL`, `a.click`, `a.remove`, `apiDownloadAcceptanceReport`, `apiDownloadCertificationReport`, `document.body.appendChild`, `document.createElement`; полный список ниже.

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `URL.createObjectURL`
- `URL.revokeObjectURL`
- `a.click`
- `a.remove`
- `apiDownloadAcceptanceReport`
- `apiDownloadCertificationReport`
- `document.body.appendChild`
- `document.createElement`
- `getApiErrorMessage`
- `pushToast`
- `setState`

</details>

## StormApp.checkProjectForSts

[frontend/src/storm/StormApp.tsx:2514](../../../../../frontend/src/storm/StormApp.tsx#L2514)

```typescript
async checkProjectForSts(projectId: number) => Promise<boolean>
```

Перечитывает метаданные проекта перед STS-экспортом.
При отсутствии тикета, исполнителя или версий показывает список полей
и возвращает false до обращения к интеграции.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |

Возвращает: `Promise<boolean>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `apiGetProject`
- `getApiErrorMessage`
- `missing.map`
- `missing.map((field) => t(field)).join`
- `missingStsProjectFields`
- `pushToast`
- `t`

</details>

## StormApp.openTaskTrackerExport

[frontend/src/storm/StormApp.tsx:2531](../../../../../frontend/src/storm/StormApp.tsx#L2531)

```typescript
async openTaskTrackerExport(vulnId: number) => Promise<void>
```

В теле вызывает `apiGetVulnerabilityTaskTrackerLink`, `apiGetVulnerabilityTaskTrackerLink(pid, vulnId) .catch`, `apiGetVulnerabilityTaskTrackerLink(pid, vulnId) .catch(() => null) .then`, `checkProjectForSts`, `setState`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `vulnId` | `number` | `обязательный` | ID уязвимости в API. |

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `apiGetVulnerabilityTaskTrackerLink`
- `apiGetVulnerabilityTaskTrackerLink(pid, vulnId) .catch`
- `apiGetVulnerabilityTaskTrackerLink(pid, vulnId) .catch(() => null) .then`
- `checkProjectForSts`
- `setState`

</details>

## StormApp.closeTaskTrackerExport

[frontend/src/storm/StormApp.tsx:2548](../../../../../frontend/src/storm/StormApp.tsx#L2548)

```typescript
closeTaskTrackerExport() => void
```

В теле вызывает `setState`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.doTaskTrackerExport

[frontend/src/storm/StormApp.tsx:2549](../../../../../frontend/src/storm/StormApp.tsx#L2549)

```typescript
async doTaskTrackerExport() => Promise<void>
```

В теле вызывает `apiExportVulnerabilityToTaskTracker`, `getApiErrorMessage`, `pushToast`, `setState`, `t`.

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `apiExportVulnerabilityToTaskTracker`
- `getApiErrorMessage`
- `pushToast`
- `setState`
- `t`

</details>

## StormApp.openBulkTaskTracker

[frontend/src/storm/StormApp.tsx:2566](../../../../../frontend/src/storm/StormApp.tsx#L2566)

```typescript
async openBulkTaskTracker() => Promise<void>
```

В теле вызывает `checkProjectForSts`, `setState`.

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `checkProjectForSts`
- `setState`

</details>

## StormApp.closeBulkTaskTracker

[frontend/src/storm/StormApp.tsx:2582](../../../../../frontend/src/storm/StormApp.tsx#L2582)

```typescript
closeBulkTaskTracker() => void
```

В теле вызывает `setState`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.doBulkTaskTrackerExport

[frontend/src/storm/StormApp.tsx:2585](../../../../../frontend/src/storm/StormApp.tsx#L2585)

```typescript
async doBulkTaskTrackerExport() => Promise<void>
```

В теле вызывает `apiExportVulnerabilityToTaskTracker`, `apiGetVulnerabilityTaskTrackerLink`, `apiGetVulnerabilityTaskTrackerLink(pid, id).catch`, `checkProjectForSts`, `pushToast`, `reloadVulns`, `rememberProjectUrl`, `setState`; полный список ниже.

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `apiExportVulnerabilityToTaskTracker`
- `apiGetVulnerabilityTaskTrackerLink`
- `apiGetVulnerabilityTaskTrackerLink(pid, id).catch`
- `checkProjectForSts`
- `pushToast`
- `reloadVulns`
- `rememberProjectUrl`
- `setState`
- `t`
- `vulns.map`

</details>

## StormApp.doBulkTaskTrackerExport.rememberProjectUrl

[frontend/src/storm/StormApp.tsx:2596](../../../../../frontend/src/storm/StormApp.tsx#L2596)

```typescript
rememberProjectUrl(issueUrl?: string) => void
```

В теле вызывает `issueUrl.match`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `issueUrl` | `string` | `undefined (optional)` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `issueUrl.match`

</details>

## StormApp.toggleHost

[frontend/src/storm/StormApp.tsx:2624](../../../../../frontend/src/storm/StormApp.tsx#L2624)

```typescript
toggleHost(id: number) => void
```

В теле вызывает `setState`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `id` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.openHostDetail

[frontend/src/storm/StormApp.tsx:2626](../../../../../frontend/src/storm/StormApp.tsx#L2626)

```typescript
openHostDetail(id: number) => void
```

В теле вызывает `setState`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `id` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.closeHostDetail

[frontend/src/storm/StormApp.tsx:2627](../../../../../frontend/src/storm/StormApp.tsx#L2627)

```typescript
closeHostDetail() => void
```

В теле вызывает `setState`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.openIpDetail

[frontend/src/storm/StormApp.tsx:2628](../../../../../frontend/src/storm/StormApp.tsx#L2628)

```typescript
openIpDetail(ip: string) => void
```

В теле вызывает `setState`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `ip` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.closeIpDetail

[frontend/src/storm/StormApp.tsx:2629](../../../../../frontend/src/storm/StormApp.tsx#L2629)

```typescript
closeIpDetail() => void
```

В теле вызывает `setState`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.toggleReconMenu

[frontend/src/storm/StormApp.tsx:2630](../../../../../frontend/src/storm/StormApp.tsx#L2630)

```typescript
toggleReconMenu() => void
```

В теле вызывает `setState`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.toggleEpGroup

[frontend/src/storm/StormApp.tsx:2632](../../../../../frontend/src/storm/StormApp.tsx#L2632)

```typescript
toggleEpGroup(host: string) => void
```

В теле вызывает `setState`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `host` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.toggleJsGroup

[frontend/src/storm/StormApp.tsx:2637](../../../../../frontend/src/storm/StormApp.tsx#L2637)

```typescript
toggleJsGroup(host: string) => void
```

В теле вызывает `setState`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `host` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.deleteJsHost

[frontend/src/storm/StormApp.tsx:2642](../../../../../frontend/src/storm/StormApp.tsx#L2642)

```typescript
deleteJsHost(hostId: number | undefined, label: string) => void
```

Deletes every JS finding of one host, after confirmation.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `hostId` | `number \| undefined` | `обязательный` | ID хоста в API. |
| `label` | `string` | `обязательный` | Текст подписи/сообщения проверки. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setPendingDelete`
- `setState`
- `t`

</details>

## StormApp.submitJsScan

[frontend/src/storm/StormApp.tsx:2659](../../../../../frontend/src/storm/StormApp.tsx#L2659)

```typescript
async submitJsScan() => Promise<void>
```

В теле вызывает ``${t("Scanning")} ${job.targets_total ?? ""} ${t("domains…")}`.replace`, `apiStartJsScan`, `domains.join`, `getApiErrorMessage`, `pushToast`, `setState`, `state.jsScanText.split`, `state.jsScanText.split(/\r?\n/).map`; полный список ниже.

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- ``${t("Scanning")} ${job.targets_total ?? ""} ${t("domains…")}`.replace`
- `apiStartJsScan`
- `domains.join`
- `getApiErrorMessage`
- `pushToast`
- `setState`
- `state.jsScanText.split`
- `state.jsScanText.split(/\r?\n/).map`
- `state.jsScanText.split(/\r?\n/).map((l) => l.trim()).filter`
- `t`

</details>

## StormApp.downloadJsArchive

[frontend/src/storm/StormApp.tsx:2678](../../../../../frontend/src/storm/StormApp.tsx#L2678)

```typescript
async downloadJsArchive(hostId: number | undefined, label: string) => Promise<void>
```

В теле вызывает `(label || "project").replace`, `URL.createObjectURL`, `URL.revokeObjectURL`, `a.click`, `a.remove`, `apiDownloadJsArchive`, `document.body.appendChild`, `document.createElement`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `hostId` | `number \| undefined` | `обязательный` | ID хоста в API. |
| `label` | `string` | `обязательный` | Текст подписи/сообщения проверки. |

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(label || "project").replace`
- `URL.createObjectURL`
- `URL.revokeObjectURL`
- `a.click`
- `a.remove`
- `apiDownloadJsArchive`
- `document.body.appendChild`
- `document.createElement`
- `getApiErrorMessage`
- `pushToast`
- `t`

</details>

## StormApp.formatEndpointRequest

[frontend/src/storm/StormApp.tsx:2700](../../../../../frontend/src/storm/StormApp.tsx#L2700)

```typescript
formatEndpointRequest(endpoint: ApiEndpoint, host: string) => string
```

В теле вызывает `(endpoint.request_headers ?? []).filter`, `(endpoint.request_headers ?? []).filter((header) => !["host", "content-type"].includes(header.name.toLowerCase())).map`, `[`${endpoint.method ?? "GET"} ${target} HTTP/1.1`, `Host: ${host}`, ...headers, "", endpoint.request_body ?? ""].join`, `[`${endpoint.method ?? "GET"} ${target} HTTP/1.1`, `Host: ${host}`, ...headers, "", endpoint.request_body ?? ""].join("\n").trimEnd`, `headers.unshift`, `params.append`, `params.toString`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `endpoint` | `ApiEndpoint` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `host` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `string`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(endpoint.request_headers ?? []).filter`
- `(endpoint.request_headers ?? []).filter((header) => !["host", "content-type"].includes(header.name.toLowerCase())).map`
- `[`${endpoint.method ?? "GET"} ${target} HTTP/1.1`, `Host: ${host}`, ...headers, "", endpoint.request_body ?? ""].join`
- `[`${endpoint.method ?? "GET"} ${target} HTTP/1.1`, `Host: ${host}`, ...headers, "", endpoint.request_body ?? ""].join("\n").trimEnd`
- `headers.unshift`
- `params.append`
- `params.toString`

</details>

## StormApp.openEndpoint

[frontend/src/storm/StormApp.tsx:2709](../../../../../frontend/src/storm/StormApp.tsx#L2709)

```typescript
openEndpoint(ep: { method: Method; path: string; host: string; hostId: number; endpointId: number }, projectId = state.openProjectId) => void
```

В теле вызывает `(async () => { try { const list = await apiGetEndpoints(pid, ep.hostId); const stored = list.find((entry) => entry.id === ep.endpointId); const request = stored ? formatEndpointRequest(stored, ep.host) : raw; if (version === endpointRequestVersion.current) setState({ epRequest: request, epRequestOriginal: request }); } catch (error) { if (version === endpointRequestVersion.current) pushToast(getApiErrorMessage(error, t("Couldn't load endpoint request")), "error"); } finally { if (version === endpointRequestVersion.current) setState({ epLoading: false }); } })`, `setState`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `ep` | `{ method: Method; path: string; host: string; hostId: number; endpointId: number }` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `projectId` | `number \| null` | `state.openProjectId` | ID проекта в API. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(async () => { try { const list = await apiGetEndpoints(pid, ep.hostId); const stored = list.find((entry) => entry.id === ep.endpointId); const request = stored ? formatEndpointRequest(stored, ep.host) : raw; if (version === endpointRequestVersion.current) setState({ epRequest: request, epRequestOriginal: request }); } catch (error) { if (version === endpointRequestVersion.current) pushToast(getApiErrorMessage(error, t("Couldn't load endpoint request")), "error"); } finally { if (version === endpointRequestVersion.current) setState({ epLoading: false }); } })`
- `setState`

</details>

## StormApp.closeEndpoint

[frontend/src/storm/StormApp.tsx:2728](../../../../../frontend/src/storm/StormApp.tsx#L2728)

```typescript
closeEndpoint() => void
```

В теле вызывает `setState`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.saveEndpointRequest

[frontend/src/storm/StormApp.tsx:2733](../../../../../frontend/src/storm/StormApp.tsx#L2733)

```typescript
async saveEndpointRequest() => Promise<void>
```

Сохраняет изменённый HTTP-запрос; API извлекает из него метод и путь.
После успеха обновляет список и исходное значение редактора. При ошибке
введённый запрос остаётся доступен для исправления.

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `apiUpdateEndpoint`
- `formatEndpointRequest`
- `getApiErrorMessage`
- `pushToast`
- `reloadHosts`
- `setState`
- `state.epRequest.trim`
- `t`
- `toStormMethod`

</details>

## StormApp.copyText

[frontend/src/storm/StormApp.tsx:2752](../../../../../frontend/src/storm/StormApp.tsx#L2752)

```typescript
async copyText(text: string, what: string) => Promise<void>
```

В теле вызывает `navigator.clipboard.writeText`, `pushToast`, `t`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `text` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `what` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<void>`.

Явные throw в теле:

```typescript
new Error("Clipboard unavailable")
```

<details>
<summary>Прямые вызовы в теле</summary>

- `navigator.clipboard.writeText`
- `pushToast`
- `t`

</details>

## StormApp.copyEndpointCurl

[frontend/src/storm/StormApp.tsx:2759](../../../../../frontend/src/storm/StormApp.tsx#L2759)

```typescript
copyEndpointCurl() => void
```

В теле вызывает `/^(\S+)\s+(\S+)\s+HTTP\/\S+$/.exec`, `/^https?:\/\//i.test`, `body.join`, `copyText`, `head.split`, `headers.filter`, `headers.filter((header) => !/^host\s*:/i.test(header)).map`, `headers.find`; полный список ниже.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `/^(\S+)\s+(\S+)\s+HTTP\/\S+$/.exec`
- `/^https?:\/\//i.test`
- `body.join`
- `copyText`
- `head.split`
- `headers.filter`
- `headers.filter((header) => !/^host\s*:/i.test(header)).map`
- `headers.find`
- `headers.find((header) => /^host\s*:/i.test(header))?.replace`
- `parts.join`
- `parts.push`
- `pushToast`
- `quote`
- `state.epRequest.replace`
- `state.epRequest.replace(/\r\n/g, "\n").split`
- `t`

</details>

## StormApp.copyEndpointCurl.quote

[frontend/src/storm/StormApp.tsx:2765](../../../../../frontend/src/storm/StormApp.tsx#L2765)

```typescript
quote(value: string) => string
```

В теле вызывает `value.replace`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `value` | `string` | `обязательный` | Входное значение преобразования/проверки. |

Возвращает: `string`.

<details>
<summary>Прямые вызовы в теле</summary>

- `value.replace`

</details>

## StormApp.toggleCredReveal

[frontend/src/storm/StormApp.tsx:2775](../../../../../frontend/src/storm/StormApp.tsx#L2775)

```typescript
toggleCredReveal(id: number) => void
```

Toggle whether one credential's secret is shown in clear text.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `id` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.copyCurl

[frontend/src/storm/StormApp.tsx:2779](../../../../../frontend/src/storm/StormApp.tsx#L2779)

```typescript
copyCurl(ep: { method: Method; path: string; host: string }) => void
```

В теле вызывает `navigator.clipboard?.writeText`, `pushToast`, `t`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `ep` | `{ method: Method; path: string; host: string }` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `navigator.clipboard?.writeText`
- `pushToast`
- `t`

</details>

## StormApp.deleteEndpoint

[frontend/src/storm/StormApp.tsx:2787](../../../../../frontend/src/storm/StormApp.tsx#L2787)

```typescript
async deleteEndpoint(hostId: number, endpointId: number) => Promise<void>
```

В теле вызывает `apiDeleteEndpoint`, `getApiErrorMessage`, `pushToast`, `reloadHosts`, `t`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `hostId` | `number` | `обязательный` | ID хоста в API. |
| `endpointId` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `apiDeleteEndpoint`
- `getApiErrorMessage`
- `pushToast`
- `reloadHosts`
- `t`

</details>

## StormApp.updateForm

[frontend/src/storm/StormApp.tsx:2800](../../../../../frontend/src/storm/StormApp.tsx#L2800)

```typescript
updateForm(k: string, v: string) => void
```

В теле вызывает `setState`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `k` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `v` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.setTagDraft

[frontend/src/storm/StormApp.tsx:2801](../../../../../frontend/src/storm/StormApp.tsx#L2801)

```typescript
setTagDraft(k: string, v: string) => void
```

В теле вызывает `setState`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `k` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `v` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.addEditorTag

[frontend/src/storm/StormApp.tsx:2802](../../../../../frontend/src/storm/StormApp.tsx#L2802)

```typescript
addEditorTag(k: string, val: string) => void
```

В теле вызывает `setState`, `val.trim`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `k` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `val` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`
- `val.trim`

</details>

## StormApp.removeEditorTag

[frontend/src/storm/StormApp.tsx:2811](../../../../../frontend/src/storm/StormApp.tsx#L2811)

```typescript
removeEditorTag(k: string, idx: number) => void
```

В теле вызывает `setState`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `k` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `idx` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.openEditor

[frontend/src/storm/StormApp.tsx:2817](../../../../../frontend/src/storm/StormApp.tsx#L2817)

```typescript
openEditor(type: EditorType, mode: "add" | "edit", index: number) => void
```

В теле вызывает `setState`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `type` | `EditorType` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `mode` | `"add" \| "edit"` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `index` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.closeEditor

[frontend/src/storm/StormApp.tsx:2851](../../../../../frontend/src/storm/StormApp.tsx#L2851)

```typescript
closeEditor() => void
```

В теле вызывает `setState`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.normalizeHostToken

[frontend/src/storm/StormApp.tsx:2859](../../../../../frontend/src/storm/StormApp.tsx#L2859)

```typescript
normalizeHostToken(token: string) => string | null
```

В теле вызывает `/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test`, `/^https:/i.test`, `/^https?:\/\//i.test`, `u.hostname.toLowerCase`, `u.hostname.toLowerCase().replace`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `token` | `string` | `обязательный` | Токен операции; формат определяется вызывающим методом. |

Возвращает: `string \| null`.

<details>
<summary>Прямые вызовы в теле</summary>

- `/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test`
- `/^https:/i.test`
- `/^https?:\/\//i.test`
- `u.hostname.toLowerCase`
- `u.hostname.toLowerCase().replace`

</details>

## StormApp.normalizeHostList

[frontend/src/storm/StormApp.tsx:2875](../../../../../frontend/src/storm/StormApp.tsx#L2875)

```typescript
normalizeHostList(raw: string) => string
```

Raw paste → deduped, normalized host list (the "will be imported" preview).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `raw` | `string` | `обязательный` | Исходное значение до нормализации/разбора. |

Возвращает: `string`.

<details>
<summary>Прямые вызовы в теле</summary>

- `l.split`
- `l.startsWith`
- `line.trim`
- `normalizeHostToken`
- `out.join`
- `out.push`
- `raw.split`
- `seen.add`
- `seen.has`
- `tok.trim`

</details>

## StormApp.isIpLiteral

[frontend/src/storm/StormApp.tsx:2894](../../../../../frontend/src/storm/StormApp.tsx#L2894)

```typescript
isIpLiteral(host: string) => boolean
```

Raw paste → deduped IP list. Same normalization, minus anything that is not
an address literal — the IP farm rejects hostnames server-side anyway, so
filtering here keeps the preview honest about what will actually be sent.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `host` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `boolean`.

<details>
<summary>Прямые вызовы в теле</summary>

- `/^\d{1,3}(\.\d{1,3}){3}$/.test`
- `bare.includes`
- `bare.split`
- `bare.split(".").every`
- `host.replace`

</details>

## StormApp.normalizeIpList

[frontend/src/storm/StormApp.tsx:2899](../../../../../frontend/src/storm/StormApp.tsx#L2899)

```typescript
normalizeIpList(raw: string) => string
```

В теле вызывает `normalizeHostList`, `normalizeHostList(raw) .split`, `normalizeHostList(raw) .split("\n") .filter`, `normalizeHostList(raw) .split("\n") .filter((line) => { // Strip a trailing :port, but only when it is not part of an IPv6 literal. const m = /^(\[[^\]]+\]|[^:]+)(?::(\d+))?$/.exec(line); return isIpLiteral(m ? m[1] : line); }) .join`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `raw` | `string` | `обязательный` | Исходное значение до нормализации/разбора. |

Возвращает: `string`.

<details>
<summary>Прямые вызовы в теле</summary>

- `normalizeHostList`
- `normalizeHostList(raw) .split`
- `normalizeHostList(raw) .split("\n") .filter`
- `normalizeHostList(raw) .split("\n") .filter((line) => { // Strip a trailing :port, but only when it is not part of an IPv6 literal. const m = /^(\[[^\]]+\]|[^:]+)(?::(\d+))?$/.exec(line); return isIpLiteral(m ? m[1] : line); }) .join`

</details>

## StormApp.openHostImport

[frontend/src/storm/StormApp.tsx:2911](../../../../../frontend/src/storm/StormApp.tsx#L2911)

```typescript
openHostImport() => void
```

В теле вызывает `setState`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.closeHostImport

[frontend/src/storm/StormApp.tsx:2912](../../../../../frontend/src/storm/StormApp.tsx#L2912)

```typescript
closeHostImport() => void
```

В теле вызывает `setState`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.openIpImport

[frontend/src/storm/StormApp.tsx:2913](../../../../../frontend/src/storm/StormApp.tsx#L2913)

```typescript
openIpImport() => void
```

В теле вызывает `setState`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.closeIpImport

[frontend/src/storm/StormApp.tsx:2914](../../../../../frontend/src/storm/StormApp.tsx#L2914)

```typescript
closeIpImport() => void
```

В теле вызывает `setState`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.submitIpImport

[frontend/src/storm/StormApp.tsx:2915](../../../../../frontend/src/storm/StormApp.tsx#L2915)

```typescript
async submitIpImport() => Promise<void>
```

В теле вызывает ``${t("Probing")} ${job.targets_total ?? ""} ${t("IPs")}…`.replace`, `apiStartIpFarm`, `getApiErrorMessage`, `ipFarmDoneToast`, `isFarmJobInFlight`, `pushToast`, `reloadHosts`, `setState`; полный список ниже.

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- ``${t("Probing")} ${job.targets_total ?? ""} ${t("IPs")}…`.replace`
- `apiStartIpFarm`
- `getApiErrorMessage`
- `ipFarmDoneToast`
- `isFarmJobInFlight`
- `pushToast`
- `reloadHosts`
- `setState`
- `state.ipImportPreview.trim`
- `t`

</details>

## StormApp.submitHostImport

[frontend/src/storm/StormApp.tsx:2944](../../../../../frontend/src/storm/StormApp.tsx#L2944)

```typescript
async submitHostImport() => Promise<void>
```

В теле вызывает ``${t("Probing")} ${job.targets_total ?? ""} ${t("hosts")}…`.replace`, `apiStartHostFarm`, `getApiErrorMessage`, `hostFarmDoneToast`, `isFarmJobInFlight`, `pushToast`, `reloadHosts`, `setState`; полный список ниже.

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- ``${t("Probing")} ${job.targets_total ?? ""} ${t("hosts")}…`.replace`
- `apiStartHostFarm`
- `getApiErrorMessage`
- `hostFarmDoneToast`
- `isFarmJobInFlight`
- `pushToast`
- `reloadHosts`
- `setState`
- `state.hostImportPreview.trim`
- `t`

</details>

## StormApp.parseEpLine

[frontend/src/storm/StormApp.tsx:2979](../../../../../frontend/src/storm/StormApp.tsx#L2979)

```typescript
parseEpLine(line: string) => { host: string; method: string; path: string; url: string } | null
```

В теле вызывает `/^[a-z][a-z0-9+.-]*:\/\//i.test`, `EP_METHODS.has`, `["http:", "https:"].includes`, `l.split`, `l.startsWith`, `line.trim`, `parts.slice`, `parts.slice(1).join`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `line` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `{ host: string; method: string; path: string; url: string } \| null`.

<details>
<summary>Прямые вызовы в теле</summary>

- `/^[a-z][a-z0-9+.-]*:\/\//i.test`
- `EP_METHODS.has`
- `["http:", "https:"].includes`
- `l.split`
- `l.startsWith`
- `line.trim`
- `parts.slice`
- `parts.slice(1).join`
- `parts.slice(1).join(" ").trim`
- `parts[0].toUpperCase`
- `target.startsWith`
- `u.hostname.toLowerCase`

</details>

## StormApp.normalizeEpList

[frontend/src/storm/StormApp.tsx:3005](../../../../../frontend/src/storm/StormApp.tsx#L3005)

```typescript
normalizeEpList(raw: string) => string
```

В теле вызывает `out.join`, `out.push`, `parseEpLine`, `raw.split`, `seen.add`, `seen.has`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `raw` | `string` | `обязательный` | Исходное значение до нормализации/разбора. |

Возвращает: `string`.

<details>
<summary>Прямые вызовы в теле</summary>

- `out.join`
- `out.push`
- `parseEpLine`
- `raw.split`
- `seen.add`
- `seen.has`

</details>

## StormApp.openEpImport

[frontend/src/storm/StormApp.tsx:3019](../../../../../frontend/src/storm/StormApp.tsx#L3019)

```typescript
openEpImport() => void
```

В теле вызывает `setState`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.closeEpImport

[frontend/src/storm/StormApp.tsx:3020](../../../../../frontend/src/storm/StormApp.tsx#L3020)

```typescript
closeEpImport() => void
```

В теле вызывает `setState`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.importSwaggerEndpoints

[frontend/src/storm/StormApp.tsx:3024](../../../../../frontend/src/storm/StormApp.tsx#L3024)

```typescript
importSwaggerEndpoints(lines: string[]) => void
```

Объединяет распознанные Swagger-строки с черновиком импорта без дублей.
Открывает предпросмотр Add endpoints; сохранение в БД выполняется отдельно.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `lines` | `string[]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.submitEpImport

[frontend/src/storm/StormApp.tsx:3031](../../../../../frontend/src/storm/StormApp.tsx#L3031)

```typescript
async submitEpImport() => Promise<void>
```

В теле вызывает `apiCreateEndpoint`, `apiCreateHost`, `getApiErrorMessage`, `hosts.map`, `importHosts.get`, `importHosts.set`, `pushToast`, `reloadHosts`; полный список ниже.

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `apiCreateEndpoint`
- `apiCreateHost`
- `getApiErrorMessage`
- `hosts.map`
- `importHosts.get`
- `importHosts.set`
- `pushToast`
- `reloadHosts`
- `setState`
- `state.epImportPreview .split`
- `state.epImportPreview .split(/\r?\n/) .map`
- `state.epImportPreview .split(/\r?\n/) .map(parseEpLine) .filter`
- `state.epImportSwaggerHosts.includes`
- `t`
- `toStormHost`

</details>

## StormApp.saveHostEditor

[frontend/src/storm/StormApp.tsx:3075](../../../../../frontend/src/storm/StormApp.tsx#L3075)

```typescript
async saveHostEditor() => Promise<void>
```

В теле вызывает `apiUpdateHost`, `fstr`, `fstr(f.host).trim`, `getApiErrorMessage`, `pushToast`, `reloadHosts`, `setState`.

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `apiUpdateHost`
- `fstr`
- `fstr(f.host).trim`
- `getApiErrorMessage`
- `pushToast`
- `reloadHosts`
- `setState`

</details>

## StormApp.resolveProjectHost

[frontend/src/storm/StormApp.tsx:3105](../../../../../frontend/src/storm/StormApp.tsx#L3105)

```typescript
resolveProjectHost(typed: string) => Host | undefined
```

В теле вызывает `hosts.find`, `typed.trim`, `typed.trim().toLowerCase`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `typed` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Host \| undefined`.

<details>
<summary>Прямые вызовы в теле</summary>

- `hosts.find`
- `typed.trim`
- `typed.trim().toLowerCase`

</details>

## StormApp.saveVulnEditor

[frontend/src/storm/StormApp.tsx:3110](../../../../../frontend/src/storm/StormApp.tsx#L3110)

```typescript
async saveVulnEditor() => Promise<void>
```

В теле вызывает `(fstr(f.title) || "Untitled").trim`, `apiCreateVulnerability`, `apiUpdateVulnerability`, `fstr`, `fstr(f.host).trim`, `getApiErrorMessage`, `pushToast`, `relinkVulnHost`; полный список ниже.

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(fstr(f.title) || "Untitled").trim`
- `apiCreateVulnerability`
- `apiUpdateVulnerability`
- `fstr`
- `fstr(f.host).trim`
- `getApiErrorMessage`
- `pushToast`
- `relinkVulnHost`
- `reloadVulns`
- `resolveProjectHost`
- `setState`
- `t`

</details>

## StormApp.relinkVulnHost

[frontend/src/storm/StormApp.tsx:3148](../../../../../frontend/src/storm/StormApp.tsx#L3148)

```typescript
async relinkVulnHost(pid: number, vulnId: number, hostName: string) => Promise<void>
```

В теле вызывает `apiAddVulnerabilityAsset`, `apiDeleteVulnerabilityAsset`, `apiGetVulnerability`, `det.assets.find`, `resolveProjectHost`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `pid` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `vulnId` | `number` | `обязательный` | ID уязвимости в API. |
| `hostName` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `apiAddVulnerabilityAsset`
- `apiDeleteVulnerabilityAsset`
- `apiGetVulnerability`
- `det.assets.find`
- `resolveProjectHost`

</details>

## StormApp.saveNoteEditorEntity

[frontend/src/storm/StormApp.tsx:3158](../../../../../frontend/src/storm/StormApp.tsx#L3158)

```typescript
async saveNoteEditorEntity() => Promise<void>
```

В теле вызывает `(fstr(f.title) || "Untitled").trim`, `apiCreateProjectNote`, `apiUpdateProjectNote`, `fstr`, `fstr(f.excerpt).trim`, `getApiErrorMessage`, `pushToast`, `reloadNotes`; полный список ниже.

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(fstr(f.title) || "Untitled").trim`
- `apiCreateProjectNote`
- `apiUpdateProjectNote`
- `fstr`
- `fstr(f.excerpt).trim`
- `getApiErrorMessage`
- `pushToast`
- `reloadNotes`
- `setState`

</details>

## StormApp.saveMemberEditor

[frontend/src/storm/StormApp.tsx:3179](../../../../../frontend/src/storm/StormApp.tsx#L3179)

```typescript
async saveMemberEditor() => Promise<void>
```

В теле вызывает `apiAddProjectMember`, `fstr`, `fstr(state.editorForm.userKey).trim`, `getApiErrorMessage`, `pushToast`, `reloadMembers`, `setState`, `state.workspaceUsers.find`.

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `apiAddProjectMember`
- `fstr`
- `fstr(state.editorForm.userKey).trim`
- `getApiErrorMessage`
- `pushToast`
- `reloadMembers`
- `setState`
- `state.workspaceUsers.find`

</details>

## StormApp.saveIpEditor

[frontend/src/storm/StormApp.tsx:3206](../../../../../frontend/src/storm/StormApp.tsx#L3206)

```typescript
async saveIpEditor() => Promise<void>
```

Сохраняет IP: изменение заменяет адрес во всём проекте и запускает перепроверку.
Успех обновляет открытую карточку/список и отслеживаемую задачу; ошибка
сохраняет введённое значение и оставляет форму для исправления.

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `apiChangeIpAddress`
- `apiGetHost`
- `apiUpdateHost`
- `current.ip_addresses.map`
- `current.ip_addresses.some`
- `fstr`
- `fstr(f.ip).trim`
- `getApiErrorMessage`
- `hosts.find`
- `pushToast`
- `reloadHosts`
- `setState`
- `t`

</details>

## StormApp.saveEndpointEditor

[frontend/src/storm/StormApp.tsx:3264](../../../../../frontend/src/storm/StormApp.tsx#L3264)

```typescript
async saveEndpointEditor() => Promise<void>
```

В теле вызывает `apiCreateEndpoint`, `fstr`, `fstr(f.path).trim`, `getApiErrorMessage`, `hosts.find`, `pushToast`, `reloadHosts`, `setState`.

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `apiCreateEndpoint`
- `fstr`
- `fstr(f.path).trim`
- `getApiErrorMessage`
- `hosts.find`
- `pushToast`
- `reloadHosts`
- `setState`

</details>

## StormApp.saveCredEditor

[frontend/src/storm/StormApp.tsx:3286](../../../../../frontend/src/storm/StormApp.tsx#L3286)

```typescript
async saveCredEditor() => Promise<void>
```

В теле вызывает `apiCreateProjectCredential`, `apiUpdateProjectCredential`, `fstr`, `fstr(f.host).trim`, `fstr(f.username).trim`, `getApiErrorMessage`, `password.trim`, `pushToast`; полный список ниже.

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `apiCreateProjectCredential`
- `apiUpdateProjectCredential`
- `fstr`
- `fstr(f.host).trim`
- `fstr(f.username).trim`
- `getApiErrorMessage`
- `password.trim`
- `pushToast`
- `reloadCreds`
- `resolveProjectHost`
- `setState`
- `t`

</details>

## StormApp.saveEditor

[frontend/src/storm/StormApp.tsx:3329](../../../../../frontend/src/storm/StormApp.tsx#L3329)

```typescript
async saveEditor() => Promise<void>
```

В теле вызывает `saveCredEditor`, `saveEndpointEditor`, `saveHostEditor`, `saveIpEditor`, `saveMemberEditor`, `saveNoteEditorEntity`, `saveVulnEditor`.

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `saveCredEditor`
- `saveEndpointEditor`
- `saveHostEditor`
- `saveIpEditor`
- `saveMemberEditor`
- `saveNoteEditorEntity`
- `saveVulnEditor`

</details>

## StormApp.askDelete

[frontend/src/storm/StormApp.tsx:3340](../../../../../frontend/src/storm/StormApp.tsx#L3340)

```typescript
askDelete(type: EditorType, index: number, label: string) => void
```

В теле вызывает `setState`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `type` | `EditorType` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `index` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `label` | `string` | `обязательный` | Текст подписи/сообщения проверки. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.closeConfirm

[frontend/src/storm/StormApp.tsx:3342](../../../../../frontend/src/storm/StormApp.tsx#L3342)

```typescript
closeConfirm() => void
```

В теле вызывает `setPendingDelete`, `setPendingDeleteLabel`, `setState`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setPendingDelete`
- `setPendingDeleteLabel`
- `setState`

</details>

## StormApp.confirmDelete

[frontend/src/storm/StormApp.tsx:3347](../../../../../frontend/src/storm/StormApp.tsx#L3347)

```typescript
async confirmDelete() => Promise<void>
```

В теле вызывает `action`, `apiDeleteProject`, `apiDeleteUser`, `closeConfirm`, `getApiErrorMessage`, `pushToast`, `reloadProjects`, `reloadUsers`; полный список ниже.

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `action`
- `apiDeleteProject`
- `apiDeleteUser`
- `closeConfirm`
- `getApiErrorMessage`
- `pushToast`
- `reloadProjects`
- `reloadUsers`
- `setState`
- `target.call`
- `target.reload`

</details>

## StormApp.confirmDelete.call

[frontend/src/storm/StormApp.tsx:3384](../../../../../frontend/src/storm/StormApp.tsx#L3384)

```typescript
call(id) => Promise<void>
```

В теле вызывает `apiDeleteHost`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `id` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `apiDeleteHost`

</details>

## StormApp.confirmDelete.call

[frontend/src/storm/StormApp.tsx:3388](../../../../../frontend/src/storm/StormApp.tsx#L3388)

```typescript
call() => Promise<void>
```

В теле вызывает `apiHideIp`.

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `apiHideIp`

</details>

## StormApp.confirmDelete.call

[frontend/src/storm/StormApp.tsx:3389](../../../../../frontend/src/storm/StormApp.tsx#L3389)

```typescript
call(id) => Promise<void>
```

В теле вызывает `apiDeleteEndpoint`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `id` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `apiDeleteEndpoint`

</details>

## StormApp.confirmDelete.call

[frontend/src/storm/StormApp.tsx:3390](../../../../../frontend/src/storm/StormApp.tsx#L3390)

```typescript
call(id) => Promise<void>
```

В теле вызывает `apiDeleteVulnerability`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `id` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `apiDeleteVulnerability`

</details>

## StormApp.confirmDelete.call

[frontend/src/storm/StormApp.tsx:3391](../../../../../frontend/src/storm/StormApp.tsx#L3391)

```typescript
call(id) => Promise<void>
```

В теле вызывает `apiDeleteProjectNote`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `id` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `apiDeleteProjectNote`

</details>

## StormApp.confirmDelete.call

[frontend/src/storm/StormApp.tsx:3392](../../../../../frontend/src/storm/StormApp.tsx#L3392)

```typescript
call(id) => Promise<void>
```

В теле вызывает `apiDeleteProjectCredential`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `id` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `apiDeleteProjectCredential`

</details>

## StormApp.confirmDelete.call

[frontend/src/storm/StormApp.tsx:3395](../../../../../frontend/src/storm/StormApp.tsx#L3395)

```typescript
call(id) => Promise<void>
```

В теле вызывает `apiRemoveProjectMember`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `id` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `apiRemoveProjectMember`

</details>

## StormApp.confirmDelete.reload

[frontend/src/storm/StormApp.tsx:3400](../../../../../frontend/src/storm/StormApp.tsx#L3400)

```typescript
reload() => void
```

В теле вызывает `pushToast`, `reloadMembers`, `reloadProjects`, `selProjects`, `t`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `pushToast`
- `reloadMembers`
- `reloadProjects`
- `selProjects`
- `t`

</details>

## StormApp.openNoteEditor

[frontend/src/storm/StormApp.tsx:3424](../../../../../frontend/src/storm/StormApp.tsx#L3424)

```typescript
openNoteEditor(mode: "add" | "edit", index: number) => void
```

В теле вызывает `setState`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `mode` | `"add" \| "edit"` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `index` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.backToNotesList

[frontend/src/storm/StormApp.tsx:3439](../../../../../frontend/src/storm/StormApp.tsx#L3439)

```typescript
backToNotesList() => void
```

В теле вызывает `setState`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.openNoteViewer

[frontend/src/storm/StormApp.tsx:3443](../../../../../frontend/src/storm/StormApp.tsx#L3443)

```typescript
openNoteViewer(id: number) => void
```

В теле вызывает `setState`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `id` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.updateNoteForm

[frontend/src/storm/StormApp.tsx:3444](../../../../../frontend/src/storm/StormApp.tsx#L3444)

```typescript
updateNoteForm(k: keyof NoteForm, v: string) => void
```

В теле вызывает `setState`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `k` | `keyof NoteForm` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `v` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.attachNoteImages

[frontend/src/storm/StormApp.tsx:3448](../../../../../frontend/src/storm/StormApp.tsx#L3448)

```typescript
async attachNoteImages(files: File[]) => Promise<void>
```

Upload screenshots pasted into the note editor and append them as Markdown
images; the editor (TipTap Image) renders them inline right away, and the
note stays plain Markdown (`![name](/api/v1/projects/…/images/…/download)`).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `files` | `File[]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `apiUploadProjectImage`
- `file.type.startsWith`
- `getApiErrorMessage`
- `pushToast`
- `setState`
- `t`

</details>

## StormApp.saveNote

[frontend/src/storm/StormApp.tsx:3467](../../../../../frontend/src/storm/StormApp.tsx#L3467)

```typescript
async saveNote() => Promise<void>
```

В теле вызывает `(f.excerpt || "").trim`, `(f.title || "Untitled").trim`, `apiCreateProjectNote`, `apiUpdateProjectNote`, `getApiErrorMessage`, `pushToast`, `reloadNotes`, `setState`; полный список ниже.

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(f.excerpt || "").trim`
- `(f.title || "Untitled").trim`
- `apiCreateProjectNote`
- `apiUpdateProjectNote`
- `getApiErrorMessage`
- `pushToast`
- `reloadNotes`
- `setState`
- `t`
- `toStormNote`

</details>

## StormApp.goToOpenVulns

[frontend/src/storm/StormApp.tsx:3498](../../../../../frontend/src/storm/StormApp.tsx#L3498)

```typescript
goToOpenVulns() => void
```

The overview's "open findings" tile — everything still needing work.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.goToMyFindings

[frontend/src/storm/StormApp.tsx:3499](../../../../../frontend/src/storm/StormApp.tsx#L3499)

```typescript
goToMyFindings() => void
```

В теле вызывает `setState`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.vulnFormFrom

[frontend/src/storm/StormApp.tsx:3500](../../../../../frontend/src/storm/StormApp.tsx#L3500)

```typescript
vulnFormFrom(v: Vuln) => VulnDetailForm
```

В теле вызывает `Array.isArray`, `v.steps.slice`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `v` | `Vuln` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `VulnDetailForm`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Array.isArray`
- `v.steps.slice`

</details>

## StormApp.openVulnDetail

[frontend/src/storm/StormApp.tsx:3517](../../../../../frontend/src/storm/StormApp.tsx#L3517)

```typescript
openVulnDetail(id: number) => void
```

`id` is the real backend id — it goes into the URL, so findings can be deep-linked.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `id` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `d.vulns.find`
- `setState`
- `vulnFormFrom`

</details>

## StormApp.closeVulnDetail

[frontend/src/storm/StormApp.tsx:3521](../../../../../frontend/src/storm/StormApp.tsx#L3521)

```typescript
closeVulnDetail() => void
```

В теле вызывает `setState`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.uploadVulnFilesFor

[frontend/src/storm/StormApp.tsx:3524](../../../../../frontend/src/storm/StormApp.tsx#L3524)

```typescript
async uploadVulnFilesFor(files: File[]) => Promise<void>
```

В теле вызывает `apiListVulnFiles`, `apiUploadVulnFile`, `getApiErrorMessage`, `pushToast`, `setState`, `t`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `files` | `File[]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `apiListVulnFiles`
- `apiUploadVulnFile`
- `getApiErrorMessage`
- `pushToast`
- `setState`
- `t`

</details>

## StormApp.removeVulnFile

[frontend/src/storm/StormApp.tsx:3541](../../../../../frontend/src/storm/StormApp.tsx#L3541)

```typescript
async removeVulnFile(fileId: number) => Promise<void>
```

В теле вызывает `apiDeleteVulnFile`, `getApiErrorMessage`, `pushToast`, `setState`, `t`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `fileId` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `apiDeleteVulnFile`
- `getApiErrorMessage`
- `pushToast`
- `setState`
- `t`

</details>

## StormApp.updateVulnDetailForm

[frontend/src/storm/StormApp.tsx:3552](../../../../../frontend/src/storm/StormApp.tsx#L3552)

```typescript
updateVulnDetailForm<K extends keyof VulnDetailForm>(k: K, v: VulnDetailForm[K]) => void
```

В теле вызывает `setState`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `k` | `K` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `v` | `VulnDetailForm[K]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.addVdStep

[frontend/src/storm/StormApp.tsx:3554](../../../../../frontend/src/storm/StormApp.tsx#L3554)

```typescript
addVdStep() => void
```

В теле вызывает `setState`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.removeVdStep

[frontend/src/storm/StormApp.tsx:3555](../../../../../frontend/src/storm/StormApp.tsx#L3555)

```typescript
removeVdStep(i: number) => void
```

В теле вызывает `setState`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `i` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.updateVdStep

[frontend/src/storm/StormApp.tsx:3566](../../../../../frontend/src/storm/StormApp.tsx#L3566)

```typescript
updateVdStep(i: number, val: string) => void
```

В теле вызывает `setState`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `i` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `val` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.attachVdStepImages

[frontend/src/storm/StormApp.tsx:3576](../../../../../frontend/src/storm/StormApp.tsx#L3576)

```typescript
async attachVdStepImages(i: number, files: File[]) => Promise<void>
```

Upload screenshots pasted into step i as vulnerability files and remember
their ids on the step. Persisted on save via `image_file_ids`, which the
Word report renders inside the reproduction step (the old data-URL thumbs
were client-only and never reached the report).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `i` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `files` | `File[]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `apiListVulnFiles`
- `apiUploadVulnFile`
- `files.filter`
- `getApiErrorMessage`
- `pushToast`
- `setState`
- `t`

</details>

## StormApp.removeVdStepImage

[frontend/src/storm/StormApp.tsx:3600](../../../../../frontend/src/storm/StormApp.tsx#L3600)

```typescript
removeVdStepImage(i: number, imgIdx: number) => void
```

В теле вызывает `setState`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `i` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `imgIdx` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.saveVulnDetail

[frontend/src/storm/StormApp.tsx:3606](../../../../../frontend/src/storm/StormApp.tsx#L3606)

```typescript
async saveVulnDetail() => Promise<void>
```

В теле вызывает `(f.cwe ?? "").trim`, `(f.stepsList ?? []) .map`, `(f.stepsList ?? []) .map((s, i) => ({ description: s, imageIds: (f.stepImages ?? {})[i] ?? [] })) .filter`, `(f.stepsList ?? []) .map((s, i) => ({ description: s, imageIds: (f.stepImages ?? {})[i] ?? [] })) .filter(({ description, imageIds }) => description.trim() || imageIds.length) .map`, `(f.title ?? current.title).trim`, `(f.vector ?? "").trim`, `apiUpdateVulnerability`, `computeCvss4`; полный список ниже.

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(f.cwe ?? "").trim`
- `(f.stepsList ?? []) .map`
- `(f.stepsList ?? []) .map((s, i) => ({ description: s, imageIds: (f.stepImages ?? {})[i] ?? [] })) .filter`
- `(f.stepsList ?? []) .map((s, i) => ({ description: s, imageIds: (f.stepImages ?? {})[i] ?? [] })) .filter(({ description, imageIds }) => description.trim() || imageIds.length) .map`
- `(f.title ?? current.title).trim`
- `(f.vector ?? "").trim`
- `apiUpdateVulnerability`
- `computeCvss4`
- `d.vulns.find`
- `getApiErrorMessage`
- `pushToast`
- `reloadVulns`
- `setState`

</details>

## StormApp.reloadApiKeys

[frontend/src/storm/StormApp.tsx:3647](../../../../../frontend/src/storm/StormApp.tsx#L3647)

```typescript
reloadApiKeys() => void
```

В теле вызывает `(async () => { try { const rows = await apiListAgentTokens(); setStateRaw((s) => ({ ...s, apiKeys: rows .filter((t) => !t.revoked_at) .map((t) => ({ id: t.id, name: t.name, key: `${t.token_prefix}…`, scopes: t.scopes, created: toDispDate(t.created_at.slice(0, 10)), expires: t.expires_at ? toDispDate(t.expires_at.slice(0, 10)) : null, allProjects: t.all_projects, projectCount: t.project_ids.length, })), })); } catch { // Best-effort: список грузится под текущего пользователя; на ошибке — пусто. setStateRaw((s) => ({ ...s, apiKeys: [] })); } })`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(async () => { try { const rows = await apiListAgentTokens(); setStateRaw((s) => ({ ...s, apiKeys: rows .filter((t) => !t.revoked_at) .map((t) => ({ id: t.id, name: t.name, key: `${t.token_prefix}…`, scopes: t.scopes, created: toDispDate(t.created_at.slice(0, 10)), expires: t.expires_at ? toDispDate(t.expires_at.slice(0, 10)) : null, allProjects: t.all_projects, projectCount: t.project_ids.length, })), })); } catch { // Best-effort: список грузится под текущего пользователя; на ошибке — пусто. setStateRaw((s) => ({ ...s, apiKeys: [] })); } })`

</details>

## StormApp.openApiKeyModal

[frontend/src/storm/StormApp.tsx:3677](../../../../../frontend/src/storm/StormApp.tsx#L3677)

```typescript
openApiKeyModal() => void
```

В теле вызывает `reloadProjects`, `setState`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `reloadProjects`
- `setState`

</details>

## StormApp.closeApiKeyModal

[frontend/src/storm/StormApp.tsx:3681](../../../../../frontend/src/storm/StormApp.tsx#L3681)

```typescript
closeApiKeyModal() => void
```

В теле вызывает `setState`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.toggleApiScope

[frontend/src/storm/StormApp.tsx:3682](../../../../../frontend/src/storm/StormApp.tsx#L3682)

```typescript
toggleApiScope(s: string) => void
```

В теле вызывает `setState`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `s` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.toggleApiProject

[frontend/src/storm/StormApp.tsx:3683](../../../../../frontend/src/storm/StormApp.tsx#L3683)

```typescript
toggleApiProject(id: number) => void
```

В теле вызывает `setState`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `id` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.createApiKey

[frontend/src/storm/StormApp.tsx:3689](../../../../../frontend/src/storm/StormApp.tsx#L3689)

```typescript
async createApiKey() => Promise<void>
```

В теле вызывает `API_SCOPES.filter`, `apiCreateAgentToken`, `getApiErrorMessage`, `new Date(`${state.apiKeyExpiry}T23:59:59`).toISOString`, `pushToast`, `reloadApiKeys`, `setState`, `state.apiKeyName.trim`; полный список ниже.

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `API_SCOPES.filter`
- `apiCreateAgentToken`
- `getApiErrorMessage`
- `new Date(`${state.apiKeyExpiry}T23:59:59`).toISOString`
- `pushToast`
- `reloadApiKeys`
- `setState`
- `state.apiKeyName.trim`
- `t`

</details>

## StormApp.revokeApiKey

[frontend/src/storm/StormApp.tsx:3720](../../../../../frontend/src/storm/StormApp.tsx#L3720)

```typescript
async revokeApiKey(id: number) => Promise<void>
```

В теле вызывает `apiRevokeAgentToken`, `getApiErrorMessage`, `pushToast`, `reloadApiKeys`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `id` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `apiRevokeAgentToken`
- `getApiErrorMessage`
- `pushToast`
- `reloadApiKeys`

</details>

## StormApp.openWSUserEditor

[frontend/src/storm/StormApp.tsx:3729](../../../../../frontend/src/storm/StormApp.tsx#L3729)

```typescript
openWSUserEditor(mode: "add" | "edit", index: number) => void
```

В теле вызывает `setState`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `mode` | `"add" \| "edit"` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `index` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.closeWSUserEditor

[frontend/src/storm/StormApp.tsx:3741](../../../../../frontend/src/storm/StormApp.tsx#L3741)

```typescript
closeWSUserEditor() => void
```

В теле вызывает `setState`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.saveWSUser

[frontend/src/storm/StormApp.tsx:3744](../../../../../frontend/src/storm/StormApp.tsx#L3744)

```typescript
async saveWSUser() => Promise<void>
```

В теле вызывает `apiCreateInvitation`, `apiUpdateUser`, `getApiErrorMessage`, `navigator.clipboard.writeText`, `pushToast`, `reloadUsers`, `setState`, `state.wsUserEmail.trim`; полный список ниже.

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `apiCreateInvitation`
- `apiUpdateUser`
- `getApiErrorMessage`
- `navigator.clipboard.writeText`
- `pushToast`
- `reloadUsers`
- `setState`
- `state.wsUserEmail.trim`
- `state.wsUserName.trim`
- `t`

</details>

## StormApp.askDeleteWSUser

[frontend/src/storm/StormApp.tsx:3777](../../../../../frontend/src/storm/StormApp.tsx#L3777)

```typescript
askDeleteWSUser(index: number) => void
```

В теле вызывает `setState`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `index` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.reactivateUser

[frontend/src/storm/StormApp.tsx:3785](../../../../../frontend/src/storm/StormApp.tsx#L3785)

```typescript
async reactivateUser(index: number) => Promise<void>
```

В теле вызывает `apiReactivateUser`, `getApiErrorMessage`, `pushToast`, `reloadUsers`, `t`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `index` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `apiReactivateUser`
- `getApiErrorMessage`
- `pushToast`
- `reloadUsers`
- `t`

</details>

## StormApp.resendInvite

[frontend/src/storm/StormApp.tsx:3797](../../../../../frontend/src/storm/StormApp.tsx#L3797)

```typescript
async resendInvite(id: number) => Promise<void>
```

В теле вызывает `apiResendInvitation`, `getApiErrorMessage`, `navigator.clipboard.writeText`, `pushToast`, `reloadUsers`, `t`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `id` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `apiResendInvitation`
- `getApiErrorMessage`
- `navigator.clipboard.writeText`
- `pushToast`
- `reloadUsers`
- `t`

</details>

## StormApp.askRevokeInvite

[frontend/src/storm/StormApp.tsx:3812](../../../../../frontend/src/storm/StormApp.tsx#L3812)

```typescript
askRevokeInvite(id: number, email: string) => void
```

В теле вызывает `setPendingDelete`, `setPendingDeleteLabel`, `setState`, `t`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `id` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `email` | `string` | `обязательный` | Email пользователя/получателя. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setPendingDelete`
- `setPendingDeleteLabel`
- `setState`
- `t`

</details>

## StormApp.revokeInvite

[frontend/src/storm/StormApp.tsx:3817](../../../../../frontend/src/storm/StormApp.tsx#L3817)

```typescript
async revokeInvite(id: number) => Promise<void>
```

В теле вызывает `apiRevokeInvitation`, `getApiErrorMessage`, `pushToast`, `reloadUsers`, `t`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `id` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `apiRevokeInvitation`
- `getApiErrorMessage`
- `pushToast`
- `reloadUsers`
- `t`

</details>

## StormApp.startTwoFA

[frontend/src/storm/StormApp.tsx:3827](../../../../../frontend/src/storm/StormApp.tsx#L3827)

```typescript
async startTwoFA() => Promise<void>
```

В теле вызывает `apiSetupTwoFactor`, `getApiErrorMessage`, `pushToast`, `setState`.

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `apiSetupTwoFactor`
- `getApiErrorMessage`
- `pushToast`
- `setState`

</details>

## StormApp.cancelTwoFA

[frontend/src/storm/StormApp.tsx:3837](../../../../../frontend/src/storm/StormApp.tsx#L3837)

```typescript
cancelTwoFA() => void
```

В теле вызывает `setState`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.confirmTwoFA

[frontend/src/storm/StormApp.tsx:3838](../../../../../frontend/src/storm/StormApp.tsx#L3838)

```typescript
async confirmTwoFA() => Promise<void>
```

В теле вызывает `apiConfirmTwoFactor`, `getApiErrorMessage`, `pushToast`, `refreshUser`, `setState`, `state.twoFACode.trim`, `t`.

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `apiConfirmTwoFactor`
- `getApiErrorMessage`
- `pushToast`
- `refreshUser`
- `setState`
- `state.twoFACode.trim`
- `t`

</details>

## StormApp.openDisableTwoFA

[frontend/src/storm/StormApp.tsx:3851](../../../../../frontend/src/storm/StormApp.tsx#L3851)

```typescript
openDisableTwoFA() => void
```

В теле вызывает `setState`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.cancelDisableTwoFA

[frontend/src/storm/StormApp.tsx:3852](../../../../../frontend/src/storm/StormApp.tsx#L3852)

```typescript
cancelDisableTwoFA() => void
```

В теле вызывает `setState`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.disableTwoFA

[frontend/src/storm/StormApp.tsx:3853](../../../../../frontend/src/storm/StormApp.tsx#L3853)

```typescript
async disableTwoFA() => Promise<void>
```

В теле вызывает `apiDisableTwoFactor`, `getApiErrorMessage`, `pushToast`, `refreshUser`, `setState`, `t`.

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `apiDisableTwoFactor`
- `getApiErrorMessage`
- `pushToast`
- `refreshUser`
- `setState`
- `t`

</details>

## StormApp.submitPasswordChange

[frontend/src/storm/StormApp.tsx:3869](../../../../../frontend/src/storm/StormApp.tsx#L3869)

```typescript
async submitPasswordChange() => Promise<void>
```

В теле вызывает `apiChangeMyPassword`, `getApiErrorMessage`, `pushToast`, `refreshUser`, `setState`, `t`.

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `apiChangeMyPassword`
- `getApiErrorMessage`
- `pushToast`
- `refreshUser`
- `setState`
- `t`

</details>

## StormApp.goToNotif

[frontend/src/storm/StormApp.tsx:3895](../../../../../frontend/src/storm/StormApp.tsx#L3895)

```typescript
goToNotif(n: ApiNotification) => void
```

В теле вызывает `apiMarkNotificationRead`, `apiMarkNotificationRead(n.id).catch`, `openEndpoint`, `pushToast`, `setStateRaw`, `t`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `n` | `ApiNotification` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `apiMarkNotificationRead`
- `apiMarkNotificationRead(n.id).catch`
- `openEndpoint`
- `pushToast`
- `setStateRaw`
- `t`

</details>

## StormApp.markAllNotifsRead

[frontend/src/storm/StormApp.tsx:3931](../../../../../frontend/src/storm/StormApp.tsx#L3931)

```typescript
markAllNotifsRead() => void
```

В теле вызывает `apiMarkAllNotificationsRead`, `apiMarkAllNotificationsRead().catch`, `setStateRaw`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `apiMarkAllNotificationsRead`
- `apiMarkAllNotificationsRead().catch`
- `setStateRaw`

</details>

## StormApp.isArchivedStatus

[frontend/src/storm/StormApp.tsx:3941](../../../../../frontend/src/storm/StormApp.tsx#L3941)

```typescript
isArchivedStatus(s: ProjectStatus) => boolean
```

Преобразование/вычисление в теле функции; тип результата и параметры приведены ниже, точное выражение доступно по ссылке на исходник.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `s` | `ProjectStatus` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `boolean`.

## StormApp.parseAll

[frontend/src/storm/StormApp.tsx:3958](../../../../../frontend/src/storm/StormApp.tsx#L3958)

```typescript
parseAll(arr: (string | undefined)[]) => number[]
```

В теле вызывает `arr.map`, `arr.map((s) => Date.parse(s ?? "")).filter`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `arr` | `(string \| undefined)[]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `number[]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `arr.map`
- `arr.map((s) => Date.parse(s ?? "")).filter`

</details>

## StormApp.projWindow

[frontend/src/storm/StormApp.tsx:3960](../../../../../frontend/src/storm/StormApp.tsx#L3960)

```typescript
projWindow(rows: ApiProjectRow[]) => [number, number]
```

Combined [start, end] window across a set of projects — the sparkline's X axis.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `rows` | `ApiProjectRow[]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `[number, number]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Math.max`
- `Math.min`
- `parseAll`
- `rows.map`

</details>

## StormApp.projCreatedTimes

[frontend/src/storm/StormApp.tsx:3965](../../../../../frontend/src/storm/StormApp.tsx#L3965)

```typescript
projCreatedTimes(rows: ApiProjectRow[]) => string[]
```

В теле вызывает `rows.map`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `rows` | `ApiProjectRow[]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `string[]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `rows.map`

</details>

## StormApp.aggHostTimes

[frontend/src/storm/StormApp.tsx:3966](../../../../../frontend/src/storm/StormApp.tsx#L3966)

```typescript
aggHostTimes(rows: ApiProjectRow[]) => string[]
```

В теле вызывает `rows.flatMap`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `rows` | `ApiProjectRow[]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `string[]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `rows.flatMap`

</details>

## StormApp.aggOpenVulnTimes

[frontend/src/storm/StormApp.tsx:3967](../../../../../frontend/src/storm/StormApp.tsx#L3967)

```typescript
aggOpenVulnTimes(rows: ApiProjectRow[]) => string[]
```

В теле вызывает `rows.flatMap`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `rows` | `ApiProjectRow[]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `string[]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `rows.flatMap`

</details>

## StormApp.navBg

[frontend/src/storm/StormApp.tsx:3971](../../../../../frontend/src/storm/StormApp.tsx#L3971)

```typescript
navBg(id: NavId) => "var(--st-accent-soft)" | undefined
```

Преобразование/вычисление в теле функции; тип результата и параметры приведены ниже, точное выражение доступно по ссылке на исходник.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `id` | `NavId` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `"var(--st-accent-soft)" \| undefined`.

## StormApp.navColor

[frontend/src/storm/StormApp.tsx:3972](../../../../../frontend/src/storm/StormApp.tsx#L3972)

```typescript
navColor(id: NavId) => "var(--st-accent)" | "var(--st-text-2)"
```

Преобразование/вычисление в теле функции; тип результата и параметры приведены ниже, точное выражение доступно по ссылке на исходник.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `id` | `NavId` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `"var(--st-accent)" \| "var(--st-text-2)"`.

## StormApp.onClick

[frontend/src/storm/StormApp.tsx:4018](../../../../../frontend/src/storm/StormApp.tsx#L4018)

```typescript
onClick() => void
```

В теле вызывает `goToNotif`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `goToNotif`

</details>

## StormApp.secStyle

[frontend/src/storm/StormApp.tsx:4028](../../../../../frontend/src/storm/StormApp.tsx#L4028)

```typescript
secStyle(k: SectionId) => { active: boolean; color: string; badgeColor: string; badgeBg: string; }
```

Преобразование/вычисление в теле функции; тип результата и параметры приведены ниже, точное выражение доступно по ссылке на исходник.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `k` | `SectionId` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `{ active: boolean; color: string; badgeColor: string; badgeBg: string; }`.

## StormApp.portPillsOf

[frontend/src/storm/StormApp.tsx:4039](../../../../../frontend/src/storm/StormApp.tsx#L4039)

```typescript
portPillsOf(ports: Host["ports"]) => { bg: string; color: string; label: string; http: number | null; }[]
```

В теле вызывает `ports.map`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `ports` | `Host["ports"]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `{ bg: string; color: string; label: string; http: number \| null; }[]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `ports.map`

</details>

## StormApp.httpStatusColor

[frontend/src/storm/StormApp.tsx:4041](../../../../../frontend/src/storm/StormApp.tsx#L4041)

```typescript
httpStatusColor(code: number) => string
```

Colour for an HTTP status code next to a port: 2xx green, 3xx amber, else red.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `code` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `string`.

## StormApp.isNestedSubdomain

[frontend/src/storm/StormApp.tsx:4046](../../../../../frontend/src/storm/StormApp.tsx#L4046)

```typescript
isNestedSubdomain(h: Host) => boolean
```

A host that is a subdomain of another host in the project (shown nested, not top-level).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `h` | `Host` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `boolean`.

<details>
<summary>Прямые вызовы в теле</summary>

- `hostIndex.nestedIds.has`

</details>

## StormApp.isIpFarmRow

[frontend/src/storm/StormApp.tsx:4052](../../../../../frontend/src/storm/StormApp.tsx#L4052)

```typescript
isIpFarmRow(h: Host) => boolean
```

Преобразование/вычисление в теле функции; тип результата и параметры приведены ниже, точное выражение доступно по ссылке на исходник.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `h` | `Host` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `boolean`.

## StormApp.matchesStatusFilters

[frontend/src/storm/StormApp.tsx:4056](../../../../../frontend/src/storm/StormApp.tsx#L4056)

```typescript
matchesStatusFilters(ports: Host["ports"], status: Host["status"], filters: string[]) => boolean
```

В теле вызывает `filters.some`, `ports.map`, `ports.map((p) => p.http).filter`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `ports` | `Host["ports"]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `status` | `Host["status"]` | `обязательный` | Статус операции/ресурса; допустимые значения задаёт Enum или схема. |
| `filters` | `string[]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `boolean`.

<details>
<summary>Прямые вызовы в теле</summary>

- `filters.some`
- `ports.map`
- `ports.map((p) => p.http).filter`

</details>

## StormApp.hostMatchesFilters

[frontend/src/storm/StormApp.tsx:4068](../../../../../frontend/src/storm/StormApp.tsx#L4068)

```typescript
hostMatchesFilters(h: Host) => boolean
```

В теле вызывает `matchesStatusFilters`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `h` | `Host` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `boolean`.

<details>
<summary>Прямые вызовы в теле</summary>

- `matchesStatusFilters`

</details>

## StormApp.visibleSubdomainsOf

[frontend/src/storm/StormApp.tsx:4073](../../../../../frontend/src/storm/StormApp.tsx#L4073)

```typescript
visibleSubdomainsOf(h: Host) => Host[]
```

Subdomains of a host, filtered by the active pills (empty = all).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `h` | `Host` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Host[]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `subdomainsOf`
- `subdomainsOf(h).filter`

</details>

## StormApp.onClick

[frontend/src/storm/StormApp.tsx:4096](../../../../../frontend/src/storm/StormApp.tsx#L4096)

```typescript
onClick() => void
```

В теле вызывает `setState`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.onOpen

[frontend/src/storm/StormApp.tsx:4134](../../../../../frontend/src/storm/StormApp.tsx#L4134)

```typescript
onOpen() => void
```

В теле вызывает `openVulnDetail`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `openVulnDetail`

</details>

## StormApp.onEdit

[frontend/src/storm/StormApp.tsx:4135](../../../../../frontend/src/storm/StormApp.tsx#L4135)

```typescript
onEdit(e: ReactMouseEvent) => void
```

В теле вызывает `e.stopPropagation`, `openEditor`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `e` | `ReactMouseEvent` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `e.stopPropagation`
- `openEditor`

</details>

## StormApp.onDelete

[frontend/src/storm/StormApp.tsx:4139](../../../../../frontend/src/storm/StormApp.tsx#L4139)

```typescript
onDelete(e: ReactMouseEvent) => void
```

В теле вызывает `askDelete`, `e.stopPropagation`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `e` | `ReactMouseEvent` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `askDelete`
- `e.stopPropagation`

</details>

## StormApp.vfPill

[frontend/src/storm/StormApp.tsx:4146](../../../../../frontend/src/storm/StormApp.tsx#L4146)

```typescript
vfPill(on: boolean) => CSSProperties
```

Pill styling for a multi-select filter; `on` also covers the "All" pill (empty selection).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `on` | `boolean` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `CSSProperties`.

## StormApp.mergeBucket

[frontend/src/storm/StormApp.tsx:4166](../../../../../frontend/src/storm/StormApp.tsx#L4166)

```typescript
mergeBucket(into: IpBucket | null, h: IpBucket) => IpBucket
```

В теле вызывает `h.ports.filter`, `into.ports.map`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `into` | `IpBucket \| null` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `h` | `IpBucket` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `IpBucket`.

<details>
<summary>Прямые вызовы в теле</summary>

- `h.ports.filter`
- `into.ports.map`

</details>

## StormApp.onEdit

[frontend/src/storm/StormApp.tsx:4234](../../../../../frontend/src/storm/StormApp.tsx#L4234)

```typescript
onEdit(e: ReactMouseEvent) => void
```

В теле вызывает `e.stopPropagation`, `openEditor`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `e` | `ReactMouseEvent` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `e.stopPropagation`
- `openEditor`

</details>

## StormApp.onDelete

[frontend/src/storm/StormApp.tsx:4238](../../../../../frontend/src/storm/StormApp.tsx#L4238)

```typescript
onDelete(e: ReactMouseEvent) => void
```

В теле вызывает `askDelete`, `e.stopPropagation`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `e` | `ReactMouseEvent` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `askDelete`
- `e.stopPropagation`

</details>

## StormApp.askDeleteEndpoints

[frontend/src/storm/StormApp.tsx:4266](../../../../../frontend/src/storm/StormApp.tsx#L4266)

```typescript
askDeleteEndpoints(group: typeof endpointGroups[number]) => void
```

В теле вызывает `deletingEndpointHosts.includes`, `group.endpoints.map`, `setPendingDelete`, `setState`, `t`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `group` | `typeof endpointGroups[number]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `deletingEndpointHosts.includes`
- `group.endpoints.map`
- `setPendingDelete`
- `setState`
- `t`

</details>

## StormApp.fileBase

[frontend/src/storm/StormApp.tsx:4315](../../../../../frontend/src/storm/StormApp.tsx#L4315)

```typescript
fileBase(url: string) => string
```

File-name tail of a JS URL, and a compact byte size — shared by the JS views.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `url` | `string` | `обязательный` | URL обрабатываемого ресурса. |

Возвращает: `string`.

<details>
<summary>Прямые вызовы в теле</summary>

- `url.split`
- `url.split("/").pop`

</details>

## StormApp.kb

[frontend/src/storm/StormApp.tsx:4316](../../../../../frontend/src/storm/StormApp.tsx#L4316)

```typescript
kb(n: number | null) => string
```

В теле вызывает `Math.round`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `n` | `number \| null` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `string`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Math.round`

</details>

## StormApp.openJsFile

[frontend/src/storm/StormApp.tsx:4319](../../../../../frontend/src/storm/StormApp.tsx#L4319)

```typescript
openJsFile(id: number) => void
```

В теле вызывает `setState`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `id` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.closeJsFile

[frontend/src/storm/StormApp.tsx:4320](../../../../../frontend/src/storm/StormApp.tsx#L4320)

```typescript
closeJsFile() => void
```

В теле вызывает `setState`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.openJsHostDetail

[frontend/src/storm/StormApp.tsx:4323](../../../../../frontend/src/storm/StormApp.tsx#L4323)

```typescript
openJsHostDetail(host: string) => void
```

В теле вызывает `setState`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `host` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.closeJsHostDetail

[frontend/src/storm/StormApp.tsx:4324](../../../../../frontend/src/storm/StormApp.tsx#L4324)

```typescript
closeJsHostDetail() => void
```

В теле вызывает `setState`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.jsScanDomains

[frontend/src/storm/StormApp.tsx:4330](../../../../../frontend/src/storm/StormApp.tsx#L4330)

```typescript
jsScanDomains() => string[]
```

В теле вызывает `h.host.trim`, `h.host.trim().toLowerCase`, `hostsList.forEach`, `isIpLiteral`, `out.push`, `uniq.add`, `uniq.has`.

Возвращает: `string[]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `h.host.trim`
- `h.host.trim().toLowerCase`
- `hostsList.forEach`
- `isIpLiteral`
- `out.push`
- `uniq.add`
- `uniq.has`

</details>

## StormApp.jsScanDomains.add

[frontend/src/storm/StormApp.tsx:4333](../../../../../frontend/src/storm/StormApp.tsx#L4333)

```typescript
add(x: Host) => void
```

В теле вызывает `rows.push`, `seen.add`, `seen.has`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `x` | `Host` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `rows.push`
- `seen.add`
- `seen.has`

</details>

## StormApp.openJsScanSetup

[frontend/src/storm/StormApp.tsx:4352](../../../../../frontend/src/storm/StormApp.tsx#L4352)

```typescript
openJsScanSetup() => void
```

В теле вызывает `jsScanDomains`, `jsScanDomains().join`, `setState`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `jsScanDomains`
- `jsScanDomains().join`
- `setState`

</details>

## StormApp.closeJsScanSetup

[frontend/src/storm/StormApp.tsx:4353](../../../../../frontend/src/storm/StormApp.tsx#L4353)

```typescript
closeJsScanSetup() => void
```

В теле вызывает `setState`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.pick

[frontend/src/storm/StormApp.tsx:4485](../../../../../frontend/src/storm/StormApp.tsx#L4485)

```typescript
pick(v: string) => void
```

В теле вызывает `setState`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `v` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.onInput

[frontend/src/storm/StormApp.tsx:4496](../../../../../frontend/src/storm/StormApp.tsx#L4496)

```typescript
onInput(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
```

В теле вызывает `updateForm`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `e` | `ChangeEvent<HTMLInputElement \| HTMLTextAreaElement \| HTMLSelectElement>` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `updateForm`

</details>

## StormApp.onTagDraft

[frontend/src/storm/StormApp.tsx:4498](../../../../../frontend/src/storm/StormApp.tsx#L4498)

```typescript
onTagDraft(e: ChangeEvent<HTMLInputElement>) => void
```

В теле вызывает `setTagDraft`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `e` | `ChangeEvent<HTMLInputElement>` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setTagDraft`

</details>

## StormApp.onTagKeyDown

[frontend/src/storm/StormApp.tsx:4499](../../../../../frontend/src/storm/StormApp.tsx#L4499)

```typescript
onTagKeyDown(e: ReactKeyboardEvent<HTMLInputElement>) => void
```

В теле вызывает `addEditorTag`, `e.preventDefault`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `e` | `ReactKeyboardEvent<HTMLInputElement>` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `addEditorTag`
- `e.preventDefault`

</details>

## StormApp.onRemove

[frontend/src/storm/StormApp.tsx:4505](../../../../../frontend/src/storm/StormApp.tsx#L4505)

```typescript
onRemove() => void
```

В теле вызывает `removeEditorTag`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `removeEditorTag`

</details>

## StormApp.onPick

[frontend/src/storm/StormApp.tsx:4508](../../../../../frontend/src/storm/StormApp.tsx#L4508)

```typescript
onPick() => void
```

В теле вызывает `pick`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `pick`

</details>

## StormApp.onComboInput

[frontend/src/storm/StormApp.tsx:4510](../../../../../frontend/src/storm/StormApp.tsx#L4510)

```typescript
onComboInput(e: ChangeEvent<HTMLInputElement>) => void
```

В теле вызывает `setState`, `updateForm`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `e` | `ChangeEvent<HTMLInputElement>` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`
- `updateForm`

</details>

## StormApp.onComboFocus

[frontend/src/storm/StormApp.tsx:4514](../../../../../frontend/src/storm/StormApp.tsx#L4514)

```typescript
onComboFocus() => void
```

В теле вызывает `setState`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.onComboBlur

[frontend/src/storm/StormApp.tsx:4515](../../../../../frontend/src/storm/StormApp.tsx#L4515)

```typescript
onComboBlur() => void
```

В теле вызывает `setState`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.onComboKeyDown

[frontend/src/storm/StormApp.tsx:4516](../../../../../frontend/src/storm/StormApp.tsx#L4516)

```typescript
onComboKeyDown(e: ReactKeyboardEvent<HTMLInputElement>) => void
```

В теле вызывает `e.preventDefault`, `pick`, `setState`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `e` | `ReactKeyboardEvent<HTMLInputElement>` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `e.preventDefault`
- `pick`
- `setState`

</details>

## StormApp.pfNav

[frontend/src/storm/StormApp.tsx:4550](../../../../../frontend/src/storm/StormApp.tsx#L4550)

```typescript
pfNav(tab: ProfileTab) => CSSProperties
```

Преобразование/вычисление в теле функции; тип результата и параметры приведены ниже, точное выражение доступно по ссылке на исходник.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `tab` | `ProfileTab` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `CSSProperties`.

## StormApp.capNote

[frontend/src/storm/StormApp.tsx:4556](../../../../../frontend/src/storm/StormApp.tsx#L4556)

```typescript
capNote(total: number, shown: number) => ReactNode
```

В теле вызывает `t`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `total` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `shown` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `ReactNode`.

<details>
<summary>Прямые вызовы в теле</summary>

- `t`

</details>

## StormApp.eyebrow

[frontend/src/storm/StormApp.tsx:4563](../../../../../frontend/src/storm/StormApp.tsx#L4563)

```typescript
eyebrow(crumbs: { label: string; onClick?: () => void; muted?: boolean }[]) => ReactNode
```

В теле вызывает `crumbs.map`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `crumbs` | `{ label: string; onClick?: () => void; muted?: boolean }[]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `ReactNode`.

<details>
<summary>Прямые вызовы в теле</summary>

- `crumbs.map`

</details>

## StormApp.renderProjects

[frontend/src/storm/StormApp.tsx:4582](../../../../../frontend/src/storm/StormApp.tsx#L4582)

```typescript
renderProjects() => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

В теле вызывает `String`, `[ { icon: "trend-up" as const, iconColor: "var(--st-accent-2)", label: "Active", value: String(activeCount), spark: cumulativeSpark(projCreatedTimes(activeRows), ...projWindow(activeRows)), stroke: "var(--st-accent-2)", w: 111 }, { icon: "archive" as const, iconColor: "var(--st-text-3)", label: "Archived", value: String(archivedCount), spark: cumulativeSpark(projCreatedTimes(archivedRows), ...projWindow(archivedRows)), stroke: "var(--st-text-faint)", w: 111 }, { icon: "clock" as const, iconColor: "var(--st-danger)", label: "Open issues", value: String(tabProjects.reduce((s, p) => s + p.openFindings, 0)), spark: cumulativeSpark(aggOpenVulnTimes(tabProjects), ...projWindow(tabProjects)), stroke: "var(--st-danger)", w: 111 }, { icon: "star" as const, iconColor: "var(--st-accent-2)", label: "Projects", value: String(tabProjects.length), spark: cumulativeSpark(projCreatedTimes(tabProjects), ...projWindow(tabProjects)), stroke: "var(--st-accent-muted)", w: 111 }, { icon: "server" as const, iconColor: "var(--st-success)", label: "Hosts", value: String(tabProjects.reduce((s, p) => s + p.hostsCount, 0)), spark: cumulativeSpark(aggHostTimes(tabProjects), ...projWindow(tabProjects)), stroke: "var(--st-success)", w: 111 }, ].map`, `aggHostTimes`, `aggOpenVulnTimes`, `cumulativeSpark`, `projCreatedTimes`, `projRows.map`, `projWindow`; полный список ниже.

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

<details>
<summary>Прямые вызовы в теле</summary>

- `String`
- `[ { icon: "trend-up" as const, iconColor: "var(--st-accent-2)", label: "Active", value: String(activeCount), spark: cumulativeSpark(projCreatedTimes(activeRows), ...projWindow(activeRows)), stroke: "var(--st-accent-2)", w: 111 }, { icon: "archive" as const, iconColor: "var(--st-text-3)", label: "Archived", value: String(archivedCount), spark: cumulativeSpark(projCreatedTimes(archivedRows), ...projWindow(archivedRows)), stroke: "var(--st-text-faint)", w: 111 }, { icon: "clock" as const, iconColor: "var(--st-danger)", label: "Open issues", value: String(tabProjects.reduce((s, p) => s + p.openFindings, 0)), spark: cumulativeSpark(aggOpenVulnTimes(tabProjects), ...projWindow(tabProjects)), stroke: "var(--st-danger)", w: 111 }, { icon: "star" as const, iconColor: "var(--st-accent-2)", label: "Projects", value: String(tabProjects.length), spark: cumulativeSpark(projCreatedTimes(tabProjects), ...projWindow(tabProjects)), stroke: "var(--st-accent-muted)", w: 111 }, { icon: "server" as const, iconColor: "var(--st-success)", label: "Hosts", value: String(tabProjects.reduce((s, p) => s + p.hostsCount, 0)), spark: cumulativeSpark(aggHostTimes(tabProjects), ...projWindow(tabProjects)), stroke: "var(--st-success)", w: 111 }, ].map`
- `aggHostTimes`
- `aggOpenVulnTimes`
- `cumulativeSpark`
- `projCreatedTimes`
- `projRows.map`
- `projWindow`
- `t`
- `tabProjects.reduce`

</details>

## StormApp.taskStatusVs

[frontend/src/storm/StormApp.tsx:4708](../../../../../frontend/src/storm/StormApp.tsx#L4708)

```typescript
taskStatusVs(raw: string) => VStatus | null
```

В теле вызывает `(VSTATUS_ORDER as string[]).includes`, `(raw || "").trim`, `(raw || "").trim().toLowerCase`, `(raw || "").trim().toLowerCase().replace`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `raw` | `string` | `обязательный` | Исходное значение до нормализации/разбора. |

Возвращает: `VStatus \| null`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(VSTATUS_ORDER as string[]).includes`
- `(raw || "").trim`
- `(raw || "").trim().toLowerCase`
- `(raw || "").trim().toLowerCase().replace`

</details>

## StormApp.createProjectFromTask

[frontend/src/storm/StormApp.tsx:4718](../../../../../frontend/src/storm/StormApp.tsx#L4718)

```typescript
async createProjectFromTask(task: TaskTrackerTask) => Promise<void>
```

Загружает полную карточку APPSEC и открывает чистый черновик проекта.
Переносит логин исполнителя и все версии. Поздние ответы после навигации
игнорируются; ошибка оставляет форму закрытой и показывает уведомление.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `task` | `TaskTrackerTask` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<void>`.

Явные throw в теле:

```typescript
new Error(t("Couldn't load this task"))
```

<details>
<summary>Прямые вызовы в теле</summary>

- `apiGetTask`
- `appsecMetadataFromTask`
- `detail.summary.slice`
- `emptyProjectDraft`
- `getApiErrorMessage`
- `pushToast`
- `setState`
- `t`

</details>

## StormApp.renderTasks

[frontend/src/storm/StormApp.tsx:4741](../../../../../frontend/src/storm/StormApp.tsx#L4741)

```typescript
renderTasks() => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

В теле вызывает `eyebrow`, `filtered.map`, `renderTaskDetail`, `rows.filter`, `rows.some`, `searchBox`, `searched .filter`, `searched .filter((r) => (isActive ? !isDone(r) : isDone(r))) .sort`; полный список ниже.

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

<details>
<summary>Прямые вызовы в теле</summary>

- `eyebrow`
- `filtered.map`
- `renderTaskDetail`
- `rows.filter`
- `rows.some`
- `searchBox`
- `searched .filter`
- `searched .filter((r) => (isActive ? !isDone(r) : isDone(r))) .sort`
- `searched.filter`
- `state.tasksQuery.trim`
- `state.tasksQuery.trim().toLowerCase`
- `t`

</details>

## StormApp.renderTasks.isDone

[frontend/src/storm/StormApp.tsx:4746](../../../../../frontend/src/storm/StormApp.tsx#L4746)

```typescript
isDone(r: TaskTrackerTask) => boolean
```

В теле вызывает `taskStatusVs`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `r` | `TaskTrackerTask` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `boolean`.

<details>
<summary>Прямые вызовы в теле</summary>

- `taskStatusVs`

</details>

## StormApp.renderTasks.ts

[frontend/src/storm/StormApp.tsx:4751](../../../../../frontend/src/storm/StormApp.tsx#L4751)

```typescript
ts(r: TaskTrackerTask) => number
```

В теле вызывает `Date.parse`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `r` | `TaskTrackerTask` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `number`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Date.parse`

</details>

## StormApp.renderTaskDetail

[frontend/src/storm/StormApp.tsx:4837](../../../../../frontend/src/storm/StormApp.tsx#L4837)

```typescript
renderTaskDetail() => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

В теле вызывает `(d.description || "").trim`, `d.affected_versions!.map`, `eyebrow`, `fmtDateTime`, `sideRow`, `t`, `taskStatusVs`.

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(d.description || "").trim`
- `d.affected_versions!.map`
- `eyebrow`
- `fmtDateTime`
- `sideRow`
- `t`
- `taskStatusVs`

</details>

## StormApp.renderTaskDetail.sideRow

[frontend/src/storm/StormApp.tsx:4844](../../../../../frontend/src/storm/StormApp.tsx#L4844)

```typescript
sideRow(label: string, value: ReactNode) => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

Преобразование/вычисление в теле функции; тип результата и параметры приведены ниже, точное выражение доступно по ссылке на исходник.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `label` | `string` | `обязательный` | Текст подписи/сообщения проверки. |
| `value` | `ReactNode` | `обязательный` | Входное значение преобразования/проверки. |

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

## StormApp.renderTaskDetail.backToTasks

[frontend/src/storm/StormApp.tsx:4850](../../../../../frontend/src/storm/StormApp.tsx#L4850)

```typescript
backToTasks() => void
```

В теле вызывает `setState`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.renderWorkspaceMembers

[frontend/src/storm/StormApp.tsx:4902](../../../../../frontend/src/storm/StormApp.tsx#L4902)

```typescript
renderWorkspaceMembers() => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

В теле вызывает `(() => { const wq = state.wsMemberQuery.trim().toLowerCase(); const filtered = state.workspaceUsers .map((u, idx) => ({ u, idx })) .filter( ({ u }) => // Вкладка: активные = не заблокированные, архив = деактивированные. (state.wsUserTab === "archived" ? u.locked : !u.locked) && (state.wsMemberRoles.length === 0 || state.wsMemberRoles.includes(u.role)) && (state.wsMemberProjectRoles.length === 0 || state.wsMemberProjectRoles.includes(u.projectRole)) && (!wq || u.name.toLowerCase().includes(wq)) ); if (filtered.length === 0) return ( <div style={{ padding: 44, textAlign: "center", color: "var(--st-text-faint)", fontSize: 14 }}> {state.wsUserTab === "archived" ? t("No deactivated members.") : t("No members match.")} </div> ); return ( <> {/* Column headers only make sense with rows — hide them when empty. */} <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.4fr 168px 72px", padding: "13px 20px", borderBottom: "1px solid var(--st-divider)", font: "700 11px Inter,sans-serif", letterSpacing: ".6px", color: "var(--st-text-faint)", textTransform: "uppercase" }}> <div>{t("Name")}</div> <div>{t("Email")}</div> <div>{t("Role")}</div> <div style={{ textAlign: "right" }}>{t("Actions")}</div> </div> {filtered.map(({ u, idx }) => ( <div key={u.key + idx} className="prow" style={{ display: "grid", gridTemplateColumns: "1.2fr 1.4fr 168px 72px", alignItems: "center", padding: "14px 20px", borderBottom: "1px solid var(--st-divider)" }}> <div style={{ display: "flex", alignItems: "center", gap: 11, minWidth: 0 }}> <span className="mono" style={{ width: 32, height: 32, flex: "none", borderRadius: "50%", background: u.locked ? "var(--st-text-faint)" : "var(--st-accent)", color: "var(--st-on-accent)", display: "flex", alignItems: "center", justifyContent: "center", font: "700 13px 'JetBrains Mono',monospace" }}>{(u.name[0] || "U").toUpperCase()}</span> <span style={{ font: "600 13.5px Inter,sans-serif", color: "var(--st-text)" }}>{u.name}</span> </div> <div className="mono" style={{ fontSize: 12.5, color: "var(--st-text-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.email}</div> <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}> <span style={{ font: "700 10px Inter,sans-serif", textTransform: "uppercase", letterSpacing: ".5px", borderRadius: 6, padding: "3px 9px", background: WS_ROLE[u.role].bg, color: WS_ROLE[u.role].color }}>{t(WS_ROLE_LABEL[u.role])}</span> <span style={{ font: "700 10px Inter,sans-serif", textTransform: "uppercase", letterSpacing: ".5px", borderRadius: 6, padding: "3px 9px", background: ROLE[u.projectRole].bg, color: ROLE[u.projectRole].color }}>{u.projectRole}</span> </div> <div style={{ display: "flex", justifyContent: "flex-end", gap: 2 }}> <div className="actbtn" onClick={() => openWSUserEditor("edit", idx)}><Icon name="edit" size={15} /></div> {u.locked ? ( <div className="actbtn" title={t("Reactivate user")} onClick={() => reactivateUser(idx)}><Icon name="unlock" size={15} /></div> ) : ( <div className="actbtn del" title={t("Block user")} onClick={() => askDeleteWSUser(idx)}><Icon name="trash" size={15} /></div> )} </div> </div> ))} </> ); })`, `([{ label: "Admin", v: "admin" as const }, { label: "User", v: "user" as const }]).map`, `([{ label: "Lead", v: "lead" as const }, { label: "Pentester", v: "pentester" as const }]).map`, `eyebrow`, `state.pendingInvites.map`, `state.workspaceUsers.filter`, `t`, `vfPill`.

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(() => { const wq = state.wsMemberQuery.trim().toLowerCase(); const filtered = state.workspaceUsers .map((u, idx) => ({ u, idx })) .filter( ({ u }) => // Вкладка: активные = не заблокированные, архив = деактивированные. (state.wsUserTab === "archived" ? u.locked : !u.locked) && (state.wsMemberRoles.length === 0 || state.wsMemberRoles.includes(u.role)) && (state.wsMemberProjectRoles.length === 0 || state.wsMemberProjectRoles.includes(u.projectRole)) && (!wq || u.name.toLowerCase().includes(wq)) ); if (filtered.length === 0) return ( <div style={{ padding: 44, textAlign: "center", color: "var(--st-text-faint)", fontSize: 14 }}> {state.wsUserTab === "archived" ? t("No deactivated members.") : t("No members match.")} </div> ); return ( <> {/* Column headers only make sense with rows — hide them when empty. */} <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.4fr 168px 72px", padding: "13px 20px", borderBottom: "1px solid var(--st-divider)", font: "700 11px Inter,sans-serif", letterSpacing: ".6px", color: "var(--st-text-faint)", textTransform: "uppercase" }}> <div>{t("Name")}</div> <div>{t("Email")}</div> <div>{t("Role")}</div> <div style={{ textAlign: "right" }}>{t("Actions")}</div> </div> {filtered.map(({ u, idx }) => ( <div key={u.key + idx} className="prow" style={{ display: "grid", gridTemplateColumns: "1.2fr 1.4fr 168px 72px", alignItems: "center", padding: "14px 20px", borderBottom: "1px solid var(--st-divider)" }}> <div style={{ display: "flex", alignItems: "center", gap: 11, minWidth: 0 }}> <span className="mono" style={{ width: 32, height: 32, flex: "none", borderRadius: "50%", background: u.locked ? "var(--st-text-faint)" : "var(--st-accent)", color: "var(--st-on-accent)", display: "flex", alignItems: "center", justifyContent: "center", font: "700 13px 'JetBrains Mono',monospace" }}>{(u.name[0] || "U").toUpperCase()}</span> <span style={{ font: "600 13.5px Inter,sans-serif", color: "var(--st-text)" }}>{u.name}</span> </div> <div className="mono" style={{ fontSize: 12.5, color: "var(--st-text-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.email}</div> <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}> <span style={{ font: "700 10px Inter,sans-serif", textTransform: "uppercase", letterSpacing: ".5px", borderRadius: 6, padding: "3px 9px", background: WS_ROLE[u.role].bg, color: WS_ROLE[u.role].color }}>{t(WS_ROLE_LABEL[u.role])}</span> <span style={{ font: "700 10px Inter,sans-serif", textTransform: "uppercase", letterSpacing: ".5px", borderRadius: 6, padding: "3px 9px", background: ROLE[u.projectRole].bg, color: ROLE[u.projectRole].color }}>{u.projectRole}</span> </div> <div style={{ display: "flex", justifyContent: "flex-end", gap: 2 }}> <div className="actbtn" onClick={() => openWSUserEditor("edit", idx)}><Icon name="edit" size={15} /></div> {u.locked ? ( <div className="actbtn" title={t("Reactivate user")} onClick={() => reactivateUser(idx)}><Icon name="unlock" size={15} /></div> ) : ( <div className="actbtn del" title={t("Block user")} onClick={() => askDeleteWSUser(idx)}><Icon name="trash" size={15} /></div> )} </div> </div> ))} </> ); })`
- `([{ label: "Admin", v: "admin" as const }, { label: "User", v: "user" as const }]).map`
- `([{ label: "Lead", v: "lead" as const }, { label: "Pentester", v: "pentester" as const }]).map`
- `eyebrow`
- `state.pendingInvites.map`
- `state.workspaceUsers.filter`
- `t`
- `vfPill`

</details>

## StormApp.tabItem

[frontend/src/storm/StormApp.tsx:5033](../../../../../frontend/src/storm/StormApp.tsx#L5033)

```typescript
tabItem(label: string, icon: Parameters<typeof Icon>[0]["name"], st: { active: boolean }, onClick: () => void, badge?: { text: string; color: string; bg: string }, extra?: ReactNode) => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

Преобразование/вычисление в теле функции; тип результата и параметры приведены ниже, точное выражение доступно по ссылке на исходник.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `label` | `string` | `обязательный` | Текст подписи/сообщения проверки. |
| `icon` | `Parameters<typeof Icon>[0]["name"]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `st` | `{ active: boolean }` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `onClick` | `() => void` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `badge` | `{ text: string; color: string; bg: string }` | `undefined (optional)` | Определяется именем/типом и контрактом вызывающего кода. |
| `extra` | `ReactNode` | `undefined (optional)` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

## StormApp.renderDetail

[frontend/src/storm/StormApp.tsx:5042](../../../../../frontend/src/storm/StormApp.tsx#L5042)

```typescript
renderDetail() => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

В теле вызывает `([ { v: "hosts" as const, icon: "server" as const, label: "Hosts", count: hosts.length }, { v: "ips" as const, icon: "card" as const, label: "IPs", count: ipsRows.length }, { v: "endpoints" as const, icon: "link" as const, label: "Endpoints", count: endpointTotal }, { v: "js" as const, icon: "doc" as const, label: "JS", count: jsFiles.length }, ]).map`, `String`, `crumbLeaf.split`, `crumbLeaf.split(" / ").map`, `isFarmJobInFlight`, `renderActivity`, `renderCreds`, `renderMembers`; полный список ниже.

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

<details>
<summary>Прямые вызовы в теле</summary>

- `([ { v: "hosts" as const, icon: "server" as const, label: "Hosts", count: hosts.length }, { v: "ips" as const, icon: "card" as const, label: "IPs", count: ipsRows.length }, { v: "endpoints" as const, icon: "link" as const, label: "Endpoints", count: endpointTotal }, { v: "js" as const, icon: "doc" as const, label: "JS", count: jsFiles.length }, ]).map`
- `String`
- `crumbLeaf.split`
- `crumbLeaf.split(" / ").map`
- `isFarmJobInFlight`
- `renderActivity`
- `renderCreds`
- `renderMembers`
- `renderNoAccessPage`
- `renderNoteEditor`
- `renderNoteViewer`
- `renderNotes`
- `renderOverview`
- `renderRecon`
- `renderVulns`
- `t`
- `tabItem`

</details>

## StormApp.renderNoAccess

[frontend/src/storm/StormApp.tsx:5255](../../../../../frontend/src/storm/StormApp.tsx#L5255)

```typescript
renderNoAccess(message: string) => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

В теле вызывает `t`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `message` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

<details>
<summary>Прямые вызовы в теле</summary>

- `t`

</details>

## StormApp.renderNoAccessPage

[frontend/src/storm/StormApp.tsx:5270](../../../../../frontend/src/storm/StormApp.tsx#L5270)

```typescript
renderNoAccessPage(message: string = NO_ACCESS_PROJECT) => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

В теле вызывает `t`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `message` | `string` | `NO_ACCESS_PROJECT` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

<details>
<summary>Прямые вызовы в теле</summary>

- `t`

</details>

## StormApp.renderOverview

[frontend/src/storm/StormApp.tsx:5289](../../../../../frontend/src/storm/StormApp.tsx#L5289)

```typescript
renderOverview() => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

В теле вызывает `(() => { // Cumulative sparklines over the engagement window — each add pushes the // line up. Open vulns / my findings chart the creation time of the very // findings that make up the shown count, so the curve lands on that total. const wStart = Date.parse(projRow?.startISO ?? ""); const wEnd = Date.parse(projRow?.endISO ?? ""); const openVulns = d.vulns.filter((v) => (VSTATUS_OPEN as readonly string[]).includes(v.status)); const myVulns = d.vulns.filter((v) => v.author === me); return [ { icon: "globe" as const, color: "var(--st-accent-2)", label: "Hosts", value: hosts.length, spark: cumulativeSpark(hosts.map((h) => h.created), wStart, wEnd), stroke: "var(--st-accent-2)", onClick: () => setSection("hosts") }, { icon: "alert-triangle" as const, color: "var(--st-danger)", label: "Open vulns", value: openVulnCount, spark: cumulativeSpark(openVulns.map((v) => v.created), wStart, wEnd), stroke: "var(--st-danger)", onClick: goToOpenVulns }, { icon: "star" as const, color: "var(--st-purple)", label: "My findings", value: myFindingsCount, spark: cumulativeSpark(myVulns.map((v) => v.created), wStart, wEnd), stroke: "var(--st-purple)", onClick: goToMyFindings }, ]; })`, `(() => { // Cumulative sparklines over the engagement window — each add pushes the // line up. Open vulns / my findings chart the creation time of the very // findings that make up the shown count, so the curve lands on that total. const wStart = Date.parse(projRow?.startISO ?? ""); const wEnd = Date.parse(projRow?.endISO ?? ""); const openVulns = d.vulns.filter((v) => (VSTATUS_OPEN as readonly string[]).includes(v.status)); const myVulns = d.vulns.filter((v) => v.author === me); return [ { icon: "globe" as const, color: "var(--st-accent-2)", label: "Hosts", value: hosts.length, spark: cumulativeSpark(hosts.map((h) => h.created), wStart, wEnd), stroke: "var(--st-accent-2)", onClick: () => setSection("hosts") }, { icon: "alert-triangle" as const, color: "var(--st-danger)", label: "Open vulns", value: openVulnCount, spark: cumulativeSpark(openVulns.map((v) => v.created), wStart, wEnd), stroke: "var(--st-danger)", onClick: goToOpenVulns }, { icon: "star" as const, color: "var(--st-purple)", label: "My findings", value: myFindingsCount, spark: cumulativeSpark(myVulns.map((v) => v.created), wStart, wEnd), stroke: "var(--st-purple)", onClick: goToMyFindings }, ]; })().map`, `d.members.map`, `sevBars.map`, `t`.

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(() => { // Cumulative sparklines over the engagement window — each add pushes the // line up. Open vulns / my findings chart the creation time of the very // findings that make up the shown count, so the curve lands on that total. const wStart = Date.parse(projRow?.startISO ?? ""); const wEnd = Date.parse(projRow?.endISO ?? ""); const openVulns = d.vulns.filter((v) => (VSTATUS_OPEN as readonly string[]).includes(v.status)); const myVulns = d.vulns.filter((v) => v.author === me); return [ { icon: "globe" as const, color: "var(--st-accent-2)", label: "Hosts", value: hosts.length, spark: cumulativeSpark(hosts.map((h) => h.created), wStart, wEnd), stroke: "var(--st-accent-2)", onClick: () => setSection("hosts") }, { icon: "alert-triangle" as const, color: "var(--st-danger)", label: "Open vulns", value: openVulnCount, spark: cumulativeSpark(openVulns.map((v) => v.created), wStart, wEnd), stroke: "var(--st-danger)", onClick: goToOpenVulns }, { icon: "star" as const, color: "var(--st-purple)", label: "My findings", value: myFindingsCount, spark: cumulativeSpark(myVulns.map((v) => v.created), wStart, wEnd), stroke: "var(--st-purple)", onClick: goToMyFindings }, ]; })`
- `(() => { // Cumulative sparklines over the engagement window — each add pushes the // line up. Open vulns / my findings chart the creation time of the very // findings that make up the shown count, so the curve lands on that total. const wStart = Date.parse(projRow?.startISO ?? ""); const wEnd = Date.parse(projRow?.endISO ?? ""); const openVulns = d.vulns.filter((v) => (VSTATUS_OPEN as readonly string[]).includes(v.status)); const myVulns = d.vulns.filter((v) => v.author === me); return [ { icon: "globe" as const, color: "var(--st-accent-2)", label: "Hosts", value: hosts.length, spark: cumulativeSpark(hosts.map((h) => h.created), wStart, wEnd), stroke: "var(--st-accent-2)", onClick: () => setSection("hosts") }, { icon: "alert-triangle" as const, color: "var(--st-danger)", label: "Open vulns", value: openVulnCount, spark: cumulativeSpark(openVulns.map((v) => v.created), wStart, wEnd), stroke: "var(--st-danger)", onClick: goToOpenVulns }, { icon: "star" as const, color: "var(--st-purple)", label: "My findings", value: myFindingsCount, spark: cumulativeSpark(myVulns.map((v) => v.created), wStart, wEnd), stroke: "var(--st-purple)", onClick: goToMyFindings }, ]; })().map`
- `d.members.map`
- `sevBars.map`
- `t`

</details>

## StormApp.renderOverview.onClick

[frontend/src/storm/StormApp.tsx:5316](../../../../../frontend/src/storm/StormApp.tsx#L5316)

```typescript
onClick() => void
```

В теле вызывает `setSection`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setSection`

</details>

## StormApp.portPills

[frontend/src/storm/StormApp.tsx:5376](../../../../../frontend/src/storm/StormApp.tsx#L5376)

```typescript
portPills(ports: Host["ports"], hostDown = false) => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

В теле вызывает `portPillsOf`, `portPillsOf(ports).map`, `t`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `ports` | `Host["ports"]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `hostDown` | `boolean` | `false` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

<details>
<summary>Прямые вызовы в теле</summary>

- `portPillsOf`
- `portPillsOf(ports).map`
- `t`

</details>

## StormApp.hostnamePills

[frontend/src/storm/StormApp.tsx:5404](../../../../../frontend/src/storm/StormApp.tsx#L5404)

```typescript
hostnamePills(names: { hostname: string; source: string; confirmed: boolean }[]) => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

В теле вызывает `names.map`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `names` | `{ hostname: string; source: string; confirmed: boolean }[]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

<details>
<summary>Прямые вызовы в теле</summary>

- `names.map`

</details>

## StormApp.renderImportPage

[frontend/src/storm/StormApp.tsx:5437](../../../../../frontend/src/storm/StormApp.tsx#L5437)

```typescript
renderImportPage(cfg: { title: string; pasteLabel: string; placeholder: string; previewPlaceholder: string; raw: string; preview: string; busy: boolean; submitLabel?: string; busyLabel?: string; onRaw: (v: string) => void; onPreview: (v: string) => void; onCancel: () => void; onSubmit: () => void; }) => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

В теле вызывает `cfg.preview.split`, `cfg.preview.split(/\r?\n/).filter`, `t`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `cfg` | `{ title: string; pasteLabel: string; placeholder: string; previewPlaceholder: string; raw: string; preview: string; busy: boolean; submitLabel?: string; busyLabel?: string; onRaw: (v: string) => void; onPreview: (v: string) => void; onCancel: () => void; onSubmit: () => void; }` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

<details>
<summary>Прямые вызовы в теле</summary>

- `cfg.preview.split`
- `cfg.preview.split(/\r?\n/).filter`
- `t`

</details>

## StormApp.renderHostImport

[frontend/src/storm/StormApp.tsx:5482](../../../../../frontend/src/storm/StormApp.tsx#L5482)

```typescript
renderHostImport() => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

В теле вызывает `renderImportPage`, `t`.

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

<details>
<summary>Прямые вызовы в теле</summary>

- `renderImportPage`
- `t`

</details>

## StormApp.renderHostImport.onRaw

[frontend/src/storm/StormApp.tsx:5491](../../../../../frontend/src/storm/StormApp.tsx#L5491)

```typescript
onRaw(v) => void
```

В теле вызывает `normalizeHostList`, `setState`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `v` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `normalizeHostList`
- `setState`

</details>

## StormApp.renderHostImport.onPreview

[frontend/src/storm/StormApp.tsx:5492](../../../../../frontend/src/storm/StormApp.tsx#L5492)

```typescript
onPreview(v) => void
```

В теле вызывает `setState`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `v` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.renderIpImport

[frontend/src/storm/StormApp.tsx:5497](../../../../../frontend/src/storm/StormApp.tsx#L5497)

```typescript
renderIpImport() => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

В теле вызывает `renderImportPage`, `t`.

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

<details>
<summary>Прямые вызовы в теле</summary>

- `renderImportPage`
- `t`

</details>

## StormApp.renderIpImport.onRaw

[frontend/src/storm/StormApp.tsx:5506](../../../../../frontend/src/storm/StormApp.tsx#L5506)

```typescript
onRaw(v) => void
```

В теле вызывает `normalizeIpList`, `setState`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `v` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `normalizeIpList`
- `setState`

</details>

## StormApp.renderIpImport.onPreview

[frontend/src/storm/StormApp.tsx:5507](../../../../../frontend/src/storm/StormApp.tsx#L5507)

```typescript
onPreview(v) => void
```

В теле вызывает `setState`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `v` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.renderEpImport

[frontend/src/storm/StormApp.tsx:5512](../../../../../frontend/src/storm/StormApp.tsx#L5512)

```typescript
renderEpImport() => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

В теле вызывает `renderImportPage`, `t`.

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

<details>
<summary>Прямые вызовы в теле</summary>

- `renderImportPage`
- `t`

</details>

## StormApp.renderEpImport.onRaw

[frontend/src/storm/StormApp.tsx:5523](../../../../../frontend/src/storm/StormApp.tsx#L5523)

```typescript
onRaw(v) => void
```

В теле вызывает `normalizeEpList`, `setState`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `v` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `normalizeEpList`
- `setState`

</details>

## StormApp.renderEpImport.onPreview

[frontend/src/storm/StormApp.tsx:5524](../../../../../frontend/src/storm/StormApp.tsx#L5524)

```typescript
onPreview(v) => void
```

В теле вызывает `setState`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `v` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.searchBox

[frontend/src/storm/StormApp.tsx:5529](../../../../../frontend/src/storm/StormApp.tsx#L5529)

```typescript
searchBox(placeholder: string, value: string, onChange: (v: string) => void, width: number | string = 280) => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

Преобразование/вычисление в теле функции; тип результата и параметры приведены ниже, точное выражение доступно по ссылке на исходник.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `placeholder` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `value` | `string` | `обязательный` | Входное значение преобразования/проверки. |
| `onChange` | `(v: string) => void` | `обязательный` | Callback изменения значения редактора/контрола. |
| `width` | `number \| string` | `280` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

## StormApp.filterPill

[frontend/src/storm/StormApp.tsx:5536](../../../../../frontend/src/storm/StormApp.tsx#L5536)

```typescript
filterPill(label: string, on: boolean, onClick: () => void) => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

В теле вызывает `vfPill`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `label` | `string` | `обязательный` | Текст подписи/сообщения проверки. |
| `on` | `boolean` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `onClick` | `() => void` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

<details>
<summary>Прямые вызовы в теле</summary>

- `vfPill`

</details>

## StormApp.reconFilterRow

[frontend/src/storm/StormApp.tsx:5543](../../../../../frontend/src/storm/StormApp.tsx#L5543)

```typescript
reconFilterRow(view: ReconView) => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

В теле вызывает `STATUS_FILTER_KEYS.map`, `STORM_METHODS.map`, `filterPill`, `searchBox`, `t`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `view` | `ReconView` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

<details>
<summary>Прямые вызовы в теле</summary>

- `STATUS_FILTER_KEYS.map`
- `STORM_METHODS.map`
- `filterPill`
- `searchBox`
- `t`

</details>

## StormApp.renderExport

[frontend/src/storm/StormApp.tsx:5609](../../../../../frontend/src/storm/StormApp.tsx#L5609)

```typescript
renderExport() => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

В теле вызывает `exportLinesFor`, `exportLinesFor(scope).filter`, `exportTextLines`, `filterPill`, `left.join`, `reconFilterRow`, `scope.startsWith`, `t`.

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

<details>
<summary>Прямые вызовы в теле</summary>

- `exportLinesFor`
- `exportLinesFor(scope).filter`
- `exportTextLines`
- `filterPill`
- `left.join`
- `reconFilterRow`
- `scope.startsWith`
- `t`

</details>

## StormApp.renderJsScanSetup

[frontend/src/storm/StormApp.tsx:5671](../../../../../frontend/src/storm/StormApp.tsx#L5671)

```typescript
renderJsScanSetup() => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

В теле вызывает `exportTextLines`, `found.join`, `jsScanDomains`, `jsScanDomains().filter`, `reconFilterRow`, `t`.

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

<details>
<summary>Прямые вызовы в теле</summary>

- `exportTextLines`
- `found.join`
- `jsScanDomains`
- `jsScanDomains().filter`
- `reconFilterRow`
- `t`

</details>

## StormApp.renderJsHostDetail

[frontend/src/storm/StormApp.tsx:5716](../../../../../frontend/src/storm/StormApp.tsx#L5716)

```typescript
renderJsHostDetail(host: string) => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

"All files of one host" page — aggregates its files, secrets and paths.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `host` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

<details>
<summary>Прямые вызовы в теле</summary>

- `[...new Set(files.flatMap((f) => f.endpoints))].sort`
- `allPaths.map`
- `allSecrets.map`
- `files.flatMap`
- `files.map`
- `files.reduce`
- `jsFiles.filter`
- `kb`
- `t`

</details>

## StormApp.renderJsFileDetail

[frontend/src/storm/StormApp.tsx:5805](../../../../../frontend/src/storm/StormApp.tsx#L5805)

```typescript
renderJsFileDetail(f: JsFileEntry) => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

One JS file's card — its secrets table and paths list, with Export.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `f` | `JsFileEntry` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

<details>
<summary>Прямые вызовы в теле</summary>

- `f.endpoints.map`
- `f.secrets.map`
- `fileBase`
- `kb`
- `t`

</details>

## StormApp.renderRecon

[frontend/src/storm/StormApp.tsx:5869](../../../../../frontend/src/storm/StormApp.tsx#L5869)

```typescript
renderRecon() => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

В теле вызывает `Math.min`, `capNote`, `endpointGroups.slice`, `endpointGroups.slice(0, LIST_CAP).map`, `hostsList.slice`, `hostsList.slice(0, LIST_CAP).map`, `ipsRows.slice`, `ipsRows.slice(0, LIST_CAP).map`; полный список ниже.

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Math.min`
- `capNote`
- `endpointGroups.slice`
- `endpointGroups.slice(0, LIST_CAP).map`
- `hostsList.slice`
- `hostsList.slice(0, LIST_CAP).map`
- `ipsRows.slice`
- `ipsRows.slice(0, LIST_CAP).map`
- `jsGroups.slice`
- `jsGroups.slice(0, LIST_CAP).map`
- `reconFilterRow`
- `renderEpImport`
- `renderExport`
- `renderHostDetail`
- `renderHostImport`
- `renderIpDetail`
- `renderIpImport`
- `renderJsFileDetail`
- `renderJsHostDetail`
- `renderJsScanSetup`
- `t`

</details>

## StormApp.renderHostDetail

[frontend/src/storm/StormApp.tsx:6101](../../../../../frontend/src/storm/StormApp.tsx#L6101)

```typescript
renderHostDetail(h: Host) => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

В теле вызывает `h.endpoints.slice`, `h.endpoints.slice(0, EP_GROUP_CAP).map`, `h.ips.map`, `h.ports.map`, `t`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `h` | `Host` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

<details>
<summary>Прямые вызовы в теле</summary>

- `h.endpoints.slice`
- `h.endpoints.slice(0, EP_GROUP_CAP).map`
- `h.ips.map`
- `h.ports.map`
- `t`

</details>

## StormApp.renderIpDetail

[frontend/src/storm/StormApp.tsx:6181](../../../../../frontend/src/storm/StormApp.tsx#L6181)

```typescript
renderIpDetail(row: (typeof ipsRows)[number]) => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

В теле вызывает `hostnamePills`, `row.names.map`, `row.names.map((n) => n.hostname).join`, `row.ports.map`, `t`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `row` | `(typeof ipsRows)[number]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

<details>
<summary>Прямые вызовы в теле</summary>

- `hostnamePills`
- `row.names.map`
- `row.names.map((n) => n.hostname).join`
- `row.ports.map`
- `t`

</details>

## StormApp.renderVulns

[frontend/src/storm/StormApp.tsx:6236](../../../../../frontend/src/storm/StormApp.tsx#L6236)

```typescript
renderVulns() => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

В теле вызывает `(["critical", "high", "medium", "low", "info", "unrealized"] as Severity[]).map`, `Math.min`, `VSTATUS_FILTER.map`, `capNote`, `filterPill`, `renderVulnDetail`, `searchBox`, `t`; полный список ниже.

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(["critical", "high", "medium", "low", "info", "unrealized"] as Severity[]).map`
- `Math.min`
- `VSTATUS_FILTER.map`
- `capNote`
- `filterPill`
- `renderVulnDetail`
- `searchBox`
- `t`
- `vulns.slice`
- `vulns.slice(0, LIST_CAP).map`

</details>

## StormApp.renderVulnDetail

[frontend/src/storm/StormApp.tsx:6297](../../../../../frontend/src/storm/StormApp.tsx#L6297)

```typescript
renderVulnDetail() => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

В теле вызывает `(vd.host || "").trim`, `(vd.host || "").trim().toLowerCase`, `(vd.stepsList ?? []).map`, `Math.max`, `Math.min`, `VSTATUS_ORDER.map`, `d.vulns.find`, `hosts .map`; полный список ниже.

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(vd.host || "").trim`
- `(vd.host || "").trim().toLowerCase`
- `(vd.stepsList ?? []).map`
- `Math.max`
- `Math.min`
- `VSTATUS_ORDER.map`
- `d.vulns.find`
- `hosts .map`
- `hosts .map((h) => h.host) .flatMap`
- `hosts .map((h) => h.host) .flatMap((hn) => { if (!vdHostQ) return [{ v: hn, rank: 0 }]; if (hn.toLowerCase().startsWith(vdHostQ)) return [{ v: hn, rank: 0 }]; if (hn.toLowerCase().includes(vdHostQ)) return [{ v: hn, rank: 1 }]; return [] as { v: string; rank: number }[]; }) .sort`
- `hosts .map((h) => h.host) .flatMap((hn) => { if (!vdHostQ) return [{ v: hn, rank: 0 }]; if (hn.toLowerCase().startsWith(vdHostQ)) return [{ v: hn, rank: 0 }]; if (hn.toLowerCase().includes(vdHostQ)) return [{ v: hn, rank: 1 }]; return [] as { v: string; rank: number }[]; }) .sort((a, b) => a.rank - b.rank) .slice`
- `hosts .map((h) => h.host) .flatMap((hn) => { if (!vdHostQ) return [{ v: hn, rank: 0 }]; if (hn.toLowerCase().startsWith(vdHostQ)) return [{ v: hn, rank: 0 }]; if (hn.toLowerCase().includes(vdHostQ)) return [{ v: hn, rank: 1 }]; return [] as { v: string; rank: number }[]; }) .sort((a, b) => a.rank - b.rank) .slice(0, COMBO_MAX) .map`
- `relTime`
- `state.vulnFiles.map`
- `t`
- `vdHostSuggestions.map`

</details>

## StormApp.renderVulnDetail.vdHostPick

[frontend/src/storm/StormApp.tsx:6315](../../../../../frontend/src/storm/StormApp.tsx#L6315)

```typescript
vdHostPick(v: string) => void
```

В теле вызывает `setState`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `v` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.notePreview

[frontend/src/storm/StormApp.tsx:6497](../../../../../frontend/src/storm/StormApp.tsx#L6497)

```typescript
notePreview(md: string) => string
```

First non-empty line of the body, with Markdown syntax stripped — the card preview.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `md` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `string`.

<details>
<summary>Прямые вызовы в теле</summary>

- `line .replace`
- `line .replace(/^#{1,6}\s+/, "") .replace`
- `line .replace(/^#{1,6}\s+/, "") .replace(/^\s*[-*]\s+/, "") .replace`
- `line .replace(/^#{1,6}\s+/, "") .replace(/^\s*[-*]\s+/, "") .replace(/\*\*([^*]+)\*\*/g, "$1") .replace`
- `line .replace(/^#{1,6}\s+/, "") .replace(/^\s*[-*]\s+/, "") .replace(/\*\*([^*]+)\*\*/g, "$1") .replace(/\*([^*]+)\*/g, "$1") .replace`
- `line .replace(/^#{1,6}\s+/, "") .replace(/^\s*[-*]\s+/, "") .replace(/\*\*([^*]+)\*\*/g, "$1") .replace(/\*([^*]+)\*/g, "$1") .replace(/`([^`]+)`/g, "$1") .replace`
- `md.replace`
- `md.replace(/\r/g, "").split`
- `md.replace(/\r/g, "").split("\n").map`
- `md.replace(/\r/g, "").split("\n").map((l) => l.trim()).find`

</details>

## StormApp.renderCreds

[frontend/src/storm/StormApp.tsx:6519](../../../../../frontend/src/storm/StormApp.tsx#L6519)

```typescript
renderCreds() => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

В теле вызывает `d.creds.map`, `t`.

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

<details>
<summary>Прямые вызовы в теле</summary>

- `d.creds.map`
- `t`

</details>

## StormApp.renderNotes

[frontend/src/storm/StormApp.tsx:6579](../../../../../frontend/src/storm/StormApp.tsx#L6579)

```typescript
renderNotes() => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

В теле вызывает `d.notes.map`, `t`.

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

<details>
<summary>Прямые вызовы в теле</summary>

- `d.notes.map`
- `t`

</details>

## StormApp.renderNoteViewer

[frontend/src/storm/StormApp.tsx:6607](../../../../../frontend/src/storm/StormApp.tsx#L6607)

```typescript
renderNoteViewer() => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

В теле вызывает `d.notes.findIndex`, `renderMarkdown`, `renderNoAccess`, `t`.

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

<details>
<summary>Прямые вызовы в теле</summary>

- `d.notes.findIndex`
- `renderMarkdown`
- `renderNoAccess`
- `t`

</details>

## StormApp.renderNoteEditor

[frontend/src/storm/StormApp.tsx:6653](../../../../../frontend/src/storm/StormApp.tsx#L6653)

```typescript
renderNoteEditor() => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

В теле вызывает `d.notes.find`, `t`.

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

<details>
<summary>Прямые вызовы в теле</summary>

- `d.notes.find`
- `t`

</details>

## StormApp.renderMembers

[frontend/src/storm/StormApp.tsx:6695](../../../../../frontend/src/storm/StormApp.tsx#L6695)

```typescript
renderMembers() => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

В теле вызывает `([{ label: "Lead", v: "lead" as const }, { label: "Pentester", v: "pentester" as const }]).map`, `d.members .map`, `d.members .map((m, idx) => ({ m, idx })) .filter`, `filtered.map`, `state.memberQuery.trim`, `state.memberQuery.trim().toLowerCase`, `t`, `vfPill`.

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

<details>
<summary>Прямые вызовы в теле</summary>

- `([{ label: "Lead", v: "lead" as const }, { label: "Pentester", v: "pentester" as const }]).map`
- `d.members .map`
- `d.members .map((m, idx) => ({ m, idx })) .filter`
- `filtered.map`
- `state.memberQuery.trim`
- `state.memberQuery.trim().toLowerCase`
- `t`
- `vfPill`

</details>

## StormApp.resolveActivityName

[frontend/src/storm/StormApp.tsx:6742](../../../../../frontend/src/storm/StormApp.tsx#L6742)

```typescript
resolveActivityName(type, id) => string | null
```

В теле вызывает `d.notes.find`, `d.vulns.find`, `h.endpoints.find`, `hosts.find`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `type` | `string \| null` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `id` | `number \| null` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `string \| null`.

<details>
<summary>Прямые вызовы в теле</summary>

- `d.notes.find`
- `d.vulns.find`
- `h.endpoints.find`
- `hosts.find`

</details>

## StormApp.activityLineRow

[frontend/src/storm/StormApp.tsx:6763](../../../../../frontend/src/storm/StormApp.tsx#L6763)

```typescript
activityLineRow(l: ActivityLine, tone: ActTone) => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

One line of the dark event panel: + text [SEVERITY].

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `l` | `ActivityLine` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `tone` | `ActTone` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

## StormApp.renderActivity

[frontend/src/storm/StormApp.tsx:6785](../../../../../frontend/src/storm/StormApp.tsx#L6785)

```typescript
renderActivity() => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

В теле вызывает `groups.map`, `renderNoAccess`, `t`.

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

<details>
<summary>Прямые вызовы в теле</summary>

- `groups.map`
- `renderNoAccess`
- `t`

</details>

## StormApp.renderProfile

[frontend/src/storm/StormApp.tsx:6846](../../../../../frontend/src/storm/StormApp.tsx#L6846)

```typescript
renderProfile() => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

В теле вызывает `eyebrow`, `meAvatar`, `pfNav`, `renderProfileAccount`, `renderProfileApi`, `renderProfileCustomizing`, `renderProfileSecurity`, `t`.

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

<details>
<summary>Прямые вызовы в теле</summary>

- `eyebrow`
- `meAvatar`
- `pfNav`
- `renderProfileAccount`
- `renderProfileApi`
- `renderProfileCustomizing`
- `renderProfileSecurity`
- `t`

</details>

## StormApp.cardHeader

[frontend/src/storm/StormApp.tsx:6882](../../../../../frontend/src/storm/StormApp.tsx#L6882)

```typescript
cardHeader(icon: Parameters<typeof Icon>[0]["name"], title: string, sub: string, right?: ReactNode) => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

В теле вызывает `t`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `icon` | `Parameters<typeof Icon>[0]["name"]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `title` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `sub` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `right` | `ReactNode` | `undefined (optional)` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

<details>
<summary>Прямые вызовы в теле</summary>

- `t`

</details>

## StormApp.renderProfileAccount

[frontend/src/storm/StormApp.tsx:6892](../../../../../frontend/src/storm/StormApp.tsx#L6892)

```typescript
renderProfileAccount() => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

В теле вызывает `String`, `[ { label: "Username", value: me, mono: true, color: "var(--st-text)" }, { label: "Email", value: meEmail, mono: true, color: "var(--st-text)", small: true }, { label: "Role", value: meRoleLabel, mono: false, color: "var(--st-accent)" }, { label: "User ID", value: String(meId), mono: true, color: "var(--st-accent-2)", last: true }, ].map`, `cardHeader`, `meAvatar`, `t`.

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

<details>
<summary>Прямые вызовы в теле</summary>

- `String`
- `[ { label: "Username", value: me, mono: true, color: "var(--st-text)" }, { label: "Email", value: meEmail, mono: true, color: "var(--st-text)", small: true }, { label: "Role", value: meRoleLabel, mono: false, color: "var(--st-accent)" }, { label: "User ID", value: String(meId), mono: true, color: "var(--st-accent-2)", last: true }, ].map`
- `cardHeader`
- `meAvatar`
- `t`

</details>

## StormApp.renderProfileCustomizing

[frontend/src/storm/StormApp.tsx:6937](../../../../../frontend/src/storm/StormApp.tsx#L6937)

```typescript
renderProfileCustomizing() => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

В теле вызывает `cardHeader`, `t`, `tile`.

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

<details>
<summary>Прямые вызовы в теле</summary>

- `cardHeader`
- `t`
- `tile`

</details>

## StormApp.renderProfileCustomizing.tile

[frontend/src/storm/StormApp.tsx:6939](../../../../../frontend/src/storm/StormApp.tsx#L6939)

```typescript
tile(key: string, active: boolean, onClick: () => void, icon: Parameters<typeof Icon>[0]["name"], title: string, desc: string) => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

Преобразование/вычисление в теле функции; тип результата и параметры приведены ниже, точное выражение доступно по ссылке на исходник.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `key` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `active` | `boolean` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `onClick` | `() => void` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `icon` | `Parameters<typeof Icon>[0]["name"]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `title` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `desc` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

## StormApp.renderProfileSecurity

[frontend/src/storm/StormApp.tsx:6991](../../../../../frontend/src/storm/StormApp.tsx#L6991)

```typescript
renderProfileSecurity() => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

В теле вызывает `cardHeader`, `state.twoFACode.trim`, `t`.

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

<details>
<summary>Прямые вызовы в теле</summary>

- `cardHeader`
- `state.twoFACode.trim`
- `t`

</details>

## StormApp.renderProfileApi

[frontend/src/storm/StormApp.tsx:7064](../../../../../frontend/src/storm/StormApp.tsx#L7064)

```typescript
renderProfileApi() => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

В теле вызывает `state.apiKeys.map`, `t`.

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

<details>
<summary>Прямые вызовы в теле</summary>

- `state.apiKeys.map`
- `t`

</details>

## StormApp.modalShell

[frontend/src/storm/StormApp.tsx:7095](../../../../../frontend/src/storm/StormApp.tsx#L7095)

```typescript
modalShell(open: boolean, onClose: () => void, zIndex: number, width: number, children: ReactNode, align: "center" | "flex-start" = "center", pad = "24px") => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

Преобразование/вычисление в теле функции; тип результата и параметры приведены ниже, точное выражение доступно по ссылке на исходник.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `open` | `boolean` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `onClose` | `() => void` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `zIndex` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `width` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `children` | `ReactNode` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `align` | `"center" \| "flex-start"` | `"center"` | Определяется именем/типом и контрактом вызывающего кода. |
| `pad` | `string` | `"24px"` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

## StormApp.modalFooter

[frontend/src/storm/StormApp.tsx:7103](../../../../../frontend/src/storm/StormApp.tsx#L7103)

```typescript
modalFooter(onCancel: () => void, onSave: () => void, saveLabel: string, saveBg = "var(--st-accent-2)", disabled = false) => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

В теле вызывает `t`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `onCancel` | `() => void` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `onSave` | `() => void` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `saveLabel` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `saveBg` | `string` | `"var(--st-accent-2)"` | Определяется именем/типом и контрактом вызывающего кода. |
| `disabled` | `boolean` | `false` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

<details>
<summary>Прямые вызовы в теле</summary>

- `t`

</details>

## StormApp.onClick

[frontend/src/storm/StormApp.tsx:7163](../../../../../frontend/src/storm/StormApp.tsx#L7163)

```typescript
onClick() => void
```

В теле вызывает `setState`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.onClick

[frontend/src/storm/StormApp.tsx:7164](../../../../../frontend/src/storm/StormApp.tsx#L7164)

```typescript
onClick() => void
```

В теле вызывает `setState`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.close

[frontend/src/storm/StormApp.tsx:7373](../../../../../frontend/src/storm/StormApp.tsx#L7373)

```typescript
close() => void
```

В теле вызывает `setState`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>
