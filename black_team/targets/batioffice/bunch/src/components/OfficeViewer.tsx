import { useCallback } from "react";
import { openModule, type ModuleName } from "../lib/moduleWindow";

interface Props {
  path: string;
  name: string;
}

// Maps a file extension to the office module that renders it (BatiOffice parity).
function moduleFor(path: string): ModuleName {
  const ext = path.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "doc":
    case "docx":
      return "docs";
    case "xls":
    case "xlsx":
      return "sheets";
    case "ppt":
    case "pptx":
      return "slides";
    case "hwp":
    case "hpx":
      return "hwp";
    default:
      return "docs";
  }
}

// Renders Office docs via a bundled web-office component. The Bati-specific
// cloud layer is cut; the engine runs locally in a dedicated webview window.
export default function OfficeViewer({ path }: Props) {
  const open = useCallback(() => {
    void openModule(moduleFor(path), path);
  }, [path]);

  return (
    <div className="office-viewer">
      <div className="office-card">
        <button onClick={open} className="office-open">
          Office 문서 열기
        </button>
      </div>
    </div>
  );
}
