import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { PageShell } from "@/components/layout/PageShell";
import { PageMeta } from "@/components/seo/PageMeta";
import { useCart } from "@/hooks/useCart";
import { getCustomizer } from "@/services/customizerApi";
import { ApiError } from "@/services/http";
import { composePreview } from "@/utils/customizerLayers";
import { formatCurrency } from "@/utils/formatCurrency";
import { PerfumePreview } from "./PerfumePreview";
import { PriceSummary, type PriceBreakdown } from "./PriceSummary";
import { BottleSelector, CapSelector, FragranceSelector, SelectorSection, SizeSelector } from "./selectors";
import type { CustomizerData } from "@/types";

/** Mirrors CartQuoteService::LABEL_LINE_MAX / remarks cap on the backend. */
export const LABEL_LINE_MAX_LENGTH = 24;
export const REMARKS_MAX_LENGTH = 500;

interface Selection {
  sizeId?: string;
  fragranceId?: string;
  bottleId?: string;
  capId?: string;
}

const fitsSize = (sizeIds: string[], sizeId: string) => sizeIds.length === 0 || sizeIds.includes(sizeId);

/**
 * Picks a complete, purchasable configuration for `sizeId`, keeping whatever
 * the customer already chose when it still fits the new size.
 */
function resolveSelection(data: CustomizerData, sizeId: string, current: Selection = {}): Selection {
  const fragrances = data.fragrances.filter((f) => f.prices[sizeId] !== undefined);
  const bottles = data.bottles.filter((b) => b.sizeId === sizeId && b.inStock);
  const caps = data.caps.filter((c) => c.inStock && fitsSize(c.sizeIds, sizeId));
  const keep = <T extends { id: string }>(list: T[], id?: string) => list.find((item) => item.id === id)?.id ?? list[0]?.id;

  return {
    sizeId,
    fragranceId: keep(fragrances, current.fragranceId),
    bottleId: keep(bottles, current.bottleId),
    capId: keep(caps, current.capId),
  };
}

const inputClass =
  "mt-2 block w-full rounded-xl border border-sand bg-transparent px-3 py-2.5 text-sm placeholder:text-mist focus:border-charcoal focus:outline-none";

export function PerfumeCustomizer({ productRef }: { productRef?: string }) {
  const navigate = useNavigate();
  const { addCustom } = useCart();
  const [data, setData] = useState<CustomizerData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selection, setSelection] = useState<Selection>({});
  const [labelLine1, setLabelLine1] = useState("");
  const [labelLine2, setLabelLine2] = useState("");
  const [remarks, setRemarks] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState("");

  const load = useCallback(() => {
    let cancelled = false;
    setData(null);
    setLoadError(null);
    getCustomizer(productRef)
      .then((next) => {
        if (cancelled) return;
        setData(next);
        // Start on the first size that can actually be built.
        const startSize =
          next.sizes.find((size) => next.bottles.some((b) => b.sizeId === size.id && b.inStock)) ?? next.sizes[0];
        setSelection(startSize ? resolveSelection(next, startSize.id) : {});
      })
      .catch((error) => {
        if (!cancelled) {
          setLoadError(error instanceof ApiError ? error.message : "Unable to load the atelier. Please try again.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [productRef]);

  useEffect(() => load(), [load]);

  const size = data?.sizes.find((s) => s.id === selection.sizeId) ?? null;
  const fragrance = data?.fragrances.find((f) => f.id === selection.fragranceId) ?? null;
  const bottle = data?.bottles.find((b) => b.id === selection.bottleId) ?? null;
  const cap = data?.caps.find((c) => c.id === selection.capId) ?? null;

  const bottlesForSize = useMemo(
    () => (data && size ? data.bottles.filter((b) => b.sizeId === size.id) : []),
    [data, size],
  );
  const capsForSize = useMemo(
    () => (data && size ? data.caps.filter((c) => fitsSize(c.sizeIds, size.id)) : []),
    [data, size],
  );

  const preview = useMemo(
    () =>
      composePreview({
        aspect: data?.canvas.aspect ?? "3 / 4",
        size,
        fragrance,
        bottle,
        cap,
        labelLines: [labelLine1, labelLine2],
      }),
    [data, size, fragrance, bottle, cap, labelLine1, labelLine2],
  );

  const price: PriceBreakdown = useMemo(() => {
    const base = size?.basePrice ?? 0;
    const fragrancePrice = size && fragrance ? (fragrance.prices[size.id] ?? 0) : 0;
    const unit = base + fragrancePrice + (bottle?.price ?? 0) + (cap?.price ?? 0);
    return {
      base,
      fragrance: fragrancePrice,
      bottle: bottle?.price ?? 0,
      cap: cap?.price ?? 0,
      unit,
      quantity,
      total: unit * quantity,
    };
  }, [size, fragrance, bottle, cap, quantity]);

  const complete = Boolean(size && fragrance && bottle && cap);

  function update(next: Partial<Selection>) {
    setMessage("");
    setSelection((current) => ({ ...current, ...next }));
  }

  function selectSize(sizeId: string) {
    if (!data) return;
    setMessage("");
    setSelection((current) => resolveSelection(data, sizeId, current));
  }

  async function addToCart() {
    if (!data || !size || !fragrance || !bottle || !cap) {
      setMessage("Choose a size, fragrance, bottle and cap to continue.");
      return;
    }
    setAdding(true);
    setMessage("");
    try {
      await addCustom(
        {
          productId: data.product.id,
          sizeId: size.id,
          fragranceId: fragrance.id,
          bottleId: bottle.id,
          capId: cap.id,
          quantity,
          remarks: remarks.trim() || undefined,
          labelLine1: labelLine1.trim() || undefined,
          labelLine2: labelLine2.trim() || undefined,
        },
        bottle.image ?? "",
      );
      navigate("/cart");
    } catch (error) {
      setMessage(error instanceof ApiError ? error.message : "Unable to add this perfume. Please try again.");
    } finally {
      setAdding(false);
    }
  }

  if (loadError) {
    return (
      <PageShell className="py-16">
        <ErrorState message={loadError} onRetry={load} />
      </PageShell>
    );
  }

  if (!data) {
    return (
      <PageShell className="py-10 lg:py-14">
        <LoadingSkeleton className="h-4 w-32" />
        <LoadingSkeleton className="mt-3 h-12 w-80 max-w-full" />
        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
          <LoadingSkeleton className="mx-auto aspect-[3/4] w-full max-w-[320px] rounded-3xl lg:max-w-none" />
          <div className="space-y-8">
            <LoadingSkeleton className="h-11 w-64" />
            <div className="grid grid-cols-3 gap-4">
              <LoadingSkeleton className="aspect-square rounded-2xl" />
              <LoadingSkeleton className="aspect-square rounded-2xl" />
              <LoadingSkeleton className="aspect-square rounded-2xl" />
            </div>
            <LoadingSkeleton className="h-40 rounded-2xl" />
          </div>
        </div>
      </PageShell>
    );
  }

  const addButtonLabel = adding ? "Adding…" : "Add to Cart";

  return (
    <>
      <PageMeta
        title={`Create your ${data.product.name}`}
        description={data.product.shortDescription}
        canonical={`${window.location.origin}/custom-perfume${data.product.slug ? `/${data.product.slug}` : ""}`}
      />
      <PageShell className="pb-28 pt-8 sm:pb-14 lg:pt-12">
        <p className="text-[11px] uppercase tracking-nav text-gold">Custom perfume</p>
        <h1 className="mt-2 font-display text-4xl sm:text-5xl">{data.product.name}</h1>
        <p className="mt-2 max-w-xl text-sm text-stone">{data.product.shortDescription}</p>

        <div className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-10 lg:mt-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-14">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <PerfumePreview preview={preview} className="mx-auto w-full max-w-[300px] rounded-3xl sm:max-w-[380px] lg:max-w-none" />
            <p className="mt-4 text-center text-[11px] uppercase tracking-nav text-stone">
              {[size?.displayName, fragrance?.name, bottle?.name, cap ? `${cap.name} cap` : null].filter(Boolean).join(" · ")}
            </p>
          </div>

          <div className="space-y-10">
            <SelectorSection step={1} title="Choose size" summary={size?.displayName}>
              <SizeSelector sizes={data.sizes} selectedId={size?.id} onSelect={selectSize} />
            </SelectorSection>

            <SelectorSection step={2} title="Choose fragrance" summary={fragrance?.name}>
              <FragranceSelector
                fragrances={data.fragrances}
                sizeId={size?.id}
                selectedId={fragrance?.id}
                onSelect={(fragranceId) => update({ fragranceId })}
              />
              {fragrance ? (
                <div className="mt-4 rounded-2xl bg-cream/60 p-4 text-sm">
                  <p className="leading-6 text-stone">{fragrance.description}</p>
                  <dl className="mt-3 grid grid-cols-3 gap-3 text-[11px] uppercase tracking-nav">
                    {(["top", "heart", "base"] as const).map((tier) => (
                      <div key={tier}>
                        <dt className="text-gold">{tier}</dt>
                        <dd className="mt-1 normal-case tracking-normal text-ink">{fragrance.notes[tier].join(", ") || "—"}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ) : null}
            </SelectorSection>

            <SelectorSection step={3} title="Choose bottle" summary={bottle?.name}>
              <BottleSelector bottles={bottlesForSize} selectedId={bottle?.id} onSelect={(bottleId) => update({ bottleId })} />
            </SelectorSection>

            <SelectorSection step={4} title="Choose cap" summary={cap?.name}>
              <CapSelector caps={capsForSize} selectedId={cap?.id} onSelect={(capId) => update({ capId })} />
            </SelectorSection>

            <SelectorSection step={5} title="Personalise label (optional)">
              <div className="grid gap-4 sm:grid-cols-2">
                {(
                  [
                    ["label-line-1", "Line 1", labelLine1, setLabelLine1, "e.g. For Aisha"],
                    ["label-line-2", "Line 2", labelLine2, setLabelLine2, "e.g. With love, 2026"],
                  ] as const
                ).map(([id, label, value, setValue, placeholder]) => (
                  <div key={id}>
                    <label htmlFor={id} className="text-[11px] uppercase tracking-nav text-stone">
                      {label}
                    </label>
                    <input
                      id={id}
                      type="text"
                      value={value}
                      onChange={(event) => setValue(event.target.value)}
                      maxLength={LABEL_LINE_MAX_LENGTH}
                      placeholder={placeholder}
                      className={inputClass}
                    />
                    <p className="mt-1 text-right text-[11px] text-stone">
                      {value.length}/{LABEL_LINE_MAX_LENGTH}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-2">
                <label htmlFor="custom-remarks" className="text-[11px] uppercase tracking-nav text-stone">
                  Remarks
                </label>
                <textarea
                  id="custom-remarks"
                  value={remarks}
                  onChange={(event) => setRemarks(event.target.value)}
                  maxLength={REMARKS_MAX_LENGTH}
                  rows={2}
                  placeholder="Any special instructions, e.g. a gift note."
                  className={`${inputClass} resize-y`}
                />
              </div>
            </SelectorSection>

            <div className="space-y-4">
              <PriceSummary price={price} />
              <div className="hidden items-center gap-4 sm:flex">
                <QuantitySelector value={quantity} onChange={setQuantity} />
                <Button type="button" size="lg" className="flex-1 rounded-full" onClick={() => void addToCart()} disabled={adding || !complete}>
                  {addButtonLabel}
                </Button>
              </div>
              {message ? (
                <p className="text-sm text-rose" role="alert">
                  {message}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </PageShell>

      {/* Mobile: sticky summary + add to cart. */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-sand bg-ivory/95 px-4 py-3 backdrop-blur sm:hidden">
        <div className="flex items-center gap-3">
          <PerfumePreview preview={preview} compact className="w-11 shrink-0 rounded-lg" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] uppercase tracking-nav text-stone">
              {[size?.displayName, fragrance?.name].filter(Boolean).join(" · ")}
            </p>
            <p className="font-display text-xl leading-tight">{formatCurrency(price.total)}</p>
          </div>
          <Button type="button" className="rounded-full" onClick={() => void addToCart()} disabled={adding || !complete}>
            {addButtonLabel}
          </Button>
        </div>
      </div>
    </>
  );
}
