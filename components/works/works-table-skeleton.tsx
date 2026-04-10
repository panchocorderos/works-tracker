import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function WorksTableSkeleton({ rows = 5 }: { rows?: number }) {
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
          {[...Array(rows)].map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-20 rounded-full" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-4 w-8 ml-auto" />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <Skeleton className="h-7 w-12" />
                  <Skeleton className="h-7 w-16" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
