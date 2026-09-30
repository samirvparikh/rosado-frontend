import { cn } from "@/utils/cn";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "gold";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  children: ReactNode;
}

const variants: Record<Variant, string> = {
  primary: "bg-charcoal text-ivory hover:bg-ink",
  secondary: "border border-charcoal/20 bg-transparent text-charcoal hover:border-charcoal",
  ghost: "bg-transparent text-charcoal hover:text-gold",
  gold: "bg-gold text-charcoal hover:bg-gold-soft",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-[11px]",
  md: "px-6 py-3 text-[12px]",
  lg: "px-8 py-3.5 text-[13px]",
};

export function Button({
  variant = "primary",
  size = "md",
  fullWidth,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 tracking-[0.16em] uppercase transition-colors disabled:cursor-not-allowed disabled:opacity-40",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
