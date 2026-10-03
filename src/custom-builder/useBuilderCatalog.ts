import { useCallback, useEffect, useState } from "react";
import { getBottlesBySize } from "@/services/bottleApi";
import { getCaps } from "@/services/capApi";
import { getFragrances } from "@/services/fragranceApi";
import { getSizes } from "@/services/sizeApi";
import type { Bottle, Cap, FragranceWithNotes, Size } from "@/types";

export function useBuilderCatalog(sizeId?: string) {
  const [sizes, setSizes] = useState<Size[]>([]);
  const [fragrances, setFragrances] = useState<FragranceWithNotes[]>([]);
  const [caps, setCaps] = useState<Cap[]>([]);
  const [bottles, setBottles] = useState<Bottle[]>([]);
  const [bottlesLoading, setBottlesLoading] = useState(false);
  const [bottlesError, setBottlesError] = useState<string | null>(null);
  const [catalogError, setCatalogError] = useState<string | null>(null);

  // Sizes and fragrances don't depend on the chosen size -- load them once.
  useEffect(() => {
    let cancelled = false;
    Promise.all([getSizes(), getFragrances()])
      .then(([nextSizes, nextFragrances]) => {
        if (cancelled) return;
        setSizes(nextSizes);
        setFragrances(nextFragrances);
      })
      .catch(() => {
        if (!cancelled) setCatalogError("Unable to load the atelier. Please try again.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Caps can be restricted per size, so they follow the selection.
  useEffect(() => {
    let cancelled = false;
    getCaps(sizeId)
      .then((nextCaps) => {
        if (!cancelled) setCaps(nextCaps);
      })
      .catch(() => {
        if (!cancelled) setCatalogError("Unable to load the atelier. Please try again.");
      });
    return () => {
      cancelled = true;
    };
  }, [sizeId]);

  const loadBottles = useCallback(async (id: string) => {
    setBottlesLoading(true);
    setBottlesError(null);
    try {
      const next = await getBottlesBySize(id);
      setBottles(next);
    } catch {
      setBottles([]);
      setBottlesError("Unable to load available bottles. Please try again.");
    } finally {
      setBottlesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!sizeId) {
      setBottles([]);
      return;
    }
    void loadBottles(sizeId);
  }, [sizeId, loadBottles]);

  return { sizes, fragrances, caps, bottles, bottlesLoading, bottlesError, catalogError, reloadBottles: loadBottles };
}
