import ghidra.app.script.GhidraScript;
import ghidra.program.model.listing.Function;
import ghidra.program.model.listing.FunctionManager;
import ghidra.program.model.listing.Program;
import ghidra.program.model.mem.MemoryAccessException;
import ghidra.program.model.symbol.Reference;
import ghidra.program.model.symbol.RefType;
import ghidra.program.model.symbol.ReferenceManager;
import ghidra.program.model.address.Address;
import ghidra.program.model.data.DataType;
import java.util.*;

// (1) Multi-level upward walk from the shared dispatcher 0x131830 — find convergence.
// (2) The jump table / function-pointer table that holds the 6 indirect wrappers'
//     addresses (their dispatch target).
public class TraceUp2 extends GhidraScript {
    static final Object[][] TARGETS = { {0x131830L, (Object)"shared-dispatcher-2wrappers"} };

    static Set<Address> callers(Program p, FunctionManager fm, ReferenceManager rm, Address target) {
        Set<Address> out = new TreeSet<>();
        for (Reference r : rm.getReferencesTo(target)) {
            RefType rt = r.getReferenceType();
            if (rt == RefType.UNCONDITIONAL_CALL || rt == RefType.CONDITIONAL_CALL) {
                Address from = r.getFromAddress();
                Function cf = fm.getFunctionContaining(from);
                if (cf != null && !cf.getEntryPoint().equals(target)) out.add(cf.getEntryPoint());
            }
        }
        return out;
    }

    @Override protected void run() throws Exception {
        Program p = getCurrentProgram();
        FunctionManager fm = p.getFunctionManager();
        ReferenceManager rm = p.getReferenceManager();

        for (Object[] t : TARGETS) {
            Address disc = toAddr((long) t[0]);
            println("===== WALK UP from " + t[1] + " @" + disc + " =====");
            Set<Address> frontier = new TreeSet<>(Collections.singletonList(disc));
            Set<Address> visited = new HashSet<>();
            visited.add(disc);
            for (int lvl = 0; lvl <= 4; lvl++) {
                Set<Address> next = new TreeSet<>();
                for (Address a : frontier) {
                    for (Address c : callers(p, fm, rm, a))
                        if (visited.add(c)) next.add(c);
                }
                if (next.isEmpty()) { println("  L" + lvl + " (root) frontier empty; done"); break; }
                println("  L" + lvl + " frontier (" + next.size() + "):");
                for (Address c : next) {
                    Function f = fm.getFunctionAt(c);
                    String nm = f!=null?f.getName():c.toString();
                    boolean leaf = callers(p,fm,rm,c).isEmpty();
                    println("      " + nm + " @" + c + (leaf ? "  <-- LEAF (no callers)" : ""));
                }
                frontier = next;
            }
        }

        // find jump tables: data references TO the indirect wrappers that live in an array
        println("\n===== who holds addresses of the indirect wrappers (jump-table owners) =====");
        long[] indirect = { 0x14c2e0L,0x151b60L,0x1566a0L,0x173b60L,0x173c80L,0x173da0L };
        Map<Long,String> owner = new LinkedHashMap<>();
        for (long w : indirect) {
            Address wa = toAddr(w);
            for (Reference r : rm.getReferencesTo(wa)) {
                if (r.getReferenceType() == RefType.DATA || r.getReferenceType() == RefType.INDIRECTION) {
                    Address from = r.getFromAddress();
                    Function cf = fm.getFunctionContaining(from);
                    owner.put(wa.getOffset(), (cf!=null?cf.getName()+"/":"<anon>/") + from);
                }
            }
        }
        for (Map.Entry<Long,String> e : owner.entrySet()) {
            String val = e.getValue();
            int slash = val.indexOf('/');
            String holder = val.substring(0, slash);
            long fromAddr = Long.parseUnsignedLong(val.substring(slash+1), 16);
            Function f = fm.getFunctionAt(toAddr(fromAddr));
            println("  @" + Long.toHexString(fromAddr) + " (" + holder + ") holds @" + Long.toHexString(e.getKey()));
        }
        println("\nDONE");
    }
}
