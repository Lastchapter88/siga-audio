"use client";

import { useSearchParams } from "next/navigation";
import BookingForm from "@/components/BookingForm";

export default function BookClient() {
  const params = useSearchParams();
  const comboSlug = params.get("combo");
  const businessId = params.get("businessId");

  return (
    <>
      {comboSlug ? (
        <p className="text-yellow-200 text-sm text-center mb-6">
          Selected combo: <span className="font-semibold text-sigaYellow">{comboSlug}</span>
        </p>
      ) : (
        <p className="text-gray-500 text-sm text-center mb-6">
          Choose a combo after you land on the form.
        </p>
      )}

      <BookingForm
        selectedComboSlug={comboSlug}
        selectedBusinessId={businessId}
        key={`${comboSlug ?? "none"}-${businessId ?? "none"}`}
      />
    </>
  );
}

