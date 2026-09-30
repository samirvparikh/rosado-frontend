import { PageShell } from "@/components/layout/PageShell";
import { PageMeta } from "@/components/seo/PageMeta";

export function AboutPage() {
  return (
    <>
      <PageMeta
        title="About ROSADO"
        description="ROSADO is a maison for composed fragrance. Size, bottle and cap are components of the perfume you create."
      />
      <PageShell className="py-16">
        <p className="text-[11px] uppercase tracking-nav text-gold">Maison</p>
        <h1 className="mt-3 font-display text-5xl">About ROSADO</h1>
        <div className="mt-10 max-w-2xl space-y-6 text-sm leading-8 text-stone">
          <p>
            ROSADO is built around a single customer journey: discover a fragrance, choose a size, select a bottle made
            for that size, finish with a cap, and take home a perfume you composed.
          </p>
          <p>
            Bottles and caps are not merchandise. They exist only inside a custom perfume. Ready-made compositions are
            finished in the atelier and sold as complete products, each size priced and stocked independently.
          </p>
          <p>
            We keep historical orders as snapshots. If a vessel’s price changes tomorrow, yesterday’s order does not.
          </p>
        </div>
      </PageShell>
    </>
  );
}
