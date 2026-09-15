import { useEffect, useMemo, useState } from "react";
import { ProjectInfo, projectCreate } from "../lib/tauri";
import { TimelineEntry } from "../lib/tauri";

interface Props {
  openPath: (path: string, name: string) => void;
  projectList: () => Promise<ProjectInfo[]>;
  projectRename: (id: number, name: string) => Promise<boolean>;
  projectDelete: (id: number) => Promise<boolean>;
  projectFiles: (projectId: number) => Promise<string[]>;
  projectTimeline: (projectId: number) => Promise<TimelineEntry[]>;
}

function fmtTs(ts: number): string {
  return new Date(ts * 1000).toLocaleString();
}

export default function ProjectsView({
  openPath,
  projectList,
  projectRename,
  projectDelete,
  projectFiles,
  projectTimeline,
}: Props) {
  const [projects, setProjects] = useState<ProjectInfo[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [files, setFiles] = useState<string[]>([]);
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(true);

  const refresh = () => {
    setLoading(true);
    projectList().then((list) => {
      setProjects(list);
      if (list.length && !selected) {
        setSelected(list[0].id);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    refresh();
  }, []);

  const selectedProject = useMemo(
    () => projects.find((p) => p.id === selected),
    [projects, selected],
  );

  useEffect(() => {
    if (selected) {
      Promise.all([projectFiles(selected), projectTimeline(selected)]).then(
        ([fl, tl]) => {
          setFiles(fl);
          setTimeline(tl);
        },
      );
    }
  }, [selected]);

  const handleCreate = () => {
    const name = newName.trim() || "New project";
    // Creates an empty project folder under Documents/bunch for demonstration.
    projectCreate(name, `${name}`).then(() => {
      setNewName("");
      refresh();
    });
  };

  const handleRename = (id: number) =>
    projectRename(id, id.toString()).then((ok) => {
      if (ok) refresh();
    });

  const handleDelete = (id: number) =>
    projectDelete(id).then((ok) => {
      if (ok) refresh();
    });

  return (
    <div className="projects">
      <div className="projects-side">
        <div className="create-box">
          <input
            value={newName}
            placeholder="Project name"
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          />
          <button onClick={handleCreate}>+ {projects.length === 0 ? "Create" : "Add"}</button>
        </div>
        {loading ? (
          <div className="empty">Loading…</div>
        ) : (
          <ul className="project-list">
            {projects.map((p) => (
              <li key={p.id}>
                <button
                  className={`project-item ${selected === p.id ? "active" : ""}`}
                  onClick={() => setSelected(p.id)}
                >
                  <span className="project-name">{p.name}</span>
                  <span className="project-acts">
                    <button onClick={() => handleRename(p.id)}>✎</button>
                    <button onClick={() => handleDelete(p.id)}>🗑</button>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="projects-main">
        {selectedProject ? (
          <>
            <h1>{selectedProject.name}</h1>
            <div className="files">
              <h2>Files ({files.length})</h2>
              {files.length === 0 ? (
                <div className="empty">No files yet.</div>
              ) : (
                <ul className="file-list">
                  {files.map((f) => (
                    <li key={f}>
                      <button className="file-open" onClick={() => openPath(f, f)}>
                        <span className="file-name">{f}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="timeline">
              <h2>Timeline</h2>
              {timeline.length === 0 ? (
                <div className="empty">No activity.</div>
              ) : (
                <ul>
                  {timeline.map((t) => (
                    <li key={t.id}>
                      <span className="t-act">{t.action}</span>
                      <span className="t-file">{t.fileName}</span>
                      <span className="t-time">{fmtTs(t.timestamp)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        ) : (
          <div className="empty">Select or create a project.</div>
        )}
      </div>
    </div>
  );
}
