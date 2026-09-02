import ghidra.app.script.GhidraScript;
import ghidra.program.model.listing.Function;
import ghidra.program.model.listing.FunctionManager;
import ghidra.program.model.listing.Program;
import ghidra.program.model.symbol.Reference;
import ghidra.program.model.symbol.RefType;
import ghidra.program.model.symbol.ReferenceManager;
import ghidra.program.model.address.Address;
import java.util.*;

// Focus on the SeaRPC service-setup function FUN_001111c0:
//   - who calls it (its parents)
//   - which coordinator addresses it hands to searpc_server_register_function
public class SeaRPCSetupProbe extends GhidraScript {

    static final long SETUP = 0x1111c0L;   // holds FUN_0018fc30's address + sets up SeaRPC
    static final long AESCOORD = 0x19d140L; // aes+uuid coordinator (9 direct callers)

    @Override
    protected void run() throws Exception {
        Program p = getCurrentProgram();
        FunctionManager fm = p.getFunctionManager();
        ReferenceManager rm = p.getReferenceManager();
        Address setup = toAddr(SETUP);
        Function f = fm.getFunctionAt(setup);
        String name = f != null ? f.getName() : "<anon>";
        println("===== SeaRPC setup function @" + setup + "  " + name + " =====");

        // parents of the setup function
        List<Address> parents = new ArrayList<>();
        for (Reference r : rm.getReferencesTo(setup)) {
            if (r.getReferenceType() == RefType.UNCONDITIONAL_CALL) {
                Address from = r.getFromAddress();
                Function cf = fm.getFunctionContaining(from);
                parents.add(from);
                println("  <- called by  " + (cf != null ? cf.getName() : "<anon>") + "  @" + from);
            }
        }
        println("  total callers of setup: " + parents.size());

        // what does the setup function pass as a function-pointer argument?
        // (scan for the coordinator entrypoints being referenced as data within setup)
        long[] coords = { 0x18fc30L, 0x19d140L };
        for (long ca : coords) {
            Address cc = toAddr(ca);
            boolean ref = false;
            for (Reference r : rm.getReferencesTo(cc)) {
                if (f != null && f.getBody().contains(r.getFromAddress())) {
                    ref = true;
                    println("  [" + cc + " " + fm.getFunctionAt(cc) + "] referenced inside setup @" + r.getFromAddress());
                }
            }
            if (!ref) println("  [" + cc + "] NOT referenced inside setup");
        }
        println("DONE");
    }
}
