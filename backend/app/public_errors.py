"""Публичные сообщения ошибок: технические исключения остаются в логах."""
import re

TECHNICAL_MESSAGE = re.compile(r'(?i)(traceback|sqlalchemy|asyncpg|psycopg|pydantic|\b\w+Error\b|Exception:|ECONN\w+|ENOTFOUND|CERTIFICATE_VERIFY_FAILED|\[Errno|connection refused|connection string|invalid input syntax|SELECT .+ FROM |INSERT INTO |Bearer |access_token|client_secret|password=|<html|<!doctype)')


def public_message(value: object, fallback: str = 'Не удалось выполнить действие. Попробуйте ещё раз.') -> str:
    """Возвращает только короткое бизнес-сообщение без технических подробностей."""
    if not isinstance(value, str) or not value.strip() or len(value) > 1200 or TECHNICAL_MESSAGE.search(value):
        return fallback
    return value.strip()
