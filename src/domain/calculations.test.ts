import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Category, Sale, Transaction } from "../types";
import { computeGoalProgress, estimateMonthsRemaining } from "./goal";
import { computeProfitReport } from "./profitability";
import { computeCategoryBreakdown, computeMonthlyTrends, salesToCSV, transactionsToCSV } from "./report";
import { aggregateByMonth, computeSaleTotal } from "./sale";
import { aggregateByDay, aggregateByWeek } from "./sale";
import { generateInsights } from "./insight";
import { generateTips, markTipShown } from "./agent";

const baseTransaction: Transaction = {
  id: "txn_1", pocketId: "pocket_1", type: "expense", amount: 2_000,
  description: "Farine", categoryId: "cat_material", date: "2026-08-10",
  realm: "business", tags: ["stock"], createdAt: "2026-08-10T08:00:00.000Z",
};
const baseSale: Sale = {
  id: "sale_1", product: "Gâteau", quantity: 2, unitPrice: 5_000, total: 10_000,
  pocketId: "pocket_1", date: "2026-08-12", realm: "business", tags: [],
  createdAt: "2026-08-12T08:00:00.000Z",
};

describe("financial calculations", () => {
  beforeEach(() => vi.useFakeTimers().setSystemTime(new Date("2026-08-27T12:00:00Z")));
  afterEach(() => vi.useRealTimers());

  it("computes goal boundaries", () => {
    expect(computeGoalProgress({ savedAmount: 75_000, targetAmount: 100_000 })).toMatchObject({
      remaining: 25_000, percentage: 75, isCompleted: false,
    });
    expect(computeGoalProgress({ savedAmount: 120_000, targetAmount: 100_000 })).toMatchObject({
      remaining: 0, percentage: 100, isCompleted: true,
    });
    expect(estimateMonthsRemaining({ savedAmount: 40_000, targetAmount: 100_000 }, 20_000)).toBe(3);
    expect(estimateMonthsRemaining({ savedAmount: 40_000, targetAmount: 100_000 }, 0)).toBeNull();
  });

  it("computes current profitability and month trend", () => {
    const report = computeProfitReport([baseSale], [baseTransaction]);
    expect(report.currentMonth).toMatchObject({ revenue: 10_000, costs: 2_000, profit: 8_000, margin: 80 });
    expect(report.trend).toBe("up");
  });

  it("groups expenses and calculates realm-appropriate monthly revenue", () => {
    const categories: Category[] = [{
      id: "cat_material", name: "Matières", icon: "📦", color: "#f00", type: "expense", realm: "business",
    }];
    expect(computeCategoryBreakdown([baseTransaction], categories)[0]).toMatchObject({ total: 2_000, percentage: 100 });
    expect(computeMonthlyTrends([baseTransaction], [baseSale], 1, "business")[0]).toMatchObject({
      revenue: 10_000, costs: 2_000, profit: 8_000,
    });
    const personalIncome = { ...baseTransaction, id: "txn_income", type: "income" as const, amount: 15_000, realm: "personal" as const };
    expect(computeMonthlyTrends([personalIncome], [], 1, "personal")[0].revenue).toBe(15_000);
  });

  it("aggregates sales and escapes CSV fields", () => {
    expect(computeSaleTotal(3, 2_500)).toBe(7_500);
    expect(aggregateByMonth([baseSale])[0]).toMatchObject({ totalSales: 10_000, saleCount: 1 });
    expect(aggregateByDay([baseSale])[0].period).toBe("2026-08-12");
    expect(aggregateByWeek([baseSale])[0].saleCount).toBe(1);
    expect(salesToCSV([{ ...baseSale, product: 'Gâteau "choco"' }])).toContain('"Gâteau ""choco"""');
    expect(transactionsToCSV([{ ...baseTransaction, description: 'Achat, "farine"' }])).toContain('"Achat, ""farine"""');
  });

  it("generates safe local insights and tips", () => {
    const pocket = { id: "pocket_1", name: "Caisse", description: "", realm: "business" as const, createdAt: "", updatedAt: "", archived: false };
    const fundedPocket = { ...pocket, id: "pocket_2", name: "Orange Money" };
    const legacyTransfer = { ...baseTransaction, type: "transfer" as const };
    const income = { ...baseTransaction, id: "txn_income", pocketId: fundedPocket.id, type: "income" as const };
    expect(generateInsights([legacyTransfer, income], [pocket, fundedPocket], [])).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: "empty-pockets" }),
    ]));
    const debts = [1, 2, 3].map((amount) => ({
      id: `debt_${amount}`, person: "Client", amount, description: "", direction: "lent" as const,
      status: "active" as const, date: "2026-08-01", settledAt: null, realm: "business" as const,
      createdAt: "", updatedAt: "",
    }));
    expect(generateTips({ page: "debts", debts })[0]).toMatchObject({ id: "many-debts-tip" });
    expect(() => markTipShown("test-tip")).not.toThrow();
  });
});
