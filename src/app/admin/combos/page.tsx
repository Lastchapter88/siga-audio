"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { comboImageUrl } from "@/lib/comboImages";
import { combos as catalogCombos } from "@/data/combos";
import ComboMediaFields from "@/components/admin/ComboMediaFields";
import {
  uploadCatalogComboImage,
  uploadCatalogComboVideo,
  uploadComboImage,
  uploadComboVideo,
} from "@/lib/mediaUpload";
import {
  createCombo,
  deleteCombo,
  listComboMediaOverrides,
  listCombosForBusiness,
  setComboMediaOverride,
  updateCombo,
  type AdminComboDoc,
  type ComboMediaOverrideDoc,
} from "@/lib/firebaseAdmin";
import { useAdminSession } from "@/app/admin/adminSession";

export default function CombosManager() {
  const router = useRouter();
  const { authReady, user, profile, businessId, canManageCombos } = useAdminSession();
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [combos, setCombos] = useState<AdminComboDoc[]>([]);
  const [overrides, setOverrides] = useState<ComboMediaOverrideDoc[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [newVideoFile, setNewVideoFile] = useState<File | null>(null);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editVideoFile, setEditVideoFile] = useState<File | null>(null);
  const [catalogImageFile, setCatalogImageFile] = useState<File | null>(null);
  const [catalogVideoFile, setCatalogVideoFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    slug: "",
    name: "",
    price: "",
    description: "",
    tagline: "",
    featuresCsv: "Subwoofer, Amplifier, Wiring kit",
    category: "premium",
    vehicleModel: "",
  });

  useEffect(() => {
    if (!authReady || !user) return;
    if (!canManageCombos) router.replace("/admin/dashboard");
  }, [authReady, user, canManageCombos, router]);

  const canSubmit = useMemo(() => {
    return (
      !!businessId &&
      form.slug.trim().length > 0 &&
      form.name.trim().length > 0 &&
      form.price.trim().length > 0
    );
  }, [businessId, form.slug, form.name, form.price]);

  const overrideBySlug = useMemo(() => {
    const map = new Map<string, ComboMediaOverrideDoc>();
    for (const o of overrides) map.set(o.slug, o);
    return map;
  }, [overrides]);

  async function reload(bid: string) {
    const [rows, media] = await Promise.all([listCombosForBusiness(bid), listComboMediaOverrides()]);
    setCombos(rows);
    setOverrides(media);
  }

  useEffect(() => {
    if (!authReady) return;

    if (!user) {
      setLoadError(null);
      setCombos([]);
      setOverrides([]);
      setLoading(false);
      return;
    }

    if (!canManageCombos) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    void (async () => {
      setLoadError(null);
      setLoading(true);
      try {
        if (!profile) throw new Error("User profile not found. Complete signup first.");
        const bid = profile.businessId;
        if (!bid) throw new Error("No business linked to this account.");
        const [rows, media] = await Promise.all([
          listCombosForBusiness(bid),
          listComboMediaOverrides(),
        ]);
        if (!cancelled) {
          setCombos(rows);
          setOverrides(media);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setLoadError(err instanceof Error ? err.message : "Could not load your business.");
          setCombos([]);
          setOverrides([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authReady, user, profile, canManageCombos]);

  function makeSlug(input: string) {
    return input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  async function addCombo() {
    if (!businessId || !canManageCombos) return;

    setSaving(true);
    try {
      const features = form.featuresCsv
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const slug = form.slug.trim();
      let image: string | undefined;
      let videoUrl: string | undefined;

      if (newImageFile) {
        image = await uploadCatalogComboImage(slug, newImageFile);
      }
      if (newVideoFile) {
        videoUrl = await uploadCatalogComboVideo(slug, newVideoFile);
      }

      await createCombo({
        businessId,
        slug,
        name: form.name.trim(),
        price: Number(form.price),
        description: form.description.trim(),
        tagline: form.tagline.trim() || undefined,
        features,
        category: form.category.trim() || "premium",
        vehicleModel: form.vehicleModel.trim() || undefined,
        image,
        videoUrl,
      });

      setForm((prev) => ({
        ...prev,
        slug: "",
        name: "",
        price: "",
        description: "",
        tagline: "",
        vehicleModel: "",
      }));
      setNewImageFile(null);
      setNewVideoFile(null);

      await reload(businessId);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Error adding combo.");
    } finally {
      setSaving(false);
    }
  }

  async function saveComboMedia(combo: AdminComboDoc) {
    if (!businessId) return;
    setSaving(true);
    try {
      const patch: Partial<AdminComboDoc> = {};
      if (editImageFile) {
        patch.image = await uploadComboImage(businessId, combo.id, editImageFile);
      }
      if (editVideoFile) {
        patch.videoUrl = await uploadComboVideo(businessId, combo.id, editVideoFile);
      }
      if (Object.keys(patch).length > 0) {
        await updateCombo(combo.id, patch);
      }
      setEditingId(null);
      setEditImageFile(null);
      setEditVideoFile(null);
      await reload(businessId);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Could not save media.");
    } finally {
      setSaving(false);
    }
  }

  async function saveCatalogMedia(slug: string, defaultImage: string) {
    if (!businessId) return;
    setSaving(true);
    try {
      const patch: { imageUrl?: string; videoUrl?: string } = {};
      if (catalogImageFile) {
        patch.imageUrl = await uploadCatalogComboImage(slug, catalogImageFile);
      }
      if (catalogVideoFile) {
        patch.videoUrl = await uploadCatalogComboVideo(slug, catalogVideoFile);
      }
      if (Object.keys(patch).length === 0) {
        alert("Choose a new photo or video to upload.");
        return;
      }
      await setComboMediaOverride(slug, patch);
      setEditingSlug(null);
      setCatalogImageFile(null);
      setCatalogVideoFile(null);
      await reload(businessId);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Could not save catalog media.");
    } finally {
      setSaving(false);
    }
  }

  async function removeCombo(comboId: string) {
    if (!businessId || !canManageCombos) return;
    setSaving(true);
    try {
      await deleteCombo(comboId);
      await reload(businessId);
    } catch (err) {
      console.error(err);
      alert("Error deleting combo.");
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
        <h2 className="text-2xl font-bold mb-2">Manage Combos</h2>
        <p className="text-gray-400 text-sm mb-8">Sign in to add or remove packages for your business.</p>
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

  if (loadError) {
    return (
      <div className="p-6 md:p-8 max-w-lg mx-auto">
        <h2 className="text-2xl font-bold mb-2">Combos</h2>
        <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-xl p-4">{loadError}</p>
        <Link href="/signup" className="inline-block mt-6 text-sigaYellow text-sm hover:underline">
          Create a business account →
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto pb-16 space-y-10">
      <div>
        <p className="text-gray-400 text-sm">
          Replace package photos and upload promo videos. Changes appear on the live site immediately.
        </p>
        {businessId ? (
          <p className="text-[11px] text-gray-600 mt-1 font-mono">businessId: {businessId}</p>
        ) : null}
      </div>

      {loading ? (
        <div className="text-gray-400 text-sm">Loading…</div>
      ) : (
        <>
          <section>
            <h2 className="text-lg font-bold mb-4">Catalog packages (site-wide)</h2>
            <p className="text-xs text-gray-500 mb-4 max-w-2xl">
              Update photos and videos for the built-in catalog. Uploads replace what visitors see on the home page and
              combo pages — no rebuild required.
            </p>
            <div className="space-y-3">
              {catalogCombos.map((c) => {
                const o = overrideBySlug.get(c.slug);
                const isOpen = editingSlug === c.slug;
                const currentImage = o?.imageUrl ?? c.image;
                const currentVideo = o?.videoUrl;

                return (
                  <div key={c.slug} className="bg-[#111] border border-gray-800 rounded-2xl p-4">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 md:justify-between">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="h-14 w-14 rounded-lg overflow-hidden border border-gray-800 bg-black shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={comboImageUrl(currentImage)}
                            alt={c.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold truncate">{c.name}</p>
                          <p className="text-xs text-gray-500 truncate">/{c.slug}</p>
                          {currentVideo ? (
                            <p className="text-[11px] text-sigaYellow mt-0.5">Video attached</p>
                          ) : null}
                        </div>
                      </div>
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => {
                          if (isOpen) {
                            setEditingSlug(null);
                            setCatalogImageFile(null);
                            setCatalogVideoFile(null);
                          } else {
                            setEditingSlug(c.slug);
                            setCatalogImageFile(null);
                            setCatalogVideoFile(null);
                          }
                        }}
                        className="text-sm font-semibold text-sigaYellow border border-sigaYellow/40 rounded-lg px-4 py-2 hover:bg-sigaYellow/10 disabled:opacity-40"
                      >
                        {isOpen ? "Close" : "Replace photo / video"}
                      </button>
                    </div>

                    {isOpen ? (
                      <div className="mt-4 pt-4 border-t border-gray-800">
                        <ComboMediaFields
                          currentImage={currentImage}
                          currentVideoUrl={currentVideo}
                          disabled={saving}
                          onImageFile={setCatalogImageFile}
                          onVideoFile={setCatalogVideoFile}
                        />
                        <button
                          type="button"
                          disabled={saving || (!catalogImageFile && !catalogVideoFile)}
                          onClick={() => saveCatalogMedia(c.slug, c.image)}
                          className="btn mt-4 disabled:opacity-50"
                        >
                          {saving ? "Uploading…" : "Save media"}
                        </button>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-4">Your business combos</h2>

            <div className="bg-[#111] border border-gray-800 rounded-2xl p-4 md:p-6 mb-6">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  placeholder="Combo Name"
                  className="input"
                  value={form.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setForm((prev) => ({
                      ...prev,
                      name,
                      slug: prev.slug.trim().length ? prev.slug : makeSlug(name),
                    }));
                  }}
                />
                <input
                  placeholder="Slug (used in URL)"
                  className="input"
                  value={form.slug}
                  onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                />
                <input
                  placeholder="Price (e.g. 6999)"
                  className="input"
                  value={form.price}
                  onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
                />
                <input
                  placeholder="Category (budget/loud/premium/vehicle)"
                  className="input"
                  value={form.category}
                  onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                />
              </div>

              <div className="mt-4 grid md:grid-cols-2 gap-4">
                <input
                  placeholder="Tagline (optional)"
                  className="input"
                  value={form.tagline}
                  onChange={(e) => setForm((prev) => ({ ...prev, tagline: e.target.value }))}
                />
                <input
                  placeholder="Vehicle model (optional)"
                  className="input"
                  value={form.vehicleModel}
                  onChange={(e) => setForm((prev) => ({ ...prev, vehicleModel: e.target.value }))}
                />
              </div>

              <input
                placeholder="Features CSV (comma-separated)"
                className="input mt-4"
                value={form.featuresCsv}
                onChange={(e) => setForm((prev) => ({ ...prev, featuresCsv: e.target.value }))}
              />

              <textarea
                placeholder="Description"
                className="input min-h-[100px] mt-4"
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              />

              <div className="mt-4">
                <ComboMediaFields
                  label="Photo & video for new combo"
                  disabled={saving}
                  onImageFile={setNewImageFile}
                  onVideoFile={setNewVideoFile}
                />
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  onClick={addCombo}
                  disabled={!canSubmit || saving}
                  className="btn disabled:opacity-50"
                  type="button"
                >
                  {saving ? "Saving…" : "Add Combo"}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {combos.length === 0 ? (
                <div className="text-gray-400 text-sm bg-[#111] border border-gray-800 rounded-2xl p-6">
                  No custom combos yet — use catalog overrides above or add one here.
                </div>
              ) : (
                combos.map((c) => {
                  const isOpen = editingId === c.id;
                  return (
                    <div key={c.id} className="bg-[#111] border border-gray-800 rounded-2xl p-4">
                      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="h-14 w-14 rounded-lg overflow-hidden border border-gray-800 bg-black shrink-0">
                            {c.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={comboImageUrl(c.image)}
                                alt={c.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="text-gray-500 text-xs text-center px-1">No image</div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold truncate">{c.name}</p>
                            <p className="text-yellow-400 text-sm font-semibold">R{c.price}</p>
                            <p className="text-xs text-gray-500 truncate">/{c.slug}</p>
                            {c.videoUrl ? (
                              <p className="text-[11px] text-sigaYellow mt-0.5">Video attached</p>
                            ) : null}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            disabled={saving}
                            onClick={() => {
                              if (isOpen) {
                                setEditingId(null);
                                setEditImageFile(null);
                                setEditVideoFile(null);
                              } else {
                                setEditingId(c.id);
                                setEditImageFile(null);
                                setEditVideoFile(null);
                              }
                            }}
                            className="text-sm font-semibold text-sigaYellow border border-sigaYellow/40 rounded-lg px-4 py-2 hover:bg-sigaYellow/10 disabled:opacity-40"
                          >
                            {isOpen ? "Close" : "Media"}
                          </button>
                          <button
                            onClick={() => removeCombo(c.id)}
                            disabled={saving}
                            className="bg-red-500 hover:bg-red-400 transition px-4 py-2 rounded-lg font-semibold text-sm disabled:opacity-50"
                            type="button"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      {isOpen ? (
                        <div className="mt-4 pt-4 border-t border-gray-800">
                          <ComboMediaFields
                            currentImage={c.image}
                            currentVideoUrl={c.videoUrl}
                            disabled={saving}
                            onImageFile={setEditImageFile}
                            onVideoFile={setEditVideoFile}
                          />
                          <button
                            type="button"
                            disabled={saving || (!editImageFile && !editVideoFile)}
                            onClick={() => saveComboMedia(c)}
                            className="btn mt-4 disabled:opacity-50"
                          >
                            {saving ? "Uploading…" : "Save media"}
                          </button>
                        </div>
                      ) : null}
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
