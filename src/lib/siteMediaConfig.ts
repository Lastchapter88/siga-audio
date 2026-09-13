export type SiteMediaSlotMeta = {
  slot: string;
  label: string;
  description?: string;
};

export const SITE_MEDIA_SLOTS: SiteMediaSlotMeta[] = [
  {
    slot: "air-basic",
    label: "Air Suspension — Basic Kit",
    description: "Entry-level air suspension setup for comfort and cleaner daily driving.",
  },
  {
    slot: "air-advanced",
    label: "Air Suspension — Advanced Kit",
    description: "Improved ride control, better response, and more durable components.",
  },
  {
    slot: "air-show",
    label: "Air Suspension — Show Build",
    description: "Premium stance-focused setup for maximum visual impact and flexibility.",
  },
];

export const DEFAULT_SITE_IMAGES: Record<string, string> = {
  "air-basic": "/combos/suspension air.png",
  "air-advanced": "/combos/images.jfif",
  "air-show": "/combos/suspension air.png",
};

/** All air-suspension showcase photos in `public/combos/`. */
export const AIR_SUSPENSION_GALLERY: { src: string; alt: string }[] = [
  {
    src: "/combos/suspension air.png",
    alt: "Car on air suspension — slammed stance install by SIGA Audio",
  },
  {
    src: "/combos/images.jfif",
    alt: "Polo on air suspension — lowered ride height by SIGA Audio",
  },
];
