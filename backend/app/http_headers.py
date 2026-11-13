"""HTTP-заголовки скачивания без raw Unicode и некорректного quoted-string."""
from typing import Literal
from urllib.parse import quote


def content_disposition(filename: str, disposition: Literal["inline", "attachment"] = "attachment") -> str:
    """Сохраняет имя файла через UTF-8 filename*, если оно требует экранирования.

    Заголовки Starlette кодируются latin-1: кириллица в обычном filename иначе
    вызывает UnicodeEncodeError и HTTP 500. Простые ASCII-имена не меняются.
    """
    encoded = quote(filename, safe="")
    if encoded == filename:
        return f'{disposition}; filename="{filename}"'
    return f"{disposition}; filename*=UTF-8''{encoded}"
