"""Единые правила дополнения существующего эндпоинта при добавлении и импорте."""
from app.models import Endpoint


def merge_endpoint_fields(endpoint: Endpoint, payload: dict) -> None:
    """Заполняет только пустые поля; не перезаписывает уже сохранённый запрос.

    Используется ручным добавлением и обоими импортами. Транзакцией управляет
    вызывающий сервис; функция не выполняет SQL и не меняет идентификатор.
    """
    for name in ('description', 'query_params', 'request_body', 'request_content_type', 'request_headers'):
        if not getattr(endpoint, name) and payload.get(name):
            setattr(endpoint, name, payload[name])
