import { create } from "zustand";
import { persist } from "zustand/middleware";
import { EMPTY_CONFIGURATION } from "@/types";
import { applyConfigurationPrices } from "@/utils/price";
import { getFragranceBasePrice } from "@/services/fragranceApi";
import type { Bottle, BuilderStep, Cap, CustomPerfumeConfiguration, Fragrance, Size } from "@/types";

interface CustomPerfumeState {
  step: BuilderStep;
  configuration: CustomPerfumeConfiguration;
  setStep: (step: BuilderStep) => void;
  selectSize: (size: Size) => void;
  selectFragrance: (fragrance: Fragrance) => void;
  selectBottle: (bottle: Bottle) => void;
  selectCap: (cap: Cap) => void;
  reset: () => void;
}

function withPrices(configuration: CustomPerfumeConfiguration): CustomPerfumeConfiguration {
  const basePrice =
    configuration.size && configuration.fragrance
      ? getFragranceBasePrice(configuration.fragrance.id, configuration.size.id)
      : 0;
  return applyConfigurationPrices({ ...configuration, basePrice });
}

export const useCustomPerfumeStore = create<CustomPerfumeState>()(
  persist(
    (set) => ({
      step: 1,
      configuration: EMPTY_CONFIGURATION,
      setStep: (step) => set({ step }),
      selectSize: (size) =>
        set((state) => {
          const sizeChanged = state.configuration.size?.id !== size.id;
          return {
            configuration: withPrices({
              ...state.configuration,
              size,
              bottle: sizeChanged ? null : state.configuration.bottle,
            }),
          };
        }),
      selectFragrance: (fragrance) =>
        set((state) => ({
          configuration: withPrices({ ...state.configuration, fragrance }),
        })),
      selectBottle: (bottle) =>
        set((state) => ({
          configuration: withPrices({ ...state.configuration, bottle }),
        })),
      selectCap: (cap) =>
        set((state) => ({
          configuration: withPrices({ ...state.configuration, cap }),
        })),
      reset: () => set({ step: 1, configuration: EMPTY_CONFIGURATION }),
    }),
    {
      name: "rosado.custom-perfume",
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        const { size, bottle } = state.configuration;
        if (size && bottle && bottle.sizeId !== size.id) {
          state.configuration = withPrices({ ...state.configuration, bottle: null });
        }
      },
    },
  ),
);
