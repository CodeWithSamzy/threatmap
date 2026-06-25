import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import type { ThreatEvent } from "../types/index";

const SEV_COLORS: Record<string, string> = {
  critical: "#FF2222",
  high: "#FF6622",
  medium: "#FFAA22",
  low: "#44AAFF",
};

function createPulseIcon(severity: string) {
  return L.divIcon({
    className: "",
    html: `<div class="threat-pulse ${severity}"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
}

function AttackLines({ events, selected }: { events: ThreatEvent[]; selected: ThreatEvent | null }) {
  const map = useMap();
  const linesRef = useRef<L.Polyline[]>([]);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    linesRef.current.forEach((l) => l.remove());
    markersRef.current.forEach((m) => m.remove());
    linesRef.current = [];
    markersRef.current = [];

    const toRender = selected ? [selected] : events.slice(0, 40);

    toRender.forEach((event) => {
      const color = SEV_COLORS[event.severity];
      const isSelected = selected?.id === event.id;

      const line = L.polyline(
        [[event.sourceLat, event.sourceLng], [event.targetLat, event.targetLng]],
        {
          color,
          weight: isSelected ? 2 : 1,
          opacity: isSelected ? 0.9 : 0.35,
          dashArray: "4 6",
        }
      ).addTo(map);

      const srcMarker = L.marker([event.sourceLat, event.sourceLng], {
        icon: createPulseIcon(event.severity),
      }).addTo(map);

      const tgtMarker = L.marker([event.targetLat, event.targetLng], {
        icon: L.divIcon({
          className: "",
          html: `<div style="width:8px;height:8px;border-radius:50%;background:#FFFFFF;opacity:0.6;border:1px solid ${color}"></div>`,
          iconSize: [8, 8],
          iconAnchor: [4, 4],
        }),
      }).addTo(map);

      if (isSelected) {
        srcMarker.bindPopup(`
          <div style="background:#111;color:#fff;border:1px solid #2A2A2A;padding:0.75rem;border-radius:6px;font-family:Inter,sans-serif;font-size:12px;min-width:180px">
            <div style="color:#F5F500;font-weight:700;margin-bottom:0.5rem">${event.attackType}</div>
            <div style="color:#888;margin-bottom:0.2rem">Source: ${event.sourceCountry}</div>
            <div style="color:#888;margin-bottom:0.2rem">Target: ${event.targetCountry}</div>
            <div style="color:#888;margin-bottom:0.2rem">IP: ${event.sourceIp}:${event.port}</div>
            <div style="margin-top:0.5rem;color:${color};font-weight:600;text-transform:uppercase;font-size:11px">${event.severity}</div>
          </div>
        `, { className: "custom-popup" }).openPopup();
      }

      linesRef.current.push(line);
      markersRef.current.push(srcMarker, tgtMarker);
    });

    return () => {
      linesRef.current.forEach((l) => l.remove());
      markersRef.current.forEach((m) => m.remove());
    };
  }, [events, selected, map]);

  return null;
}

interface Props {
  events: ThreatEvent[];
  selected: ThreatEvent | null;
}

export default function ThreatMapView({ events, selected }: Props) {
  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      minZoom={2}
      maxZoom={6}
      style={{ width: "100%", height: "100%", background: "#0d1117" }}
      zoomControl={true}
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution=""
      />
      <AttackLines events={events} selected={selected} />
    </MapContainer>
  );
}