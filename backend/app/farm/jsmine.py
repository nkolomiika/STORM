"""Внешний JS-майнинг: trufflehog (verified-секреты) и jsluice (секреты + URL).

Порт `jsmine.go` из Go-версии. Правило то же: встроенный regex-набор (`jsscan`)
работает ВСЕГДА — он ловит app-специфичные секреты (JWT, generic api_key/token/
password), которых нет в детекторах trufflehog. Инструменты добавляют провайдерские
verified-секреты сверху, когда их бинари есть в образе. Нет бинаря (dev-окружение)
→ молча остаётся только regex, ферма работает всегда.

Отличие от Go-версии: превью секрета всегда редактится (`jsscan.redact`) — полное
значение в БД не кладём, как и везде в STORM. Инструменты зовём как внешние
процессы (asyncio), с общим таймаутом на файл.
"""

from __future__ import annotations

import asyncio
import json
import os
import shutil
import tempfile
from dataclasses import dataclass

from app.farm import jsscan
from app.farm.jsscan import Secret


@dataclass
class JsMineConfig:
    """Настройки внешнего JS-майнинга (снимаются из Settings в js.py)."""

    enabled: bool = False
    jsluice_bin: str = "jsluice"
    trufflehog_bin: str = "trufflehog"
    trufflehog_config: str = ""
    timeout: float = 30.0


def _ready(enabled: bool, bin_name: str) -> bool:
    """Инструмент годен, если майнинг включён и бинарь есть в PATH."""
    if not enabled or not bin_name:
        return False
    return shutil.which(bin_name) is not None


def _norm_severity(s: str) -> str:
    low = s.strip().lower() if isinstance(s, str) else ""
    if low == "critical":
        return "critical"
    if low == "high":
        return "high"
    if low == "low":
        return "low"
    if low in ("info", "informational"):
        return "info"
    return "medium"


def _dedup_secrets(items: list[Secret]) -> list[Secret]:
    """Дедуп по match_preview (как в Go-версии): пустые и повторы отбрасываем."""
    seen: set[str] = set()
    out: list[Secret] = []
    for s in items:
        if not s.match_preview or s.match_preview in seen:
            continue
        seen.add(s.match_preview)
        out.append(s)
    return out


def _dedup_strings(items: list[str]) -> list[str]:
    seen: set[str] = set()
    out: list[str] = []
    for s in items:
        if not s or s in seen:
            continue
        seen.add(s)
        out.append(s)
    return out


async def _run(bin_name: str, args: list[str], timeout: float) -> bytes:
    """Запускает внешний инструмент, возвращает stdout.

    Ненулевой код НЕ ошибка: trufflehog возвращает ненулевой код, когда что-то
    нашёл, — stdout при этом валиден. На таймауте/сбое отдаём то, что успели.
    """
    try:
        proc = await asyncio.create_subprocess_exec(
            bin_name, *args, stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.DEVNULL
        )
    except Exception:  # noqa: BLE001 — не запустился процесс = инструмент недоступен
        return b""
    try:
        stdout, _ = await asyncio.wait_for(proc.communicate(), timeout=timeout)
        return stdout or b""
    except (TimeoutError, asyncio.TimeoutError):
        try:
            proc.kill()
        except ProcessLookupError:
            pass
        return b""
    except Exception:  # noqa: BLE001
        return b""


def _parse_trufflehog(out: bytes) -> list[Secret]:
    res: list[Secret] = []
    for raw_line in out.decode("utf-8", "replace").splitlines():
        line = raw_line.strip()
        if not line or not line.startswith("{"):
            continue
        try:
            m = json.loads(line)
        except ValueError:
            continue
        if not isinstance(m, dict):
            continue
        name = m.get("DetectorName") or ""
        value = m.get("Raw") or ""
        if not isinstance(name, str) or not isinstance(value, str) or not name or not value:
            continue
        verified = m.get("Verified") is True
        kind = f"trufflehog:{name}"
        severity = "high"
        snippet = "unverified"
        if verified:
            kind += " ✓verified"
            severity = "critical"
            snippet = "verified via provider API"
        res.append(
            Secret(
                kind=kind,
                match_preview=jsscan.redact(value)[:255],
                snippet=snippet,
                severity=severity,
            )
        )
    return res


def _parse_jsluice_secrets(out: bytes) -> list[Secret]:
    res: list[Secret] = []
    for raw_line in out.decode("utf-8", "replace").splitlines():
        line = raw_line.strip()
        if not line:
            continue
        try:
            m = json.loads(line)
        except ValueError:
            continue
        if not isinstance(m, dict) or not isinstance(m.get("data"), dict):
            continue
        data = m.get("data") or {}
        value = " ".join(str(v) for v in data.values() if isinstance(v, str) and v)
        if not value:
            continue
        context = m.get("context") or {}
        snippet = json.dumps(context, ensure_ascii=False) if context else ""
        for raw_value in data.values():
            if isinstance(raw_value, str) and raw_value:
                snippet = snippet.replace(json.dumps(raw_value, ensure_ascii=False)[1:-1], jsscan.redact(raw_value))
        snippet = jsscan.redact_context(snippet)
        res.append(
            Secret(
                kind="jsluice:" + (m["kind"] if isinstance(m.get("kind"), str) else "secret"),
                match_preview=jsscan.redact(value)[:255],
                snippet=snippet[:255],
                severity=_norm_severity(m.get("severity") or ""),
            )
        )
    return res


def _parse_jsluice_urls(out: bytes) -> list[str]:
    res: list[str] = []
    for raw_line in out.decode("utf-8", "replace").splitlines():
        line = raw_line.strip()
        if not line:
            continue
        try:
            m = json.loads(line)
        except ValueError:
            continue
        if not isinstance(m, dict):
            continue
        url = m.get("url") or ""
        if isinstance(url, str) and url:
            res.append(url)
    return res


async def mine_js(text: str, cfg: JsMineConfig) -> tuple[list[Secret], list[str]]:
    """Извлекает секреты и эндпоинты из одного JS-файла.

    Источники объединяются: regex ВСЕГДА + jsluice/trufflehog, когда доступны.
    """
    # Эндпоинты и regex-секреты — всегда.
    endpoints = jsscan.find_paths(text)
    secrets = jsscan.find_secrets(text)

    js_ready = _ready(cfg.enabled, cfg.jsluice_bin)
    th_ready = _ready(cfg.enabled, cfg.trufflehog_bin)
    if not js_ready and not th_ready:
        return _dedup_secrets(secrets), endpoints

    timeout = cfg.timeout if cfg.timeout and cfg.timeout > 0 else 30.0
    fd, path = tempfile.mkstemp(prefix="stormjs-", suffix=".js")
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as fh:
            fh.write(text)

        if js_ready:
            secrets += _parse_jsluice_secrets(await _run(cfg.jsluice_bin, ["secrets", path], timeout))
            endpoints += _parse_jsluice_urls(await _run(cfg.jsluice_bin, ["urls", path], timeout))
        if th_ready:
            args = ["filesystem", path, "--json", "--no-update"]
            if cfg.trufflehog_config and os.path.exists(cfg.trufflehog_config):
                args.append("--config=" + cfg.trufflehog_config)
            secrets += _parse_trufflehog(await _run(cfg.trufflehog_bin, args, timeout))
    finally:
        try:
            os.remove(path)
        except OSError:
            pass

    return _dedup_secrets(secrets), _dedup_strings(endpoints)
