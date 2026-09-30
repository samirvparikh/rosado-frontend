import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel) => readFileSync(resolve(root, rel), "utf8");

const fragrances = read("src/data/mocks/fragrances.ts");
const bottles = read("src/data/mocks/bottles.ts");
const caps = read("src/data/mocks/caps.ts");
const validation = read("src/validation/customPerfume.ts");
const store = read("src/store/customPerfumeStore.ts");

const checks = [
  [fragrances.includes('id: "FRG001"') && fragrances.includes('name: "Woody Oud"'), "Woody Oud FRG001 exists"],
  [fragrances.includes('fragranceId: "FRG001", sizeId: "SIZE50", basePrice: 399'), "Woody Oud 50 ML base is ₹399"],
  [bottles.includes('id: "BTL002"') && bottles.includes('name: "Premium Glass 50 ML"'), "Premium Glass 50 ML exists"],
  [bottles.includes('id: "BTL002"') && bottles.includes('sizeId: "SIZE50"') && bottles.includes("additionalPrice: 50"), "BTL002 is 50 ML + ₹50"],
  [bottles.includes('id: "BTL004"') && bottles.includes('sizeId: "SIZE100"'), "BTL004 is 100 ML"],
  [caps.includes('id: "CAP001"') && caps.includes('name: "Classic Black"') && caps.includes("additionalPrice: 0"), "Classic Black is ₹0"],
  [validation.includes("bottle.sizeId !== size.id"), "Backend rejects size/bottle mismatch"],
  [store.includes("sizeChanged ? null : state.configuration.bottle"), "Size change clears incompatible bottle"],
];

const failed = checks.filter(([ok]) => !ok);
if (failed.length) {
  console.error("Acceptance data/rules failed:");
  for (const [, label] of failed) console.error(" -", label);
  process.exit(1);
}

console.log("Acceptance data and rules present:");
for (const [, label] of checks) console.log(" ✓", label);
console.log("Expected happy path total: 399 + 50 + 0 = 449");
