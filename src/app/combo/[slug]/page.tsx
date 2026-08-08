import dynamic from "next/dynamic";
import { combos } from "@/data/combos";

// Load client-only (Firebase) after hydration — avoids broken server vendor chunks for @firebase
const ComboDetailsClient = dynamic(() => import("./ComboDetailsClient"), {
  ssr: false,
  loading: () => (
    <div className="bg-background min-h-screen text-white px-6 py-10">
      <div className="max-w-5xl mx-auto text-gray-400 text-sm">Loading package…</div>
    </div>
  ),
});

// Required because this project uses `output: "export"` in `next.config.mjs`.
// Next needs a finite set of params for `/combo/[slug]` to be statically generated.
export function generateStaticParams() {
  return combos.map((c) => ({ slug: c.slug }));
}

export default function ComboPage({
  params,
}: {
  params: { slug: string };
}) {
  return <ComboDetailsClient slug={params.slug} />;
}

