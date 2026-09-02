import ghidra.program.model.address.*;
import ghidra.program.model.symbol.*;
import ghidra.program.model.listing.*;
import ghidra.app.script.GhidraScript;
import java.util.*;

public class CallersOf extends GhidraScript {
  @Override public void run() throws Exception {
    Program p = getCurrentProgram();
    FunctionManager fm = p.getFunctionManager();
    Listing li = p.getListing();
    ReferenceManager rm = p.getReferenceManager();
    // EVP_aes_128_cbc PLT slot (from ELF .rela.plt analysis)
    Address target = p.parseAddress("0x1c5290")[0];
    println("Searching callers of @" + Long.toHexString(target.getOffset()));
    ReferenceIterator ri = rm.getReferencesTo(target);
    if (ri==null) { println("no refs to this address"); return; }
    Set<Long> funcs = new TreeSet<>();
    long n=0;
    while (ri.hasNext()) {
      Reference r = ri.next();
      Address from = r.getFromAddress();
      if (from==null) continue;
      n++;
      Instruction i = li.getInstructionAt(from);
      String mn = i==null?"<no inst>":i.getMnemonicString();
      String off = Long.toHexString(from.getOffset());
      String op = "";
      try {
        List<Object> ops = i.getDefaultOperandRepresentationList(0);
        if (ops!=null) for (Object o:ops) {
          if (o instanceof Address) op += " @"+Long.toHexString(((Address)o).getOffset());
          else if (o instanceof Long) op += " 0x"+Long.toHexString((Long)o);
        }
      } catch (Exception ex) {}
      Function f = fm.getFunctionAt(from);
      String fn = f==null?"<no func>":f.getName();
      println("  instr @"+off+" ["+mn+op+"] in "+fn);
      funcs.add(f==null?-1L:f.getEntryPoint().getOffset());
    }
    println("TOTAL_CALLERS="+n);
    println("UNIQUE_CALLER_FUNCS:");
    for (long off : funcs) println("   @" + Long.toHexString(off));
  }
}
