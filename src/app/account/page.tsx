import type { Metadata } from "next";
import { Suspense } from "react";
import AccountClient from "./AccountClient";

export const metadata: Metadata = {
  title: "Customer Account",
  description: "Sign in to manage your SIGA Audio booking account.",
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-black text-white flex items-center justify-center">
          <p className="text-gray-400 text-sm">Loading…</p>
        </main>
      }
    >
      <AccountClient />
    </Suspense>
  );
}
