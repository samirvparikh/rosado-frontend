interface IconProps {
  className?: string;
}

function Svg({ className = "h-5 w-5", children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4.2-4.2" />
    </Svg>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="8.25" r="3.75" />
      <path d="M4.5 20.25a7.5 7.5 0 0 1 15 0" />
    </Svg>
  );
}

export function BagIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5.25 8.25h13.5l-1 12H6.25l-1-12Z" />
      <path d="M9 8.25V6.75a3 3 0 0 1 6 0v1.5" />
    </Svg>
  );
}
