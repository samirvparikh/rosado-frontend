import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AuthPanel } from "@/components/auth/AuthPanel";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageShell } from "@/components/layout/PageShell";
import { PageMeta } from "@/components/seo/PageMeta";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { createOrder, getShippingMethods, quoteCart } from "@/services/orderApi";
import { ApiError } from "@/services/http";
import { formatCurrency } from "@/utils/formatCurrency";
import { labelText } from "@/utils/labelText";
import type { AuthSession, PaymentMethod, ShippingAddress, ShippingMethod, ShippingMethodId } from "@/types";

interface CheckoutForm extends ShippingAddress {
  shippingMethod: ShippingMethodId;
  paymentMethod: PaymentMethod;
  couponCode?: string;
}

/** Pre-fill values from the account: default address first, profile as fallback. */
function savedDetails(session: AuthSession): ShippingAddress {
  const address = session.addresses.find((a) => a.isDefault) ?? session.addresses[0];
  return {
    fullName: address?.fullName || session.customer.fullName || "",
    mobile: address?.mobile || session.customer.mobile || "",
    email: address?.email || session.customer.email || "",
    address: address?.address ?? "",
    city: address?.city ?? "",
    state: address?.state ?? "",
    pincode: address?.pincode ?? "",
  };
}

export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, clear } = useCart();
  const { session, refresh, logout } = useAuth();
  const signedIn = Boolean(session);
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
    reset,
    getValues,
    formState: { errors },
  } = useForm<CheckoutForm>({
    defaultValues: {
      shippingMethod: "standard",
      paymentMethod: "UPI",
    },
  });

  // Re-read the account on arrival so pre-fill uses the latest saved details
  // (and an expired login falls back to the sign-in panel).
  useEffect(() => {
    if (signedIn) void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pre-fill from the account once signed in -- without overwriting anything typed already.
  const customerId = session?.customer.id;
  useEffect(() => {
    if (!session) return;
    reset({ ...getValues(), ...savedDetails(session) }, { keepDirtyValues: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId, session?.addresses.length]);

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
      // The server saved these details to the account; pull them so the next checkout is pre-filled.
      await refresh();
      clear();
      // The key in the URL keeps the confirmation viewable (and refreshable) for guests.
      navigate(`/account/orders/${order.id}?key=${encodeURIComponent(order.accessToken)}`, { state: { placed: true } });
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
        <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_360px]">
          {!signedIn ? (
            <section className="max-w-lg">
              <h2 className="font-display text-3xl">Sign in to check out</h2>
              <p className="mt-2 text-sm text-stone">
                Log in or create an account to place your order. Your details are saved for faster checkout next time.
              </p>
              {/* Signing in swaps this panel for the checkout form, pre-filled. */}
              <AuthPanel className="mt-8" onSuccess={() => window.scrollTo({ top: 0, behavior: "smooth" })} />
            </section>
          ) : (
          <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-10" noValidate>
            <section>
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h2 className="font-display text-3xl">Customer details</h2>
                <p className="text-xs text-stone">
                  Signed in as {session?.customer.email} ·{" "}
                  <button type="button" onClick={logout} className="underline hover:text-charcoal">
                    Not you?
                  </button>
                </p>
              </div>
              <p className="mt-2 text-xs text-stone">
                Any changes here are saved to your account when you place the order.
              </p>
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
          </form>
          )}
          <aside className="h-fit rounded-2xl border border-sand p-6 lg:sticky lg:top-28">
            <h2 className="font-display text-3xl">Order summary</h2>
            <ul className="mt-6 space-y-4 text-sm">
              {items.map((item) => (
                <li key={item.id}>
                  {item.productType === "CUSTOM_PERFUME" ? (
                    <div>
                      <p className="text-[11px] uppercase tracking-nav text-gold">{item.productName ?? "Custom ROSADO Perfume"}</p>
                      <p>
                        {item.sizeName} · {item.fragranceName}
                      </p>
                      <p className="text-stone">
                        {item.bottleName} · {item.capName}
                      </p>
                      {labelText(item) ? <p className="text-stone">Label: {labelText(item)}</p> : null}
                      {item.remarks ? <p className="whitespace-pre-line text-stone">Remarks: {item.remarks}</p> : null}
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
            {signedIn ? (
              <Button type="submit" form="checkout-form" fullWidth className="mt-6" disabled={pending}>
                {pending ? "Placing order…" : "Place order"}
              </Button>
            ) : (
              <p className="mt-6 rounded-xl bg-cream/70 px-4 py-3 text-center text-xs text-stone">
                Sign in or create an account to place your order.
              </p>
            )}
          </aside>
        </div>
      </PageShell>
    </>
  );
}
