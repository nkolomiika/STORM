# Корпоративные CA-сертификаты

Сюда кладутся корневые/промежуточные сертификаты внутренних удостоверяющих
центров (например, цепочка для `portal.works.prod.sbt` — Works, и `iam.*` —
Keycloak/IAM). Файлы отсюда **вшиваются в образ** при сборке backend:

```
COPY certs/ /usr/local/share/ca-certificates/storm/
RUN update-ca-certificates
ENV SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt ...
```

После этого httpx/requests/pip/curl используют системный бандл (с корп-CA), и
исходящий TLS к внутренним сервисам работает с `WORKS_VERIFY_SSL=true` /
`SSO_VERIFY_TLS=true` — без правок кода.

## Как добавить

1. Положите PEM-цепочку с расширением **`.crt`** (обязательно — иначе
   `update-ca-certificates` файл пропустит), например `works-chain.crt`.
   Можно несколько файлов.
2. Пересоберите backend: `docker compose build backend` (или `./deploy.sh`).

## Важно

- Реальные сертификаты в репозиторий **не коммитятся** (см. `.gitignore`):
  в VCS остаются только этот README и `.gitkeep`. Цепочку возьмите у своей
  команды инфраструктуры / экспортируйте из браузера на `portal.works.prod.sbt`.
- Без корп-CA (локальная разработка) папка пустая — шаг сборки безвреден,
  образ собирается как обычно.
- Альтернатива вшиванию: смонтировать PEM в контейнер и указать путь в
  `WORKS_VERIFY_SSL=/certs/works-chain.crt` (конфиг это умеет), но для корп-среды
  удобнее вшить один раз в образ.
