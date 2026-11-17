# frontend/src/api.ts

Сгенерировано из объявлений кода. [Правила чтения](../../../METHODS.md).

Методов и именованных функций: **103**.

## isBlank

[frontend/src/api.ts:51](../../../../frontend/src/api.ts#L51)

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

[frontend/src/api.ts:53](../../../../frontend/src/api.ts#L53)

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
new UserInputError(`Field "${label}" is required`)
```

<details>
<summary>Прямые вызовы в теле</summary>

- `isBlank`

</details>

## normalizeDetailMessage

[frontend/src/api.ts:59](../../../../frontend/src/api.ts#L59)

```typescript
normalizeDetailMessage(detail: unknown, depth = 0) => string | null
```

В теле вызывает `Array.isArray`, `Object.hasOwn`, `detail.slice`, `detail.slice(0, 50).map`, `detail.slice(0, 50).map((item) => normalizeDetailMessage(item, depth + 1)).filter`, `detail.trim`, `message?.replace`, `message?.startsWith`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `detail` | `unknown` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `depth` | `number` | `0` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `string \| null`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Array.isArray`
- `Object.hasOwn`
- `detail.slice`
- `detail.slice(0, 50).map`
- `detail.slice(0, 50).map((item) => normalizeDetailMessage(item, depth + 1)).filter`
- `detail.trim`
- `message?.replace`
- `message?.startsWith`
- `messages.join`
- `normalizeDetailMessage`

</details>

## getApiErrorStatus

[frontend/src/api.ts:84](../../../../frontend/src/api.ts#L84)

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

[frontend/src/api.ts:91](../../../../frontend/src/api.ts#L91)

```typescript
getApiErrorMessage(error: unknown, fallback: string) => string
```

Сообщение для пользователя: известный код сервера или безопасная бизнес-ошибка.
Диагностика 5xx, HTML, SQL, нативные исключения и сообщения библиотек скрываются.
Локальный текст разрешён только для явно созданного UserInputError.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `error` | `unknown` | `обязательный` | Перехваченное исключение/ответ ошибки. |
| `fallback` | `string` | `обязательный` | Запасное значение при отсутствии основного. |

Возвращает: `string`.

<details>
<summary>Прямые вызовы в теле</summary>

- `axios.isAxiosError`
- `error.message.trim`
- `errorMessageForCode`
- `normalizeDetailMessage`
- `safeErrorDetail`

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

## createInvitation

[frontend/src/api.ts:262](../../../../frontend/src/api.ts#L262)

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

[frontend/src/api.ts:273](../../../../frontend/src/api.ts#L273)

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

[frontend/src/api.ts:278](../../../../frontend/src/api.ts#L278)

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

[frontend/src/api.ts:283](../../../../frontend/src/api.ts#L283)

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

[frontend/src/api.ts:289](../../../../frontend/src/api.ts#L289)

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

[frontend/src/api.ts:294](../../../../frontend/src/api.ts#L294)

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

[frontend/src/api.ts:302](../../../../frontend/src/api.ts#L302)

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

[frontend/src/api.ts:315](../../../../frontend/src/api.ts#L315)

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

[frontend/src/api.ts:331](../../../../frontend/src/api.ts#L331)

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

[frontend/src/api.ts:338](../../../../frontend/src/api.ts#L338)

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

[frontend/src/api.ts:344](../../../../frontend/src/api.ts#L344)

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

## deleteUser

[frontend/src/api.ts:349](../../../../frontend/src/api.ts#L349)

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

## changeMyPassword

[frontend/src/api.ts:353](../../../../frontend/src/api.ts#L353)

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

[frontend/src/api.ts:360](../../../../frontend/src/api.ts#L360)

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
new UserInputError("An avatar file is required")
```

<details>
<summary>Прямые вызовы в теле</summary>

- `api.post`
- `formData.append`

</details>

## getProjects

[frontend/src/api.ts:372](../../../../frontend/src/api.ts#L372)

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

[frontend/src/api.ts:377](../../../../frontend/src/api.ts#L377)

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

## createProject

[frontend/src/api.ts:388](../../../../frontend/src/api.ts#L388)

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

[frontend/src/api.ts:408](../../../../frontend/src/api.ts#L408)

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

[frontend/src/api.ts:413](../../../../frontend/src/api.ts#L413)

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

[frontend/src/api.ts:436](../../../../frontend/src/api.ts#L436)

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

[frontend/src/api.ts:441](../../../../frontend/src/api.ts#L441)

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
new UserInputError("Select a user")
```

<details>
<summary>Прямые вызовы в теле</summary>

- `api.post`

</details>

## removeProjectMember

[frontend/src/api.ts:448](../../../../frontend/src/api.ts#L448)

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

[frontend/src/api.ts:453](../../../../frontend/src/api.ts#L453)

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

[frontend/src/api.ts:458](../../../../frontend/src/api.ts#L458)

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

## createProjectNote

[frontend/src/api.ts:473](../../../../frontend/src/api.ts#L473)

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

[frontend/src/api.ts:482](../../../../frontend/src/api.ts#L482)

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

## deleteProjectNote

[frontend/src/api.ts:494](../../../../frontend/src/api.ts#L494)

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

[frontend/src/api.ts:500](../../../../frontend/src/api.ts#L500)

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

[frontend/src/api.ts:505](../../../../frontend/src/api.ts#L505)

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

[frontend/src/api.ts:514](../../../../frontend/src/api.ts#L514)

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

[frontend/src/api.ts:525](../../../../frontend/src/api.ts#L525)

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

## deleteProject

[frontend/src/api.ts:529](../../../../frontend/src/api.ts#L529)

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

[frontend/src/api.ts:534](../../../../frontend/src/api.ts#L534)

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

[frontend/src/api.ts:539](../../../../frontend/src/api.ts#L539)

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

[frontend/src/api.ts:560](../../../../frontend/src/api.ts#L560)

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
new UserInputError('Provide at least "IP address" or "Hostname"')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `api.post`
- `isBlank`

</details>

## getHost

[frontend/src/api.ts:578](../../../../frontend/src/api.ts#L578)

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

[frontend/src/api.ts:583](../../../../frontend/src/api.ts#L583)

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

[frontend/src/api.ts:599](../../../../frontend/src/api.ts#L599)

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

[frontend/src/api.ts:603](../../../../frontend/src/api.ts#L603)

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

[frontend/src/api.ts:612](../../../../frontend/src/api.ts#L612)

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

[frontend/src/api.ts:618](../../../../frontend/src/api.ts#L618)

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

## startHostFarm

[frontend/src/api.ts:625](../../../../frontend/src/api.ts#L625)

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

[frontend/src/api.ts:632](../../../../frontend/src/api.ts#L632)

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

[frontend/src/api.ts:638](../../../../frontend/src/api.ts#L638)

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

[frontend/src/api.ts:645](../../../../frontend/src/api.ts#L645)

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

[frontend/src/api.ts:651](../../../../frontend/src/api.ts#L651)

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

[frontend/src/api.ts:657](../../../../frontend/src/api.ts#L657)

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

[frontend/src/api.ts:665](../../../../frontend/src/api.ts#L665)

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

## deleteJsFilesForHost

[frontend/src/api.ts:677](../../../../frontend/src/api.ts#L677)

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

[frontend/src/api.ts:683](../../../../frontend/src/api.ts#L683)

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

## listEndpointComments

[frontend/src/api.ts:692](../../../../frontend/src/api.ts#L692)

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

[frontend/src/api.ts:697](../../../../frontend/src/api.ts#L697)

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

[frontend/src/api.ts:703](../../../../frontend/src/api.ts#L703)

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

[frontend/src/api.ts:708](../../../../frontend/src/api.ts#L708)

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
new UserInputError('Provide at least "Path" or "Raw request"')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `api.post`
- `isBlank`

</details>

## updateEndpoint

[frontend/src/api.ts:729](../../../../frontend/src/api.ts#L729)

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
new UserInputError('Provide at least "Path" or "Raw request"')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `api.put`
- `isBlank`

</details>

## deleteEndpoint

[frontend/src/api.ts:751](../../../../frontend/src/api.ts#L751)

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

[frontend/src/api.ts:755](../../../../frontend/src/api.ts#L755)

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

[frontend/src/api.ts:774](../../../../frontend/src/api.ts#L774)

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
new UserInputError("Select a host")
```

<details>
<summary>Прямые вызовы в теле</summary>

- `api.post`
- `assertRequired`

</details>

## updateVulnerability

[frontend/src/api.ts:807](../../../../frontend/src/api.ts#L807)

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

[frontend/src/api.ts:838](../../../../frontend/src/api.ts#L838)

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

[frontend/src/api.ts:842](../../../../frontend/src/api.ts#L842)

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

[frontend/src/api.ts:847](../../../../frontend/src/api.ts#L847)

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

[frontend/src/api.ts:854](../../../../frontend/src/api.ts#L854)

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

[frontend/src/api.ts:860](../../../../frontend/src/api.ts#L860)

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

[frontend/src/api.ts:866](../../../../frontend/src/api.ts#L866)

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

## findWorksProductCodes

[frontend/src/api.ts:872](../../../../frontend/src/api.ts#L872)

```typescript
async findWorksProductCodes(q: string) => Promise<WorksRef[]>
```

Подсказки продуктов STS; code сохраняется без преобразования регистра.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `q` | `string` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Promise<WorksRef[]>`.

Прямые HTTP-вызовы:

- `GET "/works/product-codes"`; аргументы: `{ params: { q } }`.

<details>
<summary>Прямые вызовы в теле</summary>

- `api.get`

</details>

## getVulnerabilityWorksLink

[frontend/src/api.ts:878](../../../../frontend/src/api.ts#L878)

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

[frontend/src/api.ts:884](../../../../frontend/src/api.ts#L884)

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

[frontend/src/api.ts:896](../../../../frontend/src/api.ts#L896)

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

## addVulnerabilityAsset

[frontend/src/api.ts:901](../../../../frontend/src/api.ts#L901)

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

[frontend/src/api.ts:913](../../../../frontend/src/api.ts#L913)

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

[frontend/src/api.ts:917](../../../../frontend/src/api.ts#L917)

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

[frontend/src/api.ts:922](../../../../frontend/src/api.ts#L922)

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
new UserInputError("Select a file")
```

<details>
<summary>Прямые вызовы в теле</summary>

- `api.post`
- `formData.append`

</details>

## deleteVulnerabilityFile

[frontend/src/api.ts:934](../../../../frontend/src/api.ts#L934)

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

[frontend/src/api.ts:940](../../../../frontend/src/api.ts#L940)

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
new UserInputError("Select an image")
```

<details>
<summary>Прямые вызовы в теле</summary>

- `api.post`
- `formData.append`

</details>

## downloadProjectCertificationReport

[frontend/src/api.ts:952](../../../../frontend/src/api.ts#L952)

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

[frontend/src/api.ts:959](../../../../frontend/src/api.ts#L959)

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

[frontend/src/api.ts:966](../../../../frontend/src/api.ts#L966)

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

[frontend/src/api.ts:971](../../../../frontend/src/api.ts#L971)

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

[frontend/src/api.ts:982](../../../../frontend/src/api.ts#L982)

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

[frontend/src/api.ts:986](../../../../frontend/src/api.ts#L986)

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

## markNotificationRead

[frontend/src/api.ts:995](../../../../frontend/src/api.ts#L995)

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

[frontend/src/api.ts:999](../../../../frontend/src/api.ts#L999)

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

## getTasks

[frontend/src/api.ts:1010](../../../../frontend/src/api.ts#L1010)

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

[frontend/src/api.ts:1019](../../../../frontend/src/api.ts#L1019)

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
