
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from sqlalchemy import and_, select

from app.database import SessionLocal
from app.enums import UserRole
from app.exceptions import UnauthorizedError
from app.models import ProjectMember, User
from app.security import decode_token
from app.ws_manager import ws_manager
from app.config import get_settings
from app.input_safety import MAX_RESOURCE_ID

router = APIRouter(tags=["websocket"])


async def _wait_for_disconnect(websocket: WebSocket) -> None:
    """Accept text/binary keepalives; a binary frame must not leak a connection."""
    try:
        while True:
            message = await websocket.receive()
            if message["type"] == "websocket.disconnect":
                return
    except WebSocketDisconnect:
        return


async def _authenticate_websocket_user(websocket: WebSocket) -> User | None:
    origin = getattr(websocket, "headers", {}).get("origin")
    if origin is not None and origin not in get_settings().csrf_origins:
        await websocket.close(code=4403)
        return None
    access_token = websocket.cookies.get("access_token")
    if not access_token:
        await websocket.close(code=4401)
        return None
    try:
        # Та же проверка типа/подписи и int(sub), что у HTTP-авторизации.
        # Строковый sub иначе связывается с SQL как VARCHAR, а users.id — INTEGER.
        user_id = decode_token(access_token, expected_type="access")
    except UnauthorizedError:
        await websocket.close(code=4401)
        return None

    async with SessionLocal() as db:
        user = await db.scalar(select(User).where(User.id == user_id))
        if not user or not user.is_active or user.is_locked:
            await websocket.close(code=4403)
            return None
    setattr(websocket.state, "user_id", user.id)
    return user


@router.websocket("/ws/projects-index")
async def projects_index_ws(websocket: WebSocket) -> None:
    """Общий WebSocket-канал списка проектов для real-time обновлений."""
    user = await _authenticate_websocket_user(websocket)
    if not user:
        return

    await ws_manager.connect_projects_index(websocket)
    try:
        await _wait_for_disconnect(websocket)
    finally:
        ws_manager.disconnect_projects_index(websocket)


@router.websocket("/ws/notifications")
async def notifications_ws(websocket: WebSocket) -> None:
    """Персональный WebSocket-канал уведомлений текущего пользователя."""
    user = await _authenticate_websocket_user(websocket)
    if not user:
        return

    await ws_manager.connect_user(user.id, websocket)
    try:
        await _wait_for_disconnect(websocket)
    finally:
        ws_manager.disconnect_user(user.id, websocket)


@router.websocket("/ws/projects/{project_id}")
async def project_ws(websocket: WebSocket, project_id: int) -> None:
    """WebSocket-канал проекта с авторизацией по access cookie."""
    if not 1 <= project_id <= MAX_RESOURCE_ID:
        await websocket.close(code=4404)
        return
    user = await _authenticate_websocket_user(websocket)
    if not user:
        return

    async with SessionLocal() as db:
        if user.role != UserRole.ADMIN:
            membership = await db.scalar(
                select(ProjectMember).where(and_(ProjectMember.project_id == project_id, ProjectMember.user_id == user.id))
            )
            if not membership:
                await websocket.close(code=4403)
                return

    await ws_manager.connect(project_id, websocket)
    try:
        await _wait_for_disconnect(websocket)
    finally:
        ws_manager.disconnect(project_id, websocket)
