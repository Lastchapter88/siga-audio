"use client";

import Link from "next/link";
import Image from "next/image";
import { combos as prebuiltCombos } from "@/data/combos";
import PopularPackagesSection from "@/components/PopularPackagesSection";
import Navbar from "@/components/Navbar";
import { useHomeContent } from "@/lib/pageContent";

export default function HomePageContent() {
  const { content } = useHomeContent();
  const enabledCustom = content.customSections.filter((s) => s.enabled);

  return (
    <main className="bg-background text-white min-h-screen">
      <Navbar />

      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden px-6">
        {content.hero.backgroundImageUrl ? (
          <Image
            src={content.hero.backgroundImageUrl}
            alt=""
            fill
            priority
            className="object-cover opacity-40"
          />
        ) : (
          <>
            <div className="absolute w-[600px] h-[600px] bg-sigaYellow blur-[180px] opacity-20" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#1a1a1a_0,_#050507_55%,_#000000_100%)]" />
          </>
        )}
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 text-center max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-extrabold text-sigaYellow drop-shadow-xl">
            {content.hero.headline}
          </h1>
          <p className="mt-4 text-gray-300 text-lg">{content.hero.subhead}</p>

          {content.hero.videoUrl ? (
            <div className="mt-6 mx-auto max-w-xl rounded-2xl overflow-hidden border border-gray-800">
              <video src={content.hero.videoUrl} controls playsInline className="w-full max-h-64" />
            </div>
          ) : null}

          <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
            <Link
              href={content.hero.primaryCta.href || "/combos"}
              className="bg-sigaYellow text-black px-8 py-4 rounded-xl font-bold hover:scale-[1.03] transition hover:bg-yellow-300 inline-flex items-center justify-center"
            >
              {content.hero.primaryCta.label || "View Packages"}
            </Link>
            <Link
              href="/account?mode=signup&next=/book"
              className="border border-sigaYellow text-sigaYellow px-8 py-4 rounded-xl font-semibold hover:bg-sigaYellow/10 transition inline-flex items-center justify-center"
            >
              Sign up to Book
            </Link>
            <Link
              href={content.hero.secondaryCta.href || "/book"}
              className="border border-gray-700 text-gray-200 px-8 py-4 rounded-xl font-semibold hover:border-sigaYellow hover:text-white transition inline-flex items-center justify-center"
            >
              {content.hero.secondaryCta.label || "Book Now"}
            </Link>
          </div>
        </div>
      </section>

      <PopularPackagesSection
        initialCombos={prebuiltCombos}
        title={content.packages.title}
        subtitle={content.packages.subtitle}
      />

      <section className="bg-[#0f0f0f] py-16 text-center">
        <h2 className="text-3xl font-bold mb-10">{content.howItWorks.title}</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto px-6">
          {content.howItWorks.steps.map((step, index) => (
            <div key={`${step.title}-${index}`} className="bg-[#0b0b0d] border border-gray-800 rounded-2xl p-6">
              <h3 className="text-sigaYellow text-3xl font-bold">{index + 1}</h3>
              <p className="mt-2 text-gray-200 font-semibold">{step.title}</p>
              {step.body ? <p className="mt-2 text-sm text-gray-400">{step.body}</p> : null}
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-8">{content.moreServices.title}</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {content.moreServices.items.map((item) => (
            <article
              key={item.id}
              className="bg-[#111] border border-gray-800 rounded-2xl overflow-hidden hover:border-sigaYellow/70 transition"
            >
              {item.imageUrl ? (
                <div className="relative h-40 w-full bg-black/40">
                  <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                </div>
              ) : null}
              {item.videoUrl ? (
                <div className="px-5 pt-4">
                  <video src={item.videoUrl} controls className="w-full rounded-lg max-h-48" />
                </div>
              ) : null}
              <div className="p-6">
                <h3 className="text-2xl font-bold">{item.title}</h3>
                <p className="text-gray-400 text-sm mt-3">{item.body}</p>
                <Link
                  href={item.href || "#"}
                  className="inline-flex mt-6 text-sigaYellow font-semibold hover:text-yellow-300 transition"
                >
                  {item.ctaLabel || "Learn more →"}
                </Link>
              </div>
            </article>
          ))}
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
                  <Image src={section.imageUrl} alt={section.title} fill className="object-cover" />
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
