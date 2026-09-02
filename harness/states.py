"""Execution + install status enums (MacRE §13.1 semantics)."""
from enum import Enum


class ExecutionStatus(str, Enum):
    """Terminal states a tool row settles into."""
    EXECUTED = "executed"
    EXECUTION_FAILED = "execution_failed"
    TARGET_NOT_APPLICABLE = "target_not_applicable"
    TIMEOUT_DEFERRED_RETRY = "timeout_deferred_retry"
    MANUAL_INSTALL = "manual_install"
    INSTALL_FAILED = "install_failed"
    BRIDGE_UNAVAILABLE = "bridge_unavailable"
    SKIPPED = "skipped"  # non-terminal, e.g. probe decided not to run


class InstallStatus(str, Enum):
    PRESENT = "present"
    MISSING = "missing"
    MANUAL = "manual"
    DEPRECATED = "deprecated"


# A tool row is "closed" (settled) if it is in one of these.
TERMINAL = {
    ExecutionStatus.EXECUTED,
    ExecutionStatus.EXECUTION_FAILED,
    ExecutionStatus.TARGET_NOT_APPLICABLE,
    ExecutionStatus.TIMEOUT_DEFERRED_RETRY,
    ExecutionStatus.MANUAL_INSTALL,
    ExecutionStatus.INSTALL_FAILED,
    ExecutionStatus.BRIDGE_UNAVAILABLE,
}

# "Succeeded" = closed AND either ran ok or genuinely not applicable.
SUCCESS_OR_NA = {ExecutionStatus.EXECUTED, ExecutionStatus.TARGET_NOT_APPLICABLE}


def is_closed(status: ExecutionStatus) -> bool:
    return status in TERMINAL


def succeeded_or_na(status: ExecutionStatus) -> bool:
    return status in SUCCESS_OR_NA
