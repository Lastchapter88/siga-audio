import type { Combo } from "@/data/combos";

export type CtaLink = {
  label: string;
  href: string;
};

export type HomeHeroContent = {
  headline: string;
  subhead: string;
  primaryCta: CtaLink;
  secondaryCta: CtaLink;
  backgroundImageUrl?: string;
  videoUrl?: string;
};

export type HowItWorksStep = {
  title: string;
  body?: string;
};

export type ServiceCard = {
  id: string;
  title: string;
  body: string;
  href: string;
  ctaLabel: string;
  imageUrl?: string;
  videoUrl?: string;
};

export type CustomSection = {
  id: string;
  title: string;
  body: string;
  imageUrl?: string;
  videoUrl?: string;
  ctaLabel?: string;
  ctaHref?: string;
  enabled: boolean;
};

export type TermsAndConditions = {
  title: string;
  items: string[];
  posterImageUrl?: string;
};

export type HomePageContent = {
  hero: HomeHeroContent;
  packages: {
    title: string;
    subtitle: string;
  };
  howItWorks: {
    title: string;
    steps: HowItWorksStep[];
  };
  moreServices: {
    title: string;
    subtitle?: string;
    items: ServiceCard[];
  };
  termsAndConditions: TermsAndConditions;
  customSections: CustomSection[];
};

export type SiteSettings = {
  businessName: string;
  tagline: string;
  phone: string;
  logoUrl?: string;
  whatsappCtaLabel: string;
  depositLabel: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  branchCode: string;
  referenceHint: string;
};

export const DEFAULT_HOME_CONTENT: HomePageContent = {
  hero: {
    headline: "FEEL THE BASS",
    subhead: "Premium Car Sound Installations",
    primaryCta: { label: "View Packages", href: "/combos" },
    secondaryCta: { label: "Book Now", href: "/book" },
  },
  packages: {
    title: "Popular Packages",
    subtitle: "Three clean systems for every style. Click a combo to view details and book your install.",
  },
  howItWorks: {
    title: "Easy 3 Step Booking",
    steps: [
      { title: "Your Details", body: "Tell us about you and your car." },
      { title: "Select Date & Time", body: "Pick an installation slot that works." },
      { title: "Upload Proof", body: "Send proof of payment and confirm." },
    ],
  },
  moreServices: {
    title: "Services We Offer",
    subtitle: "Car sound supplies · Installations · Auto styling",
    items: [
      {
        id: "fault-finding",
        title: "Fault Finding",
        body: "Diagnose and repair car audio problems — wiring, head units, amps, and speakers.",
        href: "/book",
        ctaLabel: "Book a visit →",
      },
      {
        id: "installations",
        title: "Installations",
        body: "Professional car sound installs, from entry-level systems to full custom builds.",
        href: "/combos",
        ctaLabel: "View packages →",
      },
      {
        id: "sales",
        title: "Sales",
        body: "Car sound supplies and equipment — radios, amps, speakers, subwoofers, and more.",
        href: "https://wa.me/27682824322",
        ctaLabel: "Enquire on WhatsApp →",
      },
      {
        id: "bumper-sensors",
        title: "Bumper Sensors",
        body: "Parking and bumper sensor installation for safer reversing and parking.",
        href: "/book",
        ctaLabel: "Book installation →",
      },
      {
        id: "air",
        title: "Air Suspension",
        body: "Ride height control for comfort, style, and better underbody protection.",
        href: "/air-suspension",
        ctaLabel: "Explore suspension →",
      },
    ],
  },
  termsAndConditions: {
    title: "Terms & Conditions",
    posterImageUrl: "/combos/sigaposter.jpg",
    items: [
      "No guarantee or warranty on tweeters, speakers & subwoofers.",
      "Do not leave the premises without proof of payment.",
      "No cash refund.",
      "Repairs take 2–3 weeks.",
      "Only radios, amplifiers, equalizers, crossovers & monoblocks carry a 6-month warranty repair.",
    ],
  },
  customSections: [],
};

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  businessName: "SIGA AUDIO SA",
  tagline: "Sound Installations",
  phone: "0682824322",
  whatsappCtaLabel: "WhatsApp Booking",
  depositLabel: "R500 deposit (EFT)",
  bankName: "Standard Bank",
  accountName: "SIGA AUDIO PTY LTD",
  accountNumber: "10264653678",
  branchCode: "",
  referenceHint: "Use your phone number as the payment reference",
};

export function mergeHomeContent(partial?: Partial<HomePageContent> | null): HomePageContent {
  const d = DEFAULT_HOME_CONTENT;
  if (!partial) return structuredClone(d);

  const legacyServices =
    partial.moreServices?.items?.length === 2 &&
    partial.moreServices.items.every((item) => item.id === "sound" || item.id === "air");

  return {
    hero: { ...d.hero, ...(partial.hero ?? {}), primaryCta: { ...d.hero.primaryCta, ...(partial.hero?.primaryCta ?? {}) }, secondaryCta: { ...d.hero.secondaryCta, ...(partial.hero?.secondaryCta ?? {}) } },
    packages: { ...d.packages, ...(partial.packages ?? {}) },
    howItWorks: {
      title: partial.howItWorks?.title ?? d.howItWorks.title,
      steps:
        partial.howItWorks?.steps && partial.howItWorks.steps.length > 0
          ? partial.howItWorks.steps
          : d.howItWorks.steps,
    },
    moreServices: {
      title: partial.moreServices?.title ?? d.moreServices.title,
      subtitle: partial.moreServices?.subtitle ?? d.moreServices.subtitle,
      items: legacyServices
        ? d.moreServices.items
        : partial.moreServices?.items && partial.moreServices.items.length > 0
          ? partial.moreServices.items
          : d.moreServices.items,
    },
    termsAndConditions: {
      title: partial.termsAndConditions?.title ?? d.termsAndConditions.title,
      posterImageUrl: partial.termsAndConditions?.posterImageUrl ?? d.termsAndConditions.posterImageUrl,
      items:
        partial.termsAndConditions?.items && partial.termsAndConditions.items.length > 0
          ? partial.termsAndConditions.items
          : d.termsAndConditions.items,
    },
    customSections: Array.isArray(partial.customSections) ? partial.customSections : [],
  };
}

export function mergeSiteSettings(partial?: Partial<SiteSettings> | null): SiteSettings {
  const d = DEFAULT_SITE_SETTINGS;
  if (!partial) return { ...d };

  const merged = { ...d, ...partial };
  const legacyBankHint =
    !merged.bankName?.trim() ||
    merged.bankName === "Ask on WhatsApp for bank name" ||
    merged.bankName === "Please ask on WhatsApp for banking details" ||
    merged.bankName === "10264653678";

  if (!merged.accountNumber?.trim() || merged.accountNumber === merged.bankName) {
    merged.accountNumber = d.accountNumber;
  }
  if (!merged.accountName?.trim() || merged.accountName === "SIGA AUDIO SA") {
    merged.accountName = d.accountName;
  }
  if (legacyBankHint) merged.bankName = d.bankName;

  return merged;
}

/** Keep TypeScript happy for catalog references in CMS tooling. */
export type CatalogComboRef = Pick<Combo, "slug" | "name">;
