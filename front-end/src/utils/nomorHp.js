export function toInternational(phone) {
  const digits = phone.replace(/\D/g, ""); // hapus semua non-angka

  if (digits.startsWith("62")) return "+62 " + formatLocal(digits.slice(2));
  if (digits.startsWith("0")) return "+62 " + formatLocal(digits.slice(1));
  return "+62 " + formatLocal(digits);
}

function formatLocal(n) {
  // 815-4249-8972
  return n.slice(0, 3) + "-" + n.slice(3, 7) + "-" + n.slice(7);
}
