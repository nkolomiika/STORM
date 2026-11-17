"""Native AS21/Works unit metadata shared by task cards and project creation."""
from app.exceptions import ValidationError


def unit_attributes(value: object) -> dict:
    """Нормализует словарь или массив AS21 {attribute: {code}, value} без мутации."""
    if isinstance(value, dict):
        return dict(value)
    if not isinstance(value, list):
        return {}
    result = {}
    for entry in value:
        if not isinstance(entry, dict):
            continue
        attribute = entry.get('attribute') if isinstance(entry.get('attribute'), dict) else entry
        code = attribute.get('code')
        if isinstance(code, str) and code:
            result[code] = entry.get('value')
        # В присланном примере code продукта обрезан, но имя атрибута сохранено.
        # Запасной ключ позволяет прочитать именно это поле без угадывания code.
        if attribute.get('name') == 'Код продукта':
            result.setdefault('_product_code_by_name', entry.get('value'))
    return result


def component_reference(value: object) -> dict[str, str] | None:
    """Читает единственный компонент; при нескольких не выбирает его произвольно."""
    if isinstance(value, list):
        if len(value) != 1:
            return None
        value = value[0]
    if not isinstance(value, dict) or not isinstance(value.get('code'), str) or not value['code'].strip():
        return None
    code = value['code'].strip()
    name = value.get('name') or value.get('title') or code
    if not isinstance(name, str):
        return None
    if len(code) > 64 or len(name) > 255:
        raise ValueError('Некорректная ссылка на компонент')
    return {'code': code, 'name': name}


def component_references(value: object) -> list[dict[str, str]]:
    """Сохраняет все компоненты APPSEC в исходном порядке, удаляя дубли кодов."""
    values = value if isinstance(value, list) else [value]
    result = []
    seen = set()
    for item in values:
        reference = component_reference(item)
        if reference and reference['code'] not in seen:
            seen.add(reference['code'])
            result.append(reference)
    return result


def normalize_project_components(payload: dict) -> None:
    """Сохраняет массив компонентов; старые скалярные поля отражают первый элемент."""
    if 'appsec_components' in payload:
        values = payload['appsec_components']
        if not isinstance(values, list):
            raise ValidationError('Компоненты должны быть массивом')
    elif {'appsec_component_code', 'appsec_component_name'}.intersection(payload):
        code = payload.get('appsec_component_code')
        values = [{'code': code, 'name': payload.get('appsec_component_name') or code}] if code else []
    else:
        return
    if any(not isinstance(value, dict) or not isinstance(value.get('code'), str) or not value['code'].strip() for value in values):
        raise ValidationError('У каждого компонента должен быть код')
    try:
        references = component_references(values)
    except ValueError as exc:
        raise ValidationError(str(exc)) from exc
    payload['appsec_components'] = references
    payload['appsec_component_code'] = references[0]['code'] if references else None
    payload['appsec_component_name'] = references[0]['name'] if references else None


def assignee_identity(value) -> tuple[str | None, str | None]:
    """Keep the login separate from a display name; never use a bare name as ID."""
    if isinstance(value, str):
        return value.strip() or None, value.strip() or None
    if not isinstance(value, dict):
        return None, None
    login = next((value[key].strip() for key in ('username', 'login', 'preferred_username', 'userName', 'code') if isinstance(value.get(key), str) and value[key].strip()), None)
    parts = ' '.join(value[key].strip() for key in ('lastName', 'firstName', 'middleName')
                     if isinstance(value.get(key), str) and value[key].strip())
    name = next((value[key].strip() for key in ('displayName', 'fullName', 'name') if isinstance(value.get(key), str) and value[key].strip()), parts or login)
    return login, name


def affected_versions(attributes: dict) -> list[dict[str, str]]:
    """Читает все версии APPSEC из affects_version_s и прежних форматов AS21."""
    values = attributes.get('affects_version_s')
    if values is None:
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
