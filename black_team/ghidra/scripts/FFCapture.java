// Diagnose: run DURING import analysis window (auto-registered CODE_ANALYZER),
// parallel to the switch decompiler, so the native decompile process is alive.
// Prints per-function decompile status so we learn why getC was empty.
// Run via analyzeHeadless -import (NO postScript) -> auto-discovered by ClassSearcher.
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

public class FFCapture extends AbstractAnalyzer {
    public static final Map<Address, String> CAPTURE = new ConcurrentHashMap<>();
    public static final Map<Address, String> DIAG = new ConcurrentHashMap<>();

    public FFCapture() {
        super("FastFind Parallel Decompile", "FastFind", AnalyzerType.INSTRUCTION_ANALYZER);
        setPriority(AnalysisPriority.CODE_ANALYSIS);
        setDefaultEnablement(true);
    }

    @Override public boolean canAnalyze(Program p) { return true; }
    @Override public boolean getDefaultEnablement(Program p) { return true; }

    @Override
    public boolean added(Program p, AddressSetView secs, TaskMonitor mon, MessageLog log) throws CancelledException {
        FunctionIterator it = p.getListing().getFunctions(true);
        ArrayList<Function> fns = new ArrayList<>();
        while (it.hasNext()) {
            Function f = it.next();
            if (f.getEntryPoint() == null) continue;
            String n = f.getName();
            if (n == null || n.isEmpty() || n.startsWith("FUN_")) continue;
            fns.add(f);
            if (fns.size() >= 150) break;
        }
        System.out.println("CAP_ADDED_FUNCS=" + fns.size());
        if (fns.isEmpty()) return true;

        System.out.println("CAP_DECOMPILING_DURING_IMPORT...");
        try {
            DecompileConfigurer cfg = new SwitchAnalysisDecompileConfigurer(p);
            DecompilerCallback<String> cb = new DecompilerCallback<String>(p, cfg) {
                int first = 1;
                @Override public String process(DecompileResults r, TaskMonitor m) {
                    Function f = r.getFunction();
                    DecompiledFunction df = r.getDecompiledFunction();
                    String c = (df != null && df.getC() != null) ? df.getC() : "";
                    if (f != null) {
                        String a = "0x" + Long.toHexString(f.getEntryPoint().getOffset());
                        DIAG.put(f.getEntryPoint(), "completed=" + r.decompileCompleted()
                            + " valid=" + r.isValid()
                            + " err=" + r.getErrorMessage()
                            + " dfNull=" + (df == null)
                            + " cNull=" + (r.getDecompiledFunction() == null || r.getDecompiledFunction().getC() == null)
                            + " cLen=" + (c == null ? -1 : c.length()));
                        if (first-- == 0) { System.out.println("CAP_DIAG=" + DIAG.get(a)); }
                    }
                    if (f != null && !c.trim().isEmpty()) CAPTURE.put(f.getEntryPoint(), c);
                    return c;
                }
            };
            cb.setTimeout(30);
            List<String> results = ParallelDecompiler.decompileFunctions(cb, fns, mon);
            cb.dispose();
            System.out.println("CAP_DECOMPILED=" + CAPTURE.size() + " of " + fns.size());
            java.io.BufferedWriter w = new java.io.BufferedWriter(
                new java.io.FileWriter("/tmp/ghwork/out/ffcapture.txt"));
            w.write("# FastFind.exe — decompiled DURING import (auto-analyzer, parallel to switch)\n");
            w.write("decompiled=" + CAPTURE.size() + " of " + fns.size() + "\n");
            for (Map.Entry<Address, String> e : CAPTURE.entrySet()) {
                w.write("\n// === 0x" + Long.toHexString(e.getKey().getOffset()) + " ===\n");
                w.write(e.getValue());
                w.write("\n// ----------------------------\n");
            }
            w.close();
        } catch (Throwable t) {
            System.out.println("CAP_ERR=" + t);
            t.printStackTrace();
        }
        return true;
    }

    @Override public void optionsChanged(Options o, Program p) { }
    @Override public void analysisEnded(Program p) { }
}
