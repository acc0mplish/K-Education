import sys
out = open('/tmp/ghwork/debug_out.txt', 'w')
out.write('EXECUTABLE=%s\n' % sys.executable)
out.write('VERSION=%s.%s.%s\n' % sys.version_info[:3])
out.write('PATH=%s\n' % (list(dict.fromkeys(p for p in sys.path if p)).join(';')))
try:
    import pyghidra
    out.write('PYGHIDRA_IMPORT=OK\n')
except Exception as e:
    out.write('PYGHIDRA_IMPORT=FAIL:%s\n' % e)
out.close()
print('DEBUG_SCRIPT_RAN')
