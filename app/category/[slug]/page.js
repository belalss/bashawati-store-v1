"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { categories, products } from "@/lib/data";

function getPriceRange(options = []) {
  if (!options.length) return "";
  const prices = options.map((o) => o.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max ? `${min} JD` : `${min} - ${max} JD`;
}

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug;

  const category = categories.find((c) => c.slug === slug);
  const categoryProducts = products.filter((p) => p.categorySlug === slug);

  if (!category) {
    return (
      <div className="container">
        <h2>Category not found</h2>
      </div>
    );
  }

  return (
    <div className="container page">
      <div className="header">
        <div>
          <h1 style={{ margin: 0 }}>{category.title}</h1>
          <p className="desc" style={{ marginTop: 8 }}>
            {category.description}
          </p>
        </div>
      </div>

{/* Category quick navigation */}
<div style={{ display: "flex", gap: 12, marginBottom: 10 }}>
  <Link href="/" className="backLink">🏠 Home</Link>

  
</div>
<div className="productCatRow">
  {categories.map((c) => (
    <Link
      key={c.slug}
      href={`/category/${c.slug}`}
      className={`productCatCard ${
        c.slug === slug ? "active" : ""
      }`}
    >
      {c.image && (
        <img
          src={c.image}
          alt={c.title}
          className="product-imagecat"
        />
      )}
      <div className="productCatTitle">{c.title}</div>
    </Link>
  ))}
</div>



      <div className="grid">
        {categoryProducts.map((p) => (
          <Link
            key={p.id}
            href={`/product/${p.slug}`}
            className="card"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <img src={p.images?.[0]} alt={p.name} className="product-image" />

            <h3 style={{ marginTop: 10, marginBottom: 6 }}>{p.name}</h3>
            <p className="desc">{p.description}</p>

            <div style={{ marginTop: "auto", fontWeight: 700 }}>
              {getPriceRange(p.options)}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
