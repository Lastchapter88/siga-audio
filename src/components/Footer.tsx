import Link from "next/link";
import { SEO, formatAddress } from "@/lib/seoConfig";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black px-5 py-12 text-sm text-gray-400 md:px-10">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <p className="text-base font-bold tracking-[0.08em] text-white">{SEO.businessName}</p>
          <p className="mt-3 max-w-sm leading-6">Car sound installations, accessories and vehicle upgrades from our Tembisa workshop.</p>
          <Link href="/#visit-us" className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-sigaYellow px-4 py-3 font-semibold text-black hover:bg-yellow-300">Find SIGA Audio</Link>
        </div>
        <nav aria-label="Footer navigation">
          <p className="font-semibold text-white">Explore</p>
          <div className="mt-4 flex flex-col items-start gap-3">
            <Link href="/combos" className="hover:text-sigaYellow">Packages</Link>
            <Link href="/air-suspension" className="hover:text-sigaYellow">Air suspension</Link>
            <Link href="/book" className="hover:text-sigaYellow">Book an installation</Link>
            <Link href="/#faq" className="hover:text-sigaYellow">FAQ</Link>
          </div>
        </nav>
        <div>
          <p className="font-semibold text-white">Visit us</p>
          <address className="mt-4 not-italic leading-6">{formatAddress()}<br /><a href={`tel:+27${SEO.phone.slice(1)}`} className="hover:text-sigaYellow">{SEO.phoneDisplay}</a></address>
          <div className="mt-4 flex flex-wrap gap-3">
            <a href={SEO.googleMapsUrl} target="_blank" rel="noreferrer" className="text-sigaYellow hover:text-yellow-300">Get directions</a>
            <a href={`https://wa.me/${SEO.whatsapp}`} target="_blank" rel="noreferrer" className="text-sigaYellow hover:text-yellow-300">WhatsApp</a>
            <a href={SEO.tiktokUrl} target="_blank" rel="noreferrer" className="text-sigaYellow hover:text-yellow-300">TikTok</a>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-5 text-xs text-gray-600">© {new Date().getFullYear()} {SEO.businessName}. All rights reserved.</div>
    </footer>
  );
}
