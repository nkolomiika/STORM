from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import enforce_csrf, get_current_user, require_project_access
from app.endpoint_comments import EndpointCommentService
from app.models import User
from app.pagination import PageParams, PaginatedResponse, to_paginated_response
from app.schemas import EndpointCommentCreate, EndpointCommentOut

router = APIRouter(prefix="/projects/{project_id}/hosts/{host_id}/endpoints/{endpoint_id}/comments", tags=["endpoint-comments"])


@router.get("", response_model=PaginatedResponse[EndpointCommentOut])
async def list_endpoint_comments(
    project_id: int, host_id: int, endpoint_id: int,
    page: int = Query(1, ge=1), size: int = Query(50, ge=1, le=200),
    _project=Depends(require_project_access), db: AsyncSession = Depends(get_db),
) -> PaginatedResponse[EndpointCommentOut]:
    """Сохранённые комментарии только указанного эндпоинта, новые первыми."""
    items, total = await EndpointCommentService(db).list(project_id, host_id, endpoint_id, page, size)
    return to_paginated_response(items, total, PageParams(page=page, size=size))


@router.post("", response_model=EndpointCommentOut, status_code=status.HTTP_201_CREATED)
async def create_endpoint_comment(
    project_id: int, host_id: int, endpoint_id: int, payload: EndpointCommentCreate,
    _: None = Depends(enforce_csrf), current_user: User = Depends(get_current_user),
    _project=Depends(require_project_access), db: AsyncSession = Depends(get_db),
) -> EndpointCommentOut:
    """Добавляет комментарий; запись и аудит сохраняются в одной транзакции."""
    return await EndpointCommentService(db).create(project_id, host_id, endpoint_id, payload.content, current_user)
