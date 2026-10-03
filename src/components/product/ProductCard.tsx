import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { HeartIcon } from "@/components/ui/HeartIcon";
import { Price } from "@/components/ui/Price";
import { Rating } from "@/components/ui/Rating";
import { useCart } from "@/hooks/useCart";
import { ApiError } from "@/services/http";
import { useWishlistStore } from "@/store/wishlistStore";
import { cn } from "@/utils/cn";
import type { ProductListItem } from "@/types";

export function ProductCard({ product }: { product: ProductListItem }) {
  const navigate = useNavigate();
  const { addReadyMade } = useCart();
  const wished = useWishlistStore((state) => state.productIds.includes(product.id));
  const toggle = useWishlistStore((state) => state.toggle);
  const [sizeId, setSizeId] = useState(product.defaultSizeId);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  const sizeOptions = product.sizeOptions ?? [];
  const selected = sizeOptions.find((option) => option.sizeId === sizeId);
  const soldOut = product.soldOut || (selected ? !selected.inStock : false);

  async function addToCart() {
    if (!selected) {
      navigate(`/perfumes/${product.slug}`);
      return;
    }
    if (soldOut) return;
    setPending(true);
    setMessage("");
    try {
      await addReadyMade({ productId: product.id, sizeId: selected.sizeId, quantity: 1 });
      setMessage("Added to cart");
    } catch (error) {
      setMessage(error instanceof ApiError ? error.message : "Unable to add this perfume.");
    } finally {
      setPending(false);
    }
  }

  return (
    <article className="group flex h-full flex-col">
      <div className="relative overflow-hidden rounded-2xl bg-cream">
        <Link to={`/perfumes/${product.slug}`} className="relative block">
          <img
            src={product.primaryImage}
            alt={product.name}
            className={cn(
              "aspect-[3/4] w-full object-cover transition duration-500",
              product.secondaryImage ? "group-hover:opacity-0" : "group-hover:scale-[1.02]",
              product.soldOut && "opacity-70",
            )}
            loading="lazy"
          />
          {product.secondaryImage ? (
            <img
              src={product.secondaryImage}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition duration-500 group-hover:scale-[1.02] group-hover:opacity-100"
              loading="lazy"
            />
          ) : null}
        </Link>
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1">
          {product.soldOut ? <Badge>Sold Out</Badge> : null}
          {product.badges.slice(0, product.soldOut ? 1 : 2).map((badge) => (
            <Badge key={badge} tone={badge === "Sale" ? "gold" : "ink"}>
              {badge}
            </Badge>
          ))}
        </div>
        <button
          type="button"
          onClick={() => toggle(product.id)}
          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-ivory/90 transition-colors hover:text-gold ${wished ? "text-gold" : "text-charcoal"}`}
          aria-pressed={wished}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
        >
          <HeartIcon filled={wished} />
        </button>
      </div>
      <div className="mt-4 flex flex-1 flex-col gap-2">
        <Link to={`/perfumes/${product.slug}`}>
          <h3 className="font-display text-2xl leading-tight">{product.name}</h3>
        </Link>
        <p className="text-xs leading-6 text-stone">{product.shortDescription}</p>
        <Rating value={product.rating} count={product.reviewCount} />
        {sizeOptions.length ? (
          <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label={`${product.name} size`}>
            {sizeOptions.map((option) => {
              const active = option.sizeId === sizeId;
              return (
                <button
                  key={option.sizeId}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => {
                    setSizeId(option.sizeId);
                    setMessage("");
                  }}
                  title={option.inStock ? undefined : "Sold out"}
                  className={cn(
                    "min-h-8 rounded-full border px-3 text-[11px] tracking-wide transition-colors",
                    active ? "border-charcoal bg-charcoal text-ivory" : "border-sand hover:border-charcoal/50",
                    !option.inStock && "text-stone line-through",
                    !option.inStock && active && "text-ivory/70",
                  )}
                >
                  {option.displayName}
                </button>
              );
            })}
          </div>
        ) : null}
        {selected ? (
          <Price amount={selected.sellingPrice} compareAt={selected.mrp} />
        ) : (
          <Price amount={product.fromPrice} prefix="From" />
        )}
        <div className="mt-auto pt-2">
          <Button
            type="button"
            size="sm"
            onClick={() => void addToCart()}
            disabled={pending || soldOut}
            className="rounded-full"
            fullWidth
          >
            {soldOut ? "Sold Out" : pending ? "Adding…" : "Add to Cart"}
          </Button>
          {message ? (
            <p className="mt-2 text-center text-[11px] text-stone" role="status">
              {message}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}
