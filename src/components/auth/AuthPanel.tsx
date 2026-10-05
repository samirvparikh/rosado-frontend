import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/services/http";
import { cn } from "@/utils/cn";
import type { LoginInput, RegisterInput } from "@/types";

export type AuthTab = "login" | "register";

/** Mirrors the backend rule (AuthController::register). */
const PASSWORD_MIN = 8;

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const { login } = useAuth();
  const [error, setError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>();

  async function onSubmit(values: LoginInput) {
    setError("");
    try {
      await login(values);
      onSuccess();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Unable to sign in.");
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Input label="Email" type="email" autoComplete="email" {...register("email", { required: "Required" })} error={errors.email?.message} />
      <Input label="Password" type="password" autoComplete="current-password" {...register("password", { required: "Required" })} error={errors.password?.message} />
      {error ? <p className="text-sm text-rose" role="alert">{error}</p> : null}
      <Button type="submit" fullWidth disabled={isSubmitting}>
        {isSubmitting ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}

function RegisterForm({ onSuccess }: { onSuccess: () => void }) {
  const { register: createAccount } = useAuth();
  const [error, setError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterInput>();

  async function onSubmit(values: RegisterInput) {
    setError("");
    try {
      await createAccount(values);
      onSuccess();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Unable to create this account.");
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Input label="Full name" autoComplete="name" {...register("fullName", { required: "Required" })} error={errors.fullName?.message} />
      <Input label="Email" type="email" autoComplete="email" {...register("email", { required: "Required" })} error={errors.email?.message} />
      <Input label="Mobile" type="tel" autoComplete="tel" {...register("mobile", { required: "Required", minLength: { value: 10, message: "Enter a valid mobile number" } })} error={errors.mobile?.message} />
      <Input
        label="Password"
        type="password"
        autoComplete="new-password"
        {...register("password", { required: "Required", minLength: { value: PASSWORD_MIN, message: `At least ${PASSWORD_MIN} characters` } })}
        error={errors.password?.message}
      />
      {error ? <p className="text-sm text-rose" role="alert">{error}</p> : null}
      <Button type="submit" fullWidth disabled={isSubmitting}>
        {isSubmitting ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}

/** Login / Create account tabs -- used by /login, /register and checkout. */
export function AuthPanel({
  initialTab = "login",
  onSuccess,
  className,
}: {
  initialTab?: AuthTab;
  onSuccess: () => void;
  className?: string;
}) {
  const [tab, setTab] = useState<AuthTab>(initialTab);

  return (
    <div className={className}>
      <div role="tablist" aria-label="Account" className="grid grid-cols-2 rounded-full border border-sand p-1">
        {(
          [
            ["login", "Login"],
            ["register", "Create an account"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={cn(
              "rounded-full px-4 py-2.5 text-[11px] uppercase tracking-nav transition-colors",
              tab === key ? "bg-charcoal text-ivory" : "text-stone hover:text-charcoal",
            )}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="mt-8" role="tabpanel">
        {tab === "login" ? <LoginForm onSuccess={onSuccess} /> : <RegisterForm onSuccess={onSuccess} />}
      </div>
    </div>
  );
}
