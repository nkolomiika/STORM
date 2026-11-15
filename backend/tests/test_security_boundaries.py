"""Deterministic hostile-input corpus: no network, scanners or external services."""
import json
import random
from unittest.mock import AsyncMock

import pytest
from fastapi import HTTPException
from jose import jwt
from passlib.context import CryptContext

from app.auth_limits import AuthAttemptLimiter
from app.config import get_settings
from app.exceptions import UnauthorizedError, ValidationError
from app.farm import fingerprint, jsmine, jsscan
from app.input_safety import read_upload, validate_json_value
from app.security import decode_token, hash_password, verify_password
from app.services import ImportService


def test_long_password_suffix_is_not_silently_discarded():
    first = "A" * 72 + "one"
    second = "A" * 72 + "two"
    hashed = hash_password(first)
    assert verify_password(first, hashed)
    assert not verify_password(second, hashed)
    legacy = CryptContext(schemes=["bcrypt"]).hash("old-password")
    assert verify_password("old-password", legacy)
    assert not verify_password("anything", "corrupt-password-hash")


@pytest.mark.parametrize("subject", ["-1", "0", str(2**31), str(10**100), None, [], {}, True])
def test_hostile_signed_subject_is_an_authentication_error(subject):
    token = jwt.encode({"sub": subject, "type": "access"}, get_settings().jwt_secret_key, algorithm="HS256")
    with pytest.raises(UnauthorizedError):
        decode_token(token, "access")


def test_random_scanner_output_corpus_never_crashes_parsers():
    rng = random.Random(20261113)
    keys = ["DetectorName", "Raw", "Verified", "data", "input", "url", "tech", "plugins", "kind", "severity", "context"]
    def value(depth=0):
        leaves = [None, rng.randint(-100, 100), rng.choice([True, False]), "text" + chr(rng.randint(32, 126))]
        if depth >= 4:
            return rng.choice(leaves)
        shape = rng.randrange(3)
        if shape == 0:
            return {key: value(depth + 1) for key in rng.sample(keys, rng.randrange(5))}
        if shape == 1:
            return [value(depth + 1) for _ in range(rng.randrange(4))]
        return rng.choice(leaves)
    for _ in range(250):
        blob = json.dumps(value())
        jsmine._parse_trufflehog(blob.encode())
        jsmine._parse_jsluice_secrets(blob.encode())
        jsmine._parse_jsluice_urls(blob.encode())
        fingerprint.parse_httpx_jsonl(blob)
        fingerprint.parse_whatweb_json(blob)


def test_secrets_are_masked_in_preview_and_surrounding_context():
    key = "AKIAIOSFODNN7EXAMPLE"
    another = "ghp_" + "a" * 36
    findings = jsscan.find_secrets(f'key="{key}"; access="{another}";')
    assert len(findings) >= 2
    for finding in findings:
        assert key not in finding.match_preview + finding.snippet
        assert another not in finding.match_preview + finding.snippet
    external = jsmine._parse_jsluice_secrets(json.dumps({"kind": "provider", "data": {"token": key}, "context": {"line": f'token="{key}"'}}).encode())
    assert external and key not in external[0].snippet


@pytest.mark.parametrize("value", ["\x00", {"x": "\x00"}, {"\x00": 1}, [float("nan")], float("inf")])
def test_invalid_json_values_are_rejected_recursively(value):
    with pytest.raises(ValueError):
        validate_json_value(value)


def test_recursive_yaml_and_object_construction_tags_are_rejected():
    for value in ['a: &a [*a]', 'a: !!python/object/apply:os.system ["echo not-executed"]']:
        with pytest.raises(ValidationError):
            ImportService._load_json_or_yaml_document(value)


@pytest.mark.asyncio
async def test_upload_reader_never_requests_an_unbounded_read():
    upload = AsyncMock()
    upload.read.return_value = b"x" * 11
    with pytest.raises(HTTPException) as error:
        await read_upload(upload, 10)
    assert error.value.status_code == 413
    upload.read.assert_awaited_once_with(11)


def test_auth_limiter_expires_and_bounds_its_memory(monkeypatch):
    clock = [0.0]
    monkeypatch.setattr("app.auth_limits.time.monotonic", lambda: clock[0])
    limiter = AuthAttemptLimiter(limit=2, window=60, max_keys=3)
    limiter.check("user")
    limiter.check("user")
    with pytest.raises(HTTPException) as error:
        limiter.check("user")
    assert error.value.status_code == 429 and error.value.headers["Retry-After"] == "60"
    clock[0] = 61
    limiter.check("user")
    for i in range(20):
        limiter.check(str(i))
    assert len(limiter.buckets) == 3


@pytest.mark.asyncio
async def test_oidc_refuses_hmac_before_requesting_public_keys():
    from app.oidc import OidcClient
    client = OidcClient(get_settings())
    client._find_key = AsyncMock()
    token = jwt.encode({"sub": "attacker"}, "a" * 32, algorithm="HS256")
    with pytest.raises(UnauthorizedError, match="алгоритм"):
        await client._verify_id_token(token, "nonce", {})
    client._find_key.assert_not_awaited()


@pytest.mark.asyncio
async def test_oidc_accepts_a_valid_rsa_token_and_checks_nonce():
    from datetime import UTC, datetime, timedelta
    from cryptography.hazmat.primitives import serialization
    from cryptography.hazmat.primitives.asymmetric import rsa
    from jose import jwk
    from app.oidc import OidcClient
    private = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    pem = private.private_bytes(serialization.Encoding.PEM, serialization.PrivateFormat.PKCS8, serialization.NoEncryption())
    public = private.public_key().public_bytes(serialization.Encoding.PEM, serialization.PublicFormat.SubjectPublicKeyInfo)
    client = OidcClient(get_settings().model_copy(update={"sso_client_id": "test-client"}))
    client._find_key = AsyncMock(return_value=jwk.construct(public, "RS256").to_dict())
    now = datetime.now(UTC)
    token = jwt.encode({"sub": "external-user", "aud": "test-client", "iss": "https://issuer.test", "nonce": "expected", "iat": now, "exp": now + timedelta(minutes=5)}, pem, algorithm="RS256")
    assert (await client._verify_id_token(token, "expected", {"issuer": "https://issuer.test"}))["sub"] == "external-user"
    with pytest.raises(UnauthorizedError, match="nonce"):
        await client._verify_id_token(token, "wrong", {"issuer": "https://issuer.test"})


def test_secret_encryption_roundtrip_keeps_plaintext_out_of_storage():
    from app.security import decrypt_secret, encrypt_secret
    plaintext = 'synthetic-integration-secret'
    encrypted = encrypt_secret(plaintext)
    assert encrypted != plaintext
    assert decrypt_secret(encrypted) == plaintext
