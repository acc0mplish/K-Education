import ghidra.app.script.GhidraScript;
import ghidra.program.model.listing.Function;
import ghidra.program.model.listing.FunctionManager;
import ghidra.program.model.listing.Program;
import ghidra.program.model.symbol.Reference;
import ghidra.program.model.symbol.RefType;
import ghidra.program.model.symbol.ReferenceManager;
import ghidra.program.model.address.Address;
import java.util.*;

// Combined upward trace for the SeaRPC setup + coordinators.
public class FullTraceProbe extends GhidraScript {

    // Addresses of interest
    static final long SETUP = 0x1111c0L;     // SeaRPC setup: hands coordinator addrs to searpc_register
    static final long AESCOORD = 0x19d140L;   // aes+uuid coordinator (claimed 9 callers)
    static final long B64COORD = 0x18fc30L;   // base64+uuid coordinator

    @Override
    protected void run() throws Exception {
        Program p = getCurrentProgram();
        FunctionManager fm = p.getFunctionManager();
        ReferenceManager rm = p.getReferenceManager();

        // 1) Who references the SETUP function, by reference TYPE
        println("===== ALL refs TO setup @001111c0, by type =====");
        java.util.Map<RefType,Integer> byType = new HashMap<>();
        List<Reference> toSetup = new ArrayList<>();
        for (Reference r : rm.getReferencesTo(toAddr(SETUP))) {
            toSetup.add(r);
            byType.merge(r.getReferenceType(), 1, Integer::sum);
        }
        for (var e : byType.entrySet()) println("  " + e.getKey() + ": " + e.getValue());
        // show call-ish callers
        println("  --- callers (any call type) ---");
        for (Reference r : toSetup) {
            if (isCall(r)) {
                Address from = r.getFromAddress();
                Function cf = fm.getFunctionContaining(from);
                println("    <- " + r.getReferenceType() + "  " + (cf!=null?cf.getName():"<anon>") + " @" + from);
            }
        }

        // 2) Walk upward from a given coordinator through ALL call types
        Object[][] tt = { {SETUP,(Object)"SETUP"}, {AESCOORD,(Object)"AESCOORD"}, {B64COORD,(Object)"B64COORD"} };
        for (Object[] tgt : tt) {
            Address a = toAddr((long) tgt[0]);
            String label = (String) tgt[1];
            Function f = fm.getFunctionAt(a);
            println("\n===== UPWARD TRACE from " + label + " @" + a + "  " + (f!=null?f.getName():"<no fn>") + " =====");
            Set<Address> direct = callersOf(fm, a, true); // any call ref
            println("  direct callers (" + direct.size() + "):");
            for (Address ca : direct) {
                Function cf = fm.getFunctionContaining(ca);
                println("    " + (cf!=null?cf.getName():"<anon>") + " @" + ca);
            }
            // one level up
            println("  callers-of-the-direct-callers:");
            Set<Address> seen = new TreeSet<>();
            for (Address ca : direct) {
                for (Address up : callersOf(fm, ca, true)) {
                    if (seen.add(up)) {
                        Function uf = fm.getFunctionContaining(up);
                        println("    ^ " + (uf!=null?uf.getName():"<anon>") + " @" + up);
                    }
                }
            }
        }
        println("\nDONE");
    }

    // unconditional/conditional/computed callers of funcEntry
    static Set<Address> callersOf(FunctionManager fm, Address funcEntry, boolean anyCall) {
        Set<Address> result = new TreeSet<>();
        ReferenceManager rm = fm.getProgram().getReferenceManager();
        for (Reference r : rm.getReferencesTo(funcEntry)) {
            if (!isCall(r)) continue;
            Address from = r.getFromAddress();
            if (from.equals(funcEntry)) continue;
            Function cf = fm.getFunctionContaining(from);
            result.add(cf != null ? cf.getEntryPoint() : from);
        }
        return result;
    }

    static boolean isCall(Reference r) {
        RefType rt = r.getReferenceType();
        return rt == RefType.UNCONDITIONAL_CALL || rt == RefType.CONDITIONAL_CALL
            || rt == RefType.COMPUTED_CALL;
    }
}
