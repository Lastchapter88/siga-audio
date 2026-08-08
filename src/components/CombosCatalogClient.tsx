"use client";

import { useEffect, useState } from "react";
import ComboCard from "@/components/ComboCard";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import type { Combo } from "@/data/combos";
import { resolveComboMedia, useComboMediaOverrides } from "@/lib/comboMedia";

type ComboDoc = Combo & {
  id?: string;
  businessId?: string;
  videoUrl?: string;
};

type Props = {
  /** Server-passed catalog — visible before hydration / without Firestore */
  initialCombos: ComboDoc[];
};

export default function CombosCatalogClient({ initialCombos }: Props) {
  const mediaOverrides = useComboMediaOverrides();
  const [combos, setCombos] = useState<ComboDoc[]>(() => initialCombos.map((c) => ({ ...c })));

  useEffect(() => {
    async function load() {
      try {
        const snap = await getDocs(collection(db, "combos"));
        const fetched = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<ComboDoc, "id">),
        }));

        if (fetched.length > 0) {
          setCombos(fetched);
        }
      } catch (err) {
        console.error(err);
      }
    }

    load();
  }, []);

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {combos.map((combo) => {
        const media = resolveComboMedia(combo.slug, combo.image, combo.videoUrl, mediaOverrides);
        return (
          <ComboCard
            key={combo.slug}
            combo={{
              ...(combo as Combo),
              image: media.image,
              videoUrl: media.videoUrl,
              features: combo.features || [],
              category: combo.category || "premium",
              description: combo.description || "",
            }}
          />
        );
      })}
    </div>
  );
}
