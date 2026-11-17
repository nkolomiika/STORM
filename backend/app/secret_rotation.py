"""Атомарный перенос credentials и TOTP на текущий независимый ключ данных."""
from dataclasses import dataclass

from cryptography.fernet import InvalidToken
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.models import ProjectCredential, User
from app.security import _fernet


@dataclass
class RotationResult:
    """Безопасная статистика без секретов, шифртекстов и содержимого записей."""
    examined: int = 0
    already_current: int = 0
    to_rotate: int = 0
    unreadable: int = 0
    applied: bool = False


class SecretRotationError(Exception):
    """Хотя бы одна запись не читается: изменения всей транзакции отменены."""
    def __init__(self, result: RotationResult):
        super().__init__('Перенос отменён: не все секреты доступны для расшифровки.')
        self.result = result


async def rotate_stored_secrets(db: AsyncSession, *, legacy_keys: list[str] | None = None,
                                apply: bool = False) -> RotationResult:
    """Проверяет все записи; при apply атомарно перешифровывает старые.

    Вызывать с новой сессией, при остановленных процессах, пишущих секреты.
    Исторические ключи, включая прежний JWT, передаются только этой утилите.
    Чтение идёт страницами по 500 строк. Нечитаемая запись отменяет весь перенос.
    Повторный запуск не меняет уже перенесённые значения и время их обновления.
    """
    settings = get_settings()
    active = _fernet(settings.data_encryption_key)
    historical = [_fernet(key) for key in dict.fromkeys([
        *settings.data_encryption_previous_keys, *(legacy_keys or [])
    ]) if key != settings.data_encryption_key]
    result = RotationResult()
    async with db.begin():
        for model, field in [(ProjectCredential, ProjectCredential.password_encrypted), (User, User.totp_secret)]:
            last_id = 0
            while True:
                query = select(model.id, field).where(model.id > last_id, field.is_not(None)).order_by(model.id).limit(500)
                if apply:
                    query = query.with_for_update()
                rows = (await db.execute(query)).all()
                if not rows:
                    break
                for identifier, ciphertext in rows:
                    last_id = identifier
                    result.examined += 1
                    try:
                        active.decrypt(ciphertext.encode()).decode('utf-8')
                        result.already_current += 1
                        continue
                    except (InvalidToken, UnicodeDecodeError):
                        pass
                    plaintext = None
                    for previous in historical:
                        try:
                            plaintext = previous.decrypt(ciphertext.encode()).decode('utf-8')
                            break
                        except (InvalidToken, UnicodeDecodeError):
                            continue
                    if plaintext is None:
                        result.unreadable += 1
                        continue
                    result.to_rotate += 1
                    if apply:
                        values = {field.key: active.encrypt(plaintext.encode('utf-8')).decode('ascii')}
                        if hasattr(model, 'updated_at'):
                            values['updated_at'] = model.updated_at
                        await db.execute(update(model).where(model.id == identifier).values(**values))
        if result.unreadable:
            raise SecretRotationError(result)
    result.applied = apply
    return result
