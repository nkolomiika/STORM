"""Совпадение сквозных индексов и пунктов с карточками реальных Word-шаблонов."""
from datetime import date
from io import BytesIO

from docx import Document
import pytest

from app.enums import Severity
from app.reports import build_pp, build_szi
from app.reports.word_builder import finding_references
from test_word_builder import _build_payload, _make_link, _make_vuln


@pytest.mark.parametrize("kind,builder,main_point,weak_point", [
    ("szi", build_szi, "4.5.2.1", "4.6.1.1"),
    ("pp", build_pp, "3.3.2", "3.4.1"),
])
def test_report_indexes_continue_into_weaknesses_and_use_first_component(kind, builder, main_point, weak_point):
    data, indexes = _build_payload()
    project = data["project"]
    project.end_date = date(2026, 11, 20)
    project.appsec_components = [{"code": "uuid-1", "name": "EVPC"}, {"code": "uuid-2", "name": "OTHER"}]
    second = _make_vuln(project, title="Second host", severity=Severity.CRITICAL)
    ignored = _make_vuln(project, title="No CVSS", severity=Severity.UNREALIZED)
    link = _make_link(second, data["hosts"][1])
    indexes["assets_by_vuln_id"][second.id] = [link]
    data["vulnerabilities"] += [second, ignored]
    assets = [asset for group in indexes["assets_by_vuln_id"].values() for asset in group]
    refs = finding_references(project, data["vulnerabilities"], data["hosts"], assets, kind=kind)
    weakness = next(v for v in data["vulnerabilities"] if v.severity == Severity.INFO)
    assert refs[second.id] == {"index": "SA-EVPC-201126/02", "point": main_point, "sequence": 2}
    assert refs[weakness.id] == {"index": "SA-EVPC-201126/03", "point": weak_point, "sequence": 3}
    assert ignored.id not in refs
    doc = Document(BytesIO(builder(data, indexes, {})))
    headings = [p.text for p in doc.paragraphs if p.text.startswith("SA-")]
    assert len(headings) == 3
    assert [text.split(":", 1)[0] for text in headings] == [f"SA-EVPC-201126/{n:02d}" for n in (1, 2, 3)]


def test_missing_end_date_never_uses_current_date():
    data, indexes = _build_payload()
    data["project"].end_date = None
    refs = finding_references(data["project"], data["vulnerabilities"], data["hosts"], [])
    assert all("ДДММГГ" in ref["index"] for ref in refs.values())
