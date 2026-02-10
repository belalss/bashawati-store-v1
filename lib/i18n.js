// lib/i18n.js

export const LANG_KEY = "store_lang";

export const LANGS = {
  ar: { code: "ar", label: "عربي", dir: "rtl" },
  en: { code: "en", label: "EN", dir: "ltr" },
};

export function getInitialLang() {
  if (typeof window === "undefined") return "ar";
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === "ar" || saved === "en") return saved;
  } catch {}
  return "ar";
}

export function setLang(lang) {
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch {}
}

export function t(lang, key) {
  const dict = translations[lang] || translations.ar;
  return dict[key] || key;
}

const translations = {
  ar: {
    cart: "السلة",
    close: "إغلاق",
    send_whatsapp: "إرسال عبر واتساب",
    customer_info: "بيانات العميل",
    name: "الاسم",
    phone: "الهاتف",
    address: "العنوان",
    order_note: "ملاحظة الطلب",
    delivery: "توصيل",
    pickup: "استلام",
    select_area: "اختر المنطقة",
    promo_code: "كود الخصم",
    apply: "تطبيق",
    remove: "إزالة",
    total: "الإجمالي",
    discount: "الخصم",
    delivery_fee: "رسوم التوصيل",
  },
  en: {
    cart: "Cart",
    close: "Close",
    send_whatsapp: "Send via WhatsApp",
    customer_info: "Customer Info",
    name: "Name",
    phone: "Phone",
    address: "Address",
    order_note: "Order Note",
    delivery: "Delivery",
    pickup: "Pickup",
    select_area: "Select area",
    promo_code: "Promo code",
    apply: "Apply",
    remove: "Remove",
    total: "Total",
    discount: "Discount",
    delivery_fee: "Delivery fee",
  },
};
