"""Firewall сетевого namespace контейнера перед запуском приложения.

Не импортирует приложение и не выводит конфигурацию/секреты. Сначала правила,
затем безвозвратное снятие NET_ADMIN/NET_RAW с приложения и его потомков.
"""
import ipaddress
import json
import os
from pathlib import Path
import socket
import subprocess
import sys
from urllib.parse import urlsplit

V4_DENY = ['0.0.0.0/8', '10.0.0.0/8', '100.64.0.0/10', '127.0.0.0/8',
           '169.254.0.0/16', '172.16.0.0/12', '192.0.0.0/24', '192.0.2.0/24',
           '192.88.99.0/24', '192.168.0.0/16', '198.18.0.0/15', '198.51.100.0/24',
           '203.0.113.0/24', '224.0.0.0/4', '240.0.0.0/4', '168.63.129.16/32']
V6_DENY = ['2001::/23', '2001:db8::/32', '2002::/16', '3fff::/20']


def configured_endpoints(env: dict, role: str = 'backend') -> list[tuple[str, int]]:
    """Только доверенные deployment-настройки; пользовательские цели здесь не участвуют."""
    endpoints = []
    def add(url, default_port):
        if not url:
            return
        parsed = urlsplit(url if '://' in url else '//'+url)
        if not parsed.hostname:
            raise ValueError('Неверный адрес доверенной интеграции')
        endpoints.append((parsed.hostname, parsed.port or default_port))
    add(env.get('DATABASE_URL'), 5432)
    add(env.get('RABBITMQ_URL', 'amqp://rabbitmq:5672'), 5672)
    if role == 'backend':
        add(env.get('MINIO_ENDPOINT', 'minio:9000'), 9000)
    enabled = lambda name: env.get(name, '').strip().lower() in ('1', 'true', 'yes')
    if role == 'backend' and enabled('WORKS_ENABLED') and env.get('WORKS_API_TOKEN') and not env.get('WORKS_TASKS_DEMO_FILE'):
        add(env.get('WORKS_BASE_URL'), 443)
    if role == 'backend' and enabled('SSO_ENABLED') and env.get('SSO_CLIENT_ID'):
        add(env.get('SSO_ISSUER'), 443)
        add(env.get('SSO_METADATA_URL'), 443)
    if role == 'mail' and enabled('MAIL_ENABLED'):
        if env.get('SMTP_HOST'):
            endpoints.append((env['SMTP_HOST'], int(env.get('SMTP_PORT', '587'))))
        for name in ('SMTP_OAUTH_TOKEN_URL', 'GOOGLE_OAUTH_TOKEN_URI'):
            add(env.get(name), 443)
    extra = json.loads(env.get('STORM_TRUSTED_EGRESS', '[]'))
    if not isinstance(extra, list) or any(not isinstance(value, str) for value in extra):
        raise ValueError('STORM_TRUSTED_EGRESS должен быть списком URL')
    for url in extra:
        add(url, 443)
    return list(dict.fromkeys(endpoints))


def trusted_addresses(endpoints: list[tuple[str, int]]) -> list[tuple[str, int]]:
    """Закрепляет адрес и порт доверенного сервиса до следующего перезапуска."""
    out = []
    for host, port in endpoints:
        if not 1 <= port <= 65535:
            raise ValueError('Неверный порт доверенной интеграции')
        for info in socket.getaddrinfo(host, port, type=socket.SOCK_STREAM):
            address = info[4][0]
            ip = ipaddress.ip_address(address)
            if ip.is_loopback or ip.is_link_local or ip.is_multicast or ip.is_unspecified or str(ip) in ('168.63.129.16', '100.100.100.200', 'fd00:ec2::254'):
                raise ValueError('Loopback/metadata не могут быть доверенной интеграцией')
            out.append((address, port))
    return list(dict.fromkeys(out))


def firewall_rules(version: int, trusted: list[tuple[str, int]], dns: list[str]) -> list[list[str]]:
    """Разрешения интеграций только UID 0; сканер UID 65532 их не получает."""
    rules = [['-m', 'conntrack', '--ctstate', 'ESTABLISHED,RELATED', '-j', 'RETURN']]
    if version == 6:
        for kind in ('133', '135', '136'):
            rules.append(['-p', 'ipv6-icmp', '--icmpv6-type', kind, '-j', 'RETURN'])
    for address in dns:
        if ipaddress.ip_address(address).version != version:
            continue
        # Docker DNAT переписывает порт embedded DNS до filter/OUTPUT.
        for protocol in ('udp', 'tcp'):
            port = [] if address == '127.0.0.11' else ['--dport', '53']
            rules.append(['-d', address, '-p', protocol, *port, '-j', 'RETURN'])
    # Metadata и loopback не разрешаем даже приложению через trusted-исключения.
    for network in (['127.0.0.0/8', '169.254.0.0/16', '168.63.129.16/32', '100.100.100.200/32'] if version == 4 else ['::1/128', 'fe80::/10', 'fd00:ec2::254/128']):
        rules.append(['-d', network, '-j', 'REJECT'])
    for address, port in trusted:
        if ipaddress.ip_address(address).version == version:
            rules.append(['-m', 'owner', '--uid-owner', '0', '-d', address, '-p', 'tcp', '--dport', str(port), '-j', 'RETURN'])
    for network in V4_DENY if version == 4 else V6_DENY:
        rules.append(['-d', network, '-j', 'REJECT'])
    if version == 6:
        rules.append(['!', '-d', '2000::/3', '-j', 'REJECT'])
    rules.append(['-j', 'RETURN'])
    return rules


def install(version: int, rules: list[list[str]]) -> None:
    """Устанавливает OUTPUT-chain; любая ошибка останавливает запуск приложения."""
    binary = 'iptables' if version == 4 else 'ip6tables'
    base = [binary, '-w', '10']
    exists = subprocess.run([*base, '-S', 'STORM_EGRESS'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL).returncode == 0
    if not exists:
        subprocess.run([*base, '-N', 'STORM_EGRESS'], check=True, capture_output=True)
    subprocess.run([*base, '-F', 'STORM_EGRESS'], check=True, capture_output=True)
    for rule in rules:
        subprocess.run([*base, '-A', 'STORM_EGRESS', *rule], check=True, capture_output=True)
    if subprocess.run([*base, '-C', 'OUTPUT', '-j', 'STORM_EGRESS'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL).returncode:
        subprocess.run([*base, '-I', 'OUTPUT', '1', '-j', 'STORM_EGRESS'], check=True, capture_output=True)


def main() -> None:
    """Fail-closed bootstrap; приложению недоступны изменение firewall и raw-сокеты."""
    try:
        role = 'mail' if 'app.worker.mail_worker' in sys.argv else 'recon' if 'app.worker.recon_worker' in sys.argv else 'backend'
        trusted = trusted_addresses(configured_endpoints(dict(os.environ), role))
        dns = [line.split()[1] for line in Path('/etc/resolv.conf').read_text().splitlines() if line.strip().startswith('nameserver ')]
        install(4, firewall_rules(4, trusted, dns))
        install(6, firewall_rules(6, trusted, dns))
        os.environ['STORM_SCANNER_SANDBOX'] = '1'
        print('storm_egress_ready ipv4=protected ipv6=protected scanner_uid=65532', flush=True)
        os.execv('/usr/bin/setpriv', ['setpriv', '--no-new-privs', '--bounding-set=-net_admin,-net_raw',
                                    '--inh-caps=-all', '--ambient-caps=-all', *sys.argv[1:]])
    except Exception:
        print('storm_egress_failed: запуск остановлен; проверьте DNS интеграций и NET_ADMIN bootstrap.', file=sys.stderr, flush=True)
        raise SystemExit(78) from None


if __name__ == '__main__':
    main()
