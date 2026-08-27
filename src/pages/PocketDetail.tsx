import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import type { Realm, Transaction } from "../types";
import { getPocketBalance } from "../domain/pocket";
import { getRecentTransactions } from "../domain/transaction";
import { createTransaction } from "../db/repositories/transaction";
import { useCategories } from "../hooks/useCategories";
import { Modal } from "../components/Modal";
import { EmptyState } from "../components/EmptyState";
import { useToast } from "../components/Toast";
import type { PocketBalance } from "../domain/pocket";
import { format } from "date-fns";

interface PocketDetailProps {
  realm: Realm;
}

export function PocketDetail({ realm }: PocketDetailProps) {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<PocketBalance | null>(null);
  const [txns, setTxns] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const load = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [bal, recent] = await Promise.all([
        getPocketBalance(id, realm),
        getRecentTransactions(50, realm),
      ]);
      setData(bal);
      setTxns(recent.filter((transaction) => transaction.pocketId === id));
    } catch {
      setData(null);
      setTxns([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id, realm]);

  if (loading) return <div className="p-4 text-sm text-on-surface-muted">Chargement…</div>;
  if (!data) return <div className="p-4 text-sm text-danger">Poche introuvable</div>;

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/pockets"
          className="text-sm text-primary hover:underline"
        >
          ← Retour aux poches
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-on-surface">
              {data.pocket.name}
            </h1>
            {data.pocket.description && (
              <p className="text-sm text-on-surface-muted">
                {data.pocket.description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:bg-primary-light transition-colors"
          >
            + Ajouter une opération
          </button>
        </div>
      </div>

      {/* Balance card */}
      <div className="rounded-xl border border-border-light bg-white p-6">
        <p className="text-xs text-on-surface-muted">Solde actuel</p>
        <p className="mt-1 text-3xl font-bold text-on-surface">
          {data.balance.toLocaleString()} FCFA
        </p>
        <div className="mt-3 flex gap-6 text-sm">
          <span className="text-success">
            Entrées : +{data.income.toLocaleString()} FCFA
          </span>
          <span className="text-danger">
            Sorties : −{data.expense.toLocaleString()} FCFA
          </span>
        </div>
      </div>

      {/* Transactions */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-on-surface">
          Opérations
        </h2>
        {txns.length === 0 ? (
          <EmptyState
            title="Aucune opération"
            message="Ajoutez la première opération de cette poche."
            action={{
              label: "Ajouter une opération",
              onClick: () => setShowAdd(true),
            }}
          />
        ) : (
          <div className="space-y-1">
            {txns.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between rounded-lg border border-border-light px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-on-surface">
                    {t.description}
                  </p>
                  <p className="text-xs text-on-surface-muted">
                    {format(new Date(t.date), "MMM d, yyyy")}
                    {t.tags.length > 0 && ` · ${t.tags.join(", ")}`}
                  </p>
                </div>
                <span
                  className={`text-sm font-semibold ${
                    t.type === "income" ? "text-success" : "text-danger"
                  }`}
                >
                  {t.type === "income" ? "+" : "−"}
                  {t.amount.toLocaleString()} FCFA
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <AddTransactionModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        pocketId={id!}
        realm={realm}
        onDone={load}
      />
    </div>
  );
}

function AddTransactionModal({
  open,
  onClose,
  pocketId,
  realm,
  onDone,
}: {
  open: boolean;
  onClose: () => void;
  pocketId: string;
  realm: Realm;
  onDone: () => void;
}) {
  const { addToast } = useToast();
  const { categories } = useCategories(realm);
  const [form, setForm] = useState({
    type: "expense" as "income" | "expense",
    amount: "",
    description: "",
    categoryId: "",
    date: new Date().toISOString().slice(0, 10),
    tags: "",
  });
  const [saving, setSaving] = useState(false);

  const filteredCats = categories.filter((c) => c.type === form.type);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.amount || !form.description) return;
    setSaving(true);
    const catId = form.categoryId ||
      (form.type === "income" ? categories.find((c) => c.type === "income")?.id : categories.find((c) => c.type === "expense")?.id) ||
      "";
    try {
      await createTransaction({
        pocketId,
        type: form.type,
        amount: Number(form.amount),
        description: form.description.trim(),
        categoryId: catId,
        date: form.date,
        realm,
        tags: form.tags ? form.tags.split(",").map((tag) => tag.trim()).filter(Boolean) : [],
      });
      setForm({
        type: "expense",
        amount: "",
        description: "",
        categoryId: "",
        date: new Date().toISOString().slice(0, 10),
        tags: "",
      });
      onClose();
      addToast("success", "Opération ajoutée");
      await onDone();
    } catch (error) {
      addToast("error", error instanceof Error ? error.message : "Impossible d’ajouter l’opération");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Ajouter une opération">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          {(["expense", "income"] as const).map((t) => (
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
              {t === "income" ? "Entrée" : "Dépense"}
            </button>
          ))}
        </div>
        <div>
          <label className="block text-sm font-medium text-on-surface">Montant (FCFA)</label>
          <input
            type="number"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="mt-1 w-full rounded-lg border border-border-light px-3 py-2 text-sm outline-none focus:border-primary"
            placeholder="0"
            min="1"
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
            placeholder="À quoi correspond cette opération ?"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-on-surface">Catégorie</label>
          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className="mt-1 w-full rounded-lg border border-border-light px-3 py-2 text-sm outline-none focus:border-primary"
          >
            <option value="">Choisir une catégorie</option>
            {filteredCats.map((c) => (
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
        <div>
          <label className="block text-sm font-medium text-on-surface">Mots-clés (facultatif, séparés par des virgules)</label>
          <input
            type="text"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            className="mt-1 w-full rounded-lg border border-border-light px-3 py-2 text-sm outline-none focus:border-primary"
            placeholder="stock, semaine"
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border-light px-4 py-2 text-sm font-medium text-on-surface hover:bg-surface-alt transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={saving || !form.amount || !form.description}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:bg-primary-light disabled:opacity-50 transition-colors"
          >
            {saving ? "Enregistrement…" : "Ajouter"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
