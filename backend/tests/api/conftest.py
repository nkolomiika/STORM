"""HTTP + PostgreSQL: отдельная схема на тест, без startup и внешних систем."""
import os
from uuid import uuid4

import httpx
import pytest
import pytest_asyncio
from sqlalchemy import text
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

from app.database import Base, get_db
from app.config import get_settings
from app.enums import UserRole
from app.main import app, agent_api_v2
from app.models import Endpoint, Host, HostIpAddress, Port, Project, Service, User, Vulnerability, Comment
from app.security import create_access_token, hash_password
from app.storage.minio_client import MinioStorage
from app.auth_limits import auth_attempts


@pytest_asyncio.fixture
async def api(monkeypatch):
    auth_attempts.clear()
    url = os.getenv("STORM_TEST_DATABASE_URL")
    if not url:
        pytest.skip("Задайте STORM_TEST_DATABASE_URL для HTTP-тестов с PostgreSQL")
    monkeypatch.setattr(get_settings(), "mail_enabled", False)
    monkeypatch.setattr(get_settings(), "smtp_host", "mail.test")
    monkeypatch.setattr(get_settings(), "sso_enabled", False)
    def unexpected_storage(*args, **kwargs):
        raise AssertionError("External storage must be mocked explicitly in API tests")
    for method in ("ensure_bucket", "upload_bytes", "upload_bytes_with_key", "download_bytes", "download_with_content_type", "delete"):
        monkeypatch.setattr(MinioStorage, method, unexpected_storage)
    schema = "test_" + uuid4().hex
    engine = create_async_engine(url, connect_args={"server_settings": {"search_path": schema}})
    try:
        async with engine.begin() as conn:
            await conn.execute(text(f'CREATE SCHEMA "{schema}"'))
            await conn.run_sync(Base.metadata.create_all)
        sessions = async_sessionmaker(engine, expire_on_commit=False)
        async with sessions() as db:
            admin = User(username="tester", email="tester@example.com", role=UserRole.ADMIN,
                         password_hash=hash_password("test-password"))
            outsider = User(username="outsider", email="outsider@example.com", password_hash="unused")
            db.add_all([admin, outsider])
            await db.flush()
            project = Project(name="API test", created_by=admin.id)
            db.add(project)
            await db.flush()
            host = Host(project_id=project.id, hostname="old.example", ip_address="192.0.2.1")
            db.add(host)
            await db.flush()
            ip = HostIpAddress(host_id=host.id, ip_address="192.0.2.1", is_primary=True)
            db.add(ip)
            await db.flush()
            local_port = Port(host_id=host.id, ip_address_id=ip.id, port_number=8080)
            db.add(local_port)
            other = Project(name="Private project", created_by=admin.id)
            db.add(other)
            await db.flush()
            foreign_host = Host(project_id=other.id, hostname="private.example")
            db.add(foreign_host)
            await db.flush()
            foreign_ip = HostIpAddress(host_id=foreign_host.id, ip_address="192.0.2.9", is_primary=True)
            db.add(foreign_ip)
            await db.flush()
            foreign_port = Port(host_id=foreign_host.id, ip_address_id=foreign_ip.id, port_number=443)
            foreign_endpoint = Endpoint(host_id=foreign_host.id, path="/private", method="GET")
            foreign_vuln = Vulnerability(project_id=other.id, title="Private finding", created_by=admin.id)
            db.add_all([foreign_port, foreign_endpoint, foreign_vuln])
            await db.flush()
            foreign_service = Service(port_id=foreign_port.id, name="private")
            db.add(foreign_service)
            db.add(Comment(vulnerability_id=foreign_vuln.id, user_id=admin.id, content="private comment"))
            await db.commit()
            ids = dict(project=project.id, host=host.id, ip=ip.id, admin=admin.id, outsider=outsider.id)
            ids.update(foreign_host=foreign_host.id, foreign_port=foreign_port.id,
                       foreign_service=foreign_service.id, foreign_endpoint=foreign_endpoint.id,
                       foreign_vuln=foreign_vuln.id, port=local_port.id, foreign_project=other.id)

        async def override_db():
            # Отдельная сессия на HTTP-запрос: identity map не маскирует lazy load.
            async with sessions() as db:
                yield db

        for target in (app, agent_api_v2):
            target.dependency_overrides[get_db] = override_db
        async with httpx.AsyncClient(
            transport=httpx.ASGITransport(app=app, raise_app_exceptions=bool(os.getenv("STORM_TEST_RAISE"))),
            base_url="https://test.local/api/v1/",
            headers={"Origin": get_settings().csrf_origins[0]},
            cookies={"access_token": create_access_token(admin.id)},
        ) as client:
            yield client, ids
    finally:
        for target in (app, agent_api_v2):
            target.dependency_overrides.pop(get_db, None)
        async with engine.begin() as conn:
            await conn.execute(text(f'DROP SCHEMA IF EXISTS "{schema}" CASCADE'))
        await engine.dispose()
