import { nanoid } from "nanoid";
import type { Sale } from "../../types";
import { getDB } from "../schema";
import { assertDate, assertPositiveMoney, cleanRequiredText, cleanTags } from "../../domain/validation";

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
  if (data.realm !== "business") throw new Error("Les ventes appartiennent à l’espace Activité");
  assertPositiveMoney(data.quantity, "Quantité");
  assertPositiveMoney(data.unitPrice, "Prix unitaire");
  assertDate(data.date);

  const db = await getDB();
  const tx = db.transaction(["pockets", "categories", "sales", "transactions"], "readwrite");
  const pocket = await tx.objectStore("pockets").get(data.pocketId);
  if (!pocket || pocket.realm !== "business") {
    throw new Error("Choisissez une poche de l’espace Activité");
  }

  const categories = await tx.objectStore("categories").index("realm").getAll("business");
  const revenueCategory = categories.find((category) => category.type === "income");
  const saleId = `sale_${nanoid()}`;
  const transactionId = `txn_${nanoid()}`;
  const product = cleanRequiredText(data.product, "Product or service");
  const tags = cleanTags(data.tags);
  const createdAt = new Date().toISOString();
  const total = data.quantity * data.unitPrice;
  const sale: Sale = {
    id: saleId,
    ...data,
    product,
    tags,
    total,
    transactionId,
    createdAt,
  };
  await Promise.all([
    tx.objectStore("sales").add(sale),
    tx.objectStore("transactions").add({
      id: transactionId,
      pocketId: data.pocketId,
      type: "income",
      amount: total,
      description: `Vente : ${product}`,
      categoryId: revenueCategory?.id ?? "",
      date: data.date,
      realm: "business",
      tags,
      sourceType: "sale",
      sourceId: saleId,
      createdAt,
    }),
  ]);
  await tx.done;
  return sale;
}

export async function deleteSale(id: string): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(["sales", "transactions"], "readwrite");
  const sale = await tx.objectStore("sales").get(id);
  if (!sale) {
    throw new Error("Vente introuvable");
  }
  await tx.objectStore("sales").delete(id);
  if (sale.transactionId) {
    const linked = await tx.objectStore("transactions").get(sale.transactionId);
    if (linked?.sourceType === "sale" && linked.sourceId === id) {
      await tx.objectStore("transactions").delete(sale.transactionId);
    }
  }
  await tx.done;
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
