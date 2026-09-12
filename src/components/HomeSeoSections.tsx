import Link from "next/link";
import { SEO, formatAddress, formatHoursList } from "@/lib/seoConfig";

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

      <section id="visit-us" className="max-w-4xl mx-auto px-6 py-16 border-t border-gray-900 scroll-mt-24">
        <h2 className="text-2xl md:text-3xl font-bold text-sigaYellow mb-4">Visit Us / Contact</h2>
        <p className="text-gray-300 leading-relaxed mb-6">
          Drop in during opening hours or book an installation slot online. We are easy to find in Tembisa on Flint
          Mazibuko Street.
        </p>
        <ul className="space-y-3 text-gray-300">
          <li>
            <strong className="text-white">Address:</strong> {formatAddress()}
          </li>
          <li>
            <strong className="text-white">Phone / WhatsApp:</strong>{" "}
            <a href={`tel:+27${SEO.phone.slice(1)}`} className="text-sigaYellow hover:text-yellow-300">
              {SEO.phoneDisplay}
            </a>
          </li>
          <li>
            <strong className="text-white">Email:</strong>{" "}
            <a href={`mailto:${SEO.email}`} className="text-sigaYellow hover:text-yellow-300">
              {SEO.email}
            </a>
          </li>
          <li>
            <strong className="text-white">Hours:</strong>
            <ul className="mt-1 ml-4 space-y-1">
              {hours.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </li>
          <li>
            <strong className="text-white">Directions:</strong>{" "}
            <a
              href={SEO.googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sigaYellow hover:text-yellow-300"
            >
              Open in Google Maps →
            </a>
          </li>
        </ul>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/book"
            className="bg-sigaYellow text-black px-6 py-3 rounded-xl font-bold hover:bg-yellow-300 transition"
          >
            Book Installation
          </Link>
          <a
            href={`https://wa.me/${SEO.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="border border-sigaYellow text-sigaYellow px-6 py-3 rounded-xl font-semibold hover:bg-sigaYellow/10 transition"
          >
            WhatsApp Us
          </a>
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
