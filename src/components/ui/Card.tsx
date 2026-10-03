import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("overflow-hidden rounded-2xl bg-cream/40", className)}>{children}</div>;
}
