import ghidra.app.script.GhidraScript;
import ghidra.app.decompiler.DecompInterface;
import ghidra.app.decompiler.DecompileResults;
import ghidra.app.decompiler.DecompiledFunction;
import ghidra.app.decompiler.ClangTokenGroup;
import ghidra.app.decompiler.ClangNode;
import ghidra.program.model.listing.Function;
import ghidra.util.task.TaskMonitorAdapter;
import java.io.StringWriter;
public class DecVerify extends GhidraScript {
  // recurse ClangNode tree, append toString of each node
  static void printTree(ClangNode n, StringWriter sw) {
    if (n == null) return;
    for (int i = 0; i < n.numChildren(); i++) {
      ClangNode c = n.Child(i);
      if (c == null) continue;
      String t = c.toString();
      sw.append(t==null?"<null>":t);
      if (c.numChildren() > 0) printTree(c, sw);
    }
  }
  @Override public void run() throws Exception {
    DecompInterface di = new DecompInterface();
    di.setSimplificationStyle("normal");
    di.openProgram(currentProgram);
    TaskMonitorAdapter mon = new TaskMonitorAdapter();
    Function target = currentProgram.getListing().getFunctions(true).next();
    String nm = target.getName();
    System.out.println("TARGET " + nm + " @0x" + Long.toHexString(target.getEntryPoint().getOffset()));
    DecompileResults r = di.decompileFunction(target, 45, mon);
    System.out.println("isValid=" + (r==null?"null":r.isValid()) + " decompileCompleted=" + (r==null?"null":r.decompileCompleted()));
    if (r != null) {
      DecompiledFunction df = r.getDecompiledFunction();
      System.out.println("getC() len=" + (df==null?"null":(df.getC()==null?"null":df.getC().length())));
      if (df!=null && df.getC()!=null) System.out.println("  getC() head>>" + df.getC().replace("\n","\\n").trim().substring(0,Math.min(160,df.getC().length())) + "<<");
      System.out.println("getSignature()>>" + (df==null?"null":df.getSignature()) + "<<");
      ClangTokenGroup g = r.getCCodeMarkup();
      System.out.println("getCCodeMarkup()=" + (g==null?"null":"group"));
      if (g != null) {
        StringWriter sw = new StringWriter();
        printTree(g, sw);
        String c = sw.toString();
        System.out.println("recurse-tree len=" + (c==null?"null":c.length()));
        if (c != null && !c.isEmpty()) System.out.println("  tree head>>" + c.replace("\n","\\n").trim().substring(0,Math.min(200,c.length())) + "<<");
        System.out.println("  root.toString()=" + (g.toString()==null?"null":("len="+g.toString().length())));
      }
    }
    di.closeProgram();
  }
}
