import { getDB } from "../schema";
import type { Category } from "../../types";

export async function getAllCategories(): Promise<Category[]> {
  const db = await getDB();
  return db.getAll("categories");
}

export async function getCategoriesByType(type: string): Promise<Category[]> {
  const db = await getDB();
  return db.getAllFromIndex("categories", "type", type);
}

export async function getCategoriesByRealm(realm: string): Promise<Category[]> {
  const db = await getDB();
  return db.getAllFromIndex("categories", "realm", realm);
}

export async function getCategory(id: string): Promise<Category | undefined> {
  const db = await getDB();
  return db.get("categories", id);
}
