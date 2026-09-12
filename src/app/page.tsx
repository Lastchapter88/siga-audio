import type { Metadata } from "next";
import HomePageContent from "@/components/HomePageContent";
import HomeSeoSections from "@/components/HomeSeoSections";
import JsonLdLocalBusiness from "@/components/JsonLdLocalBusiness";
import { SEO } from "@/lib/seoConfig";

export const metadata: Metadata = {
  title: SEO.title,
  description: SEO.description,
  alternates: { canonical: SEO.siteUrl },
};

export default function Home() {
  return (
    <>
      <JsonLdLocalBusiness />
      <HomePageContent />
      <HomeSeoSections />
    </>
  );
}
