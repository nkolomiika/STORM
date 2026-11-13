"""Summarize measured coverage; exclude only the listed external adapters.

The complete backend JSON and frontend Istanbul summary are inputs. Unimported
files must already be included by coverage.py/Vitest, otherwise the result is
not a whole-project measurement. This script does not decide release readiness.
"""
import argparse
import ast
import json
from pathlib import Path


BACKEND_ROOT = Path(__file__).resolve().parents[1]
EXTERNAL_MODULES = {
    "app/cloudflare.py", "app/mail.py", "app/messaging.py", "app/oidc.py",
    "app/works.py", "app/storage/minio_client.py", "app/worker/mail_worker.py",
    "app/routers/jira.py", "app/routers/works.py",
}
EXTERNAL_SERVICE_CLASSES = {"JiraCredentials", "_SafeJiraTransport", "JiraIntegrationService", "WorksService"}
EXTERNAL_AUTH_METHODS = {"login_via_sso", "_provision_sso_user", "_unique_username"}


def excluded_service_lines() -> set[int]:
    """Exclude external integration classes and SSO-only provisioning methods."""
    tree = ast.parse((BACKEND_ROOT / "app/services.py").read_text())
    excluded: set[int] = set()
    for node in tree.body:
        if not isinstance(node, ast.ClassDef):
            continue
        nodes = [node] if node.name in EXTERNAL_SERVICE_CLASSES else []
        if node.name == "AuthService":
            nodes.extend(method for method in node.body if isinstance(method, (ast.FunctionDef, ast.AsyncFunctionDef))
                         and method.name in EXTERNAL_AUTH_METHODS)
        for item in nodes:
            first = min([item.lineno, *(d.lineno for d in item.decorator_list)])
            excluded.update(range(first, item.end_lineno + 1))
    return excluded


def metrics(covered_lines: int, total_lines: int, covered_branches: int, total_branches: int) -> dict:
    """Keep numerators and denominators so the summary can be verified."""
    return {
        "lines": {"covered": covered_lines, "total": total_lines,
                  "pct": round(100 * covered_lines / total_lines, 2) if total_lines else 100},
        "branches": {"covered": covered_branches, "total": total_branches,
                     "pct": round(100 * covered_branches / total_branches, 2) if total_branches else 100},
    }


def summarize_backend(data: dict) -> dict:
    """Report all app code and an explicitly scoped internal subset separately."""
    excluded = excluded_service_lines()
    files = {}
    untouched = []
    for name, file in sorted(data["files"].items()):
        if name in EXTERNAL_MODULES:
            continue
        omit = excluded if name == "app/services.py" else set()
        covered = set(file["executed_lines"]) - omit
        missing = set(file["missing_lines"]) - omit
        branches = [b for b in file["executed_branches"] if b[0] not in omit]
        missed_branches = [b for b in file["missing_branches"] if b[0] not in omit]
        files[name] = metrics(len(covered), len(covered) + len(missing), len(branches), len(branches) + len(missed_branches))
        for function, item in sorted(file.get("functions", {}).items()):
            if function and item["missing_lines"] and not item["executed_lines"] and set(item["missing_lines"]) - omit:
                untouched.append({"file": name, "function": function, "line": min(item["missing_lines"])})
    totals = data["totals"]
    return {
        "all": metrics(totals["covered_lines"], totals["num_statements"], totals["covered_branches"], totals["num_branches"]),
        "internal": metrics(*(sum(f[k][v] for f in files.values()) for k, v in
                              [("lines", "covered"), ("lines", "total"), ("branches", "covered"), ("branches", "total")])),
        "excluded_modules": sorted(EXTERNAL_MODULES),
        "excluded_service_classes": sorted(EXTERNAL_SERVICE_CLASSES),
        "excluded_auth_methods": sorted(EXTERNAL_AUTH_METHODS),
        "internal_files": files,
        "internal_functions_without_execution": untouched,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--backend", type=Path, required=True)
    parser.add_argument("--frontend", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    frontend = json.loads(args.frontend.read_text())
    files = {}
    for path, summary in frontend.items():
        if path != "total":
            # Never persist developer-specific absolute paths in the report.
            name = "src/" + path.replace("\\", "/").split("/src/", 1)[1]
            files[name] = summary
    result = {"backend": summarize_backend(json.loads(args.backend.read_text())),
              "frontend": {"all": frontend["total"], "files": files}}
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(result, indent=2, ensure_ascii=False) + "\n")
    print(json.dumps({"backend_internal": result["backend"]["internal"], "frontend": frontend["total"]}))


if __name__ == "__main__":
    main()
