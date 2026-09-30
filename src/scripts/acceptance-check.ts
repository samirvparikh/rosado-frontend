/**
 * Run with: npx --yes tsx --tsconfig tsconfig.json src/scripts/acceptance-check.ts
 * Verifies builder pricing and malicious size/bottle rejection.
 */
import { validateCustomPerfume } from "@/validation/customPerfume";

const happy = validateCustomPerfume({
  fragranceId: "FRG001",
  sizeId: "SIZE50",
  bottleId: "BTL002",
  capId: "CAP001",
  quantity: 1,
});

const malicious = validateCustomPerfume({
  fragranceId: "FRG001",
  sizeId: "SIZE50",
  bottleId: "BTL004",
  capId: "CAP001",
  quantity: 1,
});

if (!happy.ok) {
  throw new Error(`Acceptance failed: valid config rejected (${happy.message})`);
}
if (happy.data.basePrice !== 399 || happy.data.bottlePrice !== 50 || happy.data.capPrice !== 0 || happy.data.unitPrice !== 449) {
  throw new Error(`Acceptance failed: expected 399+50+0=449, got ${JSON.stringify(happy.data)}`);
}
if (malicious.ok || malicious.code !== "BOTTLE_SIZE_MISMATCH") {
  throw new Error("Acceptance failed: 50 ML + 100 ML bottle must be rejected.");
}

console.log("Acceptance checks passed.");
console.log("Valid:", happy.data.fragranceName, happy.data.sizeName, happy.data.bottleName, happy.data.capName, happy.data.unitPrice);
console.log("Rejected:", malicious.message);
