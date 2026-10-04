import type {
  CustomizerBottle,
  CustomizerCap,
  CustomizerFragrance,
  CustomizerSize,
  ImageLayer,
  PreviewSnapshot,
} from "@/types";

/** Mirrors App\Support\CustomizerLayers::compose() so the live preview matches the order snapshot. */
export function composePreview({
  aspect,
  size,
  fragrance,
  bottle,
  cap,
  labelLines = [],
}: {
  aspect: string;
  size: CustomizerSize | null;
  fragrance: CustomizerFragrance | null;
  bottle: CustomizerBottle | null;
  cap: CustomizerCap | null;
  labelLines?: string[];
}): PreviewSnapshot {
  const layers: PreviewSnapshot["layers"] = [];
  const withOverride = (layer: ImageLayer, override?: ImageLayer | Omit<ImageLayer, "image">): ImageLayer =>
    override ? { ...override, image: layer.image } : layer;

  if (bottle?.layer) layers.push({ type: "BOTTLE", ...bottle.layer });
  if (fragrance?.layer) {
    layers.push({ type: "FRAGRANCE", ...withOverride(fragrance.layer, bottle?.overrides.fragrances[fragrance.id]) });
  }
  if (cap?.layer) {
    layers.push({ type: "CAP", ...withOverride(cap.layer, bottle?.overrides.caps[cap.id]) });
  }

  return {
    aspect,
    layers,
    label: bottle
      ? {
          ...bottle.label,
          title: fragrance?.name ?? "",
          size: size?.displayName ?? "",
          lines: labelLines.map((line) => line.trim()).filter(Boolean),
        }
      : null,
  };
}
