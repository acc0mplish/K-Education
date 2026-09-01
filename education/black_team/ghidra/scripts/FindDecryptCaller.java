import ghidra.program.model.address.*;
import ghidra.program.model.listing.*;
import ghidra.program.model.symbol.*;
import ghidra.program.model.mem.*;
import ghidra.app.script.GhidraScript;
import java.util.*;

public class FindDecryptCaller extends GhidraScript {
  Program p; Listing li; FunctionManager fm; SymbolTable st;
  @Override public void run() throws Exception {
    p = getCurrentProgram(); li = p.getListing(); fm = p.getFunctionManager(); st = p.getSymbolTable();
    Address tgt = p.getSymbolTable().getPrimarySymbol("EVP_DecryptInit_ex").getSymbol().getAddress();
    println("EVP_DecryptInit_ex VA = " + tgt);
    // find CALL sites to tgt and report caller + context
    Iterator<Instruction> it = li.getInstructions().iterator();
    List<Instruction> hits = new ArrayList<>();
    while (it.hasNext()) {
      Instruction i = it.next();
      if (i.getMnemonicString().equalsIgnoreCase("CALL") && !i.isTerminalBranch() && i.getDefaultFallThrough()!=null && i.getDefaultFallThrough().equals(tgt))
        hits.add(i);
    }
    println("EVP_DecryptInit_ex CALL sites: " + hits.size());
    for (Instruction i : hits) {
      Function f = fm.getFunctionAt(i.getAddress());
      String fnm = f==null?"<none>":f.getName();
      println("  caller=" + fnm + " callVA=" + i.getAddress());
    }
  }
}
