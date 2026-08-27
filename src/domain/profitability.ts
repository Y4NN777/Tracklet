import type { Sale, Transaction } from "../types";
import { startOfMonth, endOfMonth, startOfYear, endOfYear, format } from "date-fns";

export interface ProfitSummary {
  revenue: number;
  costs: number;
  profit: number;
  margin: number; // percentage, 0 if no revenue
  saleCount: number;
  period: string;
}

export interface ProfitReport {
  currentMonth: ProfitSummary;
  previousMonth: ProfitSummary;
  trend: "up" | "down" | "stable";
  trendPercentage: number;
}

/**
 * Compute revenue from sales for a date range.
 */
function computeRevenue(sales: Sale[], start: Date, end: Date): number {
  return sales
    .filter((s) => {
      const d = new Date(s.date);
      return d >= start && d <= end;
    })
    .reduce((sum, s) => sum + s.total, 0);
}

/**
 * Compute costs from business expense transactions for a date range.
 */
function computeCosts(txns: Transaction[], start: Date, end: Date): number {
  return txns
    .filter((t) => {
      if (t.type !== "expense") return false;
      const d = new Date(t.date);
      return d >= start && d <= end;
    })
    .reduce((sum, t) => sum + t.amount, 0);
}

function toSummary(
  revenue: number,
  costs: number,
  saleCount: number,
  period: string,
): ProfitSummary {
  return {
    revenue,
    costs,
    profit: revenue - costs,
    margin: revenue > 0 ? Math.round(((revenue - costs) / revenue) * 100) : 0,
    saleCount,
    period,
  };
}

/**
 * Full profitability report for the current month vs previous month.
 */
export function computeProfitReport(
  sales: Sale[],
  txns: Transaction[],
): ProfitReport {
  const now = new Date();
  const cmStart = startOfMonth(now);
  const cmEnd = endOfMonth(now);
  const cmPeriod = format(cmStart, "yyyy-MM-dd");

  // Previous month
  const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const pmStart = startOfMonth(prevMonth);
  const pmEnd = endOfMonth(prevMonth);
  const pmPeriod = format(pmStart, "yyyy-MM-dd");

  const cmSales = sales.filter((s) => {
    const d = new Date(s.date);
    return d >= cmStart && d <= cmEnd;
  });
  const pmSales = sales.filter((s) => {
    const d = new Date(s.date);
    return d >= pmStart && d <= pmEnd;
  });

  const cmRevenue = computeRevenue(sales, cmStart, cmEnd);
  const pmRevenue = computeRevenue(sales, pmStart, pmEnd);
  const cmCosts = computeCosts(txns, cmStart, cmEnd);
  const pmCosts = computeCosts(txns, pmStart, pmEnd);

  const currentMonth = toSummary(cmRevenue, cmCosts, cmSales.length, cmPeriod);
  const previousMonth = toSummary(pmRevenue, pmCosts, pmSales.length, pmPeriod);

  const prevProfit = previousMonth.profit;
  let trend: "up" | "down" | "stable" = "stable";
  let trendPercentage = 0;

  if (prevProfit !== 0) {
    const diff = currentMonth.profit - prevProfit;
    trendPercentage = Math.round((diff / Math.abs(prevProfit)) * 100);
    trend = trendPercentage > 5 ? "up" : trendPercentage < -5 ? "down" : "stable";
  } else if (currentMonth.profit > 0) {
    trend = "up";
    trendPercentage = 100;
  }

  return { currentMonth, previousMonth, trend, trendPercentage };
}

/**
 * Compute YTD profitability summary.
 */
export function computeYearToDate(
  sales: Sale[],
  txns: Transaction[],
): ProfitSummary {
  const now = new Date();
  const yStart = startOfYear(now);
  const yEnd = endOfYear(now);
  const ytdSales = sales.filter((s) => {
    const d = new Date(s.date);
    return d >= yStart && d <= yEnd;
  });
  const revenue = computeRevenue(sales, yStart, yEnd);
  const costs = computeCosts(txns, yStart, yEnd);
  return toSummary(revenue, costs, ytdSales.length, "ytd");
}
