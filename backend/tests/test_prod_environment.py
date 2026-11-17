"""Проверяет только публичный шаблон prod env; реальные секреты не читаются."""
from pathlib import Path
import json

from dotenv import dotenv_values
from app.config import Settings


def test_prod_example_matches_confirmed_iam_and_as21_contracts():
    root = Path(__file__).resolve().parents[2]
    if not (root/'.env.prod.example').is_file():
        root = Path('/workspace')
    values = dotenv_values(root/'.env.prod.example')
    options = {key.lower(): value for key, value in values.items() if key.lower() in Settings.model_fields}
    options['works_tasks_search_body'] = json.loads(options['works_tasks_search_body'])
    options.update(jwt_secret_key='test-secret-key-at-least-32-characters',
                   sso_issuer='https://iam.example/realms/storm', sso_client_id='test-client',
                   works_api_token='test-only-token')
    settings = Settings(_env_file=None, **options)
    assert settings.sso_configured and settings.works_configured
    assert settings.sso_auto_create_users is True
    assert settings.sso_redirect_uri == 'https://storm.appsec.prod.sbt/auth/callback'
    assert settings.app_base_url == 'https://storm.appsec.prod.sbt'
    assert settings.csrf_origins == ['https://storm.appsec.prod.sbt']
    assert settings.works_base_url == 'https://portal.works.prod.sbt/swtr'
    assert settings.works_tasks_space == 'APPSEC' and settings.works_space == 'STS'
    assert settings.works_reference_space == 'STS'
    assert settings.works_unit_detail_path == '/rest/api/unit/v2/{key}'
    assert settings.works_tasks_demo_file == ''
    assert settings.works_verify_ssl is True and settings.sso_verify_tls is True
    body = json.loads(values['WORKS_TASKS_SEARCH_BODY'])
    assert body == settings.works_tasks_search_body
    assert body['query'] == 'space = "APPSEC" and suit = "security_assessment_appsec"'
    assert 'affects_version_s' in body['attributes']
