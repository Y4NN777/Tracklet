import type { Realm } from "../types";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function assertRealm(value: unknown): asserts value is Realm {
  if (value !== "personal" && value !== "business") {
    throw new Error("Espace financier invalide");
  }
}

export function assertPositiveMoney(value: number, label = "Amount"): void {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new Error(`${label} doit être un nombre entier positif de FCFA`);
  }
}

export function assertNonNegativeMoney(value: number, label = "Amount"): void {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error(`${label} doit être un nombre entier positif ou nul de FCFA`);
  }
}

export function assertDate(value: string): void {
  if (!ISO_DATE.test(value) || Number.isNaN(Date.parse(`${value}T00:00:00`))) {
    throw new Error("Date invalide");
  }
}

export function cleanRequiredText(value: string, label: string): string {
  const clean = value.trim();
  if (!clean) throw new Error(`${label} est requis`);
  return clean;
}

export function cleanTags(tags: string[]): string[] {
  return [...new Set(tags.map((tag) => tag.trim()).filter(Boolean))].slice(0, 20);
}
