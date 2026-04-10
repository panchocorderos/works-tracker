"use server";

import { createClient } from "@/lib/supabase/server";
import { DashboardStats, WorkWithCalculations } from "@/types";

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();
  const { data: works, error } = await supabase
    .from("works")
    .select("*");

  if (error || !works) {
    return {
      total_works: 0,
      completed_works: 0,
      in_progress_works: 0,
      overdue_works: 0,
      average_delivery_days: 0,
    };
  }

  const worksWithMetrics = works.map((work) => {
    const startDate = new Date(work.start_date);
    const dueDate = new Date(work.due_date);
    const actualEndDate = work.actual_end_date
      ? new Date(work.actual_end_date)
      : new Date();

    const plannedDays = Math.ceil(
      (dueDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const isOverdue =
      !work.actual_end_date &&
      Math.ceil(
        (actualEndDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      ) > plannedDays;

    const isDelayed =
      work.actual_end_date && actualEndDate > dueDate;

    return {
      ...work,
      is_overdue: isOverdue || isDelayed,
    };
  });

  const completedWorks = worksWithMetrics.filter((w) => w.actual_end_date);
  const inProgressWorks = worksWithMetrics.filter((w) => !w.actual_end_date);
  const overdueWorks = worksWithMetrics.filter((w) => w.is_overdue);

  const totalDeliveryDays = completedWorks.reduce((acc, work) => {
    const start = new Date(work.start_date);
    const end = new Date(work.actual_end_date!);
    const days = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    return acc + days;
  }, 0);

  const averageDeliveryDays =
    completedWorks.length > 0
      ? Math.round(totalDeliveryDays / completedWorks.length)
      : 0;

  return {
    total_works: works.length,
    completed_works: completedWorks.length,
    in_progress_works: inProgressWorks.length,
    overdue_works: overdueWorks.length,
    average_delivery_days: averageDeliveryDays,
  };
}

export async function getRecentWorks(limit: number = 5): Promise<WorkWithCalculations[]> {
  const supabase = await createClient();
  const { data: works, error } = await supabase
    .from("works")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !works) {
    return [];
  }

  return works.map((work) => {
    const startDate = new Date(work.start_date);
    const dueDate = new Date(work.due_date);
    const actualEndDate = work.actual_end_date
      ? new Date(work.actual_end_date)
      : new Date();

    const plannedDays = Math.ceil(
      (dueDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const actualDays = Math.ceil(
      (actualEndDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const isOverdue =
      !work.actual_end_date && actualDays > plannedDays;
    const isDelayed =
      work.actual_end_date && actualEndDate > dueDate;

    let status: WorkWithCalculations["status"] = "in_progress";
    if (work.actual_end_date) {
      status = isDelayed ? "delayed" : "completed";
    } else if (isOverdue) {
      status = "overdue";
    }

    return {
      ...work,
      planned_days: plannedDays,
      actual_days: actualDays,
      status,
      is_overdue: isOverdue || isDelayed,
    };
  });
}

export async function getWorksByMonth(): Promise<{ month: string; count: number }[]> {
  const supabase = await createClient();
  const { data: works, error } = await supabase
    .from("works")
    .select("created_at");

  if (error || !works) {
    return [];
  }

  const monthCounts: Record<string, number> = {};

  works.forEach((work) => {
    const date = new Date(work.created_at);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1;
  });

  const months = Object.keys(monthCounts).sort().slice(-6);

  return months.map((month) => ({
    month: new Date(month + "-01").toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    }),
    count: monthCounts[month],
  }));
}
