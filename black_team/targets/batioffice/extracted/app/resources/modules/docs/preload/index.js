"use strict";
const electron = require("electron");
const api = {
  getLanguage: () => electron.ipcRenderer.invoke("app:get-language"),
  onLanguageChanged: (handler) => {
    const listener = (_event, lang) => handler(lang);
    electron.ipcRenderer.on("app:language-changed", listener);
    return () => electron.ipcRenderer.removeListener("app:language-changed", listener);
  },
  getTheme: () => electron.ipcRenderer.invoke("app:get-theme"),
  onThemeChanged: (handler) => {
    const listener = (_event, theme) => handler(theme);
    electron.ipcRenderer.on("app:theme-changed", listener);
    return () => electron.ipcRenderer.removeListener("app:theme-changed", listener);
  },
  onChromePressed: (handler) => {
    const listener = () => handler();
    electron.ipcRenderer.on("app:chrome-pressed", listener);
    return () => electron.ipcRenderer.removeListener("app:chrome-pressed", listener);
  },
  openDocx: () => electron.ipcRenderer.invoke("docs:open"),
  openDocxPath: (path) => electron.ipcRenderer.invoke("docs:open-path", path),
  openDocxDecrypt: (path, password) => electron.ipcRenderer.invoke("docs:open-decrypt", path, password),
  setDocPassword: (filePath, password) => electron.ipcRenderer.invoke("docs:set-password", filePath, password),
  docPasswordIntentRevision: async () => {
    const revision = await electron.ipcRenderer.invoke("docs:password-intent-revision");
    return typeof revision === "number" && Number.isSafeInteger(revision) && revision >= 0 ? revision : 0;
  },
  discardDocPasswordIntents: (throughRevision) => electron.ipcRenderer.invoke("docs:discard-password-intents", throughRevision),
  consumePendingOpenDocx: () => electron.ipcRenderer.invoke("docs:consume-pending-open"),
  consumeNewBlankDoc: () => electron.ipcRenderer.invoke("docs:consume-new-blank"),
  consumeAiDocContent: () => electron.ipcRenderer.invoke("docs:consume-ai-doc-content"),
  consumeAiPrompt: () => electron.ipcRenderer.invoke("docs:consume-ai-prompt"),
  createDocument: (request) => electron.ipcRenderer.invoke("docs:create-document", request),
  onOpenDocx: (handler) => {
    const listener = (_event, result) => handler(result);
    electron.ipcRenderer.on("docs:opened", listener);
    return () => electron.ipcRenderer.removeListener("docs:opened", listener);
  },
  onRenamedDocx: (handler) => {
    const listener = (_event, paths) => handler(paths);
    electron.ipcRenderer.on("docs:renamed", listener);
    return () => electron.ipcRenderer.removeListener("docs:renamed", listener);
  },
  saveDocx: (path, data, auto) => electron.ipcRenderer.invoke("docs:save", path, data, auto === true),
  writeRecoveryCopy: (path, data) => electron.ipcRenderer.invoke("docs:write-recovery", path, data),
  onTeardown: (handler) => {
    const listener = () => handler();
    electron.ipcRenderer.on("docs:teardown", listener);
    return () => electron.ipcRenderer.removeListener("docs:teardown", listener);
  },
  saveDocxAs: (defaultName, data, sourcePath) => electron.ipcRenderer.invoke("docs:save-as", defaultName, data, sourcePath ?? null),
  saveDocxNew: (defaultName, data) => electron.ipcRenderer.invoke("docs:save-new", defaultName, data),
  getRecentFiles: () => electron.ipcRenderer.invoke("docs:recent"),
  pickImage: () => electron.ipcRenderer.invoke("docs:pick-image"),
  fontMetrics: (family) => electron.ipcRenderer.invoke("docs:font-metrics", family),
  print: () => electron.ipcRenderer.invoke("docs:print"),
  exportPdf: (defaultName, pageWidthTwips, pageHeightTwips, outPath) => electron.ipcRenderer.invoke("docs:export-pdf", defaultName, pageWidthTwips, pageHeightTwips, outPath),
  printPdfBuffer: (pageWidthTwips, pageHeightTwips) => electron.ipcRenderer.invoke("docs:print-pdf-buffer", pageWidthTwips, pageHeightTwips),
  saveMergedPdf: (defaultName, base64Parts, outPath) => electron.ipcRenderer.invoke("docs:save-merged-pdf", defaultName, base64Parts, outPath),
  getAiSettings: () => electron.ipcRenderer.invoke("ai:get-settings"),
  onAiSettingsChanged: (handler) => {
    const listener = () => handler();
    electron.ipcRenderer.on("ai:settings-changed", listener);
    return () => electron.ipcRenderer.removeListener("ai:settings-changed", listener);
  },
  setAiSettings: (settings) => electron.ipcRenderer.invoke("ai:set-settings", settings),
  probeAiProvider: (settings) => electron.ipcRenderer.invoke("ai:probe-provider", settings),
  getOllamaHostInfo: () => electron.ipcRenderer.invoke("ai:ollama-host-info"),
  getOllamaRuntimeStatus: () => electron.ipcRenderer.invoke("ai:ollama-runtime-status"),
  startOllamaRuntime: () => electron.ipcRenderer.invoke("ai:ollama-runtime-start"),
  installOllamaRuntime: () => electron.ipcRenderer.invoke("ai:ollama-runtime-install"),
  pullOllamaModel: (request) => electron.ipcRenderer.invoke("ai:ollama-pull", request),
  cancelOllamaPull: (requestId) => electron.ipcRenderer.invoke("ai:ollama-pull-cancel", requestId),
  onOllamaPullProgress: (callback) => {
    const listener = (_event, progress) => callback(progress);
    electron.ipcRenderer.on("ai:ollama-pull-progress", listener);
    return () => {
      electron.ipcRenderer.removeListener("ai:ollama-pull-progress", listener);
    };
  },
  aiChat: (request) => electron.ipcRenderer.invoke("ai:chat", request),
  aiStream: (request) => electron.ipcRenderer.invoke("ai:stream", request),
  aiStreamCancel: (requestId) => electron.ipcRenderer.invoke("ai:stream-cancel", requestId),
  aiBatiLogin: () => electron.ipcRenderer.invoke("ai:bati-login"),
  aiBatiAccountSummary: () => electron.ipcRenderer.invoke("batioffice:account:summary"),
  onAiBatiAccountChanged: (handler) => {
    const listener = (_event, summary) => handler(summary);
    electron.ipcRenderer.on("batioffice:account:changed", listener);
    return () => electron.ipcRenderer.removeListener("batioffice:account:changed", listener);
  },
  webSearch: (query, maxResults) => electron.ipcRenderer.invoke("ai:web-search", query, maxResults),
  imageSearch: (query, maxResults) => electron.ipcRenderer.invoke("ai:image-search", query, maxResults),
  fetchImage: (url) => electron.ipcRenderer.invoke("ai:fetch-image", url),
  aiGenerateImage: (op) => electron.ipcRenderer.invoke("docs:ai-generate-image", op),
  pickAttachments: () => electron.ipcRenderer.invoke("files:pick"),
  addAttachmentPaths: (paths) => electron.ipcRenderer.invoke("files:add", paths),
  addPastedImage: (data, ext) => electron.ipcRenderer.invoke("files:add-pasted-image", data, ext),
  copyImageToClipboard: (dataUrl, metaJson) => electron.ipcRenderer.invoke("docs:copy-image-to-clipboard", dataUrl, metaJson),
  readAttachment: (path, offset, maxChars) => electron.ipcRenderer.invoke("files:read", path, offset, maxChars),
  readAttachmentImage: (path) => electron.ipcRenderer.invoke("files:read-image", path),
  getPathForFile: (file) => electron.webUtils.getPathForFile(file),
  openNewTab: (openPath) => electron.ipcRenderer.invoke("win:new", openPath ?? null),
  listDocsTabs: () => electron.ipcRenderer.invoke("win:list"),
  focusDocsTab: (id) => electron.ipcRenderer.invoke("win:focus", id),
  onAiStream: (handler) => {
    const listener = (_event, chunk) => handler(chunk);
    electron.ipcRenderer.on("ai:stream-chunk", listener);
    return () => electron.ipcRenderer.removeListener("ai:stream-chunk", listener);
  },
  onMenuCommand: (handler) => {
    const listener = (_event, command, payload) => handler(command, payload);
    electron.ipcRenderer.on("menu:command", listener);
    return () => electron.ipcRenderer.removeListener("menu:command", listener);
  },
  onCloseCheck: (handler) => {
    const listener = () => handler();
    electron.ipcRenderer.on("docs:close-check", listener);
    return () => electron.ipcRenderer.removeListener("docs:close-check", listener);
  },
  reportViewMenuState: (state) => electron.ipcRenderer.send("docs:view-menu-state", {
    aiSidebar: state?.aiSidebar === true,
    darkCanvas: state?.darkCanvas === true
  }),
  reportCloseCheck: (state) => electron.ipcRenderer.send("docs:close-check-result", {
    dirty: state?.dirty === true,
    autoSave: state?.autoSave === true,
    filePath: typeof state?.filePath === "string" ? state.filePath : null
  }),
  onCloseSaveRequest: (handler) => {
    const listener = () => handler();
    electron.ipcRenderer.on("docs:close-save-request", listener);
    return () => electron.ipcRenderer.removeListener("docs:close-save-request", listener);
  },
  reportCloseSaveResult: (ok) => electron.ipcRenderer.send("docs:close-save-result", ok === true)
};
const projectApi = {
  resolveChat: (args) => electron.ipcRenderer.invoke("project:resolveChat", args),
  startChat: (args) => electron.ipcRenderer.invoke("project:startChat", args),
  listChatThreads: (args) => electron.ipcRenderer.invoke("project:listChatThreads", args),
  activateChatThread: (args) => electron.ipcRenderer.invoke("project:activateChatThread", args),
  appendChat: (args) => electron.ipcRenderer.invoke("project:appendChat", args),
  loadChat: (args) => electron.ipcRenderer.invoke("project:loadChat", args),
  rebindChat: (args) => electron.ipcRenderer.invoke("project:rebindChat", args),
  // P1 extensions
  listProjects: () => electron.ipcRenderer.invoke("project:list"),
  createProject: (args) => electron.ipcRenderer.invoke("project:create", args),
  renameProject: (args) => electron.ipcRenderer.invoke("project:rename", args),
  deleteProject: (args) => electron.ipcRenderer.invoke("project:delete", args),
  moveFile: (args) => electron.ipcRenderer.invoke("project:moveFile", args),
  getTimeline: (args) => electron.ipcRenderer.invoke("project:timeline", args)
};
electron.contextBridge.exposeInMainWorld("desktop", api);
electron.contextBridge.exposeInMainWorld("projectApi", projectApi);
