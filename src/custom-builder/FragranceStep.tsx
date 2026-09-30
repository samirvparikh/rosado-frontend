import { cn } from "@/utils/cn";
import { Price } from "@/components/ui/Price";
import { getFragranceBasePrice } from "@/services/fragranceApi";
import type { FragranceWithNotes } from "@/types";

export function FragranceStep({
  fragrances,
  selectedId,
  sizeId,
  onSelect,
}: {
  fragrances: FragranceWithNotes[];
  selectedId?: string;
  sizeId: string;
  onSelect: (fragrance: FragranceWithNotes) => void;
}) {
  return (
    <div>
      <h2 className="font-display text-4xl">Choose your fragrance</h2>
      <p className="mt-2 text-sm text-stone">Each composition is independent of the bottle you will select next.</p>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {fragrances.map((fragrance) => {
          const selected = selectedId === fragrance.id;
          const impact = getFragranceBasePrice(fragrance.id, sizeId);
          return (
            <button
              key={fragrance.id}
              type="button"
              onClick={() => onSelect(fragrance)}
              className={cn(
                "overflow-hidden border text-left",
                selected ? "border-charcoal" : "border-sand hover:border-charcoal/40",
              )}
            >
              <img src={fragrance.image} alt={fragrance.name} className="h-52 w-full object-cover" />
              <div className="space-y-3 p-5">
                <h3 className="font-display text-3xl">{fragrance.name}</h3>
                <p className="text-xs uppercase tracking-nav text-stone">
                  {fragrance.families.join(" · ")} · {fragrance.shortDescription}
                </p>
                <p className="text-sm leading-6 text-stone">{fragrance.description}</p>
                <div className="grid grid-cols-3 gap-3 text-[11px] uppercase tracking-nav">
                  <div>
                    <p className="text-gold">Top</p>
                    <p>{fragrance.notes.top.map((note) => note.name).join(", ")}</p>
                  </div>
                  <div>
                    <p className="text-gold">Heart</p>
                    <p>{fragrance.notes.heart.map((note) => note.name).join(", ")}</p>
                  </div>
                  <div>
                    <p className="text-gold">Base</p>
                    <p>{fragrance.notes.base.map((note) => note.name).join(", ")}</p>
                  </div>
                </div>
                <Price amount={impact} prefix="Base" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
