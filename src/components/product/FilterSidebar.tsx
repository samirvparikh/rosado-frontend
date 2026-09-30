import type { ClassificationItem, ProductFilters } from "@/types";

interface FilterSidebarProps {
  filters: ProductFilters;
  onChange: (next: ProductFilters) => void;
  audiences: ClassificationItem[];
  fragranceFamilies: ClassificationItem[];
  occasions: ClassificationItem[];
  seasons: ClassificationItem[];
  timesOfDay: ClassificationItem[];
  intensities: ClassificationItem[];
  sizes: ClassificationItem[];
}

function Group({
  title,
  items,
  selected,
  onToggle,
}: {
  title: string;
  items: ClassificationItem[];
  selected?: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <fieldset className="border-b border-sand py-5">
      <legend className="text-[11px] uppercase tracking-nav text-stone">{title}</legend>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <label key={item.id} className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={selected?.includes(item.id) ?? false}
              onChange={() => onToggle(item.id)}
              className="accent-charcoal"
            />
            {item.name}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function toggleValue(list: string[] | undefined, id: string): string[] {
  const current = list ?? [];
  return current.includes(id) ? current.filter((value) => value !== id) : [...current, id];
}

export function FilterSidebar({
  filters,
  onChange,
  audiences,
  fragranceFamilies,
  occasions,
  seasons,
  timesOfDay,
  intensities,
  sizes,
}: FilterSidebarProps) {
  return (
    <form className="text-charcoal" onSubmit={(event) => event.preventDefault()}>
      <Group
        title="Audience"
        items={audiences}
        selected={filters.audience}
        onToggle={(id) => onChange({ ...filters, audience: toggleValue(filters.audience, id) })}
      />
      <Group
        title="Fragrance Family"
        items={fragranceFamilies}
        selected={filters.fragranceFamily}
        onToggle={(id) => onChange({ ...filters, fragranceFamily: toggleValue(filters.fragranceFamily, id) })}
      />
      <Group
        title="Occasion"
        items={occasions}
        selected={filters.occasion}
        onToggle={(id) => onChange({ ...filters, occasion: toggleValue(filters.occasion, id) })}
      />
      <Group
        title="Season"
        items={seasons}
        selected={filters.season}
        onToggle={(id) => onChange({ ...filters, season: toggleValue(filters.season, id) })}
      />
      <Group
        title="Time"
        items={timesOfDay}
        selected={filters.timeOfDay}
        onToggle={(id) => onChange({ ...filters, timeOfDay: toggleValue(filters.timeOfDay, id) })}
      />
      <Group
        title="Performance"
        items={intensities}
        selected={filters.intensity}
        onToggle={(id) => onChange({ ...filters, intensity: toggleValue(filters.intensity, id) })}
      />
      <Group
        title="Size"
        items={sizes}
        selected={filters.size}
        onToggle={(id) => onChange({ ...filters, size: toggleValue(filters.size, id) })}
      />
      <fieldset className="border-b border-sand py-5">
        <legend className="text-[11px] uppercase tracking-nav text-stone">Highlights</legend>
        <div className="mt-3 space-y-2 text-sm">
          {(
            [
              ["bestSeller", "Best Seller"],
              ["newArrival", "New Arrival"],
              ["featured", "Featured"],
              ["sale", "Sale"],
            ] as const
          ).map(([id, label]) => (
            <label key={id} className="flex items-center gap-3">
              <input
                type="checkbox"
                className="accent-charcoal"
                checked={filters.badges?.includes(id) ?? false}
                onChange={() => {
                  const current = filters.badges ?? [];
                  onChange({
                    ...filters,
                    badges: current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
                  });
                }}
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset className="py-5">
        <legend className="text-[11px] uppercase tracking-nav text-stone">Price</legend>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <input
            type="number"
            aria-label="Minimum price"
            placeholder="Min"
            className="border border-sand bg-ivory px-3 py-2 text-sm"
            value={filters.priceMin ?? ""}
            onChange={(event) =>
              onChange({ ...filters, priceMin: event.target.value ? Number(event.target.value) : undefined })
            }
          />
          <input
            type="number"
            aria-label="Maximum price"
            placeholder="Max"
            className="border border-sand bg-ivory px-3 py-2 text-sm"
            value={filters.priceMax ?? ""}
            onChange={(event) =>
              onChange({ ...filters, priceMax: event.target.value ? Number(event.target.value) : undefined })
            }
          />
        </div>
      </fieldset>
    </form>
  );
}
