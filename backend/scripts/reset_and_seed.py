"""Сброс демо-данных и пересид БД (пользователей сохраняет).

Запуск из каталога backend:
    PYTHONPATH=/app python scripts/reset_and_seed.py   # Docker
    python scripts/reset_and_seed.py                   # локально, если backend в PYTHONPATH
"""
import asyncio
import base64
import sys
from datetime import UTC, date, datetime, timedelta
from pathlib import Path
from uuid import uuid4

# Позволяет выполнять файл напрямую без предварительного export PYTHONPATH=/app
_backend_root = Path(__file__).resolve().parent.parent
if str(_backend_root) not in sys.path:
    sys.path.insert(0, str(_backend_root))

from sqlalchemy import text, select

from app.config import get_settings
from app.database import Base, SessionLocal, engine
from app.enums import (
    AssetType,
    CvssVersion,
    HostStatus,
    HttpMethod,
    NotificationType,
    OsType,
    PortState,
    ProjectRole,
    ProjectStatus,
    Protocol,
    Severity,
    UserRole,
    VulnerabilityStatus,
)
from app.models import (
    AccountReactivationToken,
    AgentApiToken,
    AgentApiTokenProjectGrant,
    AuditLog,
    Comment,
    CommentMention,
    Endpoint,
    File,
    Host,
    HostFarmJob,
    HostIpAddress,
    Invitation,
    JsFile,
    JsSecret,
    MailJob,
    Notification,
    PasswordResetToken,
    Port,
    Project,
    ProjectCredential,
    ProjectFolder,
    ProjectHiddenIp,
    ProjectMember,
    ProjectNote,
    ProjectNoteComment,
    RefreshToken,
    Service,
    User,
    Vulnerability,
    VulnerabilityAsset,
    WorksIssueLink,
)
from app.security import (
    encrypt_secret,
    generate_totp_secret,
    hash_agent_token,
    hash_invitation_token,
    hash_password,
    hash_password_reset_token,
    hash_reactivation_token,
    hash_refresh_token,
)
from app.services import UserService
from app.storage.minio_client import MinioStorage

DEMO_PNG_BYTES = base64.b64decode(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wn0K6sAAAAASUVORK5CYII="
)


async def ensure_schema() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


def reset_minio(minio_keys: list[str]) -> None:
    if not minio_keys:
        return
    storage = MinioStorage()
    storage.ensure_bucket()
    for object_key in minio_keys:
        try:
            storage.client.remove_object(storage.bucket, object_key)
        except Exception:
            # Объект может отсутствовать в MinIO (например, был удалён вручную).
            pass


async def create_users() -> dict[str, User]:
    settings = get_settings()
    users: dict[str, User] = {}
    async with SessionLocal() as db:
        await UserService(db).bootstrap_admin()
        admin = await db.scalar(select(User).where(User.username == settings.initial_admin_username))
        if not admin:
            raise RuntimeError("Admin user was not created")
        users["admin"] = admin

        # (username, email, ФИО, аккаунтная роль, проектная роль, is_sso, totp,
        # is_locked). Проектная роль глобальная: лид — обычный юзер, но с доп.
        # возможностями в своих проектах. Заполняем ВСЕ поля профиля, чтобы демо
        # покрывало SSO-аккаунты (пароль меняется только в IdM), включённую 2FA
        # (TOTP-секрет шифруется Fernet) и мягко удалённого (is_locked) юзера, на
        # которого навешивается токен реактивации.
        now = datetime.now(UTC)
        demo_users = [
            ("alice", "alice@example.com", "Алиса Иванова Сергеевна", UserRole.PENTESTER, ProjectRole.LEAD, False, True, False),
            ("bob", "bob@example.com", "Борис Петров Николаевич", UserRole.PENTESTER, ProjectRole.LEAD, False, False, False),
            ("charlie", "charlie@example.com", "Чарли Сидоров Олегович", UserRole.PENTESTER, ProjectRole.PENTESTER, False, False, False),
            ("diana", "diana@example.com", "Диана Кузнецова Павловна", UserRole.PENTESTER, ProjectRole.PENTESTER, True, False, False),
            ("eve", "eve@example.com", "Ева Смирнова Андреевна", UserRole.PENTESTER, ProjectRole.PENTESTER, False, False, False),
            ("frank", "frank@example.com", "Франк Волков Дмитриевич", UserRole.PENTESTER, ProjectRole.PENTESTER, False, False, True),
        ]
        for username, email, full_name, role, project_role, is_sso, totp_on, is_locked in demo_users:
            user = await db.scalar(select(User).where(User.username == username))
            if not user:
                user = await db.scalar(select(User).where(User.email == email))
            if not user:
                user = User(
                    username=username,
                    email=email,
                    # У SSO-пользователя локального пароля нет: ставим unusable-хэш.
                    # Пароль существующих юзеров не трогаем — только профиль ниже.
                    password_hash=hash_password("admin") if not is_sso else hash_password(uuid4().hex),
                )
                db.add(user)

            # Демо-профиль применяем и к новым, и к уже существующим пользователям:
            # пользователей reset_and_seed сохраняет, поэтому без явного апдейта
            # старые записи остались бы с пустыми full_name/is_sso/totp и т.п.
            user.email = email
            user.full_name = full_name
            user.is_sso = is_sso
            # SSO-профиль не показывает смену пароля → password_changed_at пустой.
            user.password_changed_at = None if is_sso else now - timedelta(days=30)
            if totp_on:
                if not user.totp_secret:
                    user.totp_secret = encrypt_secret(generate_totp_secret())
                user.totp_enabled = True
                user.totp_confirmed_at = now - timedelta(days=20)
            else:
                user.totp_secret = None
                user.totp_enabled = False
                user.totp_confirmed_at = None
            user.role = role
            user.project_role = project_role
            user.is_active = True
            user.is_locked = is_locked
            await db.flush()
            users[username] = user
        await db.commit()
    return users


async def clear_domain_data_preserve_users() -> list[str]:
    async with SessionLocal() as db:
        minio_keys = list((await db.scalars(select(File.minio_key).where(File.minio_key.is_not(None)))).all())
        await db.execute(
            text(
                """
                TRUNCATE TABLE
                    comment_mentions,
                    notifications,
                    comments,
                    project_note_comments,
                    project_notes,
                    vulnerability_assets,
                    works_issue_links,
                    project_credentials,
                    files,
                    js_secrets,
                    js_files,
                    vulnerabilities,
                    services,
                    ports,
                    endpoints,
                    host_ip_addresses,
                    host_farm_jobs,
                    project_hidden_ips,
                    hosts,
                    project_members,
                    agent_api_token_project_grants,
                    agent_api_tokens,
                    projects,
                    project_folders,
                    invitations,
                    password_reset_tokens,
                    account_reactivation_tokens,
                    refresh_tokens,
                    mail_jobs,
                    audit_logs
                RESTART IDENTITY CASCADE
                """
            )
        )
        await db.commit()
    return minio_keys


async def seed_demo_data() -> None:
    users = await create_users()
    storage = MinioStorage()
    storage.ensure_bucket()
    now = datetime.now(UTC)
    today = date.today()
    severity_cycle = [Severity.CRITICAL, Severity.HIGH, Severity.MEDIUM, Severity.LOW, Severity.INFO]

    # Профили CVSS для сид-находок. Критичность ВСЕГДА выводится из score (как в
    # реальной логике create/update), поэтому карточка, таблица и отчёт совпадают.
    # score=None → «проверка»: CVSS не задан, находка считается нереализуемой и в
    # отчёте идёт только в раздел «Тесты» (4.4).
    def _sev_from_score(score: float | None) -> Severity:
        if score is None:
            return Severity.UNREALIZED
        if score >= 9.0:
            return Severity.CRITICAL
        if score >= 7.0:
            return Severity.HIGH
        if score >= 4.0:
            return Severity.MEDIUM
        if score > 0:
            return Severity.LOW
        return Severity.INFO

    cvss_profiles: list[tuple[float | None, str | None]] = [
        (9.3, "CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:L/SI:L/SA:L"),
        (8.1, "CVSS:4.0/AV:N/AC:L/AT:N/PR:L/UI:N/VC:H/VI:H/VA:N/SC:N/SI:N/SA:N"),
        (5.9, "CVSS:4.0/AV:N/AC:L/AT:N/PR:L/UI:P/VC:L/VI:L/VA:L/SC:N/SI:N/SA:N"),
        (3.1, "CVSS:4.0/AV:L/AC:H/AT:N/PR:L/UI:P/VC:L/VI:N/VA:N/SC:N/SI:N/SA:N"),
        (None, None),  # проверка — без CVSS
        (7.2, "CVSS:4.0/AV:N/AC:L/AT:P/PR:N/UI:N/VC:H/VI:L/VA:N/SC:N/SI:N/SA:N"),
    ]
    status_cycle = [
        VulnerabilityStatus.OPEN,
        VulnerabilityStatus.IN_PROGRESS,
        VulnerabilityStatus.PROBLEM_ANALYSIS,
        VulnerabilityStatus.NEED_INFO,
        VulnerabilityStatus.PAUSED,
        VulnerabilityStatus.RESOLVED,
        VulnerabilityStatus.CLOSED,
        VulnerabilityStatus.CANCELLED,
        VulnerabilityStatus.SENT_BY_MISTAKE,
    ]
    project_statuses = [ProjectStatus.ACTIVE, ProjectStatus.ACTIVE, ProjectStatus.COMPLETED, ProjectStatus.ARCHIVED]
    folder_specs = [
        ("External Audits", None),
        ("Internal", None),
        ("Red Team", None),
        ("Phase 1", "Red Team"),
        ("Phase 2", "Red Team"),
        ("Mobile", "External Audits"),
        ("API", "External Audits"),
        ("Infrastructure", "Internal"),
    ]

    async with SessionLocal() as db:
        admin = await db.scalar(select(User).where(User.username == "admin"))
        if not admin:
            raise RuntimeError("Admin user is missing")



        folders_by_path: dict[str, ProjectFolder] = {}
        for folder_name, parent_path in folder_specs:
            path = f"{parent_path}/{folder_name}" if parent_path else folder_name
            parent = folders_by_path.get(parent_path) if parent_path else None
            folder = ProjectFolder(
                name=folder_name,
                path=path,
                parent_id=parent.id if parent else None,
                created_by=admin.id,
            )
            db.add(folder)
            await db.flush()
            folders_by_path[path] = folder

        project_specs = [
            ("Acme External API", "External Audits/API", ProjectStatus.ACTIVE, [users["alice"], users["bob"], users["diana"]]),
            ("Contoso Mobile", "External Audits/Mobile", ProjectStatus.ACTIVE, [users["alice"], users["eve"]]),
            ("Intranet Review", "Internal/Infrastructure", ProjectStatus.FREEZE, [users["bob"], users["charlie"]]),
            ("Red Team Alpha", "Red Team/Phase 1", ProjectStatus.VULNERABILITY_RECHECK, [users["alice"], users["charlie"], users["diana"]]),
            ("Red Team Bravo", "Red Team/Phase 2", ProjectStatus.COMPLETED, [users["bob"], users["eve"]]),
            ("Partner Portal", "", ProjectStatus.HANDOVER_TO_DEVELOPMENT, [users["alice"], users["bob"]]),
            ("Legacy ERP", "", ProjectStatus.ARCHIVED, [users["charlie"], users["diana"]]),
            ("Corporate SSO", "Internal", ProjectStatus.COMPLETED, [users["alice"], users["eve"]]),
        ]

        audit_rows: list[dict] = []
        file_counter = 0

        for project_index, (project_name, folder_path, project_status, members) in enumerate(project_specs, start=1):
            start_date = today - timedelta(days=14 + project_index)
            end_date = today + timedelta(days=14 - project_index if project_status == ProjectStatus.ACTIVE else -project_index)
            # Окно, в котором раскидываем created_at активов и находок, чтобы виджеты-
            # графики росли: от старта проекта до «сегодня» (но не позже конца проекта).
            p_start_dt = datetime.combine(start_date, datetime.min.time(), tzinfo=UTC)
            p_end_dt = datetime.combine(end_date, datetime.min.time(), tzinfo=UTC)
            data_hi = min(now, p_end_dt)
            if data_hi <= p_start_dt:
                data_hi = p_start_dt + timedelta(days=1)

            def added_at(frac: float, _lo=p_start_dt, _hi=data_hi) -> datetime:
                """created_at на доле `frac` окна проекта [start … min(now, end)]."""
                return _lo + (_hi - _lo) * max(0.0, min(1.0, frac))

            # === Параметры AppSec/Works — заполняем ВСЕ поля проекта, чтобы отчёт
            # подставил «по задаче …», версию дистрибутива и таблицу УЗ, а экспорт
            # в Works имел компонент/версию/исполнителя. assignee = username
            # участника (у SSO-пользователей username = IAM-логин). Версия названа
            # так, чтобы _distrib_version выделил последний токен ("1.1" и т.п.).
            appsec_assignee = members[0].username if members else admin.username
            appsec_version_name = f"Platform V PRODUCT {1 + project_index % 3}.{project_index % 5}"
            appsec_ticket_key = f"APPSEC-{4200 + project_index}"
            appsec_ticket_url = (
                "https://portal.works.prod.sbt/swtr/units/current/unit/"
                f"{appsec_ticket_key}?space=APPSEC&tenant=default"
            )
            # Таймлайн замораживается в момент выхода проекта из статуса ACTIVE
            # (completed/archived) — повторяем это поведение для демо-данных.
            timeline_frozen_at = None if project_status == ProjectStatus.ACTIVE else p_end_dt

            project = Project(
                name=project_name,
                folder=folder_path,
                start_date=start_date,
                end_date=end_date,
                status=project_statuses[(project_index - 1) % len(project_statuses)] if project_status is None else project_status,
                created_by=admin.id,
                # Параметры экспорта в Works + связанный AppSec-тикет для отчёта.
                appsec_component_code=str(uuid4()),
                appsec_component_name="SEGR",
                appsec_version_code=str(uuid4()),
                appsec_version_name=appsec_version_name,
                appsec_assignee=appsec_assignee,
                appsec_ticket_key=appsec_ticket_key,
                appsec_ticket_url=appsec_ticket_url,
                timeline_frozen_at=timeline_frozen_at,
                # Проект «заведён» в день своего старта — разносит точки на графиках
                # количества проектов на главной странице.
                created_at=p_start_dt,
                updated_at=p_start_dt,
            )
            db.add(project)
            await db.flush()

            db.add(ProjectMember(project_id=project.id, user_id=admin.id))
            for member in members:
                db.add(ProjectMember(project_id=project.id, user_id=member.id))
                # Повод №2: их в проект добавил админ — ровно то же уведомление,
                # что создаёт add_member. Себе админ его не шлёт.
                db.add(
                    Notification(
                        user_id=member.id,
                        type=NotificationType.PROJECT_MEMBER_ADDED,
                        project_id=project.id,
                        actor_id=admin.id,
                        is_read=False,
                    )
                )
            await db.flush()

            audit_rows.append(
                {
                    "user_id": admin.id,
                    "username": admin.username,
                    "action": "CREATE",
                    "entity_type": "project",
                    "entity_id": project.id,
                    "details": {"project": project.name, "folder": folder_path or "root"},
                    "ip_address": "127.0.0.1",
                    "created_at": now - timedelta(days=project_index),
                }
            )

            # === Учётные данные проекта (пароль — шифртекст Fernet в БД) ===
            # Несколько разнотипных УЗ (веб-админ / сервисный аккаунт / root) —
            # проверяют общий стор кредов и таблицу «Учётные данные» в отчёте
            # (word_builder клонирует строку шаблона под каждую запись).
            cred_host_fqdn = f"{project_name.lower().replace(' ', '-')}-host-1.demo.local"
            for _cred_user, _cred_pw, _cred_host in [
                (f"admin@{project_name.split()[0].lower()}.local", "P@ssw0rd-2026!", f"10.{project_index}.1.10"),
                ("svc_scanner", "Sc@nner#S3cret", cred_host_fqdn),
                ("root", f"toor-{project_index}-demo", f"172.16.{project_index}.1"),
            ]:
                db.add(
                    ProjectCredential(
                        project_id=project.id,
                        username=_cred_user,
                        password_encrypted=encrypt_secret(_cred_pw),
                        host=_cred_host,
                        created_by=members[0].id if members else admin.id,
                    )
                )
            await db.flush()

            # === Заметки проекта (вложенное дерево из 3 уровней) ===
            note_root = ProjectNote(
                project_id=project.id,
                title=f"Главная страница «{project_name}»",
                content=(
                    f"# Обзор проекта «{project_name}»\n\n"
                    "Это корневая заметка проекта со ссылками на ключевые разделы:\n\n"
                    "- Цели и скоуп\n"
                    "- План работ\n"
                    "- Контактные лица заказчика\n\n"
                    f"Команда: @{members[0].username if members else admin.username}, "
                    f"@{members[-1].username if len(members) > 1 else admin.username}.\n"
                ),
                sort_order=0,
                created_by=admin.id,
                updated_by=admin.id,
            )
            db.add(note_root)
            await db.flush()

            note_methodology = ProjectNote(
                project_id=project.id,
                parent_id=note_root.id,
                title="Методология",
                content=(
                    "## Подход\n\n"
                    "1. Сбор информации (OSINT, поддомены, сертификаты)\n"
                    "2. Активная разведка (Nmap, DirBuster)\n"
                    "3. Анализ уязвимостей (SAST/DAST)\n"
                    "4. Эксплуатация (ручная и автоматизированная)\n"
                    "5. Подготовка отчёта\n"
                ),
                sort_order=1,
                created_by=admin.id,
                updated_by=members[0].id if members else admin.id,
            )
            db.add(note_methodology)
            await db.flush()

            note_findings = ProjectNote(
                project_id=project.id,
                parent_id=note_root.id,
                title="Ключевые находки",
                content=(
                    "## Top-3\n\n"
                    "- **SSRF** в loadbalancer (см. уязвимость #1 в overview)\n"
                    "- **Слабые пароли** на staging\n"
                    "- **Утечка JWT-секрета** через debug endpoint\n\n"
                    f"Подробности у @{members[0].username if members else admin.username}.\n"
                ),
                sort_order=2,
                created_by=members[0].id if members else admin.id,
                updated_by=members[0].id if members else admin.id,
            )
            db.add(note_findings)
            await db.flush()

            note_subpage = ProjectNote(
                project_id=project.id,
                parent_id=note_methodology.id,
                title="Чек-лист инструментов",
                content=(
                    "- nmap 7.94\n- gobuster 3.6\n- sqlmap 1.7\n- Burp Suite Pro\n- ZAP\n"
                ),
                sort_order=0,
                created_by=members[0].id if members else admin.id,
                updated_by=members[0].id if members else admin.id,
            )
            db.add(note_subpage)
            await db.flush()

            # === Комментарии к заметкам, с упоминанием → уведомление ===
            commenter_note = members[1] if len(members) > 1 else admin
            mentioned_note = members[0] if members else admin
            note_comment = ProjectNoteComment(
                project_id=project.id,
                note_id=note_findings.id,
                user_id=commenter_note.id,
                content=f"@{mentioned_note.username} обрати внимание на SSRF — нужна повторная проверка после фикса.",
            )
            db.add(note_comment)
            await db.flush()
            db.add(
                Notification(
                    user_id=mentioned_note.id,
                    type=NotificationType.MENTION,
                    note_comment_id=note_comment.id,
                    is_read=False,
                )
            )
            note_comment_extra = ProjectNoteComment(
                project_id=project.id,
                note_id=note_root.id,
                user_id=admin.id,
                content="Скоуп подтверждён. Можно стартовать активную фазу.",
            )
            db.add(note_comment_extra)

            # Первый доменный хост проекта — на него вешаем JS-файлы фермы.
            first_host: Host | None = None

            for host_index in range(1, 4):
                primary_ip = f"10.{project_index}.{host_index}.10"
                # 3 хоста → 25% / 50% / 75% окна проекта: график хостов растёт ступеньками.
                host_time = added_at(host_index / 4.0)
                host_os = [OsType.LINUX, OsType.WINDOWS, OsType.FREEBSD][(host_index - 1) % 3]
                host = Host(
                    project_id=project.id,
                    ip_address=primary_ip,
                    hostname=f"{project_name.lower().replace(' ', '-')}-host-{host_index}.demo.local",
                    status=HostStatus.UP if host_index != 2 else HostStatus.UNKNOWN,
                    os_type=host_os,
                    origin="host",
                    notes=f"Описание тестового хоста {host_index} для проекта {project_name}.",
                    created_at=host_time,
                    updated_at=host_time,
                )
                db.add(host)
                await db.flush()
                if first_host is None:
                    first_host = host

                # Сид пишет audit и для инвентаря — иначе созданные хосты/IP/порты
                # не попадут в ленту активности проекта.
                audit_rows.append(
                    {
                        "user_id": admin.id,
                        "username": admin.username,
                        "action": "CREATE",
                        "entity_type": "host",
                        "entity_id": host.id,
                        "details": {"project_id": str(project.id), "hostname": host.hostname, "ip_address": primary_ip},
                        "ip_address": "127.0.0.1",
                        "created_at": now - timedelta(days=project_index, hours=host_index),
                    }
                )

                # Несколько IP у хоста (внутренний/внешний/management) — проверка таблицы host_ip_addresses.
                host_ip_rows: dict[str, HostIpAddress] = {}
                # (ip, label, is_primary, hostnames-JSON, is_cloudflare). hostnames —
                # список {hostname, source, confirmed}: ptr — PTR-запись адреса,
                # project — имя известного хоста проекта. is_cloudflare трёхзначно:
                # True за CF, False достоверно не CF, None — ещё не пробит.
                for ip_suffix, label, is_primary, ip_hostnames, ip_cf in [
                    (
                        primary_ip,
                        "external",
                        True,
                        [
                            {"hostname": host.hostname, "source": "project", "confirmed": True},
                            {"hostname": f"www.{host.hostname}", "source": "ptr", "confirmed": False},
                        ],
                        True,
                    ),
                    (
                        f"10.{project_index}.{host_index}.20",
                        "internal",
                        False,
                        [{"hostname": host.hostname, "source": "project", "confirmed": True}],
                        False,
                    ),
                    (f"172.16.{project_index}.{host_index}", "mgmt", False, None, None),
                ]:
                    ip_row = HostIpAddress(
                        host_id=host.id,
                        ip_address=ip_suffix,
                        label=label,
                        is_primary=is_primary,
                        hostnames=ip_hostnames,
                        is_cloudflare=ip_cf,
                        created_at=host_time,
                        updated_at=host_time,
                    )
                    db.add(ip_row)
                    host_ip_rows[label] = ip_row
                await db.flush()
                for label, ip_row in host_ip_rows.items():
                    audit_rows.append(
                        {
                            "user_id": admin.id,
                            "username": admin.username,
                            "action": "CREATE",
                            "entity_type": "host_ip_address",
                            "entity_id": ip_row.id,
                            "details": {"project_id": str(project.id), "ip_address": ip_row.ip_address, "label": label},
                            "ip_address": "127.0.0.1",
                            "created_at": now - timedelta(days=project_index, hours=host_index),
                        }
                    )

                ports_for_host: list[Port] = []
                for port_number, protocol, state, service_name, version, ip_label, http_status in [
                    (22, Protocol.TCP, PortState.OPEN, "ssh", "OpenSSH_9.6", "mgmt", None),
                    (80, Protocol.TCP, PortState.OPEN, "http", "nginx/1.25", "external", 301),
                    (443, Protocol.TCP, PortState.OPEN, "https", "nginx/1.25", "external", 200),
                    (
                        8080,
                        Protocol.TCP,
                        PortState.FILTERED if host_index == 3 else PortState.OPEN,
                        "tomcat",
                        "10.1",
                        "internal",
                        None if host_index == 3 else 403,
                    ),
                ]:
                    target_ip = host_ip_rows[ip_label]
                    port = Port(
                        host_id=host.id,
                        ip_address_id=target_ip.id,
                        port_number=port_number,
                        protocol=protocol,
                        state=state,
                        http_status=http_status,
                        created_at=host_time,
                        updated_at=host_time,
                    )
                    db.add(port)
                    await db.flush()
                    ports_for_host.append(port)
                    audit_rows.append(
                        {
                            "user_id": admin.id,
                            "username": admin.username,
                            "action": "CREATE",
                            "entity_type": "port",
                            "entity_id": port.id,
                            "details": {
                                "project_id": str(project.id),
                                "port": f"{port_number}/{protocol.value}",
                                "service": service_name,
                            },
                            "ip_address": "127.0.0.1",
                            "created_at": now - timedelta(days=project_index, hours=host_index),
                        }
                    )
                    db.add(
                        Service(
                            port_id=port.id,
                            name=service_name,
                            version=version,
                            banner=f"{service_name} banner for {project_name}",
                            created_at=host_time,
                            updated_at=host_time,
                        )
                    )

                endpoints: list[Endpoint] = []
                for method, path_suffix, description, q_params, body, body_ct, req_headers in [
                    (
                        HttpMethod.GET,
                        "/api/health",
                        "Проверка состояния сервиса",
                        [{"name": "verbose", "value": "true"}],
                        None,
                        None,
                        [{"name": "Accept", "value": "application/json"}],
                    ),
                    (
                        HttpMethod.POST,
                        "/api/login",
                        "Точка входа пользователей",
                        None,
                        '{"username": "admin", "password": "example"}',
                        "application/json",
                        [
                            {"name": "Content-Type", "value": "application/json"},
                            {"name": "X-Requested-With", "value": "XMLHttpRequest"},
                        ],
                    ),
                    (
                        HttpMethod.GET,
                        "/api/users",
                        "Получение списка пользователей",
                        [{"name": "page", "value": "1"}, {"name": "limit", "value": "50"}],
                        None,
                        None,
                        [{"name": "Authorization", "value": "Bearer <token>"}],
                    ),
                ]:
                    endpoint = Endpoint(
                        host_id=host.id,
                        path=path_suffix,
                        method=method,
                        description=f"{description} ({project_name})",
                        query_params=q_params,
                        request_body=body,
                        request_content_type=body_ct,
                        request_headers=req_headers,
                        created_at=host_time,
                        updated_at=host_time,
                    )
                    db.add(endpoint)
                    await db.flush()
                    endpoints.append(endpoint)
                    audit_rows.append(
                        {
                            "user_id": admin.id,
                            "username": admin.username,
                            "action": "CREATE",
                            "entity_type": "endpoint",
                            "entity_id": endpoint.id,
                            "details": {
                                "project_id": str(project.id),
                                "endpoint": f"{method.value} {path_suffix}",
                            },
                            "ip_address": "127.0.0.1",
                            "created_at": now - timedelta(days=project_index, hours=host_index),
                        }
                    )

                for vuln_index in range(1, 3):
                    # 6 находок на проект, разнесены по окну (0.11 … 0.89) — график
                    # уязвимостей и «моих находок» на overview растёт плавной лесенкой.
                    vuln_time = added_at((host_index - 1 + vuln_index / 3.0) / 3.0)
                    _cvss_score, _cvss_vector = cvss_profiles[(project_index + host_index + vuln_index) % len(cvss_profiles)]
                    vuln = Vulnerability(
                        project_id=project.id,
                        title=f"{project_name} / Host {host_index} / Finding {vuln_index}",
                        description="Тестовая уязвимость для проверки host-centric сценариев.",
                        severity=_sev_from_score(_cvss_score),
                        cvss_version=CvssVersion.V40 if _cvss_score is not None else None,
                        cvss_score=_cvss_score,
                        cvss_vector=_cvss_vector,
                        cwe_id="CWE-79" if vuln_index % 2 else "CWE-89",
                        status=status_cycle[(project_index + vuln_index) % len(status_cycle)],
                        # Каждый шаг — отдельная запись: в карточке у него своё поле,
                        # а номер рисует интерфейс, поэтому в тексте нумерации нет.
                        workflow_steps=[
                            {"id": str(uuid4()), "description": text, "image_file_ids": [], "endpoint_id": None, "endpoint_request_raw": None}
                            for text in (
                                "Выполнить запрос",
                                "Получить некорректный ответ",
                                "Зафиксировать результат",
                            )
                        ],
                        steps_to_reproduce="Выполнить запрос\nПолучить некорректный ответ\nЗафиксировать результат",
                        impact="Компрометация конфиденциальности и/или целостности данных.",
                        recommendations="Ограничить доступ, валидировать входные данные и усилить аутентификацию.",
                        created_by=members[0].id if members else admin.id,
                        created_at=vuln_time,
                        updated_at=vuln_time,
                    )
                    db.add(vuln)
                    await db.flush()

                    db.add(VulnerabilityAsset(vulnerability_id=vuln.id, asset_type=AssetType.HOST, asset_id=host.id))
                    if ports_for_host:
                        db.add(VulnerabilityAsset(vulnerability_id=vuln.id, asset_type=AssetType.PORT, asset_id=ports_for_host[0].id))
                    if endpoints:
                        db.add(VulnerabilityAsset(vulnerability_id=vuln.id, asset_type=AssetType.ENDPOINT, asset_id=endpoints[0].id))

                    # === Тикеты: связь находки с Works (bug_appsec) и Task Tracker ===
                    # Обе таблицы — одна запись на уязвимость (unique). Разносим по
                    # vuln_index, чтобы ни одна находка не получила два линка одного
                    # типа и чтобы обе таблицы были заполнены в демо.
                    if vuln_index == 1:
                        works_key = f"APPSEC-{5000 + project_index * 10 + host_index}"
                        db.add(
                            WorksIssueLink(
                                vulnerability_id=vuln.id,
                                works_key=works_key,
                                works_url=(
                                    "https://portal.works.prod.sbt/swtr/units/current/unit/"
                                    f"{works_key}?space=APPSEC&tenant=default"
                                ),
                                # Статус тикета в Works, синкается «on open»; разносим по
                                # хостам, чтобы были и открытые, и в работе, и закрытые.
                                works_status=["Открыт", "В работе", "Требует информации", "Закрыт"][
                                    (project_index + host_index) % 4
                                ],
                                created_by=members[0].id if members else admin.id,
                            )
                        )
                    # Уведомление автору о смене статуса его находки (actor — админ),
                    # кроме только что открытых (OPEN): его присылает set-status.
                    if vuln.status != VulnerabilityStatus.OPEN:
                        db.add(
                            Notification(
                                user_id=vuln.created_by,
                                type=NotificationType.VULN_STATUS_CHANGED,
                                vulnerability_id=vuln.id,
                                actor_id=admin.id,
                                status=vuln.status.value,
                                is_read=False,
                                created_at=vuln_time,
                            )
                        )

                    file_counter += 1
                    png_bytes = DEMO_PNG_BYTES
                    png_key = storage.upload_bytes(png_bytes, "image/png", f"evidence-{project_index}-{host_index}-{vuln_index}.png")
                    db.add(
                        File(
                            vulnerability_id=vuln.id,
                            original_name=f"evidence-{project_index}-{host_index}-{vuln_index}.png",
                            content_type="image/png",
                            size_bytes=len(png_bytes),
                            minio_bucket=storage.bucket,
                            minio_key=png_key,
                            uploaded_by=members[0].id if members else admin.id,
                        )
                    )

                    report_bytes = f"Demo evidence for {project_name} host {host_index} vuln {vuln_index}".encode("utf-8")
                    report_key = storage.upload_bytes(report_bytes, "text/plain", f"notes-{project_index}-{host_index}-{vuln_index}.txt")
                    db.add(
                        File(
                            vulnerability_id=vuln.id,
                            original_name=f"notes-{project_index}-{host_index}-{vuln_index}.txt",
                            content_type="text/plain",
                            size_bytes=len(report_bytes),
                            minio_bucket=storage.bucket,
                            minio_key=report_key,
                            uploaded_by=admin.id,
                        )
                    )

                    author = members[0] if members else admin
                    mentioned = members[-1] if len(members) > 1 else admin
                    comment = Comment(
                        vulnerability_id=vuln.id,
                        user_id=author.id,
                        content=f"Проверено автором @{mentioned.username}. Нужно перепроверить доступ к {host.hostname}.",
                    )
                    db.add(comment)
                    await db.flush()
                    db.add(CommentMention(comment_id=comment.id, user_id=mentioned.id))
                    db.add(Notification(user_id=mentioned.id, type=NotificationType.MENTION, comment_id=comment.id, is_read=False))

                    audit_rows.append(
                        {
                            "user_id": author.id,
                            "username": author.username,
                            "action": "CREATE",
                            "entity_type": "vulnerability",
                            "entity_id": vuln.id,
                            "details": {"project": project.name, "host": host.hostname, "severity": vuln.severity.value},
                            "ip_address": f"10.255.{project_index}.{host_index}",
                            "created_at": now - timedelta(hours=project_index * host_index * vuln_index),
                        }
                    )

            # === IP-импорт: служебный host origin='ip' + его адрес ===
            # Так в проекте есть и доменные хосты (origin='host'), и «голые» IP,
            # импортированные через ферму IP (в списке хостов не показываются).
            imported_ip = f"203.0.{project_index}.{10 + project_index}"
            ip_host = Host(
                project_id=project.id,
                ip_address=imported_ip,
                hostname=None,
                status=HostStatus.UP,
                os_type=OsType.UNKNOWN,
                origin="ip",
                notes=None,
                created_at=p_start_dt,
                updated_at=p_start_dt,
            )
            db.add(ip_host)
            await db.flush()
            db.add(
                HostIpAddress(
                    host_id=ip_host.id,
                    ip_address=imported_ip,
                    label="imported",
                    is_primary=True,
                    hostnames=[{"hostname": f"ptr-{project_index}.isp.example", "source": "ptr", "confirmed": False}],
                    is_cloudflare=False,
                    created_at=p_start_dt,
                    updated_at=p_start_dt,
                )
            )

            # === Скрытые IP: адрес «удалён» из вкладки IP, но привязка к хосту цела ===
            db.add(
                ProjectHiddenIp(
                    project_id=project.id,
                    ip_address=f"172.16.{project_index}.254",
                    created_by=admin.id,
                    created_at=p_start_dt,
                )
            )

            # === Задачи рекон-фермы: done (hosts), done (js), failed (ips) ===
            db.add(
                HostFarmJob(
                    project_id=project.id,
                    created_by=members[0].id if members else admin.id,
                    kind="hosts",
                    status="done",
                    targets_total=2,
                    raw=f"host-a.{project_name.lower().replace(' ', '-')}.demo.local\nhost-b.demo.local",
                    result={"added": 2, "skipped": 0, "hosts": ["host-a.demo.local", "host-b.demo.local"]},
                    error=None,
                    attempts=1,
                    published_at=p_start_dt,
                    finished_at=p_start_dt + timedelta(minutes=2),
                    skipped_targets=[],
                )
            )
            db.add(
                HostFarmJob(
                    project_id=project.id,
                    created_by=members[0].id if members else admin.id,
                    kind="js",
                    status="done",
                    targets_total=1,
                    raw=f"https://{first_host.hostname}/app.js" if first_host else "https://demo.local/app.js",
                    result={"files": 1, "secrets": 2},
                    error=None,
                    attempts=1,
                    published_at=p_start_dt,
                    finished_at=p_start_dt + timedelta(minutes=5),
                    skipped_targets=[],
                )
            )
            db.add(
                HostFarmJob(
                    project_id=project.id,
                    created_by=members[0].id if members else admin.id,
                    kind="ips",
                    status="failed",
                    targets_total=3,
                    raw="198.51.100.1\n198.51.100.2\n198.51.100.3",
                    result=None,
                    error="resolve timeout",
                    attempts=3,
                    published_at=p_start_dt,
                    last_error="resolve timeout after 3 attempts",
                    finished_at=p_start_dt + timedelta(minutes=1),
                    skipped_targets=None,
                )
            )

            # === JS-файлы фермы + найденные в них секреты ===
            if first_host is not None:
                js_file = JsFile(
                    project_id=project.id,
                    host_id=first_host.id,
                    url=f"https://{first_host.hostname}/static/app.bundle.js",
                    sha256=uuid4().hex + uuid4().hex,
                    size_bytes=184320,
                    content_type="application/javascript",
                    status="ok",
                    error=None,
                    secret_count=2,
                    endpoint_count=3,
                    endpoints=["/api/v1/login", "/api/v1/users", "/internal/metrics"],
                    fetched_at=p_start_dt + timedelta(minutes=5),
                )
                db.add(js_file)
                await db.flush()
                db.add(
                    JsSecret(
                        js_file_id=js_file.id,
                        kind="aws_access_key",
                        match_preview="AKIA************XMPL",
                        snippet='const KEY = "AKIAIOSFODNN7EXAMPLE";',
                        severity="high",
                    )
                )
                db.add(
                    JsSecret(
                        js_file_id=js_file.id,
                        kind="jwt",
                        match_preview="eyJhbGciOiJIUzI1NiIsIn…",
                        snippet='Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                        severity="medium",
                    )
                )

            # === Уведомление участникам о смене статуса проекта (не для ACTIVE) ===
            if project_status != ProjectStatus.ACTIVE:
                for member in members:
                    db.add(
                        Notification(
                            user_id=member.id,
                            type=NotificationType.PROJECT_STATUS_CHANGED,
                            project_id=project.id,
                            actor_id=admin.id,
                            status=project_status.value,
                            is_read=False,
                            created_at=p_end_dt,
                        )
                    )

        # === API-токены агента: 2 шт. — один на все проекты, один на конкретный ===
        all_proj_token_raw = "demo-agent-token-allprojects-0001"
        all_proj_token = AgentApiToken(
            name="Demo: все проекты",
            token_hash=hash_agent_token(all_proj_token_raw),
            token_prefix=all_proj_token_raw[:8],
            scopes=["projects:read", "assets:read", "notes:read", "vulns:read"],
            all_projects=True,
            created_by=admin.id,
            expires_at=now + timedelta(days=90),
            last_used_at=now - timedelta(hours=3),
        )
        db.add(all_proj_token)

        # Третий токен — отозванный и просроченный (для демо-состояний в списке).
        revoked_token_raw = "demo-agent-token-revoked-0003"
        db.add(
            AgentApiToken(
                name="Demo: отозванный токен",
                token_hash=hash_agent_token(revoked_token_raw),
                token_prefix=revoked_token_raw[:8],
                scopes=["projects:read"],
                all_projects=False,
                created_by=admin.id,
                expires_at=now - timedelta(days=1),
                revoked_at=now - timedelta(days=2),
                last_used_at=now - timedelta(days=5),
            )
        )

        first_project = await db.scalar(select(Project).order_by(Project.created_at.asc()))
        scoped_token_raw = "demo-agent-token-scoped-0002"
        scoped_token = AgentApiToken(
            name="Demo: один проект (read-only)",
            token_hash=hash_agent_token(scoped_token_raw),
            token_prefix=scoped_token_raw[:8],
            scopes=["projects:read", "vulns:read", "notes:read"],
            all_projects=False,
            created_by=admin.id,
        )
        db.add(scoped_token)
        await db.flush()
        if first_project:
            db.add(AgentApiTokenProjectGrant(token_id=scoped_token.id, project_id=first_project.id))

        # === Пользователи для токенов/писем: берём созданных в create_users ===
        alice = await db.scalar(select(User).where(User.username == "alice"))
        bob = await db.scalar(select(User).where(User.username == "bob"))
        frank = await db.scalar(select(User).where(User.username == "frank"))

        # === Refresh-токены: активный у alice + отозванный у bob (хранятся хэшами).
        if alice:
            db.add(
                RefreshToken(
                    user_id=alice.id,
                    token_hash=hash_refresh_token(f"demo-refresh-active-{uuid4().hex}"),
                    expires_at=now + timedelta(days=14),
                    created_at=now - timedelta(days=1),
                )
            )
        if bob:
            db.add(
                RefreshToken(
                    user_id=bob.id,
                    token_hash=hash_refresh_token(f"demo-refresh-revoked-{uuid4().hex}"),
                    expires_at=now + timedelta(days=14),
                    created_at=now - timedelta(days=7),
                    revoked_at=now - timedelta(days=2),
                )
            )

        # === Приглашения: pending / accepted / revoked / expired ===
        db.add(
            Invitation(
                email="newbie@example.com",
                full_name="Новый Пользователь Иванович",
                role=UserRole.PENTESTER,
                project_role=ProjectRole.PENTESTER,
                token_hash=hash_invitation_token(f"demo-invite-pending-{uuid4().hex}"),
                status="pending",
                expires_at=now + timedelta(days=7),
                invited_by=admin.id,
            )
        )
        db.add(
            Invitation(
                email="expired-invite@example.com",
                full_name="Протухшее Приглашение",
                role=UserRole.PENTESTER,
                project_role=ProjectRole.PENTESTER,
                token_hash=hash_invitation_token(f"demo-invite-expired-{uuid4().hex}"),
                status="pending",
                expires_at=now - timedelta(days=1),
                invited_by=admin.id,
            )
        )
        db.add(
            Invitation(
                email="revoked-invite@example.com",
                full_name="Отозванное Приглашение",
                role=UserRole.PENTESTER,
                project_role=ProjectRole.PENTESTER,
                token_hash=hash_invitation_token(f"demo-invite-revoked-{uuid4().hex}"),
                status="revoked",
                expires_at=now + timedelta(days=7),
                invited_by=admin.id,
            )
        )
        if alice:
            db.add(
                Invitation(
                    email="alice-invite@example.com",
                    full_name=alice.full_name,
                    role=UserRole.PENTESTER,
                    project_role=ProjectRole.LEAD,
                    token_hash=hash_invitation_token(f"demo-invite-accepted-{uuid4().hex}"),
                    status="accepted",
                    expires_at=now - timedelta(days=20),
                    invited_by=admin.id,
                    accepted_at=now - timedelta(days=25),
                    accepted_user_id=alice.id,
                )
            )

        # === Задания на письма: sent / pending / failed ===
        db.add(
            MailJob(
                user_id=admin.id,
                created_by=admin.id,
                recipient_email=admin.email,
                subject="Отчёт по проекту готов",
                template="report_ready",
                payload={"project": "Acme External API", "url": "https://storm.demo.local/projects/1"},
                status="sent",
                attempts=1,
                published_at=now - timedelta(hours=2),
                sent_at=now - timedelta(hours=2, minutes=-1),
            )
        )
        db.add(
            MailJob(
                user_id=None,
                created_by=admin.id,
                recipient_email="newbie@example.com",
                subject="Приглашение в STORM",
                template="invitation",
                payload={"invited_by": admin.username, "link": "https://storm.demo.local/invite/xxx"},
                status="pending",
                attempts=0,
            )
        )
        db.add(
            MailJob(
                user_id=bob.id if bob else None,
                created_by=admin.id,
                recipient_email="bob@example.com",
                subject="Сброс пароля",
                template="password_reset",
                payload={"link": "https://storm.demo.local/reset/yyy"},
                status="failed",
                attempts=3,
                published_at=now - timedelta(hours=6),
                last_error="SMTP 554: relay access denied",
            )
        )

        # === Токены сброса пароля: использованный + активный (хэши в БД) ===
        if alice:
            db.add(
                PasswordResetToken(
                    user_id=alice.id,
                    token_hash=hash_password_reset_token(f"demo-reset-used-{uuid4().hex}"),
                    expires_at=now - timedelta(hours=1),
                    used_at=now - timedelta(hours=2),
                    created_at=now - timedelta(hours=3),
                )
            )
            db.add(
                PasswordResetToken(
                    user_id=alice.id,
                    token_hash=hash_password_reset_token(f"demo-reset-active-{uuid4().hex}"),
                    expires_at=now + timedelta(hours=1),
                    created_at=now - timedelta(minutes=10),
                )
            )

        # === Токен реактивации для мягко удалённого (is_locked) пользователя frank.
        if frank:
            db.add(
                AccountReactivationToken(
                    user_id=frank.id,
                    token_hash=hash_reactivation_token(f"demo-reactivate-{uuid4().hex}"),
                    expires_at=now + timedelta(days=3),
                    created_at=now - timedelta(days=1),
                )
            )

        for row in audit_rows:
            db.add(
                AuditLog(
                    user_id=row["user_id"],
                    action=row["action"],
                    entity_type=row["entity_type"],
                    entity_id=row["entity_id"],
                    details=row["details"],
                    ip_address=row["ip_address"],
                    created_at=row["created_at"],
                )
            )

        await db.commit()


async def main() -> None:
    await ensure_schema()
    minio_keys = await clear_domain_data_preserve_users()
    reset_minio(minio_keys)
    await seed_demo_data()
    print("Database reseed complete. Existing users were preserved; demo data for projects/assets/vulnerabilities was refreshed.")


if __name__ == "__main__":
    asyncio.run(main())
