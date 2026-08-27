import type { CashPosition } from "../types";
import { getTotalBalance } from "./pocket";
import { getDebtSummary } from "./debt";

export async function getCashPosition(realm: string): Promise<CashPosition> {
  const [totalBalance, debtSummary] = await Promise.all([
    getTotalBalance(realm),
    getDebtSummary(realm),
  ]);

  return {
    totalBalance,
    committed: debtSummary.totalBorrowed,
    toReceive: debtSummary.totalLent,
    available: totalBalance - debtSummary.totalBorrowed + debtSummary.totalLent,
  };
}

export async function getAllCashPositions() {
  const [personal, business] = await Promise.all([
    getCashPosition("personal"),
    getCashPosition("business"),
  ]);
  return { personal, business };
}
