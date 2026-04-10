"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import type { WorkWithCalculations } from "@/types";
import "leaflet/dist/leaflet.css";

interface MapInnerProps {
  works: WorkWithCalculations[];
}

function getStatusLabel(status: WorkWithCalculations["status"]): string {
  switch (status) {
    case "completed": return "Completada";
    case "in_progress": return "En Progreso";
    case "overdue": return "Atrasada";
    case "delayed": return "Retrasada";
    default: return status;
  }
}

function MapFix() {
  const map = useMap();

  useEffect(() => {
    const handleResize = () => {
      map.invalidateSize();
    };

    setTimeout(() => map.invalidateSize(), 100);
    setTimeout(() => map.invalidateSize(), 300);
    setTimeout(() => map.invalidateSize(), 500);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [map]);

  return null;
}

export default function MapInner({ works }: MapInnerProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    import("leaflet").then((L) => {
      // @ts-expect-error - Fix for default marker icons
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
    });
  }, []);

  const worksWithLocation = works.filter(
    (w) => w.latitude != null && w.longitude != null
  );

  const center: [number, number] = worksWithLocation.length > 0
    ? [worksWithLocation[0].latitude!, worksWithLocation[0].longitude!]
    : [-34.6037, -58.3816];

  if (!isClient) {
    return (
      <div className="h-full w-full bg-muted animate-pulse rounded-lg flex items-center justify-center">
        <span className="text-muted-foreground">Cargando mapa...</span>
      </div>
    );
  }

  return (
    <div className="h-full w-full rounded-lg overflow-hidden">
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {worksWithLocation.map((work) => (
          <Marker
            key={work.id}
            position={[work.latitude!, work.longitude!]}
          >
            <Popup>
              <div style={{ minWidth: "150px" }}>
                <strong style={{ fontSize: "14px" }}>{work.name}</strong>
                {work.client && (
                  <>
                    <br />
                    <span style={{ color: "#666" }}>{work.client}</span>
                  </>
                )}
                <br />
                <span style={{ 
                  color: work.is_overdue ? "#dc2626" : "#16a34a", 
                  fontWeight: 500 
                }}>
                  {getStatusLabel(work.status)}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
        <MapFix />
      </MapContainer>
    </div>
  );
}