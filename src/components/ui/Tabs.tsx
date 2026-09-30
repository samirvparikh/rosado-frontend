import { cn } from "@/utils/cn";

interface TabsProps {
  tabs: Array<{ id: string; label: string }>;
  value: string;
  onChange: (id: string) => void;
}

export function Tabs({ tabs, value, onChange }: TabsProps) {
  return (
    <div role="tablist" className="flex gap-6 border-b border-sand">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={value === tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "pb-3 text-[11px] uppercase tracking-nav",
            value === tab.id ? "border-b border-charcoal text-charcoal" : "text-stone",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
