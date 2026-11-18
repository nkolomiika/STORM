"""Синхронизация статусов связанных проектов по доверенным карточкам APPSEC."""
from __future__ import annotations

import asyncio
import logging
import re
from datetime import UTC, datetime

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.enums import ProjectStatus
from app.models import Project
from app.ws_manager import ws_manager

logger = logging.getLogger("storm.projects")


def project_status_for_task(task: dict) -> ProjectStatus | None:
    """Сопоставляет код/название APPSEC с шестью состояниями STORM; неизвестное сохраняет."""
    aliases = {
        ProjectStatus.ACTIVE: {"active", "open", "new", "todo", "qa", "testing", "in progress", "problem analysis", "открыт", "открыта", "новый", "новая", "в работе", "тестирование", "анализ проблемы"},
        ProjectStatus.FREEZE: {"freeze", "paused", "on hold", "need info", "приостановлен", "приостановлена", "заморожен", "на паузе", "нужна информация", "требует информации"},
        ProjectStatus.HANDOVER_TO_DEVELOPMENT: {"handover to development", "передано в разработку", "передан в разработку", "передача в разработку"},
        ProjectStatus.VULNERABILITY_RECHECK: {"vulnerability recheck", "retest", "перепроверка уязвимостей", "проверка устранения уязвимостей"},
        ProjectStatus.COMPLETED: {"completed", "done", "resolved", "выполнен", "выполнена", "выполнено", "завершен", "завершена", "завершено", "решен", "решена", "решено"},
        ProjectStatus.ARCHIVED: {"archived", "closed", "cancelled", "canceled", "sent by mistake", "архив", "архивный", "закрыт", "закрыта", "закрыто", "отменен", "отменена", "заведена по ошибке"},
    }
    for value in (task.get("status"), task.get("_workflow_code")):
        normalized = re.sub(r"[\s_-]+", " ", str(value or "").casefold().replace("ё", "е")).strip()
        for status, values in aliases.items():
            if normalized in values:
                return status
    return None


async def sync_project_statuses(db: AsyncSession, tasks: list[dict]) -> int:
    """Меняет только связанные проекты; условный UPDATE защищает от повторных фоновых событий."""
    from app.services import AuditService, ProjectService
    mapped = {task["key"]: project_status_for_task(task) for task in tasks if task.get("key")}
    mapped = {key: status for key, status in mapped.items() if status is not None}
    if not mapped:
        return 0
    projects = list((await db.scalars(select(Project).where(Project.appsec_ticket_key.in_(mapped)))).all())
    changed = []
    now = datetime.now(UTC)
    for project in projects:
        old, status = project.status, mapped[project.appsec_ticket_key]
        if old == status:
            continue
        frozen = None if status == ProjectStatus.ACTIVE else now if old == ProjectStatus.ACTIVE else project.timeline_frozen_at
        result = await db.execute(update(Project).where(Project.id == project.id, Project.status == old,
            Project.appsec_ticket_key == project.appsec_ticket_key).values(status=status, timeline_frozen_at=frozen))
        if not result.rowcount:
            continue
        await AuditService(db).log("STATUS_CHANGE", entity_type="project", entity_id=project.id,
            details={"old_status": old.value, "new_status": status.value, "source": "appsec", "ticket": project.appsec_ticket_key}, commit=False)
        changed.append(project)
    if changed:
        await db.commit()
        for project in changed:
            event = {"event": "updated", "entity": "project", "project_id": str(project.id), "data": {"id": str(project.id)}}
            await ws_manager.broadcast(project.id, event)
            await ws_manager.broadcast_projects_index(event)
            await ProjectService(db)._notify_project_status_changed(project, None)
        logger.info("project_statuses_synced count=%s", len(changed))
    return len(changed)


async def project_status_sync_loop(session_factory) -> None:
    """Раз в минуту использует общий кэш APPSEC; без привязанных проектов внешних запросов нет."""
    from app.task_tracker import TaskTrackerService
    missing_cursor = 0
    while True:
        try:
            settings = get_settings()
            if settings.works_configured or (settings.works_tasks_demo_file and not settings.works_enabled):
                async with session_factory() as db:
                    keys = set((await db.scalars(select(Project.appsec_ticket_key).where(Project.appsec_ticket_key.is_not(None)))).all())
                    await db.rollback()  # Не держим транзакцию во время HTTP-запроса.
                    if keys:
                        tasks = await TaskTrackerService()._snapshot(False)
                        await sync_project_statuses(db, tasks)
                        await db.rollback()
                        # Связанный тикет может отсутствовать в поиске (другой тип,
                        # архив, фильтры TQL). Догружаем карточки с ограничением нагрузки.
                        missing = sorted(keys - {task["key"] for task in tasks})
                        if missing:
                            start = missing_cursor % len(missing)
                            batch = (missing[start:] + missing[:start])[:100]
                            missing_cursor = (start + len(batch)) % len(missing)
                            semaphore = asyncio.Semaphore(4)
                            async def read_status(key: str) -> dict | None:
                                async with semaphore:
                                    try:
                                        return await TaskTrackerService().get_task(key)
                                    except Exception as exc:
                                        logger.warning("project_status_card_failed ticket=%s error_type=%s", key, type(exc).__name__)
                                        return None
                            cards = await asyncio.gather(*(read_status(key) for key in batch))
                            await sync_project_statuses(db, [card for card in cards if card is not None])
        except asyncio.CancelledError:
            raise
        except Exception as exc:
            logger.warning("project_status_sync_failed error_type=%s", type(exc).__name__)
        await asyncio.sleep(60)
