import ghidra.app.script.GhidraScript;
import ghidra.program.model.listing.Function;
import ghidra.program.model.listing.FunctionIterator;

public class FFList extends GhidraScript {
    public void run() throws Exception {
        StringBuilder sb = new StringBuilder("# name\taddr\n");
        FunctionIterator it = currentProgram.getListing().getFunctions(true);
        int n = 0;
        while (it.hasNext() && n < 30) {
            Function fn = it.next();
            long off = fn.getEntryPoint().getOffset();
            if (off >= 0x140400000L && fn.getName().startsWith("_Z")) {
                sb.append(fn.getName()).append("\t").append(String.format("0x%x", off)).append("\n");
                n++;
            }
        }
        java.io.BufferedWriter fw = new java.io.BufferedWriter(new java.io.FileWriter("/tmp/ghwork/out/symbols.txt"));
        fw.write(sb.toString()); fw.close();
        System.out.println("LISTED=" + n);
    }
}
