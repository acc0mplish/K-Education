import { useMemo } from "react";
import PDFViewer from "./PDFViewer";
import MarkdownViewer from "./MarkdownViewer";
import OfficeViewer from "./OfficeViewer";

interface Props {
  path: string;
  name: string;
}

function kindOf(path: string): "pdf" | "markdown" | "office" | "unknown" {
  const ext = path.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return "pdf";
  if (ext === "md" || ext === "markdown") return "markdown";
  if (["doc", "docx", "xls", "xlsx", "ppt", "pptx", "hwp"].includes(ext ?? "")) return "office";
  return "unknown";
}

export default function Viewer({ path, name }: Props) {
  const kind = useMemo(() => kindOf(path), [path]);
  return (
    <div className="viewer" data-kind={kind}>
      {kind === "pdf" && <PDFViewer path={path} />}
      {kind === "markdown" && <MarkdownViewer path={path} />}
      {kind === "office" && (
        <OfficeViewer path={path} name={name} />
      )}
      {kind === "unknown" && (
        <div className="viewer-empty">
          <h2>{name}</h2>
          <p>{path}</p>
          <p>Unknown document kind.</p>
        </div>
      )}
    </div>
  );
}
