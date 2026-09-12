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
      <section className="py-12 px-6 max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Book Car Sound Installation</h1>
        <p className="text-gray-400 text-sm max-w-xl mx-auto text-center mb-8 leading-relaxed">
          Sign up with your name and phone number, pick a day and time, pay the deposit, upload proof, then send payment
          details on WhatsApp to <span className="text-sigaYellow">{SEO.phone}</span>. SIGA Audio SA confirms your slot
          once payment proof is received.
        </p>

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
