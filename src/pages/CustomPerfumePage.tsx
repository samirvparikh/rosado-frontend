import { useParams } from "react-router-dom";
import { PerfumeCustomizer } from "@/custom-builder/PerfumeCustomizer";

/** /custom-perfume (default custom product) and /custom-perfume/:slug. */
export function CustomPerfumePage() {
  const { slug } = useParams();
  // Re-mount per product so selections never leak between products.
  return <PerfumeCustomizer key={slug ?? "default"} productRef={slug} />;
}
