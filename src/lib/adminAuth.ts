import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getRedirectResult,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { addDoc, collection, doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { business } from "@/lib/businessConfig";
import { isAllowedAdminEmail, normalizeEmail } from "@/lib/adminConfig";
import { trackSignIn } from "@/lib/analytics";

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export type AdminAuthResult =
  | { ok: true; user: User }
  | { ok: false; message: string };

function firebaseCode(err: unknown): string {
  return err && typeof err === "object" && "code" in err ? String((err as { code?: string }).code) : "";
}

function permissionMessage(): string {
  return "Firestore blocked this action. Ask the developer to deploy Firestore rules for admin access.";
}

function googleAuthErrorMessage(err: unknown): string {
  const code = firebaseCode(err);
  if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
    return "Google sign-in was cancelled.";
  }
  if (code === "auth/popup-blocked") {
    return "Popup was blocked. Allow popups for this site and try again.";
  }
  if (code === "auth/unauthorized-domain") {
    return "This domain is not authorized in Firebase Auth settings.";
  }
  if (code === "auth/account-exists-with-different-credential") {
    return "This email already uses password login. Sign in with email/password, or reset your password.";
  }
  if (code === "auth/missing-initial-state") {
    return "Google sign-in session expired. Please try Continue with Google again.";
  }
  return "Google sign-in failed. Try again.";
}

async function resolvePrimaryBusinessId(ownerId: string): Promise<string> {
  const configRef = doc(db, "config", "app");
  try {
    const configSnap = await getDoc(configRef);
    const existingId = configSnap.exists()
      ? (configSnap.data() as { primaryBusinessId?: string }).primaryBusinessId
      : undefined;
    if (existingId) return existingId;
  } catch (err) {
    if (firebaseCode(err) === "permission-denied") throw err;
  }

  const businessRef = await addDoc(collection(db, "businesses"), {
    name: business.name,
    phone: business.phone,
    ownerId,
    createdAt: serverTimestamp(),
  });

  await setDoc(configRef, { primaryBusinessId: businessRef.id }, { merge: true });
  return businessRef.id;
}

/**
 * Ensures allowlisted admin has a Firestore profile + shared business.
 * Signs out and rejects anyone not on the admin email list.
 */
export async function ensureAdminProfile(user: User): Promise<AdminAuthResult> {
  const email = normalizeEmail(user.email);
  if (!isAllowedAdminEmail(email)) {
    await signOut(auth);
    return {
      ok: false,
      message: "This Google/email account is not authorized for admin access.",
    };
  }

  try {
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      const data = snap.data() as { businessId?: string; role?: string };
      const businessId = data.businessId || (await resolvePrimaryBusinessId(user.uid));
      await setDoc(
        userRef,
        {
          uid: user.uid,
          email,
          businessId,
          role: "admin",
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      return { ok: true, user };
    }

    const businessId = await resolvePrimaryBusinessId(user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      email,
      businessId,
      role: "admin",
      createdAt: serverTimestamp(),
    });

    return { ok: true, user };
  } catch (err) {
    console.error(err);
    if (firebaseCode(err) === "permission-denied") {
      await signOut(auth);
      return { ok: false, message: permissionMessage() };
    }
    await signOut(auth);
    return { ok: false, message: "Could not set up admin profile. Try again." };
  }
}

/** Google sign-in via popup (avoids redirect missing-initial-state on partitioned browsers). */
export async function startGoogleAdminSignIn(): Promise<AdminAuthResult> {
  try {
    const cred = await signInWithPopup(auth, googleProvider);
    const ensured = await ensureAdminProfile(cred.user);
    if (ensured.ok) {
      await trackSignIn({ email: cred.user.email, userId: cred.user.uid, role: "admin" });
    }
    return ensured;
  } catch (err: unknown) {
    console.error(err);
    return { ok: false, message: googleAuthErrorMessage(err) };
  }
}

/**
 * Completes leftover redirect sessions if any.
 * Ignores missing-initial-state (common when redirect state was cleared).
 */
export async function completeGoogleAdminRedirect(): Promise<AdminAuthResult | null> {
  try {
    const result = await getRedirectResult(auth);
    if (!result) return null;
    const ensured = await ensureAdminProfile(result.user);
    if (ensured.ok) {
      await trackSignIn({ email: result.user.email, userId: result.user.uid, role: "admin" });
    }
    return ensured;
  } catch (err: unknown) {
    const code = firebaseCode(err);
    // Expected when no redirect was started, or storage was partitioned/cleared.
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

export async function signInAdminWithEmail(email: string, password: string): Promise<AdminAuthResult> {
  const normalized = normalizeEmail(email);
  if (!isAllowedAdminEmail(normalized)) {
    return { ok: false, message: "This email is not authorized for admin access." };
  }
  try {
    const cred = await signInWithEmailAndPassword(auth, normalized, password);
    const ensured = await ensureAdminProfile(cred.user);
    if (ensured.ok) {
      await trackSignIn({ email: normalized, userId: cred.user.uid, role: "admin" });
    }
    return ensured;
  } catch (err: unknown) {
    console.error(err);
    const code = firebaseCode(err);
    if (code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found") {
      return { ok: false, message: "Invalid email or password." };
    }
    if (code === "auth/too-many-requests") {
      return { ok: false, message: "Too many attempts. Try again later." };
    }
    return { ok: false, message: "Could not sign in. Check your connection and try again." };
  }
}

export async function signUpAdminWithEmail(
  email: string,
  password: string
): Promise<AdminAuthResult> {
  const normalized = normalizeEmail(email);
  if (!isAllowedAdminEmail(normalized)) {
    return { ok: false, message: "This email is not authorized to create an admin account." };
  }
  if (password.length < 6) {
    return { ok: false, message: "Password must be at least 6 characters." };
  }
  try {
    const cred = await createUserWithEmailAndPassword(auth, normalized, password);
    const ensured = await ensureAdminProfile(cred.user);
    if (ensured.ok) {
      await trackSignIn({ email: normalized, userId: cred.user.uid, role: "admin" });
    }
    return ensured;
  } catch (err: unknown) {
    console.error(err);
    const code = firebaseCode(err);
    if (code === "auth/email-already-in-use") {
      return {
        ok: false,
        message: "Account already exists. Sign in instead, or use Forgot password.",
      };
    }
    if (code === "auth/weak-password") {
      return { ok: false, message: "Password is too weak. Use at least 6 characters." };
    }
    return { ok: false, message: "Could not create account. Try again." };
  }
}

export async function sendAdminPasswordReset(email: string): Promise<{ ok: true } | { ok: false; message: string }> {
  const normalized = normalizeEmail(email);
  if (!normalized) {
    return { ok: false, message: "Enter your email address first." };
  }
  if (!isAllowedAdminEmail(normalized)) {
    return { ok: false, message: "This email is not authorized for admin access." };
  }
  try {
    await sendPasswordResetEmail(auth, normalized);
    return { ok: true };
  } catch (err: unknown) {
    console.error(err);
    const code = firebaseCode(err);
    if (code === "auth/user-not-found") {
      return { ok: false, message: "No account found for that email. Sign up first." };
    }
    return { ok: false, message: "Could not send reset email. Try again." };
  }
}
