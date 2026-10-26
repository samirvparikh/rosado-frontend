import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOffers } from "@/services/offerApi";
import type { Offer } from "@/types";

function OfferItem({ offer }: { offer: Offer }) {
  const className = "text-[11px] uppercase tracking-nav";
  const isExternal = !!offer.linkUrl && /^https?:\/\//i.test(offer.linkUrl);
  const isInternal = !!offer.linkUrl && offer.linkUrl.startsWith("/");
  if (!offer.linkUrl || (!isExternal && !isInternal)) return <span className={className}>{offer.text}</span>;
  if (isExternal) {
    return (
      <a href={offer.linkUrl} target="_blank" rel="noopener noreferrer" className={`${className} hover:text-gold`}>
        {offer.text}
      </a>
    );
  }
  return (
    <Link to={offer.linkUrl} className={`${className} hover:text-gold`}>
      {offer.text}
    </Link>
  );
}

/** Centered offer strip; hidden when the backend has no active offers. */
export function OfferHeader() {
  const [offers, setOffers] = useState<Offer[]>([]);

  useEffect(() => {
    let cancelled = false;
    getOffers()
      .then((data) => {
        if (!cancelled) setOffers(data);
      })
      .catch(() => {
        // Promotional copy is non-essential -- stay hidden on failure.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (offers.length === 0) return null;

  return (
    <section aria-label="Offers" className="bg-charcoal px-4 py-2.5 text-center text-ivory">
      <div className="mx-auto flex max-w-page flex-wrap items-center justify-center gap-x-3 gap-y-1">
        {offers.map((offer) => (
          <span key={offer.id} className="inline-flex items-center gap-3">
            <span className="text-gold" aria-hidden="true">
              ✦
            </span>
            <OfferItem offer={offer} />
            <span className="text-gold" aria-hidden="true">
              ✦
            </span>
          </span>
        ))}
      </div>
    </section>
  );
}
