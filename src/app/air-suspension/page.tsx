import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import AirSuspensionContent from "@/components/AirSuspensionContent";
import { SEO } from "@/lib/seoConfig";

export const metadata: Metadata = {
  title: "Air Suspension Installation",
  description:
    "Air suspension supply, installation and setup by SIGA Audio SA. Ride height control for comfort, stance and underbody protection across South Africa.",
  alternates: { canonical: `${SEO.siteUrl}/air-suspension` },
};

export default function AirSuspensionPage() {
  return (
    <main className="bg-background min-h-screen text-white">
      <Navbar />
      <AirSuspensionContent />
    </main>
  );
}
