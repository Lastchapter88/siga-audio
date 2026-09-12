"use client";

import Link from "next/link";
import Image from "next/image";
import { useSiteSettings, whatsappFromSettings } from "@/lib/pageContent";
import { useCustomerSession } from "@/components/CustomerSessionProvider";
import { signOutCustomer } from "@/lib/customerAuth";

export default function Navbar() {
  const { settings } = useSiteSettings();
  const { authReady, user } = useCustomerSession();
  const name = settings.businessName || "SIGA AUDIO SA";
  const tagline = settings.tagline || "Sound Installations";
  const wa = whatsappFromSettings(settings.phone || "0682824322");
  const cta = settings.whatsappCtaLabel || "WhatsApp Booking";

  return (
    <nav className="sticky top-0 z-20 bg-black/80 backdrop-blur border-b border-sigaYellow/40 px-6 md:px-10 py-4 flex items-center justify-between gap-3">
      <Link href="/" className="flex items-center gap-2 min-w-0">
        {settings.logoUrl ? (
          <div className="h-9 w-9 rounded-full bg-sigaYellow overflow-hidden flex items-center justify-center shrink-0">
            <Image src={settings.logoUrl} alt={name} width={36} height={36} className="object-cover" />
          </div>
        ) : (
          <div className="h-9 w-9 rounded-full bg-sigaYellow flex items-center justify-center text-black font-extrabold text-lg shrink-0">
            {name.trim().slice(0, 1).toUpperCase()}
          </div>
        )}
        <div className="leading-tight min-w-0">
          <p className="text-sigaYellow font-bold tracking-wide truncate">{name}</p>
          <p className="text-xs text-gray-400 uppercase truncate">{tagline}</p>
        </div>
      </Link>

      <div className="flex items-center gap-4 md:gap-6 text-sm font-medium shrink-0">
        <Link href="/combos" className="hidden sm:inline text-gray-300 hover:text-white">
          Combos
        </Link>
        <Link href="/#services" className="hidden sm:inline text-gray-300 hover:text-white">
          Services
        </Link>
        <Link href="/air-suspension" className="hidden sm:inline text-gray-300 hover:text-white">
          Suspension
        </Link>
        <Link href="/book" className="text-gray-300 hover:text-white">
          Book
        </Link>
        {authReady && user ? (
          <button
            type="button"
            onClick={() => void signOutCustomer()}
            className="text-gray-400 hover:text-white text-xs md:text-sm"
          >
            Sign out
          </button>
        ) : (
          <Link href="/account?mode=signup&next=/book" className="text-sigaYellow hover:text-yellow-300">
            Sign up
          </Link>
        )}
        {wa ? (
          <a
            href={`https://wa.me/${wa}`}
            target="_blank"
            rel="noreferrer"
            className="hidden md:inline-flex bg-sigaYellow text-black px-4 py-2 rounded-full text-xs font-semibold hover:bg-yellow-300 transition"
          >
            {cta}
          </a>
        ) : null}
      </div>
    </nav>
  );
}
