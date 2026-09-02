import ghidra.app.script.GhidraScript;
import ghidra.app.decompiler.parallel.ParallelDecompiler;
import ghidra.app.decompiler.parallel.DecompilerCallback;
import ghidra.app.decompiler.parallel.DecompileConfigurer;
import ghidra.app.plugin.core.analysis.SwitchAnalysisDecompileConfigurer;
import ghidra.app.decompiler.DecompileResults;
import ghidra.program.model.listing.Function;
import ghidra.program.model.listing.Listing;
import ghidra.program.model.address.Address;
import ghidra.util.task.TaskMonitor;
import ghidra.util.task.TaskMonitorAdapter;
import java.io.FileWriter;

// Targeted: decompile SearchLicense (@0x1117b3 in FastFind.exe) to plain C.
// Runs as a post-import script so the decompiler is already warm.
public class DecompileSearchLicense extends GhidraScript {
    public void run() throws Exception {
        final String outFile = "/tmp/ghwork/out/SearchLicense_decompiled.c";
        final Address target = currentProgram.getAddressFactory().getDefaultAddressSpace().getAddress("0x1117b3");
        Listing listing = currentProgram.getListing();
        Function f = listing.getFirstFunction(target);
        FileWriter w = new FileWriter(outFile);
        if (f == null) {
            w.write("FUNC_NOT_FOUND_AT_0x1117b3\n");
            w.flush(); w.close();
            return;
        }
        w.write("FUNC=" + f.getName() + "@" + Long.toHexString(f.getEntryPoint().getOffset()) + "\n");

        DecompileConfigurer cfg = new SwitchAnalysisDecompileConfigurer(currentProgram);
        DecompilerCallback<String> cb = new DecompilerCallback<String>(currentProgram, cfg) {
            public String process(DecompileResults r, TaskMonitor m) {
                String c;
                try { c = r.getCCodeMarkup() == null ? "<null-markup>" : r.getCCodeMarkup().toString(); }
                catch (Throwable t) { c = "MARKUP_ERR=" + t; }
                return c;
            }
        };
        cb.setTimeout(120);
        try {
            java.util.List<String> res = ParallelDecompiler.decompileFunctions(cb, java.util.Collections.singletonList(f), new TaskMonitorAdapter());
            w.write("DECOMPILE_RETURNED=" + res.size() + " completed=" + res.get(0) != null + "\n");
            w.write("===== C MARKUP START =====\n" + res.get(0) + "\n===== C MARKUP END =====\n");
        } catch (Throwable t) {
            w.write("DECOMPILE_ERR=" + t + "\n");
            t.printStackTrace();
        }
        w.write("DECOMPILED_SEARCHLICENSE_DONE\n");
        w.flush(); w.close();
    }
}
