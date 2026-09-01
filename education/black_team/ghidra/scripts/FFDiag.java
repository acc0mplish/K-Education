// diagnostic: decompile ONE non-FUN_ function, dump why getC() is empty.
import ghidra.app.script.GhidraScript;
import ghidra.app.decompiler.DecompInterface;
import ghidra.app.decompiler.DecompileResults;
import ghidra.app.decompiler.DecompiledFunction;
import ghidra.program.model.listing.Function;
import ghidra.program.model.listing.FunctionIterator;
import ghidra.util.task.TaskMonitorAdapter;
public class FFDiag extends GhidraScript {
  public void run() {
    FunctionIterator it = currentProgram.getListing().getFunctions(true);
    Function target=null;
    while (it.hasNext()) { Function f=it.next(); String n=f.getName();
      if (n!=null && !n.startsWith("FUN_")) { target=f; break; } }
    if (target==null){ System.out.println("NO_TARGET"); return; }
    System.out.println("TARGET="+target.getName()+" 0x"+Long.toHexString(target.getEntryPoint().getOffset()));
    DecompInterface di=new DecompInterface();
    di.setSimplificationStyle("normal");
    di.openProgram(currentProgram);
    String res="";
    for(int i=0;i<3;i++){
      DecompileResults r=null;
      try { r=di.decompileFunction(target,60,new TaskMonitorAdapter()); }
      catch(Exception e){ System.out.println("THREW: "+e); break; }
      if(r==null){ System.out.println("i="+i+" result=null"); continue; }
      System.out.println("i="+i+" isValid="+r.isValid()+" decompCompleted="+r.decompileCompleted()+" errMsg=['"+(r.getErrorMessage()==null?"":r.getErrorMessage())+"']");
      DecompiledFunction df=null;
      try{df=r.getDecompiledFunction();}catch(Exception e){System.out.println("getDecompiledFunction THREW: "+e);}
      System.out.println("  df==null? "+(df==null));
      if(df!=null){ String c=df.getC(); System.out.println("  getC()==null? "+(c==null)+" len="+(c==null?0:c.length())); if(c!=null && c.length()<400) System.out.println("  C=["+c+"]"); }
      res = (df!=null && df.getC()!=null && df.getC().length()>0)?"OK":"EMPTY";
      if(res.equals("OK")) break;
    }
    di.closeProgram();
    System.out.println("RESULT="+res);
  }
}
