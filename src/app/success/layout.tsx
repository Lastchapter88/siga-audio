import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Booking Received",
  robots: { index: false, follow: false },
};

export default function SuccessLayout({ children }: { children: ReactNode }) {
  return children;
}
