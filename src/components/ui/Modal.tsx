import { useEffect } from "react";
import type { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ open, title, onClose, children }: ModalProps) {
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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-charcoal/50 px-4 py-16" role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="w-full max-w-2xl border border-sand bg-ivory p-6 shadow-lift"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 id="modal-title" className="font-display text-2xl">
            {title}
          </h2>
          <button type="button" onClick={onClose} className="text-[11px] uppercase tracking-nav text-stone">
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
