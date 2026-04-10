import { Skeleton } from "@/components/ui/skeleton";

export function StatsCardsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-2 p-4 border rounded-lg">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-4 rounded-full" />
          </div>
          <Skeleton className="h-8 w-12" />
          <Skeleton className="h-3 w-24" />
        </div>
      ))}
      <div className="space-y-2 p-4 border rounded-lg">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-4 rounded-full" />
        </div>
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  );
}
