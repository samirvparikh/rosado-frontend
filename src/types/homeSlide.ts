export interface HomeSlideButton {
  text: string;
  link: string;
}

export interface HomeSlide {
  id: number;
  mediaType: "IMAGE" | "VIDEO";
  mediaUrl: string;
  mobileMediaUrl: string | null;
  posterUrl: string | null;
  eyebrow: string | null;
  title: string | null;
  subtitle: string | null;
  primaryButton: HomeSlideButton | null;
  secondaryButton: HomeSlideButton | null;
}
