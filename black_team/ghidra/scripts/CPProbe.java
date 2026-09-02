import ghidra.app.script.GhidraScript;
import java.io.File;
public class CPProbe extends GhidraScript {
    public void run() throws Exception {
        String cp = System.getProperty("java.class.path");
        java.io.File f = new java.io.File("/tmp/ghwork/out/cpprobe.txt");
        java.io.FileWriter w = new java.io.FileWriter(f);
        w.write("CPLEN=" + cp.length() + "\n");
        w.write("CP=" + cp + "\n");
        // which jars hold the decompiler parallel API?
        String[] targets = {
            "ghidra/app/decompiler/parallel/ParallelDecompiler.class",
            "ghidra/app/decompiler/parallel/DecompilerCallback.class",
            "ghidra/app/plugin/core/analysis/SwitchAnalysisDecompileConfigurer.class"
        };
        String[] parts = cp.split(File.pathSeparator);
        for (String p : parts) {
            File fp = new File(p);
            if (!fp.getName().endsWith(".jar")) continue;
            java.util.zip.ZipInputStream zis = null;
            try {
                java.util.zip.ZipFile zf = new java.util.zip.ZipFile(fp);
                java.util.Enumeration<?> e = zf.entries();
                while (e.hasMoreElements()) {
                    String n = ((java.util.zip.ZipEntry)e.nextElement()).getName();
                    for (String t : targets) if (n.equals(t)) { w.write("FOUND " + t + " in " + fp.getName() + "\n"); }
                }
                zf.close();
            } catch (Exception ex) { }
        }
        w.write("CPDONE\n");
        w.flush(); w.close();
    }
}
