"""Безопасные технические логи и связь HTTP-запросов с пользовательскими ошибками."""
import contextvars
import asyncio
import logging
import json
import re
import time
import traceback
from uuid import uuid4
from app.public_errors import error_payload

request_id = contextvars.ContextVar('storm_request_id', default='')
logger = logging.getLogger('storm.http')
logger.setLevel(logging.INFO)
_SECRET = re.compile(r'''(?i)(["']?(?:access_token|refresh_token|id_token|client_secret|jwt_secret_key|data_encryption_key|password|authorization|cookie|api[_-]?token)["']?\s*[:=]\s*)(?:["'][^"']*["']|[^\s,;}]+)''')


def redact_log(value: str) -> str:
    """Убирает секреты из сообщений и traceback, сохраняя тип и место ошибки."""
    value = re.sub(r'''(?is)(["']?data_encryption_previous_keys["']?\s*[:=]\s*)\[[^\]]*\]''', r'\1[REDACTED]', value)
    value = re.sub(r'(?im)(\b(?:cookie|set-cookie)\s*[:=]\s*)[^\r\n]+', r'\1[REDACTED]', value)
    value = re.sub(r'(/auth/(?:invitations|password-reset|reactivate)/)(?!\{)[^/?\s"\']+', r'\1[REDACTED]', value)
    value = re.sub(r'\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+', '[REDACTED_JWT]', value)
    value = re.sub(r'(?i)\b(Bearer|Basic)\s+[^\s,;"\']+', r'\1 [REDACTED]', value)
    value = re.sub(r'(://[^\s/:]+:)[^\s@]+@', r'\1[REDACTED]@', value)
    value = _SECRET.sub(r'\1[REDACTED]', value)
    return re.sub(r'(?i)([?&](?:token|code|state|secret|key)=)[^\s&"\']+', r'\1[REDACTED]', value)


class SafeLogFilter(logging.Filter):
    """Скрывает секреты, raw URL access-логов и добавляет идентификатор запроса."""
    def filter(self, record: logging.LogRecord) -> bool:
        if getattr(record, '_storm_filtered', False):
            return True
        record._storm_filtered = True
        access_record = record.name == 'uvicorn.access' and isinstance(record.args, tuple) and len(record.args) == 5
        if access_record:
            record.args = (*record.args[:2], '[route in storm.http]', *record.args[3:])
        identifier = request_id.get()
        record.storm_request_id = identifier
        # AccessFormatter распаковывает исходные пять аргументов. Их нельзя
        # заменять готовой строкой; request ID уже есть в storm.http.
        if not access_record:
            message = redact_log(record.getMessage())
            record.msg = f'request_id={identifier} {message}' if identifier else message
            record.args = ()
        if record.exc_info:
            record.exc_text = redact_log(''.join(traceback.format_exception(*record.exc_info)))
            record.exc_info = None
        elif record.exc_text:
            record.exc_text = redact_log(record.exc_text)
        return True


def configure_logging() -> None:
    """Настраивает фильтры существующих обработчиков без сброса чужой конфигурации."""
    logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(name)s %(message)s')
    logging.getLogger('storm.works').setLevel(logging.INFO)
    logging.getLogger('httpx').setLevel(logging.WARNING)
    logging.getLogger('httpcore').setLevel(logging.WARNING)
    handlers = [*logging.getLogger().handlers]
    for name in ('uvicorn', 'uvicorn.error', 'uvicorn.access'):
        handlers.extend(logging.getLogger(name).handlers)
    for handler in set(handlers):
        if not any(isinstance(item, SafeLogFilter) for item in handler.filters):
            handler.addFilter(SafeLogFilter())


class RequestLogMiddleware:
    """Логирует итог запроса: шаблон маршрута, статус, длительность и request ID.

    Тело, query string, cookie и реальные сегменты токенов не записываются.
    Идентификатор возвращается заголовком X-Request-ID, в том числе при 500.
    """
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope['type'] != 'http':
            return await self.app(scope, receive, send)
        identifier = uuid4().hex
        scope.setdefault('state', {})['request_id'] = identifier
        context = request_id.set(identifier)
        started = time.monotonic()
        status = 500
        pending_start = None
        error_body = bytearray()
        async def send_response(message):
            nonlocal status, pending_start
            if message['type'] == 'http.response.start':
                status = message['status']
                message['headers'] = [(k, v) for k, v in message.get('headers', []) if k.lower() != b'x-request-id'] + [(b'x-request-id', identifier.encode())]
                if status >= 400:
                    pending_start = message
                    return
            if message['type'] == 'http.response.body' and pending_start is not None:
                error_body.extend(message.get('body', b'')[:max(0, 65537-len(error_body))])
                if message.get('more_body', False):
                    return
                try:
                    body = json.loads(error_body) if len(error_body) <= 65536 else {}
                except (ValueError, RecursionError):
                    body = {}
                if not isinstance(body, dict):
                    body = {}
                payload = error_payload(status, body.get('detail', 'Не удалось выполнить запрос.'), identifier, body.get('code'))
                encoded = json.dumps(payload, ensure_ascii=False).encode('utf-8')
                pending_start['headers'] = [(k, v) for k, v in pending_start['headers'] if k.lower() not in (b'content-length', b'content-type', b'content-encoding')] + [(b'content-type', b'application/json'), (b'content-length', str(len(encoded)).encode())]
                await send(pending_start)
                return await send({'type': 'http.response.body', 'body': encoded})
            await send(message)
        try:
            await self.app(scope, receive, send_response)
        except asyncio.CancelledError:
            status = 499
            raise
        finally:
            route = getattr(scope.get('route'), 'path', '<unmatched>')
            logger.log(logging.ERROR if status >= 500 else logging.INFO,
                       'request_completed method=%s route=%s status=%s actor_id=%s duration_ms=%.1f',
                       scope.get('method'), route, status, scope['state'].get('actor_id'), (time.monotonic() - started) * 1000)
            request_id.reset(context)
