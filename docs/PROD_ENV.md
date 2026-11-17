# Окружение STORM для prod

Актуальный шаблон — [`.env.prod.example`](../.env.prod.example). Он настроен на
публичный адрес `https://storm.appsec.prod.sbt` и Task Tracker
`https://portal.works.prod.sbt/swtr`. Реальный `.env.prod` с секретами не хранится в Git.

Для новой установки скопируйте шаблон в `.env.prod`. На существующей установке
перенесите изменённые ключи выборочно: не перезаписывайте файл со своими секретами.

## Что заполнить DevOps

- `JWT_SECRET_KEY` — постоянный секрет длиной не менее 32 символов.
- `INITIAL_ADMIN_PASSWORD` и `INITIAL_ADMIN_EMAIL` — стартовый администратор;
  эти значения используются только при первой инициализации пользователей.
- `SSO_ISSUER` либо полный `SSO_METADATA_URL` — адрес корпоративной IAM/realm.
  Это адрес провайдера, не Root URL STORM.
- `SSO_CLIENT_ID`, `SSO_CLIENT_SECRET` — зарегистрированный клиент IAM.
  Для публичного клиента secret остаётся пустым, PKCE используется в обоих случаях.
- `WORKS_API_TOKEN` — Bearer-токен сервисной учётки с доступом к APPSEC и
  созданию STS/связей. Сессионные cookie пользователя из браузера не нужны.

Параметры `DATABASE_URL` и `MINIO_*` должны совпадать с существующими PostgreSQL
и MinIO. Значения шаблона соответствуют сервисам базового compose; изменение
одного только `.env.prod` не изменяет пароль уже существующей БД или хранилища.
Для обновления приложения не удаляйте тома данных.

## Адреса и SSO

```dotenv
APP_BASE_URL=https://storm.appsec.prod.sbt
BACKEND_CORS_ORIGINS=https://storm.appsec.prod.sbt
CSRF_ALLOWED_ORIGINS=https://storm.appsec.prod.sbt
COOKIE_SECURE=true
COOKIE_SAMESITE=strict
SSO_ENABLED=true
SSO_REDIRECT_BASE=https://storm.appsec.prod.sbt
SSO_CALLBACK_PATH=/auth/callback
SSO_VERIFY_TLS=true
SSO_AUTO_CREATE_USERS=true
SSO_DEFAULT_ROLE=pentester
CERT_HOST=storm.appsec.prod.sbt
CERT_IP=
```

Callback совпадает с уже зарегистрированным в IAM:
`https://storm.appsec.prod.sbt/auth/callback`. Повторная регистрация клиента не
нужна. Vite проксирует этот путь на backend. Транзакционная cookie входа имеет
HttpOnly, SameSite=Lax и Path=/, поэтому приходит на публичный callback;
настройка основных сессионных cookie остаётся strict.

После успешного входа пользователь сохраняется в локальной БД с `is_sso=true` и
ролью pentester. Создание пользователя, refresh-сессии и аудит коммитятся вместе;
сбой выдачи сессии не оставляет частично созданную запись. Повторный вход по
подтверждённому email использует ту же запись. Пользователь виден администратору
в Users и доступен в поиске исполнителя; открытый список участников обновляется
раз в 15 секунд. Неподтверждённый или некорректный email IdP отклоняется.

Если публикация идёт через дополнительный ingress, он должен пропускать
`/auth/callback` вместе с query-параметрами и `/api` к приложению, а `/ws` — с
поддержкой Upgrade. Тела/параметры SSO с code/state не следует включать в
диагностические выгрузки.

## Task Tracker / AS21

```dotenv
WORKS_ENABLED=true
WORKS_BASE_URL=https://portal.works.prod.sbt/swtr
WORKS_SPACE=STS
WORKS_TASKS_SPACE=APPSEC
WORKS_REFERENCE_SPACE=STS
WORKS_TENANT=default
WORKS_SUIT=bug_appsec
WORKS_COOKIES=api_swtr_as21=true
WORKS_VERIFY_SSL=true
WORKS_TASKS_SEARCH_PATH=/rest/api/unit/v3/find/tql
WORKS_UNIT_DETAIL_PATH=/rest/api/unit/v2/{key}
WORKS_UNIT_FIND_PATH=/rest/api/unit/v3/find
WORKS_COMPONENT_FIND_PATH=/extension/plugin/v2/rest/api/sber_components_plugin/v1/component/find
WORKS_VERSION_FIND_PATH=/extension/plugin/v2/rest/api/swtr_task_tracker_plugin/v1/version/find
WORKS_CREATE_PATH=/rest/api/unit/v2/bug_appsec/create
WORKS_LINK_PATH=/rest/api/unit/v1/link
WORKS_LINK_TYPE=plain_connection
WORKS_APPSEC_PRODUCT_CODE_ATTRIBUTE=product_code_list_sts
WORKS_APPSEC_COMPONENT_ATTRIBUTE=sber_component
WORKS_TASKS_DEMO_FILE=
```

`WORKS_TASKS_SEARCH_BODY` задаётся одной строкой JSON; готовая строка есть в
шаблоне. Поиск ограничен `space = "APPSEC" and suit = "security_assessment_appsec"`,
из списка запрашивается `affects_version_s`. Продукт и все компоненты читаются
из **полной** GET-карточки при открытии тикета и создании/заполнении проекта.
Не добавляйте второй `/swtr` в относительные пути. Для чтения статуса STS остаётся
POST find, а полная APPSEC-карточка использует GET unit/v2 с validatorEnabled=true.

Ручной выбор компонентов и версий в форме проекта использует отдельные plugin
справочники с `space=STS`, `page.page=0`, `page.size=100`, withArchived=false и
withDeleted=false. Это независимо от пространства APPSEC для поиска тикетов и
автоматического переноса их версий. Ошибка провайдера отдаётся как 502 с безопасным
уведомлением, отсутствие настройки — 503. Внешний 422 не представляется как ошибка
заполненных пользователем полей.

`WORKS_APPSEC_PRODUCT_CODE_ATTRIBUTE` — исходный код атрибута APPSEC. Если в
конкретной установке он другой, укажите его по полному JSON карточки. Для
taxonomy используется `value.code` (`evp`), не отображаемое имя (`EVP`);
дополнительно поддержан атрибут с именем «Код продукта». Значение продукта
сохраняется в проекте и обязательно перед созданием STS.

Версии APPSEC `affects_version_s` целиком переходят в STS
`affects_version_s_crpv`; исходные code/name не меняются. Все компоненты
передаются в `sber_component`. Исполнитель STS — текущий Assignee проекта.
Направление связей: source=APPSEC, destination=STS.

Для закрытой корпоративной PKI добавьте нужные CA `.crt` в `backend/certs`
до сборки образа (см. [backend/certs/README.md](../backend/certs/README.md)).
TLS-проверки IAM и Task Tracker в шаблоне включены.

## Почта и применение

Почта в шаблоне выключена до настройки реального SMTP. Заполните `SMTP_*`, затем
включите `MAIL_ENABLED=true`. Поля Google OAuth остаются пустыми при обычной
парольной авторизации. Ссылки писем строятся от публичного `APP_BASE_URL`.

Проверьте compose без вывода секретов:

```bash
ENV_FILE=.env.prod docker compose -f docker-compose.yml -f docker-compose.prod.yml config --quiet
```

Примените обновление штатным `./deploy.sh` из корня проекта. Ручной эквивалент
должен использовать те же файлы и ENV_FILE; простой `docker compose restart`
не перечитывает env. Backend при старте идемпотентно добавляет код продукта и
массив компонентов, перенося старое одиночное значение. Существующие данные
и секреты при этом не подменяются шаблоном.

Контракт и ограничения интеграции описаны в [TASK_TRACKER.md](TASK_TRACKER.md).
