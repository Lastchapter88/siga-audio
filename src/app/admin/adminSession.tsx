"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getAdminUserProfile, type AdminUserProfile } from "@/lib/firebaseAdmin";
import { canManageCombos, isAllowedAdminEmail, isModeratorRole } from "@/lib/adminConfig";
import { ensureAdminProfile } from "@/lib/adminAuth";

type AdminSessionValue = {
  authReady: boolean;
  user: User | null;
  profile: AdminUserProfile | null;
  businessId: string | null;
  role: string | undefined;
  isModerator: boolean;
  canManageCombos: boolean;
  isAuthorizedAdmin: boolean;
};

const AdminSessionContext = createContext<AdminSessionValue | null>(null);

export function AdminSessionProvider({ children }: { children: ReactNode }) {
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AdminUserProfile | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, async (next) => {
      setAuthReady(false);
      if (!next) {
        setUser(null);
        setProfile(null);
        setAuthReady(true);
        return;
      }

      // Do not signOut non-admins — that would log customers out of the public site.
      // Just withhold admin session access.
      if (!isAllowedAdminEmail(next.email)) {
        setUser(null);
        setProfile(null);
        setAuthReady(true);
        return;
      }

      const ensured = await ensureAdminProfile(next);
      if (!ensured.ok) {
        setUser(null);
        setProfile(null);
        setAuthReady(true);
        return;
      }

      const p = await getAdminUserProfile(next.uid);
      setUser(next);
      setProfile(p);
      setAuthReady(true);
    });
  }, []);

  const value = useMemo((): AdminSessionValue => {
    const businessId = profile?.businessId ?? null;
    const role = profile?.role;
    const isAuthorizedAdmin = !!user && isAllowedAdminEmail(user.email);
    return {
      authReady,
      user: isAuthorizedAdmin ? user : null,
      profile: isAuthorizedAdmin ? profile : null,
      businessId: isAuthorizedAdmin ? businessId : null,
      role: isAuthorizedAdmin ? role : undefined,
      isModerator: isAuthorizedAdmin ? isModeratorRole(role) : false,
      canManageCombos: isAuthorizedAdmin ? canManageCombos(role) : false,
      isAuthorizedAdmin,
    };
  }, [authReady, user, profile]);

  return <AdminSessionContext.Provider value={value}>{children}</AdminSessionContext.Provider>;
}

export function useAdminSession(): AdminSessionValue {
  const ctx = useContext(AdminSessionContext);
  if (!ctx) {
    throw new Error("useAdminSession must be used inside AdminSessionProvider");
  }
  return ctx;
}
