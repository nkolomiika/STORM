"""Контейнерный smoke: сервисы доступны приложению, внутренние цели закрыты сканеру.

Запуск оператором внутри backend: STORM_SCANNER_SANDBOX=1 python -m scripts.check_egress
Сначала проверяется установленный firewall. Вывод не содержит секретов/ответов сервисов.
"""
import json
import os
import socket
import subprocess
import sys
from urllib.parse import urlsplit

from app.scanner_sandbox import scanner_options


def main() -> None:
    """Проверяет реальное применение iptables и unprivileged-процесса."""
    if os.environ.get('STORM_SCANNER_SANDBOX') != '1':
        raise SystemExit('Запускайте только в защищённом контейнере с STORM_SCANNER_SANDBOX=1')
    subprocess.run(['iptables', '-C', 'OUTPUT', '-j', 'STORM_EGRESS'], check=True, capture_output=True)
    subprocess.run(['ip6tables', '-C', 'OUTPUT', '-j', 'STORM_EGRESS'], check=True, capture_output=True)
    db = urlsplit(os.environ['DATABASE_URL'])
    db_ip = socket.getaddrinfo(db.hostname, db.port or 5432, type=socket.SOCK_STREAM)[0][4][0]
    with socket.create_connection((db_ip, db.port or 5432), timeout=2):
        database_allowed = True
    # Реальный открытый сервер на loopback: неразличим для сканера с закрытым портом.
    with socket.socket() as server:
        server.bind(('127.0.0.1', 0))
        server.listen(1)
        targets = [('loopback-open', '127.0.0.1', server.getsockname()[1]),
                   ('loopback-closed', '127.0.0.1', 1), ('trusted-database', db_ip, db.port or 5432),
                   ('private-unused', '10.255.255.254', 80), ('metadata', '169.254.169.254', 80),
                   ('metadata-azure', '168.63.129.16', 80), ('ipv6-loopback', '::1', 80),
                   ('ipv6-private', 'fd00::1', 80)]
        program = '''import json, socket, sys, time
from pathlib import Path
results=[]
for name,host,port in json.loads(sys.argv[1]):
    start=time.monotonic()
    try:
        with socket.create_connection((host,port),timeout=2): pass
        row={'name':name,'connected':True,'errno':None}
    except OSError as exc:
        row={'name':name,'connected':False,'errno':exc.errno}
    row['duration_ms']=round((time.monotonic()-start)*1000,2)
    results.append(row)
status=dict(line.split(':',1) for line in Path('/proc/self/status').read_text().splitlines() if ':' in line)
try:
    with socket.create_connection(('1.1.1.1',443),timeout=5): public=True
except OSError: public=False
print(json.dumps({'uid':int(status['Uid'].split()[0]),'cap_eff':status['CapEff'].strip(),'no_new_privs':status['NoNewPrivs'].strip(),'probes':results,'public_connected':public}))
'''
        args, options = scanner_options([sys.executable, '-c', program, json.dumps(targets)])
        response = subprocess.run(args, **options, capture_output=True, text=True, check=True, timeout=35)
    result = json.loads(response.stdout)
    result['database_allowed_for_app'] = database_allowed
    result['ok'] = result['uid'] == 65532 and int(result['cap_eff'], 16) == 0 and result['no_new_privs'] == '1' and result['public_connected'] and all(not row['connected'] for row in result['probes'])
    print(json.dumps(result, ensure_ascii=False))
    raise SystemExit(0 if result['ok'] else 1)


if __name__ == '__main__':
    main()
