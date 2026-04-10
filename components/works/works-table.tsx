"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { WorkWithCalculations } from "@/types";
import Link from "next/link";

interface WorksTableProps {
  works: WorkWithCalculations[];
  onDelete?: (id: string) => void;
}

const statusVariants: Record<WorkWithCalculations["status"], "default" | "secondary" | "destructive" | "outline"> = {
  completed: "default",
  in_progress: "secondary",
  overdue: "destructive",
  delayed: "destructive",
};

const statusLabels: Record<WorkWithCalculations["status"], string> = {
  completed: "Completada",
  in_progress: "En Progreso",
  overdue: "Atrasada",
  delayed: "Retrasada",
};

export function WorksTable({ works, onDelete }: WorksTableProps) {
  if (works.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No hay obras todavía. ¡Crea la primera!
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Fecha de Inicio</TableHead>
            <TableHead>Fecha de Entrega</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Días</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {works.map((work) => (
            <TableRow key={work.id}>
              <TableCell className="font-medium">
                <Link
                  href={`/works/${work.id}`}
                  className="hover:underline"
                >
                  {work.name}
                </Link>
              </TableCell>
              <TableCell>{work.client || "-"}</TableCell>
              <TableCell>{new Date(work.start_date).toLocaleDateString("es-ES")}</TableCell>
              <TableCell>{new Date(work.due_date).toLocaleDateString("es-ES")}</TableCell>
              <TableCell>
                <Badge variant={statusVariants[work.status]}>
                  {statusLabels[work.status]}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {work.actual_end_date ? (
                  <span className={work.actual_days > work.planned_days ? "text-destructive" : ""}>
                    {work.actual_days}
                  </span>
                ) : (
                  <span className="text-muted-foreground">{work.actual_days}*</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <Link
                    href={`/works/${work.id}`}
                    className="inline-flex h-7 items-center gap-1 rounded-md px-2.5 text-[0.8rem] hover:bg-muted hover:text-foreground"
                  >
                    Ver
                  </Link>
                  <Link
                    href={`/works/${work.id}/edit`}
                    className="inline-flex h-7 items-center gap-1 rounded-md px-2.5 text-[0.8rem] hover:bg-muted hover:text-foreground"
                  >
                    Editar
                  </Link>
                  {onDelete && (
                    <button
                      className="inline-flex h-7 items-center gap-1 rounded-md px-2.5 text-[0.8rem] text-destructive hover:bg-destructive/10"
                      onClick={() => onDelete(work.id)}
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
