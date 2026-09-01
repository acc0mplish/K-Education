import ghidra.program.model.address.*;
import ghidra.program.model.listing.*;
import ghidra.program.model.symbol.*;
import ghidra.app.script.GhidraScript;
import java.util.*;

public class CallScanDiag extends GhidraScript {
  @Override public void run() throws Exception {
    Program p = getCurrentProgram();
    Listing li = p.getListing();
    SymbolTable st = p.getSymbolTable();

    // 1) Find Ghidra's address for EVP_aes_128_cbc / EVP_DecryptInit_ex (PLT symbols)
    String[] names = {"EVP_aes_128_cbc","_EVP_aes_128_cbc","EVP_DecryptInit_ex","_EVP_DecryptInit_ex"};
    for (String n : names) {
      SymbolIterator si = st.getSymbols(n);
      boolean found=false;
      while (si.hasNext()) { Symbol s = si.next(); if (s.getAddress()!=null){ found=true; println("SYM "+n+" @"+Long.toHexString(s.getAddress().getOffset())); } }
      if (!found) println("SYM "+n+" (none)");
    }

    // 2) Iterate all CALL instrs, decode E8 rel32 target Address directly from fall-through.
    //    Collect the set of distinct target Addresses (for PLT-range and beyond).
    Map<Address,Integer> tgtCount = new HashMap<>();
    int total=0, e8=0;
    InstructionIterator ii = li.getInstructions(true);
    while (ii.hasNext()) {
      Instruction i = ii.next();
      if (!i.getMnemonicString().equalsIgnoreCase("CALL")) continue;
      total++;
      try {
        byte[] b = i.getParsedBytes();
        if (b.length>=5 && b[0]==(byte)0xE8) {
          e8++;
          int rel = (b[1]&0xff)|((b[2]&0xff)<<8)|((b[3]&0xff)<<16)|((b[4]&0xff)<<24);
          Address fall = i.getDefaultFallThrough();
          long tgt = (fall==null? i.getAddress().getOffset()+5 : fall.getOffset()) + (long)rel;
          AddressSpace as = fall==null? i.getAddress().getAddressSpace() : fall.getAddressSpace();
          tgtCount.merge(as.getAddress(tgt),1,Integer::sum);
        }
      } catch(Exception e){}
    }
    println("TOTAL_CALL="+total);
    println("CALL_E8_REL32="+e8);
    println("DISTINCT_TARGETS="+tgtCount.size());

    // 3) Print the most-targeted addresses with symbol names (top 40)
    List<Map.Entry<Address,Integer>> sorted = new ArrayList<>(tgtCount.entrySet());
    sorted.sort((a,b)-> b.getValue()-a.getValue());
    println("=== TOP TARGETS (by # distinct CALLs) ===");
    int c=0;
    for (Map.Entry<Address,Integer> e : sorted) {
      Address ta = e.getKey();
      long off = ta.getOffset();
      String nm="";
      Symbol s = st.getPrimarySymbol(ta);
      if (s!=null) nm=" "+s.getName();
      println("  @"+Long.toHexString(off)+" x"+e.getValue()+nm);
      if (++c>40) break;
    }

    // 4) Specifically report CALLs whose decoded target is in .plt PLT range
    println("=== TARGETS IN PLT RANGE 0x1c5000-0x1c6000 ===");
    int cc=0;
    for (Map.Entry<Address,Integer> e : sorted) {
      long off = e.getKey().getOffset();
      if (off>=0x1c5000 && off<=0x1c6000) {
        Symbol s = st.getPrimarySymbol(e.getKey());
        println("  @"+Long.toHexString(off)+" x"+e.getValue()+(s!=null?" "+s.getName():""));
        if (++cc>30) break;
      }
    }
  }
}
