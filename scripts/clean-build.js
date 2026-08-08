/**
 * Remove Next.js output folders before a fresh build.
 * Fixes Windows hangs / EPERM from corrupted `.next/cache` (webpack pack files).
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");

for (const dir of [".next", "out"]) {
  const full = path.join(root, dir);
  try {
    fs.rmSync(full, { recursive: true, force: true });
    console.log("[clean-build] Removed", dir);
  } catch (e) {
    console.warn("[clean-build] Could not remove", dir, "—", e && e.message);
  }
}
