import ghidra.program.model.address.*;
import ghidra.program.model.listing.*;
import ghidra.program.model.symbol.*;
import ghidra.app.script.GhidraScript;
import java.util.*;

public class FindAesCallers extends GhidraScript {
  Program p; Listing li; SymbolTable st;

  @Override public void run() throws Exception {
    p = getCurrentProgram();
    li = p.getListing();
    st = p.getSymbolTable();

    println("=== SCAN ALL CALLS -> targets whose primary symbol contains EVP ===");
    long total=0, evpCalls=0;
    Map<String,Set<Long>> callCounts = new LinkedHashMap<>();
    Map<String,Set<String>> details = new LinkedHashMap<>();
    InstructionIterator ii = li.getInstructions(true);
    while (ii.hasNext()) {
      Instruction i = ii.next();
      if (!i.getMnemonicString().equalsIgnoreCase("CALL")) continue;
      total++;
      Address target = i.getDefaultFallThrough();
      if (target==null) continue;
      Symbol s = st.getPrimarySymbol(target);
      if (s!=null && s.getName().contains("EVP")) {
        evpCalls++;
        Function cf = p.getFunctionManager().getFunctionAt(i.getAddress());
        String callerName = cf==null?"<no func>":cf.getName();
        callCounts.computeIfAbsent(s.getName(), k->new TreeSet<>()).add(i.getAddress().getOffset());
        details.computeIfAbsent(s.getName(), k->new TreeSet<>()).add(callerName);
      }
    }
    println("TOTAL_CALLS="+total+" EVP_CALLS="+evpCalls);
    for (String nm : callCounts.keySet()) {
      println("  >>> EVP "+nm+": "+callCounts.get(nm).size()+" CALL(s) from: "+details.get(nm));
    }
    if (evpCalls==0) println("(no EVP-targeting CALLs found via primary symbol)");
  }
}
