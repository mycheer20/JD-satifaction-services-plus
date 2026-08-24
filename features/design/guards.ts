import "server-only";

import { redirect } from "next/navigation";
import { assertAdmin } from "@/features/auth/guards";
import { getSessionUser, isDesignEditor, type SessionUser } from "@/features/auth/session";

/**
 * Panneau Design du site — admin et designer uniquement.
 * Les designers n'ont pas accès à l'administration métier.
 */
export async function requireDesignEditor(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect("/connexion?next=/design");
  if (!isDesignEditor(user)) redirect("/compte?erreur=acces-refuse");
  return user;
}

export async function assertDesignEditor(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user || !isDesignEditor(user)) {
    throw new Error("Action réservée aux éditeurs design (admin ou designer).");
  }
  return user;
}

/** Admin métier + design — pour les liens croisés dans la nav admin. */
export async function requireAdminForNav(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect("/connexion");
  if (user.role !== "admin") redirect("/compte?erreur=acces-refuse");
  return user;
}

export async function assertCanManageDesignRoles(): Promise<SessionUser> {
  return assertAdmin();
}
