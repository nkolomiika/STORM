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
    UNREALIZED_SEVERITIES,
    WEAKNESS_SEVERITIES,
    _distrib_version,
    _sort_vulns_by_host_and_severity,
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
    # Слабости — low-уязвимости + info; «проверки» (unrealized) в отдельной
    # корзине и показываются ТОЛЬКО в разделе «Тесты».
    assert WEAKNESS_SEVERITIES == {Severity.LOW, Severity.INFO}
    assert UNREALIZED_SEVERITIES == {Severity.UNREALIZED}


def test_split_realizable_vs_weakness_vs_unrealized():
    # Только .severity используется — хватает лёгких заглушек.
    items = [
        SimpleNamespace(severity=Severity.CRITICAL),
        SimpleNamespace(severity=Severity.HIGH),
        SimpleNamespace(severity=Severity.MEDIUM),
        SimpleNamespace(severity=Severity.LOW),
        SimpleNamespace(severity=Severity.INFO),
        SimpleNamespace(severity=Severity.UNREALIZED),
    ]
    main, weaknesses, unrealized = _split_vulnerabilities(items)
    main_sev = {v.severity for v in main}
    weak_sev = {v.severity for v in weaknesses}
    unreal_sev = {v.severity for v in unrealized}
    # Детальный раздел уязвимостей: critical/high/medium (без low/info/unrealized).
    assert main_sev == {Severity.CRITICAL, Severity.HIGH, Severity.MEDIUM}
    assert Severity.LOW not in main_sev
    assert Severity.INFO not in main_sev
    assert Severity.UNREALIZED not in main_sev
    # Слабости — low + info; unrealized сюда НЕ попадает.
    assert weak_sev == {Severity.LOW, Severity.INFO}
    assert Severity.UNREALIZED not in weak_sev
    # «Проверки» — отдельная корзина (только для раздела «Тесты»).
    assert unreal_sev == {Severity.UNREALIZED}


def test_split_empty():
    assert _split_vulnerabilities([]) == ([], [], [])


def test_split_weakness_and_unrealized_separated():
    items = [SimpleNamespace(severity=Severity.UNREALIZED), SimpleNamespace(severity=Severity.INFO)]
    main, weaknesses, unrealized = _split_vulnerabilities(items)
    assert main == []
    assert [v.severity for v in weaknesses] == [Severity.INFO]
    assert [v.severity for v in unrealized] == [Severity.UNREALIZED]


# ---------- _distrib_version (парсинг версии дистрибутива) ----------

@pytest.mark.parametrize(
    "affected,expected",
    [
        ("Platform V PRODUCT 1.1", "1.1"),        # основной формат: берём последний токен
        ("Platform V Stack 1.0.2-beta2", "1.0.2-beta2"),
        ("Platform V Stack 1.0.2-beta.2", "1.0.2-beta.2"),
        ("Platform V Stack 1.0.2-rc1", "1.0.2-rc1"),
        ("Platform V Stack v1.0.2+2026.11", "v1.0.2+2026.11"),
        ("Platform V Stack 1.0.2 build 42", "1.0.2 build 42"),
        ("Platform V Stack", ""),
        ("2.3.4", "2.3.4"),                        # уже только версия
        ("  Platform V X 9.9  ", "9.9"),           # обрезаем пробелы по краям
        (None, ""),                                # нет данных → пусто (плейсхолдер не трогаем)
        ("", ""),
        ("   ", ""),
    ],
)
def test_distrib_version(affected, expected):
    project = SimpleNamespace(appsec_version_name=affected)
    assert _distrib_version(project) == expected


def test_distrib_version_keeps_all_versions_from_the_project_array():
    project = SimpleNamespace(appsec_versions=[{'code': 'v1', 'name': 'Platform 1.0'}, {'code': 'v2', 'name': 'Platform 2.0'}], appsec_version_name='Legacy 0.1')
    assert _distrib_version(project) == '1.0, 2.0'


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


# ---------- _sort_vulns_by_host_and_severity ----------

def test_sort_by_host_then_severity_desc():
    """Находки группируются по хосту (в порядке hosts), внутри — по убыванию критичности."""
    from app.enums import AssetType

    hosts = [
        SimpleNamespace(id=1, hostname="host-1", ip_address=None),
        SimpleNamespace(id=2, hostname="host-2", ip_address=None),
    ]

    def host_asset(host_id):
        return SimpleNamespace(asset_type=AssetType.HOST, asset_id=host_id)

    vulns = [
        SimpleNamespace(id=10, severity=Severity.LOW),       # host-2
        SimpleNamespace(id=11, severity=Severity.CRITICAL),  # host-2
        SimpleNamespace(id=12, severity=Severity.MEDIUM),    # host-1
        SimpleNamespace(id=13, severity=Severity.HIGH),      # host-1
    ]
    indexes = {
        "host_by_id": {1: hosts[0], 2: hosts[1]},
        "assets_by_vuln_id": {
            10: [host_asset(2)], 11: [host_asset(2)],
            12: [host_asset(1)], 13: [host_asset(1)],
        },
    }
    out = _sort_vulns_by_host_and_severity(vulns, indexes=indexes, hosts=hosts)
    # host-1: HIGH(13) → MEDIUM(12); затем host-2: CRITICAL(11) → LOW(10).
    assert [v.id for v in out] == [13, 12, 11, 10]


def test_sort_no_host_goes_to_first_host():
    """Находка без привязки к хосту относится к первому хосту проекта."""
    hosts = [SimpleNamespace(id=1, hostname="host-1", ip_address=None)]
    vulns = [SimpleNamespace(id=1, severity=Severity.INFO)]
    indexes = {"host_by_id": {1: hosts[0]}, "assets_by_vuln_id": {}}
    out = _sort_vulns_by_host_and_severity(vulns, indexes=indexes, hosts=hosts)
    assert [v.id for v in out] == [1]
