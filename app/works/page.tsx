"use client";

import { useState, useEffect } from "react";
import { getWorks, deleteWork } from "@/lib/actions/works";
import { WorksTable } from "@/components/works/works-table";
import { WorksTableSkeleton } from "@/components/works/works-table-skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { WorkWithCalculations } from "@/types";

export default function WorksPage() {
  const [works, setWorks] = useState<WorkWithCalculations[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    getWorks().then((data) => {
      setWorks(data);
      setIsLoading(false);
    });
  }, []);

  const handleDelete = async (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    const result = await deleteWork(deleteId);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Obra eliminada");
      const updatedWorks = await getWorks();
      setWorks(updatedWorks);
    }
    setIsDeleting(false);
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Obras</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona todas tus obras y su progreso
          </p>
        </div>
        <Link
          href="/works/new"
          className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Nueva Obra
        </Link>
      </div>

      {isLoading ? (
        <WorksTableSkeleton />
      ) : works && works.length > 0 ? (
        <WorksTable works={works} onDelete={handleDelete} />
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No hay obras todavía</p>
          <Link
            href="/works/new"
            className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Crea tu primera obra
          </Link>
        </div>
      )}

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Obra</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar esta obra? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
