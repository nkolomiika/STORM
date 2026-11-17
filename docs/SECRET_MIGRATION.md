# Перенос credentials и TOTP на независимый ключ

В новых установках задайте **разные** `JWT_SECRET_KEY` и `DATA_ENCRYPTION_KEY`
в менеджере секретов и окружении контейнеров. Оба — случайные, минимум 32 символа.
Сохраните ключ данных отдельно: он не должен генерироваться заново при деплое.
Пароли входа пользователей остаются хешами bcrypt; перенос относится к паролям
проектов и секретам TOTP, которым нужна обратимая расшифровка.

## Обновление существующей установки

1. Сделайте защищённую резервную копию БД и прежних ключей. Создайте новый
   независимый `DATA_ENCRYPTION_KEY` в `.env.prod`/секрет-хранилище. Не используйте
   текущий или прежний JWT в качестве нового активного ключа данных.
2. Остановите процессы, которые пишут секреты. Доступ к БД остаётся нужен утилите.
3. Выполните проверку без записи. Затем примените перенос с тем же окружением.
4. Уберите исторический JWT из окружения утилиты, запустите обновлённые сервисы.

Для prod-compose из корня проекта:

```bash
export ENV_FILE=.env.prod
docker compose -f docker-compose.yml -f docker-compose.prod.yml build backend
docker compose -f docker-compose.yml -f docker-compose.prod.yml stop backend mail-worker recon-worker
```

Если данные шифровались **нынешним** `JWT_SECRET_KEY`:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml run --rm --no-deps backend \
  python -m scripts.rotate_data_encryption_key --include-current-jwt
# Только при ok=true и unreadable=0:
docker compose -f docker-compose.yml -f docker-compose.prod.yml run --rm --no-deps backend \
  python -m scripts.rotate_data_encryption_key --include-current-jwt --apply
```

Если JWT уже менялся, введите **прежний** секрет приватно, не аргументом команды:

```bash
read -rs -p 'Прежний ключ шифрования/JWT: ' STORM_OLD_KEY; echo
export STORM_LEGACY_ENCRYPTION_KEYS="$(printf '%s' "$STORM_OLD_KEY" | python3 -c 'import json,sys; print(json.dumps([sys.stdin.read()]))')"
unset STORM_OLD_KEY
docker compose -f docker-compose.yml -f docker-compose.prod.yml run --rm --no-deps \
  -e STORM_LEGACY_ENCRYPTION_KEYS backend python -m scripts.rotate_data_encryption_key
# Только при ok=true и unreadable=0:
docker compose -f docker-compose.yml -f docker-compose.prod.yml run --rm --no-deps \
  -e STORM_LEGACY_ENCRYPTION_KEYS backend python -m scripts.rotate_data_encryption_key --apply
unset STORM_LEGACY_ENCRYPTION_KEYS
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build backend mail-worker recon-worker
```

После первого варианта запуска также выполните последнюю команду `up`.
Не используйте shell tracing (`set -x`) при работе с ключами.

Вывод утилиты содержит только `ok`, `examined`, `already_current`, `to_rotate`,
`unreadable`, `applied`. Exit 0 — проверка/перенос успешны, exit 2 — отказ.
При `unreadable>0` изменения всей транзакции отменяются. Добавьте отсутствующий
исторический ключ через защищённое окружение и повторите. Не удаляйте строки,
чтобы «пропустить» отказ. Без исторического ключа старое содержимое не восстановить;
при необходимости администратор отдельно заменяет пароли и сбрасывает TOTP.

Утилита переносит прежний алгоритм Fernet/SHA-256 без потери Unicode-значений,
не меняет метаданные и даты записей. Повторный запуск уже на новом ключе ничего
не перешифровывает. `DATA_ENCRYPTION_PREVIOUS_KEYS` предназначен только для ротации
независимых ключей данных; перенос со старого JWT выполняется только утилитой.

Резервные копии до переноса всё ещё зашифрованы прежним ключом. Перешифрование
живой БД не меняет такие копии и не отменяет доступ, уже полученный до ротации.
