"""Контракт контейнерного firewall без изменения правил машины тестирования."""
import socket

import pytest

from deploy.egress_guard import configured_endpoints, firewall_rules, trusted_addresses


def test_workers_do_not_resolve_unused_web_integrations():
    env = {'DATABASE_URL': 'postgresql://db/storm', 'MINIO_ENDPOINT': 'storage:9000',
           'WORKS_ENABLED': 'true', 'WORKS_BASE_URL': 'https://tracker', 'WORKS_API_TOKEN': 'test',
           'SSO_ENABLED': 'true', 'SSO_CLIENT_ID': 'storm', 'SSO_ISSUER': 'https://iam',
           'MAIL_ENABLED': 'true', 'SMTP_HOST': 'smtp'}
    common = [('db', 5432), ('rabbitmq', 5672)]
    assert configured_endpoints(env, 'recon') == common
    assert configured_endpoints(env, 'mail') == common + [('smtp', 587)]
    assert configured_endpoints(env) == common + [('storage', 9000), ('tracker', 443), ('iam', 443)]


def test_incomplete_or_demo_tt_does_not_require_tt_dns():
    env = {'WORKS_ENABLED': 'true', 'WORKS_BASE_URL': 'https://unconfigured'}
    assert ('unconfigured', 443) not in configured_endpoints(env)
    env.update(WORKS_API_TOKEN='test', WORKS_TASKS_DEMO_FILE='demo.json')
    assert ('unconfigured', 443) not in configured_endpoints(env)


@pytest.mark.parametrize('address', ['127.0.0.1', '169.254.169.254', '168.63.129.16', '100.100.100.200', 'fd00:ec2::254'])
def test_metadata_cannot_be_whitelisted(monkeypatch, address):
    monkeypatch.setattr(socket, 'getaddrinfo', lambda *args, **kwargs: [(0, 0, 0, '', (address, 80))])
    with pytest.raises(ValueError):
        trusted_addresses([('integration', 80)])


def test_integration_exception_is_exact_root_only_and_precedes_private_deny():
    rules = firewall_rules(4, [('10.0.0.5', 5432)], ['127.0.0.11'])
    permission = ['-m', 'owner', '--uid-owner', '0', '-d', '10.0.0.5', '-p', 'tcp', '--dport', '5432', '-j', 'RETURN']
    assert permission in rules
    assert rules.index(permission) < rules.index(['-d', '10.0.0.0/8', '-j', 'REJECT'])
    assert rules.index(['-d', '169.254.0.0/16', '-j', 'REJECT']) < rules.index(permission)
    assert ['-d', '127.0.0.11', '-p', 'udp', '-j', 'RETURN'] in rules
