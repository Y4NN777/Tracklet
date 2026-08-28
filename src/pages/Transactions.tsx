import { useState } from "react";
import type { Realm } from "../types";
import { useTransactions } from "../hooks/useTransactions";
import { usePockets } from "../hooks/usePockets";
import { useCategories } from "../hooks/useCategories";
import { createTransaction, createTransfer } from "../db/repositories/transaction";
import { Modal } from "../components/Modal";
import { EmptyState } from "../components/EmptyState";
import { useToast } from "../components/Toast";
import { format } from "date-fns";
import { ArrowDownLeft, ArrowLeftRight, ArrowUpRight, Plus } from "lucide-react";

interface TransactionsProps {
  realm: Realm;
}

export function Transactions({ realm }: TransactionsProps) {
  const { transactions, loading, refresh } = useTransactions(realm);
  const { pockets } = usePockets(realm);
  const { categories } = useCategories(realm);
  const { addToast } = useToast();
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState<string>("all");

  const [form, setForm] = useState({
    type: "expense" as "income" | "expense" | "transfer",
    amount: "",
    description: "",
    categoryId: "",
    pocketId: "",
    destinationPocketId: "",
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
    try {
      const tags = form.tags ? form.tags.split(",").map((tag) => tag.trim()).filter(Boolean) : [];
      if (form.type === "transfer") {
        if (!form.destinationPocketId) throw new Error("Select a destination pocket");
        await createTransfer({
          sourcePocketId: form.pocketId,
          destinationPocketId: form.destinationPocketId,
          amount: Number(form.amount),
          description: form.description,
          date: form.date,
          realm,
          tags,
        });
      } else {
        await createTransaction({
          pocketId: form.pocketId,
          type: form.type,
          amount: Number(form.amount),
          description: form.description,
          categoryId: form.categoryId,
          date: form.date,
          realm,
          tags,
        });
      }
      setForm({
        type: "expense",
        amount: "",
        description: "",
        categoryId: "",
        pocketId: "",
        destinationPocketId: "",
        date: new Date().toISOString().slice(0, 10),
        tags: "",
      });
      setShowAdd(false);
      addToast("success", form.type === "transfer" ? "Transfert effectué" : "Opération enregistrée");
      await refresh();
    } catch (error) {
      addToast("error", error instanceof Error ? error.message : "Impossible d’enregistrer l’opération");
    } finally {
      setSaving(false);
    }
  };

  const catMap = new Map(categories.map((c) => [c.id, c]));

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <h1 className="text-3xl font-bold tracking-[-0.05em] text-on-surface sm:text-4xl">Opérations</h1>
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="rounded-2xl bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:bg-primary-light transition-colors"
        >
          <Plus aria-hidden="true" className="mr-1 inline h-4 w-4" />
          Nouvelle opération
        </button>
      </div>

      {/* Filter tabs */}
      <div className="scrollbar-hidden flex gap-2 overflow-x-auto pb-1" aria-label="Filtrer les opérations">
        {(["all", "expense", "income", "transfer"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-2xl px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
              filter === f
                ? "bg-primary-container text-primary"
                : "text-on-surface-muted hover:bg-surface-alt"
            }`}
          >
            {{ all: "Toutes", expense: "Dépenses", income: "Entrées", transfer: "Transferts" }[f]}
          </button>
        ))}
      </div>

      {/* List */}
      {!loading && filtered.length === 0 ? (
        <EmptyState
          title="Aucune opération"
          message="Ajoutez votre première entrée ou dépense."
          action={{ label: "Nouvelle opération", onClick: () => setShowAdd(true) }}
        />
      ) : (
        <div className="space-y-1">
          {filtered.map((txn) => {
            const cat = catMap.get(txn.categoryId);
            const pocket = pockets.find((p) => p.id === txn.pocketId);
            const TransactionIcon = txn.type === "income" ? ArrowDownLeft : txn.type === "expense" ? ArrowUpRight : ArrowLeftRight;
            return (
              <div
                key={txn.id}
                className="flex items-center justify-between rounded-2xl border border-border-light bg-card px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                    txn.type === "income" ? "bg-success-container text-success" : txn.type === "expense" ? "bg-danger-container text-danger" : "bg-info-container text-info"
                  }`}>
                    <TransactionIcon aria-hidden="true" className="h-5 w-5" />
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
                  {txn.type === "income" || (txn.type === "transfer" && txn.transferDirection === "in") ? "+" : "−"}
                  {txn.amount.toLocaleString()} FCFA
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Add modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Nouvelle opération">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            {(["expense", "income", "transfer"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setForm({ ...form, type: t, categoryId: "" })}
                className={`flex-1 rounded-2xl px-3 py-2 text-sm font-medium capitalize transition-colors ${
                  form.type === t
                    ? "bg-primary text-on-primary"
                    : "border border-border-light text-on-surface-muted hover:bg-surface-alt"
                }`}
              >
                {{ expense: "Dépense", income: "Entrée", transfer: "Transfert" }[t]}
              </button>
            ))}
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface">Poche source</label>
            <select
              value={form.pocketId}
              onChange={(e) => setForm({ ...form, pocketId: e.target.value })}
              className="mt-1 w-full rounded-2xl border border-border-light px-3 py-2 text-sm outline-none focus:border-primary"
              required
            >
              <option value="">Choisir une poche</option>
              {pockets.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          {form.type === "transfer" && (
            <div>
              <label className="block text-sm font-medium text-on-surface">Poche de destination</label>
              <select
                value={form.destinationPocketId}
                onChange={(e) => setForm({ ...form, destinationPocketId: e.target.value })}
                className="mt-1 w-full rounded-2xl border border-border-light px-3 py-2 text-sm outline-none focus:border-primary"
                required
              >
                <option value="">Choisir une destination</option>
                {pockets.filter((p) => p.id !== form.pocketId).map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-on-surface">Montant (FCFA)</label>
            <input
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="mt-1 w-full rounded-2xl border border-border-light px-3 py-2 text-sm outline-none focus:border-primary"
              placeholder="0"
              min="1"
              required
            />
          </div>
          {form.type !== "transfer" && <div>
            <label className="block text-sm font-medium text-on-surface">Description</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="mt-1 w-full rounded-2xl border border-border-light px-3 py-2 text-sm outline-none focus:border-primary"
              placeholder="À quoi correspond cette opération ?"
              required
            />
          </div>}
          <div>
            <label className="block text-sm font-medium text-on-surface">Catégorie</label>
            <select
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="mt-1 w-full rounded-2xl border border-border-light px-3 py-2 text-sm outline-none focus:border-primary"
            >
              <option value="">Choisir une catégorie</option>
              {categories
                .filter((c) => c.type === form.type || form.type === "transfer")
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
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
              className="mt-1 w-full rounded-2xl border border-border-light px-3 py-2 text-sm outline-none focus:border-primary"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="rounded-2xl border border-border-light px-4 py-2 text-sm font-medium text-on-surface hover:bg-surface-alt transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving || !form.amount || !form.description || !form.pocketId || (form.type === "transfer" && !form.destinationPocketId)}
              className="rounded-2xl bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:bg-primary-light disabled:opacity-50 transition-colors"
            >
              {saving ? "Enregistrement…" : "Enregistrer"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
