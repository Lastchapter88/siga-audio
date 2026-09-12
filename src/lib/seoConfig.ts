/** Central SEO constants — update siteUrl when the primary domain changes. */
export const SEO = {
  siteUrl: "https://sigaaudio.co.za",
  siteName: "SIGA Audio SA",
  title: "SIGA Audio SA | Car Sound Installation & Accessories in Tembisa",
  description:
    "Professional car audio installation in Tembisa — touchscreen radios, speakers, amps & subwoofers. Rated 4.9★ from 87 reviews. Call 068 282 4322.",
  ogImage: "/combos/sigaposter.jpg",
  locale: "en_ZA",
  phone: "0682824322",
  phoneDisplay: "068 282 4322",
  phoneAlt: "0751859106",
  whatsapp: "27682824322",
  businessLegalName: "SIGA AUDIO PTY LTD",
  businessName: "SIGA AUDIO SA",
  tagline: "We Will Not Kill Your Pockets But Your Ears",
  email: "sigastreetaudio@gmail.com",
  address: {
    street: "7441 Flint Mazibuko St",
    locality: "Tembisa",
    postalCode: "1632",
    region: "Gauteng",
    country: "South Africa",
    countryCode: "ZA",
  },
  geo: {
    latitude: -25.9969,
    longitude: 28.2294,
  },
  serviceAreas: ["Tembisa", "Kempton Park", "Midrand", "Johannesburg East"],
  serviceArea: "Tembisa, Gauteng",
  serviceCities: "Tembisa, Kempton Park, Midrand, and Johannesburg East",
  openingHours: {
    weekdays: { opens: "09:00", closes: "17:00", label: "Mon–Fri: 9:00 AM – 5:00 PM" },
    saturday: { opens: "09:00", closes: "15:00", label: "Sat: 9:00 AM – 3:00 PM" },
    sunday: { label: "Sun: Closed" },
  },
  googleRating: {
    value: 4.9,
    count: 87,
  },
  googleMapsUrl:
    "https://www.google.com/maps/search/?api=1&query=7441+Flint+Mazibuko+St,+Tembisa,+1632",
} as const;

export function absoluteUrl(path: string): string {
  const base = SEO.siteUrl.replace(/\/$/, "");
  return path.startsWith("http") ? path : `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function formatAddress(): string {
  const { street, locality, postalCode, region, country } = SEO.address;
  return `${street}, ${locality}, ${postalCode}, ${region}, ${country}`;
}

export function formatHoursList(): string[] {
  return [SEO.openingHours.weekdays.label, SEO.openingHours.saturday.label, SEO.openingHours.sunday.label];
}
