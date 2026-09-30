import { PageShell } from "@/components/layout/PageShell";
import { PageMeta } from "@/components/seo/PageMeta";

const COPY: Record<string, { title: string; body: string }> = {
  privacy: {
    title: "Privacy Policy",
    body: "ROSADO stores only what is required to fulfil an order: name, mobile, email and shipping address. Custom perfume configurations are kept as order snapshots. We do not sell customer data.",
  },
  terms: {
    title: "Terms & Conditions",
    body: "Bottles and caps are components of a custom perfume and are not sold independently. Prices displayed in the builder are estimates; the order service recalculates the payable amount. Placed orders are snapshots and do not change when master data changes.",
  },
  shipping: {
    title: "Shipping Policy",
    body: "Standard shipping is complimentary above ₹999. Express dispatch is available at checkout. Custom compositions are made after the order is validated.",
  },
  returns: {
    title: "Return Policy",
    body: "Ready-made sealed perfumes may be returned within 7 days if unused. Custom compositions are made to order and cannot be returned unless the delivered configuration differs from the snapshot.",
  },
};

export function LegalPage({ kind }: { kind: keyof typeof COPY }) {
  const page = COPY[kind];
  return (
    <>
      <PageMeta title={page.title} description={page.body} />
      <PageShell className="max-w-2xl py-16">
        <h1 className="font-display text-5xl">{page.title}</h1>
        <p className="mt-8 text-sm leading-8 text-stone">{page.body}</p>
      </PageShell>
    </>
  );
}
