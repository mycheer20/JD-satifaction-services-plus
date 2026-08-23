"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { assertStaff } from "@/features/auth/guards";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function markAdminNotificationRead(formData: FormData) {
  await assertStaff();
  const id = String(formData.get("notification_id") ?? "");
  const returnTo = String(formData.get("return_to") ?? "/admin/notifications");

  const supabase = await createSupabaseServerClient();
  await supabase
    .from("admin_notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("id", id)
    .is("read_at", null);

  revalidatePath("/admin");
  revalidatePath("/admin/notifications");
  redirect(returnTo);
}

export async function markAllAdminNotificationsRead() {
  await assertStaff();

  const supabase = await createSupabaseServerClient();
  await supabase
    .from("admin_notifications")
    .update({ read_at: new Date().toISOString() })
    .is("read_at", null);

  revalidatePath("/admin");
  revalidatePath("/admin/notifications");
  redirect("/admin/notifications");
}
