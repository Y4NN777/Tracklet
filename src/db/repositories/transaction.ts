import { nanoid } from "nanoid";
import type { Transaction } from "../../types";
import { getDB } from "../schema";

export async function getAllTransactions(
  filters?: {
    realm?: string;
    pocketId?: string;
    type?: string;
    categoryId?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
  },
): Promise<Transaction[]> {
  const db = await getDB();

  let results: Transaction[];

  if (filters?.pocketId) {
    results = await db.getAllFromIndex("transactions", "pocketId", filters.pocketId);
  } else if (filters?.realm) {
    results = await db.getAllFromIndex("transactions", "realm", filters.realm);
  } else if (filters?.type) {
    results = await db.getAllFromIndex("transactions", "type", filters.type);
  } else {
    results = await db.getAll("transactions");
  }

  if (filters?.categoryId) {
    results = results.filter((t) => t.categoryId === filters.categoryId);
  }
  if (filters?.startDate) {
    results = results.filter((t) => t.date >= filters.startDate!);
  }
  if (filters?.endDate) {
    results = results.filter((t) => t.date <= filters.endDate!);
  }

  results.sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
  if (filters?.limit) {
    results = results.slice(0, filters.limit);
  }
  return results;
}

export async function getTransaction(id: string): Promise<Transaction | undefined> {
  const db = await getDB();
  return db.get("transactions", id);
}

export async function createTransaction(
  data: Omit<Transaction, "id" | "createdAt">,
): Promise<Transaction> {
  const txn: Transaction = {
    id: nanoid(),
    ...data,
    createdAt: new Date().toISOString(),
  };
  const db = await getDB();
  await db.add("transactions", txn);
  return txn;
}

export async function updateTransaction(
  id: string,
  data: Partial<Pick<Transaction, "description" | "amount" | "categoryId" | "date" | "tags">>,
): Promise<void> {
  const db = await getDB();
  const existing = await db.get("transactions", id);
  if (!existing) throw new Error("Transaction not found");
  await db.put("transactions", { ...existing, ...data });
}

export async function deleteTransaction(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("transactions", id);
}
