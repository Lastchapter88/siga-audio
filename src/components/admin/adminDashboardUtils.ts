import type { Timestamp } from "firebase/firestore";

export type BookingLike = {
  status?: "pending" | "confirmed" | "cancelled";
};

export function computeBookingStats(bookings: BookingLike[]) {
  const total = bookings.length;
  const pending = bookings.filter((b) => (b.status ?? "pending") === "pending").length;
  const confirmed = bookings.filter((b) => b.status === "confirmed").length;
  const cancelled = bookings.filter((b) => b.status === "cancelled").length;
  return { total, pending, confirmed, cancelled };
}

export function formatBookingCreatedAt(ts?: Timestamp): string {
  if (!ts?.toDate) return "—";
  try {
    return ts.toDate().toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return "—";
  }
}
