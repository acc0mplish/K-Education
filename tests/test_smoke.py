def test_harness_imports():
    from catalog import ToolCatalog  # noqa: F401
    from plugins.base import get_plugin, register  # noqa: F401
    from runner import RunResult  # noqa: F401
