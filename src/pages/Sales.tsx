import { useState, useMemo } from "react";
import type { Realm, Sale, SaleAggregation } from "../types";
import { useSales } from "../hooks/useSales";
import { usePockets } from "../hooks/usePockets";
import { createSale, deleteSale, searchSales } from "../db/repositories/sale";
import { aggregateByDay, aggregateByWeek, aggregateByMonth } from "../domain/sale";
import { Modal } from "../components/Modal";
import { EmptyState } from "../components/EmptyState";
import { useToast } from "../components/Toast";
import { format } from "date-fns";

type AggMode = "day" | "week" | "month";

interface SalesProps {
  realm: Realm;
}

export function Sales({ realm }: SalesProps) {
  const { sales, loading, refresh } = useSales(realm);
  const { pockets } = usePockets(realm);
  const { addToast } = useToast();
  const [showCreate, setShowCreate] = useState(false);
  const [aggMode, setAggMode] = useState<AggMode>("day");
  const [searchQuery, setSearchQuery] = useState("");
  const [form, setForm] = useState({
    product: "",
    quantity: "1",
    unitPrice: "",
    pocketId: "",
    date: new Date().toISOString().slice(0, 10),
    tags: "",
  });
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return sales;
    return sales.filter((s) => {
      const q = searchQuery.toLowerCase();
      return (
        s.product.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [sales, searchQuery]);

  const aggregations: SaleAggregation[] = useMemo(() => {
    if (aggMode === "day") return aggregateByDay(filtered);
    if (aggMode === "week") return aggregateByWeek(filtered);
    return aggregateByMonth(filtered);
  }, [filtered, aggMode]);

  const resetForm = () => {
    setForm({
      product: "",
      quantity: "1",
      unitPrice: "",
      pocketId: "",
      date: new Date().toISOString().slice(0, 10),
      tags: "",
    });
  };

  const computedTotal = Number(form.quantity) * Number(form.unitPrice) || 0;

  const handleCreate = async () => {
    if (!form.product.trim() || !form.unitPrice || !form.pocketId) return;
    setSaving(true);
    await createSale({
      product: form.product.trim(),
      quantity: Number(form.quantity) || 1,
      unitPrice: Number(form.unitPrice),
      pocketId: form.pocketId,
      date: form.date,
      realm,
      tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
    });
    setSaving(false);
    setShowCreate(false);
    resetForm();
    addToast("success", `Sale recorded: ${form.product.trim()}`);
    refresh();
  };

  const handleDelete = async (saleId: string, product: string) => {
    await deleteSale(saleId);
    addToast("info", `Sale deleted: ${product}`);
    refresh();
  };

  if (!loading && sales.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-on-surface">Sales</h1>
        <EmptyState
          title="No sales yet"
          message="Log your first sale to start tracking your revenue."
          action={{ label: "Record Sale", onClick: () => setShowCreate(true) }}
        />
        <SaleModal
          open={showCreate}
          onClose={() => { setShowCreate(false); resetForm(); }}
          form={form}
          setForm={setForm}
          computedTotal={computedTotal}
          saving={saving}
          pockets={pockets}
          onSubmit={handleCreate}
        />
      </div>
    );
  }

  const totalRevenue = sales.reduce((s, x) => s + x.total, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-on-surface">Sales</h1>
          <p className="text-sm text-on-surface-muted">
            Total revenue: {totalRevenue.toLocaleString()} FCFA
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:bg-primary-light transition-colors"
        >
          + Record Sale
        </button>
      </div>

      {/* Search + aggregation toggle */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search sales..."
          className="w-full rounded-lg border border-border-light px-3 py-2 text-sm outline-none focus:border-primary sm:max-w-xs"
        />
        <div className="flex gap-1 rounded-lg border border-border-light p-0.5">
          {(["day", "week", "month"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setAggMode(mode)}
              className={`rounded-md px-3 py-1 text-xs font-medium capitalize transition-colors ${
                aggMode === mode
                  ? "bg-primary text-on-primary"
                  : "text-on-surface-muted hover:text-on-surface"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Aggregations */}
      <div className="space-y-3">
        {aggregations.length === 0 ? (
          <p className="text-sm text-on-surface-muted">No sales found.</p>
        ) : (
          aggregations.map((agg) => (
            <div
              key={agg.period}
              className="rounded-xl border border-border-light bg-white"
            >
              <div className="flex items-center justify-between border-b border-border-light px-4 py-3">
                <span className="text-sm font-semibold text-on-surface">
                  {format(new Date(agg.period), "MMM d, yyyy")}
                  {aggMode === "week" && " (week)"}
                  {aggMode === "month" && " (month)"}
                </span>
                <span className="text-sm font-bold text-success">
                  +{agg.totalSales.toLocaleString()} FCFA
                </span>
              </div>
              <div className="divide-y divide-border-light">
                {agg.sales.map((sale) => (
                  <div
                    key={sale.id}
                    className="flex items-center justify-between px-4 py-2.5"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-container text-xs font-bold text-primary">
                        {sale.quantity}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-on-surface">
                          {sale.product}
                        </p>
                        <p className="text-xs text-on-surface-muted">
                          {sale.quantity} x {sale.unitPrice.toLocaleString()} FCFA
                          {sale.pocketId &&
                            ` · ${pockets.find((p) => p.id === sale.pocketId)?.name ?? ""}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-success">
                        +{sale.total.toLocaleString()} FCFA
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDelete(sale.id, sale.product)}
                        className="rounded-md px-1.5 py-0.5 text-xs text-danger opacity-0 hover:opacity-100 transition-opacity"
                        aria-label="Delete sale"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <SaleModal
        open={showCreate}
        onClose={() => { setShowCreate(false); resetForm(); }}
        form={form}
        setForm={setForm}
        computedTotal={computedTotal}
        saving={saving}
        pockets={pockets}
        onSubmit={handleCreate}
      />
    </div>
  );
}

function SaleModal({
  open,
  onClose,
  form,
  setForm,
  computedTotal,
  saving,
  pockets,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  form: {
    product: string;
    quantity: string;
    unitPrice: string;
    pocketId: string;
    date: string;
    tags: string;
  };
  setForm: (f: typeof form) => void;
  computedTotal: number;
  saving: boolean;
  pockets: { id: string; name: string }[];
  onSubmit: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose} title="Record Sale">
      <form
        onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
        className="space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-on-surface">Product / Service</label>
          <input
            type="text"
            value={form.product}
            onChange={(e) => setForm({ ...form, product: e.target.value })}
            className="mt-1 w-full rounded-lg border border-border-light px-3 py-2 text-sm outline-none focus:border-primary"
            placeholder="e.g. Cakes, pastries"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-on-surface">Quantity</label>
            <input
              type="number"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              className="mt-1 w-full rounded-lg border border-border-light px-3 py-2 text-sm outline-none focus:border-primary"
              min="1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface">Unit Price (FCFA)</label>
            <input
              type="number"
              value={form.unitPrice}
              onChange={(e) => setForm({ ...form, unitPrice: e.target.value })}
              className="mt-1 w-full rounded-lg border border-border-light px-3 py-2 text-sm outline-none focus:border-primary"
              placeholder="0"
              min="0"
              required
            />
          </div>
        </div>
        <div className="rounded-lg bg-surface-alt px-3 py-2 text-sm">
          <span className="text-on-surface-muted">Total: </span>
          <span className="font-bold text-success">
            +{computedTotal.toLocaleString()} FCFA
          </span>
        </div>
        <div>
          <label className="block text-sm font-medium text-on-surface">Receiving Pocket</label>
          <select
            value={form.pocketId}
            onChange={(e) => setForm({ ...form, pocketId: e.target.value })}
            className="mt-1 w-full rounded-lg border border-border-light px-3 py-2 text-sm outline-none focus:border-primary"
            required
          >
            <option value="">Select a pocket</option>
            {pockets.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-on-surface">Date</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="mt-1 w-full rounded-lg border border-border-light px-3 py-2 text-sm outline-none focus:border-primary"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-on-surface">Tags (optional)</label>
          <input
            type="text"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            className="mt-1 w-full rounded-lg border border-border-light px-3 py-2 text-sm outline-none focus:border-primary"
            placeholder="bakery, wholesale"
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border-light px-4 py-2 text-sm font-medium text-on-surface hover:bg-surface-alt transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || !form.product || !form.unitPrice || !form.pocketId}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:bg-primary-light disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving..." : "Record Sale"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
