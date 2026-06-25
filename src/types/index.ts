export interface ThreatEvent {
  id: string;
  sourceCountry: string;
  sourceCountryCode: string;
  targetCountry: string;
  targetCountryCode: string;
  sourceLat: number;
  sourceLng: number;
  targetLat: number;
  targetLng: number;
  attackType: AttackType;
  severity: Severity;
  timestamp: Date;
  sourceIp: string;
  port: number;
}

export type AttackType =
  | "DDoS"
  | "Malware"
  | "Phishing"
  | "Ransomware"
  | "SQL Injection"
  | "Brute Force"
  | "XSS"
  | "Zero-Day";

export type Severity = "low" | "medium" | "high" | "critical";

export interface ThreatStats {
  total: number;
  byType: Record<AttackType, number>;
  bySeverity: Record<Severity, number>;
  topSources: { country: string; count: number }[];
  topTargets: { country: string; count: number }[];
}