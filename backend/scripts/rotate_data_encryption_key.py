"""Перенос секретов на DATA_ENCRYPTION_KEY; по умолчанию только проверка.

Запуск: python -m scripts.rotate_data_encryption_key [--apply] [--include-current-jwt]
Иные прежние ключи: STORM_LEGACY_ENCRYPTION_KEYS как JSON-массив через защищённое
окружение. Ключи не передаются аргументами процесса и не выводятся.
"""
import argparse
import asyncio
from dataclasses import asdict
import json
import os

from app.config import get_settings
from app.database import SessionLocal, engine
from app.secret_rotation import SecretRotationError, rotate_stored_secrets


def migration_keys(include_current_jwt: bool) -> list[str]:
    """Читает старые ключи только для переноса, без подключения их к приложению."""
    try:
        keys = json.loads(os.environ.get('STORM_LEGACY_ENCRYPTION_KEYS', '[]'))
    except (ValueError, RecursionError) as exc:
        raise ValueError('STORM_LEGACY_ENCRYPTION_KEYS должен быть JSON-массивом ключей') from exc
    if not isinstance(keys, list) or len(keys) > 5 or any(not isinstance(key, str) or len(key.strip()) < 32 for key in keys):
        raise ValueError('Укажите не более пяти прежних ключей длиной от 32 символов')
    if include_current_jwt:
        keys.append(get_settings().jwt_secret_key)
    return keys


async def run(*, apply: bool, include_current_jwt: bool) -> int:
    """Печатает только итоговые счётчики; отказ не оставляет частичного переноса."""
    try:
        keys = migration_keys(include_current_jwt)
        async with SessionLocal() as db:
            try:
                result = await rotate_stored_secrets(db, legacy_keys=keys, apply=apply)
            except SecretRotationError as exc:
                print(json.dumps({'ok': False, **asdict(exc.result)}, ensure_ascii=False))
                return 2
        print(json.dumps({'ok': True, **asdict(result)}, ensure_ascii=False))
        return 0
    except ValueError:
        print('Неверные настройки прежних ключей. Проверьте защищённое окружение.')
        return 2
    except Exception:
        print('Не удалось завершить перенос. Проверьте доступ к БД; изменения транзакции отменены.')
        return 2
    finally:
        await engine.dispose()


def main() -> None:
    """Разбирает режим проверки или явного применения миграции."""
    parser = argparse.ArgumentParser(description='Атомарный перенос секретов на отдельный ключ данных')
    parser.add_argument('--apply', action='store_true', help='Перешифровать; без флага только проверка')
    parser.add_argument('--include-current-jwt', action='store_true', help='Проверить текущий JWT как прежний ключ только при переносе')
    args = parser.parse_args()
    raise SystemExit(asyncio.run(run(apply=args.apply, include_current_jwt=args.include_current_jwt)))


if __name__ == '__main__':
    main()
