# frontend/src/api.ts

Сгенерировано из объявлений кода. [Правила чтения](../../../METHODS.md).

Методов и именованных функций: **137**.

## isBlank

[frontend/src/api.ts:58](../../../../frontend/src/api.ts#L58)

```typescript
isBlank(value: string | null | undefined) => boolean
```

В теле вызывает `value.trim`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `value` | `string \| null \| undefined` | `обязательный` | Входное значение преобразования/проверки. |

Возвращает: `boolean`.

<details>
<summary>Прямые вызовы в теле</summary>

- `value.trim`

</details>

## assertRequired

[frontend/src/api.ts:60](../../../../frontend/src/api.ts#L60)

```typescript
assertRequired(value: string | null | undefined, label: string) => void
```

В теле вызывает `isBlank`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `value` | `string \| null \| undefined` | `обязательный` | Входное значение преобразования/проверки. |
| `label` | `string` | `обязательный` | Текст подписи/сообщения проверки. |

Возвращает: `void`.

Явные throw в теле:

```typescript
new Error(`Field "${label}" is required`)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `isBlank`

</details>

## normalizeDetailMessage

[frontend/src/api.ts:66](../../../../frontend/src/api.ts#L66)

```typescript
normalizeDetailMessage(detail: unknown) => string | null
```

В теле вызывает `Array.isArray`, `detail.map`, `detail.map((item) => normalizeDetailMessage(item)).filter`, `detail.trim`, `messages.join`, `normalizeDetailMessage`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `detail` | `unknown` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `string \| null`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Array.isArray`
- `detail.map`
- `detail.map((item) => normalizeDetailMessage(item)).filter`
- `detail.trim`
- `messages.join`
- `normalizeDetailMessage`

</details>

## getApiErrorStatus

[frontend/src/api.ts:86](../../../../frontend/src/api.ts#L86)

```typescript
getApiErrorStatus(error: unknown) => number | null
```

HTTP-статус ошибки axios, если он есть (403 → показываем экран «нет доступа»).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `error` | `unknown` | `обязательный` | Перехваченное исключение/ответ ошибки. |

Возвращает: `number \| null`.

<details>
<summary>Прямые вызовы в теле</summary>

- `axios.isAxiosError`

</details>

## getApiErrorMessage

[frontend/src/api.ts:89](../../../../frontend/src/api.ts#L89)

```typescript
getApiErrorMessage(error: unknown, fallback: string) => string
```

В теле вызывает `axios.isAxiosError`, `error.message.trim`, `normalizeDetailMessage`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `error` | `unknown` | `обязательный` | Перехваченное исключение/ответ ошибки. |
| `fallback` | `string` | `обязательный` | Запасное значение при отсутствии основного. |

Возвращает: `string`.

<details>
<summary>Прямые вызовы в теле</summary>

- `axios.isAxiosError`
- `error.message.trim`
- `normalizeDetailMessage`

</details>

## login

[frontend/src/api.ts:171](../../../../frontend/src/api.ts#L171)

```typescript
async login(username: string, password: string) => Promise<AuthLoginResponse>
```

Клиентский HTTP-метод: POST `"/auth/login"`. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `username` | `string` | `обязательный` | Имя пользователя. |
| `password` | `string` | `обязательный` | Пароль, передаваемый в операцию. |

Возвращает: `Promise<AuthLoginResponse>`.

Прямые HTTP-вызовы:

- `POST "/auth/login"`; аргументы: `{ username, password }`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.post`
- `assertRequired`

</details>

## getSsoConfig

[frontend/src/api.ts:179](../../../../frontend/src/api.ts#L179)

```typescript
async getSsoConfig() => Promise<SsoConfig>
```

Публичная конфигурация SSO: показывать ли кнопку входа и её надпись.

Возвращает: `Promise<SsoConfig>`.

Прямые HTTP-вызовы:

- `GET "/auth/sso/config"`; аргументы: `нет`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.get`

</details>

## verifyTwoFactor

[frontend/src/api.ts:184](../../../../frontend/src/api.ts#L184)

```typescript
async verifyTwoFactor(code: string) => Promise<AuthLoginResponse>
```

Клиентский HTTP-метод: POST `"/auth/2fa/verify"`. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `code` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<AuthLoginResponse>`.

Прямые HTTP-вызовы:

- `POST "/auth/2fa/verify"`; аргументы: `{ code: code.trim() }`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.post`
- `assertRequired`
- `code.trim`

</details>

## setupTwoFactor

[frontend/src/api.ts:190](../../../../frontend/src/api.ts#L190)

```typescript
async setupTwoFactor() => Promise<TwoFASetupResponse>
```

Клиентский HTTP-метод: POST `"/users/me/2fa/setup"`. Использует общий axios-клиент с cookie и обработкой обновления сессии.

Возвращает: `Promise<TwoFASetupResponse>`.

Прямые HTTP-вызовы:

- `POST "/users/me/2fa/setup"`; аргументы: `нет`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.post`

</details>

## confirmTwoFactor

[frontend/src/api.ts:195](../../../../frontend/src/api.ts#L195)

```typescript
async confirmTwoFactor(code: string) => Promise<User>
```

Клиентский HTTP-метод: POST `"/users/me/2fa/confirm"`. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `code` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<User>`.

Прямые HTTP-вызовы:

- `POST "/users/me/2fa/confirm"`; аргументы: `{ code: code.trim() }`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.post`
- `assertRequired`
- `code.trim`

</details>

## disableTwoFactor

[frontend/src/api.ts:201](../../../../frontend/src/api.ts#L201)

```typescript
async disableTwoFactor(password: string) => Promise<User>
```

Клиентский HTTP-метод: POST `"/users/me/2fa/disable"`. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `password` | `string` | `обязательный` | Пароль, передаваемый в операцию. |

Возвращает: `Promise<User>`.

Прямые HTTP-вызовы:

- `POST "/users/me/2fa/disable"`; аргументы: `{ password }`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.post`
- `assertRequired`

</details>

## logout

[frontend/src/api.ts:207](../../../../frontend/src/api.ts#L207)

```typescript
async logout() => Promise<void>
```

Клиентский HTTP-метод: POST `"/auth/logout"`. Использует общий axios-клиент с cookie и обработкой обновления сессии.

Возвращает: `Promise<void>`.

Прямые HTTP-вызовы:

- `POST "/auth/logout"`; аргументы: `нет`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.post`

</details>

## requestPasswordReset

[frontend/src/api.ts:217](../../../../frontend/src/api.ts#L217)

```typescript
async requestPasswordReset(email: string) => Promise<{ ok: boolean; mail_preview_url: string | null }>
```

Запрашивает ссылку сброса. Отвечает 200 всегда — есть такой email или нет,
бэкенд намеренно не сообщает, чтобы форму нельзя было использовать для
перебора существующих адресов.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `email` | `string` | `обязательный` | Email пользователя/получателя. |

Возвращает: `Promise<{ ok: boolean; mail_preview_url: string \| null }>`.

Прямые HTTP-вызовы:

- `POST "/auth/password-reset/request"`; аргументы: `{ email }`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.post`
- `assertRequired`

</details>

## getPasswordResetInfo

[frontend/src/api.ts:226](../../../../frontend/src/api.ts#L226)

```typescript
async getPasswordResetInfo(token: string) => Promise<PasswordResetInfo>
```

Клиентский HTTP-метод: GET ``/auth/password-reset/${encodeURIComponent(token)}``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `token` | `string` | `обязательный` | Токен операции; формат определяется вызывающим методом. |

Возвращает: `Promise<PasswordResetInfo>`.

Прямые HTTP-вызовы:

- `GET `/auth/password-reset/${encodeURIComponent(token)}``; аргументы: `нет`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.get`
- `encodeURIComponent`

</details>

## confirmPasswordReset

[frontend/src/api.ts:231](../../../../frontend/src/api.ts#L231)

```typescript
async confirmPasswordReset(token: string, password: string) => Promise<void>
```

Клиентский HTTP-метод: POST ``/auth/password-reset/${encodeURIComponent(token)}``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `token` | `string` | `обязательный` | Токен операции; формат определяется вызывающим методом. |
| `password` | `string` | `обязательный` | Пароль, передаваемый в операцию. |

Возвращает: `Promise<void>`.

Прямые HTTP-вызовы:

- `POST `/auth/password-reset/${encodeURIComponent(token)}``; аргументы: `{ password }`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.post`
- `assertRequired`
- `encodeURIComponent`

</details>

## getMe

[frontend/src/api.ts:236](../../../../frontend/src/api.ts#L236)

```typescript
async getMe() => Promise<User>
```

Клиентский HTTP-метод: GET `"/users/me"`. Использует общий axios-клиент с cookie и обработкой обновления сессии.

Возвращает: `Promise<User>`.

Прямые HTTP-вызовы:

- `GET "/users/me"`; аргументы: `нет`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.get`

</details>

## getUsers

[frontend/src/api.ts:241](../../../../frontend/src/api.ts#L241)

```typescript
async getUsers(page = 1, size = 200) => Promise<PaginatedResponse<User>>
```

Клиентский HTTP-метод: GET `"/users"`. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `page` | `number` | `1` | Номер страницы, начиная с 1. |
| `size` | `number` | `200` | Число элементов страницы; верхняя граница задаётся маршрутом. |

Возвращает: `Promise<PaginatedResponse<User>>`.

Прямые HTTP-вызовы:

- `GET "/users"`; аргументы: `{ params: { page, size } }`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.get`

</details>

## searchUsers

[frontend/src/api.ts:253](../../../../frontend/src/api.ts#L253)

```typescript
async searchUsers(q: string, limit = 10) => Promise<UserSearchResult[]>
```

Клиентский HTTP-метод: GET `"/users/search"`. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `q` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `limit` | `number` | `10` | Максимальное число возвращаемых записей. |

Возвращает: `Promise<UserSearchResult[]>`.

Прямые HTTP-вызовы:

- `GET "/users/search"`; аргументы: `{ params: { q: q.trim(), limit } }`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.get`
- `q.trim`

</details>

## createUser

[frontend/src/api.ts:264](../../../../frontend/src/api.ts#L264)

```typescript
async createUser(_payload: { username: string; email: string; full_name?: string; password?: string; role: User["role"]; project_role?: User["project_role"]; send_invite_email?: boolean; }) => Promise<User>
```

@deprecated Прямое создание пользователя с паролем убрано в пользу приглашений
({@link createInvitation}). Функция оставлена только чтобы типизировалась
устаревшая, НЕ подключённая к роутингу страница `pages/UsersAdminPage.tsx`
(живой UI — Storm — её не использует). Реального эндпоинта на бэкенде больше нет.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `_payload` | `{ username: string; email: string; full_name?: string; password?: string; role: User["role"]; project_role?: User["project_role"]; send_invite_email?: boolean; }` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<User>`.

Явные throw в теле:

```typescript
new Error("Direct user creation is disabled — use invitations (invite flow)")
```

## createInvitation

[frontend/src/api.ts:280](../../../../frontend/src/api.ts#L280)

```typescript
async createInvitation(payload: { email: string; full_name?: string; role: User["role"]; project_role?: User["project_role"]; }) => Promise<InvitationSentResult>
```

Клиентский HTTP-метод: POST `"/users/invitations"`. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `payload` | `{ email: string; full_name?: string; role: User["role"]; project_role?: User["project_role"]; }` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |

Возвращает: `Promise<InvitationSentResult>`.

Прямые HTTP-вызовы:

- `POST "/users/invitations"`; аргументы: `payload`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.post`
- `assertRequired`

</details>

## getInvitations

[frontend/src/api.ts:291](../../../../frontend/src/api.ts#L291)

```typescript
async getInvitations() => Promise<Invitation[]>
```

Клиентский HTTP-метод: GET `"/users/invitations"`. Использует общий axios-клиент с cookie и обработкой обновления сессии.

Возвращает: `Promise<Invitation[]>`.

Прямые HTTP-вызовы:

- `GET "/users/invitations"`; аргументы: `нет`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.get`

</details>

## resendInvitation

[frontend/src/api.ts:296](../../../../frontend/src/api.ts#L296)

```typescript
async resendInvitation(invitationId: number) => Promise<InvitationSentResult>
```

Клиентский HTTP-метод: POST ``/users/invitations/${invitationId}/resend``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `invitationId` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<InvitationSentResult>`.

Прямые HTTP-вызовы:

- `POST `/users/invitations/${invitationId}/resend``; аргументы: `нет`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.post`

</details>

## revokeInvitation

[frontend/src/api.ts:301](../../../../frontend/src/api.ts#L301)

```typescript
async revokeInvitation(invitationId: number) => Promise<void>
```

Клиентский HTTP-метод: DELETE ``/users/invitations/${invitationId}``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `invitationId` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<void>`.

Прямые HTTP-вызовы:

- `DELETE `/users/invitations/${invitationId}``; аргументы: `нет`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.delete`

</details>

## getInvitationInfo

[frontend/src/api.ts:307](../../../../frontend/src/api.ts#L307)

```typescript
async getInvitationInfo(token: string) => Promise<InvitationInfo>
```

Клиентский HTTP-метод: GET ``/auth/invitations/${encodeURIComponent(token)}``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `token` | `string` | `обязательный` | Токен операции; формат определяется вызывающим методом. |

Возвращает: `Promise<InvitationInfo>`.

Прямые HTTP-вызовы:

- `GET `/auth/invitations/${encodeURIComponent(token)}``; аргументы: `нет`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.get`
- `encodeURIComponent`

</details>

## checkInvitationUsername

[frontend/src/api.ts:312](../../../../frontend/src/api.ts#L312)

```typescript
async checkInvitationUsername(token: string, username: string) => Promise<boolean>
```

Клиентский HTTP-метод: GET ``/auth/invitations/${encodeURIComponent(token)}/username-available``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `token` | `string` | `обязательный` | Токен операции; формат определяется вызывающим методом. |
| `username` | `string` | `обязательный` | Имя пользователя. |

Возвращает: `Promise<boolean>`.

Прямые HTTP-вызовы:

- `GET `/auth/invitations/${encodeURIComponent(token)}/username-available``; аргументы: `{ params: { username } }`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.get`
- `encodeURIComponent`

</details>

## acceptInvitation

[frontend/src/api.ts:320](../../../../frontend/src/api.ts#L320)

```typescript
async acceptInvitation(token: string, payload: { username: string; password: string }) => Promise<AuthLoginResponse>
```

Клиентский HTTP-метод: POST ``/auth/invitations/${encodeURIComponent(token)}/accept``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `token` | `string` | `обязательный` | Токен операции; формат определяется вызывающим методом. |
| `payload` | `{ username: string; password: string }` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |

Возвращает: `Promise<AuthLoginResponse>`.

Прямые HTTP-вызовы:

- `POST `/auth/invitations/${encodeURIComponent(token)}/accept``; аргументы: `payload`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.post`
- `assertRequired`
- `encodeURIComponent`

</details>

## updateUser

[frontend/src/api.ts:333](../../../../frontend/src/api.ts#L333)

```typescript
async updateUser(userId: number, payload: { username?: string; full_name?: string; role?: User["role"]; project_role?: User["project_role"]; is_active?: boolean; }) => Promise<User>
```

Клиентский HTTP-метод: PUT ``/users/${userId}``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `userId` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `payload` | `{ username?: string; full_name?: string; role?: User["role"]; project_role?: User["project_role"]; is_active?: boolean; }` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |

Возвращает: `Promise<User>`.

Прямые HTTP-вызовы:

- `PUT `/users/${userId}``; аргументы: `payload`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.put`

</details>

## reactivateUser

[frontend/src/api.ts:349](../../../../frontend/src/api.ts#L349)

```typescript
async reactivateUser(userId: number) => Promise<PasswordResetResult>
```

Возврат деактивированного пользователя: шлёт ему письмо со ссылкой-возвратом.
Аккаунт разблокируется, только когда пользователь сам перейдёт по ссылке.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `userId` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<PasswordResetResult>`.

Прямые HTTP-вызовы:

- `POST `/users/${userId}/reactivate``; аргументы: `нет`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.post`

</details>

## getReactivationInfo

[frontend/src/api.ts:356](../../../../frontend/src/api.ts#L356)

```typescript
async getReactivationInfo(token: string) => Promise<ReactivationInfo>
```

Клиентский HTTP-метод: GET ``/auth/reactivate/${encodeURIComponent(token)}``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `token` | `string` | `обязательный` | Токен операции; формат определяется вызывающим методом. |

Возвращает: `Promise<ReactivationInfo>`.

Прямые HTTP-вызовы:

- `GET `/auth/reactivate/${encodeURIComponent(token)}``; аргументы: `нет`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.get`
- `encodeURIComponent`

</details>

## completeReactivation

[frontend/src/api.ts:362](../../../../frontend/src/api.ts#L362)

```typescript
async completeReactivation(token: string) => Promise<AuthLoginResponse>
```

Разблокирует аккаунт по ссылке и сразу выдаёт сессию (cookie ставит бэкенд).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `token` | `string` | `обязательный` | Токен операции; формат определяется вызывающим методом. |

Возвращает: `Promise<AuthLoginResponse>`.

Прямые HTTP-вызовы:

- `POST `/auth/reactivate/${encodeURIComponent(token)}``; аргументы: `нет`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.post`
- `encodeURIComponent`

</details>

## resetUserPassword

[frontend/src/api.ts:367](../../../../frontend/src/api.ts#L367)

```typescript
async resetUserPassword(userId: number) => Promise<PasswordResetResult>
```

Клиентский HTTP-метод: PATCH ``/users/${userId}/password``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `userId` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<PasswordResetResult>`.

Прямые HTTP-вызовы:

- `PATCH `/users/${userId}/password``; аргументы: `нет`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.patch`

</details>

## deleteUser

[frontend/src/api.ts:372](../../../../frontend/src/api.ts#L372)

```typescript
async deleteUser(userId: number) => Promise<void>
```

Клиентский HTTP-метод: DELETE ``/users/${userId}``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `userId` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<void>`.

Прямые HTTP-вызовы:

- `DELETE `/users/${userId}``; аргументы: `нет`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.delete`

</details>

## updateMyProfile

[frontend/src/api.ts:376](../../../../frontend/src/api.ts#L376)

```typescript
async updateMyProfile(payload: { username?: string; email?: string; full_name?: string; }) => Promise<User>
```

Клиентский HTTP-метод: PATCH `"/users/me"`. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `payload` | `{ username?: string; email?: string; full_name?: string; }` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |

Возвращает: `Promise<User>`.

Прямые HTTP-вызовы:

- `PATCH "/users/me"`; аргументы: `payload`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.patch`

</details>

## changeMyPassword

[frontend/src/api.ts:385](../../../../frontend/src/api.ts#L385)

```typescript
async changeMyPassword(payload: { current_password: string; new_password: string }) => Promise<User>
```

Клиентский HTTP-метод: PATCH `"/users/me/password"`. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `payload` | `{ current_password: string; new_password: string }` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |

Возвращает: `Promise<User>`.

Прямые HTTP-вызовы:

- `PATCH "/users/me/password"`; аргументы: `payload`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.patch`
- `assertRequired`

</details>

## uploadMyAvatar

[frontend/src/api.ts:392](../../../../frontend/src/api.ts#L392)

```typescript
async uploadMyAvatar(file: File) => Promise<User>
```

Клиентский HTTP-метод: POST `"/users/me/avatar"`. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `file` | `File` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<User>`.

Прямые HTTP-вызовы:

- `POST "/users/me/avatar"`; аргументы: `formData / { headers: { "Content-Type": "multipart/form-data" }, }`.

Явные throw в теле:

```typescript
new Error("An avatar file is required")
```

<details>
<summary>Прямые вызовы в теле</summary>

- `api.post`
- `formData.append`

</details>

## getProjects

[frontend/src/api.ts:404](../../../../frontend/src/api.ts#L404)

```typescript
async getProjects(page = 1, size = 20, status?: Project["status"]) => Promise<PaginatedResponse<Project>>
```

Клиентский HTTP-метод: GET `"/projects"`. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `page` | `number` | `1` | Номер страницы, начиная с 1. |
| `size` | `number` | `20` | Число элементов страницы; верхняя граница задаётся маршрутом. |
| `status` | `Project["status"]` | `undefined (optional)` | Статус операции/ресурса; допустимые значения задаёт Enum или схема. |

Возвращает: `Promise<PaginatedResponse<Project>>`.

Прямые HTTP-вызовы:

- `GET "/projects"`; аргументы: `{ params: { page, size, status } }`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.get`

</details>

## getProjectStats

[frontend/src/api.ts:409](../../../../frontend/src/api.ts#L409)

```typescript
async getProjectStats() => Promise<ProjectStats[]>
```

Клиентский HTTP-метод: GET `"/projects/stats"`. Использует общий axios-клиент с cookie и обработкой обновления сессии.

Возвращает: `Promise<ProjectStats[]>`.

Прямые HTTP-вызовы:

- `GET "/projects/stats"`; аргументы: `нет`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.get`

</details>

## getProjectFolders

[frontend/src/api.ts:414](../../../../frontend/src/api.ts#L414)

```typescript
async getProjectFolders() => Promise<ProjectFolder[]>
```

Клиентский HTTP-метод: GET `"/projects/folders"`. Использует общий axios-клиент с cookie и обработкой обновления сессии.

Возвращает: `Promise<ProjectFolder[]>`.

Прямые HTTP-вызовы:

- `GET "/projects/folders"`; аргументы: `нет`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.get`

</details>

## createProjectFolder

[frontend/src/api.ts:419](../../../../frontend/src/api.ts#L419)

```typescript
async createProjectFolder(payload: { name: string; parent_id?: number | null }) => Promise<ProjectFolder>
```

Клиентский HTTP-метод: POST `"/projects/folders"`. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `payload` | `{ name: string; parent_id?: number \| null }` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |

Возвращает: `Promise<ProjectFolder>`.

Прямые HTTP-вызовы:

- `POST "/projects/folders"`; аргументы: `payload`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.post`
- `assertRequired`

</details>

## moveProjectFolder

[frontend/src/api.ts:425](../../../../frontend/src/api.ts#L425)

```typescript
async moveProjectFolder(folderId: number, payload: { parent_id?: number | null }) => Promise<ProjectFolder>
```

Клиентский HTTP-метод: PATCH ``/projects/folders/${folderId}/move``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `folderId` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `payload` | `{ parent_id?: number \| null }` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |

Возвращает: `Promise<ProjectFolder>`.

Прямые HTTP-вызовы:

- `PATCH `/projects/folders/${folderId}/move``; аргументы: `payload`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.patch`

</details>

## deleteProjectFolder

[frontend/src/api.ts:436](../../../../frontend/src/api.ts#L436)

```typescript
async deleteProjectFolder(folderId: number) => Promise<DeleteProjectFolderResult>
```

Клиентский HTTP-метод: DELETE ``/projects/folders/${folderId}``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `folderId` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<DeleteProjectFolderResult>`.

Прямые HTTP-вызовы:

- `DELETE `/projects/folders/${folderId}``; аргументы: `нет`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.delete`

</details>

## createProject

[frontend/src/api.ts:441](../../../../frontend/src/api.ts#L441)

```typescript
async createProject(payload: { name: string; folder?: string; start_date?: string; end_date?: string; appsec_component_code?: string | null; appsec_component_name?: string | null; appsec_version_code?: string | null; appsec_version_name?: string | null; appsec_versions?: WorksRef[]; appsec_assignee?: string | null; appsec_assignee_name?: string | null; appsec_ticket_url?: string | null; appsec_ticket_key?: string | null; }) => Promise<Project>
```

Клиентский HTTP-метод: POST `"/projects"`. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `payload` | `{ name: string; folder?: string; start_date?: string; end_date?: string; appsec_component_code?: string \| null; appsec_component_name?: string \| null; appsec_version_code?: string \| null; appsec_version_name?: string \| null; appsec_versions?: WorksRef[]; appsec_assignee?: string \| null; appsec_assignee_name?: string \| null; appsec_ticket_url?: string \| null; appsec_ticket_key?: string \| null; }` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |

Возвращает: `Promise<Project>`.

Прямые HTTP-вызовы:

- `POST "/projects"`; аргументы: `payload`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.post`
- `assertRequired`

</details>

## getProject

[frontend/src/api.ts:461](../../../../frontend/src/api.ts#L461)

```typescript
async getProject(projectId: number) => Promise<Project>
```

Клиентский HTTP-метод: GET ``/projects/${projectId}``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |

Возвращает: `Promise<Project>`.

Прямые HTTP-вызовы:

- `GET `/projects/${projectId}``; аргументы: `нет`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.get`

</details>

## updateProject

[frontend/src/api.ts:466](../../../../frontend/src/api.ts#L466)

```typescript
async updateProject(projectId: number, payload: { name?: string; folder?: string; start_date?: string; end_date?: string; status?: Project["status"]; appsec_component_code?: string | null; appsec_component_name?: string | null; appsec_version_code?: string | null; appsec_version_name?: string | null; appsec_versions?: WorksRef[]; appsec_assignee?: string | null; appsec_assignee_name?: string | null; appsec_ticket_url?: string | null; appsec_ticket_key?: string | null; }) => Promise<Project>
```

Клиентский HTTP-метод: PUT ``/projects/${projectId}``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `payload` | `{ name?: string; folder?: string; start_date?: string; end_date?: string; status?: Project["status"]; appsec_component_code?: string \| null; appsec_component_name?: string \| null; appsec_version_code?: string \| null; appsec_version_name?: string \| null; appsec_versions?: WorksRef[]; appsec_assignee?: string \| null; appsec_assignee_name?: string \| null; appsec_ticket_url?: string \| null; appsec_ticket_key?: string \| null; }` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |

Возвращает: `Promise<Project>`.

Прямые HTTP-вызовы:

- `PUT `/projects/${projectId}``; аргументы: `payload`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.put`

</details>

## getProjectMembers

[frontend/src/api.ts:489](../../../../frontend/src/api.ts#L489)

```typescript
async getProjectMembers(projectId: number) => Promise<ProjectMember[]>
```

Клиентский HTTP-метод: GET ``/projects/${projectId}/members``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |

Возвращает: `Promise<ProjectMember[]>`.

Прямые HTTP-вызовы:

- `GET `/projects/${projectId}/members``; аргументы: `нет`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.get`

</details>

## addProjectMember

[frontend/src/api.ts:494](../../../../frontend/src/api.ts#L494)

```typescript
async addProjectMember(projectId: number, userId: number) => Promise<void>
```

Клиентский HTTP-метод: POST ``/projects/${projectId}/members``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `userId` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<void>`.

Прямые HTTP-вызовы:

- `POST `/projects/${projectId}/members``; аргументы: `{ user_id: userId }`.

Явные throw в теле:

```typescript
new Error("Select a user")
```

<details>
<summary>Прямые вызовы в теле</summary>

- `api.post`

</details>

## removeProjectMember

[frontend/src/api.ts:501](../../../../frontend/src/api.ts#L501)

```typescript
async removeProjectMember(projectId: number, userId: number) => Promise<void>
```

Клиентский HTTP-метод: DELETE ``/projects/${projectId}/members/${userId}``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `userId` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<void>`.

Прямые HTTP-вызовы:

- `DELETE `/projects/${projectId}/members/${userId}``; аргументы: `нет`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.delete`

</details>

## getProjectActivity

[frontend/src/api.ts:506](../../../../frontend/src/api.ts#L506)

```typescript
async getProjectActivity(projectId: number, limit = 50) => Promise<ProjectActivityItem[]>
```

Лента активности проекта — доступна любому участнику (в отличие от админского /audit-logs).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `limit` | `number` | `50` | Максимальное число возвращаемых записей. |

Возвращает: `Promise<ProjectActivityItem[]>`.

Прямые HTTP-вызовы:

- `GET `/projects/${projectId}/activity``; аргументы: `{ params: { limit } }`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.get`

</details>

## listProjectNotes

[frontend/src/api.ts:511](../../../../frontend/src/api.ts#L511)

```typescript
async listProjectNotes(projectId: number) => Promise<ProjectNote[]>
```

Клиентский HTTP-метод: GET ``/projects/${projectId}/notes``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |

Возвращает: `Promise<ProjectNote[]>`.

Прямые HTTP-вызовы:

- `GET `/projects/${projectId}/notes``; аргументы: `нет`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.get`

</details>

## listProjectNotesActivity

[frontend/src/api.ts:526](../../../../frontend/src/api.ts#L526)

```typescript
async listProjectNotesActivity(projectId: number, limit = 30) => Promise<ProjectNoteActivity[]>
```

Клиентский HTTP-метод: GET ``/projects/${projectId}/notes-activity``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `limit` | `number` | `30` | Максимальное число возвращаемых записей. |

Возвращает: `Promise<ProjectNoteActivity[]>`.

Прямые HTTP-вызовы:

- `GET `/projects/${projectId}/notes-activity``; аргументы: `{ params: { limit } }`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.get`

</details>

## getProjectNote

[frontend/src/api.ts:537](../../../../frontend/src/api.ts#L537)

```typescript
async getProjectNote(projectId: number, noteId: number) => Promise<ProjectNote>
```

Клиентский HTTP-метод: GET ``/projects/${projectId}/notes/${noteId}``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `noteId` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<ProjectNote>`.

Прямые HTTP-вызовы:

- `GET `/projects/${projectId}/notes/${noteId}``; аргументы: `нет`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.get`

</details>

## createProjectNote

[frontend/src/api.ts:542](../../../../frontend/src/api.ts#L542)

```typescript
async createProjectNote(projectId: number, payload: { title: string; parent_id?: number | null; content?: string | null }) => Promise<ProjectNote>
```

Клиентский HTTP-метод: POST ``/projects/${projectId}/notes``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `payload` | `{ title: string; parent_id?: number \| null; content?: string \| null }` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |

Возвращает: `Promise<ProjectNote>`.

Прямые HTTP-вызовы:

- `POST `/projects/${projectId}/notes``; аргументы: `payload`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.post`
- `assertRequired`

</details>

## updateProjectNote

[frontend/src/api.ts:551](../../../../frontend/src/api.ts#L551)

```typescript
async updateProjectNote(projectId: number, noteId: number, payload: { title?: string; content?: string | null }) => Promise<ProjectNote>
```

Клиентский HTTP-метод: PUT ``/projects/${projectId}/notes/${noteId}``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `noteId` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `payload` | `{ title?: string; content?: string \| null }` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |

Возвращает: `Promise<ProjectNote>`.

Прямые HTTP-вызовы:

- `PUT `/projects/${projectId}/notes/${noteId}``; аргументы: `payload`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.put`
- `assertRequired`

</details>

## moveProjectNote

[frontend/src/api.ts:563](../../../../frontend/src/api.ts#L563)

```typescript
async moveProjectNote(projectId: number, noteId: number, payload: { parent_id?: number | null }) => Promise<ProjectNote>
```

Клиентский HTTP-метод: PATCH ``/projects/${projectId}/notes/${noteId}/move``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `noteId` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `payload` | `{ parent_id?: number \| null }` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |

Возвращает: `Promise<ProjectNote>`.

Прямые HTTP-вызовы:

- `PATCH `/projects/${projectId}/notes/${noteId}/move``; аргументы: `payload`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.patch`

</details>

## reorderProjectNotes

[frontend/src/api.ts:572](../../../../frontend/src/api.ts#L572)

```typescript
async reorderProjectNotes(projectId: number, payload: { parent_id?: number | null; items: Array<{ id: number; sort_order: number }> }) => Promise<ProjectNote[]>
```

Клиентский HTTP-метод: PATCH ``/projects/${projectId}/notes/reorder``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `payload` | `{ parent_id?: number \| null; items: Array<{ id: number; sort_order: number }> }` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |

Возвращает: `Promise<ProjectNote[]>`.

Прямые HTTP-вызовы:

- `PATCH `/projects/${projectId}/notes/reorder``; аргументы: `payload`.

Явные throw в теле:

```typescript
new Error("Provide at least one page to sort")
```

<details>
<summary>Прямые вызовы в теле</summary>

- `api.patch`

</details>

## deleteProjectNote

[frontend/src/api.ts:583](../../../../frontend/src/api.ts#L583)

```typescript
async deleteProjectNote(projectId: number, noteId: number) => Promise<void>
```

Клиентский HTTP-метод: DELETE ``/projects/${projectId}/notes/${noteId}``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `noteId` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<void>`.

Прямые HTTP-вызовы:

- `DELETE `/projects/${projectId}/notes/${noteId}``; аргументы: `нет`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.delete`

</details>

## listProjectCredentials

[frontend/src/api.ts:589](../../../../frontend/src/api.ts#L589)

```typescript
async listProjectCredentials(projectId: number) => Promise<ProjectCredential[]>
```

Клиентский HTTP-метод: GET ``/projects/${projectId}/credentials``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |

Возвращает: `Promise<ProjectCredential[]>`.

Прямые HTTP-вызовы:

- `GET `/projects/${projectId}/credentials``; аргументы: `нет`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.get`

</details>

## createProjectCredential

[frontend/src/api.ts:594](../../../../frontend/src/api.ts#L594)

```typescript
async createProjectCredential(projectId: number, payload: { username?: string | null; password: string; host?: string | null }) => Promise<ProjectCredential>
```

Клиентский HTTP-метод: POST ``/projects/${projectId}/credentials``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `payload` | `{ username?: string \| null; password: string; host?: string \| null }` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |

Возвращает: `Promise<ProjectCredential>`.

Прямые HTTP-вызовы:

- `POST `/projects/${projectId}/credentials``; аргументы: `payload`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.post`
- `assertRequired`

</details>

## updateProjectCredential

[frontend/src/api.ts:603](../../../../frontend/src/api.ts#L603)

```typescript
async updateProjectCredential(projectId: number, credentialId: number, payload: { username?: string | null; password?: string; host?: string | null }) => Promise<ProjectCredential>
```

Клиентский HTTP-метод: PUT ``/projects/${projectId}/credentials/${credentialId}``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `credentialId` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `payload` | `{ username?: string \| null; password?: string; host?: string \| null }` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |

Возвращает: `Promise<ProjectCredential>`.

Прямые HTTP-вызовы:

- `PUT `/projects/${projectId}/credentials/${credentialId}``; аргументы: `payload`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.put`

</details>

## deleteProjectCredential

[frontend/src/api.ts:614](../../../../frontend/src/api.ts#L614)

```typescript
async deleteProjectCredential(projectId: number, credentialId: number) => Promise<void>
```

Клиентский HTTP-метод: DELETE ``/projects/${projectId}/credentials/${credentialId}``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `credentialId` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<void>`.

Прямые HTTP-вызовы:

- `DELETE `/projects/${projectId}/credentials/${credentialId}``; аргументы: `нет`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.delete`

</details>

## listProjectNoteComments

[frontend/src/api.ts:618](../../../../frontend/src/api.ts#L618)

```typescript
async listProjectNoteComments(projectId: number, noteId: number) => Promise<PaginatedResponse<ProjectNoteComment>>
```

Клиентский HTTP-метод: GET ``/projects/${projectId}/notes/${noteId}/comments``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `noteId` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<PaginatedResponse<ProjectNoteComment>>`.

Прямые HTTP-вызовы:

- `GET `/projects/${projectId}/notes/${noteId}/comments``; аргументы: `{ params: { page: 1, size: 100 }, }`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.get`

</details>

## createProjectNoteComment

[frontend/src/api.ts:625](../../../../frontend/src/api.ts#L625)

```typescript
async createProjectNoteComment(projectId: number, noteId: number, content: string) => Promise<ProjectNoteComment>
```

Клиентский HTTP-метод: POST ``/projects/${projectId}/notes/${noteId}/comments``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `noteId` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `content` | `string` | `обязательный` | Текст содержимого; формат определяется вызывающим сервисом. |

Возвращает: `Promise<ProjectNoteComment>`.

Прямые HTTP-вызовы:

- `POST `/projects/${projectId}/notes/${noteId}/comments``; аргументы: `{ content }`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.post`
- `assertRequired`

</details>

## updateProjectNoteComment

[frontend/src/api.ts:635](../../../../frontend/src/api.ts#L635)

```typescript
async updateProjectNoteComment(projectId: number, noteId: number, commentId: number, content: string) => Promise<ProjectNoteComment>
```

Клиентский HTTP-метод: PUT ``/projects/${projectId}/notes/${noteId}/comments/${commentId}``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `noteId` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `commentId` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `content` | `string` | `обязательный` | Текст содержимого; формат определяется вызывающим сервисом. |

Возвращает: `Promise<ProjectNoteComment>`.

Прямые HTTP-вызовы:

- `PUT `/projects/${projectId}/notes/${noteId}/comments/${commentId}``; аргументы: `{ content }`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.put`
- `assertRequired`

</details>

## deleteProjectNoteComment

[frontend/src/api.ts:646](../../../../frontend/src/api.ts#L646)

```typescript
async deleteProjectNoteComment(projectId: number, noteId: number, commentId: number) => Promise<void>
```

Клиентский HTTP-метод: DELETE ``/projects/${projectId}/notes/${noteId}/comments/${commentId}``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `noteId` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `commentId` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<void>`.

Прямые HTTP-вызовы:

- `DELETE `/projects/${projectId}/notes/${noteId}/comments/${commentId}``; аргументы: `нет`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.delete`

</details>

## deleteProject

[frontend/src/api.ts:650](../../../../frontend/src/api.ts#L650)

```typescript
async deleteProject(projectId: number) => Promise<void>
```

Клиентский HTTP-метод: DELETE ``/projects/${projectId}``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |

Возвращает: `Promise<void>`.

Прямые HTTP-вызовы:

- `DELETE `/projects/${projectId}``; аргументы: `нет`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.delete`

</details>

## getHostCreationTimes

[frontend/src/api.ts:655](../../../../frontend/src/api.ts#L655)

```typescript
async getHostCreationTimes(projectId: number) => Promise<string[]>
```

Даты всех хостов (включая origin=ip) для графиков, без полных деревьев.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |

Возвращает: `Promise<string[]>`.

Прямые HTTP-вызовы:

- `GET `/projects/${projectId}/host-creation-times``; аргументы: `нет`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.get`

</details>

## getHosts

[frontend/src/api.ts:660](../../../../frontend/src/api.ts#L660)

```typescript
async getHosts(projectId: number) => Promise<PaginatedResponse<Host>>
```

Последовательно загружает все страницы по 200 хостов, включая полные дочерние коллекции. Возвращает объединённый список. Это совместимость текущего интерфейса, а не ограниченная серверная пагинация UI.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |

Возвращает: `Promise<PaginatedResponse<Host>>`.

Прямые HTTP-вызовы:

- `GET `/projects/${projectId}/hosts``; аргументы: `{ params: { page: 1, size, origin: "all" }, }`.
- `GET `/projects/${projectId}/hosts``; аргументы: `{ params: { page, size, origin: "all" }, }`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.get`
- `items.push`

</details>

## createHost

[frontend/src/api.ts:681](../../../../frontend/src/api.ts#L681)

```typescript
async createHost(projectId: number, payload: { ip_address?: string; ip_addresses?: string[]; hostname?: string; notes?: string; status?: "up" | "down" | "unknown"; os_type?: OsType; }) => Promise<Host>
```

Клиентский HTTP-метод: POST ``/projects/${projectId}/hosts``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `payload` | `{ ip_address?: string; ip_addresses?: string[]; hostname?: string; notes?: string; status?: "up" \| "down" \| "unknown"; os_type?: OsType; }` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |

Возвращает: `Promise<Host>`.

Прямые HTTP-вызовы:

- `POST `/projects/${projectId}/hosts``; аргументы: `payload`.

Явные throw в теле:

```typescript
new Error('Provide at least "IP address" or "Hostname"')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `api.post`
- `isBlank`

</details>

## getHost

[frontend/src/api.ts:699](../../../../frontend/src/api.ts#L699)

```typescript
async getHost(projectId: number, hostId: number) => Promise<HostDetails>
```

Клиентский HTTP-метод: GET ``/projects/${projectId}/hosts/${hostId}``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `hostId` | `number` | `обязательный` | ID хоста в API. |

Возвращает: `Promise<HostDetails>`.

Прямые HTTP-вызовы:

- `GET `/projects/${projectId}/hosts/${hostId}``; аргументы: `нет`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.get`

</details>

## updateHost

[frontend/src/api.ts:704](../../../../frontend/src/api.ts#L704)

```typescript
async updateHost(projectId: number, hostId: number, payload: { ip_address?: string; ip_addresses?: Array<{ ip_address: string; label?: string | null; is_primary?: boolean }>; hostname?: string; notes?: string | null; status?: "up" | "down" | "unknown"; os_type?: OsType; }) => Promise<Host>
```

Клиентский HTTP-метод: PUT ``/projects/${projectId}/hosts/${hostId}``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `hostId` | `number` | `обязательный` | ID хоста в API. |
| `payload` | `{ ip_address?: string; ip_addresses?: Array<{ ip_address: string; label?: string \| null; is_primary?: boolean }>; hostname?: string; notes?: string \| null; status?: "up" \| "down" \| "unknown"; os_type?: OsType; }` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |

Возвращает: `Promise<Host>`.

Прямые HTTP-вызовы:

- `PUT `/projects/${projectId}/hosts/${hostId}``; аргументы: `payload`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.put`

</details>

## deleteHost

[frontend/src/api.ts:720](../../../../frontend/src/api.ts#L720)

```typescript
async deleteHost(projectId: number, hostId: number) => Promise<void>
```

Клиентский HTTP-метод: DELETE ``/projects/${projectId}/hosts/${hostId}``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `hostId` | `number` | `обязательный` | ID хоста в API. |

Возвращает: `Promise<void>`.

Прямые HTTP-вызовы:

- `DELETE `/projects/${projectId}/hosts/${hostId}``; аргументы: `нет`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.delete`

</details>

## changeIpAddress

[frontend/src/api.ts:724](../../../../frontend/src/api.ts#L724)

```typescript
async changeIpAddress(projectId: number, previous: string, address: string) => Promise<IpAddressChangeResult>
```

Клиентский HTTP-метод: PUT ``/projects/${projectId}/ip-addresses/${encodeURIComponent(previous)}``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `previous` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `address` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<IpAddressChangeResult>`.

Прямые HTTP-вызовы:

- `PUT `/projects/${projectId}/ip-addresses/${encodeURIComponent(previous)}``; аргументы: `{ ip_address: address }`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.put`
- `assertRequired`
- `encodeURIComponent`

</details>

## getHiddenIps

[frontend/src/api.ts:733](../../../../frontend/src/api.ts#L733)

```typescript
async getHiddenIps(projectId: number) => Promise<string[]>
```

Клиентский HTTP-метод: GET ``/projects/${projectId}/hidden-ips``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |

Возвращает: `Promise<string[]>`.

Прямые HTTP-вызовы:

- `GET `/projects/${projectId}/hidden-ips``; аргументы: `нет`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.get`

</details>

## hideIp

[frontend/src/api.ts:739](../../../../frontend/src/api.ts#L739)

```typescript
async hideIp(projectId: number, ip: string) => Promise<void>
```

Скрывает адрес из списка IP (сносит отдельную IP-запись, привязку к хостам хранит).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `ip` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<void>`.

Прямые HTTP-вызовы:

- `POST `/projects/${projectId}/hidden-ips``; аргументы: `{ ip_address: ip }`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.post`

</details>

## unhideIp

[frontend/src/api.ts:744](../../../../frontend/src/api.ts#L744)

```typescript
async unhideIp(projectId: number, ip: string) => Promise<void>
```

Возвращает адрес в список IP.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `ip` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<void>`.

Прямые HTTP-вызовы:

- `DELETE `/projects/${projectId}/hidden-ips/${encodeURIComponent(ip)}``; аргументы: `нет`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.delete`
- `encodeURIComponent`

</details>

## startHostFarm

[frontend/src/api.ts:751](../../../../frontend/src/api.ts#L751)

```typescript
async startHostFarm(projectId: number, raw: string) => Promise<HostFarmJob>
```

Запускает фоновый пробив вставленного списка; возвращает созданную задачу.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `raw` | `string` | `обязательный` | Исходное значение до нормализации/разбора. |

Возвращает: `Promise<HostFarmJob>`.

Прямые HTTP-вызовы:

- `POST `/projects/${projectId}/host-farm``; аргументы: `{ raw }`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.post`
- `assertRequired`

</details>

## getHostFarmJob

[frontend/src/api.ts:758](../../../../frontend/src/api.ts#L758)

```typescript
async getHostFarmJob(projectId: number, jobId: number) => Promise<HostFarmJob>
```

Статус задачи фермы — фронт опрашивает до status === "done" | "failed".

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `jobId` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<HostFarmJob>`.

Прямые HTTP-вызовы:

- `GET `/projects/${projectId}/host-farm/jobs/${jobId}``; аргументы: `нет`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.get`

</details>

## startIpFarm

[frontend/src/api.ts:764](../../../../frontend/src/api.ts#L764)

```typescript
async startIpFarm(projectId: number, raw: string) => Promise<IpFarmJob>
```

Запускает обратный резолв + пробив вставленного списка IP-адресов.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `raw` | `string` | `обязательный` | Исходное значение до нормализации/разбора. |

Возвращает: `Promise<IpFarmJob>`.

Прямые HTTP-вызовы:

- `POST `/projects/${projectId}/ip-farm``; аргументы: `{ raw }`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.post`
- `assertRequired`

</details>

## getIpFarmJob

[frontend/src/api.ts:771](../../../../frontend/src/api.ts#L771)

```typescript
async getIpFarmJob(projectId: number, jobId: number) => Promise<IpFarmJob>
```

Статус задачи фермы IP — фронт опрашивает до status === "done" | "failed".

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `jobId` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<IpFarmJob>`.

Прямые HTTP-вызовы:

- `GET `/projects/${projectId}/ip-farm/jobs/${jobId}``; аргументы: `нет`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.get`

</details>

## startJsScan

[frontend/src/api.ts:777](../../../../frontend/src/api.ts#L777)

```typescript
async startJsScan(projectId: number, raw = "") => Promise<JsFarmJob>
```

Запускает скан JS всех доменов проекта (raw пусто) или переданного списка.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `raw` | `string` | `""` | Исходное значение до нормализации/разбора. |

Возвращает: `Promise<JsFarmJob>`.

Прямые HTTP-вызовы:

- `POST `/projects/${projectId}/js-farm``; аргументы: `{ raw }`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.post`

</details>

## getJsScanJob

[frontend/src/api.ts:783](../../../../frontend/src/api.ts#L783)

```typescript
async getJsScanJob(projectId: number, jobId: number) => Promise<JsFarmJob>
```

Статус задачи фермы JS — фронт опрашивает до status === "done" | "failed".

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `jobId` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<JsFarmJob>`.

Прямые HTTP-вызовы:

- `GET `/projects/${projectId}/js-farm/jobs/${jobId}``; аргументы: `нет`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.get`

</details>

## getJsFilesPage

[frontend/src/api.ts:791](../../../../frontend/src/api.ts#L791)

```typescript
async getJsFilesPage(projectId: number, page: number, size: number) => Promise<PaginatedResponse<JsFile>>
```

JS-файлы проекта с находками — раздел JS группирует их по хосту.
Постранично: раздел стримит страницы и склеивает их на клиенте, чтобы
проекты с тысячами файлов не упирались в один огромный ответ.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `page` | `number` | `обязательный` | Номер страницы, начиная с 1. |
| `size` | `number` | `обязательный` | Число элементов страницы; верхняя граница задаётся маршрутом. |

Возвращает: `Promise<PaginatedResponse<JsFile>>`.

Прямые HTTP-вызовы:

- `GET `/projects/${projectId}/js-files``; аргументы: `{ params: { page, size }, }`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.get`

</details>

## bulkDeleteJsFiles

[frontend/src/api.ts:803](../../../../frontend/src/api.ts#L803)

```typescript
async bulkDeleteJsFiles(projectId: number, ids: number[]) => Promise<number>
```

Массово удаляет JS-файлы по id. Возвращает `deleted`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `ids` | `number[]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<number>`.

Прямые HTTP-вызовы:

- `POST `/projects/${projectId}/js-files/bulk-delete``; аргументы: `{ ids }`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.post`

</details>

## deleteJsFilesForHost

[frontend/src/api.ts:809](../../../../frontend/src/api.ts#L809)

```typescript
async deleteJsFilesForHost(projectId: number, hostId: number) => Promise<void>
```

Удалить все JS-находки указанного хоста в проекте.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `hostId` | `number` | `обязательный` | ID хоста в API. |

Возвращает: `Promise<void>`.

Прямые HTTP-вызовы:

- `DELETE `/projects/${projectId}/js-files/hosts/${hostId}``; аргументы: `нет`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.delete`

</details>

## downloadJsArchive

[frontend/src/api.ts:815](../../../../frontend/src/api.ts#L815)

```typescript
async downloadJsArchive(projectId: number, hostId?: number) => Promise<Blob>
```

Zip найденных .js. `hostId` сужает архив до одного хоста; без него — весь проект.
Файлы не хранятся, поэтому бэкенд докачивает их по URL по требованию.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `hostId` | `number` | `undefined (optional)` | ID хоста в API. |

Возвращает: `Promise<Blob>`.

Прямые HTTP-вызовы:

- `GET `/projects/${projectId}/js-files/archive``; аргументы: `{ params: hostId != null ? { host_id: hostId } : {}, responseType: "blob", }`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.get`

</details>

## getPorts

[frontend/src/api.ts:823](../../../../frontend/src/api.ts#L823)

```typescript
async getPorts(projectId: number, hostId: number) => Promise<Port[]>
```

Клиентский HTTP-метод: GET ``/projects/${projectId}/hosts/${hostId}/ports``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `hostId` | `number` | `обязательный` | ID хоста в API. |

Возвращает: `Promise<Port[]>`.

Прямые HTTP-вызовы:

- `GET `/projects/${projectId}/hosts/${hostId}/ports``; аргументы: `нет`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.get`

</details>

## createPort

[frontend/src/api.ts:828](../../../../frontend/src/api.ts#L828)

```typescript
async createPort(projectId: number, hostId: number, payload: { ip_address_id: number; port_number: number; protocol?: "tcp" | "udp"; state?: "open" | "closed" | "filtered"; }) => Promise<Port>
```

Клиентский HTTP-метод: POST ``/projects/${projectId}/hosts/${hostId}/ports``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `hostId` | `number` | `обязательный` | ID хоста в API. |
| `payload` | `{ ip_address_id: number; port_number: number; protocol?: "tcp" \| "udp"; state?: "open" \| "closed" \| "filtered"; }` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |

Возвращает: `Promise<Port>`.

Прямые HTTP-вызовы:

- `POST `/projects/${projectId}/hosts/${hostId}/ports``; аргументы: `payload`.

Явные throw в теле:

```typescript
new Error("Port must be a number")
new Error("No IP address selected")
```

<details>
<summary>Прямые вызовы в теле</summary>

- `Number.isFinite`
- `api.post`

</details>

## updatePort

[frontend/src/api.ts:848](../../../../frontend/src/api.ts#L848)

```typescript
async updatePort(projectId: number, hostId: number, portId: number, payload: { ip_address_id?: number; port_number?: number; protocol?: "tcp" | "udp"; state?: "open" | "closed" | "filtered"; }) => Promise<Port>
```

Клиентский HTTP-метод: PUT ``/projects/${projectId}/hosts/${hostId}/ports/${portId}``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `hostId` | `number` | `обязательный` | ID хоста в API. |
| `portId` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `payload` | `{ ip_address_id?: number; port_number?: number; protocol?: "tcp" \| "udp"; state?: "open" \| "closed" \| "filtered"; }` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |

Возвращает: `Promise<Port>`.

Прямые HTTP-вызовы:

- `PUT `/projects/${projectId}/hosts/${hostId}/ports/${portId}``; аргументы: `payload`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.put`

</details>

## deletePort

[frontend/src/api.ts:863](../../../../frontend/src/api.ts#L863)

```typescript
async deletePort(projectId: number, hostId: number, portId: number) => Promise<void>
```

Клиентский HTTP-метод: DELETE ``/projects/${projectId}/hosts/${hostId}/ports/${portId}``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `hostId` | `number` | `обязательный` | ID хоста в API. |
| `portId` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<void>`.

Прямые HTTP-вызовы:

- `DELETE `/projects/${projectId}/hosts/${hostId}/ports/${portId}``; аргументы: `нет`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.delete`

</details>

## getServices

[frontend/src/api.ts:867](../../../../frontend/src/api.ts#L867)

```typescript
async getServices(projectId: number, hostId: number, portId: number) => Promise<Service[]>
```

Клиентский HTTP-метод: GET ``/projects/${projectId}/hosts/${hostId}/ports/${portId}/services``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `hostId` | `number` | `обязательный` | ID хоста в API. |
| `portId` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<Service[]>`.

Прямые HTTP-вызовы:

- `GET `/projects/${projectId}/hosts/${hostId}/ports/${portId}/services``; аргументы: `нет`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.get`

</details>

## createService

[frontend/src/api.ts:872](../../../../frontend/src/api.ts#L872)

```typescript
async createService(projectId: number, hostId: number, portId: number, payload: { name: string; version?: string; banner?: string }) => Promise<Service>
```

Клиентский HTTP-метод: POST ``/projects/${projectId}/hosts/${hostId}/ports/${portId}/services``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `hostId` | `number` | `обязательный` | ID хоста в API. |
| `portId` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `payload` | `{ name: string; version?: string; banner?: string }` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |

Возвращает: `Promise<Service>`.

Прямые HTTP-вызовы:

- `POST `/projects/${projectId}/hosts/${hostId}/ports/${portId}/services``; аргументы: `payload`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.post`
- `assertRequired`

</details>

## updateService

[frontend/src/api.ts:883](../../../../frontend/src/api.ts#L883)

```typescript
async updateService(projectId: number, hostId: number, portId: number, serviceId: number, payload: { name?: string; version?: string; banner?: string }) => Promise<Service>
```

Клиентский HTTP-метод: PUT ``/projects/${projectId}/hosts/${hostId}/ports/${portId}/services/${serviceId}``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `hostId` | `number` | `обязательный` | ID хоста в API. |
| `portId` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `serviceId` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `payload` | `{ name?: string; version?: string; banner?: string }` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |

Возвращает: `Promise<Service>`.

Прямые HTTP-вызовы:

- `PUT `/projects/${projectId}/hosts/${hostId}/ports/${portId}/services/${serviceId}``; аргументы: `payload`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.put`
- `assertRequired`

</details>

## deleteService

[frontend/src/api.ts:897](../../../../frontend/src/api.ts#L897)

```typescript
async deleteService(projectId: number, hostId: number, portId: number, serviceId: number) => Promise<void>
```

Клиентский HTTP-метод: DELETE ``/projects/${projectId}/hosts/${hostId}/ports/${portId}/services/${serviceId}``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `hostId` | `number` | `обязательный` | ID хоста в API. |
| `portId` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `serviceId` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<void>`.

Прямые HTTP-вызовы:

- `DELETE `/projects/${projectId}/hosts/${hostId}/ports/${portId}/services/${serviceId}``; аргументы: `нет`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.delete`

</details>

## listEndpointComments

[frontend/src/api.ts:902](../../../../frontend/src/api.ts#L902)

```typescript
async listEndpointComments(projectId: number, hostId: number, endpointId: number, page = 1) => Promise<PaginatedResponse<EndpointComment>>
```

Сохранённое обсуждение эндпоинта, новые комментарии первыми.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `hostId` | `number` | `обязательный` | ID хоста в API. |
| `endpointId` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `page` | `number` | `1` | Номер страницы, начиная с 1. |

Возвращает: `Promise<PaginatedResponse<EndpointComment>>`.

Прямые HTTP-вызовы:

- `GET `/projects/${projectId}/hosts/${hostId}/endpoints/${endpointId}/comments``; аргументы: `{ params: { page, size: 50 } }`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.get`

</details>

## createEndpointComment

[frontend/src/api.ts:907](../../../../frontend/src/api.ts#L907)

```typescript
async createEndpointComment(projectId: number, hostId: number, endpointId: number, content: string) => Promise<EndpointComment>
```

Клиентский HTTP-метод: POST ``/projects/${projectId}/hosts/${hostId}/endpoints/${endpointId}/comments``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `hostId` | `number` | `обязательный` | ID хоста в API. |
| `endpointId` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `content` | `string` | `обязательный` | Текст содержимого; формат определяется вызывающим сервисом. |

Возвращает: `Promise<EndpointComment>`.

Прямые HTTP-вызовы:

- `POST `/projects/${projectId}/hosts/${hostId}/endpoints/${endpointId}/comments``; аргументы: `{ content }`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.post`
- `assertRequired`

</details>

## getEndpoints

[frontend/src/api.ts:913](../../../../frontend/src/api.ts#L913)

```typescript
async getEndpoints(projectId: number, hostId: number) => Promise<Endpoint[]>
```

Клиентский HTTP-метод: GET ``/projects/${projectId}/hosts/${hostId}/endpoints``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `hostId` | `number` | `обязательный` | ID хоста в API. |

Возвращает: `Promise<Endpoint[]>`.

Прямые HTTP-вызовы:

- `GET `/projects/${projectId}/hosts/${hostId}/endpoints``; аргументы: `нет`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.get`

</details>

## createEndpoint

[frontend/src/api.ts:918](../../../../frontend/src/api.ts#L918)

```typescript
async createEndpoint(projectId: number, hostId: number, payload: { path?: string; method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS" | "TRACE" | "QUERY"; description?: string | null; request_raw?: string; query_params?: { name: string; value?: string | null; required?: boolean; description?: string | null }[]; request_body?: string | null; request_content_type?: string | null; request_headers?: EndpointRequestHeader[]; }) => Promise<Endpoint>
```

Клиентский HTTP-метод: POST ``/projects/${projectId}/hosts/${hostId}/endpoints``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `hostId` | `number` | `обязательный` | ID хоста в API. |
| `payload` | `{ path?: string; method?: "GET" \| "POST" \| "PUT" \| "PATCH" \| "DELETE" \| "HEAD" \| "OPTIONS" \| "TRACE" \| "QUERY"; description?: string \| null; request_raw?: string; query_params?: { name: string; value?: string \| null; required?: boolean; description?: string \| null }[]; request_body?: string \| null; request_content_type?: string \| null; request_headers?: EndpointRequestHeader[]; }` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |

Возвращает: `Promise<Endpoint>`.

Прямые HTTP-вызовы:

- `POST `/projects/${projectId}/hosts/${hostId}/endpoints``; аргументы: `payload`.

Явные throw в теле:

```typescript
new Error('Provide at least "Path" or "Raw request"')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `api.post`
- `isBlank`

</details>

## updateEndpoint

[frontend/src/api.ts:939](../../../../frontend/src/api.ts#L939)

```typescript
async updateEndpoint(projectId: number, hostId: number, endpointId: number, payload: { path?: string; method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS" | "TRACE" | "QUERY"; description?: string | null; request_raw?: string; query_params?: { name: string; value?: string | null; required?: boolean; description?: string | null }[]; request_body?: string | null; request_content_type?: string | null; request_headers?: EndpointRequestHeader[]; }) => Promise<Endpoint>
```

Клиентский HTTP-метод: PUT ``/projects/${projectId}/hosts/${hostId}/endpoints/${endpointId}``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `hostId` | `number` | `обязательный` | ID хоста в API. |
| `endpointId` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `payload` | `{ path?: string; method?: "GET" \| "POST" \| "PUT" \| "PATCH" \| "DELETE" \| "HEAD" \| "OPTIONS" \| "TRACE" \| "QUERY"; description?: string \| null; request_raw?: string; query_params?: { name: string; value?: string \| null; required?: boolean; description?: string \| null }[]; request_body?: string \| null; request_content_type?: string \| null; request_headers?: EndpointRequestHeader[]; }` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |

Возвращает: `Promise<Endpoint>`.

Прямые HTTP-вызовы:

- `PUT `/projects/${projectId}/hosts/${hostId}/endpoints/${endpointId}``; аргументы: `payload`.

Явные throw в теле:

```typescript
new Error('Provide at least "Path" or "Raw request"')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `api.put`
- `isBlank`

</details>

## deleteEndpoint

[frontend/src/api.ts:961](../../../../frontend/src/api.ts#L961)

```typescript
async deleteEndpoint(projectId: number, hostId: number, endpointId: number) => Promise<void>
```

Клиентский HTTP-метод: DELETE ``/projects/${projectId}/hosts/${hostId}/endpoints/${endpointId}``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `hostId` | `number` | `обязательный` | ID хоста в API. |
| `endpointId` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<void>`.

Прямые HTTP-вызовы:

- `DELETE `/projects/${projectId}/hosts/${hostId}/endpoints/${endpointId}``; аргументы: `нет`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.delete`

</details>

## getVulnerabilities

[frontend/src/api.ts:965](../../../../frontend/src/api.ts#L965)

```typescript
async getVulnerabilities(projectId: number) => Promise<PaginatedResponse<Vulnerability>>
```

В текущем интерфейсе читает только первую страницу из 100 находок. Вариант исправления для больших проектов вынесен владельцу на согласование; API поддерживает page/size отдельно от этого helper.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |

Возвращает: `Promise<PaginatedResponse<Vulnerability>>`.

Прямые HTTP-вызовы:

- `GET `/projects/${projectId}/vulnerabilities``; аргументы: `{ params: { page: 1, size: 100 }, }`.
- `GET `/projects/${projectId}/vulnerabilities``; аргументы: `{ params: { page, size: 100 }, }`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Math.ceil`
- `api.get`
- `first.items.map`
- `items.set`
- `items.values`

</details>

## createVulnerability

[frontend/src/api.ts:984](../../../../frontend/src/api.ts#L984)

```typescript
async createVulnerability(projectId: number, payload: { host_id: number; title: string; description?: string | null; // Необязательно: бэкенд по умолчанию ставит "unknown" (критичность не определена). severity?: "critical" | "high" | "medium" | "low" | "info" | "unrealized"; cvss_version?: "4.0" | null; cvss_score?: number | null; cvss_vector?: string | null; cwe_id?: string | null; status?: "open" | "in_progress" | "problem_analysis" | "need_info" | "paused" | "resolved" | "closed" | "cancelled" | "sent_by_mistake"; workflow_steps?: Array<{ id: string; description?: string | null; image_file_ids?: number[]; endpoint_id?: number | null; endpoint_request_raw?: string | null; }>; steps_to_reproduce?: string | null; impact?: string | null; recommendations?: string | null; }) => Promise<Vulnerability>
```

Клиентский HTTP-метод: POST ``/projects/${projectId}/vulnerabilities``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `payload` | `{ host_id: number; title: string; description?: string \| null; // Необязательно: бэкенд по умолчанию ставит "unknown" (критичность не определена). severity?: "critical" \| "high" \| "medium" \| "low" \| "info" \| "unrealized"; cvss_version?: "4.0" \| null; cvss_score?: number \| null; cvss_vector?: string \| null; cwe_id?: string \| null; status?: "open" \| "in_progress" \| "problem_analysis" \| "need_info" \| "paused" \| "resolved" \| "closed" \| "cancelled" \| "sent_by_mistake"; workflow_steps?: Array<{ id: string; description?: string \| null; image_file_ids?: number[]; endpoint_id?: number \| null; endpoint_request_raw?: string \| null; }>; steps_to_reproduce?: string \| null; impact?: string \| null; recommendations?: string \| null; }` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |

Возвращает: `Promise<Vulnerability>`.

Прямые HTTP-вызовы:

- `POST `/projects/${projectId}/vulnerabilities``; аргументы: `payload`.

Явные throw в теле:

```typescript
new Error("Select a host")
```

<details>
<summary>Прямые вызовы в теле</summary>

- `api.post`
- `assertRequired`

</details>

## updateVulnerability

[frontend/src/api.ts:1017](../../../../frontend/src/api.ts#L1017)

```typescript
async updateVulnerability(projectId: number, vulnerabilityId: number, payload: { title?: string; description?: string | null; severity?: "critical" | "high" | "medium" | "low" | "info" | "unrealized"; cvss_version?: "4.0" | null; cvss_score?: number | null; cvss_vector?: string | null; cwe_id?: string | null; status?: "open" | "in_progress" | "problem_analysis" | "need_info" | "paused" | "resolved" | "closed" | "cancelled" | "sent_by_mistake"; workflow_steps?: Array<{ id: string; description?: string | null; image_file_ids?: number[]; endpoint_id?: number | null; endpoint_request_raw?: string | null; }>; steps_to_reproduce?: string | null; impact?: string | null; recommendations?: string | null; }) => Promise<Vulnerability>
```

Клиентский HTTP-метод: PUT ``/projects/${projectId}/vulnerabilities/${vulnerabilityId}``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `vulnerabilityId` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `payload` | `{ title?: string; description?: string \| null; severity?: "critical" \| "high" \| "medium" \| "low" \| "info" \| "unrealized"; cvss_version?: "4.0" \| null; cvss_score?: number \| null; cvss_vector?: string \| null; cwe_id?: string \| null; status?: "open" \| "in_progress" \| "problem_analysis" \| "need_info" \| "paused" \| "resolved" \| "closed" \| "cancelled" \| "sent_by_mistake"; workflow_steps?: Array<{ id: string; description?: string \| null; image_file_ids?: number[]; endpoint_id?: number \| null; endpoint_request_raw?: string \| null; }>; steps_to_reproduce?: string \| null; impact?: string \| null; recommendations?: string \| null; }` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |

Возвращает: `Promise<Vulnerability>`.

Прямые HTTP-вызовы:

- `PUT `/projects/${projectId}/vulnerabilities/${vulnerabilityId}``; аргументы: `payload`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.put`
- `assertRequired`

</details>

## deleteVulnerability

[frontend/src/api.ts:1048](../../../../frontend/src/api.ts#L1048)

```typescript
async deleteVulnerability(projectId: number, vulnerabilityId: number) => Promise<void>
```

Клиентский HTTP-метод: DELETE ``/projects/${projectId}/vulnerabilities/${vulnerabilityId}``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `vulnerabilityId` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<void>`.

Прямые HTTP-вызовы:

- `DELETE `/projects/${projectId}/vulnerabilities/${vulnerabilityId}``; аргументы: `нет`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.delete`

</details>

## getVulnerabilityTaskTrackerLink

[frontend/src/api.ts:1052](../../../../frontend/src/api.ts#L1052)

```typescript
async getVulnerabilityTaskTrackerLink(projectId: number, vulnerabilityId: number) => Promise<TaskTrackerIssueLink | null>
```

В теле вызывает `getVulnerabilityWorksLink`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `vulnerabilityId` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<TaskTrackerIssueLink \| null>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `getVulnerabilityWorksLink`

</details>

## exportVulnerabilityToTaskTracker

[frontend/src/api.ts:1057](../../../../frontend/src/api.ts#L1057)

```typescript
async exportVulnerabilityToTaskTracker(projectId: number, vulnerabilityId: number) => Promise<TaskTrackerIssueLink>
```

В теле вызывает `exportVulnerabilityToWorks`, `getVulnerabilityTaskTrackerLink`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `vulnerabilityId` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<TaskTrackerIssueLink>`.

<details>
<summary>Прямые вызовы в теле</summary>

- `exportVulnerabilityToWorks`
- `getVulnerabilityTaskTrackerLink`

</details>

## getWorksConfig

[frontend/src/api.ts:1064](../../../../frontend/src/api.ts#L1064)

```typescript
async getWorksConfig() => Promise<WorksConfig>
```

Клиентский HTTP-метод: GET `"/works/config"`. Использует общий axios-клиент с cookie и обработкой обновления сессии.

Возвращает: `Promise<WorksConfig>`.

Прямые HTTP-вызовы:

- `GET "/works/config"`; аргументы: `нет`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.get`

</details>

## findWorksComponents

[frontend/src/api.ts:1070](../../../../frontend/src/api.ts#L1070)

```typescript
async findWorksComponents(q: string) => Promise<WorksRef[]>
```

Typeahead по компонентам Works (имя→UUID).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `q` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<WorksRef[]>`.

Прямые HTTP-вызовы:

- `GET "/works/components"`; аргументы: `{ params: { q } }`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.get`

</details>

## findWorksVersions

[frontend/src/api.ts:1076](../../../../frontend/src/api.ts#L1076)

```typescript
async findWorksVersions(q: string) => Promise<WorksRef[]>
```

Typeahead по версиям Works (имя→UUID).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `q` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<WorksRef[]>`.

Прямые HTTP-вызовы:

- `GET "/works/versions"`; аргументы: `{ params: { q } }`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.get`

</details>

## getVulnerabilityWorksLink

[frontend/src/api.ts:1082](../../../../frontend/src/api.ts#L1082)

```typescript
async getVulnerabilityWorksLink(projectId: number, vulnerabilityId: number) => Promise<WorksIssueLink | null>
```

Текущая связь уязвимости с тикетом Works (или null).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `vulnerabilityId` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<WorksIssueLink \| null>`.

Прямые HTTP-вызовы:

- `GET `/projects/${projectId}/vulnerabilities/${vulnerabilityId}/works``; аргументы: `нет`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.get`

</details>

## exportVulnerabilityToWorks

[frontend/src/api.ts:1088](../../../../frontend/src/api.ts#L1088)

```typescript
async exportVulnerabilityToWorks(projectId: number, vulnerabilityId: number, assignee?: string | null) => Promise<WorksIssueLink>
```

Экспорт уязвимости в AppSec (создание тикета bug_appsec в STS).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `vulnerabilityId` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `assignee` | `string \| null` | `undefined (optional)` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<WorksIssueLink>`.

Прямые HTTP-вызовы:

- `POST `/projects/${projectId}/vulnerabilities/${vulnerabilityId}/works/export``; аргументы: `{ assignee: assignee ?? null }`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.post`

</details>

## getVulnerability

[frontend/src/api.ts:1100](../../../../frontend/src/api.ts#L1100)

```typescript
async getVulnerability(projectId: number, vulnerabilityId: number) => Promise<VulnerabilityDetails>
```

Клиентский HTTP-метод: GET ``/projects/${projectId}/vulnerabilities/${vulnerabilityId}``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `vulnerabilityId` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<VulnerabilityDetails>`.

Прямые HTTP-вызовы:

- `GET `/projects/${projectId}/vulnerabilities/${vulnerabilityId}``; аргументы: `нет`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.get`

</details>

## getHostVulnerabilities

[frontend/src/api.ts:1105](../../../../frontend/src/api.ts#L1105)

```typescript
async getHostVulnerabilities(projectId: number, hostId: number) => Promise<PaginatedResponse<Vulnerability>>
```

Клиентский HTTP-метод: GET ``/projects/${projectId}/hosts/${hostId}/vulnerabilities``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `hostId` | `number` | `обязательный` | ID хоста в API. |

Возвращает: `Promise<PaginatedResponse<Vulnerability>>`.

Прямые HTTP-вызовы:

- `GET `/projects/${projectId}/hosts/${hostId}/vulnerabilities``; аргументы: `{ params: { page: 1, size: 100 }, }`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.get`

</details>

## addVulnerabilityAsset

[frontend/src/api.ts:1112](../../../../frontend/src/api.ts#L1112)

```typescript
async addVulnerabilityAsset(projectId: number, vulnerabilityId: number, payload: { asset_type: "host" | "port" | "service" | "endpoint"; asset_id: number; }) => Promise<VulnerabilityAsset>
```

Клиентский HTTP-метод: POST ``/projects/${projectId}/vulnerabilities/${vulnerabilityId}/assets``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `vulnerabilityId` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `payload` | `{ asset_type: "host" \| "port" \| "service" \| "endpoint"; asset_id: number; }` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |

Возвращает: `Promise<VulnerabilityAsset>`.

Прямые HTTP-вызовы:

- `POST `/projects/${projectId}/vulnerabilities/${vulnerabilityId}/assets``; аргументы: `payload`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.post`

</details>

## deleteVulnerabilityAsset

[frontend/src/api.ts:1124](../../../../frontend/src/api.ts#L1124)

```typescript
async deleteVulnerabilityAsset(projectId: number, vulnerabilityId: number, assetLinkId: number) => Promise<void>
```

Клиентский HTTP-метод: DELETE ``/projects/${projectId}/vulnerabilities/${vulnerabilityId}/assets/${assetLinkId}``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `vulnerabilityId` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `assetLinkId` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<void>`.

Прямые HTTP-вызовы:

- `DELETE `/projects/${projectId}/vulnerabilities/${vulnerabilityId}/assets/${assetLinkId}``; аргументы: `нет`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.delete`

</details>

## listVulnerabilityFiles

[frontend/src/api.ts:1128](../../../../frontend/src/api.ts#L1128)

```typescript
async listVulnerabilityFiles(projectId: number, vulnerabilityId: number) => Promise<VulnerabilityFile[]>
```

Клиентский HTTP-метод: GET ``/projects/${projectId}/vulnerabilities/${vulnerabilityId}/files``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `vulnerabilityId` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<VulnerabilityFile[]>`.

Прямые HTTP-вызовы:

- `GET `/projects/${projectId}/vulnerabilities/${vulnerabilityId}/files``; аргументы: `нет`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.get`

</details>

## uploadVulnerabilityFile

[frontend/src/api.ts:1133](../../../../frontend/src/api.ts#L1133)

```typescript
async uploadVulnerabilityFile(projectId: number, vulnerabilityId: number, file: File) => Promise<VulnerabilityFile>
```

Клиентский HTTP-метод: POST ``/projects/${projectId}/vulnerabilities/${vulnerabilityId}/files``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `vulnerabilityId` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `file` | `File` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<VulnerabilityFile>`.

Прямые HTTP-вызовы:

- `POST `/projects/${projectId}/vulnerabilities/${vulnerabilityId}/files``; аргументы: `formData / { headers: { "Content-Type": "multipart/form-data" }, }`.

Явные throw в теле:

```typescript
new Error("Select a file")
```

<details>
<summary>Прямые вызовы в теле</summary>

- `api.post`
- `formData.append`

</details>

## deleteVulnerabilityFile

[frontend/src/api.ts:1145](../../../../frontend/src/api.ts#L1145)

```typescript
async deleteVulnerabilityFile(projectId: number, vulnerabilityId: number, fileId: number) => Promise<void>
```

Клиентский HTTP-метод: DELETE ``/projects/${projectId}/vulnerabilities/${vulnerabilityId}/files/${fileId}``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `vulnerabilityId` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `fileId` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<void>`.

Прямые HTTP-вызовы:

- `DELETE `/projects/${projectId}/vulnerabilities/${vulnerabilityId}/files/${fileId}``; аргументы: `нет`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.delete`

</details>

## uploadProjectImage

[frontend/src/api.ts:1151](../../../../frontend/src/api.ts#L1151)

```typescript
async uploadProjectImage(projectId: number, file: File) => Promise<{ url: string }>
```

Uploads an inline image (pasted into a note / markdown field) and returns the
served URL to embed as `![alt](url)`. Backed by POST /projects/{id}/images.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `file` | `File` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<{ url: string }>`.

Прямые HTTP-вызовы:

- `POST `/projects/${projectId}/images``; аргументы: `formData / { headers: { "Content-Type": "multipart/form-data" }, }`.

Явные throw в теле:

```typescript
new Error("Select an image")
```

<details>
<summary>Прямые вызовы в теле</summary>

- `api.post`
- `formData.append`

</details>

## listVulnerabilityComments

[frontend/src/api.ts:1163](../../../../frontend/src/api.ts#L1163)

```typescript
async listVulnerabilityComments(projectId: number, vulnerabilityId: number) => Promise<PaginatedResponse<VulnerabilityComment>>
```

Клиентский HTTP-метод: GET ``/projects/${projectId}/vulnerabilities/${vulnerabilityId}/comments``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `vulnerabilityId` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<PaginatedResponse<VulnerabilityComment>>`.

Прямые HTTP-вызовы:

- `GET `/projects/${projectId}/vulnerabilities/${vulnerabilityId}/comments``; аргументы: `{ params: { page: 1, size: 100 }, }`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.get`

</details>

## createVulnerabilityComment

[frontend/src/api.ts:1170](../../../../frontend/src/api.ts#L1170)

```typescript
async createVulnerabilityComment(projectId: number, vulnerabilityId: number, content: string) => Promise<VulnerabilityComment>
```

Клиентский HTTP-метод: POST ``/projects/${projectId}/vulnerabilities/${vulnerabilityId}/comments``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `vulnerabilityId` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `content` | `string` | `обязательный` | Текст содержимого; формат определяется вызывающим сервисом. |

Возвращает: `Promise<VulnerabilityComment>`.

Прямые HTTP-вызовы:

- `POST `/projects/${projectId}/vulnerabilities/${vulnerabilityId}/comments``; аргументы: `{ content }`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.post`
- `assertRequired`

</details>

## updateVulnerabilityComment

[frontend/src/api.ts:1176](../../../../frontend/src/api.ts#L1176)

```typescript
async updateVulnerabilityComment(projectId: number, vulnerabilityId: number, commentId: number, content: string) => Promise<VulnerabilityComment>
```

Клиентский HTTP-метод: PUT ``/projects/${projectId}/vulnerabilities/${vulnerabilityId}/comments/${commentId}``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `vulnerabilityId` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `commentId` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `content` | `string` | `обязательный` | Текст содержимого; формат определяется вызывающим сервисом. |

Возвращает: `Promise<VulnerabilityComment>`.

Прямые HTTP-вызовы:

- `PUT `/projects/${projectId}/vulnerabilities/${vulnerabilityId}/comments/${commentId}``; аргументы: `{ content }`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.put`
- `assertRequired`

</details>

## deleteVulnerabilityComment

[frontend/src/api.ts:1187](../../../../frontend/src/api.ts#L1187)

```typescript
async deleteVulnerabilityComment(projectId: number, vulnerabilityId: number, commentId: number) => Promise<void>
```

Клиентский HTTP-метод: DELETE ``/projects/${projectId}/vulnerabilities/${vulnerabilityId}/comments/${commentId}``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `vulnerabilityId` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `commentId` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<void>`.

Прямые HTTP-вызовы:

- `DELETE `/projects/${projectId}/vulnerabilities/${vulnerabilityId}/comments/${commentId}``; аргументы: `нет`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.delete`

</details>

## importProjectData

[frontend/src/api.ts:1191](../../../../frontend/src/api.ts#L1191)

```typescript
async importProjectData(projectId: number, file: File) => Promise<ImportResult>
```

Клиентский HTTP-метод: POST ``/projects/${projectId}/import``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `file` | `File` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<ImportResult>`.

Прямые HTTP-вызовы:

- `POST `/projects/${projectId}/import``; аргументы: `formData / { headers: { "Content-Type": "multipart/form-data" }, }`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.post`
- `formData.append`

</details>

## importOpenApiFile

[frontend/src/api.ts:1200](../../../../frontend/src/api.ts#L1200)

```typescript
async importOpenApiFile(projectId: number, hostId: number, file: File) => Promise<OpenApiImportResult>
```

Клиентский HTTP-метод: POST ``/projects/${projectId}/hosts/${hostId}/import-openapi``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `hostId` | `number` | `обязательный` | ID хоста в API. |
| `file` | `File` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<OpenApiImportResult>`.

Прямые HTTP-вызовы:

- `POST `/projects/${projectId}/hosts/${hostId}/import-openapi``; аргументы: `formData / { headers: { "Content-Type": "multipart/form-data" }, }`.

Явные throw в теле:

```typescript
new Error("Select a Swagger/OpenAPI file")
```

<details>
<summary>Прямые вызовы в теле</summary>

- `api.post`
- `formData.append`

</details>

## exportOpenApiFile

[frontend/src/api.ts:1212](../../../../frontend/src/api.ts#L1212)

```typescript
async exportOpenApiFile(projectId: number, hostId: number) => Promise<Blob>
```

Клиентский HTTP-метод: GET ``/projects/${projectId}/hosts/${hostId}/export-openapi``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |
| `hostId` | `number` | `обязательный` | ID хоста в API. |

Возвращает: `Promise<Blob>`.

Прямые HTTP-вызовы:

- `GET `/projects/${projectId}/hosts/${hostId}/export-openapi``; аргументы: `{ responseType: "blob", }`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.get`

</details>

## downloadProjectCertificationReport

[frontend/src/api.ts:1219](../../../../frontend/src/api.ts#L1219)

```typescript
async downloadProjectCertificationReport(projectId: number) => Promise<Blob>
```

Клиентский HTTP-метод: POST ``/projects/${projectId}/reports/szi``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |

Возвращает: `Promise<Blob>`.

Прямые HTTP-вызовы:

- `POST `/projects/${projectId}/reports/szi``; аргументы: `null / { responseType: "blob", }`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.post`

</details>

## downloadProjectAcceptanceReport

[frontend/src/api.ts:1226](../../../../frontend/src/api.ts#L1226)

```typescript
async downloadProjectAcceptanceReport(projectId: number) => Promise<Blob>
```

Клиентский HTTP-метод: POST ``/projects/${projectId}/reports/pp``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `projectId` | `number` | `обязательный` | ID проекта в API. |

Возвращает: `Promise<Blob>`.

Прямые HTTP-вызовы:

- `POST `/projects/${projectId}/reports/pp``; аргументы: `null / { responseType: "blob", }`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.post`

</details>

## listAgentTokens

[frontend/src/api.ts:1233](../../../../frontend/src/api.ts#L1233)

```typescript
async listAgentTokens() => Promise<AgentApiToken[]>
```

Клиентский HTTP-метод: GET `"/agent-tokens"`. Использует общий axios-клиент с cookie и обработкой обновления сессии.

Возвращает: `Promise<AgentApiToken[]>`.

Прямые HTTP-вызовы:

- `GET "/agent-tokens"`; аргументы: `нет`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.get`

</details>

## createAgentToken

[frontend/src/api.ts:1238](../../../../frontend/src/api.ts#L1238)

```typescript
async createAgentToken(payload: { name: string; scopes: string[]; project_ids: number[]; all_projects: boolean; expires_at?: string | null; }) => Promise<AgentApiToken & { token: string }>
```

Клиентский HTTP-метод: POST `"/agent-tokens"`. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `payload` | `{ name: string; scopes: string[]; project_ids: number[]; all_projects: boolean; expires_at?: string \| null; }` | `обязательный` | Данные операции; для HTTP структура определена Pydantic request-схемой. |

Возвращает: `Promise<AgentApiToken & { token: string }>`.

Прямые HTTP-вызовы:

- `POST "/agent-tokens"`; аргументы: `payload`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.post`

</details>

## revokeAgentToken

[frontend/src/api.ts:1249](../../../../frontend/src/api.ts#L1249)

```typescript
async revokeAgentToken(tokenId: number) => Promise<void>
```

Клиентский HTTP-метод: DELETE ``/agent-tokens/${tokenId}``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `tokenId` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<void>`.

Прямые HTTP-вызовы:

- `DELETE `/agent-tokens/${tokenId}``; аргументы: `нет`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.delete`

</details>

## listNotifications

[frontend/src/api.ts:1253](../../../../frontend/src/api.ts#L1253)

```typescript
async listNotifications(options?: { is_read?: boolean }) => Promise<PaginatedResponse<Notification>>
```

Клиентский HTTP-метод: GET `"/notifications"`. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `options` | `{ is_read?: boolean }` | `undefined (optional)` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<PaginatedResponse<Notification>>`.

Прямые HTTP-вызовы:

- `GET "/notifications"`; аргументы: `{ params }`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.get`

</details>

## unreadCount

[frontend/src/api.ts:1262](../../../../frontend/src/api.ts#L1262)

```typescript
async unreadCount() => Promise<number>
```

Клиентский HTTP-метод: GET `"/notifications/unread-count"`. Использует общий axios-клиент с cookie и обработкой обновления сессии.

Возвращает: `Promise<number>`.

Прямые HTTP-вызовы:

- `GET "/notifications/unread-count"`; аргументы: `нет`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.get`

</details>

## markNotificationRead

[frontend/src/api.ts:1267](../../../../frontend/src/api.ts#L1267)

```typescript
async markNotificationRead(notificationId: number) => Promise<void>
```

Клиентский HTTP-метод: PATCH ``/notifications/${notificationId}/read``. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `notificationId` | `number` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<void>`.

Прямые HTTP-вызовы:

- `PATCH `/notifications/${notificationId}/read``; аргументы: `нет`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.patch`

</details>

## markAllNotificationsRead

[frontend/src/api.ts:1271](../../../../frontend/src/api.ts#L1271)

```typescript
async markAllNotificationsRead() => Promise<void>
```

Клиентский HTTP-метод: PATCH `"/notifications/read-all"`. Использует общий axios-клиент с cookie и обработкой обновления сессии.

Возвращает: `Promise<void>`.

Прямые HTTP-вызовы:

- `PATCH "/notifications/read-all"`; аргументы: `нет`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.patch`

</details>

## getAuditLogs

[frontend/src/api.ts:1275](../../../../frontend/src/api.ts#L1275)

```typescript
async getAuditLogs(page = 1, size = 50, filters?: { user_id?: string; username?: string; action?: string; entity_type?: string; entity_id?: string; ip_address?: string; query?: string; created_from?: string; created_to?: string; }) => Promise<PaginatedResponse<AuditLog>>
```

Клиентский HTTP-метод: GET `"/audit-logs"`. Использует общий axios-клиент с cookie и обработкой обновления сессии.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `page` | `number` | `1` | Номер страницы, начиная с 1. |
| `size` | `number` | `50` | Число элементов страницы; верхняя граница задаётся маршрутом. |
| `filters` | `{ user_id?: string; username?: string; action?: string; entity_type?: string; entity_id?: string; ip_address?: string; query?: string; created_from?: string; created_to?: string; }` | `undefined (optional)` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<PaginatedResponse<AuditLog>>`.

Прямые HTTP-вызовы:

- `GET "/audit-logs"`; аргументы: `{ params: { page, size, ...filters }, }`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.get`

</details>

## getTasks

[frontend/src/api.ts:1303](../../../../frontend/src/api.ts#L1303)

```typescript
async getTasks(params: { query?: string; category?: string; } = {}) => Promise<TaskTrackerTaskList>
```

Список задач Task Tracker (пространство APPSEC). category: "todo"|"inprogress"|"done"|"".

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `params` | `{ query?: string; category?: string; }` | `{}` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<TaskTrackerTaskList>`.

Прямые HTTP-вызовы:

- `GET "/tasks"`; аргументы: `{ params }`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.get`

</details>

## getTask

[frontend/src/api.ts:1312](../../../../frontend/src/api.ts#L1312)

```typescript
async getTask(key: string) => Promise<TaskTrackerTaskDetail>
```

Полная карточка одной задачи TaskTracker по ключу (напр. "APPSEC-123").

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `key` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<TaskTrackerTaskDetail>`.

Прямые HTTP-вызовы:

- `GET `/tasks/${encodeURIComponent(key)}``; аргументы: `нет`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.get`
- `encodeURIComponent`

</details>
