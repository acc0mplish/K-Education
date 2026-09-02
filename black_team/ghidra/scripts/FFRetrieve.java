// reflection으로 switch decompiler가 저장한 HIGH function 읽기.
// getProgram() -> getHighFunction(addr) -> decompile(60,monitor) -> getC()
// compile classpath 해석 문제 없이 runtime에서 동적 호출 (모두 존재).
import ghidra.app.script.GhidraScript;
import ghidra.program.model.listing.Function;
import ghidra.program.model.listing.FunctionIterator;
import ghidra.program.model.address.Address;
import ghidra.util.task.TaskMonitorAdapter;

import java.lang.reflect.Method;

public class FFRetrieve extends GhidraScript {
    public void run() throws Exception {
        Object mon = new TaskMonitorAdapter();
        int stored = 0, decompiled = 0, n = 0;
        StringBuilder sb = new StringBuilder();
        Method getProgram = Class.forName("ghidra.program.model.listing.Program").getDeclaredMethod("getProgram");
        Method getHigh = Class.forName("ghidra.program.database.AnalysisDatabase").getMethod("getHighFunction", Address.class);
        Method decompile = Class.forName("ghidra.program.model.pcode.HighFunction").getMethod("decompile", Long.TYPE, Class.forName("ghidra.util.task.TaskMonitor"));
        Method getCFn = Class.forName("ghidra.app.decompiler.DecompiledFunction").getMethod("getC");
        Method getDecFn = Class.forName("ghidra.app.decompiler.DecompileResult").getMethod("getDecompiledFunction");
        Object adb = getProgram.invoke(currentProgram);
        FunctionIterator it = currentProgram.getListing().getFunctions(true);
        while (it.hasNext() && n < 400) {
            Function fn = it.next();
            Address entry = fn.getEntryPoint();
            n++;
            if (entry.getOffset() < 0x140400000L) continue;
            Object hf;
            try { hf = getHigh.invoke(adb, entry); }
            catch (Exception e) { hf = null; }
            if (hf == null) continue;
            stored++;
            try {
                Object dfn = getDecFn.invoke(decompile.invoke(hf, 60L, mon));
                String c = (String) getCFn.invoke(dfn);
                if (c != null && !c.trim().isEmpty()) {
                    decompiled++;
                    sb.append("// === ").append(fn.getName()).append(" ").append(String.format("0x%x", entry.getOffset())).append(" ===\n");
                    sb.append(c).append("\n");
                } else {
                    sb.append("EMPTY ").append(fn.getName()).append('\n');
                }
            } catch (Exception e) {
                sb.append("DECOMPILE_ERR ").append(fn.getName()).append(": ").append(e.toString()).append('\n');
            }
        }
        System.out.println("HIGH_STORED=" + stored + " DECOMPILED=" + decompiled + " OF " + n);
        java.io.BufferedWriter w = new java.io.BufferedWriter(new java.io.FileWriter("/tmp/ghwork/out/ffretrieve.txt"));
        w.write(sb.toString()); w.close();
    }
}
