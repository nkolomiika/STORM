"""Native AS21/Works unit metadata shared by task cards and project creation."""
from app.exceptions import ValidationError


def assignee_identity(value) -> tuple[str | None, str | None]:
    """Keep the login separate from a display name; never use a bare name as ID."""
    if isinstance(value, str):
        return value.strip() or None, value.strip() or None
    if not isinstance(value, dict):
        return None, None
    login = next((value[key].strip() for key in ('username', 'login', 'preferred_username', 'userName', 'code') if isinstance(value.get(key), str) and value[key].strip()), None)
    name = next((value[key].strip() for key in ('displayName', 'fullName', 'name') if isinstance(value.get(key), str) and value[key].strip()), login)
    return login, name


def affected_versions(attributes: dict) -> list[dict[str, str]]:
    """Parse the native affects_version_s_crpv array without selecting one item."""
    values = attributes.get('affects_version_s_crpv')
    if values is None:
        values = attributes.get('affects_version')
    if values is None:
        return []
    if not isinstance(values, list):
        values = [values]
    result = []
    seen = set()
    for value in values:
        if isinstance(value, str):
            code, name = value.strip(), value.strip()
        elif isinstance(value, dict):
            code = next((value[key].strip() for key in ('code', 'id', 'uuid') if isinstance(value.get(key), str) and value[key].strip()), '')
            name = next((value[key].strip() for key in ('name', 'title', 'version') if isinstance(value.get(key), str) and value[key].strip()), code)
        else:
            continue
        if code and code not in seen:
            result.append({'code': code, 'name': name})
            seen.add(code)
    return result


def normalize_project_versions(payload: dict) -> None:
    """Store arrays canonically; keep the old scalar fields as a compatibility view."""
    if 'appsec_versions' in payload:
        values = payload['appsec_versions']
        if not isinstance(values, list):
            raise ValidationError('Затронутые версии должны быть массивом')
    elif {'appsec_version_code', 'appsec_version_name'}.intersection(payload):
        code = payload.get('appsec_version_code')
        values = [{'code': code, 'name': payload.get('appsec_version_name') or code}] if code else []
    else:
        return
    result = []
    seen = set()
    for value in values:
        if not isinstance(value, dict) or not isinstance(value.get('code'), str) or not value['code'].strip():
            raise ValidationError('У каждой затронутой версии должен быть код')
        code = value['code'].strip()
        if code not in seen:
            result.append({'code': code, 'name': (value.get('name') or code).strip()})
            seen.add(code)
    payload['appsec_versions'] = result
    payload['appsec_version_code'] = result[0]['code'] if result else None
    payload['appsec_version_name'] = result[0]['name'] if result else None
