import { cn } from "@/utils/cn";
import type { Size } from "@/types";

export function SizeStep({
  sizes,
  selectedId,
  onSelect,
}: {
  sizes: Size[];
  selectedId?: string;
  onSelect: (size: Size) => void;
}) {
  return (
    <div>
      <h2 className="font-display text-4xl">Choose your size</h2>
      <p className="mt-2 text-sm text-stone">Size determines which bottles can be composed with your perfume.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {sizes.map((size) => (
          <button
            key={size.id}
            type="button"
            onClick={() => onSelect(size)}
            className={cn(
              "min-h-28 border px-6 py-8 text-left transition-colors",
              selectedId === size.id ? "border-charcoal bg-cream" : "border-sand hover:border-charcoal/40",
            )}
          >
            <span className="font-display text-3xl">{size.displayName}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
