// Kode voucher dummy untuk simulasi diskon checkout.
export const VOUCHERS = {
  DISKON10: { type: "percent", value: 10, label: "Diskon 10%" },
  DISKON20: { type: "percent", value: 20, label: "Diskon 20%", minTotal: 100 },
  GRATISONGKIR: { type: "shipping", value: 0, label: "Gratis Ongkir" },
  POTONG5: { type: "flat", value: 5, label: "Potongan $5" },
};

export function validateVoucher(code, subtotal) {
  const voucher = VOUCHERS[code.trim().toUpperCase()];

  if (!voucher) {
    throw new Error("Kode voucher tidak valid");
  }

  if (voucher.minTotal && subtotal < voucher.minTotal) {
    throw new Error(
      `Minimal belanja $${voucher.minTotal} untuk pakai kode ini`
    );
  }

  return { code: code.trim().toUpperCase(), ...voucher };
}
