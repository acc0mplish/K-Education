"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
const node_fs = require("node:fs");
const promises = require("node:fs/promises");
const node_os = require("node:os");
const node_path = require("node:path");
const node_url = require("node:url");
const electron = require("electron");
require("node:dns/promises");
const node_net = require("node:net");
require("node:child_process");
const node_crypto = require("node:crypto");
const EN = { cut: "Cut", copy: "Copy", paste: "Paste", selectAll: "Select All" };
const LABELS = {
  zh: { cut: "剪切", copy: "复制", paste: "粘贴", selectAll: "全选" },
  en: EN,
  ja: { cut: "切り取り", copy: "コピー", paste: "貼り付け", selectAll: "すべて選択" },
  ko: { cut: "잘라내기", copy: "복사", paste: "붙여넣기", selectAll: "모두 선택" },
  fr: { cut: "Couper", copy: "Copier", paste: "Coller", selectAll: "Tout sélectionner" },
  de: { cut: "Ausschneiden", copy: "Kopieren", paste: "Einfügen", selectAll: "Alles auswählen" },
  es: { cut: "Cortar", copy: "Copiar", paste: "Pegar", selectAll: "Seleccionar todo" },
  th: { cut: "ตัด", copy: "คัดลอก", paste: "วาง", selectAll: "เลือกทั้งหมด" },
  id: { cut: "Potong", copy: "Salin", paste: "Tempel", selectAll: "Pilih Semua" },
  ru: { cut: "Вырезать", copy: "Копировать", paste: "Вставить", selectAll: "Выделить все" },
  ar: { cut: "قص", copy: "نسخ", paste: "لصق", selectAll: "تحديد الكل" },
  pt: { cut: "Recortar", copy: "Copiar", paste: "Colar", selectAll: "Selecionar Tudo" },
  it: { cut: "Taglia", copy: "Copia", paste: "Incolla", selectAll: "Seleziona tutto" },
  pl: { cut: "Wytnij", copy: "Kopiuj", paste: "Wklej", selectAll: "Zaznacz wszystko" },
  nl: { cut: "Knippen", copy: "Kopiëren", paste: "Plakken", selectAll: "Alles selecteren" },
  ms: { cut: "Potong", copy: "Salin", paste: "Tampal", selectAll: "Pilih Semua" },
  he: { cut: "גזור", copy: "העתק", paste: "הדבק", selectAll: "בחר הכול" },
  hi: { cut: "काटें", copy: "कॉपी करें", paste: "चिपकाएँ", selectAll: "सभी चुनें" },
  "zh-TW": { cut: "剪下", copy: "複製", paste: "貼上", selectAll: "全選" }
};
function contextMenuLabels(lang) {
  return LABELS[lang] ?? EN;
}
function buildContextMenuItems(params, labels) {
  const flags = params.editFlags;
  if (params.isEditable) {
    const items = [];
    if (params.misspelledWord && params.dictionarySuggestions.length) {
      for (const word of params.dictionarySuggestions)
        items.push({ action: "replaceMisspelling", label: word });
      items.push({ type: "separator" });
    }
    items.push(
      { action: "cut", label: labels.cut, enabled: flags.canCut },
      { action: "copy", label: labels.copy, enabled: flags.canCopy },
      { action: "paste", label: labels.paste, enabled: flags.canPaste },
      { type: "separator" },
      { action: "selectAll", label: labels.selectAll, enabled: flags.canSelectAll }
    );
    return items;
  }
  if (params.selectionText.trim()) {
    return [
      { action: "copy", label: labels.copy, enabled: flags.canCopy },
      { action: "selectAll", label: labels.selectAll, enabled: flags.canSelectAll }
    ];
  }
  return [];
}
const INSTALLED$1 = /* @__PURE__ */ Symbol.for("genoffice.context-menu-installed");
function installContextMenu(app, getLabels) {
  const holder = app;
  if (holder[INSTALLED$1]) return;
  holder[INSTALLED$1] = true;
  app.on("web-contents-created", (_event, contents) => {
    contents.on("context-menu", (_e, params) => {
      void popupMenu(contents, params, getLabels());
    });
  });
}
async function popupMenu(contents, params, labels) {
  const items = buildContextMenuItems(params, labels);
  if (!items.length) return;
  const { Menu } = await import("electron");
  const template = items.map((item) => {
    if ("type" in item) return { type: "separator" };
    if (item.action === "replaceMisspelling")
      return { label: item.label, click: () => contents.replaceMisspelling(item.label) };
    const action = item.action;
    return { label: item.label, enabled: item.enabled, click: () => contents[action]() };
  });
  Menu.buildFromTemplate(template).popup();
}
const lastUsedDirectoryByDialog = /* @__PURE__ */ new WeakMap();
function withRememberedDirectory(dialog, options, fallbackDir) {
  const lastDir = lastUsedDirectoryByDialog.get(dialog) ?? fallbackDir;
  if (!lastDir) return options;
  if (options.defaultPath === void 0) return { ...options, defaultPath: lastDir };
  if (node_path.basename(options.defaultPath) === options.defaultPath) {
    return { ...options, defaultPath: node_path.join(lastDir, options.defaultPath) };
  }
  return options;
}
async function showOpenDialogWithMemory(dialog, parent, options, fallbackDir) {
  const withDir = withRememberedDirectory(dialog, options, fallbackDir);
  const result = parent ? await dialog.showOpenDialog(parent, withDir) : await dialog.showOpenDialog(withDir);
  const picked = result.filePaths[0];
  if (!result.canceled && picked) {
    lastUsedDirectoryByDialog.set(
      dialog,
      options.properties?.includes("openDirectory") ? picked : node_path.dirname(picked)
    );
  }
  return result;
}
async function showSaveDialogWithMemory(dialog, parent, options, fallbackDir) {
  const withDir = withRememberedDirectory(dialog, options, fallbackDir);
  const result = parent ? await dialog.showSaveDialog(parent, withDir) : await dialog.showSaveDialog(withDir);
  if (!result.canceled && result.filePath) {
    lastUsedDirectoryByDialog.set(dialog, node_path.dirname(result.filePath));
  }
  return result;
}
const DEFAULT_SAVE_DIR_KEY = "defaultSaveDir";
const DEFAULT_SAVE_DIR_NAME = "BatiOffice";
const LEGACY_DEFAULT_SAVE_DIR_NAME = "GenOffice";
function readDefaultSaveDirSetting(settingsPath) {
  try {
    const raw = JSON.parse(node_fs.readFileSync(settingsPath, "utf8"));
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
    const value = raw[DEFAULT_SAVE_DIR_KEY];
    return typeof value === "string" && node_path.isAbsolute(value) ? value : null;
  } catch {
    return null;
  }
}
function isUsableSaveDir(dir) {
  try {
    node_fs.mkdirSync(dir, { recursive: true });
    node_fs.accessSync(dir, node_fs.constants.W_OK);
    return true;
  } catch {
    return false;
  }
}
function resolveDefaultSaveDir(configured, fallbackDir) {
  if (configured && isUsableSaveDir(configured)) return configured;
  node_fs.mkdirSync(fallbackDir, { recursive: true });
  return fallbackDir;
}
function configuredDefaultSaveDir(app) {
  const settingsPath = node_path.join(app.getPath("userData"), "app-settings.json");
  const documentsDir = app.getPath("documents");
  const fallback = node_path.join(documentsDir, DEFAULT_SAVE_DIR_NAME);
  const configured = readDefaultSaveDirSetting(settingsPath);
  const legacyDefault = node_path.join(documentsDir, LEGACY_DEFAULT_SAVE_DIR_NAME);
  return resolveDefaultSaveDir(configured === legacyDefault ? null : configured, fallback);
}
const REGENERABLE_USER_DATA_ENTRIES = [
  "Cache",
  "Code Cache",
  "GPUCache",
  "DawnCache",
  "DawnGraphiteCache",
  "DawnWebGPUCache",
  "ShaderCache",
  "GrShaderCache",
  "Service Worker",
  "blob_storage",
  "Crashpad"
];
new Set(REGENERABLE_USER_DATA_ENTRIES);
const INSTALLED = /* @__PURE__ */ Symbol.for("genoffice.navigation-guard-installed");
function installNavigationGuard(app) {
  const holder = app;
  if (holder[INSTALLED]) return;
  holder[INSTALLED] = true;
  app.on("web-contents-created", (_event, contents) => {
    contents.on("will-navigate", (event) => {
      const current = contents.getURL();
      if (!current || current === "about:blank") return;
      if (event.url !== current) event.preventDefault();
    });
    contents.setWindowOpenHandler(() => ({ action: "deny" }));
  });
}
const DEFAULT_PROTOCOLS = ["http:", "https:"];
function safeExternalUrl(url, options) {
  if (typeof url !== "string") return null;
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  const allowed = options?.allowedProtocols ?? DEFAULT_PROTOCOLS;
  return allowed.includes(parsed.protocol) ? url : null;
}
(() => {
  const list = new node_net.BlockList();
  list.addSubnet("0.0.0.0", 8);
  list.addSubnet("10.0.0.0", 8);
  list.addSubnet("100.64.0.0", 10);
  list.addSubnet("127.0.0.0", 8);
  list.addSubnet("169.254.0.0", 16);
  list.addSubnet("172.16.0.0", 12);
  list.addSubnet("192.0.0.0", 24);
  list.addSubnet("192.168.0.0", 16);
  list.addSubnet("198.18.0.0", 15);
  list.addSubnet("224.0.0.0", 4);
  list.addSubnet("240.0.0.0", 4);
  list.addAddress("::", "ipv6");
  list.addAddress("::1", "ipv6");
  list.addSubnet("::", 96, "ipv6");
  list.addSubnet("64:ff9b::", 96, "ipv6");
  list.addSubnet("fc00::", 7, "ipv6");
  list.addSubnet("fe80::", 10, "ipv6");
  list.addSubnet("ff00::", 8, "ipv6");
  return list;
})();
var CODE_POINTS;
(function(CODE_POINTS2) {
  CODE_POINTS2[CODE_POINTS2["EOF"] = -1] = "EOF";
  CODE_POINTS2[CODE_POINTS2["NULL"] = 0] = "NULL";
  CODE_POINTS2[CODE_POINTS2["TABULATION"] = 9] = "TABULATION";
  CODE_POINTS2[CODE_POINTS2["CARRIAGE_RETURN"] = 13] = "CARRIAGE_RETURN";
  CODE_POINTS2[CODE_POINTS2["LINE_FEED"] = 10] = "LINE_FEED";
  CODE_POINTS2[CODE_POINTS2["FORM_FEED"] = 12] = "FORM_FEED";
  CODE_POINTS2[CODE_POINTS2["SPACE"] = 32] = "SPACE";
  CODE_POINTS2[CODE_POINTS2["EXCLAMATION_MARK"] = 33] = "EXCLAMATION_MARK";
  CODE_POINTS2[CODE_POINTS2["QUOTATION_MARK"] = 34] = "QUOTATION_MARK";
  CODE_POINTS2[CODE_POINTS2["AMPERSAND"] = 38] = "AMPERSAND";
  CODE_POINTS2[CODE_POINTS2["APOSTROPHE"] = 39] = "APOSTROPHE";
  CODE_POINTS2[CODE_POINTS2["HYPHEN_MINUS"] = 45] = "HYPHEN_MINUS";
  CODE_POINTS2[CODE_POINTS2["SOLIDUS"] = 47] = "SOLIDUS";
  CODE_POINTS2[CODE_POINTS2["DIGIT_0"] = 48] = "DIGIT_0";
  CODE_POINTS2[CODE_POINTS2["DIGIT_9"] = 57] = "DIGIT_9";
  CODE_POINTS2[CODE_POINTS2["SEMICOLON"] = 59] = "SEMICOLON";
  CODE_POINTS2[CODE_POINTS2["LESS_THAN_SIGN"] = 60] = "LESS_THAN_SIGN";
  CODE_POINTS2[CODE_POINTS2["EQUALS_SIGN"] = 61] = "EQUALS_SIGN";
  CODE_POINTS2[CODE_POINTS2["GREATER_THAN_SIGN"] = 62] = "GREATER_THAN_SIGN";
  CODE_POINTS2[CODE_POINTS2["QUESTION_MARK"] = 63] = "QUESTION_MARK";
  CODE_POINTS2[CODE_POINTS2["LATIN_CAPITAL_A"] = 65] = "LATIN_CAPITAL_A";
  CODE_POINTS2[CODE_POINTS2["LATIN_CAPITAL_Z"] = 90] = "LATIN_CAPITAL_Z";
  CODE_POINTS2[CODE_POINTS2["RIGHT_SQUARE_BRACKET"] = 93] = "RIGHT_SQUARE_BRACKET";
  CODE_POINTS2[CODE_POINTS2["GRAVE_ACCENT"] = 96] = "GRAVE_ACCENT";
  CODE_POINTS2[CODE_POINTS2["LATIN_SMALL_A"] = 97] = "LATIN_SMALL_A";
  CODE_POINTS2[CODE_POINTS2["LATIN_SMALL_Z"] = 122] = "LATIN_SMALL_Z";
})(CODE_POINTS || (CODE_POINTS = {}));
var ERR;
(function(ERR2) {
  ERR2["controlCharacterInInputStream"] = "control-character-in-input-stream";
  ERR2["noncharacterInInputStream"] = "noncharacter-in-input-stream";
  ERR2["surrogateInInputStream"] = "surrogate-in-input-stream";
  ERR2["nonVoidHtmlElementStartTagWithTrailingSolidus"] = "non-void-html-element-start-tag-with-trailing-solidus";
  ERR2["endTagWithAttributes"] = "end-tag-with-attributes";
  ERR2["endTagWithTrailingSolidus"] = "end-tag-with-trailing-solidus";
  ERR2["unexpectedSolidusInTag"] = "unexpected-solidus-in-tag";
  ERR2["unexpectedNullCharacter"] = "unexpected-null-character";
  ERR2["unexpectedQuestionMarkInsteadOfTagName"] = "unexpected-question-mark-instead-of-tag-name";
  ERR2["invalidFirstCharacterOfTagName"] = "invalid-first-character-of-tag-name";
  ERR2["unexpectedEqualsSignBeforeAttributeName"] = "unexpected-equals-sign-before-attribute-name";
  ERR2["missingEndTagName"] = "missing-end-tag-name";
  ERR2["unexpectedCharacterInAttributeName"] = "unexpected-character-in-attribute-name";
  ERR2["unknownNamedCharacterReference"] = "unknown-named-character-reference";
  ERR2["missingSemicolonAfterCharacterReference"] = "missing-semicolon-after-character-reference";
  ERR2["unexpectedCharacterAfterDoctypeSystemIdentifier"] = "unexpected-character-after-doctype-system-identifier";
  ERR2["unexpectedCharacterInUnquotedAttributeValue"] = "unexpected-character-in-unquoted-attribute-value";
  ERR2["eofBeforeTagName"] = "eof-before-tag-name";
  ERR2["eofInTag"] = "eof-in-tag";
  ERR2["missingAttributeValue"] = "missing-attribute-value";
  ERR2["missingWhitespaceBetweenAttributes"] = "missing-whitespace-between-attributes";
  ERR2["missingWhitespaceAfterDoctypePublicKeyword"] = "missing-whitespace-after-doctype-public-keyword";
  ERR2["missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers"] = "missing-whitespace-between-doctype-public-and-system-identifiers";
  ERR2["missingWhitespaceAfterDoctypeSystemKeyword"] = "missing-whitespace-after-doctype-system-keyword";
  ERR2["missingQuoteBeforeDoctypePublicIdentifier"] = "missing-quote-before-doctype-public-identifier";
  ERR2["missingQuoteBeforeDoctypeSystemIdentifier"] = "missing-quote-before-doctype-system-identifier";
  ERR2["missingDoctypePublicIdentifier"] = "missing-doctype-public-identifier";
  ERR2["missingDoctypeSystemIdentifier"] = "missing-doctype-system-identifier";
  ERR2["abruptDoctypePublicIdentifier"] = "abrupt-doctype-public-identifier";
  ERR2["abruptDoctypeSystemIdentifier"] = "abrupt-doctype-system-identifier";
  ERR2["cdataInHtmlContent"] = "cdata-in-html-content";
  ERR2["incorrectlyOpenedComment"] = "incorrectly-opened-comment";
  ERR2["eofInScriptHtmlCommentLikeText"] = "eof-in-script-html-comment-like-text";
  ERR2["eofInDoctype"] = "eof-in-doctype";
  ERR2["nestedComment"] = "nested-comment";
  ERR2["abruptClosingOfEmptyComment"] = "abrupt-closing-of-empty-comment";
  ERR2["eofInComment"] = "eof-in-comment";
  ERR2["incorrectlyClosedComment"] = "incorrectly-closed-comment";
  ERR2["eofInCdata"] = "eof-in-cdata";
  ERR2["absenceOfDigitsInNumericCharacterReference"] = "absence-of-digits-in-numeric-character-reference";
  ERR2["nullCharacterReference"] = "null-character-reference";
  ERR2["surrogateCharacterReference"] = "surrogate-character-reference";
  ERR2["characterReferenceOutsideUnicodeRange"] = "character-reference-outside-unicode-range";
  ERR2["controlCharacterReference"] = "control-character-reference";
  ERR2["noncharacterCharacterReference"] = "noncharacter-character-reference";
  ERR2["missingWhitespaceBeforeDoctypeName"] = "missing-whitespace-before-doctype-name";
  ERR2["missingDoctypeName"] = "missing-doctype-name";
  ERR2["invalidCharacterSequenceAfterDoctypeName"] = "invalid-character-sequence-after-doctype-name";
  ERR2["duplicateAttribute"] = "duplicate-attribute";
  ERR2["nonConformingDoctype"] = "non-conforming-doctype";
  ERR2["missingDoctype"] = "missing-doctype";
  ERR2["misplacedDoctype"] = "misplaced-doctype";
  ERR2["endTagWithoutMatchingOpenElement"] = "end-tag-without-matching-open-element";
  ERR2["closingOfElementWithOpenChildElements"] = "closing-of-element-with-open-child-elements";
  ERR2["disallowedContentInNoscriptInHead"] = "disallowed-content-in-noscript-in-head";
  ERR2["openElementsLeftAfterEof"] = "open-elements-left-after-eof";
  ERR2["abandonedHeadElementChild"] = "abandoned-head-element-child";
  ERR2["misplacedStartTagForHeadElement"] = "misplaced-start-tag-for-head-element";
  ERR2["nestedNoscriptInHead"] = "nested-noscript-in-head";
  ERR2["eofInElementThatCanContainOnlyText"] = "eof-in-element-that-can-contain-only-text";
})(ERR || (ERR = {}));
var TokenType;
(function(TokenType2) {
  TokenType2[TokenType2["CHARACTER"] = 0] = "CHARACTER";
  TokenType2[TokenType2["NULL_CHARACTER"] = 1] = "NULL_CHARACTER";
  TokenType2[TokenType2["WHITESPACE_CHARACTER"] = 2] = "WHITESPACE_CHARACTER";
  TokenType2[TokenType2["START_TAG"] = 3] = "START_TAG";
  TokenType2[TokenType2["END_TAG"] = 4] = "END_TAG";
  TokenType2[TokenType2["COMMENT"] = 5] = "COMMENT";
  TokenType2[TokenType2["DOCTYPE"] = 6] = "DOCTYPE";
  TokenType2[TokenType2["EOF"] = 7] = "EOF";
  TokenType2[TokenType2["HIBERNATION"] = 8] = "HIBERNATION";
})(TokenType || (TokenType = {}));
var NS;
(function(NS2) {
  NS2["HTML"] = "http://www.w3.org/1999/xhtml";
  NS2["MATHML"] = "http://www.w3.org/1998/Math/MathML";
  NS2["SVG"] = "http://www.w3.org/2000/svg";
  NS2["XLINK"] = "http://www.w3.org/1999/xlink";
  NS2["XML"] = "http://www.w3.org/XML/1998/namespace";
  NS2["XMLNS"] = "http://www.w3.org/2000/xmlns/";
})(NS || (NS = {}));
var ATTRS;
(function(ATTRS2) {
  ATTRS2["TYPE"] = "type";
  ATTRS2["ACTION"] = "action";
  ATTRS2["ENCODING"] = "encoding";
  ATTRS2["PROMPT"] = "prompt";
  ATTRS2["NAME"] = "name";
  ATTRS2["COLOR"] = "color";
  ATTRS2["FACE"] = "face";
  ATTRS2["SIZE"] = "size";
})(ATTRS || (ATTRS = {}));
var DOCUMENT_MODE;
(function(DOCUMENT_MODE2) {
  DOCUMENT_MODE2["NO_QUIRKS"] = "no-quirks";
  DOCUMENT_MODE2["QUIRKS"] = "quirks";
  DOCUMENT_MODE2["LIMITED_QUIRKS"] = "limited-quirks";
})(DOCUMENT_MODE || (DOCUMENT_MODE = {}));
var TAG_NAMES;
(function(TAG_NAMES2) {
  TAG_NAMES2["A"] = "a";
  TAG_NAMES2["ADDRESS"] = "address";
  TAG_NAMES2["ANNOTATION_XML"] = "annotation-xml";
  TAG_NAMES2["APPLET"] = "applet";
  TAG_NAMES2["AREA"] = "area";
  TAG_NAMES2["ARTICLE"] = "article";
  TAG_NAMES2["ASIDE"] = "aside";
  TAG_NAMES2["B"] = "b";
  TAG_NAMES2["BASE"] = "base";
  TAG_NAMES2["BASEFONT"] = "basefont";
  TAG_NAMES2["BGSOUND"] = "bgsound";
  TAG_NAMES2["BIG"] = "big";
  TAG_NAMES2["BLOCKQUOTE"] = "blockquote";
  TAG_NAMES2["BODY"] = "body";
  TAG_NAMES2["BR"] = "br";
  TAG_NAMES2["BUTTON"] = "button";
  TAG_NAMES2["CAPTION"] = "caption";
  TAG_NAMES2["CENTER"] = "center";
  TAG_NAMES2["CODE"] = "code";
  TAG_NAMES2["COL"] = "col";
  TAG_NAMES2["COLGROUP"] = "colgroup";
  TAG_NAMES2["DD"] = "dd";
  TAG_NAMES2["DESC"] = "desc";
  TAG_NAMES2["DETAILS"] = "details";
  TAG_NAMES2["DIALOG"] = "dialog";
  TAG_NAMES2["DIR"] = "dir";
  TAG_NAMES2["DIV"] = "div";
  TAG_NAMES2["DL"] = "dl";
  TAG_NAMES2["DT"] = "dt";
  TAG_NAMES2["EM"] = "em";
  TAG_NAMES2["EMBED"] = "embed";
  TAG_NAMES2["FIELDSET"] = "fieldset";
  TAG_NAMES2["FIGCAPTION"] = "figcaption";
  TAG_NAMES2["FIGURE"] = "figure";
  TAG_NAMES2["FONT"] = "font";
  TAG_NAMES2["FOOTER"] = "footer";
  TAG_NAMES2["FOREIGN_OBJECT"] = "foreignObject";
  TAG_NAMES2["FORM"] = "form";
  TAG_NAMES2["FRAME"] = "frame";
  TAG_NAMES2["FRAMESET"] = "frameset";
  TAG_NAMES2["H1"] = "h1";
  TAG_NAMES2["H2"] = "h2";
  TAG_NAMES2["H3"] = "h3";
  TAG_NAMES2["H4"] = "h4";
  TAG_NAMES2["H5"] = "h5";
  TAG_NAMES2["H6"] = "h6";
  TAG_NAMES2["HEAD"] = "head";
  TAG_NAMES2["HEADER"] = "header";
  TAG_NAMES2["HGROUP"] = "hgroup";
  TAG_NAMES2["HR"] = "hr";
  TAG_NAMES2["HTML"] = "html";
  TAG_NAMES2["I"] = "i";
  TAG_NAMES2["IMG"] = "img";
  TAG_NAMES2["IMAGE"] = "image";
  TAG_NAMES2["INPUT"] = "input";
  TAG_NAMES2["IFRAME"] = "iframe";
  TAG_NAMES2["KEYGEN"] = "keygen";
  TAG_NAMES2["LABEL"] = "label";
  TAG_NAMES2["LI"] = "li";
  TAG_NAMES2["LINK"] = "link";
  TAG_NAMES2["LISTING"] = "listing";
  TAG_NAMES2["MAIN"] = "main";
  TAG_NAMES2["MALIGNMARK"] = "malignmark";
  TAG_NAMES2["MARQUEE"] = "marquee";
  TAG_NAMES2["MATH"] = "math";
  TAG_NAMES2["MENU"] = "menu";
  TAG_NAMES2["META"] = "meta";
  TAG_NAMES2["MGLYPH"] = "mglyph";
  TAG_NAMES2["MI"] = "mi";
  TAG_NAMES2["MO"] = "mo";
  TAG_NAMES2["MN"] = "mn";
  TAG_NAMES2["MS"] = "ms";
  TAG_NAMES2["MTEXT"] = "mtext";
  TAG_NAMES2["NAV"] = "nav";
  TAG_NAMES2["NOBR"] = "nobr";
  TAG_NAMES2["NOFRAMES"] = "noframes";
  TAG_NAMES2["NOEMBED"] = "noembed";
  TAG_NAMES2["NOSCRIPT"] = "noscript";
  TAG_NAMES2["OBJECT"] = "object";
  TAG_NAMES2["OL"] = "ol";
  TAG_NAMES2["OPTGROUP"] = "optgroup";
  TAG_NAMES2["OPTION"] = "option";
  TAG_NAMES2["P"] = "p";
  TAG_NAMES2["PARAM"] = "param";
  TAG_NAMES2["PLAINTEXT"] = "plaintext";
  TAG_NAMES2["PRE"] = "pre";
  TAG_NAMES2["RB"] = "rb";
  TAG_NAMES2["RP"] = "rp";
  TAG_NAMES2["RT"] = "rt";
  TAG_NAMES2["RTC"] = "rtc";
  TAG_NAMES2["RUBY"] = "ruby";
  TAG_NAMES2["S"] = "s";
  TAG_NAMES2["SCRIPT"] = "script";
  TAG_NAMES2["SEARCH"] = "search";
  TAG_NAMES2["SECTION"] = "section";
  TAG_NAMES2["SELECT"] = "select";
  TAG_NAMES2["SOURCE"] = "source";
  TAG_NAMES2["SMALL"] = "small";
  TAG_NAMES2["SPAN"] = "span";
  TAG_NAMES2["STRIKE"] = "strike";
  TAG_NAMES2["STRONG"] = "strong";
  TAG_NAMES2["STYLE"] = "style";
  TAG_NAMES2["SUB"] = "sub";
  TAG_NAMES2["SUMMARY"] = "summary";
  TAG_NAMES2["SUP"] = "sup";
  TAG_NAMES2["TABLE"] = "table";
  TAG_NAMES2["TBODY"] = "tbody";
  TAG_NAMES2["TEMPLATE"] = "template";
  TAG_NAMES2["TEXTAREA"] = "textarea";
  TAG_NAMES2["TFOOT"] = "tfoot";
  TAG_NAMES2["TD"] = "td";
  TAG_NAMES2["TH"] = "th";
  TAG_NAMES2["THEAD"] = "thead";
  TAG_NAMES2["TITLE"] = "title";
  TAG_NAMES2["TR"] = "tr";
  TAG_NAMES2["TRACK"] = "track";
  TAG_NAMES2["TT"] = "tt";
  TAG_NAMES2["U"] = "u";
  TAG_NAMES2["UL"] = "ul";
  TAG_NAMES2["SVG"] = "svg";
  TAG_NAMES2["VAR"] = "var";
  TAG_NAMES2["WBR"] = "wbr";
  TAG_NAMES2["XMP"] = "xmp";
})(TAG_NAMES || (TAG_NAMES = {}));
var TAG_ID;
(function(TAG_ID2) {
  TAG_ID2[TAG_ID2["UNKNOWN"] = 0] = "UNKNOWN";
  TAG_ID2[TAG_ID2["A"] = 1] = "A";
  TAG_ID2[TAG_ID2["ADDRESS"] = 2] = "ADDRESS";
  TAG_ID2[TAG_ID2["ANNOTATION_XML"] = 3] = "ANNOTATION_XML";
  TAG_ID2[TAG_ID2["APPLET"] = 4] = "APPLET";
  TAG_ID2[TAG_ID2["AREA"] = 5] = "AREA";
  TAG_ID2[TAG_ID2["ARTICLE"] = 6] = "ARTICLE";
  TAG_ID2[TAG_ID2["ASIDE"] = 7] = "ASIDE";
  TAG_ID2[TAG_ID2["B"] = 8] = "B";
  TAG_ID2[TAG_ID2["BASE"] = 9] = "BASE";
  TAG_ID2[TAG_ID2["BASEFONT"] = 10] = "BASEFONT";
  TAG_ID2[TAG_ID2["BGSOUND"] = 11] = "BGSOUND";
  TAG_ID2[TAG_ID2["BIG"] = 12] = "BIG";
  TAG_ID2[TAG_ID2["BLOCKQUOTE"] = 13] = "BLOCKQUOTE";
  TAG_ID2[TAG_ID2["BODY"] = 14] = "BODY";
  TAG_ID2[TAG_ID2["BR"] = 15] = "BR";
  TAG_ID2[TAG_ID2["BUTTON"] = 16] = "BUTTON";
  TAG_ID2[TAG_ID2["CAPTION"] = 17] = "CAPTION";
  TAG_ID2[TAG_ID2["CENTER"] = 18] = "CENTER";
  TAG_ID2[TAG_ID2["CODE"] = 19] = "CODE";
  TAG_ID2[TAG_ID2["COL"] = 20] = "COL";
  TAG_ID2[TAG_ID2["COLGROUP"] = 21] = "COLGROUP";
  TAG_ID2[TAG_ID2["DD"] = 22] = "DD";
  TAG_ID2[TAG_ID2["DESC"] = 23] = "DESC";
  TAG_ID2[TAG_ID2["DETAILS"] = 24] = "DETAILS";
  TAG_ID2[TAG_ID2["DIALOG"] = 25] = "DIALOG";
  TAG_ID2[TAG_ID2["DIR"] = 26] = "DIR";
  TAG_ID2[TAG_ID2["DIV"] = 27] = "DIV";
  TAG_ID2[TAG_ID2["DL"] = 28] = "DL";
  TAG_ID2[TAG_ID2["DT"] = 29] = "DT";
  TAG_ID2[TAG_ID2["EM"] = 30] = "EM";
  TAG_ID2[TAG_ID2["EMBED"] = 31] = "EMBED";
  TAG_ID2[TAG_ID2["FIELDSET"] = 32] = "FIELDSET";
  TAG_ID2[TAG_ID2["FIGCAPTION"] = 33] = "FIGCAPTION";
  TAG_ID2[TAG_ID2["FIGURE"] = 34] = "FIGURE";
  TAG_ID2[TAG_ID2["FONT"] = 35] = "FONT";
  TAG_ID2[TAG_ID2["FOOTER"] = 36] = "FOOTER";
  TAG_ID2[TAG_ID2["FOREIGN_OBJECT"] = 37] = "FOREIGN_OBJECT";
  TAG_ID2[TAG_ID2["FORM"] = 38] = "FORM";
  TAG_ID2[TAG_ID2["FRAME"] = 39] = "FRAME";
  TAG_ID2[TAG_ID2["FRAMESET"] = 40] = "FRAMESET";
  TAG_ID2[TAG_ID2["H1"] = 41] = "H1";
  TAG_ID2[TAG_ID2["H2"] = 42] = "H2";
  TAG_ID2[TAG_ID2["H3"] = 43] = "H3";
  TAG_ID2[TAG_ID2["H4"] = 44] = "H4";
  TAG_ID2[TAG_ID2["H5"] = 45] = "H5";
  TAG_ID2[TAG_ID2["H6"] = 46] = "H6";
  TAG_ID2[TAG_ID2["HEAD"] = 47] = "HEAD";
  TAG_ID2[TAG_ID2["HEADER"] = 48] = "HEADER";
  TAG_ID2[TAG_ID2["HGROUP"] = 49] = "HGROUP";
  TAG_ID2[TAG_ID2["HR"] = 50] = "HR";
  TAG_ID2[TAG_ID2["HTML"] = 51] = "HTML";
  TAG_ID2[TAG_ID2["I"] = 52] = "I";
  TAG_ID2[TAG_ID2["IMG"] = 53] = "IMG";
  TAG_ID2[TAG_ID2["IMAGE"] = 54] = "IMAGE";
  TAG_ID2[TAG_ID2["INPUT"] = 55] = "INPUT";
  TAG_ID2[TAG_ID2["IFRAME"] = 56] = "IFRAME";
  TAG_ID2[TAG_ID2["KEYGEN"] = 57] = "KEYGEN";
  TAG_ID2[TAG_ID2["LABEL"] = 58] = "LABEL";
  TAG_ID2[TAG_ID2["LI"] = 59] = "LI";
  TAG_ID2[TAG_ID2["LINK"] = 60] = "LINK";
  TAG_ID2[TAG_ID2["LISTING"] = 61] = "LISTING";
  TAG_ID2[TAG_ID2["MAIN"] = 62] = "MAIN";
  TAG_ID2[TAG_ID2["MALIGNMARK"] = 63] = "MALIGNMARK";
  TAG_ID2[TAG_ID2["MARQUEE"] = 64] = "MARQUEE";
  TAG_ID2[TAG_ID2["MATH"] = 65] = "MATH";
  TAG_ID2[TAG_ID2["MENU"] = 66] = "MENU";
  TAG_ID2[TAG_ID2["META"] = 67] = "META";
  TAG_ID2[TAG_ID2["MGLYPH"] = 68] = "MGLYPH";
  TAG_ID2[TAG_ID2["MI"] = 69] = "MI";
  TAG_ID2[TAG_ID2["MO"] = 70] = "MO";
  TAG_ID2[TAG_ID2["MN"] = 71] = "MN";
  TAG_ID2[TAG_ID2["MS"] = 72] = "MS";
  TAG_ID2[TAG_ID2["MTEXT"] = 73] = "MTEXT";
  TAG_ID2[TAG_ID2["NAV"] = 74] = "NAV";
  TAG_ID2[TAG_ID2["NOBR"] = 75] = "NOBR";
  TAG_ID2[TAG_ID2["NOFRAMES"] = 76] = "NOFRAMES";
  TAG_ID2[TAG_ID2["NOEMBED"] = 77] = "NOEMBED";
  TAG_ID2[TAG_ID2["NOSCRIPT"] = 78] = "NOSCRIPT";
  TAG_ID2[TAG_ID2["OBJECT"] = 79] = "OBJECT";
  TAG_ID2[TAG_ID2["OL"] = 80] = "OL";
  TAG_ID2[TAG_ID2["OPTGROUP"] = 81] = "OPTGROUP";
  TAG_ID2[TAG_ID2["OPTION"] = 82] = "OPTION";
  TAG_ID2[TAG_ID2["P"] = 83] = "P";
  TAG_ID2[TAG_ID2["PARAM"] = 84] = "PARAM";
  TAG_ID2[TAG_ID2["PLAINTEXT"] = 85] = "PLAINTEXT";
  TAG_ID2[TAG_ID2["PRE"] = 86] = "PRE";
  TAG_ID2[TAG_ID2["RB"] = 87] = "RB";
  TAG_ID2[TAG_ID2["RP"] = 88] = "RP";
  TAG_ID2[TAG_ID2["RT"] = 89] = "RT";
  TAG_ID2[TAG_ID2["RTC"] = 90] = "RTC";
  TAG_ID2[TAG_ID2["RUBY"] = 91] = "RUBY";
  TAG_ID2[TAG_ID2["S"] = 92] = "S";
  TAG_ID2[TAG_ID2["SCRIPT"] = 93] = "SCRIPT";
  TAG_ID2[TAG_ID2["SEARCH"] = 94] = "SEARCH";
  TAG_ID2[TAG_ID2["SECTION"] = 95] = "SECTION";
  TAG_ID2[TAG_ID2["SELECT"] = 96] = "SELECT";
  TAG_ID2[TAG_ID2["SOURCE"] = 97] = "SOURCE";
  TAG_ID2[TAG_ID2["SMALL"] = 98] = "SMALL";
  TAG_ID2[TAG_ID2["SPAN"] = 99] = "SPAN";
  TAG_ID2[TAG_ID2["STRIKE"] = 100] = "STRIKE";
  TAG_ID2[TAG_ID2["STRONG"] = 101] = "STRONG";
  TAG_ID2[TAG_ID2["STYLE"] = 102] = "STYLE";
  TAG_ID2[TAG_ID2["SUB"] = 103] = "SUB";
  TAG_ID2[TAG_ID2["SUMMARY"] = 104] = "SUMMARY";
  TAG_ID2[TAG_ID2["SUP"] = 105] = "SUP";
  TAG_ID2[TAG_ID2["TABLE"] = 106] = "TABLE";
  TAG_ID2[TAG_ID2["TBODY"] = 107] = "TBODY";
  TAG_ID2[TAG_ID2["TEMPLATE"] = 108] = "TEMPLATE";
  TAG_ID2[TAG_ID2["TEXTAREA"] = 109] = "TEXTAREA";
  TAG_ID2[TAG_ID2["TFOOT"] = 110] = "TFOOT";
  TAG_ID2[TAG_ID2["TD"] = 111] = "TD";
  TAG_ID2[TAG_ID2["TH"] = 112] = "TH";
  TAG_ID2[TAG_ID2["THEAD"] = 113] = "THEAD";
  TAG_ID2[TAG_ID2["TITLE"] = 114] = "TITLE";
  TAG_ID2[TAG_ID2["TR"] = 115] = "TR";
  TAG_ID2[TAG_ID2["TRACK"] = 116] = "TRACK";
  TAG_ID2[TAG_ID2["TT"] = 117] = "TT";
  TAG_ID2[TAG_ID2["U"] = 118] = "U";
  TAG_ID2[TAG_ID2["UL"] = 119] = "UL";
  TAG_ID2[TAG_ID2["SVG"] = 120] = "SVG";
  TAG_ID2[TAG_ID2["VAR"] = 121] = "VAR";
  TAG_ID2[TAG_ID2["WBR"] = 122] = "WBR";
  TAG_ID2[TAG_ID2["XMP"] = 123] = "XMP";
})(TAG_ID || (TAG_ID = {}));
/* @__PURE__ */ new Map([
  [TAG_NAMES.A, TAG_ID.A],
  [TAG_NAMES.ADDRESS, TAG_ID.ADDRESS],
  [TAG_NAMES.ANNOTATION_XML, TAG_ID.ANNOTATION_XML],
  [TAG_NAMES.APPLET, TAG_ID.APPLET],
  [TAG_NAMES.AREA, TAG_ID.AREA],
  [TAG_NAMES.ARTICLE, TAG_ID.ARTICLE],
  [TAG_NAMES.ASIDE, TAG_ID.ASIDE],
  [TAG_NAMES.B, TAG_ID.B],
  [TAG_NAMES.BASE, TAG_ID.BASE],
  [TAG_NAMES.BASEFONT, TAG_ID.BASEFONT],
  [TAG_NAMES.BGSOUND, TAG_ID.BGSOUND],
  [TAG_NAMES.BIG, TAG_ID.BIG],
  [TAG_NAMES.BLOCKQUOTE, TAG_ID.BLOCKQUOTE],
  [TAG_NAMES.BODY, TAG_ID.BODY],
  [TAG_NAMES.BR, TAG_ID.BR],
  [TAG_NAMES.BUTTON, TAG_ID.BUTTON],
  [TAG_NAMES.CAPTION, TAG_ID.CAPTION],
  [TAG_NAMES.CENTER, TAG_ID.CENTER],
  [TAG_NAMES.CODE, TAG_ID.CODE],
  [TAG_NAMES.COL, TAG_ID.COL],
  [TAG_NAMES.COLGROUP, TAG_ID.COLGROUP],
  [TAG_NAMES.DD, TAG_ID.DD],
  [TAG_NAMES.DESC, TAG_ID.DESC],
  [TAG_NAMES.DETAILS, TAG_ID.DETAILS],
  [TAG_NAMES.DIALOG, TAG_ID.DIALOG],
  [TAG_NAMES.DIR, TAG_ID.DIR],
  [TAG_NAMES.DIV, TAG_ID.DIV],
  [TAG_NAMES.DL, TAG_ID.DL],
  [TAG_NAMES.DT, TAG_ID.DT],
  [TAG_NAMES.EM, TAG_ID.EM],
  [TAG_NAMES.EMBED, TAG_ID.EMBED],
  [TAG_NAMES.FIELDSET, TAG_ID.FIELDSET],
  [TAG_NAMES.FIGCAPTION, TAG_ID.FIGCAPTION],
  [TAG_NAMES.FIGURE, TAG_ID.FIGURE],
  [TAG_NAMES.FONT, TAG_ID.FONT],
  [TAG_NAMES.FOOTER, TAG_ID.FOOTER],
  [TAG_NAMES.FOREIGN_OBJECT, TAG_ID.FOREIGN_OBJECT],
  [TAG_NAMES.FORM, TAG_ID.FORM],
  [TAG_NAMES.FRAME, TAG_ID.FRAME],
  [TAG_NAMES.FRAMESET, TAG_ID.FRAMESET],
  [TAG_NAMES.H1, TAG_ID.H1],
  [TAG_NAMES.H2, TAG_ID.H2],
  [TAG_NAMES.H3, TAG_ID.H3],
  [TAG_NAMES.H4, TAG_ID.H4],
  [TAG_NAMES.H5, TAG_ID.H5],
  [TAG_NAMES.H6, TAG_ID.H6],
  [TAG_NAMES.HEAD, TAG_ID.HEAD],
  [TAG_NAMES.HEADER, TAG_ID.HEADER],
  [TAG_NAMES.HGROUP, TAG_ID.HGROUP],
  [TAG_NAMES.HR, TAG_ID.HR],
  [TAG_NAMES.HTML, TAG_ID.HTML],
  [TAG_NAMES.I, TAG_ID.I],
  [TAG_NAMES.IMG, TAG_ID.IMG],
  [TAG_NAMES.IMAGE, TAG_ID.IMAGE],
  [TAG_NAMES.INPUT, TAG_ID.INPUT],
  [TAG_NAMES.IFRAME, TAG_ID.IFRAME],
  [TAG_NAMES.KEYGEN, TAG_ID.KEYGEN],
  [TAG_NAMES.LABEL, TAG_ID.LABEL],
  [TAG_NAMES.LI, TAG_ID.LI],
  [TAG_NAMES.LINK, TAG_ID.LINK],
  [TAG_NAMES.LISTING, TAG_ID.LISTING],
  [TAG_NAMES.MAIN, TAG_ID.MAIN],
  [TAG_NAMES.MALIGNMARK, TAG_ID.MALIGNMARK],
  [TAG_NAMES.MARQUEE, TAG_ID.MARQUEE],
  [TAG_NAMES.MATH, TAG_ID.MATH],
  [TAG_NAMES.MENU, TAG_ID.MENU],
  [TAG_NAMES.META, TAG_ID.META],
  [TAG_NAMES.MGLYPH, TAG_ID.MGLYPH],
  [TAG_NAMES.MI, TAG_ID.MI],
  [TAG_NAMES.MO, TAG_ID.MO],
  [TAG_NAMES.MN, TAG_ID.MN],
  [TAG_NAMES.MS, TAG_ID.MS],
  [TAG_NAMES.MTEXT, TAG_ID.MTEXT],
  [TAG_NAMES.NAV, TAG_ID.NAV],
  [TAG_NAMES.NOBR, TAG_ID.NOBR],
  [TAG_NAMES.NOFRAMES, TAG_ID.NOFRAMES],
  [TAG_NAMES.NOEMBED, TAG_ID.NOEMBED],
  [TAG_NAMES.NOSCRIPT, TAG_ID.NOSCRIPT],
  [TAG_NAMES.OBJECT, TAG_ID.OBJECT],
  [TAG_NAMES.OL, TAG_ID.OL],
  [TAG_NAMES.OPTGROUP, TAG_ID.OPTGROUP],
  [TAG_NAMES.OPTION, TAG_ID.OPTION],
  [TAG_NAMES.P, TAG_ID.P],
  [TAG_NAMES.PARAM, TAG_ID.PARAM],
  [TAG_NAMES.PLAINTEXT, TAG_ID.PLAINTEXT],
  [TAG_NAMES.PRE, TAG_ID.PRE],
  [TAG_NAMES.RB, TAG_ID.RB],
  [TAG_NAMES.RP, TAG_ID.RP],
  [TAG_NAMES.RT, TAG_ID.RT],
  [TAG_NAMES.RTC, TAG_ID.RTC],
  [TAG_NAMES.RUBY, TAG_ID.RUBY],
  [TAG_NAMES.S, TAG_ID.S],
  [TAG_NAMES.SCRIPT, TAG_ID.SCRIPT],
  [TAG_NAMES.SEARCH, TAG_ID.SEARCH],
  [TAG_NAMES.SECTION, TAG_ID.SECTION],
  [TAG_NAMES.SELECT, TAG_ID.SELECT],
  [TAG_NAMES.SOURCE, TAG_ID.SOURCE],
  [TAG_NAMES.SMALL, TAG_ID.SMALL],
  [TAG_NAMES.SPAN, TAG_ID.SPAN],
  [TAG_NAMES.STRIKE, TAG_ID.STRIKE],
  [TAG_NAMES.STRONG, TAG_ID.STRONG],
  [TAG_NAMES.STYLE, TAG_ID.STYLE],
  [TAG_NAMES.SUB, TAG_ID.SUB],
  [TAG_NAMES.SUMMARY, TAG_ID.SUMMARY],
  [TAG_NAMES.SUP, TAG_ID.SUP],
  [TAG_NAMES.TABLE, TAG_ID.TABLE],
  [TAG_NAMES.TBODY, TAG_ID.TBODY],
  [TAG_NAMES.TEMPLATE, TAG_ID.TEMPLATE],
  [TAG_NAMES.TEXTAREA, TAG_ID.TEXTAREA],
  [TAG_NAMES.TFOOT, TAG_ID.TFOOT],
  [TAG_NAMES.TD, TAG_ID.TD],
  [TAG_NAMES.TH, TAG_ID.TH],
  [TAG_NAMES.THEAD, TAG_ID.THEAD],
  [TAG_NAMES.TITLE, TAG_ID.TITLE],
  [TAG_NAMES.TR, TAG_ID.TR],
  [TAG_NAMES.TRACK, TAG_ID.TRACK],
  [TAG_NAMES.TT, TAG_ID.TT],
  [TAG_NAMES.U, TAG_ID.U],
  [TAG_NAMES.UL, TAG_ID.UL],
  [TAG_NAMES.SVG, TAG_ID.SVG],
  [TAG_NAMES.VAR, TAG_ID.VAR],
  [TAG_NAMES.WBR, TAG_ID.WBR],
  [TAG_NAMES.XMP, TAG_ID.XMP]
]);
const $ = TAG_ID;
({
  [NS.HTML]: /* @__PURE__ */ new Set([
    $.ADDRESS,
    $.APPLET,
    $.AREA,
    $.ARTICLE,
    $.ASIDE,
    $.BASE,
    $.BASEFONT,
    $.BGSOUND,
    $.BLOCKQUOTE,
    $.BODY,
    $.BR,
    $.BUTTON,
    $.CAPTION,
    $.CENTER,
    $.COL,
    $.COLGROUP,
    $.DD,
    $.DETAILS,
    $.DIR,
    $.DIV,
    $.DL,
    $.DT,
    $.EMBED,
    $.FIELDSET,
    $.FIGCAPTION,
    $.FIGURE,
    $.FOOTER,
    $.FORM,
    $.FRAME,
    $.FRAMESET,
    $.H1,
    $.H2,
    $.H3,
    $.H4,
    $.H5,
    $.H6,
    $.HEAD,
    $.HEADER,
    $.HGROUP,
    $.HR,
    $.HTML,
    $.IFRAME,
    $.IMG,
    $.INPUT,
    $.LI,
    $.LINK,
    $.LISTING,
    $.MAIN,
    $.MARQUEE,
    $.MENU,
    $.META,
    $.NAV,
    $.NOEMBED,
    $.NOFRAMES,
    $.NOSCRIPT,
    $.OBJECT,
    $.OL,
    $.P,
    $.PARAM,
    $.PLAINTEXT,
    $.PRE,
    $.SCRIPT,
    $.SECTION,
    $.SELECT,
    $.SOURCE,
    $.STYLE,
    $.SUMMARY,
    $.TABLE,
    $.TBODY,
    $.TD,
    $.TEMPLATE,
    $.TEXTAREA,
    $.TFOOT,
    $.TH,
    $.THEAD,
    $.TITLE,
    $.TR,
    $.TRACK,
    $.UL,
    $.WBR,
    $.XMP
  ]),
  [NS.MATHML]: /* @__PURE__ */ new Set([$.MI, $.MO, $.MN, $.MS, $.MTEXT, $.ANNOTATION_XML]),
  [NS.SVG]: /* @__PURE__ */ new Set([$.TITLE, $.FOREIGN_OBJECT, $.DESC]),
  [NS.XLINK]: /* @__PURE__ */ new Set(),
  [NS.XML]: /* @__PURE__ */ new Set(),
  [NS.XMLNS]: /* @__PURE__ */ new Set()
});
/* @__PURE__ */ new Set([$.H1, $.H2, $.H3, $.H4, $.H5, $.H6]);
/* @__PURE__ */ new Set([
  TAG_NAMES.STYLE,
  TAG_NAMES.SCRIPT,
  TAG_NAMES.XMP,
  TAG_NAMES.IFRAME,
  TAG_NAMES.NOEMBED,
  TAG_NAMES.NOFRAMES,
  TAG_NAMES.PLAINTEXT
]);
var State;
(function(State2) {
  State2[State2["DATA"] = 0] = "DATA";
  State2[State2["RCDATA"] = 1] = "RCDATA";
  State2[State2["RAWTEXT"] = 2] = "RAWTEXT";
  State2[State2["SCRIPT_DATA"] = 3] = "SCRIPT_DATA";
  State2[State2["PLAINTEXT"] = 4] = "PLAINTEXT";
  State2[State2["TAG_OPEN"] = 5] = "TAG_OPEN";
  State2[State2["END_TAG_OPEN"] = 6] = "END_TAG_OPEN";
  State2[State2["TAG_NAME"] = 7] = "TAG_NAME";
  State2[State2["RCDATA_LESS_THAN_SIGN"] = 8] = "RCDATA_LESS_THAN_SIGN";
  State2[State2["RCDATA_END_TAG_OPEN"] = 9] = "RCDATA_END_TAG_OPEN";
  State2[State2["RCDATA_END_TAG_NAME"] = 10] = "RCDATA_END_TAG_NAME";
  State2[State2["RAWTEXT_LESS_THAN_SIGN"] = 11] = "RAWTEXT_LESS_THAN_SIGN";
  State2[State2["RAWTEXT_END_TAG_OPEN"] = 12] = "RAWTEXT_END_TAG_OPEN";
  State2[State2["RAWTEXT_END_TAG_NAME"] = 13] = "RAWTEXT_END_TAG_NAME";
  State2[State2["SCRIPT_DATA_LESS_THAN_SIGN"] = 14] = "SCRIPT_DATA_LESS_THAN_SIGN";
  State2[State2["SCRIPT_DATA_END_TAG_OPEN"] = 15] = "SCRIPT_DATA_END_TAG_OPEN";
  State2[State2["SCRIPT_DATA_END_TAG_NAME"] = 16] = "SCRIPT_DATA_END_TAG_NAME";
  State2[State2["SCRIPT_DATA_ESCAPE_START"] = 17] = "SCRIPT_DATA_ESCAPE_START";
  State2[State2["SCRIPT_DATA_ESCAPE_START_DASH"] = 18] = "SCRIPT_DATA_ESCAPE_START_DASH";
  State2[State2["SCRIPT_DATA_ESCAPED"] = 19] = "SCRIPT_DATA_ESCAPED";
  State2[State2["SCRIPT_DATA_ESCAPED_DASH"] = 20] = "SCRIPT_DATA_ESCAPED_DASH";
  State2[State2["SCRIPT_DATA_ESCAPED_DASH_DASH"] = 21] = "SCRIPT_DATA_ESCAPED_DASH_DASH";
  State2[State2["SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN"] = 22] = "SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN";
  State2[State2["SCRIPT_DATA_ESCAPED_END_TAG_OPEN"] = 23] = "SCRIPT_DATA_ESCAPED_END_TAG_OPEN";
  State2[State2["SCRIPT_DATA_ESCAPED_END_TAG_NAME"] = 24] = "SCRIPT_DATA_ESCAPED_END_TAG_NAME";
  State2[State2["SCRIPT_DATA_DOUBLE_ESCAPE_START"] = 25] = "SCRIPT_DATA_DOUBLE_ESCAPE_START";
  State2[State2["SCRIPT_DATA_DOUBLE_ESCAPED"] = 26] = "SCRIPT_DATA_DOUBLE_ESCAPED";
  State2[State2["SCRIPT_DATA_DOUBLE_ESCAPED_DASH"] = 27] = "SCRIPT_DATA_DOUBLE_ESCAPED_DASH";
  State2[State2["SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH"] = 28] = "SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH";
  State2[State2["SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN"] = 29] = "SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN";
  State2[State2["SCRIPT_DATA_DOUBLE_ESCAPE_END"] = 30] = "SCRIPT_DATA_DOUBLE_ESCAPE_END";
  State2[State2["BEFORE_ATTRIBUTE_NAME"] = 31] = "BEFORE_ATTRIBUTE_NAME";
  State2[State2["ATTRIBUTE_NAME"] = 32] = "ATTRIBUTE_NAME";
  State2[State2["AFTER_ATTRIBUTE_NAME"] = 33] = "AFTER_ATTRIBUTE_NAME";
  State2[State2["BEFORE_ATTRIBUTE_VALUE"] = 34] = "BEFORE_ATTRIBUTE_VALUE";
  State2[State2["ATTRIBUTE_VALUE_DOUBLE_QUOTED"] = 35] = "ATTRIBUTE_VALUE_DOUBLE_QUOTED";
  State2[State2["ATTRIBUTE_VALUE_SINGLE_QUOTED"] = 36] = "ATTRIBUTE_VALUE_SINGLE_QUOTED";
  State2[State2["ATTRIBUTE_VALUE_UNQUOTED"] = 37] = "ATTRIBUTE_VALUE_UNQUOTED";
  State2[State2["AFTER_ATTRIBUTE_VALUE_QUOTED"] = 38] = "AFTER_ATTRIBUTE_VALUE_QUOTED";
  State2[State2["SELF_CLOSING_START_TAG"] = 39] = "SELF_CLOSING_START_TAG";
  State2[State2["BOGUS_COMMENT"] = 40] = "BOGUS_COMMENT";
  State2[State2["MARKUP_DECLARATION_OPEN"] = 41] = "MARKUP_DECLARATION_OPEN";
  State2[State2["COMMENT_START"] = 42] = "COMMENT_START";
  State2[State2["COMMENT_START_DASH"] = 43] = "COMMENT_START_DASH";
  State2[State2["COMMENT"] = 44] = "COMMENT";
  State2[State2["COMMENT_LESS_THAN_SIGN"] = 45] = "COMMENT_LESS_THAN_SIGN";
  State2[State2["COMMENT_LESS_THAN_SIGN_BANG"] = 46] = "COMMENT_LESS_THAN_SIGN_BANG";
  State2[State2["COMMENT_LESS_THAN_SIGN_BANG_DASH"] = 47] = "COMMENT_LESS_THAN_SIGN_BANG_DASH";
  State2[State2["COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH"] = 48] = "COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH";
  State2[State2["COMMENT_END_DASH"] = 49] = "COMMENT_END_DASH";
  State2[State2["COMMENT_END"] = 50] = "COMMENT_END";
  State2[State2["COMMENT_END_BANG"] = 51] = "COMMENT_END_BANG";
  State2[State2["DOCTYPE"] = 52] = "DOCTYPE";
  State2[State2["BEFORE_DOCTYPE_NAME"] = 53] = "BEFORE_DOCTYPE_NAME";
  State2[State2["DOCTYPE_NAME"] = 54] = "DOCTYPE_NAME";
  State2[State2["AFTER_DOCTYPE_NAME"] = 55] = "AFTER_DOCTYPE_NAME";
  State2[State2["AFTER_DOCTYPE_PUBLIC_KEYWORD"] = 56] = "AFTER_DOCTYPE_PUBLIC_KEYWORD";
  State2[State2["BEFORE_DOCTYPE_PUBLIC_IDENTIFIER"] = 57] = "BEFORE_DOCTYPE_PUBLIC_IDENTIFIER";
  State2[State2["DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED"] = 58] = "DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED";
  State2[State2["DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED"] = 59] = "DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED";
  State2[State2["AFTER_DOCTYPE_PUBLIC_IDENTIFIER"] = 60] = "AFTER_DOCTYPE_PUBLIC_IDENTIFIER";
  State2[State2["BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS"] = 61] = "BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS";
  State2[State2["AFTER_DOCTYPE_SYSTEM_KEYWORD"] = 62] = "AFTER_DOCTYPE_SYSTEM_KEYWORD";
  State2[State2["BEFORE_DOCTYPE_SYSTEM_IDENTIFIER"] = 63] = "BEFORE_DOCTYPE_SYSTEM_IDENTIFIER";
  State2[State2["DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED"] = 64] = "DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED";
  State2[State2["DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED"] = 65] = "DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED";
  State2[State2["AFTER_DOCTYPE_SYSTEM_IDENTIFIER"] = 66] = "AFTER_DOCTYPE_SYSTEM_IDENTIFIER";
  State2[State2["BOGUS_DOCTYPE"] = 67] = "BOGUS_DOCTYPE";
  State2[State2["CDATA_SECTION"] = 68] = "CDATA_SECTION";
  State2[State2["CDATA_SECTION_BRACKET"] = 69] = "CDATA_SECTION_BRACKET";
  State2[State2["CDATA_SECTION_END"] = 70] = "CDATA_SECTION_END";
  State2[State2["CHARACTER_REFERENCE"] = 71] = "CHARACTER_REFERENCE";
  State2[State2["AMBIGUOUS_AMPERSAND"] = 72] = "AMBIGUOUS_AMPERSAND";
})(State || (State = {}));
({
  DATA: State.DATA,
  RCDATA: State.RCDATA,
  RAWTEXT: State.RAWTEXT,
  SCRIPT_DATA: State.SCRIPT_DATA,
  PLAINTEXT: State.PLAINTEXT,
  CDATA_SECTION: State.CDATA_SECTION
});
const IMPLICIT_END_TAG_REQUIRED = /* @__PURE__ */ new Set([TAG_ID.DD, TAG_ID.DT, TAG_ID.LI, TAG_ID.OPTGROUP, TAG_ID.OPTION, TAG_ID.P, TAG_ID.RB, TAG_ID.RP, TAG_ID.RT, TAG_ID.RTC]);
/* @__PURE__ */ new Set([
  ...IMPLICIT_END_TAG_REQUIRED,
  TAG_ID.CAPTION,
  TAG_ID.COLGROUP,
  TAG_ID.TBODY,
  TAG_ID.TD,
  TAG_ID.TFOOT,
  TAG_ID.TH,
  TAG_ID.THEAD,
  TAG_ID.TR
]);
const SCOPING_ELEMENTS_HTML = /* @__PURE__ */ new Set([
  TAG_ID.APPLET,
  TAG_ID.CAPTION,
  TAG_ID.HTML,
  TAG_ID.MARQUEE,
  TAG_ID.OBJECT,
  TAG_ID.TABLE,
  TAG_ID.TD,
  TAG_ID.TEMPLATE,
  TAG_ID.TH
]);
/* @__PURE__ */ new Set([...SCOPING_ELEMENTS_HTML, TAG_ID.OL, TAG_ID.UL]);
/* @__PURE__ */ new Set([...SCOPING_ELEMENTS_HTML, TAG_ID.BUTTON]);
/* @__PURE__ */ new Set([TAG_ID.ANNOTATION_XML, TAG_ID.MI, TAG_ID.MN, TAG_ID.MO, TAG_ID.MS, TAG_ID.MTEXT]);
/* @__PURE__ */ new Set([TAG_ID.DESC, TAG_ID.FOREIGN_OBJECT, TAG_ID.TITLE]);
/* @__PURE__ */ new Set([TAG_ID.TR, TAG_ID.TEMPLATE, TAG_ID.HTML]);
/* @__PURE__ */ new Set([TAG_ID.TBODY, TAG_ID.TFOOT, TAG_ID.THEAD, TAG_ID.TEMPLATE, TAG_ID.HTML]);
/* @__PURE__ */ new Set([TAG_ID.TABLE, TAG_ID.TEMPLATE, TAG_ID.HTML]);
/* @__PURE__ */ new Set([TAG_ID.TD, TAG_ID.TH]);
var EntryType;
(function(EntryType2) {
  EntryType2[EntryType2["Marker"] = 0] = "Marker";
  EntryType2[EntryType2["Element"] = 1] = "Element";
})(EntryType || (EntryType = {}));
({ type: EntryType.Marker });
new Map([
  "attributeName",
  "attributeType",
  "baseFrequency",
  "baseProfile",
  "calcMode",
  "clipPathUnits",
  "diffuseConstant",
  "edgeMode",
  "filterUnits",
  "glyphRef",
  "gradientTransform",
  "gradientUnits",
  "kernelMatrix",
  "kernelUnitLength",
  "keyPoints",
  "keySplines",
  "keyTimes",
  "lengthAdjust",
  "limitingConeAngle",
  "markerHeight",
  "markerUnits",
  "markerWidth",
  "maskContentUnits",
  "maskUnits",
  "numOctaves",
  "pathLength",
  "patternContentUnits",
  "patternTransform",
  "patternUnits",
  "pointsAtX",
  "pointsAtY",
  "pointsAtZ",
  "preserveAlpha",
  "preserveAspectRatio",
  "primitiveUnits",
  "refX",
  "refY",
  "repeatCount",
  "repeatDur",
  "requiredExtensions",
  "requiredFeatures",
  "specularConstant",
  "specularExponent",
  "spreadMethod",
  "startOffset",
  "stdDeviation",
  "stitchTiles",
  "surfaceScale",
  "systemLanguage",
  "tableValues",
  "targetX",
  "targetY",
  "textLength",
  "viewBox",
  "viewTarget",
  "xChannelSelector",
  "yChannelSelector",
  "zoomAndPan"
].map((attr) => [attr.toLowerCase(), attr]));
/* @__PURE__ */ new Map([
  ["xlink:actuate", { prefix: "xlink", name: "actuate", namespace: NS.XLINK }],
  ["xlink:arcrole", { prefix: "xlink", name: "arcrole", namespace: NS.XLINK }],
  ["xlink:href", { prefix: "xlink", name: "href", namespace: NS.XLINK }],
  ["xlink:role", { prefix: "xlink", name: "role", namespace: NS.XLINK }],
  ["xlink:show", { prefix: "xlink", name: "show", namespace: NS.XLINK }],
  ["xlink:title", { prefix: "xlink", name: "title", namespace: NS.XLINK }],
  ["xlink:type", { prefix: "xlink", name: "type", namespace: NS.XLINK }],
  ["xml:lang", { prefix: "xml", name: "lang", namespace: NS.XML }],
  ["xml:space", { prefix: "xml", name: "space", namespace: NS.XML }],
  ["xmlns", { prefix: "", name: "xmlns", namespace: NS.XMLNS }],
  ["xmlns:xlink", { prefix: "xmlns", name: "xlink", namespace: NS.XMLNS }]
]);
new Map([
  "altGlyph",
  "altGlyphDef",
  "altGlyphItem",
  "animateColor",
  "animateMotion",
  "animateTransform",
  "clipPath",
  "feBlend",
  "feColorMatrix",
  "feComponentTransfer",
  "feComposite",
  "feConvolveMatrix",
  "feDiffuseLighting",
  "feDisplacementMap",
  "feDistantLight",
  "feFlood",
  "feFuncA",
  "feFuncB",
  "feFuncG",
  "feFuncR",
  "feGaussianBlur",
  "feImage",
  "feMerge",
  "feMergeNode",
  "feMorphology",
  "feOffset",
  "fePointLight",
  "feSpecularLighting",
  "feSpotLight",
  "feTile",
  "feTurbulence",
  "foreignObject",
  "glyphRef",
  "linearGradient",
  "radialGradient",
  "textPath"
].map((tn) => [tn.toLowerCase(), tn]));
/* @__PURE__ */ new Set([
  TAG_ID.B,
  TAG_ID.BIG,
  TAG_ID.BLOCKQUOTE,
  TAG_ID.BODY,
  TAG_ID.BR,
  TAG_ID.CENTER,
  TAG_ID.CODE,
  TAG_ID.DD,
  TAG_ID.DIV,
  TAG_ID.DL,
  TAG_ID.DT,
  TAG_ID.EM,
  TAG_ID.EMBED,
  TAG_ID.H1,
  TAG_ID.H2,
  TAG_ID.H3,
  TAG_ID.H4,
  TAG_ID.H5,
  TAG_ID.H6,
  TAG_ID.HEAD,
  TAG_ID.HR,
  TAG_ID.I,
  TAG_ID.IMG,
  TAG_ID.LI,
  TAG_ID.LISTING,
  TAG_ID.MENU,
  TAG_ID.META,
  TAG_ID.NOBR,
  TAG_ID.OL,
  TAG_ID.P,
  TAG_ID.PRE,
  TAG_ID.RUBY,
  TAG_ID.S,
  TAG_ID.SMALL,
  TAG_ID.SPAN,
  TAG_ID.STRONG,
  TAG_ID.STRIKE,
  TAG_ID.SUB,
  TAG_ID.SUP,
  TAG_ID.TABLE,
  TAG_ID.TT,
  TAG_ID.U,
  TAG_ID.UL,
  TAG_ID.VAR
]);
var InsertionMode;
(function(InsertionMode2) {
  InsertionMode2[InsertionMode2["INITIAL"] = 0] = "INITIAL";
  InsertionMode2[InsertionMode2["BEFORE_HTML"] = 1] = "BEFORE_HTML";
  InsertionMode2[InsertionMode2["BEFORE_HEAD"] = 2] = "BEFORE_HEAD";
  InsertionMode2[InsertionMode2["IN_HEAD"] = 3] = "IN_HEAD";
  InsertionMode2[InsertionMode2["IN_HEAD_NO_SCRIPT"] = 4] = "IN_HEAD_NO_SCRIPT";
  InsertionMode2[InsertionMode2["AFTER_HEAD"] = 5] = "AFTER_HEAD";
  InsertionMode2[InsertionMode2["IN_BODY"] = 6] = "IN_BODY";
  InsertionMode2[InsertionMode2["TEXT"] = 7] = "TEXT";
  InsertionMode2[InsertionMode2["IN_TABLE"] = 8] = "IN_TABLE";
  InsertionMode2[InsertionMode2["IN_TABLE_TEXT"] = 9] = "IN_TABLE_TEXT";
  InsertionMode2[InsertionMode2["IN_CAPTION"] = 10] = "IN_CAPTION";
  InsertionMode2[InsertionMode2["IN_COLUMN_GROUP"] = 11] = "IN_COLUMN_GROUP";
  InsertionMode2[InsertionMode2["IN_TABLE_BODY"] = 12] = "IN_TABLE_BODY";
  InsertionMode2[InsertionMode2["IN_ROW"] = 13] = "IN_ROW";
  InsertionMode2[InsertionMode2["IN_CELL"] = 14] = "IN_CELL";
  InsertionMode2[InsertionMode2["IN_SELECT"] = 15] = "IN_SELECT";
  InsertionMode2[InsertionMode2["IN_SELECT_IN_TABLE"] = 16] = "IN_SELECT_IN_TABLE";
  InsertionMode2[InsertionMode2["IN_TEMPLATE"] = 17] = "IN_TEMPLATE";
  InsertionMode2[InsertionMode2["AFTER_BODY"] = 18] = "AFTER_BODY";
  InsertionMode2[InsertionMode2["IN_FRAMESET"] = 19] = "IN_FRAMESET";
  InsertionMode2[InsertionMode2["AFTER_FRAMESET"] = 20] = "AFTER_FRAMESET";
  InsertionMode2[InsertionMode2["AFTER_AFTER_BODY"] = 21] = "AFTER_AFTER_BODY";
  InsertionMode2[InsertionMode2["AFTER_AFTER_FRAMESET"] = 22] = "AFTER_AFTER_FRAMESET";
})(InsertionMode || (InsertionMode = {}));
/* @__PURE__ */ new Set([TAG_ID.TABLE, TAG_ID.TBODY, TAG_ID.TFOOT, TAG_ID.THEAD, TAG_ID.TR]);
/* @__PURE__ */ new Set([TAG_ID.CAPTION, TAG_ID.COL, TAG_ID.COLGROUP, TAG_ID.TBODY, TAG_ID.TD, TAG_ID.TFOOT, TAG_ID.TH, TAG_ID.THEAD, TAG_ID.TR]);
/* @__PURE__ */ new Set([
  TAG_NAMES.AREA,
  TAG_NAMES.BASE,
  TAG_NAMES.BASEFONT,
  TAG_NAMES.BGSOUND,
  TAG_NAMES.BR,
  TAG_NAMES.COL,
  TAG_NAMES.EMBED,
  TAG_NAMES.FRAME,
  TAG_NAMES.HR,
  TAG_NAMES.IMG,
  TAG_NAMES.INPUT,
  TAG_NAMES.KEYGEN,
  TAG_NAMES.LINK,
  TAG_NAMES.META,
  TAG_NAMES.PARAM,
  TAG_NAMES.SOURCE,
  TAG_NAMES.TRACK,
  TAG_NAMES.WBR
]);
const MAC_KEY_NAMES = {
  "⌫": "Backspace",
  "⌦": "Delete",
  "⏎": "Enter",
  "↩": "Enter",
  "␣": "Space"
};
const HAS_MAC_SYMBOL = /[⌘⌃⌥⇧⌫⌦⏎↩␣]/;
const CHORD = /([⌘⌃⌥⇧]+)(F\d{1,2}|[A-Za-z0-9±=`'\\,./;[\]\-←↑→↓⌫⌦⏎↩␣]|\+)?/g;
function chordToWin(mods, key) {
  const parts = [];
  if (mods.includes("⌘") || mods.includes("⌃")) parts.push("Ctrl");
  if (mods.includes("⌥")) parts.push("Alt");
  if (mods.includes("⇧")) parts.push("Shift");
  if (key) parts.push(MAC_KEY_NAMES[key] ?? key);
  return parts.join("+");
}
function macShortcutsToWin(text) {
  if (!HAS_MAC_SYMBOL.test(text)) return text;
  return text.replace(new RegExp("⌘\\/(?=\\p{L}{2})", "gu"), "").replace(
    CHORD,
    (_m, mods, key) => key === "+" ? `${chordToWin(mods, void 0)}+` : chordToWin(mods, key)
  ).replace(/[⌫⌦⏎↩␣]/g, (glyph) => MAC_KEY_NAMES[glyph] ?? glyph);
}
const IS_MAC = (() => {
  const g = globalThis;
  if (g.navigator?.platform) return /mac/i.test(g.navigator.platform);
  return g.process?.platform === "darwin";
})();
const platformShortcuts = IS_MAC ? (text) => text : macShortcutsToWin;
function format(template, params) {
  if (!params) return template;
  return template.replace(
    /\{(\w+)\}/g,
    (match, name) => name in params ? String(params[name]) : match
  );
}
let uiLang = "zh";
function getUiLang() {
  return uiLang;
}
function createI18n(dicts) {
  return (lang, key, params) => platformShortcuts(format(dicts[lang][key], params));
}
const providers = { "anthropic": { "catalogType": "direct", "sources": ["https://platform.claude.com/docs/en/about-claude/models/overview", "https://platform.claude.com/docs/en/about-claude/models/model-ids-and-versions"], "models": [{ "id": "claude-fable-5", "lifecycle": "stable", "tier": "quality" }, { "id": "claude-opus-5", "lifecycle": "stable", "tier": "quality" }, { "id": "claude-sonnet-5", "lifecycle": "stable", "tier": "balanced" }, { "id": "claude-opus-4-8", "lifecycle": "legacy", "tier": "quality" }, { "id": "claude-sonnet-4-6", "lifecycle": "legacy", "tier": "balanced" }, { "id": "claude-haiku-4-5", "lifecycle": "stable", "tier": "fast" }] }, "gemini": { "catalogType": "direct", "sources": ["https://ai.google.dev/gemini-api/docs/latest-model", "https://ai.google.dev/gemini-api/docs/models", "https://ai.google.dev/gemini-api/docs/deprecations"], "models": [{ "id": "gemini-3.6-flash", "lifecycle": "stable", "tier": "balanced" }, { "id": "gemini-3.5-flash", "lifecycle": "stable", "tier": "balanced" }, { "id": "gemini-3.5-flash-lite", "lifecycle": "stable", "tier": "fast" }, { "id": "gemini-3.1-flash-lite", "lifecycle": "legacy", "tier": "fast" }, { "id": "gemini-2.5-pro", "lifecycle": "legacy", "tier": "quality" }, { "id": "gemini-2.5-flash", "lifecycle": "legacy", "tier": "balanced" }, { "id": "gemini-2.5-flash-lite", "lifecycle": "legacy", "tier": "fast" }] }, "deepseek": { "catalogType": "direct", "sources": ["https://api-docs.deepseek.com/api/list-models", "https://api-docs.deepseek.com/quick_start/pricing", "https://api-docs.deepseek.com/updates"], "models": [{ "id": "deepseek-v4-pro", "lifecycle": "stable", "tier": "quality" }, { "id": "deepseek-v4-flash", "lifecycle": "stable", "tier": "fast" }] }, "openai": { "catalogType": "direct", "sources": ["https://developers.openai.com/api/docs/models", "https://developers.openai.com/api/docs/guides/latest-model"], "models": [{ "id": "gpt-5.6-sol", "lifecycle": "stable", "tier": "quality" }, { "id": "gpt-5.6-terra", "lifecycle": "stable", "tier": "balanced" }, { "id": "gpt-5.6-luna", "lifecycle": "stable", "tier": "fast" }, { "id": "gpt-5.5", "lifecycle": "legacy", "tier": "quality" }, { "id": "gpt-5.4", "lifecycle": "legacy", "tier": "quality" }, { "id": "gpt-5.4-mini", "lifecycle": "legacy", "tier": "balanced" }, { "id": "gpt-5.4-nano", "lifecycle": "legacy", "tier": "fast" }, { "id": "gpt-4.1", "lifecycle": "legacy", "tier": "balanced" }, { "id": "gpt-4.1-mini", "lifecycle": "legacy", "tier": "fast" }] } };
const modelCatalogJson = {
  providers
};
const AI_MODEL_CATALOG = modelCatalogJson;
function catalogModelIds(provider) {
  return AI_MODEL_CATALOG.providers[provider]?.models.map(({ id }) => id) ?? [];
}
const BATI_CLOUD_PROVIDER = {
  id: "baticloud",
  label: "Bati AI",
  // Stable product roles. The authenticated server catalog remains the
  // authority for entitlement, capabilities and the backing vendor model.
  models: ["bati-fast", "bati-balanced", "bati-quality"],
  defaultModel: "bati-balanced",
  keyPlaceholder: "Bati 계정 로그인을 사용합니다"
};
const AI_PROVIDERS = [
  BATI_CLOUD_PROVIDER,
  {
    id: "anthropic",
    label: "Claude",
    models: catalogModelIds("anthropic"),
    defaultModel: "claude-sonnet-5",
    keyPlaceholder: "sk-ant-api03-..."
  },
  {
    id: "gemini",
    label: "Gemini",
    models: catalogModelIds("gemini"),
    defaultModel: "gemini-3.5-flash-lite",
    keyPlaceholder: "AIza..."
  },
  {
    id: "deepseek",
    label: "DeepSeek",
    models: catalogModelIds("deepseek"),
    defaultModel: "deepseek-v4-flash",
    keyPlaceholder: "sk-..."
  },
  {
    id: "openai",
    label: "OpenAI",
    models: catalogModelIds("openai"),
    defaultModel: "gpt-5.6-terra",
    keyPlaceholder: "sk-..."
  },
  {
    id: "ollama",
    label: "Ollama (Local)",
    models: [],
    defaultModel: "llama3.2",
    keyPlaceholder: "Not required",
    needsBaseUrl: true,
    defaultBaseUrl: "http://127.0.0.1:11434/v1"
  },
  {
    id: "kimi",
    label: "Kimi",
    models: ["kimi-k3"],
    defaultModel: "kimi-k3",
    keyPlaceholder: "sk-..."
  },
  {
    id: "glm",
    label: "GLM",
    // bigmodel.cn text-model lineup (2026-08); 5.3 and 5.2 share a base model,
    // 5-Turbo is the cheap tier
    models: ["glm-5.3", "glm-5.2", "glm-5-turbo"],
    defaultModel: "glm-5.3",
    keyPlaceholder: "xxxxxxxx.xxxxxxxx"
  },
  {
    id: "qwen",
    label: "Qwen",
    // Versioned DashScope ids: the bare qwen-max alias still points at a
    // Qwen2.5-era snapshot, so name the 3.x tiers explicitly (2026-08)
    models: ["qwen3.8-max", "qwen3.7-plus", "qwen3.7-flash"],
    defaultModel: "qwen3.8-max",
    keyPlaceholder: "sk-..."
  },
  {
    id: "doubao",
    label: "Doubao",
    // Ark ids are dashed and date-pinned; it also accepts ep-... inference
    // endpoint ids in the model field
    models: ["doubao-seed-2-1-pro-260628", "doubao-seed-2-1-turbo-260628"],
    defaultModel: "doubao-seed-2-1-pro-260628",
    keyPlaceholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
  },
  {
    id: "minimax",
    label: "MiniMax",
    // M3 is the current agentic/tool-use model; M2.5 moved to the legacy tier
    models: ["MiniMax-M3", "MiniMax-M2.7"],
    defaultModel: "MiniMax-M3",
    keyPlaceholder: "eyJ..."
  },
  {
    id: "xai",
    label: "Grok",
    models: ["grok-4.6", "grok-4.5"],
    defaultModel: "grok-4.6",
    keyPlaceholder: "xai-..."
  },
  {
    id: "mistral",
    label: "Mistral",
    // `-latest` aliases track the newest GA snapshot. Medium 3.5 is Mistral's
    // agentic tier; codestral is a code-completion/FIM model, not an agent driver.
    models: ["mistral-medium-latest", "mistral-large-latest", "mistral-small-latest"],
    defaultModel: "mistral-medium-latest",
    keyPlaceholder: "API Key"
  },
  {
    id: "openrouter",
    label: "OpenRouter",
    // vendor-prefixed slugs exactly as openrouter.ai/api/v1/models lists them —
    // there is no `openai/gpt-5.6` alias there, only the per-tier ids
    models: [
      "openrouter/auto",
      "anthropic/claude-sonnet-5",
      "openai/gpt-5.6-sol",
      "moonshotai/kimi-k3"
    ],
    defaultModel: "openrouter/auto",
    keyPlaceholder: "sk-or-..."
  },
  {
    id: "custom",
    label: "Custom",
    models: [],
    defaultModel: "",
    keyPlaceholder: "API Key",
    needsBaseUrl: true
  }
];
function metaOf(id) {
  return AI_PROVIDERS.find((m) => m.id === id);
}
({
  // Bati AI — the managed provider. Requests are proxied by our server, which
  // resolves the backing vendor from the model role, so the desktop always
  // speaks one protocol and never learns which vendor answered.
  baticloud: {
    meta: metaOf("baticloud")
  },
  // Local models. Native Ollama protocol; see protocols/ollama.ts for why.
  ollama: {
    meta: metaOf("ollama")
  },
  anthropic: {
    meta: metaOf("anthropic")
  },
  gemini: {
    meta: metaOf("gemini")
  },
  deepseek: {
    meta: metaOf("deepseek")
  },
  openai: {
    meta: metaOf("openai")
  },
  kimi: {
    meta: metaOf("kimi")
  },
  glm: {
    meta: metaOf("glm")
  },
  qwen: {
    meta: metaOf("qwen")
  },
  doubao: {
    meta: metaOf("doubao")
  },
  minimax: {
    meta: metaOf("minimax")
  },
  xai: {
    meta: metaOf("xai")
  },
  mistral: {
    meta: metaOf("mistral")
  },
  openrouter: {
    meta: metaOf("openrouter")
  },
  custom: {
    meta: metaOf("custom")
  }
});
const ACTIONS = /* @__PURE__ */ new Set([
  "document.describe",
  "document.exportSelection",
  "document.exportSnapshot",
  "artifact.open",
  "changes.preview",
  "changes.apply"
]);
({
  allowedActions: [...ACTIONS]
});
class DesktopBatiAiExecutionError extends Error {
  code;
  retryable;
  correlationId;
  responseId;
  reason;
  constructor(error, responseId) {
    super(executionErrorMessage(error));
    this.name = "DesktopBatiAiExecutionError";
    this.code = error.code;
    this.retryable = error.retryable;
    this.correlationId = error.correlationId;
    this.responseId = responseId;
    this.reason = error.details?.reason;
  }
}
function executionErrorMessage(error) {
  if (error.details?.reason === "timeout") {
    return "고품질 AI 응답 시간이 초과되었습니다. 잠시 후 다시 시도하거나, 데이터 작성과 차트 생성을 두 요청으로 나눠 주세요.";
  }
  const message = error.message.trim();
  const unknown = !message || /(?:^|[\s(])unknown(?:[\s).]|$)/i.test(message);
  if (!unknown) return message;
  const code = error.code.trim().toUpperCase();
  if (code.includes("TIMEOUT") || code.includes("DEADLINE")) {
    return "고품질 AI 응답 시간이 초과되었습니다. 잠시 후 다시 시도하거나, 데이터 작성과 차트 생성을 두 요청으로 나눠 주세요.";
  }
  if (error.retryable) {
    return "AI 응답 생성이 완료되지 않았습니다. 잠시 후 다시 시도하거나, 복잡한 작업을 데이터 작성과 차트 생성처럼 두 단계로 나눠 주세요.";
  }
  return "AI 응답을 처리하지 못했습니다. 모델을 바꾸거나 요청을 더 작은 단계로 나눠 다시 시도해 주세요.";
}
function registerImageGenerationIpc(options) {
  options.ipc.handle(
    options.channel,
    async (_event, op) => {
      const client = options.getClient();
      if (!client) {
        return {
          error: "Image generation needs a signed-in Bati account; tell the user to sign in and retry",
          retryable: true
        };
      }
      const prompt = String(op?.prompt ?? "").trim();
      if (!prompt) return { error: "prompt must not be empty", retryable: false };
      try {
        const origin = op?.origin === "user" || op?.origin === "deck-cover" ? op.origin : void 0;
        const result = await client.generateImage({
          prompt,
          ...op?.aspectRatio ? { aspectRatio: String(op.aspectRatio) } : {},
          ...origin ? { origin } : {}
        });
        return { url: result.url };
      } catch (error) {
        if (error instanceof DesktopBatiAiExecutionError && error.reason === "content_filter") {
          return {
            error: "The image request was refused by content policy. Ask the user to rephrase the prompt; retrying it unchanged will fail again",
            retryable: false
          };
        }
        return {
          error: error instanceof Error ? error.message : String(error),
          retryable: true
        };
      }
    }
  );
}
const RETRYABLE_RENAME_CODES = /* @__PURE__ */ new Set(["EPERM", "EACCES", "EBUSY"]);
const RENAME_RETRIES = 4;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function atomicWriteFile(filePath, data) {
  const tmp = node_path.join(
    node_path.dirname(filePath),
    `.${node_path.basename(filePath)}.${node_crypto.randomBytes(6).toString("hex")}.tmp`
  );
  try {
    await promises.writeFile(tmp, data);
    for (let attempt = 0; ; attempt++) {
      try {
        await promises.rename(tmp, filePath);
        return;
      } catch (err) {
        const code = err.code ?? "";
        if (!RETRYABLE_RENAME_CODES.has(code) || attempt >= RENAME_RETRIES) throw err;
        await sleep(50 * 2 ** attempt);
      }
    }
  } catch (err) {
    try {
      await promises.unlink(tmp);
    } catch {
    }
    if (RETRYABLE_RENAME_CODES.has(err.code ?? "")) {
      await promises.writeFile(filePath, data);
      return;
    }
    throw err;
  }
}
const ASSET_MANIFEST_FILENAME = ".genoffice-assets.json";
const SHA256_RE = /^[a-f0-9]{64}$/;
const manifestLocks = /* @__PURE__ */ new Map();
function emptyManifest() {
  return {
    version: 1,
    files: [],
    documents: /* @__PURE__ */ Object.create(null),
    pending: /* @__PURE__ */ Object.create(null)
  };
}
function assetsDirFor(documentPath) {
  return node_path.join(node_path.dirname(node_path.resolve(documentPath)), "assets");
}
function manifestPathFor(documentPath) {
  return node_path.join(assetsDirFor(documentPath), ASSET_MANIFEST_FILENAME);
}
function documentKey(documentPath) {
  return node_path.basename(node_path.resolve(documentPath));
}
function errorCode$1(error) {
  return error?.code ?? "";
}
function isSafeAssetName(name) {
  return name.length > 0 && name.length <= 180 && name !== "." && name !== ".." && name !== ASSET_MANIFEST_FILENAME && node_path.basename(name) === name && !name.includes("/") && !name.includes("\\") && !name.includes("\0");
}
function replaceControlCharacters$1(value) {
  return [...value].map((character) => character.charCodeAt(0) < 32 ? "_" : character).join("");
}
function sanitizeAssetName(input) {
  const raw = node_path.basename(input.replace(/\\/g, "/"));
  const rawExt = node_path.extname(raw);
  const ext = /^\.[a-z0-9]{1,10}$/i.test(rawExt) ? rawExt.toLowerCase() : "";
  const maxStem = 140 - ext.length;
  const stem = replaceControlCharacters$1(raw.slice(0, raw.length - rawExt.length)).replace(/[/\\:*?"<>|#%]+/g, "_").replace(/\s+/g, "_").replace(/^\.+/, "").slice(0, maxStem).replace(/[. ]+$/g, "") || "image";
  const name = `${stem}${ext}`;
  return name === ASSET_MANIFEST_FILENAME ? `image-${name}` : name;
}
function nameWithSuffix(name, suffix) {
  if (suffix === 0) return name;
  const ext = node_path.extname(name);
  return `${node_path.basename(name, ext)}-${suffix}${ext}`;
}
function normalizedManifest(value) {
  if (!value || typeof value !== "object") throw new Error("asset manifest is not an object");
  const raw = value;
  if (raw.version !== 1 || !Array.isArray(raw.files)) {
    throw new Error("asset manifest has an unsupported format");
  }
  const files = [];
  const seen = /* @__PURE__ */ new Set();
  for (const item of raw.files) {
    if (!item || typeof item !== "object") throw new Error("asset manifest has a bad file entry");
    const { name, sha256 } = item;
    if (typeof name !== "string" || !isSafeAssetName(name) || typeof sha256 !== "string" || !SHA256_RE.test(sha256) || seen.has(name)) {
      throw new Error("asset manifest has an unsafe file entry");
    }
    seen.add(name);
    files.push({ name, sha256 });
  }
  const documents = /* @__PURE__ */ Object.create(null);
  if (raw.documents !== void 0) {
    if (!raw.documents || typeof raw.documents !== "object" || Array.isArray(raw.documents)) {
      throw new Error("asset manifest has bad document references");
    }
    for (const [key, names] of Object.entries(raw.documents)) {
      if (!isSafeAssetName(key) || !Array.isArray(names)) {
        throw new Error("asset manifest has unsafe document references");
      }
      const unique = /* @__PURE__ */ new Set();
      for (const name of names) {
        if (typeof name !== "string" || !isSafeAssetName(name)) {
          throw new Error("asset manifest has unsafe document references");
        }
        unique.add(name);
      }
      documents[key] = [...unique].sort();
    }
  }
  const pending = /* @__PURE__ */ Object.create(null);
  if (raw.pending !== void 0) {
    if (!raw.pending || typeof raw.pending !== "object" || Array.isArray(raw.pending)) {
      throw new Error("asset manifest has bad pending references");
    }
    for (const [key, names] of Object.entries(raw.pending)) {
      if (!isSafeAssetName(key) || !Array.isArray(names)) {
        throw new Error("asset manifest has unsafe pending references");
      }
      const unique = /* @__PURE__ */ new Set();
      for (const name of names) {
        if (typeof name !== "string" || !isSafeAssetName(name)) {
          throw new Error("asset manifest has unsafe pending references");
        }
        unique.add(name);
      }
      pending[key] = [...unique].sort();
    }
  }
  return {
    version: 1,
    files: files.sort((a, b) => a.name.localeCompare(b.name)),
    documents,
    pending
  };
}
async function existingAssetsDir(documentPath) {
  const assetsDir = assetsDirFor(documentPath);
  try {
    const info = await promises.lstat(assetsDir);
    if (!info.isDirectory() || info.isSymbolicLink()) {
      throw new Error("markdown assets path must be a real directory");
    }
    return assetsDir;
  } catch (error) {
    if (errorCode$1(error) === "ENOENT") return null;
    throw error;
  }
}
async function ensureAssetsDir(documentPath) {
  const existing = await existingAssetsDir(documentPath);
  if (existing) return existing;
  const assetsDir = assetsDirFor(documentPath);
  await promises.mkdir(assetsDir, { recursive: true });
  const info = await promises.lstat(assetsDir);
  if (!info.isDirectory() || info.isSymbolicLink()) {
    throw new Error("markdown assets path must be a real directory");
  }
  return assetsDir;
}
async function assertSafeManifestFile(path) {
  try {
    const info = await promises.lstat(path);
    if (!info.isFile() || info.isSymbolicLink()) {
      throw new Error("asset manifest path must be a real file");
    }
  } catch (error) {
    if (errorCode$1(error) !== "ENOENT") throw error;
  }
}
async function readManifestUnlocked(documentPath) {
  const assetsDir = await existingAssetsDir(documentPath);
  if (!assetsDir) return emptyManifest();
  const manifestPath = node_path.join(assetsDir, ASSET_MANIFEST_FILENAME);
  try {
    await assertSafeManifestFile(manifestPath);
    return normalizedManifest(JSON.parse(await promises.readFile(manifestPath, "utf8")));
  } catch (error) {
    if (errorCode$1(error) === "ENOENT") return emptyManifest();
    if (error instanceof SyntaxError) {
      throw new Error("asset manifest is invalid JSON", { cause: error });
    }
    throw error;
  }
}
async function writeManifestUnlocked(documentPath, manifest) {
  const assetsDir = await ensureAssetsDir(documentPath);
  const normalized = normalizedManifest(manifest);
  const text = `${JSON.stringify(normalized, null, 2)}
`;
  const manifestPath = node_path.join(assetsDir, ASSET_MANIFEST_FILENAME);
  await assertSafeManifestFile(manifestPath);
  await atomicWriteFile(manifestPath, Buffer.from(text, "utf8"));
}
async function withManifestLock(documentPath, run) {
  const key = manifestPathFor(documentPath);
  const previous = manifestLocks.get(key) ?? Promise.resolve();
  let release;
  const gate = new Promise((resolveGate) => {
    release = resolveGate;
  });
  const queued = previous.catch(() => {
  }).then(() => gate);
  manifestLocks.set(key, queued);
  await previous.catch(() => {
  });
  try {
    return await run();
  } finally {
    release();
    if (manifestLocks.get(key) === queued) manifestLocks.delete(key);
  }
}
async function sha256File(path) {
  return node_crypto.createHash("sha256").update(await promises.readFile(path)).digest("hex");
}
async function addOwnedRecord(documentPath, record) {
  await withManifestLock(documentPath, async () => {
    const manifest = await readManifestUnlocked(documentPath);
    const existing = manifest.files.find((file) => file.name === record.name);
    if (existing && existing.sha256 !== record.sha256) {
      throw new Error("asset manifest already owns a different file with this name");
    }
    if (!existing) manifest.files.push(record);
    const key = documentKey(documentPath);
    manifest.pending[key] = [.../* @__PURE__ */ new Set([...manifest.pending[key] ?? [], record.name])].sort();
    await writeManifestUnlocked(documentPath, manifest);
  });
}
async function createOwnedAsset(documentPath, preferredName, create) {
  const assetsDir = await ensureAssetsDir(documentPath);
  const base = sanitizeAssetName(preferredName);
  for (let suffix = 0; suffix < 1e5; suffix++) {
    const name = nameWithSuffix(base, suffix);
    const target = node_path.join(assetsDir, name);
    try {
      await create(target);
    } catch (error) {
      if (errorCode$1(error) === "EEXIST") continue;
      throw error;
    }
    try {
      await addOwnedRecord(documentPath, { name, sha256: await sha256File(target) });
      return `assets/${name}`;
    } catch (error) {
      await promises.rm(target, { force: true }).catch(() => {
      });
      throw error;
    }
  }
  throw new Error("markdown asset name space exhausted");
}
async function copyImageIntoOwnedAssets(documentPath, sourcePath) {
  return createOwnedAsset(
    documentPath,
    node_path.basename(sourcePath),
    (target) => promises.copyFile(sourcePath, target, node_fs.constants.COPYFILE_EXCL)
  );
}
async function writeImageIntoOwnedAssets(documentPath, preferredName, bytes) {
  return createOwnedAsset(
    documentPath,
    preferredName,
    (target) => promises.writeFile(target, bytes, { flag: "wx" })
  );
}
function decodeLocalSource(source) {
  const trimmed = source.trim();
  if (!trimmed || trimmed.includes("\0") || trimmed.includes("?") || trimmed.includes("#") || trimmed.startsWith("/") || trimmed.startsWith("\\") || /^[a-zA-Z]:[\\/]/.test(trimmed) || /^[a-z][a-z0-9+.-]*:/i.test(trimmed)) {
    return null;
  }
  try {
    return decodeURIComponent(trimmed);
  } catch {
    return null;
  }
}
function isPathInside$1(root, candidate) {
  const fromRoot = node_path.relative(root, candidate);
  return fromRoot.length > 0 && fromRoot !== ".." && !fromRoot.startsWith(`..${node_path.sep}`) && !node_path.isAbsolute(fromRoot);
}
async function resolveSafeRelativeImagePath(documentPath, source) {
  const decoded = decodeLocalSource(source);
  if (!decoded) return null;
  const documentDir = node_path.dirname(node_path.resolve(documentPath));
  const candidate = node_path.resolve(documentDir, decoded.replace(/[\\/]/g, node_path.sep));
  if (!isPathInside$1(documentDir, candidate)) return null;
  try {
    const [realDocumentDir, realCandidate, info] = await Promise.all([
      promises.realpath(documentDir),
      promises.realpath(candidate),
      promises.stat(candidate)
    ]);
    if (!info.isFile() || !isPathInside$1(realDocumentDir, realCandidate)) return null;
    return realCandidate;
  } catch {
    return null;
  }
}
function ownedNameForSource(source) {
  const decoded = decodeLocalSource(source);
  if (!decoded) return null;
  const parts = decoded.replace(/\\/g, "/").split("/").filter((part) => part && part !== ".");
  if (parts.length !== 2 || parts[0].toLowerCase() !== "assets" || parts.some((part) => part === "..") || !isSafeAssetName(parts[1])) {
    return null;
  }
  return parts[1];
}
async function siblingMarkdownReferences(documentPath, ownedNames, includeCurrent = false) {
  const references = /* @__PURE__ */ new Set();
  const documentDir = node_path.dirname(node_path.resolve(documentPath));
  const currentKey = documentKey(documentPath);
  try {
    for (const entry of await promises.readdir(documentDir, { withFileTypes: true })) {
      if (!entry.isFile() || !includeCurrent && entry.name === currentKey || !/\.(?:md|markdown)$/i.test(entry.name)) {
        continue;
      }
      const path = node_path.join(documentDir, entry.name);
      try {
        const info = await promises.stat(path);
        if (info.size > 16 * 1024 * 1024) return new Set(ownedNames);
        const scan = scanImageSources(await promises.readFile(path, "utf8"));
        if (scan.ambiguousHtml) return new Set(ownedNames);
        for (const { source } of scan.ranges) {
          const name = ownedNameForSource(source);
          if (name && ownedNames.has(name)) references.add(name);
        }
      } catch {
        return new Set(ownedNames);
      }
    }
  } catch {
    return new Set(ownedNames);
  }
  return references;
}
function escapedAt(text, index) {
  let slashes = 0;
  for (let i = index - 1; i >= 0 && text[i] === "\\"; i--) slashes++;
  return slashes % 2 === 1;
}
function imageDestinationRanges(markdown) {
  const ranges = [];
  for (let i = 0; i < markdown.length - 2; i++) {
    if (markdown[i] !== "!" || markdown[i + 1] !== "[" || escapedAt(markdown, i)) continue;
    let bracketDepth = 1;
    let altEnd = i + 2;
    for (; altEnd < markdown.length; altEnd++) {
      if (escapedAt(markdown, altEnd)) continue;
      if (markdown[altEnd] === "[") bracketDepth++;
      else if (markdown[altEnd] === "]" && --bracketDepth === 0) break;
    }
    if (bracketDepth !== 0) continue;
    let open = altEnd + 1;
    while (markdown[open] === " " || markdown[open] === "	") open++;
    if (markdown[open] !== "(") {
      i = altEnd;
      continue;
    }
    let close = open + 1;
    let parenDepth = 1;
    let quote = "";
    let angle = false;
    for (; close < markdown.length; close++) {
      const char = markdown[close];
      if (escapedAt(markdown, close)) continue;
      if (quote) {
        if (char === quote) quote = "";
        continue;
      }
      if (angle) {
        if (char === ">") angle = false;
        continue;
      }
      if (char === '"' || char === "'") quote = char;
      else if (char === "<") angle = true;
      else if (char === "(") parenDepth++;
      else if (char === ")" && --parenDepth === 0) break;
    }
    if (parenDepth !== 0) continue;
    let start = open + 1;
    let end = close;
    while (start < end && /\s/.test(markdown[start])) start++;
    while (end > start && /\s/.test(markdown[end - 1])) end--;
    if (markdown[start] === "<") {
      const angleEnd = markdown.indexOf(">", start + 1);
      if (angleEnd > start && angleEnd <= end) {
        start++;
        end = angleEnd;
      }
    } else {
      const raw = markdown.slice(start, end);
      const title = /\s+(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\))\s*$/.exec(raw);
      if (title?.index !== void 0) end = start + title.index;
      while (end > start && /\s/.test(markdown[end - 1])) end--;
    }
    if (end > start) {
      const source = markdown.slice(start, end).replace(/\\([\\()[\]<> ])/g, "$1");
      ranges.push({ start, end, source });
    }
    i = close;
  }
  return ranges;
}
const BASIC_HTML_ENTITIES = {
  amp: "&",
  apos: "'",
  gt: ">",
  lt: "<",
  nbsp: " ",
  quot: '"'
};
function decodeHtmlImageSource(value) {
  let ambiguous = false;
  const source = value.replace(/&([^&;\s]+);/g, (entity, body) => {
    if (body.startsWith("#")) {
      const hexadecimal = body[1]?.toLowerCase() === "x";
      const digits = body.slice(hexadecimal ? 2 : 1);
      if (digits.length === 0 || !(hexadecimal ? /^[0-9a-f]+$/i.test(digits) : /^[0-9]+$/.test(digits))) {
        ambiguous = true;
        return entity;
      }
      const codePoint = Number.parseInt(digits, hexadecimal ? 16 : 10);
      if (codePoint <= 0 || codePoint > 1114111 || codePoint >= 55296 && codePoint <= 57343) {
        ambiguous = true;
        return entity;
      }
      return String.fromCodePoint(codePoint);
    }
    const decoded = BASIC_HTML_ENTITIES[body.toLowerCase()];
    if (decoded === void 0) {
      ambiguous = true;
      return entity;
    }
    return decoded;
  });
  if (/&#(?:x[0-9a-f]*|[0-9]*)/i.test(source)) ambiguous = true;
  return { source, ambiguous };
}
function parseHtmlImageTag(text, tagStart) {
  let cursor = tagStart + 4;
  let sourceRange;
  let ambiguous = false;
  while (cursor < text.length) {
    while (cursor < text.length && /\s/.test(text[cursor])) cursor += 1;
    if (cursor >= text.length) return { nextIndex: text.length, ambiguous: true };
    if (text[cursor] === ">") {
      return {
        nextIndex: cursor + 1,
        ...ambiguous || sourceRange === void 0 ? {} : { range: sourceRange },
        ambiguous
      };
    }
    if (text[cursor] === "/" && text[cursor + 1] === ">") {
      return {
        nextIndex: cursor + 2,
        ...ambiguous || sourceRange === void 0 ? {} : { range: sourceRange },
        ambiguous
      };
    }
    if (text[cursor] === "/") {
      ambiguous = true;
      cursor += 1;
      continue;
    }
    const nameStart = cursor;
    while (cursor < text.length && !/\s/.test(text[cursor]) && text[cursor] !== "=" && text[cursor] !== "/" && text[cursor] !== ">") {
      cursor += 1;
    }
    if (cursor === nameStart) {
      ambiguous = true;
      cursor += 1;
      continue;
    }
    const attributeName = text.slice(nameStart, cursor).toLowerCase();
    while (cursor < text.length && /\s/.test(text[cursor])) cursor += 1;
    if (text[cursor] !== "=") {
      if (attributeName === "src") ambiguous = true;
      continue;
    }
    cursor += 1;
    while (cursor < text.length && /\s/.test(text[cursor])) cursor += 1;
    if (cursor >= text.length || text[cursor] === ">" || text[cursor] === "/" && text[cursor + 1] === ">") {
      if (attributeName === "src") ambiguous = true;
      continue;
    }
    const quote = text[cursor] === '"' ? '"' : text[cursor] === "'" ? "'" : null;
    let valueStart;
    let valueEnd;
    if (quote !== null) {
      valueStart = cursor + 1;
      valueEnd = text.indexOf(quote, valueStart);
      if (valueEnd < 0) return { nextIndex: text.length, ambiguous: true };
      cursor = valueEnd + 1;
    } else {
      valueStart = cursor;
      while (cursor < text.length && !/\s/.test(text[cursor]) && text[cursor] !== ">" && !(text[cursor] === "/" && text[cursor + 1] === ">")) {
        if (/["'`<=]/.test(text[cursor])) ambiguous = true;
        cursor += 1;
      }
      valueEnd = cursor;
      if (valueEnd === valueStart && attributeName === "src") ambiguous = true;
    }
    if (attributeName !== "src") continue;
    if (sourceRange !== void 0) {
      ambiguous = true;
      continue;
    }
    const decoded = decodeHtmlImageSource(text.slice(valueStart, valueEnd));
    if (decoded.ambiguous) ambiguous = true;
    sourceRange = {
      start: valueStart,
      end: valueEnd,
      source: decoded.source,
      htmlQuote: quote
    };
  }
  return { nextIndex: text.length, ambiguous: true };
}
function positionInRanges(ranges, position) {
  let low = 0;
  let high = ranges.length - 1;
  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    const range = ranges[middle];
    if (position < range.start) high = middle - 1;
    else if (position >= range.end) low = middle + 1;
    else return range;
  }
  return void 0;
}
function markdownCodeRanges(markdown) {
  const blockRanges = [];
  let fence = null;
  let offset = 0;
  for (const lineWithBreak of markdown.match(/.*(?:\n|$)/g) ?? []) {
    if (!lineWithBreak) continue;
    const line = lineWithBreak.replace(/\r?\n$/, "");
    const lineEnd = offset + lineWithBreak.length;
    if (fence) {
      const close = new RegExp(`^ {0,3}\\${fence.marker}{${fence.length},}[ \\t]*$`);
      if (close.test(line)) {
        blockRanges.push({ start: fence.start, end: lineEnd });
        fence = null;
      }
    } else {
      const open = /^ {0,3}(`{3,}|~{3,})(.*)$/.exec(line);
      if (open && (open[1][0] === "~" || !open[2].includes("`"))) {
        fence = {
          marker: open[1][0],
          length: open[1].length,
          start: offset
        };
      } else if (/^(?: {4}|\t)/.test(line)) {
        blockRanges.push({ start: offset, end: lineEnd });
      }
    }
    offset = lineEnd;
  }
  if (fence) blockRanges.push({ start: fence.start, end: markdown.length });
  blockRanges.sort((left, right) => left.start - right.start);
  const ranges = [...blockRanges];
  for (let index = 0; index < markdown.length; ) {
    const block = positionInRanges(blockRanges, index);
    if (block) {
      index = block.end;
      continue;
    }
    if (markdown[index] !== "`" || escapedAt(markdown, index)) {
      index += 1;
      continue;
    }
    let runEnd = index + 1;
    while (markdown[runEnd] === "`") runEnd += 1;
    const runLength = runEnd - index;
    let search = runEnd;
    let closeEnd = -1;
    while (search < markdown.length) {
      const blocked = positionInRanges(blockRanges, search);
      if (blocked) {
        search = blocked.end;
        continue;
      }
      const next = markdown.indexOf("`", search);
      if (next < 0) break;
      let nextEnd = next + 1;
      while (markdown[nextEnd] === "`") nextEnd += 1;
      if (nextEnd - next === runLength) {
        closeEnd = nextEnd;
        break;
      }
      search = nextEnd;
    }
    if (closeEnd > 0) {
      ranges.push({ start: index, end: closeEnd });
      index = closeEnd;
    } else {
      index = runEnd;
    }
  }
  return ranges.sort((left, right) => left.start - right.start);
}
function htmlImageSourceRanges(markdown, codeRanges) {
  const ranges = [];
  let ambiguousHtml = false;
  for (let index = 0; index < markdown.length; index += 1) {
    const code = positionInRanges(codeRanges, index);
    if (code) {
      index = code.end - 1;
      continue;
    }
    if (markdown[index] !== "<") continue;
    if (markdown.startsWith("<!--", index)) {
      const commentEnd = markdown.indexOf("-->", index + 4);
      if (commentEnd < 0) {
        if (/<img(?:\s|\/|>)/i.test(markdown.slice(index + 4))) ambiguousHtml = true;
        break;
      }
      index = commentEnd + 2;
      continue;
    }
    if (markdown.slice(index + 1, index + 4).toLowerCase() !== "img" || index + 4 < markdown.length && !/[\s/>]/.test(markdown[index + 4])) {
      continue;
    }
    const parsed = parseHtmlImageTag(markdown, index);
    if (parsed.ambiguous) ambiguousHtml = true;
    if (parsed.range) ranges.push(parsed.range);
    index = Math.max(index, parsed.nextIndex - 1);
  }
  return { ranges, ambiguousHtml };
}
function scanImageSources(markdown) {
  const codeRanges = markdownCodeRanges(markdown);
  const html = htmlImageSourceRanges(markdown, codeRanges);
  const markdownRanges = imageDestinationRanges(markdown).filter(
    (range) => positionInRanges(codeRanges, range.start) === void 0
  );
  const ordered = [...markdownRanges, ...html.ranges].sort(
    (left, right) => left.start - right.start || left.end - right.end
  );
  const ranges = [];
  for (const range of ordered) {
    const previous = ranges[ranges.length - 1];
    if (previous && range.start < previous.end) {
      html.ambiguousHtml = true;
      continue;
    }
    ranges.push(range);
  }
  return { ranges, ambiguousHtml: html.ambiguousHtml };
}
function extractMarkdownImageSources(markdown) {
  return scanImageSources(markdown).ranges.map((range) => range.source);
}
function encodeHtmlAttributeReplacement(value, quote) {
  let encoded = "";
  for (const character of value) {
    if (character === "&") encoded += "&amp;";
    else if (character === "<") encoded += "&lt;";
    else if (quote === '"' && character === '"') encoded += "&quot;";
    else if (quote === "'" && character === "'") encoded += "&#39;";
    else if (quote === null && /[\s"'`=>]/.test(character)) {
      encoded += `&#${character.codePointAt(0)};`;
    } else encoded += character;
  }
  return encoded;
}
function rewriteMarkdownImageSources(markdown, rewrites) {
  if (rewrites.size === 0) return markdown;
  const ranges = scanImageSources(markdown).ranges;
  let cursor = 0;
  let output = "";
  for (const range of ranges) {
    const replacement = rewrites.get(range.source);
    if (replacement === void 0) continue;
    output += markdown.slice(cursor, range.start);
    output += range.htmlQuote === void 0 ? replacement : encodeHtmlAttributeReplacement(replacement, range.htmlQuote);
    cursor = range.end;
  }
  return cursor === 0 ? markdown : output + markdown.slice(cursor);
}
async function removeCreatedRecords(documentPath, created) {
  if (created.length === 0) return;
  await withManifestLock(documentPath, async () => {
    const manifest = await readManifestUnlocked(documentPath);
    const createdNames = new Set(created.map((record) => record.name));
    const key = documentKey(documentPath);
    manifest.pending[key] = (manifest.pending[key] ?? []).filter((name) => !createdNames.has(name));
    if (manifest.pending[key].length === 0) delete manifest.pending[key];
    const referenced = /* @__PURE__ */ new Set([
      ...Object.values(manifest.documents).flat(),
      ...Object.values(manifest.pending).flat()
    ]);
    const removeNames = /* @__PURE__ */ new Set();
    for (const record of created) {
      if (referenced.has(record.name)) continue;
      const current = manifest.files.find(
        (file) => file.name === record.name && file.sha256 === record.sha256
      );
      if (!current) continue;
      const path = node_path.join(assetsDirFor(documentPath), record.name);
      try {
        const info = await promises.lstat(path);
        if (!info.isFile() || info.isSymbolicLink() || await sha256File(path) !== record.sha256) {
          continue;
        }
        await promises.rm(path);
        removeNames.add(record.name);
      } catch (error) {
        if (errorCode$1(error) === "ENOENT") removeNames.add(record.name);
      }
    }
    manifest.files = manifest.files.filter((file) => !removeNames.has(file.name));
    for (const key2 of Object.keys(manifest.documents)) {
      manifest.documents[key2] = manifest.documents[key2].filter((name) => !removeNames.has(name));
      if (manifest.documents[key2].length === 0) delete manifest.documents[key2];
    }
    for (const key2 of Object.keys(manifest.pending)) {
      manifest.pending[key2] = manifest.pending[key2].filter((name) => !removeNames.has(name));
      if (manifest.pending[key2].length === 0) delete manifest.pending[key2];
    }
    await writeManifestUnlocked(documentPath, manifest);
  });
}
async function prepareAssetsForSaveAs(sourceDocumentPath, targetDocumentPath, text, imageSources) {
  const allImageSources = [...imageSources];
  const knownSources = new Set(allImageSources);
  for (const source of extractMarkdownImageSources(text)) {
    if (knownSources.has(source)) continue;
    knownSources.add(source);
    allImageSources.push(source);
  }
  if (node_path.resolve(node_path.dirname(sourceDocumentPath)) === node_path.resolve(node_path.dirname(targetDocumentPath))) {
    return {
      targetDocumentPath,
      text,
      imageSources: allImageSources,
      rewrites: [],
      created: []
    };
  }
  const created = [];
  const rewrites = /* @__PURE__ */ new Map();
  const targetAssetsDir = await ensureAssetsDir(targetDocumentPath);
  try {
    await withManifestLock(targetDocumentPath, async () => {
      const manifest = await readManifestUnlocked(targetDocumentPath);
      const reservedNames = new Set(manifest.files.map((file) => file.name));
      const copiedByRealPath = /* @__PURE__ */ new Map();
      for (const source of allImageSources) {
        if (rewrites.has(source)) continue;
        const safeSource = await resolveSafeRelativeImagePath(sourceDocumentPath, source);
        if (!safeSource) continue;
        const alreadyCopied = copiedByRealPath.get(safeSource);
        if (alreadyCopied) {
          rewrites.set(source, alreadyCopied);
          continue;
        }
        const base = sanitizeAssetName(node_path.basename(safeSource));
        let copied = null;
        for (let suffix = 0; suffix < 1e5; suffix++) {
          const name = nameWithSuffix(base, suffix);
          if (reservedNames.has(name)) continue;
          const target = node_path.join(targetAssetsDir, name);
          try {
            await promises.copyFile(safeSource, target, node_fs.constants.COPYFILE_EXCL);
            copied = { name, sha256: await sha256File(target) };
            break;
          } catch (error) {
            if (errorCode$1(error) === "EEXIST") continue;
            throw error;
          }
        }
        if (!copied) throw new Error("markdown asset name space exhausted");
        created.push(copied);
        manifest.files.push(copied);
        reservedNames.add(copied.name);
        const targetKey = documentKey(targetDocumentPath);
        manifest.pending[targetKey] = [
          .../* @__PURE__ */ new Set([...manifest.pending[targetKey] ?? [], copied.name])
        ].sort();
        const authored = `assets/${copied.name}`;
        copiedByRealPath.set(safeSource, authored);
        rewrites.set(source, authored);
      }
      const rewrittenDestinations = new Set(
        extractMarkdownImageSources(rewriteMarkdownImageSources(text, rewrites))
      );
      for (const destination of rewrites.values()) {
        if (!rewrittenDestinations.has(destination)) {
          throw new Error("could not safely rewrite a Markdown image during Save As");
        }
      }
      await writeManifestUnlocked(targetDocumentPath, manifest);
    });
  } catch (error) {
    for (const record of created) {
      await promises.rm(node_path.join(targetAssetsDir, record.name), { force: true }).catch(() => {
      });
    }
    throw error;
  }
  const rewriteList = [...rewrites].map(([from, to]) => ({ from, to }));
  return {
    targetDocumentPath,
    text: rewriteMarkdownImageSources(text, rewrites),
    imageSources: allImageSources.map((source) => rewrites.get(source) ?? source),
    rewrites: rewriteList,
    created
  };
}
async function rollbackPreparedSaveAsAssets(plan) {
  await removeCreatedRecords(plan.targetDocumentPath, plan.created);
}
async function pendingOwnedAssetsForDocument(documentPath) {
  try {
    return await withManifestLock(documentPath, async () => {
      const manifest = await readManifestUnlocked(documentPath);
      return [...manifest.pending[documentKey(documentPath)] ?? []];
    });
  } catch {
    return [];
  }
}
async function resolvePendingOwnedAssets(documentPath, pendingAtOperationStart) {
  const result = { deleted: [], preserved: [], errors: [] };
  try {
    return await withManifestLock(documentPath, async () => {
      const manifest = await readManifestUnlocked(documentPath);
      const key = documentKey(documentPath);
      const currentPending = manifest.pending[key] ?? [];
      const requested = new Set(pendingAtOperationStart ?? currentPending);
      const pendingNames = new Set(currentPending.filter((name) => requested.has(name)));
      if (pendingNames.size === 0) return result;
      manifest.pending[key] = currentPending.filter((name) => !pendingNames.has(name));
      if (manifest.pending[key].length === 0) delete manifest.pending[key];
      const assetsDir = await existingAssetsDir(documentPath);
      if (!assetsDir) return result;
      const recordsByName = new Map(manifest.files.map((record) => [record.name, record]));
      const ownedNames = new Set(recordsByName.keys());
      const referenced = /* @__PURE__ */ new Set([
        ...Object.values(manifest.documents).flat(),
        ...Object.values(manifest.pending).flat()
      ]);
      for (const name of await siblingMarkdownReferences(documentPath, ownedNames, true)) {
        referenced.add(name);
      }
      const relinquished = /* @__PURE__ */ new Set();
      for (const name of pendingNames) {
        const record = recordsByName.get(name);
        if (!record) continue;
        const path = node_path.join(assetsDir, name);
        try {
          const info = await promises.lstat(path);
          if (!info.isFile() || info.isSymbolicLink() || await sha256File(path) !== record.sha256) {
            relinquished.add(name);
            result.preserved.push(name);
            continue;
          }
          if (referenced.has(name)) {
            result.preserved.push(name);
            continue;
          }
          await promises.rm(path);
          relinquished.add(name);
          result.deleted.push(name);
        } catch (error) {
          if (errorCode$1(error) === "ENOENT") {
            relinquished.add(name);
          } else {
            result.preserved.push(name);
            result.errors.push(`${name}: ${error instanceof Error ? error.message : String(error)}`);
          }
        }
      }
      manifest.files = manifest.files.filter((record) => !relinquished.has(record.name));
      for (const references of [manifest.documents, manifest.pending]) {
        for (const referenceKey of Object.keys(references)) {
          references[referenceKey] = references[referenceKey].filter(
            (name) => !relinquished.has(name)
          );
          if (references[referenceKey].length === 0) delete references[referenceKey];
        }
      }
      await writeManifestUnlocked(documentPath, manifest);
      return result;
    });
  } catch (error) {
    result.errors.push(error instanceof Error ? error.message : String(error));
    return result;
  }
}
async function resolveSourcePendingAfterSaveAs(sourceDocumentPath, pendingAtSaveStart) {
  return resolvePendingOwnedAssets(sourceDocumentPath, pendingAtSaveStart);
}
async function reconcileOwnedAssets(documentPath, imageSources, options = {}) {
  const result = { deleted: [], preserved: [], errors: [] };
  try {
    return await withManifestLock(documentPath, async () => {
      const manifest = await readManifestUnlocked(documentPath);
      const assetsDir = await existingAssetsDir(documentPath);
      if (!assetsDir) return result;
      const validRecords = [];
      const relinquished = /* @__PURE__ */ new Set();
      for (const record of manifest.files) {
        const path = node_path.join(assetsDir, record.name);
        try {
          const info = await promises.lstat(path);
          if (!info.isFile() || info.isSymbolicLink() || await sha256File(path) !== record.sha256) {
            relinquished.add(record.name);
            result.preserved.push(record.name);
          } else {
            validRecords.push(record);
          }
        } catch (error) {
          if (errorCode$1(error) !== "ENOENT") {
            relinquished.add(record.name);
            result.preserved.push(record.name);
            result.errors.push(
              `${record.name}: ${error instanceof Error ? error.message : String(error)}`
            );
          }
        }
      }
      manifest.files = validRecords;
      const ownedNames = new Set(validRecords.map((record) => record.name));
      for (const key2 of Object.keys(manifest.documents)) {
        manifest.documents[key2] = manifest.documents[key2].filter(
          (name) => ownedNames.has(name) && !relinquished.has(name)
        );
        if (manifest.documents[key2].length === 0) delete manifest.documents[key2];
      }
      for (const key2 of Object.keys(manifest.pending)) {
        manifest.pending[key2] = manifest.pending[key2].filter(
          (name) => ownedNames.has(name) && !relinquished.has(name)
        );
        if (manifest.pending[key2].length === 0) delete manifest.pending[key2];
      }
      const currentReferences = /* @__PURE__ */ new Set();
      for (const source of imageSources) {
        const name = ownedNameForSource(source);
        if (name && ownedNames.has(name)) currentReferences.add(name);
      }
      const key = documentKey(documentPath);
      if (currentReferences.size > 0) {
        manifest.documents[key] = [...currentReferences].sort();
      } else {
        delete manifest.documents[key];
      }
      const pendingToResolve = new Set(options.pendingNames ?? manifest.pending[key] ?? []);
      manifest.pending[key] = (manifest.pending[key] ?? []).filter(
        (name) => !pendingToResolve.has(name)
      );
      if (manifest.pending[key].length === 0) delete manifest.pending[key];
      const referenced = /* @__PURE__ */ new Set([
        ...Object.values(manifest.documents).flat(),
        ...Object.values(manifest.pending).flat()
      ]);
      for (const name of await siblingMarkdownReferences(documentPath, ownedNames)) {
        referenced.add(name);
      }
      const deleted = /* @__PURE__ */ new Set();
      for (const record of validRecords) {
        if (referenced.has(record.name)) continue;
        const path = node_path.join(assetsDir, record.name);
        try {
          const info = await promises.lstat(path);
          if (!info.isFile() || info.isSymbolicLink() || await sha256File(path) !== record.sha256) {
            result.preserved.push(record.name);
            continue;
          }
          await promises.rm(path);
          deleted.add(record.name);
          result.deleted.push(record.name);
        } catch (error) {
          if (errorCode$1(error) === "ENOENT") {
            deleted.add(record.name);
          } else {
            result.errors.push(
              `${record.name}: ${error instanceof Error ? error.message : String(error)}`
            );
          }
        }
      }
      manifest.files = manifest.files.filter((record) => !deleted.has(record.name));
      for (const doc of Object.keys(manifest.documents)) {
        manifest.documents[doc] = manifest.documents[doc].filter((name) => !deleted.has(name));
        if (manifest.documents[doc].length === 0) delete manifest.documents[doc];
      }
      for (const doc of Object.keys(manifest.pending)) {
        manifest.pending[doc] = manifest.pending[doc].filter((name) => !deleted.has(name));
        if (manifest.pending[doc].length === 0) delete manifest.pending[doc];
      }
      try {
        await writeManifestUnlocked(documentPath, manifest);
      } catch (error) {
        result.errors.push(error instanceof Error ? error.message : String(error));
      }
      return result;
    });
  } catch (error) {
    result.errors.push(error instanceof Error ? error.message : String(error));
    return result;
  }
}
const MARKDOWN_CONVERSION_TTL_MS = 7 * 24 * 60 * 60 * 1e3;
const SESSION_MARKER = ".genoffice-markdown-conversion.json";
function errorCode(error) {
  return error?.code ?? "";
}
function isPathInside(root, candidate) {
  const fromRoot = node_path.relative(root, candidate);
  return fromRoot.length > 0 && fromRoot !== ".." && !fromRoot.startsWith(`..${node_path.sep}`) && !node_path.isAbsolute(fromRoot);
}
function replaceControlCharacters(value) {
  return [...value].map((character) => character.charCodeAt(0) < 32 ? "_" : character).join("");
}
function safeBaseName(input) {
  const raw = node_path.basename(input);
  const ext = node_path.extname(raw);
  return replaceControlCharacters(raw.slice(0, raw.length - ext.length)).replace(/[/\\:*?"<>|]+/g, "_").replace(/\s+/g, "_").replace(/^\.+/, "").slice(0, 100).replace(/[. ]+$/g, "") || "Untitled";
}
async function readSessionMarker(directory) {
  try {
    const value = JSON.parse(await promises.readFile(node_path.join(directory, SESSION_MARKER), "utf8"));
    if (value.version !== 1 || typeof value.createdAt !== "number" || !Number.isFinite(value.createdAt) || value.createdAt < 0) {
      return null;
    }
    return { version: 1, createdAt: value.createdAt };
  } catch {
    return null;
  }
}
async function cleanupStaleMarkdownConversions(root, now = Date.now(), ttlMs = MARKDOWN_CONVERSION_TTL_MS) {
  const absoluteRoot = node_path.resolve(root);
  await promises.mkdir(absoluteRoot, { recursive: true });
  const removed = [];
  for (const entry of await promises.readdir(absoluteRoot, { withFileTypes: true })) {
    if (!entry.isDirectory() || !entry.name.startsWith("session-")) continue;
    const directory = node_path.join(absoluteRoot, entry.name);
    if (!isPathInside(absoluteRoot, directory)) continue;
    const marker = await readSessionMarker(directory);
    if (!marker || now - marker.createdAt < ttlMs) continue;
    await promises.rm(directory, { recursive: true, force: true });
    removed.push(directory);
  }
  return removed;
}
async function createMarkdownConversionSession(root, options = {}) {
  const now = options.now ?? Date.now();
  const absoluteRoot = node_path.resolve(root);
  await cleanupStaleMarkdownConversions(
    absoluteRoot,
    now,
    options.ttlMs ?? MARKDOWN_CONVERSION_TTL_MS
  );
  const rawId = options.id ?? node_crypto.randomUUID();
  const id = rawId.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 80) || node_crypto.randomUUID();
  const directory = node_path.join(absoluteRoot, `session-${now}-${id}`);
  if (!isPathInside(absoluteRoot, directory)) {
    throw new Error("invalid Markdown conversion session path");
  }
  await promises.mkdir(directory);
  const marker = { version: 1, createdAt: now };
  await promises.writeFile(node_path.join(directory, SESSION_MARKER), `${JSON.stringify(marker)}
`, { flag: "wx" });
  return directory;
}
async function writeMarkdownConversion(sessionDirectory, suggestedName, bytes, id = node_crypto.randomUUID()) {
  const marker = await readSessionMarker(sessionDirectory);
  if (!marker) throw new Error("invalid Markdown conversion session");
  const base = safeBaseName(suggestedName);
  const safeId = id.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 80) || node_crypto.randomUUID();
  for (let suffix = 0; suffix < 1e5; suffix++) {
    const tail = suffix === 0 ? "" : `-${suffix}`;
    const target = node_path.join(sessionDirectory, `${base}-${safeId}${tail}.docx`);
    if (!isPathInside(node_path.resolve(sessionDirectory), node_path.resolve(target))) {
      throw new Error("invalid Markdown conversion output path");
    }
    try {
      await promises.writeFile(target, bytes, { flag: "wx" });
      return target;
    } catch (error) {
      if (errorCode(error) === "EEXIST") continue;
      throw error;
    }
  }
  throw new Error("Markdown conversion name space exhausted");
}
const MARKDOWN_CHANNELS = {
  consumePending: "markdown:consume-pending",
  readFile: "markdown:read-file",
  save: "markdown:save",
  saveRequestAck: "markdown:save-request-ack",
  dirtyChanged: "markdown:dirty-changed",
  closeSaveResult: "markdown:close-save-result",
  pickImage: "markdown:pick-image",
  saveImage: "markdown:save-image",
  readImage: "markdown:read-image",
  exportDocx: "markdown:export-docx",
  exportPdf: "markdown:export-pdf",
  aiGenerateImage: "markdown:ai-generate-image",
  getLanguage: "app:get-language"
};
const tDlg = createI18n({
  zh: {
    dlgSaveTitle: "保存 Markdown 文档",
    filterMarkdown: "Markdown 文档",
    dlgPickImage: "选择图片",
    filterImages: "图片",
    untitledFile: "未命名文档",
    closeUnsavedMsg: "此文档有未保存的更改。",
    closeUnsavedDetail: "关闭前是否保存？",
    btnSave: "保存",
    btnDontSave: "不保存",
    btnCancel: "取消"
  },
  en: {
    dlgSaveTitle: "Save Markdown Document",
    filterMarkdown: "Markdown Documents",
    dlgPickImage: "Choose an Image",
    filterImages: "Images",
    untitledFile: "Untitled",
    closeUnsavedMsg: "This document has unsaved changes.",
    closeUnsavedDetail: "Do you want to save them before closing?",
    btnSave: "Save",
    btnDontSave: "Don't Save",
    btnCancel: "Cancel"
  },
  ja: {
    dlgSaveTitle: "Markdown ドキュメントを保存",
    filterMarkdown: "Markdown ドキュメント",
    dlgPickImage: "画像を選択",
    filterImages: "画像",
    untitledFile: "無題",
    closeUnsavedMsg: "このドキュメントに未保存の変更があります。",
    closeUnsavedDetail: "閉じる前に保存しますか？",
    btnSave: "保存",
    btnDontSave: "保存しない",
    btnCancel: "キャンセル"
  },
  ko: {
    dlgSaveTitle: "Markdown 문서 저장",
    filterMarkdown: "Markdown 문서",
    dlgPickImage: "이미지 선택",
    filterImages: "이미지",
    untitledFile: "제목 없음",
    closeUnsavedMsg: "이 문서에 저장하지 않은 변경 사항이 있습니다.",
    closeUnsavedDetail: "닫기 전에 저장하시겠습니까?",
    btnSave: "저장",
    btnDontSave: "저장 안 함",
    btnCancel: "취소"
  },
  fr: {
    dlgSaveTitle: "Enregistrer le document Markdown",
    filterMarkdown: "Documents Markdown",
    dlgPickImage: "Choisir une image",
    filterImages: "Images",
    untitledFile: "Sans titre",
    closeUnsavedMsg: "Ce document contient des modifications non enregistrées.",
    closeUnsavedDetail: "Voulez-vous les enregistrer avant de fermer ?",
    btnSave: "Enregistrer",
    btnDontSave: "Ne pas enregistrer",
    btnCancel: "Annuler"
  },
  de: {
    dlgSaveTitle: "Markdown-Dokument speichern",
    filterMarkdown: "Markdown-Dokumente",
    dlgPickImage: "Bild auswählen",
    filterImages: "Bilder",
    untitledFile: "Unbenannt",
    closeUnsavedMsg: "Dieses Dokument enthält ungespeicherte Änderungen.",
    closeUnsavedDetail: "Vor dem Schließen speichern?",
    btnSave: "Speichern",
    btnDontSave: "Nicht speichern",
    btnCancel: "Abbrechen"
  },
  es: {
    dlgSaveTitle: "Guardar documento Markdown",
    filterMarkdown: "Documentos Markdown",
    dlgPickImage: "Elegir imagen",
    filterImages: "Imágenes",
    untitledFile: "Sin título",
    closeUnsavedMsg: "Este documento tiene cambios sin guardar.",
    closeUnsavedDetail: "¿Quieres guardarlos antes de cerrar?",
    btnSave: "Guardar",
    btnDontSave: "No guardar",
    btnCancel: "Cancelar"
  },
  th: {
    dlgSaveTitle: "บันทึกเอกสาร Markdown",
    filterMarkdown: "เอกสาร Markdown",
    dlgPickImage: "เลือกรูปภาพ",
    filterImages: "รูปภาพ",
    untitledFile: "ไม่มีชื่อ",
    closeUnsavedMsg: "เอกสารนี้มีการเปลี่ยนแปลงที่ยังไม่ได้บันทึก",
    closeUnsavedDetail: "ต้องการบันทึกก่อนปิดหรือไม่?",
    btnSave: "บันทึก",
    btnDontSave: "ไม่บันทึก",
    btnCancel: "ยกเลิก"
  },
  id: {
    dlgSaveTitle: "Simpan dokumen Markdown",
    filterMarkdown: "Dokumen Markdown",
    dlgPickImage: "Pilih gambar",
    filterImages: "Gambar",
    untitledFile: "Tanpa judul",
    closeUnsavedMsg: "Dokumen ini memiliki perubahan yang belum disimpan.",
    closeUnsavedDetail: "Simpan sebelum menutup?",
    btnSave: "Simpan",
    btnDontSave: "Jangan Simpan",
    btnCancel: "Batal"
  },
  ru: {
    dlgSaveTitle: "Сохранить документ Markdown",
    filterMarkdown: "Документы Markdown",
    dlgPickImage: "Выберите изображение",
    filterImages: "Изображения",
    untitledFile: "Без названия",
    closeUnsavedMsg: "В этом документе есть несохранённые изменения.",
    closeUnsavedDetail: "Сохранить их перед закрытием?",
    btnSave: "Сохранить",
    btnDontSave: "Не сохранять",
    btnCancel: "Отмена"
  },
  ar: {
    dlgSaveTitle: "حفظ مستند Markdown",
    filterMarkdown: "مستندات Markdown",
    dlgPickImage: "اختر صورة",
    filterImages: "صور",
    untitledFile: "بدون عنوان",
    closeUnsavedMsg: "يحتوي هذا المستند على تغييرات غير محفوظة.",
    closeUnsavedDetail: "هل تريد حفظها قبل الإغلاق؟",
    btnSave: "حفظ",
    btnDontSave: "عدم الحفظ",
    btnCancel: "إلغاء"
  },
  pt: {
    dlgSaveTitle: "Salvar documento Markdown",
    filterMarkdown: "Documentos Markdown",
    dlgPickImage: "Escolher imagem",
    filterImages: "Imagens",
    untitledFile: "Sem título",
    closeUnsavedMsg: "Este documento tem alterações não salvas.",
    closeUnsavedDetail: "Deseja salvá-las antes de fechar?",
    btnSave: "Salvar",
    btnDontSave: "Não Salvar",
    btnCancel: "Cancelar"
  },
  it: {
    dlgSaveTitle: "Salva documento Markdown",
    filterMarkdown: "Documenti Markdown",
    dlgPickImage: "Scegli immagine",
    filterImages: "Immagini",
    untitledFile: "Senza titolo",
    closeUnsavedMsg: "Questo documento contiene modifiche non salvate.",
    closeUnsavedDetail: "Vuoi salvarle prima di chiudere?",
    btnSave: "Salva",
    btnDontSave: "Non salvare",
    btnCancel: "Annulla"
  },
  pl: {
    dlgSaveTitle: "Zapisz dokument Markdown",
    filterMarkdown: "Dokumenty Markdown",
    dlgPickImage: "Wybierz obraz",
    filterImages: "Obrazy",
    untitledFile: "Bez tytułu",
    closeUnsavedMsg: "Ten dokument ma niezapisane zmiany.",
    closeUnsavedDetail: "Czy zapisać je przed zamknięciem?",
    btnSave: "Zapisz",
    btnDontSave: "Nie zapisuj",
    btnCancel: "Anuluj"
  },
  nl: {
    dlgSaveTitle: "Markdown-document opslaan",
    filterMarkdown: "Markdown-documenten",
    dlgPickImage: "Kies een afbeelding",
    filterImages: "Afbeeldingen",
    untitledFile: "Naamloos",
    closeUnsavedMsg: "Dit document bevat niet-opgeslagen wijzigingen.",
    closeUnsavedDetail: "Wilt u ze opslaan voordat u sluit?",
    btnSave: "Opslaan",
    btnDontSave: "Niet opslaan",
    btnCancel: "Annuleren"
  },
  ms: {
    dlgSaveTitle: "Simpan dokumen Markdown",
    filterMarkdown: "Dokumen Markdown",
    dlgPickImage: "Pilih imej",
    filterImages: "Imej",
    untitledFile: "Tanpa tajuk",
    closeUnsavedMsg: "Dokumen ini mempunyai perubahan yang belum disimpan.",
    closeUnsavedDetail: "Simpan sebelum menutup?",
    btnSave: "Simpan",
    btnDontSave: "Jangan Simpan",
    btnCancel: "Batal"
  },
  he: {
    dlgSaveTitle: "שמירת מסמך Markdown",
    filterMarkdown: "מסמכי Markdown",
    dlgPickImage: "בחרו תמונה",
    filterImages: "תמונות",
    untitledFile: "ללא שם",
    closeUnsavedMsg: "במסמך הזה יש שינויים שלא נשמרו.",
    closeUnsavedDetail: "האם לשמור אותם לפני הסגירה?",
    btnSave: "שמירה",
    btnDontSave: "אל תשמור",
    btnCancel: "ביטול"
  },
  hi: {
    dlgSaveTitle: "Markdown दस्तावेज़ सहेजें",
    filterMarkdown: "Markdown दस्तावेज़",
    dlgPickImage: "छवि चुनें",
    filterImages: "छवियाँ",
    untitledFile: "शीर्षकहीन",
    closeUnsavedMsg: "इस दस्तावेज़ में सहेजे नहीं गए परिवर्तन हैं।",
    closeUnsavedDetail: "क्या बंद करने से पहले उन्हें सहेजना चाहते हैं?",
    btnSave: "सहेजें",
    btnDontSave: "न सहेजें",
    btnCancel: "रद्द करें"
  },
  "zh-TW": {
    dlgSaveTitle: "儲存 Markdown 文件",
    filterMarkdown: "Markdown 文件",
    dlgPickImage: "選擇圖片",
    filterImages: "圖片",
    untitledFile: "未命名文件",
    closeUnsavedMsg: "此文件有未儲存的變更。",
    closeUnsavedDetail: "關閉前是否儲存？",
    btnSave: "儲存",
    btnDontSave: "不儲存",
    btnCancel: "取消"
  }
});
const tm = (key) => tDlg(getUiLang(), key);
let runtime = { preloadPath: "" };
function configureMarkdownRuntime(paths) {
  runtime = paths;
}
function openExportedPdf(path) {
  try {
    if (runtime.openGeneratedPath?.(path)) return;
  } catch (err) {
    console.warn("[markdown] Failed to open exported PDF:", err);
  }
  electron.shell.showItemInFolder(path);
}
const openPathByWc = /* @__PURE__ */ new Map();
const allowedByWc = /* @__PURE__ */ new Map();
const savePathByWc = /* @__PURE__ */ new Map();
const dirtyByWc = /* @__PURE__ */ new Set();
const closeSaveWaiters = /* @__PURE__ */ new Map();
const saveWaiters = /* @__PURE__ */ new Map();
let fileSavedHook = null;
let docxExportedHook = null;
let conversionSessionPromise = null;
function markdownConversionSession() {
  conversionSessionPromise ??= createMarkdownConversionSession(
    node_path.join(electron.app.getPath("userData"), "markdown-conversions")
  );
  return conversionSessionPromise;
}
async function writeTextAtomic(path, text) {
  await atomicWriteFile(path, Buffer.from(text, "utf8"));
}
async function resolveSaveTarget(e, mode, suggestedName) {
  const current = savePathByWc.get(e.sender.id);
  if (mode === "save" && current) return current;
  if (mode === "save" && !current && suggestedName) {
    const base = suggestedName.replace(/[/\\:*?"<>|]/g, "_").slice(0, 80).trim();
    if (base) {
      const dir = configuredDefaultSaveDir(electron.app);
      let target = node_path.join(dir, `${base}.md`);
      for (let n = 1; node_fs.existsSync(target); n++) target = node_path.join(dir, `${base}-${n}.md`);
      return target;
    }
  }
  const win = electron.BrowserWindow.fromWebContents(e.sender) ?? electron.BrowserWindow.getFocusedWindow() ?? void 0;
  const defaultPath = current ? node_path.join(node_path.dirname(current), node_path.basename(current)) : node_path.join(configuredDefaultSaveDir(electron.app), `${tm("untitledFile")}.md`);
  const picked = await showSaveDialogWithMemory(electron.dialog, win, {
    title: tm("dlgSaveTitle"),
    defaultPath,
    filters: [{ name: tm("filterMarkdown"), extensions: ["md", "markdown"] }]
  });
  if (picked.canceled || !picked.filePath) return "canceled";
  return picked.filePath;
}
const DISPLAY_IMAGE_EXTS = /* @__PURE__ */ new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".svg",
  ".bmp",
  ".avif"
]);
function registerImageProtocol() {
  electron.protocol.handle("md-asset", async (request) => {
    let target;
    try {
      target = decodeURIComponent(new URL(request.url).pathname);
    } catch {
      return new Response(null, { status: 400 });
    }
    if (/^\/[a-zA-Z]:\//.test(target)) target = target.slice(1);
    target = node_path.resolve(target);
    if (!DISPLAY_IMAGE_EXTS.has(node_path.extname(target).toLowerCase()) || !node_fs.existsSync(target)) {
      return new Response(null, { status: 404 });
    }
    let inDocDir = false;
    for (const doc of /* @__PURE__ */ new Set([...openPathByWc.values(), ...savePathByWc.values()])) {
      const dir = node_path.resolve(node_path.dirname(doc));
      if (target === dir || !target.startsWith(dir + node_path.sep)) continue;
      if (await resolveSafeRelativeImagePath(doc, node_path.relative(dir, target))) {
        inDocDir = true;
        break;
      }
    }
    if (!inDocDir) return new Response(null, { status: 403 });
    return electron.net.fetch(node_url.pathToFileURL(target).toString());
  });
}
let ipcRegistered = false;
function registerMarkdownIpc() {
  if (ipcRegistered) return;
  ipcRegistered = true;
  registerImageProtocol();
  electron.ipcMain.handle(MARKDOWN_CHANNELS.consumePending, (e) => openPathByWc.get(e.sender.id) ?? null);
  electron.ipcMain.handle(MARKDOWN_CHANNELS.readFile, async (e, path) => {
    if (typeof path !== "string" || !allowedByWc.get(e.sender.id)?.has(path)) {
      throw new Error("markdown: path not granted to this view");
    }
    return await promises.readFile(path, "utf8");
  });
  electron.ipcMain.handle(
    MARKDOWN_CHANNELS.save,
    async (e, request) => {
      const waiter = saveWaiters.get(e.sender.id);
      saveWaiters.delete(e.sender.id);
      const done = (result) => {
        waiter?.(result.ok && !("canceled" in result));
        return result;
      };
      if (typeof request?.text !== "string") {
        return done({ ok: false, error: "markdown: bad save request" });
      }
      if (request.imageSources !== void 0 && (!Array.isArray(request.imageSources) || request.imageSources.some((source) => typeof source !== "string"))) {
        return done({ ok: false, error: "markdown: bad image references" });
      }
      const mode = request.mode === "saveAs" ? "saveAs" : "save";
      const pathAtRequest = savePathByWc.get(e.sender.id);
      const pendingAtRequest = pathAtRequest ? await pendingOwnedAssetsForDocument(pathAtRequest) : [];
      try {
        const suggestedName = typeof request.suggestedName === "string" ? request.suggestedName : void 0;
        const target = await resolveSaveTarget(e, mode, suggestedName);
        if (target === "canceled") return done({ ok: true, canceled: true });
        if (!target) return done({ ok: false, error: "markdown: no save target" });
        const currentPath = pathAtRequest;
        const isNewPath = currentPath !== target;
        const imageSources = [...request.imageSources ?? []];
        const knownImageSources = new Set(imageSources);
        for (const source of extractMarkdownImageSources(request.text)) {
          if (knownImageSources.has(source)) continue;
          knownImageSources.add(source);
          imageSources.push(source);
        }
        const prepared = currentPath && node_path.resolve(node_path.dirname(currentPath)) !== node_path.resolve(node_path.dirname(target)) ? await prepareAssetsForSaveAs(currentPath, target, request.text, imageSources) : null;
        const textToWrite = prepared?.text ?? request.text;
        const savedImageSources = prepared?.imageSources ?? imageSources;
        try {
          await writeTextAtomic(target, textToWrite);
        } catch (error) {
          if (prepared) await rollbackPreparedSaveAsAssets(prepared).catch(() => {
          });
          throw error;
        }
        savePathByWc.set(e.sender.id, target);
        openPathByWc.set(e.sender.id, target);
        const allowed = allowedByWc.get(e.sender.id) ?? /* @__PURE__ */ new Set();
        allowed.add(target);
        allowedByWc.set(e.sender.id, allowed);
        dirtyByWc.delete(e.sender.id);
        const pendingNames = prepared ? prepared.created.map((record) => record.name) : currentPath && node_path.resolve(currentPath) === node_path.resolve(target) ? pendingAtRequest : [];
        const reconciled = await reconcileOwnedAssets(target, savedImageSources, { pendingNames });
        if (reconciled.errors.length > 0) {
          console.warn("[markdown] asset reconciliation incomplete:", reconciled.errors);
        }
        if (mode === "saveAs" && currentPath && node_path.resolve(currentPath) !== node_path.resolve(target)) {
          const sourceResolved = await resolveSourcePendingAfterSaveAs(
            currentPath,
            pendingAtRequest
          );
          if (sourceResolved.errors.length > 0) {
            console.warn(
              "[markdown] source asset reconciliation incomplete:",
              sourceResolved.errors
            );
          }
        }
        if (isNewPath) fileSavedHook?.(e.sender, target);
        return done({
          ok: true,
          path: target,
          ...prepared?.rewrites.length ? { imageRewrites: prepared.rewrites } : {}
        });
      } catch (err) {
        return done({ ok: false, error: err instanceof Error ? err.message : String(err) });
      }
    }
  );
  electron.ipcMain.handle(MARKDOWN_CHANNELS.pickImage, async (e) => {
    const docPath = savePathByWc.get(e.sender.id);
    if (!docPath) return null;
    const win = electron.BrowserWindow.fromWebContents(e.sender) ?? electron.BrowserWindow.getFocusedWindow() ?? void 0;
    const picked = await showOpenDialogWithMemory(electron.dialog, win, {
      title: tm("dlgPickImage"),
      // only formats readImage/DOCX export can round-trip (docx-engine NewImage mimes)
      filters: [{ name: tm("filterImages"), extensions: ["png", "jpg", "jpeg", "gif"] }],
      properties: ["openFile"]
    });
    const source = picked.filePaths[0];
    if (picked.canceled || !source) return null;
    return copyImageIntoOwnedAssets(docPath, source);
  });
  electron.ipcMain.handle(
    MARKDOWN_CHANNELS.saveImage,
    async (e, data) => {
      const docPath = savePathByWc.get(e.sender.id);
      const ext = String(data?.ext ?? "").toLowerCase();
      if (!docPath || typeof data?.base64 !== "string" || !data.base64) return null;
      if (!["png", "jpg", "jpeg", "gif"].includes(ext)) return null;
      return writeImageIntoOwnedAssets(docPath, `image.${ext}`, Buffer.from(data.base64, "base64"));
    }
  );
  registerImageGenerationIpc({
    ipc: electron.ipcMain,
    channel: MARKDOWN_CHANNELS.aiGenerateImage,
    getClient: () => runtime.getBatiAiClient?.() ?? null
  });
  const MIME_BY_EXT = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif"
  };
  electron.ipcMain.handle(
    MARKDOWN_CHANNELS.readImage,
    async (e, src) => {
      const docPath = savePathByWc.get(e.sender.id);
      if (!docPath || typeof src !== "string" || /^[a-z][a-z0-9+.-]*:/i.test(src)) return null;
      const target = await resolveSafeRelativeImagePath(docPath, src);
      if (!target) return null;
      const mime = MIME_BY_EXT[node_path.extname(target).toLowerCase()];
      if (!mime || !node_fs.existsSync(target)) return null;
      try {
        return { base64: (await promises.readFile(target)).toString("base64"), mime };
      } catch {
        return null;
      }
    }
  );
  electron.ipcMain.handle(
    MARKDOWN_CHANNELS.exportDocx,
    async (e, request) => {
      if (typeof request?.base64 !== "string" || !request.base64) {
        return { ok: false, error: "markdown: bad export request" };
      }
      const safeName = String(request.suggestedName || tm("untitledFile")).replace(/[/\\:*?"<>|]/g, "_").slice(0, 80).trim() || tm("untitledFile");
      try {
        const bytes = Buffer.from(request.base64, "base64");
        if (request.mode === "openInDocs") {
          const target = await writeMarkdownConversion(
            await markdownConversionSession(),
            safeName,
            bytes
          );
          docxExportedHook?.(target);
          return { ok: true, path: target };
        }
        const win = electron.BrowserWindow.fromWebContents(e.sender) ?? electron.BrowserWindow.getFocusedWindow() ?? void 0;
        const picked = await showSaveDialogWithMemory(
          electron.dialog,
          win,
          {
            defaultPath: `${safeName}.docx`,
            filters: [{ name: "Word", extensions: ["docx"] }]
          },
          configuredDefaultSaveDir(electron.app)
        );
        if (picked.canceled || !picked.filePath) return { ok: true, canceled: true };
        await promises.writeFile(picked.filePath, bytes);
        return { ok: true, path: picked.filePath };
      } catch (err) {
        return { ok: false, error: err instanceof Error ? err.message : String(err) };
      }
    }
  );
  electron.ipcMain.handle(
    MARKDOWN_CHANNELS.exportPdf,
    async (e, request) => {
      if (typeof request?.html !== "string" || !request.html) {
        return { ok: false, error: "markdown: bad export request" };
      }
      const safeName = String(request.suggestedName || tm("untitledFile")).replace(/[/\\:*?"<>|]/g, "_").slice(0, 80).trim() || tm("untitledFile");
      const win = electron.BrowserWindow.fromWebContents(e.sender) ?? electron.BrowserWindow.getFocusedWindow() ?? void 0;
      const picked = await showSaveDialogWithMemory(
        electron.dialog,
        win,
        {
          defaultPath: `${safeName}.pdf`,
          filters: [{ name: "PDF", extensions: ["pdf"] }]
        },
        configuredDefaultSaveDir(electron.app)
      );
      if (picked.canceled || !picked.filePath) return { ok: true, canceled: true };
      const workDir = await promises.mkdtemp(node_path.join(node_os.tmpdir(), "genoffice-md-pdf-"));
      const printWin = new electron.BrowserWindow({
        show: false,
        webPreferences: { sandbox: true, javascript: false }
      });
      try {
        const htmlPath = node_path.join(workDir, "print.html");
        await promises.writeFile(htmlPath, request.html, "utf8");
        await printWin.loadFile(htmlPath);
        const pdf = await printWin.webContents.printToPDF({
          pageSize: "A4",
          printBackground: true,
          margins: { top: 0.6, bottom: 0.6, left: 0.6, right: 0.6 }
        });
        await promises.writeFile(picked.filePath, pdf);
        openExportedPdf(picked.filePath);
        return { ok: true, path: picked.filePath };
      } catch (err) {
        return { ok: false, error: err instanceof Error ? err.message : String(err) };
      } finally {
        printWin.destroy();
        await promises.rm(workDir, { recursive: true, force: true });
      }
    }
  );
  electron.ipcMain.on(MARKDOWN_CHANNELS.dirtyChanged, (e, dirty) => {
    if (dirty === true) dirtyByWc.add(e.sender.id);
    else dirtyByWc.delete(e.sender.id);
  });
  electron.ipcMain.on(MARKDOWN_CHANNELS.closeSaveResult, (e, ok) => {
    const waiter = closeSaveWaiters.get(e.sender.id);
    closeSaveWaiters.delete(e.sender.id);
    waiter?.(ok === true);
  });
  electron.ipcMain.on(MARKDOWN_CHANNELS.saveRequestAck, (e, ok) => {
    const waiter = saveWaiters.get(e.sender.id);
    saveWaiters.delete(e.sender.id);
    waiter?.(ok === true);
  });
  electron.ipcMain.removeHandler(MARKDOWN_CHANNELS.getLanguage);
  electron.ipcMain.handle(MARKDOWN_CHANNELS.getLanguage, () => getUiLang());
}
function grantAndTrack(wc, openPath) {
  const wcId = wc.id;
  if (openPath && node_fs.existsSync(openPath)) {
    openPathByWc.set(wcId, openPath);
    savePathByWc.set(wcId, openPath);
    allowedByWc.set(wcId, /* @__PURE__ */ new Set([openPath]));
  }
  wc.setWindowOpenHandler(({ url }) => {
    const target = safeExternalUrl(url, { allowedProtocols: ["http:", "https:", "mailto:"] });
    if (target) void electron.shell.openExternal(target);
    return { action: "deny" };
  });
  wc.once("destroyed", () => {
    openPathByWc.delete(wcId);
    allowedByWc.delete(wcId);
    savePathByWc.delete(wcId);
    dirtyByWc.delete(wcId);
    closeSaveWaiters.get(wcId)?.(false);
    closeSaveWaiters.delete(wcId);
    saveWaiters.get(wcId)?.(false);
    saveWaiters.delete(wcId);
  });
}
function startMarkdownStandalone() {
  installNavigationGuard(electron.app);
  installContextMenu(electron.app, () => contextMenuLabels(getUiLang()));
  configureMarkdownRuntime({
    preloadPath: node_path.join(__dirname, "../preload/index.js"),
    rendererUrl: process.env.ELECTRON_RENDERER_URL,
    rendererFile: node_path.join(__dirname, "../renderer/index.html")
  });
  void electron.app.whenReady().then(() => {
    registerMarkdownIpc();
    const win = new electron.BrowserWindow({
      width: 1200,
      height: 850,
      webPreferences: {
        preload: runtime.preloadPath,
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: true
      }
    });
    const argPath = process.argv.slice(1).find((a) => /\.(md|markdown)$/i.test(a) && node_fs.existsSync(a));
    grantAndTrack(win.webContents, argPath);
    if (runtime.rendererUrl) void win.loadURL(runtime.rendererUrl);
    else if (runtime.rendererFile) void win.loadFile(runtime.rendererFile);
  });
  electron.app.on("window-all-closed", () => electron.app.quit());
}
startMarkdownStandalone();
