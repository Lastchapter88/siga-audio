import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import BookClient from "./BookClient";
import { SEO } from "@/lib/seoConfig";

export const metadata: Metadata = {
  title: "Book Car Sound Installation",
  description:
    "Book your car sound installation with SIGA Audio SA. Choose a combo, pick a date, pay the R500 deposit, and confirm on WhatsApp. Serving South Africa.",
  alternates: { canonical: `${SEO.siteUrl}/book` },
};

export default function BookPage() {
  return (
    <main className="bg-background min-h-screen text-white">
      <Navbar />
      <section className="mx-auto max-w-5xl px-5 py-12 md:px-10 md:py-16">
        <div className="mb-10 max-w-3xl">
        <p className="eyebrow mb-4">Reserve your installation</p>
        <h1 className="text-4xl font-black tracking-tight md:text-6xl">Make your next drive sound better.</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-gray-400">
          Sign up with your name and phone number, pick a day and time, pay the deposit, upload proof, then send payment
          details on WhatsApp to <span className="text-sigaYellow">{SEO.phone}</span>. SIGA Audio SA confirms your slot
          once payment proof is received.
        </p>
        <div className="mt-7 grid max-w-2xl grid-cols-2 gap-3 text-xs text-gray-400 sm:grid-cols-4">
          {["Choose setup", "Your vehicle", "Pick a slot", "Confirm deposit"].map((step, index) => <div key={step} className="surface rounded-xl p-3"><span className="text-sigaYellow">0{index + 1}</span><p className="mt-2">{step}</p></div>)}
        </div>
        </div>

        <Suspense
          fallback={
            <p className="text-gray-500 text-sm text-center mb-6">Loading booking form...</p>
          }
        >
          <BookClient />
        </Suspense>
      </section>
    </main>
  );
}
