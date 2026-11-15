"""Смена IP проекта: атомарный сброс замеров и очередь без внешних проб."""
from contextlib import aclosing, asynccontextmanager
from unittest.mock import Mock

import pytest
from sqlalchemy import select, func

from app.database import get_db
from app.enums import AssetType, HostStatus, OsType
from app.main import app
from app.models import Host, HostIpAddress, HostFarmJob, Port, Service, Vulnerability, VulnerabilityAsset
from app.routers import assets
from app.security import create_access_token
from app.services import AuditService

pytestmark = pytest.mark.asyncio


@asynccontextmanager
async def session():
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        yield await anext(stream)


@pytest.fixture(autouse=True)
def queue(monkeypatch):
    # Никогда не запускать probe/resolve через FastAPI BackgroundTasks.
    mock = Mock()
    monkeypatch.setattr(assets, 'enqueue_job', mock)
    return mock


async def test_rename_all_project_bindings_discards_only_stale_measurements(api, queue):
    client, ids = api
    async with session() as db:
        host = await db.get(Host, ids['host'])
        host.status, host.os_type = HostStatus.UP, OsType.LINUX
        ip = await db.get(HostIpAddress, ids['ip'])
        ip.hostnames = [{'hostname': 'old-ptr.example'}]
        ip_host = Host(project_id=ids['project'], hostname=None, ip_address=ip.ip_address, origin='ip', status=HostStatus.UP, os_type=OsType.LINUX)
        db.add(ip_host)
        await db.flush()
        standalone = HostIpAddress(host_id=ip_host.id, ip_address=ip.ip_address, is_primary=True)
        other_ip = HostIpAddress(host_id=host.id, ip_address='192.0.2.50', is_primary=False)
        db.add_all([standalone, other_ip])
        await db.flush()
        stale_port = Port(host_id=ip_host.id, ip_address_id=standalone.id, port_number=443)
        fresh_port = Port(host_id=host.id, ip_address_id=other_ip.id, port_number=22)
        service = Service(port_id=ids['port'], name='old-service')
        finding = Vulnerability(project_id=ids['project'], title='Keep finding', created_by=ids['admin'])
        db.add_all([stale_port, fresh_port, service, finding])
        await db.flush()
        db.add_all([VulnerabilityAsset(vulnerability_id=finding.id, asset_type=AssetType.PORT, asset_id=ids['port']),
                    VulnerabilityAsset(vulnerability_id=finding.id, asset_type=AssetType.SERVICE, asset_id=service.id),
                    VulnerabilityAsset(vulnerability_id=finding.id, asset_type=AssetType.HOST, asset_id=host.id)])
        await db.commit()
        keep_port, finding_id = fresh_port.id, finding.id
    response = await client.put(f"projects/{ids['project']}/ip-addresses/192.0.2.1", json={'ip_address': '192.0.2.2'})
    assert response.status_code == 202, response.text
    result = response.json()
    assert result['updated_hosts'] == 2
    assert result['ip_address'] == '192.0.2.2'
    assert result['job']['status'] == 'pending' and result['job']['targets_total'] == 1
    queue.assert_called_once()
    async with session() as db:
        ips = (await db.scalars(select(HostIpAddress).join(Host).where(Host.project_id == ids['project']))).all()
        assert sorted(ip.ip_address for ip in ips) == ['192.0.2.2', '192.0.2.2', '192.0.2.50']
        assert all(not ip.hostnames for ip in ips if ip.ip_address == '192.0.2.2')
        host = await db.get(Host, ids['host'])
        assert host.hostname == 'old.example' and host.ip_address == '192.0.2.2'
        assert host.status == HostStatus.UNKNOWN and host.os_type == OsType.UNKNOWN
        assert (await db.scalars(select(Port.id).where(Port.host_id.in_([host.id, ip_host.id])))).all() == [keep_port]
        assert await db.get(Port, ids['foreign_port']) is not None
        assert await db.get(Vulnerability, finding_id) is not None
        links = (await db.scalars(select(VulnerabilityAsset).where(VulnerabilityAsset.vulnerability_id == finding_id))).all()
        assert [link.asset_type for link in links] == [AssetType.HOST]
        job = await db.get(HostFarmJob, result['job']['id'])
        assert job.raw == '192.0.2.2' and job.skipped_targets == []


async def test_rename_domain_ip_creates_empty_origin_ip_and_canonicalizes_ipv6(api, queue):
    client, ids = api
    response = await client.put(f"projects/{ids['project']}/ip-addresses/192.0.2.1", json={'ip_address': '2001:0db8:0:0:0:0:0:1'})
    assert response.status_code == 202, response.text
    assert response.json()['ip_address'] == '2001:db8::1'
    async with session() as db:
        origin = await db.scalar(select(Host).where(Host.project_id == ids['project'], Host.origin == 'ip'))
        assert origin and origin.ip_address == '2001:db8::1' and origin.hostname is None
        assert origin.status == HostStatus.UNKNOWN
        assert await db.scalar(select(func.count()).select_from(Port).where(Port.host_id.in_([origin.id, ids['host']]))) == 0
    queue.assert_called_once()


@pytest.mark.parametrize('address', ['', 'example.com', 'http://192.0.2.2', '192.0.2.2:80', '192.0.2.2;touch /tmp/pwn', '$(id)', '--help', '256.1.1.1', 'fe80::1%en0', None, [], {}, True, 123])
async def test_invalid_ip_is_422_without_mutation_or_queue(api, queue, address):
    client, ids = api
    response = await client.put(f"projects/{ids['project']}/ip-addresses/192.0.2.1", json={'ip_address': address})
    assert response.status_code == 422, response.text
    async with session() as db:
        assert (await db.get(HostIpAddress, ids['ip'])).ip_address == '192.0.2.1'
        assert await db.get(Port, ids['port']) is not None
        assert await db.scalar(select(func.count()).select_from(HostFarmJob)) == 0
    queue.assert_not_called()


@pytest.mark.parametrize('old,new,status', [('192.0.2.1', '192.0.2.1', 422), ('192.0.2.9', '192.0.2.2', 404), ('example.com', '192.0.2.2', 422)])
async def test_same_missing_foreign_or_invalid_source_ip(api, queue, old, new, status):
    client, ids = api
    response = await client.put(f"projects/{ids['project']}/ip-addresses/{old}", json={'ip_address': new})
    assert response.status_code == status, response.text
    queue.assert_not_called()


async def test_existing_target_or_active_probe_is_conflict_and_retains_old_data(api, queue):
    client, ids = api
    async with session() as db:
        db.add(HostIpAddress(host_id=ids['host'], ip_address='192.0.2.2', is_primary=False))
        await db.commit()
    root = f"projects/{ids['project']}/ip-addresses/192.0.2.1"
    assert (await client.put(root, json={'ip_address': '192.0.2.2'})).status_code == 409
    async with session() as db:
        db.add(HostFarmJob(project_id=ids['project'], created_by=ids['admin'], kind='ips', status='running', raw='192.0.2.1', targets_total=1))
        await db.commit()
    assert (await client.put(root, json={'ip_address': '192.0.2.3'})).status_code == 409
    async with session() as db:
        assert (await db.get(HostIpAddress, ids['ip'])).ip_address == '192.0.2.1'
        assert await db.get(Port, ids['port']) is not None
    queue.assert_not_called()


async def test_outsider_cannot_rename_project_ip(api, queue):
    client, ids = api
    client.cookies.set('access_token', create_access_token(ids['outsider']))
    response = await client.put(f"projects/{ids['project']}/ip-addresses/192.0.2.1", json={'ip_address': '192.0.2.2'})
    assert response.status_code == 403, response.text
    queue.assert_not_called()


async def test_failure_after_job_creation_rolls_back_ip_ports_and_job(api, queue, monkeypatch):
    client, ids = api
    async def fail_audit(*args, **kwargs):
        raise RuntimeError('Simulated audit persistence failure')
    monkeypatch.setattr(AuditService, 'log', fail_audit)
    response = await client.put(f"projects/{ids['project']}/ip-addresses/192.0.2.1", json={'ip_address': '192.0.2.2'})
    assert response.status_code == 500
    async with session() as db:
        assert (await db.get(HostIpAddress, ids['ip'])).ip_address == '192.0.2.1'
        assert (await db.get(Host, ids['host'])).ip_address == '192.0.2.1'
        assert await db.get(Port, ids['port']) is not None
        assert await db.scalar(select(func.count()).select_from(HostFarmJob)) == 0
        assert await db.scalar(select(func.count()).select_from(Host).where(Host.project_id == ids['project'])) == 1
    queue.assert_not_called()


async def test_parallel_renames_do_not_create_two_jobs_or_overwrite_first_result(api, queue):
    import asyncio
    client, ids = api
    root = f"projects/{ids['project']}/ip-addresses/192.0.2.1"
    results = await asyncio.gather(*(client.put(root, json={'ip_address': address}) for address in ('192.0.2.2', '192.0.2.3')))
    assert sorted(result.status_code for result in results) == [202, 404]
    winner = next(result.json()['ip_address'] for result in results if result.status_code == 202)
    async with session() as db:
        assert (await db.get(HostIpAddress, ids['ip'])).ip_address == winner
        assert await db.scalar(select(func.count()).select_from(HostFarmJob)) == 1
    queue.assert_called_once()
