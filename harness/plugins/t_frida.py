"""frida — live process attach only. For static file targets this is
target_not_applicable (report §14.2). The `dynamic` command path uses it."""
from plugins.base import register, register_applicability_na


@register("t_frida")
def run(tool, target_path, runner, force_skip=False):
    # static target: frida has nothing to attach to
    return register_applicability_na(tool)
