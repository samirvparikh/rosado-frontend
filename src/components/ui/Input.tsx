import { cn } from "@/utils/cn";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, id, className, ...props }: InputProps) {
  const inputId = id ?? props.name;
  return (
    <label className="block" htmlFor={inputId}>
      <span className="mb-2 block text-[11px] uppercase tracking-nav text-stone">{label}</span>
      <input
        id={inputId}
        className={cn(
          "w-full border bg-ivory px-4 py-3 text-sm text-charcoal placeholder:text-mist",
          error ? "border-rose" : "border-sand focus:border-gold",
          className,
        )}
        {...props}
      />
      {error ? <span className="mt-1 block text-xs text-rose">{error}</span> : null}
    </label>
  );
}
