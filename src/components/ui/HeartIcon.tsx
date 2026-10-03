interface HeartIconProps {
  filled?: boolean;
  className?: string;
}

/** Wishlist heart: outlined by default, filled when the item is saved. */
export function HeartIcon({ filled = false, className = "h-5 w-5" }: HeartIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 20.25s-7.5-4.6-7.5-10.03A4.22 4.22 0 0 1 8.72 6c1.37 0 2.6.66 3.28 1.74A3.9 3.9 0 0 1 15.28 6a4.22 4.22 0 0 1 4.22 4.22c0 5.43-7.5 10.03-7.5 10.03Z" />
    </svg>
  );
}
