"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { WorkPhoto } from "@/types";

export async function getPhotos(workId: string): Promise<WorkPhoto[]> {
  const supabase = await createClient();
  const { data: photos, error } = await supabase
    .from("work_photos")
    .select("*")
    .eq("work_id", workId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching photos:", error);
    return [];
  }

  return photos || [];
}

export async function deletePhoto(id: string, workId: string) {
  const supabase = await createClient();
  
  const { data: photo, error: fetchError } = await supabase
    .from("work_photos")
    .select("url")
    .eq("id", id)
    .single();

  if (fetchError || !photo) {
    return { error: fetchError?.message || "Photo not found" };
  }

  const urlPath = photo.url.split("/work-photos/")[1];
  if (urlPath) {
    await supabase.storage.from("work-photos").remove([urlPath]);
  }

  const { error } = await supabase
    .from("work_photos")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting photo:", error);
    return { error: error.message };
  }

  revalidatePath(`/works/${workId}`);
  revalidatePath("/works");
  return { success: true };
}
