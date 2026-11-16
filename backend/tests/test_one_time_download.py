"""Одноразовую выдачу проверяем отдельным тестовым архивом, не расходуя рабочую ссылку."""
from concurrent.futures import ThreadPoolExecutor
from contextlib import contextmanager
import http.client
import threading
from unittest.mock import patch

import pytest

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


def test_head_does_not_consume_link_and_get_downloads_directly(tmp_path):
    with download_server(tmp_path) as (config, port):
        for _ in range(2):
            status, body, headers = request(port, 'HEAD', '/'+config.token)
            assert status == 200
            assert body == b''
            assert headers['Content-Type'] == 'application/gzip'
            assert int(headers['Content-Length']) == len(b'test archive payload')
            assert 'attachment;' in headers['Content-Disposition']
            assert headers['Cache-Control'].startswith('no-store')
            assert not config.consumed_file.exists()
        status, body, headers = request(port, 'GET', '/'+config.token)
        assert status == 200 and body == b'test archive payload'
        assert headers['Content-Type'] == 'application/gzip'
        assert 'attachment;' in headers['Content-Disposition']
        assert config.consumed_file.exists()
        assert request(port, 'HEAD', '/'+config.token)[0] == 410


def test_only_one_concurrent_download_and_no_retry_after_restart(tmp_path):
    with download_server(tmp_path) as (config, port):
        with ThreadPoolExecutor(max_workers=6) as pool:
            responses = list(pool.map(lambda _: request(port, 'GET', '/'+config.token), range(6)))
        success = [response for response in responses if response[0] == 200]
        assert len(success) == 1 and success[0][1] == b'test archive payload'
        assert all(response[0] in (200,410) for response in responses)
        assert config.consumed_file.exists() and not config.archive.exists()
        assert request(port, 'GET', '/'+config.token)[0] == 410
    second = create_server(config, ('127.0.0.1',0))
    thread = threading.Thread(target=second.serve_forever, daemon=True); thread.start()
    try:
        assert request(second.server_port, 'GET', '/'+config.token)[0] == 410
    finally:
        second.shutdown(); second.server_close(); thread.join(timeout=2)


def test_invalid_token_and_range_do_not_consume_archive(tmp_path):
    with download_server(tmp_path) as (config, port):
        for path in ('/wrong', '/'+config.token+'/download', '/'+config.token+'?extra=1'):
            assert request(port, 'GET', path)[0] == 404
        assert request(port, 'POST', '/'+config.token+'/download')[0] == 405
        assert request(port, 'GET', '/'+config.token, {'Range':'bytes=0-3'})[0] == 416
        assert not config.consumed_file.exists() and config.archive.exists()


def test_missing_archive_does_not_consume_link(tmp_path):
    with download_server(tmp_path) as (config, port):
        config.archive.unlink()
        for method in ('GET', 'HEAD'):
            assert request(port, method, '/'+config.token)[0] == 503
        assert not config.consumed_file.exists()


def test_interrupted_download_consumes_link_and_removes_archive(tmp_path):
    with download_server(tmp_path) as (config, port):
        with patch('scripts.one_time_download.shutil.copyfileobj', side_effect=BrokenPipeError):
            with pytest.raises(http.client.IncompleteRead):
                request(port, 'GET', '/'+config.token)
        assert config.consumed_file.exists()
        assert not config.archive.exists()
        assert request(port, 'GET', '/'+config.token)[0] == 410
