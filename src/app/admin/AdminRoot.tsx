"use client";

import { type ReactNode } from "react";
import { AdminSessionProvider } from "./adminSession";
import AdminChrome from "./AdminChrome";

export default function AdminRoot({ children }: { children: ReactNode }) {
  return (
    <AdminSessionProvider>
      <AdminChrome>{children}</AdminChrome>
    </AdminSessionProvider>
  );
}
