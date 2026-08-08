"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-black">
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-sigaYellow/40 blur-[180px] opacity-20 pointer-events-none" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#1a1a1a_0,_#050507_55%,_#000000_100%)]" />

      <div className="relative z-10 text-center px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-xs tracking-[0.25em] text-gray-400 uppercase mb-4"
        >
          Premium Car Audio • Johannesburg
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-7xl font-extrabold text-sigaYellow drop-shadow-xl"
        >
          SOUND THAT SHAKES
          <span className="block text-white mt-2">THE STREET</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-gray-300 mt-6 max-w-xl mx-auto text-sm md:text-base"
        >
          Custom installs, clean wiring, and combos built for real world flex. Book your slot, pay
          a deposit, pull up and play loud.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="flex flex-col md:flex-row gap-4 justify-center mt-10"
        >
          <Link href="/book">
            <button className="bg-sigaYellow text-black px-8 py-3 rounded-full font-semibold text-sm md:text-base hover:bg-yellow-300 hover:scale-105 transition">
              Book Installation
            </button>
          </Link>
          <Link href="/combos">
            <button className="border border-gray-700 text-gray-200 px-8 py-3 rounded-full font-semibold text-sm md:text-base hover:border-sigaYellow hover:text-white transition">
              View Packages
            </button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-10 flex flex-wrap justify-center gap-6 text-xs text-gray-400"
        >
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-400" />
            Same-day installs on available slots
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-sigaYellow" />
            Free installation on all combos
          </div>
        </motion.div>
      </div>
    </section>
  );
}

