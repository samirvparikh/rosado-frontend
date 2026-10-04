import { formatCurrency } from "@/utils/formatCurrency";

export interface PriceBreakdown {
  base: number;
  fragrance: number;
  bottle: number;
  cap: number;
  unit: number;
  quantity: number;
  total: number;
}

/** Estimated from the server-provided catalog; the cart re-prices on the server. */
export function PriceSummary({ price }: { price: PriceBreakdown }) {
  const rows: Array<[string, number]> = [
    ["Base perfume", price.base],
    ["Fragrance", price.fragrance],
    ["Bottle", price.bottle],
    ["Cap", price.cap],
  ];

  return (
    <div className="rounded-2xl border border-sand p-5">
      <ul className="space-y-2 text-sm">
        {rows
          // A ₹0 base just means the fragrance price carries the perfume cost.
          .filter(([label, amount]) => label !== "Base perfume" || amount > 0)
          .map(([label, amount]) => (
            <li key={label} className="flex justify-between gap-4">
              <span className="text-stone">{label}</span>
              <span>{amount > 0 ? formatCurrency(amount) : "Included"}</span>
            </li>
          ))}
        {price.quantity > 1 ? (
          <li className="flex justify-between gap-4 text-stone">
            <span>Quantity</span>
            <span>
              {price.quantity} × {formatCurrency(price.unit)}
            </span>
          </li>
        ) : null}
      </ul>
      <div className="luxury-rule my-4" />
      <div className="flex items-baseline justify-between">
        <span className="text-[11px] uppercase tracking-nav text-stone">Total</span>
        <span className="font-display text-3xl" aria-live="polite">
          {formatCurrency(price.total)}
        </span>
      </div>
      <p className="mt-1 text-[11px] text-stone">Inclusive of taxes. Final price confirmed at checkout.</p>
    </div>
  );
}
