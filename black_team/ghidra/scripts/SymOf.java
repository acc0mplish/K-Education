import ghidra.program.model.listing.*;
import ghidra.program.model.address.*;
import ghidra.program.model.symbol.SymbolTable;
import ghidra.app.script.GhidraScript;
public class SymOf extends GhidraScript {
  @Override public void run() throws Exception {
    Program p = getCurrentProgram();
    SymbolTable st = p.getSymbolTable();
    FunctionManager fm = p.getFunctionManager();
    String[] addrs = {"0x110020","0x10fce0","0x10f650","0x10ffd0","0x1103b0","0x10fc80","0x10f060","0x10f140","0x1103a0","0x110b70","0x10f3e0","0x10f9c0","0x10fd30","0x1b5a50","0x1b5b90"};
    for (String a : addrs) {
      Address addr = p.parseAddress(a)[0];
      Function f = fm.getFunctionAt(addr);
      String name = f==null?"<no func>":f.getName();
      println(a+" -> "+name);
    }
  }
}
