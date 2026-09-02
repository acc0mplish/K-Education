import ghidra.program.model.address.*;
import ghidra.program.model.listing.*;
import ghidra.program.model.symbol.*;
import ghidra.app.script.GhidraScript;
import java.util.*;

public class FindAesCaller extends GhidraScript {
  Program p; Listing li; FunctionManager fm; SymbolTable st;
  @Override public void run() throws Exception {
    p = getCurrentProgram(); li = p.getListing(); fm = p.getFunctionManager(); st = p.getSymbolTable();
    // find EVP_aes_128_cbc primary symbol
    Symbol aes = st.getPrimarySymbol(p.getSymbol("EVP_aes_128_cbc"));
    Address aesAddr = null;
    if (aes!=null && aes.getSymbol().getType()==SymbolType.FUNCTION) aesAddr = aes.getSymbol().getAddress();
    else aesAddr = p.getSymbolTable().getPrimarySymbol("EVP_aes_128_cbc").getSymbol().getAddress();
    println("EVP_aes_128_cbc VA = " + aesAddr);
    // all CALLs
    Set<String> callers = new TreeSet<>();
    Map<String,Address> callSite = new TreeMap<>();
    InstructionIterator ii = li.getInstructions();
    while (ii.hasNext()) {
      Instruction i = ii.next();
      if (i.getMnemonicString().equalsIgnoreCase("CALL") && !i.isTerminalBranch()) {
        Address t = i.getDefaultFallThrough();
        if (t!=null && t.equals(aesAddr)) {
          Function f = fm.getFunctionAt(i.getAddress());
          String nm = f==null?"<none>":f.getName();
          callers.add(nm);
          callSite.computeIfAbsent(nm, x->i.getAddress());
        }
      }
    }
    println("CALLERS of EVP_aes_128_cbc: " + callers);
    for (String nm : callers) println("  " + nm + " <- call @" + callSite.get(nm));
  }
}
