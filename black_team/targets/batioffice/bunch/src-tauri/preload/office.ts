// bunch office preload bridge.
//
// The prebuilt office renderer bundles (docs / sheets / slides) and the rhwp
// engine were built for an Electron host where a preload script exposes an
// Electron `ipcRenderer` surface via `contextBridge`. Tauri has no Electron, so
// this preload re-creates that surface on top of Tauri's `invoke`/`listen`/
// `emit`.
//
// Faithful port contract:
//   * open  -> office_open returns { base64, path, name, size }; bridge decodes
//              base64 into an ArrayBuffer under `data` because the modules do
//              `new Uint8Array(result.data)`.
//   * save  -> modules hand us raw bytes; bridge base64-encodes them before
//              calling office_save so the round trip is byte-exact.
//   * events-> listen()/emit() mirror electron.ipcRenderer.on()/send().
//
// Bati-specific cloud / account / credits / AI layers are cut (no-op stubs).

import { emit, invoke, listen } from "@tauri-apps/api/core";

// ---------------------------------------------------------------------------
// Minimal polyfills the prebuilt bundles expect to exist globally.
// ---------------------------------------------------------------------------
function base64ToBytes(b64: string): Uint8Array {
  if (typeof globalThis.atob === "function") {
    let bin = "";
    for (let i = 0; i < b64.length; i += 128 / 4) {
      bin += globalThis.atob(b64.slice(i, i + 128 / 4));
    }
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }
  return Uint8Array.from(Buffer.from(b64, "base64"));
}

function bytesToBase64(bytes: Uint8Array | ArrayBuffer): string {
  const u = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let bin = "";
  const chunk = 0x8000;
  for (let i = 0; i < u.length; i += chunk) {
    bin += String.fromCharCode.apply(null, u.subarray(i, i + chunk) as any);
  }
  return typeof globalThis.btoa === "function"
    ? globalThis.btoa(bin)
    : Buffer.from(bin, "binary").toString("base64");
}

const g = globalThis as any;
g.base64ToBytes = base64ToBytes;

// Buffer polyfill (enough for the decode paths the bundles use).
try {
  if (!g.Buffer || typeof g.Buffer.from !== "function") {
    g.Buffer = {
      from: (a: any) => (a instanceof Uint8Array ? a : base64ToBytes(String(a))),
      isBuffer: () => false,
      byteLength: (a: any) => (a?.length ?? 0),
    };
  }
} catch {
  /* ignore */
}
g.setImmediate = (cb: (...args: any[]) => void, ...args: any[]) =>
  setTimeout(() => cb(...args), 0);
g.clearImmediate = (id: any) => clearTimeout(id);
if (!g.process || !g.process.env) {
  g.process = { env: { NODE_ENV: "production" }, nextTick: (cb: () => void) => setTimeout(cb, 0) };
}

// ---------------------------------------------------------------------------
// docs (docx) desktop API — faithful to the BatiOffice docs preload.
// ---------------------------------------------------------------------------
interface OfficeRawResult {
  base64: string;
  path: string | null;
  name: string;
  size: number;
  needsPassword?: boolean;
  ok?: boolean;
  error?: string;
}

function toOpenResult(r: OfficeRawResult) {
  if (r.needsPassword) {
    return { data: new ArrayBuffer(0), path: r.path ?? null, name: r.name, size: r.size ?? 0, needsPassword: true };
  }
  return { data: base64ToBytes(r.base64), path: r.path ?? null, name: r.name, size: r.size ?? 0 };
}

const noop = async () => ({});
const emptyList = async () => [];

const desktopApi = {
  // --- open ---
  openDocx: () => invoke<OfficeRawResult>("office_open", { kind: "docx", blank: true }).then(toOpenResult),
  openDocxPath: (path: string) =>
    invoke<OfficeRawResult>("office_open", { path, blank: false }).then(toOpenResult),
  openDocxDecrypt: (path: string, password: string) =>
    invoke<OfficeRawResult>("office_open", { path, password }).then(toOpenResult),
  setDocPassword: (filePath: string, password: string) => invoke("office_open", { path: filePath, password }),
  docPasswordIntentRevision: async () => 0,
  discardDocPasswordIntents: async () => true,
  consumePendingOpenDocx: async () => ({}),
  consumeNewBlankDoc: async () => ({}),
  consumeAiDocContent: async () => ({}),
  consumeAiPrompt: async () => ({}),
  createDocument: (request: any) => invoke("office_open", { kind: "docx", blank: true, request }),
  // --- save ---
  saveDocx: (path: string, data: any, auto?: boolean) =>
    invoke<OfficeRawResult>("office_save", { path, data: bytesToBase64(data), auto: auto === true }),
  saveDocxAs: (defaultName: string, data: any, sourcePath: string) =>
    invoke<OfficeRawResult>("office_save", { path: defaultName, data: bytesToBase64(data), sourcePath, auto: false }),
  saveDocxNew: (defaultName: string, data: any) =>
    invoke<OfficeRawResult>("office_save", { path: defaultName, data: bytesToBase64(data), auto: false }),
  writeRecoveryCopy: (path: string, data: any) =>
    invoke("office_save", { path, data: bytesToBase64(data) }),
  getRecentFiles: () => invoke<OfficeRawResult[]>("office_recent", { kind: "docx" }),
  pickImage: noop,
  readAttachment: (path: string, offset: number, maxChars: number) =>
    invoke("files_read", { path }),
  pickAttachments: emptyList,
  addAttachmentPaths: emptyList,
  addPastedImage: async () => ({}),
  copyImageToClipboard: async () => ({}),
  fontMetrics: async (_family: string) => null,
  exportPdf: async () => ({}),
  printPdfBuffer: async () => ({}),
  saveMergedPdf: async () => ({}),
  print: async () => ({}),
  getPathForFile: async (file: any) => file?.path ?? null,
  // --- tabs / window (single-window port => stubs) ---
  openNewTab: async () => ({}),
  listDocsTabs: emptyList,
  focusDocsTab: async () => false,
  // --- settings / events ---
  getLanguage: () => invoke<string>("get_language"),
  getTheme: () => invoke<string>("get_theme"),
  getAiSettings: async () => ({ provider: "bati" }),
  setAiSettings: async () => true,
  // --- event registration (only fire if the backend emits) ---
  onOpenedDocx: (h: (r: any) => void) => listen<string>("docs_opened", (e) => h(e.payload)).then((u: any) => u),
  onRenamedDocx: (h: (p: any) => void) => listen<string>("docs_renamed", (e) => h(e.payload)).then((u: any) => u),
  onTeardown: (h: () => void) => listen<string>("docs_teardown", () => h()).then((u: any) => u),
  onCloseCheck: (h: () => void) => listen<string>("docs_close_check", () => h()).then((u: any) => u),
  onAiStream: noop as any,
  onMenuCommand: noop as any,
  onCloseSaveRequest: noop as any,
  onLanguageChanged: noop as any,
  onThemeChanged: noop as any,
  onChromePressed: noop as any,
  onAiSettingsChanged: noop as any,
  // --- Bati cloud / AI (cut) ---
  aiChat: async () => ({}),
  aiStream: async () => ({}),
  aiStreamCancel: async () => true,
  probeAiProvider: async () => null,
  getOllamaHostInfo: async () => null,
  getOllamaRuntimeStatus: async () => "stopped",
  aiBatiAccountSummary: async () => null,
  webSearch: async () => [],
  imageSearch: async () => [],
  fetchImage: async () => null,
  aiGenerateImage: async () => null,
  aiBatiLogin: async () => ({}),
  reportViewMenuState: (s: any) => emit("docs_view_menu_state", s),
  reportCloseCheck: (s: any) => emit("docs_close_check_result", s),
  reportCloseSaveResult: (ok: boolean) => emit("docs_close_save_result", ok),
};

const projectApi = {
  listProjects: () => invoke<any[]>("project_list"),
  createProject: (args: any) => invoke("project_create", args),
  renameProject: (args: any) => invoke("project_rename", args),
  deleteProject: (args: any) => invoke("project_delete", args),
  moveFile: (args: any) => invoke("project_move", args),
  getTimeline: (args: any) => invoke("project_timeline", args),
  resolveChat: async () => ({}),
  startChat: async () => ({}),
  listChatThreads: async () => [],
  activateChatThread: async () => false,
  appendChat: async () => ({}),
  loadChat: async () => ({}),
  rebindChat: async () => ({}),
};

function expose<K extends keyof typeof desktopApi>(name: "desktop", api: typeof desktopApi): void;
function expose<K extends keyof typeof projectApi>(name: "projectApi", api: typeof projectApi): void;
function expose(name: string, api: any): void {
  (globalThis as any)[name] = api;
}

expose("desktop", desktopApi);
expose("projectApi", projectApi);

// Some bundles also read `window.desktop`; expose on the window object too.
(globalThis as any).window = (globalThis as any).window || (globalThis as any);
(globalThis as any).window.desktop = desktopApi;
(globalThis as any).window.projectApi = projectApi;

// Open the initial document the shell passed via `?bunchOpen=<path>` once the
// bundle has finished defining `window.desktop`.
(function openInitial(): void {
  const params = new URLSearchParams(globalThis.location?.search ?? "");
  const initial = params.get("bunchOpen");
  if (!initial) return;
  const wait = (): void => {
    const desk = (globalThis as any).window?.desktop ?? (globalThis as any).desktop;
    if (desk?.openDocxPath) {
      void desk.openDocxPath(initial);
    } else {
      setTimeout(wait, 50);
    }
  };
  wait();
})();
