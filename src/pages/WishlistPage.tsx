import { useEffect, useState } from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProductGridSkeleton } from "@/components/ui/LoadingSkeleton";
import { PageShell } from "@/components/layout/PageShell";
import { ProductCard } from "@/components/product/ProductCard";
import { PageMeta } from "@/components/seo/PageMeta";
import { getProducts } from "@/services/productApi";
import { useWishlistStore } from "@/store/wishlistStore";
import type { ProductListItem } from "@/types";

export function WishlistPage() {
  const ids = useWishlistStore((state) => state.productIds);
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then((all) => setProducts(all.filter((item) => ids.includes(item.id))))
      .finally(() => setLoading(false));
  }, [ids]);

  return (
    <>
      <PageMeta title="Wishlist" description="Saved ROSADO perfumes." />
      <PageShell className="py-12">
        <h1 className="font-display text-5xl">Wishlist</h1>
        {loading ? <div className="mt-8"><ProductGridSkeleton /></div> : null}
        {!loading && products.length === 0 ? <EmptyState title="Nothing saved yet." /> : null}
        <div className="mt-8 grid grid-cols-2 gap-6 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </PageShell>
    </>
  );
}
