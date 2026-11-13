"""Process boundaries: hostile targets/JS are data, never shell commands.

No scanners or external systems run. Process mocks inspect argv/stdin; the one
real child is a local Python process that echoes arguments without evaluating
them. A temporary marker detects accidental shell interpretation.
"""
import ast
import json
import sys
from pathlib import Path
from unittest.mock import AsyncMock

import pytest

from app.farm import core, fingerprint, jsmine


HOST_PAYLOADS = [
    "example.test;id", "example.test&&id", "example.test|id", "example.test`id`",
    "example.test$(id)", "example.test%0aid", "example.test%00id", "--help",
    "-config=evil", "example.test>output", 'example.test";id;"', "example.test\\id",
]


@pytest.mark.parametrize("target", ["http://[", "http://[::1", "http://[not-ip]/", "[example.test]", "http://[::1]]:bad"])
def test_malformed_url_is_rejected_without_raising(target):
    assert core.parse_token(target) is None


@pytest.mark.parametrize("hostname", HOST_PAYLOADS)
def test_farm_parser_rejects_command_syntax_in_hostname(hostname):
    assert core.parse_token(hostname) is None


def test_application_process_calls_do_not_use_a_shell():
    root = Path(__file__).resolve().parents[1] / "app"
    unsafe = []
    process_calls = []
    for path in root.rglob("*.py"):
        for node in ast.walk(ast.parse(path.read_text())):
            if not isinstance(node, ast.Call) or not isinstance(node.func, ast.Attribute):
                continue
            if node.func.attr in {"create_subprocess_shell", "system", "popen", "getoutput", "getstatusoutput"}:
                unsafe.append(f"{path.relative_to(root)}:{node.lineno}")
            if node.func.attr in {"create_subprocess_exec", "Popen", "run", "call", "check_call", "check_output"}:
                # Only subprocess APIs count, not unrelated methods named run.
                if not isinstance(node.func.value, ast.Name) or node.func.value.id not in {"asyncio", "subprocess"}:
                    continue
                if node.func.value.id == "asyncio" and node.func.attr != "create_subprocess_exec":
                    continue
                process_calls.append(node)
                if node.func.attr != "create_subprocess_exec" or any(k.arg == "shell" for k in node.keywords):
                    unsafe.append(f"{path.relative_to(root)}:{node.lineno}")
    assert process_calls, "Audit must discover the actual scanner process launches"
    assert not unsafe, f"Review shell-capable process calls: {unsafe}"


@pytest.mark.asyncio
async def test_httpx_targets_are_stdin_and_cannot_add_command_arguments(monkeypatch):
    urls = [f"https://{host}/" for host in HOST_PAYLOADS]
    proc = AsyncMock()
    proc.communicate.return_value = (b"", b"")
    spawn = AsyncMock(return_value=proc)
    monkeypatch.setattr(fingerprint.asyncio, "create_subprocess_exec", spawn)
    await fingerprint._run_httpx(urls)
    args, kwargs = spawn.call_args
    assert args[0] == fingerprint.settings.services_httpx_bin
    assert not any(url in args for url in urls)
    assert "shell" not in kwargs
    proc.communicate.assert_awaited_once_with(input="\n".join(urls).encode())
    assert args[1:] == (
        "-json", "-silent", "-no-color", "-td", "-cdn", "-disable-update-check",
        "-timeout", str(int(fingerprint.settings.services_detect_timeout_seconds)), "-retries", "0",
    )


@pytest.mark.asyncio
async def test_mining_passes_generated_file_and_never_js_content_as_arguments(monkeypatch, tmp_path):
    marker = tmp_path / "not-executed"
    text = f'const host = "example.test; touch {marker}"; const x = "$(touch {marker})";'
    commands = []
    temp_paths = []

    async def spawn(*argv, **kwargs):
        commands.append(argv)
        assert "shell" not in kwargs
        assert not any(text in arg or str(marker) in arg for arg in argv)
        path = Path(argv[2])
        assert path.is_absolute() and path.name.startswith("stormjs-") and path.suffix == ".js"
        assert path.read_text() == text
        temp_paths.append(path)
        process = AsyncMock()
        process.communicate.return_value = (b"", b"")
        return process

    # A configured path containing shell metacharacters still has to remain one
    # argv value. It is an administrator setting, not an uploaded configuration.
    config_path = tmp_path / "detectors;not-a-command.yaml"
    config_path.write_text("detectors: []\n")
    monkeypatch.setattr(jsmine.shutil, "which", lambda name: name)
    monkeypatch.setattr(jsmine.asyncio, "create_subprocess_exec", spawn)
    cfg = jsmine.JsMineConfig(enabled=True, trufflehog_config=str(config_path))
    await jsmine.mine_js(text, cfg)
    assert [command[:2] for command in commands] == [
        (cfg.jsluice_bin, "secrets"), (cfg.jsluice_bin, "urls"), (cfg.trufflehog_bin, "filesystem"),
    ]
    assert commands[-1][3:] == ("--json", "--no-update", "--config=" + str(config_path))
    assert not marker.exists()
    assert all(not path.exists() for path in temp_paths), "Temporary JS files must be removed"


@pytest.mark.asyncio
@pytest.mark.parametrize("template", [
    "example.test; touch {marker}", "example.test && touch {marker}",
    "$(touch {marker})", "`touch {marker}`", "example.test\ntouch {marker}",
    "--config=evil;touch {marker}",
])
async def test_exec_boundary_keeps_shell_payloads_literal(tmp_path, template):
    marker = tmp_path / "not-executed"
    payload = template.format(marker=marker)
    output = await jsmine._run(
        sys.executable, ["-c", "import json,sys; print(json.dumps(sys.argv[1:]))", payload], 5,
    )
    assert json.loads(output) == [payload]
    assert not marker.exists()
