import Link from "next/link";
import { SEO, formatAddress, formatHoursList } from "@/lib/seoConfig";
import FeaturedTikTok from "@/components/FeaturedTikTok";

const services = [
  {
    title: "Touchscreen & Android Head Units",
    body:
      "Upgrade from factory radios to modern touchscreen and Android head units with Bluetooth, navigation, Apple CarPlay, and Android Auto. We supply and fit units from Kenwood, Pioneer, Alpine, and other trusted brands — with clean wiring and steering-wheel controls where supported.",
  },
  {
    title: "Speaker & Tweeter Upgrades",
    body:
      "Better mids and crisp highs transform everyday driving. We install door speakers, midranges, bullet tweeters, and component sets matched to your amplifier and vehicle cabin — from entry-level upgrades to full-stage builds for Polo Vivo, Toyota Vitz, Suzuki Dzire, bakkies, and more.",
  },
  {
    title: "Amplifiers & Monoblocks",
    body:
      "Clean power is the backbone of any loud system. We fit amplifiers and monoblocks sized correctly for your speakers and subwoofers, run proper gauge wiring, and tune gain and crossovers so your system plays loud without distortion.",
  },
  {
    title: "Subwoofers & Bass Systems",
    body:
      "Feel the bass with subwoofers, custom boxes, and ported enclosures. Choose from our combo packages — entry-level to competition-style — or let us design a setup around your budget and boot space.",
  },
  {
    title: "Car Alarms & Accessories",
    body:
      "Beyond audio, we fit bumper parking sensors, alarms, and car accessories that improve safety and convenience. Ask about sensors, wiring kits, equalizers, crossovers, and styling add-ons when you visit or message us on WhatsApp.",
  },
  {
    title: "Fault Finding, Sales & Air Suspension",
    body:
      "Dead amps, blown speakers, wiring faults — we diagnose and repair car audio problems. We also sell equipment outright and offer air suspension installation for ride-height control. Repairs typically take 2–3 weeks; see our terms for warranty details.",
  },
];

const faqs = [
  {
    q: "How much does a car sound installation cost?",
    a: "Packages start from around R3,500 for entry-level bass upgrades and go up to R12,000+ for premium vehicle-specific builds. View our combo packages online or WhatsApp us with your car model for a tailored quote.",
  },
  {
    q: "How long does an installation take?",
    a: "Most combo installations are completed in one booked slot (typically a few hours depending on the package). Complex custom builds or repairs may take longer — repairs usually need 2–3 weeks. We confirm timing when you book.",
  },
  {
    q: "Which brands do you fit?",
    a: "We work with Kenwood, Kicker, Powerbass, JBL, Pioneer, Alpine, Targa, Digital Star Sound, and other quality brands. Tell us your budget and we will recommend the right head unit, speakers, amp, and sub setup.",
  },
  {
    q: "Do I need to pay a deposit to book?",
    a: "Yes — a R500 EFT deposit secures your installation slot. Pay to SIGA AUDIO PTY LTD (Standard Bank), send proof on WhatsApp to 068 282 4322, and we confirm your booking.",
  },
  {
    q: "Which areas do you serve?",
    a: `We are based in Tembisa and serve ${SEO.serviceCities}. Customers travel from across Gauteng for installs — message us if you are unsure about availability.`,
  },
];

export default function HomeSeoSections() {
  const hours = formatHoursList();

  return (
    <div className="bg-[#0a0a0a] border-t border-gray-900">
      <section id="about" className="max-w-4xl mx-auto px-6 py-16 scroll-mt-24">
        <h2 className="text-2xl md:text-3xl font-bold text-sigaYellow mb-4">About SIGA Audio SA</h2>
        <p className="text-gray-300 leading-relaxed mb-4">
          SIGA Audio SA is a professional car sound installation and accessories shop in Tembisa, Gauteng. Established
          in 2018, we help everyday drivers and enthusiasts upgrade their in-car experience with touchscreen head units,
          speakers, amplifiers, subwoofers, alarms, and styling accessories — all installed to a high standard at our
          workshop on Flint Mazibuko Street.
        </p>
        <p className="text-gray-300 leading-relaxed">
          Our motto — <strong className="text-white">{SEO.tagline}</strong> — reflects our approach: powerful, clean
          sound and honest pricing. Rated {SEO.googleRating.value}★ from {SEO.googleRating.count} Google reviews, we are
          one of Tembisa&apos;s trusted names for car audio.
        </p>
      </section>

      <section id="our-services" className="max-w-4xl mx-auto px-6 py-16 border-t border-gray-900 scroll-mt-24">
        <h2 className="text-2xl md:text-3xl font-bold text-sigaYellow mb-3">Our Services</h2>
        <p className="text-gray-400 mb-8">
          SIGA Audio SA specialises in car sound installation and car accessories — from touchscreen head units and
          speaker upgrades to amplifiers, subwoofers, alarms, and more at our Tembisa workshop.
        </p>
        <div className="space-y-8">
          {services.map((service) => (
            <article key={service.title}>
              <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
              <p className="text-gray-300 leading-relaxed">{service.body}</p>
            </article>
          ))}
        </div>
        <p className="mt-8">
          <Link href="/combos" className="text-sigaYellow font-semibold hover:text-yellow-300">
            View installation packages →
          </Link>
        </p>
      </section>

      <section id="why-us" className="max-w-4xl mx-auto px-6 py-16 border-t border-gray-900 scroll-mt-24">
        <h2 className="text-2xl md:text-3xl font-bold text-sigaYellow mb-4">Why Choose SIGA Audio</h2>
        <p className="text-gray-300 leading-relaxed mb-6">
          Established in 2018, SIGA Audio SA has built a reputation for powerful, clean car sound and honest pricing.
          Our motto — <strong className="text-white">{SEO.tagline}</strong> — says it all: serious bass and quality
          workmanship without killing your pockets.
        </p>
        <ul className="space-y-3 text-gray-300 leading-relaxed">
          <li>
            <strong className="text-white">{SEO.googleRating.value}★ rated on Google</strong> —{" "}
            {SEO.googleRating.count} reviews from satisfied customers who trust us for installs and upgrades.
          </li>
          <li>
            <strong className="text-white">Professional workmanship</strong> — neat wiring, secure mounting, and
            tuning on every job, from your first sub upgrade to full custom builds.
          </li>
          <li>
            <strong className="text-white">Clear packages &amp; booking</strong> — choose a combo online, pay your
            deposit, and confirm on WhatsApp in minutes.
          </li>
          <li>
            <strong className="text-white">Trusted brands</strong> — Kenwood, Pioneer, Alpine, JBL, Kicker, Targa,
            Powerbass, and more.
          </li>
          <li>
            <strong className="text-white">Full-service shop</strong> — head units, speakers, amps, subs, alarms,
            accessories, fault finding, and air suspension under one roof.
          </li>
        </ul>
      </section>

      <section id="tiktok" className="border-t border-gray-900 px-5 py-16 md:px-10">
        <div className="mx-auto max-w-7xl rounded-3xl border border-sigaYellow/20 bg-gradient-to-br from-[#171717] to-[#090909] p-7 md:p-10">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow mb-3">Social proof from the workshop</p>
            <h2 className="text-3xl font-bold text-white md:text-4xl">See SIGA Audio in Action</h2>
            <p className="mt-4 text-lg leading-7 text-gray-300">Real installations. Real vehicles. Real builds.</p>
            <p className="mt-3 text-sm leading-6 text-gray-500">Follow our TikTok for the latest car sound installs, package builds and workshop moments.</p>
          </div>
          <div className="mt-8">
            <FeaturedTikTok />
          </div>
          <div className="mt-8 text-center">
            <a href={SEO.tiktokUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-sigaYellow px-6 py-3 font-bold text-black transition hover:bg-yellow-300">
              Follow us on TikTok <span className="ml-2 text-xs font-semibold">{SEO.tiktokHandle}</span>
            </a>
          </div>
        </div>
      </section>

      <section id="service-areas" className="max-w-4xl mx-auto px-6 py-16 border-t border-gray-900 scroll-mt-24">
        <h2 className="text-2xl md:text-3xl font-bold text-sigaYellow mb-4">Areas We Serve</h2>
        <p className="text-gray-300 leading-relaxed mb-4">
          Our workshop is at {formatAddress()}. We welcome customers from across Gauteng and regularly install for
          drivers in:
        </p>
        <ul className="grid sm:grid-cols-2 gap-2 text-gray-300 mb-6">
          {SEO.serviceAreas.map((area) => (
            <li key={area} className="flex items-center gap-2">
              <span className="text-sigaYellow">•</span> {area}
            </li>
          ))}
        </ul>
        <p className="text-gray-300 leading-relaxed">
          Not sure if we cover your area? WhatsApp{" "}
          <a href={`https://wa.me/${SEO.whatsapp}`} className="text-sigaYellow hover:text-yellow-300">
            {SEO.phoneDisplay}
          </a>{" "}
          with your suburb and vehicle — we will confirm and recommend the right package.
        </p>
      </section>

      <section id="visit-us" className="scroll-mt-24 border-t border-gray-900 px-5 py-16 pb-32 md:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="eyebrow mb-3">Tembisa workshop</p>
            <h2 className="text-3xl font-bold text-sigaYellow md:text-4xl">Find SIGA Audio</h2>
            <p className="mt-4 max-w-xl text-gray-300 leading-relaxed">Visit us for professional car sound installations, accessories, fault finding and vehicle upgrades. Book ahead for an installation slot, or contact us before you travel.</p>
            <address className="mt-7 not-italic text-gray-200"><strong className="block text-white">Workshop address</strong><span className="mt-1 block">{formatAddress()}</span></address>
            <div className="mt-6 grid gap-3 text-sm text-gray-300 sm:grid-cols-2">
              <div><strong className="block text-white">Opening hours</strong><ul className="mt-2 space-y-1">{hours.map((line) => <li key={line}>{line}</li>)}</ul></div>
              <div><strong className="block text-white">Contact</strong><a href={`tel:+27${SEO.phone.slice(1)}`} className="mt-2 block text-sigaYellow hover:text-yellow-300">Call {SEO.phoneDisplay}</a><a href={`mailto:${SEO.email}`} className="mt-1 block break-all text-sigaYellow hover:text-yellow-300">{SEO.email}</a></div>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href={SEO.googleMapsUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-sigaYellow px-6 py-3 font-bold text-black hover:bg-yellow-300">Get Directions</a>
              <a href={`tel:+27${SEO.phone.slice(1)}`} className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/20 px-6 py-3 font-semibold text-white hover:border-sigaYellow hover:text-sigaYellow">Call {SEO.phoneDisplay}</a>
              <a href={`https://wa.me/${SEO.whatsapp}`} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-sigaYellow px-6 py-3 font-semibold text-sigaYellow hover:bg-sigaYellow/10">WhatsApp Us</a>
            </div>
            <Link href="/book" className="mt-5 inline-flex text-sm font-semibold text-gray-300 underline decoration-sigaYellow underline-offset-4 hover:text-white">Book an installation before you visit →</Link>
          </div>
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111] shadow-xl">
            <iframe title="Map showing SIGA Audio in Tembisa" src="https://www.google.com/maps?q=7441+Flint+Mazibuko+St,+Tembisa,+1632,+South+Africa&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-[320px] w-full border-0 md:h-[420px]" />
            <p className="px-4 py-3 text-xs text-gray-500">Use Google Maps for live navigation and current travel directions.</p>
          </div>
        </div>
      </section>

      <section id="faq" className="max-w-4xl mx-auto px-6 py-16 border-t border-gray-900 scroll-mt-24">
        <h2 className="text-2xl md:text-3xl font-bold text-sigaYellow mb-8">FAQ</h2>
        <dl className="space-y-6">
          {faqs.map((item) => (
            <div key={item.q}>
              <dt className="text-lg font-semibold text-white mb-2">{item.q}</dt>
              <dd className="text-gray-300 leading-relaxed">{item.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
