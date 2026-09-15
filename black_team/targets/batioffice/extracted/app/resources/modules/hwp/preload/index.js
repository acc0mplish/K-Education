"use strict";
const electron = require("electron");
const HWP_CHANNELS = {
  initialDocument: "hwp:initial-document",
  save: "hwp:save",
  dirtyQuery: "hwp:dirty-query",
  dirtyResult: "hwp:dirty-result",
  saveRequest: "hwp:save-request",
  saveResult: "hwp:save-result",
  teardownRequest: "hwp:teardown-request",
  teardownResult: "hwp:teardown-result"
};
const DESKTOP_ACCOUNT_CHANNELS = {
  summary: "batioffice:account:summary",
  profile: "batioffice:account:profile",
  credits: "batioffice:account:credits",
  restore: "batioffice:account:restore",
  login: "batioffice:account:login",
  logout: "batioffice:account:logout",
  /** Main-to-renderer notification. It is never registered as an invoke handler. */
  changed: "batioffice:account:changed"
};
function createDesktopAccountRendererApi(invoke, subscribe) {
  const summary = async (channel, input) => parseAccountSummary(await invoke(channel, input));
  return {
    summary: () => summary(DESKTOP_ACCOUNT_CHANNELS.summary),
    profile: async () => parseAccountProfile(await invoke(DESKTOP_ACCOUNT_CHANNELS.profile)),
    credits: async () => parseCreditBalance(await invoke(DESKTOP_ACCOUNT_CHANNELS.credits)),
    restore: () => summary(DESKTOP_ACCOUNT_CHANNELS.restore),
    login: () => summary(DESKTOP_ACCOUNT_CHANNELS.login),
    logout: () => summary(DESKTOP_ACCOUNT_CHANNELS.logout),
    onChanged: (handler) => subscribe?.(
      DESKTOP_ACCOUNT_CHANNELS.changed,
      (input) => handler(parseAccountSummary(input))
    ) ?? (() => void 0)
  };
}
function parseCreditBalance(input) {
  if (input === null) return null;
  if (!isRecord(input) || !isCreditAmount(input.balance) || !isCreditAmount(input.reserved) || !isCreditAmount(input.available) || input.unit !== "credit") {
    throw new Error("데스크톱 크레딧 응답 형식이 올바르지 않습니다.");
  }
  if (input.lowBalanceThreshold !== void 0 && !isCreditAmount(input.lowBalanceThreshold)) {
    throw new Error("데스크톱 크레딧 임계값 형식이 올바르지 않습니다.");
  }
  let trial;
  if (input.trial === null) trial = null;
  else if (input.trial !== void 0) {
    if (!isRecord(input.trial)) throw new Error("데스크톱 체험 크레딧 형식이 올바르지 않습니다.");
    if (input.trial.remaining !== void 0 && !isCreditAmount(input.trial.remaining)) {
      throw new Error("데스크톱 체험 크레딧 형식이 올바르지 않습니다.");
    }
    if (input.trial.expiresAt !== void 0 && typeof input.trial.expiresAt !== "string") {
      throw new Error("데스크톱 체험 크레딧 만료 형식이 올바르지 않습니다.");
    }
    trial = {
      ...typeof input.trial.remaining === "number" ? { remaining: input.trial.remaining } : {},
      ...typeof input.trial.expiresAt === "string" ? { expiresAt: input.trial.expiresAt } : {}
    };
  }
  return {
    balance: input.balance,
    reserved: input.reserved,
    available: input.available,
    unit: "credit",
    ...typeof input.lowBalanceThreshold === "number" ? { lowBalanceThreshold: input.lowBalanceThreshold } : {},
    ...trial !== void 0 ? { trial } : {}
  };
}
function parseAccountProfile(input) {
  if (input === null) return null;
  if (!isRecord(input) || Object.keys(input).length !== 3 || typeof input.memberId !== "string" || typeof input.displayName !== "string" || input.email !== null && typeof input.email !== "string") {
    throw new Error("데스크톱 계정 프로필 응답 형식이 올바르지 않습니다.");
  }
  return {
    memberId: input.memberId,
    displayName: input.displayName,
    email: input.email
  };
}
function parseAccountSummary(input) {
  if (!isRecord(input) || Object.keys(input).length !== 3 || typeof input.configured !== "boolean" || typeof input.secureStorageAvailable !== "boolean" || typeof input.authenticated !== "boolean") {
    throw new Error("데스크톱 계정 상태 응답 형식이 올바르지 않습니다.");
  }
  return {
    configured: input.configured,
    secureStorageAvailable: input.secureStorageAvailable,
    authenticated: input.authenticated
  };
}
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function isCreditAmount(value) {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}
const desktopAccountApi = createDesktopAccountRendererApi(
  (channel, input) => electron.ipcRenderer.invoke(channel, input),
  (channel, handler) => {
    const listener = (_event, input) => handler(input);
    electron.ipcRenderer.on(channel, listener);
    return () => electron.ipcRenderer.removeListener(channel, listener);
  }
);
electron.contextBridge.exposeInMainWorld("hwpHost", {
  initialDocument: () => electron.ipcRenderer.invoke(HWP_CHANNELS.initialDocument),
  save: (request) => electron.ipcRenderer.invoke(HWP_CHANNELS.save, request),
  onDirtyQuery: (handler) => {
    const listener = (_event, token) => handler(token);
    electron.ipcRenderer.on(HWP_CHANNELS.dirtyQuery, listener);
    return () => electron.ipcRenderer.removeListener(HWP_CHANNELS.dirtyQuery, listener);
  },
  reportDirty: (token, dirty) => electron.ipcRenderer.send(HWP_CHANNELS.dirtyResult, token, dirty),
  onSaveRequest: (handler) => {
    const listener = (_event, token) => handler(token);
    electron.ipcRenderer.on(HWP_CHANNELS.saveRequest, listener);
    return () => electron.ipcRenderer.removeListener(HWP_CHANNELS.saveRequest, listener);
  },
  reportSave: (token, saved) => electron.ipcRenderer.send(HWP_CHANNELS.saveResult, token, saved),
  onTeardownRequest: (handler) => {
    const listener = (_event, token) => handler(token);
    electron.ipcRenderer.on(HWP_CHANNELS.teardownRequest, listener);
    return () => electron.ipcRenderer.removeListener(HWP_CHANNELS.teardownRequest, listener);
  },
  reportTeardown: (token) => electron.ipcRenderer.send(HWP_CHANNELS.teardownResult, token),
  getAiSettings: () => electron.ipcRenderer.invoke("ai:get-settings"),
  setAiSettings: (settings) => electron.ipcRenderer.invoke("ai:set-settings", settings),
  onAiSettingsChanged: (handler) => {
    const listener = () => handler();
    electron.ipcRenderer.on("ai:settings-changed", listener);
    return () => electron.ipcRenderer.removeListener("ai:settings-changed", listener);
  },
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
    return () => electron.ipcRenderer.removeListener("ai:ollama-pull-progress", listener);
  },
  aiStream: (request) => electron.ipcRenderer.invoke("ai:stream", request),
  aiStreamCancel: (requestId) => electron.ipcRenderer.invoke("ai:stream-cancel", requestId),
  onAiStream: (handler) => {
    const listener = (_event, chunk) => handler(chunk);
    electron.ipcRenderer.on("ai:stream-chunk", listener);
    return () => electron.ipcRenderer.removeListener("ai:stream-chunk", listener);
  },
  aiBatiLogin: () => electron.ipcRenderer.invoke("ai:bati-login"),
  aiBatiAccountSummary: () => desktopAccountApi.summary(),
  onAiBatiAccountChanged: (handler) => desktopAccountApi.onChanged(handler)
});
const projectApi = {
  resolveChat: (args) => electron.ipcRenderer.invoke("project:resolveChat", args),
  startChat: (args) => electron.ipcRenderer.invoke("project:startChat", args),
  listChatThreads: (args) => electron.ipcRenderer.invoke("project:listChatThreads", args),
  activateChatThread: (args) => electron.ipcRenderer.invoke("project:activateChatThread", args),
  appendChat: (args) => electron.ipcRenderer.invoke("project:appendChat", args),
  loadChat: (args) => electron.ipcRenderer.invoke("project:loadChat", args),
  rebindChat: (args) => electron.ipcRenderer.invoke("project:rebindChat", args)
};
electron.contextBridge.exposeInMainWorld("projectApi", projectApi);
