"""Обсуждения эндпоинтов: область доступа, пакетное чтение авторов, запись в БД."""
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.exceptions import NotFoundError
from app.models import AuditLog, Endpoint, EndpointComment, Host, User
from app.schemas import EndpointCommentOut


class EndpointCommentService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def _ensure_endpoint(self, project_id: int, host_id: int, endpoint_id: int) -> None:
        """Проверяет всю цепочку project → host → endpoint без загрузки дерева."""
        found = await self.db.scalar(
            select(Endpoint.id).join(Host, Host.id == Endpoint.host_id)
            .where(Host.project_id == project_id, Host.id == host_id, Endpoint.id == endpoint_id)
        )
        if found is None:
            raise NotFoundError("Endpoint не найден")

    @staticmethod
    def _out(comment: EndpointComment, user: User) -> EndpointCommentOut:
        return EndpointCommentOut(
            id=comment.id, endpoint_id=comment.endpoint_id, user_id=comment.user_id,
            username=user.username, avatar_url=user.avatar_url, content=comment.content,
            created_at=comment.created_at, updated_at=comment.updated_at,
        )

    async def list(self, project_id: int, host_id: int, endpoint_id: int, page: int, size: int) -> tuple[list[EndpointCommentOut], int]:
        """Страница обсуждения, новые записи первыми; авторы читаются одним JOIN."""
        await self._ensure_endpoint(project_id, host_id, endpoint_id)
        total = await self.db.scalar(select(func.count()).select_from(EndpointComment).where(EndpointComment.endpoint_id == endpoint_id)) or 0
        rows = (await self.db.execute(
            select(EndpointComment, User).join(User, User.id == EndpointComment.user_id)
            .where(EndpointComment.endpoint_id == endpoint_id)
            .order_by(EndpointComment.created_at.desc(), EndpointComment.id.desc())
            .offset((page - 1) * size).limit(size)
        )).all()
        return [self._out(comment, user) for comment, user in rows], total

    async def create(self, project_id: int, host_id: int, endpoint_id: int, content: str, actor: User) -> EndpointCommentOut:
        """Сохраняет комментарий и его аудит одной транзакцией."""
        await self._ensure_endpoint(project_id, host_id, endpoint_id)
        comment = EndpointComment(endpoint_id=endpoint_id, user_id=actor.id, content=content)
        self.db.add(comment)
        await self.db.flush()
        self.db.add(AuditLog(
            action="CREATE", user_id=actor.id, entity_type="endpoint_comment", entity_id=comment.id,
            details={"project_id": str(project_id), "host_id": str(host_id), "endpoint_id": str(endpoint_id)},
        ))
        await self.db.commit()
        await self.db.refresh(comment)
        return self._out(comment, actor)
