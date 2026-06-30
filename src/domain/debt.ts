import * as debtRepo from "../db/repositories/debt";

export interface DebtSummary {
  totalLent: number;
  totalBorrowed: number;
  netReceivable: number;
  activeCount: number;
}

export async function getDebtSummary(realm?: string): Promise<DebtSummary> {
  const debts = await debtRepo.getAllDebts(realm);
  let totalLent = 0;
  let totalBorrowed = 0;
  let activeCount = 0;

  for (const d of debts) {
    if (d.status === "active") activeCount++;
    if (d.direction === "lent") totalLent += d.amount;
    else totalBorrowed += d.amount;
  }

  return {
    totalLent,
    totalBorrowed,
    netReceivable: totalLent - totalBorrowed,
    activeCount,
  };
}
