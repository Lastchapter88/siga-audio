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
  query,
  where,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import TimeSlots from "./TimeSlots";
import { combos as prebuiltCombos } from "@/data/combos";
import { useCustomerSession } from "@/components/CustomerSessionProvider";
import { updateCustomerContact } from "@/lib/customerAuth";
import { useSiteSettings } from "@/lib/pageContent";
import { buildBookingWhatsAppMessage, businessWhatsAppDigits, buildProofWhatsAppMessage, proofOfPaymentWhatsAppUrl } from "@/lib/paymentConfig";

type ComboDoc = {
  slug: string;
  name: string;
  businessId?: string;
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

  const catalogName = useMemo(() => {
    if (!selectedComboSlug) return "";
    return prebuiltCombos.find((c) => c.slug === selectedComboSlug)?.name ?? "";
  }, [selectedComboSlug]);

  const [comboName, setComboName] = useState<string>("");
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
    setComboName(catalogName);
  }, [catalogName]);

  useEffect(() => {
    if (!profile) return;
    if (profile.name) setName(profile.name);
    if (profile.phone) setPhone(profile.phone);
  }, [profile]);

  useEffect(() => {
    if (!selectedComboSlug) return;

    let cancelled = false;

    async function loadComboName() {
      try {
        const combosRef = collection(db, "combos");
        const constraints = [where("slug", "==", selectedComboSlug)];
        if (selectedBusinessId) constraints.push(where("businessId", "==", selectedBusinessId));

        const q = query(combosRef, ...constraints);
        const snap = await getDocs(q);
        const found = snap.docs[0]?.data() as ComboDoc | undefined;
        if (cancelled) return;
        if (found?.name) setComboName(found.name);
      } catch (err) {
        console.error(err);
      }
    }

    loadComboName();
    return () => {
      cancelled = true;
    };
  }, [selectedComboSlug, selectedBusinessId]);

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
      <div className="rounded-xl border border-sigaYellow/30 bg-sigaYellow/5 px-4 py-3 text-sm text-gray-200">
        Signed in as <span className="text-sigaYellow font-semibold">{user.email}</span>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-200 mb-2">Step 1 · Your Details</h3>
        <div className="space-y-3">
          <input
            name="name"
            placeholder="Full Name"
            className="input"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            name="phone"
            placeholder="WhatsApp Number (required)"
            className="input"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input name="carModel" placeholder="Car Model (e.g. Polo Vivo)" className="input" required />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-200 mb-2">Step 2 · Combo &amp; Slot</h3>
        <div className="space-y-3">
          <input type="hidden" name="combo" value={selectedComboSlug ?? ""} />
          <input type="hidden" name="businessId" value={businessIdValue} />
          <input
            name="comboName"
            placeholder="Selected Combo"
            value={comboName || catalogName}
            onChange={(e) => setComboName(e.target.value)}
            className="input"
            required
          />
          <input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} required />
          <TimeSlots selectedDate={date} value={timeSlot} onChange={setTimeSlot} />
        </div>
      </div>

      <div className="rounded-xl border border-gray-800 bg-[#0b0b0d] p-4 space-y-2">
        <h3 className="text-sm font-semibold text-sigaYellow">Payment details</h3>
        <p className="text-sm text-gray-300">{settings.depositLabel || "R500 deposit (EFT)"}</p>
        <p className="text-xs text-gray-400">Account name: {settings.accountName || "SIGA AUDIO SA"}</p>
        {settings.bankName ? <p className="text-xs text-gray-400">Bank: {settings.bankName}</p> : null}
        {settings.accountNumber ? <p className="text-xs text-gray-400">Account: {settings.accountNumber}</p> : null}
        {settings.branchCode ? <p className="text-xs text-gray-400">Branch: {settings.branchCode}</p> : null}
        <p className="text-xs text-gray-400">{settings.referenceHint}</p>
        <p className="text-xs text-gray-500">
          After submit we open WhatsApp to <span className="text-sigaYellow">{settings.phone || "0682824322"}</span> with
          your booking + payment info.
        </p>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-200 mb-2">Step 3 · Proof of Payment</h3>
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
              comboName: (comboName || catalogName) || undefined,
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
        By submitting you agree that this booking is only confirmed once {business.name} responds on WhatsApp.
      </p>
    </form>
  );
}
