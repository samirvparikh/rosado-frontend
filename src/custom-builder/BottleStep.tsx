import { cn } from "@/utils/cn";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { Price } from "@/components/ui/Price";
import type { Bottle } from "@/types";

export function BottleStep({
  bottles,
  selectedId,
  sizeLabel,
  loading,
  error,
  onRetry,
  onSelect,
}: {
  bottles: Bottle[];
  selectedId?: string;
  sizeLabel: string;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onSelect: (bottle: Bottle) => void;
}) {
  return (
    <div>
      <h2 className="font-display text-4xl">Customise your bottle</h2>
      <p className="mt-2 text-sm text-stone">
        Only bottles made for {sizeLabel} are shown. Bottles are components — they cannot be purchased alone.
      </p>
      {loading ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <LoadingSkeleton className="h-72" />
          <LoadingSkeleton className="h-72" />
        </div>
      ) : null}
      {error ? <ErrorState message={error} onRetry={onRetry} /> : null}
      {!loading && !error ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {bottles.map((bottle) => (
            <button
              key={bottle.id}
              type="button"
              onClick={() => onSelect(bottle)}
              className={cn(
                "overflow-hidden rounded-2xl border text-left",
                selectedId === bottle.id ? "border-charcoal" : "border-sand hover:border-charcoal/40",
              )}
            >
              <div className="bg-cream">
                <img src={bottle.image} alt={bottle.name} className="mx-auto h-56 w-full object-contain p-6" />
              </div>
              <div className="space-y-1 p-5">
                <h3 className="font-display text-2xl">{bottle.name}</h3>
                <p className="text-[11px] uppercase tracking-nav text-stone">{sizeLabel}</p>
                <Price amount={bottle.additionalPrice} prefix="Additional" />
              </div>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
