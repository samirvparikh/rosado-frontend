import { cn } from "@/utils/cn";
import type { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

export function Select({ label, error, id, options, className, ...props }: SelectProps) {
  const selectId = id ?? props.name;
  return (
    <label className="block" htmlFor={selectId}>
      <span className="mb-2 block text-[11px] uppercase tracking-nav text-stone">{label}</span>
      <select
        id={selectId}
        className={cn(
          "w-full appearance-none border bg-ivory px-4 py-3 text-sm text-charcoal",
          error ? "border-rose" : "border-sand focus:border-gold",
          className,
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <span className="mt-1 block text-xs text-rose">{error}</span> : null}
    </label>
  );
}
