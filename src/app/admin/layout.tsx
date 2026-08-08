import { type ReactNode } from "react";
import AdminRoot from "./AdminRoot";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminRoot>{children}</AdminRoot>;
}
