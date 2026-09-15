import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getDefaultSaveDir,
  getLanguage,
  getTheme,
  homeBrowse,
  projectDelete,
  projectFiles,
  projectList,
  projectRename,
  projectTimeline,
  setLanguage,
  setTheme,
} from "./lib/tauri";
import Sidebar from "./components/Sidebar";
import HomeView from "./components/HomeView";
import ProjectsView from "./components/ProjectsView";
import SettingsView from "./components/SettingsView";
import TabsBar from "./components/TabsBar";
import Viewer from "./components/Viewer";

export type ThemeMode = "system" | "light" | "dark";
export type Lang = "ko" | "en" | "ja" | "zh" | "fr" | "de" | "es" | "th" | "id" | "ru" | "ar" | "pt" | "it" | "pl" | "nl" | "ms" | "he" | "hi" | "zh-TW";

export interface Tab {
  id: string;
  path: string;
  name: string;
}

function resolveTheme(mode: ThemeMode): "light" | "dark" {
  if (mode === "system") {
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  }
  return mode;
}

export default function App() {
  const [theme, setThemeMode] = useState<ThemeMode>("system");
  const [lang, setLangState] = useState<Lang>("ko");
  const [defaultDir, setDefaultDir] = useState("");

  const [view, setView] = useState<"home" | "projects" | "settings">("home");
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);

  // Apply theme to <html> and persist.
  useEffect(() => {
    const resolved = resolveTheme(theme);
    document.documentElement.dataset.theme = resolved;
  }, [theme]);

  useEffect(() => {
    // Load persisted settings from the backend (faithful to BatiOffice defaults).
    getTheme().then((v) => setThemeMode(v)).catch(() => {});
    getLanguage().then((v) => setLangState(v)).catch(() => {});
    getDefaultSaveDir().then((v) => setDefaultDir(v)).catch(() => {});
  }, []);

  const onChangeTheme = useCallback((t: ThemeMode) => {
    setThemeMode(t);
    setTheme(t);
  }, [setTheme]);

  const onChangeLang = useCallback((l: Lang) => {
    setLangState(l);
    setLanguage(l);
  }, [setLanguage]);

  const openPath = useCallback((path: string, name: string) => {
    setTabs((prev) => {
      const existing = prev.find((t) => t.path === path);
      if (existing) {
        setActiveTabId(existing.id);
        return prev;
      }
      const tab: Tab = { id: crypto.randomUUID(), path, name: name || path };
      setActiveTabId(tab.id);
      return [...prev, tab];
    });
  }, []);

  const closeTab = useCallback((id: string) => {
    setTabs((prev) => {
      const next = prev.filter((t) => t.id !== id);
      if (activeTabId === id) {
        setActiveTabId(next[next.length - 1]?.id ?? null);
      }
      return next;
    });
  }, [activeTabId]);

  const reorderTabs = useCallback((from: number, to: number) => {
    setTabs((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }, []);

  const activeTab = useMemo(
    () => tabs.find((t) => t.id === activeTabId) ?? null,
    [tabs, activeTabId],
  );

  return (
    <div data-view={view} className="app">
      <Sidebar view={view} setView={setView} lang={lang} />
      <div className="content">
        <TabsBar
          tabs={tabs}
          activeId={activeTabId}
          setActive={setActiveTabId}
          close={closeTab}
          reorder={reorderTabs}
        />
        <main className="main">
          {activeTab ? (
            <Viewer path={activeTab.path} name={activeTab.name} />
          ) : view === "home" ? (
            <HomeView openPath={openPath} lang={lang} />
          ) : view === "projects" ? (
            <ProjectsView
              openPath={openPath}
              projectList={projectList}
              projectRename={projectRename}
              projectDelete={projectDelete}
              projectFiles={projectFiles}
              projectTimeline={projectTimeline}
            />
          ) : (
            <SettingsView
              lang={lang}
              theme={theme}
              onThemeChange={onChangeTheme}
              onLangChange={onChangeLang}
              defaultDir={defaultDir}
              browse={homeBrowse}
            />
          )}
        </main>
      </div>
    </div>
  );
}
