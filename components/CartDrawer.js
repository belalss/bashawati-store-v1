"use client";

import React from "react";

export default function CartDrawer({
  open,
  onClose,
  cart,

  // totals
  discount = 0,
  finalDeliveryFee = 0,
  grandTotal,

  // checkout
  checkout,
  onCheckoutChange,
  deliveryAreas,

  // actions
  onSend,
  onInc,
  onDec,
  onRemove,

  // customer + note
  customer,
  onCustomerChange,
  orderNote,
  onOrderNoteChange,

  // promo
  promoInput,
  onPromoInput,
  onApplyPromo,
  onClearPromo,
  promo,
  promoError,
}) {
  if (!open) return null;

  const isDelivery = checkout?.method === "delivery";

  const canSend =
    cart.length > 0 &&
    !!customer?.name?.trim() &&
    !!customer?.phone?.trim() &&
    (!isDelivery || (!!customer?.address?.trim() && !!checkout?.area));

  const hasDiscount = Number(discount || 0) > 0;
  const hasPromo = !!promo?.ok;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        zIndex: 300,

        // ✅ important: allow absolute drawer positioning
        overflow: "hidden",
      }}
    >
      {/* ✅ Drawer locked to the RIGHT (never flips in RTL/LTR) */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "absolute",
          top: 0,
          right: 0, // ✅ always right
          height: "100%",
          width: "min(420px, 92vw)",
          background: "white",
          boxShadow: "-10px 0 30px rgba(0,0,0,0.15)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* HEADER (fixed) */}
        <div
          style={{
            padding: 16,
            borderBottom: "1px solid #eee",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            flex: "0 0 auto",
          }}
        >
          <h2 style={{ margin: 0 }}>Cart</h2>
          <button className="btn" onClick={onClose}>
            Close
          </button>
        </div>

        {/* ITEMS (scroll area #1) */}
        <div
          style={{
            maxHeight: "40vh",
            overflowY: "auto",
            padding: 16,
            borderBottom: "1px solid #eee",
          }}
        >
          {cart.length === 0 ? (
            <p style={{ marginTop: 0 }}>Cart is empty.</p>
          ) : (
            cart.map((item) => {
              const lineTotal =
                Number(item.price || 0) * Number(item.quantity || 0);

              return (
                <div
                  key={item.cartKey || `${item.productId}-${item.optionLabel}`}
                  style={{
                    padding: "10px 0",
                    borderBottom: "1px solid #f2f2f2",
                  }}
                >
                  <div style={{ fontWeight: 700 }}>{item.productName}</div>

                  <div style={{ fontSize: 14, opacity: 0.85, marginTop: 4 }}>
                    {item.optionLabel}
                  </div>

                  {item.note ? (
                    <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>
                      Item note: {item.note}
                    </div>
                  ) : null}

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginTop: 10,
                    }}
                  >
                    <button className="btn" onClick={() => onDec(item)}>
                      -
                    </button>

                    <div style={{ minWidth: 24, textAlign: "center" }}>
                      {item.quantity}
                    </div>

                    <button className="btn" onClick={() => onInc(item)}>
                      +
                    </button>

                    <div style={{ flex: 1 }} />

                    <button className="btn" onClick={() => onRemove(item)}>
                      Remove
                    </button>
                  </div>

                  <div style={{ fontSize: 14, marginTop: 8 }}>
                    {lineTotal.toFixed(2)} JD
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* DETAILS (scroll area #2) */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            padding: 16,
          }}
        >
          {/* Customer Info */}
          <div style={{ borderBottom: "1px solid #eee", paddingBottom: 12 }}>
            <h3 style={{ margin: "0 0 10px 0" }}>Customer Info</h3>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <input
                value={customer?.name || ""}
                onChange={(e) =>
                  onCustomerChange({ ...customer, name: e.target.value })
                }
                placeholder="Name"
                style={{
                  padding: 10,
                  border: "1px solid #ddd",
                  borderRadius: 10,
                }}
              />

              <input
                value={customer?.phone || ""}
                onChange={(e) =>
                  onCustomerChange({ ...customer, phone: e.target.value })
                }
                placeholder="Phone"
                style={{
                  padding: 10,
                  border: "1px solid #ddd",
                  borderRadius: 10,
                }}
              />

              <input
                value={customer?.address || ""}
                onChange={(e) =>
                  onCustomerChange({ ...customer, address: e.target.value })
                }
                placeholder="Address"
                style={{
                  padding: 10,
                  border: "1px solid #ddd",
                  borderRadius: 10,
                }}
              />
            </div>
          </div>

          {/* Order Note */}
          <div
            style={{
              paddingTop: 12,
              borderBottom: "1px solid #eee",
              paddingBottom: 12,
            }}
          >
            <h3 style={{ margin: "0 0 10px 0" }}>Order Note</h3>
            <textarea
              value={orderNote || ""}
              onChange={(e) => onOrderNoteChange(e.target.value)}
              placeholder="مثال: اتصل قبل الوصول / التوصيل بعد الساعة 6..."
              style={{
                width: "100%",
                height: 52,
                padding: 10,
                border: "1px solid #ddd",
                borderRadius: 10,
                resize: "none",
              }}
            />
          </div>

          {/* Delivery */}
          <div
            style={{
              paddingTop: 12,
              borderBottom: "1px solid #eee",
              paddingBottom: 12,
            }}
          >
            <h3 style={{ margin: "0 0 10px 0" }}>Delivery</h3>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                type="button"
                className="btn"
                onClick={() =>
                  onCheckoutChange({ method: "pickup", area: "", deliveryFee: 0 })
                }
                style={{ fontWeight: checkout?.method === "pickup" ? 700 : 400 }}
              >
                Pickup
              </button>

              <button
                type="button"
                className="btn"
                onClick={() =>
                  onCheckoutChange({ ...checkout, method: "delivery" })
                }
                style={{
                  fontWeight: checkout?.method === "delivery" ? 700 : 400,
                }}
              >
                Delivery
              </button>
            </div>

            {isDelivery && (
              <div
                style={{
                  marginTop: 10,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <select
                  value={checkout?.area || ""}
                  onChange={(e) => {
                    const area = e.target.value;
                    const found = deliveryAreas.find((a) => a.label === area);

                    onCheckoutChange({
                      ...checkout,
                      area,
                      deliveryFee: found ? found.fee : 0,
                    });
                  }}
                  style={{
                    padding: 10,
                    border: "1px solid #ddd",
                    borderRadius: 10,
                  }}
                >
                  <option value="">Select area</option>
                  {deliveryAreas.map((a) => (
                    <option key={a.label} value={a.label}>
                      {a.label} (+{a.fee} JD)
                    </option>
                  ))}
                </select>

                <div style={{ fontSize: 13, opacity: 0.8 }}>
                  Delivery fee: {Number(finalDeliveryFee || 0).toFixed(2)} JD
                  {hasPromo && promo?.freeDelivery ? " (Free delivery)" : ""}
                </div>

                <div style={{ fontSize: 12, opacity: 0.7 }}>
                  * Address is required for delivery
                </div>
              </div>
            )}
          </div>

          {/* Promo */}
          <div
            style={{
              paddingTop: 12,
              borderBottom: "1px solid #eee",
              paddingBottom: 12,
            }}
          >
            <h3 style={{ margin: "0 0 10px 0" }}>Promo Code</h3>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                value={promoInput || ""}
                onChange={(e) => onPromoInput?.(e.target.value)}
                placeholder="كود الخصم"
                style={{
                  flex: 1,
                  padding: 10,
                  border: "1px solid #ddd",
                  borderRadius: 10,
                }}
              />

              <button type="button" className="btn" onClick={onApplyPromo}>
                Apply
              </button>

              {hasPromo && (
                <button type="button" className="btn" onClick={onClearPromo}>
                  Remove
                </button>
              )}
            </div>

            {promoError ? (
              <div style={{ marginTop: 8, fontSize: 13, opacity: 0.8 }}>
                {promoError}
              </div>
            ) : null}

            {hasPromo ? (
              <div style={{ marginTop: 8, fontSize: 13 }}>
                ✅ Applied: <b>{promo.code}</b>
                {promo.type === "free_delivery" ? (
                  <div>🚚 Free delivery</div>
                ) : null}
              </div>
            ) : null}
          </div>

          {/* Total + Send */}
          <div style={{ paddingTop: 12, paddingBottom: 18 }}>
            {hasDiscount ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 8,
                  fontSize: 14,
                }}
              >
                <div>Discount</div>
                <div>-{Number(discount).toFixed(2)} JD</div>
              </div>
            ) : null}

            {isDelivery ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 8,
                  fontSize: 14,
                }}
              >
                <div>Delivery</div>
                <div>{Number(finalDeliveryFee || 0).toFixed(2)} JD</div>
              </div>
            ) : null}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <strong>Total</strong>
              <strong>{Number(grandTotal || 0).toFixed(2)} JD</strong>
            </div>

            <button
              className="btn"
              style={{ width: "100%", opacity: canSend ? 1 : 0.5 }}
              onClick={onSend}
              disabled={!canSend}
            >
              Send via WhatsApp
            </button>

            {!canSend && (
              <p style={{ fontSize: 13, opacity: 0.7, marginTop: 8 }}>
                Please enter your name and phone (and address + area for
                delivery).
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
