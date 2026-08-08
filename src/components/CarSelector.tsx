"use client";

import { useState } from "react";

const cars = ["Polo Vivo", "Vitz", "Ertiga", "Bakkie", "Other"];

export default function CarSelector() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <section className="py-16 px-6 bg-[#050507] border-y border-gray-900">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
          What do you drive?
        </h2>
        <p className="text-gray-400 text-sm mb-8 max-w-xl mx-auto">
          Pick your car type to see the most popular packages and make it easier for us to set up
          the perfect install.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          {cars.map((car) => (
            <button
              key={car}
              type="button"
              onClick={() => setSelected(car)}
              className={`px-6 py-2 rounded-full text-sm border transition ${
                selected === car
                  ? "bg-sigaYellow text-black border-sigaYellow"
                  : "border-gray-700 text-gray-200 hover:border-sigaYellow/80"
              }`}
            >
              {car}
            </button>
          ))}
        </div>

        {selected && (
          <p className="mt-6 text-xs text-gray-400">
            Selected: <span className="text-sigaYellow font-semibold">{selected}</span>. You can
            mention this in your booking notes.
          </p>
        )}
      </div>
    </section>
  );
}

