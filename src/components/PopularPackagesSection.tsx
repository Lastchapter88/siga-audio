"use client";

import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CarFront, Check } from "lucide-react";
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
  const [vehicle, setVehicle] = useState("All packages");
  const prebuiltSlugSet = useMemo(() => new Set(prebuiltCombos.map((c) => c.slug)), []);
  const vehicles = useMemo(
    () => ["All packages", ...Array.from(new Set(combos.map((combo) => combo.vehicleModel).filter(Boolean))) as string[]],
    [combos]
  );
  const filteredCombos = useMemo(
    () => vehicle === "All packages" ? combos : combos.filter((combo) => combo.vehicleModel === vehicle),
    [combos, vehicle]
  );

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
    <section id="packages" className="mx-auto max-w-7xl px-5 py-20 md:px-10">
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="eyebrow mb-3">Choose your setup</p>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">{subtitle}</p>
        </div>
        <Link href="/combos" className="inline-flex items-center gap-2 text-sm font-semibold text-sigaYellow transition hover:text-white">
          Browse all packages <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>

      <div id="vehicle-finder" className="surface mb-8 rounded-2xl p-4 md:flex md:items-center md:justify-between md:p-5">
        <div className="mb-4 flex items-start gap-3 md:mb-0">
          <CarFront className="mt-0.5 text-sigaYellow" size={20} aria-hidden="true" />
          <div><p className="font-semibold text-white">What do you drive?</p><p className="text-xs text-gray-400">See vehicle-specific packages where available.</p></div>
        </div>
        <div className="flex flex-wrap gap-2" role="list" aria-label="Filter packages by vehicle">
          {vehicles.map((item) => <button key={item} type="button" onClick={() => setVehicle(item)} className={`rounded-full border px-3 py-2 text-xs transition ${vehicle === item ? "border-sigaYellow bg-sigaYellow text-black" : "border-white/10 text-gray-300 hover:border-sigaYellow/60"}`}>{item}</button>)}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCombos.map((combo) => {
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
                <article className="surface overflow-hidden rounded-2xl transition hover:-translate-y-1 hover:border-sigaYellow/60">
                  <div className="relative h-56 w-full overflow-hidden bg-black">
                    <Image
                      src={media.image}
                      alt={combo.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3"><div><p className="text-[10px] uppercase tracking-[0.18em] text-gray-500">{combo.vehicleModel || combo.category || "Audio package"}</p><h3 className="mt-2 text-lg font-bold text-white">{combo.name}</h3></div><p className="whitespace-nowrap text-xl font-bold text-sigaYellow">R{combo.price.toLocaleString("en-ZA")}</p></div>
                    <p className="mt-2 text-sm font-medium text-gray-300">{combo.tagline}</p>
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-500">{combo.description}</p>
                    <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-xs"><span className="flex items-center gap-1.5 text-gray-400"><Check size={14} className="text-sigaYellow" aria-hidden="true" /> Installation service</span><span className="font-semibold text-sigaYellow">View details →</span></div>
                  </div>
                </article>
              </Link>

              <Link href={bookHref} className="mt-3 flex min-h-11 w-full items-center justify-center rounded-xl border border-sigaYellow/40 text-sm font-semibold text-sigaYellow transition hover:bg-sigaYellow hover:text-black">
                Reserve installation
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
