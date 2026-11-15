import asyncio
from contextlib import suppress

from fastapi import Depends, FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.docs import get_redoc_html, get_swagger_ui_html
from fastapi.responses import JSONResponse
from sqlalchemy import inspect, text
from sqlalchemy.ext.asyncio import AsyncSession

from app import models  # noqa: F401
from app.config import get_settings
from app.database import Base, SessionLocal, engine
from app.dependencies import get_current_user
from app.exceptions import ConflictError, ForbiddenError, NotFoundError, StormError, UnauthorizedError, ValidationError
from app.routers import (
    agent_tokens,
    assets,
    audit_logs,
    auth,
    comments,
    endpoint_comments,
    farm,
    files,
    images,
    import_,
    notifications,
    projects,
    project_credentials,
    project_notes,
    reports,
    scanner,
    users,
    vulnerabilities,
    v2_agent,
    websocket,
    works,
    task_tracker,
)
from app.services import UserService
from app.storage.minio_client import MinioStorage
from app.input_safety import SecurityHeadersMiddleware, validate_request_parameters
from app.notification_events import deadline_loop

settings = get_settings()

# Swagger UI / ReDoc / openapi.json отдаём не штатными маршрутами FastAPI, а
# своими — закрытыми авторизацией (см. _register_protected_docs). Поэтому здесь
# все три auto-маршрута выключены (docs_url/redoc_url/openapi_url = None).
app = FastAPI(title="STORM API", version="1.0.0", docs_url=None, redoc_url=None, openapi_url=None, dependencies=[Depends(validate_request_parameters)])
agent_api_v2 = FastAPI(
    title="STORM Agent API",
    version="2.0.0",
    docs_url=None,
    redoc_url=None,
    openapi_url=None,
    dependencies=[Depends(validate_request_parameters)],
)
app.add_middleware(SecurityHeadersMiddleware)
agent_api_v2.add_middleware(SecurityHeadersMiddleware)


def _register_protected_docs(fastapi_app: FastAPI, *, openapi_route: str, docs_route: str, redoc_route: str) -> None:
    """Регистрирует Swagger UI / ReDoc / openapi.json, доступные только после входа.

    Каждый маршрут зависит от get_current_user (сессионная cookie access_token):
    без неё FastAPI вернёт 401. Браузер авторизованного пользователя шлёт cookie
    автоматически и к странице Swagger, и к её запросу openapi.json. openapi_url
    для UI строим с учётом root_path — чтобы работало и для под-аппа, смонтированного
    на /v2.
    """

    @fastapi_app.get(openapi_route, include_in_schema=False)
    async def _openapi_json(_: object = Depends(get_current_user)) -> JSONResponse:
        return JSONResponse(fastapi_app.openapi())

    @fastapi_app.get(docs_route, include_in_schema=False)
    async def _swagger_ui(request: Request, _: object = Depends(get_current_user)):
        root = request.scope.get("root_path", "").rstrip("/")
        return get_swagger_ui_html(openapi_url=f"{root}{openapi_route}", title=f"{fastapi_app.title} — Swagger UI")

    @fastapi_app.get(redoc_route, include_in_schema=False)
    async def _redoc(request: Request, _: object = Depends(get_current_user)):
        root = request.scope.get("root_path", "").rstrip("/")
        return get_redoc_html(openapi_url=f"{root}{openapi_route}", title=f"{fastapi_app.title} — ReDoc")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Requested-With", "Origin", "Accept"],
)


def _register_routes() -> None:
    prefix = "/api/v1"
    app.include_router(auth.router, prefix=prefix)
    app.include_router(agent_tokens.router, prefix=prefix)
    app.include_router(users.router, prefix=prefix)
    app.include_router(projects.router, prefix=prefix)
    app.include_router(project_notes.router, prefix=prefix)
    app.include_router(project_credentials.router, prefix=prefix)
    app.include_router(assets.router, prefix=prefix)
    app.include_router(farm.router, prefix=prefix)
    app.include_router(scanner.router, prefix=prefix)
    app.include_router(vulnerabilities.router, prefix=prefix)
    app.include_router(files.router, prefix=prefix)
    app.include_router(images.router, prefix=prefix)
    app.include_router(comments.router, prefix=prefix)
    app.include_router(endpoint_comments.router, prefix=prefix)
    app.include_router(notifications.router, prefix=prefix)
    app.include_router(import_.router, prefix=prefix)
    app.include_router(task_tracker.router, prefix=prefix)
    app.include_router(works.router, prefix=prefix)
    app.include_router(reports.router, prefix=prefix)
    app.include_router(audit_logs.router, prefix=prefix)
    agent_api_v2.include_router(v2_agent.router)
    # Весь API и его Swagger живут под /api — чтобы не путать с фронтовым маршрутом
    # /docs (встроенная документация проекта) и чтобы всё ходило через один https-
    # прокси приложения (vite/nginx форвардят /api). Две симметричные версии, каждая
    # со своим Swagger (только для авторизованных):
    #   API приложения (v1) → /api/v1/docs, /api/v1/redoc, /api/v1/openapi.json
    #   Agent API (v2)      → /api/v2/docs, /api/v2/redoc, /api/v2/openapi.json
    _register_protected_docs(app, openapi_route="/api/v1/openapi.json", docs_route="/api/v1/docs", redoc_route="/api/v1/redoc")
    _register_protected_docs(agent_api_v2, openapi_route="/openapi.json", docs_route="/docs", redoc_route="/redoc")
    app.mount("/api/v2", agent_api_v2)
    app.include_router(websocket.router)


def _register_error_handlers() -> None:
    def _format_request_validation(exc: RequestValidationError) -> str:
        messages: list[str] = []
        for item in exc.errors():
            raw_loc = [str(part) for part in item.get("loc", [])]
            loc = ".".join(part for part in raw_loc if part not in {"body", "query", "path"})
            error_type = item.get("type", "")
            if error_type == "missing":
                message = "Поле обязательно"
            elif error_type == "string_too_short":
                min_length = item.get("ctx", {}).get("min_length")
                message = "Поле не может быть пустым" if min_length == 1 else f"Минимальная длина: {min_length}"
            elif error_type == "string_too_long":
                max_length = item.get("ctx", {}).get("max_length")
                message = f"Максимальная длина: {max_length}"
            elif error_type == "greater_than_equal":
                value = item.get("ctx", {}).get("ge")
                message = f"Значение должно быть не меньше {value}"
            elif error_type == "less_than_equal":
                value = item.get("ctx", {}).get("le")
                message = f"Значение должно быть не больше {value}"
            else:
                message = item.get("msg", "Некорректные входные данные")
            messages.append(f"{loc}: {message}" if loc else message)
        return "; ".join(messages) or "Некорректные входные данные"

    async def request_validation_handler(_: Request, exc: RequestValidationError) -> JSONResponse:
        return JSONResponse(status_code=422, content={"detail": _format_request_validation(exc)})

    async def not_found_handler(_: Request, exc: NotFoundError) -> JSONResponse:
        return JSONResponse(status_code=404, content={"detail": str(exc)})

    async def unauthorized_handler(_: Request, exc: UnauthorizedError) -> JSONResponse:
        return JSONResponse(status_code=401, content={"detail": str(exc)})

    async def forbidden_handler(_: Request, exc: ForbiddenError) -> JSONResponse:
        return JSONResponse(status_code=403, content={"detail": str(exc)})

    async def conflict_handler(_: Request, exc: ConflictError) -> JSONResponse:
        return JSONResponse(status_code=409, content={"detail": str(exc)})

    async def validation_handler(_: Request, exc: ValidationError) -> JSONResponse:
        return JSONResponse(status_code=422, content={"detail": str(exc)})

    async def app_error_handler(_: Request, exc: StormError) -> JSONResponse:
        return JSONResponse(status_code=400, content={"detail": str(exc)})

    # Регистрируем и на основном приложении, и на под-аппе Agent API (/v2): у
    # смонтированного приложения собственные обработчики — родительские на него не
    # распространяются (иначе UnauthorizedError из /v2 отдавал бы 500 вместо 401).
    _handlers = [
        (RequestValidationError, request_validation_handler),
        (NotFoundError, not_found_handler),
        (UnauthorizedError, unauthorized_handler),
        (ForbiddenError, forbidden_handler),
        (ConflictError, conflict_handler),
        (ValidationError, validation_handler),
        (StormError, app_error_handler),
    ]
    for _target in (app, agent_api_v2):
        for _exc_type, _handler in _handlers:
            _target.add_exception_handler(_exc_type, _handler)


@app.on_event("startup")
async def startup() -> None:
    """Инициализирует БД, MinIO и стартового администратора."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        project_columns = await conn.run_sync(lambda connection: {column['name'] for column in inspect(connection).get_columns('projects')})
        if 'description' in project_columns:
            await conn.execute(text('ALTER TABLE projects DROP COLUMN description'))
        if conn.dialect.name == "postgresql":
            await conn.execute(text("ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'PROJECT_DEADLINE'"))
            await conn.execute(text("ALTER TABLE notifications ADD COLUMN IF NOT EXISTS context_data JSON"))
            await conn.execute(text("ALTER TABLE notifications ADD COLUMN IF NOT EXISTS dedupe_key VARCHAR(255)"))
            await conn.execute(text("CREATE UNIQUE INDEX IF NOT EXISTS ix_notifications_dedupe_key ON notifications (dedupe_key)"))
            await conn.execute(text("ALTER TYPE vuln_severity ADD VALUE IF NOT EXISTS 'UNREALIZED'"))
            # Статусы находок приведены к workflow Works «BUG APPSEC» — добавляем новые
            # метки. Старые (FIXED/WONT_FIX/ACCEPTED_RISK) остаются висяками в типе; данные
            # с них переводятся ниже, в ОТДЕЛЬНОЙ транзакции (PG запрещает использовать
            # только что добавленную метку enum в той же транзакции, где её добавили).
            for _st in ("PROBLEM_ANALYSIS", "NEED_INFO", "PAUSED", "RESOLVED", "CLOSED", "CANCELLED", "SENT_BY_MISTAKE"):
                await conn.execute(text(f"ALTER TYPE vuln_status ADD VALUE IF NOT EXISTS '{_st}'"))
            await conn.execute(text("ALTER TYPE project_status ADD VALUE IF NOT EXISTS 'handover_to_development'"))
            await conn.execute(text("ALTER TYPE project_status ADD VALUE IF NOT EXISTS 'vulnerability_recheck'"))
            await conn.execute(text("ALTER TYPE http_method ADD VALUE IF NOT EXISTS 'TRACE'"))
            # Критичность 'UNKNOWN' убрана: по умолчанию находка создаётся как INFO.
            # Старые находки со снятым уровнем переводим в INFO (severity::text — на
            # свежей БД метки 'UNKNOWN' в типе уже нет, каст к тексту не падает), и
            # переставляем DEFAULT колонки. Дубль-метка 'UNKNOWN'/'unknown' остаётся в
            # типе безвредным висяком (снять её из enum — только пересозданием типа,
            # это делает alembic-ревизия; здесь довольно того, что ею никто не пишет).
            await conn.execute(
                text("UPDATE vulnerabilities SET severity = 'INFO' WHERE severity::text IN ('UNKNOWN', 'unknown')")
            )
            await conn.execute(text("ALTER TABLE vulnerabilities ALTER COLUMN severity SET DEFAULT 'INFO'"))
            await conn.execute(text("ALTER TABLE projects ADD COLUMN IF NOT EXISTS folder VARCHAR(255) NOT NULL DEFAULT ''"))
            await conn.execute(text("ALTER TABLE projects ADD COLUMN IF NOT EXISTS timeline_frozen_at TIMESTAMP WITH TIME ZONE"))
            await conn.execute(text("ALTER TABLE projects ADD COLUMN IF NOT EXISTS appsec_component_code VARCHAR(64)"))
            await conn.execute(text("ALTER TABLE projects ADD COLUMN IF NOT EXISTS appsec_component_name VARCHAR(255)"))
            await conn.execute(text("ALTER TABLE projects ADD COLUMN IF NOT EXISTS appsec_version_code VARCHAR(64)"))
            await conn.execute(text("ALTER TABLE projects ADD COLUMN IF NOT EXISTS appsec_version_name VARCHAR(255)"))
            await conn.execute(text("ALTER TABLE projects ADD COLUMN IF NOT EXISTS appsec_versions JSON NOT NULL DEFAULT '[]'"))
            await conn.execute(text("UPDATE projects SET appsec_versions = json_build_array(json_build_object('code', appsec_version_code, 'name', COALESCE(appsec_version_name, appsec_version_code))) WHERE json_array_length(appsec_versions) = 0 AND appsec_version_code IS NOT NULL"))
            await conn.execute(text("ALTER TABLE projects ADD COLUMN IF NOT EXISTS appsec_assignee VARCHAR(255)"))
            await conn.execute(text("ALTER TABLE projects ADD COLUMN IF NOT EXISTS appsec_assignee_name VARCHAR(255)"))
            await conn.execute(text("ALTER TABLE projects ADD COLUMN IF NOT EXISTS appsec_ticket_url VARCHAR(1024)"))
            await conn.execute(text("ALTER TABLE projects ADD COLUMN IF NOT EXISTS appsec_ticket_key VARCHAR(64)"))
            await conn.execute(text("ALTER TABLE projects ALTER COLUMN folder SET DEFAULT ''"))
            await conn.execute(text("UPDATE projects SET folder = '' WHERE folder = 'Без папки'"))
            await conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name VARCHAR(255)"))
            await conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS tags JSON"))
            await conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_minio_bucket VARCHAR(63)"))
            await conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_minio_key TEXT"))
            await conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_content_type VARCHAR(127)"))
            await conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_uploaded_at TIMESTAMP WITH TIME ZONE"))
            await conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS password_changed_at TIMESTAMP WITH TIME ZONE"))
            await conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS totp_secret TEXT"))
            await conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS totp_enabled BOOLEAN NOT NULL DEFAULT false"))
            await conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS totp_confirmed_at TIMESTAMP WITH TIME ZONE"))
            await conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS is_locked BOOLEAN NOT NULL DEFAULT false"))
            await conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS is_sso BOOLEAN NOT NULL DEFAULT false"))
            await conn.execute(text("ALTER TABLE vulnerabilities ADD COLUMN IF NOT EXISTS workflow_steps JSON"))
            await conn.execute(
                text(
                    """
                    UPDATE vulnerabilities
                    SET workflow_steps = (
                        SELECT json_agg(step - 'title')
                        FROM jsonb_array_elements(workflow_steps::jsonb) AS step
                    )
                    WHERE workflow_steps IS NOT NULL
                      AND jsonb_typeof(workflow_steps::jsonb) = 'array'
                    """
                )
            )
            await conn.execute(text("ALTER TABLE endpoints ADD COLUMN IF NOT EXISTS query_params JSON"))
            await conn.execute(text("ALTER TABLE endpoints ADD COLUMN IF NOT EXISTS request_body TEXT"))
            await conn.execute(text("ALTER TABLE endpoints ADD COLUMN IF NOT EXISTS request_content_type VARCHAR(127)"))
            await conn.execute(text("ALTER TABLE endpoints ADD COLUMN IF NOT EXISTS request_headers JSON"))
            await conn.execute(text("ALTER TABLE ports ADD COLUMN IF NOT EXISTS http_status INTEGER"))
            # Рекон-ферма: происхождение хоста и обратный резолв.
            await conn.execute(text("ALTER TABLE hosts ADD COLUMN IF NOT EXISTS origin VARCHAR(16) NOT NULL DEFAULT 'host'"))
            await conn.execute(text("ALTER TABLE host_ip_addresses ADD COLUMN IF NOT EXISTS hostnames JSON"))
            await conn.execute(text("ALTER TABLE host_ip_addresses DROP COLUMN IF EXISTS is_cloudflare"))
            await conn.execute(text("ALTER TABLE host_farm_jobs ADD COLUMN IF NOT EXISTS kind VARCHAR(16) NOT NULL DEFAULT 'hosts'"))
            await conn.execute(text("ALTER TABLE host_farm_jobs ADD COLUMN IF NOT EXISTS raw TEXT"))
            await conn.execute(text("ALTER TABLE host_farm_jobs ADD COLUMN IF NOT EXISTS attempts INTEGER NOT NULL DEFAULT 0"))
            await conn.execute(text("ALTER TABLE host_farm_jobs ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE"))
            await conn.execute(text("ALTER TABLE host_farm_jobs ADD COLUMN IF NOT EXISTS last_error TEXT"))
            await conn.execute(text("ALTER TABLE host_farm_jobs ADD COLUMN IF NOT EXISTS skipped_targets JSON"))
            await conn.execute(text("UPDATE users SET tags = '[]'::json WHERE tags IS NULL"))
            await conn.execute(text("UPDATE endpoints SET query_params = '[]'::json WHERE query_params IS NULL"))
            await conn.execute(text("UPDATE endpoints SET request_headers = '[]'::json WHERE request_headers IS NULL"))
            await conn.execute(text("UPDATE host_ip_addresses SET hostnames = '[]'::json WHERE hostnames IS NULL"))
        elif conn.dialect.name == "sqlite":
            async def add_missing(table: str, columns: dict[str, str]) -> None:
                """SQLite не умеет ADD COLUMN IF NOT EXISTS — проверяем через PRAGMA."""
                present = {row[1] for row in (await conn.execute(text(f"PRAGMA table_info({table})"))).fetchall()}
                for name, ddl in columns.items():
                    if name not in present:
                        await conn.execute(text(f"ALTER TABLE {table} ADD COLUMN {ddl}"))

            await add_missing(
                "projects",
                {
                    "folder": "folder VARCHAR(255) NOT NULL DEFAULT ''",
                    "timeline_frozen_at": "timeline_frozen_at TIMESTAMP",
                    "appsec_component_code": "appsec_component_code VARCHAR(64)",
                    "appsec_component_name": "appsec_component_name VARCHAR(255)",
                    "appsec_version_code": "appsec_version_code VARCHAR(64)",
                    "appsec_version_name": "appsec_version_name VARCHAR(255)",
                    "appsec_versions": "appsec_versions JSON NOT NULL DEFAULT '[]'",
                    "appsec_assignee": "appsec_assignee VARCHAR(255)",
                    "appsec_assignee_name": "appsec_assignee_name VARCHAR(255)",
                    "appsec_ticket_url": "appsec_ticket_url VARCHAR(1024)",
                    "appsec_ticket_key": "appsec_ticket_key VARCHAR(64)",
                },
            )
            await add_missing("users", {"is_locked": "is_locked BOOLEAN NOT NULL DEFAULT 0", "is_sso": "is_sso BOOLEAN NOT NULL DEFAULT 0"})
            await add_missing("notifications", {"context_data": "context_data JSON", "dedupe_key": "dedupe_key VARCHAR(255)"})
            await conn.execute(text("CREATE UNIQUE INDEX IF NOT EXISTS ix_notifications_dedupe_key ON notifications (dedupe_key)"))
            await add_missing("hosts", {"origin": "origin VARCHAR(16) NOT NULL DEFAULT 'host'"})
            await add_missing(
                "host_ip_addresses",
                {
                    "hostnames": "hostnames JSON",
                },
            )
            await add_missing(
                "host_farm_jobs",
                {
                    "kind": "kind VARCHAR(16) NOT NULL DEFAULT 'hosts'",
                    "raw": "raw TEXT",
                    "attempts": "attempts INTEGER NOT NULL DEFAULT 0",
                    "published_at": "published_at TIMESTAMP",
                    "last_error": "last_error TEXT",
                    "skipped_targets": "skipped_targets JSON",
                },
            )
    # Миграция данных под новые статусы находок (workflow Works) — ОТДЕЛЬНОЙ
    # транзакцией: PG запрещает использовать только что добавленную метку enum в той
    # же транзакции, где её добавили (ALTER TYPE ... ADD VALUE выше уже закоммичен).
    async with engine.begin() as conn:
        if conn.dialect.name == "postgresql":
            await conn.execute(text("UPDATE vulnerabilities SET status = 'RESOLVED' WHERE status::text = 'FIXED'"))
            await conn.execute(text("UPDATE vulnerabilities SET status = 'CANCELLED' WHERE status::text = 'WONT_FIX'"))
            await conn.execute(text("UPDATE vulnerabilities SET status = 'CLOSED' WHERE status::text = 'ACCEPTED_RISK'"))
    MinioStorage().ensure_bucket()
    async with SessionLocal() as db:
        service = UserService(db)
        await service.bootstrap_admin()
    app.state.deadline_notifications = asyncio.create_task(deadline_loop(SessionLocal))


@app.on_event("shutdown")
async def shutdown_notifications() -> None:
    task = getattr(app.state, "deadline_notifications", None)
    if task is not None:
        task.cancel()
        with suppress(asyncio.CancelledError):
            await task


@app.get("/health")
async def health() -> dict:
    """Healthcheck эндпоинт для проверки доступности сервиса."""
    return {"status": "ok"}


_register_routes()
_register_error_handlers()
