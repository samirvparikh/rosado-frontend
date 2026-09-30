import { cn } from "@/utils/cn";
import { Price } from "@/components/ui/Price";
import type { Cap } from "@/types";

export function CapStep({
  caps,
  selectedId,
  onSelect,
}: {
  caps: Cap[];
  selectedId?: string;
  onSelect: (cap: Cap) => void;
}) {
  return (
    <div>
      <h2 className="font-display text-4xl">Choose your cap</h2>
      <p className="mt-2 text-sm text-stone">A finishing component. Caps are never sold separately.</p>
      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        {caps.map((cap) => (
          <button
            key={cap.id}
            type="button"
            onClick={() => onSelect(cap)}
            className={cn(
              "overflow-hidden border text-left",
              selectedId === cap.id ? "border-charcoal" : "border-sand hover:border-charcoal/40",
            )}
          >
            <div className="bg-cream">
              <img
                src={cap.image}
                alt={`${cap.name} perfume cap`}
                className="mx-auto h-56 w-full object-contain p-4"
              />
            </div>
            <div className="space-y-1 p-5">
              <h3 className="font-display text-2xl">{cap.name}</h3>
              <Price amount={cap.additionalPrice} prefix="Additional" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
