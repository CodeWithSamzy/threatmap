import type { Severity } from "../types/index";

const colors: Record<Severity, { bg: string; color: string; border: string }> = {
  critical: { bg: "rgba(255,34,34,0.12)", color: "#FF2222", border: "#FF2222" },
  high: { bg: "rgba(255,102,34,0.12)", color: "#FF6622", border: "#FF6622" },
  medium: { bg: "rgba(255,170,34,0.12)", color: "#FFAA22", border: "#FFAA22" },
  low: { bg: "rgba(68,170,255,0.12)", color: "#44AAFF", border: "#44AAFF" },
};

export default function SeverityBadge({ severity }: { severity: Severity }) {
  const c = colors[severity];
  return (
    <span style={{
      fontSize: "0.65rem",
      fontWeight: 700,
      padding: "0.2rem 0.5rem",
      borderRadius: "3px",
      border: `1px solid ${c.border}`,
      background: c.bg,
      color: c.color,
      fontFamily: "Space Grotesk, sans-serif",
      letterSpacing: "0.08em",
      textTransform: "uppercase" as const,
    }}>
      {severity}
    </span>
  );
}