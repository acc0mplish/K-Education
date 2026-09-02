// FastFind.exe source recovery: decompile Rust-section functions DURING import,
// when the native decompiler process is alive (replicates DecompilerSwitchAnalyzer).
// AbstractAnalyzer added() runs in the CODE_ANALYSIS import window -> getC() works.
// ParallelDeciler + SwitchAnalysisDecompileConfigurer == exactly what the switch uses.
//
// Run via analyzeHeadless -import (default analysis; switch active) + -postScript.
// Output: /tmp/ghwork/out/ffcustom.txt  (C per function, keyed by address)
import ghidra.app.services.AbstractAnalyzer;
import ghidra.app.services.AnalyzerType;
import ghidra.app.services.AnalysisPriority;
import ghidra.app.decompiler.parallel.ParallelDecompiler;
import ghidra.app.decompiler.parallel.DecompilerCallback;
import ghidra.app.decompiler.parallel.DecompileConfigurer;
import ghidra.app.decompiler.DecompileResults;
import ghidra.app.decompiler.DecompiledFunction;
import ghidra.app.plugin.core.analysis.SwitchAnalysisDecompileConfigurer;
import ghidra.program.model.listing.Function;
import ghidra.program.model.listing.FunctionIterator;
import ghidra.program.model.listing.Program;
import ghidra.program.model.address.Address;
import ghidra.program.model.address.AddressSetView;
import ghidra.util.task.TaskMonitor;
import ghidra.util.task.TaskMonitorAdapter;
import ghidra.util.exception.CancelledException;
import ghidra.framework.options.Options;
import ghidra.app.util.importer.MessageLog;

import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.concurrent.ConcurrentHashMap;

public class FFCustomAnalyzer extends AbstractAnalyzer {
    public static final Map<Address, String> CAPTURE = new ConcurrentHashMap<>();

    public FFCustomAnalyzer() {
        super("FastFind Parallel Decompile", "FastFind", AnalyzerType.INSTRUCTION_ANALYZER);
        setPriority(AnalysisPriority.CODE_ANALYSIS);
        setDefaultEnablement(true);
    }

    @Override public boolean canAnalyze(Program p) { return true; }

    @Override public boolean getDefaultEnablement(Program p) { return true; }

    @Override
    public boolean added(Program p, AddressSetView secs, TaskMonitor mon, MessageLog log) throws CancelledException {
        // Rust-section 함수 수집 (FUN_ 자동명은 제외; 이름 있는 함수는 전부 Rust 코드)
        FunctionIterator it = p.getListing().getFunctions(true);
        ArrayList<Function> fns = new ArrayList<>();
        while (it.hasNext()) {
            Function f = it.next();
            if (f.getEntryPoint() == null) continue;
            String n = f.getName();
            if (n == null || n.isEmpty() || n.startsWith("FUN_")) continue;
            fns.add(f);
            if (fns.size() >= 200) break;
        }
        System.out.println("ADDED_FUNCS=" + fns.size());
        if (fns.isEmpty()) return true;

        System.out.println("DECOMPILING_DURING_IMPORT...");
        try {
            DecompileConfigurer cfg = new SwitchAnalysisDecompileConfigurer(p);
            DecompilerCallback<String> cb = new DecompilerCallback<String>(p, cfg) {
                @Override public String process(DecompileResults r, TaskMonitor m) {
                    Function f = r.getFunction();
                    DecompiledFunction df = r.getDecompiledFunction();
                    String c = (df != null && df.getC() != null) ? df.getC() : "";
                    if (f != null && !c.trim().isEmpty()) CAPTURE.put(f.getEntryPoint(), c);
                    return c;
                }
            };
            cb.setTimeout(30);
            List<String> results = ParallelDecompiler.decompileFunctions(cb, fns, mon);
            cb.dispose();
            System.out.println("DECOMPILED_DURING_IMPORT=" + CAPTURE.size() + " of " + fns.size());
            java.io.BufferedWriter w = new java.io.BufferedWriter(
                new java.io.FileWriter("/tmp/ghwork/out/ffcustom.txt"));
            w.write("# FastFind.exe — decompiled DURING import (native process alive)\n");
            w.write("# ParallelDecompiler + SwitchAnalysisDecompileConfigurer (switch와 동일 경로)\n");
            w.write("decompiled=" + CAPTURE.size() + "\n");
            for (Map.Entry<Address, String> e : CAPTURE.entrySet()) {
                w.write("\n// === 0x" + Long.toHexString(e.getKey().getOffset()) + " ===\n");
                w.write(e.getValue());
                w.write("\n// ----------------------------\n");
            }
            w.close();
        } catch (Throwable t) {
            System.out.println("DECOMPILE_ERR=" + t);
            t.printStackTrace();
        }
        return true;
    }

    @Override public void optionsChanged(Options o, Program p) { }
    @Override public void analysisEnded(Program p) { }
}
