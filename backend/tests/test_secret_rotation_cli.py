"""Ошибки конфигурации утилиты не раскрывают исторические ключи."""
import pytest
from scripts.rotate_data_encryption_key import migration_keys
from app.config import get_settings


@pytest.mark.parametrize('value', ['not-json-private', '{}', '"private"', '["private"]', '[null]'])
def test_migration_keys_reject_invalid_config_without_disclosing_input(monkeypatch, value):
    monkeypatch.setenv('STORM_LEGACY_ENCRYPTION_KEYS', value)
    with pytest.raises(ValueError) as error:
        migration_keys(False)
    assert 'private' not in str(error.value)


def test_legacy_jwt_requires_explicit_migration_flag(monkeypatch):
    monkeypatch.delenv('STORM_LEGACY_ENCRYPTION_KEYS', raising=False)
    assert migration_keys(False) == []
    assert migration_keys(True) == [get_settings().jwt_secret_key]
