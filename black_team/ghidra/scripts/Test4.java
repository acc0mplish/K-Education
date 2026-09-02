import ghidra.app.script.GhidraScript;
import ghidra.app.decompiler.DecompInterface;
import ghidra.app.decompiler.DecompileResults;
import ghidra.app.decompiler.DecompiledFunction;
import ghidra.program.model.listing.Function;
import ghidra.program.model.listing.FunctionIterator;
public class Test4 extends GhidraScript {
  public void run() throws Exception {
    DecompInterface di = new DecompInterface();
    di.setSimplificationStyle("normal");
    di.openProgram(currentProgram);
    TaskMonitorAdapter mon = new TaskMonitorAdapter();
    FunctionIterator it = currentProgram.getListing().getFunctions(true);
    Function[] pick = new Function[6]; int n=0; long off=0;
    while (it.hasNext() && n<6){ Function f=it.next(); pick[n++]=f; off=f.getEntryPoint().getOffset(); }
    System.out.println("TEST4_FUNS="+n);
    for (int i=0;i<n;i++){
      Function f = pick[i];
      DecompileResults r = di.decompileFunction(f, 60, mon);
      if (r==null){ System.out.println("F["+i+"] "+f.getName()+" @0x"+Long.toHexString(off)+" r=null"); continue; }
      DecompiledFunction df = r.getDecompiledFunction();
      String c = (df==null)?"<dfnull>":(df.getC()==null?"<getC-null>":df.getC());
      String head = c.length()<250?c:(c.substring(0,250)+"[..truncated..]");
      System.out.println("F["+i+"] "+f.getName()+" @0x"+Long.toHexString(off)
        +" isValid="+r.isValid()+" completed="+r.decompileCompleted()
        +" getClen="+(c.startsWith("<")?c:""+c.length())
        +" getC=\""+head+"\"");
    }
    di.closeProgram();
  }
}
