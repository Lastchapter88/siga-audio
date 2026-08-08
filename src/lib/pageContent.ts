"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  DEFAULT_HOME_CONTENT,
  DEFAULT_SITE_SETTINGS,
  mergeHomeContent,
  mergeSiteSettings,
  type HomePageContent,
  type SiteSettings,
} from "@/lib/pageContentDefaults";

export async function fetchHomeContent(): Promise<HomePageContent> {
  try {
    const snap = await getDoc(doc(db, "pageContent", "home"));
    if (!snap.exists()) return structuredClone(DEFAULT_HOME_CONTENT);
    return mergeHomeContent(snap.data() as Partial<HomePageContent>);
  } catch (err) {
    console.error(err);
    return structuredClone(DEFAULT_HOME_CONTENT);
  }
}

export async function fetchSiteSettings(): Promise<SiteSettings> {
  try {
    const snap = await getDoc(doc(db, "siteSettings", "main"));
    if (!snap.exists()) return { ...DEFAULT_SITE_SETTINGS };
    return mergeSiteSettings(snap.data() as Partial<SiteSettings>);
  } catch (err) {
    console.error(err);
    return { ...DEFAULT_SITE_SETTINGS };
  }
}

export function useHomeContent(): { content: HomePageContent; loading: boolean } {
  const [content, setContent] = useState<HomePageContent>(() => structuredClone(DEFAULT_HOME_CONTENT));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void fetchHomeContent().then((c) => {
      if (!cancelled) {
        setContent(c);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return { content, loading };
}

export function useSiteSettings(): { settings: SiteSettings; loading: boolean } {
  const [settings, setSettings] = useState<SiteSettings>(() => ({ ...DEFAULT_SITE_SETTINGS }));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void fetchSiteSettings().then((s) => {
      if (!cancelled) {
        setSettings(s);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return { settings, loading };
}

export function whatsappFromSettings(phone: string): string {
  if (!phone) return "";
  return phone.startsWith("0") ? `27${phone.slice(1)}` : phone.replace(/\D/g, "");
}
