import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageShell } from "@/components/layout/PageShell";
import { PageMeta } from "@/components/seo/PageMeta";
import { useCart } from "@/hooks/useCart";
import { createOrder, getShippingMethods, quoteCart } from "@/services/orderApi";
import { ApiError } from "@/services/http";
import { formatCurrency } from "@/utils/formatCurrency";
import type { PaymentMethod, ShippingAddress, ShippingMethod, ShippingMethodId } from "@/types";

interface CheckoutForm extends ShippingAddress {
  shippingMethod: ShippingMethodId;
  paymentMethod: PaymentMethod;
  couponCode?: string;
}

export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, clear } = useCart();
  const [quote, setQuote] = useState<{
    subtotal: number;
    discount: number;
    tax: number;
    shipping: number;
    total: number;
  } | null>(null);
  const [quoteError, setQuoteError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [pending, setPending] = useState(false);
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);

  useEffect(() => {
    let cancelled = false;
    getShippingMethods().then((methods) => {
      if (!cancelled) setShippingMethods(methods);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutForm>({
    defaultValues: {
      shippingMethod: "standard",
      paymentMethod: "UPI",
    },
  });

  const shippingMethod = watch("shippingMethod");
  const couponCode = watch("couponCode");

  useEffect(() => {
    if (items.length === 0) return;
    let cancelled = false;
    const trimmed = couponCode?.trim().toUpperCase();
    quoteCart(items, shippingMethod, trimmed || undefined)
      .then((result) => {
        if (cancelled) return;
        setQuote(result);
        setQuoteError("");
      })
      .catch((error) => {
        if (cancelled) return;
        setQuote(null);
        setQuoteError(error instanceof ApiError ? error.message : "Unable to price this cart.");
      });
    return () => {
      cancelled = true;
    };
  }, [items, shippingMethod, couponCode]);

  if (items.length === 0) {
    return (
      <PageShell className="py-16">
        <EmptyState title="Your cart is empty." />
      </PageShell>
    );
  }

  async function onSubmit(values: CheckoutForm) {
    setPending(true);
    setSubmitError("");
    try {
      const order = await createOrder({
        customer: {
          fullName: values.fullName,
          mobile: values.mobile,
          email: values.email,
          address: values.address,
          city: values.city,
          state: values.state,
          pincode: values.pincode,
        },
        shippingMethod: values.shippingMethod,
        paymentMethod: values.paymentMethod,
        couponCode: values.couponCode,
        items,
      });
      clear();
      navigate(`/account/orders/${order.id}`, { state: { placed: true } });
    } catch (error) {
      setSubmitError(error instanceof ApiError ? error.message : "Unable to place this order.");
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <PageMeta title="Checkout" description="Complete your ROSADO order." />
      <PageShell className="py-12">
        <h1 className="font-display text-5xl">Checkout</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-10 grid gap-12 lg:grid-cols-[1fr_360px]">
          <div className="space-y-10">
            <section>
              <h2 className="font-display text-3xl">Customer details</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Input label="Full name" {...register("fullName", { required: "Required" })} error={errors.fullName?.message} />
                <Input label="Mobile" {...register("mobile", { required: "Required", minLength: 10 })} error={errors.mobile?.message} />
                <Input label="Email" type="email" {...register("email", { required: "Required" })} error={errors.email?.message} />
              </div>
            </section>
            <section>
              <h2 className="font-display text-3xl">Shipping address</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Input label="Address" {...register("address", { required: "Required" })} error={errors.address?.message} />
                </div>
                <Input label="City" {...register("city", { required: "Required" })} error={errors.city?.message} />
                <Input label="State" {...register("state", { required: "Required" })} error={errors.state?.message} />
                <Input label="Pincode" {...register("pincode", { required: "Required", minLength: 6 })} error={errors.pincode?.message} />
              </div>
            </section>
            <section>
              <h2 className="font-display text-3xl">Shipping method</h2>
              <div className="mt-6 space-y-3">
                {shippingMethods.map((method) => (
                  <label key={method.id} className="flex items-start gap-3 border border-sand p-4 text-sm">
                    <input type="radio" value={method.id} {...register("shippingMethod")} className="mt-1 accent-charcoal" />
                    <span>
                      <span className="block font-medium">{method.name}</span>
                      <span className="text-stone">
                        {method.description} · {method.eta}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </section>
            <section>
              <h2 className="font-display text-3xl">Coupon</h2>
              <div className="mt-6 max-w-sm">
                <Input label="Code" {...register("couponCode")} />
              </div>
              {quoteError ? <p className="mt-2 text-sm text-rose">{quoteError}</p> : null}
            </section>
            <section>
              <h2 className="font-display text-3xl">Payment</h2>
              <div className="mt-6 max-w-sm">
                <Select
                  label="Method"
                  {...register("paymentMethod")}
                  options={[
                    { value: "UPI", label: "UPI" },
                    { value: "CARD", label: "Card" },
                    { value: "COD", label: "Cash on delivery" },
                  ]}
                />
              </div>
            </section>
          </div>
          <aside className="h-fit border border-sand p-6">
            <h2 className="font-display text-3xl">Order summary</h2>
            <ul className="mt-6 space-y-4 text-sm">
              {items.map((item) => (
                <li key={item.id}>
                  {item.productType === "CUSTOM_PERFUME" ? (
                    <div>
                      <p className="text-[11px] uppercase tracking-nav text-gold">Custom ROSADO Perfume</p>
                      <p>
                        {item.sizeName} · {item.fragranceName}
                      </p>
                      <p className="text-stone">
                        {item.bottleName} · {item.capName}
                      </p>
                    </div>
                  ) : (
                    <p>
                      {item.productName} · {item.sizeName}
                    </p>
                  )}
                  <p className="mt-1">{formatCurrency(item.lineTotal)}</p>
                </li>
              ))}
            </ul>
            {quote ? (
              <dl className="mt-6 space-y-2 border-t border-sand pt-4 text-sm">
                <div className="flex justify-between">
                  <dt>Subtotal</dt>
                  <dd>{formatCurrency(quote.subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Discount</dt>
                  <dd>{formatCurrency(quote.discount)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Tax (included)</dt>
                  <dd>{formatCurrency(quote.tax)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Shipping</dt>
                  <dd>{formatCurrency(quote.shipping)}</dd>
                </div>
                <div className="flex justify-between border-t border-sand pt-3 font-medium">
                  <dt>Total</dt>
                  <dd>{formatCurrency(quote.total)}</dd>
                </div>
              </dl>
            ) : null}
            {submitError ? <p className="mt-4 text-sm text-rose">{submitError}</p> : null}
            <Button type="submit" fullWidth className="mt-6" disabled={pending}>
              {pending ? "Placing order…" : "Place order"}
            </Button>
          </aside>
        </form>
      </PageShell>
    </>
  );
}
