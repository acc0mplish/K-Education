import ghidra.app.script.GhidraScript;
import ghidra.program.model.listing.Function;
import ghidra.program.model.listing.FunctionManager;
import ghidra.program.model.listing.Program;
import ghidra.program.model.symbol.Reference;
import ghidra.program.model.symbol.RefType;
import ghidra.program.model.symbol.ReferenceManager;
import ghidra.program.model.address.Address;
import java.util.*;

// 1) Who holds the setup function's address (indirect callers / indirect invokers).
// 2) Characterize the 9 direct callers of the AES coordinator: names + whether they share a parent.
public class WhoCallsSetup extends GhidraScript {

    static final long SETUP = 0x1111c0L;
    static final long AESCOORD = 0x19d140L;

    @Override
    protected void run() throws Exception {
        Program p = getCurrentProgram();
        FunctionManager fm = p.getFunctionManager();
        ReferenceManager rm = p.getReferenceManager();

        // ---- 1) indirect callers of setup (DATA / INDIRECTION refs) ----
        println("===== indirect refs TO setup @001111c0 (who takes its address) =====");
        for (Reference r : rm.getReferencesTo(toAddr(SETUP))) {
            if (r.getReferenceType() == RefType.DATA || r.getReferenceType() == RefType.INDIRECTION) {
                Address from = r.getFromAddress();
                Function cf = fm.getFunctionContaining(from);
                String cname = cf != null ? cf.getName() : "<anon>";
                // find the enclosing context: is the from-address inside a larger function?
                println("  " + r.getReferenceType() + "  @" + from + "  (in " + cname + ")");
            }
        }

        // ---- 2) the 9 direct callers of the AES coordinator ----
        println("\n===== the 9 direct CALLers of AES coordinator @0019d140 =====");
        Set<Address> direct = new TreeSet<>();
        for (Reference r : rm.getReferencesTo(toAddr(AESCOORD))) {
            RefType rt = r.getReferenceType();
            if (rt == RefType.UNCONDITIONAL_CALL || rt == RefType.CONDITIONAL_CALL || rt == RefType.COMPUTED_CALL) {
                Address from = r.getFromAddress();
                Function cf = fm.getFunctionContaining(from);
                if (cf != null && !cf.getEntryPoint().equals(toAddr(AESCOORD))) direct.add(cf.getEntryPoint());
            }
        }
        for (Address ca : direct) {
            Function cf = fm.getFunctionContaining(ca);
            String cn = cf != null ? cf.getName() : "<anon>";
            // one level up
            Set<Address> parents = new TreeSet<>();
            for (Reference r : rm.getReferencesTo(ca)) {
                if (isCall(r)) {
                    Address fr = r.getFromAddress();
                    Function pf = fm.getFunctionContaining(fr);
                    if (pf != null && !pf.getEntryPoint().equals(ca)) parents.add(pf.getEntryPoint());
                }
            }
            println("  " + cn + " @" + ca + "  <- called by " + parents.size() + " fn(s):");
            for (Address pa : parents) {
                Function pf = fm.getFunctionContaining(pa);
                println("       ^ " + (pf != null ? pf.getName() : "<anon>") + " @" + pa);
            }
        }
        println("\nDONE");
    }

    static boolean isCall(Reference r) {
        RefType rt = r.getReferenceType();
        return rt == RefType.UNCONDITIONAL_CALL || rt == RefType.CONDITIONAL_CALL || rt == RefType.COMPUTED_CALL;
    }
}
