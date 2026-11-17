class StormError(Exception):
    """Базовое исключение приложения."""


class NotFoundError(StormError):
    """Сущность не найдена."""


class ForbiddenError(StormError):
    """Доступ запрещён."""


class ConflictError(StormError):
    """Конфликт данных."""


class UnauthorizedError(StormError):
    """Ошибка аутентификации."""


class ValidationError(StormError):
    """Ошибка бизнес-валидации."""


class ServiceUnavailableError(StormError):
    """Недоступная интеграция; code и текст предназначены для интерфейса."""
    def __init__(self, message: str, code: str = 'service_unavailable') -> None:
        super().__init__(message)
        self.code = code


class UpstreamServiceError(ServiceUnavailableError):
    """Отказ внешнего сервиса: безопасный текст и код, HTTP 502."""
