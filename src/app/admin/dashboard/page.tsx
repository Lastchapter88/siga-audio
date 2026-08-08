"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  setBookingStatus,
  subscribeAllBookingsForAdmin,
  type AdminBooking,
  type AdminBookingStatus,
} from "@/lib/firebaseAdmin";
import { computeBookingStats, formatBookingCreatedAt } from "@/components/admin/adminDashboardUtils";
import { useAdminSession } from "@/app/admin/adminSession";

type FilterTab = "all" | AdminBookingStatus;

export default function AdminBookingsDashboard() {
  const { authReady, user, isAuthorizedAdmin } = useAdminSession();
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterTab>("all");
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  useEffect(() => {
    if (!authReady || !user || !isAuthorizedAdmin) {
      setBookings([]);
      setLastSyncedAt(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsub = subscribeAllBookingsForAdmin((rows, meta) => {
      setBookings(rows);
      setLastSyncedAt(meta.at);
      setLoading(false);
    });

    return () => unsub();
  }, [authReady, user, isAuthorizedAdmin]);

  const stats = useMemo(() => computeBookingStats(bookings), [bookings]);

  const filtered = useMemo(() => {
    const rows = bookings.slice();
    rows.sort((a, b) => {
      const ta = a.createdAt?.seconds ?? 0;
      const tb = b.createdAt?.seconds ?? 0;
      return tb - ta;
    });
    if (filter === "all") return rows;
    return rows.filter((b) => (b.status ?? "pending") === filter);
  }, [bookings, filter]);

  async function updateStatus(id: string, status: AdminBookingStatus) {
    setUpdatingId(id);
    try {
      await setBookingStatus(id, status);
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    } finally {
      setUpdatingId(null);
    }
  }

  function waLink(phone: string | undefined) {
    if (!phone?.trim()) return null;
    const digits = phone.replace(/\D/g, "");
    if (!digits) return null;
    const num = phone.startsWith("0") ? `27${phone.slice(1).replace(/\D/g, "")}` : digits;
    return `https://wa.me/${num}`;
  }

  if (!authReady) {
    return (
      <div className="p-6 md:p-8 max-w-6xl mx-auto">
        <p className="text-gray-400 text-sm">Loading…</p>
      </div>
    );
  }

  if (!user || !isAuthorizedAdmin) {
    return (
      <div className="p-6 md:p-8 max-w-lg mx-auto text-center">
        <h2 className="text-2xl font-bold mb-2">Bookings</h2>
        <p className="text-gray-400 text-sm mb-8">
          Admin access only. Guests and customer accounts cannot view bookings.
        </p>
        <Link
          href="/admin/login"
          className="inline-flex bg-sigaYellow text-black px-8 py-3 rounded-xl font-bold hover:bg-yellow-300 transition"
        >
          Admin sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div className="min-w-0">
          <p className="text-gray-400 text-sm">
            Who booked: name, phone, email, package, slot, and payment proof. Visible to admins only.
          </p>
          {lastSyncedAt ? (
            <p className="text-[11px] text-gray-600 mt-2">
              Live sync · last update {lastSyncedAt.toLocaleTimeString(undefined, { timeStyle: "medium" })}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`text-left bg-[#111] p-4 rounded-xl border transition ${
            filter === "all" ? "border-sigaYellow/50" : "border-gray-800/70 hover:border-gray-700"
          }`}
        >
          <p className="text-gray-400 text-xs">Total</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </button>
        <button
          type="button"
          onClick={() => setFilter("pending")}
          className={`text-left bg-[#111] p-4 rounded-xl border transition ${
            filter === "pending" ? "border-sigaYellow/50" : "border-gray-800/70 hover:border-gray-700"
          }`}
        >
          <p className="text-gray-400 text-xs">Pending</p>
          <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
        </button>
        <button
          type="button"
          onClick={() => setFilter("confirmed")}
          className={`text-left bg-[#111] p-4 rounded-xl border transition ${
            filter === "confirmed" ? "border-sigaYellow/50" : "border-gray-800/70 hover:border-gray-700"
          }`}
        >
          <p className="text-gray-400 text-xs">Confirmed</p>
          <p className="text-2xl font-bold text-green-400">{stats.confirmed}</p>
        </button>
        <button
          type="button"
          onClick={() => setFilter("cancelled")}
          className={`text-left bg-[#111] p-4 rounded-xl border transition ${
            filter === "cancelled" ? "border-sigaYellow/50" : "border-gray-800/70 hover:border-gray-700"
          }`}
        >
          <p className="text-gray-400 text-xs">Cancelled</p>
          <p className="text-2xl font-bold text-red-400">{stats.cancelled}</p>
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-gray-400 text-sm">Loading bookings…</div>
        ) : filtered.length === 0 ? (
          <div className="text-gray-400 text-sm bg-[#111] border border-gray-800/70 rounded-xl p-8 text-center">
            {bookings.length === 0 ? "No bookings yet." : "No bookings in this filter."}
          </div>
        ) : (
          filtered.map((b) => {
            const status = b.status ?? "pending";
            const badge =
              status === "confirmed"
                ? "bg-green-500/15 text-green-300 border-green-500/30"
                : status === "cancelled"
                  ? "bg-red-500/15 text-red-300 border-red-500/30"
                  : "bg-yellow-400/15 text-yellow-300 border-yellow-400/30";

            const comboLabel = b.comboName?.trim() || b.combo || "—";
            const phoneLink = waLink(b.phone);

            return (
              <article
                key={b.id}
                className="bg-[#111] p-5 rounded-xl border border-gray-800/70 hover:border-sigaYellow/30 transition"
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-4 lg:justify-between">
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <p className="font-bold text-white text-lg">{b.name ?? "Unknown"}</p>
                      <span className={`px-3 py-1 rounded border text-xs font-semibold ${badge}`}>{status}</span>
                    </div>

                    <p className="text-gray-300">
                      <span className="text-gray-500">Phone:</span>{" "}
                      {phoneLink ? (
                        <a href={phoneLink} target="_blank" rel="noreferrer" className="text-sigaYellow hover:underline">
                          {b.phone}
                        </a>
                      ) : (
                        b.phone ?? "—"
                      )}
                    </p>
                    {b.email ? (
                      <p className="text-gray-300">
                        <span className="text-gray-500">Email:</span> {b.email}
                      </p>
                    ) : null}
                    <p className="text-gray-300">
                      <span className="text-gray-500">Vehicle:</span> {b.carModel ?? "—"}
                    </p>
                    <p className="text-gray-300">
                      <span className="text-gray-500">Combo:</span> {comboLabel}
                      {b.combo ? <span className="text-gray-500 text-sm ml-1">({b.combo})</span> : null}
                    </p>
                    <p className="text-gray-300">
                      <span className="text-gray-500">Slot:</span>{" "}
                      {b.date && b.timeSlot ? (
                        <>
                          {b.date} · {b.timeSlot}
                        </>
                      ) : (
                        "—"
                      )}
                    </p>
                    <p className="text-xs text-gray-500">Submitted {formatBookingCreatedAt(b.createdAt)}</p>

                    {b.notes?.trim() ? (
                      <div className="mt-3 pt-3 border-t border-gray-800">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Notes</p>
                        <p className="text-sm text-gray-300 whitespace-pre-wrap">{b.notes}</p>
                      </div>
                    ) : null}
                  </div>

                  <div className="flex flex-col items-stretch gap-3 lg:items-end shrink-0">
                    {b.proofUrl ? (
                      <a
                        href={b.proofUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="block w-full max-w-[200px] lg:max-w-[220px]"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={b.proofUrl}
                          alt="Proof of payment"
                          className="w-full h-36 rounded-lg object-cover border border-gray-800 hover:border-sigaYellow/50 transition"
                        />
                        <span className="text-xs text-sigaYellow mt-1 inline-block">Open full size →</span>
                      </a>
                    ) : (
                      <div className="w-full max-w-[200px] h-36 rounded-lg border border-dashed border-gray-700 flex items-center justify-center text-gray-500 text-xs text-center px-2">
                        No proof uploaded
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 mt-5 pt-4 border-t border-gray-800/80 flex-wrap">
                  <button
                    type="button"
                    disabled={updatingId === b.id || status === "confirmed"}
                    onClick={() => updateStatus(b.id, "confirmed")}
                    className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg font-semibold text-sm text-white disabled:opacity-40"
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    disabled={updatingId === b.id || status === "cancelled"}
                    onClick={() => updateStatus(b.id, "cancelled")}
                    className="bg-red-600/90 hover:bg-red-500 px-4 py-2 rounded-lg font-semibold text-sm text-white disabled:opacity-40"
                  >
                    Cancel
                  </button>
                  {status === "pending" ? (
                    <span className="text-xs text-gray-500 self-center">Pending customer / proof review</span>
                  ) : null}
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
