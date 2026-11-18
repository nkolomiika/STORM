# Схемы запросов и ответов API

Сгенерировано из OpenAPI. `required` означает наличие поля; `null` в типе отдельно определяет допустимость пустого значения. Отсутствие поля в PUT не равно явному null: сервисы используют exclude_unset и собственные правила обновления.

## AgentIpAddressCreate

IP агента: привязка к хосту необязательна, адрес строго IPv4/IPv6.

| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `ip_address` | `string` | да | {"maxLength": 45, "minLength": 1} |
| `label` | `string \| null` | нет | — |
| `is_primary` | `boolean` | нет | {"default": false} |
| `host_id` | `integer \| null` | нет | — |

## AgentTokenCreate



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `name` | `string` | да | {"minLength": 1} |
| `scopes` | `list[string]` | нет | — |
| `project_ids` | `list[integer]` | нет | — |
| `all_projects` | `boolean` | нет | {"default": false} |
| `expires_at` | `string \| null` | нет | — |

## AgentTokenCreateResponse



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `id` | `integer` | да | — |
| `name` | `string` | да | — |
| `token_prefix` | `string` | да | — |
| `scopes` | `list[string]` | нет | — |
| `all_projects` | `boolean` | да | — |
| `created_by` | `integer` | да | — |
| `expires_at` | `string \| null` | нет | — |
| `revoked_at` | `string \| null` | нет | — |
| `last_used_at` | `string \| null` | нет | — |
| `created_at` | `string` | да | {"format": "date-time"} |
| `updated_at` | `string` | да | {"format": "date-time"} |
| `project_ids` | `list[integer]` | нет | — |
| `token` | `string` | да | — |

## AgentTokenOut



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `id` | `integer` | да | — |
| `name` | `string` | да | — |
| `token_prefix` | `string` | да | — |
| `scopes` | `list[string]` | нет | — |
| `all_projects` | `boolean` | да | — |
| `created_by` | `integer` | да | — |
| `expires_at` | `string \| null` | нет | — |
| `revoked_at` | `string \| null` | нет | — |
| `last_used_at` | `string \| null` | нет | — |
| `created_at` | `string` | да | {"format": "date-time"} |
| `updated_at` | `string` | да | {"format": "date-time"} |
| `project_ids` | `list[integer]` | нет | — |

## AppSecComponentRef



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `code` | `string` | да | {"maxLength": 64, "minLength": 1} |
| `name` | `string` | да | {"maxLength": 255, "minLength": 1} |

## AppSecVersionRef



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `code` | `string` | да | {"maxLength": 64, "minLength": 1} |
| `name` | `string` | да | {"maxLength": 255, "minLength": 1} |

## AssetType



Тип: `enum(host, port, service, endpoint)`.

## Body_import_openapi_file_api_v1_projects__project_id__hosts__host_id__import_openapi_post



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `file` | `string` | да | {"contentMediaType": "application/octet-stream"} |

## Body_import_project_data_api_v1_projects__project_id__import_post



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `file` | `string` | да | {"contentMediaType": "application/octet-stream"} |

## Body_upload_file_api_v1_projects__project_id__vulnerabilities__vuln_id__files_post



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `file` | `string` | да | {"contentMediaType": "application/octet-stream"} |

## Body_upload_my_avatar_api_v1_users_me_avatar_post



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `avatar` | `string` | да | {"contentMediaType": "application/octet-stream"} |

## Body_upload_project_image_api_v1_projects__project_id__images_post



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `file` | `string` | да | {"contentMediaType": "application/octet-stream"} |

## CommentCreate



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `content` | `string` | да | {"minLength": 1} |

## CommentOut



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `id` | `integer` | да | — |
| `vulnerability_id` | `integer` | да | — |
| `user_id` | `integer` | да | — |
| `username` | `string` | да | — |
| `avatar_url` | `string \| null` | нет | — |
| `content` | `string` | да | — |
| `mentions` | `list[MentionOut]` | да | — |
| `created_at` | `string` | да | {"format": "date-time"} |
| `updated_at` | `string` | да | {"format": "date-time"} |

## CommentUpdate



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `content` | `string` | да | {"minLength": 1} |

## CvssVersion



Тип: `enum(3.1, 4.0)`.

## EndpointCommentCreate



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `content` | `string` | да | {"minLength": 1} |

## EndpointCommentOut



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `id` | `integer` | да | — |
| `endpoint_id` | `integer` | да | — |
| `user_id` | `integer` | да | — |
| `username` | `string` | да | — |
| `avatar_url` | `string \| null` | нет | — |
| `content` | `string` | да | — |
| `created_at` | `string` | да | {"format": "date-time"} |
| `updated_at` | `string` | да | {"format": "date-time"} |

## EndpointCreate



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `path` | `string \| null` | нет | — |
| `method` | `HttpMethod \| null` | нет | — |
| `description` | `string \| null` | нет | — |
| `request_raw` | `string \| null` | нет | — |
| `query_params` | `list[EndpointQueryParam]` | нет | — |
| `request_body` | `string \| null` | нет | — |
| `request_content_type` | `string \| null` | нет | — |
| `request_headers` | `list[EndpointRequestHeader]` | нет | — |

## EndpointOut



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `id` | `integer` | да | — |
| `host_id` | `integer` | да | — |
| `path` | `string` | да | — |
| `method` | `HttpMethod \| null` | да | — |
| `description` | `string \| null` | да | — |
| `query_params` | `list[EndpointQueryParam]` | нет | — |
| `request_body` | `string \| null` | да | — |
| `request_content_type` | `string \| null` | да | — |
| `request_headers` | `list[EndpointRequestHeader]` | нет | — |
| `created_at` | `string` | да | {"format": "date-time"} |
| `updated_at` | `string` | да | {"format": "date-time"} |

## EndpointQueryParam



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `name` | `string` | да | {"minLength": 1} |
| `value` | `string \| null` | нет | — |
| `required` | `boolean` | нет | {"default": false} |
| `description` | `string \| null` | нет | — |

## EndpointRequestHeader



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `name` | `string` | да | {"minLength": 1} |
| `value` | `string` | нет | {"default": ""} |

## EndpointUpdate



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `path` | `string \| null` | нет | — |
| `method` | `HttpMethod \| null` | нет | — |
| `description` | `string \| null` | нет | — |
| `request_raw` | `string \| null` | нет | — |
| `query_params` | `list[EndpointQueryParam] \| null` | нет | — |
| `request_body` | `string \| null` | нет | — |
| `request_content_type` | `string \| null` | нет | — |
| `request_headers` | `list[EndpointRequestHeader] \| null` | нет | — |

## FileOut



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `id` | `integer` | да | — |
| `original_name` | `string` | да | — |
| `content_type` | `string` | да | — |
| `size_bytes` | `integer` | да | — |
| `uploaded_by` | `integer` | да | — |
| `uploaded_at` | `string` | да | {"format": "date-time"} |

## HTTPValidationError



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `detail` | `list[ValidationError]` | нет | — |

## HiddenIpCreate

Адрес, который нужно скрыть из списка IP проекта (см. ProjectHiddenIp).

| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `ip_address` | `string` | да | {"maxLength": 45, "minLength": 1} |

## HostCreate



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `ip_address` | `string \| null` | нет | — |
| `ip_addresses` | `list[string]` | нет | — |
| `hostname` | `string \| null` | нет | — |
| `status` | `HostStatus` | нет | {"default": "unknown"} |
| `os_type` | `OsType` | нет | {"default": "unknown"} |
| `notes` | `string \| null` | нет | — |

## HostFarmHostResult



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `hostname` | `string \| null` | нет | — |
| `ip_address` | `string \| null` | нет | — |
| `status` | `string` | да | — |
| `created` | `boolean` | нет | {"default": false} |
| `ports` | `list[HostFarmPortResult]` | нет | — |

## HostFarmJobOut



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `id` | `integer` | да | — |
| `project_id` | `integer` | да | — |
| `kind` | `string` | нет | {"default": "hosts"} |
| `status` | `string` | да | — |
| `targets_total` | `integer \| null` | нет | — |
| `result` | `HostFarmResult \| null` | нет | — |
| `error` | `string \| null` | нет | — |
| `created_at` | `string` | да | {"format": "date-time"} |

## HostFarmPortResult



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `port_number` | `integer` | да | — |
| `protocol` | `string` | да | — |
| `scheme` | `string` | да | — |
| `http_status` | `integer \| null` | нет | — |
| `state` | `string` | да | — |
| `inferred` | `boolean` | нет | {"default": false} |

## HostFarmRequest



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `raw` | `string` | да | {"maxLength": 262144, "minLength": 1} |

## HostFarmResult



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `targets_parsed` | `integer` | нет | {"default": 0} |
| `targets_invalid` | `integer` | нет | {"default": 0} |
| `hosts_created` | `integer` | нет | {"default": 0} |
| `hosts_updated` | `integer` | нет | {"default": 0} |
| `hosts_skipped` | `integer` | нет | {"default": 0} |
| `ports_created` | `integer` | нет | {"default": 0} |
| `ports_updated` | `integer` | нет | {"default": 0} |
| `hosts_online` | `integer` | нет | {"default": 0} |
| `hosts_offline` | `integer` | нет | {"default": 0} |
| `ips_promoted` | `integer` | нет | {"default": 0} |
| `hosts` | `list[HostFarmHostResult]` | нет | — |
| `errors` | `list[string]` | нет | — |

## HostIpAddressCreate



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `ip_address` | `string` | да | {"maxLength": 45, "minLength": 1} |
| `label` | `string \| null` | нет | — |
| `is_primary` | `boolean` | нет | {"default": false} |

## HostIpAddressOut



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `id` | `integer` | да | — |
| `host_id` | `integer` | да | — |
| `ip_address` | `string` | да | — |
| `label` | `string \| null` | да | — |
| `is_primary` | `boolean` | да | — |
| `hostnames` | `list[HostnameResolutionOut]` | нет | — |
| `ports` | `list[PortOut]` | нет | — |
| `created_at` | `string` | да | {"format": "date-time"} |
| `updated_at` | `string` | да | {"format": "date-time"} |

## HostOut



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `id` | `integer` | да | — |
| `project_id` | `integer` | да | — |
| `ip_address` | `string \| null` | да | — |
| `ip_addresses` | `list[HostIpAddressOut]` | нет | — |
| `endpoints` | `list[EndpointOut]` | нет | — |
| `hostname` | `string \| null` | да | — |
| `status` | `HostStatus` | да | — |
| `os_type` | `OsType` | нет | {"default": "unknown"} |
| `notes` | `string \| null` | да | — |
| `origin` | `string` | нет | {"default": "host"} |
| `created_at` | `string` | да | {"format": "date-time"} |
| `updated_at` | `string` | да | {"format": "date-time"} |

## HostStatus



Тип: `enum(up, down, unknown)`.

## HostUpdate



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `ip_address` | `string \| null` | нет | — |
| `ip_addresses` | `list[HostIpAddressCreate] \| null` | нет | — |
| `hostname` | `string \| null` | нет | — |
| `status` | `HostStatus \| null` | нет | — |
| `os_type` | `OsType \| null` | нет | — |
| `notes` | `string \| null` | нет | — |

## HostnameResolutionOut

Имя, в которое резолвится адрес: провенанс + подтверждение прямым резолвом.

| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `hostname` | `string` | да | — |
| `source` | `string` | да | — |
| `confirmed` | `boolean` | нет | {"default": false} |

## HttpMethod



Тип: `enum(GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS, TRACE, QUERY)`.

## ImportResult



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `hosts_created` | `integer` | да | — |
| `ports_created` | `integer` | да | — |
| `services_created` | `integer` | да | — |
| `endpoints_created` | `integer` | да | — |
| `errors` | `list[string]` | да | — |

## InvitationAcceptRequest



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `username` | `string` | да | {"maxLength": 100, "minLength": 3, "pattern": "^[A-Za-zА-Яа-яЁё0-9 ._-]{3,100}$"} |
| `password` | `string` | да | {"maxLength": 128, "minLength": 8} |

## InvitationCreate



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `email` | `string` | да | {"format": "email"} |
| `full_name` | `string \| null` | нет | — |
| `role` | `UserRole` | нет | {"default": "pentester"} |
| `project_role` | `ProjectRole` | нет | {"default": "pentester"} |

## InvitationInfoOut

Публичные данные приглашения по токену (для страницы активации).

| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `valid` | `boolean` | да | — |
| `email` | `string \| null` | нет | — |
| `full_name` | `string \| null` | нет | — |
| `reason` | `string \| null` | нет | — |

## InvitationOut



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `id` | `integer` | да | — |
| `email` | `string` | да | {"format": "email"} |
| `full_name` | `string \| null` | нет | — |
| `role` | `UserRole` | да | — |
| `project_role` | `ProjectRole` | да | — |
| `status` | `string` | да | — |
| `is_expired` | `boolean` | нет | {"default": false} |
| `email_status` | `string \| null` | нет | — |
| `email_error` | `string \| null` | нет | — |
| `email_error_code` | `string \| null` | нет | — |
| `expires_at` | `string` | да | {"format": "date-time"} |
| `invited_by` | `integer \| null` | нет | — |
| `created_at` | `string` | да | {"format": "date-time"} |

## InvitationSentOut

Ответ на создание/переотправку приглашения — с превью письма в dev.

| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `invitation` | `InvitationOut` | да | — |
| `email_sent_to` | `string` | да | {"format": "email"} |
| `mail_preview_url` | `string \| null` | нет | — |
| `activation_url` | `string \| null` | нет | — |

## IpAddressChangeOut



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `old_ip_address` | `string` | да | — |
| `ip_address` | `string` | да | — |
| `updated_hosts` | `integer` | да | — |
| `job` | `IpFarmJobOut` | да | — |

## IpAddressChangeRequest



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `ip_address` | `string` | да | {"maxLength": 45, "minLength": 1} |

## IpFarmIpResult



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `ip_address` | `string` | да | — |
| `host_id` | `integer \| null` | нет | — |
| `hostnames` | `list[HostnameResolutionOut]` | нет | — |
| `created` | `boolean` | нет | {"default": false} |
| `attached_to_existing_host` | `boolean` | нет | {"default": false} |
| `ports` | `list[HostFarmPortResult]` | нет | — |

## IpFarmJobOut

Та же ORM-модель, что у HostFarmJobOut, но result другой формы.

Union не годится: pydantic должен знать точный тип result, а kind задачи
известен на уровне роута — поэтому две схемы вместо одной.

| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `id` | `integer` | да | — |
| `project_id` | `integer` | да | — |
| `kind` | `string` | нет | {"default": "ips"} |
| `status` | `string` | да | — |
| `targets_total` | `integer \| null` | нет | — |
| `result` | `IpFarmResult \| null` | нет | — |
| `error` | `string \| null` | нет | — |
| `created_at` | `string` | да | {"format": "date-time"} |

## IpFarmRequest



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `raw` | `string` | да | {"maxLength": 262144, "minLength": 1} |

## IpFarmResult



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `targets_parsed` | `integer` | нет | {"default": 0} |
| `targets_invalid` | `integer` | нет | {"default": 0} |
| `ips_created` | `integer` | нет | {"default": 0} |
| `ips_updated` | `integer` | нет | {"default": 0} |
| `ips_skipped` | `integer` | нет | {"default": 0} |
| `ports_created` | `integer` | нет | {"default": 0} |
| `ports_updated` | `integer` | нет | {"default": 0} |
| `ips_online` | `integer` | нет | {"default": 0} |
| `ips_offline` | `integer` | нет | {"default": 0} |
| `hostnames_found` | `integer` | нет | {"default": 0} |
| `hosts_promoted` | `integer` | нет | {"default": 0} |
| `ips` | `list[IpFarmIpResult]` | нет | — |
| `errors` | `list[string]` | нет | — |

## JsBulkDeleteRequest



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `ids` | `list[integer]` | нет | — |

## JsFarmFileResult



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `url` | `string` | да | — |
| `hostname` | `string \| null` | нет | — |
| `status` | `string` | да | — |
| `secret_count` | `integer` | нет | {"default": 0} |
| `endpoint_count` | `integer` | нет | {"default": 0} |

## JsFarmJobOut



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `id` | `integer` | да | — |
| `project_id` | `integer` | да | — |
| `kind` | `string` | нет | {"default": "js"} |
| `status` | `string` | да | — |
| `targets_total` | `integer \| null` | нет | — |
| `result` | `JsFarmResult \| null` | нет | — |
| `error` | `string \| null` | нет | — |
| `created_at` | `string` | да | {"format": "date-time"} |

## JsFarmRequest



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `raw` | `string` | нет | {"maxLength": 262144, "default": ""} |

## JsFarmResult



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `domains_scanned` | `integer` | нет | {"default": 0} |
| `files_found` | `integer` | нет | {"default": 0} |
| `files_scanned` | `integer` | нет | {"default": 0} |
| `files_failed` | `integer` | нет | {"default": 0} |
| `secrets_found` | `integer` | нет | {"default": 0} |
| `endpoints_found` | `integer` | нет | {"default": 0} |
| `files` | `list[JsFarmFileResult]` | нет | — |
| `errors` | `list[string]` | нет | — |

## JsFileOut



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `id` | `integer` | да | — |
| `host_id` | `integer` | да | — |
| `hostname` | `string \| null` | нет | — |
| `url` | `string` | да | — |
| `status` | `string` | да | — |
| `size_bytes` | `integer \| null` | нет | — |
| `content_type` | `string \| null` | нет | — |
| `secret_count` | `integer` | нет | {"default": 0} |
| `endpoint_count` | `integer` | нет | {"default": 0} |
| `endpoints` | `list[string]` | нет | — |
| `secrets` | `list[JsSecretOut]` | нет | — |
| `fetched_at` | `string \| null` | нет | — |

## JsSecretOut



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `kind` | `string` | да | — |
| `match_preview` | `string` | да | — |
| `snippet` | `string \| null` | нет | — |
| `severity` | `string` | да | — |

## LoginRequest



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `username` | `string` | да | {"maxLength": 100, "minLength": 1} |
| `password` | `string` | да | {"maxLength": 128, "minLength": 1} |

## LoginResponse



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `requires_2fa` | `boolean` | нет | {"default": false} |
| `id` | `integer \| null` | нет | — |
| `username` | `string \| null` | нет | — |
| `role` | `UserRole \| null` | нет | — |

## MentionOut



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `user_id` | `integer` | да | — |
| `username` | `string` | да | — |

## NotificationContext



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `endpoint_id` | `integer \| null` | нет | — |
| `endpoint_path` | `string \| null` | нет | — |
| `endpoint_method` | `string \| null` | нет | — |
| `hostname` | `string \| null` | нет | — |
| `deadline_date` | `string \| null` | нет | — |
| `vulnerability_id` | `integer \| null` | нет | — |
| `vulnerability_title` | `string \| null` | нет | — |
| `note_id` | `integer \| null` | нет | — |
| `note_title` | `string \| null` | нет | — |
| `project_id` | `integer \| null` | нет | — |
| `project_name` | `string \| null` | нет | — |
| `host_id` | `integer \| null` | нет | — |
| `commenter_username` | `string \| null` | нет | — |
| `status` | `string \| null` | нет | — |

## NotificationOut



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `id` | `integer` | да | — |
| `type` | `string` | да | — |
| `comment_id` | `integer \| null` | да | — |
| `note_comment_id` | `integer \| null` | нет | — |
| `is_read` | `boolean` | да | — |
| `created_at` | `string` | да | {"format": "date-time"} |
| `context` | `NotificationContext \| null` | нет | — |

## OpenApiImportResult



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `host_id` | `integer` | да | — |
| `spec_host` | `string \| null` | нет | — |
| `endpoints_created` | `integer` | да | — |
| `endpoints_skipped` | `integer` | да | — |
| `errors` | `list[string]` | нет | — |

## OsType



Тип: `enum(windows, linux, macos, freebsd, android, ios, other, unknown)`.

## OwnPasswordChangeRequest



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `current_password` | `string` | да | {"maxLength": 128, "minLength": 1} |
| `new_password` | `string` | да | {"maxLength": 128, "minLength": 8} |

## PaginatedResponse_CommentOut_



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `items` | `list[CommentOut]` | да | — |
| `total` | `integer` | да | — |
| `page` | `integer` | да | — |
| `size` | `integer` | да | — |
| `pages` | `integer` | да | — |

## PaginatedResponse_EndpointCommentOut_



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `items` | `list[EndpointCommentOut]` | да | — |
| `total` | `integer` | да | — |
| `page` | `integer` | да | — |
| `size` | `integer` | да | — |
| `pages` | `integer` | да | — |

## PaginatedResponse_HostIpAddressOut_



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `items` | `list[HostIpAddressOut]` | да | — |
| `total` | `integer` | да | — |
| `page` | `integer` | да | — |
| `size` | `integer` | да | — |
| `pages` | `integer` | да | — |

## PaginatedResponse_HostOut_



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `items` | `list[HostOut]` | да | — |
| `total` | `integer` | да | — |
| `page` | `integer` | да | — |
| `size` | `integer` | да | — |
| `pages` | `integer` | да | — |

## PaginatedResponse_JsFileOut_



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `items` | `list[JsFileOut]` | да | — |
| `total` | `integer` | да | — |
| `page` | `integer` | да | — |
| `size` | `integer` | да | — |
| `pages` | `integer` | да | — |

## PaginatedResponse_NotificationOut_



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `items` | `list[NotificationOut]` | да | — |
| `total` | `integer` | да | — |
| `page` | `integer` | да | — |
| `size` | `integer` | да | — |
| `pages` | `integer` | да | — |

## PaginatedResponse_VulnerabilityListOut_



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `items` | `list[VulnerabilityListOut]` | да | — |
| `total` | `integer` | да | — |
| `page` | `integer` | да | — |
| `size` | `integer` | да | — |
| `pages` | `integer` | да | — |

## PaginatedResponse_VulnerabilityOut_



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `items` | `list[VulnerabilityOut]` | да | — |
| `total` | `integer` | да | — |
| `page` | `integer` | да | — |
| `size` | `integer` | да | — |
| `pages` | `integer` | да | — |

## PasswordResetConfirmRequest



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `password` | `string` | да | {"maxLength": 128, "minLength": 8} |

## PasswordResetInfoOut

Проверка ссылки сброса перед показом формы нового пароля.

| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `valid` | `boolean` | да | — |
| `username` | `string \| null` | нет | — |
| `reason` | `string \| null` | нет | — |

## PasswordResetOut



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `ok` | `boolean` | нет | {"default": true} |
| `email_sent_to` | `string` | да | {"format": "email"} |
| `mail_preview_url` | `string \| null` | нет | — |

## PasswordResetRequest

Запрос ссылки восстановления («забыли пароль»).

| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `email` | `string` | да | {"format": "email"} |

## PasswordResetRequestOut

Намеренно НЕ сообщает, есть ли такой пользователь: иначе форма
превращается в инструмент перебора существующих email.

| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `ok` | `boolean` | нет | {"default": true} |
| `mail_preview_url` | `string \| null` | нет | — |

## PortCreate



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `ip_address_id` | `integer` | да | — |
| `port_number` | `integer` | да | {"maximum": 65535.0, "minimum": 1.0} |
| `protocol` | `Protocol` | нет | {"default": "tcp"} |
| `state` | `PortState` | нет | {"default": "open"} |
| `http_status` | `integer \| null` | нет | — |

## PortOut



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `id` | `integer` | да | — |
| `host_id` | `integer` | да | — |
| `ip_address_id` | `integer` | да | — |
| `port_number` | `integer` | да | — |
| `protocol` | `Protocol` | да | — |
| `state` | `PortState` | да | — |
| `http_status` | `integer \| null` | нет | — |
| `services` | `list[ServiceOut]` | нет | — |
| `created_at` | `string` | да | {"format": "date-time"} |
| `updated_at` | `string` | да | {"format": "date-time"} |

## PortScanHostResult



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `hostname` | `string \| null` | нет | — |
| `ip_address` | `string \| null` | нет | — |
| `open_ports` | `list[integer]` | нет | — |

## PortScanJobOut



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `id` | `integer` | да | — |
| `project_id` | `integer` | да | — |
| `kind` | `string` | нет | {"default": "ports"} |
| `status` | `string` | да | — |
| `targets_total` | `integer \| null` | нет | — |
| `result` | `PortScanResult \| null` | нет | — |
| `error` | `string \| null` | нет | — |
| `created_at` | `string` | да | {"format": "date-time"} |

## PortScanRequest



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `raw` | `string` | нет | {"maxLength": 262144, "default": ""} |

## PortScanResult



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `targets_scanned` | `integer` | нет | {"default": 0} |
| `targets_invalid` | `integer` | нет | {"default": 0} |
| `hosts_up` | `integer` | нет | {"default": 0} |
| `ports_found` | `integer` | нет | {"default": 0} |
| `ports_created` | `integer` | нет | {"default": 0} |
| `ports_updated` | `integer` | нет | {"default": 0} |
| `hosts` | `list[PortScanHostResult]` | нет | — |
| `errors` | `list[string]` | нет | — |

## PortState



Тип: `enum(open, closed, filtered)`.

## PortUpdate



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `ip_address_id` | `integer \| null` | нет | — |
| `port_number` | `integer \| null` | нет | — |
| `protocol` | `Protocol \| null` | нет | — |
| `state` | `PortState \| null` | нет | — |
| `http_status` | `integer \| null` | нет | — |

## ProjectCreate



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `name` | `string` | да | {"maxLength": 255, "minLength": 1} |
| `folder` | `string` | нет | {"maxLength": 255, "default": ""} |
| `start_date` | `string \| null` | нет | — |
| `end_date` | `string \| null` | нет | — |
| `appsec_component_code` | `string \| null` | нет | — |
| `appsec_component_name` | `string \| null` | нет | — |
| `appsec_product_code` | `string \| null` | нет | — |
| `appsec_components` | `list[AppSecComponentRef]` | нет | {"maxItems": 100} |
| `appsec_version_code` | `string \| null` | нет | — |
| `appsec_version_name` | `string \| null` | нет | — |
| `appsec_versions` | `list[AppSecVersionRef]` | нет | {"maxItems": 100} |
| `appsec_assignee` | `string \| null` | нет | — |
| `appsec_assignee_name` | `string \| null` | нет | — |
| `appsec_ticket_url` | `string \| null` | нет | — |
| `appsec_ticket_key` | `string \| null` | нет | — |

## ProjectCredentialCreate



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `username` | `string \| null` | нет | — |
| `password` | `string` | да | {"minLength": 1} |
| `host` | `string \| null` | нет | — |

## ProjectCredentialOut



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `id` | `integer` | да | — |
| `project_id` | `integer` | да | — |
| `username` | `string \| null` | да | — |
| `password` | `string \| null` | да | — |
| `password_available` | `boolean` | нет | {"default": true} |
| `host` | `string \| null` | да | — |
| `created_by` | `integer` | да | — |
| `created_by_username` | `string \| null` | нет | — |
| `created_at` | `string` | да | {"format": "date-time"} |
| `updated_at` | `string` | да | {"format": "date-time"} |

## ProjectCredentialUpdate



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `username` | `string \| null` | нет | — |
| `password` | `string \| null` | нет | — |
| `host` | `string \| null` | нет | — |

## ProjectFolderCreate



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `name` | `string` | да | {"maxLength": 255, "minLength": 1} |
| `parent_id` | `integer \| null` | нет | — |

## ProjectFolderMove



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `parent_id` | `integer \| null` | нет | — |

## ProjectFolderOut



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `id` | `integer` | да | — |
| `name` | `string` | да | — |
| `path` | `string` | да | — |
| `parent_id` | `integer \| null` | да | — |
| `created_by` | `integer` | да | — |
| `created_at` | `string` | да | {"format": "date-time"} |
| `updated_at` | `string` | да | {"format": "date-time"} |

## ProjectMemberCreate



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `user_id` | `integer` | да | — |

## ProjectMemberOut



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `user_id` | `integer` | да | — |
| `username` | `string` | да | — |
| `email` | `string` | да | {"format": "email"} |
| `avatar_url` | `string \| null` | нет | — |
| `role` | `UserRole` | да | — |
| `project_role` | `ProjectRole` | нет | {"default": "pentester"} |
| `added_at` | `string` | да | {"format": "date-time"} |

## ProjectNoteCommentCreate



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `content` | `string` | да | {"minLength": 1} |

## ProjectNoteCommentOut



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `id` | `integer` | да | — |
| `project_id` | `integer` | да | — |
| `note_id` | `integer` | да | — |
| `user_id` | `integer` | да | — |
| `username` | `string` | да | — |
| `avatar_url` | `string \| null` | нет | — |
| `content` | `string` | да | — |
| `created_at` | `string` | да | {"format": "date-time"} |
| `updated_at` | `string` | да | {"format": "date-time"} |

## ProjectNoteCommentUpdate



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `content` | `string` | да | {"minLength": 1} |

## ProjectNoteCreate



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `title` | `string` | да | {"maxLength": 255, "minLength": 1} |
| `parent_id` | `integer \| null` | нет | — |
| `content` | `string \| null` | нет | — |

## ProjectNoteMove



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `parent_id` | `integer \| null` | нет | — |

## ProjectNoteOut



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `id` | `integer` | да | — |
| `project_id` | `integer` | да | — |
| `parent_id` | `integer \| null` | да | — |
| `title` | `string` | да | — |
| `content` | `string \| null` | да | — |
| `sort_order` | `integer` | да | — |
| `created_by` | `integer` | да | — |
| `created_by_username` | `string \| null` | нет | — |
| `updated_by` | `integer \| null` | да | — |
| `created_at` | `string` | да | {"format": "date-time"} |
| `updated_at` | `string` | да | {"format": "date-time"} |

## ProjectNoteReorder



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `parent_id` | `integer \| null` | нет | — |
| `items` | `list[ProjectNoteReorderItem]` | нет | {"minItems": 1} |

## ProjectNoteReorderItem



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `id` | `integer` | да | — |
| `sort_order` | `integer` | да | {"maximum": 100000.0, "minimum": 0.0} |

## ProjectNoteUpdate



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `title` | `string \| null` | нет | — |
| `content` | `string \| null` | нет | — |

## ProjectOut



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `id` | `integer` | да | — |
| `name` | `string` | да | — |
| `folder` | `string` | да | — |
| `start_date` | `string \| null` | да | — |
| `end_date` | `string \| null` | да | — |
| `timeline_frozen_at` | `string \| null` | да | — |
| `status` | `ProjectStatus` | да | — |
| `created_by` | `integer` | да | — |
| `appsec_component_code` | `string \| null` | нет | — |
| `appsec_component_name` | `string \| null` | нет | — |
| `appsec_product_code` | `string \| null` | нет | — |
| `appsec_components` | `list[AppSecComponentRef]` | нет | — |
| `appsec_version_code` | `string \| null` | нет | — |
| `appsec_version_name` | `string \| null` | нет | — |
| `appsec_versions` | `list[AppSecVersionRef]` | нет | — |
| `appsec_assignee` | `string \| null` | нет | — |
| `appsec_assignee_name` | `string \| null` | нет | — |
| `appsec_ticket_url` | `string \| null` | нет | — |
| `appsec_ticket_key` | `string \| null` | нет | — |
| `created_at` | `string` | да | {"format": "date-time"} |
| `updated_at` | `string` | да | {"format": "date-time"} |

## ProjectRole

Проектная роль пользователя — глобальная, задаётся в /members.

Не путать с UserRole (аккаунтная роль admin/pentester). Лид остаётся обычным
пользователем: роль лида лишь открывает дополнительные возможности в тех
проектах, где он состоит участником (например, управление составом команды).

Тип: `enum(lead, pentester)`.

## ProjectStatus



Тип: `enum(active, freeze, handover_to_development, vulnerability_recheck, completed, archived)`.

## ProjectUpdate



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `name` | `string \| null` | нет | — |
| `folder` | `string \| null` | нет | — |
| `start_date` | `string \| null` | нет | — |
| `end_date` | `string \| null` | нет | — |
| `status` | `ProjectStatus \| null` | нет | — |
| `appsec_component_code` | `string \| null` | нет | — |
| `appsec_component_name` | `string \| null` | нет | — |
| `appsec_product_code` | `string \| null` | нет | — |
| `appsec_components` | `list[AppSecComponentRef]` | нет | {"maxItems": 100} |
| `appsec_version_code` | `string \| null` | нет | — |
| `appsec_version_name` | `string \| null` | нет | — |
| `appsec_versions` | `list[AppSecVersionRef]` | нет | {"maxItems": 100} |
| `appsec_assignee` | `string \| null` | нет | — |
| `appsec_assignee_name` | `string \| null` | нет | — |
| `appsec_ticket_url` | `string \| null` | нет | — |
| `appsec_ticket_key` | `string \| null` | нет | — |

## Protocol



Тип: `enum(tcp, udp)`.

## ReactivationInfoOut

Публичная проверка ссылки-возврата (для страницы /reactivate).

| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `valid` | `boolean` | да | — |
| `username` | `string \| null` | нет | — |
| `reason` | `string \| null` | нет | — |

## RefreshResponse



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `ok` | `boolean` | нет | {"default": true} |

## ReverseFarmJobOut



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `id` | `integer` | да | — |
| `project_id` | `integer` | да | — |
| `kind` | `string` | нет | {"default": "reverse"} |
| `status` | `string` | да | — |
| `targets_total` | `integer \| null` | нет | — |
| `result` | `ReverseFarmResult \| null` | нет | — |
| `error` | `string \| null` | нет | — |
| `created_at` | `string` | да | {"format": "date-time"} |

## ReverseFarmRequest



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `raw` | `string` | нет | {"maxLength": 262144, "default": ""} |

## ReverseFarmResult



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `ips_scanned` | `integer` | нет | {"default": 0} |
| `hostnames_found` | `integer` | нет | {"default": 0} |
| `hosts_discovered` | `integer` | нет | {"default": 0} |
| `errors` | `list[string]` | нет | — |

## ServiceCreate



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `name` | `string` | да | {"maxLength": 100, "minLength": 1} |
| `version` | `string \| null` | нет | — |
| `banner` | `string \| null` | нет | — |

## ServiceOut



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `id` | `integer` | да | — |
| `port_id` | `integer` | да | — |
| `name` | `string` | да | — |
| `version` | `string \| null` | да | — |
| `banner` | `string \| null` | да | — |
| `created_at` | `string` | да | {"format": "date-time"} |
| `updated_at` | `string` | да | {"format": "date-time"} |

## ServiceUpdate



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `name` | `string \| null` | нет | — |
| `version` | `string \| null` | нет | — |
| `banner` | `string \| null` | нет | — |

## Severity



Тип: `enum(critical, high, medium, low, info, unrealized)`.

## SsoConfigOut

Публичная конфигурация SSO для экрана входа фронтенда.

| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `enabled` | `boolean` | нет | {"default": false} |
| `button_label` | `string` | нет | {"default": "Войти через SSO"} |
| `start_url` | `string` | нет | {"default": "/api/v1/auth/sso/login"} |

## SubFarmJobOut



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `id` | `integer` | да | — |
| `project_id` | `integer` | да | — |
| `kind` | `string` | нет | {"default": "subs"} |
| `status` | `string` | да | — |
| `targets_total` | `integer \| null` | нет | — |
| `result` | `SubFarmResult \| null` | нет | — |
| `error` | `string \| null` | нет | — |
| `created_at` | `string` | да | {"format": "date-time"} |

## SubFarmRequest



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `raw` | `string` | нет | {"maxLength": 262144, "default": ""} |

## SubFarmResult



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `roots_scanned` | `integer` | нет | {"default": 0} |
| `subdomains_found` | `integer` | нет | {"default": 0} |
| `subdomains_new` | `integer` | нет | {"default": 0} |
| `hosts_created` | `integer` | нет | {"default": 0} |
| `hosts_online` | `integer` | нет | {"default": 0} |
| `hosts_offline` | `integer` | нет | {"default": 0} |
| `sources_used` | `list[string]` | нет | — |
| `subdomains` | `list[string]` | нет | — |
| `errors` | `list[string]` | нет | — |

## TaskTrackerTaskDetailOut



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `key` | `string` | да | — |
| `summary` | `string` | да | — |
| `status` | `string` | да | — |
| `status_category` | `string` | да | — |
| `issue_type` | `string` | да | — |
| `priority` | `string \| null` | нет | — |
| `assignee` | `string \| null` | нет | — |
| `assignee_username` | `string \| null` | нет | — |
| `affected_versions` | `list[AppSecVersionRef]` | нет | — |
| `product_code` | `string \| null` | нет | — |
| `component` | `WorksRefOut \| null` | нет | — |
| `components` | `list[WorksRefOut]` | нет | — |
| `is_demo` | `boolean` | нет | {"default": false} |
| `project_exists` | `boolean` | нет | {"default": false} |
| `project_id` | `integer \| null` | нет | — |
| `updated` | `string` | да | — |
| `created` | `string` | да | — |
| `url` | `string` | нет | {"default": ""} |
| `reporter` | `string \| null` | нет | — |
| `description` | `string` | нет | {"default": ""} |
| `labels` | `list[string]` | нет | — |

## TaskTrackerTaskListOut



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `items` | `list[TaskTrackerTaskOut]` | да | — |
| `next_page_token` | `string \| null` | нет | — |
| `is_last` | `boolean` | нет | {"default": true} |
| `total` | `integer \| null` | нет | — |
| `active_total` | `integer \| null` | нет | — |
| `closed_total` | `integer \| null` | нет | — |

## TaskTrackerTaskOut



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `key` | `string` | да | — |
| `summary` | `string` | да | — |
| `status` | `string` | да | — |
| `status_category` | `string` | да | — |
| `issue_type` | `string` | да | — |
| `priority` | `string \| null` | нет | — |
| `assignee` | `string \| null` | нет | — |
| `assignee_username` | `string \| null` | нет | — |
| `affected_versions` | `list[AppSecVersionRef]` | нет | — |
| `product_code` | `string \| null` | нет | — |
| `component` | `WorksRefOut \| null` | нет | — |
| `components` | `list[WorksRefOut]` | нет | — |
| `is_demo` | `boolean` | нет | {"default": false} |
| `project_exists` | `boolean` | нет | {"default": false} |
| `project_id` | `integer \| null` | нет | — |
| `updated` | `string` | да | — |
| `created` | `string` | да | — |
| `url` | `string \| null` | нет | — |

## TwoFAConfirmRequest



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `code` | `string` | да | {"maxLength": 10, "minLength": 6} |

## TwoFADisableRequest



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `password` | `string` | да | {"maxLength": 128, "minLength": 1} |

## TwoFASetupResponse



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `secret` | `string` | да | — |
| `otpauth_uri` | `string` | да | — |
| `qr_png_data_url` | `string` | да | — |

## TwoFAVerifyRequest



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `code` | `string` | да | {"maxLength": 10, "minLength": 6} |

## UnreadCountOut



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `count` | `integer` | да | — |

## UserOut



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `id` | `integer` | да | — |
| `username` | `string` | да | — |
| `email` | `string` | да | {"format": "email"} |
| `full_name` | `string \| null` | нет | — |
| `avatar_url` | `string \| null` | нет | — |
| `role` | `UserRole` | да | — |
| `is_active` | `boolean` | да | — |
| `is_locked` | `boolean` | нет | {"default": false} |
| `project_role` | `ProjectRole` | нет | {"default": "pentester"} |
| `totp_enabled` | `boolean` | нет | {"default": false} |
| `is_sso` | `boolean` | нет | {"default": false} |
| `password_changed_at` | `string \| null` | нет | — |
| `created_at` | `string` | да | {"format": "date-time"} |

## UserProfileUpdate



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `username` | `string \| null` | нет | — |
| `email` | `string \| null` | нет | — |
| `full_name` | `string \| null` | нет | — |

## UserRole



Тип: `enum(admin, pentester)`.

## UserSearchOut

Лёгкая выдача для тайпхеда исполнителя: поиск по username или ФИО (full_name).

| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `username` | `string` | да | — |
| `full_name` | `string \| null` | нет | — |
| `is_sso` | `boolean` | нет | {"default": false} |

## UserUpdate



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `username` | `string \| null` | нет | — |
| `email` | `string \| null` | нет | — |
| `full_name` | `string \| null` | нет | — |
| `role` | `UserRole \| null` | нет | — |
| `project_role` | `ProjectRole \| null` | нет | — |
| `is_active` | `boolean \| null` | нет | — |

## UsernameAvailabilityOut



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `available` | `boolean` | да | — |

## ValidationError



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `loc` | `list[string \| integer]` | да | — |
| `msg` | `string` | да | — |
| `type` | `string` | да | — |
| `input` | `object` | нет | — |
| `ctx` | `object` | нет | — |

## VulnerabilityAssetCreate



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `asset_type` | `AssetType` | да | — |
| `asset_id` | `integer` | да | — |

## VulnerabilityAssetOut



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `id` | `integer` | да | — |
| `vulnerability_id` | `integer` | да | — |
| `asset_type` | `AssetType` | да | — |
| `asset_id` | `integer` | да | — |

## VulnerabilityCreate



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `host_id` | `integer` | да | — |
| `title` | `string` | да | {"maxLength": 500, "minLength": 1} |
| `description` | `string \| null` | нет | — |
| `severity` | `Severity` | нет | {"default": "info"} |
| `cvss_version` | `CvssVersion \| null` | нет | — |
| `cvss_score` | `number \| null` | нет | — |
| `cvss_vector` | `string \| null` | нет | — |
| `cwe_id` | `string \| null` | нет | — |
| `status` | `VulnerabilityStatus` | нет | {"default": "open"} |
| `workflow_steps` | `list[VulnerabilityWorkflowStep]` | нет | — |
| `steps_to_reproduce` | `string \| null` | нет | — |
| `impact` | `string \| null` | нет | — |
| `recommendations` | `string \| null` | нет | — |

## VulnerabilityListOut

Список сразу содержит первую привязку к хосту, без HTTP-запроса на строку.

| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `id` | `integer` | да | — |
| `project_id` | `integer` | да | — |
| `title` | `string` | да | — |
| `description` | `string \| null` | да | — |
| `severity` | `Severity` | да | — |
| `cvss_version` | `CvssVersion \| null` | да | — |
| `cvss_score` | `number \| null` | да | — |
| `cvss_vector` | `string \| null` | да | — |
| `cwe_id` | `string \| null` | да | — |
| `status` | `VulnerabilityStatus` | да | — |
| `workflow_steps` | `list[VulnerabilityWorkflowStep]` | нет | — |
| `steps_to_reproduce` | `string \| null` | да | — |
| `impact` | `string \| null` | да | — |
| `recommendations` | `string \| null` | да | — |
| `created_by` | `integer` | да | — |
| `created_by_username` | `string \| null` | нет | — |
| `created_at` | `string` | да | {"format": "date-time"} |
| `updated_at` | `string` | да | {"format": "date-time"} |
| `affected_host_id` | `integer \| null` | нет | — |

## VulnerabilityOut



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `id` | `integer` | да | — |
| `project_id` | `integer` | да | — |
| `title` | `string` | да | — |
| `description` | `string \| null` | да | — |
| `severity` | `Severity` | да | — |
| `cvss_version` | `CvssVersion \| null` | да | — |
| `cvss_score` | `number \| null` | да | — |
| `cvss_vector` | `string \| null` | да | — |
| `cwe_id` | `string \| null` | да | — |
| `status` | `VulnerabilityStatus` | да | — |
| `workflow_steps` | `list[VulnerabilityWorkflowStep]` | нет | — |
| `steps_to_reproduce` | `string \| null` | да | — |
| `impact` | `string \| null` | да | — |
| `recommendations` | `string \| null` | да | — |
| `created_by` | `integer` | да | — |
| `created_by_username` | `string \| null` | нет | — |
| `created_at` | `string` | да | {"format": "date-time"} |
| `updated_at` | `string` | да | {"format": "date-time"} |

## VulnerabilityStatus

Статусы тикета, согласованные с workflow Works «BUG APPSEC».

Категории: не завершённые (OPEN/IN_PROGRESS/PROBLEM_ANALYSIS/NEED_INFO/PAUSED)
считаются «открытыми» находками; завершённые (RESOLVED/CLOSED/CANCELLED/
SENT_BY_MISTAKE) — закрытыми.

Тип: `enum(open, in_progress, problem_analysis, need_info, paused, resolved, closed, cancelled, sent_by_mistake)`.

## VulnerabilityStatusPatch



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `status` | `VulnerabilityStatus` | да | — |

## VulnerabilityUpdate



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `title` | `string \| null` | нет | — |
| `description` | `string \| null` | нет | — |
| `severity` | `Severity \| null` | нет | — |
| `cvss_version` | `CvssVersion \| null` | нет | — |
| `cvss_score` | `number \| null` | нет | — |
| `cvss_vector` | `string \| null` | нет | — |
| `cwe_id` | `string \| null` | нет | — |
| `status` | `VulnerabilityStatus \| null` | нет | — |
| `workflow_steps` | `list[VulnerabilityWorkflowStep] \| null` | нет | — |
| `steps_to_reproduce` | `string \| null` | нет | — |
| `impact` | `string \| null` | нет | — |
| `recommendations` | `string \| null` | нет | — |

## VulnerabilityWorkflowStep



| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `id` | `string` | да | {"maxLength": 100, "minLength": 1} |
| `description` | `string \| null` | нет | — |
| `image_file_ids` | `list[integer]` | нет | — |
| `endpoint_id` | `integer \| null` | нет | — |
| `endpoint_request_raw` | `string \| null` | нет | — |

## WorksConfigOut

Публичная конфигурация Works: доступен ли экспорт в AppSec.

| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `enabled` | `boolean` | нет | {"default": false} |

## WorksExportRequest

Исполнитель берётся только из проекта; старый assignee игнорируется.

| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `assignee` | `string \| null` | нет | {"deprecated": true} |

## WorksIssueLinkOut

Связь находки с тикетом Works.

| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `works_key` | `string` | да | — |
| `works_url` | `string` | да | — |
| `works_status` | `string \| null` | нет | — |

## WorksRefOut

Справочный элемент Task Tracker: точный код и отображаемое имя.

| Поле | Тип | Required | Ограничения/описание |
| --- | --- | --- | --- |
| `code` | `string` | да | — |
| `name` | `string` | да | — |
