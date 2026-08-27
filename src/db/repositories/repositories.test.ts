import "fake-indexeddb/auto";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createBackup, parseBackup, restoreBackup } from "../backup";
import { getDB, resetDatabaseForTests, seedDefaults } from "../schema";
import { createPocket } from "./pocket";
import { createSale, deleteSale } from "./sale";
import { createTransaction, createTransfer, getAllTransactions } from "./transaction";
import { getPocketBalance, getTotalBalance } from "../../domain/pocket";
import { createDebt, settleDebt, writeOffDebt } from "./debt";
import { getDebtSummary } from "../../domain/debt";
import { createGoal, updateGoal } from "./goal";

describe("IndexedDB repositories", () => {
  beforeEach(async () => {
    await resetDatabaseForTests();
    await seedDefaults(await getDB());
  });
  afterEach(resetDatabaseForTests);

  it("keeps personal and business records isolated", async () => {
    const personal = await createPocket({ name: "Espèces", description: "", realm: "personal" });
    const business = await createPocket({ name: "Caisse", description: "", realm: "business" });
    const db = await getDB();
    const personalCategory = (await db.getAllFromIndex("categories", "realm", "personal")).find((c) => c.type === "income")!;
    await createTransaction({
      pocketId: personal.id, type: "income", amount: 5_000, description: "Revenu",
      categoryId: personalCategory.id, date: "2026-08-27", realm: "personal", tags: [],
    });
    expect(await getTotalBalance("personal")).toBe(5_000);
    expect(await getTotalBalance("business")).toBe(0);
    await expect(createTransaction({
      pocketId: business.id, type: "income", amount: 5_000, description: "Erreur",
      categoryId: personalCategory.id, date: "2026-08-27", realm: "business", tags: [],
    })).rejects.toThrow(/catégorie/);
  });

  it("moves money atomically without changing the realm total", async () => {
    const source = await createPocket({ name: "Orange Money", description: "", realm: "personal" });
    const destination = await createPocket({ name: "Espèces", description: "", realm: "personal" });
    const db = await getDB();
    const category = (await db.getAllFromIndex("categories", "realm", "personal")).find((c) => c.type === "income")!;
    await createTransaction({
      pocketId: source.id, type: "income", amount: 20_000, description: "Solde initial",
      categoryId: category.id, date: "2026-08-27", realm: "personal", tags: [],
    });
    const transfer = await createTransfer({
      sourcePocketId: source.id, destinationPocketId: destination.id, amount: 7_500,
      description: "Retrait", date: "2026-08-27", realm: "personal",
    });
    expect(transfer.outgoing.transferId).toBe(transfer.incoming.transferId);
    expect((await getPocketBalance(source.id)).balance).toBe(12_500);
    expect((await getPocketBalance(destination.id)).balance).toBe(7_500);
    expect(await getTotalBalance("personal")).toBe(20_000);
  });

  it("records and reverses the pocket credit linked to a sale", async () => {
    const pocket = await createPocket({ name: "Caisse", description: "", realm: "business" });
    const sale = await createSale({
      product: "Beignets", quantity: 10, unitPrice: 100, pocketId: pocket.id,
      date: "2026-08-27", realm: "business", tags: [],
    });
    expect(sale.transactionId).toMatch(/^txn_/);
    expect((await getPocketBalance(pocket.id)).balance).toBe(1_000);
    await deleteSale(sale.id);
    expect((await getPocketBalance(pocket.id)).balance).toBe(0);
  });

  it("exports and restores every local store", async () => {
    const pocket = await createPocket({ name: "Moov Money", description: "pro", realm: "business" });
    const backup = await createBackup();
    const db = await getDB();
    await db.clear("pockets");
    expect(await db.count("pockets")).toBe(0);
    await restoreBackup(backup);
    expect((await db.get("pockets", pocket.id))?.name).toBe("Moov Money");
    expect((await getAllTransactions({ realm: "business" }))).toEqual([]);
  });

  it("validates backup envelopes before restore", () => {
    expect(() => parseBackup("not json")).toThrow(/JSON/);
    expect(() => parseBackup(JSON.stringify({ format: "other" }))).toThrow(/Tracklet/);
    expect(() => parseBackup(JSON.stringify({ format: "tracklet-backup", schemaVersion: 999, data: {} }))).toThrow(/récente/);
  });

  it("counts only active debts and enforces terminal transitions", async () => {
    const lent = await createDebt({ person: "Awa", amount: 10_000, description: "", direction: "lent", date: "2026-08-01", realm: "personal" });
    const borrowed = await createDebt({ person: "Issa", amount: 4_000, description: "", direction: "borrowed", date: "2026-08-01", realm: "personal" });
    expect(await getDebtSummary("personal")).toMatchObject({ totalLent: 10_000, totalBorrowed: 4_000, activeCount: 2 });
    await settleDebt(lent.id);
    expect(await getDebtSummary("personal")).toMatchObject({ totalLent: 0, totalBorrowed: 4_000, activeCount: 1 });
    await expect(writeOffDebt(lent.id)).rejects.toThrow(/active/);
    await writeOffDebt(borrowed.id);
    expect((await getDebtSummary("personal")).activeCount).toBe(0);
  });

  it("validates goal money and linked-pocket realm", async () => {
    const pocket = await createPocket({ name: "Épargne", description: "", realm: "personal" });
    const goal = await createGoal({ name: "Four", targetAmount: 100_000, savedAmount: 0, sourcePocketId: pocket.id, realm: "personal" });
    await updateGoal(goal.id, { savedAmount: 25_000 });
    await expect(updateGoal(goal.id, { savedAmount: -1 })).rejects.toThrow(/positif ou nul/);
    await expect(createGoal({ name: "Stock", targetAmount: 10_000, savedAmount: 0, sourcePocketId: pocket.id, realm: "business" })).rejects.toThrow(/espace/);
  });
});
