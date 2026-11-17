"""Запускает готовый curl-файл с подменой только транспорта, без внешних вызовов."""
import json
import os
from pathlib import Path
import subprocess
import pytest

SCRIPT = Path(__file__).resolve().parents[1] / 'scripts/task_tracker_curl.sh'


@pytest.fixture
def curl_env(tmp_path):
    binary = tmp_path / 'curl'
    binary.write_text('''#!/usr/bin/env python3
import json, os, pathlib, sys
a=sys.argv[1:]
output=pathlib.Path(a[a.index('--output')+1])
name=output.stem
payload={'content':[]}
if name=='products': payload={'attributes':[{'code':'product_code_list_sts','directoryValues':[]}]}
if name=='task-detail': payload={'code':'APPSEC-3291','attributes':[]}
if name=='create': payload={'id':'STS-123'}
output.write_text('<html>login</html>' if os.environ.get('FAKE_HTML') else json.dumps(payload))
with open(os.environ['FAKE_REQUESTS'],'a') as f: f.write(json.dumps(a)+'\\n')
sys.stdout.write(os.environ.get('FAKE_STATUS','200'))
''')
    binary.chmod(0o700)
    env = {**os.environ, 'PATH': str(tmp_path) + ':' + os.environ['PATH'], 'WORKS_API_TOKEN': 'secret-not-in-argv',
           'WORKS_BASE_URL': 'https://tracker.example/swtr', 'TMPDIR': str(tmp_path),
           'FAKE_REQUESTS': str(tmp_path / 'requests.jsonl')}
    for key in ('FAKE_HTML', 'FAKE_STATUS'):
        env.pop(key, None)
    return env


@pytest.mark.parametrize('mode,count', [('read', 6), ('create', 1), ('upload', 1), ('link', 1)])
def test_curl_modes_send_expected_requests_and_remove_auth_file(curl_env, tmp_path, mode, count):
    fixture = tmp_path / 'input.json'
    fixture.write_text('{}')
    curl_env.update(TT_CREATE_JSON=str(fixture), TT_UPLOAD_FILE=str(fixture), TT_DRAFT_ID='draft', TT_FILE_ID='file')
    result = subprocess.run(['bash', str(SCRIPT), mode], env=curl_env, capture_output=True, text=True)
    assert result.returncode == 0, result.stdout + result.stderr
    requests = [json.loads(line) for line in Path(curl_env['FAKE_REQUESTS']).read_text().splitlines()]
    assert len(requests) == count
    assert 'secret-not-in-argv' not in str(requests) + result.stdout + result.stderr
    assert not list(tmp_path.glob('storm-tt-check.*/auth.headers'))
    if mode == 'read':
        assert sum('/find/tql' in arg for request in requests for arg in request) == 1
        assert not any('/create' in arg or '/upload' in arg or '/unit/v1/link' in arg for request in requests for arg in request)
    if mode == 'upload':
        assert not any('application/json' == arg for arg in requests[0])


@pytest.mark.parametrize('failure', ['http', 'html'])
def test_curl_fails_on_http_error_or_login_html(curl_env, failure):
    curl_env['FAKE_STATUS' if failure == 'http' else 'FAKE_HTML'] = '403' if failure == 'http' else '1'
    result = subprocess.run(['bash', str(SCRIPT), 'read'], env=curl_env, capture_output=True, text=True)
    assert result.returncode != 0
    assert 'secret-not-in-argv' not in result.stdout + result.stderr
