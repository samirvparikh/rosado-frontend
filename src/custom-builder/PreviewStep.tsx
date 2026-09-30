import { formatCurrency } from "@/utils/formatCurrency";
import type { CustomPerfumeConfiguration } from "@/types";

export function PreviewStep({ configuration }: { configuration: CustomPerfumeConfiguration }) {
  return (
    <div>
      <h2 className="font-display text-4xl">Your custom perfume</h2>
      <p className="mt-2 text-sm text-stone">Review the composition before it enters the cart.</p>
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div className="bg-cream">
          <img
            src={configuration.fragrance?.image ?? configuration.bottle?.image}
            alt="Custom ROSADO perfume preview"
            className="aspect-[3/4] w-full object-cover"
          />
        </div>
        <div>
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-[11px] uppercase tracking-nav text-stone">Size</dt>
              <dd className="font-display text-2xl">{configuration.size?.displayName}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-nav text-stone">Fragrance</dt>
              <dd className="font-display text-2xl">{configuration.fragrance?.name}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-nav text-stone">Bottle</dt>
              <dd className="font-display text-2xl">{configuration.bottle?.name}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-nav text-stone">Cap</dt>
              <dd className="font-display text-2xl">{configuration.cap?.name}</dd>
            </div>
          </dl>
          <div className="luxury-rule my-6" />
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">
              <span>Base Perfume</span>
              <span>{formatCurrency(configuration.basePrice)}</span>
            </li>
            <li className="flex justify-between">
              <span>Bottle</span>
              <span>{formatCurrency(configuration.bottlePrice)}</span>
            </li>
            <li className="flex justify-between">
              <span>Cap</span>
              <span>{formatCurrency(configuration.capPrice)}</span>
            </li>
            <li className="flex justify-between border-t border-sand pt-3 font-medium">
              <span>Total</span>
              <span>{formatCurrency(configuration.totalPrice)}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
