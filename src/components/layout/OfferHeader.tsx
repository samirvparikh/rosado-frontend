import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOffers } from "@/services/offerApi";
import type { Offer } from "@/types";

function OfferItem({ offer }: { offer: Offer }) {
  const className = "whitespace-nowrap px-8 text-[11px] uppercase tracking-nav";
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

/** Scrolling offer strip; hidden when the backend has no active offers. */
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

  // Two identical tracks: translating by -50% loops seamlessly.
  const track = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {offers.map((offer) => (
        <span key={offer.id} className="flex items-center">
          <OfferItem offer={offer} />
          <span className="text-gold" aria-hidden="true">✦</span>
        </span>
      ))}
    </div>
  );

  return (
    <section aria-label="Offers" className="group overflow-hidden bg-charcoal py-2.5 text-ivory">
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        {track(false)}
        {track(true)}
      </div>
    </section>
  );
}
