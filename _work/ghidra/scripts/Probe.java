import ghidra.app.script.GhidraScript;
import ghidra.program.model.listing.Program;
import ghidra.program.model.listing.Function;
import ghidra.program.model.listing.FunctionIterator;
import ghidra.program.model.address.Address;
import ghidra.util.task.TaskMonitor;

public class Probe extends GhidraScript {
    String hex(Address a) { return String.format("0x%x", a.getOffset()); }
    public void run() throws Exception {
        Program p = getCurrentProgram();
        java.util.Set<Long> roots = new java.util.TreeSet<>(java.util.Arrays.asList(0x18fc30L,0x19d140L));
        java.util.Set<Long> all = new java.util.TreeSet<>(roots);
        java.util.Map<Long,java.util.Set<Long>> callers = new java.util.TreeMap<>();
        java.util.Queue<Long> q = new java.util.LinkedList<>(roots);
        java.util.Set<Long> visited = new java.util.TreeSet<>();
        while (!q.isEmpty()) {
            long node = q.poll();
            if (!visited.add(node)) continue;
            Function target = p.getFunctionManager().getFunctionAt(p.getAddress(node));
            if (target==null) continue;
            java.util.Set<Long> found = new java.util.TreeSet<>();
            FunctionIterator it = p.getFunctionManager().getFunctions(true);
            while (it.hasNext()) {
                Function c = it.next();
                for (Function cf : c.getCallingFunctions(TaskMonitor.DUMMY)) {
                    if (cf!=null && cf.getEntryPoint().getOffset()==node) { found.add(c.getEntryPoint().getOffset()); break; }
                }
            }
            callers.put(node, found);
            for (long cc : found) { if (!all.contains(cc)) { all.add(cc); q.add(cc); } }
        }
        java.util.StringJoiner out = new java.util.StringJoiner("\n");
        out.add("=== CALL CHAIN UPWARD from license coordinators ===");
        java.util.List<Long> nodes = new java.util.ArrayList<>(all);
        java.util.Collections.sort(nodes, (a,b)->b-a);
        for (long n : nodes) out.add(hex(p.getAddress(n))+"  callers="+callers.getOrDefault(n,new java.util.TreeSet<>()).stream().map(x->hex(x)).reduce(java.util.StringJoiner,",","").toString());
        out.add("=== done ===");
        System.out.println("=== PROBE OK chain ===");
        System.out.println(out.toString());
    }
}
