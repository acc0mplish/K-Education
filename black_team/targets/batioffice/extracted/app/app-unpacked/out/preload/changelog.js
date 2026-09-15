"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("batiChangelog", {
  get: () => electron.ipcRenderer.invoke("changelog:get")
});
