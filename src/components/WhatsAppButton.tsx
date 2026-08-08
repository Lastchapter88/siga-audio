"use client";

import { whatsappPhone } from "@/lib/businessConfig";

export default function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${whatsappPhone()}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-400 text-white px-4 py-3 rounded-full shadow-lg text-xs font-semibold flex items-center gap-2 z-30"
    >
      <span>Chat on WhatsApp</span>
    </a>
  );
}

