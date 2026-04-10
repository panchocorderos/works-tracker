"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CreateWorkInput, UpdateWorkInput, WorkWithCalculations } from "@/types";

function calculateWorkMetrics(work: WorkWithCalculations & { planned_days?: number; actual_days?: number; status?: string; is_overdue?: boolean }): WorkWithCalculations {
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
    is_overdue: Boolean(isOverdue || isDelayed),
  };
}

export async function getWorks(): Promise<WorkWithCalculations[]> {
  const supabase = await createClient();
  const { data: works, error } = await supabase
    .from("works")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching works:", error);
    return [];
  }

  return works.map(calculateWorkMetrics);
}

export async function getWork(id: string): Promise<WorkWithCalculations | null> {
  const supabase = await createClient();
  const { data: work, error } = await supabase
    .from("works")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching work:", error);
    return null;
  }

  return calculateWorkMetrics(work);
}

export async function createWork(input: CreateWorkInput) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("works")
    .insert([input])
    .select()
    .single();

  if (error) {
    console.error("Error creating work:", error);
    return { error: error.message };
  }

  revalidatePath("/works");
  revalidatePath("/");
  redirect("/works");
}

export async function updateWork(input: UpdateWorkInput) {
  const supabase = await createClient();
  const { id, ...updates } = input;

  const { data, error } = await supabase
    .from("works")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating work:", error);
    return { error: error.message };
  }

  revalidatePath("/works");
  revalidatePath("/");
  return { data };
}

export async function deleteWork(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("works").delete().eq("id", id);

  if (error) {
    console.error("Error deleting work:", error);
    return { error: error.message };
  }

  revalidatePath("/works");
  revalidatePath("/");
}
