from functools import lru_cache
from typing import Literal, Union

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Настройки приложения, загружаемые из переменных окружения."""

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    database_url: str

    jwt_secret_key: str
    jwt_access_token_expire_minutes: int = 30
    jwt_refresh_token_expire_days: int = 30

    minio_endpoint: str
    minio_access_key: str
    minio_secret_key: str
    minio_bucket_name: str
    minio_use_ssl: bool = False

    backend_cors_origins: str = "https://localhost:3000,https://127.0.0.1:3000"
    backend_host: str = "0.0.0.0"
    backend_port: int = 8000
    debug: bool = False

    cookie_secure: bool = True
    cookie_samesite: str = "strict"
    csrf_allowed_origins: str = "https://localhost:3000,https://127.0.0.1:3000"

    # --- SSO / OIDC (корпоративная IAM, Keycloak-совместимый провайдер) ---
    # Включает кнопку «Войти через SSO» на экране входа и маршруты
    # /api/v1/auth/sso/*. Поток — OpenID Connect Authorization Code + PKCE.
    sso_enabled: bool = False
    # Базовый issuer провайдера. Discovery-документ ищется по адресу
    # {issuer}/.well-known/openid-configuration. Для Keycloak это обычно
    # https://<host>/realms/<realm>. Либо задайте полный адрес в SSO_METADATA_URL.
    sso_issuer: str = ""
    sso_metadata_url: str = ""
    sso_client_id: str = ""
    # Секрет клиента. Пусто — публичный клиент (только PKCE, без client_secret).
    sso_client_secret: str = ""
    # Scope, запрашиваемые у IdP. По умолчанию — профиль и email пользователя.
    sso_scopes: str = "openid profile email"
    # Абсолютный публичный адрес приложения для redirect_uri. Пусто — APP_BASE_URL.
    # В настройках клиента IdP должен быть разрешён redirect_uri:
    #   {base}/auth/callback (либо прежний путь через SSO_CALLBACK_PATH).
    sso_redirect_base: str = ""
    sso_callback_path: Literal['/auth/callback', '/api/v1/auth/sso/callback'] = '/auth/callback'
    # Claim'ы ID-токена, из которых берём username и email пользователя.
    sso_username_claim: str = "preferred_username"
    sso_email_claim: str = "email"
    # Создавать локального пользователя при первом входе через SSO. false —
    # пускать только тех, кто уже заведён (по email/username из токена).
    sso_auto_create_users: bool = True
    # Роль автосоздаваемого пользователя: "pentester" | "admin".
    sso_default_role: str = "pentester"
    # Надпись на кнопке входа через SSO.
    sso_button_label: str = "Войти через SSO"
    # true — проверять TLS системным бандлом; false — не проверять (только тест);
    # путь — PEM-файл с CA (внутренний удостоверяющий центр Keycloak/IAM).
    sso_verify_tls: Union[bool, str] = True

    initial_admin_username: str = "admin"
    initial_admin_email: str = "admin@example.com"
    initial_admin_password: str = "admin"

    rabbitmq_url: str = "amqp://guest:guest@rabbitmq/"
    mail_queue_name: str = "storm.mail"
    # Почта по умолчанию ВЫКЛЮЧЕНА (без локального mailpit): приглашения создаются,
    # ссылка активации возвращается в ответе/логе. Для реальной отправки задайте
    # MAIL_ENABLED=true + SMTP_* (см. .env.example).
    mail_enabled: bool = False
    smtp_host: str = ""
    smtp_port: int = 587
    smtp_username: str = ""
    smtp_password: str = ""
    smtp_use_tls: bool = False
    smtp_use_ssl: bool = False
    smtp_timeout_seconds: float = 20.0
    smtp_from_email: str = "noreply@example.com"
    smtp_from_name: str = "STORM"

    # "password" — обычный SMTP AUTH (mailpit, App Password и т.п.).
    # "xoauth2"  — отправка от лица Google-аккаунта через OAuth2 (см. поля ниже).
    smtp_auth_method: str = "password"
    google_oauth_client_id: str = ""
    google_oauth_client_secret: str = ""
    google_oauth_refresh_token: str = ""
    google_oauth_token_uri: str = "https://oauth2.googleapis.com/token"
    # --- Обобщённый OAuth2 для SMTP XOAUTH2: работает и с Google, и с Microsoft
    #     365 / Exchange Online. Если smtp_oauth_* пусты — берутся google_oauth_*
    #     (обратная совместимость). Для Exchange Online:
    #       SMTP_OAUTH_TOKEN_URL=https://login.microsoftonline.com/<tenant>/oauth2/v2.0/token
    #       SMTP_OAUTH_GRANT_TYPE=client_credentials  (app-only, без refresh token)
    #       SMTP_OAUTH_SCOPE=https://outlook.office365.com/.default
    #       SMTP_HOST=smtp.office365.com  SMTP_PORT=587  SMTP_USE_TLS=true
    #       SMTP_USERNAME=<адрес почтового ящика>
    smtp_oauth_token_url: str = ""
    smtp_oauth_client_id: str = ""
    smtp_oauth_client_secret: str = ""
    smtp_oauth_refresh_token: str = ""
    smtp_oauth_scope: str = ""
    smtp_oauth_grant_type: str = "refresh_token"  # refresh_token | client_credentials
    # Превью писем (раньше — UI локального mailpit). mailpit удалён, поэтому пусто.
    mail_preview_url: str | None = None
    mail_max_attempts: int = 5

    # База для ссылки активации в письме-приглашении (фронтенд): {app_base_url}/activate?token=...
    app_base_url: str = "https://localhost:3000"
    # Срок жизни приглашения (по умолчанию 7 суток).
    invite_token_expire_hours: int = 168
    # Ссылка сброса пароля живёт заметно меньше приглашения: она даёт прямой
    # доступ к существующему аккаунту, поэтому окно атаки держим узким.
    password_reset_expire_hours: int = 2
    # Ссылка возврата деактивированного пользователя: клик по ней разблокирует
    # аккаунт и сразу даёт сессию, поэтому окно тоже держим коротким (сутки).
    reactivation_expire_hours: int = 24

    # --- Works (sbertrack) — экспорт устранения уязвимостей в пространство STS,
    # suit bug_appsec. Аутентификация как в qg-sa: Bearer-токен сервисной учётки +
    # статическая cookie. Пути эндпоинтов вынесены в env (подстраиваемы без правки
    # кода). Пусто works_api_token / works_enabled=false → экспорт недоступен.
    works_enabled: bool = False
    works_base_url: str = "https://portal.works.prod.sbt/swtr"
    works_api_token: str = ""              # Bearer-токен сервисной учётки Works
    works_cookies: str = "api_swtr_as21=true"  # статические cookie "k1=v1; k2=v2"
    works_space: str = "STS"
    works_suit: str = "bug_appsec"
    works_tenant: str = "default"
    # true — проверять TLS системным бандлом; false — не проверять (только тест);
    # путь — PEM-файл с корпоративным CA (внутренний УЦ для portal.works.prod.sbt).
    works_verify_ssl: Union[bool, str] = True
    works_timeout_seconds: float = 30.0
    # Пути (без base — он из works_base_url).
    works_create_path: str = "/rest/api/unit/v2/bug_appsec/create"
    # Создание связи между юнитами (привязка STS bug_appsec к APPSEC-тикету проекта).
    # Тело: {"source": "<APPSEC-xxx>", "destination": "<STS-xxx>", "type": "<тип>"}.
    works_link_path: str = "/rest/api/unit/v1/link"
    works_link_type: str = "plain_connection"
    works_upload_path: str = "/rest/api/draft/files/v1/upload"
    works_component_find_path: str = "/extension/plugin/v2/rest/api/sber_components_plugin/v1/component/find"
    works_version_find_path: str = "/extension/plugin/v2/rest/api/swtr_task_tracker_plugin/v1/version/find"
    # Поиск юнитов по ключам — для получения текущего workflow_status тикета (как в qg-sa).
    works_unit_find_path: str = "/rest/api/unit/v3/find"
    works_unit_detail_path: str = '/rest/api/unit/v2/{key}'
    works_tasks_space: str = "APPSEC"
    # Ручные справочники формы STS используют своё пространство, не APPSEC-поиск.
    works_reference_space: str = 'STS'
    # Коды атрибутов APPSEC можно заменить по реальному ответу вашего AS21.
    works_appsec_product_code_attribute: str = 'product_code_list_sts'
    works_appsec_component_attribute: str = 'sber_component'
    works_tasks_search_path: str = "/rest/api/unit/v3/find/tql"
    # Нативный запрос списка APPSEC из браузера AS21; env позволяет его заменить.
    works_tasks_search_body: dict | None = Field(default_factory=lambda: {
        'attributes': ['workflow_status', 'priority', 'assigned_to', 'affects_version_s'],
        'calculatedAttributes': [],
        'query': 'space = "APPSEC" and suit = "security_assessment_appsec"',
        'page': {'size': 20, 'page': 0},
        'timeZone': 'Europe/Moscow',
    })
    # Explicit local UI fixture source; never a fallback for a failed real API.
    works_tasks_demo_file: str = ""
    # Ссылка на тикет в UI Works ({key}/{space} подставляются).
    works_issue_url_template: str = "https://portal.works.prod.sbt/swtr/units/current/unit/{key}?space={space}&tenant=default"

    # --- Recon farm: серверный пробив вставленных списков хостов и IP ---
    # Максимум различных хостов на один импорт (защита от network-amplification).
    farm_max_targets: int = 256
    # Максимум явных портов на один хост (лишние отбрасываются с пометкой).
    farm_max_ports_per_host: int = 32
    # Таймаут одного HTTP-пробива; истёк — считаем порт не ответившим.
    farm_probe_timeout_seconds: float = 8.0
    # Ограничение одновременных пробивов (semaphore + пул httpx-соединений).
    farm_max_concurrency: int = 20
    # Максимальный размер вставленного текста (и max_length схемы запроса), байт.
    farm_max_raw_bytes: int = 262144
    # Разрешать ли пробив приватных/внутренних IP. По умолчанию НЕТ: ферма ходит
    # только во внешнюю сеть (SSRF-guard). Включать осознанно на изолированном стенде.
    farm_allow_private_targets: bool = False
    # Обратный резолв (PTR + forward-confirm) при импорте IP. Выключать на
    # изолированном стенде без DNS, чтобы не ждать таймаутов на каждом адресе.
    farm_reverse_dns_enabled: bool = True
    # Импорт IP: подтверждённые PTR-имена адреса прогонять через ферму хостов —
    # искать их веб-порты и сервисы и заводить полноценным Host(origin=host).
    farm_ip_resolve_hosts_enabled: bool = True
    # Импорт хостов: адреса, в которые резолвятся домены, отдельно пробивать
    # фермой IP (запрос к голому IP, без Host-заголовка) и заводить строкой
    # origin='ip'. Ответ на IP и на домен у vhost различается, поэтому статусы
    # портов домена и его адреса собираются раздельно — зеркало
    # farm_ip_resolve_hosts_enabled в обратную сторону.
    farm_host_resolve_ips_enabled: bool = True
    # Таймаут одного PTR/forward-запроса: у socket.gethostbyaddr своего таймаута
    # нет, а setdefaulttimeout глобален на процесс — оборачиваем в wait_for.
    farm_reverse_dns_timeout_seconds: float = 3.0
    # Прогонять задачи фермы через RabbitMQ и отдельный контейнер recon-worker.
    # false — старое поведение: BackgroundTasks в процессе API (dev и тесты).
    recon_worker_enabled: bool = True
    recon_queue_name: str = "recon"
    # Сколько раз воркер пробует задачу, прежде чем оставить её failed.
    recon_max_attempts: int = 3
    # Джоба, застрявшая в queued/running дольше этого (воркер умер между
    # публикацией и записью статуса, или посреди пробива), возвращается в pending
    # и переигрывается. Порог с запасом больше реального времени пробива, чтобы
    # не реклеймить живую задачу параллельно исполняющемуся воркеру.
    recon_stale_job_seconds: int = 1800
    # Кап на число построчных элементов (hosts/ips/files/errors), сохраняемых в
    # job.result JSON. Счётчики (hosts_created, ports_created, …) остаются точными —
    # обрезается только детальный «эхо-список». Развязывает размер result-блоба от
    # farm_max_targets: на масштабе тысяч целей джоб-строка не разрастается.
    recon_result_max_items: int = 200
    # --- Ферма JS: поиск .js на домене, скачивание, греп секретов и путей ---
    js_farm_max_files_per_host: int = 50
    # Кап на размер одного .js (бандлы бывают большими, но читаем в память).
    js_farm_max_file_bytes: int = 5_000_000
    js_farm_download_timeout_seconds: float = 15.0
    js_farm_max_concurrency: int = 10
    # Общий кап файлов на задачу — защита от разрастания.
    js_farm_max_total_files: int = 500
    # --- Внешний JS-майнинг: trufflehog (verified-секреты) + jsluice (опц.) ---
    # Regex-набор (jsscan) работает ВСЕГДА; инструменты добавляют покрытие сверху,
    # когда их бинари есть в образе. Нет бинаря → молча откатываемся на regex.
    js_farm_mine_enabled: bool = True
    js_farm_trufflehog_bin: str = "trufflehog"
    # Путь кастомных детекторов trufflehog (--config). Совпадает с COPY в Dockerfile.
    js_farm_trufflehog_config: str = "/usr/local/share/storm/trufflehog-custom.yaml"
    # jsluice в образ не кладём (как и во FROST) — путь оставлен для опционального
    # включения; при отсутствии бинаря ветка просто не срабатывает.
    js_farm_jsluice_bin: str = "jsluice"
    js_farm_mine_timeout_seconds: float = 30.0
    # --- Определение технологий и CDN веб-порта при пробиве ---
    # Выключить, если инструменты не установлены: порты останутся «unknown».
    services_detect_enabled: bool = True
    # Движок: httpx (ProjectDiscovery, по умолчанию — быстрее/точнее) | whatweb.
    services_detect_engine: str = "httpx"
    # httpx-pd — бинарь ProjectDiscovery (не путать с pip-пакетом httpx).
    services_httpx_bin: str = "httpx-pd"
    services_whatweb_bin: str = "whatweb"
    services_detect_timeout_seconds: float = 20.0
    services_max_concurrency: int = 6

    # --- Scanner: раскрытие поддоменов корневого домена ---
    # Источник Certificate Transparency (crt.sh) — HTTP JSON, ключ не нужен.
    subs_crtsh_enabled: bool = True
    subs_crtsh_timeout_seconds: float = 30.0
    # subfinder (ProjectDiscovery) — если бинарь установлен; иначе тихо пропускаем.
    subs_subfinder_enabled: bool = True
    subs_subfinder_bin: str = "subfinder"
    subs_subfinder_timeout_seconds: float = 120.0
    # Кап на число найденных поддоменов, прогоняемых дальше фермой хостов.
    subs_max_results: int = 2000

    # --- Scanner: скан открытых TCP-портов (nmap) ---
    portscan_enabled: bool = True
    portscan_nmap_bin: str = "nmap"
    # Сколько верхних портов сканировать (nmap --top-ports). 0 = все 65535 (медленно).
    portscan_top_ports: int = 1000
    # Таймаут одного запуска nmap (на всю пачку целей), секунд.
    portscan_timeout_seconds: float = 300.0
    # Максимум целей на один скан (nmap запускается одной командой на пачку).
    portscan_max_targets: int = 64

    @field_validator("sso_verify_tls", "works_verify_ssl", mode="before")
    @classmethod
    def _parse_sso_verify_tls(cls, v):
        """'true'/'false' -> bool, иначе путь к PEM-файлу с CA."""
        if isinstance(v, bool):
            return v
        if isinstance(v, str):
            s = v.strip().lower()
            if s in ("1", "true", "yes", "on", ""):
                return True
            if s in ("0", "false", "no", "off"):
                return False
        return v

    @property
    def sso_discovery_url(self) -> str:
        """Адрес OIDC discovery-документа (из SSO_METADATA_URL или issuer)."""
        if self.sso_metadata_url.strip():
            return self.sso_metadata_url.strip()
        base = self.sso_issuer.strip().rstrip("/")
        return f"{base}/.well-known/openid-configuration" if base else ""

    @property
    def sso_configured(self) -> bool:
        """Достаточно ли настроек, чтобы показывать и обслуживать вход через SSO."""
        return bool(self.sso_enabled and self.sso_client_id and self.sso_discovery_url)

    @property
    def sso_scope_list(self) -> list[str]:
        """Список запрашиваемых scope (из строки через пробел/запятую)."""
        return [s.strip() for s in self.sso_scopes.replace(",", " ").split() if s.strip()]

    @property
    def sso_redirect_uri(self) -> str:
        """Абсолютный redirect_uri для callback (должен совпадать с настройкой IdP)."""
        base = (self.sso_redirect_base.strip() or self.app_base_url).rstrip("/")
        return f"{base}{self.sso_callback_path}"

    @field_validator("jwt_secret_key")
    @classmethod
    def validate_secret_key(cls, value: str) -> str:
        """Проверяет минимальную длину JWT-секрета."""
        if len(value) < 32:
            raise ValueError("JWT_SECRET_KEY должен содержать минимум 32 символа")
        return value

    @property
    def cors_origins(self) -> list[str]:
        """Возвращает список разрешённых CORS-источников."""
        return [origin.strip() for origin in self.backend_cors_origins.split(",") if origin.strip()]

    @property
    def csrf_origins(self) -> list[str]:
        """Возвращает список разрешённых Origin для CSRF-проверки."""
        return [origin.strip() for origin in self.csrf_allowed_origins.split(",") if origin.strip()]

    @property
    def works_configured(self) -> bool:
        """Достаточно ли настроек, чтобы экспортировать тикеты в Works."""
        return bool(not self.works_tasks_demo_file and self.works_enabled and self.works_api_token.strip() and self.works_base_url.strip())

    @property
    def works_cookies_dict(self) -> dict[str, str]:
        """Статические cookie Works ("k1=v1; k2=v2") → dict."""
        out: dict[str, str] = {}
        for part in self.works_cookies.split(";"):
            if "=" in part:
                k, v = part.split("=", 1)
                if k.strip():
                    out[k.strip()] = v.strip()
        return out


@lru_cache
def get_settings() -> Settings:
    """Возвращает кешированный объект настроек."""
    return Settings()
