"""Тесты invite-flow: приглашение по email + активация (пользователь сам задаёт
username и пароль). До активации записи в users нет, поэтому вход невозможен."""
from types import SimpleNamespace

import pytest
from pydantic import ValidationError as PydanticValidationError
from unittest.mock import AsyncMock, MagicMock

from app.enums import ProjectRole, UserRole
from app.exceptions import ConflictError, UnauthorizedError
from app.schemas import InvitationAcceptRequest, InvitationCreate
from app.services import UserService


# --------------------------- схемы ---------------------------

def test_invitation_create_defaults_roles() -> None:
    payload = InvitationCreate(email="new@example.com")
    assert payload.role == UserRole.PENTESTER
    assert payload.project_role == ProjectRole.PENTESTER


def test_invitation_accept_rejects_short_password() -> None:
    with pytest.raises(PydanticValidationError):
        InvitationAcceptRequest(username="good.name", password="short")


# username теперь может быть ФИО (кириллица + пробелы), поэтому «has space» и
# «нет-латиницы» валидны; отвергаем только спецсимволы и слишком короткие.
@pytest.mark.parametrize("bad", ["ab", "bad!char", "x@y", "a/b", "c,d"])
def test_invitation_accept_rejects_bad_username(bad: str) -> None:
    with pytest.raises(PydanticValidationError):
        InvitationAcceptRequest(username=bad, password="longenough1")


def test_invitation_accept_ok() -> None:
    payload = InvitationAcceptRequest(username="i.volkov", password="longenough1")
    assert payload.username == "i.volkov"


@pytest.mark.parametrize("fio", ["Коломиец Никита Сергеевич", "Иванов Иван", "Петров П.С."])
def test_invitation_accept_allows_fio_username(fio: str) -> None:
    payload = InvitationAcceptRequest(username=fio, password="longenough1")
    assert payload.username == fio


# --------------------------- get_invitation_info ---------------------------

@pytest.mark.asyncio
async def test_info_not_found_when_missing() -> None:
    db = AsyncMock()
    db.add = MagicMock()  # AsyncSession.add is synchronous.
    db.scalar = AsyncMock(return_value=None)
    info = await UserService(db).get_invitation_info("tok")
    assert info == {"valid": False, "reason": "not_found"}


@pytest.mark.asyncio
async def test_info_used_for_accepted() -> None:
    db = AsyncMock()
    db.add = MagicMock()  # AsyncSession.add is synchronous.
    db.scalar = AsyncMock(return_value=SimpleNamespace(status="accepted", is_expired=False, email="a@b.c", full_name=None))
    info = await UserService(db).get_invitation_info("tok")
    assert info == {"valid": False, "reason": "used"}


@pytest.mark.asyncio
async def test_info_expired() -> None:
    db = AsyncMock()
    db.add = MagicMock()  # AsyncSession.add is synchronous.
    db.scalar = AsyncMock(return_value=SimpleNamespace(status="pending", is_expired=True, email="a@b.c", full_name=None))
    info = await UserService(db).get_invitation_info("tok")
    assert info == {"valid": False, "reason": "expired"}


@pytest.mark.asyncio
async def test_info_revoked_looks_like_not_found() -> None:
    db = AsyncMock()
    db.add = MagicMock()  # AsyncSession.add is synchronous.
    db.scalar = AsyncMock(return_value=SimpleNamespace(status="revoked", is_expired=False, email="a@b.c", full_name=None))
    info = await UserService(db).get_invitation_info("tok")
    assert info == {"valid": False, "reason": "not_found"}


@pytest.mark.asyncio
async def test_info_valid() -> None:
    db = AsyncMock()
    db.add = MagicMock()  # AsyncSession.add is synchronous.
    db.scalar = AsyncMock(return_value=SimpleNamespace(status="pending", is_expired=False, email="a@b.c", full_name="Alice"))
    info = await UserService(db).get_invitation_info("tok")
    assert info == {"valid": True, "email": "a@b.c", "full_name": "Alice"}


# --------------------------- username availability ---------------------------

@pytest.mark.asyncio
async def test_username_available_true_when_free() -> None:
    db = AsyncMock()
    db.add = MagicMock()  # AsyncSession.add is synchronous.
    inv = SimpleNamespace(status="pending", is_expired=False)
    db.scalar = AsyncMock(side_effect=[inv, None])  # 1) load invite, 2) no user with that username
    assert await UserService(db).check_invitation_username_available("tok", "free.name") is True


@pytest.mark.asyncio
async def test_username_available_false_when_taken() -> None:
    db = AsyncMock()
    db.add = MagicMock()  # AsyncSession.add is synchronous.
    inv = SimpleNamespace(status="pending", is_expired=False)
    db.scalar = AsyncMock(side_effect=[inv, SimpleNamespace(id=1)])
    assert await UserService(db).check_invitation_username_available("tok", "admin") is False


@pytest.mark.asyncio
async def test_username_check_rejects_invalid_token() -> None:
    db = AsyncMock()
    db.add = MagicMock()  # AsyncSession.add is synchronous.
    db.scalar = AsyncMock(return_value=None)
    with pytest.raises(UnauthorizedError):
        await UserService(db).check_invitation_username_available("tok", "any.name")


# --------------------------- accept ---------------------------

@pytest.mark.asyncio
async def test_accept_rejects_invalid_token() -> None:
    db = AsyncMock()
    db.add = MagicMock()  # AsyncSession.add is synchronous.
    db.scalar = AsyncMock(return_value=None)
    with pytest.raises(UnauthorizedError):
        await UserService(db).accept_invitation("tok", "some.user", "longenough1")


@pytest.mark.asyncio
async def test_accept_rejects_expired() -> None:
    db = AsyncMock()
    db.add = MagicMock()  # AsyncSession.add is synchronous.
    db.scalar = AsyncMock(return_value=SimpleNamespace(status="pending", is_expired=True))
    with pytest.raises(UnauthorizedError):
        await UserService(db).accept_invitation("tok", "some.user", "longenough1")


@pytest.mark.asyncio
async def test_accept_creates_user_from_invitation() -> None:
    db = AsyncMock()
    db.add = MagicMock()  # AsyncSession.add is synchronous.
    inv = SimpleNamespace(
        id=1, status="pending", is_expired=False, email="invitee@example.com",
        full_name="Invited One", role=UserRole.ADMIN, project_role=ProjectRole.LEAD,
        accepted_at=None, accepted_user_id=None,
    )
    # 1) load invitation, 2) _ensure_unique_identity → no conflict
    db.scalar = AsyncMock(side_effect=[inv, None])
    svc = UserService(db)
    svc.audit.log = AsyncMock()  # изолируем аудит от мок-сессии

    user = await svc.accept_invitation("tok", "i.volkov", "longenough1")

    assert user.username == "i.volkov"
    assert user.email == "invitee@example.com"       # email берётся из приглашения
    assert user.role == UserRole.ADMIN               # роль наследуется из приглашения
    assert user.project_role == ProjectRole.LEAD
    assert user.is_active is True
    assert inv.status == "accepted"                  # приглашение закрыто (single-use)


@pytest.mark.asyncio
async def test_accept_sets_full_name_to_username_when_invite_has_none() -> None:
    """Локальный пользователь без ФИО в приглашении: full_name = заданный username (ФИО)."""
    db = AsyncMock()
    db.add = MagicMock()  # AsyncSession.add is synchronous.
    inv = SimpleNamespace(
        id=1, status="pending", is_expired=False, email="invitee@example.com",
        full_name=None, role=UserRole.PENTESTER, project_role=ProjectRole.PENTESTER,
        accepted_at=None, accepted_user_id=None,
    )
    db.scalar = AsyncMock(side_effect=[inv, None])
    svc = UserService(db)
    svc.audit.log = AsyncMock()

    user = await svc.accept_invitation("tok", "Коломиец Никита Сергеевич", "longenough1")

    assert user.username == "Коломиец Никита Сергеевич"
    assert user.full_name == "Коломиец Никита Сергеевич"  # ФИО = username


@pytest.mark.asyncio
async def test_accept_keeps_invite_full_name_when_present() -> None:
    """Если админ указал ФИО в приглашении — оно не перетирается username'ом."""
    db = AsyncMock()
    db.add = MagicMock()  # AsyncSession.add is synchronous.
    inv = SimpleNamespace(
        id=1, status="pending", is_expired=False, email="invitee@example.com",
        full_name="Админ Указал ФИО", role=UserRole.PENTESTER, project_role=ProjectRole.PENTESTER,
        accepted_at=None, accepted_user_id=None,
    )
    db.scalar = AsyncMock(side_effect=[inv, None])
    svc = UserService(db)
    svc.audit.log = AsyncMock()

    user = await svc.accept_invitation("tok", "n.kolomiets", "longenough1")

    assert user.full_name == "Админ Указал ФИО"


# --------------------------- create ---------------------------

@pytest.mark.asyncio
async def test_create_invitation_conflicts_with_existing_user() -> None:
    db = AsyncMock()
    db.add = MagicMock()  # AsyncSession.add is synchronous.
    db.scalar = AsyncMock(return_value=SimpleNamespace(id=1))  # пользователь с таким email уже есть
    with pytest.raises(ConflictError):
        await UserService(db).create_invitation({"email": "taken@example.com"}, actor_id=1)


@pytest.mark.asyncio
async def test_create_invitation_conflicts_with_active_invite() -> None:
    db = AsyncMock()
    db.add = MagicMock()  # AsyncSession.add is synchronous.
    db.scalar = AsyncMock(side_effect=[None, SimpleNamespace(id=9)])  # нет юзера, но есть активный invite
    with pytest.raises(ConflictError):
        await UserService(db).create_invitation({"email": "pending@example.com"}, actor_id=1)


@pytest.mark.asyncio
async def test_create_invitation_happy_path() -> None:
    db = AsyncMock()
    db.add = MagicMock()  # AsyncSession.add is synchronous.
    db.scalar = AsyncMock(side_effect=[None, None])  # нет ни юзера, ни активного invite
    svc = UserService(db)
    svc.audit.log = AsyncMock()
    svc._publish_mail_job = AsyncMock()  # не дёргаем RabbitMQ

    invitation, mail_job = await svc.create_invitation(
        {"email": "fresh@example.com", "role": UserRole.PENTESTER, "project_role": ProjectRole.PENTESTER},
        actor_id=1,
    )

    assert invitation.email == "fresh@example.com"
    assert invitation.status == "pending"
    assert invitation.token_hash  # хэш токена проставлен
    assert mail_job.template == "invitation"
    svc._publish_mail_job.assert_awaited_once()
