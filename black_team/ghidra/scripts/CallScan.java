import ghidra.program.model.address.*;
import ghidra.program.model.symbol.*;
import ghidra.program.model.listing.*;
import ghidra.app.script.GhidraScript;
import java.util.*;

public class CallScan extends GhidraScript {
  static final long AES_PLT = 0x1c5290;  // EVP_aes_128_cbc
  static final long INIT_PLT = 0x1c5e98;  // EVP_DecryptInit_ex
  static boolean want(long a){ return a==AES_PLT || a==INIT_PLT; }
  static String nm(long a){ return a==AES_PLT?"EVP_aes_128_cbc":(a==INIT_PLT?"EVP_DecryptInit_ex":"?"); }

  @Override public void run() throws Exception {
    Program p = getCurrentProgram();
    FunctionManager fm = p.getFunctionManager();
    Listing li = p.getListing();
    println("Scanning ALL CALL instrs for PLT targets " + Long.toHexString(AES_PLT) + " / " + Long.toHexString(INIT_PLT));
    Set<Long> callers = new TreeSet<>();
    int total=0, matched=0;
    InstructionIterator ii = li.getInstructions(true);
    while (ii.hasNext()) {
      Instruction i = ii.next();
      String mn = i.getMnemonicString();
      if (!mn.equalsIgnoreCase("CALL")) continue;
      total++;
      try {
        byte[] bytes = i.getParsedBytes();
        long start = i.getAddress().getOffset();
        if (bytes.length<5 || bytes[0]!=(byte)0xE8) continue;
        int rel32 = (bytes[1]&0xff)|((bytes[2]&0xff)<<8)|((bytes[3]&0xff)<<16)|((bytes[4]&0xff)<<24);
        long fall = i.getDefaultFallThrough()==null?start+5:i.getDefaultFallThrough().getOffset();
        long tgt = fall + (long)rel32;
        if (!want(tgt)) continue;
        matched++;
        Function f = fm.getFunctionAt(i.getAddress());
        String fn = f==null?"<no func>":f.getName();
        String op = "";
        try { List<Object> ops = i.getDefaultOperandRepresentationList(0); if (ops!=null && !ops.isEmpty() && ops.get(0) instanceof Address) op=" @"+Long.toHexString(((Address)ops.get(0)).getOffset()); } catch(Exception e){}
        println("  MATCH @"+Long.toHexString(start)+" [CALL] -> @"+Long.toHexString(tgt)+" ("+nm(tgt)+")["+op+"] in "+fn);
        callers.add(f==null?-1L:f.getEntryPoint().getOffset());
      } catch (Exception e) {}
    }
    println("TOTAL_CALL="+total+" MATCHED="+matched);
    println("CALLER_FUNCS:");
    for (long off : callers) println("   @" + Long.toHexString(off));
  }
}
