import { useEffect, useState } from "react";

interface Props {
  path: string;
}

// Embeds the PDF via the system webview's native PDF support (Tauri WebKit/
// WebView2 renderers both support <embed>/<iframe> PDF). Mirrors BatiOffice's
// pdf view without depending on the cloud renderer.
export default function PDFViewer({ path }: Props) {
  const [blobUrl, setBlobUrl] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch(path)
      .then((r) => r.blob())
      .then((blob) => {
        if (cancelled) return;
        setBlobUrl(URL.createObjectURL(blob));
      });
    return () => {
      cancelled = true;
    };
  }, [path]);

  if (!blobUrl) {
    return <div className="viewer-empty">Loading PDF…</div>;
  }

  return (
    <div className="pdf-viewer">
      <embed src={blobUrl} type="application/pdf" width="100%" height="100%" />
    </div>
  );
}
