import type { ReactNode } from "react";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/formatCurrency";
import type { CustomizerBottle, CustomizerCap, CustomizerFragrance, CustomizerSize } from "@/types";

function priceTag(price: number) {
  return price > 0 ? `+ ${formatCurrency(price)}` : "Included";
}

export function SelectorSection({
  step,
  title,
  summary,
  children,
}: {
  step: number;
  title: string;
  summary?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={`customizer-step-${step}`}>
      <div className="flex items-baseline justify-between gap-4 border-b border-sand pb-3">
        <h2 id={`customizer-step-${step}`} className="text-[11px] uppercase tracking-nav text-stone">
          <span className="mr-2 text-gold">{step}.</span>
          {title}
        </h2>
        {summary ? <p className="truncate text-right font-display text-xl leading-none">{summary}</p> : null}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

interface RailOption {
  id: string;
  name: string;
  image?: string | null;
  /** "contain" for transparent component art, "cover" for photography. */
  imageFit?: "contain" | "cover";
  meta?: string;
  priceLabel?: string;
  disabled?: boolean;
  disabledLabel?: string;
}

/** Image option tiles: a horizontal swipe rail on mobile, a grid from `sm` up. */
function OptionRail({
  label,
  options,
  selectedId,
  onSelect,
  columns = 3,
}: {
  label: string;
  options: RailOption[];
  selectedId?: string;
  onSelect: (id: string) => void;
  columns?: 3 | 4;
}) {
  if (!options.length) {
    return <p className="text-sm text-stone">No options are available for this size.</p>;
  }

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn(
        "no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:gap-4 sm:overflow-visible sm:px-0",
        columns === 4 ? "sm:grid-cols-4" : "sm:grid-cols-3",
      )}
    >
      {options.map((option) => {
        const selected = option.id === selectedId;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={option.disabled}
            onClick={() => onSelect(option.id)}
            className={cn(
              "group w-36 shrink-0 snap-start overflow-hidden rounded-2xl border bg-ivory text-left transition-all duration-200 sm:w-auto",
              selected
                ? "border-charcoal shadow-lift ring-1 ring-charcoal"
                : "border-sand hover:-translate-y-0.5 hover:border-charcoal/40 hover:shadow-lift",
              option.disabled && "cursor-not-allowed opacity-50 hover:translate-y-0 hover:shadow-none",
            )}
          >
            <div className="relative aspect-square bg-cream">
              {option.image ? (
                <img
                  src={option.image}
                  alt=""
                  loading="lazy"
                  className={cn(
                    "h-full w-full transition-transform duration-500 group-hover:scale-[1.03]",
                    option.imageFit === "cover" ? "object-cover" : "object-contain p-4",
                  )}
                />
              ) : null}
              {selected ? (
                <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-charcoal text-[11px] text-ivory">
                  ✓
                </span>
              ) : null}
              {option.disabled && option.disabledLabel ? (
                <span className="absolute left-2 top-2 rounded-full bg-charcoal px-2 py-0.5 text-[9px] uppercase tracking-nav text-ivory">
                  {option.disabledLabel}
                </span>
              ) : null}
            </div>
            <div className="space-y-0.5 p-3">
              <p className="font-display text-lg leading-tight">{option.name}</p>
              {option.meta ? <p className="truncate text-[11px] text-stone">{option.meta}</p> : null}
              {option.priceLabel ? <p className="text-xs">{option.priceLabel}</p> : null}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export function SizeSelector({
  sizes,
  selectedId,
  onSelect,
}: {
  sizes: CustomizerSize[];
  selectedId?: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div role="radiogroup" aria-label="Size" className="flex flex-wrap gap-2">
      {sizes.map((size) => {
        const selected = size.id === selectedId;
        return (
          <button
            key={size.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onSelect(size.id)}
            className={cn(
              "min-h-11 rounded-full border px-6 text-sm transition-colors",
              selected ? "border-charcoal bg-charcoal text-ivory" : "border-sand hover:border-charcoal/50",
            )}
          >
            {size.displayName}
          </button>
        );
      })}
    </div>
  );
}

export function FragranceSelector({
  fragrances,
  sizeId,
  selectedId,
  onSelect,
}: {
  fragrances: CustomizerFragrance[];
  sizeId?: string;
  selectedId?: string;
  onSelect: (id: string) => void;
}) {
  return (
    <OptionRail
      label="Fragrance"
      columns={3}
      selectedId={selectedId}
      onSelect={onSelect}
      options={fragrances.map((fragrance) => {
        const price = sizeId ? fragrance.prices[sizeId] : undefined;
        return {
          id: fragrance.id,
          name: fragrance.name,
          image: fragrance.image,
          imageFit: "cover",
          meta: fragrance.families.join(" · ") || fragrance.shortDescription,
          priceLabel: price !== undefined ? formatCurrency(price) : undefined,
          disabled: price === undefined,
          disabledLabel: "Not in this size",
        };
      })}
    />
  );
}

export function BottleSelector({
  bottles,
  selectedId,
  onSelect,
}: {
  bottles: CustomizerBottle[];
  selectedId?: string;
  onSelect: (id: string) => void;
}) {
  return (
    <OptionRail
      label="Bottle"
      columns={3}
      selectedId={selectedId}
      onSelect={onSelect}
      options={bottles.map((bottle) => ({
        id: bottle.id,
        name: bottle.name,
        image: bottle.image,
        priceLabel: priceTag(bottle.price),
        disabled: !bottle.inStock,
        disabledLabel: "Sold out",
      }))}
    />
  );
}

export function CapSelector({
  caps,
  selectedId,
  onSelect,
}: {
  caps: CustomizerCap[];
  selectedId?: string;
  onSelect: (id: string) => void;
}) {
  return (
    <OptionRail
      label="Cap"
      columns={4}
      selectedId={selectedId}
      onSelect={onSelect}
      options={caps.map((cap) => ({
        id: cap.id,
        name: cap.name,
        image: cap.image,
        priceLabel: priceTag(cap.price),
        disabled: !cap.inStock,
        disabledLabel: "Sold out",
      }))}
    />
  );
}
