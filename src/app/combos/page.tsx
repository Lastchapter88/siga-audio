import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { combos as prebuiltCombos } from "@/data/combos";
import CombosCatalogClient from "@/components/CombosCatalogClient";
import { SEO } from "@/lib/seoConfig";

export const metadata: Metadata = {
  title: "Car Sound Packages & Combos",
  description:
    "Browse SIGA Audio installation packages — entry-level bass upgrades, stance combos, vehicle-specific builds for Polo Vivo, Vitz, Dzire and more. Book online in South Africa.",
  alternates: { canonical: `${SEO.siteUrl}/combos` },
};

export default function CombosPage() {
  return (
    <main className="bg-background min-h-screen text-white">
      <Navbar />

      <section className="mx-auto max-w-7xl px-5 py-16 md:px-10">
        <div className="mb-10 max-w-3xl">
          <p className="eyebrow mb-4">SIGA Audio catalogue</p>
          <h1 className="text-4xl font-black tracking-tight md:text-6xl">Packages built for your cabin.</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-gray-400">
            Choose a car sound combo package, check what's included, then book your installation slot online. SIGA Audio
            SA offers entry-level, loud, premium, and vehicle-specific packages with professional installation included
            on most combos.
          </p>
        </div>

        <CombosCatalogClient initialCombos={prebuiltCombos} />
      </section>
    </main>
  );
}
