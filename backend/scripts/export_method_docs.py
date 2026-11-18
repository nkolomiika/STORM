"""Создаёт справочник объявленных методов Python/TypeScript и HTTP-контрактов.

Читает AST и статический OpenAPI; не импортирует приложение, не читает .env,
не подключается к БД. Сначала экспортируйте OpenAPI и TypeScript-объявления.
"""
from __future__ import annotations

import argparse
import ast
import json
import os
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[2]
DOCS = ROOT / "docs"
PARAMETERS = {
    "db": "Асинхронная SQLAlchemy-сессия текущего запроса.",
    "project_id": "ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис.",
    "host_id": "ID родительского хоста.", "vuln_id": "ID уязвимости.",
    "vulnerability_id": "ID уязвимости.", "actor_id": "ID инициатора для аудита и уведомлений.",
    "actor": "Авторизованный инициатор операции.", "user_id": "ID пользователя.",
    "payload": "Данные операции; для HTTP структура определена Pydantic request-схемой.",
    "page": "Номер страницы, начиная с 1.", "size": "Число элементов страницы; верхняя граница задаётся маршрутом.",
    "offset": "Число пропускаемых записей.", "limit": "Максимальное число возвращаемых записей.",
    "ip_address": "IP-адрес; в AuditService — адрес клиента.", "port_id": "ID родительского порта.",
    "ip_address_id": "ID адреса HostIpAddress, а не строковое представление IP.",
    "endpoint_id": "ID эндпоинта.", "comment_id": "ID комментария.", "note_id": "ID заметки.",
    "parent_id": "ID родителя; None обозначает корень, если допускается контрактом.",
    "file_id": "ID метаданных файла в БД.", "request": "HTTP-запрос Starlette/FastAPI.",
    "response": "HTTP-ответ, в котором могут устанавливаться cookie/заголовки.",
    "websocket": "Активное соединение Starlette WebSocket.", "current_user": "Пользователь из dependency авторизации.",
    "content": "Текст содержимого; формат определяется вызывающим сервисом.",
    "is_read": "Фильтр уведомлений; None не ограничивает прочитанность.",
    "projectId": "ID проекта в API.", "hostId": "ID хоста в API.", "vulnId": "ID уязвимости в API.",
    "onChange": "Callback изменения значения редактора/контрола.",
    "raw": "Исходное значение до нормализации/разбора.", "fallback": "Запасное значение при отсутствии основного.",
    "action": "Тип события аудита.", "entity_type": "Тип сущности в журнале аудита.",
    "entity_id": "ID сущности в журнале, если событие связано с записью.",
    "details": "Дополнительный контекст события.", "value": "Входное значение преобразования/проверки.",
    "label": "Текст подписи/сообщения проверки.", "error": "Перехваченное исключение/ответ ошибки.",
    "token": "Токен операции; формат определяется вызывающим методом.",
    "expires_at": "Срок действия в UTC.", "username": "Имя пользователя.",
    "email": "Email пользователя/получателя.", "password": "Пароль, передаваемый в операцию.",
    "content_type": "MIME-тип содержимого.", "filename": "Имя файла.",
    "items": "Набор элементов для обработки.", "hosts": "Набор хостов для обработки.",
    "status": "Статус операции/ресурса; допустимые значения задаёт Enum или схема.",
    "severity": "Критичность находки (Enum Severity).", "name": "Имя/название обрабатываемого объекта.",
    "url": "URL обрабатываемого ресурса.", "timeout": "Предельное время ожидания операции.",
}
OVERRIDES = {
    "AssetService._ensure_host": "Проверяет существование хоста в указанном проекте одним SELECT id; не загружает его дочерние коллекции. Используется как защита вложенных CRUD-операций.",
    "AssetService._get_host": "Загружает хост с IP → портами → сервисами и эндпоинтами для сериализации HostOut. Не использовать как простую проверку доступа: объём данных зависит от всего дерева хоста.",
    "AssetService.list_hosts": "Возвращает страницу полных деревьев хостов и total. origin=host скрывает служебных родителей IP, origin=all включает их. Размер страницы ограничивает хосты, но не число вложенных эндпоинтов.",
    "AssetService.list_js_files": "Возвращает страницу JS-файлов с секретами и hostname. Сортировка: secret_count DESC, url; имена хостов запрашиваются только для текущей страницы. Возвращает (items, total).",
    "AssetService.update_host": "Обновляет явно переданные поля хоста и при наличии IP-полей заменяет набор адресов. Сейчас None в обычных полях пропускается; это зарегистрировано как спорное поведение. Сохранение и аудит выполняются раздельными commit.",
    "AssetService.create_endpoint": "Разбирает raw/structured request, нормализует путь и проверяет дубликат (host, path, method). При совпадении дополняет незаполненные поля существующей записи; иначе создаёт эндпоинт.",
    "AssetService.update_endpoint": "Применяет raw/structured request к существующему эндпоинту, проверяет конфликт нового method/path. Пустые поля запроса могут очищаться; нормализация UUID в пути сохраняется.",
    "CommentService.list": "Возвращает страницу комментариев и total после проверки принадлежности уязвимости проекту. Авторы загружаются JOIN, упоминания — одним запросом на страницу; SQL-запросов нет внутри цикла вывода.",
    "NotificationService._contexts": "Обогащает только уведомления текущей страницы. Делает не более трёх общих запросов: комментарии находок, комментарии заметок, события проекта/статуса. Отсутствующий предмет оставляет context пустым.",
    "NotificationService.list": "Возвращает страницу уведомлений только указанного пользователя, с необязательным фильтром is_read и контекстом. Число запросов зависит от типов контекста, а не от размера страницы.",
    "VulnerabilityService.host_links_for_page": "Одним запросом возвращает первый связанный хост для каждой находки переданной страницы. При нескольких связях выбирает минимальный ID связи. Убирает HTTP-запрос карточки на каждую строку списка.",
    "AuditService.log": "Добавляет запись аудита в текущую транзакцию. По умолчанию выполняет commit; commit=False ограничивается flush и позволяет сохранить несколько изменений и записей аудита одним внешним commit.",
    "getHosts": "Последовательно загружает все страницы по 200 хостов, включая полные дочерние коллекции. Возвращает объединённый список. Это совместимость текущего интерфейса, а не ограниченная серверная пагинация UI.",
    "getVulnerabilities": "Читает все страницы находок по 100, ограничивая число запросов числом страниц первого ответа. Удаляет дубли по ID и останавливается на пустой странице; итоговый список используется для локальных фильтров и массового экспорта.",
    "buildHostIndex": "Строит индекс доменных суффиксов с сохранением порядка и всех уровней потомков. nestedIds не считает служебный origin=ip родителем. Используется через useMemo вместо повторных попарных сравнений хостов.",
}


def compact(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()


def cell(value) -> str:
    return compact(str(value)).replace("|", "\\|").replace("`", "'")


def source_link(output: Path, source: str, line: int) -> str:
    return f"[{source}:{line}]({os.path.relpath(ROOT / source, output.parent)}#L{line})"


def own_nodes(function):
    """Узлы тела без тел вложенных функций/классов, чтобы не смешивать эффекты."""
    for statement in function.body:
        pending = [statement]
        while pending:
            node = pending.pop()
            if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef, ast.Lambda)):
                continue
            yield node
            pending.extend(reversed(list(ast.iter_child_nodes(node))))


def python_methods(path: Path) -> list[dict]:
    tree = ast.parse(path.read_text(encoding="utf-8"))
    methods = []

    def visit(node, scope):
        for child in ast.iter_child_nodes(node):
            if isinstance(child, ast.ClassDef):
                visit(child, [*scope, child.name])
            elif isinstance(child, (ast.FunctionDef, ast.AsyncFunctionDef)):
                name = ".".join([*scope, child.name])
                params = []
                positional = [*child.args.posonlyargs, *child.args.args]
                defaults = [None] * (len(positional) - len(child.args.defaults)) + list(child.args.defaults)
                arguments = list(zip(positional, defaults)) + list(zip(child.args.kwonlyargs, child.args.kw_defaults))
                if child.args.vararg:
                    arguments.append((child.args.vararg, None))
                if child.args.kwarg:
                    arguments.append((child.args.kwarg, None))
                for argument, default in arguments:
                    if argument.arg in {"self", "cls"}:
                        continue
                    params.append({"name": argument.arg, "type": ast.unparse(argument.annotation) if argument.annotation else "не аннотирован", "default": ast.unparse(default) if default is not None else "обязательный"})
                nodes = list(own_nodes(child))
                calls = sorted({compact(ast.unparse(n.func)) for n in nodes if isinstance(n, ast.Call)})
                raises = sorted({compact(ast.unparse(n.exc)) for n in nodes if isinstance(n, ast.Raise) and n.exc is not None})
                dependencies = [ast.unparse(n.args[0]) for n in ast.walk(child.args) if isinstance(n, ast.Call) and ast.unparse(n.func) == "Depends" and n.args]
                db_calls = [c for c in calls if c.startswith(("self.db.", "db.", "session.", "conn."))]
                routes = [ast.unparse(d) for d in child.decorator_list if isinstance(d, ast.Call) and isinstance(d.func, ast.Attribute) and d.func.attr in {"get", "post", "put", "patch", "delete", "websocket"}]
                methods.append({"name": name, "line": child.lineno, "signature": ("async " if isinstance(child, ast.AsyncFunctionDef) else "") + f"def {child.name}({ast.unparse(child.args)}) -> " + (ast.unparse(child.returns) if child.returns else "не аннотирован"), "description": ast.get_docstring(child) or "", "params": params, "returns": ast.unparse(child.returns) if child.returns else "не аннотирован", "calls": calls, "raises": raises, "dependencies": dependencies, "db_calls": db_calls, "routes": routes})
                visit(child, [*scope, child.name])
            else:
                visit(child, scope)
    visit(tree, [])
    return methods


def describe(method: dict) -> str:
    name = method["name"]
    if name in OVERRIDES:
        return OVERRIDES[name]
    if method.get("description"):
        return method["description"]
    if method.get("http"):
        return "Клиентский HTTP-метод: " + "; ".join(f"{call['method']} `{call['url']}`" for call in method["http"]) + ". Использует общий axios-клиент с cookie и обработкой обновления сессии."
    if name.endswith(".__init__"):
        return "Создаёт экземпляр и сохраняет его зависимости; параметры перечислены ниже."
    # Вместо выдуманного контракта без docstring приводим проверяемые операции.
    calls = method.get("calls", [])
    if method.get("routes"):
        return "Обработчик маршрута; контракт запроса и ответа приведён в справочнике HTTP API."
    if calls:
        return "В теле вызывает " + ", ".join(f"`{c}`" for c in calls[:8]) + ("; полный список ниже." if len(calls) > 8 else ".")
    return "Преобразование/вычисление в теле функции; тип результата и параметры приведены ниже, точное выражение доступно по ссылке на исходник."


def module_document(source: str, methods: list[dict], language: str) -> tuple[Path, str]:
    relative = source.removeprefix("backend/").removeprefix("frontend/")
    output = DOCS / "reference" / language / (relative + ".md")
    lines = [f"# {source}", "", "Сгенерировано из объявлений кода. [Правила чтения](../../" + ("../" * (len(Path(relative).parts) - 1)) + "METHODS.md).", "", f"Методов и именованных функций: **{len(methods)}**.", ""]
    for method in methods:
        lines += [f"## {method['name']}", "", source_link(output, source, method["line"]), "", f"```{'python' if language == 'backend' else 'typescript'}", method["signature"], "```", "", describe(method), ""]
        if method["params"]:
            lines += ["| Параметр | Тип | По умолчанию | Назначение |", "| --- | --- | --- | --- |"]
            for param in method["params"]:
                lines += [f"| `{cell(param['name'])}` | `{cell(param['type'])}` | `{cell(param['default'])}` | {PARAMETERS.get(param['name'], 'Определяется именем/типом и контрактом вызывающего кода.')} |"]
            lines.append("")
        lines += [f"Возвращает: `{cell(method['returns'])}`.", ""]
        if method.get("dependencies"):
            lines += ["Dependencies: " + ", ".join(f"`{d}`" for d in method["dependencies"]) + ".", ""]
        if method.get("routes"):
            lines += ["Маршруты:", "", "```python", *method["routes"], "```", ""]
        if method.get("db_calls"):
            lines += ["Прямые операции с БД: " + ", ".join(f"`{c}`" for c in method["db_calls"]) + ".", ""]
        if method.get("raises"):
            lines += ["Явные raise в теле (исключения вызываемых методов могут добавляться):", "", "```python", *method["raises"], "```", ""]
        if method.get("http"):
            lines += ["Прямые HTTP-вызовы:", ""]
            for call in method["http"]:
                lines += [f"- `{call['method']} {call['url']}`; аргументы: `{' / '.join(call['arguments']) or 'нет'}`."]
            lines.append("")
        if method.get("throws"):
            lines += ["Явные throw в теле:", "", "```typescript", *method["throws"], "```", ""]
        if method.get("calls"):
            lines += ["<details>", "<summary>Прямые вызовы в теле</summary>", "", *[f"- `{call}`" for call in method["calls"]], "", "</details>", ""]
    return output, "\n".join(lines)


def schema_type(schema: dict) -> str:
    if "$ref" in schema:
        return schema["$ref"].rsplit("/", 1)[-1]
    if "anyOf" in schema:
        return " | ".join(schema_type(option) for option in schema["anyOf"])
    if schema.get("type") == "array":
        return f"list[{schema_type(schema.get('items', {}))}]"
    if "enum" in schema:
        return "enum(" + ", ".join(map(str, schema["enum"])) + ")"
    return schema.get("type", "object")


def api_handlers() -> dict[tuple[str, str], dict]:
    """Связывает URL из OpenAPI с исходником и явными Depends обработчика."""
    handlers = {}
    paths = [ROOT / "backend/app/main.py", *sorted((ROOT / "backend/app/routers").glob("*.py"))]
    for path in paths:
        tree = ast.parse(path.read_text())
        router_prefix = ""
        for node in tree.body:
            if isinstance(node, ast.Assign) and isinstance(node.value, ast.Call) and ast.unparse(node.value.func) == "APIRouter":
                router_prefix = next((keyword.value.value for keyword in node.value.keywords if keyword.arg == "prefix" and isinstance(keyword.value, ast.Constant)), "")
        for node in tree.body:
            if not isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                continue
            for decorator in node.decorator_list:
                if not (isinstance(decorator, ast.Call) and isinstance(decorator.func, ast.Attribute) and decorator.func.attr in {"get", "post", "put", "patch", "delete", "head", "options"} and decorator.args and isinstance(decorator.args[0], ast.Constant)):
                    continue
                prefix = "" if path.name == "main.py" else "/api/v2" if path.name == "v2_agent.py" else "/api/v1"
                route = prefix + router_prefix + decorator.args[0].value
                dependencies = [ast.unparse(call.args[0]) for call in ast.walk(node.args) if isinstance(call, ast.Call) and ast.unparse(call.func) == "Depends" and call.args]
                handlers[(decorator.func.attr, route)] = {"source": path.relative_to(ROOT).as_posix(), "line": node.lineno, "name": node.name, "dependencies": dependencies}
    return handlers


def api_documents() -> dict[Path, str]:
    handlers = api_handlers()
    lines = ["# HTTP API: контракты методов", "", "Справочник сгенерирован из актуальных OpenAPI v1/v2. Тела запросов и ответы описаны в [схемах](API_SCHEMAS.md). Для удобного вызова используйте защищённый Swagger `/api/v1/docs` или `/api/v2/docs` в запущенном приложении.", "", "v1 использует cookie-сессию, изменяющие методы проверяют Origin через enforce_csrf там, где эта dependency подключена. v2 использует Bearer agent token и scopes. Точные dependencies, проверки ролей и вызовы сервисов каждого обработчика — в [каталоге методов](METHODS.md). Отсутствие OpenAPI security у v1 не означает публичный доступ: cookie-auth реализована через dependencies.", "", "Общие отображения ошибок: NotFoundError → 404, UnauthorizedError → 401, ForbiddenError → 403, ConflictError → 409, ValidationError и ошибка входной схемы → 422. Необработанное исключение → 500; OpenAPI не перечисляет все сервисные ветви. Конкретные raise указаны в каталоге методов. WebSocket не входит в OpenAPI: см. раздел в руководстве разработчика.", ""]
    schemas = {}
    operation_count = 0
    for version in ("v1", "v2"):
        spec = json.loads((DOCS / f"openapi-{version}.json").read_text())
        lines += [f"## {version}", ""]
        for name, schema in spec.get("components", {}).get("schemas", {}).items():
            schemas.setdefault(name, schema)
        for route, entry in spec["paths"].items():
            for verb, operation in entry.items():
                if verb not in {"get", "post", "put", "patch", "delete", "head", "options", "trace"}:
                    continue
                operation_count += 1
                full_route = route if version == "v1" or route.startswith("/api/") else f"/api/{version}{route}"
                lines += [f"### {verb.upper()} {full_route}", "", operation.get("description") or operation.get("summary", ""), "", f"Operation ID: `{operation['operationId']}`.", ""]
                handler = handlers.get((verb, full_route))
                if handler:
                    lines += [f"Обработчик: `{handler['name']}` — {source_link(DOCS / 'API_REFERENCE.md', handler['source'], handler['line'])}.", ""]
                    if handler["dependencies"]:
                        lines += ["Явные dependencies: " + ", ".join(f"`{dependency}`" for dependency in handler["dependencies"]) + ".", ""]
                params = entry.get("parameters", []) + operation.get("parameters", [])
                if params:
                    lines += ["| Параметр | Где | Тип | Обязательный | Ограничения/по умолчанию |", "| --- | --- | --- | --- | --- |"]
                    for param in params:
                        schema = param.get("schema", {})
                        constraints = {k: v for k, v in schema.items() if k in {"default", "minimum", "maximum", "minLength", "maxLength", "pattern"}}
                        lines += [f"| `{cell(param['name'])}` | {param['in']} | `{cell(schema_type(schema))}` | {'да' if param.get('required') else 'нет'} | {cell(json.dumps(constraints, ensure_ascii=False)) if constraints else '—'} |"]
                    lines.append("")
                body = operation.get("requestBody", {})
                for mime, media in body.get("content", {}).items():
                    lines += [f"Тело: `{mime}`, схема `{schema_type(media.get('schema', {}))}`, {'обязательно' if body.get('required') else 'необязательно'}.", ""]
                lines += ["| HTTP | Ответ | Тип/схема |", "| --- | --- | --- |"]
                for status, response in operation.get("responses", {}).items():
                    types = [f"{mime}: {schema_type(media.get('schema', {}))}" for mime, media in response.get("content", {}).items()]
                    lines += [f"| {status} | {cell(response.get('description', ''))} | {cell('; '.join(types)) or 'без тела/см. обработчик'} |"]
                lines.append("")
    lines.insert(2, f"Документированных HTTP-операций: **{operation_count}**.\n")
    schema_lines = ["# Схемы запросов и ответов API", "", "Сгенерировано из OpenAPI. `required` означает наличие поля; `null` в типе отдельно определяет допустимость пустого значения. Отсутствие поля в PUT не равно явному null: сервисы используют exclude_unset и собственные правила обновления.", ""]
    for name, schema in sorted(schemas.items()):
        schema_lines += [f"## {name}", "", schema.get("description", ""), ""]
        if schema.get("properties"):
            schema_lines += ["| Поле | Тип | Required | Ограничения/описание |", "| --- | --- | --- | --- |"]
            for field, definition in schema["properties"].items():
                constraints = {k: v for k, v in definition.items() if k not in {"type", "title", "$ref", "anyOf", "items"}}
                schema_lines += [f"| `{field}` | `{cell(schema_type(definition))}` | {'да' if field in schema.get('required', []) else 'нет'} | {cell(json.dumps(constraints, ensure_ascii=False)) if constraints else '—'} |"]
        else:
            schema_lines += [f"Тип: `{cell(schema_type(schema))}`."]
        schema_lines.append("")
    return {DOCS / "API_REFERENCE.md": "\n".join(lines), DOCS / "API_SCHEMAS.md": "\n".join(schema_lines)}


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--frontend-json", type=Path, required=True)
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    frontend = json.loads(args.frontend_json.read_text())
    generated = {}
    modules = []
    for path in sorted((ROOT / "backend/app").rglob("*.py")):
        methods = python_methods(path)
        if methods:
            modules.append((path.relative_to(ROOT).as_posix(), methods, "backend"))
    for entry in sorted(frontend, key=lambda file: file["path"]):
        modules.append((entry["path"], entry["methods"], "frontend"))
    index = ["# Каталог методов STORM", "", "Справочник охватывает все объявленные функции и методы в `backend/app/**/*.py` и все именованные функции/методы с телом в `frontend/src/**/*.{ts,tsx}`. Включены приватные и вложенные функции, валидаторы, React-компоненты и обработчики store/config-объектов. Исключены тесты, декларации типов без тела, сторонние библиотеки и безымянные callbacks JSX/map/useEffect. Скрипты обслуживания документированы в руководстве разработчика, миграции — в Alembic.", "", "Для каждого метода приведены сигнатура, параметры, тип результата, исходный docstring/проверенное описание, прямые вызовы и, для Python, явные raise и операции с БД. Это статический справочник: прямые вызовы не являются полным графом исполнения; исключения и эффекты вложенных сервисов наследуются. Если docstring отсутствует, каталог показывает проверяемые вызовы вместо выдуманного бизнес-контракта. Для сложных бизнес-процессов читайте [руководство](DEVELOPER_GUIDE.md) и [контракты HTTP](API_REFERENCE.md).", "", "Ссылки ведут на строку актуального исходника. После изменения кода выполните команды генерации из [руководства](DEVELOPER_GUIDE.md); `--check` проверяет отсутствие расхождений без записи.", "", "| Модуль | Методов | Документация |", "| --- | --- | --- |"]
    counts = {"backend": 0, "frontend": 0}
    for source, methods, language in modules:
        output, content = module_document(source, methods, language)
        generated[output] = content
        counts[language] += len(methods)
        index += [f"| `{source}` | {len(methods)} | [Методы]({output.relative_to(DOCS).as_posix()}) |"]
    index += ["", f"Всего: backend **{counts['backend']}**, frontend **{counts['frontend']}**, модулей **{len(modules)}**.", ""]
    generated[DOCS / "METHODS.md"] = "\n".join(index)
    generated.update(api_documents())
    stale = []
    for path, content in generated.items():
        content = "\n".join(line.rstrip() for line in content.splitlines()).rstrip() + "\n"
        if args.check:
            if not path.exists() or path.read_text() != content:
                stale.append(path.relative_to(ROOT).as_posix())
        else:
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(content)
    print(json.dumps({"backend_methods": counts["backend"], "frontend_methods": counts["frontend"], "modules": len(modules), "documents": len(generated), "stale": stale}, ensure_ascii=False))
    return 1 if stale else 0


if __name__ == "__main__":
    raise SystemExit(main())
