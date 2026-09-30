import { cn } from "@/utils/cn";

export function Badge({ children, tone = "ink" }: { children: string; tone?: "ink" | "gold" }) {
  return (
    <span
      className={cn(
        "inline-block px-2 py-1 text-[10px] uppercase tracking-nav",
        tone === "gold" ? "bg-gold/15 text-gold" : "bg-charcoal text-ivory",
      )}
    >
      {children}
    </span>
  );
}
