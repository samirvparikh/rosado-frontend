import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PageShell } from "@/components/layout/PageShell";
import { PageMeta } from "@/components/seo/PageMeta";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/services/http";
import type { RegisterInput } from "@/types";

export function RegisterPage() {
  const navigate = useNavigate();
  const { register: createAccount } = useAuth();
  const [error, setError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterInput>();

  async function onSubmit(values: RegisterInput) {
    setError("");
    try {
      await createAccount(values);
      navigate("/account");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Unable to create this account.");
    }
  }

  return (
    <>
      <PageMeta title="Register" description="Create your ROSADO account." />
      <PageShell className="max-w-md py-16">
        <h1 className="font-display text-5xl">Register</h1>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input label="Full name" {...register("fullName", { required: "Required" })} error={errors.fullName?.message} />
          <Input label="Email" type="email" {...register("email", { required: "Required" })} error={errors.email?.message} />
          <Input label="Mobile" {...register("mobile", { required: "Required" })} error={errors.mobile?.message} />
          <Input label="Password" type="password" {...register("password", { required: "Required", minLength: 6 })} error={errors.password?.message} />
          {error ? <p className="text-sm text-rose">{error}</p> : null}
          <Button type="submit" fullWidth disabled={isSubmitting}>
            Create account
          </Button>
        </form>
        <p className="mt-6 text-sm text-stone">
          Already registered? <Link to="/login" className="text-charcoal underline">Login</Link>
        </p>
      </PageShell>
    </>
  );
}
