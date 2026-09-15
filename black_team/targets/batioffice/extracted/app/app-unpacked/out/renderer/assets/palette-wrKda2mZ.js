const input = document.getElementById("pal-input");
const list = document.getElementById("pal-list");
let rows = [];
let visible = [];
let selected = 0;
let state = null;
function buildRows(current) {
  const out = [];
  for (const tab of current.tabs) {
    if (tab.active) continue;
    out.push({ section: "tabs", label: tab.title, detail: tab.kind, command: { kind: "tab", id: tab.id } });
  }
  for (const recent of current.recents) {
    out.push({
      section: "recents",
      label: recent.name,
      detail: recent.ext,
      command: { kind: "recent", token: recent.token }
    });
  }
  for (const action of current.actions) {
    out.push({ section: "actions", label: action.label, command: { kind: "action", id: action.id } });
  }
  return out;
}
function matches(query, label) {
  const q = query.toLowerCase();
  const l = label.toLowerCase();
  if (l.includes(q)) return true;
  let i = 0;
  for (const ch of l) {
    if (ch === q[i]) i += 1;
    if (i === q.length) return true;
  }
  return false;
}
function highlightLabel(label, query) {
  const span = document.createElement("span");
  const q = query.toLowerCase();
  if (!q) {
    span.textContent = label;
    return span;
  }
  const l = label.toLowerCase();
  const hitSet = /* @__PURE__ */ new Set();
  const start = l.indexOf(q);
  if (start >= 0) {
    for (let k = start; k < start + q.length; k += 1) hitSet.add(k);
  } else {
    let i = 0;
    for (let k = 0; k < l.length && i < q.length; k += 1) {
      if (l[k] === q[i]) {
        hitSet.add(k);
        i += 1;
      }
    }
    if (i < q.length) {
      span.textContent = label;
      return span;
    }
  }
  let pos = 0;
  while (pos < label.length) {
    const isHit = hitSet.has(pos);
    let end = pos;
    while (end < label.length && hitSet.has(end) === isHit) end += 1;
    const text = label.slice(pos, end);
    if (isHit) {
      const hit = document.createElement("b");
      hit.className = "pal-hit";
      hit.textContent = text;
      span.append(hit);
    } else {
      span.append(document.createTextNode(text));
    }
    pos = end;
  }
  return span;
}
function render() {
  if (!state) return;
  list.textContent = "";
  if (visible.length === 0) {
    const empty = document.createElement("div");
    empty.className = "pal-empty";
    empty.textContent = state.strings.empty;
    list.append(empty);
    return;
  }
  const sectionTitles = {
    tabs: state.strings.tabs,
    recents: state.strings.recents,
    actions: state.strings.actions,
    ai: "AI"
  };
  let lastSection = null;
  visible.forEach((row, index) => {
    if (row.section !== lastSection) {
      lastSection = row.section;
      const header = document.createElement("div");
      header.className = "pal-section";
      header.textContent = sectionTitles[row.section];
      list.append(header);
    }
    const item = document.createElement("button");
    item.className = `pal-item${index === selected ? " selected" : ""}`;
    item.setAttribute("role", "option");
    item.setAttribute("aria-selected", index === selected ? "true" : "false");
    const label = row.section === "ai" ? (() => {
      const plain = document.createElement("span");
      plain.textContent = row.label;
      return plain;
    })() : highlightLabel(row.label, input.value.trim());
    item.append(label);
    if (row.detail) {
      const kind = document.createElement("span");
      kind.className = "pal-kind";
      kind.textContent = row.detail;
      item.append(kind);
    }
    item.addEventListener("click", () => window.aiOfficePalette.execute(row.command));
    item.addEventListener("mousemove", () => {
      if (selected !== index) {
        selected = index;
        render();
      }
    });
    list.append(item);
  });
  list.querySelector(".pal-item.selected")?.scrollIntoView({ block: "nearest" });
}
function aiCreateOrder(query) {
  const q = query.toLowerCase();
  const scores = [
    [/시트|표\b|엑셀|정산|가계부|데이터|계산|spread|sheet|xlsx|excel|table/.test(q) ? 2 : 0, "xlsx"],
    [/슬라이드|발표|피피티|프레젠|덱|제안서|ppt|slide|deck|presentation|pitch/.test(q) ? 2 : 0, "pptx"],
    [/문서|보고서|공문|계약|편지|이력서|회의록|초안|doc|report|letter|memo/.test(q) ? 2 : 1, "docx"]
  ];
  return scores.sort((a, b) => b[0] - a[0]).map((entry) => entry[1]);
}
function refilter() {
  const query = input.value.trim();
  visible = query ? rows.filter((row) => matches(query, row.label)) : rows;
  if (state && query && (query.length >= 6 || query.includes(" "))) {
    const byIntent = aiCreateOrder(query);
    const labels = new Map(state.aiCreate.map((entry) => [entry.format, entry.label]));
    for (const format of byIntent) {
      const label = labels.get(format);
      if (!label) continue;
      visible = [
        ...visible,
        {
          section: "ai",
          label: `${label} — “${query}”`,
          command: { kind: "ai-create", format, prompt: query }
        }
      ];
    }
  }
  selected = 0;
  render();
}
document.body.addEventListener("mousedown", (event) => {
  if (event.target === document.body) window.aiOfficePalette.close();
});
input.addEventListener("input", refilter);
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    window.aiOfficePalette.close();
  } else if (event.key === "ArrowDown") {
    event.preventDefault();
    if (visible.length) selected = (selected + 1) % visible.length;
    render();
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    if (visible.length) selected = (selected - 1 + visible.length) % visible.length;
    render();
  } else if (event.key === "Enter") {
    const row = visible[selected];
    if (row) window.aiOfficePalette.execute(row.command);
  }
});
function loadState() {
  void window.aiOfficePalette.getState().then((next) => {
    if (!next) return;
    state = next;
    document.documentElement.lang = next.lang;
    document.documentElement.dir = next.lang === "ar" || next.lang === "he" ? "rtl" : "ltr";
    if (next.theme === "light" || next.theme === "dark") {
      document.documentElement.dataset.theme = next.theme;
    } else {
      delete document.documentElement.dataset.theme;
    }
    input.placeholder = next.strings.placeholder;
    rows = buildRows(next);
    refilter();
    input.focus();
  });
}
loadState();
window.aiOfficePalette.onRefresh?.(() => {
  input.value = "";
  loadState();
  const panel = document.querySelector(".pal");
  panel?.classList.remove("pal-replay");
  requestAnimationFrame(() => panel?.classList.add("pal-replay"));
});
