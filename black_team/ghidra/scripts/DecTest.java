import ghidra.app.script.GhidraScript;
import ghidra.app.decompiler.DecompInterface;
import ghidra.app.decompiler.DecompileResults;
import ghidra.program.model.listing.Function;
import ghidra.util.task.TaskMonitorAdapter;
public class DecTest extends GhidraScript {
  @Override public void run() throws Exception {
    Function fn = currentProgram.getListing().getFunctions(true).next();
    System.out.println("FUNC=" + fn.getName() + " @0x" + Long.toHexString(fn.getEntryPoint().getOffset()));
    DecompInterface di = new DecompInterface();
    di.setSimplificationStyle("normal");
    System.out.println("OPEN: " + di.openProgram(currentProgram));
    TaskMonitorAdapter mon = new TaskMonitorAdapter();
    DecompileResults r = di.decompileFunction(fn, 45, mon);
    System.out.println("R=" + (r==null?"null":("isValid="+r.isValid()+" completed="+r.decompileCompleted()+" err="+r.getErrorMessage())));
    if (r!=null && r.isValid()) {
      String t = r.getCCodeMarkup()==null?"tree-null":r.getCCodeMarkup().toString();
      System.out.println("LEN=" + t.length());
      System.out.println("HEAD>>" + t.replace("\n"," ").trim().substring(0, Math.min(200,t.length())) + "<<");
    }
    di.closeProgram();
  }
}
