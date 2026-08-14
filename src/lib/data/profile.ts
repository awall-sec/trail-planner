import { createClient } from "@/lib/supabase/server";
import type { UserProfile } from "@/lib/data/types";

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data as UserProfile | null;
}
