"""Юниты парсеров внешнего JS-майнинга (app.farm.jsmine).

Без сети и БД: проверяем разбор вывода trufflehog/jsluice, редактирование
превью, нормализацию severity и дедуп. Главное правило — regex работает всегда,
а при отсутствии бинарей mine_js молча откатывается только на него.
"""

from app.farm import jsmine
from app.farm.jsscan import Secret

import pytest


def test_parse_trufflehog_verified_is_critical_and_redacted() -> None:
    line = '{"DetectorName":"AWS","Verified":true,"Raw":"AKIAIOSFODNN7EXAMPLE"}'
    out = jsmine._parse_trufflehog(line.encode())
    assert len(out) == 1
    s = out[0]
    assert s.kind == "trufflehog:AWS ✓verified"
    assert s.severity == "critical"
    assert s.snippet == "verified via provider API"
    # Полное значение в БД не кладём — превью редактируется.
    assert s.match_preview == "AKIA…MPLE"
    assert "AKIAIOSFODNN7EXAMPLE" != s.match_preview


def test_parse_trufflehog_unverified_is_high() -> None:
    line = '{"DetectorName":"Stripe","Verified":false,"Raw":"sk_live_0123456789abcdef"}'
    out = jsmine._parse_trufflehog(line.encode())
    assert out[0].kind == "trufflehog:Stripe"
    assert out[0].severity == "high"
    assert out[0].snippet == "unverified"


def test_parse_trufflehog_skips_noise_and_incomplete() -> None:
    blob = "\n".join(
        [
            "not-json",
            "trufflehog v3.0.0",  # баннер, не JSON-объект
            '{"DetectorName":"AWS"}',  # нет Raw
            '{"Raw":"xxxx"}',  # нет DetectorName
            '{"DetectorName":"GCP","Verified":false,"Raw":"AIzaSyMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM1"}',
        ]
    )
    out = jsmine._parse_trufflehog(blob.encode())
    assert [s.kind for s in out] == ["trufflehog:GCP"]


def test_parse_jsluice_secrets_joins_values_and_normalizes_severity() -> None:
    line = '{"kind":"aws","severity":"CRITICAL","data":{"key":"AKIAIOSFODNN7EXAMPLE","n":1},"context":{"line":"x"}}'
    out = jsmine._parse_jsluice_secrets(line.encode())
    assert len(out) == 1
    assert out[0].kind == "jsluice:aws"
    assert out[0].severity == "critical"
    assert out[0].match_preview == "AKIA…MPLE"  # число n отброшено, строка редактирована
    assert out[0].snippet  # контекст сериализован


def test_parse_jsluice_urls() -> None:
    blob = '{"url":"/api/v1/users"}\nbroken\n{"url":"/admin"}\n{"nope":1}'
    assert jsmine._parse_jsluice_urls(blob.encode()) == ["/api/v1/users", "/admin"]


def test_norm_severity() -> None:
    assert jsmine._norm_severity("CRITICAL") == "critical"
    assert jsmine._norm_severity(" High ") == "high"
    assert jsmine._norm_severity("informational") == "info"
    assert jsmine._norm_severity("weird") == "medium"


def test_dedup_secrets_by_preview() -> None:
    a = Secret(kind="x", match_preview="AKIA…MPLE", snippet="", severity="high")
    b = Secret(kind="y", match_preview="AKIA…MPLE", snippet="", severity="low")
    c = Secret(kind="z", match_preview="", snippet="", severity="low")  # пустое отбрасываем
    out = jsmine._dedup_secrets([a, b, c])
    assert [s.kind for s in out] == ["x"]


def test_dedup_strings() -> None:
    assert jsmine._dedup_strings(["/a", "/a", "", "/b"]) == ["/a", "/b"]


@pytest.mark.asyncio
async def test_mine_js_falls_back_to_regex_without_binaries() -> None:
    # Бинарей в тест-окружении нет → только regex-набор (jsscan), но он ВСЕГДА.
    cfg = jsmine.JsMineConfig(enabled=True, jsluice_bin="jsluice-nope", trufflehog_bin="th-nope")
    text = 'const cfg={apiKey:"AKIAIOSFODNN7EXAMPLE"};fetch("/api/v1/secret-data");'
    secrets, endpoints = await jsmine.mine_js(text, cfg)
    assert any(s.kind == "aws_access_key" for s in secrets)
    assert "/api/v1/secret-data" in endpoints


@pytest.mark.asyncio
async def test_mine_js_disabled_still_runs_regex() -> None:
    cfg = jsmine.JsMineConfig(enabled=False)
    text = 'x="/admin/panel";token="AKIAIOSFODNN7EXAMPLE";'
    secrets, endpoints = await jsmine.mine_js(text, cfg)
    assert any(s.kind == "aws_access_key" for s in secrets)
    assert "/admin/panel" in endpoints
