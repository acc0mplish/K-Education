import ghidra.app.script.GhidraScript;
import ghidra.app.decompiler.DecompInterface;
import ghidra.app.decompiler.DecompileResults;
import ghidra.app.decompiler.DecompiledFunction;
import ghidra.program.model.listing.Function;
import ghidra.program.model.listing.FunctionIterator;
import ghidra.program.model.address.Address;
import ghidra.util.task.TaskMonitorAdapter;
import ghidra.util.task.TaskMonitor;
public class Test2 extends GhidraScript {
  // wait until the background DecompilerSwitchAnalyzer releases its lock
  private static boolean switchLockBusy() {
    try {
      Class<?> c = Class.forName("ghidra.app.decompiler.DecompilerSwitchAnalyzer");
      java.lang.reflect.Field f = c.getDeclaredField("busy"); f.setAccessible(true);
      Object inst = c.getDeclaredConstructor().newInstance();
      Boolean b = (Boolean) f.get(inst);
      return b!=null && b;
    } catch (Throwable t) { return false; }
  }
  public void run() throws Exception {
    DecompInterface di = new DecompInterface();
    di.setSimplificationStyle("normal");
    di.openProgram(currentProgram);
    TaskMonitor mon = new TaskMonitorAdapter();
    // warmup + wait for switch analyzer lock release
    for (int w=0; w<30; w++){
      if (!switchLockBusy()) break;
      Thread.sleep(2000);
    }
    System.out.println("SWITCH_BUSY_AFTER_WARMUP=" + switchLockBusy());
    FunctionIterator it = currentProgram.getListing().getFunctions(true);
    Function[] pick = new Function[4]; int n=0; long off=0;
    while (it.hasNext() && n<4){ Function f=it.next(); pick[n++]=f; off=f.getEntryPoint().getOffset(); }
    for (int i=0;i<n;i++){
      Function f = pick[i];
      Address at = f.getEntryPoint();
      DecompileResults r = di.decompileFunction(f, 60, mon);
      if (r==null){ System.out.println("F["+i+"] "+f.getName()+" @0x"+Long.toHexString(off)+" r=null"); continue; }
      DecompiledFunction df = r.getDecompiledFunction();
      String c = (df==null)?"<dfnull>":(df.getC()==null?"<getC-null>":df.getC());
      String head = c.length()<200?c:(c.substring(0,200)+"[..truncated..]");
      String ccm = (r.getCCodeMarkup()==null)?"<ccm-null>":String.valueOf(r.getCCodeMarkup().getNumChildren());
      System.out.println("F["+i+"] "+f.getName()+" @0x"+Long.toHexString(off)
        +" isValid="+r.isValid()+" completed="+r.decompileCompleted()
        +" getSig="+(r.getSignature()==null?"null":"len"+r.getSignature().length())
        +" getClen="+(c.equals("<dfnull>")||c.equals("<getC-null>")?c:""+c.length())
        +" ccmChildren="+ccm
        +" getC=\""+head+"\"");
    }
    di.closeProgram();
  }
}
