import { useEffect, useMemo, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { Drawer } from "@/components/ui/Drawer";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { ProductGridSkeleton } from "@/components/ui/LoadingSkeleton";
import { Select } from "@/components/ui/Select";
import { PageShell } from "@/components/layout/PageShell";
import { FilterSidebar } from "@/components/product/FilterSidebar";
import { ProductCard } from "@/components/product/ProductCard";
import { PageMeta } from "@/components/seo/PageMeta";
import { getShopFilters } from "@/services/classificationApi";
import { getProducts } from "@/services/productApi";
import { getSizes } from "@/services/sizeApi";
import type { ClassificationItem, ProductFilters, ProductListItem } from "@/types";

const AUDIENCE_PATH: Record<string, string> = {
  "/men": "AUD-MEN",
  "/women": "AUD-WOMEN",
  "/unisex": "AUD-UNISEX",
};

export function ShopPage() {
  const location = useLocation();
  const [params] = useSearchParams();
  const presetAudience = AUDIENCE_PATH[location.pathname];
  const [filters, setFilters] = useState<ProductFilters>({
    sort: "featured",
    audience: presetAudience ? [presetAudience] : undefined,
  });
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileFilters, setMobileFilters] = useState(false);
  const [masters, setMasters] = useState<{
    audiences: ClassificationItem[];
    fragranceFamilies: ClassificationItem[];
    occasions: ClassificationItem[];
    seasons: ClassificationItem[];
    timesOfDay: ClassificationItem[];
    intensities: ClassificationItem[];
    sizes: ClassificationItem[];
  } | null>(null);

  useEffect(() => {
    const familySlug = params.get("family");
    setFilters((current) => ({
      ...current,
      audience: presetAudience ? [presetAudience] : current.audience,
      fragranceFamily: familySlug
        ? masters?.fragranceFamilies.filter((item) => item.slug === familySlug).map((item) => item.id)
        : current.fragranceFamily,
    }));
  }, [presetAudience, params, masters]);

  useEffect(() => {
    Promise.all([getShopFilters(), getSizes()]).then(([shop, sizes]) => {
      setMasters({
        audiences: shop.audiences,
        fragranceFamilies: shop.fragranceFamilies,
        occasions: shop.occasions,
        seasons: shop.seasons,
        timesOfDay: shop.timesOfDay,
        intensities: shop.intensities,
        sizes: sizes.map((size) => ({
          id: size.id,
          name: size.displayName,
          slug: size.id.toLowerCase(),
          status: size.status,
          sortOrder: size.sortOrder,
        })),
      });
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getProducts(filters)
      .then((items) => {
        if (!cancelled) setProducts(items);
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
  }, [filters]);

  const title = useMemo(() => {
    if (location.pathname === "/men") return "Men";
    if (location.pathname === "/women") return "Women";
    if (location.pathname === "/unisex") return "Unisex";
    return "Shop";
  }, [location.pathname]);

  const sidebar = masters ? (
    <FilterSidebar
      filters={filters}
      onChange={setFilters}
      audiences={masters.audiences}
      fragranceFamilies={masters.fragranceFamilies}
      occasions={masters.occasions}
      seasons={masters.seasons}
      timesOfDay={masters.timesOfDay}
      intensities={masters.intensities}
      sizes={masters.sizes}
    />
  ) : null;

  return (
    <>
      <PageMeta title={title} description={`Shop ROSADO ${title.toLowerCase()} fragrances.`} />
      <PageShell wide className="py-12">
        <h1 className="font-display text-5xl">{title}</h1>
        <div className="mt-6 flex items-center justify-between gap-4">
          <button type="button" className="text-[11px] uppercase tracking-nav lg:hidden" onClick={() => setMobileFilters(true)}>
            Filters
          </button>
          <Select
            label="Sort"
            value={filters.sort ?? "featured"}
            onChange={(event) =>
              setFilters({ ...filters, sort: event.target.value as ProductFilters["sort"] })
            }
            options={[
              { value: "featured", label: "Featured" },
              { value: "price-asc", label: "Price Low → High" },
              { value: "price-desc", label: "Price High → Low" },
              { value: "newest", label: "Newest" },
              { value: "best-selling", label: "Best Selling" },
            ]}
          />
        </div>
        <div className="mt-8 grid gap-10 lg:grid-cols-[260px_1fr]">
          <aside className="hidden lg:block">{sidebar}</aside>
          <div>
            {loading ? <ProductGridSkeleton /> : null}
            {error ? <ErrorState message={error} onRetry={() => setFilters({ ...filters })} /> : null}
            {!loading && !error && products.length === 0 ? <EmptyState title="No perfumes found." /> : null}
            {!loading && !error ? (
              <div className="grid grid-cols-2 gap-6 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </PageShell>
      <Drawer open={mobileFilters} title="Filters" onClose={() => setMobileFilters(false)} side="left">
        {sidebar}
      </Drawer>
    </>
  );
}
