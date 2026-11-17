"""Рекон-ферма, фазы 1 и 3: разбор списка целей и HTTP-пробив портов.

Модуль намеренно НЕ импортирует models/database — только чистые функции и
сетевые вызовы. Это позволяет гонять его из воркера и покрывать юнит-тестами
без БД, и это же гарантирует, что в фазы parse/probe не просочится запрос к
async-сессии (её нельзя входить конкурентно, а probe — это gather).
"""

from __future__ import annotations

import asyncio
import ipaddress
import re
import socket
from dataclasses import dataclass, field
from urllib.parse import urlsplit

import httpx
import httpcore

from app.config import get_settings
from app.netguard import is_disallowed_ip

settings = get_settings()

# Порты, которые пробиваем по HTTPS (у остальных по умолчанию HTTP).
HTTPS_PORTS: frozenset[int] = frozenset({443, 8443, 9443, 4443, 7443})
# Топ веб-портов — пробиваются, когда у цели нет ни схемы, ни явного порта.
TOP_WEB_PORTS: tuple[int, ...] = (80, 443, 8080, 8443, 8000, 8888, 8081, 3000, 5000, 8008, 9000, 9443)
# Метка хоста (после IDN→punycode): валидные ASCII-лейблы, суммарно ≤253.
_HOSTNAME_RE = re.compile(
    r"^(?=.{1,253}$)(?!-)[a-z0-9-]{1,63}(?<!-)(?:\.(?!-)[a-z0-9-]{1,63}(?<!-))*$"
)


@dataclass
class ParsedTarget:
    hostname: str  # нормализованное имя хоста или строка IP
    is_ip: bool
    explicit_ports: dict[int, str] = field(default_factory=dict)  # port -> scheme
    has_explicit: bool = False


@dataclass
class ProbeCandidate:
    hostname: str
    port: int
    scheme: str
    inferred: bool


@dataclass
class ProbeResult:
    hostname: str
    port: int
    scheme: str
    inferred: bool
    responded: bool
    http_status: int | None
    error: str | None = None


class PublicNetworkBackend(httpcore.AsyncNetworkBackend):
    """Проверяет все DNS-адреса и подключается к проверенному IP без второго DNS.

    Имя origin остаётся у httpcore: Host, SNI и ключ пула соединений сохраняются.
    Каждый новый socket, в том числе после redirect, проходит ту же проверку.
    """
    def __init__(self):
        self.backend = httpcore.AnyIOBackend()

    async def connect_tcp(self, host, port, timeout=None, local_address=None, socket_options=None):
        """Никаких подключений к частично приватному или недоступному DNS-ответу."""
        try:
            infos = await asyncio.wait_for(asyncio.to_thread(socket.getaddrinfo, host, port, type=socket.SOCK_STREAM), timeout=timeout)
            addresses = list(dict.fromkeys(info[4][0] for info in infos))
        except (OSError, TimeoutError):
            raise httpcore.ConnectError('Цель недоступна или запрещена политикой сети') from None
        if not addresses or any(is_disallowed_ip(addr) for addr in addresses):
            raise httpcore.ConnectError('Цель недоступна или запрещена политикой сети')
        for address in addresses:
            try:
                return await self.backend.connect_tcp(address, port, timeout, local_address, socket_options)
            except (httpcore.ConnectError, httpcore.ConnectTimeout):
                continue
        raise httpcore.ConnectError('Цель недоступна или запрещена политикой сети')

    async def connect_unix_socket(self, *args, **kwargs):
        """Сканеры не имеют доступа к Unix-сокетам сервисов контейнера."""
        raise httpcore.ConnectError('Цель недоступна или запрещена политикой сети')

    async def sleep(self, seconds):
        await asyncio.sleep(seconds)


class ProbeTransport(httpx.AsyncHTTPTransport):
    """HTTPX 0.28: закрепляет безопасный сетевой backend в новом пуле httpcore."""
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self._pool._network_backend = PublicNetworkBackend()


# ---------------------------------------------------------------------- parse


def resolve_scheme(existing: str | None, new: str | None, port: int) -> str:
    """Конфликт схемы на один (host, port): https побеждает."""
    if "https" in (existing, new) or port in HTTPS_PORTS:
        return "https"
    return "http"


def parse_token(token: str) -> tuple[str, bool, int | None, str | None] | None:
    """(hostname, is_ip, port|None, scheme|None) или None, если токен невалиден."""
    # Голый IPv6 — литерал, а не URL host:port. Сначала канонизируем
    # адрес, иначе urlsplit ошибочно принимает часть IPv6 за номер порта.
    if '%' not in token:
        try:
            return str(ipaddress.ip_address(token)), True, None, None
        except ValueError:
            pass
    try:
        split = urlsplit(token if "://" in token else f"//{token}")
    except ValueError:
        return None
    scheme = (split.scheme or "").lower() or None
    if scheme is not None and scheme not in ("http", "https"):
        return None  # ftp:// и прочее — не веб, отклоняем
    host = split.hostname
    if not host:
        return None
    host = host.lower().rstrip(".")
    try:
        port = split.port
    except ValueError:
        return None
    if port is not None and not (1 <= port <= 65535):
        return None

    is_ip = False
    try:
        ipaddress.ip_address(host)
        is_ip = True
    except ValueError:
        try:
            host = host.encode("idna").decode("ascii")
        except (UnicodeError, UnicodeDecodeError):
            return None
        if not _HOSTNAME_RE.match(host):
            return None

    if port is None:
        if scheme == "http":
            port = 80
        elif scheme == "https":
            port = 443
    final_scheme = scheme
    if port is not None and final_scheme is None:
        final_scheme = "https" if port in HTTPS_PORTS else "http"
    return host, is_ip, port, final_scheme


def parse_targets(raw: str) -> tuple[dict[str, ParsedTarget], list[str]]:
    """Разбирает вставленный текст в {hostname: ParsedTarget} + список ошибок."""
    targets: dict[str, ParsedTarget] = {}
    errors: list[str] = []
    seen_invalid: set[str] = set()
    # Комментарии — построчно: строка целиком, начинающаяся с # или //, пропускается
    # (иначе `# my note` рассыпалось бы на «валидные» однословные хосты).
    for line in (raw or "").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or line.startswith("//"):
            continue
        for token in re.split(r"[\s,]+", line):
            token = token.strip()
            if not token:
                continue
            parsed = parse_token(token)
            if parsed is None:
                if token not in seen_invalid:
                    seen_invalid.add(token)
                    errors.append(f"{token}: не распознан как хост или URL")
                continue
            hostname, is_ip, port, scheme = parsed
            entry = targets.get(hostname)
            if entry is None:
                entry = ParsedTarget(hostname=hostname, is_ip=is_ip)
                targets[hostname] = entry
            if port is not None:
                entry.explicit_ports[port] = resolve_scheme(entry.explicit_ports.get(port), scheme, port)
                entry.has_explicit = True
    return targets, errors


def candidates_for(tgt: ParsedTarget) -> list[ProbeCandidate]:
    """Явные порты пробиваем как есть; при их отсутствии — курируемый топ веб-портов."""
    if tgt.has_explicit:
        return [
            ProbeCandidate(tgt.hostname, port, scheme, inferred=False)
            for port, scheme in tgt.explicit_ports.items()
        ]
    return [
        ProbeCandidate(tgt.hostname, port, "https" if port in HTTPS_PORTS else "http", inferred=True)
        for port in TOP_WEB_PORTS
    ]


def trim_excess_ports(targets: dict[str, ParsedTarget]) -> list[str]:
    """Обрезает явные порты сверх лимита (оставляя младшие), возвращает ошибки."""
    errors: list[str] = []
    limit = settings.farm_max_ports_per_host
    for host, tgt in targets.items():
        if tgt.has_explicit and len(tgt.explicit_ports) > limit:
            for extra in sorted(tgt.explicit_ports)[limit:]:
                del tgt.explicit_ports[extra]
            errors.append(f"{host}: слишком много портов, оставлено {limit}")
    return errors


# ---------------------------------------------------------------------- probe


def build_transport(
    transport: httpx.AsyncBaseTransport | None, limits: httpx.Limits
) -> httpx.AsyncBaseTransport:
    if transport is not None:  # test-seam (httpx.MockTransport)
        return transport
    return ProbeTransport(verify=False, limits=limits)


async def probe_candidates(
    candidates: list[ProbeCandidate],
    *,
    transport: httpx.AsyncBaseTransport | None = None,
) -> list[ProbeResult]:
    """HTTP-пробив кандидатов до корня `/`. БД не трогает."""
    if not candidates:
        return []

    limits = httpx.Limits(max_connections=settings.farm_max_concurrency)
    real_transport = build_transport(transport, limits)
    sem = asyncio.Semaphore(settings.farm_max_concurrency)
    timeout = httpx.Timeout(settings.farm_probe_timeout_seconds)

    # follow_redirects=False: 301 записываем как 301, а не идём по нему.
    # verify отключён в самом transport: пентест-цели часто с self-signed TLS.
    async with httpx.AsyncClient(follow_redirects=False, timeout=timeout, transport=real_transport) as client:

        async def probe_one(c: ProbeCandidate) -> ProbeResult:
            # IPv6-литерал в URL обязан быть в скобках.
            host = f"[{c.hostname}]" if ":" in c.hostname else c.hostname
            url = f"{c.scheme}://{host}:{c.port}/"
            async with sem:
                try:
                    async with client.stream("GET", url) as resp:
                        return ProbeResult(
                            c.hostname, c.port, c.scheme, c.inferred, True, resp.status_code,
                        )
                except Exception as exc:  # noqa: BLE001 — любой сбой = порт не ответил
                    return ProbeResult(
                        c.hostname, c.port, c.scheme, c.inferred, False, None, error=type(exc).__name__
                    )

        return await asyncio.gather(*(probe_one(c) for c in candidates))
