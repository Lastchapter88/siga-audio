/**
 * Single façade for admin Firestore usage (playbook “firebaseBackend” idea).
 * Keep components thin; subscriptions and CRUD live here.
 */
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import type { Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { DEFAULT_SITE_IMAGES, SITE_MEDIA_SLOTS } from "@/lib/siteMediaConfig";
import {
  DEFAULT_HOME_CONTENT,
  DEFAULT_SITE_SETTINGS,
  mergeHomeContent,
  mergeSiteSettings,
  type HomePageContent,
  type SiteSettings,
} from "@/lib/pageContentDefaults";

export type AdminUserProfile = {
  businessId?: string;
  role?: string;
};

export type AdminBookingStatus = "pending" | "confirmed" | "cancelled";

export type AdminBooking = {
  id: string;
  name?: string;
  phone?: string;
  email?: string;
  userId?: string;
  carModel?: string;
  comboName?: string;
  combo?: string;
  businessId?: string;
  date?: string;
  timeSlot?: string;
  status?: AdminBookingStatus;
  notes?: string;
  proofUrl?: string;
  createdAt?: Timestamp;
};

export type AdminComboDoc = {
  id: string;
  slug: string;
  name: string;
  price: number;
  description?: string;
  tagline?: string;
  features?: string[];
  category?: string;
  vehicleModel?: string;
  image?: string;
  videoUrl?: string;
  businessId?: string;
};

export type ComboMediaOverrideDoc = {
  slug: string;
  imageUrl?: string;
  videoUrl?: string;
};

export type SiteMediaDoc = {
  slot: string;
  label: string;
  description?: string;
  imageUrl?: string;
  videoUrl?: string;
};

export { SITE_MEDIA_SLOTS };

export async function getAdminUserProfile(uid: string): Promise<AdminUserProfile | null> {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  const data = snap.data() as { businessId?: string; role?: string };
  return { businessId: data.businessId, role: data.role };
}

function docToBooking(d: { id: string; data: () => Record<string, unknown> }): AdminBooking {
  return { id: d.id, ...(d.data() as Omit<AdminBooking, "id">) };
}

function mergeBookings(a: AdminBooking[], b: AdminBooking[]): AdminBooking[] {
  const map = new Map<string, AdminBooking>();
  for (const row of a) map.set(row.id, row);
  for (const row of b) map.set(row.id, row);
  return Array.from(map.values());
}

/**
 * Realtime bookings for the admin dashboard (playbook: onSnapshot where it matters).
 * Merged query matches previous getDocs behaviour for business-scoped admins.
 */
export function subscribeBookingsForAdmin(
  businessId: string | null,
  onData: (rows: AdminBooking[], meta: { at: Date }) => void
): () => void {
  const base = collection(db, "bookings");

  if (!businessId) {
    return onSnapshot(base, (snap) => {
      const rows = snap.docs.map((d) => docToBooking(d));
      onData(rows, { at: new Date() });
    });
  }

  let left: AdminBooking[] = [];
  let right: AdminBooking[] = [];

  const emit = () => onData(mergeBookings(left, right), { at: new Date() });

  const u1 = onSnapshot(query(base, where("businessId", "==", businessId)), (snap) => {
    left = snap.docs.map((d) => docToBooking(d));
    emit();
  });

  const u2 = onSnapshot(query(base, where("businessId", "==", "")), (snap) => {
    right = snap.docs.map((d) => docToBooking(d));
    emit();
  });

  return () => {
    u1();
    u2();
  };
}

export async function setBookingStatus(bookingId: string, status: AdminBookingStatus): Promise<void> {
  await updateDoc(doc(db, "bookings", bookingId), { status });
}

/** All bookings — admin-only via Firestore rules. Single-tenant: show every booking. */
export function subscribeAllBookingsForAdmin(
  onData: (rows: AdminBooking[], meta: { at: Date }) => void
): () => void {
  return onSnapshot(
    collection(db, "bookings"),
    (snap) => {
      onData(
        snap.docs.map((d) => docToBooking(d)),
        { at: new Date() }
      );
    },
    (err) => {
      console.error(err);
      onData([], { at: new Date() });
    }
  );
}

export async function listCombosForBusiness(businessId: string): Promise<AdminComboDoc[]> {
  const snap = await getDocs(query(collection(db, "combos"), where("businessId", "==", businessId)));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<AdminComboDoc, "id">) }));
}

export async function createCombo(
  payload: Omit<AdminComboDoc, "id"> & { businessId: string }
): Promise<void> {
  await addDoc(collection(db, "combos"), {
    ...payload,
    createdAt: serverTimestamp(),
  });
}

export async function deleteCombo(comboId: string): Promise<void> {
  await deleteDoc(doc(db, "combos", comboId));
}

export async function updateCombo(
  comboId: string,
  patch: Partial<Omit<AdminComboDoc, "id">>
): Promise<void> {
  await updateDoc(doc(db, "combos", comboId), {
    ...patch,
    updatedAt: serverTimestamp(),
  });
}

export async function listComboMediaOverrides(): Promise<ComboMediaOverrideDoc[]> {
  const snap = await getDocs(collection(db, "comboMedia"));
  return snap.docs.map((d) => ({
    slug: d.id,
    ...(d.data() as Omit<ComboMediaOverrideDoc, "slug">),
  }));
}

export async function setComboMediaOverride(
  slug: string,
  patch: { imageUrl?: string | null; videoUrl?: string | null }
): Promise<void> {
  const data: Record<string, unknown> = { slug, updatedAt: serverTimestamp() };
  if (patch.imageUrl !== undefined) data.imageUrl = patch.imageUrl;
  if (patch.videoUrl !== undefined) data.videoUrl = patch.videoUrl;
  await setDoc(doc(db, "comboMedia", slug), data, { merge: true });
}

export async function listSiteMedia(): Promise<SiteMediaDoc[]> {
  const snap = await getDocs(collection(db, "siteMedia"));
  const bySlot = new Map(snap.docs.map((d) => [d.id, d.data() as Omit<SiteMediaDoc, "slot">]));

  return SITE_MEDIA_SLOTS.map((slot) => {
    const stored = bySlot.get(slot.slot);
    return {
      ...slot,
      imageUrl: stored?.imageUrl ?? DEFAULT_SITE_IMAGES[slot.slot],
      videoUrl: stored?.videoUrl,
    };
  });
}

export async function updateSiteMedia(
  slot: string,
  patch: { imageUrl?: string | null; videoUrl?: string | null }
): Promise<void> {
  const meta = SITE_MEDIA_SLOTS.find((s) => s.slot === slot);
  const data: Record<string, unknown> = {
    slot,
    label: meta?.label ?? slot,
    description: meta?.description,
    updatedAt: serverTimestamp(),
  };
  if (patch.imageUrl !== undefined) data.imageUrl = patch.imageUrl;
  if (patch.videoUrl !== undefined) data.videoUrl = patch.videoUrl;

  await setDoc(doc(db, "siteMedia", slot), data, { merge: true });
}

export async function getHomePageContent(): Promise<HomePageContent> {
  const snap = await getDoc(doc(db, "pageContent", "home"));
  if (!snap.exists()) return structuredClone(DEFAULT_HOME_CONTENT);
  return mergeHomeContent(snap.data() as Partial<HomePageContent>);
}

export async function saveHomePageContent(content: HomePageContent): Promise<void> {
  await setDoc(
    doc(db, "pageContent", "home"),
    {
      ...content,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function getSiteSettingsDoc(): Promise<SiteSettings> {
  const snap = await getDoc(doc(db, "siteSettings", "main"));
  if (!snap.exists()) return { ...DEFAULT_SITE_SETTINGS };
  return mergeSiteSettings(snap.data() as Partial<SiteSettings>);
}

export async function saveSiteSettingsDoc(settings: SiteSettings): Promise<void> {
  await setDoc(
    doc(db, "siteSettings", "main"),
    {
      ...settings,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}
