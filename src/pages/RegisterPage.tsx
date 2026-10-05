import { useNavigate } from "react-router-dom";
import { AuthPanel } from "@/components/auth/AuthPanel";
import { PageShell } from "@/components/layout/PageShell";
import { PageMeta } from "@/components/seo/PageMeta";
import { useReturnTo } from "./LoginPage";

export function RegisterPage() {
  const navigate = useNavigate();
  const returnTo = useReturnTo();

  return (
    <>
      <PageMeta title="Register" description="Create your ROSADO account." />
      <PageShell className="max-w-md py-16">
        <h1 className="font-display text-5xl">Join ROSADO</h1>
        <AuthPanel className="mt-8" initialTab="register" onSuccess={() => navigate(returnTo, { replace: true })} />
      </PageShell>
    </>
  );
}
