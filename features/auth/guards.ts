import "server-only";

import { redirect } from "next/navigation";
import { getSessionUser, isAdmin, isStaff, type SessionUser } from "./session";

/**
 * Authorization checks for pages and Server Actions.
 *
 * Every one of these runs on the server. The proxy also blocks /admin, but that
 * is a convenience redirect for humans — these guards are the real boundary,
 * because a Server Action is reachable by a direct POST that never passes
 * through a page render.
 */

export async function requireUser(redirectTo = "/connexion"): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect(redirectTo);
  return user;
}

export async function requireStaff(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect("/connexion?next=/admin");
  if (!isStaff(user)) redirect("/compte?erreur=acces-refuse");
  return user;
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect("/connexion?next=/admin");
  if (!isAdmin(user)) redirect("/admin?erreur=acces-administrateur-requis");
  return user;
}

/**
 * Non-redirecting variants for use inside Server Actions, where throwing gives
 * a clearer failure than a redirect to a login page.
 */
export async function assertStaff(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user || !isStaff(user)) {
    throw new Error("Action réservée à l'administration.");
  }
  return user;
}

export async function assertAdmin(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user || !isAdmin(user)) {
    throw new Error("Action réservée aux administrateurs.");
  }
  return user;
}
