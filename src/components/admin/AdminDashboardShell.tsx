"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { business } from "@/lib/businessConfig";
import { adminPageTitle, adminViewKeyFromPathname } from "@/app/admin/adminViews";

const NAV = [
  { href: "/admin/dashboard" as const, key: "bookings" as const, label: "Bookings" },
  { href: "/admin/activity" as const, key: "activity" as const, label: "Activity" },
  { href: "/admin/content" as const, key: "content" as const, label: "Homepage" },
  { href: "/admin/combos" as const, key: "combos" as const, label: "Combos" },
  { href: "/admin/media" as const, key: "media" as const, label: "Site media" },
];

type Props = {
  children: ReactNode;
  isModerator: boolean;
};

export default function AdminDashboardShell({ children, isModerator }: Props) {
  const pathname = usePathname();
  const title = adminPageTitle(pathname);
  const viewKey = adminViewKeyFromPathname(pathname);

  async function handleSignOut() {
    try {
      await signOut(auth);
      window.location.href = "/admin/login";
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="h-[100dvh] flex flex-col md:flex-row bg-black text-white overflow-hidden">
      <aside className="flex-shrink-0 w-full md:w-56 border-b md:border-b-0 md:border-r border-gray-800 bg-[#0a0a0a] flex flex-col">
        <div className="p-3 border-b border-gray-800/80 md:border-b-0">
          <Link href="/admin/dashboard" className="block text-sigaYellow font-bold tracking-wide">
            {business.name}
            <span className="text-gray-500 font-normal text-xs ml-2">Admin</span>
          </Link>
        </div>
        <nav className="flex md:flex-col gap-1 p-2 overflow-x-auto md:overflow-visible">
          {NAV.map((item) => {
            if ((item.key === "combos" || item.key === "media" || item.key === "content") && isModerator) return null;
            const active = viewKey === item.key;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap px-3 py-2 rounded-lg text-sm font-medium transition ${
                  active
                    ? "bg-sigaYellow/15 text-sigaYellow border border-sigaYellow/40"
                    : "text-gray-400 hover:text-white border border-transparent"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden md:flex flex-col gap-2 p-3 mt-auto border-t border-gray-800">
          <Link href="/" className="text-xs text-gray-500 hover:text-gray-300 transition">
            View site
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="text-left text-xs font-semibold text-red-400 hover:text-red-300 border border-red-500/40 rounded-lg px-3 py-2"
          >
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-0 min-w-0">
        <header className="flex-shrink-0 border-b border-gray-800 px-4 py-3 flex items-center justify-between gap-4 bg-[#0a0a0a]/90">
          <h1 className="text-lg font-bold text-white truncate">{title}</h1>
          <div className="flex md:hidden items-center gap-2 shrink-0">
            <Link href="/" className="text-xs text-gray-500 hover:text-gray-300">
              Site
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="text-xs font-semibold text-red-400 border border-red-500/40 rounded-lg px-2 py-1"
            >
              Out
            </button>
          </div>
        </header>
        <main className="flex-1 min-h-0 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
