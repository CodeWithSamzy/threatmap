import type { ThreatEvent, AttackType, Severity } from "../types/index";
import SeverityBadge from "./SeverityBadge";

const ATTACK_COLORS: Record<AttackType, string> = {
  "DDoS": "#FF4444",
  "Malware": "#FF8844",
  "Phishing": "#FFAA22",
  "Ransomware": "#FF2222",
  "SQL Injection": "#AA44FF",
  "Brute Force": "#4488FF",
  "XSS": "#44AAFF",
  "Zero-Day": "#FF44AA",
};

const SEV_ORDER: Severity[] = ["critical", "high", "medium", "low"];

interface Props {
  events: ThreatEvent[];
  stats: {
    total: number;
    byType: Record<AttackType, number>;
    bySeverity: Record<Severity, number>;
    topSources: { country: string; count: number }[];
    topTargets: { country: string; count: number }[];
  };
  filter: string;
  setFilter: (f: string) => void;
  paused: boolean;
  setPaused: (p: boolean) => void;
}

export default function StatsPanel({ events, stats, filter, setFilter, paused, setPaused }: Props) {
  const maxType = Math.max(...Object.values(stats.byType || {}), 1);

  return (
   <div style={s.panel} className="sv-stats-panel">
      {/* Header */}
      <div style={s.header}>
        <div>
          <div className="display" style={s.title}>ThreatMap</div>
          <div style={s.subtitle}>Live Cyber Threat Intelligence</div>
        </div>
        <div style={s.liveDot}>
          <span style={{ ...s.dot, animationPlayState: paused ? "paused" : "running" }} />
          {paused ? "PAUSED" : "LIVE"}
        </div>
      </div>

      {/* Total counter */}
      <div style={s.totalCard}>
        <div className="display" style={s.totalNum}>{stats.total.toLocaleString()}</div>
        <div style={s.totalLabel}>Total Threats Detected</div>
        <div style={s.totalSub}>Last 60 minutes</div>
      </div>

      {/* Severity breakdown */}
      <div style={s.section}>
        <div style={s.sectionTitle}>BY SEVERITY</div>
        <div style={s.sevGrid}>
          {SEV_ORDER.map((sev) => (
            <div
              key={sev}
              onClick={() => setFilter(filter === sev ? "all" : sev)}
              style={{
                ...s.sevCard,
                opacity: filter !== "all" && filter !== sev ? 0.4 : 1,
                cursor: "pointer",
              }}
            >
              <SeverityBadge severity={sev} />
              <div className="display" style={s.sevNum}>
                {stats.bySeverity?.[sev] || 0}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Attack types */}
      <div style={s.section}>
        <div style={s.sectionTitle}>ATTACK TYPES</div>
        <div style={s.typeList}>
          {Object.entries(stats.byType || {})
            .sort((a, b) => b[1] - a[1])
            .map(([type, count]) => (
              <div
                key={type}
                onClick={() => setFilter(filter === type ? "all" : type)}
                style={{
                  ...s.typeRow,
                  opacity: filter !== "all" && filter !== type ? 0.4 : 1,
                  cursor: "pointer",
                }}
              >
                <div style={s.typeLeft}>
                  <span style={{
                    width: "8px", height: "8px", borderRadius: "50%",
                    background: ATTACK_COLORS[type as AttackType],
                    display: "inline-block", flexShrink: 0,
                  }} />
                  <span style={s.typeName}>{type}</span>
                </div>
                <div style={s.typeRight}>
                  <div style={s.typeBarWrap}>
                    <div style={{
                      ...s.typeBar,
                      width: `${(count / maxType) * 100}%`,
                      background: ATTACK_COLORS[type as AttackType],
                    }} />
                  </div>
                  <span style={s.typeCount}>{count}</span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Top sources */}
      <div style={s.section}>
        <div style={s.sectionTitle}>TOP SOURCES</div>
        {stats.topSources?.map((s2, i) => (
          <div key={s2.country} style={s.rankRow}>
            <span style={s.rankNum}>#{i + 1}</span>
            <span style={s.rankCountry}>{s2.country}</span>
            <span style={s.rankCount}>{s2.count}</span>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={s.controls}>
        <button onClick={() => setPaused(!paused)} style={s.ctrlBtn}>
          {paused ? "▶ Resume" : "⏸ Pause"}
        </button>
        <button onClick={() => setFilter("all")} style={{
          ...s.ctrlBtn,
          opacity: filter === "all" ? 0.4 : 1,
        }}>
          Clear Filter
        </button>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
 panel: { width: "100%", background: "#0D0D0D", borderRight: "1px solid #1A1A1A", display: "flex", flexDirection: "row" as const, gap: "1rem", padding: "0.75rem 1rem", overflowX: "auto" as const, overflowY: "hidden" as const, flexShrink: 0, alignItems: "flex-start" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  title: { fontSize: "1.1rem", fontWeight: 700, color: "#F5F500", letterSpacing: "-0.01em" },
  subtitle: { fontSize: "0.72rem", color: "#555", marginTop: "0.15rem" },
  liveDot: { display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.65rem", fontWeight: 700, color: "#44FF88", fontFamily: "Space Grotesk, sans-serif", letterSpacing: "0.1em" },
  dot: { width: "7px", height: "7px", borderRadius: "50%", background: "#44FF88", display: "inline-block", animation: "blink 1s step-end infinite" },
  totalCard: { background: "#111", border: "1px solid #1A1A1A", borderRadius: "6px", padding: "1rem", textAlign: "center" as const },
  totalNum: { fontSize: "2rem", fontWeight: 700, color: "#F5F500" },
  totalLabel: { fontSize: "0.78rem", color: "#888", marginTop: "0.2rem" },
  totalSub: { fontSize: "0.68rem", color: "#444", marginTop: "0.15rem" },
  section: { display: "flex", flexDirection: "column" as const, gap: "0.6rem" },
  sectionTitle: { fontSize: "0.62rem", fontWeight: 600, color: "#444", letterSpacing: "0.12em", fontFamily: "Space Grotesk, sans-serif" },
  sevGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" },
  sevCard: { background: "#111", border: "1px solid #1A1A1A", borderRadius: "6px", padding: "0.65rem 0.75rem", display: "flex", flexDirection: "column" as const, gap: "0.3rem", transition: "opacity 0.2s" },
  sevNum: { fontSize: "1.25rem", fontWeight: 700, color: "#FFF" },
  typeList: { display: "flex", flexDirection: "column" as const, gap: "0.5rem" },
  typeRow: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem", transition: "opacity 0.2s" },
  typeLeft: { display: "flex", alignItems: "center", gap: "0.5rem", minWidth: "100px" },
  typeName: { fontSize: "0.78rem", color: "#AAA" },
  typeRight: { display: "flex", alignItems: "center", gap: "0.5rem", flex: 1 },
  typeBarWrap: { flex: 1, height: "4px", background: "#1A1A1A", borderRadius: "2px", overflow: "hidden" },
  typeBar: { height: "100%", borderRadius: "2px", transition: "width 0.5s ease" },
  typeCount: { fontSize: "0.72rem", color: "#555", minWidth: "24px", textAlign: "right" as const, fontFamily: "Space Grotesk, sans-serif" },
  rankRow: { display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.35rem 0" },
  rankNum: { fontSize: "0.68rem", color: "#444", fontFamily: "Space Grotesk, sans-serif", minWidth: "20px" },
  rankCountry: { fontSize: "0.8rem", color: "#AAA", flex: 1 },
  rankCount: { fontSize: "0.72rem", color: "#F5F500", fontFamily: "Space Grotesk, sans-serif", fontWeight: 600 },
  controls: { display: "flex", gap: "0.5rem", marginTop: "auto", paddingTop: "0.5rem" },
  ctrlBtn: { flex: 1, padding: "0.6rem", background: "#111", border: "1px solid #1A1A1A", borderRadius: "4px", color: "#888", fontSize: "0.78rem", cursor: "pointer", fontFamily: "Space Grotesk, sans-serif", transition: "opacity 0.2s" },
};