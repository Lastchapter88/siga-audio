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

      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold">Car Sound Packages Built for Real Bass</h1>
          <p className="text-gray-400 mt-3 max-w-2xl text-sm leading-relaxed">
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
