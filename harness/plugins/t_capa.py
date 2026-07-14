"""capa — FLARE capability finder with MACRE-managed rule path (report §14.3 #2).

catalog rulesPath = tools/downloads/capa/rules. If present (populated via
install_manual.sh capa_rules), run `capa --rules <path> {target}`; else fall
back to capa's bundled rules. Fixes the report §13.3 "capa rules/cache 경로
문제로 exit 12" by pinning the path.
"""
import os
from pathlib import Path
from plugins.base import register

ROOT = Path(__file__).resolve().parents[2]  # K-Education/


@register("t_capa")
def run(tool, target_path, runner, force_skip=False):
    rules = tool.rules_path
    rules_abs = None
    if rules:
        rules_abs = rules if os.path.isabs(rules) else str(ROOT / rules)
    use_rules = rules_abs and os.path.isdir(rules_abs) and any(
        Path(rules_abs).glob("**/*.yml"))
    args = (["--rules", rules_abs, "{target}"] if use_rules else ["{target}"])
    probe = type(tool)(
        toolID=tool.toolID, tier=tool.tier, install_method=tool.install_method,
        install_status=tool.install_status, command="capa", args=args,
        target_profiles=tool.target_profiles, timeout=min(tool.timeout, 300),
        plugin="t_capa", note=f"rules={'managed' if use_rules else 'bundled'}",
        head=tool.head, rules_path=tool.rules_path, raw=tool.raw,
    )
    return runner.run(probe, target_path, force_skip=force_skip)
