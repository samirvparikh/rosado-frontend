import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { PageShell } from "@/components/layout/PageShell";
import { PageMeta } from "@/components/seo/PageMeta";
import { getOrderById } from "@/services/orderApi";
import { formatCurrency } from "@/utils/formatCurrency";
import type { Order } from "@/types";

export function OrderDetailPage() {
  const { id = "" } = useParams();
  const placed = Boolean((useLocation().state as { placed?: boolean } | null)?.placed);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getOrderById(id)
      .then((result) => {
        if (!result) setError("This order could not be found.");
        setOrder(result);
      })
      .catch(() => setError("Something went wrong. Please try again."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <PageShell className="py-12">
        <LoadingSkeleton className="h-64" />
      </PageShell>
    );
  }

  if (error || !order) {
    return (
      <PageShell className="py-12">
        <ErrorState message={error ?? "This order could not be found."} />
      </PageShell>
    );
  }

  return (
    <>
      <PageMeta title={`Order #${order.orderNumber}`} description="Order snapshot." />
      <PageShell className="py-12">
        {placed ? <p className="text-[11px] uppercase tracking-nav text-gold">Order placed</p> : null}
        <h1 className="mt-2 font-display text-5xl">Order #{order.orderNumber}</h1>
        <p className="mt-2 text-sm text-stone">
          {new Date(order.createdAt).toLocaleString("en-IN")} · {order.status}
        </p>
        <section className="mt-10 space-y-8">
          {order.items.map((item, index) => (
            <article key={`${item.productName}-${index}`} className="border-t border-sand pt-6">
              <p className="text-[11px] uppercase tracking-nav text-gold">{item.productType}</p>
              <h2 className="font-display text-3xl">{item.productName}</h2>
              <ul className="mt-3 space-y-1 text-sm">
                <li>Size: {item.sizeName}</li>
                {item.fragranceName ? <li>Fragrance: {item.fragranceName}</li> : null}
                {item.bottleName ? <li>Bottle: {item.bottleName}</li> : null}
                {item.capName ? <li>Cap: {item.capName}</li> : null}
                <li>Quantity: {item.quantity}</li>
              </ul>
              <dl className="mt-4 max-w-xs space-y-1 text-sm">
                <div className="flex justify-between">
                  <dt>Base</dt>
                  <dd>{formatCurrency(item.basePrice)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Bottle</dt>
                  <dd>{formatCurrency(item.bottlePrice)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Cap</dt>
                  <dd>{formatCurrency(item.capPrice)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Line total</dt>
                  <dd>{formatCurrency(item.finalPrice)}</dd>
                </div>
              </dl>
            </article>
          ))}
        </section>
        <dl className="mt-10 max-w-sm space-y-2 border-t border-sand pt-6 text-sm">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd>{formatCurrency(order.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Discount</dt>
            <dd>{formatCurrency(order.discount)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Tax (included)</dt>
            <dd>{formatCurrency(order.tax)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Shipping</dt>
            <dd>{formatCurrency(order.shipping)}</dd>
          </div>
          <div className="flex justify-between font-medium">
            <dt>Final</dt>
            <dd>{formatCurrency(order.finalPrice)}</dd>
          </div>
        </dl>
        <p className="mt-8 text-xs text-stone">
          This page is a snapshot. Later changes to bottles, caps or prices will not alter this order.
        </p>
      </PageShell>
    </>
  );
}
