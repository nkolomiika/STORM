# frontend/src/storm/StormApp.tsx

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **317**.

## getApiErrorMessage

[frontend/src/storm/StormApp.tsx:198](../../../../../frontend/src/storm/StormApp.tsx#L198)

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

[frontend/src/storm/StormApp.tsx:720](../../../../../frontend/src/storm/StormApp.tsx#L720)

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

[frontend/src/storm/StormApp.tsx:721](../../../../../frontend/src/storm/StormApp.tsx#L721)

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

[frontend/src/storm/StormApp.tsx:730](../../../../../frontend/src/storm/StormApp.tsx#L730)

```typescript
Collapse({ open, children }: { open: boolean; children: ReactNode }) => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

Преобразование/вычисление в теле функции; тип результата и параметры приведены ниже, точное выражение доступно по ссылке на исходник.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `{ open, children }` | `{ open: boolean; children: ReactNode }` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

## FilePreview

[frontend/src/storm/StormApp.tsx:743](../../../../../frontend/src/storm/StormApp.tsx#L743)

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

[frontend/src/storm/StormApp.tsx:816](../../../../../frontend/src/storm/StormApp.tsx#L816)

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

[frontend/src/storm/StormApp.tsx:853](../../../../../frontend/src/storm/StormApp.tsx#L853)

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

[frontend/src/storm/StormApp.tsx:855](../../../../../frontend/src/storm/StormApp.tsx#L855)

```typescript
fstr(v: string | string[] | undefined) => string
```

Coerce an editor-form value (string or tag-array) to a plain string.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `v` | `string \| string[] \| undefined` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `string`.

## toISODate

[frontend/src/storm/StormApp.tsx:858](../../../../../frontend/src/storm/StormApp.tsx#L858)

```typescript
toISODate(s?: string) => string
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

## toDispDate

[frontend/src/storm/StormApp.tsx:863](../../../../../frontend/src/storm/StormApp.tsx#L863)

```typescript
toDispDate(s?: string) => string
```

В теле вызывает `String`, `String(s).match`.

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

[frontend/src/storm/StormApp.tsx:870](../../../../../frontend/src/storm/StormApp.tsx#L870)

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

[frontend/src/storm/StormApp.tsx:874](../../../../../frontend/src/storm/StormApp.tsx#L874)

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

## relTime

[frontend/src/storm/StormApp.tsx:879](../../../../../frontend/src/storm/StormApp.tsx#L879)

```typescript
relTime(iso?: string | null) => string
```

Relative "time ago" from an ISO timestamp.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `iso` | `string \| null` | `undefined (optional)` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `string`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Date.now`
- `Math.floor`
- `Math.max`
- `new Date(iso).getTime`

</details>

## pathFor

[frontend/src/storm/StormApp.tsx:900](../../../../../frontend/src/storm/StormApp.tsx#L900)

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

[frontend/src/storm/StormApp.tsx:937](../../../../../frontend/src/storm/StormApp.tsx#L937)

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

[frontend/src/storm/StormApp.tsx:957](../../../../../frontend/src/storm/StormApp.tsx#L957)

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

[frontend/src/storm/StormApp.tsx:1005](../../../../../frontend/src/storm/StormApp.tsx#L1005)

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

[frontend/src/storm/StormApp.tsx:1020](../../../../../frontend/src/storm/StormApp.tsx#L1020)

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

## mdInline

[frontend/src/storm/StormApp.tsx:1029](../../../../../frontend/src/storm/StormApp.tsx#L1029)

```typescript
mdInline(text: string, kb: string) => ReactNode[]
```

Minimal Markdown → React renderer for the read-only note viewer.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `text` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `kb` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `ReactNode[]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `/\s+"((?:\\.|[^"\\])*)"\)$/.exec`
- `/\s+"((?:\\.|[^"\\])*)"\)$/.exec(m[0])?.[1]?.replace`
- `imageTitleSize`
- `markdownUrlTransform`
- `nodes.push`
- `re.exec`
- `rest.slice`

</details>

## renderMarkdown

[frontend/src/storm/StormApp.tsx:1068](../../../../../frontend/src/storm/StormApp.tsx#L1068)

```typescript
renderMarkdown(src: string) => ReactNode
```

В теле вызывает `(list = list || []).push`, `blocks.push`, `flush`, `ln.match`, `ln.trim`, `mdInline`, `src.replace`, `src.replace(/\r/g, "").split`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `src` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `ReactNode`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(list = list || []).push`
- `blocks.push`
- `flush`
- `ln.match`
- `ln.trim`
- `mdInline`
- `src.replace`
- `src.replace(/\r/g, "").split`

</details>

## renderMarkdown.flush

[frontend/src/storm/StormApp.tsx:1073](../../../../../frontend/src/storm/StormApp.tsx#L1073)

```typescript
flush() => void
```

В теле вызывает `blocks.push`, `items.map`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `blocks.push`
- `items.map`

</details>

## sparkline

[frontend/src/storm/StormApp.tsx:1121](../../../../../frontend/src/storm/StormApp.tsx#L1121)

```typescript
sparkline(seed: number, current: number) => string
```

Deterministic sparkline point string (ported from prototype).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `seed` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `current` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `string`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Math.max`
- `vals.map`
- `vals.map((val, i) => `${Math.round(i * stepX)},${Math.round(h - pad - (val / max) * (h - pad * 2))}`).join`
- `vals.push`

</details>

## cumulativeSpark

[frontend/src/storm/StormApp.tsx:1150](../../../../../frontend/src/storm/StormApp.tsx#L1150)

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

[frontend/src/storm/StormApp.tsx:1198](../../../../../frontend/src/storm/StormApp.tsx#L1198)

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

[frontend/src/storm/StormApp.tsx:1212](../../../../../frontend/src/storm/StormApp.tsx#L1212)

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

[frontend/src/storm/StormApp.tsx:1218](../../../../../frontend/src/storm/StormApp.tsx#L1218)

```typescript
isFarmJobInFlight(status: string) => boolean
```

A farm job still worth polling. `pending`/`queued` are the recon-worker's
pre-run states — a job sits there until the worker picks it off the queue.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `status` | `string` | `обязательный` | Статус операции/ресурса; допустимые значения задаёт Enum или схема. |

Возвращает: `boolean`.

## toStormPorts

[frontend/src/storm/StormApp.tsx:1223](../../../../../frontend/src/storm/StormApp.tsx#L1223)

```typescript
toStormPorts(h: ApiHost) => Host["ports"]
```

Ports live under each IP on the backend; Storm shows them flat per host.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `h` | `ApiHost` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Host["ports"]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `h.ip_addresses .flatMap`
- `h.ip_addresses .flatMap((ip) => ip.ports as ApiPortWithServices[]) .map`

</details>

## toStormHost

[frontend/src/storm/StormApp.tsx:1236](../../../../../frontend/src/storm/StormApp.tsx#L1236)

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

[frontend/src/storm/StormApp.tsx:1256](../../../../../frontend/src/storm/StormApp.tsx#L1256)

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
- `relTime`

</details>

## toStormNote

[frontend/src/storm/StormApp.tsx:1285](../../../../../frontend/src/storm/StormApp.tsx#L1285)

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

[frontend/src/storm/StormApp.tsx:1295](../../../../../frontend/src/storm/StormApp.tsx#L1295)

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

[frontend/src/storm/StormApp.tsx:1306](../../../../../frontend/src/storm/StormApp.tsx#L1306)

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

[frontend/src/storm/StormApp.tsx:1383](../../../../../frontend/src/storm/StormApp.tsx#L1383)

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

[frontend/src/storm/StormApp.tsx:1398](../../../../../frontend/src/storm/StormApp.tsx#L1398)

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

[frontend/src/storm/StormApp.tsx:1444](../../../../../frontend/src/storm/StormApp.tsx#L1444)

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

- `type.replace`

</details>

## groupActivity

[frontend/src/storm/StormApp.tsx:1452](../../../../../frontend/src/storm/StormApp.tsx#L1452)

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

[frontend/src/storm/StormApp.tsx:1455](../../../../../frontend/src/storm/StormApp.tsx#L1455)

```typescript
flush() => void
```

В теле вызывает `activitySubject`, `bucket.map`, `first.action.toLowerCase`, `first.action.toLowerCase().replace`, `groups.push`, `relTime`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `activitySubject`
- `bucket.map`
- `first.action.toLowerCase`
- `first.action.toLowerCase().replace`
- `groups.push`
- `relTime`

</details>

## elapsedPct

[frontend/src/storm/StormApp.tsx:1502](../../../../../frontend/src/storm/StormApp.tsx#L1502)

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

[frontend/src/storm/StormApp.tsx:1510](../../../../../frontend/src/storm/StormApp.tsx#L1510)

```typescript
StormApp() => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

В теле вызывает `(() => { const g = state.activityModalKey ? activityGroups.find((x) => x.key === state.activityModalKey) : undefined; const close = () => setState({ activityModalKey: null }); return modalShell( !!g, close, 60, 620, <> <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "var(--st-text)", letterSpacing: "-.4px" }}> {g ? `${g.actor} ${g.verb} ${g.subject}` : ""} </h2> {g && <div className="mono" style={{ marginTop: 6, fontSize: 11.5, color: "var(--st-text-faint)" }}>{g.time}</div>} <div style={{ marginTop: 16, background: "var(--st-code-bg)", borderRadius: 10, padding: "12px 13px", display: "flex", flexDirection: "column", gap: 6, maxHeight: 420, overflow: "auto" }}> {g?.lines.map((l) => activityLineRow(l, g.tone))} </div> <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}> <button className="clk" onClick={close} style={{ height: 40, padding: "0 20px", border: "1px solid var(--st-border)", borderRadius: 10, background: "var(--st-surface)", font: "700 13px Inter,sans-serif", color: "var(--st-text-2)", cursor: "pointer" }}>{t("Close")}</button> </div> </> ); })`, `(() => { const total = vulns.length; const pct = state.jiraBulkTotal > 0 ? Math.round((state.jiraBulkDone / state.jiraBulkTotal) * 100) : 0; return ( <> <h2 style={{ margin: 0, fontSize: 21, fontWeight: 800, color: "var(--st-text)", letterSpacing: "-.4px" }}>{t("Export all to Task Tracker")}</h2> <div style={{ marginTop: 16 }}> {state.jiraBulkFinished ? ( <div style={{ border: "1px solid var(--st-success-soft)", background: "var(--st-success-soft)", borderRadius: 12, padding: "14px 16px" }}> <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}><Icon name="check-circle" size={18} color="var(--st-success)" sw={2.2} /><span style={{ font: "700 13.5px Inter,sans-serif", color: "var(--st-text)" }}>{t("Export finished")}</span></div> <div style={{ font: "600 13px Inter,sans-serif", color: "var(--st-text-2)", lineHeight: 1.7 }}> {t("Created:")} <b>{state.jiraBulkCreated}</b><br /> {t("Already linked (skipped):")} <b>{state.jiraBulkSkipped}</b><br /> {t("Failed:")} <b style={{ color: state.jiraBulkFailed ? "var(--st-danger)" : "var(--st-text-2)" }}>{state.jiraBulkFailed}</b> </div> </div> ) : state.jiraBulkRunning ? ( <div> <div style={{ font: "600 13px Inter,sans-serif", color: "var(--st-text-2)", marginBottom: 10 }}>{t("Exporting")} {state.jiraBulkDone} / {state.jiraBulkTotal}…</div> <div style={{ height: 8, background: "var(--st-divider)", borderRadius: 6, overflow: "hidden" }}> <div style={{ width: `${pct}%`, height: "100%", background: "var(--st-accent)", transition: "width .2s" }} /> </div> </div> ) : ( <div style={{ font: "600 13px Inter,sans-serif", color: "var(--st-text-2)", lineHeight: 1.5 }}> {t("This will create a Task Tracker issue (in To Do) for each of the")} <b style={{ color: "var(--st-text)" }}>{total}</b> {t("listed")} {total === 1 ? "vulnerability" : "vulnerabilities"} {t("(page filters apply). Already-linked findings are skipped.")} </div> )} </div> <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 22 }}> {state.jiraBulkFinished ? ( <> {state.jiraBulkProjectUrl && ( <a className="clk" href={state.jiraBulkProjectUrl} target="_blank" rel="noreferrer" style={{ height: 42, padding: "0 20px", borderRadius: 11, background: "var(--st-accent-2)", color: "var(--st-on-accent)", font: "700 13.5px Inter,sans-serif", display: "inline-flex", alignItems: "center", textDecoration: "none" }}>{t("Open Task Tracker")}</a> )} <button className="clk" onClick={closeBulkJira} style={{ height: 42, padding: "0 20px", border: "1px solid var(--st-border)", borderRadius: 11, background: "var(--st-surface)", font: "700 13.5px Inter,sans-serif", color: "var(--st-text-2)" }}>{t("Done")}</button> </> ) : ( <> <button className="clk" onClick={closeBulkJira} disabled={state.jiraBulkRunning} style={{ height: 42, padding: "0 20px", border: "1px solid var(--st-border)", borderRadius: 11, background: "var(--st-surface)", font: "700 13.5px Inter,sans-serif", color: "var(--st-text-2)", cursor: state.jiraBulkRunning ? "default" : "pointer" }}>{t("Cancel")}</button> <button className="clk" onClick={doBulkJiraExport} disabled={state.jiraBulkRunning || total === 0} style={{ height: 42, padding: "0 22px", border: "none", borderRadius: 11, background: state.jiraBulkRunning || total === 0 ? "var(--st-accent-muted)" : "var(--st-accent-2)", color: "var(--st-on-accent)", font: "700 13.5px Inter,sans-serif", cursor: state.jiraBulkRunning || total === 0 ? "default" : "pointer" }}> {state.jiraBulkRunning ? t("Exporting…") : `${t("Export")} ${total}`} </button> </> )} </div> </> ); })`, `(() => { const v = state.jiraExportVulnId != null ? d.vulns.find((x) => x.id === state.jiraExportVulnId) : undefined; const link = state.jiraExportLink; const isLinked = !!(link && link.status === "linked" && link.jira_issue_key); const exportDisabled = state.jiraExportBusy || state.jiraExportChecking; return ( <> <h2 style={{ margin: 0, fontSize: 21, fontWeight: 800, color: "var(--st-text)", letterSpacing: "-.4px" }}>{t("Export to Task Tracker")}</h2> {v && ( <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16, padding: "12px 14px", border: "1px solid var(--st-divider)", borderRadius: 12 }}> <span style={{ font: "700 10px Inter,sans-serif", textTransform: "uppercase", letterSpacing: ".5px", borderRadius: 7, padding: "4px 9px", background: SEV[v.sev].bg, color: SEV[v.sev].color, flex: "none" }}>{v.sev}</span> <div style={{ minWidth: 0 }}> <div style={{ font: "600 14px Inter,sans-serif", color: "var(--st-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.title}</div> <div className="mono" style={{ fontSize: 12, color: "var(--st-text-3)", marginTop: 2 }}>{v.host}</div> </div> </div> )} {/* Статус-блок рендерим ТОЛЬКО когда есть что показать (проверка / уже экспортировано / ошибка). Иначе — без пустого зарезервированного пространства: карточка находки идёт сразу к кнопкам. */} {(state.jiraExportChecking || isLinked || state.jiraExportError) && ( <div style={{ marginTop: 16 }}> {state.jiraExportChecking ? ( <div style={{ font: "600 13px Inter,sans-serif", color: "var(--st-text-3)" }}>{t("Checking status…")}</div> ) : isLinked ? ( <div style={{ display: "flex", alignItems: "center", gap: 10, border: "1px solid var(--st-success-soft)", background: "var(--st-success-soft)", borderRadius: 12, padding: "13px 15px" }}> <Icon name="check-circle" size={18} color="var(--st-success)" sw={2.2} /> <div style={{ font: "600 13.5px Inter,sans-serif", color: "var(--st-text)" }}> {t("Already exported:")}{" "} <a href={link!.jira_issue_url} target="_blank" rel="noreferrer" style={{ color: "var(--st-accent)", fontWeight: 700 }}>{link!.jira_issue_key}</a> </div> </div> ) : ( <div style={{ color: "var(--st-danger)", font: "600 12.5px Inter,sans-serif" }}>{state.jiraExportError}</div> )} </div> )} <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 22 }}> {isLinked ? ( <> <a className="clk" href={link!.jira_issue_url} target="_blank" rel="noreferrer" style={{ height: 42, padding: "0 20px", borderRadius: 11, background: "var(--st-accent-2)", color: "var(--st-on-accent)", font: "700 13.5px Inter,sans-serif", display: "inline-flex", alignItems: "center", textDecoration: "none" }}>{t("Open in Task Tracker")}</a> <button className="clk" onClick={closeJiraExport} style={{ height: 42, padding: "0 20px", border: "1px solid var(--st-border)", borderRadius: 11, background: "var(--st-surface)", font: "700 13.5px Inter,sans-serif", color: "var(--st-text-2)" }}>{t("Done")}</button> </> ) : ( <> <button className="clk" onClick={closeJiraExport} style={{ height: 42, padding: "0 20px", border: "1px solid var(--st-border)", borderRadius: 11, background: "var(--st-surface)", font: "700 13.5px Inter,sans-serif", color: "var(--st-text-2)" }}>{t("Cancel")}</button> <button className="clk" onClick={doJiraExport} disabled={exportDisabled} style={{ height: 42, padding: "0 22px", border: "none", borderRadius: 11, background: exportDisabled ? "var(--st-accent-muted)" : "var(--st-accent-2)", color: "var(--st-on-accent)", font: "700 13.5px Inter,sans-serif", cursor: exportDisabled ? "default" : "pointer" }}> {state.jiraExportBusy ? t("Exporting…") : t("Export")} </button> </> )} </div> </> ); })`, `([ { id: "projects" as const, icon: "folder" as const, label: "Projects", onClick: selProjects }, { id: "tasks" as const, icon: "check-square" as const, label: "Tasks", onClick: () => setState({ nav: "tasks", view: "list", tasksOpenKey: null }) }, { id: "docs" as const, icon: "doc" as const, label: "Docs", onClick: () => setState({ nav: "docs", view: "list" }) }, ...(isAdmin ? [{ id: "members" as const, icon: "users" as const, label: "Members", onClick: selWSMembers }] : []), ]).map`, `(["critical", "high", "medium", "low", "info", "unrealized"] as Severity[]).map`, `(state.apiJsFiles ?? []).map`, `(state.apiMembers ?? []).some`, `(state.apiProjects ?? []).map`; полный список ниже.

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(() => { const g = state.activityModalKey ? activityGroups.find((x) => x.key === state.activityModalKey) : undefined; const close = () => setState({ activityModalKey: null }); return modalShell( !!g, close, 60, 620, <> <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "var(--st-text)", letterSpacing: "-.4px" }}> {g ? `${g.actor} ${g.verb} ${g.subject}` : ""} </h2> {g && <div className="mono" style={{ marginTop: 6, fontSize: 11.5, color: "var(--st-text-faint)" }}>{g.time}</div>} <div style={{ marginTop: 16, background: "var(--st-code-bg)", borderRadius: 10, padding: "12px 13px", display: "flex", flexDirection: "column", gap: 6, maxHeight: 420, overflow: "auto" }}> {g?.lines.map((l) => activityLineRow(l, g.tone))} </div> <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}> <button className="clk" onClick={close} style={{ height: 40, padding: "0 20px", border: "1px solid var(--st-border)", borderRadius: 10, background: "var(--st-surface)", font: "700 13px Inter,sans-serif", color: "var(--st-text-2)", cursor: "pointer" }}>{t("Close")}</button> </div> </> ); })`
- `(() => { const total = vulns.length; const pct = state.jiraBulkTotal > 0 ? Math.round((state.jiraBulkDone / state.jiraBulkTotal) * 100) : 0; return ( <> <h2 style={{ margin: 0, fontSize: 21, fontWeight: 800, color: "var(--st-text)", letterSpacing: "-.4px" }}>{t("Export all to Task Tracker")}</h2> <div style={{ marginTop: 16 }}> {state.jiraBulkFinished ? ( <div style={{ border: "1px solid var(--st-success-soft)", background: "var(--st-success-soft)", borderRadius: 12, padding: "14px 16px" }}> <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}><Icon name="check-circle" size={18} color="var(--st-success)" sw={2.2} /><span style={{ font: "700 13.5px Inter,sans-serif", color: "var(--st-text)" }}>{t("Export finished")}</span></div> <div style={{ font: "600 13px Inter,sans-serif", color: "var(--st-text-2)", lineHeight: 1.7 }}> {t("Created:")} <b>{state.jiraBulkCreated}</b><br /> {t("Already linked (skipped):")} <b>{state.jiraBulkSkipped}</b><br /> {t("Failed:")} <b style={{ color: state.jiraBulkFailed ? "var(--st-danger)" : "var(--st-text-2)" }}>{state.jiraBulkFailed}</b> </div> </div> ) : state.jiraBulkRunning ? ( <div> <div style={{ font: "600 13px Inter,sans-serif", color: "var(--st-text-2)", marginBottom: 10 }}>{t("Exporting")} {state.jiraBulkDone} / {state.jiraBulkTotal}…</div> <div style={{ height: 8, background: "var(--st-divider)", borderRadius: 6, overflow: "hidden" }}> <div style={{ width: `${pct}%`, height: "100%", background: "var(--st-accent)", transition: "width .2s" }} /> </div> </div> ) : ( <div style={{ font: "600 13px Inter,sans-serif", color: "var(--st-text-2)", lineHeight: 1.5 }}> {t("This will create a Task Tracker issue (in To Do) for each of the")} <b style={{ color: "var(--st-text)" }}>{total}</b> {t("listed")} {total === 1 ? "vulnerability" : "vulnerabilities"} {t("(page filters apply). Already-linked findings are skipped.")} </div> )} </div> <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 22 }}> {state.jiraBulkFinished ? ( <> {state.jiraBulkProjectUrl && ( <a className="clk" href={state.jiraBulkProjectUrl} target="_blank" rel="noreferrer" style={{ height: 42, padding: "0 20px", borderRadius: 11, background: "var(--st-accent-2)", color: "var(--st-on-accent)", font: "700 13.5px Inter,sans-serif", display: "inline-flex", alignItems: "center", textDecoration: "none" }}>{t("Open Task Tracker")}</a> )} <button className="clk" onClick={closeBulkJira} style={{ height: 42, padding: "0 20px", border: "1px solid var(--st-border)", borderRadius: 11, background: "var(--st-surface)", font: "700 13.5px Inter,sans-serif", color: "var(--st-text-2)" }}>{t("Done")}</button> </> ) : ( <> <button className="clk" onClick={closeBulkJira} disabled={state.jiraBulkRunning} style={{ height: 42, padding: "0 20px", border: "1px solid var(--st-border)", borderRadius: 11, background: "var(--st-surface)", font: "700 13.5px Inter,sans-serif", color: "var(--st-text-2)", cursor: state.jiraBulkRunning ? "default" : "pointer" }}>{t("Cancel")}</button> <button className="clk" onClick={doBulkJiraExport} disabled={state.jiraBulkRunning || total === 0} style={{ height: 42, padding: "0 22px", border: "none", borderRadius: 11, background: state.jiraBulkRunning || total === 0 ? "var(--st-accent-muted)" : "var(--st-accent-2)", color: "var(--st-on-accent)", font: "700 13.5px Inter,sans-serif", cursor: state.jiraBulkRunning || total === 0 ? "default" : "pointer" }}> {state.jiraBulkRunning ? t("Exporting…") : `${t("Export")} ${total}`} </button> </> )} </div> </> ); })`
- `(() => { const v = state.jiraExportVulnId != null ? d.vulns.find((x) => x.id === state.jiraExportVulnId) : undefined; const link = state.jiraExportLink; const isLinked = !!(link && link.status === "linked" && link.jira_issue_key); const exportDisabled = state.jiraExportBusy || state.jiraExportChecking; return ( <> <h2 style={{ margin: 0, fontSize: 21, fontWeight: 800, color: "var(--st-text)", letterSpacing: "-.4px" }}>{t("Export to Task Tracker")}</h2> {v && ( <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16, padding: "12px 14px", border: "1px solid var(--st-divider)", borderRadius: 12 }}> <span style={{ font: "700 10px Inter,sans-serif", textTransform: "uppercase", letterSpacing: ".5px", borderRadius: 7, padding: "4px 9px", background: SEV[v.sev].bg, color: SEV[v.sev].color, flex: "none" }}>{v.sev}</span> <div style={{ minWidth: 0 }}> <div style={{ font: "600 14px Inter,sans-serif", color: "var(--st-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.title}</div> <div className="mono" style={{ fontSize: 12, color: "var(--st-text-3)", marginTop: 2 }}>{v.host}</div> </div> </div> )} {/* Статус-блок рендерим ТОЛЬКО когда есть что показать (проверка / уже экспортировано / ошибка). Иначе — без пустого зарезервированного пространства: карточка находки идёт сразу к кнопкам. */} {(state.jiraExportChecking || isLinked || state.jiraExportError) && ( <div style={{ marginTop: 16 }}> {state.jiraExportChecking ? ( <div style={{ font: "600 13px Inter,sans-serif", color: "var(--st-text-3)" }}>{t("Checking status…")}</div> ) : isLinked ? ( <div style={{ display: "flex", alignItems: "center", gap: 10, border: "1px solid var(--st-success-soft)", background: "var(--st-success-soft)", borderRadius: 12, padding: "13px 15px" }}> <Icon name="check-circle" size={18} color="var(--st-success)" sw={2.2} /> <div style={{ font: "600 13.5px Inter,sans-serif", color: "var(--st-text)" }}> {t("Already exported:")}{" "} <a href={link!.jira_issue_url} target="_blank" rel="noreferrer" style={{ color: "var(--st-accent)", fontWeight: 700 }}>{link!.jira_issue_key}</a> </div> </div> ) : ( <div style={{ color: "var(--st-danger)", font: "600 12.5px Inter,sans-serif" }}>{state.jiraExportError}</div> )} </div> )} <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 22 }}> {isLinked ? ( <> <a className="clk" href={link!.jira_issue_url} target="_blank" rel="noreferrer" style={{ height: 42, padding: "0 20px", borderRadius: 11, background: "var(--st-accent-2)", color: "var(--st-on-accent)", font: "700 13.5px Inter,sans-serif", display: "inline-flex", alignItems: "center", textDecoration: "none" }}>{t("Open in Task Tracker")}</a> <button className="clk" onClick={closeJiraExport} style={{ height: 42, padding: "0 20px", border: "1px solid var(--st-border)", borderRadius: 11, background: "var(--st-surface)", font: "700 13.5px Inter,sans-serif", color: "var(--st-text-2)" }}>{t("Done")}</button> </> ) : ( <> <button className="clk" onClick={closeJiraExport} style={{ height: 42, padding: "0 20px", border: "1px solid var(--st-border)", borderRadius: 11, background: "var(--st-surface)", font: "700 13.5px Inter,sans-serif", color: "var(--st-text-2)" }}>{t("Cancel")}</button> <button className="clk" onClick={doJiraExport} disabled={exportDisabled} style={{ height: 42, padding: "0 22px", border: "none", borderRadius: 11, background: exportDisabled ? "var(--st-accent-muted)" : "var(--st-accent-2)", color: "var(--st-on-accent)", font: "700 13.5px Inter,sans-serif", cursor: exportDisabled ? "default" : "pointer" }}> {state.jiraExportBusy ? t("Exporting…") : t("Export")} </button> </> )} </div> </> ); })`
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
- `t`
- `toDispDate`
- `useAuthStore`
- `useEffect`
- `useLangStore`
- `useLocation`
- `useMemo`
- `useNavigate`
- `useRef`
- `useState`
- `useThemeStore`
- `useToastStore`
- `vdCvss.score.toFixed`
- `vfPill`

</details>

## StormApp.setState

[frontend/src/storm/StormApp.tsx:1518](../../../../../frontend/src/storm/StormApp.tsx#L1518)

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

[frontend/src/storm/StormApp.tsx:1520](../../../../../frontend/src/storm/StormApp.tsx#L1520)

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

[frontend/src/storm/StormApp.tsx:1556](../../../../../frontend/src/storm/StormApp.tsx#L1556)

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

[frontend/src/storm/StormApp.tsx:1564](../../../../../frontend/src/storm/StormApp.tsx#L1564)

```typescript
onAvatarPick(e: ChangeEvent<HTMLInputElement>) => void
```

В теле вызывает `AVATAR_TYPES.includes`, `pushToast`, `setAvatarFile`, `setAvatarPreview`.

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

</details>

## StormApp.submitAvatar

[frontend/src/storm/StormApp.tsx:1583](../../../../../frontend/src/storm/StormApp.tsx#L1583)

```typescript
async submitAvatar() => Promise<void>
```

В теле вызывает `apiUploadMyAvatar`, `clearAvatarPick`, `getApiErrorMessage`, `pushToast`, `setAvatarUploading`, `setUser`.

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `apiUploadMyAvatar`
- `clearAvatarPick`
- `getApiErrorMessage`
- `pushToast`
- `setAvatarUploading`
- `setUser`

</details>

## StormApp.meAvatar

[frontend/src/storm/StormApp.tsx:1599](../../../../../frontend/src/storm/StormApp.tsx#L1599)

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

[frontend/src/storm/StormApp.tsx:1626](../../../../../frontend/src/storm/StormApp.tsx#L1626)

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

[frontend/src/storm/StormApp.tsx:1635](../../../../../frontend/src/storm/StormApp.tsx#L1635)

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

[frontend/src/storm/StormApp.tsx:1735](../../../../../frontend/src/storm/StormApp.tsx#L1735)

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

[frontend/src/storm/StormApp.tsx:1775](../../../../../frontend/src/storm/StormApp.tsx#L1775)

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

[frontend/src/storm/StormApp.tsx:1817](../../../../../frontend/src/storm/StormApp.tsx#L1817)

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

[frontend/src/storm/StormApp.tsx:1819](../../../../../frontend/src/storm/StormApp.tsx#L1819)

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

[frontend/src/storm/StormApp.tsx:1867](../../../../../frontend/src/storm/StormApp.tsx#L1867)

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

[frontend/src/storm/StormApp.tsx:1875](../../../../../frontend/src/storm/StormApp.tsx#L1875)

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

## StormApp.subdomainsOf

[frontend/src/storm/StormApp.tsx:1991](../../../../../frontend/src/storm/StormApp.tsx#L1991)

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

[frontend/src/storm/StormApp.tsx:1995](../../../../../frontend/src/storm/StormApp.tsx#L1995)

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

[frontend/src/storm/StormApp.tsx:2025](../../../../../frontend/src/storm/StormApp.tsx#L2025)

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

[frontend/src/storm/StormApp.tsx:2062](../../../../../frontend/src/storm/StormApp.tsx#L2062)

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

[frontend/src/storm/StormApp.tsx:2088](../../../../../frontend/src/storm/StormApp.tsx#L2088)

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

[frontend/src/storm/StormApp.tsx:2170](../../../../../frontend/src/storm/StormApp.tsx#L2170)

```typescript
canEditProjectRow(row: ApiProjectRow) => boolean
```

Преобразование/вычисление в теле функции; тип результата и параметры приведены ниже, точное выражение доступно по ссылке на исходник.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `row` | `ApiProjectRow` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `boolean`.

## StormApp.selProjects

[frontend/src/storm/StormApp.tsx:2176](../../../../../frontend/src/storm/StormApp.tsx#L2176)

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

[frontend/src/storm/StormApp.tsx:2188](../../../../../frontend/src/storm/StormApp.tsx#L2188)

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

[frontend/src/storm/StormApp.tsx:2190](../../../../../frontend/src/storm/StormApp.tsx#L2190)

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

[frontend/src/storm/StormApp.tsx:2191](../../../../../frontend/src/storm/StormApp.tsx#L2191)

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

[frontend/src/storm/StormApp.tsx:2194](../../../../../frontend/src/storm/StormApp.tsx#L2194)

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

[frontend/src/storm/StormApp.tsx:2195](../../../../../frontend/src/storm/StormApp.tsx#L2195)

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

[frontend/src/storm/StormApp.tsx:2216](../../../../../frontend/src/storm/StormApp.tsx#L2216)

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

[frontend/src/storm/StormApp.tsx:2218](../../../../../frontend/src/storm/StormApp.tsx#L2218)

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

[frontend/src/storm/StormApp.tsx:2279](../../../../../frontend/src/storm/StormApp.tsx#L2279)

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

[frontend/src/storm/StormApp.tsx:2372](../../../../../frontend/src/storm/StormApp.tsx#L2372)

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

[frontend/src/storm/StormApp.tsx:2393](../../../../../frontend/src/storm/StormApp.tsx#L2393)

```typescript
datesInvalid(startISO: string, endISO: string) => boolean
```

The backend rejects this too (422) — checked here so the form says so before submitting.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `startISO` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `endISO` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `boolean`.

## StormApp.createProject

[frontend/src/storm/StormApp.tsx:2396](../../../../../frontend/src/storm/StormApp.tsx#L2396)

```typescript
async createProject() => Promise<void>
```

В теле вызывает `apiCreateProject`, `datesInvalid`, `getApiErrorMessage`, `pushToast`, `reloadProjects`, `setState`, `state.newDesc.trim`, `state.newName.trim`; полный список ниже.

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `apiCreateProject`
- `datesInvalid`
- `getApiErrorMessage`
- `pushToast`
- `reloadProjects`
- `setState`
- `state.newDesc.trim`
- `state.newName.trim`
- `t`

</details>

## StormApp.loadProjAppsec

[frontend/src/storm/StormApp.tsx:2433](../../../../../frontend/src/storm/StormApp.tsx#L2433)

```typescript
loadProjAppsec(id: number | null) => void
```

В теле вызывает `apiGetProject`, `apiGetProject(id) .then`, `apiGetProject(id) .then((p) => setState({ projEditAppsec: { appsec_component_code: p.appsec_component_code, appsec_component_name: p.appsec_component_name, appsec_version_code: p.appsec_version_code, appsec_version_name: p.appsec_version_name, appsec_assignee: p.appsec_assignee, appsec_ticket_url: p.appsec_ticket_url, appsec_ticket_key: p.appsec_ticket_key, }, }) ) .catch`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `id` | `number \| null` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `apiGetProject`
- `apiGetProject(id) .then`
- `apiGetProject(id) .then((p) => setState({ projEditAppsec: { appsec_component_code: p.appsec_component_code, appsec_component_name: p.appsec_component_name, appsec_version_code: p.appsec_version_code, appsec_version_name: p.appsec_version_name, appsec_assignee: p.appsec_assignee, appsec_ticket_url: p.appsec_ticket_url, appsec_ticket_key: p.appsec_ticket_key, }, }) ) .catch`

</details>

## StormApp.openProjEditRow

[frontend/src/storm/StormApp.tsx:2452](../../../../../frontend/src/storm/StormApp.tsx#L2452)

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

[frontend/src/storm/StormApp.tsx:2466](../../../../../frontend/src/storm/StormApp.tsx#L2466)

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

[frontend/src/storm/StormApp.tsx:2479](../../../../../frontend/src/storm/StormApp.tsx#L2479)

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

[frontend/src/storm/StormApp.tsx:2480](../../../../../frontend/src/storm/StormApp.tsx#L2480)

```typescript
async saveProjEdit() => Promise<void>
```

В теле вызывает `apiUpdateProject`, `datesInvalid`, `getApiErrorMessage`, `pushToast`, `reloadProjects`, `setState`, `state.projEditDesc.trim`, `state.projEditName.trim`.

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `apiUpdateProject`
- `datesInvalid`
- `getApiErrorMessage`
- `pushToast`
- `reloadProjects`
- `setState`
- `state.projEditDesc.trim`
- `state.projEditName.trim`

</details>

## StormApp.askDeleteProject

[frontend/src/storm/StormApp.tsx:2505](../../../../../frontend/src/storm/StormApp.tsx#L2505)

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

[frontend/src/storm/StormApp.tsx:2511](../../../../../frontend/src/storm/StormApp.tsx#L2511)

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

[frontend/src/storm/StormApp.tsx:2512](../../../../../frontend/src/storm/StormApp.tsx#L2512)

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

[frontend/src/storm/StormApp.tsx:2518](../../../../../frontend/src/storm/StormApp.tsx#L2518)

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

[frontend/src/storm/StormApp.tsx:2529](../../../../../frontend/src/storm/StormApp.tsx#L2529)

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

[frontend/src/storm/StormApp.tsx:2532](../../../../../frontend/src/storm/StormApp.tsx#L2532)

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

[frontend/src/storm/StormApp.tsx:2538](../../../../../frontend/src/storm/StormApp.tsx#L2538)

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

[frontend/src/storm/StormApp.tsx:2572](../../../../../frontend/src/storm/StormApp.tsx#L2572)

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

[frontend/src/storm/StormApp.tsx:2587](../../../../../frontend/src/storm/StormApp.tsx#L2587)

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

[frontend/src/storm/StormApp.tsx:2617](../../../../../frontend/src/storm/StormApp.tsx#L2617)

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

[frontend/src/storm/StormApp.tsx:2634](../../../../../frontend/src/storm/StormApp.tsx#L2634)

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

[frontend/src/storm/StormApp.tsx:2636](../../../../../frontend/src/storm/StormApp.tsx#L2636)

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

[frontend/src/storm/StormApp.tsx:2637](../../../../../frontend/src/storm/StormApp.tsx#L2637)

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

## StormApp.exportToWorks

[frontend/src/storm/StormApp.tsx:2662](../../../../../frontend/src/storm/StormApp.tsx#L2662)

```typescript
async exportToWorks() => Promise<void>
```

В теле вызывает `apiExportVulnToWorks`, `getApiErrorMessage`, `pushToast`, `setState`, `t`.

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `apiExportVulnToWorks`
- `getApiErrorMessage`
- `pushToast`
- `setState`
- `t`

</details>

## StormApp.openJiraExport

[frontend/src/storm/StormApp.tsx:2677](../../../../../frontend/src/storm/StormApp.tsx#L2677)

```typescript
openJiraExport(vulnId: number) => void
```

В теле вызывает `apiGetVulnerabilityJiraLink`, `apiGetVulnerabilityJiraLink(pid, vulnId) .catch`, `apiGetVulnerabilityJiraLink(pid, vulnId) .catch(() => null) .then`, `setState`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `vulnId` | `number` | `обязательный` | ID уязвимости в API. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `apiGetVulnerabilityJiraLink`
- `apiGetVulnerabilityJiraLink(pid, vulnId) .catch`
- `apiGetVulnerabilityJiraLink(pid, vulnId) .catch(() => null) .then`
- `setState`

</details>

## StormApp.closeJiraExport

[frontend/src/storm/StormApp.tsx:2693](../../../../../frontend/src/storm/StormApp.tsx#L2693)

```typescript
closeJiraExport() => void
```

В теле вызывает `setState`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.doJiraExport

[frontend/src/storm/StormApp.tsx:2694](../../../../../frontend/src/storm/StormApp.tsx#L2694)

```typescript
async doJiraExport() => Promise<void>
```

В теле вызывает `apiExportVulnerabilityToJira`, `getApiErrorMessage`, `pushToast`, `setState`.

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `apiExportVulnerabilityToJira`
- `getApiErrorMessage`
- `pushToast`
- `setState`

</details>

## StormApp.openBulkJira

[frontend/src/storm/StormApp.tsx:2711](../../../../../frontend/src/storm/StormApp.tsx#L2711)

```typescript
openBulkJira() => void
```

В теле вызывает `setState`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.closeBulkJira

[frontend/src/storm/StormApp.tsx:2726](../../../../../frontend/src/storm/StormApp.tsx#L2726)

```typescript
closeBulkJira() => void
```

В теле вызывает `setState`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.doBulkJiraExport

[frontend/src/storm/StormApp.tsx:2729](../../../../../frontend/src/storm/StormApp.tsx#L2729)

```typescript
async doBulkJiraExport() => Promise<void>
```

В теле вызывает `apiExportVulnerabilityToJira`, `apiGetVulnerabilityJiraLink`, `apiGetVulnerabilityJiraLink(pid, id).catch`, `pushToast`, `reloadVulns`, `rememberProjectUrl`, `setState`, `vulns.map`.

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `apiExportVulnerabilityToJira`
- `apiGetVulnerabilityJiraLink`
- `apiGetVulnerabilityJiraLink(pid, id).catch`
- `pushToast`
- `reloadVulns`
- `rememberProjectUrl`
- `setState`
- `vulns.map`

</details>

## StormApp.doBulkJiraExport.rememberProjectUrl

[frontend/src/storm/StormApp.tsx:2739](../../../../../frontend/src/storm/StormApp.tsx#L2739)

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

[frontend/src/storm/StormApp.tsx:2767](../../../../../frontend/src/storm/StormApp.tsx#L2767)

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

[frontend/src/storm/StormApp.tsx:2769](../../../../../frontend/src/storm/StormApp.tsx#L2769)

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

[frontend/src/storm/StormApp.tsx:2770](../../../../../frontend/src/storm/StormApp.tsx#L2770)

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

[frontend/src/storm/StormApp.tsx:2771](../../../../../frontend/src/storm/StormApp.tsx#L2771)

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

[frontend/src/storm/StormApp.tsx:2772](../../../../../frontend/src/storm/StormApp.tsx#L2772)

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

[frontend/src/storm/StormApp.tsx:2773](../../../../../frontend/src/storm/StormApp.tsx#L2773)

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

[frontend/src/storm/StormApp.tsx:2775](../../../../../frontend/src/storm/StormApp.tsx#L2775)

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

[frontend/src/storm/StormApp.tsx:2780](../../../../../frontend/src/storm/StormApp.tsx#L2780)

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

[frontend/src/storm/StormApp.tsx:2785](../../../../../frontend/src/storm/StormApp.tsx#L2785)

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

[frontend/src/storm/StormApp.tsx:2802](../../../../../frontend/src/storm/StormApp.tsx#L2802)

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

[frontend/src/storm/StormApp.tsx:2821](../../../../../frontend/src/storm/StormApp.tsx#L2821)

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

[frontend/src/storm/StormApp.tsx:2843](../../../../../frontend/src/storm/StormApp.tsx#L2843)

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

[frontend/src/storm/StormApp.tsx:2852](../../../../../frontend/src/storm/StormApp.tsx#L2852)

```typescript
openEndpoint(ep: { method: Method; path: string; host: string; hostId: number; endpointId: number }) => void
```

В теле вызывает `(async () => { try { const list = await apiGetEndpoints(pid, ep.hostId); const stored = list.find((entry) => entry.id === ep.endpointId); const request = stored ? formatEndpointRequest(stored, ep.host) : raw; if (version === endpointRequestVersion.current) setState({ epRequest: request, epRequestOriginal: request }); } catch (error) { if (version === endpointRequestVersion.current) pushToast(getApiErrorMessage(error, t("Couldn't load endpoint request")), "error"); } finally { if (version === endpointRequestVersion.current) setState({ epLoading: false }); } })`, `setState`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `ep` | `{ method: Method; path: string; host: string; hostId: number; endpointId: number }` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(async () => { try { const list = await apiGetEndpoints(pid, ep.hostId); const stored = list.find((entry) => entry.id === ep.endpointId); const request = stored ? formatEndpointRequest(stored, ep.host) : raw; if (version === endpointRequestVersion.current) setState({ epRequest: request, epRequestOriginal: request }); } catch (error) { if (version === endpointRequestVersion.current) pushToast(getApiErrorMessage(error, t("Couldn't load endpoint request")), "error"); } finally { if (version === endpointRequestVersion.current) setState({ epLoading: false }); } })`
- `setState`

</details>

## StormApp.closeEndpoint

[frontend/src/storm/StormApp.tsx:2871](../../../../../frontend/src/storm/StormApp.tsx#L2871)

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

[frontend/src/storm/StormApp.tsx:2872](../../../../../frontend/src/storm/StormApp.tsx#L2872)

```typescript
async saveEndpointRequest() => Promise<void>
```

В теле вызывает `apiUpdateEndpoint`, `formatEndpointRequest`, `getApiErrorMessage`, `pushToast`, `reloadHosts`, `setState`, `state.epRequest.trim`, `t`; полный список ниже.

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

[frontend/src/storm/StormApp.tsx:2891](../../../../../frontend/src/storm/StormApp.tsx#L2891)

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

[frontend/src/storm/StormApp.tsx:2898](../../../../../frontend/src/storm/StormApp.tsx#L2898)

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

[frontend/src/storm/StormApp.tsx:2904](../../../../../frontend/src/storm/StormApp.tsx#L2904)

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

[frontend/src/storm/StormApp.tsx:2914](../../../../../frontend/src/storm/StormApp.tsx#L2914)

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

[frontend/src/storm/StormApp.tsx:2918](../../../../../frontend/src/storm/StormApp.tsx#L2918)

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

[frontend/src/storm/StormApp.tsx:2926](../../../../../frontend/src/storm/StormApp.tsx#L2926)

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

[frontend/src/storm/StormApp.tsx:2939](../../../../../frontend/src/storm/StormApp.tsx#L2939)

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

[frontend/src/storm/StormApp.tsx:2940](../../../../../frontend/src/storm/StormApp.tsx#L2940)

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

[frontend/src/storm/StormApp.tsx:2941](../../../../../frontend/src/storm/StormApp.tsx#L2941)

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

[frontend/src/storm/StormApp.tsx:2950](../../../../../frontend/src/storm/StormApp.tsx#L2950)

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

[frontend/src/storm/StormApp.tsx:2956](../../../../../frontend/src/storm/StormApp.tsx#L2956)

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

[frontend/src/storm/StormApp.tsx:2986](../../../../../frontend/src/storm/StormApp.tsx#L2986)

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

[frontend/src/storm/StormApp.tsx:2994](../../../../../frontend/src/storm/StormApp.tsx#L2994)

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

[frontend/src/storm/StormApp.tsx:3010](../../../../../frontend/src/storm/StormApp.tsx#L3010)

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

[frontend/src/storm/StormApp.tsx:3029](../../../../../frontend/src/storm/StormApp.tsx#L3029)

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

[frontend/src/storm/StormApp.tsx:3034](../../../../../frontend/src/storm/StormApp.tsx#L3034)

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

[frontend/src/storm/StormApp.tsx:3046](../../../../../frontend/src/storm/StormApp.tsx#L3046)

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

[frontend/src/storm/StormApp.tsx:3047](../../../../../frontend/src/storm/StormApp.tsx#L3047)

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

[frontend/src/storm/StormApp.tsx:3048](../../../../../frontend/src/storm/StormApp.tsx#L3048)

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

[frontend/src/storm/StormApp.tsx:3049](../../../../../frontend/src/storm/StormApp.tsx#L3049)

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

[frontend/src/storm/StormApp.tsx:3050](../../../../../frontend/src/storm/StormApp.tsx#L3050)

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

[frontend/src/storm/StormApp.tsx:3079](../../../../../frontend/src/storm/StormApp.tsx#L3079)

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

[frontend/src/storm/StormApp.tsx:3114](../../../../../frontend/src/storm/StormApp.tsx#L3114)

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

[frontend/src/storm/StormApp.tsx:3140](../../../../../frontend/src/storm/StormApp.tsx#L3140)

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

[frontend/src/storm/StormApp.tsx:3154](../../../../../frontend/src/storm/StormApp.tsx#L3154)

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

[frontend/src/storm/StormApp.tsx:3155](../../../../../frontend/src/storm/StormApp.tsx#L3155)

```typescript
closeEpImport() => void
```

В теле вызывает `setState`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.submitEpImport

[frontend/src/storm/StormApp.tsx:3156](../../../../../frontend/src/storm/StormApp.tsx#L3156)

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

[frontend/src/storm/StormApp.tsx:3200](../../../../../frontend/src/storm/StormApp.tsx#L3200)

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

[frontend/src/storm/StormApp.tsx:3230](../../../../../frontend/src/storm/StormApp.tsx#L3230)

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

[frontend/src/storm/StormApp.tsx:3235](../../../../../frontend/src/storm/StormApp.tsx#L3235)

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

</details>

## StormApp.relinkVulnHost

[frontend/src/storm/StormApp.tsx:3273](../../../../../frontend/src/storm/StormApp.tsx#L3273)

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

[frontend/src/storm/StormApp.tsx:3283](../../../../../frontend/src/storm/StormApp.tsx#L3283)

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

[frontend/src/storm/StormApp.tsx:3304](../../../../../frontend/src/storm/StormApp.tsx#L3304)

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

[frontend/src/storm/StormApp.tsx:3327](../../../../../frontend/src/storm/StormApp.tsx#L3327)

```typescript
async saveIpEditor() => Promise<void>
```

В теле вызывает `apiGetHost`, `apiUpdateHost`, `current.ip_addresses.map`, `current.ip_addresses.some`, `fstr`, `fstr(f.ip).trim`, `getApiErrorMessage`, `hosts.find`; полный список ниже.

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

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

</details>

## StormApp.saveEndpointEditor

[frontend/src/storm/StormApp.tsx:3362](../../../../../frontend/src/storm/StormApp.tsx#L3362)

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

[frontend/src/storm/StormApp.tsx:3384](../../../../../frontend/src/storm/StormApp.tsx#L3384)

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

</details>

## StormApp.saveEditor

[frontend/src/storm/StormApp.tsx:3427](../../../../../frontend/src/storm/StormApp.tsx#L3427)

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

[frontend/src/storm/StormApp.tsx:3438](../../../../../frontend/src/storm/StormApp.tsx#L3438)

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

[frontend/src/storm/StormApp.tsx:3440](../../../../../frontend/src/storm/StormApp.tsx#L3440)

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

[frontend/src/storm/StormApp.tsx:3445](../../../../../frontend/src/storm/StormApp.tsx#L3445)

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

[frontend/src/storm/StormApp.tsx:3482](../../../../../frontend/src/storm/StormApp.tsx#L3482)

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

[frontend/src/storm/StormApp.tsx:3486](../../../../../frontend/src/storm/StormApp.tsx#L3486)

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

[frontend/src/storm/StormApp.tsx:3487](../../../../../frontend/src/storm/StormApp.tsx#L3487)

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

[frontend/src/storm/StormApp.tsx:3488](../../../../../frontend/src/storm/StormApp.tsx#L3488)

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

[frontend/src/storm/StormApp.tsx:3489](../../../../../frontend/src/storm/StormApp.tsx#L3489)

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

[frontend/src/storm/StormApp.tsx:3490](../../../../../frontend/src/storm/StormApp.tsx#L3490)

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

[frontend/src/storm/StormApp.tsx:3493](../../../../../frontend/src/storm/StormApp.tsx#L3493)

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

[frontend/src/storm/StormApp.tsx:3498](../../../../../frontend/src/storm/StormApp.tsx#L3498)

```typescript
reload() => void
```

В теле вызывает `pushToast`, `reloadMembers`, `reloadProjects`, `selProjects`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `pushToast`
- `reloadMembers`
- `reloadProjects`
- `selProjects`

</details>

## StormApp.openNoteEditor

[frontend/src/storm/StormApp.tsx:3522](../../../../../frontend/src/storm/StormApp.tsx#L3522)

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

## StormApp.closeNoteEditor

[frontend/src/storm/StormApp.tsx:3536](../../../../../frontend/src/storm/StormApp.tsx#L3536)

```typescript
closeNoteEditor() => void
```

В теле вызывает `setState`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.backToNotesList

[frontend/src/storm/StormApp.tsx:3538](../../../../../frontend/src/storm/StormApp.tsx#L3538)

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

[frontend/src/storm/StormApp.tsx:3542](../../../../../frontend/src/storm/StormApp.tsx#L3542)

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

## StormApp.closeNoteViewer

[frontend/src/storm/StormApp.tsx:3543](../../../../../frontend/src/storm/StormApp.tsx#L3543)

```typescript
closeNoteViewer() => void
```

В теле вызывает `setState`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.updateNoteForm

[frontend/src/storm/StormApp.tsx:3544](../../../../../frontend/src/storm/StormApp.tsx#L3544)

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

[frontend/src/storm/StormApp.tsx:3548](../../../../../frontend/src/storm/StormApp.tsx#L3548)

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

[frontend/src/storm/StormApp.tsx:3567](../../../../../frontend/src/storm/StormApp.tsx#L3567)

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

[frontend/src/storm/StormApp.tsx:3598](../../../../../frontend/src/storm/StormApp.tsx#L3598)

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

[frontend/src/storm/StormApp.tsx:3599](../../../../../frontend/src/storm/StormApp.tsx#L3599)

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

[frontend/src/storm/StormApp.tsx:3600](../../../../../frontend/src/storm/StormApp.tsx#L3600)

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

[frontend/src/storm/StormApp.tsx:3617](../../../../../frontend/src/storm/StormApp.tsx#L3617)

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

[frontend/src/storm/StormApp.tsx:3621](../../../../../frontend/src/storm/StormApp.tsx#L3621)

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

[frontend/src/storm/StormApp.tsx:3624](../../../../../frontend/src/storm/StormApp.tsx#L3624)

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

[frontend/src/storm/StormApp.tsx:3641](../../../../../frontend/src/storm/StormApp.tsx#L3641)

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

[frontend/src/storm/StormApp.tsx:3652](../../../../../frontend/src/storm/StormApp.tsx#L3652)

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

[frontend/src/storm/StormApp.tsx:3654](../../../../../frontend/src/storm/StormApp.tsx#L3654)

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

[frontend/src/storm/StormApp.tsx:3655](../../../../../frontend/src/storm/StormApp.tsx#L3655)

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

[frontend/src/storm/StormApp.tsx:3666](../../../../../frontend/src/storm/StormApp.tsx#L3666)

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

[frontend/src/storm/StormApp.tsx:3676](../../../../../frontend/src/storm/StormApp.tsx#L3676)

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

[frontend/src/storm/StormApp.tsx:3700](../../../../../frontend/src/storm/StormApp.tsx#L3700)

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

[frontend/src/storm/StormApp.tsx:3706](../../../../../frontend/src/storm/StormApp.tsx#L3706)

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

[frontend/src/storm/StormApp.tsx:3747](../../../../../frontend/src/storm/StormApp.tsx#L3747)

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

[frontend/src/storm/StormApp.tsx:3777](../../../../../frontend/src/storm/StormApp.tsx#L3777)

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

[frontend/src/storm/StormApp.tsx:3781](../../../../../frontend/src/storm/StormApp.tsx#L3781)

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

[frontend/src/storm/StormApp.tsx:3782](../../../../../frontend/src/storm/StormApp.tsx#L3782)

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

[frontend/src/storm/StormApp.tsx:3783](../../../../../frontend/src/storm/StormApp.tsx#L3783)

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

[frontend/src/storm/StormApp.tsx:3789](../../../../../frontend/src/storm/StormApp.tsx#L3789)

```typescript
async createApiKey() => Promise<void>
```

В теле вызывает `API_SCOPES.filter`, `apiCreateAgentToken`, `getApiErrorMessage`, `new Date(`${state.apiKeyExpiry}T23:59:59`).toISOString`, `pushToast`, `reloadApiKeys`, `setState`, `state.apiKeyName.trim`.

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

</details>

## StormApp.revokeApiKey

[frontend/src/storm/StormApp.tsx:3820](../../../../../frontend/src/storm/StormApp.tsx#L3820)

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

[frontend/src/storm/StormApp.tsx:3829](../../../../../frontend/src/storm/StormApp.tsx#L3829)

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

[frontend/src/storm/StormApp.tsx:3841](../../../../../frontend/src/storm/StormApp.tsx#L3841)

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

[frontend/src/storm/StormApp.tsx:3844](../../../../../frontend/src/storm/StormApp.tsx#L3844)

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

</details>

## StormApp.askDeleteWSUser

[frontend/src/storm/StormApp.tsx:3877](../../../../../frontend/src/storm/StormApp.tsx#L3877)

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

[frontend/src/storm/StormApp.tsx:3885](../../../../../frontend/src/storm/StormApp.tsx#L3885)

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

[frontend/src/storm/StormApp.tsx:3897](../../../../../frontend/src/storm/StormApp.tsx#L3897)

```typescript
async resendInvite(id: number) => Promise<void>
```

В теле вызывает `apiResendInvitation`, `getApiErrorMessage`, `navigator.clipboard.writeText`, `pushToast`, `reloadUsers`.

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

</details>

## StormApp.askRevokeInvite

[frontend/src/storm/StormApp.tsx:3912](../../../../../frontend/src/storm/StormApp.tsx#L3912)

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

[frontend/src/storm/StormApp.tsx:3917](../../../../../frontend/src/storm/StormApp.tsx#L3917)

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

[frontend/src/storm/StormApp.tsx:3927](../../../../../frontend/src/storm/StormApp.tsx#L3927)

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

[frontend/src/storm/StormApp.tsx:3937](../../../../../frontend/src/storm/StormApp.tsx#L3937)

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

[frontend/src/storm/StormApp.tsx:3938](../../../../../frontend/src/storm/StormApp.tsx#L3938)

```typescript
async confirmTwoFA() => Promise<void>
```

В теле вызывает `apiConfirmTwoFactor`, `getApiErrorMessage`, `pushToast`, `refreshUser`, `setState`, `state.twoFACode.trim`.

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `apiConfirmTwoFactor`
- `getApiErrorMessage`
- `pushToast`
- `refreshUser`
- `setState`
- `state.twoFACode.trim`

</details>

## StormApp.openDisableTwoFA

[frontend/src/storm/StormApp.tsx:3951](../../../../../frontend/src/storm/StormApp.tsx#L3951)

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

[frontend/src/storm/StormApp.tsx:3952](../../../../../frontend/src/storm/StormApp.tsx#L3952)

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

[frontend/src/storm/StormApp.tsx:3953](../../../../../frontend/src/storm/StormApp.tsx#L3953)

```typescript
async disableTwoFA() => Promise<void>
```

В теле вызывает `apiDisableTwoFactor`, `getApiErrorMessage`, `pushToast`, `refreshUser`, `setState`.

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `apiDisableTwoFactor`
- `getApiErrorMessage`
- `pushToast`
- `refreshUser`
- `setState`

</details>

## StormApp.submitPasswordChange

[frontend/src/storm/StormApp.tsx:3969](../../../../../frontend/src/storm/StormApp.tsx#L3969)

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

[frontend/src/storm/StormApp.tsx:3995](../../../../../frontend/src/storm/StormApp.tsx#L3995)

```typescript
goToNotif(n: ApiNotification) => void
```

В теле вызывает `apiMarkNotificationRead`, `apiMarkNotificationRead(n.id).catch`, `pushToast`, `setStateRaw`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `n` | `ApiNotification` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `apiMarkNotificationRead`
- `apiMarkNotificationRead(n.id).catch`
- `pushToast`
- `setStateRaw`

</details>

## StormApp.markAllNotifsRead

[frontend/src/storm/StormApp.tsx:4026](../../../../../frontend/src/storm/StormApp.tsx#L4026)

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

[frontend/src/storm/StormApp.tsx:4036](../../../../../frontend/src/storm/StormApp.tsx#L4036)

```typescript
isArchivedStatus(s: ProjectStatus) => boolean
```

Преобразование/вычисление в теле функции; тип результата и параметры приведены ниже, точное выражение доступно по ссылке на исходник.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `s` | `ProjectStatus` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `boolean`.

## StormApp.parseAll

[frontend/src/storm/StormApp.tsx:4053](../../../../../frontend/src/storm/StormApp.tsx#L4053)

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

[frontend/src/storm/StormApp.tsx:4055](../../../../../frontend/src/storm/StormApp.tsx#L4055)

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

[frontend/src/storm/StormApp.tsx:4060](../../../../../frontend/src/storm/StormApp.tsx#L4060)

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

[frontend/src/storm/StormApp.tsx:4061](../../../../../frontend/src/storm/StormApp.tsx#L4061)

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

[frontend/src/storm/StormApp.tsx:4062](../../../../../frontend/src/storm/StormApp.tsx#L4062)

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

[frontend/src/storm/StormApp.tsx:4066](../../../../../frontend/src/storm/StormApp.tsx#L4066)

```typescript
navBg(id: NavId) => "var(--st-accent-soft)" | undefined
```

Преобразование/вычисление в теле функции; тип результата и параметры приведены ниже, точное выражение доступно по ссылке на исходник.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `id` | `NavId` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `"var(--st-accent-soft)" \| undefined`.

## StormApp.navColor

[frontend/src/storm/StormApp.tsx:4067](../../../../../frontend/src/storm/StormApp.tsx#L4067)

```typescript
navColor(id: NavId) => "var(--st-accent)" | "var(--st-text-2)"
```

Преобразование/вычисление в теле функции; тип результата и параметры приведены ниже, точное выражение доступно по ссылке на исходник.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `id` | `NavId` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `"var(--st-accent)" \| "var(--st-text-2)"`.

## StormApp.onClick

[frontend/src/storm/StormApp.tsx:4109](../../../../../frontend/src/storm/StormApp.tsx#L4109)

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

[frontend/src/storm/StormApp.tsx:4119](../../../../../frontend/src/storm/StormApp.tsx#L4119)

```typescript
secStyle(k: SectionId) => { active: boolean; color: string; badgeColor: string; badgeBg: string; }
```

Преобразование/вычисление в теле функции; тип результата и параметры приведены ниже, точное выражение доступно по ссылке на исходник.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `k` | `SectionId` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `{ active: boolean; color: string; badgeColor: string; badgeBg: string; }`.

## StormApp.portPillsOf

[frontend/src/storm/StormApp.tsx:4130](../../../../../frontend/src/storm/StormApp.tsx#L4130)

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

[frontend/src/storm/StormApp.tsx:4132](../../../../../frontend/src/storm/StormApp.tsx#L4132)

```typescript
httpStatusColor(code: number) => string
```

Colour for an HTTP status code next to a port: 2xx green, 3xx amber, else red.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `code` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `string`.

## StormApp.isNestedSubdomain

[frontend/src/storm/StormApp.tsx:4137](../../../../../frontend/src/storm/StormApp.tsx#L4137)

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

[frontend/src/storm/StormApp.tsx:4143](../../../../../frontend/src/storm/StormApp.tsx#L4143)

```typescript
isIpFarmRow(h: Host) => boolean
```

Преобразование/вычисление в теле функции; тип результата и параметры приведены ниже, точное выражение доступно по ссылке на исходник.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `h` | `Host` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `boolean`.

## StormApp.matchesStatusFilters

[frontend/src/storm/StormApp.tsx:4147](../../../../../frontend/src/storm/StormApp.tsx#L4147)

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

[frontend/src/storm/StormApp.tsx:4159](../../../../../frontend/src/storm/StormApp.tsx#L4159)

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

[frontend/src/storm/StormApp.tsx:4164](../../../../../frontend/src/storm/StormApp.tsx#L4164)

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

[frontend/src/storm/StormApp.tsx:4187](../../../../../frontend/src/storm/StormApp.tsx#L4187)

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

[frontend/src/storm/StormApp.tsx:4225](../../../../../frontend/src/storm/StormApp.tsx#L4225)

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

[frontend/src/storm/StormApp.tsx:4226](../../../../../frontend/src/storm/StormApp.tsx#L4226)

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

[frontend/src/storm/StormApp.tsx:4230](../../../../../frontend/src/storm/StormApp.tsx#L4230)

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

[frontend/src/storm/StormApp.tsx:4237](../../../../../frontend/src/storm/StormApp.tsx#L4237)

```typescript
vfPill(on: boolean) => CSSProperties
```

Pill styling for a multi-select filter; `on` also covers the "All" pill (empty selection).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `on` | `boolean` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `CSSProperties`.

## StormApp.mergeBucket

[frontend/src/storm/StormApp.tsx:4257](../../../../../frontend/src/storm/StormApp.tsx#L4257)

```typescript
mergeBucket(into: IpBucket | null, h: Host) => IpBucket
```

В теле вызывает `h.ports.filter`, `into.ports.map`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `into` | `IpBucket \| null` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `h` | `Host` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `IpBucket`.

<details>
<summary>Прямые вызовы в теле</summary>

- `h.ports.filter`
- `into.ports.map`

</details>

## StormApp.onEdit

[frontend/src/storm/StormApp.tsx:4327](../../../../../frontend/src/storm/StormApp.tsx#L4327)

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

[frontend/src/storm/StormApp.tsx:4331](../../../../../frontend/src/storm/StormApp.tsx#L4331)

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

[frontend/src/storm/StormApp.tsx:4359](../../../../../frontend/src/storm/StormApp.tsx#L4359)

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

[frontend/src/storm/StormApp.tsx:4408](../../../../../frontend/src/storm/StormApp.tsx#L4408)

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

[frontend/src/storm/StormApp.tsx:4409](../../../../../frontend/src/storm/StormApp.tsx#L4409)

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

[frontend/src/storm/StormApp.tsx:4412](../../../../../frontend/src/storm/StormApp.tsx#L4412)

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

[frontend/src/storm/StormApp.tsx:4413](../../../../../frontend/src/storm/StormApp.tsx#L4413)

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

[frontend/src/storm/StormApp.tsx:4416](../../../../../frontend/src/storm/StormApp.tsx#L4416)

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

[frontend/src/storm/StormApp.tsx:4417](../../../../../frontend/src/storm/StormApp.tsx#L4417)

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

[frontend/src/storm/StormApp.tsx:4423](../../../../../frontend/src/storm/StormApp.tsx#L4423)

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

[frontend/src/storm/StormApp.tsx:4426](../../../../../frontend/src/storm/StormApp.tsx#L4426)

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

[frontend/src/storm/StormApp.tsx:4445](../../../../../frontend/src/storm/StormApp.tsx#L4445)

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

[frontend/src/storm/StormApp.tsx:4446](../../../../../frontend/src/storm/StormApp.tsx#L4446)

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

[frontend/src/storm/StormApp.tsx:4577](../../../../../frontend/src/storm/StormApp.tsx#L4577)

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

[frontend/src/storm/StormApp.tsx:4588](../../../../../frontend/src/storm/StormApp.tsx#L4588)

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

[frontend/src/storm/StormApp.tsx:4590](../../../../../frontend/src/storm/StormApp.tsx#L4590)

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

[frontend/src/storm/StormApp.tsx:4591](../../../../../frontend/src/storm/StormApp.tsx#L4591)

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

[frontend/src/storm/StormApp.tsx:4597](../../../../../frontend/src/storm/StormApp.tsx#L4597)

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

[frontend/src/storm/StormApp.tsx:4600](../../../../../frontend/src/storm/StormApp.tsx#L4600)

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

[frontend/src/storm/StormApp.tsx:4602](../../../../../frontend/src/storm/StormApp.tsx#L4602)

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

[frontend/src/storm/StormApp.tsx:4606](../../../../../frontend/src/storm/StormApp.tsx#L4606)

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

[frontend/src/storm/StormApp.tsx:4607](../../../../../frontend/src/storm/StormApp.tsx#L4607)

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

[frontend/src/storm/StormApp.tsx:4608](../../../../../frontend/src/storm/StormApp.tsx#L4608)

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

[frontend/src/storm/StormApp.tsx:4642](../../../../../frontend/src/storm/StormApp.tsx#L4642)

```typescript
pfNav(tab: ProfileTab) => CSSProperties
```

Преобразование/вычисление в теле функции; тип результата и параметры приведены ниже, точное выражение доступно по ссылке на исходник.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `tab` | `ProfileTab` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `CSSProperties`.

## StormApp.capNote

[frontend/src/storm/StormApp.tsx:4648](../../../../../frontend/src/storm/StormApp.tsx#L4648)

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

[frontend/src/storm/StormApp.tsx:4655](../../../../../frontend/src/storm/StormApp.tsx#L4655)

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

[frontend/src/storm/StormApp.tsx:4674](../../../../../frontend/src/storm/StormApp.tsx#L4674)

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

[frontend/src/storm/StormApp.tsx:4802](../../../../../frontend/src/storm/StormApp.tsx#L4802)

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

## StormApp.renderTasks

[frontend/src/storm/StormApp.tsx:4808](../../../../../frontend/src/storm/StormApp.tsx#L4808)

```typescript
renderTasks() => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

В теле вызывает `eyebrow`, `filtered.map`, `renderTaskDetail`, `rows.filter`, `searchBox`, `searched .filter`, `searched .filter((r) => (isActive ? !isDone(r) : isDone(r))) .sort`, `searched.filter`; полный список ниже.

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

<details>
<summary>Прямые вызовы в теле</summary>

- `eyebrow`
- `filtered.map`
- `renderTaskDetail`
- `rows.filter`
- `searchBox`
- `searched .filter`
- `searched .filter((r) => (isActive ? !isDone(r) : isDone(r))) .sort`
- `searched.filter`
- `state.tasksQuery.trim`
- `state.tasksQuery.trim().toLowerCase`
- `t`

</details>

## StormApp.renderTasks.isDone

[frontend/src/storm/StormApp.tsx:4813](../../../../../frontend/src/storm/StormApp.tsx#L4813)

```typescript
isDone(r: JiraTask) => boolean
```

В теле вызывает `taskStatusVs`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `r` | `JiraTask` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `boolean`.

<details>
<summary>Прямые вызовы в теле</summary>

- `taskStatusVs`

</details>

## StormApp.renderTasks.ts

[frontend/src/storm/StormApp.tsx:4818](../../../../../frontend/src/storm/StormApp.tsx#L4818)

```typescript
ts(r: JiraTask) => number
```

В теле вызывает `Date.parse`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `r` | `JiraTask` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `number`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Date.parse`

</details>

## StormApp.renderTasks.createProjectFromTask

[frontend/src/storm/StormApp.tsx:4824](../../../../../frontend/src/storm/StormApp.tsx#L4824)

```typescript
createProjectFromTask(task: JiraTask) => void
```

В теле вызывает `setState`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `task` | `JiraTask` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>

## StormApp.renderTaskDetail

[frontend/src/storm/StormApp.tsx:4905](../../../../../frontend/src/storm/StormApp.tsx#L4905)

```typescript
renderTaskDetail() => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

В теле вызывает `(d.description || "").trim`, `eyebrow`, `fmtDateTime`, `sideRow`, `t`, `taskStatusVs`.

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(d.description || "").trim`
- `eyebrow`
- `fmtDateTime`
- `sideRow`
- `t`
- `taskStatusVs`

</details>

## StormApp.renderTaskDetail.sideRow

[frontend/src/storm/StormApp.tsx:4912](../../../../../frontend/src/storm/StormApp.tsx#L4912)

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

[frontend/src/storm/StormApp.tsx:4918](../../../../../frontend/src/storm/StormApp.tsx#L4918)

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

[frontend/src/storm/StormApp.tsx:4969](../../../../../frontend/src/storm/StormApp.tsx#L4969)

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

[frontend/src/storm/StormApp.tsx:5099](../../../../../frontend/src/storm/StormApp.tsx#L5099)

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

[frontend/src/storm/StormApp.tsx:5108](../../../../../frontend/src/storm/StormApp.tsx#L5108)

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

[frontend/src/storm/StormApp.tsx:5321](../../../../../frontend/src/storm/StormApp.tsx#L5321)

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

[frontend/src/storm/StormApp.tsx:5336](../../../../../frontend/src/storm/StormApp.tsx#L5336)

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

[frontend/src/storm/StormApp.tsx:5355](../../../../../frontend/src/storm/StormApp.tsx#L5355)

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

[frontend/src/storm/StormApp.tsx:5382](../../../../../frontend/src/storm/StormApp.tsx#L5382)

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

[frontend/src/storm/StormApp.tsx:5442](../../../../../frontend/src/storm/StormApp.tsx#L5442)

```typescript
portPills(ports: Host["ports"], hostDown = false) => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

В теле вызывает `portPillsOf`, `portPillsOf(ports).map`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `ports` | `Host["ports"]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `hostDown` | `boolean` | `false` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

<details>
<summary>Прямые вызовы в теле</summary>

- `portPillsOf`
- `portPillsOf(ports).map`

</details>

## StormApp.hostnamePills

[frontend/src/storm/StormApp.tsx:5470](../../../../../frontend/src/storm/StormApp.tsx#L5470)

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

[frontend/src/storm/StormApp.tsx:5503](../../../../../frontend/src/storm/StormApp.tsx#L5503)

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

[frontend/src/storm/StormApp.tsx:5548](../../../../../frontend/src/storm/StormApp.tsx#L5548)

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

[frontend/src/storm/StormApp.tsx:5557](../../../../../frontend/src/storm/StormApp.tsx#L5557)

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

[frontend/src/storm/StormApp.tsx:5558](../../../../../frontend/src/storm/StormApp.tsx#L5558)

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

[frontend/src/storm/StormApp.tsx:5563](../../../../../frontend/src/storm/StormApp.tsx#L5563)

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

[frontend/src/storm/StormApp.tsx:5572](../../../../../frontend/src/storm/StormApp.tsx#L5572)

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

[frontend/src/storm/StormApp.tsx:5573](../../../../../frontend/src/storm/StormApp.tsx#L5573)

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

[frontend/src/storm/StormApp.tsx:5578](../../../../../frontend/src/storm/StormApp.tsx#L5578)

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

[frontend/src/storm/StormApp.tsx:5589](../../../../../frontend/src/storm/StormApp.tsx#L5589)

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

[frontend/src/storm/StormApp.tsx:5590](../../../../../frontend/src/storm/StormApp.tsx#L5590)

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

[frontend/src/storm/StormApp.tsx:5595](../../../../../frontend/src/storm/StormApp.tsx#L5595)

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

[frontend/src/storm/StormApp.tsx:5602](../../../../../frontend/src/storm/StormApp.tsx#L5602)

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

[frontend/src/storm/StormApp.tsx:5609](../../../../../frontend/src/storm/StormApp.tsx#L5609)

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

[frontend/src/storm/StormApp.tsx:5675](../../../../../frontend/src/storm/StormApp.tsx#L5675)

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

[frontend/src/storm/StormApp.tsx:5737](../../../../../frontend/src/storm/StormApp.tsx#L5737)

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

[frontend/src/storm/StormApp.tsx:5782](../../../../../frontend/src/storm/StormApp.tsx#L5782)

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

[frontend/src/storm/StormApp.tsx:5871](../../../../../frontend/src/storm/StormApp.tsx#L5871)

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

[frontend/src/storm/StormApp.tsx:5935](../../../../../frontend/src/storm/StormApp.tsx#L5935)

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

[frontend/src/storm/StormApp.tsx:6167](../../../../../frontend/src/storm/StormApp.tsx#L6167)

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

[frontend/src/storm/StormApp.tsx:6247](../../../../../frontend/src/storm/StormApp.tsx#L6247)

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

[frontend/src/storm/StormApp.tsx:6302](../../../../../frontend/src/storm/StormApp.tsx#L6302)

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

[frontend/src/storm/StormApp.tsx:6363](../../../../../frontend/src/storm/StormApp.tsx#L6363)

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
- `state.vulnFiles.map`
- `t`
- `vdHostSuggestions.map`

</details>

## StormApp.renderVulnDetail.vdHostPick

[frontend/src/storm/StormApp.tsx:6381](../../../../../frontend/src/storm/StormApp.tsx#L6381)

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

[frontend/src/storm/StormApp.tsx:6563](../../../../../frontend/src/storm/StormApp.tsx#L6563)

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

[frontend/src/storm/StormApp.tsx:6585](../../../../../frontend/src/storm/StormApp.tsx#L6585)

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

[frontend/src/storm/StormApp.tsx:6643](../../../../../frontend/src/storm/StormApp.tsx#L6643)

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

[frontend/src/storm/StormApp.tsx:6671](../../../../../frontend/src/storm/StormApp.tsx#L6671)

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

[frontend/src/storm/StormApp.tsx:6717](../../../../../frontend/src/storm/StormApp.tsx#L6717)

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

[frontend/src/storm/StormApp.tsx:6759](../../../../../frontend/src/storm/StormApp.tsx#L6759)

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

[frontend/src/storm/StormApp.tsx:6806](../../../../../frontend/src/storm/StormApp.tsx#L6806)

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

[frontend/src/storm/StormApp.tsx:6827](../../../../../frontend/src/storm/StormApp.tsx#L6827)

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

[frontend/src/storm/StormApp.tsx:6849](../../../../../frontend/src/storm/StormApp.tsx#L6849)

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

[frontend/src/storm/StormApp.tsx:6910](../../../../../frontend/src/storm/StormApp.tsx#L6910)

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

[frontend/src/storm/StormApp.tsx:6946](../../../../../frontend/src/storm/StormApp.tsx#L6946)

```typescript
cardHeader(icon: Parameters<typeof Icon>[0]["name"], title: string, sub: string, right?: ReactNode) => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

Преобразование/вычисление в теле функции; тип результата и параметры приведены ниже, точное выражение доступно по ссылке на исходник.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `icon` | `Parameters<typeof Icon>[0]["name"]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `title` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `sub` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `right` | `ReactNode` | `undefined (optional)` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

## StormApp.renderProfileAccount

[frontend/src/storm/StormApp.tsx:6956](../../../../../frontend/src/storm/StormApp.tsx#L6956)

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

[frontend/src/storm/StormApp.tsx:7001](../../../../../frontend/src/storm/StormApp.tsx#L7001)

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

[frontend/src/storm/StormApp.tsx:7003](../../../../../frontend/src/storm/StormApp.tsx#L7003)

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

[frontend/src/storm/StormApp.tsx:7055](../../../../../frontend/src/storm/StormApp.tsx#L7055)

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

[frontend/src/storm/StormApp.tsx:7128](../../../../../frontend/src/storm/StormApp.tsx#L7128)

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

[frontend/src/storm/StormApp.tsx:7159](../../../../../frontend/src/storm/StormApp.tsx#L7159)

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

[frontend/src/storm/StormApp.tsx:7167](../../../../../frontend/src/storm/StormApp.tsx#L7167)

```typescript
modalFooter(onCancel: () => void, onSave: () => void, saveLabel: string, saveBg = "var(--st-accent-2)") => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

В теле вызывает `t`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `onCancel` | `() => void` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `onSave` | `() => void` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `saveLabel` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `saveBg` | `string` | `"var(--st-accent-2)"` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

<details>
<summary>Прямые вызовы в теле</summary>

- `t`

</details>

## StormApp.onClick

[frontend/src/storm/StormApp.tsx:7225](../../../../../frontend/src/storm/StormApp.tsx#L7225)

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

[frontend/src/storm/StormApp.tsx:7226](../../../../../frontend/src/storm/StormApp.tsx#L7226)

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

[frontend/src/storm/StormApp.tsx:7437](../../../../../frontend/src/storm/StormApp.tsx#L7437)

```typescript
close() => void
```

В теле вызывает `setState`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `setState`

</details>
