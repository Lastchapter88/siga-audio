"use client";

import Link from "next/link";
import Image from "next/image";
import { combos as prebuiltCombos } from "@/data/combos";
import PopularPackagesSection from "@/components/PopularPackagesSection";
import Navbar from "@/components/Navbar";
import { useHomeContent } from "@/lib/pageContent";
import { ArrowRight, CarFront, Check, MapPin } from "lucide-react";

export default function HomePageContent() {
  const { content } = useHomeContent();
  const enabledCustom = content.customSections.filter((s) => s.enabled);

  return (
    <main className="bg-background text-white min-h-screen">
      <Navbar />

      <section className="relative flex min-h-[calc(100svh-64px)] items-center overflow-hidden px-5 py-20 md:px-10">
        {content.hero.backgroundImageUrl ? (
          <Image
            src={content.hero.backgroundImageUrl}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-40"
          />
        ) : (
          <>
            <div className="absolute w-[600px] h-[600px] bg-sigaYellow blur-[180px] opacity-20" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#1a1a1a_0,_#050507_55%,_#000000_100%)]" />
          </>
        )}
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <div className="max-w-3xl">
          <p className="eyebrow mb-5">Automotive audio / Tembisa, Gauteng</p>
          <h1 className="max-w-3xl text-5xl font-black leading-[0.96] tracking-[-0.06em] text-white md:text-8xl">
            {content.hero.headline}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-gray-300 md:text-lg">{content.hero.subhead}</p>

          {content.hero.videoUrl ? (
            <div className="mt-8 max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-black/40">
              <video src={content.hero.videoUrl} controls playsInline className="w-full max-h-64" />
            </div>
          ) : null}

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href={content.hero.primaryCta.href || "/combos"}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-sigaYellow px-6 py-3 font-bold text-black transition hover:bg-yellow-300"
            >
              {content.hero.primaryCta.label || "View Packages"}
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <Link
              href="/combos#vehicle-finder"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 px-6 py-3 font-semibold text-white transition hover:border-sigaYellow hover:text-sigaYellow"
            >
              <CarFront size={17} aria-hidden="true" /> Find my vehicle
            </Link>
          </div>
          <div className="mt-12 grid max-w-xl grid-cols-1 gap-4 border-t border-white/10 pt-5 text-sm text-gray-400 sm:grid-cols-3">
            <div className="flex items-center gap-2"><Check size={16} className="text-sigaYellow" aria-hidden="true" /> Real packages</div>
            <div className="flex items-center gap-2"><Check size={16} className="text-sigaYellow" aria-hidden="true" /> Installation included</div>
            <div className="flex items-center gap-2"><MapPin size={16} className="text-sigaYellow" aria-hidden="true" /> Tembisa workshop</div>
          </div>
          </div>
        </div>
      </section>

      <PopularPackagesSection
        initialCombos={prebuiltCombos}
        title={content.packages.title}
        subtitle={content.packages.subtitle}
      />

      <section className="bg-[#0f0f0f] py-16 text-center">
          <p className="eyebrow mb-3">From browsing to bass</p>
          <h2 className="text-3xl font-bold mb-10">{content.howItWorks.title}</h2>
        <div className="grid max-w-5xl gap-4 px-6 md:grid-cols-3">
          {content.howItWorks.steps.map((step, index) => (
            <div key={`${step.title}-${index}`} className="surface rounded-2xl p-6 text-left">
              <h3 className="text-sigaYellow text-3xl font-bold">0{index + 1}</h3>
              <p className="mt-2 text-gray-200 font-semibold">{step.title}</p>
              {step.body ? <p className="mt-2 text-sm text-gray-400">{step.body}</p> : null}
            </div>
          ))}
        </div>
      </section>

      <section id="services" className="max-w-6xl mx-auto px-6 py-16 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-bold">{content.moreServices.title}</h2>
          {content.moreServices.subtitle ? (
            <p className="text-sigaYellow mt-3 text-sm uppercase tracking-wide">{content.moreServices.subtitle}</p>
          ) : null}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.moreServices.items.map((item) => (
            <article
              key={item.id}
              className="bg-[#111] border border-gray-800 rounded-2xl overflow-hidden hover:border-sigaYellow/70 transition"
            >
              {item.imageUrl ? (
                <div className="relative h-40 w-full bg-black/40">
                  <Image src={item.imageUrl} alt={item.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" />
                </div>
              ) : null}
              {item.videoUrl ? (
                <div className="px-5 pt-4">
                  <video src={item.videoUrl} controls className="w-full rounded-lg max-h-48" />
                </div>
              ) : null}
              <div className="p-6">
                <h3 className="text-xl font-bold text-sigaYellow">{item.title}</h3>
                <p className="text-gray-400 text-sm mt-3">{item.body}</p>
                {item.href.startsWith("http") ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex mt-6 text-sigaYellow font-semibold hover:text-yellow-300 transition"
                  >
                    {item.ctaLabel || "Learn more →"}
                  </a>
                ) : (
                  <Link
                    href={item.href || "#"}
                    className="inline-flex mt-6 text-sigaYellow font-semibold hover:text-yellow-300 transition"
                  >
                    {item.ctaLabel || "Learn more →"}
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="terms" className="bg-[#0f0f0f] py-16 scroll-mt-24 border-t border-gray-900">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-3xl font-bold mb-6">{content.termsAndConditions.title}</h2>
            <ul className="space-y-4">
              {content.termsAndConditions.items.map((term, index) => (
                <li key={index} className="flex gap-3 text-gray-300">
                  <span className="text-sigaYellow font-bold shrink-0">•</span>
                  <span>{term}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm text-gray-500">
              By booking with SIGA AUDIO SA you agree to these terms. Payment proof is required before leaving the
              premises.
            </p>
          </div>
          {content.termsAndConditions.posterImageUrl ? (
            <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-gray-800 shadow-lg">
              <Image
                src={content.termsAndConditions.posterImageUrl}
                alt="SIGA AUDIO SA services and terms poster"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          ) : null}
        </div>
      </section>

      {enabledCustom.map((section) => (
        <section key={section.id} className="max-w-6xl mx-auto px-6 py-14 border-t border-gray-900">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold">{section.title}</h2>
              <p className="text-gray-400 mt-4 whitespace-pre-wrap">{section.body}</p>
              {section.ctaLabel && section.ctaHref ? (
                <Link
                  href={section.ctaHref}
                  className="inline-flex mt-6 bg-sigaYellow text-black px-6 py-3 rounded-xl font-bold hover:bg-yellow-300 transition"
                >
                  {section.ctaLabel}
                </Link>
              ) : null}
            </div>
            <div className="space-y-4">
              {section.imageUrl ? (
                <div className="relative h-56 w-full rounded-2xl overflow-hidden border border-gray-800">
                  <Image src={section.imageUrl} alt={section.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                </div>
              ) : null}
              {section.videoUrl ? (
                <video
                  src={section.videoUrl}
                  controls
                  className="w-full rounded-2xl border border-gray-800 max-h-72"
                />
              ) : null}
            </div>
          </div>
        </section>
      ))}
    </main>
  );
}
