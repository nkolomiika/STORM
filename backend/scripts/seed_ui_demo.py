"""Add a repeatable UI playground without resetting existing projects or users.

Run in the local backend container: python -m scripts.seed_ui_demo
Only local PostgreSQL and MinIO are used; no mail or scanning jobs are queued.
"""
import asyncio
import hashlib
import json
import secrets
from datetime import UTC, date, datetime, timedelta
from io import BytesIO
from pathlib import Path
from uuid import NAMESPACE_URL, uuid4, uuid5

from PIL import Image, ImageDraw
from sqlalchemy import func, select

from app import models as m
from app.database import Base, SessionLocal, engine
from app.config import get_settings
from app.tracker_metadata import affected_versions, assignee_identity
from app.enums import AssetType, CvssVersion, HostStatus, HttpMethod, NotificationType, OsType, PortState, ProjectStatus, Protocol, Severity, UserRole, VulnerabilityStatus
from app.security import encrypt_secret, hash_password
from app.services import VulnerabilityService
from app.storage.minio_client import MinioStorage

NAME = "[DEMO] Полный интерфейс"


def screenshot() -> bytes:
    """A real readable PNG for previews, resizing, dragging and Word reports."""
    image = Image.new("RGB", (960, 440), "#eef3fb")
    draw = ImageDraw.Draw(image)
    draw.rounded_rectangle((22, 22, 938, 418), radius=18, fill="white", outline="#cad7eb", width=2)
    draw.text((50, 52), "STORM / DEMO ASSESSMENT", fill="#2e5fbf", font_size=28)
    draw.text((50, 116), "GET /api/orders/42    HTTP/1.1", fill="#15233a", font_size=24)
    draw.text((50, 170), '200 OK  {"owner": "demo.user", "order_id": 42}', fill="#15233a", font_size=20)
    draw.text((50, 252), "Synthetic evidence: no real systems or secrets.", fill="#566783", font_size=21)
    draw.text((50, 310), "Use this image to test preview, resize and drag-and-drop.", fill="#566783", font_size=18)
    output = BytesIO()
    image.save(output, format="PNG")
    return output.getvalue()


async def table_counts(db) -> dict[str, int]:
    return {table.name: await db.scalar(select(func.count()).select_from(table)) for table in Base.metadata.sorted_tables}


async def seed(db, storage) -> dict:
    """Add the demo atomically; callers commit, and a second run creates no copies."""
    await db.execute(select(func.pg_advisory_xact_lock(681422029)))
    existing = await db.scalar(select(m.Project).where(m.Project.name == NAME))
    if existing:
        return {"created": False, "project_id": existing.id, "tables": await table_counts(db)}
    owner = await db.scalar(select(m.User).where(m.User.role == UserRole.ADMIN, m.User.is_active.is_(True), m.User.is_locked.is_(False)).order_by(m.User.id))
    if owner is None:
        raise RuntimeError("Start the local application first to create its administrator")
    team = list((await db.scalars(select(m.User).where(m.User.is_active.is_(True), m.User.is_locked.is_(False), m.User.id != owner.id).order_by(m.User.id).limit(3))).all())
    reviewer = team[0] if team else owner
    now = datetime.now(UTC)
    folder = m.ProjectFolder(name="[DEMO] UI", path="[DEMO] UI", created_by=owner.id)
    db.add(folder)
    await db.flush()
    project = m.Project(name=NAME, folder=folder.path, status=ProjectStatus.ACTIVE, start_date=date.today()-timedelta(days=12), end_date=date.today()+timedelta(days=2), created_by=owner.id)
    db.add(project)
    await db.flush()
    for user in [owner, *team]:
        db.add(m.ProjectMember(project_id=project.id, user_id=user.id))
    for index, status in enumerate(list(ProjectStatus)[1:], 1):
        other = m.Project(name=f"[DEMO] {status.value}", folder=folder.path, status=status, start_date=date.today()-timedelta(days=30+index), end_date=date.today()+timedelta(days=5+index), created_by=owner.id)
        db.add(other)
        await db.flush()
        db.add(m.ProjectMember(project_id=other.id, user_id=owner.id))
    hosts = []
    endpoints = []
    for i, (name, status) in enumerate([("demo.example", HostStatus.UP), ("api.demo.example", HostStatus.UP), ("admin.demo.example", HostStatus.DOWN), ("unknown.demo.example", HostStatus.UNKNOWN)], 1):
        added = now-timedelta(days=5-i)
        host = m.Host(project_id=project.id, hostname=name, ip_address=f"192.0.2.{100+i}", status=status, os_type=OsType.LINUX if i%2 else OsType.WINDOWS, notes="Демо-хост для проверки таблицы, фильтров и редактирования.", created_at=added, updated_at=added)
        db.add(host)
        await db.flush()
        hosts.append(host)
        ip = m.HostIpAddress(host_id=host.id, ip_address=host.ip_address, is_primary=True, label="external", hostnames=[{"hostname": name, "source":"project", "confirmed":True}, {"hostname":f"ptr-{i}.demo.example", "source":"ptr", "confirmed":False}])
        db.add(ip)
        db.add(m.HostIpAddress(host_id=host.id, ip_address=f"2001:db8::{i}", is_primary=False, label="IPv6", hostnames=[]))
        await db.flush()
        for number, state in [(443, PortState.OPEN), (8080, PortState.FILTERED), (22, PortState.CLOSED)]:
            port = m.Port(host_id=host.id, ip_address_id=ip.id, port_number=number, protocol=Protocol.TCP, state=state, http_status=200 if number==443 and status==HostStatus.UP else None)
            db.add(port)
            await db.flush()
            db.add(m.Service(port_id=port.id, name="nginx" if number==443 else "ssh", version="1.26.2" if number==443 else "9.6"))
        for j, method in enumerate(list(HttpMethod)[:6]):
            endpoint = m.Endpoint(host_id=host.id, path=["/api/orders", "/api/orders", "/api/orders/42", "/api/orders/42", "/api/orders/42", "/health"][j], method=method, description="Демонстрационный HTTP-запрос", query_params=[{"name":"page", "value":"1"}] if j==0 else [], request_headers=[{"name":"Accept", "value":"application/json"}, {"name":"X-Demo", "value":"true"}], request_body='{"name":"Demo order"}' if j in (1,2,3) else None, request_content_type="application/json" if j in (1,2,3) else None)
            db.add(endpoint)
            await db.flush()
            endpoints.append(endpoint)
            db.add(m.EndpointComment(endpoint_id=endpoint.id, user_id=owner.id, content="Проверка обсуждения эндпоинта: комментарий сохраняется и виден после обновления страницы."))
            db.add(m.EndpointComment(endpoint_id=endpoint.id, user_id=reviewer.id, content=f"@{owner.username} проверил метод {method.value}; можно проверить Post comment и копирование запроса."))
    db.add(m.ProjectHiddenIp(project_id=project.id, ip_address="192.0.2.254", created_by=owner.id))
    await db.flush()
    png = screenshot()
    image_name = f"{uuid4()}.png"
    image_key = f"images/{project.id}/{image_name}"
    storage.ensure_bucket()
    storage.upload_bytes_with_key(image_key, png, "image/png")
    image_url = f"/api/v1/projects/{project.id}/images/{image_name}/download"
    root_note = m.ProjectNote(project_id=project.id, title="Проверка интерфейса: начните здесь", content=f"# Демо-проект\n\nВсе данные синтетические.\n\n## Что проверить\n\n- Таблицы хостов, IP, JS и эндпоинтов\n- Редактирование и удаление\n- Комментарии и уведомления\n- Светлую/тёмную тему и RU/EN\n\n## Изображение\n\nТекст до картинки. ![Демонстрационный скриншот]({image_url} \"{{width=480}}\") Текст справа от картинки.\n\nНажмите на изображение, измените размер или перетащите его в другое место.\n", created_by=owner.id, updated_by=owner.id, sort_order=0)
    db.add(root_note)
    await db.flush()
    db.add(m.ProjectNote(project_id=project.id, parent_id=root_note.id, title="Чеклист проверки", content="## Чеклист\n\n- [ ] Отредактировать эндпоинт\n- [ ] Оставить комментарий\n- [ ] Изменить размер картинки\n- [ ] Скачать отчёт\n", created_by=owner.id, sort_order=0))
    db.add(m.ProjectNote(project_id=project.id, title="Заметка другого автора — read only", content="Эта заметка позволяет проверить режим чтения и отображение автора.", created_by=reviewer.id, sort_order=1))
    note_comment = m.ProjectNoteComment(project_id=project.id, note_id=root_note.id, user_id=reviewer.id, content=f"@{owner.username} в этой заметке есть картинка для проверки редактора.")
    db.add(note_comment)
    await db.flush()
    db.add(m.Notification(user_id=owner.id, type=NotificationType.MENTION, note_comment_id=note_comment.id, actor_id=reviewer.id, is_read=False))
    for i, (username, host) in enumerate([("demo.admin", hosts[0].hostname), ("readonly", hosts[1].hostname), (None, None)]):
        db.add(m.ProjectCredential(project_id=project.id, username=username, host=host, password_encrypted=encrypt_secret(f"Demo-Only-Password-{i}!"), created_by=owner.id if i%2==0 else reviewer.id))
    vectors = [
        "CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:L/SI:L/SA:L",
        "CVSS:4.0/AV:N/AC:L/AT:N/PR:L/UI:N/VC:H/VI:H/VA:N/SC:N/SI:N/SA:N",
        "CVSS:4.0/AV:N/AC:L/AT:N/PR:L/UI:P/VC:L/VI:L/VA:L/SC:N/SI:N/SA:N",
        "CVSS:4.0/AV:L/AC:H/AT:N/PR:L/UI:P/VC:L/VI:N/VA:N/SC:N/SI:N/SA:N",
        "CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:N/VI:N/VA:N/SC:N/SI:N/SA:N",
        None,
    ]
    titles = ["SQL injection в поиске заказов", "IDOR: доступ к чужому заказу", "Stored XSS в комментарии", "Избыточная информация в ответе", "Проверка security headers", "Проверка без подтверждённой эксплуатации", "Обход ограничения запросов", "Небезопасная настройка cookie", "Открытый диагностический endpoint"]
    first_finding = None
    for i, status in enumerate(VulnerabilityStatus):
        vector = vectors[i%len(vectors)]
        vector, score = VulnerabilityService._calculate_cvss_score("4.0", vector)
        severity = VulnerabilityService._severity_from_cvss_score(score) if score is not None else Severity.UNREALIZED
        finding = m.Vulnerability(project_id=project.id, title=titles[i], severity=severity, cvss_version=CvssVersion.V40 if vector else None, cvss_score=score, cvss_vector=vector, cwe_id="CWE-89" if i==0 else "CWE-200", status=status, description=f"## Описание\n\nДемонстрационная находка для проверки статуса **{status.value}**.\n\nПроверка Unicode: русский / English / ✓.", impact="Синтетический пример влияния на конфиденциальность и целостность.", recommendations="Проверять права доступа и валидировать входные данные.", steps_to_reproduce="1. Открыть демонстрационный endpoint.\n2. Проверить ответ сервера.", created_by=owner.id if i%2==0 else reviewer.id, created_at=now-timedelta(days=9-i), updated_at=now-timedelta(hours=i))
        db.add(finding)
        await db.flush()
        first_finding = first_finding or finding
        db.add(m.VulnerabilityAsset(vulnerability_id=finding.id, asset_type=AssetType.HOST, asset_id=hosts[i%len(hosts)].id))
        db.add(m.VulnerabilityAsset(vulnerability_id=finding.id, asset_type=AssetType.ENDPOINT, asset_id=endpoints[i%len(endpoints)].id))
        key = f"ui-demo/{project.id}/evidence-{finding.id}.png"
        storage.upload_bytes_with_key(key, png, "image/png")
        evidence = m.File(vulnerability_id=finding.id, original_name="Доказательство — demo.png", content_type="image/png", size_bytes=len(png), minio_bucket=storage.bucket, minio_key=key, uploaded_by=owner.id)
        db.add(evidence)
        await db.flush()
        finding.workflow_steps = [{"id":"step-1", "description":"Открыть запрос и проверить ответ.", "image_file_ids":[evidence.id]}, {"id":"step-2", "description":"Зафиксировать результат проверки.", "image_file_ids":[]}]
        comment = m.Comment(vulnerability_id=finding.id, user_id=reviewer.id, content=f"@{owner.username} проверь шаги воспроизведения и приложенный скриншот.")
        db.add(comment)
        await db.flush()
        db.add(m.CommentMention(comment_id=comment.id, user_id=owner.id))
        db.add(m.Notification(user_id=owner.id, type=NotificationType.MENTION, comment_id=comment.id, actor_id=reviewer.id, is_read=i%3==0))
        db.add(m.AuditLog(user_id=finding.created_by, action="CREATE", entity_type="vulnerability", entity_id=finding.id, details={"project_id":str(project.id), "title":finding.title}, created_at=now-timedelta(hours=i)))
    log_bytes = b"STORM UI DEMO\nGET /api/orders/42\nHTTP/1.1 200 OK\nSynthetic test evidence only.\n"
    log_key = f"ui-demo/{project.id}/request.txt"
    storage.upload_bytes_with_key(log_key, log_bytes, "text/plain")
    db.add(m.File(vulnerability_id=first_finding.id, original_name="HTTP-запрос.txt", content_type="text/plain", size_bytes=len(log_bytes), minio_bucket=storage.bucket, minio_key=log_key, uploaded_by=owner.id))
    for i, status in enumerate(["ok", "ok", "failed", "too_large"]):
        paths = ["/api/orders", "/api/users", "/internal/metrics"] if i==0 else []
        file = m.JsFile(project_id=project.id, host_id=hosts[i%len(hosts)].id, url=f"https://{hosts[i%len(hosts)].hostname}/static/demo-{i}.js", sha256=hashlib.sha256(f"demo-{i}".encode()).hexdigest() if status=="ok" else None, size_bytes=184320 if status=="ok" else None, content_type="application/javascript", status=status, error="Demo: request timed out" if status=="failed" else "Demo: file exceeds size limit" if status=="too_large" else None, secret_count=2 if i==0 else 0, endpoint_count=len(paths), endpoints=paths, fetched_at=now)
        db.add(file)
        await db.flush()
        if i==0:
            for kind, severity in [("api_key", "high"), ("jwt", "medium")]:
                db.add(m.JsSecret(js_file_id=file.id, kind=kind, match_preview="DEMO_••••••_ONLY", snippet='const example = "DEMO_••••••_ONLY";', severity=severity))
    for kind in ["hosts", "ips", "js"]:
        db.add(m.HostFarmJob(project_id=project.id, created_by=owner.id, kind=kind, status="done", raw="api.demo.example", targets_total=1, result={"hosts_created":4, "ips_created":4, "files_scanned":4, "secrets_found":2, "endpoints_found":3}, attempts=1, published_at=now, finished_at=now, skipped_targets=[]))
    db.add(m.HostFarmJob(project_id=project.id, created_by=owner.id, kind="js", status="failed", raw="unknown.demo.example", targets_total=1, error="Демонстрационный timeout; реальное сканирование не запускалось.", last_error="Demo timeout", attempts=1, published_at=now, finished_at=now))
    db.add(m.Notification(user_id=owner.id, type=NotificationType.PROJECT_MEMBER_ADDED, project_id=project.id, actor_id=reviewer.id))
    db.add(m.Notification(user_id=owner.id, type=NotificationType.PROJECT_STATUS_CHANGED, project_id=project.id, actor_id=reviewer.id, status=ProjectStatus.ACTIVE.value))
    db.add(m.Notification(user_id=owner.id, type=NotificationType.VULN_STATUS_CHANGED, vulnerability_id=first_finding.id, actor_id=reviewer.id, status=VulnerabilityStatus.IN_PROGRESS.value))
    db.add(m.AuditLog(user_id=owner.id, action="CREATE", entity_type="project", entity_id=project.id, details={"project_id":str(project.id), "project":NAME}))
    db.add(m.AuditLog(user_id=owner.id, action="START", entity_type="js_farm", entity_id=project.id, details={"project_id":str(project.id), "targets":[host.hostname for host in hosts], "targets_total":len(hosts)}))
    await db.flush()
    return {"created":True, "project_id":project.id, "project_name":NAME, "tables":await table_counts(db)}


async def seed_task_units(db, project_id: int, *, target: Path | None = None) -> dict:
    """Native-format local tickets for list/card/create flows; no external writes."""
    users = list((await db.scalars(select(m.User).where(m.User.is_active.is_(True), m.User.is_locked.is_(False)).order_by(m.User.id).limit(3))).all())
    now = datetime.now(UTC)
    versions = [{'code': str(uuid5(NAMESPACE_URL, f'storm-ui-demo-version-{index}')), 'name': name} for index, name in enumerate(['Platform V Stack 1.0.2', 'Platform V Stack 1.0.2-beta2', 'Platform V Stack 1.0.2-beta.2'])]
    components = [{'code': str(uuid5(NAMESPACE_URL, 'storm-ui-demo-component-'+name)), 'name': name} for name in ['STAK', 'CORE']]
    statuses = ['Open', 'In progress', 'Problem analysis', 'Need info', 'Paused', 'Resolved', 'Closed', 'Cancelled', 'Sent by mistake']
    titles = ['Внешний периметр — связанный проект', 'Проверка API — несколько версий', 'Тикет без исполнителя и версии', 'Мобильное приложение — три версии', 'Проверка поставлена на паузу', 'Анализ завершён', 'Закрытый запрос на анализ', 'Отменённый запрос', 'Ошибочно направленный запрос']
    units = []
    for index in range(45):
        status = statuses[index % len(statuses)]
        user = users[index % len(users)]
        selected = [] if index == 2 else versions[:3] if index == 3 else versions[:2] if index == 1 else versions[:1]
        units.append({'code': f'APPSEC-{900001 + index}', 'summary': f'[DEMO] {titles[index % len(titles)]} · {index+1}', 'suit': {'code': 'assessment', 'name': 'Security assessment'}, 'createdAt': (now-timedelta(days=10+index)).isoformat(), 'updatedAt': (now-timedelta(hours=index)).isoformat(), 'attributes': {'workflow_status': {'name': status}, 'assigned_to': None if index == 2 else {'username': user.username, 'displayName': user.full_name or user.username}, 'affects_version_s_crpv': selected, get_settings().works_appsec_product_code_attribute: {'code': '285902', 'name': 'OST'}, get_settings().works_appsec_component_attribute: components if index == 3 else components[:1], 'priority': {'name': ['Critical', 'High', 'Medium'][index % 3]}, 'reporter': users[0].username, 'label': ['demo', 'APPSEC']}, 'description': {'type': 'doc', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'text': 'Синтетический APPSEC-тикет для проверки списка, карточки и автозаполнения проекта. Все affected versions, код продукта и компоненты переносятся из полной карточки. Внешний Task Tracker не вызывается.'}]}]}})
    project = await db.get(m.Project, project_id)
    if not project.appsec_ticket_key and not project.appsec_ticket_url:
        first = units[0]
        project.appsec_ticket_key = first['code']
        project.appsec_ticket_url = f"{get_settings().app_base_url.rstrip('/')}/tasks/{first['code']}"
        project.appsec_versions = affected_versions(first['attributes'])
        project.appsec_version_code = project.appsec_versions[0]['code']
        project.appsec_version_name = project.appsec_versions[0]['name']
        project.appsec_assignee, project.appsec_assignee_name = assignee_identity(first['attributes']['assigned_to'])
    if project.appsec_ticket_key == units[0]['code']:
        project.appsec_product_code = project.appsec_product_code or '285902'
        if not project.appsec_components:
            project.appsec_components = components[:1]
            project.appsec_component_code = components[0]['code']
            project.appsec_component_name = components[0]['name']
    target = target or Path(__file__).resolve().parents[1] / '.local' / 'task-tracker-demo.json'
    target.parent.mkdir(parents=True, exist_ok=True)
    temporary = target.with_suffix('.tmp')
    temporary.write_text(json.dumps({'content': units, 'page': {'last': True}}, ensure_ascii=False, indent=2) + '\n')
    temporary.replace(target)
    return {'demo_tickets': len(units), 'demo_file': str(target)}


async def seed_preview_user(db, storage, project_id: int) -> None:
    """Добавляет отдельного демо-участника с фото, не меняя аватары существующих людей."""
    user = await db.scalar(select(m.User).where(m.User.username == 'demo.avatar'))
    if user is None:
        user = m.User(username='demo.avatar', email='demo.avatar@example.com', role=UserRole.PENTESTER,
                      password_hash=hash_password(secrets.token_urlsafe(32)))
        db.add(user)
        await db.flush()
    elif user.email == 'demo.avatar@example.invalid':
        user.email = 'demo.avatar@example.com'
    if not await db.scalar(select(m.ProjectMember.id).where(m.ProjectMember.project_id == project_id, m.ProjectMember.user_id == user.id)):
        db.add(m.ProjectMember(project_id=project_id, user_id=user.id))
    if not user.avatar_minio_key:
        image = Image.new('RGB', (160, 160), '#2e5fbf')
        draw = ImageDraw.Draw(image)
        draw.ellipse((24, 16, 136, 128), fill='#b8d8fa')
        draw.ellipse((58, 38, 102, 82), fill='#ffffff')
        draw.ellipse((34, 91, 126, 190), fill='#ffffff')
        buffer = BytesIO()
        image.save(buffer, format='PNG')
        await asyncio.to_thread(storage.ensure_bucket)
        user.avatar_minio_key = await asyncio.to_thread(storage.upload_bytes, buffer.getvalue(), 'image/png', 'demo-avatar.png')
        user.avatar_minio_bucket = get_settings().minio_bucket_name
        user.avatar_content_type = 'image/png'
        user.avatar_uploaded_at = datetime.now(UTC)


async def main() -> None:
    engine.echo = False
    async with SessionLocal() as db:
        async with db.begin():
            result = await seed(db, MinioStorage())
            result.update(await seed_task_units(db, result['project_id']))
            await seed_preview_user(db, MinioStorage(), result['project_id'])
            result['tables'] = await table_counts(db)
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    asyncio.run(main())
