"""Tool runner: timeout, capture, stdout SHA256, exit-code → status mapping."""
from __future__ import annotations
import hashlib
import os
import shutil
import subprocess
from dataclasses import dataclass, field
from pathlib import Path

from catalog import Tool
from states import ExecutionStatus, InstallStatus


@dataclass
class RunResult:
    tool_id: str
    status: ExecutionStatus
    exit_code: int | None
    stdout_sha256: str
    stdout_len: int
    stderr_len: int
    duration_s: float
    message: str = ""
    timed_out: bool = False
    extra: dict = field(default_factory=dict)

    def to_row(self) -> dict:
        return {
            "toolID": self.tool_id,
            "executionStatus": self.status.value,
            "exitCode": self.exit_code,
            "stdoutSHA256": self.stdout_sha256,
            "stdoutLen": self.stdout_len,
            "stderrLen": self.stderr_len,
            "durationS": round(self.duration_s, 2),
            "timedOut": self.timed_out,
            "message": self.message,
            **self.extra,
        }


class ToolRunner:
    def __init__(self, project_root: Path, evidence_dir: Path, runner_env: dict | None = None):
        self.root = Path(project_root)
        self.evidence = Path(evidence_dir)
        self.evidence.mkdir(parents=True, exist_ok=True)
        self.env = runner_env or {}

    def installed(self, tool: Tool) -> bool:
        """Check if a tool's command is resolvable (PATH + known fallbacks)."""
        if tool.install_status in (InstallStatus.PRESENT.value,):
            return True
        if tool.install_status in (InstallStatus.MANUAL.value, InstallStatus.DEPRECATED.value):
            return False
        # missing: probe PATH, then distro fallback dirs (e.g. Ubuntu wine9 -> /usr/lib/wine)
        if shutil.which(tool.command) is not None:
            return True
        for d in ("/usr/lib/wine",):
            cand = os.path.join(d, tool.command)
            if os.path.exists(cand):
                return True
        return False

    def build_argv(self, tool: Tool, target: str, outdir: str) -> list[str]:
        cmd = shutil.which(tool.command) or tool.command
        if cmd == tool.command and not shutil.which(cmd):
            # try distro fallback dirs so subprocess can exec off-PATH binaries
            for d in ("/usr/lib/wine",):
                cand = os.path.join(d, tool.command)
                if os.path.exists(cand):
                    cmd = cand
                    break
        argv = [cmd]
        for a in tool.args:
            argv.append(
                a.replace("{target}", target)
                 .replace("{outdir}", outdir)
            )
        return argv

    def run(self, tool: Tool, target: str, *, force_skip: bool = False) -> RunResult:
        import time
        outdir = str(self.evidence)
        tool_out = self.evidence / f"{tool.toolID}.out"
        tool_err = self.evidence / f"{tool.toolID}.err"

        # install gate
        if not self.installed(tool):
            return RunResult(
                tool.toolID,
                ExecutionStatus.MANUAL_INSTALL if tool.install_status == InstallStatus.MANUAL.value
                else ExecutionStatus.INSTALL_FAILED,
                None, "", 0, 0, 0.0,
                message=f"not installed (method={tool.install_method}, status={tool.install_status})",
            )

        if force_skip:
            return RunResult(tool.toolID, ExecutionStatus.SKIPPED, None, "", 0, 0, 0.0,
                             message="skipped by strategy")

        argv = self.build_argv(tool, target, outdir)
        t0 = time.time()
        try:
            proc = subprocess.run(
                argv,
                capture_output=True,
                timeout=tool.timeout,
                cwd=str(self.root),
                env={**os.environ, **self.env},
            )
            dur = time.time() - t0
            stdout = proc.stdout or b""
            stderr = proc.stderr or b""
            tool_out.write_bytes(stdout)
            tool_err.write_bytes(stderr)

            digest = hashlib.sha256(stdout).hexdigest()
            status = ExecutionStatus.EXECUTED if proc.returncode == 0 else ExecutionStatus.EXECUTION_FAILED
            return RunResult(
                tool.toolID, status, proc.returncode,
                digest, len(stdout), len(stderr), dur,
                message=f"argv={' '.join(argv[:3])}...",
            )
        except subprocess.TimeoutExpired as e:
            dur = time.time() - t0
            out = e.stdout or b""
            err = e.stderr or b""
            tool_out.write_bytes(out if isinstance(out, bytes) else out.encode("utf-8", "replace"))
            tool_err.write_bytes(err if isinstance(err, bytes) else err.encode("utf-8", "replace"))
            return RunResult(
                tool.toolID, ExecutionStatus.TIMEOUT_DEFERRED_RETRY, 124,
                hashlib.sha256(out if isinstance(out, bytes) else b"").hexdigest(),
                len(out) if isinstance(out, bytes) else 0,
                len(err) if isinstance(err, bytes) else 0, dur,
                timed_out=True, message=f"timeout after {tool.timeout}s",
            )
        except FileNotFoundError:
            return RunResult(
                tool.toolID, ExecutionStatus.BRIDGE_UNAVAILABLE, None, "", 0, 0, 0.0,
                message=f"command not found: {tool.command}",
            )
