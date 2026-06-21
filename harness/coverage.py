"""Coverage manifest: per-tool rows + the two coverage booleans (§13.1)."""
from __future__ import annotations
import json
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

from catalog import Tool, ToolCatalog
from runner import RunResult
from states import ExecutionStatus, is_closed, succeeded_or_na
from target_profile import TargetInfo


def _now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


class CoverageManifest:
    def __init__(self, target: TargetInfo, catalog: ToolCatalog):
        self.target = target
        self.catalog = catalog
        self.rows: list[dict] = []
        self.results: dict[str, RunResult] = {}

    def add(self, tool: Tool, result: RunResult):
        self.results[tool.toolID] = result
        row = result.to_row()
        row["tier"] = tool.tier
        row["applicability"] = "applicable" if tool.applies_to(self.target.profile) else "not_applicable"
        row["installStatus"] = tool.install_status
        row["installMethod"] = tool.install_method
        row["toolID"] = tool.toolID
        self.rows.append(row)

    def aggregate(self) -> dict:
        by_exec = Counter(r["executionStatus"] for r in self.rows)
        closed = [r for r in self.rows if is_closed(ExecutionStatus(r["executionStatus"]))]
        succ_na = [r for r in self.rows if succeeded_or_na(ExecutionStatus(r["executionStatus"]))]
        failed = [r["toolID"] for r in self.rows if r["executionStatus"] == ExecutionStatus.EXECUTION_FAILED.value]
        timed = [r["toolID"] for r in self.rows if r["executionStatus"] == ExecutionStatus.TIMEOUT_DEFERRED_RETRY.value]

        return {
            "meta": {
                "generatedAt": _now_iso(),
                "target": {"path": self.target.path, "profile": self.target.profile,
                           "size": self.target.size, "magic_hex": self.target.magic_hex},
            },
            "totals": {
                "toolsInCatalog": len(self.catalog.tools),
                "rowsRecorded": len(self.rows),
                "byExecutionStatus": dict(by_exec),
            },
            "canClaimFullCoverage": len(closed) == len(self.catalog.tools),
            "canClaimAllToolsSucceeded": len(succ_na) == len(self.catalog.tools),
            "executedCount": by_exec.get(ExecutionStatus.EXECUTED.value, 0),
            "notApplicableCount": by_exec.get(ExecutionStatus.TARGET_NOT_APPLICABLE.value, 0),
            "failedCount": by_exec.get(ExecutionStatus.EXECUTION_FAILED.value, 0),
            "timeoutCount": by_exec.get(ExecutionStatus.TIMEOUT_DEFERRED_RETRY.value, 0),
            "manualInstallCount": by_exec.get(ExecutionStatus.MANUAL_INSTALL.value, 0),
            "failedToolIDs": failed,
            "timeoutToolIDs": timed,
            "rows": sorted(self.rows, key=lambda r: (r["tier"], r["toolID"])),
        }

    def write(self, out_path: Path):
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_text(json.dumps(self.aggregate(), indent=2, ensure_ascii=False), encoding="utf-8")
