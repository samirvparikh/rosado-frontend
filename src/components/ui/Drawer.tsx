import { useEffect } from "react";
import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

interface DrawerProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  side?: "left" | "right";
}

export function Drawer({ open, title, onClose, children, side = "right" }: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <div className={cn("fixed inset-0 z-50", open ? "pointer-events-auto" : "pointer-events-none")}>
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-charcoal/40 transition-opacity",
          open ? "opacity-100" : "opacity-0",
        )}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        className={cn(
          "absolute top-0 flex h-full w-[min(100%,380px)] flex-col bg-ivory transition-transform duration-300",
          side === "right" ? "right-0" : "left-0",
          open ? "translate-x-0" : side === "right" ? "translate-x-full" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-sand px-6 py-5">
          <h2 id="drawer-title" className="font-display text-2xl">
            {title}
          </h2>
          <button type="button" onClick={onClose} className="text-[11px] uppercase tracking-nav">
            Close
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
      </aside>
    </div>
  );
}
