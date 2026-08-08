export type ComboCategory = "budget" | "loud" | "premium" | "vehicle";

export type Combo = {
  id: string;
  slug: string;
  name: string;
  price: number;
  tagline?: string;
  description: string;
  features: string[];
  category: ComboCategory;
  vehicleModel?: string;
  image: string;
};

/**
 * Hero images: place files in `public/combos/` using the filenames below (see README there).
 */
export const combos: Combo[] = [
  {
    id: "entry",
    slug: "entry-level",
    name: "Entry Level Combo",
    price: 3500,
    tagline: "Affordable bass upgrade",
    description: "Perfect starter system for clean bass and better overall sound on a tight budget.",
    features: ["Subwoofer", "Amplifier", "Wiring kit", "Speaker box", "Midrange speakers", "Free installation"],
    category: "budget",
    image: "/combos/entry.jpg"
  },
  {
    id: "happy",
    slug: "happy-people",
    name: "Happy People Combo",
    price: 5000,
    tagline: "R4500 to R5000 value package",
    description: "Balanced system with loud mids and strong bass, built for daily play and clear sound.",
    features: ["2x midrange speakers", "1x subwoofer", "Amplifier", "Tweeters", "Wiring kit", "Box"],
    category: "loud",
    image: "/combos/happy.jpg"
  },
  {
    id: "stance",
    slug: "stance-combo",
    name: "Stance Combo",
    price: 7500,
    tagline: "Mid-tier loud setup",
    description: "Mid-tier package for bigger cabin presence and stronger, cleaner output.",
    features: ["4x midrange speakers", "Tweeters", "Equalizer", "Amplifier", "Subwoofer", "Box"],
    category: "loud",
    image: "/combos/stance.jpg"
  },
  {
    id: "crazy",
    slug: "crazy-combo",
    name: "Crazy Combo",
    price: 9999,
    tagline: "High-tier competition style",
    description: "High-tier package with multiple components for maximum loudness and control.",
    features: ["Multiple midrange speakers", "Bullet tweeters", "Amplifiers", "Subwoofers", "Equalizer", "Box"],
    category: "premium",
    image: "/combos/crazy.jpg"
  },
  {
    id: "targa-killer",
    slug: "targa-killer",
    name: "Targa Killer Combo",
    price: 9500,
    tagline: "Open-air presence, serious output",
    description:
      "Built for drop-top and targa-style driving: loud, clean staging with bass that still hits when the roof comes off.",
    features: [
      "Weather-conscious install options",
      "Strong midrange and tweeter stage",
      "Subwoofer and matched amplifier",
      "Wiring kit",
      "Box or enclosure",
      "Professional tuning"
    ],
    category: "premium",
    image: "/targer-killer.jpg"
  },
  {
    id: "party",
    slug: "party-combo",
    name: "Party Combo",
    price: 6999,
    tagline: "Turn your car into a party",
    description: "High energy system designed for outdoor vibes and street presence.",
    features: ["Strong sub setup", "Loud door speakers", "Tuned amplifier", "EQ optimisation", "Free installation"],
    category: "loud",
    image: "/combos/party.jpg"
  },
  {
    id: "polo-vivo",
    slug: "polo-vivo",
    name: "Polo Vivo Combo",
    price: 8800,
    tagline: "Vehicle specific Polo Vivo package",
    description: "Complete Polo Vivo package with head unit, mids, bass, and clean finishing.",
    features: ["Head unit", "Mid speakers", "Subwoofer", "Amplifier", "Box"],
    category: "vehicle",
    vehicleModel: "Polo Vivo",
    image: "/combos/polo-vivo.jpg"
  },
  {
    id: "vitz",
    slug: "toyota-vitz-combo",
    name: "Toyota Vitz Combo",
    price: 6500,
    tagline: "Vehicle package for Toyota Vitz",
    description: "Toyota Vitz-focused setup tuned for balanced bass, mids, and day-to-day listening.",
    features: ["Subwoofer", "Amplifier", "Mid speakers", "Wiring kit", "Box"],
    category: "vehicle",
    vehicleModel: "Toyota Vitz",
    image: "/combos/vitz.jpg"
  },
  {
    id: "dzire",
    slug: "suzuki-dzire-combo",
    name: "Suzuki Dzire Combo",
    price: 5500,
    tagline: "Value package for Suzuki Dzire",
    description: "Affordable Dzire package delivering clear mids and strong low-end response.",
    features: ["Subwoofer", "Amplifier", "Mid speakers", "Tweeters", "Wiring kit"],
    category: "vehicle",
    vehicleModel: "Suzuki Dzire",
    image: "/combos/dzire.jpg"
  },
  {
    id: "ertiga",
    slug: "ertiga-combo",
    name: "Ertiga Combo",
    price: 11999,
    tagline: "Full premium family-vehicle setup",
    description: "Premium Ertiga package with strong stage, deep bass, and robust amplification.",
    features: ["Head unit", "Midrange speakers", "Subwoofer", "Amplifier", "Equalizer", "Box"],
    category: "vehicle",
    vehicleModel: "Ertiga",
    image: "/combos/ertiga.jpg"
  },
  {
    id: "bakkie",
    slug: "bakkie-combo",
    name: "Bakkie Combo",
    price: 4800,
    tagline: "Compact setup for utility vehicles",
    description: "Compact bakkie-focused system designed for practical installs and tight spaces.",
    features: ["Slim subwoofer", "Amplifier", "Speakers"],
    category: "vehicle",
    vehicleModel: "Bakkie",
    image: "/combos/bakkie.jpg"
  }
];
