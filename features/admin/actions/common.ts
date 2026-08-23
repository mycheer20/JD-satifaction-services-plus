"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { assertAdmin, assertStaff } from "@/features/auth/guards";

export type ActionResult = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
};

export async function revalidateAdmin(...paths: string[]) {
  for (const path of paths) {
    revalidatePath(path);
  }
  revalidatePath("/admin");
}

export async function redirectAdmin(path: string, flash: string) {
  redirect(`${path}?ok=${flash}`);
}

export async function guardStaffAction() {
  return assertStaff();
}

export async function guardAdminAction() {
  return assertAdmin();
}
