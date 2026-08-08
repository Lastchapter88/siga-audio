"use client";

import { type ReactNode } from "react";
import { usePathname } from "next/navigation";
import AdminDashboardShell from "@/components/admin/AdminDashboardShell";
import { useAdminSession } from "./adminSession";

export default function AdminChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideShell = pathname === "/admin/login";
  const { isModerator } = useAdminSession();

  if (hideShell) {
    return <div className="min-h-screen bg-black text-white">{children}</div>;
  }

  return <AdminDashboardShell isModerator={isModerator}>{children}</AdminDashboardShell>;
}
