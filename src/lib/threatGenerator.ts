import type { ThreatEvent, AttackType, Severity } from "../types/index";

const COUNTRIES = [
  { name: "United States", code: "US", lat: 37.09, lng: -95.71 },
  { name: "China", code: "CN", lat: 35.86, lng: 104.19 },
  { name: "Russia", code: "RU", lat: 61.52, lng: 105.31 },
  { name: "Germany", code: "DE", lat: 51.16, lng: 10.45 },
  { name: "United Kingdom", code: "GB", lat: 55.37, lng: -3.43 },
  { name: "Brazil", code: "BR", lat: -14.23, lng: -51.92 },
  { name: "India", code: "IN", lat: 20.59, lng: 78.96 },
  { name: "Nigeria", code: "NG", lat: 9.08, lng: 8.67 },
  { name: "France", code: "FR", lat: 46.22, lng: 2.21 },
  { name: "Japan", code: "JP", lat: 36.20, lng: 138.25 },
  { name: "South Korea", code: "KR", lat: 35.90, lng: 127.76 },
  { name: "Canada", code: "CA", lat: 56.13, lng: -106.34 },
  { name: "Australia", code: "AU", lat: -25.27, lng: 133.77 },
  { name: "Netherlands", code: "NL", lat: 52.13, lng: 5.29 },
  { name: "Iran", code: "IR", lat: 32.42, lng: 53.68 },
  { name: "North Korea", code: "KP", lat: 40.33, lng: 127.51 },
  { name: "Ukraine", code: "UA", lat: 48.37, lng: 31.16 },
  { name: "South Africa", code: "ZA", lat: -30.55, lng: 22.93 },
  { name: "Singapore", code: "SG", lat: 1.35, lng: 103.81 },
  { name: "Israel", code: "IL", lat: 31.04, lng: 34.85 },
];

const ATTACK_TYPES: AttackType[] = [
  "DDoS", "Malware", "Phishing", "Ransomware",
  "SQL Injection", "Brute Force", "XSS", "Zero-Day",
];

const SEVERITIES: Severity[] = ["low", "medium", "high", "critical"];
const SEVERITY_WEIGHTS = [0.35, 0.35, 0.20, 0.10];

function weightedRandom<T>(items: T[], weights: number[]): T {
  const r = Math.random();
  let sum = 0;
  for (let i = 0; i < weights.length; i++) {
    sum += weights[i];
    if (r <= sum) return items[i];
  }
  return items[items.length - 1];
}

function randomIp(): string {
  return Array.from({ length: 4 }, () => Math.floor(Math.random() * 255)).join(".");
}

function randomPort(): number {
  const ports = [21, 22, 23, 25, 53, 80, 443, 3306, 3389, 5900, 8080, 8443];
  return ports[Math.floor(Math.random() * ports.length)];
}

export function generateThreatEvent(): ThreatEvent {
  const source = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
  let target = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
  while (target.code === source.code) {
    target = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
  }

  return {
    id: crypto.randomUUID(),
    sourceCountry: source.name,
    sourceCountryCode: source.code,
    targetCountry: target.name,
    targetCountryCode: target.code,
    sourceLat: source.lat + (Math.random() - 0.5) * 4,
    sourceLng: source.lng + (Math.random() - 0.5) * 4,
    targetLat: target.lat + (Math.random() - 0.5) * 4,
    targetLng: target.lng + (Math.random() - 0.5) * 4,
    attackType: ATTACK_TYPES[Math.floor(Math.random() * ATTACK_TYPES.length)],
    severity: weightedRandom(SEVERITIES, SEVERITY_WEIGHTS),
    timestamp: new Date(),
    sourceIp: randomIp(),
    port: randomPort(),
  };
}

export function generateInitialThreats(count = 30): ThreatEvent[] {
  return Array.from({ length: count }, () => {
    const event = generateThreatEvent();
    event.timestamp = new Date(Date.now() - Math.random() * 3600000);
    return event;
  });
}

export function computeStats(events: ThreatEvent[]) {
  const byType = {} as Record<AttackType, number>;
  const bySeverity = {} as Record<Severity, number>;
  const sourceCounts = {} as Record<string, number>;
  const targetCounts = {} as Record<string, number>;

  for (const e of events) {
    byType[e.attackType] = (byType[e.attackType] || 0) + 1;
    bySeverity[e.severity] = (bySeverity[e.severity] || 0) + 1;
    sourceCounts[e.sourceCountry] = (sourceCounts[e.sourceCountry] || 0) + 1;
    targetCounts[e.targetCountry] = (targetCounts[e.targetCountry] || 0) + 1;
  }

  return {
    total: events.length,
    byType,
    bySeverity,
    topSources: Object.entries(sourceCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([country, count]) => ({ country, count })),
    topTargets: Object.entries(targetCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([country, count]) => ({ country, count })),
  };
}