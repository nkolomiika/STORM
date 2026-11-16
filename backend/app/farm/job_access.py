"""Чтение задания фермы с обязательной проверкой проекта и вида проверки."""
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models import HostFarmJob
from app.exceptions import NotFoundError


async def get_recon_job(db: AsyncSession, project_id: int, job_id: int, kind: str,
                        message: str = 'Задача фермы не найдена') -> HostFarmJob:
    """Возвращает задание нужного вида/проекта или NotFoundError без раскрытия чужих данных."""
    job = await db.scalar(select(HostFarmJob).where(HostFarmJob.id == job_id,
                          HostFarmJob.project_id == project_id, HostFarmJob.kind == kind))
    if job is None:
        raise NotFoundError(message)
    return job
