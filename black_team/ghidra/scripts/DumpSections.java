import ghidra.program.model.address.*;
import ghidra.program.model.listing.*;
import ghidra.program.model.symbol.*;
import ghidra.app.script.GhidraScript;
import java.util.*;

public class DumpSections extends GhidraScript {
  @Override public void run() throws Exception {
    Program p = getCurrentProgram();
    println("=== NAMED SECTIONS ===");
    for (String n : new String[]{".plt",".plt.sec",".plt.got",".got",".got.plt",".text",".rodata",".data",".init_array"}) {
      var s = p.getSection(n);
      if (s==null) { println("  "+n+" (none)"); continue; }
      AddressSetView a = s.getAddressSet();
      println("  "+n+" @0x"+Long.toHexString(a.getMinAddress().getOffset())+" size="+s.getBlock().getSize());
    }
    println("=== ALL EXECUTABLE SECTIONS (VA order) ===");
    Iterator it = p.getSections();
    List<long[]> rows = new ArrayList<>();
    while (it.hasNext()) {
      var s = it.next();
      if (s.getBlock().isExecute() && s.getBlock().getSize()>0 && s.getBlock().getSize()<0x200000)
        rows.add(new long[]{s.getAddressSet().getMinAddress().getOffset(), s.getBlock().getSize()});
    }
    rows.sort((x,y)->Long.compare(x[0],y[0]));
    for (long[] r : rows) println("  @0x"+Long.toHexString(r[0])+" size="+r[1]);
  }
}
