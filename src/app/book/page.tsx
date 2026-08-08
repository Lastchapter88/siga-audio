import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import BookClient from "./BookClient";

export default function BookPage() {
  return (
    <main className="bg-background min-h-screen text-white">
      <Navbar />
      <section className="py-12 px-6 max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Book Installation</h1>
        <p className="text-gray-400 text-sm max-w-xl mx-auto text-center mb-8">
          Sign up with your name and phone number, pick a day and time, pay the deposit, upload proof, then send payment
          details on WhatsApp to <span className="text-sigaYellow">0682824322</span>.
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

