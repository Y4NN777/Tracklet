import { nanoid } from "nanoid";
import type { Pocket } from "../types";
import { getDB } from "./schema";

export async function getAllPockets(realm?: string): Promise<Pocket[]> {
  const db = await getDB();
  if (realm) {
    return db.getAllFromIndex("pockets", "realm", realm);
  }
  return db.getAll("pockets");
}

export async function getActivePockets(realm?: string): Promise<Pocket[]> {
  const all = await getAllPockets(realm);
  return all.filter((p) => !p.archived);
}

export async function getPocket(id: string): Promise<Pocket | undefined> {
  const db = await getDB();
  return db.get("pockets", id);
}

export async function createPocket(
  data: Omit<Pocket, "id" | "createdAt" | "updatedAt" | "archived">,
): Promise<Pocket> {
  const now = new Date().toISOString();
  const pocket: Pocket = {
    id: nanoid(),
    ...data,
    archived: false,
    createdAt: now,
    updatedAt: now,
  };
  const db = await getDB();
  await db.add("pockets", pocket);
  return pocket;
}

export async function updatePocket(
  id: string,
  data: Partial<Pick<Pocket, "name" | "description" | "archived">>,
): Promise<void> {
  const db = await getDB();
  const existing = await db.get("pockets", id);
  if (!existing) throw new Error("Pocket not found");
  await db.put("pockets", {
    ...existing,
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

export async function deletePocket(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("pockets", id);
}
