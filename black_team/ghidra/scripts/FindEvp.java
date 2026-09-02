import ghidra.program.model.address.*;
import ghidra.program.model.listing.*;
import ghidra.program.model.symbol.*;
import ghidra.app.script.GhidraScript;
import java.util.*;

public class FindEvp extends GhidraScript {
  Program p; Listing li; FunctionManager fm; SymbolTable st;
  Address findF(String name) throws Exception {
    SymbolSet ss = st.getSymbols(name);
    if (ss==null || ss.getSize()==0) return null;
    return ss.getFirstElement().getAddress();
  }
  @Override public void run() throws Exception {
    p = getCurrentProgram(); li = p.getListing(); fm = p.getFunctionManager(); st = p.getSymbolTable();
    String[] fns = {"EVP_aes_128_cbc","EVP_DecryptInit_ex","EVP_EncryptInit_ex","EVP_rsa_public_decrypt","RSA_verify","X509_verify"};
    for (String n : fns) {
      Address a = findF(n);
      if (a==null) { println(n+" = NOT FOUND"); continue; }
      String fnm = fm.getFunctionAt(a)==null?"<nofunc>":fm.getFunctionAt(a).getName();
      println("### "+n+" VA=0x"+Long.toHexString(a.getOffset())+"("+fnm+")");
      // direct CALL sites to this function
      Set<Long> sites = new TreeSet<>();
      Iterator<Instruction> it = li.getInstructions().iterator();
      while (it.hasNext()) {
        Instruction i = it.next();
        if (i.getMnemonicString().equalsIgnoreCase("CALL")) {
          Address ft = i.getDefaultFallThrough();
          if (ft!=null && ft.equals(a)) sites.add(i.getAddress().getOffset());
        }
      }
      println("  direct CALL sites: "+sites.size());
      for (Long s : sites) {
        Function f = fm.getFunctionAt(p.getAddress(s));
        println("     call@0x"+Long.toHexString(s)+" <- "+(f==null?"<nofunc>":f.getName()));
      }
      // indirect: report via jumpTableSymbol? just note
    }
  }
}
