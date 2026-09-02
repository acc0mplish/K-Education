import ghidra.app.script.GhidraScript;
import ghidra.app.decompiler.DecompInterface;
import ghidra.app.decompiler.DecompileResults;
import ghidra.program.model.listing.Function;
import ghidra.program.model.address.Address;
import ghidra.util.task.TaskMonitorAdapter;
public class Test1 extends GhidraScript {
  public void run() throws Exception {
    DecompInterface di = new DecompInterface();
    di.setSimplificationStyle("normal");
    di.openProgram(currentProgram);
    TaskMonitor mon = new TaskMonitorAdapter();
    Function first = currentProgram.getListing().getFunctions(true).next();
    Address a0 = first.getEntryPoint();
    long off = a0.getOffset();
    long[] targets = {off, off+0x40, off+0x100, off+0x300};
    for (long t : targets) {
      Address at = currentProgram.getAddress(Long.toHexString(t));
      if (at==null) continue;
      Function f = currentProgram.getListing().getFunctionAt(at);
      if (f==null) { System.out.println("@"+Long.toHexString(t)+" no function"); continue; }
      DecompileResults r = di.decompileFunction(f, 45, mon);
      if (r==null) { System.out.println(f.getName()+" @0x"+Long.toHexString(off)+" r=null"); continue; }
      String c = (r.getDecompiledFunction()==null)?"<dfnull>":r.getDecompiledFunction().getC();
      String head = (c==null)?"<null>":(c.length()<160?c:c.substring(0,160)+"[..truncated..]");
      System.out.println(f.getName()+" @0x"+Long.toHexString(off)
        +" isValid="+r.isValid()+" completed="+r.decompileCompleted()
        +" getSignature="+r.getSignature()+" getClen="+(c==null?"null":String.valueOf(c.length()))
        +" getC=\""+head+"\"");
    }
    di.closeProgram();
  }
}
