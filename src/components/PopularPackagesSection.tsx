"use client";

import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { combos as prebuiltCombos } from "@/data/combos";
import { resolveComboMedia, useComboMediaOverrides } from "@/lib/comboMedia";

export type ComboDoc = {
  id?: string;
  slug: string;
  name: string;
  price: number;
  tagline?: string;
  description?: string;
  features?: string[];
  category?: string;
  vehicleModel?: string;
  image?: string;
  videoUrl?: string;
  businessId?: string;
};

type Props = {
  /** From server: catalog is in first HTML paint — no wait for JS/Firestore */
  initialCombos: ComboDoc[];
  title?: string;
  subtitle?: string;
};

export default function PopularPackagesSection({
  initialCombos,
  title = "Popular Packages",
  subtitle = "Three clean systems for every style. Click a combo to view details and book your install.",
}: Props) {
  const mediaOverrides = useComboMediaOverrides();
  const [combos, setCombos] = useState<ComboDoc[]>(() => initialCombos.map((c) => ({ ...c })));
  const prebuiltSlugSet = useMemo(() => new Set(prebuiltCombos.map((c) => c.slug)), []);

  useEffect(() => {
    async function load() {
      try {
        const snap = await getDocs(collection(db, "combos"));
        const fetched = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<ComboDoc, "id">),
        }));

        if (fetched.length > 0) {
          setCombos(fetched);
        }
      } catch (err) {
        console.error(err);
      }
    }

    load();
  }, []);

  return (
    <section id="packages" className="max-w-6xl mx-auto px-6 py-16">
      <h2 className="text-3xl font-bold mb-3">{title}</h2>
      <p className="text-gray-400 text-sm mb-8 max-w-2xl">{subtitle}</p>

      <div className="grid md:grid-cols-3 gap-6">
        {combos.map((combo) => {
          const media = resolveComboMedia(combo.slug, combo.image, combo.videoUrl, mediaOverrides);
          const bookHref = combo.businessId
            ? `/book?combo=${combo.slug}&businessId=${combo.businessId}`
            : `/book?combo=${combo.slug}`;

          const detailsHref = combo.businessId
            ? `/combo/${combo.slug}?businessId=${combo.businessId}`
            : `/combo/${combo.slug}`;

          const effectiveCardHref = prebuiltSlugSet.has(combo.slug) ? detailsHref : bookHref;

          return (
            <div key={combo.slug} className="group">
              <Link href={effectiveCardHref}>
                <article className="bg-[#111] p-5 rounded-xl border border-gray-800 hover:border-sigaYellow/80 transition hover:scale-[1.02] cursor-pointer">
                  <div className="relative h-48 w-full overflow-hidden rounded-lg mb-4">
                    <Image
                      src={media.image}
                      alt={combo.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  <h3 className="text-xl font-bold mt-2">{combo.name}</h3>
                  <p className="text-gray-400 text-sm mt-1">{combo.tagline}</p>

                  <p className="text-sigaYellow text-2xl font-bold mt-4">R{combo.price}</p>

                  <p className="text-gray-300 text-sm mt-3 line-clamp-3">{combo.description}</p>
                </article>
              </Link>

              <Link href={bookHref} className="block mt-4">
                <div className="w-full bg-sigaYellow text-black py-2 rounded-lg font-semibold text-sm hover:bg-yellow-300 transition text-center">
                  Book This Combo
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
