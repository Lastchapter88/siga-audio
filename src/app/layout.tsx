import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { ReactNode } from "react";
import { SEO, absoluteUrl } from "@/lib/seoConfig";
import { CustomerSessionProvider } from "@/components/CustomerSessionProvider";
import VisitTracker from "@/components/VisitTracker";
import Footer from "@/components/Footer";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FFD400",
};

export const metadata: Metadata = {
  metadataBase: new URL(SEO.siteUrl),
  title: {
    default: SEO.title,
    template: `%s | ${SEO.siteName}`,
  },
  description: SEO.description,
  applicationName: SEO.siteName,
  alternates: {
    canonical: SEO.siteUrl,
  },
  openGraph: {
    type: "website",
    locale: SEO.locale,
    url: SEO.siteUrl,
    siteName: SEO.siteName,
    title: SEO.title,
    description: SEO.description,
    images: [
      {
        url: absoluteUrl(SEO.ogImage),
        width: 1200,
        height: 630,
        alt: `${SEO.businessName} — car sound installation in Tembisa`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SEO.title,
    description: SEO.description,
    images: [absoluteUrl(SEO.ogImage)],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground min-h-screen">
        <CustomerSessionProvider>
          <VisitTracker />
          {children}
          <Footer />
        </CustomerSessionProvider>
      </body>
    </html>
  );
}
