interface QuantitySelectorProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}

export function QuantitySelector({ value, min = 1, max = 10, onChange }: QuantitySelectorProps) {
  return (
    <div className="inline-flex items-center border border-sand">
      <button
        type="button"
        aria-label="Decrease quantity"
        className="h-10 w-10 text-lg"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
      >
        −
      </button>
      <span className="w-8 text-center text-sm" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        className="h-10 w-10 text-lg"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
      >
        +
      </button>
    </div>
  );
}
