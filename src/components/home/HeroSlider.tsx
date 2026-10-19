import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { PageShell } from "@/components/layout/PageShell";
import { getHomeSlides } from "@/services/homeSlideApi";
import type { HomeSlide, HomeSlideButton } from "@/types";
import { cn } from "@/utils/cn";

/** How long an image slide stays up before advancing. Video slides advance when they end. */
const IMAGE_SLIDE_MS = 6000;
/** Safety net: advance anyway if a video never fires `ended` (failed load, endless stream). */
const VIDEO_MAX_MS = 60000;
const MOBILE_QUERY = "(max-width: 767px)";

// Shown when the backend has no active slides or cannot be reached.
const DEFAULT_SLIDE: HomeSlide = {
  id: 0,
  mediaType: "VIDEO",
  mediaUrl: "/videos/ROSADO_PERFUME.mp4",
  mobileMediaUrl: null,
  posterUrl: null,
  eyebrow: "Maison ROSADO",
  title: "Your Fragrance. Your Bottle. Your ROSADO.",
  subtitle: null,
  primaryButton: { text: "Create Your Perfume", link: "/custom-perfume" },
  secondaryButton: { text: "Shop Perfumes", link: "/shop" },
};

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const list = window.matchMedia(query);
    const onChange = () => setMatches(list.matches);
    list.addEventListener("change", onChange);
    return () => list.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

function SlideLink({ button, children }: { button: HomeSlideButton; children: ReactNode }) {
  if (/^https?:\/\//i.test(button.link)) {
    return (
      <a href={button.link} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return <Link to={button.link}>{children}</Link>;
}

function SlideMedia({ slide, active, isMobile, loop, onEnded }: {
  slide: HomeSlide;
  active: boolean;
  isMobile: boolean;
  loop: boolean;
  onEnded: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const src = isMobile && slide.mobileMediaUrl ? slide.mobileMediaUrl : slide.mediaUrl;

  // Only the visible video plays; each one restarts from the top when it comes back.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (active) {
      video.currentTime = 0;
      video.play().catch(() => {
        // Autoplay blocked (e.g. data saver) -- the poster/first frame stays visible.
      });
    } else {
      video.pause();
    }
  }, [active, src]);

  if (slide.mediaType === "VIDEO") {
    return (
      <video
        ref={videoRef}
        key={src}
        className="absolute inset-0 h-full w-full object-cover"
        src={src}
        poster={slide.posterUrl ?? undefined}
        muted
        loop={loop}
        playsInline
        preload={active ? "auto" : "metadata"}
        onEnded={onEnded}
        aria-hidden="true"
      />
    );
  }

  return (
    <picture>
      {slide.mobileMediaUrl ? <source media={MOBILE_QUERY} srcSet={slide.mobileMediaUrl} /> : null}
      <img src={slide.mediaUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
    </picture>
  );
}

/** Homepage hero: rotates admin-managed image and video slides. */
export function HeroSlider() {
  const [slides, setSlides] = useState<HomeSlide[] | null>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    getHomeSlides()
      .then((data) => {
        if (!cancelled) setSlides(data.length > 0 ? data : [DEFAULT_SLIDE]);
      })
      .catch(() => {
        if (!cancelled) setSlides([DEFAULT_SLIDE]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const count = slides?.length ?? 0;
  const go = useCallback((next: number) => setIndex(((next % count) + count) % count), [count]);
  const next = useCallback(() => go(index + 1), [go, index]);
  const current = slides?.[index];

  // Image slides advance on a timer; videos on `ended`, with a timer as a fallback.
  useEffect(() => {
    if (!current || count < 2 || paused || reducedMotion) return;
    const timer = window.setTimeout(next, current.mediaType === "VIDEO" ? VIDEO_MAX_MS : IMAGE_SLIDE_MS);
    return () => window.clearTimeout(timer);
  }, [current, count, paused, reducedMotion, next]);

  const onTouchEnd = (x: number) => {
    if (touchStartX.current === null) return;
    const delta = x - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) > 50) go(index + (delta < 0 ? 1 : -1));
  };

  return (
    <section
      className="relative min-h-[78vh] overflow-hidden bg-charcoal text-ivory"
      aria-roledescription={count > 1 ? "carousel" : undefined}
      aria-label="Highlights"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => onTouchEnd(e.changedTouches[0].clientX)}
    >
      {slides?.map((slide, i) => {
        const active = i === index;
        const Heading = i === 0 ? "h1" : "h2";
        return (
          <div
            key={slide.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 ease-out motion-reduce:transition-none",
              active ? "z-10 opacity-100" : "pointer-events-none opacity-0",
            )}
            aria-hidden={!active || undefined}
            inert={!active || undefined}
            role={count > 1 ? "group" : undefined}
            aria-roledescription={count > 1 ? "slide" : undefined}
            aria-label={count > 1 ? `${i + 1} of ${count}` : undefined}
          >
            <SlideMedia slide={slide} active={active} isMobile={isMobile} loop={count === 1} onEnded={next} />
            <div className="absolute inset-0 bg-charcoal/45" />
            <PageShell wide className="relative grid h-full items-end py-20 lg:items-center">
              <div className="max-w-xl">
                {slide.eyebrow ? <p className="text-[11px] uppercase tracking-nav text-gold">{slide.eyebrow}</p> : null}
                {slide.title ? (
                  <Heading className="mt-4 font-display text-5xl leading-[0.95] sm:text-6xl lg:text-7xl">{slide.title}</Heading>
                ) : null}
                {slide.subtitle ? <p className="mt-6 text-sm leading-7 text-sand sm:text-base">{slide.subtitle}</p> : null}
                {slide.primaryButton || slide.secondaryButton ? (
                  <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                    {slide.primaryButton ? (
                      <SlideLink button={slide.primaryButton}>
                        <Button variant="gold">{slide.primaryButton.text}</Button>
                      </SlideLink>
                    ) : null}
                    {slide.secondaryButton ? (
                      <SlideLink button={slide.secondaryButton}>
                        <Button variant="secondary" className="border-ivory/40 text-ivory hover:border-ivory">
                          {slide.secondaryButton.text}
                        </Button>
                      </SlideLink>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </PageShell>
          </div>
        );
      })}

      {count > 1 ? (
        <>
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-ivory/30 text-xl text-ivory transition-colors hover:border-ivory hover:bg-ivory/10 md:flex"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-ivory/30 text-xl text-ivory transition-colors hover:border-ivory hover:bg-ivory/10 md:flex"
          >
            ›
          </button>
          <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {slides!.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => go(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index || undefined}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === index ? "w-8 bg-gold" : "w-4 bg-ivory/40 hover:bg-ivory/70",
                )}
              />
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
