"""Поиск исполнителя среди локальных пользователей, включая учётные записи SSO."""
from types import SimpleNamespace
from unittest.mock import AsyncMock

import pytest

from app.schemas import UserSearchOut
from app.services import UserService


def _scalars_returning(items: list) -> AsyncMock:
    """db.scalars(...) → объект с .all() == items (как у SQLAlchemy Result)."""
    return AsyncMock(return_value=SimpleNamespace(all=lambda: items))


# --------------------------- схема ---------------------------

def test_user_search_out_from_attrs() -> None:
    u = SimpleNamespace(username="Иванов Иван", full_name="Иванов Иван Иванович", is_sso=False)
    out = UserSearchOut.model_validate(u)
    assert out.username == "Иванов Иван"
    assert out.full_name == "Иванов Иван Иванович"
    assert out.is_sso is False


# --------------------------- search_users ---------------------------

@pytest.mark.asyncio
async def test_search_users_returns_items() -> None:
    db = AsyncMock()
    people = [SimpleNamespace(username="n.kolomiets", full_name="Коломиец Никита", is_sso=True)]
    db.scalars = _scalars_returning(people)
    res = await UserService(db).search_users("кол", 10)
    assert res == people
    assert db.scalars.await_count == 1


@pytest.mark.asyncio
async def test_search_users_empty_query_ok() -> None:
    db = AsyncMock()
    db.scalars = _scalars_returning([])
    res = await UserService(db).search_users("", 10)
    assert res == []


@pytest.mark.asyncio
async def test_search_users_clamps_limit() -> None:
    db = AsyncMock()
    db.scalars = _scalars_returning([])
    # limit за пределами [1..25] не должен ронять запрос.
    assert await UserService(db).search_users("x", 9999) == []
    assert await UserService(db).search_users("x", 0) == []


# --------------------------- IAM-прокси (гейт) ---------------------------

@pytest.mark.asyncio
@pytest.mark.parametrize('enabled', [False, True])
async def test_search_stays_local_regardless_of_sso_configuration(monkeypatch, enabled) -> None:
    import app.services as services_mod
    monkeypatch.setattr(services_mod.settings, "sso_enabled", enabled, raising=False)
    db = AsyncMock()
    people = [SimpleNamespace(username='analyst', full_name='Аналитик', is_sso=True)]
    db.scalars = _scalars_returning(people)
    assert await UserService(db).search_users('аналитик', 10) == people
    db.scalars.assert_awaited_once()
