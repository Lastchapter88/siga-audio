/**
 * Generates PNG favicons from public/icon.svg.
 * Run: node scripts/generate-icons.mjs
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const svg = readFileSync(join(root, "public", "icon.svg"));

const sizes = [
  { name: "apple-touch-icon.png", size: 180 },
  { name: "favicon-32x32.png", size: 32 },
  { name: "favicon-16x16.png", size: 16 },
];

for (const { name, size } of sizes) {
  await sharp(svg).resize(size, size).png().toFile(join(root, "public", name));
  console.log(`Created public/${name}`);
}

await sharp(svg).resize(48, 48).png().toFile(join(root, "public", "favicon.ico"));
console.log("Created public/favicon.ico");
