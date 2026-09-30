import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Price } from "@/components/ui/Price";
import { Rating } from "@/components/ui/Rating";
import { useCart } from "@/hooks/useCart";
import { useWishlistStore } from "@/store/wishlistStore";
import type { ProductListItem } from "@/types";

export function ProductCard({ product }: { product: ProductListItem }) {
  const navigate = useNavigate();
  const { addReadyMade } = useCart();
  const wished = useWishlistStore((state) => state.productIds.includes(product.id));
  const toggle = useWishlistStore((state) => state.toggle);
  const [pending, setPending] = useState(false);

  async function addToCart() {
    if (!product.defaultSizeId) {
      navigate(`/perfumes/${product.slug}`);
      return;
    }
    setPending(true);
    try {
      await addReadyMade({ productId: product.id, sizeId: product.defaultSizeId, quantity: 1 });
    } finally {
      setPending(false);
    }
  }

  return (
    <article className="group">
      <div className="relative overflow-hidden bg-cream">
        <Link to={`/perfumes/${product.slug}`}>
          <img
            src={product.primaryImage}
            alt={product.name}
            className="aspect-[3/4] w-full object-cover transition duration-500 group-hover:scale-[1.02]"
            loading="lazy"
          />
        </Link>
        <div className="absolute left-3 top-3 flex flex-col gap-1">
          {product.badges.slice(0, 2).map((badge) => (
            <Badge key={badge} tone={badge === "Sale" ? "gold" : "ink"}>
              {badge}
            </Badge>
          ))}
        </div>
        <button
          type="button"
          onClick={() => toggle(product.id)}
          className="absolute right-3 top-3 bg-ivory/90 px-2 py-1 text-[10px] uppercase tracking-nav"
          aria-pressed={wished}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
        >
          {wished ? "Saved" : "Save"}
        </button>
      </div>
      <div className="mt-4 space-y-2">
        <Link to={`/perfumes/${product.slug}`}>
          <h3 className="font-display text-2xl leading-tight">{product.name}</h3>
        </Link>
        <p className="text-xs leading-6 text-stone">{product.shortDescription}</p>
        <Rating value={product.rating} count={product.reviewCount} />
        <Price amount={product.fromPrice} prefix="From" />
        <div className="pt-2">
          <Button type="button" size="sm" onClick={addToCart} disabled={pending} fullWidth>
            {pending ? "Adding…" : "Add to Cart"}
          </Button>
        </div>
      </div>
    </article>
  );
}
