"""Внешние инструменты: отдельный UID, пустое окружение, без capabilities."""
import os

SCANNER_UID = 65532


def scanner_options(args: list[str]) -> tuple[list[str], dict]:
    """В контейнере включает сетевой профиль непривилегированного сканера.

    STORM_SCANNER_SANDBOX устанавливается неизменяемым entrypoint после firewall.
    Дочерний процесс не получает JWT, ключ данных, cookie и пароли интеграций.
    """
    if os.environ.get('STORM_SCANNER_SANDBOX') != '1':
        return args, {}
    env = {name: os.environ[name] for name in ('PATH', 'SSL_CERT_FILE', 'REQUESTS_CA_BUNDLE', 'LANG') if name in os.environ}
    env.update(HOME='/tmp', TMPDIR='/tmp')
    return ['/usr/bin/setpriv', '--no-new-privs', '--bounding-set=-all', '--inh-caps=-all', '--ambient-caps=-all',
            f'--reuid={SCANNER_UID}', f'--regid={SCANNER_UID}', '--clear-groups', *args], {'env': env}


def prepare_scanner_file(path: str) -> None:
    """Даёт инструменту доступ только к конкретному временному JS-файлу (0600)."""
    if os.environ.get('STORM_SCANNER_SANDBOX') == '1':
        os.chown(path, SCANNER_UID, SCANNER_UID)
