import ghidra.app.script.GhidraScript;
import ghidra.app.decompiler.DecompInterface;
import ghidra.app.decompiler.DecompileResults;
import ghidra.app.decompiler.DecompiledFunction;
import ghidra.program.model.listing.Function;
import ghidra.program.model.listing.FunctionIterator;
import ghidra.util.task.TaskMonitorAdapter;
import ghidra.util.task.TaskMonitor;
public class Test3 extends GhidraScript {
  public void run() throws Exception {
    DecompInterface di = new DecompInterface();
    di.setSimplificationStyle("normal");
    di.openProgram(currentProgram);
    TaskMonitor mon = new TaskMonitorAdapter();
    FunctionIterator it = currentProgram.getListing().getFunctions(true);
    Function[] pick = new Function[5]; int n=0; long off=0;
    while (it.hasNext() && n<5){ Function f=it.next(); pick[n++]=f; off=f.getEntryPoint().getOffset(); }
    System.out.println("TEST3_FUNS="+n);
    for (int i=0;i<n;i++){
      Function f = pick[i];
      DecompileResults r = di.decompileFunction(f, 60, mon);
      if (r==null){ System.out.println("F["+i+"] "+f.getName()+" @0x"+Long.toHexString(off)+" r=null"); continue; }
      DecompiledFunction df = r.getDecompiledFunction();
      String c = (df==null)?"<dfnull>":(df.getC()==null?"<getC-null>":df.getC());
      String head = c.length()<220?c:(c.substring(0,220)+"[..truncated..]");
      int ccm=(r.getDecompiledFunction()==null)?-1:r.getDecompiledFunction().getCCodeMarkup().getNumChildren();
      System.out.println("F["+i+"] "+f.getName()+" @0x"+Long.toHexString(off)
        +" isValid="+r.isValid()+" completed="+r.decompileCompleted()
        +" getClen="+(c.startsWith("<")?c:""+c.length())
        +" ccmChildren="+ccm
        +" getC=\""+head+"\"");
    }
    di.closeProgram();
  }
}
