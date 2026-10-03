import { formatCurrency } from "@/utils/formatCurrency";
import type { CustomPerfumeConfiguration } from "@/types";

export const REMARKS_MAX_LENGTH = 500;
/** Mirrors CartQuoteService::LABEL_LINE_MAX on the backend. */
export const LABEL_LINE_MAX_LENGTH = 24;

interface PreviewStepProps {
  configuration: CustomPerfumeConfiguration;
  labelLine1: string;
  labelLine2: string;
  onLabelLine1Change: (value: string) => void;
  onLabelLine2Change: (value: string) => void;
  remarks: string;
  onRemarksChange: (remarks: string) => void;
}

const inputClass =
  "mt-2 block w-full rounded-xl border border-sand bg-transparent px-3 py-2.5 text-sm placeholder:text-mist focus:border-charcoal focus:outline-none";

function LabelLineInput({
  id,
  label,
  value,
  placeholder,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-[11px] uppercase tracking-nav text-stone">
        {label} <span className="normal-case tracking-normal">(optional)</span>
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        maxLength={LABEL_LINE_MAX_LENGTH}
        placeholder={placeholder}
        className={inputClass}
      />
      <p className="mt-1 text-right text-[11px] text-stone">
        {value.length}/{LABEL_LINE_MAX_LENGTH}
      </p>
    </div>
  );
}

export function PreviewStep({
  configuration,
  labelLine1,
  labelLine2,
  onLabelLine1Change,
  onLabelLine2Change,
  remarks,
  onRemarksChange,
}: PreviewStepProps) {
  return (
    <div>
      <h2 className="font-display text-4xl">Personalise your label</h2>
      <p className="mt-2 text-sm text-stone">
        Add up to two lines of text — they are printed on the bottle label, as shown in the preview.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <LabelLineInput
          id="label-line-1"
          label="Label line 1"
          value={labelLine1}
          placeholder="e.g. For Aisha"
          onChange={onLabelLine1Change}
        />
        <LabelLineInput
          id="label-line-2"
          label="Label line 2"
          value={labelLine2}
          placeholder="e.g. With love, 2026"
          onChange={onLabelLine2Change}
        />
      </div>

      <div className="mt-8 grid gap-8 rounded-2xl border border-sand p-6 md:grid-cols-2">
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-[11px] uppercase tracking-nav text-stone">Size</dt>
            <dd className="font-display text-2xl">{configuration.size?.displayName}</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-nav text-stone">Fragrance</dt>
            <dd className="font-display text-2xl">{configuration.fragrance?.name}</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-nav text-stone">Bottle</dt>
            <dd className="font-display text-2xl">{configuration.bottle?.name}</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-nav text-stone">Cap</dt>
            <dd className="font-display text-2xl">{configuration.cap?.name}</dd>
          </div>
        </dl>
        <ul className="space-y-2 text-sm">
          <li className="flex justify-between">
            <span>Base Perfume</span>
            <span>{formatCurrency(configuration.basePrice)}</span>
          </li>
          <li className="flex justify-between">
            <span>Bottle</span>
            <span>{formatCurrency(configuration.bottlePrice)}</span>
          </li>
          <li className="flex justify-between">
            <span>Cap</span>
            <span>{formatCurrency(configuration.capPrice)}</span>
          </li>
          <li className="flex justify-between border-t border-sand pt-3 font-medium">
            <span>Total</span>
            <span>{formatCurrency(configuration.totalPrice)}</span>
          </li>
        </ul>
      </div>

      <div className="mt-8">
        <label htmlFor="custom-remarks" className="text-[11px] uppercase tracking-nav text-stone">
          Remarks <span className="normal-case tracking-normal">(optional)</span>
        </label>
        <textarea
          id="custom-remarks"
          value={remarks}
          onChange={(event) => onRemarksChange(event.target.value)}
          maxLength={REMARKS_MAX_LENGTH}
          rows={3}
          placeholder="Any special instructions for your perfume, e.g. a gift note."
          className={`${inputClass} resize-y`}
        />
        <p className="mt-1 text-right text-[11px] text-stone">
          {remarks.length}/{REMARKS_MAX_LENGTH}
        </p>
      </div>
    </div>
  );
}
