"use client";


import { Suspense, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { business } from "@/lib/businessConfig";
import { proofOfPaymentWhatsAppUrl } from "@/lib/paymentConfig";
import { useSiteSettings } from "@/lib/pageContent";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { SEO } from "@/lib/seoConfig";


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
    <section className="mx-auto max-w-2xl px-5 py-20 text-center md:px-10">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sigaYellow/15 text-sigaYellow"><CheckCircle2 size={34} aria-hidden="true" /></div>
      <p className="eyebrow mt-7">Next step: confirm your deposit</p>
      <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">Your installation request is in.</h1>
      <p className="mt-5 text-base leading-7 text-gray-300">
        Your booking is in the {business.name} admin panel. Now send your proof of payment on WhatsApp.
      </p>

      <div className="mt-8 space-y-3">
        <a
          href={proofWa}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-14 w-full max-w-md items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-sm font-bold text-black transition hover:brightness-110"
        >
          <MessageCircle size={18} aria-hidden="true" />
          Send proof of payment on WhatsApp ({phone})
        </a>
        {wa ? (
          <a
            href={wa}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-14 w-full max-w-md items-center justify-center rounded-xl bg-sigaYellow px-6 py-3 text-sm font-semibold text-black transition hover:bg-yellow-300"
          >
            Re-open booking WhatsApp message
          </a>
        ) : null}
      </div>

      <p className="mt-6 text-xs text-gray-500">
        Tip: In WhatsApp, attach your EFT screenshot/PDF after the chat opens.
      </p>

      <a href={SEO.googleMapsUrl} target="_blank" rel="noreferrer" className="mt-8 inline-flex min-h-12 w-full max-w-md items-center justify-center rounded-xl border border-sigaYellow px-6 py-3 text-sm font-semibold text-sigaYellow hover:bg-sigaYellow/10">
        Get directions to the workshop
      </a>
      <Link href="/#visit-us" className="mt-4 inline-flex text-sm text-gray-400 hover:text-white">View address and opening hours</Link>

      <Link href="/" className="mt-4 inline-flex text-sm text-gray-400 hover:text-white">
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
