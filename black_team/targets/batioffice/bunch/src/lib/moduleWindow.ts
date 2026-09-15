// Launches a prebuilt office module (docs/sheets/slides/hwp) in its own Tauri
// webview window, served over the local office static server. The office
// bundles are Electron renderer apps; a Tauri preload bridge (preload/office.ts)
// re-creates the Electron ipcRenderer surface they expect, and the open path is
// forwarded through a `?bunchOpen=` query parameter.
import { invoke } from "@tauri-apps/api/core";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";

export type ModuleName = "docs" | "sheets" | "slides" | "hwp";

// NOTE: @tauri-apps/api's WindowOptions type does not declare `preloadScripts`
// even in the installed release, but the Tauri v2 runtime supports it. The
// options object is cast to the constructor's expected shape to reach it.
type WithPreload = { url: string } & Record<string, unknown>;

export async function openModule(name: ModuleName, openPath?: string): Promise<WebviewWindow | null> {
  const base = await invoke<string>("serve_module", { name });
  const query = openPath ? `?bunchOpen=${encodeURIComponent(openPath)}` : "";
  const url = `${base}/index.html${query}`;

  let win: WebviewWindow | null = null;
  try {
    const opts: WithPreload = {
      url,
      title: name,
      width: 1150,
      height: 780,
      minWidth: 760,
      minHeight: 520,
      decorations: false,
      skipTaskbar: false,
      transparent: false,
      // resolved relative to the src-tauri directory by the Tauri CLI/runtime
      preloadScripts: ["preload/office.ts"],
    };
    win = await new WebviewWindow(`office-${name}`, opts as never);
  } catch (e) {
    console.error(`failed to open module ${name}`, e);
    return null;
  }

  return win;
}

