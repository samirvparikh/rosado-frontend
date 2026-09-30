import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { PageShell } from "@/components/layout/PageShell";
import { PageMeta } from "@/components/seo/PageMeta";
import { BuilderProgress } from "@/custom-builder/BuilderProgress";
import { BuilderSummary } from "@/custom-builder/BuilderSummary";
import { BottleStep } from "@/custom-builder/BottleStep";
import { CapStep } from "@/custom-builder/CapStep";
import { FragranceStep } from "@/custom-builder/FragranceStep";
import { PreviewStep } from "@/custom-builder/PreviewStep";
import { SizeStep } from "@/custom-builder/SizeStep";
import { useBuilderCatalog } from "@/custom-builder/useBuilderCatalog";
import { useCart } from "@/hooks/useCart";
import { formatCurrency } from "@/utils/formatCurrency";
import { useCustomPerfume } from "@/hooks/useCustomPerfume";
import { ApiError } from "@/services/http";
import type { BuilderStep } from "@/types";

function canContinue(step: BuilderStep, configuration: ReturnType<typeof useCustomPerfume>["configuration"]) {
  if (step === 1) return Boolean(configuration.size);
  if (step === 2) return Boolean(configuration.fragrance);
  if (step === 3) return Boolean(configuration.bottle);
  if (step === 4) return Boolean(configuration.cap);
  return Boolean(configuration.size && configuration.fragrance && configuration.bottle && configuration.cap);
}

function missingMessage(step: BuilderStep) {
  if (step === 1) return "Please select a size before continuing.";
  if (step === 2) return "Please select a fragrance before continuing.";
  if (step === 3) return "Please select a bottle before continuing.";
  if (step === 4) return "Please select a cap before continuing.";
  return "";
}

export function CustomPerfumePage() {
  const navigate = useNavigate();
  const { addCustom } = useCart();
  const { step, configuration, setStep, selectSize, selectFragrance, selectBottle, selectCap } = useCustomPerfume();
  const catalog = useBuilderCatalog(configuration.size?.id);
  const [message, setMessage] = useState("");
  const [adding, setAdding] = useState(false);

  const ready = useMemo(() => canContinue(step, configuration), [step, configuration]);

  function next() {
    if (!ready) {
      setMessage(missingMessage(step));
      return;
    }
    setMessage("");
    if (step < 5) setStep((step + 1) as BuilderStep);
  }

  function back() {
    setMessage("");
    if (step > 1) setStep((step - 1) as BuilderStep);
  }

  async function addToCart() {
    if (!configuration.size || !configuration.fragrance || !configuration.bottle || !configuration.cap) {
      setMessage("Complete the perfume configuration.");
      return;
    }
    setAdding(true);
    setMessage("");
    try {
      await addCustom(
        {
          sizeId: configuration.size.id,
          fragranceId: configuration.fragrance.id,
          bottleId: configuration.bottle.id,
          capId: configuration.cap.id,
          quantity: 1,
        },
        configuration.fragrance.image ?? configuration.bottle.image,
      );
      navigate("/cart");
    } catch (error) {
      setMessage(error instanceof ApiError ? error.message : "Unable to add this perfume. Please try again.");
    } finally {
      setAdding(false);
    }
  }

  if (catalog.catalogError) {
    return (
      <PageShell className="py-16">
        <ErrorState message={catalog.catalogError} onRetry={() => window.location.reload()} />
      </PageShell>
    );
  }

  return (
    <>
      <PageMeta
        title="Create Your Perfume"
        description="Compose a ROSADO perfume: choose size, fragrance, bottle and cap."
        canonical={`${window.location.origin}/custom-perfume`}
      />
      <PageShell className="py-10 lg:py-14">
        <p className="text-[11px] uppercase tracking-nav text-gold">Custom perfume</p>
        <h1 className="mt-2 font-display text-5xl">Create your ROSADO</h1>
        <div className="mt-8">
          <BuilderProgress current={step} />
        </div>
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
          <section>
            {step === 1 ? (
              <SizeStep sizes={catalog.sizes} selectedId={configuration.size?.id} onSelect={selectSize} />
            ) : null}
            {step === 2 && configuration.size ? (
              <FragranceStep
                fragrances={catalog.fragrances}
                selectedId={configuration.fragrance?.id}
                sizeId={configuration.size.id}
                onSelect={selectFragrance}
              />
            ) : null}
            {step === 3 && configuration.size ? (
              <BottleStep
                bottles={catalog.bottles}
                selectedId={configuration.bottle?.id}
                sizeLabel={configuration.size.displayName}
                loading={catalog.bottlesLoading}
                error={catalog.bottlesError}
                onRetry={() => void catalog.reloadBottles(configuration.size!.id)}
                onSelect={selectBottle}
              />
            ) : null}
            {step === 4 ? (
              <CapStep caps={catalog.caps} selectedId={configuration.cap?.id} onSelect={selectCap} />
            ) : null}
            {step === 5 ? <PreviewStep configuration={configuration} /> : null}
            {message ? <p className="mt-6 text-sm text-rose">{message}</p> : null}
            <div className="mt-8 hidden gap-3 sm:flex">
              {step > 1 ? (
                <Button type="button" variant="secondary" onClick={back}>
                  Back
                </Button>
              ) : null}
              {step < 5 ? (
                <Button type="button" onClick={next} disabled={!ready}>
                  Continue
                </Button>
              ) : (
                <Button type="button" onClick={() => void addToCart()} disabled={adding || !ready}>
                  {adding ? "Adding…" : "Add to Cart"}
                </Button>
              )}
            </div>
          </section>
          <div className="hidden lg:block">
            <div className="sticky top-28">
              <BuilderSummary configuration={configuration} />
            </div>
          </div>
        </div>
      </PageShell>
      <div className="sticky bottom-0 z-30 border-t border-sand bg-ivory/95 px-4 py-3 backdrop-blur sm:hidden">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span>{configuration.size?.displayName ?? "Compose"}</span>
          <span>{configuration.totalPrice ? formatCurrency(configuration.totalPrice) : "—"}</span>
        </div>
        <div className="flex gap-2">
          {step > 1 ? (
            <Button type="button" variant="secondary" onClick={back} className="flex-1">
              Back
            </Button>
          ) : null}
          {step < 5 ? (
            <Button type="button" onClick={next} disabled={!ready} className="flex-1">
              Continue
            </Button>
          ) : (
            <Button type="button" onClick={() => void addToCart()} disabled={adding || !ready} className="flex-1">
              Add to Cart
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
