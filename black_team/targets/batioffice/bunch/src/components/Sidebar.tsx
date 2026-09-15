import { Lang } from "../App";

interface SidebarProps {
  view: "home" | "projects" | "settings";
  setView: (v: "home" | "projects" | "settings") => void;
  lang: Lang;
}

const NAV: Record<string, [string, string][]> = {
  ko: [["home", "홈"], ["projects", "프로젝트"], ["settings", "설정"]],
  en: [["home", "Home"], ["projects", "Projects"], ["settings", "Settings"]],
  ja: [["home", "ホーム"], ["projects", "プロジェクト"], ["settings", "設定"]],
};

export default function Sidebar({ view, setView, lang }: SidebarProps) {
  const items = NAV[lang] ?? NAV.en;
  const entries: [string, string][] = items;
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">b</span>
        <span className="brand-name">bunch</span>
      </div>
      <nav className="nav">
        {entries.map(([id, label]) => (
          <button
            key={id}
            className={`nav-item ${view === id ? "active" : ""}`}
            onClick={() => setView(id as "home" | "projects" | "settings")}
          >
            {label}
          </button>
        ))}
      </nav>
      <div className="sidebar-foot">v0.1.0 · local</div>
    </aside>
  );
}
