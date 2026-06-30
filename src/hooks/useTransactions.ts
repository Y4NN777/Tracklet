import { useState, useEffect, useCallback } from "react";
import * as txnRepo from "../db/repositories/transaction";
import { getRecentTransactions, getTransactionSummary } from "../domain/transaction";
import type { Transaction } from "../types";
import type { TransactionSummary } from "../domain/transaction";

export function useTransactions(realm?: string) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await getRecentTransactions(50, realm);
    setTransactions(data);
    setLoading(false);
  }, [realm]);

  useEffect(() => { refresh(); }, [refresh]);

  return { transactions, loading, refresh };
}

export function useTransactionSummary(realm?: string) {
  const [summary, setSummary] = useState<TransactionSummary>({
    totalIncome: 0,
    totalExpense: 0,
    count: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await getTransactionSummary(realm);
      setSummary(data);
      setLoading(false);
    })();
  }, [realm]);

  return { summary, loading };
}
