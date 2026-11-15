from fastapi import APIRouter, Depends
from app.dependencies import get_current_user
from app.models import User
from app.schemas import TaskTrackerTaskDetailOut, TaskTrackerTaskListOut
from app.task_tracker import TaskTrackerService

router = APIRouter(tags=['task-tracker'])


@router.get('/tasks', response_model=TaskTrackerTaskListOut)
async def list_tasks(query: str | None = None, category: str | None = None, _user: User = Depends(get_current_user)):
    return await TaskTrackerService().list_tasks(query=query, category=category)


@router.get('/tasks/{key}', response_model=TaskTrackerTaskDetailOut)
async def get_task(key: str, _user: User = Depends(get_current_user)):
    return await TaskTrackerService().get_task(key)
