/**
 * Perfume customizer (GET /api/perfume-customizer/{product}). Layers sit on
 * a 3:4 canvas in percentages: top = % of canvas height, left/width = % of
 * canvas width; image height follows its own aspect ratio.
 */
export interface LayerBox {
  top: number;
  left: number;
  width: number;
  zIndex: number;
}

export interface ImageLayer extends LayerBox {
  image: string;
}

export interface CustomizerProduct {
  id: string | null;
  name: string;
  slug: string | null;
  shortDescription: string;
  image: string | null;
}

export interface CustomizerSize {
  id: string;
  displayName: string;
  sizeML: number;
  /** Product base price for this size. */
  basePrice: number;
}

export interface CustomizerFragrance {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  image: string | null;
  families: string[];
  notes: { top: string[]; heart: string[]; base: string[] };
  /** sizeId -> price; a size missing here isn't offered for this fragrance. */
  prices: Record<string, number>;
  layer: ImageLayer | null;
}

export interface CustomizerBottle {
  id: string;
  name: string;
  image: string | null;
  sizeId: string;
  price: number;
  inStock: boolean;
  layer: ImageLayer | null;
  /** Centre-anchored label box. */
  label: LayerBox;
  /** Per-bottle fits saved in the admin Alignment Tool, keyed by cap / fragrance id. */
  overrides: { caps: Record<string, LayerBox>; fragrances: Record<string, LayerBox> };
}

export interface CustomizerCap {
  id: string;
  name: string;
  image: string | null;
  price: number;
  inStock: boolean;
  /** Empty = fits every size. */
  sizeIds: string[];
  layer: ImageLayer | null;
}

export interface CustomizerData {
  product: CustomizerProduct;
  canvas: { aspect: string };
  sizes: CustomizerSize[];
  fragrances: CustomizerFragrance[];
  bottles: CustomizerBottle[];
  caps: CustomizerCap[];
}

export type PreviewLayerType = "BOTTLE" | "FRAGRANCE" | "CAP";

/** Same shape the backend freezes into cart lines and orders (CustomizerLayers::compose). */
export interface PreviewSnapshot {
  aspect: string;
  layers: Array<ImageLayer & { type: PreviewLayerType }>;
  label: (LayerBox & { title: string; size: string; lines: string[] }) | null;
}
