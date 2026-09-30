import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { ProductGridSkeleton } from "@/components/ui/LoadingSkeleton";
import { Rating } from "@/components/ui/Rating";
import { PageShell } from "@/components/layout/PageShell";
import { ProductCard } from "@/components/product/ProductCard";
import { JsonLd, PageMeta } from "@/components/seo/PageMeta";
import { getBestSellers, getFeaturedProducts } from "@/services/productApi";
import { getHomeReviews, type HomeReview } from "@/services/reviewsApi";
import type { ProductListItem } from "@/types";

const FAMILIES = [
  { name: "Fresh", slug: "fresh" },
  { name: "Woody", slug: "woody" },
  { name: "Floral", slug: "floral" },
  { name: "Oriental", slug: "oriental" },
  { name: "Citrus", slug: "citrus" },
  { name: "Sweet", slug: "sweet" },
  { name: "Musky", slug: "musky" },
  { name: "Oud", slug: "oud" },
];

const PILLARS = [
  { title: "Premium Fragrances", copy: "Composed with restraint. Nothing decorative." },
  { title: "Selected Ingredients", copy: "Notes chosen for structure, not volume." },
  { title: "Customisable Perfumes", copy: "Size, fragrance, bottle and cap — one configuration." },
  { title: "Premium Packaging", copy: "The vessel is part of the perfume you create." },
  { title: "Quality-focused", copy: "Inventory on every component. Nothing sold that cannot be made." },
];

export function HomePage() {
  const [featured, setFeatured] = useState<ProductListItem[]>([]);
  const [best, setBest] = useState<ProductListItem[]>([]);
  const [reviews, setReviews] = useState<HomeReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getFeaturedProducts(), getBestSellers(), getHomeReviews()])
      .then(([a, b, c]) => {
        if (cancelled) return;
        setFeatured(a);
        setBest(b);
        setReviews(c);
      })
      .catch(() => {
        if (!cancelled) setError("Unable to load collections.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <PageMeta
        title="ROSADO PERFUME"
        description="Your Fragrance. Your Bottle. Your ROSADO. Compose a custom perfume or shop the maison collection."
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "ROSADO PERFUME",
          url: window.location.origin,
        }}
      />
      <section className="relative overflow-hidden bg-charcoal text-ivory">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/videos/ROSADO_PERFUME.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-charcoal/45" />
        <PageShell wide className="relative grid min-h-[78vh] items-end py-20 lg:items-center">
          <div className="max-w-xl">
            <p className="text-[11px] uppercase tracking-nav text-gold">Maison ROSADO</p>
            <h1 className="mt-4 font-display text-5xl leading-[0.95] sm:text-6xl lg:text-7xl">
              Your Fragrance. Your Bottle. Your ROSADO.
            </h1>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link to="/custom-perfume">
                <Button variant="gold">Create Your Perfume</Button>
              </Link>
              <Link to="/shop">
                <Button variant="secondary" className="border-ivory/40 text-ivory hover:border-ivory">
                  Shop Perfumes
                </Button>
              </Link>
            </div>
          </div>
        </PageShell>
      </section>

      <PageShell wide className="py-20">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-nav text-gold">Collection</p>
            <h2 className="mt-2 font-display text-4xl">Featured</h2>
          </div>
          <Link to="/shop" className="text-[11px] uppercase tracking-nav">
            View all
          </Link>
        </div>
        {loading ? <div className="mt-10"><ProductGridSkeleton /></div> : null}
        {error ? <ErrorState message={error} /> : null}
        {!loading && !error ? (
          <div className="mt-10 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : null}
      </PageShell>

      <section className="bg-cream/60 py-20">
        <PageShell wide>
          <p className="text-[11px] uppercase tracking-nav text-gold">Atelier</p>
          <h2 className="mt-2 font-display text-5xl">Compose, do not merely choose.</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {["Choose", "Customise", "Create"].map((label, index) => (
              <div key={label} className="border-t border-sand pt-6">
                <p className="text-[11px] uppercase tracking-nav text-stone">0{index + 1}</p>
                <p className="mt-3 font-display text-4xl">{label}</p>
                <p className="mt-3 text-sm leading-7 text-stone">
                  {index === 0 && "Select size and fragrance. Size becomes the rule for every bottle that follows."}
                  {index === 1 && "A bottle made for that size. A cap as a finishing component — never a product."}
                  {index === 2 && "Preview the exact configuration. Then it enters the cart as one perfume."}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Link to="/custom-perfume">
              <Button>Build Your Perfume</Button>
            </Link>
          </div>
        </PageShell>
      </section>

      <PageShell wide className="py-20">
        <h2 className="font-display text-4xl">Fragrance families</h2>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {FAMILIES.map((family) => (
            <Link
              key={family.slug}
              to={`/shop?family=${family.slug}`}
              className="border border-sand px-5 py-8 transition-colors hover:border-charcoal"
            >
              <span className="font-display text-2xl">{family.name}</span>
            </Link>
          ))}
        </div>
      </PageShell>

      <PageShell wide className="py-10">
        <h2 className="font-display text-4xl">Best sellers</h2>
        {loading ? <div className="mt-10"><ProductGridSkeleton /></div> : null}
        {!loading && !error ? (
          <div className="mt-10 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {best.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : null}
      </PageShell>

      <section className="bg-charcoal py-20 text-ivory">
        <PageShell wide>
          <h2 className="font-display text-4xl">Why ROSADO?</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-5">
            {PILLARS.map((item) => (
              <div key={item.title}>
                <p className="font-display text-2xl">{item.title}</p>
                <p className="mt-3 text-sm leading-7 text-sand">{item.copy}</p>
              </div>
            ))}
          </div>
        </PageShell>
      </section>

      <PageShell wide className="py-20">
        <h2 className="font-display text-4xl">Reviews</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {reviews.map((review) => (
            <blockquote key={review.id} className="border-t border-sand pt-6">
              <Rating value={review.rating} />
              <p className="mt-4 font-display text-2xl leading-snug">“{review.quote}”</p>
              <footer className="mt-4 text-xs uppercase tracking-nav text-stone">
                {review.name} · {review.city}
              </footer>
            </blockquote>
          ))}
        </div>
      </PageShell>

      <section className="border-y border-sand py-20">
        <PageShell className="grid items-center gap-10 md:grid-cols-2">
          <img
            src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1200&q=80"
            alt="ROSADO atelier still life"
            className="aspect-[4/5] w-full object-cover"
          />
          <div>
            <p className="text-[11px] uppercase tracking-nav text-gold">Brand story</p>
            <h2 className="mt-3 font-display text-5xl">A maison for composed fragrance.</h2>
            <p className="mt-6 text-sm leading-8 text-stone">
              ROSADO is built around one idea: you should create a perfume, not merely select a SKU. Size, fragrance,
              vessel and finish are chosen in sequence. The bottle is never the product. The perfume you leave with is.
            </p>
            <div className="mt-8">
              <Link to="/about">
                <Button variant="secondary">About ROSADO</Button>
              </Link>
            </div>
          </div>
        </PageShell>
      </section>
    </>
  );
}
