import type { ReactNode } from "react";

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="py-20 text-center">
      <h2 className="font-display text-3xl">{title}</h2>
      {children ? <div className="mt-4 text-sm text-stone">{children}</div> : null}
    </div>
  );
}
