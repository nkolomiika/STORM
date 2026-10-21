"""Чистые unit-тесты (без БД/сети) для логики критичности и раскладки отчёта.

- VulnerabilityService._severity_from_cvss_score: severity ВСЕГДА выводится из
  CVSS-скора; нет CVSS → UNREALIZED («проверка», нереализуема).
- word_builder: раздел уязвимостей = только реализуемое (main), info/unrealized →
  слабости; русские подписи уровней риска.
"""
from types import SimpleNamespace

import pytest

from app.enums import Severity
from app.reports.word_builder import (
    SEVERITY_RU,
    WEAKNESS_SEVERITIES,
    _split_vulnerabilities,
    severity_label,
)
from app.services import VulnerabilityService


# ---------- _severity_from_cvss_score ----------

@pytest.mark.parametrize(
    "score,expected",
    [
        (None, Severity.UNREALIZED),  # нет CVSS → проверка
        (10.0, Severity.CRITICAL),
        (9.3, Severity.CRITICAL),
        (9.0, Severity.CRITICAL),     # граница
        (8.9, Severity.HIGH),
        (7.2, Severity.HIGH),
        (7.0, Severity.HIGH),         # граница
        (6.9, Severity.MEDIUM),
        (5.9, Severity.MEDIUM),
        (4.0, Severity.MEDIUM),       # граница
        (3.9, Severity.LOW),
        (3.1, Severity.LOW),
        (0.1, Severity.LOW),
        (0.0, Severity.INFO),         # явный ноль → info, НЕ unrealized
    ],
)
def test_severity_from_cvss_score(score, expected):
    assert VulnerabilityService._severity_from_cvss_score(score) is expected


def test_no_cvss_is_unrealized_not_info():
    assert VulnerabilityService._severity_from_cvss_score(None) is Severity.UNREALIZED
    assert VulnerabilityService._severity_from_cvss_score(None) is not Severity.INFO


# ---------- _split_vulnerabilities / WEAKNESS_SEVERITIES ----------

def test_weakness_severities_set():
    assert WEAKNESS_SEVERITIES == {Severity.INFO, Severity.UNREALIZED}


def test_split_realizable_vs_weakness():
    # Только .severity используется — хватает лёгких заглушек.
    items = [
        SimpleNamespace(severity=Severity.CRITICAL),
        SimpleNamespace(severity=Severity.HIGH),
        SimpleNamespace(severity=Severity.MEDIUM),
        SimpleNamespace(severity=Severity.LOW),
        SimpleNamespace(severity=Severity.INFO),
        SimpleNamespace(severity=Severity.UNREALIZED),
    ]
    main, weaknesses = _split_vulnerabilities(items)
    main_sev = {v.severity for v in main}
    weak_sev = {v.severity for v in weaknesses}
    # Детальный раздел уязвимостей: только реализуемое, без info и unrealized.
    assert main_sev == {Severity.CRITICAL, Severity.HIGH, Severity.MEDIUM, Severity.LOW}
    assert Severity.INFO not in main_sev
    assert Severity.UNREALIZED not in main_sev
    # В слабости уходят info + unrealized.
    assert weak_sev == {Severity.INFO, Severity.UNREALIZED}


def test_split_empty():
    assert _split_vulnerabilities([]) == ([], [])


def test_split_all_weakness():
    items = [SimpleNamespace(severity=Severity.UNREALIZED), SimpleNamespace(severity=Severity.INFO)]
    main, weaknesses = _split_vulnerabilities(items)
    assert main == []
    assert len(weaknesses) == 2


# ---------- severity_label / SEVERITY_RU ----------

@pytest.mark.parametrize(
    "value,expected",
    [
        (Severity.CRITICAL, "Критический"),
        (Severity.HIGH, "Высокий"),
        (Severity.MEDIUM, "Средний"),
        (Severity.LOW, "Низкий"),
        (Severity.INFO, "Слабость/недостаток"),
        (Severity.UNREALIZED, "Не реализуема"),
        ("unrealized", "Не реализуема"),  # строковое значение тоже резолвится
        ("critical", "Критический"),
        (None, ""),
        ("bogus", ""),                    # неизвестное → пустая строка
    ],
)
def test_severity_label(value, expected):
    assert severity_label(value) == expected


def test_severity_ru_covers_all_enum_values():
    # Каждому значению enum сопоставлена подпись (иначе отчёт покажет пустоту).
    for sev in Severity:
        assert sev in SEVERITY_RU and SEVERITY_RU[sev]
