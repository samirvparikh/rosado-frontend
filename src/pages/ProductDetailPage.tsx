import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { Price } from "@/components/ui/Price";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { Rating } from "@/components/ui/Rating";
import { PageShell } from "@/components/layout/PageShell";
import { JsonLd, PageMeta } from "@/components/seo/PageMeta";
import { useCart } from "@/hooks/useCart";
import { useWishlistStore } from "@/store/wishlistStore";
import { getFragranceById } from "@/services/fragranceApi";
import { getProductBySlug, resolveClassificationNames } from "@/services/productApi";
import { getSizes } from "@/services/sizeApi";
import { ApiError } from "@/services/http";
import type { FragranceWithNotes, ProductDetail, Size } from "@/types";

export function ProductDetailPage() {
  const { slug = "" } = useParams();
  const navigate = useNavigate();
  const { addReadyMade } = useCart();
  const toggle = useWishlistStore((state) => state.toggle);
  const wished = useWishlistStore((state) => state.productIds);
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [fragrance, setFragrance] = useState<FragranceWithNotes | null>(null);
  const [names, setNames] = useState<Awaited<ReturnType<typeof resolveClassificationNames>> | null>(null);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [sizeId, setSizeId] = useState<string>("");
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([getProductBySlug(slug), getSizes()])
      .then(async ([detail, sizeMaster]) => {
        if (cancelled) return;
        if (!detail) {
          setError("This perfume could not be found.");
          return;
        }
        setProduct(detail);
        setSizes(sizeMaster);
        setSizeId(detail.sizes[0]?.sizeId ?? "");
        void resolveClassificationNames(detail).then((result) => {
          if (!cancelled) setNames(result);
        });
        if (detail.fragranceId) {
          setFragrance(await getFragranceById(detail.fragranceId));
        }
      })
      .catch(() => {
        if (!cancelled) setError("Something went wrong. Please try again.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const selectedSize = product?.sizes.find((row) => row.sizeId === sizeId);
  const images = product?.images ?? [];

  const sizeLabel = useMemo(
    () => sizes.find((size) => size.id === sizeId)?.displayName ?? "",
    [sizes, sizeId],
  );

  async function add(buyNow = false) {
    if (!product || !selectedSize) return;
    setPending(true);
    setMessage("");
    try {
      await addReadyMade({ productId: product.id, sizeId: selectedSize.sizeId, quantity: qty });
      if (buyNow) navigate("/checkout");
    } catch (err) {
      setMessage(err instanceof ApiError ? err.message : "Unable to add this perfume.");
    } finally {
      setPending(false);
    }
  }

  if (loading) {
    return (
      <PageShell className="grid gap-8 py-12 md:grid-cols-2">
        <LoadingSkeleton className="aspect-square" />
        <LoadingSkeleton className="h-80" />
      </PageShell>
    );
  }

  if (error || !product) {
    return (
      <PageShell className="py-16">
        <ErrorState message={error ?? "This perfume could not be found."} />
      </PageShell>
    );
  }

  return (
    <>
      <PageMeta
        title={product.name}
        description={product.shortDescription}
        type="product"
        image={images[0]?.imageUrl}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          description: product.shortDescription,
          image: images.map((image) => image.imageUrl),
          brand: product.brand,
          offers: {
            "@type": "Offer",
            priceCurrency: "INR",
            price: selectedSize?.sellingPrice,
            availability: "https://schema.org/InStock",
          },
        }}
      />
      <PageShell className="py-10">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Shop", href: "/shop" },
            { label: product.name },
          ]}
        />
        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          <div>
            <div className="overflow-hidden bg-cream">
              <img
                src={images[activeImage]?.imageUrl}
                alt={images[activeImage]?.alt ?? product.name}
                className="aspect-square w-full object-cover transition duration-500 hover:scale-105"
              />
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  className={index === activeImage ? "ring-1 ring-charcoal" : ""}
                >
                  <img src={image.imageUrl} alt={image.alt} className="aspect-square object-cover" />
                </button>
              ))}
            </div>
          </div>
          <div>
            <h1 className="font-display text-5xl">{product.name}</h1>
            <div className="mt-3">
              <Rating value={product.rating} count={product.reviewCount} />
            </div>
            {selectedSize ? (
              <div className="mt-6">
                <Price amount={selectedSize.sellingPrice} compareAt={selectedSize.mrp} size="lg" />
              </div>
            ) : null}
            <p className="mt-6 text-sm leading-7 text-stone">{product.description}</p>
            <div className="mt-8">
              <p className="text-[11px] uppercase tracking-nav text-stone">Size</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.sizes.map((row) => {
                  const label = sizes.find((size) => size.id === row.sizeId)?.displayName ?? row.sizeId;
                  return (
                    <button
                      key={row.id}
                      type="button"
                      onClick={() => setSizeId(row.sizeId)}
                      className={`min-h-11 border px-4 py-2 text-sm ${sizeId === row.sizeId ? "border-charcoal" : "border-sand"}`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="mt-6">
              <QuantitySelector value={qty} onChange={setQty} />
            </div>
            {message ? <p className="mt-4 text-sm text-rose">{message}</p> : null}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button type="button" onClick={() => void add()} disabled={pending}>
                Add to Cart
              </Button>
              <Button type="button" variant="gold" onClick={() => void add(true)} disabled={pending}>
                Buy Now
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => toggle(product.id)}
                aria-pressed={wished.includes(product.id)}
              >
                {wished.includes(product.id) ? "Saved" : "Wishlist"}
              </Button>
            </div>
            {names ? (
              <div className="mt-10 space-y-2 text-sm">
                <p>
                  <span className="text-stone">Family · </span>
                  {names.families.join(", ")}
                </p>
                <p>
                  <span className="text-stone">Audience · </span>
                  {names.audiences.join(", ")}
                </p>
                <p>
                  <span className="text-stone">Occasion · </span>
                  {names.occasions.join(", ")}
                </p>
                <p>
                  <span className="text-stone">Season · </span>
                  {names.seasons.join(", ")}
                </p>
              </div>
            ) : null}
          </div>
        </div>
        {fragrance ? (
          <section className="mt-16">
            <h2 className="font-display text-4xl">Fragrance notes</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {(
                [
                  ["Top notes", fragrance.notes.top],
                  ["Heart notes", fragrance.notes.heart],
                  ["Base notes", fragrance.notes.base],
                ] as const
              ).map(([label, notes]) => (
                <div key={label} className="border-t border-sand pt-5">
                  <h3 className="text-[11px] uppercase tracking-nav text-gold">{label}</h3>
                  <ul className="mt-3 space-y-1 font-display text-2xl">
                    {notes.map((note) => (
                      <li key={note.id}>{note.name}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        ) : null}
        <p className="mt-12 text-sm text-stone">
          Prefer to compose your own vessel?{" "}
          <Link to="/custom-perfume" className="underline">
            Create a custom ROSADO
          </Link>
          {sizeLabel ? ` in ${sizeLabel}` : ""}.
        </p>
      </PageShell>
    </>
  );
}
