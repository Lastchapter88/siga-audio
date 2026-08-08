"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackVisit } from "@/lib/analytics";

/** Records public page visits for the admin activity panel. */
export default function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    void trackVisit(pathname);
  }, [pathname]);

  return null;
}
