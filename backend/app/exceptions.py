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
