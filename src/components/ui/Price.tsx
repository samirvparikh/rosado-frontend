import { formatCurrency } from "@/utils/formatCurrency";
import { cn } from "@/utils/cn";

interface PriceProps {
  amount: number;
  compareAt?: number;
  size?: "sm" | "md" | "lg";
  prefix?: string;
}

export function Price({ amount, compareAt, size = "md", prefix }: PriceProps) {
  return (
    <span className={cn("inline-flex items-baseline gap-2", size === "lg" && "font-display text-3xl", size === "md" && "text-sm", size === "sm" && "text-xs")}>
      {prefix ? <span className="text-[11px] uppercase tracking-nav text-stone">{prefix}</span> : null}
      <span>{formatCurrency(amount)}</span>
      {compareAt && compareAt > amount ? (
        <span className="text-stone line-through">{formatCurrency(compareAt)}</span>
      ) : null}
    </span>
  );
}
