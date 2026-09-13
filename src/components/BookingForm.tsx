"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { db, storage } from "@/lib/firebase";
import { business } from "@/lib/businessConfig";
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  setDoc,
  getDocs,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import TimeSlots from "./TimeSlots";
import { combos as prebuiltCombos } from "@/data/combos";
import { useCustomerSession } from "@/components/CustomerSessionProvider";
import { updateCustomerContact } from "@/lib/customerAuth";
import { useSiteSettings } from "@/lib/pageContent";
import { buildBookingWhatsAppMessage, businessWhatsAppDigits, buildProofWhatsAppMessage, proofOfPaymentWhatsAppUrl } from "@/lib/paymentConfig";

type ComboOption = {
  slug: string;
  name: string;
  price?: number;
};

type ComboDoc = {
  slug: string;
  name: string;
  businessId?: string;
  price?: number;
};

export default function BookingForm({
  selectedComboSlug,
  selectedBusinessId,
}: {
  selectedComboSlug?: string | null;
  selectedBusinessId?: string | null;
}) {
  const router = useRouter();
  const { authReady, user, profile, refreshProfile } = useCustomerSession();
  const { settings } = useSiteSettings();

  const [selectedSlug, setSelectedSlug] = useState<string>(selectedComboSlug ?? "");
  const [comboName, setComboName] = useState<string>("");
  const [comboOptions, setComboOptions] = useState<ComboOption[]>(() =>
    prebuiltCombos.map((c) => ({ slug: c.slug, name: c.name, price: c.price }))
  );
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const businessIdValue = useMemo(() => selectedBusinessId ?? "", [selectedBusinessId]);
  const nextBookPath = useMemo(() => {
    if (!selectedComboSlug) return "/book";
    const q = new URLSearchParams({ combo: selectedComboSlug });
    if (selectedBusinessId) q.set("businessId", selectedBusinessId);
    return `/book?${q.toString()}`;
  }, [selectedComboSlug, selectedBusinessId]);
  const accountHref = `/account?mode=signup&next=${encodeURIComponent(nextBookPath)}`;

  useEffect(() => {
    if (selectedComboSlug) setSelectedSlug(selectedComboSlug);
  }, [selectedComboSlug]);

  useEffect(() => {
    let cancelled = false;

    async function loadComboOptions() {
      try {
        const snap = await getDocs(collection(db, "combos"));
        const fetched = snap.docs
          .map((d) => {
            const data = d.data() as ComboDoc;
            return { slug: data.slug, name: data.name, price: data.price };
          })
          .filter((c) => c.slug && c.name);

        if (!cancelled && fetched.length > 0) {
          setComboOptions(fetched);
        }
      } catch (err) {
        console.error(err);
      }
    }

    void loadComboOptions();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const found = comboOptions.find((c) => c.slug === selectedSlug);
    setComboName(found?.name ?? "");
  }, [selectedSlug, comboOptions]);

  useEffect(() => {
    if (!profile) return;
    if (profile.name) setName(profile.name);
    if (profile.phone) setPhone(profile.phone);
  }, [profile]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) {
      router.push(accountHref);
      return;
    }

    const form = new FormData(e.currentTarget);
    const carModel = String(form.get("carModel") || "");
    const comboNameValue = String(form.get("comboName") || "");
    const comboSlug = String(form.get("combo") || "");
    const businessId = String(form.get("businessId") || "");
    const notes = String(form.get("notes") || "");
    const file = form.get("proof") as File | null;

    if (!name.trim() || !phone.trim()) {
      alert("Please enter your full name and WhatsApp phone number.");
      return;
    }
    if (!date || !timeSlot) {
      alert("Please select a date and time slot.");
      return;
    }
    if (!comboSlug) {
      alert("Please select a combo package.");
      return;
    }

    try {
      setLoading(true);

      await updateCustomerContact(user.uid, name, phone);
      await refreshProfile();

      const bookingRef = await addDoc(collection(db, "bookings"), {
        name: name.trim(),
        phone: phone.trim(),
        email: user.email ?? "",
        userId: user.uid,
        carModel,
        comboName: comboNameValue,
        combo: comboSlug,
        businessId,
        date,
        timeSlot,
        status: "pending",
        notes,
        proofUrl: "",
        createdAt: serverTimestamp(),
      });

      try {
        if (file && file.size > 0) {
          const storageRef = ref(storage, `proofs/${bookingRef.id}-${Date.now()}`);
          await uploadBytes(storageRef, file);
          const proofUrl = await getDownloadURL(storageRef);
          await setDoc(bookingRef, { proofUrl }, { merge: true });
        }
      } catch (uploadErr) {
        console.error(uploadErr);
        // Booking still saved; customer can send proof on WhatsApp.
      }

      await setDoc(doc(db, "slots", date), { [timeSlot]: "booked" }, { merge: true });

      const message = buildBookingWhatsAppMessage({
        name: name.trim(),
        phone: phone.trim(),
        email: user.email ?? undefined,
        carModel,
        comboName: comboNameValue,
        date,
        timeSlot,
        notes,
        payment: {
          depositLabel: settings.depositLabel,
          accountName: settings.accountName,
          bankName: settings.bankName,
          accountNumber: settings.accountNumber,
          branchCode: settings.branchCode,
          referenceHint: settings.referenceHint,
        },
      });

      const waDigits = businessWhatsAppDigits(settings.phone || "0682824322");
      const waUrl = `https://wa.me/${waDigits}?text=${encodeURIComponent(message)}`;
      const proofWaUrl = proofOfPaymentWhatsAppUrl(
        settings.phone || "0682824322",
        buildProofWhatsAppMessage({
          name: name.trim(),
          phone: phone.trim(),
          comboName: comboNameValue,
          date,
        })
      );

      router.push(
        `/success?wa=${encodeURIComponent(waUrl)}&proofWa=${encodeURIComponent(proofWaUrl)}`
      );
      if (typeof window !== "undefined") {
        window.open(waUrl, "_blank");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong submitting your booking. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!authReady) {
    return <p className="text-gray-400 text-sm text-center">Checking your account…</p>;
  }

  if (!user) {
    return (
      <div className="max-w-xl mx-auto bg-[#111] border border-gray-800 rounded-2xl p-8 text-center space-y-4">
        <h3 className="text-xl font-bold">Sign up to book</h3>
        <p className="text-gray-400 text-sm">
          Create a free account with your name and phone number so we can confirm your slot on WhatsApp and show your
          booking in the admin panel.
        </p>
        <Link href={accountHref} className="btn inline-flex justify-center">
          Sign up / Sign in
        </Link>
        <p className="text-xs text-gray-500">
          After signing in you&apos;ll return here to pick a date, pay the deposit, and send payment details on WhatsApp.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6">
      <div className="surface rounded-2xl px-5 py-4 text-sm text-gray-200">
        Signed in as <span className="font-semibold text-sigaYellow">{user.email}</span>
      </div>

      <div className="surface rounded-2xl p-5 md:p-6">
        <div className="mb-5 flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-sigaYellow text-sm font-bold text-black">01</span><div><h3 className="font-semibold text-white">Your details</h3><p className="text-xs text-gray-500">Tell us about you and the vehicle.</p></div></div>
        <div className="space-y-3">
          <label className="block text-xs font-medium text-gray-400">Full name<input name="name" placeholder="Full name" className="input mt-2" required value={name} onChange={(e) => setName(e.target.value)} /></label>
          <label className="block text-xs font-medium text-gray-400">WhatsApp number<input name="phone" placeholder="WhatsApp number" className="input mt-2" required value={phone} onChange={(e) => setPhone(e.target.value)} /></label>
          <label className="block text-xs font-medium text-gray-400">Vehicle model<input name="carModel" placeholder="e.g. Polo Vivo" className="input mt-2" required /></label>
        </div>
      </div>

      <div className="surface rounded-2xl p-5 md:p-6">
        <div className="mb-5 flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-sigaYellow text-sm font-bold text-black">02</span><div><h3 className="font-semibold text-white">Setup &amp; installation slot</h3><p className="text-xs text-gray-500">Choose the package and a date that works.</p></div></div>
        <div className="space-y-3">
          <input type="hidden" name="businessId" value={businessIdValue} />
          <input type="hidden" name="comboName" value={comboName} />
          <label className="block">
            <span className="sr-only">Select combo package</span>
            <select
              name="combo"
              className="input"
              value={selectedSlug}
              onChange={(e) => setSelectedSlug(e.target.value)}
              required
            >
              <option value="">Select a combo package</option>
              {comboOptions.map((combo) => (
                <option key={combo.slug} value={combo.slug}>
                  {combo.name}
                  {combo.price ? ` — R${combo.price.toLocaleString("en-ZA")}` : ""}
                </option>
              ))}
            </select>
          </label>
          <input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} required />
          <TimeSlots selectedDate={date} value={timeSlot} onChange={setTimeSlot} />
        </div>
      </div>

      <div className="rounded-2xl border border-sigaYellow/25 bg-sigaYellow/[0.06] p-5 space-y-2">
        <h3 className="text-sm font-semibold text-sigaYellow">Payment details</h3>
        <p className="text-sm text-gray-300">{settings.depositLabel || "R500 deposit (EFT)"}</p>
        <p className="text-xs text-gray-400">Account name: {settings.accountName || "SIGA AUDIO PTY LTD"}</p>
        <p className="text-xs text-gray-400">Bank: {settings.bankName || "Standard Bank"}</p>
        <p className="text-xs text-gray-400">Account no: {settings.accountNumber || "10264653678"}</p>
        {settings.branchCode ? <p className="text-xs text-gray-400">Branch: {settings.branchCode}</p> : null}
        <p className="text-xs text-gray-400">
          {settings.referenceHint || "Use your phone number as the payment reference"}
        </p>
        <p className="text-xs text-gray-500">
          After submit we open WhatsApp to <span className="text-sigaYellow">{settings.phone || "0682824322"}</span> with
          your booking + payment info.
        </p>
      </div>

      <div className="surface rounded-2xl p-5 md:p-6">
        <div className="mb-5 flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-sigaYellow text-sm font-bold text-black">03</span><div><h3 className="font-semibold text-white">Payment proof</h3><p className="text-xs text-gray-500">Send your EFT proof on WhatsApp or upload it.</p></div></div>
        <p className="text-xs text-gray-400 mb-3">
          Send your EFT proof on WhatsApp to{" "}
          <span className="text-sigaYellow font-semibold">{settings.phone || "0682824322"}</span>, or upload it below
          (optional).
        </p>
        <a
          href={proofOfPaymentWhatsAppUrl(
            settings.phone || "0682824322",
            buildProofWhatsAppMessage({
              name: name.trim() || undefined,
              phone: phone.trim() || undefined,
              comboName: comboName || undefined,
              date: date || undefined,
            })
          )}
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 bg-[#25D366] text-black font-bold py-3 rounded-xl hover:brightness-110 transition mb-4"
        >
          Send proof on WhatsApp ({settings.phone || "0682824322"})
        </a>
        <p className="text-xs text-gray-500 mb-2">Or upload here (optional):</p>
        <input name="proof" type="file" accept="image/*,application/pdf" className="text-xs text-gray-300" />
      </div>

      <div>
        <textarea
          name="notes"
          placeholder="Anything else we should know? (optional)"
          className="input min-h-[80px]"
        />
      </div>

      <button type="submit" className="btn" disabled={loading}>
        {loading ? "Submitting booking..." : "Book & Send on WhatsApp"}
      </button>

      <p className="text-[11px] text-gray-500 text-center">
        By submitting you agree to our{" "}
        <Link href="/#terms" className="text-sigaYellow hover:text-yellow-300 underline">
          terms & conditions
        </Link>{" "}
        and that this booking is only confirmed once {business.name} responds on WhatsApp.
      </p>
    </form>
  );
}
