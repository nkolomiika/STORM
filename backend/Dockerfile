FROM python:3.12-slim

WORKDIR /app

# Опциональный корпоративный прокси для сборки за периметром (в dev пустые — no-op).
# Docker автоматически прокидывает эти ARG в окружение RUN-шагов (pip, curl).
ARG HTTP_PROXY=""
ARG HTTPS_PROXY=""
ARG NO_PROXY=""

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libmagic1 \
    whatweb \
    curl \
    unzip \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Корпоративные CA (цепочка Works/IAM и т.п.): любые *.crt из backend/certs/
# вносятся в системный trust store. Затем SSL_CERT_FILE/REQUESTS_CA_BUNDLE/PIP_CERT
# переводят httpx/requests/pip/curl на системный бандл (с корп-CA) ВМЕСТО certifi —
# тогда исходящий TLS к внутренним сервисам (portal.works.prod.sbt, IAM) работает
# с WORKS_VERIFY_SSL=true / SSO_VERIFY_TLS=true из коробки, без правок кода.
# В dev папка пустая (только README/.gitkeep) — шаг безвреден. См. backend/certs/README.md.
COPY certs/ /usr/local/share/ca-certificates/storm/
RUN update-ca-certificates || true
ENV SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt \
    REQUESTS_CA_BUNDLE=/etc/ssl/certs/ca-certificates.crt \
    PIP_CERT=/etc/ssl/certs/ca-certificates.crt

# httpx (ProjectDiscovery) — определение технологий и CDN веб-порта. Быстрее и
# точнее whatweb, отдаёт стек + cdn_name одним batch-вызовом. Ставим prebuilt-бинарь
# под нужную архитектуру ПОД ИМЕНЕМ httpx-pd: pip-пакет httpx ставит свой
# консольный скрипт /usr/local/bin/httpx и затирает наш бинарь — отдельное имя
# снимает коллизию (см. services_httpx_bin в config.py).
RUN set -eux; \
    arch="$(dpkg --print-architecture)"; \
    case "$arch" in amd64) HXA=amd64;; arm64) HXA=arm64;; *) HXA=amd64;; esac; \
    ver="$(curl -fsSL https://api.github.com/repos/projectdiscovery/httpx/releases/latest | grep -oP '\"tag_name\":\s*\"v\K[0-9.]+')"; \
    curl -fsSL "https://github.com/projectdiscovery/httpx/releases/download/v${ver}/httpx_${ver}_linux_${HXA}.zip" -o /tmp/httpx.zip; \
    unzip -o /tmp/httpx.zip httpx -d /tmp/httpx-pd; \
    mv /tmp/httpx-pd/httpx /usr/local/bin/httpx-pd; \
    chmod +x /usr/local/bin/httpx-pd; \
    rm -rf /tmp/httpx.zip /tmp/httpx-pd; \
    httpx-pd -version

COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Гарантируем наличие Pillow отдельной инструкцией, чтобы избежать ситуации,
# когда BuildKit возвращает закешированный слой `pip install`, собранный до
# добавления Pillow в requirements.txt (PIL нужен app.services для нормализации
# изображений в отчётах).
RUN pip install --no-cache-dir Pillow==10.4.0

# trufflehog — verified-секреты в JS (ферма JS, app/farm/jsmine.py). Тянем
# prebuilt-бинарь из GitHub-релизов под нужную архитектуру тем же способом, что и
# httpx-pd выше: так сборка не зависит от метаданных стороннего Docker-образа
# (их загрузка из реестра у нас таймаутила). jsluice намеренно не ставим — ветка
# опциональна и без бинаря просто не срабатывает (как и во FROST).
RUN set -eux; \
    arch="$(dpkg --print-architecture)"; \
    case "$arch" in amd64) THA=amd64;; arm64) THA=arm64;; *) THA=amd64;; esac; \
    ver="$(curl -fsSL https://api.github.com/repos/trufflesecurity/trufflehog/releases/latest | grep -oP '\"tag_name\":\s*\"v\K[0-9.]+')"; \
    curl -fsSL "https://github.com/trufflesecurity/trufflehog/releases/download/v${ver}/trufflehog_${ver}_linux_${THA}.tar.gz" -o /tmp/th.tgz; \
    tar -xzf /tmp/th.tgz -C /usr/local/bin trufflehog; \
    chmod +x /usr/local/bin/trufflehog; \
    rm -f /tmp/th.tgz; \
    trufflehog --version

COPY . /app

# Кастомные детекторы trufflehog для фермы JS (путь совпадает с js_farm_trufflehog_config).
COPY deploy/trufflehog-custom.yaml /usr/local/share/storm/trufflehog-custom.yaml

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
