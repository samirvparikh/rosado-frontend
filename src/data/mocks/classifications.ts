import type { ClassificationItem, ProductClassificationMap } from "@/types";

const active = (id: string, name: string, slug: string, sortOrder: number): ClassificationItem => ({
  id,
  name,
  slug,
  sortOrder,
  status: "ACTIVE",
});

export const audiences: ClassificationItem[] = [
  active("AUD-MEN", "Men", "men", 1),
  active("AUD-WOMEN", "Women", "women", 2),
  active("AUD-UNISEX", "Unisex", "unisex", 3),
];

export const fragranceFamilies: ClassificationItem[] = [
  active("FAM-FRESH", "Fresh", "fresh", 1),
  active("FAM-WOODY", "Woody", "woody", 2),
  active("FAM-FLORAL", "Floral", "floral", 3),
  active("FAM-ORIENTAL", "Oriental", "oriental", 4),
  active("FAM-CITRUS", "Citrus", "citrus", 5),
  active("FAM-SWEET", "Sweet / Gourmand", "sweet", 6),
  active("FAM-MUSKY", "Musky", "musky", 7),
  active("FAM-OUD", "Oud", "oud", 8),
  active("FAM-FRUITY", "Fruity", "fruity", 9),
  active("FAM-AQUATIC", "Aquatic", "aquatic", 10),
  active("FAM-AMBER", "Amber", "amber", 11),
  active("FAM-SPICY", "Spicy", "spicy", 12),
  active("FAM-GREEN", "Green", "green", 13),
];

export const occasions: ClassificationItem[] = [
  active("OCC-EVERYDAY", "Everyday Wear", "everyday-wear", 1),
  active("OCC-OFFICE", "Office Wear", "office-wear", 2),
  active("OCC-DATE", "Date Night", "date-night", 3),
  active("OCC-PARTY", "Party & Events", "party-events", 4),
  active("OCC-WEDDING", "Wedding", "wedding", 5),
  active("OCC-FORMAL", "Formal", "formal", 6),
  active("OCC-CASUAL", "Casual", "casual", 7),
  active("OCC-TRAVEL", "Travel", "travel", 8),
  active("OCC-SPECIAL", "Special Occasions", "special-occasions", 9),
];

export const seasons: ClassificationItem[] = [
  active("SEA-SUMMER", "Summer", "summer", 1),
  active("SEA-WINTER", "Winter", "winter", 2),
  active("SEA-MONSOON", "Monsoon", "monsoon", 3),
  active("SEA-SPRING", "Spring", "spring", 4),
  active("SEA-ALL", "All Season", "all-season", 5),
];

export const timesOfDay: ClassificationItem[] = [
  active("TOD-DAY", "Day", "day", 1),
  active("TOD-EVENING", "Evening", "evening", 2),
  active("TOD-NIGHT", "Night", "night", 3),
  active("TOD-ALL", "All Day", "all-day", 4),
];

export const intensities: ClassificationItem[] = [
  active("INT-LIGHT", "Light", "light", 1),
  active("INT-MODERATE", "Moderate", "moderate", 2),
  active("INT-STRONG", "Strong", "strong", 3),
  active("INT-INTENSE", "Intense", "intense", 4),
];

export const longevities: ClassificationItem[] = [
  active("LON-4", "4–6 Hours", "4-6-hours", 1),
  active("LON-8", "8+ Hours", "8-hours", 2),
  active("LON-12", "12+ Hours", "12-hours", 3),
];

export const scentCharacters: ClassificationItem[] = [
  active("CHR-WARM", "Warm", "warm", 1),
  active("CHR-FRESH", "Fresh", "fresh", 2),
  active("CHR-LONG", "Long Lasting", "long-lasting", 3),
  active("CHR-SOFT", "Soft", "soft", 4),
  active("CHR-BOLD", "Bold", "bold", 5),
];

export const collections: ClassificationItem[] = [
  active("COL-SIGNATURE", "Signature", "signature", 1),
  active("COL-ATELIER", "Atelier", "atelier", 2),
  active("COL-NOIR", "Noir", "noir", 3),
  active("COL-BLOOM", "Bloom", "bloom", 4),
];

export const productAudiences: ProductClassificationMap[] = [
  { productId: "PRD-ROYAL-OUD", classificationId: "AUD-MEN" },
  { productId: "PRD-AMBER-NOIR", classificationId: "AUD-MEN" },
  { productId: "PRD-CEDAR-NIGHT", classificationId: "AUD-MEN" },
  { productId: "PRD-VELVET-ROSE", classificationId: "AUD-WOMEN" },
  { productId: "PRD-JASMINE-SILK", classificationId: "AUD-WOMEN" },
  { productId: "PRD-PEONY-MIST", classificationId: "AUD-WOMEN" },
  { productId: "PRD-CITRUS-VEIL", classificationId: "AUD-UNISEX" },
  { productId: "PRD-SALT-AIR", classificationId: "AUD-UNISEX" },
  { productId: "PRD-VANILLA-EMBER", classificationId: "AUD-UNISEX" },
];

export const productFamilies: ProductClassificationMap[] = [
  { productId: "PRD-ROYAL-OUD", classificationId: "FAM-WOODY" },
  { productId: "PRD-ROYAL-OUD", classificationId: "FAM-OUD" },
  { productId: "PRD-ROYAL-OUD", classificationId: "FAM-SPICY" },
  { productId: "PRD-AMBER-NOIR", classificationId: "FAM-AMBER" },
  { productId: "PRD-AMBER-NOIR", classificationId: "FAM-ORIENTAL" },
  { productId: "PRD-CEDAR-NIGHT", classificationId: "FAM-WOODY" },
  { productId: "PRD-VELVET-ROSE", classificationId: "FAM-FLORAL" },
  { productId: "PRD-JASMINE-SILK", classificationId: "FAM-FLORAL" },
  { productId: "PRD-PEONY-MIST", classificationId: "FAM-FLORAL" },
  { productId: "PRD-PEONY-MIST", classificationId: "FAM-FRESH" },
  { productId: "PRD-CITRUS-VEIL", classificationId: "FAM-CITRUS" },
  { productId: "PRD-CITRUS-VEIL", classificationId: "FAM-FRESH" },
  { productId: "PRD-SALT-AIR", classificationId: "FAM-AQUATIC" },
  { productId: "PRD-SALT-AIR", classificationId: "FAM-FRESH" },
  { productId: "PRD-VANILLA-EMBER", classificationId: "FAM-SWEET" },
  { productId: "PRD-VANILLA-EMBER", classificationId: "FAM-AMBER" },
];

export const productOccasions: ProductClassificationMap[] = [
  { productId: "PRD-ROYAL-OUD", classificationId: "OCC-DATE" },
  { productId: "PRD-ROYAL-OUD", classificationId: "OCC-WEDDING" },
  { productId: "PRD-ROYAL-OUD", classificationId: "OCC-PARTY" },
  { productId: "PRD-AMBER-NOIR", classificationId: "OCC-FORMAL" },
  { productId: "PRD-AMBER-NOIR", classificationId: "OCC-SPECIAL" },
  { productId: "PRD-CEDAR-NIGHT", classificationId: "OCC-DATE" },
  { productId: "PRD-CEDAR-NIGHT", classificationId: "OCC-FORMAL" },
  { productId: "PRD-VELVET-ROSE", classificationId: "OCC-WEDDING" },
  { productId: "PRD-VELVET-ROSE", classificationId: "OCC-DATE" },
  { productId: "PRD-JASMINE-SILK", classificationId: "OCC-EVERYDAY" },
  { productId: "PRD-PEONY-MIST", classificationId: "OCC-CASUAL" },
  { productId: "PRD-PEONY-MIST", classificationId: "OCC-EVERYDAY" },
  { productId: "PRD-CITRUS-VEIL", classificationId: "OCC-OFFICE" },
  { productId: "PRD-CITRUS-VEIL", classificationId: "OCC-EVERYDAY" },
  { productId: "PRD-SALT-AIR", classificationId: "OCC-TRAVEL" },
  { productId: "PRD-SALT-AIR", classificationId: "OCC-CASUAL" },
  { productId: "PRD-VANILLA-EMBER", classificationId: "OCC-PARTY" },
  { productId: "PRD-VANILLA-EMBER", classificationId: "OCC-SPECIAL" },
];

export const productSeasons: ProductClassificationMap[] = [
  { productId: "PRD-ROYAL-OUD", classificationId: "SEA-WINTER" },
  { productId: "PRD-ROYAL-OUD", classificationId: "SEA-ALL" },
  { productId: "PRD-AMBER-NOIR", classificationId: "SEA-WINTER" },
  { productId: "PRD-CEDAR-NIGHT", classificationId: "SEA-WINTER" },
  { productId: "PRD-VELVET-ROSE", classificationId: "SEA-SPRING" },
  { productId: "PRD-JASMINE-SILK", classificationId: "SEA-SUMMER" },
  { productId: "PRD-PEONY-MIST", classificationId: "SEA-SPRING" },
  { productId: "PRD-CITRUS-VEIL", classificationId: "SEA-SUMMER" },
  { productId: "PRD-SALT-AIR", classificationId: "SEA-SUMMER" },
  { productId: "PRD-VANILLA-EMBER", classificationId: "SEA-WINTER" },
];

export const productTimes: ProductClassificationMap[] = [
  { productId: "PRD-ROYAL-OUD", classificationId: "TOD-NIGHT" },
  { productId: "PRD-ROYAL-OUD", classificationId: "TOD-EVENING" },
  { productId: "PRD-AMBER-NOIR", classificationId: "TOD-NIGHT" },
  { productId: "PRD-CEDAR-NIGHT", classificationId: "TOD-EVENING" },
  { productId: "PRD-VELVET-ROSE", classificationId: "TOD-EVENING" },
  { productId: "PRD-JASMINE-SILK", classificationId: "TOD-DAY" },
  { productId: "PRD-PEONY-MIST", classificationId: "TOD-DAY" },
  { productId: "PRD-CITRUS-VEIL", classificationId: "TOD-DAY" },
  { productId: "PRD-SALT-AIR", classificationId: "TOD-ALL" },
  { productId: "PRD-VANILLA-EMBER", classificationId: "TOD-NIGHT" },
];

export const productIntensities: ProductClassificationMap[] = [
  { productId: "PRD-ROYAL-OUD", classificationId: "INT-STRONG" },
  { productId: "PRD-AMBER-NOIR", classificationId: "INT-INTENSE" },
  { productId: "PRD-CEDAR-NIGHT", classificationId: "INT-MODERATE" },
  { productId: "PRD-VELVET-ROSE", classificationId: "INT-MODERATE" },
  { productId: "PRD-JASMINE-SILK", classificationId: "INT-LIGHT" },
  { productId: "PRD-PEONY-MIST", classificationId: "INT-LIGHT" },
  { productId: "PRD-CITRUS-VEIL", classificationId: "INT-LIGHT" },
  { productId: "PRD-SALT-AIR", classificationId: "INT-MODERATE" },
  { productId: "PRD-VANILLA-EMBER", classificationId: "INT-STRONG" },
];

export const productLongevities: ProductClassificationMap[] = [
  { productId: "PRD-ROYAL-OUD", classificationId: "LON-12" },
  { productId: "PRD-AMBER-NOIR", classificationId: "LON-12" },
  { productId: "PRD-CEDAR-NIGHT", classificationId: "LON-8" },
  { productId: "PRD-VELVET-ROSE", classificationId: "LON-8" },
  { productId: "PRD-JASMINE-SILK", classificationId: "LON-4" },
  { productId: "PRD-PEONY-MIST", classificationId: "LON-4" },
  { productId: "PRD-CITRUS-VEIL", classificationId: "LON-4" },
  { productId: "PRD-SALT-AIR", classificationId: "LON-8" },
  { productId: "PRD-VANILLA-EMBER", classificationId: "LON-8" },
];

export const productCharacters: ProductClassificationMap[] = [
  { productId: "PRD-ROYAL-OUD", classificationId: "CHR-WARM" },
  { productId: "PRD-ROYAL-OUD", classificationId: "CHR-LONG" },
  { productId: "PRD-AMBER-NOIR", classificationId: "CHR-BOLD" },
  { productId: "PRD-VELVET-ROSE", classificationId: "CHR-SOFT" },
  { productId: "PRD-CITRUS-VEIL", classificationId: "CHR-FRESH" },
];

export const productCollections: ProductClassificationMap[] = [
  { productId: "PRD-ROYAL-OUD", classificationId: "COL-SIGNATURE" },
  { productId: "PRD-AMBER-NOIR", classificationId: "COL-NOIR" },
  { productId: "PRD-CEDAR-NIGHT", classificationId: "COL-NOIR" },
  { productId: "PRD-VELVET-ROSE", classificationId: "COL-BLOOM" },
  { productId: "PRD-JASMINE-SILK", classificationId: "COL-BLOOM" },
  { productId: "PRD-PEONY-MIST", classificationId: "COL-BLOOM" },
  { productId: "PRD-CITRUS-VEIL", classificationId: "COL-ATELIER" },
  { productId: "PRD-SALT-AIR", classificationId: "COL-ATELIER" },
  { productId: "PRD-VANILLA-EMBER", classificationId: "COL-SIGNATURE" },
];
