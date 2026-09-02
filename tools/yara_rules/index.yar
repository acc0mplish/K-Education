/*
  K-Education YARA rules — educational indicators (report §4.2 / §4.7).
  These DETECT indicator strings, not verdicts. A match is a flag for review,
  not proof of malware (Electron/V8 may legitimately contain some tokens).
*/

rule crypto_miner_stratum
{
  meta:
    description = "stratum pool / mining protocol indicators"
    severity = "high"
    reference = "report 4.7"
  strings:
    $a = "stratum+tcp" nocase
    $b = "stratum+ssl" nocase
    $c = /xmrig[0-9a-z._-]*/ nocase
    $d = "cryptonight" nocase
    $e = /monero[_-]?(wallet|address|pool)/ nocase
    $f = "pool.minexmr" nocase
  condition:
    any of ($a,$b,$c,$d,$e,$f)
}

rule keylogger_indicators
{
  meta:
    description = "common keylogger API / exfil markers"
    severity = "high"
  strings:
    $a = "GetAsyncKeyState"
    $b = "SetWindowsHookEx"
    $c = "clipboard" nocase
  condition:
    uint16(0) == 0x5A4D and 2 of ($a,$b,$c)
}

rule persistence_autorun
{
  meta:
    description = "registry run-key / scheduled-task persistence"
    severity = "medium"
  strings:
    $a = "Software\\Microsoft\\Windows\\CurrentVersion\\Run"
    $b = "schtasks /create" nocase
    $c = /ExecutionPolicy\s+Bypass/
  condition:
    any of them
}

rule powershell_hidden_exec
{
  meta:
    description = "hidden PowerShell execution via wscript/VBS helper (report 6)"
    severity = "medium"
    reference = "report 6 auto-update helper"
  strings:
    $a = "wscript.shell" nocase
    $b = ".vbs" nocase
    $c = "ExecutionPolicy Bypass" nocase
    $d = "NoProfile" nocase
  condition:
    3 of ($a,$b,$c,$d)
}

rule daf_remote_mgmt
{
  meta:
    description = "DAF remote-management endpoints / env-var context (report 5, 12.6)"
    severity = "low"
    reference = "report 5, 12.6 - expected in DAF launcher, not malicious"
  strings:
    $a = "DAF_API_TOKEN"
    $b = "DAF_REMOTE_COMMAND_ID"
    $c = "/api/remote/devices/heartbeat"
    $d = "/api/remote/commands/update"
    $e = "safeStorage:v1"
  condition:
    2 of them
}

rule network_exfil_generic
{
  meta:
    description = "generic exfil/upload endpoints"
    severity = "low"
  strings:
    $a = "/upload" nocase
    $b = "multipart/form-data"
  condition:
    any of them
}
