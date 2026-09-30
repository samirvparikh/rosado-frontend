import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { PageShell } from "@/components/layout/PageShell";
import { PageMeta } from "@/components/seo/PageMeta";
import { getOrders } from "@/services/orderApi";
import { formatCurrency } from "@/utils/formatCurrency";
import type { Order } from "@/types";

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getOrders()
      .then(setOrders)
      .catch(() => setError("Something went wrong. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageMeta title="Orders" description="Your ROSADO orders." />
      <PageShell className="py-12">
        <h1 className="font-display text-5xl">Orders</h1>
        {loading ? <LoadingSkeleton className="mt-8 h-40" /> : null}
        {error ? <ErrorState message={error} /> : null}
        {!loading && !error && orders.length === 0 ? (
          <EmptyState title="No orders yet.">
            <Link to="/shop" className="mt-4 inline-block underline">
              Explore ROSADO
            </Link>
          </EmptyState>
        ) : null}
        <ul className="mt-8 divide-y divide-sand">
          {orders.map((order) => (
            <li key={order.id} className="py-5">
              <Link to={`/account/orders/${order.id}`} className="flex items-center justify-between">
                <div>
                  <p className="font-display text-2xl">Order #{order.orderNumber}</p>
                  <p className="text-sm text-stone">
                    {new Date(order.createdAt).toLocaleDateString("en-IN")} · {order.status}
                  </p>
                </div>
                <p>{formatCurrency(order.finalPrice)}</p>
              </Link>
            </li>
          ))}
        </ul>
      </PageShell>
    </>
  );
}
