import { useEffect, useState } from "react";

interface Props {
  path: string;
}

// Minimal dependency-free Markdown renderer. BatiOffice used a web office /
// HTRichText core; we render the common subset (headings, bold, italic, lists,
// code, links) so local Markdown files open and read correctly.

function render(md: string): string {
  let html = md;
  const lines = html.split("\n");
  const out: string[] = [];
  for (const line of lines) {
    if (!line.trim()) {
      out.push("");
      continue;
    }
    if (/^#{1,6} /.test(line)) {
      const level = line.match(/^(#{1,6})/)?.[1].length ?? 1;
      const text = line.replace(/^#{1,6} /, "");
      out.push(`<h${level}>${inline(text)}</h${level}>`);
      continue;
    }
    if (/^(-|\*) /.test(line)) {
      out.push(`<ul>${line.split("\n").map((l) => `<li>${inline(l.replace(/^[-*] /, ""))}</li>`).join("")}</ul>`);
      continue;
    }
    if (/^\d+\. /.test(line)) {
      out.push(`<ol>${line.split("\n").map((l) => `<li>${inline(l.replace(/^\d+\./, ""))}</li>`).join("")}</ol>`);
      continue;
    }
    out.push(`<p>${inline(line)}</p>`);
  }
  return out.join("");
}

function inline(text: string): string {
  let s = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return s;
}

export default function MarkdownViewer({ path }: Props) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch(path)
      .then((r) => r.text())
      .then((text) => {
        if (cancelled) return;
        setContent(render(text));
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [path]);

  if (loading) {
    return <div className="viewer-empty">Loading Markdown…</div>;
  }

  return (
    <div className="markdown-viewer" dangerouslySetInnerHTML={{ __html: content }} />
  );
}
