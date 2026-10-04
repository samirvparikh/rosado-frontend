import type { CSSProperties } from "react";
import { cn } from "@/utils/cn";
import type { PreviewSnapshot } from "@/types";

interface PerfumePreviewProps {
  preview: PreviewSnapshot;
  /** Include a width class (defaults to w-full). */
  className?: string;
  /** Small thumbnails (cart, orders) skip the soft floor shadow. */
  compact?: boolean;
}

/**
 * Assembles the perfume in the browser: transparent component images stacked
 * with absolute positioning and z-index on a shared canvas, plus the printed
 * label. No composite image is generated per combination.
 */
export function PerfumePreview({ preview, className, compact = false }: PerfumePreviewProps) {
  const { label } = preview;

  return (
    <div
      className={cn("relative overflow-hidden bg-gradient-to-b from-cream to-ivory", className ?? "w-full")}
      style={{ aspectRatio: preview.aspect, containerType: "inline-size" } as CSSProperties}
    >
      {!compact ? (
        <div
          className="absolute bottom-[8.5%] left-1/2 h-[2.5%] w-[46%] -translate-x-1/2 rounded-[50%] bg-charcoal/10 blur-[3px]"
          aria-hidden="true"
        />
      ) : null}
      {preview.layers.map((layer) => (
        <img
          // Re-keying on the image replays the fade when a component changes.
          key={`${layer.type}-${layer.image}`}
          src={layer.image}
          alt=""
          draggable={false}
          className="animate-layer-in absolute h-auto max-w-none select-none transition-[top,left,width] duration-300"
          style={{ top: `${layer.top}%`, left: `${layer.left}%`, width: `${layer.width}%`, zIndex: layer.zIndex }}
        />
      ))}
      {label && (label.title || label.lines.length) ? (
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-[1.2cqw] border border-gold/50 bg-ivory/95 px-[2cqw] py-[2.6cqw] text-center"
          style={{ top: `${label.top}%`, left: `${label.left}%`, width: `${label.width}%`, zIndex: label.zIndex }}
        >
          <p className="text-[2cqw] uppercase leading-none tracking-brand text-gold">ROSADO</p>
          {label.title ? (
            <p className="mt-[0.8cqw] break-words font-display text-[4.4cqw] leading-tight text-charcoal">{label.title}</p>
          ) : null}
          {label.lines.map((line, index) => (
            <p key={index} className="break-words font-display text-[2.9cqw] italic leading-tight text-ink">
              {line}
            </p>
          ))}
          {label.size ? (
            <p className="mt-[1cqw] text-[2.1cqw] uppercase leading-none tracking-nav text-stone">{label.size}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
