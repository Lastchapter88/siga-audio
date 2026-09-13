"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { combos as prebuiltCombos } from "@/data/combos";
import { resolveComboMedia, useComboMediaOverrides } from "@/lib/comboMedia";
import Navbar from "@/components/Navbar";
import { ArrowRight, Check, Clock3, ShieldCheck, Wrench } from "lucide-react";

type ComboDoc = {
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

export default function ComboDetailsClient({
  slug,
}: {
  slug: string;
}) {
  const mediaOverrides = useComboMediaOverrides();
  const prebuilt = useMemo(() => prebuiltCombos.find((c) => c.slug === slug), [slug]);

  // Instant: show catalog combo immediately when this slug exists in data/combos.ts
  const [combo, setCombo] = useState<ComboDoc | null>(() =>
    prebuilt ? ({ ...prebuilt } as ComboDoc) : null
  );

  // Only wait on network for slugs that are NOT in the local catalog (e.g. new Firestore-only packages)
  const [remoteReady, setRemoteReady] = useState(() => !!prebuilt);

  const [resolvedBusinessId] = useState<string | null>(() =>
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("businessId")
      : null
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const combosRef = collection(db, "combos");
        const constraints = [where("slug", "==", slug)];
        if (resolvedBusinessId) constraints.push(where("businessId", "==", resolvedBusinessId));

        const q = query(combosRef, ...constraints);
        const snap = await getDocs(q);
        const found = snap.docs[0]?.data() as ComboDoc | undefined;
        if (cancelled) return;
        if (found) {
          setCombo(found);
        } else if (!prebuilt) {
          setCombo(null);
        }
        // If Firestore empty but prebuilt exists, keep showing prebuilt
      } catch (err) {
        console.error(err);
        if (!cancelled && !prebuilt) setCombo(null);
      } finally {
        if (!cancelled) setRemoteReady(true);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [slug, resolvedBusinessId, prebuilt]);

  const media = useMemo(() => {
    if (!combo) return null;
    return resolveComboMedia(slug, combo.image, combo.videoUrl, mediaOverrides);
  }, [combo, slug, mediaOverrides]);

  const bookHref = useMemo(() => {
    if (!combo) return `/book?combo=${slug}`;
    return combo.businessId
      ? `/book?combo=${combo.slug}&businessId=${combo.businessId}`
      : `/book?combo=${combo.slug}`;
  }, [combo, slug]);

  return (
    <main className="min-h-screen bg-background text-white">
      <Navbar />
      <div className="mx-auto max-w-7xl px-5 py-10 md:px-10 md:py-16">
        {!combo && !remoteReady ? (
          <div className="text-gray-400 text-sm">Loading combo…</div>
        ) : !combo ? (
          <div className="bg-[#111] border border-gray-800 rounded-2xl p-8">
            <h1 className="text-3xl font-extrabold">Combo not found</h1>
            <p className="text-gray-400 mt-3">
              This package may have been removed or the slug does not exist.
            </p>
            <Link href={`/book?combo=${slug}`} className="inline-flex mt-6 bg-sigaYellow text-black px-8 py-3 rounded-xl font-bold hover:bg-yellow-300 transition">
              Book Installation
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8 flex items-center gap-2 text-xs text-gray-500"><Link href="/combos" className="transition hover:text-white">Packages</Link><span>/</span><span className="text-gray-300">{combo.name}</span></div>
            <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
              <div className="lg:w-[56%]">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#111]">
                  <Image
                    src={media?.image ?? "/combos/entry.jpg"}
                    alt={combo.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 56vw"
                    className="object-cover"
                  />
                </div>

                {media?.videoUrl ? (
                  <div className="mt-4 rounded-2xl overflow-hidden border border-gray-800 bg-[#111]">
                    <video src={media.videoUrl} controls className="w-full max-h-[420px]" playsInline />
                  </div>
                ) : null}

                <div className="mt-4 flex flex-wrap gap-2">
                  {combo.category ? (
                    <span className="inline-flex items-center rounded-full bg-sigaYellow/15 text-sigaYellow border border-sigaYellow/30 px-4 py-2 text-xs font-semibold">
                      {combo.category.toUpperCase()}
                    </span>
                  ) : null}

                  {combo.vehicleModel ? (
                    <span className="inline-flex items-center rounded-full bg-white/5 text-gray-200 border border-gray-800 px-4 py-2 text-xs font-semibold">
                      {combo.vehicleModel}
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="lg:w-[44%] lg:pt-2">
                <p className="eyebrow mb-4">Installation package</p>
                <h1 className="text-4xl font-black tracking-tight md:text-6xl">{combo.name}</h1>

                {combo.tagline ? (
                  <p className="text-sigaYellow text-lg font-semibold mt-3">{combo.tagline}</p>
                ) : null}

                <p className="mt-5 leading-7 text-gray-300">{combo.description}</p>

                <div className="mt-8 flex items-end gap-3"><h2 className="text-4xl font-bold text-sigaYellow">R{combo.price.toLocaleString("en-ZA")}</h2><span className="pb-1 text-sm text-gray-500">package + install</span></div>

                <div className="mt-6">
                  <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-200">
                    What you get
                  </h3>
                  <ul className="space-y-2">
                    {(combo.features ?? []).map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-gray-200">
                        <Check className="mt-0.5 shrink-0 text-sigaYellow" size={17} aria-hidden="true" />
                        <span>{feature}</span>
                      </li>
                    ))}
                    {(!combo.features || combo.features.length === 0) && (
                      <li className="text-sm text-gray-400">Feature list will be available soon.</li>
                    )}
                  </ul>
                </div>

                <div className="mt-8">
                  <Link
                    href={bookHref}
                    className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-sigaYellow px-8 py-3 font-bold text-black transition hover:bg-yellow-300 md:w-auto"
                  >
                    Book Installation <ArrowRight size={17} aria-hidden="true" />
                  </Link>
                  <p className="text-xs text-gray-400 mt-4">
                    You’ll choose a slot, upload proof of payment, and confirm via WhatsApp.
                  </p>
                </div>
              </div>
            </div>

            <section className="mt-14 grid gap-4 border-t border-white/10 pt-10 sm:grid-cols-3">
              {[[Wrench, "Professional install", "A clean, fitted solution for your vehicle."], [Clock3, "Choose your slot", "Pick an available date and time online."], [ShieldCheck, "Deposit + WhatsApp", "Pay the deposit and send proof to confirm."]].map(([Icon, title, body]) => {
                const FeatureIcon = Icon as typeof Wrench;
                return <div key={title as string} className="surface rounded-2xl p-5"><FeatureIcon size={20} className="text-sigaYellow" aria-hidden="true" /><h2 className="mt-4 font-semibold">{title as string}</h2><p className="mt-2 text-sm leading-6 text-gray-500">{body as string}</p></div>;
              })}
            </section>
          </>
        )}
      </div>
    </main>
  );
}

