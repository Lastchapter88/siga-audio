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

  const title = `${combo.name} | Car Sound Package & Installation`;
  const description = `${combo.description} From R${combo.price.toLocaleString("en-ZA")}. Book installation with SIGA Audio in Tembisa, Gauteng.`;

  return {
    title,
    description,
    alternates: { canonical: `${SEO.siteUrl}/combo/${combo.slug}` },
    openGraph: {
      type: "website",
      url: `${SEO.siteUrl}/combo/${combo.slug}`,
      title,
      description,
      images: [{ url: `${SEO.siteUrl}${combo.image}`, alt: `${combo.name} from SIGA Audio` }],
    },
  };
}

export default function ComboPage({ params }: { params: { slug: string } }) {
  const combo = combos.find((c) => c.slug === params.slug);
  if (!combo) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: combo.name,
            description: combo.description,
            image: [SEO.siteUrl + combo.image],
            brand: { "@type": "Brand", name: SEO.businessName },
            offers: {
              "@type": "Offer",
              url: `${SEO.siteUrl}/combo/${combo.slug}`,
              priceCurrency: "ZAR",
              price: combo.price.toFixed(2),
              availability: "https://schema.org/InStock",
              seller: { "@type": "LocalBusiness", name: SEO.businessName },
            },
          }),
        }}
      />
      <ComboDetailsClient slug={params.slug} />
    </>
  );
}
