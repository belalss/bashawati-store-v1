import Link from "next/link";
import { categories, products } from "@/lib/data";

function getPriceRange(options = []) {
  if (!options.length) return "";
  const prices = options.map((o) => o.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max ? `${min} JD` : `${min} - ${max} JD`;
}

export default function Home() {
  const featured = products.filter((p) => p.featured);

  return (
    <div className="container page">
      <div className="header">
        <h1 style={{ margin: 0 }}>البشاواتي</h1>
      </div>

      {/* Categories */}
      <h2 style={{ marginTop: 10 }}>Categories</h2>

      <div className="catRow">
  {categories.map((cat) => (
    <Link
      key={cat.slug}
      href={`/category/${cat.slug}`}
      className="catCard"
    >
      {cat.image ? (
        <img
          src={cat.image}
          alt={cat.title}
          className="product-imagecat"
        />
      ) : null}

      <div className="catTitle">{cat.title}</div>
      <div className="catDesc">{cat.description}</div>
    </Link>
  ))}
</div>


      {/* Featured Products */}
      {featured.length > 0 && (
        <>
          <h2 style={{ marginTop: 28 }}>Featured Products</h2>

          <div className="grid">
            {featured.map((p) => (
              <Link
                key={p.id}
                href={`/product/${p.slug}`}
                className="card"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {p.featured ?<div className="badge">⭐ Featured</div>:null}
                <img
                  src={p.images?.[0]}
                  alt={p.name}
                  className="product-image"
                  style={{ borderRadius: 12 }}
                />

                <h3 style={{ marginTop: 10, marginBottom: 6 }}>{p.name}</h3>
                <p className="desc">{p.description}</p>

                <div style={{ marginTop: "auto", fontWeight: 700 }}>
                  {getPriceRange(p.options)}
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
