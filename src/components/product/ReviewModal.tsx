import { useEffect, useRef, useState } from "react";
import type { DragEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { StarIcon } from "@/components/ui/Icons";
import { ApiError } from "@/services/http";
import { submitProductReview } from "@/services/reviewsApi";
import type { ProductReview, ReviewSummary } from "@/types";

const MAX_FILES = 5;
const MAX_FILE_MB = 10;
const RATING_LABELS = ["Poor", "Fair", "Good", "Very good", "Excellent"];

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  product: { id: string; name: string; image?: string };
  onSubmitted: (review: ProductReview, summary: ReviewSummary) => void;
}

interface PendingFile {
  file: File;
  preview: string;
}

export function ReviewModal({ open, onClose, product, onSubmitted }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [files, setFiles] = useState<PendingFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Release preview object URLs when files are removed or the modal unmounts.
  const filesRef = useRef(files);
  filesRef.current = files;
  useEffect(() => () => filesRef.current.forEach((f) => URL.revokeObjectURL(f.preview)), []);

  const reset = () => {
    files.forEach((f) => URL.revokeObjectURL(f.preview));
    setRating(0);
    setHover(0);
    setTitle("");
    setBody("");
    setFiles([]);
    setError("");
  };

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const accepted: PendingFile[] = [];
    let problem = "";
    for (const file of Array.from(list)) {
      if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
        problem = "Only photos and videos can be uploaded.";
        continue;
      }
      if (file.size > MAX_FILE_MB * 1024 * 1024) {
        problem = `Each file must be ${MAX_FILE_MB} MB or smaller.`;
        continue;
      }
      accepted.push({ file, preview: URL.createObjectURL(file) });
    }
    const room = MAX_FILES - files.length;
    if (accepted.length > room) {
      accepted.slice(room).forEach((f) => URL.revokeObjectURL(f.preview));
      problem = `You can add up to ${MAX_FILES} files.`;
    }
    setFiles((prev) => [...prev, ...accepted.slice(0, Math.max(room, 0))]);
    setError(problem);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    addFiles(event.dataTransfer.files);
  };

  const submit = async () => {
    if (!rating) return setError("Please select a star rating.");
    if (!title.trim()) return setError("Please add a review title.");
    if (!body.trim()) return setError("Please write a review description.");
    setPending(true);
    setError("");
    try {
      const result = await submitProductReview(product.id, {
        rating,
        title: title.trim(),
        body: body.trim(),
        files: files.map((f) => f.file),
      });
      onSubmitted(result.review, result.summary);
      reset();
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not submit your review. Please try again.");
    } finally {
      setPending(false);
    }
  };

  const shown = hover || rating;
  const fieldClass =
    "w-full rounded-md border border-sand bg-white px-3.5 py-3 text-sm text-charcoal outline-none transition-colors placeholder:text-charcoal focus:border-charcoal";

  return (
    <Modal open={open} title="Write a review" onClose={onClose}>
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
        className="space-y-4"
      >
        <div className="flex items-center gap-4">
          {product.image ? (
            <img
              src={product.image}
              alt=""
              className="h-16 w-16 shrink-0 rounded-md border border-sand object-cover sm:h-20 sm:w-20"
            />
          ) : null}
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-charcoal sm:text-lg">{product.name}</p>
            <div
              role="radiogroup"
              aria-label="Your rating"
              className="mt-1 flex items-center gap-1"
              onMouseLeave={() => setHover(0)}
            >
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={rating === value}
                  aria-label={`${value} star${value > 1 ? "s" : ""} – ${RATING_LABELS[value - 1]}`}
                  onMouseEnter={() => setHover(value)}
                  onFocus={() => setHover(value)}
                  onBlur={() => setHover(0)}
                  onClick={() => {
                    setRating(value);
                    setError("");
                  }}
                  className="text-gold transition-transform hover:scale-110"
                >
                  <StarIcon filled={value <= shown} className="h-7 w-7 sm:h-9 sm:w-9" />
                </button>
              ))}
              {shown ? <span className="ml-2 text-xs text-stone">{RATING_LABELS[shown - 1]}</span> : null}
            </div>
          </div>
        </div>

        <label className="block">
          <span className="sr-only">Review title</span>
          <input
            value={title}
            maxLength={150}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Review Title"
            className={`${fieldClass} min-h-14`}
          />
        </label>

        <label className="block">
          <span className="sr-only">Review description</span>
          <textarea
            value={body}
            maxLength={3000}
            rows={7}
            onChange={(event) => setBody(event.target.value)}
            placeholder="Review Description"
            className={`${fieldClass} resize-y`}
          />
        </label>

        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`flex cursor-pointer items-center gap-3 rounded-md border px-3 py-3 transition-colors ${
            dragging ? "border-charcoal bg-cream" : "border-sand bg-[#f7f7f7] hover:border-mist"
          }`}
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-sand/60 text-charcoal">
            <MediaIcon />
          </span>
          <span>
            <span className="block text-sm font-semibold text-charcoal">Add Photos or Videos</span>
            <span className="block text-xs text-charcoal/80">
              Click here or drag to upload · up to {MAX_FILES} files, {MAX_FILE_MB} MB each
            </span>
          </span>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            className="hidden"
            onChange={(event) => {
              addFiles(event.target.files);
              event.target.value = "";
            }}
          />
        </div>

        {files.length ? (
          <ul className="grid grid-cols-4 gap-2 sm:grid-cols-5">
            {files.map((item, index) => (
              <li key={item.preview} className="relative aspect-square overflow-hidden rounded-md border border-sand bg-cream">
                {item.file.type.startsWith("video/") ? (
                  <video src={item.preview} muted className="h-full w-full object-cover" />
                ) : (
                  <img src={item.preview} alt={item.file.name} className="h-full w-full object-cover" />
                )}
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  aria-label={`Remove ${item.file.name}`}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-charcoal/80 text-xs text-ivory hover:bg-charcoal"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        {error ? (
          <p role="alert" className="text-sm text-rose">
            {error}
          </p>
        ) : null}

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={onClose} disabled={pending}>
            Cancel
          </Button>
          <Button type="submit" disabled={pending}>
            {pending ? "Submitting…" : "Submit review"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function MediaIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
      <rect x="6" y="3.5" width="14.5" height="11" rx="1.5" />
      <path d="M3.5 7v12a1.5 1.5 0 0 0 1.5 1.5h12" />
      <path d="m8 13 3.2-3.5 2.6 2.6 1.7-1.6L19 13.5" />
      <circle cx="16.5" cy="7" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}
