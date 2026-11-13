"""Воспроизводимый HTTP-бенчмарк в собственной схеме PostgreSQL, без интеграций.

STORM_TEST_DATABASE_URL обязателен. Существующие таблицы приложения не меняются.
Сервер использует настоящие маршруты и TCP; lifespan выключен, воркеры не стартуют.
"""
from __future__ import annotations

import argparse
import asyncio
from collections import Counter
from contextvars import ContextVar
from datetime import datetime, UTC
import hashlib
import json
import math
import os
from pathlib import Path
import platform
import resource
import socket
import sys
import time
from uuid import uuid4

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import httpx
import uvicorn
from sqlalchemy import event, insert, text
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

from app.config import get_settings
from app.database import Base, get_db
from app.main import app
from app.models import Comment, CommentMention, Endpoint, Host, HostIpAddress, JsFile, Notification, Port, Project, Service, User, Vulnerability, VulnerabilityAsset
from app.enums import AssetType, NotificationType, UserRole
from app.security import create_access_token

metrics: ContextVar[list[float] | None] = ContextVar("benchmark_metrics", default=None)


async def fetch_scenario(client, name: str, path: str) -> dict:
    """HTTP-чтение; chart_hosts_full повторяет вычитывание всех страниц getHosts.

    В сравнении графиков учитываются сеть, JSON-разбор и сбор тех же дат;
    создание DOM/React и хранение всех деревьев в памяти браузера не измеряются.
    """
    result = {"statuses": Counter(), "queries": 0, "sql_ms": 0.0, "bytes": 0}

    async def get(url):
        response = await client.get(url)
        result["statuses"][str(response.status_code)] += 1
        result["queries"] += int(response.headers.get("X-Benchmark-Queries", 0))
        result["sql_ms"] += float(response.headers.get("X-Benchmark-SQL-Ms", 0))
        result["bytes"] += len(response.content)
        return response

    response = await get(path)
    if response.status_code != 200:
        return result
    dates = None
    if name == "chart_hosts_full":
        data = response.json()
        dates = [host["created_at"] for host in data["items"]]
        for page in range(2, data["pages"] + 1):
            response = await get(path + f"&page={page}")
            if response.status_code != 200:
                return result
            dates.extend(host["created_at"] for host in response.json()["items"])
        if len(dates) != data["total"]:
            raise RuntimeError("Full host chart lost rows")
    elif name == "chart_hosts_times":
        dates = response.json()
    if dates is not None:
        result["dates_count"] = len(dates)
        result["dates_sha256"] = hashlib.sha256(json.dumps(dates).encode()).hexdigest()
    return result


async def seed(sessions, hosts: int, per_host: int):
    async with sessions() as db:
        async def rows(model, values):
            for offset in range(0, len(values), 1000):
                await db.execute(insert(model), values[offset:offset + 1000])
        await rows(User, [dict(id=i, username=f"bench{i}", email=f"bench{i}@example.com", password_hash="unused", role=UserRole.ADMIN if i == 1 else UserRole.PENTESTER) for i in range(1, 102)])
        await rows(Project, [dict(id=1, name="Isolated benchmark", created_by=1)])
        await rows(Host, [dict(id=i, project_id=1, hostname=f"host{i}.example.test", origin="host", ip_address=f"192.0.2.{i % 250 + 1}") for i in range(1, hosts + 1)])
        await rows(HostIpAddress, [dict(id=i, host_id=i, ip_address=f"192.0.2.{i % 250 + 1}", is_primary=True) for i in range(1, hosts + 1)])
        await rows(Port, [dict(id=(i-1)*4+j+1, host_id=i, ip_address_id=i, port_number=port) for i in range(1, hosts+1) for j, port in enumerate([22, 80, 443, 8080])])
        await rows(Service, [dict(id=i, port_id=i, name="http", version="1.0") for i in range(1, hosts*4+1)])
        await rows(Endpoint, [dict(id=(i-1)*per_host+j+1, host_id=i, path=f"/api/resource/{j}", method="GET", request_headers=[{"name": "Accept", "value": "application/json"}], query_params=[], request_body="x"*128) for i in range(1, hosts+1) for j in range(per_host)])
        count = max(200, hosts)
        await rows(Vulnerability, [dict(id=i, project_id=1, title=f"Finding {i}", created_by=1) for i in range(1, count+1)])
        await rows(VulnerabilityAsset, [dict(vulnerability_id=i, asset_type=AssetType.HOST, asset_id=(i-1) % hosts+1) for i in range(1, count+1)])
        await rows(Comment, [dict(id=i, vulnerability_id=1, user_id=1, content=f"Comment {i}") for i in range(1, 1001)])
        await rows(CommentMention, [dict(comment_id=i, user_id=2) for i in range(1, 1001)])
        await rows(Notification, [dict(id=i, user_id=1, type=NotificationType.PROJECT_MEMBER_ADDED, project_id=1, actor_id=2) for i in range(1, 1001)])
        await rows(JsFile, [dict(id=i, project_id=1, host_id=(i-1) % hosts+1, url=f"https://host{(i-1) % hosts+1}.example.test/{i}.js", hostname=f"host{(i-1) % hosts+1}.example.test", status="ok") for i in range(1, hosts+1)])
        await db.commit()
    async with sessions() as db:
        for table in Base.metadata.sorted_tables:
            await db.execute(text(f'ANALYZE "{table.name}"'))
            if "id" in table.c and table.c.id.primary_key:
                await db.execute(text(
                    f"SELECT setval(pg_get_serial_sequence('\"{table.name}\"', 'id'), "
                    f'COALESCE(MAX(id), 1), MAX(id) IS NOT NULL) FROM "{table.name}"'
                ))
        await db.commit()
    return {"hosts": hosts, "ips": hosts, "ports": hosts*4, "services": hosts*4, "endpoints": hosts*per_host, "vulnerabilities": count, "comments": 1000, "notifications": 1000, "js_files": hosts}


async def main(args):
    url = os.environ.get("STORM_TEST_DATABASE_URL")
    if not url:
        raise SystemExit("Set STORM_TEST_DATABASE_URL explicitly")
    if not (1 <= args.hosts <= 20000 and 1 <= args.endpoints_per_host <= 100 and 1 <= args.requests <= 1000 and 1 <= args.concurrency <= 64):
        raise SystemExit("Dataset/load limits exceeded")
    schema = "perf_" + uuid4().hex
    engine = create_async_engine(url, pool_size=5, max_overflow=10, connect_args={"server_settings": {"search_path": schema}})
    sessions = async_sessionmaker(engine, expire_on_commit=False)
    settings = get_settings()
    settings.mail_enabled = False
    server = None
    server_task = None
    listener = None
    try:
        async with engine.begin() as conn:
            await conn.execute(text(f'CREATE SCHEMA "{schema}"'))
            await conn.run_sync(Base.metadata.create_all)
        dataset = await seed(sessions, args.hosts, args.endpoints_per_host)

        @event.listens_for(engine.sync_engine, "before_cursor_execute")
        def before(conn, *_):
            conn.info["benchmark_started"] = time.perf_counter()
            counter = metrics.get()
            if counter is not None:
                counter[0] += 1

        @event.listens_for(engine.sync_engine, "after_cursor_execute")
        def after(conn, *_):
            counter = metrics.get()
            if counter is not None:
                counter[1] += (time.perf_counter() - conn.info["benchmark_started"])*1000

        async def override_db():
            async with sessions() as db:
                yield db
        app.dependency_overrides[get_db] = override_db

        @app.middleware("http")
        async def measure(request, call_next):
            counter = [0.0, 0.0]
            token = metrics.set(counter)
            try:
                response = await call_next(request)
                response.headers["X-Benchmark-Queries"] = str(int(counter[0]))
                response.headers["X-Benchmark-SQL-Ms"] = str(round(counter[1], 3))
                return response
            finally:
                metrics.reset(token)

        listener = socket.socket()
        listener.bind(("127.0.0.1", 0))
        port = listener.getsockname()[1]
        config = uvicorn.Config(app, lifespan="off", access_log=False, log_level="error")
        server = uvicorn.Server(config)
        server_task = asyncio.create_task(server.serve(sockets=[listener]))
        while not server.started:
            if server_task.done():
                await server_task
                raise RuntimeError("Benchmark server failed to start")
            await asyncio.sleep(.01)
        scenarios = {
            "hosts_20": "projects/1/hosts?size=20&origin=all",
            "hosts_200": "projects/1/hosts?size=200&origin=all",
            "ports": "projects/1/hosts/1/ports",
            "endpoints": "projects/1/hosts/1/endpoints",
            "comments_100": "projects/1/vulnerabilities/1/comments?size=100",
            "notifications_100": "notifications?size=100",
            "js_200": "projects/1/js-files?size=200",
            "vulnerabilities_100": "projects/1/vulnerabilities?size=100",
            "project_stats": "projects/stats",
        }
        if args.scenario:
            chart_scenarios = {
                "chart_hosts_full": "projects/1/hosts?size=200&origin=all",
                "chart_hosts_times": "projects/1/host-creation-times",
            }
            if args.scenario == "chart_hosts_compare":
                scenarios = chart_scenarios
            else:
                scenarios.update(chart_scenarios)
                if args.scenario not in scenarios:
                    raise SystemExit(f"Unknown scenario: {args.scenario}")
                scenarios = {args.scenario: scenarios[args.scenario]}
        output = {"label": args.label, "measured_at_utc": datetime.now(UTC).isoformat(), "environment": {"python": platform.python_version(), "machine": platform.machine(), "cpu_count": os.cpu_count(), "transport": "TCP HTTP, Uvicorn 1 worker, lifespan off", "pool_size": 5, "max_overflow": 10}, "dataset": dataset, "concurrency": args.concurrency, "requests_per_scenario": args.requests, "scenarios": {}}
        output["query_plans"] = {}
        async with sessions() as db:
            for name, sql in {
                "ports_by_host": "SELECT * FROM ports WHERE host_id = 1 ORDER BY port_number",
                "services_for_host_page": "SELECT * FROM services WHERE port_id IN (" + ",".join(str(i) for i in range(1, 81)) + ") ORDER BY name",
            }.items():
                plan = await db.scalar(text("EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) " + sql))
                output["query_plans"][name] = plan
        async with httpx.AsyncClient(base_url=f"http://127.0.0.1:{port}/api/v1/", cookies={"access_token": create_access_token(1)}, timeout=120, limits=httpx.Limits(max_connections=args.concurrency)) as client:
            for name, path in scenarios.items():
                warmup = await fetch_scenario(client, name, path)
                if set(warmup["statuses"]) != {"200"}:
                    raise RuntimeError(f"Warmup {name}: {dict(warmup['statuses'])}")
                times, queries, sql_times, sizes = [], [], [], []
                statuses = Counter()
                semaphore = asyncio.Semaphore(args.concurrency)
                async def request():
                    async with semaphore:
                        started = time.perf_counter()
                        response = await fetch_scenario(client, name, path)
                        times.append((time.perf_counter()-started)*1000)
                        statuses.update(response["statuses"])
                        queries.append(response["queries"])
                        sql_times.append(response["sql_ms"])
                        sizes.append(response["bytes"])
                        if "dates_sha256" in warmup and set(response["statuses"]) == {"200"} and response.get("dates_sha256") != warmup["dates_sha256"]:
                            raise RuntimeError("Chart timestamps changed between identical reads")
                started = time.perf_counter()
                await asyncio.gather(*(request() for _ in range(args.requests)))
                elapsed = time.perf_counter()-started
                times.sort()
                percentile = lambda value: round(times[min(len(times)-1, math.ceil(value*len(times))-1)], 2)
                output["scenarios"][name] = dict(p50_ms=percentile(.5), p95_ms=percentile(.95), rps=round(args.requests/elapsed, 2), queries_avg=round(sum(queries)/len(queries), 2), sql_ms_avg=round(sum(sql_times)/len(sql_times), 2), response_bytes_avg=round(sum(sizes)/len(sizes)), statuses=dict(statuses))
                if "dates_sha256" in warmup:
                    output["scenarios"][name].update(dates_count=warmup["dates_count"], dates_sha256=warmup["dates_sha256"])
                print(name, json.dumps(output["scenarios"][name]), flush=True)
            if args.review_findings:
                output["review_findings"] = await review_findings(client, sessions, settings)
        if args.scenario == "chart_hosts_compare":
            before = output["scenarios"]["chart_hosts_full"]
            after = output["scenarios"]["chart_hosts_times"]
            if (before["dates_count"], before["dates_sha256"]) != (after["dates_count"], after["dates_sha256"]):
                raise RuntimeError("Optimized chart changed the timestamps")
        output["peak_rss_mb"] = round(resource.getrusage(resource.RUSAGE_SELF).ru_maxrss/1024, 2)
        source = Path(__file__).resolve().parents[1]/"app/services.py"
        output["services_sha256"] = hashlib.sha256(source.read_bytes()).hexdigest()
        path = Path(args.output)
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(output, ensure_ascii=False, indent=2)+"\n")
        if any(set(result["statuses"]) != {"200"} for result in output["scenarios"].values()):
            raise RuntimeError("Load test returned non-200 responses; see JSON report")
    finally:
        if server is not None:
            server.should_exit = True
        if server_task is not None:
            await server_task
        if listener is not None:
            listener.close()
        app.dependency_overrides.pop(get_db, None)
        async with engine.begin() as conn:
            await conn.execute(text(f'DROP SCHEMA IF EXISTS "{schema}" CASCADE'))
        await engine.dispose()


async def review_findings(client, sessions, settings):
    """Воспроизведение согласуемых дефектов только в собственной perf-схеме."""
    from unittest.mock import AsyncMock, patch
    from sqlalchemy import select
    from app.services import AuditService

    headers = {"Origin": settings.csrf_origins[0]}
    path = "projects/1/hosts/1"
    response = await client.put(path, json={"notes": "Review reproduction"}, headers=headers)
    response.raise_for_status()
    response = await client.put(path, json={"notes": None}, headers=headers)
    findings = {"clear_host_notes": {"http_status": response.status_code, "sent": None, "stored": response.json().get("notes")}}
    # Имитация отказа локальной записи аудита; ни один внешний сервис не вызывается.
    with patch.object(AuditService, "log", new=AsyncMock(side_effect=RuntimeError("Simulated audit write failure"))):
        response = await client.post("projects/1/hosts", json={"hostname": "audit-failure.example.test"}, headers=headers)
    async with sessions() as db:
        persisted = await db.scalar(select(Host.id).where(Host.hostname == "audit-failure.example.test"))
    findings["commit_before_audit"] = {"http_status": response.status_code, "host_persisted": persisted is not None}
    async def note(title, parent_id=None):
        response = await client.post("projects/1/notes", json={"title": title, "parent_id": parent_id}, headers=headers)
        response.raise_for_status()
        return response.json()["id"]
    container_id = await note("Container")
    folder_id = await note("Folder", container_id)
    await note("Report", container_id)
    child_id = await note("Report", folder_id)
    response = await client.delete(f"projects/1/notes/{folder_id}", headers=headers)
    remaining = await client.get("projects/1/notes")
    remaining.raise_for_status()
    rows = {item["id"]: item for item in remaining.json()}
    findings["delete_note_conflicting_child"] = {
        "http_status": response.status_code,
        "parent_still_exists": folder_id in rows,
        "child_parent_unchanged": rows.get(child_id, {}).get("parent_id") == folder_id,
    }
    return findings


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--hosts", type=int, default=1000)
    parser.add_argument("--endpoints-per-host", type=int, default=20)
    parser.add_argument("--requests", type=int, default=20)
    parser.add_argument("--concurrency", type=int, default=8)
    parser.add_argument("--label", default="baseline")
    parser.add_argument("--scenario", help="Run only one named scenario")
    parser.add_argument("--review-findings", action="store_true", help="Reproduce known logical defects after measurements")
    parser.add_argument("--output", required=True)
    asyncio.run(main(parser.parse_args()))
