// Launch a fresh analysis task so the native decompiler process is alive, then run
// FFCustomAnalyzer via scheduleOneTimeAnalysis. Waits for completion, then reports.
import ghidra.app.script.GhidraScript;
import ghidra.app.plugin.core.analysis.AutoAnalysisManager;
import ghidra.util.task.TaskMonitor;
import ghidra.util.task.TaskMonitorAdapter;

public class FFRegister extends GhidraScript {
    public void run() throws Exception {
        AutoAnalysisManager mgr = AutoAnalysisManager.getAnalysisManager(currentProgram);
        TaskMonitor mon = new TaskMonitorAdapter();
        mon.setMessage("registering FastFind Parallel Decompile");
        FFCustomAnalyzer a = new FFCustomAnalyzer();
        System.out.println("SCHEDULING_ONE_TIME...");
        mgr.scheduleOneTimeAnalysis(a, null);
        mon.setMessage("startAnalysis");
        mgr.startAnalysis(mon, false);
        System.out.println("START_ANALYSIS_CALLED");
        mon.setMessage("waitForAnalysis");
        mgr.waitForAnalysis(Integer.valueOf(-1), mon);
        System.out.println("WAIT_DONE capture=" + FFCustomAnalyzer.CAPTURE.size());
        System.out.println("FF_REGISTER_DONE");
    }
}
