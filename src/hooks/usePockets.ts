import { useState, useEffect, useCallback } from "react";
import * as pocketRepo from "../db/repositories/pocket";
import { getPocketBalance, getAllBalances, getTotalBalance } from "../domain/pocket";
import type { Pocket } from "../types";
import type { PocketBalance } from "../domain/pocket";

export function usePockets(realm?: string) {
  const [pockets, setPockets] = useState<Pocket[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await pocketRepo.getActivePockets(realm);
    setPockets(data);
    setLoading(false);
  }, [realm]);

  useEffect(() => { refresh(); }, [refresh]);

  return { pockets, loading, refresh };
}

export function usePocketBalances(realm?: string) {
  const [balances, setBalances] = useState<PocketBalance[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const [balData, totalData] = await Promise.all([
      getAllBalances(realm),
      getTotalBalance(realm),
    ]);
    setBalances(balData);
    setTotal(totalData);
    setLoading(false);
  }, [realm]);

  useEffect(() => { refresh(); }, [refresh]);

  return { balances, total, loading, refresh };
}

export function usePocket(id: string | undefined) {
  const [pocket, setPocket] = useState<Pocket | null>(null);
  const [balance, setBalance] = useState<PocketBalance | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    (async () => {
      const bal = await getPocketBalance(id);
      setPocket(bal.pocket);
      setBalance(bal);
      setLoading(false);
    })();
  }, [id]);

  return { pocket, balance, loading };
}
