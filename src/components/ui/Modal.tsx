import { useEffect } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";

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

  // Portal to <body> so a filtered/transformed ancestor cannot clip the fixed overlay.
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-charcoal/50 px-4 py-8 sm:py-16"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="w-full max-w-2xl border border-sand bg-ivory p-5 shadow-lift sm:p-6"
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
    </div>,
    document.body,
  );
}
