import { useState, useEffect } from "react";
import * as catRepo from "../db/repositories/category";
import type { Category } from "../types";

export function useCategories(type?: string) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = type
        ? await catRepo.getCategoriesByType(type)
        : await catRepo.getAllCategories();
      setCategories(data);
      setLoading(false);
    })();
  }, [type]);

  return { categories, loading };
}
