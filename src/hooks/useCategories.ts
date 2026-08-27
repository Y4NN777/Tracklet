import { useState, useEffect } from "react";
import * as catRepo from "../db/repositories/category";
import type { Category } from "../types";
import type { Realm, TransactionType } from "../types";

export function useCategories(realm: Realm, type?: Exclude<TransactionType, "transfer">) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await catRepo.getCategoriesByRealm(realm);
      const filtered = type ? data.filter((category) => category.type === type) : data;
      setCategories(filtered);
      setLoading(false);
    })();
  }, [realm, type]);

  return { categories, loading };
}
