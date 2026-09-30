export function Rating({ value, count }: { value: number; count?: number }) {
  return (
    <p className="text-xs tracking-wide text-stone" aria-label={`Rated ${value} out of 5`}>
      <span className="text-gold">{"★".repeat(Math.round(value))}</span>
      <span className="text-sand">{"★".repeat(5 - Math.round(value))}</span>
      <span className="ml-2">
        {value.toFixed(1)}
        {count !== undefined ? ` · ${count}` : ""}
      </span>
    </p>
  );
}
