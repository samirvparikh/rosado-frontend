import { useLocation, useNavigate } from "react-router-dom";
import { AuthPanel } from "@/components/auth/AuthPanel";
import { PageShell } from "@/components/layout/PageShell";
import { PageMeta } from "@/components/seo/PageMeta";

/** Same-site path a page asked to return to after sign-in (e.g. an order link), else the account page. */
export function useReturnTo() {
  const from = (useLocation().state as { from?: string } | null)?.from;
  return from && from.startsWith("/") && !from.startsWith("//") ? from : "/account";
}

export function LoginPage() {
  const navigate = useNavigate();
  const returnTo = useReturnTo();

  return (
    <>
      <PageMeta title="Login" description="Sign in to your ROSADO account." />
      <PageShell className="max-w-md py-16">
        <h1 className="font-display text-5xl">Welcome back</h1>
        <AuthPanel className="mt-8" initialTab="login" onSuccess={() => navigate(returnTo, { replace: true })} />
      </PageShell>
    </>
  );
}
