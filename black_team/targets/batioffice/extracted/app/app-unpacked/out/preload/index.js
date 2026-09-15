"use strict";
const electron = require("electron");
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
const HOME_CHANNELS = {
  recents: "home:recents",
  starred: "home:starred",
  statPaths: "home:stat-paths",
  toggleStar: "home:toggle-star",
  openPath: "home:open-path",
  browse: "home:browse",
  newDoc: "home:new-doc",
  newSheet: "home:new-sheet",
  newSlide: "home:new-slide",
  newMarkdown: "home:new-markdown",
  newHwp: "home:new-hwp",
  newPdf: "home:new-pdf",
  removeRecent: "home:remove-recent",
  revealPath: "home:reveal-path",
  renameFile: "home:rename-file",
  duplicateFile: "home:duplicate-file",
  deleteFiles: "home:delete-files",
  openTrash: "home:open-trash",
  getLanguage: "home:get-language",
  setLanguage: "home:set-language",
  getTelemetryEnabled: "home:get-telemetry-enabled",
  setTelemetryEnabled: "home:set-telemetry-enabled",
  getGlobalSummonEnabled: "home:get-global-summon-enabled",
  setGlobalSummonEnabled: "home:set-global-summon-enabled",
  getGlobalSummonAccelerator: "home:get-global-summon-accelerator",
  setGlobalSummonAccelerator: "home:set-global-summon-accelerator",
  getUpdateChannel: "home:get-update-channel",
  setUpdateChannel: "home:set-update-channel",
  getAppVersion: "home:get-app-version",
  showChangelog: "home:show-changelog",
  getStagedUpdate: "home:get-staged-update",
  applyStagedUpdate: "home:apply-staged-update",
  newWithAi: "home:new-with-ai",
  onboardingSeen: "home:onboarding-seen",
  setOnboardingSeen: "home:set-onboarding-seen",
  getTheme: "home:get-theme",
  setTheme: "home:set-theme",
  getDefaultSaveDir: "home:get-default-save-dir",
  pickDefaultSaveDir: "home:pick-default-save-dir",
  openBatiSite: "home:open-bati-site",
  starPromptShouldShow: "home:star-prompt-should-show",
  starPromptAction: "home:star-prompt-action"
};
const PROJECT_CHANNELS = {
  list: "project:list",
  files: "project:files",
  create: "project:create",
  rename: "project:rename",
  delete: "project:delete",
  moveFile: "project:moveFile",
  timeline: "project:timeline"
};
const TABS_CHANNELS = {
  list: "tabs:list",
  activate: "tabs:activate",
  close: "tabs:close",
  showMenu: "tabs:show-menu",
  showNewMenu: "tabs:show-new-menu",
  showAppMenu: "tabs:show-app-menu",
  reorder: "tabs:reorder",
  openWorkspace: "tabs:open-workspace",
  changed: "tabs:changed",
  chromePressed: "tabs:chrome-pressed"
};
const UI_LANGUAGES = [
  "zh",
  "en",
  "ja",
  "ko",
  "fr",
  "de",
  "es",
  "th",
  "id",
  "ru",
  "ar",
  "pt",
  "it",
  "pl",
  "nl",
  "ms",
  "he",
  "hi",
  "zh-TW"
];
function isUiLanguage(value) {
  return UI_LANGUAGES.includes(value);
}
const EMPTY_PAGE = { entries: [], total: 0, totalAll: 0 };
function asRecentPage(result) {
  if (result && typeof result === "object" && Array.isArray(result.entries)) {
    return result;
  }
  return EMPTY_PAGE;
}
const homeApi = {
  async recents(query) {
    return asRecentPage(await electron.ipcRenderer.invoke(HOME_CHANNELS.recents, query));
  },
  async starred(query) {
    return asRecentPage(await electron.ipcRenderer.invoke(HOME_CHANNELS.starred, query));
  },
  async statPaths(paths) {
    const result = await electron.ipcRenderer.invoke(HOME_CHANNELS.statPaths, paths);
    return Array.isArray(result) ? result : [];
  },
  async toggleStar(path) {
    if (typeof path !== "string" || !path) throw new Error("Invalid path.");
    await electron.ipcRenderer.invoke(HOME_CHANNELS.toggleStar, path);
  },
  async openPath(path) {
    if (typeof path !== "string" || !path) throw new Error("Invalid path.");
    await electron.ipcRenderer.invoke(HOME_CHANNELS.openPath, path);
  },
  async browse() {
    await electron.ipcRenderer.invoke(HOME_CHANNELS.browse);
  },
  async newDoc(opts) {
    await electron.ipcRenderer.invoke(HOME_CHANNELS.newDoc, opts);
  },
  async newSheet(opts) {
    await electron.ipcRenderer.invoke(HOME_CHANNELS.newSheet, opts);
  },
  async newSlide(opts) {
    await electron.ipcRenderer.invoke(HOME_CHANNELS.newSlide, opts);
  },
  async newMarkdown(opts) {
    await electron.ipcRenderer.invoke(HOME_CHANNELS.newMarkdown, opts);
  },
  async newHwp(opts) {
    await electron.ipcRenderer.invoke(HOME_CHANNELS.newHwp, opts);
  },
  async newPdf(opts) {
    await electron.ipcRenderer.invoke(HOME_CHANNELS.newPdf, opts);
  },
  async removeRecent(paths) {
    await electron.ipcRenderer.invoke(HOME_CHANNELS.removeRecent, paths);
  },
  async revealPath(path) {
    if (typeof path !== "string" || !path) throw new Error("Invalid path.");
    await electron.ipcRenderer.invoke(HOME_CHANNELS.revealPath, path);
  },
  async renameFile(path, newName) {
    if (typeof path !== "string" || !path) throw new Error("Invalid path.");
    const result = await electron.ipcRenderer.invoke(HOME_CHANNELS.renameFile, path, newName);
    return result ?? { ok: false, error: "Rename failed" };
  },
  async duplicateFile(path) {
    if (typeof path !== "string" || !path) throw new Error("Invalid path.");
    await electron.ipcRenderer.invoke(HOME_CHANNELS.duplicateFile, path);
  },
  async deleteFiles(paths) {
    await electron.ipcRenderer.invoke(HOME_CHANNELS.deleteFiles, paths);
  },
  async openTrash() {
    await electron.ipcRenderer.invoke(HOME_CHANNELS.openTrash);
  },
  async getLanguage() {
    const result = await electron.ipcRenderer.invoke(HOME_CHANNELS.getLanguage);
    return isUiLanguage(result) ? result : "zh";
  },
  async setLanguage(lang) {
    if (!isUiLanguage(lang)) throw new Error("Invalid language.");
    await electron.ipcRenderer.invoke(HOME_CHANNELS.setLanguage, lang);
  },
  async getTelemetryEnabled() {
    const result = await electron.ipcRenderer.invoke(HOME_CHANNELS.getTelemetryEnabled);
    return result !== false;
  },
  async setTelemetryEnabled(enabled) {
    await electron.ipcRenderer.invoke(HOME_CHANNELS.setTelemetryEnabled, enabled === true);
  },
  async getGlobalSummonEnabled() {
    const result = await electron.ipcRenderer.invoke(HOME_CHANNELS.getGlobalSummonEnabled);
    return result !== false;
  },
  async setGlobalSummonEnabled(enabled) {
    await electron.ipcRenderer.invoke(HOME_CHANNELS.setGlobalSummonEnabled, enabled === true);
  },
  async getGlobalSummonAccelerator() {
    const result = await electron.ipcRenderer.invoke(HOME_CHANNELS.getGlobalSummonAccelerator);
    return typeof result === "string" ? result : "CommandOrControl+Shift+B";
  },
  async setGlobalSummonAccelerator(accelerator) {
    await electron.ipcRenderer.invoke(HOME_CHANNELS.setGlobalSummonAccelerator, accelerator);
  },
  async getUpdateChannel() {
    const result = await electron.ipcRenderer.invoke(HOME_CHANNELS.getUpdateChannel);
    return result === "beta" ? "beta" : "stable";
  },
  async setUpdateChannel(channel) {
    if (channel !== "stable" && channel !== "beta") throw new Error("Invalid update channel.");
    await electron.ipcRenderer.invoke(HOME_CHANNELS.setUpdateChannel, channel);
  },
  async getAppVersion() {
    const result = await electron.ipcRenderer.invoke(HOME_CHANNELS.getAppVersion);
    return typeof result === "string" ? result : "";
  },
  async showChangelog() {
    await electron.ipcRenderer.invoke(HOME_CHANNELS.showChangelog);
  },
  async getStagedUpdate() {
    const result = await electron.ipcRenderer.invoke(HOME_CHANNELS.getStagedUpdate);
    return typeof result === "string" && result ? result : null;
  },
  async applyStagedUpdate() {
    await electron.ipcRenderer.invoke(HOME_CHANNELS.applyStagedUpdate);
  },
  async newWithAi(format, prompt) {
    await electron.ipcRenderer.invoke(HOME_CHANNELS.newWithAi, format, prompt);
  },
  onOpenSettings(handler) {
    const listener = () => handler();
    electron.ipcRenderer.on("app:open-settings", listener);
    return () => electron.ipcRenderer.removeListener("app:open-settings", listener);
  },
  onUpdateReady(handler) {
    const listener = (_event, version) => {
      if (typeof version === "string" && version) handler(version);
    };
    electron.ipcRenderer.on("app:update-ready", listener);
    return () => electron.ipcRenderer.removeListener("app:update-ready", listener);
  },
  async onboardingSeen() {
    const result = await electron.ipcRenderer.invoke(HOME_CHANNELS.onboardingSeen);
    return result === true;
  },
  async setOnboardingSeen() {
    const result = await electron.ipcRenderer.invoke(HOME_CHANNELS.setOnboardingSeen);
    return result === true;
  },
  async getTheme() {
    const result = await electron.ipcRenderer.invoke(HOME_CHANNELS.getTheme);
    return result === "dark" || result === "light" ? result : "system";
  },
  async setTheme(theme) {
    if (theme !== "light" && theme !== "dark" && theme !== "system")
      throw new Error("Invalid theme.");
    await electron.ipcRenderer.invoke(HOME_CHANNELS.setTheme, theme);
  },
  async getDefaultSaveDir() {
    const result = await electron.ipcRenderer.invoke(HOME_CHANNELS.getDefaultSaveDir);
    return typeof result === "string" ? result : "";
  },
  async pickDefaultSaveDir() {
    const result = await electron.ipcRenderer.invoke(HOME_CHANNELS.pickDefaultSaveDir);
    return typeof result === "string" && result ? result : null;
  },
  onThemeChanged(handler) {
    const listener = (_event, theme) => {
      if (theme === "light" || theme === "dark" || theme === "system") handler(theme);
    };
    electron.ipcRenderer.on("app:theme-changed", listener);
    return () => electron.ipcRenderer.removeListener("app:theme-changed", listener);
  },
  async openBatiSite() {
    await electron.ipcRenderer.invoke(HOME_CHANNELS.openBatiSite);
  },
  async starPromptShouldShow() {
    const result = await electron.ipcRenderer.invoke(HOME_CHANNELS.starPromptShouldShow);
    const raw = result ?? {};
    return {
      show: raw.show === true,
      docOpens: typeof raw.docOpens === "number" && Number.isFinite(raw.docOpens) ? raw.docOpens : 0
    };
  },
  async starPromptAction(action) {
    if (action !== "starred" && action !== "later") throw new Error("Invalid star prompt action.");
    await electron.ipcRenderer.invoke(HOME_CHANNELS.starPromptAction, action);
  }
};
electron.contextBridge.exposeInMainWorld("aiOffice", homeApi);
const projectApi = {
  async listProjects() {
    const result = await electron.ipcRenderer.invoke(PROJECT_CHANNELS.list);
    return Array.isArray(result) ? result : [];
  },
  async listFiles(projectId) {
    const result = await electron.ipcRenderer.invoke(PROJECT_CHANNELS.files, { projectId });
    return Array.isArray(result) ? result.filter((path) => typeof path === "string") : [];
  },
  async createProject(name) {
    const result = await electron.ipcRenderer.invoke(PROJECT_CHANNELS.create, { name });
    return result;
  },
  async renameProject(id, name) {
    await electron.ipcRenderer.invoke(PROJECT_CHANNELS.rename, { id, name });
  },
  async deleteProject(id) {
    await electron.ipcRenderer.invoke(PROJECT_CHANNELS.delete, { id });
  },
  async moveFile(filePath, projectId) {
    await electron.ipcRenderer.invoke(PROJECT_CHANNELS.moveFile, { filePath, projectId });
  },
  async getTimeline(projectId, limit) {
    const result = await electron.ipcRenderer.invoke(PROJECT_CHANNELS.timeline, {
      projectId,
      limit
    });
    return Array.isArray(result) ? result : [];
  }
};
electron.contextBridge.exposeInMainWorld("aiOfficeProject", projectApi);
const tabsApi = {
  async list() {
    const result = await electron.ipcRenderer.invoke(TABS_CHANNELS.list);
    return Array.isArray(result) ? result : [];
  },
  async activate(id) {
    await electron.ipcRenderer.invoke(TABS_CHANNELS.activate, id);
  },
  async close(id) {
    await electron.ipcRenderer.invoke(TABS_CHANNELS.close, id);
  },
  async showMenu(x, y) {
    await electron.ipcRenderer.invoke(TABS_CHANNELS.showMenu, x, y);
  },
  // The tab strip reserves space for window controls, and which side they sit
  // on is platform-dependent: traffic lights left on macOS, the overlay right
  // on Windows. The renderer cannot see process.platform from a sandbox.
  platform: process.platform,
  async showAppMenu(x, y) {
    await electron.ipcRenderer.invoke(TABS_CHANNELS.showAppMenu, x, y);
  },
  async showNewMenu(x, y) {
    await electron.ipcRenderer.invoke(TABS_CHANNELS.showNewMenu, x, y);
  },
  async reorder(id, toIndex) {
    await electron.ipcRenderer.invoke(TABS_CHANNELS.reorder, id, toIndex);
  },
  async openWorkspace() {
    await electron.ipcRenderer.invoke(TABS_CHANNELS.openWorkspace);
  },
  onChanged(handler) {
    const listener = (_event, tabs) => handler(tabs);
    electron.ipcRenderer.on(TABS_CHANNELS.changed, listener);
    return () => electron.ipcRenderer.removeListener(TABS_CHANNELS.changed, listener);
  },
  notifyChromePressed() {
    electron.ipcRenderer.send(TABS_CHANNELS.chromePressed);
  },
  onChromePressed(handler) {
    const listener = () => handler();
    electron.ipcRenderer.on("app:chrome-pressed", listener);
    return () => electron.ipcRenderer.removeListener("app:chrome-pressed", listener);
  }
};
electron.contextBridge.exposeInMainWorld("aiOfficeTabs", tabsApi);
electron.contextBridge.exposeInMainWorld(
  "batiofficeAccount",
  createDesktopAccountRendererApi(
    (channel, input) => electron.ipcRenderer.invoke(channel, input),
    (channel, handler) => {
      const listener = (_event, input) => handler(input);
      electron.ipcRenderer.on(channel, listener);
      return () => electron.ipcRenderer.removeListener(channel, listener);
    }
  )
);
