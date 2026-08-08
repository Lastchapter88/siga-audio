"use client";

import { Suspense, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { business } from "@/lib/businessConfig";
import { proofOfPaymentWhatsAppUrl } from "@/lib/paymentConfig";
import { useSiteSettings } from "@/lib/pageContent";

function SuccessInner() {
  const params = useSearchParams();
  const { settings } = useSiteSettings();
  const wa = params.get("wa");
  const proofWaParam = params.get("proofWa");
  const phone = settings.phone || "0682824322";

  const proofWa = useMemo(
    () => proofWaParam || proofOfPaymentWhatsAppUrl(phone),
    [proofWaParam, phone]
  );

  return (
    <section className="py-20 px-6 max-w-2xl mx-auto text-center">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">Booking Submitted</h1>
      <p className="text-gray-300 text-sm mb-6">
        Your booking is in the {business.name} admin panel. Now send your proof of payment on WhatsApp.
      </p>

      <div className="space-y-3 mb-8">
        <a
          href={proofWa}
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-full max-w-md mx-auto items-center justify-center gap-2 bg-[#25D366] text-black px-6 py-3 rounded-xl text-sm font-bold hover:brightness-110 transition"
        >
          Send proof of payment on WhatsApp ({phone})
        </a>
        {wa ? (
          <a
            href={wa}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-full max-w-md mx-auto items-center justify-center bg-sigaYellow text-black px-6 py-3 rounded-xl text-sm font-semibold hover:bg-yellow-300 transition"
          >
            Re-open booking WhatsApp message
          </a>
        ) : null}
      </div>

      <p className="text-gray-500 text-xs mb-6">
        Tip: In WhatsApp, attach your EFT screenshot/PDF after the chat opens.
      </p>

      <Link href="/" className="inline-flex text-sm text-gray-400 hover:text-white">
        Back to Home
      </Link>
    </section>
  );
}

export default function SuccessPage() {
  return (
    <main className="bg-background min-h-screen text-white">
      <Navbar />
      <Suspense fallback={<p className="text-center text-gray-400 py-20 text-sm">Loading…</p>}>
        <SuccessInner />
      </Suspense>
    </main>
  );
}
