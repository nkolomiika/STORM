"""Проверки существования и принадлежности общих сущностей без лишней загрузки."""
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models import Project, Vulnerability
from app.exceptions import NotFoundError


async def get_project(db: AsyncSession, project_id: int) -> Project:
    """Возвращает проект или NotFoundError; авторизацию выполняет dependency API."""
    project = await db.scalar(select(Project).where(Project.id == project_id))
    if project is None:
        raise NotFoundError('Проект не найден')
    return project


async def get_vulnerability(db: AsyncSession, project_id: int, vuln_id: int) -> Vulnerability:
    """Возвращает находку только указанного проекта или NotFoundError."""
    finding = await db.scalar(select(Vulnerability).where(Vulnerability.id == vuln_id, Vulnerability.project_id == project_id))
    if finding is None:
        raise NotFoundError('Уязвимость не найдена')
    return finding
