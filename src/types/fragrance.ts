import type { EntityStatus, GenderAudience, NoteType } from "./common";

export interface Fragrance {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  gender?: GenderAudience;
  image?: string;
  status: EntityStatus;
  familyIds: string[];
  characterIds: string[];
}

export interface Note {
  id: string;
  name: string;
  noteType: NoteType;
  image?: string;
  status: EntityStatus;
}

export interface FragranceNote {
  fragranceId: string;
  noteId: string;
  noteType: NoteType;
  sortOrder: number;
}

export interface FragranceSizePrice {
  fragranceId: string;
  sizeId: string;
  basePrice: number;
}

export interface FragranceWithNotes extends Fragrance {
  notes: {
    top: Note[];
    heart: Note[];
    base: Note[];
  };
  families: string[];
  sizePrices: FragranceSizePrice[];
}
