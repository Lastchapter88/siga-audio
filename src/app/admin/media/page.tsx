"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ComboMediaFields from "@/components/admin/ComboMediaFields";
import { uploadSiteMediaImage, uploadSiteMediaVideo } from "@/lib/mediaUpload";
import { listSiteMedia, updateSiteMedia, type SiteMediaDoc } from "@/lib/firebaseAdmin";
import { useAdminSession } from "@/app/admin/adminSession";
import { comboImageUrl } from "@/lib/comboImages";

export default function SiteMediaPage() {
  const router = useRouter();
  const { authReady, user, canManageCombos } = useAdminSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [slots, setSlots] = useState<SiteMediaDoc[]>([]);
  const [editingSlot, setEditingSlot] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  useEffect(() => {
    if (!authReady || !user) return;
    if (!canManageCombos) router.replace("/admin/dashboard");
  }, [authReady, user, canManageCombos, router]);

  useEffect(() => {
    if (!authReady || !user || !canManageCombos) {
      if (authReady) setLoading(false);
      return;
    }

    let cancelled = false;
    void (async () => {
      setLoading(true);
      try {
        const rows = await listSiteMedia();
        if (!cancelled) setSlots(rows);
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authReady, user, canManageCombos]);

  async function saveSlot(slot: string) {
    setSaving(true);
    try {
      const patch: { imageUrl?: string; videoUrl?: string } = {};
      if (imageFile) patch.imageUrl = await uploadSiteMediaImage(slot, imageFile);
      if (videoFile) patch.videoUrl = await uploadSiteMediaVideo(slot, videoFile);
      if (Object.keys(patch).length === 0) {
        alert("Choose a new photo or video to upload.");
        return;
      }
      await updateSiteMedia(slot, patch);
      setEditingSlot(null);
      setImageFile(null);
      setVideoFile(null);
      setSlots(await listSiteMedia());
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Could not save media.");
    } finally {
      setSaving(false);
    }
  }

  if (!authReady) {
    return (
      <div className="p-6 md:p-8 max-w-6xl mx-auto">
        <p className="text-gray-400 text-sm">Loading…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 md:p-8 max-w-lg mx-auto text-center">
        <h2 className="text-2xl font-bold mb-2">Site media</h2>
        <p className="text-gray-400 text-sm mb-8">Sign in to replace photos and upload videos.</p>
        <Link
          href="/admin/login"
          className="inline-flex bg-sigaYellow text-black px-8 py-3 rounded-xl font-bold hover:bg-yellow-300 transition"
        >
          Sign in
        </Link>
      </div>
    );
  }

  if (!canManageCombos) {
    return (
      <div className="p-6 md:p-8 max-w-6xl mx-auto">
        <p className="text-gray-400 text-sm">Redirecting…</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto pb-16">
      <p className="text-gray-400 text-sm mb-8 max-w-2xl">
        Replace air suspension and other page images, and attach promo videos. Updates appear on the public site
        immediately.
      </p>

      {loading ? (
        <p className="text-gray-400 text-sm">Loading…</p>
      ) : (
        <div className="space-y-4">
          {slots.map((slot) => {
            const isOpen = editingSlot === slot.slot;
            const imageSrc = slot.imageUrl ? comboImageUrl(slot.imageUrl) : undefined;

            return (
              <article key={slot.slot} className="bg-[#111] border border-gray-800 rounded-2xl p-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:justify-between">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="h-16 w-24 rounded-lg overflow-hidden border border-gray-800 bg-black shrink-0">
                      {imageSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={imageSrc} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-xs text-gray-500 p-2">No image</span>
                      )}
                    </div>
                    <div>
                      <p className="font-bold">{slot.label}</p>
                      {slot.description ? (
                        <p className="text-xs text-gray-500 mt-1 max-w-md">{slot.description}</p>
                      ) : null}
                      {slot.videoUrl ? (
                        <p className="text-[11px] text-sigaYellow mt-1">Video attached</p>
                      ) : null}
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => {
                      if (isOpen) {
                        setEditingSlot(null);
                        setImageFile(null);
                        setVideoFile(null);
                      } else {
                        setEditingSlot(slot.slot);
                        setImageFile(null);
                        setVideoFile(null);
                      }
                    }}
                    className="text-sm font-semibold text-sigaYellow border border-sigaYellow/40 rounded-lg px-4 py-2 hover:bg-sigaYellow/10 disabled:opacity-40 shrink-0"
                  >
                    {isOpen ? "Close" : "Replace photo / video"}
                  </button>
                </div>

                {isOpen ? (
                  <div className="mt-4 pt-4 border-t border-gray-800">
                    <ComboMediaFields
                      currentImage={slot.imageUrl}
                      currentVideoUrl={slot.videoUrl}
                      disabled={saving}
                      onImageFile={setImageFile}
                      onVideoFile={setVideoFile}
                    />
                    <button
                      type="button"
                      disabled={saving || (!imageFile && !videoFile)}
                      onClick={() => saveSlot(slot.slot)}
                      className="btn mt-4 disabled:opacity-50"
                    >
                      {saving ? "Uploading…" : "Save media"}
                    </button>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
