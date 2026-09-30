import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { PageShell } from "./PageShell";

const COLUMNS = [
  {
    title: "Explore",
    links: [
      { to: "/shop", label: "Shop" },
      { to: "/custom-perfume", label: "Custom Perfume" },
      { to: "/men", label: "Men" },
      { to: "/women", label: "Women" },
      { to: "/unisex", label: "Unisex" },
    ],
  },
  {
    title: "Maison",
    links: [
      { to: "/about", label: "About" },
      { to: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Policies",
    links: [
      { to: "/privacy", label: "Privacy Policy" },
      { to: "/terms", label: "Terms & Conditions" },
      { to: "/shipping", label: "Shipping Policy" },
      { to: "/returns", label: "Return Policy" },
    ],
  },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <footer className="mt-24 border-t border-sand bg-cream/40">
      <PageShell wide className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-3xl tracking-brand">ROSADO</p>
          <p className="mt-4 max-w-xs text-sm leading-7 text-stone">
            A maison for composed fragrance. Discover, customise, and keep what you create.
          </p>
        </div>
        {COLUMNS.map((column) => (
          <div key={column.title}>
            <p className="text-[11px] uppercase tracking-nav text-stone">{column.title}</p>
            <ul className="mt-4 space-y-2">
              {column.links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-charcoal hover:text-gold">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="lg:col-span-4">
          <p className="text-[11px] uppercase tracking-nav text-stone">Newsletter</p>
          <form
            className="mt-4 flex max-w-md flex-col gap-3 sm:flex-row"
            onSubmit={(event) => {
              event.preventDefault();
              setDone(true);
            }}
          >
            <label className="sr-only" htmlFor="newsletter-email">
              Email
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Your email"
              className="flex-1 border border-sand bg-ivory px-4 py-3 text-sm"
            />
            <Button type="submit">Subscribe</Button>
          </form>
          {done ? <p className="mt-2 text-xs text-stone">Thank you. We will write rarely.</p> : null}
        </div>
      </PageShell>
      <div className="border-t border-sand py-6 text-center text-[11px] uppercase tracking-nav text-stone">
        © {new Date().getFullYear()} ROSADO PERFUME
      </div>
    </footer>
  );
}
