// lib/whatsapp.js

import { formatCurrency } from "@/lib/money";

/**
 * Builds a WhatsApp URL (wa.me) with an order message.
 * Supports Arabic/English via `lang`.
 */
export function buildWhatsAppUrl({
  phone,
  cart,
  storeName,
  customer,
  orderNote,
  checkout,

  // computed totals (from HeaderClient)
  promoCode = "",
  discount = 0,
  deliveryFee = 0,
  grandTotal,

  // extras
  orderNumber,
  lang = "ar",
}) {
  if (!cart || cart.length === 0) return null;

  const isAr = lang === "ar";
  const safe = (v) => (v == null ? "" : String(v));
  const money = (n) => formatCurrency(Number(n || 0), lang);

  const methodLabel = checkout?.method === "delivery"
    ? (isAr ? "توصيل" : "Delivery")
    : (isAr ? "استلام" : "Pickup");

  let message = "";

  // Header
  if (isAr) {
    message += `مرحباً، أود الطلب من ${storeName}\n`;
    if (orderNumber) message += `رقم الطلب: ${orderNumber}\n`;
    message += `\n`;
  } else {
    message += `Hello, I would like to order from ${storeName}:\n`;
    if (orderNumber) message += `Order ID: ${orderNumber}\n`;
    message += `\n`;
  }

  // Items
  message += isAr ? "🧁 المنتجات:\n" : "🧁 Items:\n";

  cart.forEach((item, i) => {
    const qty = Number(item.quantity || 0);
    const price = Number(item.price || 0);
    const lineTotal = price * qty;

    const name = safe(item.productName);
    const opt = safe(item.optionLabel);

    if (isAr) {
      message += `${i + 1}) ${name} - ${opt} ×${qty} = ${money(lineTotal)}\n`;
      if (item.note) message += `   ملاحظة الصنف: ${safe(item.note)}\n`;
    } else {
      message += `${i + 1}) ${name} - ${opt} x${qty} = ${money(lineTotal)}\n`;
      if (item.note) message += `   Item note: ${safe(item.note)}\n`;
    }
  });

  // Order type
  message += `\n${isAr ? "نوع الطلب" : "Order type"}: ${methodLabel}\n`;

  // Delivery details
  if (checkout?.method === "delivery") {
    if (isAr) {
      message += `المنطقة: ${safe(checkout?.area)}\n`;
      message += `رسوم التوصيل: ${money(deliveryFee)}\n`;
    } else {
      message += `Area: ${safe(checkout?.area)}\n`;
      message += `Delivery fee: ${money(deliveryFee)}\n`;
    }
  }

  // Promo / Discount
  const cleanCode = safe(promoCode).trim();
  const cleanDiscount = Number(discount || 0);

  if (cleanCode) {
    message += `\n${isAr ? "كود الخصم" : "Promo code"}: ${cleanCode}\n`;
  }
  if (cleanDiscount > 0) {
    message += `${isAr ? "الخصم" : "Discount"}: -${money(cleanDiscount)}\n`;
  }

  // Order note
  if (orderNote && safe(orderNote).trim()) {
    message += `\n${isAr ? "ملاحظة الطلب" : "Order note"}:\n${safe(orderNote).trim()}\n`;
  }

  // Customer info
  message += `\n${isAr ? "بيانات العميل" : "Customer Info"}:\n`;
  message += `${isAr ? "الاسم" : "Name"}: ${safe(customer?.name)}\n`;
  message += `${isAr ? "الهاتف" : "Phone"}: ${safe(customer?.phone)}\n`;

  // Address (always show, but it matters for delivery)
  message += `${isAr ? "العنوان" : "Address"}: ${safe(customer?.address)}\n`;

  // Grand total
  if (typeof grandTotal === "number") {
    message += `\n${isAr ? "الإجمالي" : "Grand total"}: ${money(grandTotal)}\n`;
  }

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
