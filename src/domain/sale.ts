import type { Sale, SaleAggregation } from "../types";
import {
  startOfDay,
  startOfWeek,
  startOfMonth,
  format,
} from "date-fns";

export function computeSaleTotal(quantity: number, unitPrice: number): number {
  return quantity * unitPrice;
}

export function aggregateByDay(sales: Sale[]): SaleAggregation[] {
  const groups = new Map<string, Sale[]>();
  for (const sale of sales) {
    const key = format(startOfDay(new Date(sale.date)), "yyyy-MM-dd");
    const group = groups.get(key) ?? [];
    group.push(sale);
    groups.set(key, group);
  }
  return toAggregations(groups);
}

export function aggregateByWeek(sales: Sale[]): SaleAggregation[] {
  const groups = new Map<string, Sale[]>();
  for (const sale of sales) {
    const key = format(startOfWeek(new Date(sale.date), { weekStartsOn: 1 }), "yyyy-MM-dd");
    const group = groups.get(key) ?? [];
    group.push(sale);
    groups.set(key, group);
  }
  return toAggregations(groups);
}

export function aggregateByMonth(sales: Sale[]): SaleAggregation[] {
  const groups = new Map<string, Sale[]>();
  for (const sale of sales) {
    const key = format(startOfMonth(new Date(sale.date)), "yyyy-MM-dd");
    const group = groups.get(key) ?? [];
    group.push(sale);
    groups.set(key, group);
  }
  return toAggregations(groups);
}

function toAggregations(
  groups: Map<string, Sale[]>,
): SaleAggregation[] {
  return Array.from(groups.entries())
    .map(([period, sales]) => ({
      period,
      totalSales: sales.reduce((sum, s) => sum + s.total, 0),
      saleCount: sales.length,
      sales,
    }))
    .sort((a, b) => b.period.localeCompare(a.period));
}
