import ghidra.program.model.listing.*;
import ghidra.program.model.scalar.Scalar;
import ghidra.program.model.address.*;
import ghidra.program.model.symbol.Reference;
import ghidra.app.script.GhidraScript;
import java.util.*;

public class DumpFunc extends GhidraScript {
  private static String render(Instruction inst) {
    String mn = inst.getMnemonicString();
    int n = inst.getNumOperands();
    StringBuilder sb = new StringBuilder(mn);
    for (int k = 0; k < n; k++) {
      try {
        List<Object> lst = inst.getDefaultOperandRepresentationList(k);
        if (lst.isEmpty()) continue;
        Object v = lst.get(0);
        if (v instanceof Scalar) sb.append(" 0x").append(Long.toHexString(((Scalar) v).getValue()));
        else if (v instanceof Address) sb.append(" @").append(Long.toHexString(((Address) v).getOffset()));
        else sb.append(" ").append(v.toString());
      } catch (Exception e) {}
    }
    return sb.toString();
  }
  @Override public void run() throws Exception {
    Program p = getCurrentProgram();
    Listing li = p.getListing();
    long start = 0x1b64e0;
    long end = 0x1b6960;
    Address s = p.parseAddress("0x1b64e0")[0];
    Iterator<Instruction> it = li.getInstructions(s, true);
    while (it.hasNext()) {
      Instruction i = it.next();
      Address a = i.getAddress();
      long off = a.getOffset();
      if (off > end) break;
      String line = "  @"+Long.toHexString(off)+": "+render(i);
      try {
        byte[] b = i.getParsedBytes();
        String sb = " BYTES:";
        for (int k=0;k<b.length;k++) sb += String.format(" %02x",(int)b[k]&0xff);
        line += sb;
      } catch (Exception e) {}
      Reference[] refs = i.getReferencesFrom();
      if (refs != null) for (Reference r : refs)
        if (r!=null && r.getToAddress()!=null) line += "   ; REF[" + r.getReferenceType().getName() + "] @" + Long.toHexString(r.getToAddress().getOffset());
      println(line);
    }
    println("(done)");
  }
}
