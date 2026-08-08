"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { User } from "firebase/auth";
import {
  ensureCustomerProfile,
  getCustomerProfile,
  subscribeAuth,
  type CustomerProfile,
} from "@/lib/customerAuth";

type CustomerSessionValue = {
  authReady: boolean;
  user: User | null;
  profile: CustomerProfile | null;
  refreshProfile: () => Promise<void>;
};

const CustomerSessionContext = createContext<CustomerSessionValue | null>(null);

export function CustomerSessionProvider({ children }: { children: ReactNode }) {
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);

  async function loadProfile(next: User | null) {
    if (!next) {
      setProfile(null);
      return;
    }
    await ensureCustomerProfile(next);
    const p = await getCustomerProfile(next.uid);
    setProfile(p);
  }

  useEffect(() => {
    return subscribeAuth(async (next) => {
      setAuthReady(false);
      setUser(next);
      try {
        await loadProfile(next);
      } finally {
        setAuthReady(true);
      }
    });
  }, []);

  const value = useMemo(
    (): CustomerSessionValue => ({
      authReady,
      user,
      profile,
      refreshProfile: async () => {
        if (!user) return;
        await loadProfile(user);
      },
    }),
    [authReady, user, profile]
  );

  return <CustomerSessionContext.Provider value={value}>{children}</CustomerSessionContext.Provider>;
}

export function useCustomerSession(): CustomerSessionValue {
  const ctx = useContext(CustomerSessionContext);
  if (!ctx) throw new Error("useCustomerSession must be used inside CustomerSessionProvider");
  return ctx;
}
