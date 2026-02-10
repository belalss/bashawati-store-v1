export function isBrowser(){
  return typeof window !== "undefined";
}
export function getCart() {
  if(!isBrowser()) return [];
  try {
    return JSON.parse(localStorage.getItem("cart") || "[]");
   
  } catch {
    return [];
    
  }
  

}

export function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ✅ Creates a stable unique key for each cart line
// Later if you have multiple selections: Size/Color/etc you can extend it
export function makeCartKey(productId, optionLabel) {
  return `${productId}||${optionLabel}`;
}

export function addItemToCart(product, option, qty = 1, note = "") {
  const cart = getCart();

  const cleanNote = (note || "").trim();

  const idx = cart.findIndex(
    (i) => i.productId === product.id && i.optionLabel === option.label
  );

  if (idx >= 0) {
    cart[idx].quantity += qty;

    // ✅ إذا المستخدم كتب ملاحظة جديدة، احفظها (تستبدل القديمة)
    if (cleanNote) cart[idx].note = cleanNote;
  } else {
    cart.push({
      productId: product.id,
      productName: product.name,
      optionLabel: option.label,
      price: option.price,
      quantity: qty,
      note: cleanNote, // ✅ new
    });
  }

  saveCart(cart);
  return cart;
}
export function getCartCount() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

export function setItemQuantity(cartKey, quantity) {
  const cart = getCart();
  const idx = cart.findIndex((i) => i.cartKey === cartKey);

  if (idx === -1) return cart;

  cart[idx].quantity = Math.max(1, quantity);

  saveCart(cart);
  return cart;
}

export function removeItem(cartKey) {
  const cart = getCart().filter((i) => i.cartKey !== cartKey);

  saveCart(cart);
  return cart;
}
export function clearCart() {
  saveCart([]);
  return [];
}
