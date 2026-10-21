"""Чистые unit-тесты Works-интеграции (без БД и сети).

Проверяем детерминированные функции app/works.py (маппинг приоритета, сборку
ProseMirror-описания, толерантный парсинг ответов find/status) и свойства
конфига (works_configured, works_cookies_dict). Безопасно запускать где угодно.
"""
import pytest

from app.config import get_settings
from app.works import (
    DETECTION_PRACTICE,
    SEVERITY_TO_PRIORITY,
    _extract_items,
    _item_code_name,
    _unit_ref,
    _workflow_status_name,
    priority_for_severity,
    text_to_prosemirror,
)


# ---------- priority_for_severity ----------

@pytest.mark.parametrize(
    "severity,expected",
    [
        ("info", "trivial"),
        ("low", "minor"),
        ("medium", "major"),
        ("high", "critical"),
        ("critical", "blocker"),
    ],
)
def test_priority_for_severity_maps_all_levels(severity: str, expected: str) -> None:
    assert priority_for_severity(severity) == expected


def test_priority_for_severity_is_case_insensitive_and_trims() -> None:
    assert priority_for_severity("HIGH") == "critical"
    assert priority_for_severity("  Critical  ") == "blocker"


@pytest.mark.parametrize("value", [None, "", "unknown", "nonsense"])
def test_priority_for_severity_unknown_falls_back_to_trivial(value) -> None:
    assert priority_for_severity(value) == "trivial"


def test_severity_map_and_detection_practice_constants() -> None:
    assert SEVERITY_TO_PRIORITY["critical"] == "blocker"
    # Практика обнаружения всегда «анализ защищённости».
    assert DETECTION_PRACTICE == ["security_analysis"]


# ---------- text_to_prosemirror ----------

@pytest.mark.parametrize("value", [None, "", "   ", "\n\n"])
def test_prosemirror_empty_gives_single_empty_paragraph(value) -> None:
    doc = text_to_prosemirror(value)
    assert doc["type"] == "doc"
    assert len(doc["content"]) == 1
    para = doc["content"][0]
    assert para["type"] == "paragraph"
    assert "content" not in para  # пустой абзац — без текстовых узлов
    assert para["attrs"]["indent"] == 0
    assert para["attrs"]["textAlign"] == "justify"
    assert para["attrs"]["id"]


def test_prosemirror_single_block() -> None:
    doc = text_to_prosemirror("just one line")
    assert len(doc["content"]) == 1
    para = doc["content"][0]
    assert para["content"] == [{"type": "text", "text": "just one line"}]


def test_prosemirror_multiple_paragraphs_split_on_blank_line() -> None:
    doc = text_to_prosemirror("first para\n\nsecond para\n\n\nthird")
    texts = [p["content"][0]["text"] for p in doc["content"]]
    assert texts == ["first para", "second para", "third"]
    # у каждого абзаца уникальный id и нужные attrs
    ids = [p["attrs"]["id"] for p in doc["content"]]
    assert len(set(ids)) == len(ids)
    for p in doc["content"]:
        assert p["attrs"]["indent"] == 0
        assert p["attrs"]["textAlign"] == "justify"


def test_prosemirror_normalizes_crlf() -> None:
    doc = text_to_prosemirror("a\r\n\r\nb")
    texts = [p["content"][0]["text"] for p in doc["content"]]
    assert texts == ["a", "b"]


# ---------- _unit_ref ----------

def test_unit_ref_none_code_returns_none() -> None:
    assert _unit_ref(None, "x") is None
    assert _unit_ref("", "x") is None


def test_unit_ref_builds_code_name_title() -> None:
    assert _unit_ref("uuid-1", "SEGR") == {"code": "uuid-1", "name": "SEGR", "title": "SEGR"}
    # имя пустое → подставляется код
    assert _unit_ref("uuid-2", None) == {"code": "uuid-2", "name": "uuid-2", "title": "uuid-2"}


# ---------- _extract_items ----------

def test_extract_items_bare_list() -> None:
    items = [{"code": "a"}, {"code": "b"}]
    assert _extract_items(items) == items


@pytest.mark.parametrize("key", ["content", "items", "data", "results", "result", "units", "rows"])
def test_extract_items_from_wrapped_keys(key: str) -> None:
    payload = {key: [{"code": "x"}]}
    assert _extract_items(payload) == [{"code": "x"}]


def test_extract_items_unwraps_unit_wrapper() -> None:
    payload = {"content": [{"unit": {"code": "inner"}}, {"code": "flat"}]}
    assert _extract_items(payload) == [{"code": "inner"}, {"code": "flat"}]


@pytest.mark.parametrize("junk", [{}, {"nope": 123}, None, 42, "str", {"content": "notalist"}])
def test_extract_items_junk_gives_empty(junk) -> None:
    assert _extract_items(junk) == []


def test_extract_items_skips_non_dict_elements() -> None:
    assert _extract_items([{"code": "a"}, "bad", 5, None]) == [{"code": "a"}]


# ---------- _item_code_name ----------

def test_item_code_name_prefers_code_then_id_then_uuid() -> None:
    assert _item_code_name({"code": "c", "id": "i", "name": "N"}) == {"code": "c", "name": "N"}
    assert _item_code_name({"id": "i", "title": "T"}) == {"code": "i", "name": "T"}
    assert _item_code_name({"uuid": "u", "summary": "S"}) == {"code": "u", "name": "S"}


def test_item_code_name_falls_back_name_to_code() -> None:
    assert _item_code_name({"code": "only"}) == {"code": "only", "name": "only"}


def test_item_code_name_empty_item() -> None:
    assert _item_code_name({}) == {"code": "", "name": ""}


# ---------- _workflow_status_name ----------

def test_workflow_status_from_attributes_dict() -> None:
    item = {"attributes": {"workflow_status": {"name": "В работе", "code": "WIP"}}}
    assert _workflow_status_name(item) == "В работе"


def test_workflow_status_prefers_name_over_code() -> None:
    item = {"attrs": {"workflow_status": {"code": "ONLY_CODE"}}}
    assert _workflow_status_name(item) == "ONLY_CODE"


def test_workflow_status_as_plain_string() -> None:
    assert _workflow_status_name({"attributes": {"workflow_status": "Resolved"}}) == "Resolved"


def test_workflow_status_directly_on_item() -> None:
    assert _workflow_status_name({"workflow_status": {"name": "Open"}}) == "Open"


@pytest.mark.parametrize("item", [{}, {"attributes": {}}, {"attributes": {"workflow_status": {}}}, {"workflow_status": 123}])
def test_workflow_status_missing_gives_none(item) -> None:
    assert _workflow_status_name(item) is None


# ---------- config: works_cookies_dict ----------

def test_works_cookies_dict_parses_pairs(monkeypatch) -> None:
    s = get_settings()
    monkeypatch.setattr(s, "works_cookies", "k1=v1; k2=v2")
    assert s.works_cookies_dict == {"k1": "v1", "k2": "v2"}


def test_works_cookies_dict_handles_blank_and_valueful(monkeypatch) -> None:
    s = get_settings()
    monkeypatch.setattr(s, "works_cookies", "api_swtr_as21=true")
    assert s.works_cookies_dict == {"api_swtr_as21": "true"}
    monkeypatch.setattr(s, "works_cookies", "")
    assert s.works_cookies_dict == {}


# ---------- config: works_configured ----------

def test_works_configured_false_when_disabled(monkeypatch) -> None:
    s = get_settings()
    monkeypatch.setattr(s, "works_enabled", False)
    monkeypatch.setattr(s, "works_api_token", "tok")
    monkeypatch.setattr(s, "works_base_url", "https://works")
    assert s.works_configured is False


def test_works_configured_false_without_token(monkeypatch) -> None:
    s = get_settings()
    monkeypatch.setattr(s, "works_enabled", True)
    monkeypatch.setattr(s, "works_api_token", "  ")
    monkeypatch.setattr(s, "works_base_url", "https://works")
    assert s.works_configured is False


def test_works_configured_true_when_all_set(monkeypatch) -> None:
    s = get_settings()
    monkeypatch.setattr(s, "works_enabled", True)
    monkeypatch.setattr(s, "works_api_token", "service-token")
    monkeypatch.setattr(s, "works_base_url", "https://portal.works.prod.sbt/swtr")
    assert s.works_configured is True
