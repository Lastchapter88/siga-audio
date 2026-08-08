import type { Metadata } from "next";
import "@/styles/globals.css";
import { ReactNode } from "react";
import { business } from "@/lib/businessConfig";
import { CustomerSessionProvider } from "@/components/CustomerSessionProvider";
import VisitTracker from "@/components/VisitTracker";

export const metadata: Metadata = {
  title: `${business.name} | Premium Car Sound`,
  description: `Premium car sound installations and booking platform for ${business.name}.`,
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "48x48" },
    ],
    apple: "/icon.svg",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground min-h-screen">
        <CustomerSessionProvider>
          <VisitTracker />
          {children}
        </CustomerSessionProvider>
      </body>
    </html>
  );
}
