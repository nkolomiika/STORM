"""Mention matching and durable, duplicate-safe project deadline notifications."""
import asyncio
import logging
import re
from datetime import UTC, date, datetime, timedelta

from sqlalchemy import and_, delete, or_, select
from sqlalchemy.dialects.postgresql import insert

from app.enums import NotificationType, ProjectStatus, UserRole
from app.models import Endpoint, Host, Notification, Project, ProjectMember, User
from app.ws_manager import ws_manager

logger = logging.getLogger(__name__)
NOTIFICATION_RETENTION = timedelta(days=7)


def notification_cutoff(now: datetime | None = None) -> datetime:
    """Нижняя граница семи суток хранения, время UTC."""
    return (now or datetime.now(UTC)) - NOTIFICATION_RETENTION


async def delete_expired_notifications(db, now: datetime | None = None, batch_size: int = 1000) -> int:
    """Удаляет ограниченную порцию старых уведомлений; транзакцию завершает вызывающий код.

    SKIP LOCKED позволяет нескольким процессам обслуживания не ждать друг друга.
    Индекс created_at ограничивает чтение старыми строками; новые записи сохраняются.
    """
    expired = (select(Notification.id).where(Notification.created_at < notification_cutoff(now))
               .order_by(Notification.created_at, Notification.id).limit(batch_size)
               .with_for_update(skip_locked=True))
    result = await db.execute(delete(Notification).where(Notification.id.in_(expired)))
    return result.rowcount


async def queue_vulnerability_created(db, project_id: int, vulnerability_id: int, actor_id: int) -> list[Notification]:
    """Уведомляет активных участников проекта о новой находке, исключая автора."""
    user_ids = list(await db.scalars(
        select(User.id).join(ProjectMember, ProjectMember.user_id == User.id)
        .where(ProjectMember.project_id == project_id, User.id != actor_id,
               User.is_active.is_(True), User.is_locked.is_(False))
    ))
    events = [Notification(user_id=user_id, type=NotificationType.VULN_CREATED,
                           project_id=project_id, vulnerability_id=vulnerability_id,
                           actor_id=actor_id, is_read=False) for user_id in user_ids]
    db.add_all(events)
    return events


def mentioned_names(content: str, names: list[str]) -> set[str]:
    """Match full usernames, Unicode/FIO and explicit @{full name} or @\"full name\".

    Longest names win; email addresses and longer usernames are not mentions.
    """
    if not content or "@" not in content or not names:
        return set()
    alternatives = "|".join(re.escape(name) for name in sorted(set(names), key=lambda name: (-len(name), name)))
    pattern = re.compile(r'(?<![\w@])@(?:\{(' + alternatives + r')\}|"(' + alternatives + r')"|(' + alternatives + r'))(?![\w-]|\.[\w-])')
    return {next(value for value in match.groups() if value is not None) for match in pattern.finditer(content)}


async def mentioned_users(db, project_id: int, content: str) -> list[User]:
    if not content or "@" not in content:
        return []
    users = list((await db.scalars(
        select(User).outerjoin(ProjectMember, and_(ProjectMember.user_id == User.id, ProjectMember.project_id == project_id))
        .where(User.is_active.is_(True), User.is_locked.is_(False), or_(ProjectMember.user_id.is_not(None), User.role == UserRole.ADMIN))
    )).all())
    names = mentioned_names(content, [user.username for user in users])
    return [user for user in users if user.username in names]


async def queue_mentions(db, project_id: int, content: str, actor_id: int, context: dict, *, previous: str = "", users=None) -> list[Notification]:
    """Queue newly introduced tags in the caller's transaction; publish after commit."""
    users = users if users is not None else await mentioned_users(db, project_id, content)
    old_names = mentioned_names(previous, [user.username for user in users])
    recipients = [user for user in users if user.id != actor_id and user.username not in old_names]
    if not recipients:
        return []
    data = {"project_id": project_id, **context}
    legacy_comment = bool(data.get("comment_id") or data.get("note_comment_id"))
    if not legacy_comment:
        data["project_name"] = await db.scalar(select(Project.name).where(Project.id == project_id))
        data["commenter_username"] = await db.scalar(select(User.username).where(User.id == actor_id))
    if data.get("endpoint_id"):
        row = (await db.execute(select(Endpoint.path, Endpoint.method, Host.hostname).join(Host, Host.id == Endpoint.host_id).where(Endpoint.id == data["endpoint_id"], Host.project_id == project_id))).one()
        data.update(endpoint_path=row.path, endpoint_method=row.method.value if row.method else "GET", hostname=row.hostname or "unknown")
    events = []
    for user in recipients:
        event = Notification(user_id=user.id, type=NotificationType.MENTION, project_id=project_id, vulnerability_id=data.get("vulnerability_id"), comment_id=data.get("comment_id"), note_comment_id=data.get("note_comment_id"), actor_id=actor_id, context_data=None if legacy_comment else data, is_read=False)
        db.add(event)
        events.append(event)
    return events


async def publish(events: list[Notification]) -> None:
    """A failed socket cannot turn a committed write into HTTP 500."""
    for event in events:
        try:
            await ws_manager.notify_user(event.user_id, {"event": "notification", "entity": "notification", "data": {"type": event.type.value, "id": str(event.id)}})
        except Exception:
            logger.exception("Notification persisted but live delivery failed")


async def generate_deadline_notifications(db, today: date | None = None) -> list[Notification]:
    """Notify active members once per project end date, within two calendar days."""
    today = today or datetime.now(UTC).date()
    rows = (await db.execute(
        select(Project.id, Project.name, Project.end_date, User.id)
        .join(ProjectMember, ProjectMember.project_id == Project.id).join(User, User.id == ProjectMember.user_id)
        .where(Project.end_date >= today, Project.end_date <= today + timedelta(days=2),
               Project.status.notin_([ProjectStatus.COMPLETED, ProjectStatus.ARCHIVED]), User.is_active.is_(True), User.is_locked.is_(False))
    )).all()
    if not rows:
        return []
    values = [{"user_id": user_id, "type": NotificationType.PROJECT_DEADLINE, "project_id": project_id, "is_read": False,
               "dedupe_key": f"deadline:{project_id}:{end_date.isoformat()}:{user_id}",
               "context_data": {"project_id": project_id, "project_name": name, "deadline_date": end_date.isoformat()}}
              for project_id, name, end_date, user_id in rows]
    # PostgreSQL enforces uniqueness across scheduler processes and concurrent runs.
    statement = insert(Notification).values(values).on_conflict_do_nothing(index_elements=[Notification.dedupe_key]).returning(Notification)
    return list((await db.scalars(statement)).all())


async def deadline_loop(sessions, interval: float = 60) -> None:
    """Каждую минуту очищает старые уведомления и проверяет сроки проектов."""
    while True:
        try:
            async with sessions() as db:
                deleted = await delete_expired_notifications(db)
                events = await generate_deadline_notifications(db)
                await db.commit()
                if deleted:
                    logger.info("expired_notifications_deleted count=%s retention_days=7", deleted)
                await publish(events)
        except asyncio.CancelledError:
            raise
        except Exception:
            logger.exception("Notification maintenance sweep failed")
        await asyncio.sleep(interval)
