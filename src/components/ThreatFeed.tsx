import type { ThreatEvent } from "../types/index";
import SeverityBadge from "./SeverityBadge";

interface Props {
  events: ThreatEvent[];
  onSelect: (e: ThreatEvent) => void;
  selected: ThreatEvent | null;
}

export default function ThreatFeed({ events, onSelect, selected }: Props) {
  const formatTime = (d: Date) =>
    new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  return (
    <div style={s.feed}>
      <div style={s.feedHeader}>
        <span style={s.feedTitle}>LIVE FEED</span>
        <span style={s.feedCount}>{events.length} events</span>
      </div>
      <div style={s.feedList}>
        {events.slice(0, 50).map((event) => (
          <div
            key={event.id}
            onClick={() => onSelect(event)}
            style={{
              ...s.feedItem,
              borderLeftColor: selected?.id === event.id ? "#F5F500" : "#1A1A1A",
              background: selected?.id === event.id ? "#161616" : "transparent",
              animation: "fadeInUp 0.3s ease",
            }}
          >
            <div style={s.feedTop}>
              <SeverityBadge severity={event.severity} />
              <span className="mono" style={s.feedTime}>{formatTime(event.timestamp)}</span>
            </div>
            <div style={s.feedType}>{event.attackType}</div>
            <div style={s.feedRoute}>
              <span style={s.feedCountry}>{event.sourceCountryCode}</span>
              <span style={s.feedArrow}>→</span>
              <span style={s.feedCountry}>{event.targetCountryCode}</span>
            </div>
            <div className="mono" style={s.feedIp}>{event.sourceIp}:{event.port}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  feed: { width: "100%", background: "#0D0D0D", borderLeft: "1px solid #1A1A1A", display: "flex", flexDirection: "column", maxHeight: "100vh" },
  feedHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 1.25rem", borderBottom: "1px solid #1A1A1A" },
  feedTitle: { fontSize: "0.65rem", fontWeight: 600, color: "#444", letterSpacing: "0.12em", fontFamily: "Space Grotesk, sans-serif" },
  feedCount: { fontSize: "0.68rem", color: "#555", fontFamily: "Space Grotesk, sans-serif" },
  feedList: { overflowY: "auto" as const, flex: 1 },
  feedItem: { padding: "0.85rem 1.25rem", borderLeft: "2px solid", cursor: "pointer", transition: "all 0.15s", display: "flex", flexDirection: "column" as const, gap: "0.3rem" },
  feedTop: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  feedTime: { fontSize: "0.65rem", color: "#444" },
  feedType: { fontSize: "0.82rem", fontWeight: 600, color: "#FFFFFF", fontFamily: "Space Grotesk, sans-serif" },
  feedRoute: { display: "flex", alignItems: "center", gap: "0.4rem" },
  feedCountry: { fontSize: "0.72rem", color: "#888", fontFamily: "Space Grotesk, sans-serif", fontWeight: 600 },
  feedArrow: { fontSize: "0.65rem", color: "#444" },
  feedIp: { fontSize: "0.65rem", color: "#444" },
};