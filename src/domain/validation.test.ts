import { describe, expect, it } from "vitest";
import {
  assertDate,
  assertNonNegativeMoney,
  assertPositiveMoney,
  assertRealm,
  cleanRequiredText,
  cleanTags,
} from "./validation";

describe("financial input validation", () => {
  it("accepts integer FCFA values and rejects unsafe or fractional amounts", () => {
    expect(() => assertPositiveMoney(1)).not.toThrow();
    expect(() => assertNonNegativeMoney(0)).not.toThrow();
    expect(() => assertPositiveMoney(0)).toThrow(/positif/);
    expect(() => assertPositiveMoney(1.5)).toThrow(/entier/);
    expect(() => assertPositiveMoney(Number.MAX_VALUE)).toThrow();
  });

  it("validates realms and local ISO dates", () => {
    expect(() => assertRealm("personal")).not.toThrow();
    expect(() => assertRealm("business")).not.toThrow();
    expect(() => assertRealm("perso")).toThrow(/Espace/);
    expect(() => assertDate("2026-08-27")).not.toThrow();
    expect(() => assertDate("27/08/2026")).toThrow(/Date/);
  });

  it("normalizes text and tags", () => {
    expect(cleanRequiredText("  Vente  ", "Description")).toBe("Vente");
    expect(() => cleanRequiredText("   ", "Description")).toThrow(/requis/);
    expect(cleanTags([" client ", "", "client", "urgent"])).toEqual(["client", "urgent"]);
  });
});
