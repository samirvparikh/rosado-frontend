import { Price } from "@/components/ui/Price";
import type { CustomPerfumeConfiguration } from "@/types";

export function BuilderSummary({ configuration }: { configuration: CustomPerfumeConfiguration }) {
  return (
    <aside className="border border-sand bg-ivory p-5">
      <p className="text-[11px] uppercase tracking-nav text-stone">Your perfume</p>
      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-stone">Size</dt>
          <dd>{configuration.size?.displayName ?? "—"}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-stone">Fragrance</dt>
          <dd>{configuration.fragrance?.name ?? "—"}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-stone">Bottle</dt>
          <dd>{configuration.bottle?.name ?? "—"}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-stone">Cap</dt>
          <dd>{configuration.cap?.name ?? "—"}</dd>
        </div>
      </dl>
      <div className="luxury-rule my-4" />
      <Price amount={configuration.totalPrice} size="lg" />
      <p className="mt-2 text-[11px] text-stone">Estimated. Final price is confirmed at checkout.</p>
    </aside>
  );
}
