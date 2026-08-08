/**
 * Admins for this single-tenant Siga Sound app.
 * Only these emails may use /admin (Google or email/password).
 */
export const ADMIN_EMAILS = [
  "sigastreetaudio@gmail.com",
  "luckysekhula@gmail.com",
] as const;

export function normalizeEmail(email: string | null | undefined): string {
  return (email ?? "").trim().toLowerCase();
}

export function isAllowedAdminEmail(email: string | null | undefined): boolean {
  const e = normalizeEmail(email);
  if (!e) return false;
  return (ADMIN_EMAILS as readonly string[]).includes(e);
}

/** Role helpers — Firestore `users/{uid}.role` (signup / ensureAdmin sets `"admin"`). */
export function isModeratorRole(role: string | undefined): boolean {
  return role === "moderator";
}

/** Combos CRUD is restricted for moderators (playbook: limit destructive areas). */
export function canManageCombos(role: string | undefined): boolean {
  return !isModeratorRole(role);
}
