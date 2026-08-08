import {
  addDoc,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type SiteEventType = "visit" | "signin";

export type SiteEvent = {
  id: string;
  type: SiteEventType;
  path?: string;
  email?: string;
  userId?: string;
  role?: string;
  sessionId?: string;
  userAgent?: string;
  createdAt?: Timestamp;
};

function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  const key = "siga_analytics_sid";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem(key, id);
  }
  return id;
}

/** Log a page visit once per path per browser session. */
export async function trackVisit(path: string): Promise<void> {
  if (typeof window === "undefined") return;
  // Don't track admin panel browsing as public visits
  if (path.startsWith("/admin")) return;

  const key = `siga_visit_logged:${path}`;
  if (sessionStorage.getItem(key)) return;
  sessionStorage.setItem(key, "1");

  try {
    await addDoc(collection(db, "siteEvents"), {
      type: "visit",
      path,
      sessionId: getSessionId(),
      userAgent: navigator.userAgent.slice(0, 180),
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    // Silent fail — analytics should never break the site
    console.warn("visit track failed", err);
  }
}

export async function trackSignIn(input: {
  email?: string | null;
  userId: string;
  role: "customer" | "admin";
}): Promise<void> {
  try {
    await addDoc(collection(db, "siteEvents"), {
      type: "signin",
      email: (input.email ?? "").toLowerCase(),
      userId: input.userId,
      role: input.role,
      path: typeof window !== "undefined" ? window.location.pathname : "",
      sessionId: typeof window !== "undefined" ? getSessionId() : "",
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 180) : "",
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn("signin track failed", err);
  }
}

export function subscribeSiteEvents(
  onData: (rows: SiteEvent[], meta: { at: Date }) => void,
  max = 200
): () => void {
  const q = query(collection(db, "siteEvents"), orderBy("createdAt", "desc"), limit(max));
  return onSnapshot(
    q,
    (snap) => {
      const rows = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<SiteEvent, "id">) }));
      onData(rows, { at: new Date() });
    },
    (err) => {
      console.error(err);
      onData([], { at: new Date() });
    }
  );
}
