import ghidra.app.script.GhidraScript;
import ghidra.app.decompiler.DecompInterface;
import ghidra.app.decompiler.DecompileResults;
import ghidra.app.decompiler.DecompiledFunction;
import ghidra.program.model.listing.Function;
import ghidra.program.model.listing.FunctionIterator;
import ghidra.util.task.TaskMonitorAdapter;

public class FFNoAnalysis extends GhidraScript {
    public void run() throws Exception {
        DecompInterface di = new DecompInterface();
        di.setSimplificationStyle("none");
        di.openProgram(currentProgram);
        TaskMonitorAdapter mon = new TaskMonitorAdapter();
        FunctionIterator it = currentProgram.getListing().getFunctions(true);
        int ok = 0, tot = 0;
        while (it.hasNext() && tot < 5) {
            Function f = it.next();
            tot++;
            DecompileResults r = di.decompileFunction(f, 30, mon);
            DecompiledFunction df = r == null ? null : r.getDecompiledFunction();
            String c = df == null ? "NODF" : df.getC();
            if (c != null && !c.trim().isEmpty()) {
                ok++;
                if (ok == 1) {
                    System.out.println("=== FIRST DECOMPILE: " + f.getName() + " 0x" + Long.toHexString(f.getEntryPoint().getOffset()) + " ===");
                    System.out.println(c.substring(0, Math.min(c.length(), 600)));
                }
            } else {
                System.out.println("FAIL=" + f.getName() + " err=" + (r == null ? "null" : r.getErrorMessage()));
            }
        }
        System.out.println("DECOMPILE_OK=" + ok + "/" + tot);
    }
}
