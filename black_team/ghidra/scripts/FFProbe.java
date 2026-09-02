import ghidra.app.script.GhidraScript;
import ghidra.util.classfinder.ClassSearcher;
import ghidra.util.classfinder.ClassFileInfo;
import ghidra.util.classfinder.ClassFilter;
import ghidra.app.services.Analyzer;
import java.util.Set;
import java.util.List;

public class FFProbe extends GhidraScript {
    public void run() throws Exception {
        // 1) Is FFCapture a registered Analyzer ExtensionPoint?
        Set<ClassFileInfo> ep = ClassSearcher.getExtensionPointInfo();
        int ffEp = 0;
        for (ClassFileInfo c : ep) {
            if (c.name().contains("FFCapture")) { ffEp++; System.out.println("FFCAPTURE_AS_EXTENSIONPOINT=" + c.name() + " @" + c.path()); }
        }
        // 2) Can ClassSearcher find FFCapture as an Analyzer instance?
        List<Analyzer> insts = ClassSearcher.getInstances(Analyzer.class, ClassFilter.ALL_CLASSES);
        int ffInst = 0, cap = 0;
        for (Analyzer a : insts) {
            if (a.getClass().getName().contains("FFCapture")) { ffInst++; System.out.println("FFCAPTURE_INSTANTIABLE_AS_ANALYZER"); }
            try {
                if (a.canAnalyze(currentProgram) && a.getDefaultEnablement(currentProgram)) cap++;
            } catch (Throwable ignore) {}
        }
        System.out.println("TOTAL_EXTENSIONPOINTS=" + ep.size());
        System.out.println("TOTAL_ANALYZER_INSTANCES=" + insts.size());
        System.out.println("FFCAPTURE_AS_EXTENSIONPOINT=" + ffEp);
        System.out.println("FFCAPTURE_INSTANTIABLE=" + ffInst);
        System.out.println("ENABLED_DURING_IMPORT=" + cap);
        System.out.println("FFPROBE_DONE");
    }
}
