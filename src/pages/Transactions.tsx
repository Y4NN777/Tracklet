import { useState } from "react";
import type { Realm } from "../types";
import { useTransactions } from "../hooks/useTransactions";
import { usePockets } from "../hooks/usePockets";
import { useCategories } from "../hooks/useCategories";
import { createTransaction } from "../db/repositories/transaction";
import { Modal } from "../components/Modal";
import { EmptyState } from "../components/EmptyState";
import { format } from "date-fns";

interface TransactionsProps {
  realm: Realm;
}

export function Transactions({ realm }: TransactionsProps) {
  const { transactions, loading, refresh } = useTransactions(realm);
  const { pockets } = usePockets(realm);
  const { categories } = useCategories();
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState<string>("all");

  const [form, setForm] = useState({
    type: "expense" as "income" | "expense" | "transfer",
    amount: "",
    description: "",
    categoryId: "",
    pocketId: "",
    date: new Date().toISOString().slice(0, 10),
    tags: "",
  });
  const [saving, setSaving] = useState(false);

  const filtered = filter === "all"
    ? transactions
    : transactions.filter((t) => t.type === filter);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.amount || !form.description || !form.pocketId) return;
    setSaving(true);
    await createTransaction({
      pocketId: form.pocketId,
      type: form.type,
      amount: Number(form.amount),
      description: form.description.trim(),
      categoryId: form.categoryId,
      date: form.date,
      realm,
      tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
    });
    setSaving(false);
    setForm({
      type: "expense",
      amount: "",
      description: "",
      categoryId: "",
      pocketId: "",
      date: new Date().toISOString().slice(0, 10),
      tags: "",
    });
    setShowAdd(false);
    refresh();
  };

  const catMap = new Map(categories.map((c) => [c.id, c]));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-on-surface">Transactions</h1>
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:bg-primary-light transition-colors"
        >
          + New Transaction
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {["all", "expense", "income", "transfer"].map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
              filter === f
                ? "bg-primary-container text-primary"
                : "text-on-surface-muted hover:bg-surface-alt"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      {!loading && filtered.length === 0 ? (
        <EmptyState
          title="No transactions"
          message="Add your first transaction to start tracking."
          action={{ label: "New Transaction", onClick: () => setShowAdd(true) }}
        />
      ) : (
        <div className="space-y-1">
          {filtered.map((txn) => {
            const cat = catMap.get(txn.categoryId);
            const pocket = pockets.find((p) => p.id === txn.pocketId);
            return (
              <div
                key={txn.id}
                className="flex items-center justify-between rounded-lg border border-border-light bg-white px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-alt text-sm">
                    {cat?.icon ?? "💳"}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-on-surface">
                      {txn.description}
                    </p>
                    <p className="text-xs text-on-surface-muted">
                      {format(new Date(txn.date), "MMM d, yyyy")}
                      {pocket && ` · ${pocket.name}`}
                      {cat && ` · ${cat.name}`}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-sm font-semibold ${
                    txn.type === "income"
                      ? "text-success"
                      : txn.type === "expense"
                        ? "text-danger"
                        : "text-info"
                  }`}
                >
                  {txn.type === "income" ? "+" : txn.type === "expense" ? "−" : "↔"}
                  {txn.amount.toLocaleString()} FCFA
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Add modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="New Transaction">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            {(["expense", "income", "transfer"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setForm({ ...form, type: t, categoryId: "" })}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium capitalize transition-colors ${
                  form.type === t
                    ? "bg-primary text-on-primary"
                    : "border border-border-light text-on-surface-muted hover:bg-surface-alt"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface">Pocket</label>
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
            <label className="block text-sm font-medium text-on-surface">Amount (FCFA)</label>
            <input
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="mt-1 w-full rounded-lg border border-border-light px-3 py-2 text-sm outline-none focus:border-primary"
              placeholder="0"
              min="0"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface">Description</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="mt-1 w-full rounded-lg border border-border-light px-3 py-2 text-sm outline-none focus:border-primary"
              placeholder="What was this for?"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface">Category</label>
            <select
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="mt-1 w-full rounded-lg border border-border-light px-3 py-2 text-sm outline-none focus:border-primary"
            >
              <option value="">Select a category</option>
              {categories
                .filter((c) => c.type === form.type || form.type === "transfer")
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {c.name}
                  </option>
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
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="rounded-lg border border-border-light px-4 py-2 text-sm font-medium text-on-surface hover:bg-surface-alt transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !form.amount || !form.description || !form.pocketId}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:bg-primary-light disabled:opacity-50 transition-colors"
            >
              {saving ? "Adding..." : "Add"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
