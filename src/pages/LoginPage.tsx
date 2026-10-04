import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PageShell } from "@/components/layout/PageShell";
import { PageMeta } from "@/components/seo/PageMeta";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/services/http";
import type { LoginInput } from "@/types";

export function LoginPage() {
  const navigate = useNavigate();
  // Pages that send people here (e.g. an order link) pass where to return to; only same-site paths.
  const from = (useLocation().state as { from?: string } | null)?.from;
  const returnTo = from && from.startsWith("/") && !from.startsWith("//") ? from : "/account";
  const { login } = useAuth();
  const [error, setError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>();

  async function onSubmit(values: LoginInput) {
    setError("");
    try {
      await login(values);
      navigate(returnTo, { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Unable to sign in.");
    }
  }

  return (
    <>
      <PageMeta title="Login" description="Sign in to your ROSADO account." />
      <PageShell className="max-w-md py-16">
        <h1 className="font-display text-5xl">Login</h1>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input label="Email" type="email" {...register("email", { required: "Required" })} error={errors.email?.message} />
          <Input label="Password" type="password" {...register("password", { required: "Required" })} error={errors.password?.message} />
          {error ? <p className="text-sm text-rose">{error}</p> : null}
          <Button type="submit" fullWidth disabled={isSubmitting}>
            Sign in
          </Button>
        </form>
        <p className="mt-6 text-sm text-stone">
          New to ROSADO? <Link to="/register" className="text-charcoal underline">Create an account</Link>
        </p>
      </PageShell>
    </>
  );
}
