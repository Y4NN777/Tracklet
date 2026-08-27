import { nanoid } from "nanoid";
import type { Debt } from "../../types";
import { getDB } from "../schema";
import { assertDate, assertPositiveMoney, assertRealm, cleanRequiredText } from "../../domain/validation";

export async function getAllDebts(realm?: string): Promise<Debt[]> {
  const db = await getDB();
  let results: Debt[];
  if (realm) {
    results = await db.getAllFromIndex("debts", "realm", realm);
  } else {
    results = await db.getAll("debts");
  }
  results.sort((a, b) => b.date.localeCompare(a.date));
  return results;
}

export async function getDebtsByStatus(status: string): Promise<Debt[]> {
  const db = await getDB();
  return db.getAllFromIndex("debts", "status", status);
}

export async function getDebt(id: string): Promise<Debt | undefined> {
  const db = await getDB();
  return db.get("debts", id);
}

export async function createDebt(
  data: Omit<Debt, "id" | "status" | "settledAt" | "createdAt" | "updatedAt">,
): Promise<Debt> {
  assertRealm(data.realm);
  assertPositiveMoney(data.amount, "Montant");
  assertDate(data.date);
  const now = new Date().toISOString();
  const debt: Debt = {
    id: `debt_${nanoid()}`,
    ...data,
    person: cleanRequiredText(data.person, "Person"),
    description: data.description.trim(),
    status: "active",
    settledAt: null,
    createdAt: now,
    updatedAt: now,
  };
  const db = await getDB();
  await db.add("debts", debt);
  return debt;
}

export async function settleDebt(id: string): Promise<void> {
  const db = await getDB();
  const existing = await db.get("debts", id);
  if (!existing) throw new Error("Dette introuvable");
  if (existing.status !== "active") throw new Error("Seule une dette active peut être réglée");
  await db.put("debts", {
    ...existing,
    status: "settled",
    settledAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

export async function writeOffDebt(id: string): Promise<void> {
  const db = await getDB();
  const existing = await db.get("debts", id);
  if (!existing) throw new Error("Dette introuvable");
  if (existing.status !== "active") throw new Error("Seule une dette active peut être classée sans suite");
  await db.put("debts", {
    ...existing,
    status: "written-off",
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteDebt(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("debts", id);
}
