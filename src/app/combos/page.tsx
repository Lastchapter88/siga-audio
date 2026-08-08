import Navbar from "@/components/Navbar";
import { combos as prebuiltCombos } from "@/data/combos";
import CombosCatalogClient from "@/components/CombosCatalogClient";

export default function CombosPage() {
  return (
    <main className="bg-background min-h-screen text-white">
      <Navbar />

      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold">Packages Built for Real Sound</h1>
          <p className="text-gray-400 mt-3 max-w-2xl text-sm">
            Choose a combo, check details, then book your installation slot.
          </p>
        </div>

        <CombosCatalogClient initialCombos={prebuiltCombos} />
      </section>
    </main>
  );
}
