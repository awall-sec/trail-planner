"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { geocodeAddress } from "@/lib/geocode";

export async function saveHomeAddress(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const address = (formData.get("address") as string) ?? "";

  const geocoded = await geocodeAddress(address);
  if (!geocoded) {
    redirect(`/parks?addressError=${encodeURIComponent("Couldn't find that address -- try adding more detail (city, state).")}`);
  }

  const { error } = await supabase.from("user_profiles").upsert(
    {
      user_id: user.id,
      home_address: geocoded.displayName,
      home_lat: geocoded.lat,
      home_lng: geocoded.lng,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );
  if (error) throw error;

  revalidatePath("/parks");
  redirect("/parks");
}

export async function clearHomeAddress() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.from("user_profiles").delete().eq("user_id", user.id);
  if (error) throw error;

  revalidatePath("/parks");
  redirect("/parks");
}
