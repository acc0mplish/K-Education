import { Tab } from "../App";

interface Props {
  tabs: Tab[];
  activeId: string | null;
  setActive: (id: string) => void;
  close: (id: string) => void;
  reorder: (from: number, to: number) => void;
}

export default function TabsBar({ tabs, activeId, setActive, close, reorder }: Props) {
  if (tabs.length === 0) return <div className="tabbar empty">{/* no tabs */}</div>;

  const handleDragStart = (i: number) => (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", String(i));
  };
  const handleDrop = (i: number) => (e: React.DragEvent) => {
    e.preventDefault();
    const from = Number(e.dataTransfer.getData("text/plain"));
    if (from !== i) reorder(from, i);
  };

  return (
    <div className="tabbar">
      {tabs.map((t, i) => (
        <div
          key={t.id}
          className={`tab ${t.id === activeId ? "active" : ""}`}
          onClick={() => setActive(t.id)}
          onDragStart={handleDragStart(i)}
          onDrop={handleDrop(i)}
          draggable
        >
          <span className="tab-name">{t.name}</span>
          <button className="tab-close" onClick={(e) => { e.stopPropagation(); close(t.id); }}>
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
