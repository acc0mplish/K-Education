import ghidra.app.script.GhidraScript;
import ghidra.program.model.listing.Function;
import ghidra.program.model.listing.FunctionManager;
import ghidra.program.model.listing.Program;
import ghidra.program.model.listing.Instruction;
import ghidra.program.model.symbol.RefType;
import ghidra.program.model.address.Address;
import java.util.*;

// Disassemble the SeaRPC setup function and list the functions/data it references,
// so we can see exactly what address it passes to searpc_register_function.
// Uses the operand-ref API (getReference is not on Instruction in this Ghidra build).
public class DisasmSetup extends GhidraScript {

    static final long SETUP = 0x1111c0L;

    @Override
    protected void run() throws Exception {
        Program p = getCurrentProgram();
        FunctionManager fm = p.getFunctionManager();
        Function f = fm.getFunctionAt(toAddr(SETUP));
        println("===== DISASM setup @" + toAddr(SETUP) + "  " + f.getName() + " =====");

        for (Instruction i : p.getListing().getInstructions(f.getBody(), true)) {
            String line = "@" + i.getAddress().getOffset() + ": " + i.toString();
            String pre = "";
            int maxOps = i.getPrototype().getNumOperands();
            Address callTo = null;
            for (int o = 0; o <= maxOps; o++) {
                RefType rt = i.getOperandRefType(o);
                if (rt == null) continue;
                if (rt == RefType.UNCONDITIONAL_CALL || rt == RefType.CONDITIONAL_CALL
                        || rt == RefType.COMPUTED_CALL) {
                    Object[] objs = i.getOpObjects(o);
                    if (objs != null && objs.length > 0 && objs[0] instanceof Address) {
                        callTo = (Address) objs[0];
                        break;
                    }
                }
            }
            if (callTo != null) {
                Function cf = fm.getFunctionAt(callTo);
                pre = cf != null ? "  [fn " + cf.getName() + "@" + callTo + "]" : "  [data @" + callTo + "]";
            }
            println("  " + line + pre);
        }

        println("\n----- functions the setup body CALLS -----");
        for (Instruction i : p.getListing().getInstructions(f.getBody(), true)) {
            int maxOps = i.getPrototype().getNumOperands();
            for (int o = 0; o <= maxOps; o++) {
                RefType rt = i.getOperandRefType(o);
                if (rt == null) continue;
                if (rt == RefType.UNCONDITIONAL_CALL || rt == RefType.CONDITIONAL_CALL
                        || rt == RefType.COMPUTED_CALL) {
                    Object[] objs = i.getOpObjects(o);
                    if (objs != null && objs.length > 0 && objs[0] instanceof Address) {
                        Address to = (Address) objs[0];
                        Function cf = fm.getFunctionAt(to);
                        if (cf != null) println("  CALL " + cf.getName() + " @" + to);
                        else println("  CALL <data> @" + to);
                        break;
                    }
                }
            }
        }
        println("\nDONE");
    }
}
