# Аутентификация и эндпоинты

Машинный доступ идёт в префикс `/api/v2`. Каждый запрос аутентифицируется agent-токеном, а доступ к конкретному эндпоинту проверяется по **scope** токена и его допуску к проекту.

## Аутентификация

Передавайте токен в заголовке `Authorization` по схеме Bearer:

```
Authorization: Bearer <ваш_токен>
```

Пользовательские cookie для v2 не нужны и не используются — токен самодостаточен. Если у токена нет нужного scope или он не допущен к проекту, эндпоинт вернёт ошибку доступа.

## Доступные эндпоинты

Каждый эндпоинт требует свой scope (в скобках):

**Проекты**
- `GET /api/v2/projects` — проекты, доступные токену: все или из списка допуска (`projects:read`).
- `GET /api/v2/projects/{id}` — один проект (`projects:read`).

**Хосты и активы**
- `GET /api/v2/projects/{id}/hosts` — список хостов проекта (`assets:read`); `page` начинается с 1, `size` от 1 до 200 (по умолчанию 100). `origin=host` возвращает обычные хосты, `origin=ip` — служебные родители отдельных IP, `origin=all` — оба вида.
- `GET /api/v2/projects/{id}/hosts/{host_id}` — хост с вложенными сущностями (`assets:read`).
- `POST /api/v2/projects/{id}/hosts` — добавить хост и его IP (`assets:write`). Нужен `hostname` или хотя бы один IP в `ip_address` / `ip_addresses`.
- `GET /api/v2/projects/{id}/hosts/{host_id}/endpoints` — эндпоинты хоста (`assets:read`), массив без пагинации.
- `GET /api/v2/projects/{id}/hosts/{host_id}/endpoints/{endpoint_id}` — один эндпоинт (`assets:read`).
- `POST /api/v2/projects/{id}/hosts/{host_id}/endpoints` — добавить эндпоинт (`assets:write`). Передайте `path` с необязательным `method` либо полный `request_raw`. Доступны `description`, `query_params`, `request_headers`, `request_body`, `request_content_type`.
- `GET /api/v2/projects/{id}/ip-addresses` — страница IP с портами и сервисами (`assets:read`). Параметры `page` и `size` как у хостов; необязательный `host_id` фильтрует по хосту проекта.
- `GET /api/v2/projects/{id}/ip-addresses/{ip_id}` — одна привязка IP (`assets:read`). `ip_id` — числовой ID из ответа, а не текст адреса.
- `POST /api/v2/projects/{id}/ip-addresses` — добавить IP (`assets:write`): обязательный `ip_address` (IPv4/IPv6), необязательные `host_id`, `label`, `is_primary`.

Без `host_id` для IP создаётся отдельный актив со служебным хостом `origin=ip`; с `host_id` адрес добавляется к существующему хосту этого проекта. Первый адрес становится основным автоматически, а `is_primary=true` переключает основной адрес без удаления старых адресов и портов. Повторная отправка того же адреса тому же хосту возвращает существующую привязку без изменений. Один IP, привязанный к разным хостам, представлен разными записями.

Эти POST-методы возвращают `201`. Они сохраняют данные в БД: не выполняют DNS, HTTP-запросы, пробив IP или сканирование. Добавление внутреннего IP в инвентаризацию само по себе не даёт сетевого доступа к нему.

**Учётные данные**
- `GET /api/v2/projects/{id}/credentials` — все учётные данные проекта (`credentials:read`), массив без пагинации.
- `GET /api/v2/projects/{id}/credentials/{credential_id}` — одна учётная запись (`credentials:read`).

Ответ содержит `username`, `password`, `password_available`, `host`, автора и даты. Пароль возвращается расшифрованным только при наличии отдельного права. Если старый пароль не читается текущими ключами шифрования, `password=null`, `password_available=false`, остальные записи продолжают возвращаться. Ответы с учётными данными имеют `Cache-Control: no-store`.

**Уязвимости**
- `GET /api/v2/projects/{id}/hosts/{host_id}/vulnerabilities` — находки по хосту (`vulns:read`).
- `GET /api/v2/projects/{id}/hosts/{host_id}/vulnerabilities/{vuln_id}` — одна находка (`vulns:read`).
- `POST /api/v2/projects/{id}/vulnerabilities` — создать находку (`vulns:write`).
- `PUT /api/v2/projects/{id}/vulnerabilities/{vuln_id}` — обновить находку (`vulns:write`).

**Заметки**
- `GET /api/v2/projects/{id}/notes` — дерево заметок (`notes:read`).
- `GET /api/v2/projects/{id}/notes/{note_id}` — одна заметка (`notes:read`).
- `POST /api/v2/projects/{id}/notes` — создать заметку (`notes:write`).
- `PUT /api/v2/projects/{id}/notes/{note_id}` — обновить заметку (`notes:write`).

Чтение уязвимостей выполняется в разрезе хоста, а создание/обновление — на уровне проекта. Удаления через агентский API нет.

Записи, сделанные токеном, приписываются пользователю, от имени которого выпущен токен.

## Примеры запросов

Получить список доступных проектов:

```
curl -s https://storm.example/api/v2/projects \
  -H "Authorization: Bearer $STORM_TOKEN"
```

Прочитать хосты проекта `42`:

```
curl -s https://storm.example/api/v2/projects/42/hosts \
  -H "Authorization: Bearer $STORM_TOKEN"
```

Добавить хост с двумя IP-адресами:

```bash
curl --fail-with-body -sS https://storm.example/api/v2/projects/42/hosts \
  -H "Authorization: Bearer $STORM_TOKEN" -H "Content-Type: application/json" \
  -d '{"hostname":"api.example.com","ip_addresses":["192.0.2.10","2001:db8::10"]}'
```

Добавить эндпоинт к хосту `100`:

```bash
curl --fail-with-body -sS https://storm.example/api/v2/projects/42/hosts/100/endpoints \
  -H "Authorization: Bearer $STORM_TOKEN" -H "Content-Type: application/json" \
  -d '{"path":"/api/health","method":"GET"}'
```

Добавить отдельный IP (чтобы привязать к существующему хосту, добавьте `"host_id":100`):

```bash
curl --fail-with-body -sS https://storm.example/api/v2/projects/42/ip-addresses \
  -H "Authorization: Bearer $STORM_TOKEN" -H "Content-Type: application/json" \
  -d '{"ip_address":"192.0.2.20","label":"Test server"}'
```

Прочитать IP и учётные данные проекта:

```bash
curl --fail-with-body -sS https://storm.example/api/v2/projects/42/ip-addresses \
  -H "Authorization: Bearer $STORM_TOKEN"
curl --fail-with-body -sS https://storm.example/api/v2/projects/42/credentials \
  -H "Authorization: Bearer $STORM_TOKEN"
```

Последний запрос выводит пароли: не сохраняйте его ответ в общие журналы CI/CD. Для него нужен `credentials:read`; `assets:read` доступа к учётным данным не даёт.

Создать находку в проекте `42` (поля находки — те же, что в интерфейсе: см. документ «Пользователь», глава «Уязвимости». Находка обязана быть привязана к хосту):

```
curl -s -X POST https://storm.example/api/v2/projects/42/vulnerabilities \
  -H "Authorization: Bearer $STORM_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
        "title": "SQL injection in /api/login",
        "host_id": 100,
        "severity": "high",
        "status": "open"
      }'
```

> Замените `storm.example` на адрес вашего экземпляра Storm, а `$STORM_TOKEN` — на значение выпущенного токена. Значения `host_id` и id проекта берутся из ответов эндпоинтов чтения.

> Поле `severity` необязательно: если его не передать, критичность создаётся со значением `info` и уточняется позже CVSS-вектором.

## Ошибки и проверка доступа

- `401` — нет действительного Bearer-токена, он истёк/отозван или его владелец заблокирован.
- `403` — нет нужного scope или доступа к проекту. Права проверяются заново на каждом запросе: выход владельца ключа из проекта закрывает доступ агенту.
- `404` — запись не найдена в указанном проекте/хосте; подмена родительского ID не открывает чужие данные.
- `422` — неверные поля, адрес IP или параметры пагинации.

Ошибки используют общий формат Storm: `detail`, `code`, `request_id`; валидация может дополнительно содержать `errors`. Для поиска в логах используйте `request_id` из ответа или заголовка `X-Request-ID`.

## Интерактивная документация (Swagger)

У STORM две самостоятельные схемы API, и у каждой — своя живая документация (Swagger UI / ReDoc), где эндпоинты разворачиваются прямо в браузере:

- **API приложения** (пользовательский REST, префикс `/api/v1`): `/api/v1/docs` — Swagger UI, `/api/v1/redoc` — ReDoc, `/api/v1/openapi.json` — схема.
- **Агентский API** (машинный, префикс `/api/v2`): `/api/v2/docs` — Swagger UI, `/api/v2/redoc` — ReDoc, `/api/v2/openapi.json` — схема.

Весь API и его Swagger живут под `/api` — это отдельно от раздела **Docs** (встроенная документация проекта, где вы сейчас), поэтому ничего не путается. Готовые ссылки на оба Swagger есть на главной раздела Docs («Справочник API»).

Пути указаны относительно адреса, по которому открыт Storm, — добавьте их к текущему домену (ссылки ведут на тот же origin, что и приложение).

> Документация **закрыта авторизацией**: открывайте её в браузере, где вы уже вошли в Storm (сессионная cookie подставится автоматически). Анонимный запрос к `/api/v1/docs`, `/api/v2/docs` и к схемам `openapi.json` возвращает `401`.
