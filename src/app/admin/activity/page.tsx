"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { subscribeSiteEvents, type SiteEvent } from "@/lib/analytics";
import { useAdminSession } from "@/app/admin/adminSession";
import { formatBookingCreatedAt } from "@/components/admin/adminDashboardUtils";

type Tab = "visits" | "signins";

export default function AdminActivityPage() {
  const { authReady, user, isAuthorizedAdmin } = useAdminSession();
  const [events, setEvents] = useState<SiteEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("visits");

  useEffect(() => {
    if (!authReady || !user || !isAuthorizedAdmin) {
      setLoading(false);
      setEvents([]);
      return;
    }

    setLoading(true);
    const unsub = subscribeSiteEvents((rows) => {
      setEvents(rows);
      setLoading(false);
    });
    return () => unsub();
  }, [authReady, user, isAuthorizedAdmin]);

  const visits = useMemo(() => events.filter((e) => e.type === "visit"), [events]);
  const signins = useMemo(() => events.filter((e) => e.type === "signin"), [events]);
  const rows = tab === "visits" ? visits : signins;

  if (!authReady) {
    return (
      <div className="p-6 md:p-8">
        <p className="text-gray-400 text-sm">Loading…</p>
      </div>
    );
  }

  if (!user || !isAuthorizedAdmin) {
    return (
      <div className="p-6 md:p-8 max-w-lg mx-auto text-center">
        <h2 className="text-2xl font-bold mb-2">Activity</h2>
        <p className="text-gray-400 text-sm mb-8">Admin access only. Guests and customers cannot view this data.</p>
        <Link href="/admin/login" className="inline-flex bg-sigaYellow text-black px-8 py-3 rounded-xl font-bold">
          Admin sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto pb-16">
      <p className="text-gray-400 text-sm mb-6">
        Website visits and account sign-ins. Only admin accounts can see this.
      </p>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          type="button"
          onClick={() => setTab("visits")}
          className={`text-left rounded-xl border p-4 transition ${
            tab === "visits" ? "border-sigaYellow/50 bg-sigaYellow/10" : "border-gray-800 bg-[#111]"
          }`}
        >
          <p className="text-xs text-gray-500">Page visits</p>
          <p className="text-2xl font-bold">{visits.length}</p>
        </button>
        <button
          type="button"
          onClick={() => setTab("signins")}
          className={`text-left rounded-xl border p-4 transition ${
            tab === "signins" ? "border-sigaYellow/50 bg-sigaYellow/10" : "border-gray-800 bg-[#111]"
          }`}
        >
          <p className="text-xs text-gray-500">Sign-ins</p>
          <p className="text-2xl font-bold">{signins.length}</p>
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400 text-sm">Loading activity…</p>
      ) : rows.length === 0 ? (
        <div className="bg-[#111] border border-gray-800 rounded-xl p-8 text-center text-gray-400 text-sm">
          No {tab === "visits" ? "visits" : "sign-ins"} recorded yet.
        </div>
      ) : (
        <div className="space-y-2">
          {rows.map((e) => (
            <article key={e.id} className="bg-[#111] border border-gray-800 rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="min-w-0">
                {e.type === "visit" ? (
                  <>
                    <p className="font-semibold text-white truncate">Visited {e.path || "/"}</p>
                    <p className="text-xs text-gray-500 truncate">Session {e.sessionId || "—"}</p>
                  </>
                ) : (
                  <>
                    <p className="font-semibold text-white truncate">{e.email || "Unknown email"}</p>
                    <p className="text-xs text-gray-500">
                      {e.role || "user"} sign-in{e.path ? ` · ${e.path}` : ""}
                    </p>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-500 shrink-0">{formatBookingCreatedAt(e.createdAt)}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
