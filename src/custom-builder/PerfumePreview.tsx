import type { CSSProperties } from "react";
import { cn } from "@/utils/cn";
import type { CustomPerfumeConfiguration } from "@/types";

const PLACEHOLDER_BOTTLE = "/images/bottles/placeholder.svg";

/**
 * Bottle artwork convention (see public/images/bottles): transparent, capless,
 * cropped tight, with the neck occupying the top ~13% of the bottle's width.
 * The cap is stacked over that neck, so any bottle/cap pair composes.
 */
const NECK_RATIO = 0.13;
const CAP_RATIO = 0.36;

/** Bottle width as a % of the preview, so a 100 ML visibly outsizes a 30 ML. */
function bottleWidth(sizeML?: number): number {
  if (!sizeML) return 54;
  if (sizeML <= 30) return 46;
  if (sizeML <= 50) return 54;
  return 62;
}

interface PerfumePreviewProps {
  configuration: CustomPerfumeConfiguration;
  labelLine1?: string;
  labelLine2?: string;
  className?: string;
}

/** Live composition of the custom perfume: bottle, cap on top, and a printed label. */
export function PerfumePreview({ configuration, labelLine1 = "", labelLine2 = "", className }: PerfumePreviewProps) {
  const { size, fragrance, bottle, cap } = configuration;
  const width = bottleWidth(size?.sizeML);
  const line1 = labelLine1.trim();
  const line2 = labelLine2.trim();

  return (
    <figure className={className}>
      <div
        className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-b from-cream to-ivory"
        style={{ containerType: "inline-size" } as CSSProperties}
      >
        <div
          className="absolute bottom-[10%] left-1/2 h-[3%] w-[50%] -translate-x-1/2 rounded-[50%] bg-charcoal/10 blur-[2px]"
          aria-hidden="true"
        />
        <div className="absolute inset-x-0 bottom-[11%] flex flex-col items-center">
          {cap ? (
            <img
              key={cap.id}
              src={cap.image}
              alt=""
              className="relative z-10 block drop-shadow-sm"
              style={{ width: `${width * CAP_RATIO}%`, marginBottom: `-${width * NECK_RATIO}%` }}
            />
          ) : null}
          <div className="relative transition-[width] duration-500" style={{ width: `${width}%` }}>
            <img
              key={bottle?.id ?? "placeholder"}
              src={bottle?.image ?? PLACEHOLDER_BOTTLE}
              alt=""
              className={cn("block w-full", !bottle && "opacity-60")}
            />
            <div className="absolute left-1/2 top-[58%] w-[68%] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-gold/50 bg-ivory/95 px-[6%] py-[7%] text-center shadow-whisper">
              <p className="text-[2cqw] uppercase leading-none tracking-brand text-gold">ROSADO</p>
              <p
                className={cn(
                  "mt-[0.8cqw] break-words font-display text-[4.6cqw] leading-tight",
                  fragrance ? "text-charcoal" : "text-stone",
                )}
              >
                {fragrance?.name ?? "Your fragrance"}
              </p>
              {line1 || line2 ? (
                <div className="mt-[0.8cqw] space-y-[0.3cqw] font-display text-[3cqw] italic leading-tight text-ink">
                  {line1 ? <p className="break-words">{line1}</p> : null}
                  {line2 ? <p className="break-words">{line2}</p> : null}
                </div>
              ) : null}
              <p className="mt-[1cqw] text-[2.2cqw] uppercase leading-none tracking-nav text-stone">
                {size?.displayName ?? "Size"}
              </p>
            </div>
          </div>
        </div>
      </div>
      <figcaption className="mt-3 text-center text-[11px] uppercase tracking-nav text-stone">
        Live preview{bottle ? ` · ${bottle.name}` : ""}
        {cap ? ` · ${cap.name} cap` : ""}
      </figcaption>
    </figure>
  );
}
