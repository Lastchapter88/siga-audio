import { readFileSync } from "node:fs";

const file = process.argv[2];
const h = readFileSync(file, "utf8");
const title = h.match(/<title[^>]*>([^<]+)/)?.[1];
const desc = h.match(/name="description" content="([^"]+)/)?.[1];
const h1s = [...h.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) =>
  m[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
);
const h2s = [...h.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)].map((m) =>
  m[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
);
const text = h
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
  .replace(/<[^>]+>/g, " ")
  .replace(/\s+/g, " ")
  .trim();

console.log(JSON.stringify({ title, desc, h1Count: h1s.length, h1s, h2Count: h2s.length, h2s: h2s.slice(0, 8), wordCount: text.split(/\s+/).filter(Boolean).length }, null, 2));
