"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Menu, MessageCircle } from "lucide-react";
import { useSiteSettings, whatsappFromSettings } from "@/lib/pageContent";
import { useCustomerSession } from "@/components/CustomerSessionProvider";
import { signOutCustomer } from "@/lib/customerAuth";
import { SEO } from "@/lib/seoConfig";

export default function Navbar() {
  const { settings } = useSiteSettings();
  const { authReady, user } = useCustomerSession();
  const name = settings.businessName || "SIGA AUDIO SA";
  const tagline = settings.tagline || "Sound Installations";
  const wa = whatsappFromSettings(settings.phone || "0682824322");
  const cta = settings.whatsappCtaLabel || "WhatsApp Booking";

  return (
    <nav className="sticky top-0 z-40 border-b border-white/10 bg-[#070708]/90 px-4 py-3 backdrop-blur-xl md:px-10">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <Link href="/" className="flex min-w-0 items-center gap-2">
          {settings.logoUrl ? (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-sigaYellow">
              <Image src={settings.logoUrl} alt={name} width={36} height={36} className="object-cover" />
            </div>
          ) : (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sigaYellow text-lg font-extrabold text-black">
              {name.trim().slice(0, 1).toUpperCase()}
            </div>
          )}
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-bold tracking-[0.08em] text-white">{name}</p>
            <p className="truncate text-[10px] uppercase tracking-[0.16em] text-gray-500">{tagline}</p>
          </div>
        </Link>

        <div className="flex shrink-0 items-center gap-2 text-sm font-medium md:gap-6">
          <Link href="/combos" className="hidden text-gray-300 transition hover:text-white sm:inline">Combos</Link>
          <Link href="/#services" className="hidden text-gray-300 transition hover:text-white sm:inline">Services</Link>
          <Link href="/air-suspension" className="hidden text-gray-300 transition hover:text-white lg:inline">Suspension</Link>
          <Link href="/book" className="hidden text-gray-300 transition hover:text-white sm:inline">Book</Link>
          <a href={SEO.tiktokUrl} target="_blank" rel="noreferrer" className="hidden text-gray-300 transition hover:text-white lg:inline">TikTok</a>
          {authReady && user ? (
            <button type="button" onClick={() => void signOutCustomer()} className="hidden text-xs text-gray-400 transition hover:text-white md:inline">Sign out</button>
          ) : (
            <Link href="/account?mode=signup&next=/book" className="hidden text-sigaYellow transition hover:text-yellow-300 md:inline">Sign up</Link>
          )}
          {wa ? (
            <a href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-full bg-sigaYellow px-3 py-2 text-xs font-semibold text-black transition hover:bg-yellow-300 md:px-4">
              <MessageCircle size={14} aria-hidden="true" />
              <span className="hidden md:inline">{cta}</span>
            </a>
          ) : null}
          <Link href="/book" aria-label="Book installation" className="inline-flex min-h-10 items-center gap-1 rounded-full border border-white/15 px-3 text-xs text-white transition hover:border-sigaYellow hover:text-sigaYellow sm:hidden">
            <Menu size={15} aria-hidden="true" /> Book
          </Link>
          <Link href="/book" className="hidden items-center gap-1 rounded-full border border-white/15 px-4 py-2 text-xs text-white transition hover:border-sigaYellow hover:text-sigaYellow sm:inline-flex">
            Book installation <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
