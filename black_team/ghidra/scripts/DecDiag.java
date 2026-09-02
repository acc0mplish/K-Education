import ghidra.app.script.GhidraScript;
import ghidra.app.decompiler.DecompInterface;
import ghidra.app.decompiler.DecompileResults;
import ghidra.app.decompiler.DecompiledFunction;
import ghidra.app.decompiler.ClangTokenGroup;
import ghidra.program.model.listing.Function;
import ghidra.util.task.TaskMonitorAdapter;
import java.util.ArrayList;
import java.util.List;
public class DecDiag extends GhidraScript {
  @Override public void run() throws Exception {
    DecompInterface di = new DecompInterface();
    di.setSimplificationStyle("normal");
    di.openProgram(currentProgram);
    TaskMonitorAdapter mon = new TaskMonitorAdapter();
    List<Function> all = new ArrayList<>();
    for (Function f : currentProgram.getListing().getFunctions(true)) all.add(f);
    System.out.println("total funcs=" + all.size());
    int shown=0;
    for (Function fn : all) {
      String nm = fn.getName();
      if (nm.startsWith("FUN_") || nm.startsWith("thunk_") || nm.startsWith("caseD_")) continue; // skip unmapped
      DecompileResults r = di.decompileFunction(fn, 45, mon);
      String tag = (r==null)?"NULL":("isValid="+r.isValid());
      String txt = "";
      if (r!=null && r.isValid()) {
        txt = (r.getDecompiledFunction()==null)?"dfNULL":(r.getDecompiledFunction().getC());
      }
      System.out.println("FN " + nm + " @0x" + Long.toHexString(fn.getEntryPoint().getOffset())
        + " [" + tag + "] txtLen=" + txt.length()
        + " head=" + (txt.length()>120?txt.substring(0,120):txt).replace("\n","\\n"));
      if (++shown >= 8) break;
    }
    di.closeProgram();
  }
}
