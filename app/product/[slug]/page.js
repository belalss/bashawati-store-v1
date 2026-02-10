"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { products } from "@/lib/data";
import { addItemToCart} from "@/lib/cart";
import { categories } from "@/lib/data";

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug;

  const product = products.find((p) => p.slug === slug);

  const [activeImg, setActiveImg] = React.useState(0);
  const [selectedOpt, setSelectedOpt] = React.useState(null);
  const [qty, setQty] = React.useState(1);
  const [note, setNote] = React.useState("");
  

  React.useEffect(() => {
    if (product?.options?.length) setSelectedOpt(product.options[0]);
  }, [product]);

  if (!product) {
    return (
      <div className="container page">
        <h1>Product not found</h1>
        <Link href="/">Back home</Link>
      </div>
    );
  }

  const images = product.images?.length ? product.images : [product.image].filter(Boolean);
  const mainImage = images[activeImg] || images[0];

  const minPrice = Math.min(...product.options.map((o) => o.price));
  const maxPrice = Math.max(...product.options.map((o) => o.price));

  const priceText =
    minPrice === maxPrice ? `${minPrice} JD` : `${minPrice} - ${maxPrice} JD`;

  const addToCartNow = () => {
    if (!selectedOpt) return;
    addItemToCart(product, selectedOpt, qty, note);
    alert("Added to cart ✅");
  };

  const related = products
    .filter((p) => p.categorySlug === product.categorySlug && p.slug !== product.slug)
    .slice(0, 6);

  return (
    
    <div className="container page">
      {/* Top navigation */}
{/* Top navigation */}
<div style={{ display: "flex", gap: 12, marginBottom: 10 }}>
  <Link href="/" className="backLink">🏠 Home</Link>


</div>
{/* Category quick row */}
<div className="productCatRow">
  {categories.map((c) => (
    <Link
      key={c.slug}
      href={`/category/${c.slug}`}
      className={`productCatCard ${c.slug === product.categorySlug ? "catActive" : ""}`}
    >
      {c.image && (
        <img src={c.image} alt={c.title} className="product-imagecat" />
      )}
      <div className="productCatTitle">{c.title}</div>
    </Link>
  
  ))}
 

</div>

      {/* Top row: Back + icons */}
      <div className="productTopBar">
        

        <div className="topIcons">
          <button className="iconBtn" type="button" title="Favorite">♡</button>
          <button
            className="iconBtn"
            type="button"
            title="Share"
            onClick={() => navigator.clipboard?.writeText(window.location.href)}
          >
            ↗
          </button>
          
        </div>
      </div>

      {/* Main layout */}
      <div className="productLayout">
        {/* Left: Gallery */}
        <div className="productLeft">
          <div className="productImageBox">
            <img src={mainImage} alt={product.name} className="product-image-lg" />
          </div>

          {images.length > 1 && (
            <div className="thumbRow">
              {images.map((src, idx) => (
                <button
                  key={src + idx}
                  className={`thumbBtn ${idx === activeImg ? "thumbActive" : ""}`}
                  onClick={() => setActiveImg(idx)}
                  type="button"
                >
                  <img src={src} alt={`${product.name} ${idx + 1}`} className="thumbImg" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details */}
        <div className="productRight">
          <h1 className="productTitle">{product.name}</h1>
          <div className="productPriceRange">{priceText}</div>

          <hr className="line" />

          {/* Options (radio) */}
          <div className="optList">
            {product.options.map((opt) => {
              const label =
                opt.qty != null && opt.uom
                  ? `${opt.label} (${opt.qty} ${opt.uom})`
                  : opt.uom
                  ? `${opt.label} (${opt.uom})`
                  : opt.label;

              const checked = selectedOpt?.label === opt.label;

              return (
                <label key={opt.label} className="optRow">
                  <input
                    type="radio"
                    name="opt"
                    checked={checked}
                    onChange={() => setSelectedOpt(opt)}
                  />
                  <div className="optLabel">{label}</div>
                  <div className="optPrice">{opt.price} JD</div>
                </label>
              );
            })}
          </div>

          <hr className="line" />

          {/* Notes */}
          <div className="notesBox">
            <div className="notesTitle">ملاحظات</div>
            <div className="notesHint">Optional</div>
            <textarea
              className="notesInput"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="مثال: بدون فستق / زيادة قطر..."
            />
          </div>

          <hr className="line" />

          {/* Quantity */}
          <div className="qtyRow">
            <div className="qtyText">
              Quantity {selectedOpt ? `(${selectedOpt.label})` : ""}
            </div>

            <div className="qtyStepper">
              <button className="qtyBtn" type="button" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                −
              </button>
              <div className="qtyNum">{qty}</div>
              <button className="qtyBtn" type="button" onClick={() => setQty((q) => q + 1)}>
                +
              </button>
            </div>
          </div>

          {/* Add button */}
          <button className="addMainBtn" type="button" onClick={addToCartNow}>
            Add{" "}
            <span className="addPrice">
              {selectedOpt ? (selectedOpt.price * qty).toFixed(3) : ""} JD
            </span>
          </button>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div style={{ marginTop: 28 }}>
          <h2>You may also like</h2>
          <div className="grid">
            {related.map((p) => (
              <Link
                key={p.slug}
                href={`/product/${p.slug}`}
                className="card"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <img src={p.images?.[0]} alt={p.name} className="product-image" />
                <h3 style={{ marginTop: 10, marginBottom: 6 }}>{p.name}</h3>
                <div className="desc">{p.description}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
