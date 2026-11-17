"""Проверка формы curl-ответа TT без вывода содержимого тикетов или секретов."""
import json
from pathlib import Path
import re
import sys


def valid_response(name: str, payload: object) -> bool:
    """Проверяет минимальный нативный контракт каждой операции чтения/создания."""
    if name == 'create':
        return isinstance(payload, dict) and bool(re.fullmatch(r'STS-[1-9][0-9]*', str(payload.get('id') or payload.get('code') or '')))
    if name == 'task-detail':
        return isinstance(payload, dict) and bool(re.fullmatch(r'APPSEC-[1-9][0-9]*', str(payload.get('code', '')))) and isinstance(payload.get('attributes'), list)
    if name == 'products':
        return isinstance(payload, dict) and isinstance(payload.get('attributes'), list) and any(
            isinstance(item, dict) and item.get('code') == 'product_code_list_sts' and isinstance(item.get('directoryValues'), list)
            for item in payload['attributes'])
    if name in ('tasks', 'components', 'versions', 'status'):
        return isinstance(payload, (dict, list)) and (isinstance(payload, list) or any(isinstance(payload.get(key), list) for key in ('content', 'items', 'data', 'results', 'result', 'units', 'rows')))
    return name in ('upload', 'link')


def main() -> None:
    """Выдаёт только результат проверки, включая случай HTML логина с HTTP 200."""
    name, filename = sys.argv[1:]
    if name in ('upload', 'link'):
        raise SystemExit(0)
    try:
        payload = json.loads(Path(filename).read_bytes())
        valid = valid_response(name, payload)
    except (OSError, ValueError, RecursionError):
        valid = False
    if not valid:
        print(f'{name}: HTTP успешен, но JSON/структура ответа не соответствует контракту TT.')
    raise SystemExit(0 if valid else 1)


if __name__ == '__main__':
    main()
