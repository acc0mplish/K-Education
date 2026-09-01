// Ghidra Java postScript: decompile all fastfind (Rust) functions with source-line info.
// Run via analyzeHeadless (-postScript). Works WITHOUT PyGhidra (plain Java, Java 26).
// Target: Ghidra 12.x API
//   - decompile: DecompInterface + DecompileResults + DecompiledFunction.getC() (no DecompilerComponentAdapterFactory)
//   - source line: Program.getSourceFileManager().getSourceMapEntries(addr) (no Function.getSourceLine/SourceLine)
//
//   GHIDRA_INSTALL_DIR=/tmp/ghidra_12.1.3_PUBLIC \
//   /tmp/ghidra_12.1.3_PUBLIC/support/analyzeHeadless \
//     /tmp/ghwork/proj3 FastFind3 -import <FastFind.exe> \
//     -scriptPath /tmp/ghwork/script -postScript FastFindDecompile.java
//
// Outputs: /tmp/ghwork/out/fastfind_recovered.txt (decompiled + source location)
//          /tmp/ghwork/out/symbols.txt (index: demangled_name\taddr\tfile\tline)
import ghidra.app.script.GhidraScript;
import ghidra.app.decompiler.DecompInterface;
import ghidra.app.decompiler.DecompileResults;
import ghidra.app.decompiler.DecompiledFunction;
import ghidra.program.model.listing.Function;
import ghidra.program.model.listing.FunctionIterator;
import ghidra.util.task.TaskMonitorAdapter;
import ghidra.util.task.TaskMonitor;
import ghidra.program.model.address.Address;
import ghidra.program.model.listing.Program;
import ghidra.program.model.sourcemap.SourceMapEntry;
import ghidra.program.database.sourcemap.SourceFile;

import java.io.File;
import java.io.BufferedWriter;
import java.io.FileWriter;
import java.util.ArrayList;
import java.util.List;

public class FastFindDecompile extends GhidraScript {
    private static final String OUT = "/tmp/ghwork/out/fastfind_recovered.txt";
    private static final String SYM = "/tmp/ghwork/out/symbols.txt";
    private static final int TIMEOUT = 45;

    // demangle: Rust Itanium via Ghidra's CppDemangle (handles Rust mangled names)
    private static String demangle(String nm) {
        if (nm == null || nm.isEmpty() || nm.charAt(0) != '_') return nm;
        try {
            Class<?> cls = Class.forName("ghidra.util.CppDemangle");
            java.lang.reflect.Method m = cls.getMethod("demangle", java.lang.Class.forName("java.lang.String"));
            Object r = m.invoke(null, (Object) nm);
            return r == null ? nm : r.toString().trim();
        } catch (Throwable t) {
            return nm;
        }
    }

    // find the source file + line for a function entry address via the Ghidra source-map API
    private static String sourceLoc(Program p, Address entry, StringBuilder loc) {
        List<SourceMapEntry> entries = p.getSourceFileManager().getSourceMapEntries(entry);
        if (entries == null) return "?";
        long off = entry.getOffset();
        for (SourceMapEntry e : entries) {
            Address base = e.getBaseAddress();
            if (base == null) continue;
            long len = e.getLength();
            if (len <= 0) len = 1;
            if (base.getOffset() <= off && off < base.getOffset() + len) {
                SourceFile sf = e.getSourceFile();
                String file = (sf == null || sf.getFilename() == null) ? "?" : sf.getFilename();
                int line = e.getLineNumber();
                loc.append(file).append(':').append(line < 0 ? "0" : line);
                return file;
            }
        }
        return "?";
    }

    @Override
    public void run() throws Exception {
        File f = new File(OUT);
        f.getParentFile().mkdirs();
        BufferedWriter out = new BufferedWriter(new FileWriter(f));
        BufferedWriter sym = new BufferedWriter(new FileWriter(SYM));
        sym.write("# demangled_name\taddr\tfile\tline\n");
        out.write("# FastFind.exe recovered source (Rust crate)\n");
        out.write("# decompiled via Ghidra 12.x Java postScript (analyzeHeadless, Java 26)\n");
        out.write("=".repeat(72) + "\n\n");

        // 1) collect every function compiled from Rust source (present in a source map)
        FunctionIterator it = currentProgram.getListing().getFunctions(true);
        List<Function> all = new ArrayList<>();
        while (it.hasNext()) all.add(it.next());
        all.sort((a, b) -> Long.compare(a.getEntryPoint().getOffset(), b.getEntryPoint().getOffset()));

        // 2) warm up the decompiler: confirm the native decompile process works and the
        //    background DecompilerSwitchAnalyzer has released its lock. Retries handle the
        //    transient lock; gives up after ~60s so we don't stall on a dead binary.
        DecompInterface di = new DecompInterface();
        di.setSimplificationStyle("normal");
        di.openProgram(currentProgram);
        TaskMonitor mon = new TaskMonitorAdapter();

        Function warmup = all.isEmpty() ? null : all.get(0);
        boolean decOK = false;
        if (warmup != null) {
            for (int w = 0; w < 24; w++) {
                DecompileResults wr = null;
                try {
                    wr = di.decompileFunction(warmup, TIMEOUT, mon);
                } catch (Exception e) { wr = null; }
                if (wr != null && wr.isValid()) { decOK = true; break; }
                if (wr != null) System.err.println("WARMUP_INVALID err=" + wr.getErrorMessage());
                Thread.sleep(2500);
            }
        }
        System.out.println("WARMUP_OK=" + decOK);
        if (!decOK) {
            di.closeProgram();
            System.out.println("RECOVERY_DONE total=" + 0 + " total_with_src=0 decompiled=0");
            out.close(); sym.close();
            return;
        }

        int total = 0, withsrc = 0, decompiled = 0;
        for (Function fn : all) {
            Address entry = fn.getEntryPoint();
            String entryName = fn.getName();
            String dn = demangle(entryName);
            StringBuilder loc = new StringBuilder();
            String file = sourceLoc(currentProgram, entry, loc);
            int line = -1;
            // re-derive the line for the index/output header (sourceLoc only reports file)
            for (SourceMapEntry e : currentProgram.getSourceFileManager().getSourceMapEntries(entry)) {
                Address base = e.getBaseAddress();
                if (base == null) continue;
                long len = e.getLength(); if (len <= 0) len = 1;
                if (base.getOffset() <= entry.getOffset() && entry.getOffset() < base.getOffset() + len) {
                    line = e.getLineNumber(); break;
                }
            }
            if (line < 0) line = -1;

            total++;
            if (!file.equals("?") || line >= 0) withsrc++;
            else { // no source info but still decompile (unmapped native/rt code)
                file = "?"; line = -1;
            }

            String addr = String.format("0x%x", entry.getOffset());
            String where = file + ":" + line;

            // 4) decompile (45s timeout) -> DecompileResults (Ghidra 12.x), with retry on lock
            DecompileResults r;
            int tries = 3;
            for (r = null; tries > 0; tries--) {
                try {
                    r = di.decompileFunction(fn, TIMEOUT, mon);
                } catch (Exception e) {
                    r = null;
                    Thread.sleep(1500);
                    continue;
                }
                if (r != null && r.isValid()) break;
                Thread.sleep(1500);
            }
            if (r == null || !r.isValid()) {
                String em = (r == null) ? "null-result" : r.getErrorMessage();
                System.err.println("DECOMPILE_INVALID " + dn + " @0x" + Long.toHexString(entry.getOffset()) + " err=" + em);
                sym.write(dn + "\t" + addr + "\t" + where + "\n");
                continue;
            }
            // 4) C text: DecompiledFunction.getC() (Ghidra 12.x; getCCodeMarkup().toString() is tree markup, not C)
            DecompiledFunction df;
            try {
                df = r.getDecompiledFunction();
            } catch (Exception e) {
                sym.write(dn + "\t" + addr + "\t" + where + "\n");
                continue;
            }
            String txt = df == null ? "" : df.getC();
            if (txt == null || txt.trim().isEmpty()) {
                sym.write(dn + "\t" + addr + "\t" + where + "\n");
                continue;
            }

            decompiled++;
            sym.write(dn + "\t" + addr + "\t" + where + "\n");
            out.write("\n// === " + dn + "  [" + addr + ":" + where + "] ===\n");
            out.write("// orig_symbol=" + entryName + "\n");
            out.write("// --- decompiled C (high-level) ---\n");
            out.write(txt + "\n// ----------------------------------------------------------------\n");
        }

        di.closeProgram();
        out.close();
        sym.close();

        System.out.println("RECOVERY_DONE total=" + total + " total_with_src=" + withsrc + " decompiled=" + decompiled);
        System.out.println("OUTPUT=" + OUT);
        System.out.println("SYMBOLS=" + SYM);
    }
}
