export const PAYMENT = {
  depositLabel: "R500 deposit (EFT)",
  accountName: "SIGA AUDIO SA",
  bankName: "Please ask on WhatsApp for banking details",
  accountNumber: "",
  branchCode: "",
  referenceHint: "Use your WhatsApp/phone number as the payment reference",
  whatsappLocal: "0682824322",
} as const;

export function businessWhatsAppDigits(phone: string = PAYMENT.whatsappLocal): string {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("0") && digits.length === 10) return `27${digits.slice(1)}`;
  if (digits.startsWith("27")) return digits;
  return digits;
}

export function buildProofWhatsAppMessage(input?: {
  name?: string;
  phone?: string;
  comboName?: string;
  date?: string;
}): string {
  const lines = [
    `Hi SIGA AUDIO — here is my proof of payment.`,
    input?.name ? `Name: ${input.name}` : null,
    input?.phone ? `My number: ${input.phone}` : null,
    input?.comboName ? `Package: ${input.comboName}` : null,
    input?.date ? `Booking date: ${input.date}` : null,
    ``,
    `Please find the proof of payment attached / in the next message.`,
  ];
  return lines.filter((l) => l !== null).join("\n");
}

/** Direct chat link to send proof of payment on WhatsApp. */
export function proofOfPaymentWhatsAppUrl(
  businessPhone: string = PAYMENT.whatsappLocal,
  message?: string
): string {
  const digits = businessWhatsAppDigits(businessPhone || PAYMENT.whatsappLocal);
  const text = message || buildProofWhatsAppMessage();
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export function buildBookingWhatsAppMessage(input: {
  name: string;
  phone: string;
  email?: string;
  carModel: string;
  comboName: string;
  date: string;
  timeSlot: string;
  notes?: string;
  payment?: {
    depositLabel?: string;
    accountName?: string;
    bankName?: string;
    accountNumber?: string;
    branchCode?: string;
    referenceHint?: string;
  };
}): string {
  const p = { ...PAYMENT, ...(input.payment ?? {}) };
  const lines = [
    `Hi SIGA AUDIO — new booking request`,
    ``,
    `Name: ${input.name}`,
    `Phone: ${input.phone}`,
    input.email ? `Email: ${input.email}` : null,
    `Car: ${input.carModel}`,
    `Package: ${input.comboName}`,
    `Date: ${input.date}`,
    `Time: ${input.timeSlot}`,
    input.notes?.trim() ? `Notes: ${input.notes.trim()}` : null,
    ``,
    `--- Payment ---`,
    `Deposit: ${p.depositLabel}`,
    `Account name: ${p.accountName}`,
    p.bankName ? `Bank: ${p.bankName}` : null,
    p.accountNumber ? `Account no: ${p.accountNumber}` : null,
    p.branchCode ? `Branch: ${p.branchCode}` : null,
    `Reference: ${p.referenceHint}`,
    ``,
    `I will send my proof of payment on this WhatsApp chat.`,
  ];
  return lines.filter((l) => l !== null).join("\n");
}
