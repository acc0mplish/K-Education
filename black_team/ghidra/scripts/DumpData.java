import ghidra.program.model.listing.*;
import ghidra.program.model.mem.*;
import ghidra.program.model.address.*;
import ghidra.app.script.GhidraScript;
public class DumpData extends GhidraScript {
  @Override public void run() throws Exception {
    Program p = getCurrentProgram();
    Memory mem = p.getMemory();
    Address a = p.parseAddress("0x2c6380")[0];
    int take = 0x280;
    StringBuilder asc = new StringBuilder();
    StringBuilder hex = new StringBuilder();
    for (int i=0;i<take;i++){
      byte b = mem.getByte(a.add(i));
      hex.append(String.format("%02x ", b&0xff));
      asc.append((b>=32 && b<127)?(char)b:'.');
      if((i&0xf)==0xf){ hex.append("\n"); asc.append("\n"); }
    }
    println("START=0x2c6000");
    println(hex.toString());
  }
}
