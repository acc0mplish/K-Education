"use strict";
const electron = require("electron");
const MARKDOWN_CHANNELS = {
  consumePending: "markdown:consume-pending",
  readFile: "markdown:read-file",
  save: "markdown:save",
  saveRequest: "markdown:save-request",
  saveRequestAck: "markdown:save-request-ack",
  dirtyChanged: "markdown:dirty-changed",
  closeSaveRequest: "markdown:close-save-request",
  closeSaveResult: "markdown:close-save-result",
  fileRenamed: "markdown:file-renamed",
  pickImage: "markdown:pick-image",
  saveImage: "markdown:save-image",
  readImage: "markdown:read-image",
  exportRequest: "markdown:export-request",
  exportDocx: "markdown:export-docx",
  exportPdf: "markdown:export-pdf",
  printRequest: "markdown:print-request",
  aiGenerateImage: "markdown:ai-generate-image",
  getLanguage: "app:get-language",
  languageChanged: "app:language-changed",
  getTheme: "app:get-theme",
  themeChanged: "app:theme-changed"
};
const AI_CHANNELS = {
  getSettings: "ai:get-settings",
  settingsChanged: "ai:settings-changed",
  setSettings: "ai:set-settings",
  probeProvider: "ai:probe-provider",
  ollamaHostInfo: "ai:ollama-host-info",
  ollamaRuntimeStatus: "ai:ollama-runtime-status",
  ollamaRuntimeStart: "ai:ollama-runtime-start",
  ollamaRuntimeInstall: "ai:ollama-runtime-install",
  ollamaPull: "ai:ollama-pull",
  ollamaPullCancel: "ai:ollama-pull-cancel",
  ollamaPullProgress: "ai:ollama-pull-progress",
  stream: "ai:stream",
  streamChunk: "ai:stream-chunk",
  streamCancel: "ai:stream-cancel",
  webSearch: "ai:web-search",
  imageSearch: "ai:image-search",
  fetchImage: "ai:fetch-image"
};
const api = {
  consumePending: () => electron.ipcRenderer.invoke(MARKDOWN_CHANNELS.consumePending),
  readFile: (path) => electron.ipcRenderer.invoke(MARKDOWN_CHANNELS.readFile, path),
  save: (request) => electron.ipcRenderer.invoke(MARKDOWN_CHANNELS.save, request),
  setDirty: (dirty) => electron.ipcRenderer.send(MARKDOWN_CHANNELS.dirtyChanged, dirty),
  onSaveRequest: (handler) => {
    const listener = (_e, mode) => handler(mode);
    electron.ipcRenderer.on(MARKDOWN_CHANNELS.saveRequest, listener);
    return () => electron.ipcRenderer.removeListener(MARKDOWN_CHANNELS.saveRequest, listener);
  },
  onCloseSaveRequest: (handler) => {
    const listener = () => handler();
    electron.ipcRenderer.on(MARKDOWN_CHANNELS.closeSaveRequest, listener);
    return () => electron.ipcRenderer.removeListener(MARKDOWN_CHANNELS.closeSaveRequest, listener);
  },
  sendCloseSaveResult: (ok) => electron.ipcRenderer.send(MARKDOWN_CHANNELS.closeSaveResult, ok),
  sendSaveRequestAck: (ok) => electron.ipcRenderer.send(MARKDOWN_CHANNELS.saveRequestAck, ok),
  onFileRenamed: (handler) => {
    const listener = (_e, newPath) => handler(newPath);
    electron.ipcRenderer.on(MARKDOWN_CHANNELS.fileRenamed, listener);
    return () => electron.ipcRenderer.removeListener(MARKDOWN_CHANNELS.fileRenamed, listener);
  },
  pickImage: () => electron.ipcRenderer.invoke(MARKDOWN_CHANNELS.pickImage),
  saveImage: (data) => electron.ipcRenderer.invoke(MARKDOWN_CHANNELS.saveImage, data),
  readImage: (src) => electron.ipcRenderer.invoke(MARKDOWN_CHANNELS.readImage, src),
  onExportRequest: (handler) => {
    const listener = (_e, format) => handler(format);
    electron.ipcRenderer.on(MARKDOWN_CHANNELS.exportRequest, listener);
    return () => electron.ipcRenderer.removeListener(MARKDOWN_CHANNELS.exportRequest, listener);
  },
  onPrintRequest: (handler) => {
    const listener = () => handler();
    electron.ipcRenderer.on(MARKDOWN_CHANNELS.printRequest, listener);
    return () => electron.ipcRenderer.removeListener(MARKDOWN_CHANNELS.printRequest, listener);
  },
  exportDocx: (request) => electron.ipcRenderer.invoke(MARKDOWN_CHANNELS.exportDocx, request),
  exportPdf: (request) => electron.ipcRenderer.invoke(MARKDOWN_CHANNELS.exportPdf, request),
  getLanguage: () => electron.ipcRenderer.invoke(MARKDOWN_CHANNELS.getLanguage),
  onLanguageChanged: (handler) => {
    const listener = (_e, lang) => handler(lang);
    electron.ipcRenderer.on(MARKDOWN_CHANNELS.languageChanged, listener);
    return () => electron.ipcRenderer.removeListener(MARKDOWN_CHANNELS.languageChanged, listener);
  },
  getTheme: () => electron.ipcRenderer.invoke(MARKDOWN_CHANNELS.getTheme),
  onThemeChanged: (handler) => {
    const listener = (_e, theme) => handler(theme);
    electron.ipcRenderer.on(MARKDOWN_CHANNELS.themeChanged, listener);
    return () => electron.ipcRenderer.removeListener(MARKDOWN_CHANNELS.themeChanged, listener);
  },
  onChromePressed: (handler) => {
    const listener = () => handler();
    electron.ipcRenderer.on("app:chrome-pressed", listener);
    return () => electron.ipcRenderer.removeListener("app:chrome-pressed", listener);
  },
  getAiSettings: () => electron.ipcRenderer.invoke(AI_CHANNELS.getSettings),
  onAiSettingsChanged: (handler) => {
    const listener = () => handler();
    electron.ipcRenderer.on(AI_CHANNELS.settingsChanged, listener);
    return () => electron.ipcRenderer.removeListener(AI_CHANNELS.settingsChanged, listener);
  },
  setAiSettings: (settings) => electron.ipcRenderer.invoke(AI_CHANNELS.setSettings, settings),
  probeAiProvider: (settings) => electron.ipcRenderer.invoke(AI_CHANNELS.probeProvider, settings),
  getOllamaHostInfo: () => electron.ipcRenderer.invoke(AI_CHANNELS.ollamaHostInfo),
  getOllamaRuntimeStatus: () => electron.ipcRenderer.invoke(AI_CHANNELS.ollamaRuntimeStatus),
  startOllamaRuntime: () => electron.ipcRenderer.invoke(AI_CHANNELS.ollamaRuntimeStart),
  installOllamaRuntime: () => electron.ipcRenderer.invoke(AI_CHANNELS.ollamaRuntimeInstall),
  pullOllamaModel: (request) => electron.ipcRenderer.invoke(AI_CHANNELS.ollamaPull, request),
  cancelOllamaPull: (requestId) => electron.ipcRenderer.invoke(AI_CHANNELS.ollamaPullCancel, requestId),
  onOllamaPullProgress: (callback) => {
    const listener = (_event, progress) => callback(progress);
    electron.ipcRenderer.on(AI_CHANNELS.ollamaPullProgress, listener);
    return () => electron.ipcRenderer.removeListener(AI_CHANNELS.ollamaPullProgress, listener);
  },
  aiStream: (request) => electron.ipcRenderer.invoke(AI_CHANNELS.stream, request),
  aiStreamCancel: (requestId) => electron.ipcRenderer.invoke(AI_CHANNELS.streamCancel, requestId),
  onAiStream: (handler) => {
    const listener = (_e, chunk) => handler(chunk);
    electron.ipcRenderer.on(AI_CHANNELS.streamChunk, listener);
    return () => electron.ipcRenderer.removeListener(AI_CHANNELS.streamChunk, listener);
  },
  aiBatiLogin: () => electron.ipcRenderer.invoke("ai:bati-login"),
  aiBatiAccountSummary: () => electron.ipcRenderer.invoke("batioffice:account:summary"),
  onAiBatiAccountChanged: (handler) => {
    const listener = (_event, summary) => handler(summary);
    electron.ipcRenderer.on("batioffice:account:changed", listener);
    return () => electron.ipcRenderer.removeListener("batioffice:account:changed", listener);
  },
  webSearch: (query, maxResults) => electron.ipcRenderer.invoke(AI_CHANNELS.webSearch, query, maxResults),
  imageSearch: (query, maxResults) => electron.ipcRenderer.invoke(AI_CHANNELS.imageSearch, query, maxResults),
  fetchImage: (url) => electron.ipcRenderer.invoke(AI_CHANNELS.fetchImage, url),
  aiGenerateImage: (op) => electron.ipcRenderer.invoke(MARKDOWN_CHANNELS.aiGenerateImage, op)
};
const projectApi = {
  resolveChat: (args) => electron.ipcRenderer.invoke("project:resolveChat", args),
  startChat: (args) => electron.ipcRenderer.invoke("project:startChat", args),
  listChatThreads: (args) => electron.ipcRenderer.invoke("project:listChatThreads", args),
  activateChatThread: (args) => electron.ipcRenderer.invoke("project:activateChatThread", args),
  appendChat: (args) => electron.ipcRenderer.invoke("project:appendChat", args),
  loadChat: (args) => electron.ipcRenderer.invoke("project:loadChat", args),
  rebindChat: (args) => electron.ipcRenderer.invoke("project:rebindChat", args)
};
electron.contextBridge.exposeInMainWorld("markdownApi", api);
electron.contextBridge.exposeInMainWorld("projectApi", projectApi);
