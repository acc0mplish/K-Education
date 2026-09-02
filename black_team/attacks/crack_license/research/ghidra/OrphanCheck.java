import ghidra.app.script.GhidraScript;
import ghidra.program.model.listing.Function;
import ghidra.program.model.listing.FunctionManager;
import ghidra.program.model.listing.Program;
import ghidra.program.model.symbol.Reference;
import ghidra.program.model.symbol.RefType;
import ghidra.program.model.symbol.ReferenceManager;
import ghidra.program.model.address.Address;
import java.util.*;

// Confirm: (a) the "orphan" AES wrappers have zero references of ANY type (true entry
// points invoked indirectly), and (b) who COMPUTED-calls them / the parented wrappers,
// to find the shared dispatcher.
public class OrphanCheck extends GhidraScript {
    static final long AESCOORD = 0x19d140L;

    @Override protected void run() throws Exception {
        Program p = getCurrentProgram();
        FunctionManager fm = p.getFunctionManager();
        ReferenceManager rm = p.getReferenceManager();

        List<Address> wrappers = new ArrayList<>();
        for (Reference r : rm.getReferencesTo(toAddr(AESCOORD))) {
            if (r.getReferenceType() == RefType.UNCONDITIONAL_CALL) {
                Address from = r.getFromAddress();
                Function cf = fm.getFunctionContaining(from);
                if (cf != null && !cf.getEntryPoint().equals(toAddr(AESCOORD))) wrappers.add(cf.getEntryPoint());
            }
        }
        Collections.sort(wrappers);

        println("ref-type profile for each AESCOORD wrapper (0 incoming refs = entry point invoked indirectly):");
        for (Address w : wrappers) {
            Function wf = fm.getFunctionAt(w);
            Map<RefType,Integer> byType = new HashMap<>();
            for (Reference r : rm.getReferencesTo(w)) byType.merge(r.getReferenceType(), 1, Integer::sum);
            println("  " + (wf!=null?wf.getName():"<anon>") + " @" + w + "  -> " + byType);
        }

        // who computes-call each wrapper (indirect callers)
        println("\n--- computed (indirect) CALLers of the wrappers ---");
        for (Address w : wrappers) {
            List<Address> cc = new ArrayList<>();
            for (Reference r : rm.getReferencesTo(w)) {
                if (r.getReferenceType() == RefType.COMPUTED_CALL) {
                    Function cf = fm.getFunctionContaining(r.getFromAddress());
                    if (cf != null && !cf.getEntryPoint().equals(w)) cc.add(cf.getEntryPoint());
                }
            }
            if (!cc.isEmpty()) {
                Collections.sort(cc);
                String nm = fm.getFunctionAt(w)!=null?fm.getFunctionAt(w).getName():w.toString();
                println("  " + nm + " @" + w + " computed by " + cc.size() + ":");
                for (Address pa : cc) println("      ^ " + (fm.getFunctionAt(pa)!=null?fm.getFunctionAt(pa).getName():pa) + " @" + pa);
            }
        }
        println("\nDONE");
    }
}
