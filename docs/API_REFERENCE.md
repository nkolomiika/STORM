# HTTP API: контракты методов

Документированных HTTP-операций: **171**.

Справочник сгенерирован из актуальных OpenAPI v1/v2. Тела запросов и ответы описаны в [схемах](API_SCHEMAS.md). Для удобного вызова используйте защищённый Swagger `/api/v1/docs` или `/api/v2/docs` в запущенном приложении.

v1 использует cookie-сессию, изменяющие методы проверяют Origin через enforce_csrf там, где эта dependency подключена. v2 использует Bearer agent token и scopes. Точные dependencies, проверки ролей и вызовы сервисов каждого обработчика — в [каталоге методов](METHODS.md). Отсутствие OpenAPI security у v1 не означает публичный доступ: cookie-auth реализована через dependencies.

Общие отображения ошибок: NotFoundError → 404, UnauthorizedError → 401, ForbiddenError → 403, ConflictError → 409, ValidationError и ошибка входной схемы → 422. Необработанное исключение → 500; OpenAPI не перечисляет все сервисные ветви. Конкретные raise указаны в каталоге методов. WebSocket не входит в OpenAPI: см. раздел в руководстве разработчика.

## v1

### GET /health

Healthcheck эндпоинт для проверки доступности сервиса.

Operation ID: `health_health_get`.

Обработчик: `health` — [backend/app/main.py:402](../backend/app/main.py#L402).

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: object |

### POST /api/v1/auth/login

Первый шаг логина. При включённом 2FA возвращает challenge вместо сессии.

Operation ID: `login_api_v1_auth_login_post`.

Обработчик: `login` — [backend/app/routers/auth.py:110](../backend/app/routers/auth.py#L110).

Явные dependencies: `enforce_csrf`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `Origin` | header | `string \| null` | нет | — |

Тело: `application/json`, схема `LoginRequest`, обязательно.

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: LoginResponse |
| 422 | Validation Error | application/json: HTTPValidationError |

### POST /api/v1/auth/2fa/verify

Второй шаг логина: сверяет TOTP-код и выдаёт полноценную сессию.

Operation ID: `verify_2fa_api_v1_auth_2fa_verify_post`.

Обработчик: `verify_2fa` — [backend/app/routers/auth.py:130](../backend/app/routers/auth.py#L130).

Явные dependencies: `enforce_csrf`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `Origin` | header | `string \| null` | нет | — |
| `twofa_token` | cookie | `string \| null` | нет | — |

Тело: `application/json`, схема `TwoFAVerifyRequest`, обязательно.

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: LoginResponse |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v1/auth/invitations/{token}

Публичная проверка ссылки-приглашения: валидна ли и на какой email.

Operation ID: `invitation_info_api_v1_auth_invitations__token__get`.

Обработчик: `invitation_info` — [backend/app/routers/auth.py:148](../backend/app/routers/auth.py#L148).

Явные dependencies: `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `token` | path | `string` | да | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: InvitationInfoOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v1/auth/invitations/{token}/username-available

Проверка занятости username на странице активации (нужен валидный токен).

Operation ID: `invitation_username_available_api_v1_auth_invitations__token__username_available_get`.

Обработчик: `invitation_username_available` — [backend/app/routers/auth.py:158](../backend/app/routers/auth.py#L158).

Явные dependencies: `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `token` | path | `string` | да | — |
| `username` | query | `string` | да | {"minLength": 3, "maxLength": 100} |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: UsernameAvailabilityOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### POST /api/v1/auth/invitations/{token}/accept

Активация приглашения: приглашённый задаёт username+пароль и сразу входит.

Operation ID: `accept_invitation_api_v1_auth_invitations__token__accept_post`.

Обработчик: `accept_invitation` — [backend/app/routers/auth.py:169](../backend/app/routers/auth.py#L169).

Явные dependencies: `enforce_csrf`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `token` | path | `string` | да | — |
| `Origin` | header | `string \| null` | нет | — |

Тело: `application/json`, схема `InvitationAcceptRequest`, обязательно.

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 201 | Successful Response | application/json: LoginResponse |
| 422 | Validation Error | application/json: HTTPValidationError |

### POST /api/v1/auth/password-reset/request

«Забыли пароль»: шлёт ссылку на email.

Всегда отвечает 200, даже если такого пользователя нет — иначе по коду
ответа можно было бы перебирать существующие адреса.

Operation ID: `request_password_reset_api_v1_auth_password_reset_request_post`.

Обработчик: `request_password_reset` — [backend/app/routers/auth.py:187](../backend/app/routers/auth.py#L187).

Явные dependencies: `enforce_csrf`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `Origin` | header | `string \| null` | нет | — |

Тело: `application/json`, схема `PasswordResetRequest`, обязательно.

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: PasswordResetRequestOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v1/auth/password-reset/{token}

Проверяет ссылку до показа формы нового пароля.

Operation ID: `password_reset_info_api_v1_auth_password_reset__token__get`.

Обработчик: `password_reset_info` — [backend/app/routers/auth.py:204](../backend/app/routers/auth.py#L204).

Явные dependencies: `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `token` | path | `string` | да | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: PasswordResetInfoOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### POST /api/v1/auth/password-reset/{token}

Ставит новый пароль по ссылке. Сессию не выдаём — пользователь входит сам.

Operation ID: `confirm_password_reset_api_v1_auth_password_reset__token__post`.

Обработчик: `confirm_password_reset` — [backend/app/routers/auth.py:213](../backend/app/routers/auth.py#L213).

Явные dependencies: `enforce_csrf`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `token` | path | `string` | да | — |
| `Origin` | header | `string \| null` | нет | — |

Тело: `application/json`, схема `PasswordResetConfirmRequest`, обязательно.

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 204 | Successful Response | без тела/см. обработчик |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v1/auth/reactivate/{token}

Публичная проверка ссылки-возврата до показа кнопки входа.

Operation ID: `reactivation_info_api_v1_auth_reactivate__token__get`.

Обработчик: `reactivation_info` — [backend/app/routers/auth.py:230](../backend/app/routers/auth.py#L230).

Явные dependencies: `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `token` | path | `string` | да | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: ReactivationInfoOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### POST /api/v1/auth/reactivate/{token}

Возврат по ссылке: разблокирует аккаунт и сразу выдаёт сессию.

Operation ID: `complete_reactivation_api_v1_auth_reactivate__token__post`.

Обработчик: `complete_reactivation` — [backend/app/routers/auth.py:239](../backend/app/routers/auth.py#L239).

Явные dependencies: `enforce_csrf`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `token` | path | `string` | да | — |
| `Origin` | header | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: LoginResponse |
| 422 | Validation Error | application/json: HTTPValidationError |

### POST /api/v1/auth/refresh

Обновляет пару cookie-токенов с ротацией refresh-токена.

Operation ID: `refresh_api_v1_auth_refresh_post`.

Обработчик: `refresh` — [backend/app/routers/auth.py:255](../backend/app/routers/auth.py#L255).

Явные dependencies: `enforce_csrf`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `Origin` | header | `string \| null` | нет | — |
| `refresh_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: RefreshResponse |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v1/auth/sso/config

Публичная конфигурация SSO: показывать ли кнопку входа и с какой надписью.

Operation ID: `sso_config_api_v1_auth_sso_config_get`.

Обработчик: `sso_config` — [backend/app/routers/auth.py:346](../backend/app/routers/auth.py#L346).

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: SsoConfigOut |

### GET /api/v1/auth/sso/login

Старт входа через SSO: редирект на страницу авторизации IdM.

Operation ID: `sso_login_api_v1_auth_sso_login_get`.

Обработчик: `sso_login` — [backend/app/routers/auth.py:354](../backend/app/routers/auth.py#L354).

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: object |

### GET /api/v1/auth/sso/callback

Возврат от IdP: сверяет state, меняет код на токены и выдаёт обычную сессию.

Operation ID: `sso_callback_api_v1_auth_sso_callback_get`.

Обработчик: `sso_callback` — [backend/app/routers/auth.py:370](../backend/app/routers/auth.py#L370).

Явные dependencies: `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `state` | query | `string \| null` | нет | — |
| `code` | query | `string \| null` | нет | — |
| `error` | query | `string \| null` | нет | — |
| `sso_tx` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: object |
| 422 | Validation Error | application/json: HTTPValidationError |

### POST /api/v1/auth/logout

Отзывает токены и очищает cookie в браузере.

Operation ID: `logout_api_v1_auth_logout_post`.

Обработчик: `logout` — [backend/app/routers/auth.py:412](../backend/app/routers/auth.py#L412).

Явные dependencies: `enforce_csrf`, `get_current_user`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 204 | Successful Response | без тела/см. обработчик |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v1/agent-tokens

Возвращает agent API tokens текущего пользователя без секретных значений.

Operation ID: `list_agent_tokens_api_v1_agent_tokens_get`.

Обработчик: `list_agent_tokens` — [backend/app/routers/agent_tokens.py:15](../backend/app/routers/agent_tokens.py#L15).

Явные dependencies: `get_current_user`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: list[AgentTokenOut] |
| 422 | Validation Error | application/json: HTTPValidationError |

### POST /api/v1/agent-tokens

Создаёт agent API token; значение token возвращается только один раз.

Права токена не могут превышать права создателя: не-админ может выдать доступ
только к проектам, где он участник (см. AgentTokenService.create_token и
request-time проверку require_agent_project_access).

Operation ID: `create_agent_token_api_v1_agent_tokens_post`.

Обработчик: `create_agent_token` — [backend/app/routers/agent_tokens.py:24](../backend/app/routers/agent_tokens.py#L24).

Явные dependencies: `enforce_csrf`, `get_current_user`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

Тело: `application/json`, схема `AgentTokenCreate`, обязательно.

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 201 | Successful Response | application/json: AgentTokenCreateResponse |
| 422 | Validation Error | application/json: HTTPValidationError |

### DELETE /api/v1/agent-tokens/{token_id}

Отзывает agent API token (свой — любой пользователь, чужой — только админ).

Operation ID: `revoke_agent_token_api_v1_agent_tokens__token_id__delete`.

Обработчик: `revoke_agent_token` — [backend/app/routers/agent_tokens.py:41](../backend/app/routers/agent_tokens.py#L41).

Явные dependencies: `enforce_csrf`, `get_current_user`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `token_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 204 | Successful Response | без тела/см. обработчик |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v1/users/me

Возвращает профиль текущего пользователя.

Operation ID: `me_api_v1_users_me_get`.

Обработчик: `me` — [backend/app/routers/users.py:32](../backend/app/routers/users.py#L32).

Явные dependencies: `get_current_user`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: UserOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### PATCH /api/v1/users/me

Обновляет профиль текущего пользователя.

Operation ID: `update_my_profile_api_v1_users_me_patch`.

Обработчик: `update_my_profile` — [backend/app/routers/users.py:44](../backend/app/routers/users.py#L44).

Явные dependencies: `enforce_csrf`, `get_current_user`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

Тело: `application/json`, схема `UserProfileUpdate`, обязательно.

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: UserOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v1/users/me/profile

Возвращает расширенный профиль текущего пользователя.

Operation ID: `my_profile_api_v1_users_me_profile_get`.

Обработчик: `my_profile` — [backend/app/routers/users.py:38](../backend/app/routers/users.py#L38).

Явные dependencies: `get_current_user`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: UserOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### PATCH /api/v1/users/me/password

Меняет пароль текущего пользователя.

Operation ID: `change_my_password_api_v1_users_me_password_patch`.

Обработчик: `change_my_password` — [backend/app/routers/users.py:57](../backend/app/routers/users.py#L57).

Явные dependencies: `enforce_csrf`, `get_current_user`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

Тело: `application/json`, схема `OwnPasswordChangeRequest`, обязательно.

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: UserOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### POST /api/v1/users/me/2fa/setup

Готовит привязку 2FA: секрет + otpauth-URI + QR (data-URL). Ещё не включает.

Operation ID: `setup_my_2fa_api_v1_users_me_2fa_setup_post`.

Обработчик: `setup_my_2fa` — [backend/app/routers/users.py:75](../backend/app/routers/users.py#L75).

Явные dependencies: `enforce_csrf`, `get_current_user`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: TwoFASetupResponse |
| 422 | Validation Error | application/json: HTTPValidationError |

### POST /api/v1/users/me/2fa/confirm

Включает 2FA после ввода первого кода из приложения-аутентификатора.

Operation ID: `confirm_my_2fa_api_v1_users_me_2fa_confirm_post`.

Обработчик: `confirm_my_2fa` — [backend/app/routers/users.py:87](../backend/app/routers/users.py#L87).

Явные dependencies: `enforce_csrf`, `get_current_user`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

Тело: `application/json`, схема `TwoFAConfirmRequest`, обязательно.

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: UserOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### POST /api/v1/users/me/2fa/disable

Отключает 2FA текущему пользователю (требует пароль аккаунта).

Operation ID: `disable_my_2fa_api_v1_users_me_2fa_disable_post`.

Обработчик: `disable_my_2fa` — [backend/app/routers/users.py:100](../backend/app/routers/users.py#L100).

Явные dependencies: `enforce_csrf`, `get_current_user`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

Тело: `application/json`, схема `TwoFADisableRequest`, обязательно.

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: UserOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### POST /api/v1/users/me/avatar

Загружает новый аватар текущего пользователя.

Operation ID: `upload_my_avatar_api_v1_users_me_avatar_post`.

Обработчик: `upload_my_avatar` — [backend/app/routers/users.py:113](../backend/app/routers/users.py#L113).

Явные dependencies: `enforce_csrf`, `get_current_user`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

Тело: `multipart/form-data`, схема `Body_upload_my_avatar_api_v1_users_me_avatar_post`, обязательно.

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: UserOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### DELETE /api/v1/users/me/avatar

Удаляет аватар владельца сессии и возвращает обновлённый профиль.

Operation ID: `delete_my_avatar_api_v1_users_me_avatar_delete`.

Обработчик: `delete_my_avatar` — [backend/app/routers/users.py:126](../backend/app/routers/users.py#L126).

Явные dependencies: `enforce_csrf`, `get_current_user`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: UserOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v1/users

Возвращает список пользователей для администратора.

Operation ID: `list_users_api_v1_users_get`.

Обработчик: `list_users` — [backend/app/routers/users.py:138](../backend/app/routers/users.py#L138).

Явные dependencies: `require_admin`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `page` | query | `integer` | нет | {"minimum": 1, "default": 1} |
| `size` | query | `integer` | нет | {"maximum": 200, "minimum": 1, "default": 20} |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: object |
| 422 | Validation Error | application/json: HTTPValidationError |

### POST /api/v1/users/invitations

Приглашает пользователя по email: шлёт ссылку активации, User создаётся при активации.

Operation ID: `create_invitation_api_v1_users_invitations_post`.

Обработчик: `create_invitation` — [backend/app/routers/users.py:162](../backend/app/routers/users.py#L162).

Явные dependencies: `enforce_csrf`, `require_admin`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

Тело: `application/json`, схема `InvitationCreate`, обязательно.

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 201 | Successful Response | application/json: InvitationSentOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v1/users/invitations

Список незавершённых приглашений (pending, в т.ч. истёкших).

Operation ID: `list_invitations_api_v1_users_invitations_get`.

Обработчик: `list_invitations` — [backend/app/routers/users.py:180](../backend/app/routers/users.py#L180).

Явные dependencies: `require_admin`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: list[InvitationOut] |
| 422 | Validation Error | application/json: HTTPValidationError |

### POST /api/v1/users/invitations/{invitation_id}/resend

Перевыпускает ссылку приглашения и отправляет письмо заново.

Operation ID: `resend_invitation_api_v1_users_invitations__invitation_id__resend_post`.

Обработчик: `resend_invitation` — [backend/app/routers/users.py:192](../backend/app/routers/users.py#L192).

Явные dependencies: `enforce_csrf`, `require_admin`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `invitation_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: InvitationSentOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### DELETE /api/v1/users/invitations/{invitation_id}

Отзывает приглашение — ссылка перестаёт работать.

Operation ID: `revoke_invitation_api_v1_users_invitations__invitation_id__delete`.

Обработчик: `revoke_invitation` — [backend/app/routers/users.py:210](../backend/app/routers/users.py#L210).

Явные dependencies: `enforce_csrf`, `require_admin`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `invitation_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 204 | Successful Response | без тела/см. обработчик |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v1/users/search

Ищет активных локальных пользователей STORM по логину или ФИО.

SSO-вход не подключает удалённый поиск IAM: в выдаче только пользователи БД.

Operation ID: `search_users_api_v1_users_search_get`.

Обработчик: `search_users` — [backend/app/routers/users.py:222](../backend/app/routers/users.py#L222).

Явные dependencies: `get_current_user`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `q` | query | `string` | нет | {"maxLength": 100, "default": ""} |
| `limit` | query | `integer` | нет | {"maximum": 25, "minimum": 1, "default": 10} |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: list[UserSearchOut] |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v1/users/{user_id}

Возвращает пользователя по ID.

Operation ID: `get_user_api_v1_users__user_id__get`.

Обработчик: `get_user` — [backend/app/routers/users.py:238](../backend/app/routers/users.py#L238).

Явные dependencies: `require_admin`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `user_id` | path | `integer` | да | — |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: UserOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### PUT /api/v1/users/{user_id}

Обновляет пользователя.

Operation ID: `update_user_api_v1_users__user_id__put`.

Обработчик: `update_user` — [backend/app/routers/users.py:260](../backend/app/routers/users.py#L260).

Явные dependencies: `enforce_csrf`, `require_admin`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `user_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

Тело: `application/json`, схема `UserUpdate`, обязательно.

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: UserOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### DELETE /api/v1/users/{user_id}

Деактивирует пользователя (мягкое удаление: is_locked, строка сохраняется).

Operation ID: `delete_user_api_v1_users__user_id__delete`.

Обработчик: `delete_user` — [backend/app/routers/users.py:274](../backend/app/routers/users.py#L274).

Явные dependencies: `enforce_csrf`, `require_admin`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `user_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 204 | Successful Response | без тела/см. обработчик |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v1/users/{user_id}/avatar

Возвращает изображение профиля авторизованному пользователю рабочего пространства.

Operation ID: `get_user_avatar_api_v1_users__user_id__avatar_get`.

Обработчик: `get_user_avatar` — [backend/app/routers/users.py:249](../backend/app/routers/users.py#L249).

Явные dependencies: `get_current_user`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `user_id` | path | `integer` | да | — |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: object |
| 422 | Validation Error | application/json: HTTPValidationError |

### POST /api/v1/users/{user_id}/reactivate

Сразу возвращает пользователю доступ; письмо и SMTP не используются.

Operation ID: `reactivate_user_api_v1_users__user_id__reactivate_post`.

Обработчик: `reactivate_user` — [backend/app/routers/users.py:286](../backend/app/routers/users.py#L286).

Явные dependencies: `enforce_csrf`, `require_admin`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `user_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: UserOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### PATCH /api/v1/users/{user_id}/password

Сбрасывает пароль пользователя.

Operation ID: `reset_password_api_v1_users__user_id__password_patch`.

Обработчик: `reset_password` — [backend/app/routers/users.py:299](../backend/app/routers/users.py#L299).

Явные dependencies: `enforce_csrf`, `require_admin`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `user_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: PasswordResetOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### POST /api/v1/users/{user_id}/2fa/reset

Сбрасывает 2FA пользователю (например, при потере телефона).

Operation ID: `reset_2fa_api_v1_users__user_id__2fa_reset_post`.

Обработчик: `reset_2fa` — [backend/app/routers/users.py:313](../backend/app/routers/users.py#L313).

Явные dependencies: `enforce_csrf`, `require_admin`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `user_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: UserOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v1/projects

Возвращает список проектов с учётом прав доступа.

Operation ID: `list_projects_api_v1_projects_get`.

Обработчик: `list_projects` — [backend/app/routers/projects.py:26](../backend/app/routers/projects.py#L26).

Явные dependencies: `get_current_user`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `page` | query | `integer` | нет | {"minimum": 1, "default": 1} |
| `size` | query | `integer` | нет | {"maximum": 1000, "minimum": 1, "default": 20} |
| `status` | query | `ProjectStatus \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: object |
| 422 | Validation Error | application/json: HTTPValidationError |

### POST /api/v1/projects

Создаёт проект от имени admin/lead и добавляет автора в участники.

Operation ID: `create_project_api_v1_projects_post`.

Обработчик: `create_project` — [backend/app/routers/projects.py:41](../backend/app/routers/projects.py#L41).

Явные dependencies: `enforce_csrf`, `require_project_creator`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

Тело: `application/json`, схема `ProjectCreate`, обязательно.

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 201 | Successful Response | application/json: ProjectOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v1/projects/folders

Возвращает дерево папок проектов (плоским списком).

Operation ID: `list_project_folders_api_v1_projects_folders_get`.

Обработчик: `list_project_folders` — [backend/app/routers/projects.py:54](../backend/app/routers/projects.py#L54).

Явные dependencies: `get_current_user`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: list[ProjectFolderOut] |
| 422 | Validation Error | application/json: HTTPValidationError |

### POST /api/v1/projects/folders

Создаёт папку проекта (в т.ч. вложенную).

Operation ID: `create_project_folder_api_v1_projects_folders_post`.

Обработчик: `create_project_folder` — [backend/app/routers/projects.py:64](../backend/app/routers/projects.py#L64).

Явные dependencies: `enforce_csrf`, `require_admin`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

Тело: `application/json`, схема `ProjectFolderCreate`, обязательно.

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 201 | Successful Response | application/json: ProjectFolderOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### PATCH /api/v1/projects/folders/{folder_id}/move

Перемещает папку проекта в другой раздел дерева.

Operation ID: `move_project_folder_api_v1_projects_folders__folder_id__move_patch`.

Обработчик: `move_project_folder` — [backend/app/routers/projects.py:77](../backend/app/routers/projects.py#L77).

Явные dependencies: `enforce_csrf`, `require_admin`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `folder_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

Тело: `application/json`, схема `ProjectFolderMove`, обязательно.

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: ProjectFolderOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### DELETE /api/v1/projects/folders/{folder_id}

Каскадно удаляет папку проекта со всеми подпапками и проектами.

Operation ID: `delete_project_folder_api_v1_projects_folders__folder_id__delete`.

Обработчик: `delete_project_folder` — [backend/app/routers/projects.py:91](../backend/app/routers/projects.py#L91).

Явные dependencies: `enforce_csrf`, `require_admin`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `folder_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: object |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v1/projects/stats

Счётчики (хосты/уязвимости) по каждому доступному проекту — одним запросом.

Operation ID: `list_project_stats_api_v1_projects_stats_get`.

Обработчик: `list_project_stats` — [backend/app/routers/projects.py:104](../backend/app/routers/projects.py#L104).

Явные dependencies: `get_current_user`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: list[object] |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v1/projects/{project_id}

Возвращает проект по ID.

Operation ID: `get_project_api_v1_projects__project_id__get`.

Обработчик: `get_project` — [backend/app/routers/projects.py:113](../backend/app/routers/projects.py#L113).

Явные dependencies: `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: ProjectOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### PUT /api/v1/projects/{project_id}

Обновляет карточку проекта: название, статус, сроки и привязку APPSEC.

Доступно админу, создателю и участникам; права удаления проверяются отдельно.

Operation ID: `update_project_api_v1_projects__project_id__put`.

Обработчик: `update_project` — [backend/app/routers/projects.py:124](../backend/app/routers/projects.py#L124).

Явные dependencies: `enforce_csrf`, `get_current_user`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

Тело: `application/json`, схема `ProjectUpdate`, обязательно.

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: ProjectOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### DELETE /api/v1/projects/{project_id}

Удаляет проект, если инициатор — admin, создатель или lead-участник.

Operation ID: `delete_project_api_v1_projects__project_id__delete`.

Обработчик: `delete_project` — [backend/app/routers/projects.py:143](../backend/app/routers/projects.py#L143).

Явные dependencies: `enforce_csrf`, `get_current_user`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 204 | Successful Response | без тела/см. обработчик |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v1/projects/{project_id}/members

Возвращает участников проекта.

Operation ID: `list_members_api_v1_projects__project_id__members_get`.

Обработчик: `list_members` — [backend/app/routers/projects.py:157](../backend/app/routers/projects.py#L157).

Явные dependencies: `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: list[ProjectMemberOut] |
| 422 | Validation Error | application/json: HTTPValidationError |

### POST /api/v1/projects/{project_id}/members

Добавляет участника в проект (админ, лид проекта или его создатель).

Operation ID: `add_member_api_v1_projects__project_id__members_post`.

Обработчик: `add_member` — [backend/app/routers/projects.py:168](../backend/app/routers/projects.py#L168).

Явные dependencies: `enforce_csrf`, `get_current_user`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

Тело: `application/json`, схема `ProjectMemberCreate`, обязательно.

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 201 | Successful Response | application/json: object |
| 422 | Validation Error | application/json: HTTPValidationError |

### DELETE /api/v1/projects/{project_id}/members/{user_id}

Удаляет участника из проекта (админ, лид проекта или его создатель).

Operation ID: `remove_member_api_v1_projects__project_id__members__user_id__delete`.

Обработчик: `remove_member` — [backend/app/routers/projects.py:183](../backend/app/routers/projects.py#L183).

Явные dependencies: `enforce_csrf`, `get_current_user`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `user_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 204 | Successful Response | без тела/см. обработчик |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v1/projects/{project_id}/activity

Активность проекта — доступна всем участникам проекта.

Operation ID: `list_project_activity_api_v1_projects__project_id__activity_get`.

Обработчик: `list_project_activity` — [backend/app/routers/projects.py:198](../backend/app/routers/projects.py#L198).

Явные dependencies: `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `limit` | query | `integer` | нет | {"maximum": 200, "minimum": 1, "default": 50} |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: list[object] |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v1/projects/{project_id}/notes

List Project Notes

Operation ID: `list_project_notes_api_v1_projects__project_id__notes_get`.

Обработчик: `list_project_notes` — [backend/app/routers/project_notes.py:25](../backend/app/routers/project_notes.py#L25).

Явные dependencies: `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: list[ProjectNoteOut] |
| 422 | Validation Error | application/json: HTTPValidationError |

### POST /api/v1/projects/{project_id}/notes

Create Project Note

Operation ID: `create_project_note_api_v1_projects__project_id__notes_post`.

Обработчик: `create_project_note` — [backend/app/routers/project_notes.py:49](../backend/app/routers/project_notes.py#L49).

Явные dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

Тело: `application/json`, схема `ProjectNoteCreate`, обязательно.

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 201 | Successful Response | application/json: ProjectNoteOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v1/projects/{project_id}/notes-activity

Журнал действий с заметками проекта (CREATE/UPDATE/DELETE)
с никнеймами авторов. Видим всем, у кого есть доступ к проекту,
в отличие от глобального /audit-logs (только для админов).

Operation ID: `list_project_notes_activity_api_v1_projects__project_id__notes_activity_get`.

Обработчик: `list_project_notes_activity` — [backend/app/routers/project_notes.py:35](../backend/app/routers/project_notes.py#L35).

Явные dependencies: `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `limit` | query | `integer` | нет | {"maximum": 200, "minimum": 1, "default": 30} |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: list[object] |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v1/projects/{project_id}/notes/{note_id}

Get Project Note

Operation ID: `get_project_note_api_v1_projects__project_id__notes__note_id__get`.

Обработчик: `get_project_note` — [backend/app/routers/project_notes.py:62](../backend/app/routers/project_notes.py#L62).

Явные dependencies: `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `note_id` | path | `integer` | да | — |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: ProjectNoteOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### PUT /api/v1/projects/{project_id}/notes/{note_id}

Update Project Note

Operation ID: `update_project_note_api_v1_projects__project_id__notes__note_id__put`.

Обработчик: `update_project_note` — [backend/app/routers/project_notes.py:73](../backend/app/routers/project_notes.py#L73).

Явные dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `note_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

Тело: `application/json`, схема `ProjectNoteUpdate`, обязательно.

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: ProjectNoteOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### DELETE /api/v1/projects/{project_id}/notes/{note_id}

Delete Project Note

Operation ID: `delete_project_note_api_v1_projects__project_id__notes__note_id__delete`.

Обработчик: `delete_project_note` — [backend/app/routers/project_notes.py:119](../backend/app/routers/project_notes.py#L119).

Явные dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `note_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 204 | Successful Response | без тела/см. обработчик |
| 422 | Validation Error | application/json: HTTPValidationError |

### PATCH /api/v1/projects/{project_id}/notes/{note_id}/move

Move Project Note

Operation ID: `move_project_note_api_v1_projects__project_id__notes__note_id__move_patch`.

Обработчик: `move_project_note` — [backend/app/routers/project_notes.py:87](../backend/app/routers/project_notes.py#L87).

Явные dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `note_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

Тело: `application/json`, схема `ProjectNoteMove`, обязательно.

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: ProjectNoteOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### PATCH /api/v1/projects/{project_id}/notes/reorder

Reorder Project Notes

Operation ID: `reorder_project_notes_api_v1_projects__project_id__notes_reorder_patch`.

Обработчик: `reorder_project_notes` — [backend/app/routers/project_notes.py:101](../backend/app/routers/project_notes.py#L101).

Явные dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

Тело: `application/json`, схема `ProjectNoteReorder`, обязательно.

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: list[ProjectNoteOut] |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v1/projects/{project_id}/notes/{note_id}/comments

List Note Comments

Operation ID: `list_note_comments_api_v1_projects__project_id__notes__note_id__comments_get`.

Обработчик: `list_note_comments` — [backend/app/routers/project_notes.py:131](../backend/app/routers/project_notes.py#L131).

Явные dependencies: `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `note_id` | path | `integer` | да | — |
| `page` | query | `integer` | нет | {"minimum": 1, "default": 1} |
| `size` | query | `integer` | нет | {"maximum": 200, "minimum": 1, "default": 50} |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: object |
| 422 | Validation Error | application/json: HTTPValidationError |

### POST /api/v1/projects/{project_id}/notes/{note_id}/comments

Create Note Comment

Operation ID: `create_note_comment_api_v1_projects__project_id__notes__note_id__comments_post`.

Обработчик: `create_note_comment` — [backend/app/routers/project_notes.py:148](../backend/app/routers/project_notes.py#L148).

Явные dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `note_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

Тело: `application/json`, схема `ProjectNoteCommentCreate`, обязательно.

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 201 | Successful Response | application/json: ProjectNoteCommentOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### PUT /api/v1/projects/{project_id}/notes/{note_id}/comments/{comment_id}

Update Note Comment

Operation ID: `update_note_comment_api_v1_projects__project_id__notes__note_id__comments__comment_id__put`.

Обработчик: `update_note_comment` — [backend/app/routers/project_notes.py:161](../backend/app/routers/project_notes.py#L161).

Явные dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `note_id` | path | `integer` | да | — |
| `comment_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

Тело: `application/json`, схема `ProjectNoteCommentUpdate`, обязательно.

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: ProjectNoteCommentOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### DELETE /api/v1/projects/{project_id}/notes/{note_id}/comments/{comment_id}

Delete Note Comment

Operation ID: `delete_note_comment_api_v1_projects__project_id__notes__note_id__comments__comment_id__delete`.

Обработчик: `delete_note_comment` — [backend/app/routers/project_notes.py:175](../backend/app/routers/project_notes.py#L175).

Явные dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `note_id` | path | `integer` | да | — |
| `comment_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 204 | Successful Response | без тела/см. обработчик |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v1/projects/{project_id}/credentials

List Project Credentials

Operation ID: `list_project_credentials_api_v1_projects__project_id__credentials_get`.

Обработчик: `list_project_credentials` — [backend/app/routers/project_credentials.py:19](../backend/app/routers/project_credentials.py#L19).

Явные dependencies: `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: list[ProjectCredentialOut] |
| 422 | Validation Error | application/json: HTTPValidationError |

### POST /api/v1/projects/{project_id}/credentials

Create Project Credential

Operation ID: `create_project_credential_api_v1_projects__project_id__credentials_post`.

Обработчик: `create_project_credential` — [backend/app/routers/project_credentials.py:33](../backend/app/routers/project_credentials.py#L33).

Явные dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

Тело: `application/json`, схема `ProjectCredentialCreate`, обязательно.

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 201 | Successful Response | application/json: ProjectCredentialOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### PUT /api/v1/projects/{project_id}/credentials/{credential_id}

Update Project Credential

Operation ID: `update_project_credential_api_v1_projects__project_id__credentials__credential_id__put`.

Обработчик: `update_project_credential` — [backend/app/routers/project_credentials.py:46](../backend/app/routers/project_credentials.py#L46).

Явные dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `credential_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

Тело: `application/json`, схема `ProjectCredentialUpdate`, обязательно.

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: ProjectCredentialOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### DELETE /api/v1/projects/{project_id}/credentials/{credential_id}

Delete Project Credential

Operation ID: `delete_project_credential_api_v1_projects__project_id__credentials__credential_id__delete`.

Обработчик: `delete_project_credential` — [backend/app/routers/project_credentials.py:65](../backend/app/routers/project_credentials.py#L65).

Явные dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `credential_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 204 | Successful Response | без тела/см. обработчик |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v1/projects/{project_id}/host-creation-times

Даты создания всех хостов для графиков без IP, портов и эндпоинтов.

Operation ID: `list_host_creation_times_api_v1_projects__project_id__host_creation_times_get`.

Обработчик: `list_host_creation_times` — [backend/app/routers/assets.py:39](../backend/app/routers/assets.py#L39).

Явные dependencies: `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: list[string] |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v1/projects/{project_id}/hosts

Возвращает список хостов проекта.

По умолчанию только origin=host: служебные родители адресов из фермы IP
в списке хостов не показываются. all — нужен фронту, чтобы одним запросом
наполнить и таблицу хостов, и таблицу IP.

Operation ID: `list_hosts_api_v1_projects__project_id__hosts_get`.

Обработчик: `list_hosts` — [backend/app/routers/assets.py:49](../backend/app/routers/assets.py#L49).

Явные dependencies: `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `page` | query | `integer` | нет | {"minimum": 1, "default": 1} |
| `size` | query | `integer` | нет | {"maximum": 200, "minimum": 1, "default": 20} |
| `status` | query | `HostStatus \| null` | нет | — |
| `origin` | query | `string` | нет | {"pattern": "^(host\|ip\|all)$", "default": "host"} |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: PaginatedResponse_HostOut_ |
| 422 | Validation Error | application/json: HTTPValidationError |

### POST /api/v1/projects/{project_id}/hosts

Создаёт хост; probe=true запускает защищённую пробивку через очередь рекон-фермы.

Operation ID: `create_host_api_v1_projects__project_id__hosts_post`.

Обработчик: `create_host` — [backend/app/routers/assets.py:69](../backend/app/routers/assets.py#L69).

Явные dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

Тело: `application/json`, схема `HostCreate`, обязательно.

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 201 | Successful Response | application/json: HostOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v1/projects/{project_id}/hosts/{host_id}

Возвращает хост с вложенными сущностями.

Operation ID: `get_host_api_v1_projects__project_id__hosts__host_id__get`.

Обработчик: `get_host` — [backend/app/routers/assets.py:84](../backend/app/routers/assets.py#L84).

Явные dependencies: `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `host_id` | path | `integer` | да | — |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: object |
| 422 | Validation Error | application/json: HTTPValidationError |

### PUT /api/v1/projects/{project_id}/hosts/{host_id}

Обновляет хост.

Operation ID: `update_host_api_v1_projects__project_id__hosts__host_id__put`.

Обработчик: `update_host` — [backend/app/routers/assets.py:95](../backend/app/routers/assets.py#L95).

Явные dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `host_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

Тело: `application/json`, схема `HostUpdate`, обязательно.

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: HostOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### DELETE /api/v1/projects/{project_id}/hosts/{host_id}

Удаляет хост.

Operation ID: `delete_host_api_v1_projects__project_id__hosts__host_id__delete`.

Обработчик: `delete_host` — [backend/app/routers/assets.py:110](../backend/app/routers/assets.py#L110).

Явные dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `host_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 204 | Successful Response | без тела/см. обработчик |
| 422 | Validation Error | application/json: HTTPValidationError |

### PUT /api/v1/projects/{project_id}/ip-addresses/{old_ip}

Обновляет IP проекта и ставит повторный пробив после сброса старых замеров.

Operation ID: `change_ip_address_api_v1_projects__project_id__ip_addresses__old_ip__put`.

Обработчик: `change_ip_address` — [backend/app/routers/assets.py:124](../backend/app/routers/assets.py#L124).

Явные dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `old_ip` | path | `string` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

Тело: `application/json`, схема `IpAddressChangeRequest`, обязательно.

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 202 | Successful Response | application/json: IpAddressChangeOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v1/projects/{project_id}/hidden-ips

Адреса, скрытые из списка IP этого проекта (фронт фильтрует по ним).

Operation ID: `list_hidden_ips_api_v1_projects__project_id__hidden_ips_get`.

Обработчик: `list_hidden_ips` — [backend/app/routers/assets.py:141](../backend/app/routers/assets.py#L141).

Явные dependencies: `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: list[string] |
| 422 | Validation Error | application/json: HTTPValidationError |

### POST /api/v1/projects/{project_id}/hidden-ips

Скрывает адрес из списка IP: сносит отдельную IP-запись (origin='ip') с этим
адресом, но привязку к домен-хостам сохраняет.

Operation ID: `hide_ip_api_v1_projects__project_id__hidden_ips_post`.

Обработчик: `hide_ip` — [backend/app/routers/assets.py:151](../backend/app/routers/assets.py#L151).

Явные dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

Тело: `application/json`, схема `HiddenIpCreate`, обязательно.

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 204 | Successful Response | без тела/см. обработчик |
| 422 | Validation Error | application/json: HTTPValidationError |

### DELETE /api/v1/projects/{project_id}/hidden-ips/{ip_address}

Снимает адрес со скрытия — снова показывается в списке IP.

Operation ID: `unhide_ip_api_v1_projects__project_id__hidden_ips__ip_address__delete`.

Обработчик: `unhide_ip` — [backend/app/routers/assets.py:165](../backend/app/routers/assets.py#L165).

Явные dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `ip_address` | path | `string` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 204 | Successful Response | без тела/см. обработчик |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v1/projects/{project_id}/hosts/{host_id}/ports

Возвращает список портов хоста.

Operation ID: `list_ports_api_v1_projects__project_id__hosts__host_id__ports_get`.

Обработчик: `list_ports` — [backend/app/routers/assets.py:178](../backend/app/routers/assets.py#L178).

Явные dependencies: `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `host_id` | path | `integer` | да | — |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: list[PortOut] |
| 422 | Validation Error | application/json: HTTPValidationError |

### POST /api/v1/projects/{project_id}/hosts/{host_id}/ports

Создаёт порт хоста.

Operation ID: `create_port_api_v1_projects__project_id__hosts__host_id__ports_post`.

Обработчик: `create_port` — [backend/app/routers/assets.py:190](../backend/app/routers/assets.py#L190).

Явные dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `host_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

Тело: `application/json`, схема `PortCreate`, обязательно.

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 201 | Successful Response | application/json: PortOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v1/projects/{project_id}/hosts/{host_id}/ports/{port_id}

Возвращает порт.

Operation ID: `get_port_api_v1_projects__project_id__hosts__host_id__ports__port_id__get`.

Обработчик: `get_port` — [backend/app/routers/assets.py:205](../backend/app/routers/assets.py#L205).

Явные dependencies: `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `host_id` | path | `integer` | да | — |
| `port_id` | path | `integer` | да | — |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: PortOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### PUT /api/v1/projects/{project_id}/hosts/{host_id}/ports/{port_id}

Обновляет порт.

Operation ID: `update_port_api_v1_projects__project_id__hosts__host_id__ports__port_id__put`.

Обработчик: `update_port` — [backend/app/routers/assets.py:218](../backend/app/routers/assets.py#L218).

Явные dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `host_id` | path | `integer` | да | — |
| `port_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

Тело: `application/json`, схема `PortUpdate`, обязательно.

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: PortOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### DELETE /api/v1/projects/{project_id}/hosts/{host_id}/ports/{port_id}

Удаляет порт.

Operation ID: `delete_port_api_v1_projects__project_id__hosts__host_id__ports__port_id__delete`.

Обработчик: `delete_port` — [backend/app/routers/assets.py:234](../backend/app/routers/assets.py#L234).

Явные dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `host_id` | path | `integer` | да | — |
| `port_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 204 | Successful Response | без тела/см. обработчик |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v1/projects/{project_id}/hosts/{host_id}/ports/{port_id}/services

Возвращает список сервисов порта.

Operation ID: `list_services_api_v1_projects__project_id__hosts__host_id__ports__port_id__services_get`.

Обработчик: `list_services` — [backend/app/routers/assets.py:248](../backend/app/routers/assets.py#L248).

Явные dependencies: `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `host_id` | path | `integer` | да | — |
| `port_id` | path | `integer` | да | — |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: list[ServiceOut] |
| 422 | Validation Error | application/json: HTTPValidationError |

### POST /api/v1/projects/{project_id}/hosts/{host_id}/ports/{port_id}/services

Создаёт сервис.

Operation ID: `create_service_api_v1_projects__project_id__hosts__host_id__ports__port_id__services_post`.

Обработчик: `create_service` — [backend/app/routers/assets.py:265](../backend/app/routers/assets.py#L265).

Явные dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `host_id` | path | `integer` | да | — |
| `port_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

Тело: `application/json`, схема `ServiceCreate`, обязательно.

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 201 | Successful Response | application/json: ServiceOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### PUT /api/v1/projects/{project_id}/hosts/{host_id}/ports/{port_id}/services/{service_id}

Обновляет сервис.

Operation ID: `update_service_api_v1_projects__project_id__hosts__host_id__ports__port_id__services__service_id__put`.

Обработчик: `update_service` — [backend/app/routers/assets.py:281](../backend/app/routers/assets.py#L281).

Явные dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `host_id` | path | `integer` | да | — |
| `port_id` | path | `integer` | да | — |
| `service_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

Тело: `application/json`, схема `ServiceUpdate`, обязательно.

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: ServiceOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### DELETE /api/v1/projects/{project_id}/hosts/{host_id}/ports/{port_id}/services/{service_id}

Удаляет сервис.

Operation ID: `delete_service_api_v1_projects__project_id__hosts__host_id__ports__port_id__services__service_id__delete`.

Обработчик: `delete_service` — [backend/app/routers/assets.py:305](../backend/app/routers/assets.py#L305).

Явные dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `host_id` | path | `integer` | да | — |
| `port_id` | path | `integer` | да | — |
| `service_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 204 | Successful Response | без тела/см. обработчик |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v1/projects/{project_id}/js-files

JS-файлы проекта с находками (пагинация) — раздел JS группирует по хосту на фронте.

Operation ID: `list_js_files_api_v1_projects__project_id__js_files_get`.

Обработчик: `list_js_files` — [backend/app/routers/assets.py:320](../backend/app/routers/assets.py#L320).

Явные dependencies: `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `page` | query | `integer` | нет | {"minimum": 1, "default": 1} |
| `size` | query | `integer` | нет | {"maximum": 1000, "minimum": 1, "default": 200} |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: PaginatedResponse_JsFileOut_ |
| 422 | Validation Error | application/json: HTTPValidationError |

### POST /api/v1/projects/{project_id}/js-files/bulk-delete

Удаляет JS-находки проекта по списку id. Отдаёт {"deleted": N}.

Operation ID: `bulk_delete_js_files_api_v1_projects__project_id__js_files_bulk_delete_post`.

Обработчик: `bulk_delete_js_files` — [backend/app/routers/assets.py:336](../backend/app/routers/assets.py#L336).

Явные dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

Тело: `application/json`, схема `JsBulkDeleteRequest`, обязательно.

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: object |
| 422 | Validation Error | application/json: HTTPValidationError |

### DELETE /api/v1/projects/{project_id}/js-files/hosts/{host_id}

Удаляет все JS-находки одного хоста в проекте.

Operation ID: `delete_js_for_host_api_v1_projects__project_id__js_files_hosts__host_id__delete`.

Обработчик: `delete_js_for_host` — [backend/app/routers/assets.py:352](../backend/app/routers/assets.py#L352).

Явные dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `host_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 204 | Successful Response | без тела/см. обработчик |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v1/projects/{project_id}/js-files/archive

Zip-архив найденных .js. Файлы в БД не хранятся — их URL докачиваются по
требованию через тот же SSRF-safe транспорт, что и скан. `host_id` сужает
архив до одного хоста; без него — все домены проекта.

Operation ID: `download_js_archive_api_v1_projects__project_id__js_files_archive_get`.

Обработчик: `download_js_archive` — [backend/app/routers/assets.py:365](../backend/app/routers/assets.py#L365).

Явные dependencies: `require_project_access`, `get_current_user`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `host_id` | query | `integer \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: object |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v1/projects/{project_id}/hosts/{host_id}/endpoints

Возвращает endpoints хоста.

Operation ID: `list_endpoints_api_v1_projects__project_id__hosts__host_id__endpoints_get`.

Обработчик: `list_endpoints` — [backend/app/routers/assets.py:384](../backend/app/routers/assets.py#L384).

Явные dependencies: `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `host_id` | path | `integer` | да | — |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: list[EndpointOut] |
| 422 | Validation Error | application/json: HTTPValidationError |

### POST /api/v1/projects/{project_id}/hosts/{host_id}/endpoints

Создаёт endpoint.

Operation ID: `create_endpoint_api_v1_projects__project_id__hosts__host_id__endpoints_post`.

Обработчик: `create_endpoint` — [backend/app/routers/assets.py:396](../backend/app/routers/assets.py#L396).

Явные dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `host_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

Тело: `application/json`, схема `EndpointCreate`, обязательно.

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 201 | Successful Response | application/json: EndpointOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### PUT /api/v1/projects/{project_id}/hosts/{host_id}/endpoints/{endpoint_id}

Обновляет endpoint.

Operation ID: `update_endpoint_api_v1_projects__project_id__hosts__host_id__endpoints__endpoint_id__put`.

Обработчик: `update_endpoint` — [backend/app/routers/assets.py:411](../backend/app/routers/assets.py#L411).

Явные dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `host_id` | path | `integer` | да | — |
| `endpoint_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

Тело: `application/json`, схема `EndpointUpdate`, обязательно.

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: EndpointOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### DELETE /api/v1/projects/{project_id}/hosts/{host_id}/endpoints/{endpoint_id}

Удаляет endpoint.

Operation ID: `delete_endpoint_api_v1_projects__project_id__hosts__host_id__endpoints__endpoint_id__delete`.

Обработчик: `delete_endpoint` — [backend/app/routers/assets.py:427](../backend/app/routers/assets.py#L427).

Явные dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `host_id` | path | `integer` | да | — |
| `endpoint_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 204 | Successful Response | без тела/см. обработчик |
| 422 | Validation Error | application/json: HTTPValidationError |

### POST /api/v1/projects/{project_id}/host-farm

Парсит вставленный список (синхронно) и ставит пробив в фон.

Operation ID: `start_host_farm_api_v1_projects__project_id__host_farm_post`.

Обработчик: `start_host_farm` — [backend/app/routers/farm.py:25](../backend/app/routers/farm.py#L25).

Явные dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

Тело: `application/json`, схема `HostFarmRequest`, обязательно.

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 202 | Successful Response | application/json: HostFarmJobOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v1/projects/{project_id}/host-farm/jobs/{job_id}

Статус фоновой задачи фермы хостов (фронт опрашивает до status=done).

Operation ID: `get_host_farm_job_api_v1_projects__project_id__host_farm_jobs__job_id__get`.

Обработчик: `get_host_farm_job` — [backend/app/routers/farm.py:41](../backend/app/routers/farm.py#L41).

Явные dependencies: `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `job_id` | path | `integer` | да | — |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: HostFarmJobOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### POST /api/v1/projects/{project_id}/ip-farm

Парсит вставленный список адресов и ставит обратный резолв + пробив в фон.

Operation ID: `start_ip_farm_api_v1_projects__project_id__ip_farm_post`.

Обработчик: `start_ip_farm` — [backend/app/routers/farm.py:57](../backend/app/routers/farm.py#L57).

Явные dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

Тело: `application/json`, схема `IpFarmRequest`, обязательно.

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 202 | Successful Response | application/json: IpFarmJobOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v1/projects/{project_id}/ip-farm/jobs/{job_id}

Статус фоновой задачи фермы IP. Задачу чужого kind не отдаёт.

Operation ID: `get_ip_farm_job_api_v1_projects__project_id__ip_farm_jobs__job_id__get`.

Обработчик: `get_ip_farm_job` — [backend/app/routers/farm.py:73](../backend/app/routers/farm.py#L73).

Явные dependencies: `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `job_id` | path | `integer` | да | — |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: IpFarmJobOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### POST /api/v1/projects/{project_id}/js-farm

Снимает домены проекта (или из payload.raw) и ставит скан JS в фон.

Operation ID: `start_js_farm_api_v1_projects__project_id__js_farm_post`.

Обработчик: `start_js_farm` — [backend/app/routers/farm.py:89](../backend/app/routers/farm.py#L89).

Явные dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

Тело: `application/json`, схема `JsFarmRequest`, обязательно.

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 202 | Successful Response | application/json: JsFarmJobOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v1/projects/{project_id}/js-farm/jobs/{job_id}

Статус фоновой задачи фермы JS. Задачу чужого kind не отдаёт.

Operation ID: `get_js_farm_job_api_v1_projects__project_id__js_farm_jobs__job_id__get`.

Обработчик: `get_js_farm_job` — [backend/app/routers/farm.py:105](../backend/app/routers/farm.py#L105).

Явные dependencies: `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `job_id` | path | `integer` | да | — |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: JsFarmJobOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### POST /api/v1/projects/{project_id}/scanner/subdomains

Снимает корни (или домены проекта) и ставит раскрытие поддоменов в фон.

Operation ID: `start_subdomain_scan_api_v1_projects__project_id__scanner_subdomains_post`.

Обработчик: `start_subdomain_scan` — [backend/app/routers/scanner.py:32](../backend/app/routers/scanner.py#L32).

Явные dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

Тело: `application/json`, схема `SubFarmRequest`, обязательно.

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 202 | Successful Response | application/json: SubFarmJobOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v1/projects/{project_id}/scanner/subdomains/jobs/{job_id}

Статус задачи раскрытия поддоменов. Задачу чужого kind не отдаёт.

Operation ID: `get_subdomain_job_api_v1_projects__project_id__scanner_subdomains_jobs__job_id__get`.

Обработчик: `get_subdomain_job` — [backend/app/routers/scanner.py:51](../backend/app/routers/scanner.py#L51).

Явные dependencies: `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `job_id` | path | `integer` | да | — |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: SubFarmJobOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### POST /api/v1/projects/{project_id}/scanner/port-scan

Снимает цели (или хосты проекта) и ставит nmap-скан портов в фон.

Operation ID: `start_port_scan_api_v1_projects__project_id__scanner_port_scan_post`.

Обработчик: `start_port_scan` — [backend/app/routers/scanner.py:67](../backend/app/routers/scanner.py#L67).

Явные dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

Тело: `application/json`, схема `PortScanRequest`, обязательно.

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 202 | Successful Response | application/json: PortScanJobOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v1/projects/{project_id}/scanner/port-scan/jobs/{job_id}

Статус задачи скана портов. Задачу чужого kind не отдаёт.

Operation ID: `get_port_scan_job_api_v1_projects__project_id__scanner_port_scan_jobs__job_id__get`.

Обработчик: `get_port_scan_job` — [backend/app/routers/scanner.py:86](../backend/app/routers/scanner.py#L86).

Явные dependencies: `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `job_id` | path | `integer` | да | — |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: PortScanJobOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### POST /api/v1/projects/{project_id}/scanner/reverse

Берёт IP (или все адреса проекта) и ставит обратный резолв с раскрытием
хостов в фон. Этот кросс-рекон намеренно НЕ делается при обычном «Add IPs».

Operation ID: `start_reverse_scan_api_v1_projects__project_id__scanner_reverse_post`.

Обработчик: `start_reverse_scan` — [backend/app/routers/scanner.py:102](../backend/app/routers/scanner.py#L102).

Явные dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

Тело: `application/json`, схема `ReverseFarmRequest`, обязательно.

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 202 | Successful Response | application/json: ReverseFarmJobOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v1/projects/{project_id}/scanner/reverse/jobs/{job_id}

Статус задачи обратного резолва. Задачу чужого kind не отдаёт.

Operation ID: `get_reverse_scan_job_api_v1_projects__project_id__scanner_reverse_jobs__job_id__get`.

Обработчик: `get_reverse_scan_job` — [backend/app/routers/scanner.py:122](../backend/app/routers/scanner.py#L122).

Явные dependencies: `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `job_id` | path | `integer` | да | — |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: ReverseFarmJobOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v1/projects/{project_id}/vulnerabilities

Возвращает список уязвимостей проекта.

Operation ID: `list_vulnerabilities_api_v1_projects__project_id__vulnerabilities_get`.

Обработчик: `list_vulnerabilities` — [backend/app/routers/vulnerabilities.py:26](../backend/app/routers/vulnerabilities.py#L26).

Явные dependencies: `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `page` | query | `integer` | нет | {"minimum": 1, "default": 1} |
| `size` | query | `integer` | нет | {"maximum": 200, "minimum": 1, "default": 20} |
| `severity` | query | `Severity \| null` | нет | — |
| `status` | query | `VulnerabilityStatus \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: PaginatedResponse_VulnerabilityListOut_ |
| 422 | Validation Error | application/json: HTTPValidationError |

### POST /api/v1/projects/{project_id}/vulnerabilities

Создаёт уязвимость.

Operation ID: `create_vulnerability_api_v1_projects__project_id__vulnerabilities_post`.

Обработчик: `create_vulnerability` — [backend/app/routers/vulnerabilities.py:61](../backend/app/routers/vulnerabilities.py#L61).

Явные dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

Тело: `application/json`, схема `VulnerabilityCreate`, обязательно.

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 201 | Successful Response | application/json: VulnerabilityOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v1/projects/{project_id}/hosts/{host_id}/vulnerabilities

Возвращает список уязвимостей, привязанных к конкретному хосту.

Operation ID: `list_host_vulnerabilities_api_v1_projects__project_id__hosts__host_id__vulnerabilities_get`.

Обработчик: `list_host_vulnerabilities` — [backend/app/routers/vulnerabilities.py:45](../backend/app/routers/vulnerabilities.py#L45).

Явные dependencies: `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `host_id` | path | `integer` | да | — |
| `page` | query | `integer` | нет | {"minimum": 1, "default": 1} |
| `size` | query | `integer` | нет | {"maximum": 200, "minimum": 1, "default": 20} |
| `severity` | query | `Severity \| null` | нет | — |
| `status` | query | `VulnerabilityStatus \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: PaginatedResponse_VulnerabilityOut_ |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v1/projects/{project_id}/vulnerabilities/{vuln_id}

Возвращает подробную карточку уязвимости.

Operation ID: `get_vulnerability_api_v1_projects__project_id__vulnerabilities__vuln_id__get`.

Обработчик: `get_vulnerability` — [backend/app/routers/vulnerabilities.py:75](../backend/app/routers/vulnerabilities.py#L75).

Явные dependencies: `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `vuln_id` | path | `integer` | да | — |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: object |
| 422 | Validation Error | application/json: HTTPValidationError |

### PUT /api/v1/projects/{project_id}/vulnerabilities/{vuln_id}

Обновляет уязвимость.

Operation ID: `update_vulnerability_api_v1_projects__project_id__vulnerabilities__vuln_id__put`.

Обработчик: `update_vulnerability` — [backend/app/routers/vulnerabilities.py:93](../backend/app/routers/vulnerabilities.py#L93).

Явные dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `vuln_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

Тело: `application/json`, схема `VulnerabilityUpdate`, обязательно.

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: VulnerabilityOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### DELETE /api/v1/projects/{project_id}/vulnerabilities/{vuln_id}

Удаляет уязвимость.

Operation ID: `delete_vulnerability_api_v1_projects__project_id__vulnerabilities__vuln_id__delete`.

Обработчик: `delete_vulnerability` — [backend/app/routers/vulnerabilities.py:123](../backend/app/routers/vulnerabilities.py#L123).

Явные dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `vuln_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 204 | Successful Response | без тела/см. обработчик |
| 422 | Validation Error | application/json: HTTPValidationError |

### PATCH /api/v1/projects/{project_id}/vulnerabilities/{vuln_id}/status

Меняет статус уязвимости отдельным эндпоинтом.

Operation ID: `patch_vulnerability_status_api_v1_projects__project_id__vulnerabilities__vuln_id__status_patch`.

Обработчик: `patch_vulnerability_status` — [backend/app/routers/vulnerabilities.py:108](../backend/app/routers/vulnerabilities.py#L108).

Явные dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `vuln_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

Тело: `application/json`, схема `VulnerabilityStatusPatch`, обязательно.

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: VulnerabilityOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v1/projects/{project_id}/vulnerabilities/{vuln_id}/assets

Возвращает привязанные активы уязвимости.

Operation ID: `list_vulnerability_assets_api_v1_projects__project_id__vulnerabilities__vuln_id__assets_get`.

Обработчик: `list_vulnerability_assets` — [backend/app/routers/vulnerabilities.py:136](../backend/app/routers/vulnerabilities.py#L136).

Явные dependencies: `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `vuln_id` | path | `integer` | да | — |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: list[VulnerabilityAssetOut] |
| 422 | Validation Error | application/json: HTTPValidationError |

### POST /api/v1/projects/{project_id}/vulnerabilities/{vuln_id}/assets

Привязывает актив к уязвимости.

Operation ID: `add_vulnerability_asset_api_v1_projects__project_id__vulnerabilities__vuln_id__assets_post`.

Обработчик: `add_vulnerability_asset` — [backend/app/routers/vulnerabilities.py:152](../backend/app/routers/vulnerabilities.py#L152).

Явные dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `vuln_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

Тело: `application/json`, схема `VulnerabilityAssetCreate`, обязательно.

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 201 | Successful Response | application/json: VulnerabilityAssetOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### DELETE /api/v1/projects/{project_id}/vulnerabilities/{vuln_id}/assets/{asset_link_id}

Удаляет связь уязвимости с активом.

Operation ID: `delete_vulnerability_asset_api_v1_projects__project_id__vulnerabilities__vuln_id__assets__asset_link_id__delete`.

Обработчик: `delete_vulnerability_asset` — [backend/app/routers/vulnerabilities.py:167](../backend/app/routers/vulnerabilities.py#L167).

Явные dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `vuln_id` | path | `integer` | да | — |
| `asset_link_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 204 | Successful Response | без тела/см. обработчик |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v1/projects/{project_id}/vulnerabilities/{vuln_id}/files

Возвращает список файлов уязвимости.

Operation ID: `list_files_api_v1_projects__project_id__vulnerabilities__vuln_id__files_get`.

Обработчик: `list_files` — [backend/app/routers/files.py:17](../backend/app/routers/files.py#L17).

Явные dependencies: `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `vuln_id` | path | `integer` | да | — |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: list[FileOut] |
| 422 | Validation Error | application/json: HTTPValidationError |

### POST /api/v1/projects/{project_id}/vulnerabilities/{vuln_id}/files

Загружает файл доказательной базы.

Operation ID: `upload_file_api_v1_projects__project_id__vulnerabilities__vuln_id__files_post`.

Обработчик: `upload_file` — [backend/app/routers/files.py:29](../backend/app/routers/files.py#L29).

Явные dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `vuln_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

Тело: `multipart/form-data`, схема `Body_upload_file_api_v1_projects__project_id__vulnerabilities__vuln_id__files_post`, обязательно.

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 201 | Successful Response | application/json: FileOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v1/files/{file_id}/download

Отдаёт бинарный контент файла.

Operation ID: `download_file_api_v1_files__file_id__download_get`.

Обработчик: `download_file` — [backend/app/routers/files.py:44](../backend/app/routers/files.py#L44).

Явные dependencies: `get_current_user`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `file_id` | path | `integer` | да | — |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: object |
| 422 | Validation Error | application/json: HTTPValidationError |

### DELETE /api/v1/projects/{project_id}/vulnerabilities/{vuln_id}/files/{file_id}

Удаляет файл уязвимости.

Operation ID: `delete_file_api_v1_projects__project_id__vulnerabilities__vuln_id__files__file_id__delete`.

Обработчик: `delete_file` — [backend/app/routers/files.py:57](../backend/app/routers/files.py#L57).

Явные dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `vuln_id` | path | `integer` | да | — |
| `file_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 204 | Successful Response | без тела/см. обработчик |
| 422 | Validation Error | application/json: HTTPValidationError |

### POST /api/v1/projects/{project_id}/images

Загружает картинку проекта и возвращает URL для вставки в markdown.

Operation ID: `upload_project_image_api_v1_projects__project_id__images_post`.

Обработчик: `upload_project_image` — [backend/app/routers/images.py:33](../backend/app/routers/images.py#L33).

Явные dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

Тело: `multipart/form-data`, схема `Body_upload_project_image_api_v1_projects__project_id__images_post`, обязательно.

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 201 | Successful Response | application/json: object |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v1/projects/{project_id}/images/{image_name}/download

Отдаёт картинку проекта (доступ — только участникам проекта).

Operation ID: `download_project_image_api_v1_projects__project_id__images__image_name__download_get`.

Обработчик: `download_project_image` — [backend/app/routers/images.py:71](../backend/app/routers/images.py#L71).

Явные dependencies: `get_current_user`, `require_project_access`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `image_name` | path | `string` | да | — |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: object |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v1/projects/{project_id}/vulnerabilities/{vuln_id}/comments

Возвращает комментарии уязвимости.

Operation ID: `list_comments_api_v1_projects__project_id__vulnerabilities__vuln_id__comments_get`.

Обработчик: `list_comments` — [backend/app/routers/comments.py:16](../backend/app/routers/comments.py#L16).

Явные dependencies: `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `vuln_id` | path | `integer` | да | — |
| `page` | query | `integer` | нет | {"minimum": 1, "default": 1} |
| `size` | query | `integer` | нет | {"maximum": 200, "minimum": 1, "default": 50} |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: PaginatedResponse_CommentOut_ |
| 422 | Validation Error | application/json: HTTPValidationError |

### POST /api/v1/projects/{project_id}/vulnerabilities/{vuln_id}/comments

Создаёт комментарий и обрабатывает упоминания.

Operation ID: `create_comment_api_v1_projects__project_id__vulnerabilities__vuln_id__comments_post`.

Обработчик: `create_comment` — [backend/app/routers/comments.py:30](../backend/app/routers/comments.py#L30).

Явные dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `vuln_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

Тело: `application/json`, схема `CommentCreate`, обязательно.

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 201 | Successful Response | application/json: CommentOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### PUT /api/v1/projects/{project_id}/vulnerabilities/{vuln_id}/comments/{comment_id}

Редактирует комментарий.

Operation ID: `update_comment_api_v1_projects__project_id__vulnerabilities__vuln_id__comments__comment_id__put`.

Обработчик: `update_comment` — [backend/app/routers/comments.py:44](../backend/app/routers/comments.py#L44).

Явные dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `vuln_id` | path | `integer` | да | — |
| `comment_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

Тело: `application/json`, схема `CommentUpdate`, обязательно.

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: CommentOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### DELETE /api/v1/projects/{project_id}/vulnerabilities/{vuln_id}/comments/{comment_id}

Удаляет комментарий.

Operation ID: `delete_comment_api_v1_projects__project_id__vulnerabilities__vuln_id__comments__comment_id__delete`.

Обработчик: `delete_comment` — [backend/app/routers/comments.py:59](../backend/app/routers/comments.py#L59).

Явные dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `vuln_id` | path | `integer` | да | — |
| `comment_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 204 | Successful Response | без тела/см. обработчик |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v1/projects/{project_id}/hosts/{host_id}/endpoints/{endpoint_id}/comments

Сохранённые комментарии только указанного эндпоинта, новые первыми.

Operation ID: `list_endpoint_comments_api_v1_projects__project_id__hosts__host_id__endpoints__endpoint_id__comments_get`.

Обработчик: `list_endpoint_comments` — [backend/app/routers/endpoint_comments.py:15](../backend/app/routers/endpoint_comments.py#L15).

Явные dependencies: `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `host_id` | path | `integer` | да | — |
| `endpoint_id` | path | `integer` | да | — |
| `page` | query | `integer` | нет | {"minimum": 1, "default": 1} |
| `size` | query | `integer` | нет | {"maximum": 200, "minimum": 1, "default": 50} |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: PaginatedResponse_EndpointCommentOut_ |
| 422 | Validation Error | application/json: HTTPValidationError |

### POST /api/v1/projects/{project_id}/hosts/{host_id}/endpoints/{endpoint_id}/comments

Добавляет комментарий; запись и аудит сохраняются в одной транзакции.

Operation ID: `create_endpoint_comment_api_v1_projects__project_id__hosts__host_id__endpoints__endpoint_id__comments_post`.

Обработчик: `create_endpoint_comment` — [backend/app/routers/endpoint_comments.py:26](../backend/app/routers/endpoint_comments.py#L26).

Явные dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `host_id` | path | `integer` | да | — |
| `endpoint_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

Тело: `application/json`, схема `EndpointCommentCreate`, обязательно.

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 201 | Successful Response | application/json: EndpointCommentOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v1/notifications

Возвращает уведомления текущего пользователя.

Operation ID: `list_notifications_api_v1_notifications_get`.

Обработчик: `list_notifications` — [backend/app/routers/notifications.py:16](../backend/app/routers/notifications.py#L16).

Явные dependencies: `get_current_user`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `page` | query | `integer` | нет | {"minimum": 1, "default": 1} |
| `size` | query | `integer` | нет | {"maximum": 200, "minimum": 1, "default": 20} |
| `is_read` | query | `boolean \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: PaginatedResponse_NotificationOut_ |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v1/notifications/unread-count

Возвращает количество непрочитанных уведомлений.

Operation ID: `unread_count_api_v1_notifications_unread_count_get`.

Обработчик: `unread_count` — [backend/app/routers/notifications.py:29](../backend/app/routers/notifications.py#L29).

Явные dependencies: `get_current_user`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: UnreadCountOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### PATCH /api/v1/notifications/{notification_id}/read

Помечает уведомление как прочитанное.

Operation ID: `mark_read_api_v1_notifications__notification_id__read_patch`.

Обработчик: `mark_read` — [backend/app/routers/notifications.py:39](../backend/app/routers/notifications.py#L39).

Явные dependencies: `enforce_csrf`, `get_current_user`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `notification_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: NotificationOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### PATCH /api/v1/notifications/read-all

Помечает все уведомления пользователя как прочитанные.

Operation ID: `mark_all_read_api_v1_notifications_read_all_patch`.

Обработчик: `mark_all_read` — [backend/app/routers/notifications.py:58](../backend/app/routers/notifications.py#L58).

Явные dependencies: `enforce_csrf`, `get_current_user`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 204 | Successful Response | без тела/см. обработчик |
| 422 | Validation Error | application/json: HTTPValidationError |

### POST /api/v1/projects/{project_id}/import

Импортирует JSON-структуру активов в проект.

Operation ID: `import_project_data_api_v1_projects__project_id__import_post`.

Обработчик: `import_project_data` — [backend/app/routers/import_.py:18](../backend/app/routers/import_.py#L18).

Явные dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

Тело: `multipart/form-data`, схема `Body_import_project_data_api_v1_projects__project_id__import_post`, обязательно.

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: ImportResult |
| 422 | Validation Error | application/json: HTTPValidationError |

### POST /api/v1/projects/{project_id}/hosts/{host_id}/import-openapi

Импортирует OpenAPI/Swagger JSON/YAML в endpoint-структуру конкретного хоста.

Operation ID: `import_openapi_file_api_v1_projects__project_id__hosts__host_id__import_openapi_post`.

Обработчик: `import_openapi_file` — [backend/app/routers/import_.py:32](../backend/app/routers/import_.py#L32).

Явные dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `host_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

Тело: `multipart/form-data`, схема `Body_import_openapi_file_api_v1_projects__project_id__hosts__host_id__import_openapi_post`, обязательно.

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: OpenApiImportResult |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v1/projects/{project_id}/hosts/{host_id}/export-openapi

Экспортирует эндпоинты хоста в OpenAPI 3.0 JSON.

Operation ID: `export_openapi_file_api_v1_projects__project_id__hosts__host_id__export_openapi_get`.

Обработчик: `export_openapi_file` — [backend/app/routers/import_.py:49](../backend/app/routers/import_.py#L49).

Явные dependencies: `get_current_user`, `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `host_id` | path | `integer` | да | — |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: object |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v1/tasks

Возвращает по 20 тикетов и доступные пользователю связи с проектами.

Operation ID: `list_tasks_api_v1_tasks_get`.

Обработчик: `list_tasks` — [backend/app/routers/task_tracker.py:15](../backend/app/routers/task_tracker.py#L15).

Явные dependencies: `get_current_user`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `query` | query | `string \| null` | нет | — |
| `category` | query | `string \| null` | нет | — |
| `page_number` | query | `integer` | нет | {"maximum": 1000000, "minimum": 0, "default": 0} |
| `sort` | query | `enum(first, last)` | нет | {"default": "last"} |
| `refresh` | query | `boolean` | нет | {"default": false} |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: TaskTrackerTaskListOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v1/tasks/{key}

Читает карточку; ID связанного проекта отдаёт только при наличии доступа.

Operation ID: `get_task_api_v1_tasks__key__get`.

Обработчик: `get_task` — [backend/app/routers/task_tracker.py:25](../backend/app/routers/task_tracker.py#L25).

Явные dependencies: `get_current_user`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `key` | path | `string` | да | — |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: TaskTrackerTaskDetailOut |
| 404 | Тикет не найден | без тела/см. обработчик |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v1/works/config

Публичная конфигурация: доступен ли экспорт находок в Works (AppSec).

Operation ID: `get_works_config_api_v1_works_config_get`.

Обработчик: `get_works_config` — [backend/app/routers/works.py:22](../backend/app/routers/works.py#L22).

Явные dependencies: `get_current_user`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: WorksConfigOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v1/works/components

Подсказки компонентов STS; отказ интеграции возвращает 502/503.

Operation ID: `find_works_components_api_v1_works_components_get`.

Обработчик: `find_works_components` — [backend/app/routers/works.py:28](../backend/app/routers/works.py#L28).

Явные dependencies: `get_current_user`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `q` | query | `string` | нет | {"default": ""} |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: list[WorksRefOut] |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v1/works/versions

Подсказки версий STS; отказ интеграции возвращает 502/503.

Operation ID: `find_works_versions_api_v1_works_versions_get`.

Обработчик: `find_works_versions` — [backend/app/routers/works.py:39](../backend/app/routers/works.py#L39).

Явные dependencies: `get_current_user`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `q` | query | `string` | нет | {"default": ""} |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: list[WorksRefOut] |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v1/works/product-codes

Коды продуктов из taxonomy формы STS с точными значениями code.

Operation ID: `find_works_product_codes_api_v1_works_product_codes_get`.

Обработчик: `find_works_product_codes` — [backend/app/routers/works.py:50](../backend/app/routers/works.py#L50).

Явные dependencies: `get_current_user`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `q` | query | `string` | нет | {"default": ""} |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: list[WorksRefOut] |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v1/projects/{project_id}/vulnerabilities/{vuln_id}/works

Get Vulnerability Works Link

Operation ID: `get_vulnerability_works_link_api_v1_projects__project_id__vulnerabilities__vuln_id__works_get`.

Обработчик: `get_vulnerability_works_link` — [backend/app/routers/works.py:64](../backend/app/routers/works.py#L64).

Явные dependencies: `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `vuln_id` | path | `integer` | да | — |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: WorksIssueLinkOut \| null |
| 422 | Validation Error | application/json: HTTPValidationError |

### POST /api/v1/projects/{project_id}/vulnerabilities/{vuln_id}/works/export

Export Vulnerability To Works

Operation ID: `export_vulnerability_to_works_api_v1_projects__project_id__vulnerabilities__vuln_id__works_export_post`.

Обработчик: `export_vulnerability_to_works` — [backend/app/routers/works.py:77](../backend/app/routers/works.py#L77).

Явные dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `vuln_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

Тело: `application/json`, схема `WorksExportRequest`, обязательно.

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: WorksIssueLinkOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### POST /api/v1/projects/{project_id}/reports/szi

Генерирует Word-отчёт «СЗИ» (для сертификации) по шаблону.

Operation ID: `generate_szi_report_api_v1_projects__project_id__reports_szi_post`.

Обработчик: `generate_szi_report` — [backend/app/routers/reports.py:41](../backend/app/routers/reports.py#L41).

Явные dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: object |
| 422 | Validation Error | application/json: HTTPValidationError |

### POST /api/v1/projects/{project_id}/reports/pp

Генерирует Word-отчёт «ПП» (внутренняя приёмка) по шаблону.

Operation ID: `generate_pp_report_api_v1_projects__project_id__reports_pp_post`.

Обработчик: `generate_pp_report` — [backend/app/routers/reports.py:53](../backend/app/routers/reports.py#L53).

Явные dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `Origin` | header | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: object |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v1/audit-logs

Возвращает журнал действий с фильтрацией.

Operation ID: `list_audit_logs_api_v1_audit_logs_get`.

Обработчик: `list_audit_logs` — [backend/app/routers/audit_logs.py:17](../backend/app/routers/audit_logs.py#L17).

Явные dependencies: `require_admin`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `page` | query | `integer` | нет | {"minimum": 1, "default": 1} |
| `size` | query | `integer` | нет | {"maximum": 200, "minimum": 1, "default": 50} |
| `user_id` | query | `integer \| null` | нет | — |
| `username` | query | `string \| null` | нет | — |
| `action` | query | `string \| null` | нет | — |
| `entity_type` | query | `string \| null` | нет | — |
| `entity_id` | query | `integer \| null` | нет | — |
| `ip_address` | query | `string \| null` | нет | — |
| `query` | query | `string \| null` | нет | — |
| `created_from` | query | `string \| null` | нет | — |
| `created_to` | query | `string \| null` | нет | — |
| `access_token` | cookie | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: object |
| 422 | Validation Error | application/json: HTTPValidationError |

## v2

### GET /api/v2/projects

List Agent Projects

Operation ID: `list_agent_projects_projects_get`.

Обработчик: `list_agent_projects` — [backend/app/routers/v2_agent.py:23](../backend/app/routers/v2_agent.py#L23).

Явные dependencies: `require_agent_scope('projects:read')`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `Authorization` | header | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: list[ProjectOut] |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v2/projects/{project_id}

Get Agent Project

Operation ID: `get_agent_project_projects__project_id__get`.

Обработчик: `get_agent_project` — [backend/app/routers/v2_agent.py:42](../backend/app/routers/v2_agent.py#L42).

Явные dependencies: `require_agent_scope('projects:read')`, `require_agent_project_access`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `Authorization` | header | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: ProjectOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v2/projects/{project_id}/hosts

List Agent Hosts

Operation ID: `list_agent_hosts_projects__project_id__hosts_get`.

Обработчик: `list_agent_hosts` — [backend/app/routers/v2_agent.py:51](../backend/app/routers/v2_agent.py#L51).

Явные dependencies: `require_agent_scope('assets:read')`, `require_agent_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `page` | query | `integer` | нет | {"minimum": 1, "default": 1} |
| `size` | query | `integer` | нет | {"maximum": 200, "minimum": 1, "default": 100} |
| `origin` | query | `string` | нет | {"pattern": "^(host\|ip\|all)$", "default": "host"} |
| `Authorization` | header | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: object |
| 422 | Validation Error | application/json: HTTPValidationError |

### POST /api/v2/projects/{project_id}/hosts

Создаёт хост; probe=true дополнительно ставит защищённую пробивку в очередь.

Operation ID: `create_agent_host_projects__project_id__hosts_post`.

Обработчик: `create_agent_host` — [backend/app/routers/v2_agent.py:76](../backend/app/routers/v2_agent.py#L76).

Явные dependencies: `require_agent_scope('assets:write')`, `require_agent_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `Authorization` | header | `string \| null` | нет | — |

Тело: `application/json`, схема `HostCreate`, обязательно.

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 201 | Successful Response | application/json: HostOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v2/projects/{project_id}/hosts/{host_id}

Get Agent Host

Operation ID: `get_agent_host_projects__project_id__hosts__host_id__get`.

Обработчик: `get_agent_host` — [backend/app/routers/v2_agent.py:65](../backend/app/routers/v2_agent.py#L65).

Явные dependencies: `require_agent_scope('assets:read')`, `require_agent_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `host_id` | path | `integer` | да | — |
| `Authorization` | header | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: object |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v2/projects/{project_id}/hosts/{host_id}/endpoints

Читает эндпоинты хоста, принадлежащего доступному проекту.

Operation ID: `list_agent_endpoints_projects__project_id__hosts__host_id__endpoints_get`.

Обработчик: `list_agent_endpoints` — [backend/app/routers/v2_agent.py:90](../backend/app/routers/v2_agent.py#L90).

Явные dependencies: `require_agent_scope('assets:read')`, `require_agent_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `host_id` | path | `integer` | да | — |
| `Authorization` | header | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: list[EndpointOut] |
| 422 | Validation Error | application/json: HTTPValidationError |

### POST /api/v2/projects/{project_id}/hosts/{host_id}/endpoints

Сохраняет разобранный запрос эндпоинта; сам HTTP-запрос не отправляется.

Operation ID: `create_agent_endpoint_projects__project_id__hosts__host_id__endpoints_post`.

Обработчик: `create_agent_endpoint` — [backend/app/routers/v2_agent.py:116](../backend/app/routers/v2_agent.py#L116).

Явные dependencies: `require_agent_scope('assets:write')`, `require_agent_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `host_id` | path | `integer` | да | — |
| `Authorization` | header | `string \| null` | нет | — |

Тело: `application/json`, схема `EndpointCreate`, обязательно.

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 201 | Successful Response | application/json: EndpointOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v2/projects/{project_id}/hosts/{host_id}/endpoints/{endpoint_id}

Читает один эндпоинт с проверкой всей цепочки проект → хост → эндпоинт.

Operation ID: `get_agent_endpoint_projects__project_id__hosts__host_id__endpoints__endpoint_id__get`.

Обработчик: `get_agent_endpoint` — [backend/app/routers/v2_agent.py:103](../backend/app/routers/v2_agent.py#L103).

Явные dependencies: `require_agent_scope('assets:read')`, `require_agent_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `host_id` | path | `integer` | да | — |
| `endpoint_id` | path | `integer` | да | — |
| `Authorization` | header | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: EndpointOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v2/projects/{project_id}/ip-addresses

Читает страницу всех привязок IP проекта, при необходимости по одному хосту.

Operation ID: `list_agent_ip_addresses_projects__project_id__ip_addresses_get`.

Обработчик: `list_agent_ip_addresses` — [backend/app/routers/v2_agent.py:130](../backend/app/routers/v2_agent.py#L130).

Явные dependencies: `require_agent_scope('assets:read')`, `require_agent_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `page` | query | `integer` | нет | {"minimum": 1, "default": 1} |
| `size` | query | `integer` | нет | {"maximum": 200, "minimum": 1, "default": 100} |
| `host_id` | query | `integer \| null` | нет | — |
| `Authorization` | header | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: PaginatedResponse_HostIpAddressOut_ |
| 422 | Validation Error | application/json: HTTPValidationError |

### POST /api/v2/projects/{project_id}/ip-addresses

Добавляет IPv4/IPv6 к хосту либо отдельным активом, не запуская разведку.

Operation ID: `create_agent_ip_address_projects__project_id__ip_addresses_post`.

Обработчик: `create_agent_ip_address` — [backend/app/routers/v2_agent.py:157](../backend/app/routers/v2_agent.py#L157).

Явные dependencies: `require_agent_scope('assets:write')`, `require_agent_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `Authorization` | header | `string \| null` | нет | — |

Тело: `application/json`, схема `AgentIpAddressCreate`, обязательно.

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 201 | Successful Response | application/json: HostIpAddressOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v2/projects/{project_id}/ip-addresses/{ip_id}

Читает IP проекта с портами и сервисами без обращения к самому адресу.

Operation ID: `get_agent_ip_address_projects__project_id__ip_addresses__ip_id__get`.

Обработчик: `get_agent_ip_address` — [backend/app/routers/v2_agent.py:145](../backend/app/routers/v2_agent.py#L145).

Явные dependencies: `require_agent_scope('assets:read')`, `require_agent_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `ip_id` | path | `integer` | да | — |
| `Authorization` | header | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: HostIpAddressOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v2/projects/{project_id}/credentials

Читает креды только с отдельным scope; запрещает кэширование ответа с паролями.

Operation ID: `list_agent_credentials_projects__project_id__credentials_get`.

Обработчик: `list_agent_credentials` — [backend/app/routers/v2_agent.py:170](../backend/app/routers/v2_agent.py#L170).

Явные dependencies: `require_agent_scope('credentials:read')`, `require_agent_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `Authorization` | header | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: list[ProjectCredentialOut] |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v2/projects/{project_id}/credentials/{credential_id}

Читает одну учётную запись проекта; ответ с паролем не кэшируется.

Operation ID: `get_agent_credential_projects__project_id__credentials__credential_id__get`.

Обработчик: `get_agent_credential` — [backend/app/routers/v2_agent.py:183](../backend/app/routers/v2_agent.py#L183).

Явные dependencies: `require_agent_scope('credentials:read')`, `require_agent_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `credential_id` | path | `integer` | да | — |
| `Authorization` | header | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: ProjectCredentialOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v2/projects/{project_id}/notes

List Agent Notes

Operation ID: `list_agent_notes_projects__project_id__notes_get`.

Обработчик: `list_agent_notes` — [backend/app/routers/v2_agent.py:197](../backend/app/routers/v2_agent.py#L197).

Явные dependencies: `require_agent_scope('notes:read')`, `require_agent_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `Authorization` | header | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: list[ProjectNoteOut] |
| 422 | Validation Error | application/json: HTTPValidationError |

### POST /api/v2/projects/{project_id}/notes

Create Agent Note

Operation ID: `create_agent_note_projects__project_id__notes_post`.

Обработчик: `create_agent_note` — [backend/app/routers/v2_agent.py:220](../backend/app/routers/v2_agent.py#L220).

Явные dependencies: `require_agent_scope('notes:write')`, `require_agent_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `Authorization` | header | `string \| null` | нет | — |

Тело: `application/json`, схема `ProjectNoteCreate`, обязательно.

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 201 | Successful Response | application/json: ProjectNoteOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v2/projects/{project_id}/notes/{note_id}

Get Agent Note

Operation ID: `get_agent_note_projects__project_id__notes__note_id__get`.

Обработчик: `get_agent_note` — [backend/app/routers/v2_agent.py:208](../backend/app/routers/v2_agent.py#L208).

Явные dependencies: `require_agent_scope('notes:read')`, `require_agent_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `note_id` | path | `integer` | да | — |
| `Authorization` | header | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: ProjectNoteOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### PUT /api/v2/projects/{project_id}/notes/{note_id}

Update Agent Note

Operation ID: `update_agent_note_projects__project_id__notes__note_id__put`.

Обработчик: `update_agent_note` — [backend/app/routers/v2_agent.py:232](../backend/app/routers/v2_agent.py#L232).

Явные dependencies: `require_agent_scope('notes:write')`, `require_agent_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `note_id` | path | `integer` | да | — |
| `Authorization` | header | `string \| null` | нет | — |

Тело: `application/json`, схема `ProjectNoteUpdate`, обязательно.

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: ProjectNoteOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v2/projects/{project_id}/hosts/{host_id}/vulnerabilities

List Agent Host Vulnerabilities

Operation ID: `list_agent_host_vulnerabilities_projects__project_id__hosts__host_id__vulnerabilities_get`.

Обработчик: `list_agent_host_vulnerabilities` — [backend/app/routers/v2_agent.py:245](../backend/app/routers/v2_agent.py#L245).

Явные dependencies: `require_agent_scope('vulns:read')`, `require_agent_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `host_id` | path | `integer` | да | — |
| `page` | query | `integer` | нет | {"minimum": 1, "default": 1} |
| `size` | query | `integer` | нет | {"maximum": 200, "minimum": 1, "default": 100} |
| `Authorization` | header | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: object |
| 422 | Validation Error | application/json: HTTPValidationError |

### GET /api/v2/projects/{project_id}/hosts/{host_id}/vulnerabilities/{vulnerability_id}

Get Agent Host Vulnerability

Operation ID: `get_agent_host_vulnerability_projects__project_id__hosts__host_id__vulnerabilities__vulnerability_id__get`.

Обработчик: `get_agent_host_vulnerability` — [backend/app/routers/v2_agent.py:259](../backend/app/routers/v2_agent.py#L259).

Явные dependencies: `require_agent_scope('vulns:read')`, `require_agent_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `host_id` | path | `integer` | да | — |
| `vulnerability_id` | path | `integer` | да | — |
| `Authorization` | header | `string \| null` | нет | — |

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: VulnerabilityOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### POST /api/v2/projects/{project_id}/vulnerabilities

Create Agent Vulnerability

Operation ID: `create_agent_vulnerability_projects__project_id__vulnerabilities_post`.

Обработчик: `create_agent_vulnerability` — [backend/app/routers/v2_agent.py:280](../backend/app/routers/v2_agent.py#L280).

Явные dependencies: `require_agent_scope('vulns:write')`, `require_agent_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `Authorization` | header | `string \| null` | нет | — |

Тело: `application/json`, схема `VulnerabilityCreate`, обязательно.

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 201 | Successful Response | application/json: VulnerabilityOut |
| 422 | Validation Error | application/json: HTTPValidationError |

### PUT /api/v2/projects/{project_id}/vulnerabilities/{vuln_id}

Update Agent Vulnerability

Operation ID: `update_agent_vulnerability_projects__project_id__vulnerabilities__vuln_id__put`.

Обработчик: `update_agent_vulnerability` — [backend/app/routers/v2_agent.py:292](../backend/app/routers/v2_agent.py#L292).

Явные dependencies: `require_agent_scope('vulns:write')`, `require_agent_project_access`, `get_db`.

| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |
| --- | --- | --- | --- | --- |
| `project_id` | path | `integer` | да | — |
| `vuln_id` | path | `integer` | да | — |
| `Authorization` | header | `string \| null` | нет | — |

Тело: `application/json`, схема `VulnerabilityUpdate`, обязательно.

| HTTP | Ответ | Тип/схема |
| --- | --- | --- |
| 200 | Successful Response | application/json: VulnerabilityOut |
| 422 | Validation Error | application/json: HTTPValidationError |
