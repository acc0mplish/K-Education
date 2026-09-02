import ghidra.program.model.listing.*;
import ghidra.program.model.address.*;
import ghidra.program.model.symbol.*;
import ghidra.app.decompiler.*;
import ghidra.util.task.ConsoleTaskMonitor;
import ghidra.util.task.TaskMonitor;
import ghidra.app.script.GhidraScript;
import java.util.Iterator;
import java.io.*;

public class RsaDec2 extends GhidraScript {
  String decomp(Program p, FunctionManager fm, String addrStr) throws Exception {
    Address a = p.parseAddress(addrStr)[0];
    Function f = fm.getFunctionAt(a);
    if (f == null) f = fm.getFunctionContaining(a);
    if (f == null) return addrStr+" -> no func\n";
    StringBuilder sb = new StringBuilder();
    sb.append("===== FUNC: ").append(f.getName()).append(" @").append(Long.toHexString(f.getEntryPoint().getOffset())).append(" =====\n");
    DecompInterface di = new DecompInterface();
    if (!di.openProgram(p)) { sb.append("openProgram failed\n"); return sb.toString(); }
    TaskMonitor mon = new ConsoleTaskMonitor();
    DecompileResults dr = di.decompileFunction(f, 1200, mon);
    if (dr == null || dr.getDecompiledFunction() == null) { sb.append("NO RESULT\n"); return sb.toString(); }
    sb.append(dr.getDecompiledFunction().getC());
    sb.append("\n");
    di.dispose();
    return sb.toString();
  }

  @Override public void run() throws Exception {
    Program p = getCurrentProgram();
    FunctionManager fm = p.getFunctionManager();
    String out = "";
    // The license parser that FUN_001b63e0 calls
    out += decomp(p, fm, "0x1b5b90");
    // Dump full listing of FUN_001b5b90 body via disassembly too
    Listing li = p.getListing();
    Address s = p.parseAddress("0x1b5b90")[0];
    Iterator<Instruction> it = li.getInstructions(s, true);
    long end = 0x1b5b90 + 0x2000;
    println("=== DISASSEMBLY @1b5b90 ===");
    while (it.hasNext()) {
      Instruction i = it.next();
      long off = i.getAddress().getOffset();
      if (off > end) break;
      println("  @"+Long.toHexString(off)+": "+i.getMnemonicString());
    }
    println("=== DECOMP: FUN_001b5b90 ===");
    println(out);
  }
}
