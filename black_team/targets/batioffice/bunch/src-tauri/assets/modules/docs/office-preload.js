// bunch office preload bridge (standalone, non-module).
//
// The prebuilt office renderer bundles (docs / sheets / slides) and the rhwp
// engine were built for an Electron host where a preload script exposes an
// Electron `ipcRenderer` surface via `contextBridge`. Tauri v2 has no Electron
// and (since 2.x) no preload-script mechanism for dynamically-created windows —
// the `preloadScripts` option on a WebviewWindow is silently ignored. So this
// script is injected as a classic <script> before the engine module runs and
// re-creates that surface on top of Tauri's `window.__TAURI_INTERNALS__` and
// the event plugin.
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

(function () {
  var g = globalThis;
  var internal = g.__TAURI_INTERNALS__;
  var eventPlugin = g.__TAURI_EVENT_PLUGIN_INTERNALS__;

  // --- Tauri invoke ---------------------------------------------------------
  function invoke(cmd, args) {
    if (internal && typeof internal.invoke === "function") {
      return internal.invoke(cmd, args || {});
    }
    return Promise.reject(new Error("Tauri invoke unavailable: " + cmd));
  }

  // --- Tauri emit (plugin:event|emit) --------------------------------------
  function emit(event, payload) {
    return invoke("plugin:event|emit", { event: event, payload: payload });
  }

  // --- Tauri listen (plugin:event|listen) ----------------------------------
  function listen(channel, cb) {
    return new Promise(function (resolve) {
      if (!eventPlugin || typeof eventPlugin.addListener !== "function") {
        // Fallback: no backend events in this port.
        resolve(function () {});
        return;
      }
      eventPlugin.addListener(channel, function (event) {
        if (event) {
          event.preventDefault && event.preventDefault();
          event.stopPropagation && event.stopPropagation();
        }
        cb(event);
      }).then(function (unlisten) {
        resolve(function () {
          try {
            invoke("plugin:event|unlisten", { event: channel, id: eventPlugin.unlistenId && unlisten });
          } catch (_) {}
          try {
            eventPlugin.removeListener(channel, unlisten);
          } catch (_) {}
        });
      });
    });
  }

  g.invoke = invoke;
  g.emit = emit;
  g.listen = listen;

  // --- base64 helpers -------------------------------------------------------
  function base64ToBytes(b64) {
    if (typeof g.atob === "function") {
      var bin = "";
      for (var i = 0; i < b64.length; i += 32) {
        bin += g.atob(b64.slice(i, i + 32));
      }
      var out = new Uint8Array(bin.length);
      for (var j = 0; j < bin.length; j++) out[j] = bin.charCodeAt(j);
      return out;
    }
    return Uint8Array.from(g.Buffer.from(b64, "base64"));
  }

  function bytesToBase64(bytes) {
    var u = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
    var bin = "";
    var chunk = 0x8000;
    for (var i = 0; i < u.length; i += chunk) {
      bin += String.fromCharCode.apply(null, u.subarray(i, i + chunk));
    }
    if (typeof g.btoa === "function") return g.btoa(bin);
    return g.Buffer.from(bin, "binary").toString("base64");
  }

  g.base64ToBytes = base64ToBytes;

  // --- Node-ish polyfills the bundles expect --------------------------------
  try {
    if (!g.Buffer || typeof g.Buffer.from !== "function") {
      g.Buffer = {
        from: function (a) { return a instanceof Uint8Array ? a : base64ToBytes(String(a)); },
        isBuffer: function () { return false; },
        byteLength: function (a) { return (a && a.length) || 0; },
      };
    }
  } catch (e) {}
  g.setImmediate = function (cb) { return setTimeout(function () { cb(); }, 0); };
  g.clearImmediate = function (id) { clearTimeout(id); };
  if (!g.process || !g.process.env) {
    g.process = { env: { NODE_ENV: "production" }, nextTick: function (cb) { setTimeout(cb, 0); } };
  }
  if (!g.window) g.window = g;

  // --- docs (docx) desktop API ---------------------------------------------
  var noop = function () { return Promise.resolve({}); };
  var emptyList = function () { return Promise.resolve([]); }

  function toOpenResult(r) {
    if (r.needsPassword) {
      return { data: new ArrayBuffer(0), path: r.path || null, name: r.name, size: r.size || 0, needsPassword: true };
    }
    return { data: base64ToBytes(r.base64), path: r.path || null, name: r.name, size: r.size || 0 };
  }

  var desktopApi = {
    // --- open ---
    openDocx: function () { return invoke("office_open", { kind: "docx", blank: true }).then(toOpenResult); },
    openDocxPath: function (path) { return invoke("office_open", { path: path, blank: false }).then(toOpenResult); },
    openDocxDecrypt: function (path, password) { return invoke("office_open", { path: path, password: password }).then(toOpenResult); },
    setDocPassword: function (filePath, password) { return invoke("office_open", { path: filePath, password: password }); },
    docPasswordIntentRevision: function () { return Promise.resolve(0); },
    discardDocPasswordIntents: function () { return Promise.resolve(true); },
    consumePendingOpenDocx: function () { return Promise.resolve({}); },
    consumeNewBlankDoc: function () { return Promise.resolve({}); },
    consumeAiDocContent: function () { return Promise.resolve({}); },
    consumeAiPrompt: function () { return Promise.resolve({}); },
    createDocument: function (request) { return invoke("office_open", { kind: "docx", blank: true, request: request }); },
    // --- save ---
    saveDocx: function (path, data, auto) { return invoke("office_save", { path: path, data: bytesToBase64(data), auto: auto === true }); },
    saveDocxAs: function (defaultName, data, sourcePath) { return invoke("office_save", { path: defaultName, data: bytesToBase64(data), sourcePath: sourcePath, auto: false }); },
    saveDocxNew: function (defaultName, data) { return invoke("office_save", { path: defaultName, data: bytesToBase64(data), auto: false }); },
    writeRecoveryCopy: function (path, data) { return invoke("office_save", { path: path, data: bytesToBase64(data) }); },
    getRecentFiles: function () { return invoke("office_recent", { kind: "docx" }); },
    pickImage: noop,
    readAttachment: function (path, offset, maxChars) { return invoke("files_read", { path: path }); },
    pickAttachments: emptyList,
    addAttachmentPaths: emptyList,
    addPastedImage: function () { return Promise.resolve({}); },
    copyImageToClipboard: function () { return Promise.resolve({}); },
    fontMetrics: function () { return Promise.resolve(null); },
    exportPdf: function () { return Promise.resolve({}); },
    printPdfBuffer: function () { return Promise.resolve({}); },
    saveMergedPdf: function () { return Promise.resolve({}); },
    print: function () { return Promise.resolve({}); },
    getPathForFile: function (file) { return Promise.resolve(file && file.path || null); },
    // --- tabs / window (single-window port => stubs) ---
    openNewTab: function () { return Promise.resolve({}); },
    listDocsTabs: emptyList,
    focusDocsTab: function () { return Promise.resolve(false); },
    // --- settings / events ---
    getLanguage: function () { return invoke("get_language"); },
    getTheme: function () { return invoke("get_theme"); },
    getAiSettings: function () { return Promise.resolve({ provider: "bati" }); },
    setAiSettings: function () { return Promise.resolve(true); },
    onOpenedDocx: function (h) { return listen("docs_opened", function (e) { h(e.payload); }).then(function (u) { return u; }); },
    onRenamedDocx: function (h) { return listen("docs_renamed", function (e) { h(e.payload); }).then(function (u) { return u; }); },
    onTeardown: function (h) { return listen("docs_teardown", function () { h(); }).then(function (u) { return u; }); },
    onCloseCheck: function (h) { return listen("docs_close_check", function () { h(); }).then(function (u) { return u; }); },
    onAiStream: noop,
    onMenuCommand: noop,
    onCloseSaveRequest: noop,
    onLanguageChanged: noop,
    onThemeChanged: noop,
    onChromePressed: noop,
    onAiSettingsChanged: noop,
    // --- Bati cloud / AI (cut) ---
    aiChat: function () { return Promise.resolve({}); },
    aiStream: function () { return Promise.resolve({}); },
    aiStreamCancel: function () { return Promise.resolve(true); },
    probeAiProvider: function () { return Promise.resolve(null); },
    getOllamaHostInfo: function () { return Promise.resolve(null); },
    getOllamaRuntimeStatus: function () { return Promise.resolve("stopped"); },
    aiBatiAccountSummary: function () { return Promise.resolve(null); },
    webSearch: function () { return Promise.resolve([]); },
    imageSearch: function () { return Promise.resolve([]); },
    fetchImage: function () { return Promise.resolve(null); },
    aiGenerateImage: function () { return Promise.resolve(null); },
    aiBatiLogin: function () { return Promise.resolve({}); },
    reportViewMenuState: function (s) { return emit("docs_view_menu_state", s); },
    reportCloseCheck: function (s) { return emit("docs_close_check_result", s); },
    reportCloseSaveResult: function (ok) { return emit("docs_close_save_result", ok); },
  };

  var projectApi = {
    listProjects: function () { return invoke("project_list"); },
    createProject: function (args) { return invoke("project_create", args); },
    renameProject: function (args) { return invoke("project_rename", args); },
    deleteProject: function (args) { return invoke("project_delete", args); },
    moveFile: function (args) { return invoke("project_move", args); },
    getTimeline: function (args) { return invoke("project_timeline", args); },
    resolveChat: function () { return Promise.resolve({}); },
    startChat: function () { return Promise.resolve({}); },
    listChatThreads: function () { return Promise.resolve([]); },
    activateChatThread: function () { return Promise.resolve(false); },
    appendChat: function () { return Promise.resolve({}); },
    loadChat: function () { return Promise.resolve({}); },
    rebindChat: function () { return Promise.resolve({}); },
  };

  g.desktop = desktopApi;
  g.projectApi = projectApi;
  g.window.desktop = desktopApi;
  g.window.projectApi = projectApi;

  // Open the initial document the shell passed via `?bunchOpen=<path>` once the
  // bundle has finished defining `window.desktop`.
  (function openInitial() {
    var params = new URLSearchParams(g.location ? g.location.search : "");
    var initial = params.get("bunchOpen");
    if (!initial) return;
    function wait() {
      var desk = (g.window && g.window.desktop) || g.desktop;
      if (desk && desk.openDocxPath) {
        desk.openDocxPath(initial);
      } else {
        setTimeout(wait, 50);
      }
    }
    wait();
  })();
})();
