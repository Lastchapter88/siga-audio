import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { combos } from "@/data/combos";
import { SEO } from "@/lib/seoConfig";
import ComboDetailsClient from "./ComboDetailsClient";

export function generateStaticParams() {
  return combos.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const combo = combos.find((c) => c.slug === params.slug);
  if (!combo) return { title: "Package Not Found" };

  return {
    title: combo.name,
    description: `${combo.description} From R${combo.price.toLocaleString("en-ZA")}. Book installation with SIGA Audio SA.`,
    alternates: { canonical: `${SEO.siteUrl}/combo/${combo.slug}` },
  };
}

export default function ComboPage({ params }: { params: { slug: string } }) {
  const combo = combos.find((c) => c.slug === params.slug);
  if (!combo) notFound();

  return (
    <>
      <article className="sr-only">
        <h1>{combo.name}</h1>
        <p>{combo.tagline ?? ""}</p>
        <p>{combo.description}</p>
        <ul>
          {combo.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
        <p>Price from R{combo.price.toLocaleString("en-ZA")}</p>
      </article>
      <ComboDetailsClient slug={params.slug} />
    </>
  );
}
