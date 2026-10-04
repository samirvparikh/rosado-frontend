import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Price } from "@/components/ui/Price";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { PageShell } from "@/components/layout/PageShell";
import { PerfumePreview } from "@/custom-builder/PerfumePreview";
import { PageMeta } from "@/components/seo/PageMeta";
import { useCart } from "@/hooks/useCart";
import { formatCurrency } from "@/utils/formatCurrency";
import { labelText } from "@/utils/labelText";
import { useWishlistStore } from "@/store/wishlistStore";
import type { CartItem } from "@/types";

function Line({
  item,
  onQty,
  onRemove,
  onSave,
}: {
  item: CartItem;
  onQty: (qty: number) => void;
  onRemove: () => void;
  onSave?: () => void;
}) {
  return (
    <article className="grid gap-4 border-b border-sand py-6 sm:grid-cols-[96px_1fr_auto]">
      {item.productType === "CUSTOM_PERFUME" && item.preview ? (
        <PerfumePreview preview={item.preview} compact className="w-24 rounded-xl" />
      ) : (
        <img src={item.image} alt="" className="h-28 w-24 rounded-xl object-cover" />
      )}
      <div>
        {item.productType === "READY_MADE" ? (
          <>
            <h2 className="font-display text-2xl">{item.productName}</h2>
            <p className="mt-1 text-sm text-stone">{item.sizeName}</p>
          </>
        ) : (
          <>
            <p className="text-[11px] uppercase tracking-nav text-gold">Custom perfume</p>
            <h2 className="font-display text-2xl">{item.productName ?? "CUSTOM ROSADO PERFUME"}</h2>
            <ul className="mt-2 space-y-1 text-sm text-stone">
              <li>{item.sizeName}</li>
              <li>{item.fragranceName}</li>
              <li>{item.bottleName}</li>
              <li>{item.capName}</li>
            </ul>
            {labelText(item) ? (
              <p className="mt-2 text-sm text-stone">
                <span className="text-[11px] uppercase tracking-nav">Label · </span>
                {labelText(item)}
              </p>
            ) : null}
            {item.remarks ? (
              <p className="mt-2 whitespace-pre-line text-sm text-stone">
                <span className="text-[11px] uppercase tracking-nav">Remarks · </span>
                {item.remarks}
              </p>
            ) : null}
          </>
        )}
        <div className="mt-4 flex flex-wrap gap-4">
          <QuantitySelector value={item.quantity} onChange={onQty} />
          <button type="button" className="text-[11px] uppercase tracking-nav" onClick={onRemove}>
            Remove
          </button>
          {item.productType === "READY_MADE" && onSave ? (
            <button type="button" className="text-[11px] uppercase tracking-nav" onClick={onSave}>
              Save
            </button>
          ) : null}
        </div>
      </div>
      <Price amount={item.lineTotal} />
    </article>
  );
}

export function CartPage() {
  const { items, subtotal, updateQuantity, remove } = useCart();
  const toggle = useWishlistStore((state) => state.toggle);

  return (
    <>
      <PageMeta title="Cart" description="Review your ROSADO selection." />
      <PageShell className="py-12">
        <h1 className="font-display text-5xl">Cart</h1>
        {items.length === 0 ? (
          <EmptyState title="Your cart is waiting for something special.">
            <Link to="/shop">
              <Button className="mt-6">Explore ROSADO</Button>
            </Link>
          </EmptyState>
        ) : (
          <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_320px]">
            <div>
              {items.map((item) => (
                <Line
                  key={item.id}
                  item={item}
                  onQty={(qty) => updateQuantity(item.id, qty)}
                  onRemove={() => remove(item.id)}
                  onSave={item.productType === "READY_MADE" ? () => toggle(item.productId) : undefined}
                />
              ))}
              <Link to="/shop" className="mt-6 inline-block text-[11px] uppercase tracking-nav">
                Continue shopping
              </Link>
            </div>
            <aside className="h-fit rounded-2xl border border-sand p-6">
              <p className="text-[11px] uppercase tracking-nav text-stone">Summary</p>
              <p className="mt-4 flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </p>
              <p className="mt-2 text-xs text-stone">Shipping and coupon are confirmed at checkout.</p>
              <Link to="/checkout">
                <Button fullWidth className="mt-6">
                  Checkout
                </Button>
              </Link>
            </aside>
          </div>
        )}
      </PageShell>
    </>
  );
}
