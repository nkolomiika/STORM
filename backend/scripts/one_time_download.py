"""Одноразовая выдача архива STORM без внешних зависимостей.

Запуск: python3 one_time_download.py --config /защищённый/каталог/config.json
Конфигурация: archive, token, consumed_file; необязательно host, port, commit,
sha256, certificate, private_key. По умолчанию слушает 127.0.0.1:8765 за HTTPS-прокси.
Секретный URL открывает страницу. Только POST кнопки расходует скачивание.
Начатое скачивание необратимо, включая обрыв соединения; повторная выдача запрещена.
"""
import argparse
from dataclasses import dataclass
from datetime import datetime, timezone
import hmac
import html
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json
import logging
import os
from pathlib import Path
import re
import shutil
import ssl
from urllib.parse import urlsplit

logger = logging.getLogger('storm.download')


@dataclass(frozen=True)
class DownloadConfig:
    """Пути приватного архива и постоянного признака использования, секрет ссылки."""
    archive: Path
    token: str
    consumed_file: Path
    commit: str = ''
    sha256: str = ''

    def __post_init__(self) -> None:
        """Не допускает слабый/небезопасный URL-токен и совпадение архива с маркером."""
        if not re.fullmatch(r'[A-Za-z0-9_-]{32,128}', self.token):
            raise ValueError('Нужен случайный URL-токен длиной не менее 32 символов')
        if self.archive.resolve() == self.consumed_file.resolve():
            raise ValueError('Архив и маркер скачивания должны быть разными файлами')


def create_server(config: DownloadConfig, address: tuple[str, int] = ('127.0.0.1', 8765)) -> ThreadingHTTPServer:
    """Создаёт сервер: GET/HEAD не расходуют ссылку, O_EXCL разрешает ровно один POST.

    Маркер сохраняется после перезапуска. Архив удаляется после начатой выдачи.
    Недействительные URL и Range-запросы не получают содержимого архива.
    """
    class Handler(BaseHTTPRequestHandler):
        server_version = 'STORM'
        sys_version = ''

        def log_message(self, format: str, *args) -> None:
            """Не записывает URL-токен, IP посетителя и заголовки в access-лог."""
            return

        def _route(self, suffix: str = '') -> bool:
            """Сравнивает секретный путь без утечки по времени и не принимает query string."""
            try:
                parsed = urlsplit(self.path)
            except ValueError:
                return False
            expected = '/' + config.token + suffix
            return not parsed.query and hmac.compare_digest(parsed.path.encode(), expected.encode())

        def _headers(self, status: int, length: int, content_type: str = 'text/html; charset=utf-8') -> None:
            """Запрещает кеширование, индексацию, MIME-sniffing и утечку секретной ссылки."""
            self.send_response(status)
            self.send_header('Content-Type', content_type)
            self.send_header('Content-Length', str(length))
            self.send_header('Cache-Control', 'no-store, private, max-age=0')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Referrer-Policy', 'no-referrer')
            self.send_header('X-Content-Type-Options', 'nosniff')
            self.send_header('X-Robots-Tag', 'noindex, nofollow, noarchive')
            self.send_header('Content-Security-Policy', "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'")

        def _page(self, status: int, message: str, button: bool = False) -> None:
            """Показывает русскую страницу без внешних ресурсов; HEAD не отдаёт тело."""
            form = f'<form action="/{config.token}/download" method="post"><button type="submit">Скачать архив</button></form>' if button else ''
            details = f'<p class="meta">Версия: {html.escape(config.commit[:12])}</p><p class="meta">SHA-256: {html.escape(config.sha256)}</p>' if button else ''
            data = f'''<!doctype html><html lang="ru"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>STORM — скачать архив</title><style>body{{margin:0;min-height:100vh;display:grid;place-items:center;background:#eef1f6;color:#0f1b2d;font:16px system-ui,sans-serif}}main{{max-width:560px;margin:24px;padding:36px;background:#fff;border-radius:18px;box-shadow:0 10px 40px #0f1b2d12}}h1{{margin-top:0}}p{{line-height:1.6}}button{{border:0;border-radius:10px;background:#2e5fbf;color:white;font:600 16px system-ui;padding:14px 22px;cursor:pointer}}button:hover{{background:#214b9f}}.meta{{font-size:12px;color:#5a6b84;overflow-wrap:anywhere}}</style>
<main><h1>Архив STORM</h1><p>{html.escape(message)}</p>{form}{details}</main></html>'''.encode()
            self._headers(status, len(data))
            self.end_headers()
            if self.command != 'HEAD':
                self.wfile.write(data)

        def do_GET(self) -> None:
            """Показывает кнопку без расходования ссылки; использованная ссылка возвращает 410."""
            if not self._route():
                return self._page(404, 'Страница не найдена.')
            if config.consumed_file.exists():
                return self._page(410, 'Ссылка уже использована. Повторное скачивание недоступно.')
            if not config.archive.is_file():
                return self._page(503, 'Архив пока недоступен. Попробуйте позже.')
            self._page(200, 'Архив можно скачать только один раз. Ссылка будет использована при нажатии кнопки. Дождитесь завершения загрузки: повторное скачивание после обрыва недоступно.', True)

        def do_HEAD(self) -> None:
            """Проверка ссылки и предпросмотр не расходуют скачивание."""
            self.do_GET()

        def do_POST(self) -> None:
            """Атомарно резервирует единственную выдачу и удаляет архив после попытки."""
            if not self._route('/download'):
                return self._page(404, 'Страница не найдена.')
            if self.headers.get('Range'):
                return self._page(416, 'Частичное скачивание не поддерживается.')
            try:
                length = int(self.headers.get('Content-Length', '0'))
            except ValueError:
                return self._page(400, 'Некорректный запрос.')
            if length < 0 or length > 1024:
                return self._page(413, 'Некорректный запрос.')
            if config.consumed_file.exists():
                return self._page(410, 'Ссылка уже использована. Повторное скачивание недоступно.')
            try:
                archive = config.archive.open('rb')
            except OSError:
                return self._page(503, 'Архив пока недоступен. Попробуйте позже.')
            try:
                try:
                    descriptor = os.open(config.consumed_file, os.O_CREAT | os.O_EXCL | os.O_WRONLY, 0o600)
                except FileExistsError:
                    return self._page(410, 'Ссылка уже использована. Повторное скачивание недоступно.')
                except OSError:
                    logger.exception('download_reservation_failed')
                    return self._page(503, 'Не удалось начать скачивание. Попробуйте позже.')
                with os.fdopen(descriptor, 'w') as marker:
                    marker.write(datetime.now(timezone.utc).isoformat())
                logger.info('download_started commit=%s', config.commit[:12])
                try:
                    self._headers(200, os.fstat(archive.fileno()).st_size, 'application/gzip')
                    self.send_header('Content-Disposition', 'attachment; filename="storm.tar.gz"')
                    self.end_headers()
                    shutil.copyfileobj(archive, self.wfile, length=1024 * 1024)
                    self.wfile.flush()
                    logger.info('download_finished commit=%s', config.commit[:12])
                except (BrokenPipeError, ConnectionResetError, OSError):
                    logger.warning('download_interrupted commit=%s link_consumed=true', config.commit[:12])
                finally:
                    try:
                        config.archive.unlink(missing_ok=True)
                    except OSError:
                        logger.exception('download_archive_cleanup_failed')
            finally:
                archive.close()

    server = ThreadingHTTPServer(address, Handler)
    server.daemon_threads = True
    return server


def main() -> None:
    """Читает приватную конфигурацию и запускает сервер; TLS использует существующий сертификат."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--config', required=True, type=Path)
    args = parser.parse_args()
    values = json.loads(args.config.read_text())
    config = DownloadConfig(Path(values['archive']), values['token'], Path(values['consumed_file']), values.get('commit', ''), values.get('sha256', ''))
    server = create_server(config, (values.get('host', '127.0.0.1'), int(values.get('port', 8765))))
    if values.get('certificate') and values.get('private_key'):
        context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
        context.minimum_version = ssl.TLSVersion.TLSv1_2
        context.load_cert_chain(values['certificate'], values['private_key'])
        server.socket = context.wrap_socket(server.socket, server_side=True)
    logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')
    logger.info('download_service_started port=%s', server.server_port)
    try:
        server.serve_forever()
    finally:
        server.server_close()


if __name__ == '__main__':
    main()
