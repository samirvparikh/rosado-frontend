import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

export function PageShell({
  children,
  className,
  wide,
}: {
  children: ReactNode;
  className?: string;
  wide?: boolean;
}) {
  return (
    <div className={cn(wide ? "mx-auto max-w-page px-4 sm:px-6 lg:px-10" : "mx-auto max-w-6xl px-4 sm:px-6", className)}>
      {children}
    </div>
  );
}
