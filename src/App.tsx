import { useState, useEffect, useCallback } from "react";
import { Wifi, WifiOff } from "lucide-react";
import ThreatMapView from "./components/ThreatMap";
import StatsPanel from "./components/StatsPanel";
import ThreatFeed from "./components/ThreatFeed";
import type { ThreatEvent } from "./types/index";
import { generateThreatEvent, generateInitialThreats, computeStats } from "./lib/threatGenerator";

const MAX_EVENTS = 200;

export default function App() {
  const [events, setEvents] = useState<ThreatEvent[]>(() => generateInitialThreats(30));
  const [selected, setSelected] = useState<ThreatEvent | null>(null);
  const [filter, setFilter] = useState("all");
  const [paused, setPaused] = useState(false);
  const [showFeed, setShowFeed] = useState(false);

  const addEvent = useCallback(() => {
    const event = generateThreatEvent();
    setEvents((prev) => [event, ...prev].slice(0, MAX_EVENTS));
  }, []);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(addEvent, 2000);
    return () => clearInterval(interval);
  }, [paused, addEvent]);

  const filtered = filter === "all"
    ? events
    : events.filter((e) => e.severity === filter || e.attackType === filter);

  const stats = computeStats(filtered);

  return (
    <div style={s.root}>
      {/* Top bar */}
      <div style={s.topbar}>
        <div style={s.topLeft}>
          <span className="display" style={s.brand}>ThreatMap</span>
          <span style={s.brandSub}>by CodeWithSamzy</span>
        </div>
        <div style={s.topRight}>
          {filter !== "all" && (
            <span style={s.filterChip}>
              Filtering: {filter}
              <button onClick={() => setFilter("all")} style={s.chipX}>×</button>
            </span>
          )}
          <div style={s.liveIndicator}>
            {paused
              ? <WifiOff size={13} color="#888" />
              : <Wifi size={13} color="#44FF88" />}
            <span style={{ color: paused ? "#888" : "#44FF88", fontSize: "0.72rem", fontWeight: 600 }}>
              {paused ? "PAUSED" : "LIVE"}
            </span>
          </div>
          <button onClick={() => setShowFeed(!showFeed)} style={s.feedToggle}>
            {showFeed ? "Hide Feed" : "Live Feed"}
          </button>
        </div>
      </div>

      {/* Main layout */}
     <div style={s.body} className="tm-body">
        {/* Stats sidebar */}
       <div style={s.sidebar} className="tm-sidebar">
          <StatsPanel
            events={filtered}
            stats={stats}
            filter={filter}
            setFilter={setFilter}
            paused={paused}
            setPaused={setPaused}
          />
        </div>

        {/* Map */}
        <div style={s.mapWrap}>
          <ThreatMapView events={filtered} selected={selected} />

          {/* Selected event overlay */}
          {selected && (
            <div style={s.selectedCard}>
              <div style={s.selectedHeader}>
                <span className="display" style={s.selectedType}>{selected.attackType}</span>
                <button onClick={() => setSelected(null)} style={s.closeBtn}>×</button>
              </div>
              <div style={s.selectedBody}>
                <div style={s.selectedRow}><span style={s.selectedLabel}>Source</span><span>{selected.sourceCountry}</span></div>
                <div style={s.selectedRow}><span style={s.selectedLabel}>Target</span><span>{selected.targetCountry}</span></div>
                <div style={s.selectedRow}><span style={s.selectedLabel}>IP</span><span className="mono" style={{ fontSize: "0.78rem" }}>{selected.sourceIp}</span></div>
                <div style={s.selectedRow}><span style={s.selectedLabel}>Port</span><span className="mono" style={{ fontSize: "0.78rem" }}>{selected.port}</span></div>
                <div style={s.selectedRow}><span style={s.selectedLabel}>Severity</span><span style={{ color: selected.severity === "critical" ? "#FF2222" : selected.severity === "high" ? "#FF6622" : selected.severity === "medium" ? "#FFAA22" : "#44AAFF", fontWeight: 700, textTransform: "uppercase", fontSize: "0.78rem" }}>{selected.severity}</span></div>
              </div>
            </div>
          )}
        </div>

        {/* Live feed */}
        {showFeed && (
         <div style={s.feedPanel} className="tm-feed">
            <ThreatFeed events={filtered} onSelect={setSelected} selected={selected} />
          </div>
        )}
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  root: { display: "flex", flexDirection: "column", height: "100vh", background: "#0A0A0A", overflow: "hidden" },
  topbar: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.65rem 1rem", background: "#0D0D0D", borderBottom: "1px solid #1A1A1A", zIndex: 100, flexShrink: 0 },
  topLeft: { display: "flex", alignItems: "center", gap: "0.5rem" },
  brand: { fontSize: "0.95rem", fontWeight: 700, color: "#F5F500" },
  brandSub: { fontSize: "0.65rem", color: "#444", display: "none" },
  topRight: { display: "flex", alignItems: "center", gap: "0.5rem" },
  filterChip: { display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.68rem", padding: "0.2rem 0.5rem", background: "rgba(245,245,0,0.1)", border: "1px solid rgba(245,245,0,0.3)", borderRadius: "20px", color: "#F5F500", fontFamily: "Space Grotesk, sans-serif" },
  chipX: { background: "transparent", border: "none", color: "#F5F500", cursor: "pointer", fontSize: "1rem", lineHeight: 1, padding: 0 },
  liveIndicator: { display: "flex", alignItems: "center", gap: "0.35rem" },
  feedToggle: { fontSize: "0.68rem", padding: "0.28rem 0.6rem", background: "#111", border: "1px solid #1A1A1A", borderRadius: "4px", color: "#888", cursor: "pointer", fontFamily: "Space Grotesk, sans-serif", whiteSpace: "nowrap" as const },
  body: { display: "flex", flex: 1, overflow: "hidden", flexDirection: "column" as const },
  sidebar: { width: "100%", flexShrink: 0, overflowX: "auto" as const, overflowY: "hidden" as const },
  mapWrap: { flex: 1, position: "relative" as const, minHeight: "300px" },
  feedPanel: { width: "100%", maxHeight: "220px", borderTop: "1px solid #1A1A1A" },
  selectedCard: { position: "absolute" as const, bottom: "1rem", right: "1rem", left: "1rem", background: "#0D0D0D", border: "1px solid #2A2A2A", borderRadius: "8px", padding: "0.85rem", zIndex: 1000 },
  selectedHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.65rem" },
  selectedType: { fontSize: "0.9rem", fontWeight: 700, color: "#F5F500" },
  closeBtn: { background: "transparent", border: "none", color: "#888", cursor: "pointer", fontSize: "1.25rem", lineHeight: 1 },
  selectedBody: { display: "flex", flexDirection: "column" as const, gap: "0.35rem" },
  selectedRow: { display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "#FFF" },
  selectedLabel: { color: "#555", fontSize: "0.72rem" },
};