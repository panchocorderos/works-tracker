import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function WorksChartSkeleton() {
  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex items-end justify-center gap-2">
          {[40, 65, 45, 80, 55, 70].map((height, i) => (
            <Skeleton
              key={i}
              className="w-12"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
