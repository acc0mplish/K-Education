import { Lang, ThemeMode } from "../App";

interface Props {
  lang: Lang;
  theme: ThemeMode;
  onThemeChange: (t: ThemeMode) => void;
  onLangChange: (l: Lang) => void;
  defaultDir: string;
  browse: () => void;
}

const LANGS: { value: Lang; label: string }[] = [
  { value: "ko", label: "한국어" },
  { value: "en", label: "English" },
  { value: "ja", label: "日本語" },
  { value: "zh", label: "中文" },
  { value: "fr", label: "Français" },
  { value: "de", label: "Deutsch" },
  { value: "es", label: "Español" },
  { value: "th", label: "ไทย" },
  { value: "id", label: "Indonesia" },
  { value: "ru", label: "Русский" },
  { value: "ar", label: "العربية" },
  { value: "pt", label: "Português" },
  { value: "it", label: "Italiano" },
  { value: "pl", label: "Polski" },
  { value: "nl", label: "Nederlands" },
  { value: "ms", label: "Bahasa Melayu" },
  { value: "he", label: "עברית" },
  { value: "hi", label: "हिन्दी" },
  { value: "zh-TW", label: "繁體中文" },
];

export default function SettingsView({
  lang,
  theme,
  onThemeChange,
  onLangChange,
  defaultDir,
  browse,
}: Props) {
  return (
    <div className="settings">
      <h1>{lang === "ko" ? "설정" : "Settings"}</h1>

      <section className="card">
        <h2>{lang === "ko" ? "테마" : "Theme"}</h2>
        <div className="seg">
          {(["system", "light", "dark"] as ThemeMode[]).map((t) => (
            <button
              key={t}
              className={theme === t ? "active" : ""}
              onClick={() => onThemeChange(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </section>

      <section className="card">
        <h2>{lang === "ko" ? "언어" : "Language"}</h2>
        <select value={lang} onChange={(e) => onLangChange(e.target.value as Lang)}>
          {LANGS.map((l) => (
            <option key={l.value} value={l.value}>{l.label}</option>
          ))}
        </select>
      </section>

      <section className="card">
        <h2>{lang === "ko" ? "기본 저장 위치" : "Default save location"}</h2>
        <div className="save-dir">
          <code>{defaultDir || lang === "ko" ? "(설정되지 않음)" : "(not set)"}</code>
          <button onClick={browse}>{lang === "ko" ? "선택" : "Choose…"}</button>
        </div>
      </section>

      <section className="card">
        <h2>{lang === "ko" ? "앱 정보" : "About"}</h2>
        <p>bunch — a BatiOffice local-document-shell reimplementation.</p>
        <p>Forked from BatiOffice v0.9.8 · Tauri + React · Apache-2.0 core.</p>
        <p className="note">
          {lang === "ko"
            ? "Bati 클라우드/계정/AI 레이어를 제거하고 로컬 기능만 재구현했습니다."
            : "Removed Bati cloud/account/AI layers; reimplemented local features only."}
        </p>
      </section>
    </div>
  );
}
