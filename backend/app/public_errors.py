"""Публичные сообщения ошибок: технические исключения остаются в логах."""
import re

ERROR_CODES = {400: 'bad_request', 401: 'unauthorized', 403: 'forbidden', 404: 'not_found',
               405: 'method_not_allowed', 409: 'conflict', 413: 'payload_too_large',
               422: 'validation_error', 429: 'rate_limited', 500: 'internal_error',
               502: 'upstream_error', 503: 'service_unavailable', 504: 'upstream_timeout'}


def error_payload(status: int, detail: object, identifier: str, code: object = None) -> dict:
    """Единый совместимый формат всех HTTP-ошибок: текст, код и request_id."""
    valid_code = code if isinstance(code, str) and re.fullmatch(r'[a-z][a-z0-9_]{0,63}', code) else ERROR_CODES.get(status, 'request_failed')
    return {'detail': public_message(detail), 'code': valid_code, 'request_id': identifier}

TECHNICAL_MESSAGE = re.compile(r'(?i)(traceback|sqlalchemy|asyncpg|psycopg|pydantic|\b\w+Error\b|Exception:|ECONN\w+|ENOTFOUND|CERTIFICATE_VERIFY_FAILED|\[Errno|connection refused|connection string|invalid input syntax|SELECT .+ FROM |INSERT INTO |Bearer |access_token|client_secret|password=|<html|<!doctype)')


def public_message(value: object, fallback: str = 'Не удалось выполнить действие. Попробуйте ещё раз.') -> str:
    """Возвращает только короткое бизнес-сообщение без технических подробностей."""
    if not isinstance(value, str) or not value.strip() or len(value) > 1200 or TECHNICAL_MESSAGE.search(value):
        return fallback
    return value.strip()
