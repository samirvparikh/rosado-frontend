import { useEffect } from "react";

interface PageMetaProps {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  type?: string;
}

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function PageMeta({
  title,
  description,
  canonical,
  image = "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&q=80",
  type = "website",
}: PageMetaProps) {
  useEffect(() => {
    const fullTitle = title.includes("ROSADO") ? title : `${title} · ROSADO PERFUME`;
    document.title = fullTitle;
    upsertMeta("name", "description", description);
    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:image", image);
    upsertMeta("name", "twitter:card", "summary_large_image");
    const href = canonical ?? `${window.location.origin}${window.location.pathname}`;
    upsertLink("canonical", href);
    upsertMeta("property", "og:url", href);
  }, [title, description, canonical, image, type]);

  return null;
}

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(data);
    document.head.appendChild(script);
    return () => {
      script.remove();
    };
  }, [data]);
  return null;
}
