"use client";

import { useState, useEffect } from "react";
import { getDashboardStats, getRecentWorks, getWorksByMonth } from "@/lib/actions/dashboard";
import { getWorks } from "@/lib/actions/works";
import { DashboardStats, WorkWithCalculations } from "@/types";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { WorksChart } from "@/components/dashboard/works-chart";
import { WorksTable } from "@/components/works/works-table";
import { StatsCardsSkeleton } from "@/components/dashboard/stats-cards-skeleton";
import { WorksChartSkeleton } from "@/components/dashboard/works-chart-skeleton";
import { WorksTableSkeleton } from "@/components/works/works-table-skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkMap } from "@/components/works/work-map";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardContent() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentWorks, setRecentWorks] = useState<WorkWithCalculations[]>([]);
  const [worksByMonth, setWorksByMonth] = useState<{ month: string; count: number }[]>([]);
  const [allWorks, setAllWorks] = useState<WorkWithCalculations[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getDashboardStats(),
      getRecentWorks(10),
      getWorksByMonth(),
      getWorks(),
    ]).then(([s, r, w, a]) => {
      setStats(s);
      setRecentWorks(r);
      setWorksByMonth(w);
      setAllWorks(a);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-5 w-96" />
        </div>
        <StatsCardsSkeleton />
        <div className="grid gap-4 md:grid-cols-2">
          <WorksChartSkeleton />
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-7 w-20" />
            </CardHeader>
            <CardContent>
              <WorksTableSkeleton rows={3} />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Panel Principal</h1>
        <p className="text-muted-foreground mt-1">
          Resumen de tus obras y entregas
        </p>
      </div>

      <StatsCards stats={stats!} />

      <div className="space-y-4">
        <WorkMap works={allWorks} showAllMarkers fullWidth />

        <WorksChart data={worksByMonth} />

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Obras Recientes</CardTitle>
            <Link
              href="/works"
              className="inline-flex h-7 items-center gap-1 rounded-md px-2.5 text-[0.8rem] hover:bg-muted hover:text-foreground"
            >
              Ver todas <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>
          <CardContent>
            {recentWorks.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No hay obras todavía.{" "}
                <Link href="/works/new" className="underline">
                  Crea la primera
                </Link>
              </p>
            ) : (
              <WorksTable works={recentWorks} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
