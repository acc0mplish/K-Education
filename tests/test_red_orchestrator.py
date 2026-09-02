import json
from education_redteam_path import ensure


def test_orchestrator_writes_red_findings(tmp_path):
    ensure()
    from redteam.run_redteam import run
    out = run("http://127.0.0.1:1", i_own_this=True, evidence_dir=tmp_path)
    data = json.loads(out.read_text(encoding="utf-8"))
    assert data["target"] == "http://127.0.0.1:1"
    assert isinstance(data["findings"], list)
    assert any(f["id"] == "S4" for f in data["findings"])
