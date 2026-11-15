# STORM — архитектура развёртывания и эксплуатационные процессы (DevOps)

> Документ для команды эксплуатации. Описывает **актуальное состояние репозитория**:
> состав сервисов, сетевую карту, потоки данных, переменные окружения, запуск
> dev/prod, работу со схемой БД, TLS, безопасность и типовые операции (runbook).
>
> Прикладная архитектура (домены, API, БД) — в [`ARCH.md`](./ARCH.md),
> [`API_PROCESSES.md`](./API_PROCESSES.md), [`DB_SCHEMA.md`](./DB_SCHEMA.md).
> Здесь — то, что нужно, чтобы поднять и обслуживать систему.

---

## 1. Что это за система

STORM — внутренняя платформа управления пентест-проектами (recon → находки →
отчёты). Разворачивается как **Docker Compose**-стек: веб-интерфейс, REST/WebSocket
API, PostgreSQL, S3-совместимое хранилище файлов, брокер очередей и два фоновых
воркера. Единственный сервис, который должен смотреть наружу, — **nginx** (TLS на
80/443).

Код **не зависит** от того, dev это или prod: различие только в том, какой файл
окружения читается (`.env` или `.env.prod`) и в нескольких compose-оверрайдах.

---

## 2. Состав сервисов (docker-compose)

| Сервис | Образ / сборка | Внутр. порт | Назначение | Зависит от | Том |
|---|---|---|---|---|---|
| **nginx** | `nginx:1.27-alpine` | 80, 443, 3000 | TLS-терминация, reverse proxy, единственная точка входа | frontend, backend | — (монтирует конфиг + cert-скрипт) |
| **frontend** | сборка `./frontend` (`node:22-alpine`) | 3000 (`expose`, не публикуется) | Vite dev-сервер (React+TS), проксирует `/api` и `/ws` на backend | backend | код + `node_modules` |
| **backend** | сборка `./backend` (`python:3.12-slim`) | 8000 | FastAPI: REST `/api/v1`, агентский API `/v2`, WebSocket `/ws` | db, minio, rabbitmq | код + `/workspace` |
| **mail-worker** | та же сборка, что backend | — | Потребляет очередь `storm.mail`, шлёт письма по SMTP | db, rabbitmq (healthy) | код |
| **recon-worker** | та же сборка, что backend | — | Пробив списков хостов/IP (рекон-ферма) из очереди `recon` | db, rabbitmq (healthy) | код |
| **db** | `postgres:16-alpine` | 5432 (наружу `5433`) | Основная БД + audit-журнал | — | **`pgdata`** |
| **minio** | `minio/minio` | 9000 (API), 9001 (консоль) | S3-хранилище: аватары, evidence-файлы находок | — | **`miniodata`** |
| **rabbitmq** | `rabbitmq:3-management` | 5672, 15672 | Брокер очередей (`storm.mail`, `recon`) | — | — (очереди durable, но том не смонтирован) |

Три процесса (`backend`, `mail-worker`, `recon-worker`) собираются из **одного**
образа `./backend` — отличаются только командой запуска. Пересборка образа
backend обновляет сразу все три.

### Персистентные тома — терять нельзя

- **`pgdata`** — вся доменная БД и audit-журнал.
- **`miniodata`** — все загруженные файлы (evidence-файлы находок, аватары).

`rabbitmq` **без тома**: очереди объявлены `durable`, но при пересоздании
контейнера сообщения теряются. Это допустимо — обе очереди имеют
БД-backed outbox и retry (см. §5), поэтому потерянные сообщения восстанавливаются
из БД.

---

## 3. Сетевая карта и порты

```
                       ┌─────────── nginx (единственный наружу) ───────────┐
  браузер ── 443 ────▶ │ :80  → 301 https                                  │
  (https)              │ :443 → proxy https://frontend:3000                │
                       │ :3000(ssl) → proxy https://frontend:3000          │
                       └───────────────────────┬───────────────────────────┘
                                                │ (внутренняя сеть compose)
                                   frontend:3000 (Vite)
                                     │  proxy /api, /ws
                                     ▼
                                  backend:8000 ──┬── db:5432
                                                 ├── minio:9000
                                                 └── rabbitmq:5672
                                   ▲                      ▲
                      mail-worker ─┘        recon-worker ─┘  (оба тянут из rabbitmq + db)
```

**Порты, публикуемые на хост в базовом `docker-compose.yml` (0.0.0.0):**

| Хост-порт | Куда | В dev | В prod |
|---|---|---|---|
| 80, 443, 3000 | nginx | ✅ нужны | ✅ **только их оставить наружу** |
| 8000 | backend (Swagger `/api/v1/docs`, `/api/v2/docs` — только для авторизованных) | удобно | ⛔ закрыть фаерволом |
| 5433 → 5432 | PostgreSQL | удобно для psql | ⛔ закрыть фаерволом |
| 9000, 9001 | MinIO API + консоль | удобно | ⛔ закрыть фаерволом |
| 15672 | RabbitMQ management | диагностика | ⛔ закрыть фаерволом |

> **Важно для prod:** базовый compose публикует внутренние порты на `0.0.0.0`.
> `docker-compose.prod.yml` их **не закрывает** — наружу должны смотреть только
> 22/80/443, остальное закрывается облачным фаерволом (в комментариях упоминается
> Timeweb). Это обязательный шаг хардненинга, а не опция.

---

## 4. Поток запроса (request flow)

1. Браузер открывает `https://<хост>` → **nginx** (443). Любой plain-HTTP или
   `:3000`-хит редиректится на HTTPS (301 / `error_page 497`).
2. nginx проксирует всё на `frontend:3000` (Vite), прокидывая `Upgrade`/
   `Connection` для WebSocket и `X-Forwarded-Proto: https`.
3. **Vite** отдаёт SPA, а запросы `/api/*` и `/ws/*` проксирует на `backend:8000`
   (`VITE_PROXY_TARGET=http://backend:8000`).
4. **backend** (FastAPI/uvicorn):
   - REST — `/api/v1/*` (все доменные роутеры: auth, projects, vulnerabilities,
     files, farm, scanner, reports, task_tracker, works, …);
   - агентский (машинный) API — смонтирован под `/api/v2` (Swagger `/api/v2/docs`);
   - WebSocket — `/ws/*` (нотификации, live-обновления);
   - healthcheck — `GET /health` → `{"status":"ok"}`.
5. backend ходит в **PostgreSQL** (async, asyncpg), **MinIO** (файлы/аватары),
   **RabbitMQ** (постановка задач в очереди).

Аутентификация — сессионные cookie (JWT access+refresh), CSRF-защита по `Origin`
(см. §9). Агентский `/v2` — по токенам с префиксом `storm_`.

---

## 5. Асинхронные процессы (воркеры и очереди)

Два фоновых процесса разгружают uvicorn от долгих операций. Оба построены по
схеме **БД-таблица как outbox + RabbitMQ как сигнал + retry/reclaim**, поэтому
переживают перезапуск брокера и воркера.

### 5.1 Почта — `mail-worker` (очередь `storm.mail`)
- API создаёт запись задачи письма в БД и публикует её id в `storm.mail`
  (`publish_mail_job`, сообщения `PERSISTENT`, очередь `durable`).
- `mail-worker` потребляет id и отправляет письмо по SMTP (`aiosmtplib`).
- Повторы: `MAIL_MAX_ATTEMPTS` (по умолчанию 5).
- Используется для приглашений пользователей, сброса пароля, реактивации.
- Если `MAIL_ENABLED=false` — публикация пропускается (письма не шлются).

**SMTP-провайдеры.** `SMTP_AUTH_METHOD=password` — обычный SMTP-сабмит с
basic-аутентификацией (корпоративный релей, **локальный Exchange Server** по 587 +
STARTTLS). `SMTP_AUTH_METHOD=xoauth2` — OAuth2 (Modern Auth) для Gmail и
**Microsoft 365 / Exchange Online**; токен берётся через обобщённые `SMTP_OAUTH_*`
(Azure AD: `grant_type=client_credentials` + `SMTP_OAUTH_SCOPE=…/.default` для
app-only, либо `refresh_token`). Если `SMTP_OAUTH_*` пусты — fallback на
`GOOGLE_OAUTH_*`. Все профили с примерами — в `.env.example`.

### 5.2 Рекон-ферма — `recon-worker` (очередь `recon`)
- Пробив вставленных списков хостов/IP — это минуты сетевого ожидания, им нечего
  делать в воркерах uvicorn.
- Задачи хранятся в таблице `host_farm_jobs` со статусами `pending → queued →
  running → done`. `relay_pending_jobs` публикует `pending`-задачи в очередь и
  помечает `queued`; `consume_recon_jobs` их выполняет (`requeue=False`).
- **Reclaim:** застрявшие в `queued/running` задачи (краш воркера) возвращаются в
  `pending` при следующем тике, пока не исчерпан `RECON_MAX_ATTEMPTS` (по умолч. 3).
- Переключатель `RECON_WORKER_ENABLED`: `true` — через RabbitMQ+воркер;
  `false` — прогон прямо в процессе API через `BackgroundTasks` (для локальной
  разработки без RabbitMQ; в проде держать `true`).
- Ферма ходит **только во внешнюю сеть** (SSRF-guard, `FARM_ALLOW_PRIVATE_TARGETS=
  false`). Использует бинари `httpx-pd` (ProjectDiscovery) и `trufflehog`,
  устанавливаемые в образ backend на этапе сборки.

> На изолированном стенде без DNS выключайте обратный резолв
> (`FARM_REVERSE_DNS_ENABLED=false`), иначе каждый IP будет ждать таймаута.

---

## 6. Хранилище схемы и инициализация при старте

**Миграции применяются автоматически на старте backend** — отдельный шаг
`alembic upgrade` в проде запускать не требуется. На событии `startup`
(`app/main.py`) backend:

1. `Base.metadata.create_all` — создаёт недостающие таблицы.
2. Серия **идемпотентных** `ALTER TABLE … ADD COLUMN IF NOT EXISTS` / `ALTER TYPE
   … ADD VALUE IF NOT EXISTS` — донакатывает колонки и значения enum на уже
   существующей БД (отдельные ветки для PostgreSQL и SQLite).
3. `MinioStorage().ensure_bucket()` — создаёт бакет (`MINIO_BUCKET_NAME`,
   по умолчанию `storm-files`), если его нет.
4. `bootstrap_admin()` — создаёт стартового администратора из
   `INITIAL_ADMIN_*`, если пользователей ещё нет.

Формальные Alembic-ревизии лежат в `backend/migrations/versions` (19 шт.) — это
источник истории схемы; при желании можно гонять и их вручную
(`alembic upgrade head`), но для работы стека это не обязательно.

### Важные следствия для эксплуатации
- **Имя БД = `storm`** (`POSTGRES_DB`, все `DATABASE_URL`, `alembic.ini`).
  `POSTGRES_DB` применяется **только при первой инициализации тома** — смена имени
  БД требует пересоздания тома `pgdata` (`docker compose down -v`).
- **Стартовый admin не наполняет демо-данными.** Демо-набор (проекты, хосты,
  находки, evidence) заводится отдельно:
  `docker compose exec -T backend python scripts/reset_and_seed.py`.
- Бакет MinIO — `storm-files`, очередь почты — `storm.mail` (переименованы с
  прежних `pcf-*`/`pcf.mail`).

---

## 7. Переменные окружения

Источник окружения выбирается через `ENV_FILE` (dev → `.env`, prod → `.env.prod`).
`backend`, `mail-worker`, `recon-worker` читают его через `env_file`. **Единственный
источник истины — файл env**: значения не дублируются в `environment:` compose
(иначе правки env молча не применялись бы — исключение `COOKIE_SECURE` у backend).

Шаблоны: `.env.example` (dev, подробно прокомментирован) и `.env.prod.example`
(prod). Реальные `.env` / `.env.prod` — в `.gitignore`, в репозиторий не попадают.

### Ключевые переменные

| Переменная | Назначение | Прод-замечание |
|---|---|---|
| `DATABASE_URL` | `postgresql+asyncpg://user:password@db:5432/storm` | сменить пароль |
| `JWT_SECRET_KEY` | подпись JWT | **обязательно сменить** на длинный секрет |
| `JWT_ACCESS_TOKEN_EXPIRE_MINUTES` / `..._REFRESH_..._DAYS` | TTL токенов | 30 мин / 30 дней |
| `MINIO_ENDPOINT` / `_ACCESS_KEY` / `_SECRET_KEY` / `_BUCKET_NAME` / `_USE_SSL` | доступ к S3 | сменить ключи, бакет `storm-files` |
| `BACKEND_CORS_ORIGINS` | разрешённые Origin для CORS | выставить реальный внешний URL |
| `CSRF_ALLOWED_ORIGINS` | разрешённые Origin для CSRF | то же |
| `COOKIE_SECURE` / `COOKIE_SAMESITE` | флаги cookie | `true` / `strict` |
| `APP_BASE_URL` | публичный адрес для ссылок в письмах | выставить реальный URL |
| `DEBUG` | режим отладки | `false` в проде |
| `INITIAL_ADMIN_USERNAME/EMAIL/PASSWORD` | стартовый админ (`admin/admin`) | **сменить до первого старта** |
| `RABBITMQ_URL` | брокер (`amqp://guest:guest@rabbitmq/`) | сменить креды |
| `MAIL_QUEUE_NAME` / `MAIL_ENABLED` / `MAIL_MAX_ATTEMPTS` | почтовая очередь | — |
| `SMTP_*` | SMTP (профили: Gmail / корпоративный / XOAUTH2) | в проде — внешний SMTP |
| `RECON_WORKER_ENABLED` / `RECON_QUEUE_NAME` / `RECON_MAX_ATTEMPTS` | рекон-ферма | `true` в проде |
| `FARM_ALLOW_PRIVATE_TARGETS` | разрешить пробив приватных адресов (SSRF) | `false` |
| `FARM_REVERSE_DNS_ENABLED` | обратный резолв IP | `false` на стенде без DNS |
| `SERVICES_DETECT_ENGINE` | `httpx` \| `whatweb` | `httpx` |
| `SSO_*` | OIDC/Keycloak-вход (опционально) | см. ниже |
| `WORKS_*` | Task Tracker: экспорт STS, Tasks/проект APPSEC | [настройки](TASK_TRACKER.md) |
| `CERT_IP` / `CERT_HOST` | адрес в SAN self-signed сертификата (prod) | выставить адрес сервера |

### Секреты, которые ОБЯЗАТЕЛЬНО сменить перед проливкой в prod
`JWT_SECRET_KEY`, `INITIAL_ADMIN_PASSWORD`, пароль PostgreSQL (в `DATABASE_URL` и
`POSTGRES_PASSWORD`), ключи MinIO (`minioadmin/minioadmin`), креды RabbitMQ
(`guest/guest`), SMTP-пароль. Храните их в секрет-хранилище, не в git.

---

## 8. Запуск

### Dev (локально)
```bash
cp .env.example .env            # при необходимости отредактировать
docker compose up -d --build
# открыть https://localhost:3000  (self-signed cert — предупреждение браузера ожидаемо)
# логин: admin / admin
docker compose exec -T backend python scripts/reset_and_seed.py   # (опц.) демо-данные
```
- Swagger (интерактивная API-дока) — две схемы под `/api`: **API приложения**
  `/api/v1/docs` (v1) и **агентский API** `/api/v2/docs`. Всё под `/api` проксируется,
  поэтому открывается на origin приложения: `https://localhost:3000/api/v1/docs` и
  `.../api/v2/docs` (бэкенд также напрямую: `http://localhost:8000/api/v1/docs`). Закрыт
  авторизацией: открывать в браузере с активной сессией Storm (cookie), анонимный
  запрос → `401`. Схемы: `/api/v1/openapi.json`, `/api/v2/openapi.json`.
  (`https://localhost:3000/docs` — это встроенная документация интерфейса, НЕ Swagger;
  Swagger вынесен под `/api`, чтобы не путать с этим маршрутом.)
- Почта по умолчанию выключена (`MAIL_ENABLED=false`); для писем задайте `SMTP_*` и `MAIL_ENABLED=true`.

### Prod (сервер)
Обёртка `./deploy.sh` применяет оба compose-файла и подставляет `ENV_FILE=.env.prod`:
```bash
cp .env.prod.example .env.prod  # заполнить секреты, CERT_IP/CERT_HOST, origins, APP_BASE_URL
./deploy.sh            # up -d --build
./deploy.sh recreate   # то же + --force-recreate (подхватить правки .env.prod)
./deploy.sh logs       # хвост логов backend/mail-worker/recon-worker/nginx
./deploy.sh ps         # статус
./deploy.sh down       # остановить
```
Что меняет prod-оверрайд (`docker-compose.prod.yml`):
- backend/воркеры — **без `--reload`**;
- `restart: unless-stopped` на всех сервисах (переживают ребут);
- nginx получает `CERT_IP`/`CERT_HOST` для SAN сертификата.

> `./deploy.sh` требует наличия `.env.prod` и экспортирует из него только
> `CERT_IP`/`CERT_HOST` (нужны самому compose для интерполяции). Всё остальное
> окружение контейнеры читают из `ENV_FILE`.

---

## 9. TLS и сертификаты

- nginx терминирует TLS на 80/443/3000. Скрипт `nginx/gen-cert.sh` запускается из
  `/docker-entrypoint.d` **до** старта nginx и генерит **самоподписанный**
  сертификат при первом старте, если его ещё нет (RSA 2048, 825 дней).
- `localhost`/`127.0.0.1` всегда в SAN (для доступа по SSH-туннелю). В проде
  `CERT_HOST`/`CERT_IP` добавляются в SAN, чтобы сертификат совпадал с URL.
- Браузер всё равно предупредит про недоверенный CA — это ожидаемо для
  self-signed. **Для настоящего прод-домена замените на сертификат от публичного
  CA** (Let's Encrypt / корпоративный) — смонтируйте его в `/etc/nginx/certs/` и
  отключите генератор.

### Исходящий TLS к корпоративным сервисам (Works / IAM)

Backend ходит к внутренним сервисам (`portal.works.prod.sbt`, Keycloak/IAM) по
HTTPS с корпоративным сертификатом. Чтобы `httpx` ему доверял:

- Положите цепочку корневого/промежуточного CA (расширение **`.crt`**) в
  `backend/certs/` — например `works-chain.crt`. Реальные сертификаты в VCS не
  коммитятся (в `.gitignore`), остаётся только README/.gitkeep.
- При сборке образа они вшиваются в системный trust store
  (`COPY certs/ … && update-ca-certificates`), а `SSL_CERT_FILE`/
  `REQUESTS_CA_BUNDLE`/`PIP_CERT` переводят `httpx`/`requests`/`pip` на системный
  бандл вместо `certifi`. После этого `WORKS_VERIFY_SSL=true` и
  `SSO_VERIFY_TLS=true` работают из коробки — правок кода не нужно.
- Альтернатива вшиванию: `WORKS_VERIFY_SSL`/`SSO_VERIFY_TLS` принимают **путь**
  к PEM (например `/certs/works-chain.crt` из смонтированного тома).
- Сборка за периметром: прокси передаётся build-арг(ами)
  `BUILD_HTTP_PROXY`/`BUILD_HTTPS_PROXY`/`BUILD_NO_PROXY`
  (`BUILD_HTTPS_PROXY=http://proxy:3128 docker compose build backend`).

Подробности — в `backend/certs/README.md`.

---

## 10. Безопасность

- **CORS** — `allow_origins=BACKEND_CORS_ORIGINS`, `allow_credentials=true`.
- **CSRF** — проверка заголовка `Origin` против `CSRF_ALLOWED_ORIGINS` (вход без
  корректного `Origin` → 403 «Отсутствует заголовок Origin»).
- **Cookie** — `COOKIE_SECURE=true`, `COOKIE_SAMESITE=strict`.
- **Агентский API `/v2`** — доступ по токенам `storm_<...>` (создаются в UI,
  ограничены создателем, scope и сроком действия).
- **SSRF-guard рекон-фермы** — по умолчанию только внешние адреса
  (`FARM_ALLOW_PRIVATE_TARGETS=false`); `app/netguard.py`.
- **Фаервол (prod)** — наружу только 22/80/443; внутренние порты
  (8000/5433/9000/9001/15672) закрыть (см. §3).
- **Дефолтные креды** — сменить все (см. §7).

---

## 11. Внешние интеграции (опциональны, настраиваются через env)

- **SMTP** — профили в `.env.example`: Gmail (app password),
  корпоративный, XOAUTH2 (OAuth2 без app-password; настройка через
  `scripts/google_oauth_setup.py`). Пусто/`MAIL_ENABLED=false` — письма не шлются.
- **SSO / OIDC** — `SSO_ENABLED=true` + `SSO_ISSUER` (Keycloak-совместимый),
  поток Authorization Code + PKCE, callback `{APP_BASE_URL}/api/v1/auth/sso/
  callback` (разрешить в IdP). Авто-создание пользователей — `SSO_AUTO_CREATE_USERS`.
- **Task Tracker / Works** — `WORKS_ENABLED`, `WORKS_BASE_URL`, `WORKS_API_TOKEN`; экспорт уязвимостей в STS, задачи и тикет проекта в APPSEC. Поиску требуется тело рабочего нативного запроса `WORKS_TASKS_SEARCH_BODY`; его отсутствие даёт 503. Подробности и диагностика: [TASK_TRACKER.md](TASK_TRACKER.md).

---

## 12. Наблюдаемость и диагностика

- **Health** — `GET /health` на backend (`{"status":"ok"}`). ⚠️ В compose
  healthcheck пока навешен только на `rabbitmq`; на backend/frontend/db/minio
  healthcheck'ов нет — при желании добавьте (backend: `/health`).
- **Логи** — `docker compose logs -f <service>` или `./deploy.sh logs`. Воркеры
  логируют постановку/выполнение задач (`Queued recon job …`, reclaim stale).
- **RabbitMQ UI** — `:15672` (guest/guest) для глубины очередей.
- **MinIO консоль** — `:9001`.
- **Swagger** — `/api/v1/docs` (API приложения, v1), `/api/v2/docs` (агентский); закрыты
  авторизацией (нужна сессия Storm). Снимки — `docs/openapi-v1.json`, `docs/openapi-v2.json`.

---

## 13. Бэкап и восстановление

Бэкапить нужно **оба тома**:

```bash
# PostgreSQL (логический дамп)
docker compose exec -T db pg_dump -U user storm | gzip > storm-$(date +%F).sql.gz
# восстановление:
gunzip -c storm-YYYY-MM-DD.sql.gz | docker compose exec -T db psql -U user storm

# MinIO (файлы): бэкап тома miniodata или `mc mirror` в другой бакет/хранилище
docker run --rm -v sberpcf_miniodata:/data -v "$PWD":/backup alpine \
  tar czf /backup/miniodata-$(date +%F).tgz -C /data .
```
> Имя тома — `<префикс-проекта>_pgdata` / `_miniodata` (префикс = имя каталога
> compose; проверьте `docker volume ls`). Дамп БД и файлы MinIO бэкапьте
> согласованно по времени — evidence-файлы в БД ссылаются на объекты в MinIO.

---

## 14. Runbook — типовые операции

| Задача | Команда |
|---|---|
| Поднять dev | `docker compose up -d --build` |
| Поднять prod | `./deploy.sh` |
| Применить правки `.env.prod` | `./deploy.sh recreate` |
| Обновить код (pull → пересборка) | `git pull && ./deploy.sh recreate` |
| Логи воркеров/backend/nginx | `./deploy.sh logs` |
| Статус контейнеров | `./deploy.sh ps` |
| Залить демо-данные | `docker compose exec -T backend python scripts/reset_and_seed.py` |
| Консоль psql | `docker compose exec db psql -U user storm` |
| Пересоздать БД с нуля (⚠️ стирает `pgdata`) | `docker compose down -v && docker compose up -d --build` → затем seed |
| Перезапустить один сервис | `docker compose restart backend` |

> Смена имени БД, бакета или любой переменной `POSTGRES_*` требует пересоздания
> тома (`down -v`) — иначе Postgres оставит старую инициализацию.

---

## 15. Чеклист готовности к продакшену

Сейчас стек ориентирован на стенд/демо. Перед настоящим продом проверьте:

- [ ] **Frontend работает как Vite dev-сервер** (`npm run dev`) и в dev, и в prod —
      продакшен-сборки статики (`vite build` + отдача через nginx) нет. Для
      нагруженного прода это стоит добавить: собрать статику и раздавать её nginx'ом,
      а не через dev-сервер.
- [ ] Сменены все дефолтные секреты (§7).
- [ ] Внутренние порты закрыты фаерволом, наружу только 22/80/443 (§3).
- [ ] TLS: self-signed заменён на сертификат доверенного CA (§9).
- [ ] `DEBUG=false`, `COOKIE_SECURE=true`.
- [ ] `BACKEND_CORS_ORIGINS` / `CSRF_ALLOWED_ORIGINS` / `APP_BASE_URL` = реальный
      внешний адрес.
- [ ] Настроен реальный SMTP (`MAIL_ENABLED=true` + `SMTP_*`); по умолчанию почта выключена.
- [ ] Настроены бэкапы `pgdata` + `miniodata` (§13).
- [ ] (Желательно) healthcheck'и на backend/db/minio в compose + мониторинг.
- [ ] (Желательно) том для RabbitMQ, если полагаетесь на сохранность очередей
      между рестартами (сейчас страхует БД-outbox + retry).

---

*Документ отражает состояние репозитория на ветке `feat/storm-backend-backed`
(коммит `00173dc`). При изменении compose, Dockerfile, nginx или `app/main.py`
обновляйте соответствующие разделы.*
