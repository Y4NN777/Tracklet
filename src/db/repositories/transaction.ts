import { nanoid } from "nanoid";
import type { Realm, Transaction } from "../../types";
import { getDB } from "../schema";
import {
  assertDate,
  assertPositiveMoney,
  assertRealm,
  cleanRequiredText,
  cleanTags,
} from "../../domain/validation";

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
  assertRealm(data.realm);
  assertPositiveMoney(data.amount, "Montant");
  assertDate(data.date);

  const db = await getDB();
  const pocket = await db.get("pockets", data.pocketId);
  if (!pocket) throw new Error("Poche introuvable");
  if (pocket.realm !== data.realm) throw new Error("La poche n’appartient pas à cet espace");

  if (data.type === "transfer") {
    throw new Error("Utilisez le transfert entre poches");
  }

  if (data.categoryId) {
    const category = await db.get("categories", data.categoryId);
    if (!category) throw new Error("Catégorie introuvable");
    if (category.realm !== data.realm || category.type !== data.type) {
      throw new Error("La catégorie ne correspond pas à cette opération");
    }
  }

  const txn: Transaction = {
    id: `txn_${nanoid()}`,
    ...data,
    description: cleanRequiredText(data.description, "Description"),
    tags: cleanTags(data.tags),
    createdAt: new Date().toISOString(),
  };
  await db.add("transactions", txn);
  return txn;
}

export async function createTransfer(data: {
  sourcePocketId: string;
  destinationPocketId: string;
  amount: number;
  description: string;
  date: string;
  realm: Realm;
  tags?: string[];
}): Promise<{ outgoing: Transaction; incoming: Transaction }> {
  assertRealm(data.realm);
  assertPositiveMoney(data.amount, "Montant");
  assertDate(data.date);
  if (data.sourcePocketId === data.destinationPocketId) {
    throw new Error("Choisissez deux poches différentes");
  }

  const db = await getDB();
  const tx = db.transaction(["pockets", "transactions"], "readwrite");
  const [source, destination] = await Promise.all([
    tx.objectStore("pockets").get(data.sourcePocketId),
    tx.objectStore("pockets").get(data.destinationPocketId),
  ]);

  if (!source || !destination) {
    throw new Error("Poche introuvable");
  }
  if (source.realm !== data.realm || destination.realm !== data.realm) {
    throw new Error("Un transfert ne peut pas passer entre Personnel et Activité");
  }

  const transferId = `transfer_${nanoid()}`;
  const createdAt = new Date().toISOString();
  const description = cleanRequiredText(data.description, "Description");
  const tags = cleanTags(data.tags ?? []);
  const common = {
    type: "transfer" as const,
    amount: data.amount,
    description,
    categoryId: "",
    date: data.date,
    realm: data.realm,
    tags,
    transferId,
    createdAt,
  };
  const outgoing: Transaction = {
    id: `txn_${nanoid()}`,
    pocketId: source.id,
    relatedPocketId: destination.id,
    transferDirection: "out",
    ...common,
  };
  const incoming: Transaction = {
    id: `txn_${nanoid()}`,
    pocketId: destination.id,
    relatedPocketId: source.id,
    transferDirection: "in",
    ...common,
  };

  await Promise.all([
    tx.objectStore("transactions").add(outgoing),
    tx.objectStore("transactions").add(incoming),
  ]);
  await tx.done;
  return { outgoing, incoming };
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
