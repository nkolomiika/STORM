
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.database import get_db
from app.dependencies import enforce_csrf, get_current_user, require_project_access
from app.models import User
from app.schemas import (
    WorksConfigOut,
    WorksExportRequest,
    WorksIssueLinkOut,
    WorksRefOut,
)
from app.services import WorksService

router = APIRouter(tags=["works"])
settings = get_settings()


@router.get("/works/config", response_model=WorksConfigOut)
async def get_works_config(_user: User = Depends(get_current_user)) -> WorksConfigOut:
    """Публичная конфигурация: доступен ли экспорт находок в Works (AppSec)."""
    return WorksConfigOut(enabled=settings.works_configured)


@router.get("/works/components", response_model=list[WorksRefOut])
async def find_works_components(
    q: str = "",
    _user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[WorksRefOut]:
    """Подсказки компонентов STS; отказ интеграции возвращает 502/503."""
    rows = await WorksService(db).find_components(q)
    return [WorksRefOut(**r) for r in rows]


@router.get("/works/versions", response_model=list[WorksRefOut])
async def find_works_versions(
    q: str = "",
    _user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[WorksRefOut]:
    """Подсказки версий STS; отказ интеграции возвращает 502/503."""
    rows = await WorksService(db).find_versions(q)
    return [WorksRefOut(**r) for r in rows]


@router.get('/works/product-codes', response_model=list[WorksRefOut])
async def find_works_product_codes(
    q: str = '',
    _user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[WorksRefOut]:
    """Коды продуктов из taxonomy формы STS с точными значениями code."""
    rows = await WorksService(db).find_product_codes(q)
    return [WorksRefOut(**row) for row in rows]


@router.get(
    "/projects/{project_id}/vulnerabilities/{vuln_id}/works",
    response_model=WorksIssueLinkOut | None,
)
async def get_vulnerability_works_link(
    project_id: int,
    vuln_id: int,
    _project=Depends(require_project_access),
    db: AsyncSession = Depends(get_db),
) -> WorksIssueLinkOut | None:
    return await WorksService(db).get_link(project_id, vuln_id)


@router.post(
    "/projects/{project_id}/vulnerabilities/{vuln_id}/works/export",
    response_model=WorksIssueLinkOut,
)
async def export_vulnerability_to_works(
    project_id: int,
    vuln_id: int,
    payload: WorksExportRequest,
    _: None = Depends(enforce_csrf),
    current_user: User = Depends(get_current_user),
    _project=Depends(require_project_access),
    db: AsyncSession = Depends(get_db),
) -> WorksIssueLinkOut:
    return await WorksService(db).export_vulnerability(project_id, vuln_id, current_user, None)
