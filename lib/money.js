// lib/money.js

export function formatCurrency(amount, lang = "ar") {
  const n = Number(amount || 0);

  // ar-JO works well for Jordan formatting; en-JO for English
  const locale = lang === "ar" ? "ar-JO" : "en-JO";

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "JOD",
      maximumFractionDigits: 2,
    }).format(n);
  } catch {
    // fallback
    return `${n.toFixed(2)} JD`;
  }
}
