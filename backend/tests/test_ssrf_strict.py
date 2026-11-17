"""Без сетевых запросов: отсутствие DNS-гонки, внутренних подключений и утечки env."""
import socket
from unittest.mock import AsyncMock

import httpcore
import pytest

from app.farm.core import PublicNetworkBackend
from app.farm.resolver import resolve_forward, reverse_resolve
from app.netguard import is_disallowed_ip
from app.scanner_sandbox import scanner_options


@pytest.mark.parametrize('ip', ['100.64.0.1', '100.100.100.200', '168.63.129.16', '169.254.169.254', '::ffff:127.0.0.1'])
def test_non_global_and_metadata_are_blocked(ip):
    assert is_disallowed_ip(ip)


@pytest.mark.asyncio
async def test_connection_uses_validated_ip_and_keeps_hostname_out_of_second_dns(monkeypatch):
    calls = []
    def dns(host, port, **kwargs):
        calls.append((host, port))
        return [(socket.AF_INET, socket.SOCK_STREAM, 6, '', ('8.8.8.8', port))]
    monkeypatch.setattr('app.farm.core.socket.getaddrinfo', dns)
    backend = PublicNetworkBackend()
    backend.backend.connect_tcp = AsyncMock(return_value='stream')
    assert await backend.connect_tcp('public.example', 443, timeout=1) == 'stream'
    assert calls == [('public.example', 443)]
    backend.backend.connect_tcp.assert_awaited_once_with('8.8.8.8', 443, 1, None, None)


@pytest.mark.asyncio
@pytest.mark.parametrize('addresses', [['10.0.0.1'], ['8.8.8.8', '127.0.0.1'], ['169.254.169.254'], []])
async def test_private_mixed_or_empty_dns_never_opens_socket(monkeypatch, addresses):
    monkeypatch.setattr('app.farm.core.socket.getaddrinfo', lambda *a, **kw: [(socket.AF_INET, socket.SOCK_STREAM, 6, '', (ip, 80)) for ip in addresses])
    backend = PublicNetworkBackend()
    backend.backend.connect_tcp = AsyncMock()
    with pytest.raises(httpcore.ConnectError, match='Цель недоступна или запрещена'):
        await backend.connect_tcp('rebind.example', 80, timeout=1)
    backend.backend.connect_tcp.assert_not_awaited()


@pytest.mark.asyncio
async def test_rebinding_is_rechecked_on_every_new_connection(monkeypatch):
    addresses = iter(['8.8.8.8', '127.0.0.1'])
    monkeypatch.setattr('app.farm.core.socket.getaddrinfo', lambda *a, **kw: [(socket.AF_INET, socket.SOCK_STREAM, 6, '', (next(addresses), 80))])
    backend = PublicNetworkBackend()
    backend.backend.connect_tcp = AsyncMock(return_value='stream')
    await backend.connect_tcp('rebind.example', 80)
    with pytest.raises(httpcore.ConnectError):
        await backend.connect_tcp('rebind.example', 80)
    assert backend.backend.connect_tcp.await_count == 1


@pytest.mark.asyncio
async def test_internal_dns_response_and_missing_domain_have_same_public_result(monkeypatch):
    def dns(host, *a, **kw):
        if host == 'missing.example':
            raise socket.gaierror('private resolver diagnostic')
        return [(socket.AF_INET, socket.SOCK_STREAM, 6, '', ('10.0.0.12', 0))]
    monkeypatch.setattr('app.farm.resolver.socket.getaddrinfo', dns)
    rows = await resolve_forward(['internal.example', 'missing.example'])
    assert rows['internal.example'] == rows['missing.example']
    assert rows['internal.example'].ip is None and rows['internal.example'].ips == []


@pytest.mark.asyncio
async def test_no_ptr_queries_for_private_addresses(monkeypatch):
    ptr = AsyncMock(side_effect=AssertionError('Private PTR must not be queried'))
    monkeypatch.setattr('app.farm.resolver.socket.gethostbyaddr', ptr)
    rows = await reverse_resolve(['10.0.0.1', '127.0.0.1'], [])
    assert all(not row.names for row in rows.values())
    ptr.assert_not_called()


def test_external_tools_drop_caps_uid_and_integration_secrets(monkeypatch):
    monkeypatch.setenv('STORM_SCANNER_SANDBOX', '1')
    for key in ['JWT_SECRET_KEY', 'DATA_ENCRYPTION_KEY', 'WORKS_API_TOKEN', 'DATABASE_URL', 'HTTP_PROXY']:
        monkeypatch.setenv(key, 'must-not-reach-tool')
    argv, options = scanner_options(['trufflehog', 'filesystem', '/tmp/file.js'])
    assert argv[0] == '/usr/bin/setpriv'
    assert '--no-new-privs' in argv and '--bounding-set=-all' in argv and '--reuid=65532' in argv
    assert argv[-3:] == ['trufflehog', 'filesystem', '/tmp/file.js']
    assert 'must-not-reach-tool' not in str(options)
