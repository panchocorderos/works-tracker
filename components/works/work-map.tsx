"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import dynamic from "next/dynamic";
import type { WorkWithCalculations } from "@/types";

interface WorkMapProps {
  works: WorkWithCalculations[];
  showAllMarkers?: boolean;
  fullWidth?: boolean;
}

const MapInner = dynamic(() => import("./map-inner"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] bg-muted animate-pulse rounded-lg flex items-center justify-center">
      <span className="text-muted-foreground">Cargando mapa...</span>
    </div>
  ),
});

export function WorkMap({ works, showAllMarkers = false, fullWidth = false }: WorkMapProps) {
  const worksWithLocation = works.filter(
    (w) => w.latitude != null && w.longitude != null
  );

  if (worksWithLocation.length === 0) {
    if (fullWidth) {
      return (
        <div className="h-[300px] bg-muted rounded-lg flex items-center justify-center">
          <span className="text-muted-foreground">No hay obras con ubicación registrada</span>
        </div>
      );
    }
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Ubicación
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] bg-muted rounded-lg flex items-center justify-center">
            <span className="text-muted-foreground">No hay obras con ubicación registrada</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (fullWidth) {
    return (
      <div className="h-[400px] w-full rounded-lg overflow-hidden border">
        <MapInner works={works} />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Ubicación {showAllMarkers && `(${worksWithLocation.length})`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full rounded-lg overflow-hidden border">
          <MapInner works={works} />
        </div>
      </CardContent>
    </Card>
  );
}
