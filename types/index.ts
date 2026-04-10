export type WorkStatus = "completed" | "in_progress" | "overdue" | "delayed";

export interface Work {
  id: string;
  name: string;
  client: string | null;
  description: string | null;
  start_date: string;
  due_date: string;
  actual_end_date: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
}

export interface WorkWithCalculations extends Work {
  planned_days: number;
  actual_days: number;
  status: WorkStatus;
  is_overdue: boolean;
}

export interface CreateWorkInput {
  name: string;
  client?: string;
  description?: string;
  start_date: string;
  due_date: string;
  actual_end_date?: string;
  latitude?: number;
  longitude?: number;
}

export interface UpdateWorkInput extends Partial<CreateWorkInput> {
  id: string;
}

export interface DashboardStats {
  total_works: number;
  completed_works: number;
  in_progress_works: number;
  overdue_works: number;
  average_delivery_days: number;
}

export interface WorkPhoto {
  id: string;
  work_id: string;
  url: string;
  description: string | null;
  created_at: string;
}
