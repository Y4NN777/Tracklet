import { useState, useEffect, useCallback } from "react";
import * as debtRepo from "../db/repositories/debt";
import { getDebtSummary } from "../domain/debt";
import type { Debt } from "../types";
import type { DebtSummary } from "../domain/debt";

export function useDebts(realm?: string) {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await debtRepo.getAllDebts(realm);
    setDebts(data);
    setLoading(false);
  }, [realm]);

  useEffect(() => { refresh(); }, [refresh]);

  return { debts, loading, refresh };
}

export function useDebtSummary(realm?: string) {
  const [summary, setSummary] = useState<DebtSummary>({
    totalLent: 0,
    totalBorrowed: 0,
    netReceivable: 0,
    activeCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await getDebtSummary(realm);
      setSummary(data);
      setLoading(false);
    })();
  }, [realm]);

  return { summary, loading };
}
