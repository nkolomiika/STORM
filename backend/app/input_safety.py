"""Shared boundaries for untrusted request values and upload streams."""
import math
from ipaddress import ip_address
from typing import NoReturn

from fastapi import HTTPException, UploadFile, WebSocketException
from starlette.requests import HTTPConnection

MAX_RESOURCE_ID = 2**31 - 1


def normalize_ip_literal(value: object) -> str:
    """Принимает только IPv4/IPv6-литерал, без URL, порта или zone-id."""
    if not isinstance(value, str) or '%' in value or len(value.strip()) > 45:
        raise ValueError('Укажите корректный IPv4 или IPv6 адрес')
    try:
        return str(ip_address(value.strip()))
    except ValueError as exc:
        raise ValueError('Укажите корректный IPv4 или IPv6 адрес') from exc


def validate_json_value(value: object, depth: int = 0) -> None:
    """Reject PostgreSQL-incompatible strings, nonfinite numbers and recursive YAML."""
    if depth > 64:
        raise ValueError("Входные данные имеют слишком большую вложенность")
    if isinstance(value, str) and "\x00" in value:
        raise ValueError("NUL-символы недопустимы")
    if isinstance(value, float) and not math.isfinite(value):
        raise ValueError("NaN и Infinity недопустимы")
    if isinstance(value, dict):
        for key, item in value.items():
            validate_json_value(key, depth + 1)
            validate_json_value(item, depth + 1)
    elif isinstance(value, (list, tuple)):
        for item in value:
            validate_json_value(item, depth + 1)


def _reject_request_parameter(request: HTTPConnection, detail: str) -> NoReturn:
    """Отклоняет HTTP с 422, а WebSocket — кодом 1008 без необработанного ASGI-сбоя."""
    if request.scope['type'] == 'websocket':
        # Причина закрытия ограничена 123 байтами; имя query-параметра не ограничено.
        raise WebSocketException(code=1008, reason='Некорректные параметры запроса')
    raise HTTPException(422, detail)


async def validate_request_parameters(request: HTTPConnection) -> None:
    """Проверяет ID и query до запросов к БД для HTTP и WebSocket-соединений."""
    for name, value in request.path_params.items():
        if name.endswith("_id"):
            try:
                number = int(value)
                valid = 1 <= number <= MAX_RESOURCE_ID
            except (ValueError, TypeError):
                valid = False
            if not valid:
                _reject_request_parameter(request, f"{name}: недопустимый идентификатор")
    for name, value in request.query_params.multi_items():
        if "\x00" in value:
            _reject_request_parameter(request, f"{name}: NUL-символы недопустимы")
        if name == "page":
            try:
                valid = 1 <= int(value) <= MAX_RESOURCE_ID
            except (ValueError, TypeError):
                valid = False
            if not valid:
                _reject_request_parameter(request, "page: недопустимая страница")


async def read_upload(upload: UploadFile, limit: int) -> bytes:
    """Read at most limit+1 bytes, including when Content-Length is absent."""
    content = await upload.read(limit + 1)
    if len(content) > limit:
        raise HTTPException(413, "Размер файла превышает допустимый предел")
    return content


class SecurityHeadersMiddleware:
    """Protect API responses from MIME sniffing and leaking link tokens in Referer."""
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        async def secure_send(message):
            if message["type"] == "http.response.start":
                headers = list(message.get("headers", []))
                existing = {name.lower() for name, _ in headers}
                for name, value in [(b"x-content-type-options", b"nosniff"), (b"referrer-policy", b"no-referrer"),
                                    (b"x-frame-options", b"DENY"), (b"cache-control", b"no-store")]:
                    if name not in existing:
                        headers.append((name, value))
                message = {**message, "headers": headers}
            await send(message)
        await self.app(scope, receive, secure_send)
