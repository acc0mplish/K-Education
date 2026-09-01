// ParallelDecompiler + DecompilerCallback로 switch decompiler 결과 우회.
// AnalysisDatabase(저장소)가 없는 public build에서도, DecompInterface로 직접 decompile -> getC().
// R=String(C text). process(DecompileResults)에서 r.getFunction()으로 function을 직접 캡처
// -> 병렬 반환 순서(order)와 무관하게 올바른 함수 매핑 보장.
//
// 분석 시 switch decompiler가 떠 있어야 AnalysisDatabase(configurer)가 유효함.
//   analyzeHeadless -import (기본 분석) 로 실행.
//   분석이 안 되면 AnalysisDatabase unavailable -> NoSuchMethod/ClassNotFoundException.
import ghidra.app.script.GhidraScript;
import ghidra.app.decompiler.parallel.ParallelDecompiler;
import ghidra.app.decompiler.parallel.DecompilerCallback;
import ghidra.app.decompiler.DecompileResults;
import ghidra.app.decompiler.DecompiledFunction;
import ghidra.app.plugin.core.analysis.SwitchAnalysisDecompileConfigurer;
import ghidra.program.model.listing.Function;
import ghidra.program.model.listing.FunctionIterator;
import ghidra.program.model.address.Address;
import ghidra.util.task.TaskMonitor;
import ghidra.util.task.TaskMonitorAdapter;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class FFParallel extends GhidraScript {
    // function(addr) -> C text. parallel ordering과 무관.
    private static final Map<Address, String> CAPTURE = new ConcurrentHashMap<>();

    public void run() throws Exception {
        TaskMonitor mon = new TaskMonitorAdapter();

        // Rust mangled (_Z) 함수 전 수집. (Rust 코드는 0x1400xxxxx~0x1403xxxxx 전체에 분포 —
        // 낮은 주소 밴드도 반드시 포함. "_Z" 접두사가 Rust 식별 기준.)
        FunctionIterator it = currentProgram.getListing().getFunctions(true);
        List<Function> fns = new java.util.ArrayList<>();
        while (it.hasNext()) {
            Function f = it.next();
            if (f.getEntryPoint() == null) continue;
            String n = f.getName();
            // stripped binary: "_Z" Rust 심볼 없음.FUN_ 등 이름 있는 함수는 전부 Rust 코드 섹션.
            if (n == null || n.isEmpty() || n.startsWith("FUN_")) continue;
            fns.add(f);
            if (fns.size() >= 250) break; // bounded sample
        }
        System.out.println("RUST_FUNCS=" + fns.size());
        if (fns.isEmpty()) { System.out.println("RUST_FUNCS=0 NONE"); return; }

        // switch decompiler configurer. 분석 중이 아닐 AnalysisDatabase unavailable.
        SwitchAnalysisDecompileConfigurer cfg = new SwitchAnalysisDecompileConfigurer(currentProgram);
        DecompilerCallback<String> cb = new DecompilerCallback<String>(currentProgram, cfg) {
            @Override
            public String process(DecompileResults r, TaskMonitor m) {
                Function f = r.getFunction();
                DecompiledFunction df = r.getDecompiledFunction();
                String c = (df != null && df.getC() != null) ? df.getC() : "";
                if (f != null && !c.trim().isEmpty()) {
                    CAPTURE.put(f.getEntryPoint(), c);
                }
                return c;
            }
        };
        cb.setTimeout(30);

        System.out.println("DECOMPILING_PARALLEL...");
        List<String> results = ParallelDecompiler.decompileFunctions(cb, fns, mon);
        cb.dispose();

        System.out.println("DECOMPILED_PARALLEL=" + CAPTURE.size() + " of " + fns.size());
        java.io.BufferedWriter w = new java.io.BufferedWriter(new java.io.FileWriter("/tmp/ghwork/out/ffparallel.txt"));
        w.write("# ParallelDecompiler + DecompilerCallback (DecompInterface getC)\n");
        w.write("# AnalysisDatabase 우회 — switch decompiler가 떠 있는 분석에서 실행\n");
        w.write("decompiled=" + CAPTURE.size() + " of " + fns.size() + "\n");
        for (Map.Entry<Address, String> e : CAPTURE.entrySet()) {
            long off = e.getKey().getOffset();
            w.write("\n// === 0x" + Long.toHexString(off) + " ===\n");
            w.write(e.getValue());
            w.write("\n// ----------------------------\n");
        }
        w.close();
        System.out.println("OUTPUT=/tmp/ghwork/out/ffparallel.txt");
    }
}
