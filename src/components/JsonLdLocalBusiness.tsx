import { SEO, absoluteUrl, formatAddress } from "@/lib/seoConfig";

const services = [
  "Touchscreen and Android head unit installation",
  "Speaker and tweeter upgrades",
  "Amplifier and monoblock installation",
  "Subwoofer and enclosure fitting",
  "Car alarms and accessories",
  "Fault finding and audio repairs",
  "Bumper sensor installation",
  "Air suspension",
];

export default function JsonLdLocalBusiness() {
  const { address, geo, openingHours, googleRating } = SEO;

  const schema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "AutoPartsStore"],
    name: SEO.businessName,
    legalName: SEO.businessLegalName,
    url: SEO.siteUrl,
    logo: absoluteUrl("/apple-touch-icon.png"),
    image: absoluteUrl(SEO.ogImage),
    description: SEO.description,
    telephone: `+27-${SEO.phone.slice(1)}`,
    email: SEO.email,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: address.street,
      addressLocality: address.locality,
      postalCode: address.postalCode,
      addressRegion: address.region,
      addressCountry: address.countryCode,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: geo.latitude,
      longitude: geo.longitude,
    },
    areaServed: SEO.serviceAreas.map((name) => ({
      "@type": "City",
      name,
      containedInPlace: { "@type": "State", name: "Gauteng" },
    })),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: openingHours.weekdays.opens,
        closes: openingHours.weekdays.closes,
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: openingHours.saturday.opens,
        closes: openingHours.saturday.closes,
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: googleRating.value,
      reviewCount: googleRating.count,
      bestRating: 5,
      worstRating: 1,
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Car sound and accessories",
      itemListElement: services.map((name) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name, areaServed: formatAddress() },
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
