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
    items: ServiceCard[];
  };
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
    title: "More Services",
    items: [
      {
        id: "sound",
        title: "Sound Systems",
        body: "Powerful bass, clean installs, and combo options for every budget.",
        href: "/combos",
        ctaLabel: "View Combos →",
      },
      {
        id: "air",
        title: "Air Suspension",
        body: "Ride height control for comfort, style, and better underbody protection.",
        href: "/air-suspension",
        ctaLabel: "Explore Suspension →",
      },
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
  bankName: "Ask on WhatsApp for bank name",
  accountName: "SIGA AUDIO SA",
  accountNumber: "",
  branchCode: "",
  referenceHint: "Use your phone number as the payment reference",
};

export function mergeHomeContent(partial?: Partial<HomePageContent> | null): HomePageContent {
  const d = DEFAULT_HOME_CONTENT;
  if (!partial) return structuredClone(d);
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
      items:
        partial.moreServices?.items && partial.moreServices.items.length > 0
          ? partial.moreServices.items
          : d.moreServices.items,
    },
    customSections: Array.isArray(partial.customSections) ? partial.customSections : [],
  };
}

export function mergeSiteSettings(partial?: Partial<SiteSettings> | null): SiteSettings {
  return { ...DEFAULT_SITE_SETTINGS, ...(partial ?? {}) };
}

/** Keep TypeScript happy for catalog references in CMS tooling. */
export type CatalogComboRef = Pick<Combo, "slug" | "name">;
