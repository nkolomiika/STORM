"""Keep exported STS findings separate from APPSEC assessment/project tickets."""
import re
from urllib.parse import parse_qs, unquote, urlsplit

from app.config import get_settings
from app.exceptions import ValidationError
from app.works import works_issue_url


def is_project_ticket(key: str) -> bool:
    """Accept only a unit code in the configured assessment space (APPSEC)."""
    return bool(re.fullmatch(re.escape(get_settings().works_tasks_space) + r"-\d+", key))


def normalize_project_ticket(payload: dict, *, required: bool = False) -> None:
    """Нормализует необязательную привязку APPSEC или отклоняет конфликт ключа и URL.

    Пустые явно переданные поля очищают привязку. required запрещает пустой
    тикет при экспорте. Существование задачи здесь не проверяется по сети.
    """
    if not {"appsec_ticket_key", "appsec_ticket_url"}.intersection(payload):
        if required:
            raise ValidationError("Укажите APPSEC-тикет проекта")
        return
    key = (payload.get("appsec_ticket_key") or "").strip()
    url = (payload.get("appsec_ticket_url") or "").strip()
    if not key and not url:
        if required:
            raise ValidationError("Укажите APPSEC-тикет проекта")
        payload['appsec_ticket_key'] = None
        payload['appsec_ticket_url'] = None
        return
    if url:
        try:
            parsed = urlsplit(url)
        except ValueError as exc:
            raise ValidationError("Некорректная ссылка на тикет APPSEC") from exc
        if parsed.scheme not in {"https", "http"} or not parsed.netloc:
            raise ValidationError("Некорректная ссылка на тикет APPSEC")
        url_key = unquote(parsed.path.rstrip("/").rsplit("/", 1)[-1])
        space = parse_qs(parsed.query).get("space", [get_settings().works_tasks_space])
        if not is_project_ticket(url_key) or space != [get_settings().works_tasks_space]:
            raise ValidationError("Проект должен быть привязан к тикету пространства APPSEC")
        if key and key != url_key:
            raise ValidationError("Ключ тикета не совпадает со ссылкой APPSEC")
        key = url_key
    if key and not is_project_ticket(key):
        raise ValidationError("Проект должен быть привязан к тикету пространства APPSEC")
    payload["appsec_ticket_key"] = key or None
    payload["appsec_ticket_url"] = url or (works_issue_url(key, space=get_settings().works_tasks_space) if key else None)
