import { useState, useEffect, useCallback } from "react";
import * as saleRepo from "../db/repositories/sale";
import type { Sale } from "../types";

export function useSales(realm?: string) {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await saleRepo.getSales({ realm });
    setSales(data);
    setLoading(false);
  }, [realm]);

  useEffect(() => { refresh(); }, [refresh]);

  return { sales, loading, refresh };
}

export function useRecentSales(realm?: string, limit = 10) {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await saleRepo.getRecentSales(limit, realm);
      setSales(data);
      setLoading(false);
    })();
  }, [realm, limit]);

  return { sales, loading };
}
