import ghidra.program.model.listing.*;
import ghidra.program.model.address.*;
import ghidra.program.model.symbol.*;
import ghidra.app.decompiler.*;
import ghidra.util.task.ConsoleTaskMonitor;
import ghidra.util.task.TaskMonitor;
import ghidra.app.script.GhidraScript;
import java.io.*;

public class RsaDec extends GhidraScript {
  @Override public void run() throws Exception {
    Program p = getCurrentProgram();
    FunctionManager fm = p.getFunctionManager();

    String[] addrs = {"0x1b63e0", "0x1b64e0"};
    for (String a : addrs) {
      Function f = fm.getFunctionAt(p.parseAddress(a)[0]);
      if (f == null) f = fm.getFunctionContaining(p.parseAddress(a)[0]);
      if (f == null) { println(a+" -> no func"); continue; }
      println("========== FUNC: "+f.getName()+" @"+Long.toHexString(f.getEntryPoint().getOffset())+" ==========");
      DecompInterface di = new DecompInterface();
      if (!di.openProgram(p)) { println("openProgram failed"); continue; }
      TaskMonitor mon = new ConsoleTaskMonitor();
      DecompileResults dr = di.decompileFunction(f, 1200, mon);
      if (dr == null || dr.getDecompiledFunction() == null) { println("NO RESULT for "+a); continue; }
      String c = dr.getDecompiledFunction().getC();
      System.out.println(c);
      di.dispose();
    }
  }
}
