import { Button } from "./Button";

export function ErrorState({
  message = "Something went wrong. Please try again.",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="py-20 text-center">
      <p className="text-sm text-stone">{message}</p>
      {onRetry ? (
        <div className="mt-6">
          <Button type="button" onClick={onRetry}>
            Try again
          </Button>
        </div>
      ) : null}
    </div>
  );
}
