"""Tool catalog: load tool_catalog.json, query by target profile / install status."""
from __future__ import annotations
import json
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any


@dataclass(frozen=True)
class Tool:
    toolID: str
    tier: int
    install_method: str
    install_status: str
    command: str
    args: list[str]
    target_profiles: list[str]
    timeout: int
    plugin: str
    note: str = ""
    head: int | None = None
    rules_path: str | None = None
    raw: dict[str, Any] = field(default_factory=dict)

    @property
    def applicable_to_all(self) -> bool:
        return "unknown" in self.target_profiles  # heuristic marker

    def applies_to(self, profile: str) -> bool:
        return profile in self.target_profiles

    @property
    def object_only(self) -> bool:
        """Object-introspection tool: targetProfiles ⊆ {pe, elf, mach_o}.
        Used by the §12.5 content-structure gate to exclude these from
        archive/script sub-profiles (defense vs asar->Mach-O misclassification)."""
        obj = {"pe", "elf", "mach_o"}
        return bool(self.target_profiles) and set(self.target_profiles).issubset(obj)


class ToolCatalog:
    def __init__(self, catalog_path: str | Path):
        self.path = Path(catalog_path)
        self.raw = json.loads(self.path.read_text(encoding="utf-8"))
        self.meta = self.raw.get("_meta", {})
        self.tools: list[Tool] = [self._tool(t) for t in self.raw["tools"]]
        self.deprecated: list[str] = self.raw.get("deprecated", [])
        self._by_id = {t.toolID: t for t in self.tools}

    @staticmethod
    def _tool(d: dict) -> Tool:
        inst = d.get("install", {})
        return Tool(
            toolID=d["toolID"],
            tier=d["tier"],
            install_method=inst.get("method", "unknown"),
            install_status=inst.get("status", "missing"),
            command=d.get("command", ""),
            args=d.get("args", []),
            target_profiles=d.get("targetProfiles", []),
            timeout=d.get("timeout", 300),
            plugin=d.get("plugin", "generic_cli"),
            note=d.get("note", ""),
            head=d.get("head"),
            rules_path=d.get("rulesPath"),
            raw=d,
        )

    def all_tool_ids(self) -> list[str]:
        return [t.toolID for t in self.tools]

    def get(self, tool_id: str) -> Tool | None:
        return self._by_id.get(tool_id)

    def applicable(self, profile: str) -> list[Tool]:
        return [t for t in self.tools if t.applies_to(profile)]

    def not_applicable(self, profile: str) -> list[Tool]:
        return [t for t in self.tools if not t.applies_to(profile)]

    def summary(self) -> dict:
        from collections import Counter
        return {
            "total_tools": len(self.tools),
            "by_tier": dict(Counter(t.tier for t in self.tools)),
            "by_install_status": dict(Counter(t.install_status for t in self.tools)),
            "deprecated": self.deprecated,
        }
