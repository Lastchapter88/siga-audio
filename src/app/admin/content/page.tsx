"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAdminSession } from "@/app/admin/adminSession";
import {
  getHomePageContent,
  getSiteSettingsDoc,
  saveHomePageContent,
  saveSiteSettingsDoc,
} from "@/lib/firebaseAdmin";
import {
  DEFAULT_HOME_CONTENT,
  type CustomSection,
  type HomePageContent,
  type ServiceCard,
  type SiteSettings,
} from "@/lib/pageContentDefaults";
import { uploadSiteMediaImage, uploadSiteMediaVideo } from "@/lib/mediaUpload";

function newId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}`;
}

export default function AdminContentPage() {
  const router = useRouter();
  const { authReady, user, canManageCombos } = useAdminSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState<HomePageContent>(() => structuredClone(DEFAULT_HOME_CONTENT));
  const [settings, setSettings] = useState<SiteSettings | null>(null);

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
        const [home, site] = await Promise.all([getHomePageContent(), getSiteSettingsDoc()]);
        if (!cancelled) {
          setContent(home);
          setSettings(site);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("Could not load site content.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [authReady, user, canManageCombos]);

  async function handleSave() {
    if (!settings) return;
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      await Promise.all([saveHomePageContent(content), saveSiteSettingsDoc(settings)]);
      setMessage("Saved. Changes are live on the public site now.");
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  }

  async function uploadHeroImage(file: File | null) {
    if (!file) return;
    setSaving(true);
    try {
      const url = await uploadSiteMediaImage("home-hero", file);
      setContent((c) => ({ ...c, hero: { ...c.hero, backgroundImageUrl: url } }));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setSaving(false);
    }
  }

  async function uploadHeroVideo(file: File | null) {
    if (!file) return;
    setSaving(true);
    try {
      const url = await uploadSiteMediaVideo("home-hero", file);
      setContent((c) => ({ ...c, hero: { ...c.hero, videoUrl: url } }));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setSaving(false);
    }
  }

  async function uploadServiceMedia(index: number, kind: "image" | "video", file: File | null) {
    if (!file) return;
    const item = content.moreServices.items[index];
    if (!item) return;
    setSaving(true);
    try {
      const url =
        kind === "image"
          ? await uploadSiteMediaImage(`service-${item.id}`, file)
          : await uploadSiteMediaVideo(`service-${item.id}`, file);
      setContent((c) => {
        const items = c.moreServices.items.map((row, i) =>
          i === index
            ? kind === "image"
              ? { ...row, imageUrl: url }
              : { ...row, videoUrl: url }
            : row
        );
        return { ...c, moreServices: { ...c.moreServices, items } };
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setSaving(false);
    }
  }

  async function uploadCustomMedia(sectionId: string, kind: "image" | "video", file: File | null) {
    if (!file) return;
    setSaving(true);
    try {
      const url =
        kind === "image"
          ? await uploadSiteMediaImage(`custom-${sectionId}`, file)
          : await uploadSiteMediaVideo(`custom-${sectionId}`, file);
      setContent((c) => ({
        ...c,
        customSections: c.customSections.map((s) =>
          s.id === sectionId
            ? kind === "image"
              ? { ...s, imageUrl: url }
              : { ...s, videoUrl: url }
            : s
        ),
      }));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setSaving(false);
    }
  }

  async function uploadLogo(file: File | null) {
    if (!file || !settings) return;
    setSaving(true);
    try {
      const url = await uploadSiteMediaImage("brand-logo", file);
      setSettings({ ...settings, logoUrl: url });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setSaving(false);
    }
  }

  function addCustomSection() {
    const section: CustomSection = {
      id: newId("section"),
      title: "New section",
      body: "Describe this offer or promo here.",
      enabled: true,
      ctaLabel: "Learn more",
      ctaHref: "/book",
    };
    setContent((c) => ({ ...c, customSections: [...c.customSections, section] }));
  }

  function addServiceCard() {
    const item: ServiceCard = {
      id: newId("service"),
      title: "New service",
      body: "Short description",
      href: "/book",
      ctaLabel: "Learn more →",
    };
    setContent((c) => ({
      ...c,
      moreServices: { ...c.moreServices, items: [...c.moreServices.items, item] },
    }));
  }

  if (!authReady) {
    return (
      <div className="p-6 md:p-8">
        <p className="text-gray-400 text-sm">Loading…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 md:p-8 max-w-lg mx-auto text-center">
        <h2 className="text-2xl font-bold mb-2">Homepage CMS</h2>
        <p className="text-gray-400 text-sm mb-8">Sign in to edit the live site.</p>
        <Link href="/admin/login" className="inline-flex bg-sigaYellow text-black px-8 py-3 rounded-xl font-bold">
          Sign in
        </Link>
      </div>
    );
  }

  if (!canManageCombos || loading || !settings) {
    return (
      <div className="p-6 md:p-8">
        <p className="text-gray-400 text-sm">{canManageCombos ? "Loading content…" : "Redirecting…"}</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto pb-24 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <p className="text-gray-400 text-sm">
            Edit the main website from here — text, photos, videos, and new sections. Save once and the live site
            updates (no code deploy needed).
          </p>
          <Link href="/" target="_blank" className="text-xs text-sigaYellow hover:underline mt-2 inline-block">
            Open live site →
          </Link>
        </div>
        <button type="button" disabled={saving} onClick={handleSave} className="btn sm:w-auto disabled:opacity-50">
          {saving ? "Saving…" : "Save all changes"}
        </button>
      </div>

      {error ? (
        <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">{error}</div>
      ) : null}
      {message ? (
        <div className="text-sm text-sigaYellow bg-sigaYellow/10 border border-sigaYellow/30 rounded-lg px-3 py-2">
          {message}
        </div>
      ) : null}

      <section className="bg-[#111] border border-gray-800 rounded-2xl p-5 space-y-4">
        <h2 className="text-lg font-bold">Brand / navbar</h2>
        <input
          className="input"
          placeholder="Business name"
          value={settings.businessName}
          onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
        />
        <input
          className="input"
          placeholder="Tagline under logo"
          value={settings.tagline}
          onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
        />
        <input
          className="input"
          placeholder="WhatsApp phone"
          value={settings.phone}
          onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
        />
        <input
          className="input"
          placeholder="WhatsApp button label"
          value={settings.whatsappCtaLabel}
          onChange={(e) => setSettings({ ...settings, whatsappCtaLabel: e.target.value })}
        />
        <div className="border-t border-gray-800 pt-4 space-y-3">
          <h3 className="text-sm font-semibold text-sigaYellow">Payment details (sent on WhatsApp)</h3>
          <input
            className="input"
            placeholder="Deposit label (e.g. R500 deposit)"
            value={settings.depositLabel}
            onChange={(e) => setSettings({ ...settings, depositLabel: e.target.value })}
          />
          <input
            className="input"
            placeholder="Account name"
            value={settings.accountName}
            onChange={(e) => setSettings({ ...settings, accountName: e.target.value })}
          />
          <input
            className="input"
            placeholder="Bank name"
            value={settings.bankName}
            onChange={(e) => setSettings({ ...settings, bankName: e.target.value })}
          />
          <input
            className="input"
            placeholder="Account number"
            value={settings.accountNumber}
            onChange={(e) => setSettings({ ...settings, accountNumber: e.target.value })}
          />
          <input
            className="input"
            placeholder="Branch code"
            value={settings.branchCode}
            onChange={(e) => setSettings({ ...settings, branchCode: e.target.value })}
          />
          <input
            className="input"
            placeholder="Payment reference hint"
            value={settings.referenceHint}
            onChange={(e) => setSettings({ ...settings, referenceHint: e.target.value })}
          />
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-2">Logo image</p>
          {settings.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={settings.logoUrl} alt="" className="h-12 w-12 rounded-full object-cover mb-2" />
          ) : null}
          <input type="file" accept="image/*" disabled={saving} onChange={(e) => uploadLogo(e.target.files?.[0] ?? null)} />
        </div>
      </section>

      <section className="bg-[#111] border border-gray-800 rounded-2xl p-5 space-y-4">
        <h2 className="text-lg font-bold">Hero</h2>
        <input
          className="input"
          placeholder="Headline"
          value={content.hero.headline}
          onChange={(e) => setContent({ ...content, hero: { ...content.hero, headline: e.target.value } })}
        />
        <input
          className="input"
          placeholder="Subhead"
          value={content.hero.subhead}
          onChange={(e) => setContent({ ...content, hero: { ...content.hero, subhead: e.target.value } })}
        />
        <div className="grid md:grid-cols-2 gap-3">
          <input
            className="input"
            placeholder="Primary button label"
            value={content.hero.primaryCta.label}
            onChange={(e) =>
              setContent({
                ...content,
                hero: { ...content.hero, primaryCta: { ...content.hero.primaryCta, label: e.target.value } },
              })
            }
          />
          <input
            className="input"
            placeholder="Primary button link"
            value={content.hero.primaryCta.href}
            onChange={(e) =>
              setContent({
                ...content,
                hero: { ...content.hero, primaryCta: { ...content.hero.primaryCta, href: e.target.value } },
              })
            }
          />
          <input
            className="input"
            placeholder="Secondary button label"
            value={content.hero.secondaryCta.label}
            onChange={(e) =>
              setContent({
                ...content,
                hero: { ...content.hero, secondaryCta: { ...content.hero.secondaryCta, label: e.target.value } },
              })
            }
          />
          <input
            className="input"
            placeholder="Secondary button link"
            value={content.hero.secondaryCta.href}
            onChange={(e) =>
              setContent({
                ...content,
                hero: { ...content.hero, secondaryCta: { ...content.hero.secondaryCta, href: e.target.value } },
              })
            }
          />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-2">Hero background photo</p>
            {content.hero.backgroundImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={content.hero.backgroundImageUrl} alt="" className="h-24 w-full object-cover rounded-lg mb-2" />
            ) : null}
            <input
              type="file"
              accept="image/*"
              disabled={saving}
              onChange={(e) => uploadHeroImage(e.target.files?.[0] ?? null)}
            />
            {content.hero.backgroundImageUrl ? (
              <button
                type="button"
                className="text-xs text-gray-400 mt-2 hover:text-white"
                onClick={() => setContent({ ...content, hero: { ...content.hero, backgroundImageUrl: undefined } })}
              >
                Remove photo
              </button>
            ) : null}
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-2">Hero video</p>
            {content.hero.videoUrl ? (
              <video src={content.hero.videoUrl} controls className="w-full max-h-28 rounded-lg mb-2" />
            ) : null}
            <input
              type="file"
              accept="video/*"
              disabled={saving}
              onChange={(e) => uploadHeroVideo(e.target.files?.[0] ?? null)}
            />
            {content.hero.videoUrl ? (
              <button
                type="button"
                className="text-xs text-gray-400 mt-2 hover:text-white"
                onClick={() => setContent({ ...content, hero: { ...content.hero, videoUrl: undefined } })}
              >
                Remove video
              </button>
            ) : null}
          </div>
        </div>
      </section>

      <section className="bg-[#111] border border-gray-800 rounded-2xl p-5 space-y-4">
        <h2 className="text-lg font-bold">Packages section titles</h2>
        <p className="text-xs text-gray-500">
          Package cards/photos are edited under <Link href="/admin/combos" className="text-sigaYellow">Combos</Link>.
        </p>
        <input
          className="input"
          placeholder="Section title"
          value={content.packages.title}
          onChange={(e) => setContent({ ...content, packages: { ...content.packages, title: e.target.value } })}
        />
        <textarea
          className="input min-h-[80px]"
          placeholder="Section subtitle"
          value={content.packages.subtitle}
          onChange={(e) => setContent({ ...content, packages: { ...content.packages, subtitle: e.target.value } })}
        />
      </section>

      <section className="bg-[#111] border border-gray-800 rounded-2xl p-5 space-y-4">
        <h2 className="text-lg font-bold">How it works</h2>
        <input
          className="input"
          placeholder="Section title"
          value={content.howItWorks.title}
          onChange={(e) =>
            setContent({ ...content, howItWorks: { ...content.howItWorks, title: e.target.value } })
          }
        />
        {content.howItWorks.steps.map((step, index) => (
          <div key={index} className="grid md:grid-cols-2 gap-3 border border-gray-800 rounded-xl p-3">
            <input
              className="input"
              placeholder={`Step ${index + 1} title`}
              value={step.title}
              onChange={(e) => {
                const steps = content.howItWorks.steps.map((s, i) =>
                  i === index ? { ...s, title: e.target.value } : s
                );
                setContent({ ...content, howItWorks: { ...content.howItWorks, steps } });
              }}
            />
            <input
              className="input"
              placeholder="Optional body"
              value={step.body ?? ""}
              onChange={(e) => {
                const steps = content.howItWorks.steps.map((s, i) =>
                  i === index ? { ...s, body: e.target.value } : s
                );
                setContent({ ...content, howItWorks: { ...content.howItWorks, steps } });
              }}
            />
          </div>
        ))}
      </section>

      <section className="bg-[#111] border border-gray-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold">More services</h2>
          <button type="button" onClick={addServiceCard} className="text-xs font-semibold text-sigaYellow border border-sigaYellow/40 rounded-lg px-3 py-1.5">
            Add service card
          </button>
        </div>
        <input
          className="input"
          placeholder="Section title"
          value={content.moreServices.title}
          onChange={(e) =>
            setContent({ ...content, moreServices: { ...content.moreServices, title: e.target.value } })
          }
        />
        <input
          className="input"
          placeholder="Subtitle (optional)"
          value={content.moreServices.subtitle ?? ""}
          onChange={(e) =>
            setContent({ ...content, moreServices: { ...content.moreServices, subtitle: e.target.value } })
          }
        />
        {content.moreServices.items.map((item, index) => (
          <div key={item.id} className="border border-gray-800 rounded-xl p-4 space-y-3">
            <div className="flex justify-between gap-2">
              <p className="text-sm font-semibold text-gray-300">Card {index + 1}</p>
              <button
                type="button"
                className="text-xs text-red-400"
                onClick={() =>
                  setContent({
                    ...content,
                    moreServices: {
                      ...content.moreServices,
                      items: content.moreServices.items.filter((_, i) => i !== index),
                    },
                  })
                }
              >
                Remove
              </button>
            </div>
            <input
              className="input"
              placeholder="Title"
              value={item.title}
              onChange={(e) => {
                const items = content.moreServices.items.map((row, i) =>
                  i === index ? { ...row, title: e.target.value } : row
                );
                setContent({ ...content, moreServices: { ...content.moreServices, items } });
              }}
            />
            <textarea
              className="input min-h-[70px]"
              placeholder="Description"
              value={item.body}
              onChange={(e) => {
                const items = content.moreServices.items.map((row, i) =>
                  i === index ? { ...row, body: e.target.value } : row
                );
                setContent({ ...content, moreServices: { ...content.moreServices, items } });
              }}
            />
            <div className="grid md:grid-cols-2 gap-3">
              <input
                className="input"
                placeholder="Link (e.g. /combos)"
                value={item.href}
                onChange={(e) => {
                  const items = content.moreServices.items.map((row, i) =>
                    i === index ? { ...row, href: e.target.value } : row
                  );
                  setContent({ ...content, moreServices: { ...content.moreServices, items } });
                }}
              />
              <input
                className="input"
                placeholder="Button label"
                value={item.ctaLabel}
                onChange={(e) => {
                  const items = content.moreServices.items.map((row, i) =>
                    i === index ? { ...row, ctaLabel: e.target.value } : row
                  );
                  setContent({ ...content, moreServices: { ...content.moreServices, items } });
                }}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-3 text-xs">
              <label className="block text-gray-500">
                Photo
                <input
                  type="file"
                  accept="image/*"
                  className="mt-1 block w-full"
                  disabled={saving}
                  onChange={(e) => uploadServiceMedia(index, "image", e.target.files?.[0] ?? null)}
                />
              </label>
              <label className="block text-gray-500">
                Video
                <input
                  type="file"
                  accept="video/*"
                  className="mt-1 block w-full"
                  disabled={saving}
                  onChange={(e) => uploadServiceMedia(index, "video", e.target.files?.[0] ?? null)}
                />
              </label>
            </div>
          </div>
        ))}
      </section>

      <section className="bg-[#111] border border-gray-800 rounded-2xl p-5 space-y-4">
        <h2 className="text-lg font-bold">Terms & conditions</h2>
        <input
          className="input"
          placeholder="Section title"
          value={content.termsAndConditions.title}
          onChange={(e) =>
            setContent({
              ...content,
              termsAndConditions: { ...content.termsAndConditions, title: e.target.value },
            })
          }
        />
        <input
          className="input"
          placeholder="Poster image URL (optional)"
          value={content.termsAndConditions.posterImageUrl ?? ""}
          onChange={(e) =>
            setContent({
              ...content,
              termsAndConditions: { ...content.termsAndConditions, posterImageUrl: e.target.value },
            })
          }
        />
        {content.termsAndConditions.items.map((term, index) => (
          <div key={index} className="flex gap-2">
            <input
              className="input"
              placeholder={`Term ${index + 1}`}
              value={term}
              onChange={(e) => {
                const items = content.termsAndConditions.items.map((row, i) =>
                  i === index ? e.target.value : row
                );
                setContent({
                  ...content,
                  termsAndConditions: { ...content.termsAndConditions, items },
                });
              }}
            />
            <button
              type="button"
              className="text-xs text-red-400 shrink-0 px-2"
              onClick={() =>
                setContent({
                  ...content,
                  termsAndConditions: {
                    ...content.termsAndConditions,
                    items: content.termsAndConditions.items.filter((_, i) => i !== index),
                  },
                })
              }
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className="text-xs font-semibold text-sigaYellow border border-sigaYellow/40 rounded-lg px-3 py-1.5"
          onClick={() =>
            setContent({
              ...content,
              termsAndConditions: {
                ...content.termsAndConditions,
                items: [...content.termsAndConditions.items, ""],
              },
            })
          }
        >
          Add term
        </button>
      </section>

      <section className="bg-[#111] border border-gray-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold">Custom sections</h2>
            <p className="text-xs text-gray-500 mt-1">Add promos, gallery blocks, or offers to the homepage.</p>
          </div>
          <button
            type="button"
            onClick={addCustomSection}
            className="text-xs font-semibold text-sigaYellow border border-sigaYellow/40 rounded-lg px-3 py-1.5"
          >
            Add section
          </button>
        </div>

        {content.customSections.length === 0 ? (
          <p className="text-sm text-gray-500">No custom sections yet.</p>
        ) : (
          content.customSections.map((section) => (
            <div key={section.id} className="border border-gray-800 rounded-xl p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={section.enabled}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        customSections: content.customSections.map((s) =>
                          s.id === section.id ? { ...s, enabled: e.target.checked } : s
                        ),
                      })
                    }
                  />
                  Show on site
                </label>
                <button
                  type="button"
                  className="text-xs text-red-400"
                  onClick={() =>
                    setContent({
                      ...content,
                      customSections: content.customSections.filter((s) => s.id !== section.id),
                    })
                  }
                >
                  Delete section
                </button>
              </div>
              <input
                className="input"
                placeholder="Title"
                value={section.title}
                onChange={(e) =>
                  setContent({
                    ...content,
                    customSections: content.customSections.map((s) =>
                      s.id === section.id ? { ...s, title: e.target.value } : s
                    ),
                  })
                }
              />
              <textarea
                className="input min-h-[90px]"
                placeholder="Body text"
                value={section.body}
                onChange={(e) =>
                  setContent({
                    ...content,
                    customSections: content.customSections.map((s) =>
                      s.id === section.id ? { ...s, body: e.target.value } : s
                    ),
                  })
                }
              />
              <div className="grid md:grid-cols-2 gap-3">
                <input
                  className="input"
                  placeholder="Button label (optional)"
                  value={section.ctaLabel ?? ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      customSections: content.customSections.map((s) =>
                        s.id === section.id ? { ...s, ctaLabel: e.target.value } : s
                      ),
                    })
                  }
                />
                <input
                  className="input"
                  placeholder="Button link (optional)"
                  value={section.ctaHref ?? ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      customSections: content.customSections.map((s) =>
                        s.id === section.id ? { ...s, ctaHref: e.target.value } : s
                      ),
                    })
                  }
                />
              </div>
              <div className="grid md:grid-cols-2 gap-3 text-xs">
                <label className="block text-gray-500">
                  Photo
                  <input
                    type="file"
                    accept="image/*"
                    className="mt-1 block w-full"
                    disabled={saving}
                    onChange={(e) => uploadCustomMedia(section.id, "image", e.target.files?.[0] ?? null)}
                  />
                </label>
                <label className="block text-gray-500">
                  Video
                  <input
                    type="file"
                    accept="video/*"
                    className="mt-1 block w-full"
                    disabled={saving}
                    onChange={(e) => uploadCustomMedia(section.id, "video", e.target.files?.[0] ?? null)}
                  />
                </label>
              </div>
            </div>
          ))
        )}
      </section>

      <div className="sticky bottom-4">
        <button type="button" disabled={saving} onClick={handleSave} className="btn disabled:opacity-50 shadow-lg">
          {saving ? "Saving…" : "Save all changes"}
        </button>
      </div>
    </div>
  );
}
