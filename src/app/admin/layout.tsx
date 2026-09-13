import type { Metadata } from "next";
import { type ReactNode } from "react";
import AdminRoot from "./AdminRoot";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminRoot>{children}</AdminRoot>;
}
