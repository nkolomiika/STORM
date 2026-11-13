"""Внутреннее формирование ответа: байты хранилища/сканера подменены, сеть не вызывается."""
from email.message import Message
from types import SimpleNamespace
from unittest.mock import AsyncMock

import pytest

pytestmark = pytest.mark.asyncio


@pytest.mark.parametrize("filename,media_type,disposition", [
    ("evidence.txt", "text/plain", "attachment"),
    ("отчёт по проверке.pdf", "application/pdf", "attachment"),
    ('evidence "sample".txt', "text/plain", "attachment"),
    ("снимок.png", "image/png", "inline"),
])
async def test_evidence_filename_roundtrips_without_invalid_headers(api, monkeypatch, filename, media_type, disposition):
    from app.routers import files
    client, _ = api
    download = AsyncMock(return_value=(SimpleNamespace(original_name=filename, content_type=media_type), b"proof-bytes"))
    # Не создаём FileService: его конструктор обращается к бакету MinIO.
    monkeypatch.setattr(files, "FileService", lambda db: SimpleNamespace(download=download))
    response = await client.get("files/1/download")
    assert response.status_code == 200, response.text
    assert response.content == b"proof-bytes"
    header = response.headers["content-disposition"]
    header.encode("ascii")
    message = Message()
    message["Content-Disposition"] = header
    assert message.get_filename() == filename
    assert message.get_content_disposition() == disposition


async def test_js_archive_supports_unicode_host_filename(api, monkeypatch):
    from app.routers import assets
    client, ids = api
    filename = "js-тест.рф.zip"
    archive = AsyncMock(return_value=(filename, b"zip-bytes"))
    monkeypatch.setattr(assets, "JsFarmService", lambda db: SimpleNamespace(build_archive=archive))
    response = await client.get(f"projects/{ids['project']}/js-files/archive")
    assert response.status_code == 200, response.text
    assert response.content == b"zip-bytes"
    header = response.headers["content-disposition"]
    header.encode("ascii")
    message = Message()
    message["Content-Disposition"] = header
    assert message.get_filename() == filename


@pytest.mark.parametrize("kind", ["szi", "pp"])
async def test_word_report_for_unicode_project_has_ascii_transport_header(api, kind):
    from urllib.parse import unquote
    client, ids = api
    project_name = "Проверка приложения"
    changed = await client.put(f"projects/{ids['project']}", json={"name": project_name})
    assert changed.status_code == 200, changed.text
    response = await client.post(f"projects/{ids['project']}/reports/{kind}")
    assert response.status_code == 200, response.text
    assert response.content.startswith(b"PK")
    header = response.headers["content-disposition"]
    header.encode("ascii")
    assert unquote(header.split("filename*=UTF-8''", 1)[1]) == f"{project_name}_{kind}.docx"
