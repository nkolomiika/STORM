"""Логи сохраняют контекст ошибки, но скрывают секреты и ссылки активации."""
import io
import logging

import pytest
from app.observability import SafeLogFilter, redact_log, request_id


@pytest.mark.parametrize('message,secret', [
    ('password=hunter2', 'hunter2'),
    ('DATA_ENCRYPTION_KEY=private-key', 'private-key'),
    ('JWT_SECRET_KEY=private-jwt-key', 'private-jwt-key'),
    ('{"data_encryption_previous_keys": ["old-private", "second-private"]}', 'second-private'),
    ('{"access_token":"private-token","status":401}', 'private-token'),
    ('Authorization: Bearer private-token', 'private-token'),
    ('Cookie: session=private-token; other=also-private', 'also-private'),
    ('amqp://user:private-token@broker:5672', 'private-token'),
    ('https://app/auth/invitations/private-token/username-available', 'private-token'),
    ('https://app/auth/sso/callback?code=private-token&state=opaque', 'private-token'),
])
def test_redaction_keeps_diagnostics_but_not_secrets(message, secret):
    assert secret not in redact_log(message)
    assert 'REDACTED' in redact_log(message)


def test_traceback_keeps_exception_type_location_and_request_id_without_secret():
    stream = io.StringIO()
    handler = logging.StreamHandler(stream)
    handler.addFilter(SafeLogFilter())
    handler.setFormatter(logging.Formatter('%(levelname)s %(message)s'))
    logger = logging.Logger('isolated-test')
    logger.addHandler(handler)
    context = request_id.set('request-123')
    try:
        try:
            raise RuntimeError('password=do-not-publish')
        except RuntimeError:
            logger.exception('delivery failed job_id=%s', 17)
    finally:
        request_id.reset(context)
    output = stream.getvalue()
    assert 'do-not-publish' not in output
    assert 'RuntimeError' in output and 'request-123' in output and 'job_id=17' in output


def test_uvicorn_access_log_does_not_expose_raw_url():
    record = logging.LogRecord('uvicorn.access', logging.INFO, __file__, 1, '%s - "%s %s HTTP/%s" %d',
                               ('client', 'GET', '/secret-path?token=private-token', '1.1', 200), None)
    SafeLogFilter().filter(record)
    assert '/secret-path' not in record.getMessage() and 'private-token' not in record.getMessage()


@pytest.mark.parametrize('status', [200, 401, 403, 500, 502])
def test_real_uvicorn_access_formatter_accepts_filtered_record(status):
    from uvicorn.logging import AccessFormatter
    record = logging.LogRecord('uvicorn.access', logging.INFO, __file__, 1,
        '%s - "%s %s HTTP/%s" %d', ('client:1234', 'GET', '/auth/callback?code=private-token', '1.0', status), None)
    context = request_id.set('request-uvicorn')
    try:
        SafeLogFilter().filter(record)
        SafeLogFilter().filter(record)
        output = AccessFormatter('%(client_addr)s - "%(request_line)s" %(status_code)s', use_colors=False).format(record)
    finally:
        request_id.reset(context)
    assert str(status) in output and 'GET' in output
    assert 'private-token' not in output and '/auth/callback' not in output


def test_database_debug_logging_hides_bound_values():
    from app.database import engine
    assert engine.sync_engine.hide_parameters is True
