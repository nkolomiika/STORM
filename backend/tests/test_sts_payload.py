"""Точный контракт bug_appsec по рабочему запросу браузера, без внешней сети."""
import json

import httpx
import pytest

from app.config import get_settings
from app.services import WorksService
from app.works import WorksClient, WorksError, priority_for_severity

VECTOR = 'AV:N/AC:L/AT:P/PR:L/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N'


@pytest.mark.asyncio
@pytest.mark.parametrize('severity,priority,criticality', [
    ('critical', 'blocker', 'critical_cvss'), ('high', 'critical', 'high_cvss'),
    ('medium', 'major', 'medium_cvss'), ('low', 'minor', 'low_cvss'),
    ('info', 'trivial', None),
])
async def test_sts_payload_matches_every_field_and_uses_one_criticality(monkeypatch, severity, priority, criticality):
    settings = get_settings()
    for name, value in {'works_space': 'STS', 'works_tasks_space': 'APPSEC',
                        'works_tenant': 'default', 'works_suit': 'bug_appsec'}.items():
        monkeypatch.setattr(settings, name, value)
    captured = []
    def handler(request):
        assert request.url.path == '/swtr/rest/api/unit/v2/bug_appsec/create'
        captured.append(json.loads(request.content))
        return httpx.Response(200, json={'id': 'STS-621376'})
    client = WorksClient.__new__(WorksClient)
    client._base = 'https://tracker.example/swtr'
    client._client = httpx.AsyncClient(transport=httpx.MockTransport(handler))
    async with client:
        result = await client.create_bug_appsec(
            summary='Test vulnerability', description_text=None, assigned_to='pentester',
            reporter='reporter', priority=priority_for_severity(severity),
            component={'code': 'component-id', 'name': 'Component'},
            versions=[{'code': 'v1', 'name': 'Product 1.0-beta.2'}],
            product_code=' dbc ', severity=severity, cvss_vector='CVSS:4.0/'+VECTOR,
        )
    assert result == {'id': 'STS-621376'}
    assert captured == [{
        'space': 'STS', 'suit': 'bug_appsec', 'description': None,
        'summary': 'Test vulnerability', 'code': None, 'draftsInfo': [], 'links': [],
        'attributes': {
            'space': 'APPSEC', 'tenant': 'default', 'reporter': 'reporter',
            'assigned_to': 'pentester', 'priority': priority,
            'sber_component': [{'code': 'component-id', 'name': 'Component', 'title': 'Component'}],
            'affects_version_s_crpv': [{'code': 'v1', 'name': 'Product 1.0-beta.2'}],
            'fix_version_s': None, 'label': ['Vuln_Pentest', 'vuln'],
            'triage_result': None, 'Resolution_appsec': None,
            'result_text_field_multi_line_crpv': None, 'workflow_status': {'command': 'NEW'},
            'external_link': None, 'product_code_list_sts': 'dbc',
            'vulnerable_package_sts': None, 'version_vulnerable_package': None,
            'vulnerability_identifier_sts': None,
            'vulnerability_detection_practice': ['security_analysis'],
            'original_cvss': VECTOR, 'revised_cvss_vector': None,
            'initial_criticality_cvss': [criticality] if criticality else None, 'revised_criticality_cvss': None,
            'exclusion_from_sla_calculation': 'noo', 'watchers': None,
            'affects_version_s': None, 'customfield_24900': None,
            'resolution_appsec': None, 'customfield_24413': None,
        },
    }]


@pytest.mark.asyncio
@pytest.mark.parametrize('code', [None, '', '   ', [], {}, 'x'*256])
async def test_missing_or_invalid_product_code_never_sends_a_request(code):
    def unexpected(_):
        pytest.fail('Некорректный код продукта не должен отправляться в STS')
    client = WorksClient.__new__(WorksClient)
    client._base = 'https://tracker.example/swtr'
    client._client = httpx.AsyncClient(transport=httpx.MockTransport(unexpected))
    async with client:
        with pytest.raises(WorksError, match='код продукта'):
            await client.create_bug_appsec(summary='Test', description_text=None,
                assigned_to='pentester', reporter='reporter', priority='major',
                component=None, versions=[], product_code=code, severity='medium')


@pytest.mark.parametrize('response,expected', [
    ({'id': 'STS-621376'}, 'STS-621376'), ({'unit': {'id': 'STS-2'}}, 'STS-2'),
    ({'code': 'STS-3'}, 'STS-3'), ({'id': 123}, ''), ({'id': 'APPSEC-1'}, ''),
    ({'unexpected': 'STS-1'}, ''), (None, ''), ({'id': 'STS-1/../../'}, ''),
])
def test_created_ticket_key_supports_native_id_and_rejects_invalid_values(response, expected):
    assert WorksService._extract_key(response) == expected
