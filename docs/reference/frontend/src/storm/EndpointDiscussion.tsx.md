# frontend/src/storm/EndpointDiscussion.tsx

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **3**.

## EndpointDiscussion

[frontend/src/storm/EndpointDiscussion.tsx:10](../../../../../frontend/src/storm/EndpointDiscussion.tsx#L10)

```typescript
EndpointDiscussion({ projectId, hostId, endpointId }: Props) => import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element
```

Persisted discussion, isolated from raw-request editing and its save button.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `{ projectId, hostId, endpointId }` | `Props` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `import("/Users/nkolomiika/Cursor Projects/SberPCF/frontend/node_modules/@types/react/index").JSX.Element`.

<details>
<summary>Прямые вызовы в теле</summary>

- `comments.map`
- `draft.trim`
- `t`
- `useEffect`
- `useRef`
- `useState`
- `useToastStore`

</details>

## EndpointDiscussion.loadPage

[frontend/src/storm/EndpointDiscussion.tsx:23](../../../../../frontend/src/storm/EndpointDiscussion.tsx#L23)

```typescript
async loadPage(nextPage: number) => Promise<void>
```

В теле вызывает `getApiErrorMessage`, `listEndpointComments`, `pushToast`, `setComments`, `setLoadError`, `setLoading`, `setPage`, `setTotal`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `nextPage` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `getApiErrorMessage`
- `listEndpointComments`
- `pushToast`
- `setComments`
- `setLoadError`
- `setLoading`
- `setPage`
- `setTotal`
- `t`

</details>

## EndpointDiscussion.postComment

[frontend/src/storm/EndpointDiscussion.tsx:61](../../../../../frontend/src/storm/EndpointDiscussion.tsx#L61)

```typescript
async postComment() => Promise<void>
```

В теле вызывает `createEndpointComment`, `draft.trim`, `getApiErrorMessage`, `pushToast`, `setComments`, `setDraft`, `setPosting`, `setTotal`; полный список ниже.

Возвращает: `Promise<void>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `createEndpointComment`
- `draft.trim`
- `getApiErrorMessage`
- `pushToast`
- `setComments`
- `setDraft`
- `setPosting`
- `setTotal`
- `t`

</details>
