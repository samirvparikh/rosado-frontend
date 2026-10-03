import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Modal } from "@/components/ui/Modal";
import { searchProducts } from "@/services/productApi";
import { formatCurrency } from "@/utils/formatCurrency";
import type { ProductListItem } from "@/types";

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductListItem[]>([]);

  useEffect(() => {
    if (!open) return;
    const handle = window.setTimeout(async () => {
      const next = await searchProducts(query);
      setResults(next.slice(0, 6));
    }, 180);
    return () => window.clearTimeout(handle);
  }, [query, open]);

  return (
    <Modal open={open} title="Search ROSADO" onClose={onClose}>
      <label className="block">
        <span className="sr-only">Search perfumes</span>
        <input
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Name, fragrance, family, tag…"
          className="w-full border-b border-sand bg-transparent py-3 text-lg outline-none"
        />
      </label>
      <ul className="mt-6 space-y-4">
        {results.map((product) => (
          <li key={product.id}>
            <Link to={`/perfumes/${product.slug}`} onClick={onClose} className="flex items-center gap-4">
              <img src={product.primaryImage} alt={product.name} className="h-16 w-12 rounded-lg object-cover" />
              <div>
                <p className="font-display text-xl">{product.name}</p>
                <p className="text-xs text-stone">
                  {product.soldOut ? "Sold out" : `From ${formatCurrency(product.fromPrice)}`}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      {query && results.length === 0 ? <p className="mt-6 text-sm text-stone">No perfumes found.</p> : null}
    </Modal>
  );
}
