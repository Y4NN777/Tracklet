import { nanoid } from "nanoid";
import type { Sale } from "../../types";
import { getDB } from "../schema";

export async function getSales(opts?: {
  realm?: string;
  pocketId?: string;
  startDate?: string;
  endDate?: string;
}): Promise<Sale[]> {
  const db = await getDB();
  let results: Sale[];

  if (opts?.pocketId) {
    results = await db.getAllFromIndex("sales", "pocketId", opts.pocketId);
  } else if (opts?.realm) {
    results = await db.getAllFromIndex("sales", "realm", opts.realm);
  } else {
    results = await db.getAll("sales");
  }

  if (opts?.startDate) {
    results = results.filter((s) => s.date >= opts.startDate!);
  }
  if (opts?.endDate) {
    results = results.filter((s) => s.date <= opts.endDate!);
  }

  results.sort((a, b) => b.date.localeCompare(a.date));
  return results;
}

export async function getRecentSales(
  limit: number,
  realm?: string,
): Promise<Sale[]> {
  const all = await getSales({ realm });
  return all.slice(0, limit);
}

export async function getSale(id: string): Promise<Sale | undefined> {
  const db = await getDB();
  return db.get("sales", id);
}

export async function createSale(
  data: Omit<Sale, "id" | "total" | "createdAt">,
): Promise<Sale> {
  const sale: Sale = {
    id: nanoid(),
    ...data,
    total: data.quantity * data.unitPrice,
    createdAt: new Date().toISOString(),
  };
  const db = await getDB();
  await db.add("sales", sale);
  return sale;
}

export async function deleteSale(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("sales", id);
}

export async function searchSales(
  query: string,
  realm?: string,
): Promise<Sale[]> {
  const all = await getSales({ realm });
  const lower = query.toLowerCase();
  return all.filter(
    (s) =>
      s.product.toLowerCase().includes(lower) ||
      s.tags.some((t) => t.toLowerCase().includes(lower)),
  );
}
