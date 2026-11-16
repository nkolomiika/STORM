"""Клиент Works (sbertrack) для экспорта устранения уязвимостей в STS / bug_appsec.

Аутентификация как в qg-sa: Bearer-токен сервисной учётки + статическая cookie
(works_api_token / works_cookies из конфига). Формы запросов воспроизведены по
образцам из браузера (сессионные cookie из них НЕ используются — только Bearer).

Операции:
  • find_components / find_versions — резолв имя→UUID (и typeahead);
  • upload_draft_file            — предзагрузка вложения в черновик;
  • create_bug_appsec            — создание тикета bug_appsec в space STS.

Эндпоинты и подключение настраиваемы через env (app.config.Settings.works_*),
чтобы инстанс с чуть другим API подключался без правки кода.
"""
from __future__ import annotations

import logging
import uuid
from typing import Any

import httpx

from .config import get_settings

logger = logging.getLogger("storm.works")
settings = get_settings()


# CVSS-критичность STORM → приоритет Works (по ТЗ).
SEVERITY_TO_PRIORITY: dict[str, str] = {
    "info": "trivial",
    "low": "minor",
    "medium": "major",
    "high": "critical",
    "critical": "blocker",
}

# Практика обнаружения — всегда «анализ защищённости».
DETECTION_PRACTICE = ["security_analysis"]


class WorksError(Exception):
    """Ошибка обращения к Works. message — для пользователя, detail — в лог."""

    def __init__(self, message: str, detail: str = ""):
        super().__init__(message)
        self.message = message
        self.detail = detail


def priority_for_severity(severity: str | None) -> str:
    """CVSS-критичность → приоритет Works; неизвестное → trivial (info)."""
    return SEVERITY_TO_PRIORITY.get((severity or "").strip().lower(), "trivial")


def text_to_prosemirror(text: str | None) -> dict[str, Any]:
    """Простой текст (с переносами) → ProseMirror/TipTap doc, как ждёт Works.

    Полноценный markdown не конвертируем — каждый абзац (разделённый пустой
    строкой) кладём отдельным paragraph. Пустой текст → один пустой paragraph.
    """
    raw = (text or "").replace("\r\n", "\n").strip()
    blocks = [b.strip() for b in raw.split("\n\n")] if raw else []
    paragraphs: list[dict[str, Any]] = []
    for block in blocks:
        if not block:
            continue
        paragraphs.append(
            {
                "type": "paragraph",
                "attrs": {"id": str(uuid.uuid4()), "indent": 0, "textAlign": "justify"},
                "content": [{"type": "text", "text": block}],
            }
        )
    if not paragraphs:
        paragraphs.append(
            {"type": "paragraph", "attrs": {"id": str(uuid.uuid4()), "indent": 0, "textAlign": "justify"}}
        )
    return {"type": "doc", "content": paragraphs}


def _unit_ref(code: str | None, name: str | None) -> dict[str, Any] | None:
    """Ссылка на справочный юнит (компонент/версия): {code, name, title}."""
    if not code:
        return None
    return {"code": code, "name": name or code, "title": name or code}


def _extract_items(payload: Any) -> list[dict[str, Any]]:
    """Достаёт список элементов из ответа find-эндпоинта (форма заранее неизвестна).

    Ответ может быть списком, либо объектом со списком под одним из типовых
    ключей (content/items/data/results/units/rows). Элементы иногда завёрнуты в
    {"unit": {...}} — разворачиваем.
    """
    container: Any = payload
    if isinstance(payload, dict):
        for key in ("content", "items", "data", "results", "result", "units", "rows"):
            if isinstance(payload.get(key), list):
                container = payload[key]
                break
        else:
            container = []
    if not isinstance(container, list):
        return []
    out: list[dict[str, Any]] = []
    for it in container:
        if isinstance(it, dict):
            out.append(it.get("unit") if isinstance(it.get("unit"), dict) else it)
    return out


def _item_code_name(item: dict[str, Any]) -> dict[str, str]:
    """Из элемента find-ответа вытаскиваем code (UUID) + name."""
    code = item.get("code") or item.get("id") or item.get("uuid") or ""
    name = item.get("name") or item.get("title") or item.get("summary") or code
    return {"code": str(code), "name": str(name)}


def _workflow_status_name(item: dict[str, Any]) -> str | None:
    """Имя workflow_status из юнита (форма ответа заранее неизвестна).

    Статус лежит либо в attributes/attrs как {name, code} (или строкой), либо
    прямо на юните. Возвращаем человекочитаемое имя (или код)."""
    for container in (item.get("attributes"), item.get("attrs"), item):
        if not isinstance(container, dict):
            continue
        status = container.get("workflow_status")
        if isinstance(status, dict):
            name = status.get("name") or status.get("code")
            if name:
                return str(name)
        elif isinstance(status, str) and status:
            return status
    return None


class WorksClient:
    """Тонкий async-клиент Works. Создаётся на время запроса и закрывается."""

    def __init__(self) -> None:
        if not settings.works_configured:
            raise WorksError("Интеграция с Works не настроена.")
        self._base = settings.works_base_url.rstrip("/")
        # Works (как и в референс-клиенте qg-sa) ждёт Bearer + статическую cookie,
        # плюс заголовок Origin (хост без /swtr) — иначе часть эндпоинтов отвечает 403.
        token = settings.works_api_token.strip()
        if token.lower().startswith("bearer "):
            token = token[7:].strip()
        origin = settings.works_base_url.split("/swtr")[0].rstrip("/")
        self._client = httpx.AsyncClient(
            timeout=settings.works_timeout_seconds,
            verify=settings.works_verify_ssl,
            headers={
                "Authorization": f"Bearer {token}",
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json",
                "Origin": origin,
            },
            cookies=settings.works_cookies_dict,
        )

    async def __aenter__(self) -> "WorksClient":
        return self

    async def __aexit__(self, *exc: Any) -> None:
        await self._client.aclose()

    def _url(self, path: str) -> str:
        return f"{self._base}{path}"

    @staticmethod
    def _raise_for_status(resp: httpx.Response, what: str) -> None:
        try:
            duration = round(resp.elapsed.total_seconds() * 1000, 1)
        except RuntimeError:
            duration = None
        logger.info('task_tracker_request operation=%s method=%s status=%s duration_ms=%s', what, resp.request.method, resp.status_code, duration)
        if resp.status_code < 400:
            return
        body = resp.text[:500]
        detail = f"{resp.request.method} {resp.request.url} -> {resp.status_code}\n{body}"
        logger.warning('task_tracker_request_failed operation=%s status=%s', what, resp.status_code)
        if resp.status_code in (401, 403):
            raise WorksError("Не удалось подключиться к Task Tracker. Обратитесь к администратору.", detail)
        raise WorksError("Task Tracker отклонил запрос. Проверьте данные и попробуйте позже.", detail)

    async def _find(self, path: str, query: str, limit: int) -> list[dict[str, str]]:
        body = {
            "space": settings.works_space,
            "withArchived": False,
            "withDeleted": False,
            "query": query or "",
            "page": {"page": 0, "size": max(1, min(limit, 100))},
        }
        try:
            resp = await self._client.post(self._url(path), json=body)
        except httpx.HTTPError as exc:  # noqa: BLE001
            raise WorksError("Не удалось соединиться с Works.", str(exc)) from exc
        self._raise_for_status(resp, "find")
        try:
            data = resp.json()
        except ValueError as exc:
            raise WorksError("Works вернул не-JSON ответ.", resp.text[:500]) from exc
        return [_item_code_name(it) for it in _extract_items(data)]

    async def find_components(self, query: str = "", limit: int = 50) -> list[dict[str, str]]:
        return await self._find(settings.works_component_find_path, query, limit)

    async def find_versions(self, query: str = "", limit: int = 50) -> list[dict[str, str]]:
        return await self._find(settings.works_version_find_path, query, limit)

    async def get_ticket_status(self, key: str) -> str | None:
        """Текущий workflow_status тикета по ключу (напр. STS-594003).

        Используем тот же unit-find, что и qg-sa: фильтр по units=[key]."""
        body = {
            "filters": {"units": [key]},
            "attributes": ["workflow_status"],
            "page": {"page": 0, "size": 1},
        }
        try:
            resp = await self._client.post(self._url(settings.works_unit_find_path), json=body)
        except httpx.HTTPError as exc:  # noqa: BLE001
            raise WorksError("Не удалось получить статус тикета из Works.", str(exc)) from exc
        self._raise_for_status(resp, "ticket status")
        try:
            data = resp.json()
        except ValueError:
            return None
        items = _extract_items(data)
        return _workflow_status_name(items[0]) if items else None

    async def upload_draft_file(
        self, *, draft_id: str, filename: str, content: bytes, content_type: str | None, relative_path: str
    ) -> str:
        """Загружает файл в черновик; возвращает fileId для draftsInfo."""
        file_id = str(uuid.uuid4())
        files = {"file": (filename, content, content_type or "application/octet-stream")}
        form = {
            "fileName": filename,
            "fileId": file_id,
            "draftId": draft_id,
            "relativePathPart": relative_path,
        }
        try:
            resp = await self._client.post(self._url(settings.works_upload_path), data=form, files=files)
        except httpx.HTTPError as exc:  # noqa: BLE001
            raise WorksError("Не удалось загрузить файл в Works.", str(exc)) from exc
        self._raise_for_status(resp, "upload")
        return file_id

    async def create_bug_appsec(
        self,
        *,
        summary: str,
        description_text: str | None,
        assigned_to: str,
        reporter: str,
        priority: str,
        component: dict[str, str] | None,
        versions: list[dict[str, str]],
        drafts_info: list[dict[str, str]] | None = None,
    ) -> dict[str, Any]:
        """Создаёт тикет bug_appsec в space STS. Возвращает JSON ответа Works."""
        attributes: dict[str, Any] = {
            "space": settings.works_space,
            "tenant": settings.works_tenant,
            "priority": priority,
            "assigned_to": assigned_to,
            "reporter": reporter,
            "workflow_status": {"command": "NEW"},
            "resolution_wmb": "not_done",
            "vulnerability_detection_practice": DETECTION_PRACTICE,
            "exclusion_from_sla_calculation": "noo",
            # Компонент и затронутая версия — обязательные справочные поля.
            "sber_component": [_unit_ref(component.get("code"), component.get("name"))] if component else None,
            "affects_version_s_crpv": [_unit_ref(version.get("code"), version.get("name")) for version in versions] or None,
            # Остальные поля из образца создаём пустыми (Works подставит дефолты).
            "label": None,
            "affects_version": None,
            "fix_version": None,
            "fix_version_s": None,
            "triage_result": None,
            "Resolution_appsec": None,
            "product_code_list_sts": None,
            "vulnerable_package_sts": None,
            "version_vulnerable_package": None,
            "vulnerability_identifier_sts": None,
            "initial_criticality_cvss": None,
            "revised_criticality_cvss": None,
            "original_cvss": None,
            "revised_cvss_vector": None,
        }
        payload: dict[str, Any] = {
            "space": settings.works_space,
            "suit": settings.works_suit,
            "summary": summary,
            "description": text_to_prosemirror(description_text),
            "code": None,
            "draftsInfo": drafts_info or [{"draftId": str(uuid.uuid4()), "relativePathPart": assigned_to}],
            "links": [],
            "attributes": attributes,
        }
        try:
            resp = await self._client.post(self._url(settings.works_create_path), json=payload)
        except httpx.HTTPError as exc:  # noqa: BLE001
            raise WorksError("Не удалось создать тикет в Works.", str(exc)) from exc
        self._raise_for_status(resp, "create")
        try:
            return resp.json()
        except ValueError:
            return {"raw": resp.text}

    async def link_units(
        self, *, source: str, destination: str, link_type: str | None = None
    ) -> dict[str, Any]:
        """Создаёт связь между юнитами Works.

        POST {works_link_path} с телом {"source", "destination", "type"}. Применяется
        для привязки созданного STS-тикета (bug_appsec) к APPSEC-тикету проекта
        (запросу на АЗ). Возвращает JSON ответа Works.
        """
        payload = {
            "source": source,
            "destination": destination,
            "type": link_type or settings.works_link_type,
        }
        try:
            resp = await self._client.post(self._url(settings.works_link_path), json=payload)
        except httpx.HTTPError as exc:  # noqa: BLE001
            raise WorksError("Не удалось создать связь тикетов в Works.", str(exc)) from exc
        self._raise_for_status(resp, "link")
        try:
            return resp.json()
        except ValueError:
            return {"raw": resp.text}


def works_issue_url(key: str, *, space: str | None = None) -> str:
    """Ссылка на тикет Works в UI."""
    return settings.works_issue_url_template.format(key=key, space=space or settings.works_space)
