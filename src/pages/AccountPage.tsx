import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { PageShell } from "@/components/layout/PageShell";
import { PageMeta } from "@/components/seo/PageMeta";
import { useAuth } from "@/hooks/useAuth";

export function AccountPage() {
  const { session, logout } = useAuth();

  return (
    <>
      <PageMeta title="Account" description="Your ROSADO account." />
      <PageShell className="py-12">
        <h1 className="font-display text-5xl">Account</h1>
        {session ? (
          <div className="mt-8 space-y-3 text-sm">
            <p>{session.customer.fullName}</p>
            <p className="text-stone">{session.customer.email}</p>
            <p className="text-stone">{session.customer.mobile}</p>
          </div>
        ) : (
          <p className="mt-6 text-sm text-stone">
            You are browsing as a guest. <Link to="/login" className="underline">Sign in</Link> to save a profile.
          </p>
        )}
        <nav className="mt-10 flex flex-col gap-4 text-[13px] uppercase tracking-nav">
          <Link to="/account/orders">Orders</Link>
          <Link to="/account/wishlist">Wishlist</Link>
        </nav>
        {session ? (
          <div className="mt-10">
            <Button type="button" variant="secondary" onClick={logout}>
              Sign out
            </Button>
          </div>
        ) : null}
      </PageShell>
    </>
  );
}
