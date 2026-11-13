"""Shared boundaries for untrusted request values and upload streams."""
import math

from fastapi import HTTPException, Request, UploadFile

MAX_RESOURCE_ID = 2**31 - 1


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


async def validate_request_parameters(request: Request) -> None:
    """Validate SQL-bound path IDs before authorization dependencies query the DB."""
    for name, value in request.path_params.items():
        if name.endswith("_id"):
            try:
                number = int(value)
                valid = 1 <= number <= MAX_RESOURCE_ID
            except (ValueError, TypeError):
                valid = False
            if not valid:
                raise HTTPException(422, f"{name}: недопустимый идентификатор")
    for name, value in request.query_params.multi_items():
        if "\x00" in value:
            raise HTTPException(422, f"{name}: NUL-символы недопустимы")
        if name == "page":
            try:
                valid = 1 <= int(value) <= MAX_RESOURCE_ID
            except (ValueError, TypeError):
                valid = False
            if not valid:
                raise HTTPException(422, "page: недопустимая страница")


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
