import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PageShell } from "@/components/layout/PageShell";
import { PageMeta } from "@/components/seo/PageMeta";

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

export function ContactPage() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<ContactForm>();

  return (
    <>
      <PageMeta title="Contact" description="Write to the ROSADO maison." />
      <PageShell className="max-w-lg py-16">
        <h1 className="font-display text-5xl">Contact</h1>
        <p className="mt-4 text-sm text-stone">Atelier hours: Tuesday–Saturday. We reply within two working days.</p>
        <form
          className="mt-8 space-y-4"
          onSubmit={handleSubmit(() => setSent(true))}
        >
          <Input label="Name" {...register("name", { required: "Required" })} error={errors.name?.message} />
          <Input label="Email" type="email" {...register("email", { required: "Required" })} error={errors.email?.message} />
          <label className="block" htmlFor="message">
            <span className="mb-2 block text-[11px] uppercase tracking-nav text-stone">Message</span>
            <textarea
              id="message"
              rows={5}
              className="w-full border border-sand bg-ivory px-4 py-3 text-sm"
              {...register("message", { required: "Required" })}
            />
            {errors.message ? <span className="mt-1 block text-xs text-rose">{errors.message.message}</span> : null}
          </label>
          <Button type="submit">Send</Button>
        </form>
        {sent ? <p className="mt-4 text-sm text-stone">Received. We will write back.</p> : null}
      </PageShell>
    </>
  );
}
