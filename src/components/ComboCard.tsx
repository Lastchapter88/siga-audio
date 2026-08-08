"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { combos as prebuiltCombos, type Combo } from "@/data/combos";
import { comboImageUrl } from "@/lib/comboImages";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

export default function ComboCard({
  combo,
}: {
  combo: Combo & { businessId?: string; videoUrl?: string };
}) {
  const router = useRouter();

  const prebuiltSlugSet = useMemo(() => new Set(prebuiltCombos.map((c) => c.slug)), []);

  const detailsHref = combo.businessId
    ? `/combo/${combo.slug}?businessId=${combo.businessId}`
    : `/combo/${combo.slug}`;

  const bookHref = combo.businessId
    ? `/book?combo=${combo.slug}&businessId=${combo.businessId}`
    : `/book?combo=${combo.slug}`;

  const effectiveHref = prebuiltSlugSet.has(combo.slug) ? detailsHref : bookHref;

  return (
    <motion.article
      whileHover={{ scale: 1.04, translateY: -4 }}
      className="bg-gradient-to-b from-[#171717] to-black p-4 rounded-2xl border border-gray-800 hover:border-sigaYellow/80 transition cursor-pointer"
      onClick={() => router.push(effectiveHref)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") router.push(effectiveHref);
      }}
    >
      <Link href={effectiveHref} className="block">
        <div className="relative h-44 w-full overflow-hidden rounded-xl mb-4">
          <Image
            src={comboImageUrl(combo.image)}
            alt={combo.name}
            fill
            className="object-cover transition-transform duration-500 hover:scale-110"
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-white text-lg font-semibold">{combo.name}</h3>
            {combo.tagline && <p className="text-xs text-gray-400 mt-1">{combo.tagline}</p>}
          </div>
          <p className="text-sigaYellow text-xl font-bold">R{combo.price}</p>
        </div>

        <p className="text-[11px] text-gray-400 mt-3">
          Free installation • Premium wiring • Clean finish
        </p>
      </Link>

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          router.push(bookHref);
        }}
        className="mt-4 w-full bg-sigaYellow text-black py-2 rounded-lg font-semibold text-xs hover:bg-yellow-300 transition"
      >
        View Details &amp; Book
      </button>
    </motion.article>
  );
}

