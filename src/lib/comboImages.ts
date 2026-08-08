/**
 * Combo hero images live in `public/combos/`.
 * Maps legacy Firestore / old paths to current files in `public/combos/`.
 */
export const DEFAULT_COMBO_IMAGE = "/combos/entry.jpg";

const LEGACY_MAP: Record<string, string> = {
  "/combos/entry.svg": "/combos/entry.jpg",
  "/combos/happy.svg": "/combos/happy.jpg",
  "/combos/party.svg": "/combos/party.jpg",
  "/combos/polo-vivo.svg": "/combos/polo-vivo.jpg",
  "/combos/Happy%20People.jpg": "/combos/happy.jpg",
  "/combos/Happy People.jpg": "/combos/happy.jpg",
  "/combos/stance.jpg": "/combos/stance.jpg",
  "/combos/Crazy.jpg": "/combos/crazy.jpg",
  "/combos/Party.jpg": "/combos/party.jpg",
  "/combos/polo%20vivo.jpg": "/combos/polo-vivo.jpg",
  "/combos/polo vivo.jpg": "/combos/polo-vivo.jpg",
  "/combos/Trga-killer.jpg": "/targer-killer.jpg",
};

export function comboImageUrl(path: string | undefined | null): string {
  const p = (path ?? "").trim();
  if (!p) return DEFAULT_COMBO_IMAGE;
  if (LEGACY_MAP[p]) return LEGACY_MAP[p];
  try {
    const dec = decodeURIComponent(p);
    if (LEGACY_MAP[dec]) return LEGACY_MAP[dec];
  } catch {
    /* ignore */
  }
  return p;
}
