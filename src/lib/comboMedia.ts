import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { comboImageUrl } from "@/lib/comboImages";

export type ComboMediaOverride = {
  imageUrl?: string;
  videoUrl?: string;
};

export type ResolvedComboMedia = {
  image: string;
  videoUrl?: string;
};

export async function fetchComboMediaOverrides(): Promise<Record<string, ComboMediaOverride>> {
  const snap = await getDocs(collection(db, "comboMedia"));
  const map: Record<string, ComboMediaOverride> = {};
  for (const d of snap.docs) {
    const data = d.data() as ComboMediaOverride;
    map[d.id] = {
      imageUrl: data.imageUrl,
      videoUrl: data.videoUrl,
    };
  }
  return map;
}

export function useComboMediaOverrides(): Record<string, ComboMediaOverride> {
  const [overrides, setOverrides] = useState<Record<string, ComboMediaOverride>>({});

  useEffect(() => {
    let cancelled = false;
    void fetchComboMediaOverrides().then((map) => {
      if (!cancelled) setOverrides(map);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return overrides;
}

export function resolveComboMedia(
  slug: string,
  image: string | undefined,
  videoUrl: string | undefined | null,
  overrides: Record<string, ComboMediaOverride>
): ResolvedComboMedia {
  const o = overrides[slug];
  return {
    image: o?.imageUrl?.trim() ? o.imageUrl : comboImageUrl(image),
    videoUrl: o?.videoUrl?.trim() || videoUrl?.trim() || undefined,
  };
}
