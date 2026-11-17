"""Совместимость шифрования при смене JWT и восстановлении старого ключа."""
import pytest
from cryptography.fernet import InvalidToken
from pydantic import ValidationError

from app.config import get_settings, Settings
from app.security import encrypt_secret, decrypt_secret, _fernet


@pytest.fixture
def keys(monkeypatch):
    settings = get_settings()
    monkeypatch.setattr(settings, 'jwt_secret_key', 'old-jwt-' * 8)
    monkeypatch.setattr(settings, 'data_encryption_key', 'independent-data-key-' * 4)
    monkeypatch.setattr(settings, 'data_encryption_previous_keys', [])
    return settings


def test_jwt_rotation_does_not_affect_data_and_jwt_cannot_decrypt_password(keys, monkeypatch):
    secret = 'пароль\nwith Unicode 🔑'
    value = encrypt_secret(secret)
    old_jwt = keys.jwt_secret_key
    monkeypatch.setattr(keys, 'jwt_secret_key', 'new-jwt-' * 8)
    assert decrypt_secret(value) == secret
    for jwt in [old_jwt, keys.jwt_secret_key]:
        with pytest.raises(InvalidToken):
            _fernet(jwt).decrypt(value.encode())


def test_runtime_never_falls_back_to_jwt(keys):
    legacy = _fernet(keys.jwt_secret_key).encrypt(b'legacy')
    with pytest.raises(InvalidToken):
        decrypt_secret(legacy.decode())


def test_writes_use_only_active_key_and_reads_try_only_explicit_previous_data_keys(keys, monkeypatch):
    old_data = keys.data_encryption_key
    value = encrypt_secret('previous')
    monkeypatch.setattr(keys, 'data_encryption_key', 'new-data-key-' * 5)
    with pytest.raises(InvalidToken):
        decrypt_secret(value)
    monkeypatch.setattr(keys, 'data_encryption_previous_keys', ['wrong-key-' * 5, old_data, old_data])
    assert decrypt_secret(value) == 'previous'
    fresh = encrypt_secret('fresh')
    for key in [old_data, keys.jwt_secret_key]:
        with pytest.raises(InvalidToken):
            _fernet(key).decrypt(fresh.encode())
    assert _fernet(keys.data_encryption_key).decrypt(fresh.encode()) == b'fresh'


@pytest.mark.parametrize('value', ['', 'bad-token', None, '\u2603', 12])
def test_invalid_ciphertext_fails_closed(keys, value):
    with pytest.raises(InvalidToken):
        decrypt_secret(value)


@pytest.mark.parametrize('field,value', [('data_encryption_key', ''), ('data_encryption_key', ' ' * 40), ('data_encryption_key', 'too-short-secret'),
                                       ('data_encryption_previous_keys', ['too-short-secret']),
                                       ('data_encryption_previous_keys', ['x' * 32] * 6)])
def test_encryption_config_rejects_bad_keys_without_printing_values(field, value):
    with pytest.raises(ValidationError) as error:
        Settings(**{field: value})
    assert 'too-short-secret' not in str(error.value)


@pytest.mark.parametrize('previous', [False, True])
def test_jwt_key_cannot_be_configured_as_data_key(previous):
    jwt = 'jwt-test-key-' * 4
    values = {'jwt_secret_key': jwt, 'data_encryption_key': 'other-data-key-' * 4}
    values['data_encryption_previous_keys' if previous else 'data_encryption_key'] = [jwt] if previous else jwt
    with pytest.raises(ValidationError, match='должны различаться') as error:
        Settings(**values)
    assert jwt not in str(error.value)


def test_missing_data_key_is_not_replaced_by_jwt(monkeypatch):
    monkeypatch.delenv('DATA_ENCRYPTION_KEY', raising=False)
    with pytest.raises(ValidationError):
        Settings(_env_file=None)
