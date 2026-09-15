import { useEffect, useState } from "react";
import {
  FileInfo,
  homeBrowse,
  homeNewDocument,
  homeOpen,
  homeRecents,
  homeRemoveRecent,
  homeStats,
  homeStarred,
  homeToggleStar,
} from "../lib/tauri";
import { Lang } from "../App";

interface Props {
  openPath: (path: string, name: string) => void;
  lang: Lang;
}

const RECENTS_TITLES: Record<Lang, string> = {
  ko: "최근 문서", en: "Recents", ja: "最近", zh: "最近文档", fr: "Récents",
  de: "Kürzlich", es: "Recientes", th: "ล่าสุด", id: "Baru-baru", ru: "Недавно",
  ar: "الأخيرة", pt: "Recentes", it: "Recenti", pl: "Ostatnie", nl: "Recent",
  ms: "Terbaru", he: "אחרונים", hi: "हालिया", "zh-TW": "最近",
};
const STARRED_TITLES: Record<Lang, string> = {
  ko: "좋아낸 문서", en: "Starred", ja: "スター", zh: "收藏", fr: "Favoris",
  de: "Markiert", es: "Marcados", th: "รักพ스", id: "Favorit", ru: "Избранное",
  ar: "المفضلة", pt: "Favoritos", it: "Preferiti", pl: "Wyróżnione", nl: "Vergrendeld",
  ms: "Kegemaran", he: "מועדפים", hi: "पसंदीदा", "zh-TW": "最愛",
};

function fmtBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

export default function HomeView({ openPath, lang }: Props) {
  const [recents, setRecents] = useState<FileInfo[]>([]);
  const [starred, setStarred] = useState<FileInfo[]>([]);
  const [stats, setStats] = useState({ totalFiles: 0, starredFiles: 0, projects: 0 });
  const [loading, setLoading] = useState(true);

  const refresh = () => {
    setLoading(true);
    Promise.all([homeRecents(), homeStarred(), homeStats()]).then(
      (r) => {
        setRecents(r[0]);
        setStarred(r[1]);
        setStats(r[2]);
        setLoading(false);
      },
    );
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleOpen = (path: string) => {
    homeOpen(path);
    openPath(path, path.split("/").pop() ?? path);
  };

  const handleNew = (kind: FileInfo["kind"]) => {
    homeNewDocument(kind).then((p) => handleOpen(p));
  };

  return (
    <div className="home">
      <div className="home-top">
        <h1>{RECENTS_TITLES[lang]}</h1>
        <div className="stats">
          {stats.totalFiles} {lang === "ko" ? "개 문서" : "files"} · {stats.starredFiles}★ · {stats.projects} {lang === "ko" ? "프로젝트" : "projects"}
        </div>
        <div className="quick-actions">
          <button onClick={() => handleNew("pdf")}>PDF</button>
          <button onClick={() => handleNew("markdown")}>Markdown</button>
          <button onClick={() => handleNew("doc")}>Docs</button>
          <button onClick={() => handleNew("sheet")}>Sheets</button>
          <button onClick={() => handleNew("slide")}>Slides</button>
          <button onClick={() => homeBrowse()}>{lang === "ko" ? "가져오기" : "Open"}</button>
        </div>
      </div>

      {loading ? (
        <div className="empty">{lang === "ko" ? "로딩 중..." : "Loading…"}</div>
      ) : (
        <div className="two-col">
          <section className="card">
            <h2>{RECENTS_TITLES[lang]}</h2>
            {recents.length === 0 ? (
              <div className="empty">{lang === "ko" ? "최근 문서가 없습니다." : "No recent files."}</div>
            ) : (
              <ul className="file-list">
                {recents.map((f) => (
                  <li key={f.path}>
                    <button className="file-open" onClick={() => handleOpen(f.path)}>
                      <span className="file-icon">{f.kind[0]?.toUpperCase()}</span>
                      <span className="file-name">{f.name}</span>
                      <span className="file-meta">{fmtBytes(f.size)}</span>
                    </button>
                    <button className="file-act" title="Toggle star" onClick={() => { homeToggleStar(f.path); refresh(); }}>
                      {f.starred ? "★" : "☆"}
                    </button>
                    <button className="file-act" title="Remove" onClick={() => { homeRemoveRecent(f.path); refresh(); }}>
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section className="card">
            <h2>{STARRED_TITLES[lang]}</h2>
            {starred.length === 0 ? (
              <div className="empty">{lang === "ko" ? "좋아낸 문서가 없습니다." : "No starred files."}</div>
            ) : (
              <ul className="file-list">
                {starred.map((f) => (
                  <li key={f.path}>
                    <button className="file-open" onClick={() => handleOpen(f.path)}>
                      <span className="file-icon">{f.kind[0]?.toUpperCase()}</span>
                      <span className="file-name">{f.name}</span>
                      <span className="file-meta">{fmtBytes(f.size)}</span>
                    </button>
                    <button className="file-act" title="Unstar" onClick={() => { homeToggleStar(f.path); refresh(); }}>
                      ★
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
