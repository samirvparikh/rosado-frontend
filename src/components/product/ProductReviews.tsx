import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { StarIcon } from "@/components/ui/Icons";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { useAuth } from "@/hooks/useAuth";
import { getProductReviews } from "@/services/reviewsApi";
import type { ProductReview, ReviewSummary } from "@/types";
import { ReviewModal } from "./ReviewModal";

interface ProductReviewsProps {
  product: { id: string; name: string; image?: string };
  /** Lets the page refresh its headline rating after a new review. */
  onSummaryChange?: (summary: ReviewSummary) => void;
}

function Stars({ value, className = "h-4 w-4" }: { value: number; className?: string }) {
  return (
    <span className="inline-flex text-gold" aria-label={`Rated ${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <StarIcon key={n} filled={n <= Math.round(value)} className={className} />
      ))}
    </span>
  );
}

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function ProductReviews({ product, onSummaryChange }: ProductReviewsProps) {
  const { session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [summary, setSummary] = useState<ReviewSummary | null>(null);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [thanks, setThanks] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getProductReviews(product.id)
      .then((data) => {
        if (cancelled) return;
        setSummary(data.summary);
        setReviews(data.reviews);
      })
      .catch(() => {
        // Reviews are supplementary; the section still offers "Write a review".
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [product.id]);

  const openWriter = () => {
    if (!session) {
      navigate("/login", { state: { from: `${location.pathname}${location.search}#reviews` } });
      return;
    }
    setThanks(false);
    setModalOpen(true);
  };

  const count = summary?.count ?? 0;

  return (
    <section id="reviews" className="mt-16 scroll-mt-28 border-t border-sand pt-12">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-4xl">Customer reviews</h2>
          {count ? (
            <div className="mt-3 flex items-center gap-3">
              <Stars value={summary!.average} className="h-5 w-5" />
              <span className="text-sm text-stone">
                {summary!.average.toFixed(1)} out of 5 · {count} review{count === 1 ? "" : "s"}
              </span>
            </div>
          ) : !loading ? (
            <p className="mt-3 text-sm text-stone">No reviews yet — be the first to share your thoughts.</p>
          ) : null}
        </div>
        <Button type="button" onClick={openWriter} className="w-full rounded-full sm:w-auto">
          Write a review
        </Button>
      </div>

      {thanks ? (
        <p role="status" className="mt-6 rounded-md bg-cream px-4 py-3 text-sm text-charcoal">
          Thank you — your review has been posted.
        </p>
      ) : null}

      {summary && count ? (
        <div className="mt-8 max-w-sm space-y-1.5">
          {summary.breakdown.map((row) => (
            <div key={row.rating} className="flex items-center gap-3 text-xs text-stone">
              <span className="w-8 shrink-0">{row.rating} ★</span>
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-sand/60">
                <span className="block h-full bg-gold" style={{ width: `${(row.count / count) * 100}%` }} />
              </span>
              <span className="w-6 shrink-0 text-right">{row.count}</span>
            </div>
          ))}
        </div>
      ) : null}

      {loading ? (
        <div className="mt-10 space-y-4">
          <LoadingSkeleton className="h-28" />
          <LoadingSkeleton className="h-28" />
        </div>
      ) : (
        <ul className="mt-10 divide-y divide-sand">
          {reviews.map((review) => (
            <li key={review.id} className="py-6 first:pt-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Stars value={review.rating} />
                <span className="text-xs text-stone">{formatDate(review.createdAt)}</span>
              </div>
              <h3 className="mt-3 text-base font-semibold text-charcoal">{review.title}</h3>
              <p className="mt-2 whitespace-pre-line text-sm leading-7 text-stone">{review.body}</p>
              {review.media.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {review.media.map((item) =>
                    item.type === "video" ? (
                      <video
                        key={item.url}
                        src={item.url}
                        controls
                        preload="metadata"
                        className="h-24 w-24 rounded-md border border-sand bg-charcoal object-cover sm:h-28 sm:w-28"
                      />
                    ) : (
                      <a key={item.url} href={item.url} target="_blank" rel="noopener noreferrer">
                        <img
                          src={item.url}
                          alt={`Photo from ${review.authorName}`}
                          loading="lazy"
                          className="h-24 w-24 rounded-md border border-sand object-cover sm:h-28 sm:w-28"
                        />
                      </a>
                    ),
                  )}
                </div>
              ) : null}
              <p className="mt-4 text-[11px] uppercase tracking-nav text-charcoal">{review.authorName}</p>
            </li>
          ))}
        </ul>
      )}

      <ReviewModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        product={product}
        onSubmitted={(review, next) => {
          setReviews((prev) => [review, ...prev]);
          setSummary(next);
          setThanks(true);
          onSummaryChange?.(next);
        }}
      />
    </section>
  );
}
