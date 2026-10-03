import { cn } from "@/utils/cn";
import type { BuilderStep } from "@/types";

const STEPS: Array<{ step: BuilderStep; label: string }> = [
  { step: 1, label: "Size" },
  { step: 2, label: "Fragrance" },
  { step: 3, label: "Bottle" },
  { step: 4, label: "Cap" },
  { step: 5, label: "Personalise" },
];

export function BuilderProgress({ current }: { current: BuilderStep }) {
  return (
    <ol className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
      {STEPS.map((item, index) => (
        <li key={item.step} className="flex min-w-0 flex-1 items-center">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "flex h-6 w-6 items-center justify-center text-[10px]",
                item.step <= current ? "bg-charcoal text-ivory" : "border border-sand text-stone",
              )}
              aria-current={item.step === current ? "step" : undefined}
            >
              {item.step < current ? "●" : item.step === current ? "●" : "○"}
            </span>
            <span className={cn("text-[10px] uppercase tracking-nav", item.step === current ? "text-charcoal" : "text-stone")}>
              {item.label}
            </span>
          </div>
          {index < STEPS.length - 1 ? <span className="mx-2 hidden h-px flex-1 bg-sand sm:block" /> : null}
        </li>
      ))}
    </ol>
  );
}
