import { nanoid } from "nanoid";
import type { Goal } from "../../types";
import { getDB } from "../schema";
import { assertNonNegativeMoney, assertPositiveMoney, assertRealm, cleanRequiredText } from "../../domain/validation";

export async function getGoals(realm?: string): Promise<Goal[]> {
  const db = await getDB();
  let results: Goal[];
  if (realm) {
    results = await db.getAllFromIndex("goals", "realm", realm);
  } else {
    results = await db.getAll("goals");
  }
  results.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return results;
}

export async function getGoal(id: string): Promise<Goal | undefined> {
  const db = await getDB();
  return db.get("goals", id);
}

export async function createGoal(
  data: Omit<Goal, "id" | "createdAt" | "updatedAt">,
): Promise<Goal> {
  assertRealm(data.realm);
  assertPositiveMoney(data.targetAmount, "Montant cible");
  assertNonNegativeMoney(data.savedAmount, "Montant épargné");
  const db = await getDB();
  if (data.sourcePocketId) {
    const pocket = await db.get("pockets", data.sourcePocketId);
    if (!pocket || pocket.realm !== data.realm) throw new Error("La poche liée n’appartient pas à cet espace");
  }
  const now = new Date().toISOString();
  const goal: Goal = {
    id: `goal_${nanoid()}`,
    ...data,
    name: cleanRequiredText(data.name, "Goal name"),
    createdAt: now,
    updatedAt: now,
  };
  await db.add("goals", goal);
  return goal;
}

export async function updateGoal(
  id: string,
  data: Partial<Pick<Goal, "name" | "targetAmount" | "savedAmount" | "sourcePocketId">>,
): Promise<void> {
  const db = await getDB();
  const existing = await db.get("goals", id);
  if (!existing) throw new Error("Objectif introuvable");
  if (data.targetAmount !== undefined) assertPositiveMoney(data.targetAmount, "Montant cible");
  if (data.savedAmount !== undefined) assertNonNegativeMoney(data.savedAmount, "Montant épargné");
  await db.put("goals", {
    ...existing,
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteGoal(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("goals", id);
}
