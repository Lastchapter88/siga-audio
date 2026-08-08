"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { comboImageUrl } from "@/lib/comboImages";
import { DEFAULT_SITE_IMAGES, SITE_MEDIA_SLOTS } from "@/lib/siteMediaConfig";

type Package = {
  slot: string;
  name: string;
  description: string;
  image: string;
  videoUrl?: string;
};

export default function AirSuspensionContent() {
  const [packages, setPackages] = useState<Package[]>(() =>
    SITE_MEDIA_SLOTS.map((s) => ({
      slot: s.slot,
      name: s.label.replace(/^Air Suspension — /, ""),
      description: s.description ?? "",
      image: DEFAULT_SITE_IMAGES[s.slot] ?? "/images.jpg",
    }))
  );

  useEffect(() => {
    async function load() {
      try {
        const snap = await getDocs(collection(db, "siteMedia"));
        const bySlot = new Map(snap.docs.map((d) => [d.id, d.data() as { imageUrl?: string; videoUrl?: string }]));

        setPackages(
          SITE_MEDIA_SLOTS.map((s) => {
            const stored = bySlot.get(s.slot);
            return {
              slot: s.slot,
              name: s.label.replace(/^Air Suspension — /, ""),
              description: s.description ?? "",
              image: comboImageUrl(stored?.imageUrl ?? DEFAULT_SITE_IMAGES[s.slot]),
              videoUrl: stored?.videoUrl,
            };
          })
        );
      } catch (err) {
        console.error(err);
      }
    }

    load();
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-6 py-14">
      <h1 className="text-4xl md:text-5xl font-extrabold text-sigaYellow">Air Suspension Installation</h1>
      <p className="text-gray-400 mt-3 max-w-2xl">
        Adjust your ride height anytime. Built for comfort, stance, and clean installation.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mt-10">
        {packages.map((pkg) => (
          <article
            key={pkg.slot}
            className="bg-[#111] border border-gray-800 rounded-2xl overflow-hidden hover:border-sigaYellow/70 transition"
          >
            <div className="relative h-44 w-full bg-black/40">
              <Image src={pkg.image} alt={pkg.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
            </div>
            {pkg.videoUrl ? (
              <div className="px-5 pt-4">
                <video src={pkg.videoUrl} controls className="w-full rounded-lg border border-gray-800 max-h-48" />
              </div>
            ) : null}
            <div className="p-5">
              <h2 className="text-xl font-bold">{pkg.name}</h2>
              <p className="text-gray-400 text-sm mt-2">{pkg.description}</p>
              <Link
                href="/book"
                className="inline-flex mt-5 bg-sigaYellow text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition"
              >
                Book Consultation
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
