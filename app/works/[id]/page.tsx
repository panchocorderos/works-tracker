"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getWork } from "@/lib/actions/works";
import { getPhotos } from "@/lib/actions/photos";
import { WorkWithCalculations, WorkPhoto } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PhotosGrid } from "@/components/works/photos-grid";
import { PhotoUpload } from "@/components/works/photo-upload";
import { WorkDetailSkeleton } from "@/components/works/work-detail-skeleton";
import { WorkMap } from "@/components/works/work-map";
import { ArrowLeft, Calendar, User, FileText, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

const statusConfig = {
  completed: { label: "Completada", variant: "default" as const, color: "text-green-600" },
  in_progress: { label: "En Progreso", variant: "secondary" as const, color: "text-yellow-600" },
  overdue: { label: "Atrasada", variant: "destructive" as const, color: "text-red-600" },
  delayed: { label: "Retrasada", variant: "destructive" as const, color: "text-red-600" },
};

export default function WorkDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [work, setWork] = useState<WorkWithCalculations | null>(null);
  const [photos, setPhotos] = useState<WorkPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    Promise.all([
      getWork(id),
      getPhotos(id)
    ]).then(([w, p]) => {
      setWork(w);
      setPhotos(p);
      setIsLoading(false);
    });
  }, [id]);

  const loadPhotos = () => {
    getPhotos(id).then(setPhotos);
  };

  if (isLoading) {
    return <WorkDetailSkeleton />;
  }

  if (!work) {
    return (
      <div className="max-w-4xl text-center py-12">
        <p className="text-muted-foreground">Obra no encontrada</p>
        <Link href="/works" className="text-primary underline mt-2 inline-block">
          Volver a Obras
        </Link>
      </div>
    );
  }

  const status = statusConfig[work.status];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        href="/works"
        className="inline-flex items-center gap-1 text-sm hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a Obras
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl">{work.name}</CardTitle>
              {work.client && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{work.client}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={status.variant}>{status.label}</Badge>
              <Link
                href={`/works/${work.id}/edit`}
                className="inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium hover:bg-muted"
              >
                Editar
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {work.description && (
            <div className="flex gap-2">
              <FileText className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">{work.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Inicio</p>
                <p className="text-sm font-medium">
                  {format(new Date(work.start_date), "dd/MM/yyyy")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Entrega</p>
                <p className="text-sm font-medium">
                  {format(new Date(work.due_date), "dd/MM/yyyy")}
                </p>
              </div>
            </div>
            {work.actual_end_date && (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Real</p>
                  <p className="text-sm font-medium text-green-600">
                    {format(new Date(work.actual_end_date), "dd/MM/yyyy")}
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Días</p>
                <p className={`text-sm font-medium ${work.is_overdue ? "text-red-600" : ""}`}>
                  {work.actual_days} {work.is_overdue && <AlertTriangle className="inline h-3 w-3" />}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {work.latitude && work.longitude && (
        <WorkMap works={[work]} />
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <span className="text-lg">📷</span>
              Fotos de la Obra ({photos.length})
            </CardTitle>
            <PhotoUpload workId={work.id} onUploadComplete={loadPhotos} />
          </div>
        </CardHeader>
        <CardContent>
          {photos.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="mb-4">No hay fotos todavía</p>
              <PhotoUpload workId={work.id} onUploadComplete={loadPhotos} />
            </div>
          ) : (
            <PhotosGrid
              photos={photos}
              workId={work.id}
              onPhotoDeleted={loadPhotos}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
