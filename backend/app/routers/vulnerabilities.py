
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.enums import Severity, VulnerabilityStatus
from app.dependencies import enforce_csrf, get_current_user, require_project_access
from app.models import User
from app.pagination import PageParams, PaginatedResponse, to_paginated_response
from app.schemas import (
    FileOut,
    VulnerabilityAssetCreate,
    VulnerabilityAssetOut,
    VulnerabilityCreate,
    VulnerabilityListOut,
    VulnerabilityOut,
    VulnerabilityStatusPatch,
    VulnerabilityUpdate,
)
from app.services import VulnerabilityService

router = APIRouter(tags=["vulnerabilities"])


@router.get("/projects/{project_id}/vulnerabilities", response_model=PaginatedResponse[VulnerabilityListOut])
async def list_vulnerabilities(
    project_id: int,
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=200),
    severity: Severity | None = None,
    status_filter: VulnerabilityStatus | None = Query(None, alias="status"),
    _project=Depends(require_project_access),
    db: AsyncSession = Depends(get_db),
) -> PaginatedResponse[VulnerabilityListOut]:
    """Возвращает список уязвимостей проекта."""
    service = VulnerabilityService(db)
    items, total = await service.list(project_id, page, size, severity, status_filter)
    host_links = await service.host_links_for_page(items)
    result = [VulnerabilityListOut.model_validate(item).model_copy(update={"affected_host_id": host_links.get(item.id)}) for item in items]
    return to_paginated_response(result, total, PageParams(page=page, size=size))


@router.get("/projects/{project_id}/hosts/{host_id}/vulnerabilities", response_model=PaginatedResponse[VulnerabilityOut])
async def list_host_vulnerabilities(
    project_id: int,
    host_id: int,
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=200),
    severity: Severity | None = None,
    status_filter: VulnerabilityStatus | None = Query(None, alias="status"),
    _project=Depends(require_project_access),
    db: AsyncSession = Depends(get_db),
) -> PaginatedResponse[VulnerabilityOut]:
    """Возвращает список уязвимостей, привязанных к конкретному хосту."""
    items, total = await VulnerabilityService(db).list_for_host(project_id, host_id, page, size, severity, status_filter)
    return to_paginated_response([VulnerabilityOut.model_validate(it) for it in items], total, PageParams(page=page, size=size))


@router.post("/projects/{project_id}/vulnerabilities", response_model=VulnerabilityOut, status_code=status.HTTP_201_CREATED)
async def create_vulnerability(
    project_id: int,
    payload: VulnerabilityCreate,
    _: None = Depends(enforce_csrf),
    current_user: User = Depends(get_current_user),
    _project=Depends(require_project_access),
    db: AsyncSession = Depends(get_db),
) -> VulnerabilityOut:
    """Создаёт уязвимость."""
    vuln = await VulnerabilityService(db).create(project_id, payload.model_dump(), current_user.id)
    return VulnerabilityOut.model_validate(vuln)


@router.get("/projects/{project_id}/vulnerabilities/{vuln_id}")
async def get_vulnerability(
    project_id: int,
    vuln_id: int,
    _project=Depends(require_project_access),
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Возвращает подробную карточку уязвимости."""
    data = await VulnerabilityService(db).get(project_id, vuln_id)
    vuln = VulnerabilityOut.model_validate(data["vulnerability"]).model_dump()
    vuln["assets"] = [VulnerabilityAssetOut.model_validate(item).model_dump() for item in data["assets"]]
    vuln["files"] = [FileOut.model_validate(item).model_dump() for item in data["files"]]
    vuln["comments_count"] = data["comments_count"]
    return vuln


@router.put("/projects/{project_id}/vulnerabilities/{vuln_id}", response_model=VulnerabilityOut)
async def update_vulnerability(
    project_id: int,
    vuln_id: int,
    payload: VulnerabilityUpdate,
    _: None = Depends(enforce_csrf),
    current_user: User = Depends(get_current_user),
    _project=Depends(require_project_access),
    db: AsyncSession = Depends(get_db),
) -> VulnerabilityOut:
    """Обновляет уязвимость."""
    vuln = await VulnerabilityService(db).update(project_id, vuln_id, payload.model_dump(exclude_unset=True), current_user.id)
    return VulnerabilityOut.model_validate(vuln)


@router.patch("/projects/{project_id}/vulnerabilities/{vuln_id}/status", response_model=VulnerabilityOut)
async def patch_vulnerability_status(
    project_id: int,
    vuln_id: int,
    payload: VulnerabilityStatusPatch,
    _: None = Depends(enforce_csrf),
    current_user: User = Depends(get_current_user),
    _project=Depends(require_project_access),
    db: AsyncSession = Depends(get_db),
) -> VulnerabilityOut:
    """Меняет статус уязвимости отдельным эндпоинтом."""
    vuln = await VulnerabilityService(db).patch_status(project_id, vuln_id, payload.status, current_user.id)
    return VulnerabilityOut.model_validate(vuln)


@router.delete("/projects/{project_id}/vulnerabilities/{vuln_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_vulnerability(
    project_id: int,
    vuln_id: int,
    _: None = Depends(enforce_csrf),
    current_user: User = Depends(get_current_user),
    _project=Depends(require_project_access),
    db: AsyncSession = Depends(get_db),
) -> None:
    """Удаляет уязвимость."""
    await VulnerabilityService(db).delete(project_id, vuln_id, current_user.id)


@router.get("/projects/{project_id}/vulnerabilities/{vuln_id}/assets", response_model=list[VulnerabilityAssetOut])
async def list_vulnerability_assets(
    project_id: int,
    vuln_id: int,
    _project=Depends(require_project_access),
    db: AsyncSession = Depends(get_db),
) -> list[VulnerabilityAssetOut]:
    """Возвращает привязанные активы уязвимости."""
    items = await VulnerabilityService(db).list_assets(project_id, vuln_id)
    return [VulnerabilityAssetOut.model_validate(item) for item in items]


@router.post(
    "/projects/{project_id}/vulnerabilities/{vuln_id}/assets",
    response_model=VulnerabilityAssetOut,
    status_code=status.HTTP_201_CREATED,
)
async def add_vulnerability_asset(
    project_id: int,
    vuln_id: int,
    payload: VulnerabilityAssetCreate,
    _: None = Depends(enforce_csrf),
    current_user: User = Depends(get_current_user),
    _project=Depends(require_project_access),
    db: AsyncSession = Depends(get_db),
) -> VulnerabilityAssetOut:
    """Привязывает актив к уязвимости."""
    item = await VulnerabilityService(db).add_asset(project_id, vuln_id, payload.asset_type, payload.asset_id, current_user.id)
    return VulnerabilityAssetOut.model_validate(item)


@router.delete("/projects/{project_id}/vulnerabilities/{vuln_id}/assets/{asset_link_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_vulnerability_asset(
    project_id: int,
    vuln_id: int,
    asset_link_id: int,
    _: None = Depends(enforce_csrf),
    current_user: User = Depends(get_current_user),
    _project=Depends(require_project_access),
    db: AsyncSession = Depends(get_db),
) -> None:
    """Удаляет связь уязвимости с активом."""
    await VulnerabilityService(db).delete_asset(project_id, vuln_id, asset_link_id, current_user.id)
