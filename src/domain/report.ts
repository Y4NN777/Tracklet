import type { Transaction, Category, Sale, Realm } from "../types";
import {
  startOfMonth,
  endOfMonth,
  format,
  subMonths,
  parseISO,
} from "date-fns";

export interface CategoryBreakdown {
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  total: number;
  count: number;
  percentage: number; // 0-100
}

export interface MonthlyTrend {
  month: string; // yyyy-MM
  label: string; // "Jan 2026"
  revenue: number;
  costs: number;
  profit: number;
}

export interface ReportFilters {
  startDate: string;
  endDate: string;
}

/**
 * Default filter: last 6 months to today.
 */
export function defaultDateRange(): ReportFilters {
  const now = new Date();
  const sixMonthsAgo = subMonths(now, 6);
  return {
    startDate: format(sixMonthsAgo, "yyyy-MM-dd"),
    endDate: format(now, "yyyy-MM-dd"),
  };
}

/**
 * Group expense transactions by category and compute totals.
 */
export function computeCategoryBreakdown(
  txns: Transaction[],
  categories: Category[],
): CategoryBreakdown[] {
  const catMap = new Map(categories.map((c) => [c.id, c]));
  const groups = new Map<string, { total: number; count: number }>();

  for (const t of txns) {
    if (t.type !== "expense") continue;
    const g = groups.get(t.categoryId) ?? { total: 0, count: 0 };
    g.total += t.amount;
    g.count += 1;
    groups.set(t.categoryId, g);
  }

  const totalExpense = Array.from(groups.values()).reduce(
    (s, g) => s + g.total,
    0,
  );

  return Array.from(groups.entries())
    .map(([categoryId, g]) => {
      const cat = catMap.get(categoryId);
      return {
        categoryId,
        categoryName: cat?.name ?? "Unknown",
        categoryColor: cat?.color ?? "#6B7280",
        total: g.total,
        count: g.count,
        percentage: totalExpense > 0 ? Math.round((g.total / totalExpense) * 100) : 0,
      };
    })
    .sort((a, b) => b.total - a.total);
}

/**
 * Compute monthly revenue/costs/profit trends for a date range.
 */
export function computeMonthlyTrends(
  txns: Transaction[],
  sales: Sale[],
  months: number,
  realm: Realm = "business",
): MonthlyTrend[] {
  const now = new Date();
  const trends: MonthlyTrend[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const date = subMonths(now, i);
    const mStart = startOfMonth(date);
    const mEnd = endOfMonth(date);
    const monthKey = format(date, "yyyy-MM");
    const label = format(date, "MMM yyyy");

    const revenue = realm === "business"
      ? sales
          .filter((sale) => {
            const date = parseISO(sale.date);
            return date >= mStart && date <= mEnd;
          })
          .reduce((sum, sale) => sum + sale.total, 0)
      : txns
          .filter((transaction) => {
            if (transaction.type !== "income") return false;
            const date = parseISO(transaction.date);
            return date >= mStart && date <= mEnd;
          })
          .reduce((sum, transaction) => sum + transaction.amount, 0);

    const costs = txns
      .filter((t) => {
        if (t.type !== "expense") return false;
        const d = parseISO(t.date);
        return d >= mStart && d <= mEnd;
      })
      .reduce((sum, t) => sum + t.amount, 0);

    trends.push({ month: monthKey, label, revenue, costs, profit: revenue - costs });
  }

  return trends;
}

/**
 * Generate CSV string from transactions.
 */
export function transactionsToCSV(txns: Transaction[]): string {
  const headers = ["Date", "Type", "Description", "Amount", "Category", "Pocket", "Tags"];
  const rows = txns.map((t) => [
    t.date,
    t.type,
    `"${t.description.replace(/"/g, '""')}"`,
    t.amount.toString(),
    t.categoryId,
    t.pocketId,
    `"${t.tags.join("; ")}"`,
  ]);

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

/**
 * Generate CSV string from sales.
 */
export function salesToCSV(sales: Sale[]): string {
  const headers = ["Date", "Product", "Quantity", "Unit Price", "Total", "Tags"];
  const rows = sales.map((s) => [
    s.date,
    `"${s.product.replace(/"/g, '""')}"`,
    s.quantity.toString(),
    s.unitPrice.toString(),
    s.total.toString(),
    `"${s.tags.join("; ")}"`,
  ]);

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

/**
 * Trigger a file download in the browser.
 */
export function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
