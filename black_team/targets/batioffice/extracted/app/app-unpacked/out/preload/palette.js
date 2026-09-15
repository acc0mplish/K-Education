"use strict";
const electron = require("electron");
const PALETTE_CHANNELS = {
  getState: "palette:get-state",
  execute: "palette:execute",
  close: "palette:close"
};
const api = {
  async getState() {
    const result = await electron.ipcRenderer.invoke(PALETTE_CHANNELS.getState);
    return result ?? null;
  },
  execute(command) {
    void electron.ipcRenderer.invoke(PALETTE_CHANNELS.execute, command);
  },
  close() {
    void electron.ipcRenderer.invoke(PALETTE_CHANNELS.close);
  },
  onRefresh(handler) {
    const listener = () => handler();
    electron.ipcRenderer.on("palette:refresh", listener);
    return () => electron.ipcRenderer.removeListener("palette:refresh", listener);
  }
};
electron.contextBridge.exposeInMainWorld("aiOfficePalette", api);
