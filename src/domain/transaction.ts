import * as txnRepo from "../db/repositories/transaction";
import type { Transaction } from "../types";

export interface TransactionSummary {
  totalIncome: number;
  totalExpense: number;
  count: number;
}

export async function getRecentTransactions(
  limit = 10,
  realm?: string,
): Promise<Transaction[]> {
  return txnRepo.getAllTransactions({ realm, limit });
}

export async function getTransactionSummary(
  realm?: string,
  startDate?: string,
  endDate?: string,
): Promise<TransactionSummary> {
  const txns = await txnRepo.getAllTransactions({ realm, startDate, endDate });
  let totalIncome = 0;
  let totalExpense = 0;

  for (const t of txns) {
    if (t.type === "income") totalIncome += t.amount;
    else if (t.type === "expense") totalExpense += t.amount;
  }

  return { totalIncome, totalExpense, count: txns.length };
}
