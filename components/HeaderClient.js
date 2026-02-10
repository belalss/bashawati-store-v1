"use client";

import React from "react";
import CartDrawer from "@/components/CartDrawer";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import {
  getCart,
  getCartCount,
  setItemQuantity,
  removeItem,
  clearCart,
} from "@/lib/cart";

import { computePromo, loadPromo, savePromo } from "@/lib/promo";

import LangToggle from "@/components/LangToggle";
import HtmlLangSync from "@/components/HtmlLangSync";
import { getInitialLang, setLang as saveLang } from "@/lib/i18n";
import { getNextOrderNumber } from "@/lib/orderNumber";

const STORE = {
  name: "البشاواتي",
  whatsapp: "962799304026",
};

const CUSTOMER_KEY = "customer";
const ORDER_NOTE_KEY = "orderNote";
const CHECKOUT_KEY = "checkout";

const DELIVERY_AREAS = [
  { label: "Amman - Abdoun", fee: 2.0 },
  { label: "Amman - Sweifieh", fee: 2.0 },
  { label: "Amman - Khalda", fee: 2.5 },
  { label: "Amman - Tabarbour", fee: 2.5 },
];

function loadCheckout() {
  try {
    return JSON.parse(
      localStorage.getItem(CHECKOUT_KEY) ||
        '{"method":"pickup","area":"","deliveryFee":0}'
    );
  } catch {
    return { method: "pickup", area: "", deliveryFee: 0 };
  }
}

function saveCheckout(v) {
  try {
    localStorage.setItem(CHECKOUT_KEY, JSON.stringify(v));
  } catch {}
}

function loadCustomer() {
  try {
    return JSON.parse(
      localStorage.getItem(CUSTOMER_KEY) || '{"name":"","phone":"","address":""}'
    );
  } catch {
    return { name: "", phone: "", address: "" };
  }
}

function saveCustomer(c) {
  try {
    localStorage.setItem(CUSTOMER_KEY, JSON.stringify(c));
  } catch {}
}

function loadOrderNote() {
  try {
    return localStorage.getItem(ORDER_NOTE_KEY) || "";
  } catch {
    return "";
  }
}

function saveOrderNote(v) {
  try {
    localStorage.setItem(ORDER_NOTE_KEY, v || "");
  } catch {}
}

function promoReasonToArabic(res) {
  if (!res) return "تعذر تطبيق كود الخصم";
  if (res.reason === "invalid") return "كود الخصم غير صحيح";
  if (res.reason === "expired") return "كود الخصم منتهي";
  if (res.reason === "minSubtotal")
    return `الحد الأدنى للطلب ${res.minSubtotal} د.أ`;
  if (res.reason === "deliveryOnly") return "هذا الكود للتوصيل فقط";
  return "تعذر تطبيق كود الخصم";
}

export default function HeaderClient() {
  // ✅ Language hooks MUST be at top of component
  const [lang, setLangState] = React.useState("ar");

  // UI state
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [cartCount, setCartCount] = React.useState(0);
  const [cart, setCart] = React.useState([]);
  const [total, setTotal] = React.useState(0);

  const [customer, setCustomer] = React.useState({
    name: "",
    phone: "",
    address: "",
  });

  const [orderNote, setOrderNote] = React.useState("");

  const [checkout, setCheckout] = React.useState({
    method: "pickup",
    area: "",
    deliveryFee: 0,
  });

  // ✅ Promo state
  const [promoInput, setPromoInput] = React.useState("");
  const [promo, setPromo] = React.useState(null);
  const [promoError, setPromoError] = React.useState("");

  const recalc = React.useCallback(() => {
    const c = getCart();
    setCart(c);
    setTotal(c.reduce((sum, item) => sum + item.price * item.quantity, 0));
    setCartCount(getCartCount());
  }, []);

  // ✅ Load once: cart + customer + checkout + note + promo + lang
  React.useEffect(() => {
    recalc();

    setCustomer(loadCustomer());
    setCheckout(loadCheckout());
    setOrderNote(loadOrderNote());

    const savedPromo = loadPromo();
    if (savedPromo?.code) {
      setPromoInput(savedPromo.code);
      setPromo({ code: savedPromo.code }); // will be computed by effect below
    }

    setLangState(getInitialLang());
  }, [recalc]);

  function changeLang(next) {
    setLangState(next);
    saveLang(next);
  }

  // ✅ Save customer / note / checkout
  React.useEffect(() => {
    saveCustomer(customer);
  }, [customer]);

  React.useEffect(() => {
    saveOrderNote(orderNote);
  }, [orderNote]);

  React.useEffect(() => {
    saveCheckout(checkout);
  }, [checkout]);

  // ✅ Refresh cart on focus
  React.useEffect(() => {
    const onFocus = () => recalc();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [recalc]);

  // ✅ Refresh cart on cartUpdated event
  React.useEffect(() => {
    const handler = () => recalc();
    window.addEventListener("cartUpdated", handler);
    return () => window.removeEventListener("cartUpdated", handler);
  }, [recalc]);

  // cart actions
  const incItem = (item) => {
    setItemQuantity(item.cartKey, item.quantity + 1);
    recalc();
  };

  const decItem = (item) => {
    setItemQuantity(item.cartKey, item.quantity - 1);
    recalc();
  };

  const removeCartItem = (item) => {
    removeItem(item.cartKey);
    recalc();
  };

  // -------------------------
  // ✅ Promo computation
  // -------------------------
  const subtotal = total;
  const baseDeliveryFee =
    checkout.method === "delivery" ? Number(checkout.deliveryFee || 0) : 0;

  React.useEffect(() => {
    if (!promo?.code) return;

    const res = computePromo({
      code: promo.code,
      subtotal,
      deliveryFee: baseDeliveryFee,
      mode: checkout.method,
    });

    if (res.ok) {
      setPromo(res);
      savePromo({ code: res.code });
      setPromoError("");
    } else {
      setPromo(null);
      savePromo(null);
      setPromoError(promoReasonToArabic(res));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtotal, baseDeliveryFee, checkout.method]);

  function applyPromo() {
    const res = computePromo({
      code: promoInput,
      subtotal,
      deliveryFee: baseDeliveryFee,
      mode: checkout.method,
    });

    if (res.ok) {
      setPromo(res);
      savePromo({ code: res.code });
      setPromoError("");
    } else {
      setPromo(null);
      savePromo(null);
      setPromoError(promoReasonToArabic(res));
    }
  }

  function clearPromo() {
    setPromo(null);
    setPromoInput("");
    setPromoError("");
    savePromo(null);
  }

  const promoDiscount = promo?.ok ? Number(promo.discount || 0) : 0;
  const promoFreeDelivery = promo?.ok ? !!promo.freeDelivery : false;

  const finalDeliveryFee =
    checkout.method === "delivery"
      ? promoFreeDelivery
        ? 0
        : baseDeliveryFee
      : 0;

  const grandTotal = Math.max(0, subtotal - promoDiscount + finalDeliveryFee);

  // -------------------------
  // ✅ WhatsApp send
  // -------------------------
  const sendToWhatsApp = () => {
    const c = getCart();
const orderNumber = getNextOrderNumber();

    const url = buildWhatsAppUrl({
      phone: STORE.whatsapp,
      cart: c,
      storeName: STORE.name,
      customer,
      orderNote,
      checkout,
      deliveryFee: finalDeliveryFee,
      discount: promoDiscount,
      promoCode: promo?.ok ? promo.code : "",
      grandTotal,
      orderNumber
    });

    if (!url) {
      alert("Cart is empty");
      return;
    }

    window.open(url, "_blank");

    // clear cart only (keep customer)
    clearCart();
    recalc();
    setDrawerOpen(false);

    setOrderNote("");
    saveOrderNote("");
  };

  return (
    <>
      {/* Sync html lang/dir */}
      <HtmlLangSync lang={lang} />

      {/* Toggle + Cart button */}
      <LangToggle lang={lang} onChange={changeLang} />

      <button className="btn" onClick={() => setDrawerOpen(true)}>
        🛒 {cartCount}
      </button>

      <CartDrawer
        lang={lang}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        cart={cart}
        total={subtotal}
        onSend={sendToWhatsApp}
        onInc={incItem}
        onDec={decItem}
        onRemove={removeCartItem}
        customer={customer}
        onCustomerChange={setCustomer}
        orderNote={orderNote}
        onOrderNoteChange={setOrderNote}
        checkout={checkout}
        onCheckoutChange={setCheckout}
        deliveryAreas={DELIVERY_AREAS}
        promoInput={promoInput}
        onPromoInput={setPromoInput}
        onApplyPromo={applyPromo}
        onClearPromo={clearPromo}
        promo={promo}
        promoError={promoError}
        discount={promoDiscount}
        finalDeliveryFee={finalDeliveryFee}
        grandTotal={grandTotal}
      />
    </>
  );
}
