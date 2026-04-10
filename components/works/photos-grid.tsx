"use client";

import { useState } from "react";
import { WorkPhoto } from "@/types";
import { Button } from "@/components/ui/button";
import { deletePhoto } from "@/lib/actions/photos";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { format } from "date-fns";
import { Trash2, X } from "lucide-react";

interface PhotosGridProps {
  photos: WorkPhoto[];
  workId: string;
  onPhotoDeleted: () => void;
}

export function PhotosGrid({ photos, workId, onPhotoDeleted }: PhotosGridProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<WorkPhoto | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    const result = await deletePhoto(deleteId, workId);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Foto eliminada");
      onPhotoDeleted();
    }
    setIsDeleting(false);
    setDeleteId(null);
  };

  if (photos.length === 0) {
    return null;
  }

  return (
    <>
      <div className="space-y-3">
        <h3 className="text-lg font-medium">Fotos ({photos.length})</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="group relative aspect-square rounded-lg overflow-hidden border bg-muted cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setSelectedPhoto(photo)}
            >
              <img
                src={photo.url}
                alt={photo.description || "Foto de obra"}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-sm">Ver</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>Foto</DialogTitle>
            <DialogDescription>Vista de foto detallada</DialogDescription>
          </DialogHeader>
          <div className="relative">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-2 right-2 z-10 p-1 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            {selectedPhoto && (
              <>
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.description || "Foto de obra"}
                  className="w-full max-h-[75vh] object-contain bg-black"
                />
                <div className="p-4">
                  {selectedPhoto.description && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {selectedPhoto.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(selectedPhoto.created_at), "PPP")}
                    </span>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setDeleteId(selectedPhoto.id);
                        setSelectedPhoto(null);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Foto</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar esta foto? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
