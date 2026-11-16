"""Одноразовую выдачу проверяем отдельным тестовым архивом, не расходуя рабочую ссылку."""
from concurrent.futures import ThreadPoolExecutor
from contextlib import contextmanager
import http.client
import threading

from scripts.one_time_download import DownloadConfig, create_server


@contextmanager
def download_server(tmp_path):
    archive = tmp_path / 'storm.tar.gz'
    archive.write_bytes(b'test archive payload')
    config = DownloadConfig(archive, 'test-token-that-is-long-enough-123456', tmp_path / 'consumed')
    server = create_server(config, ('127.0.0.1', 0))
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    try:
        yield config, server.server_port
    finally:
        server.shutdown()
        server.server_close()
        thread.join(timeout=2)


def request(port, method, path, headers=None):
    client = http.client.HTTPConnection('127.0.0.1', port, timeout=5)
    client.request(method, path, headers=headers or {})
    response = client.getresponse()
    result = response.status, response.read(), dict(response.headers)
    client.close()
    return result


def test_page_preview_and_head_do_not_consume_link(tmp_path):
    with download_server(tmp_path) as (config, port):
        for method in ('HEAD', 'GET', 'GET'):
            status, body, headers = request(port, method, '/'+config.token)
            assert status == 200
            assert headers['Cache-Control'].startswith('no-store')
            assert not config.consumed_file.exists()
        assert request(port, 'GET', '/'+config.token+'/download')[0] == 404
        assert not config.consumed_file.exists()


def test_only_one_concurrent_download_and_no_retry_after_restart(tmp_path):
    with download_server(tmp_path) as (config, port):
        with ThreadPoolExecutor(max_workers=6) as pool:
            responses = list(pool.map(lambda _: request(port, 'POST', '/'+config.token+'/download'), range(6)))
        success = [response for response in responses if response[0] == 200]
        assert len(success) == 1 and success[0][1] == b'test archive payload'
        assert all(response[0] in (200,410) for response in responses)
        assert config.consumed_file.exists() and not config.archive.exists()
        assert request(port, 'GET', '/'+config.token)[0] == 410
    second = create_server(config, ('127.0.0.1',0))
    thread = threading.Thread(target=second.serve_forever, daemon=True); thread.start()
    try:
        assert request(second.server_port, 'POST', '/'+config.token+'/download')[0] == 410
    finally:
        second.shutdown(); second.server_close(); thread.join(timeout=2)


def test_invalid_token_and_range_do_not_consume_archive(tmp_path):
    with download_server(tmp_path) as (config, port):
        assert request(port, 'POST', '/wrong/download')[0] == 404
        assert request(port, 'POST', '/'+config.token+'/download', {'Range':'bytes=0-3'})[0] == 416
        assert not config.consumed_file.exists() and config.archive.exists()
