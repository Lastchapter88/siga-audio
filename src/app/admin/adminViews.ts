/** Human-readable titles per admin area — playbook “ADMIN_VIEW_TITLES” pattern. */
export const ADMIN_VIEW_TITLES = {
  bookings: "Bookings",
  activity: "Activity",
  content: "Homepage",
  combos: "Combos",
  media: "Site media",
} as const;

export type AdminViewKey = keyof typeof ADMIN_VIEW_TITLES;

export function adminViewKeyFromPathname(pathname: string): AdminViewKey | null {
  if (pathname.startsWith("/admin/dashboard")) return "bookings";
  if (pathname.startsWith("/admin/activity")) return "activity";
  if (pathname.startsWith("/admin/content")) return "content";
  if (pathname.startsWith("/admin/combos")) return "combos";
  if (pathname.startsWith("/admin/media")) return "media";
  return null;
}

export function adminPageTitle(pathname: string): string {
  const key = adminViewKeyFromPathname(pathname);
  return key ? ADMIN_VIEW_TITLES[key] : "Admin";
}
