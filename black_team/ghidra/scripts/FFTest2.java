import ghidra.app.script.GhidraScript;
import ghidra.app.decompiler.parallel.ParallelDecompiler;
import ghidra.app.decompiler.parallel.DecompilerCallback;
import ghidra.app.decompiler.parallel.DecompileConfigurer;
import ghidra.app.plugin.core.analysis.SwitchAnalysisDecompileConfigurer;
import ghidra.app.decompiler.DecompileResults;
import ghidra.program.model.listing.Function;
import ghidra.program.model.listing.FunctionIterator;
import ghidra.util.task.TaskMonitor;
import ghidra.util.task.TaskMonitorAdapter;
import java.io.FileWriter;
import java.util.ArrayList;
import java.util.List;

// Definitive: extract C from DecompileResults.getCCodeMarkup().toString()
// import-window-independent (works post-import)
public class FFTest2 extends GhidraScript {
    FileWriter w;
    public void run() throws Exception {
        w = new FileWriter("/tmp/ghwork/out/fftest2_result.txt");
        TaskMonitorAdapter mon = new TaskMonitorAdapter();
        ArrayList<Function> fns = new ArrayList<>();
        FunctionIterator it = currentProgram.getListing().getFunctions(true);
        while (it.hasNext() && fns.size() < 3) {
            Function f = it.next();
            if (f.getName() != null && !f.getName().startsWith("FUN_")) fns.add(f);
        }
        w.write("SAMPLE_FUNCS=" + fns.size() + "\n");
        for (Function f : fns) w.write("FUNC=" + f.getName() + "@" + Long.toHexString(f.getEntryPoint().getOffset()) + "\n");

        DecompileConfigurer cfg = new SwitchAnalysisDecompileConfigurer(currentProgram);
        DecompilerCallback<String> cb = new DecompilerCallback<String>(currentProgram, cfg) {
            int first = 1;
            void emit(String s) { try { FFTest2.this.w.write(s); } catch (Exception e) { } }
            public String process(DecompileResults r, TaskMonitor m) {
                Function f = r.getFunction();
                if (f == null) return null;
                String a = "0x" + Long.toHexString(f.getEntryPoint().getOffset());
                String markup;
                try { markup = r.getCCodeMarkup() == null ? "<null-markup>" : r.getCCodeMarkup().toString(); }
                catch (Throwable t) { markup = "MARKUP_ERR=" + t; }
                emit(a + ": completed=" + r.decompileCompleted() + " valid=" + r.isValid() + " err=" + r.getErrorMessage() + " markupLen=" + markup.length() + "\n");
                emit("---- C START " + a + " ----\n" + markup + "\n---- C END " + a + " ----\n");
                if (first-- == 0) emit("FIRST_MARKUP_LEN=" + markup.length() + "\n");
                if (markup.length() > 0 && !markup.startsWith("<null") && !markup.startsWith("MARKUP_ERR")) {
                    emit("CAPTURED_C_FOR=" + f.getName() + " len=" + markup.length() + "\n");
                }
                return markup;
            }
        };
        cb.setTimeout(60);
        try {
            List<String> res = ParallelDecompiler.decompileFunctions(cb, fns, mon);
            w.write("DECOMPILE_RETURNED=" + res.size() + "\n");
            w.write("PARALLEL_POSTIMPORT_OK\n");
        } catch (Throwable t) {
            w.write("DECOMPILE_ERR=" + t + "\n");
            t.printStackTrace();
        }
        w.write("FFTEST2_DONE\n");
        w.flush(); w.close();
    }
}
