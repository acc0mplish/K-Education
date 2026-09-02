import sys
print("PYTHON", sys.executable, sys.version.split()[0])
try:
    import pyghidra
    print("PYGHIDRA_IMPORT_OK", getattr(pyghidra,'__file__',''))
except Exception as e:
    print("PYGHIDRA_FAIL", repr(e))
