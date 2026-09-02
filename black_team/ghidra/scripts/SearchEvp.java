import ghidra.program.model.address.*;
import ghidra.program.model.symbol.*;
import ghidra.program.model.listing.*;
import ghidra.app.script.GhidraScript;
import java.util.*;

public class SearchEvp extends GhidraScript {
  @Override public void run() throws Exception {
    Program p = getCurrentProgram();
    SymbolTable st = p.getSymbolTable();
    FunctionManager fm = p.getFunctionManager();
    Listing li = p.getListing();
    ReferenceManager rm = p.getReferenceManager();
    String[] syms = {"EVP_aes_128_cbc","EVP_DecryptInit_ex","EVP_DecryptUpdate","EVP_DecryptFinal_ex"};
    for (String sname : syms) {
      println("========== "+sname+" ==========");
      SymbolIterator si = st.getSymbols(sname);
      if (!si.hasNext()) { println("  not found"); continue; }
      Symbol s = si.next();
      Address a = s.getAddress();
      println("  symbol @"+Long.toHexString(a.getOffset()));
      ReferenceIterator ri = rm.getReferencesTo(a);
      if (ri==null) { println("  (no refs)"); continue; }
      Set<Long> callers = new TreeSet<>();
      while (ri.hasNext()) {
        Address from = ri.next().getFromAddress();
        callers.add(from.getOffset());
      }
      println("  referrers (callers) count="+callers.size());
      for (long off : callers) {
        Address fa = p.parseAddress(Long.toHexString(off))[0];
        Function f = fm.getFunctionAt(fa);
        String fn = f==null?"<no func>":f.getName();
        String mn = "N/A";
        Instruction inst = li.getInstructionAt(fa);
        if (inst!=null) mn = inst.getMnemonicString();
        println("    instr @"+Long.toHexString(off)+" ["+mn+"] in "+fn);
      }
    }
  }
}
