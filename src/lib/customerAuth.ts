import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getRedirectResult,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { isAllowedAdminEmail, normalizeEmail } from "@/lib/adminConfig";
import { trackSignIn } from "@/lib/analytics";

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export type CustomerProfile = {
  uid: string;
  email: string;
  name?: string;
  phone?: string;
  role: "customer";
};

export type CustomerAuthResult =
  | { ok: true; user: User }
  | { ok: false; message: string };

function codeOf(err: unknown): string {
  return err && typeof err === "object" && "code" in err ? String((err as { code?: string }).code) : "";
}

function googleAuthErrorMessage(err: unknown): string {
  const code = codeOf(err);
  if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
    return "Google sign-in was cancelled.";
  }
  if (code === "auth/popup-blocked") {
    return "Popup was blocked. Allow popups for this site and try again.";
  }
  if (code === "auth/unauthorized-domain") {
    return "This domain is not authorized in Firebase Auth settings.";
  }
  if (code === "auth/missing-initial-state") {
    return "Google sign-in session expired. Please try Continue with Google again.";
  }
  return "Google sign-in failed. Try again.";
}

export async function getCustomerProfile(uid: string): Promise<CustomerProfile | null> {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  const data = snap.data() as { email?: string; name?: string; phone?: string; role?: string };
  return {
    uid,
    email: data.email ?? "",
    name: data.name,
    phone: data.phone,
    role: "customer",
  };
}

export async function ensureCustomerProfile(
  user: User,
  extras?: { name?: string; phone?: string }
): Promise<CustomerAuthResult> {
  const email = normalizeEmail(user.email);
  if (!email) {
    await signOut(auth);
    return { ok: false, message: "Account email is required." };
  }

  // Admin accounts are managed by adminAuth — don't overwrite them here.
  if (isAllowedAdminEmail(email)) {
    return { ok: true, user };
  }

  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);
  const existing = snap.exists() ? (snap.data() as { role?: string; name?: string; phone?: string }) : null;

  if (existing?.role === "admin" || existing?.role === "moderator") {
    return { ok: true, user };
  }

  await setDoc(
    userRef,
    {
      uid: user.uid,
      email,
      name: extras?.name?.trim() || existing?.name || user.displayName || "",
      phone: extras?.phone?.trim() || existing?.phone || "",
      role: "customer",
      createdAt: existing ? undefined : serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  return { ok: true, user };
}

export async function updateCustomerContact(uid: string, name: string, phone: string): Promise<void> {
  await setDoc(
    doc(db, "users", uid),
    {
      name: name.trim(),
      phone: phone.trim(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function signUpCustomerWithEmail(input: {
  name: string;
  phone: string;
  email: string;
  password: string;
}): Promise<CustomerAuthResult> {
  const email = normalizeEmail(input.email);
  if (!input.name.trim() || !input.phone.trim()) {
    return { ok: false, message: "Name and phone number are required." };
  }
  if (input.password.length < 6) {
    return { ok: false, message: "Password must be at least 6 characters." };
  }
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, input.password);
    await updateProfile(cred.user, { displayName: input.name.trim() });
    const ensured = await ensureCustomerProfile(cred.user, { name: input.name, phone: input.phone });
    if (ensured.ok) {
      await trackSignIn({ email, userId: cred.user.uid, role: "customer" });
    }
    return ensured;
  } catch (err) {
    console.error(err);
    const code = codeOf(err);
    if (code === "auth/email-already-in-use") {
      return { ok: false, message: "Account already exists. Sign in instead." };
    }
    return { ok: false, message: "Could not create account. Try again." };
  }
}

export async function signInCustomerWithEmail(email: string, password: string): Promise<CustomerAuthResult> {
  try {
    const cred = await signInWithEmailAndPassword(auth, normalizeEmail(email), password);
    const ensured = await ensureCustomerProfile(cred.user);
    if (ensured.ok) {
      await trackSignIn({ email: cred.user.email, userId: cred.user.uid, role: "customer" });
    }
    return ensured;
  } catch (err) {
    console.error(err);
    const code = codeOf(err);
    if (code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found") {
      return { ok: false, message: "Invalid email or password." };
    }
    return { ok: false, message: "Could not sign in. Try again." };
  }
}

export async function startCustomerGoogleSignIn(): Promise<CustomerAuthResult> {
  try {
    const cred = await signInWithPopup(auth, googleProvider);
    const ensured = await ensureCustomerProfile(cred.user);
    if (ensured.ok) {
      await trackSignIn({ email: cred.user.email, userId: cred.user.uid, role: "customer" });
    }
    return ensured;
  } catch (err) {
    console.error(err);
    return { ok: false, message: googleAuthErrorMessage(err) };
  }
}

export async function completeCustomerGoogleRedirect(): Promise<CustomerAuthResult | null> {
  try {
    const result = await getRedirectResult(auth);
    if (!result) return null;
    const ensured = await ensureCustomerProfile(result.user);
    if (ensured.ok) {
      await trackSignIn({ email: result.user.email, userId: result.user.uid, role: "customer" });
    }
    return ensured;
  } catch (err) {
    const code = codeOf(err);
    if (
      code === "auth/missing-initial-state" ||
      code === "auth/argument-error" ||
      code === "auth/no-auth-event"
    ) {
      return null;
    }
    console.error(err);
    return { ok: false, message: googleAuthErrorMessage(err) };
  }
}

export async function sendCustomerPasswordReset(email: string): Promise<{ ok: true } | { ok: false; message: string }> {
  const normalized = normalizeEmail(email);
  if (!normalized) return { ok: false, message: "Enter your email first." };
  try {
    await sendPasswordResetEmail(auth, normalized);
    return { ok: true };
  } catch (err) {
    console.error(err);
    return { ok: false, message: "Could not send reset email." };
  }
}

export async function signOutCustomer(): Promise<void> {
  await signOut(auth);
}

export function subscribeAuth(cb: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, cb);
}
