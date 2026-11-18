from fastapi import APIRouter, Depends, Query
from typing import Literal
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.dependencies import get_current_user
from app.models import User
from app.schemas import TaskTrackerTaskDetailOut, TaskTrackerTaskListOut
from app.task_tracker import TaskTrackerService

router = APIRouter(tags=['task-tracker'])


@router.get('/tasks', response_model=TaskTrackerTaskListOut)
async def list_tasks(query: str | None = None, category: str | None = None, page_number: int = Query(0, ge=0, le=1_000_000), sort: Literal['first', 'last'] = 'last', refresh: bool = False, _user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    """Возвращает по 20 тикетов и доступные пользователю связи с проектами."""
    service = TaskTrackerService()
    result = await service.list_tasks(query=query, category=category, page=page_number, sort=sort, refresh=refresh)
    await service.attach_project_access(db, _user, result['items'])
    return result


@router.get('/tasks/{key}', response_model=TaskTrackerTaskDetailOut)
async def get_task(key: str, _user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    """Читает карточку; ID связанного проекта отдаёт только при наличии доступа."""
    service = TaskTrackerService()
    task = await service.get_task(key)
    await service.attach_project_access(db, _user, [task])
    return task
