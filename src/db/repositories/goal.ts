import { nanoid } from "nanoid";
import type { Goal } from "../../types";
import { getDB } from "../schema";

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
  const now = new Date().toISOString();
  const goal: Goal = {
    id: nanoid(),
    ...data,
    createdAt: now,
    updatedAt: now,
  };
  const db = await getDB();
  await db.add("goals", goal);
  return goal;
}

export async function updateGoal(
  id: string,
  data: Partial<Pick<Goal, "name" | "targetAmount" | "savedAmount" | "sourcePocketId">>,
): Promise<void> {
  const db = await getDB();
  const existing = await db.get("goals", id);
  if (!existing) throw new Error("Goal not found");
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
