const api = window.batiChangelog;
function el(id) {
  return document.getElementById(id);
}
void api.get().then(({ currentVersion, releases, strings }) => {
  document.title = strings.title;
  const list = el("list");
  if (releases.length === 0) {
    el("empty").textContent = strings.empty;
    el("empty").style.display = "block";
    list.style.display = "none";
    return;
  }
  for (const release of releases) {
    const section = document.createElement("section");
    section.className = "release";
    const head = document.createElement("div");
    head.className = "release-head";
    const version = document.createElement("span");
    version.className = "release-version";
    version.textContent = `v${release.version}`;
    head.appendChild(version);
    if (release.date) {
      const date = document.createElement("span");
      date.className = "release-date";
      date.textContent = release.date;
      head.appendChild(date);
    }
    if (release.version === currentVersion) {
      const badge = document.createElement("span");
      badge.className = "badge";
      badge.textContent = strings.installed;
      head.appendChild(badge);
    }
    section.appendChild(head);
    for (const entry of release.entries) {
      const item = document.createElement("div");
      item.className = "entry";
      const title = document.createElement("div");
      title.className = "entry-title";
      title.textContent = entry.title;
      item.appendChild(title);
      if (entry.body) {
        const body = document.createElement("div");
        body.className = "entry-body";
        body.textContent = entry.body;
        item.appendChild(body);
      }
      section.appendChild(item);
    }
    list.appendChild(section);
  }
});
