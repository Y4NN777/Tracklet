import { useState, useEffect, useCallback } from "react";
import * as goalRepo from "../db/repositories/goal";
import type { Goal } from "../types";

export function useGoals(realm?: string) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await goalRepo.getGoals(realm);
    setGoals(data);
    setLoading(false);
  }, [realm]);

  useEffect(() => { refresh(); }, [refresh]);

  return { goals, loading, refresh };
}
