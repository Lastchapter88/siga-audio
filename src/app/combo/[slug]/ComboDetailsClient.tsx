"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { combos as prebuiltCombos } from "@/data/combos";
import { resolveComboMedia, useComboMediaOverrides } from "@/lib/comboMedia";

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
    <main className="bg-background min-h-screen text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
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
            <div className="flex flex-col md:flex-row gap-10 md:items-start">
              <div className="md:w-1/2">
                <div className="relative w-full h-[340px] rounded-2xl overflow-hidden border border-gray-800 bg-[#111]">
                  <Image
                    src={media?.image ?? "/combos/entry.jpg"}
                    alt={combo.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {media?.videoUrl ? (
                  <div className="mt-4 rounded-2xl overflow-hidden border border-gray-800 bg-[#111]">
                    <video src={media.videoUrl} controls className="w-full max-h-[420px]" playsInline />
                  </div>
                ) : null}

                <div className="mt-6 flex flex-wrap gap-2">
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

              <div className="md:w-1/2">
                <h1 className="text-4xl font-extrabold tracking-tight">{combo.name}</h1>

                {combo.tagline ? (
                  <p className="text-sigaYellow text-lg font-semibold mt-3">{combo.tagline}</p>
                ) : null}

                <p className="text-gray-300 mt-5 leading-relaxed">{combo.description}</p>

                <h2 className="text-3xl text-sigaYellow font-bold mt-8">R{combo.price}</h2>

                <div className="mt-6">
                  <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wide mb-3">
                    What you get
                  </h3>
                  <ul className="space-y-2">
                    {(combo.features ?? []).map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-gray-200">
                        <span className="mt-1 h-2.5 w-2.5 rounded-full bg-sigaYellow" />
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
                    className="w-full md:w-auto inline-flex items-center justify-center bg-sigaYellow text-black px-8 py-3 rounded-xl font-bold hover:bg-yellow-300 transition hover:scale-[1.02]"
                  >
                    Book Installation
                  </Link>
                  <p className="text-xs text-gray-400 mt-4">
                    You’ll choose a slot, upload proof of payment, and confirm via WhatsApp.
                  </p>
                </div>
              </div>
            </div>

            <section className="mt-14 rounded-2xl border border-gray-800 bg-[#0b0b0d] p-6 md:p-8">
              <h2 className="text-xl font-bold">Ready to upgrade?</h2>
              <p className="text-gray-400 text-sm mt-2">
                Click the button above to lock your installation time. Premium wiring included.
              </p>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

