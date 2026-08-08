export const business = {
  name: "SIGA AUDIO SA",
  phone: "0682824322",
  logo: "",
  primaryColor: "#FFD400",
};

export function whatsappPhone() {
  // If phone is stored like `0682824322`, convert to a typical `27xxxxxxxxx` WhatsApp number.
  if (!business.phone) return "";
  return business.phone.startsWith("0") ? `27${business.phone.slice(1)}` : business.phone;
}

