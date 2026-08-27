import { useState } from "react";
import type { Debt, Realm } from "../types";
import { useDebts } from "../hooks/useDebts";
import { createDebt, settleDebt, writeOffDebt, deleteDebt } from "../db/repositories/debt";
import { Modal } from "../components/Modal";
import { EmptyState } from "../components/EmptyState";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { useToast } from "../components/Toast";
import { format } from "date-fns";

interface DebtsProps {
  realm: Realm;
}

export function Debts({ realm }: DebtsProps) {
  const { debts, loading, refresh } = useDebts(realm);
  const { addToast } = useToast();
  const [showCreate, setShowCreate] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const [form, setForm] = useState({
    person: "",
    amount: "",
    description: "",
    direction: "lent" as "lent" | "borrowed",
    date: new Date().toISOString().slice(0, 10),
  });
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filtered = filter === "all"
    ? debts
    : debts.filter((d) => d.status === filter);

  const totalLent = debts
    .filter((d) => d.direction === "lent" && d.status === "active")
    .reduce((s, d) => s + d.amount, 0);
  const totalBorrowed = debts
    .filter((d) => d.direction === "borrowed" && d.status === "active")
    .reduce((s, d) => s + d.amount, 0);

  const handleCreate = async () => {
    if (!form.person.trim() || !form.amount) return;
    setSaving(true);
    try {
      await createDebt({
        person: form.person.trim(),
        amount: Number(form.amount),
        description: form.description.trim(),
        direction: form.direction,
        date: form.date,
        realm,
      });
      setForm({
        person: "",
        amount: "",
        description: "",
        direction: "lent",
        date: new Date().toISOString().slice(0, 10),
      });
      setShowCreate(false);
      addToast("success", `Dette enregistrée avec ${form.person}`);
      await refresh();
    } catch (error) {
      addToast("error", error instanceof Error ? error.message : "Impossible d’enregistrer la dette");
    } finally {
      setSaving(false);
    }
  };

  const handleSettle = async (id: string) => {
    try {
      await settleDebt(id);
      addToast("success", "Dette marquée comme réglée");
      await refresh();
    } catch (error) {
      addToast("error", error instanceof Error ? error.message : "Impossible de modifier la dette");
    }
  };

  const handleWriteOff = async (id: string) => {
    try {
      await writeOffDebt(id);
      addToast("info", "Dette classée sans suite");
      await refresh();
    } catch (error) {
      addToast("error", error instanceof Error ? error.message : "Impossible de modifier la dette");
    }
  };

  const handleDelete = async (id: string) => {
    setConfirmDelete(null);
    try {
      await deleteDebt(id);
      addToast("info", "Dette supprimée");
      await refresh();
    } catch (error) {
      addToast("error", error instanceof Error ? error.message : "Impossible de supprimer la dette");
    }
  };

  if (!loading && debts.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-on-surface">Dettes et créances</h1>
        <EmptyState
          title="Aucune dette enregistrée"
          message="Notez l’argent prêté ou emprunté."
          action={{ label: "Ajouter une dette", onClick: () => setShowCreate(true) }}
        />
        <CreateModal
          open={showCreate}
          onClose={() => setShowCreate(false)}
          form={form}
          setForm={setForm}
          saving={saving}
          onSubmit={handleCreate}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-on-surface">Dettes et créances</h1>
          <p className="text-sm text-on-surface-muted">
            Prêté : {totalLent.toLocaleString()} FCFA · Emprunté :{" "}
            {totalBorrowed.toLocaleString()} FCFA
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:bg-primary-light transition-colors"
        >
          + Ajouter
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(["all", "active", "settled", "written-off"] as const).map((f) => (
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
            {{ all: "Toutes", active: "Actives", settled: "Réglées", "written-off": "Sans suite" }[f]}
          </button>
        ))}
      </div>

      {/* Debt list */}
      <div className="space-y-2">
        {filtered.map((debt) => (
          <DebtCard
            key={debt.id}
            debt={debt}
            onSettle={() => handleSettle(debt.id)}
            onWriteOff={() => handleWriteOff(debt.id)}
            onDelete={() => setConfirmDelete(debt.id)}
          />
        ))}
      </div>

      <CreateModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        form={form}
        setForm={setForm}
        saving={saving}
        onSubmit={handleCreate}
      />

      <ConfirmDialog
        open={confirmDelete !== null}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => handleDelete(confirmDelete!)}
        title="Supprimer cette dette ?"
        message="Cette action est définitive."
        confirmLabel="Supprimer"
        variant="danger"
      />
    </div>
  );
}

function DebtCard({
  debt,
  onSettle,
  onWriteOff,
  onDelete,
}: {
  debt: Debt;
  onSettle: () => void;
  onWriteOff: () => void;
  onDelete: () => void;
}) {
  const statusColors: Record<string, string> = {
    active: "bg-amber-100 text-amber-800",
    settled: "bg-green-100 text-green-800",
    "written-off": "bg-gray-100 text-gray-500",
  };

  return (
    <div className="rounded-xl border border-border-light bg-white p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <span className="mt-1 text-lg">
            {debt.direction === "lent" ? "📤" : "📥"}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-on-surface">{debt.person}</p>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusColors[debt.status]}`}
              >
                {{ active: "active", settled: "réglée", "written-off": "sans suite" }[debt.status] ?? debt.status}
              </span>
            </div>
            {debt.description && (
              <p className="text-sm text-on-surface-muted">{debt.description}</p>
            )}
            <p className="mt-1 text-xs text-on-surface-muted">
              {format(new Date(debt.date), "MMM d, yyyy")}
              {debt.settledAt &&
                ` · Réglée le ${format(new Date(debt.settledAt), "dd/MM/yyyy")}`}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span
            className={`text-lg font-bold ${
              debt.direction === "lent" ? "text-success" : "text-danger"
            }`}
          >
            {debt.direction === "lent" ? "+" : "−"}
            {debt.amount.toLocaleString()} FCFA
          </span>
          {debt.status === "active" && (
            <div className="flex gap-1">
              <button
                type="button"
                onClick={onSettle}
                className="rounded-md bg-success/10 px-2 py-0.5 text-xs font-medium text-success hover:bg-success/20 transition-colors"
              >
                Régler
              </button>
              <button
                type="button"
                onClick={onWriteOff}
                className="rounded-md border border-border-light px-2 py-0.5 text-xs text-on-surface-muted hover:bg-surface-alt transition-colors"
              >
                Sans suite
              </button>
              <button
                type="button"
                onClick={onDelete}
                className="rounded-md px-2 py-0.5 text-xs text-danger hover:bg-danger/10 transition-colors"
              >
                Supprimer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CreateModal({
  open,
  onClose,
  form,
  setForm,
  saving,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  form: {
    person: string;
    amount: string;
    description: string;
    direction: "lent" | "borrowed";
    date: string;
  };
  setForm: (f: typeof form) => void;
  saving: boolean;
  onSubmit: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose} title="Ajouter une dette ou créance">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="space-y-4"
      >
        <div className="flex gap-2">
          {(["lent", "borrowed"] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setForm({ ...form, direction: d })}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium capitalize transition-colors ${
                form.direction === d
                  ? "bg-primary text-on-primary"
                  : "border border-border-light text-on-surface-muted hover:bg-surface-alt"
              }`}
            >
              {d === "lent" ? "J’ai prêté" : "J’ai emprunté"}
            </button>
          ))}
        </div>
        <div>
          <label className="block text-sm font-medium text-on-surface">Personne</label>
          <input
            type="text"
            value={form.person}
            onChange={(e) => setForm({ ...form, person: e.target.value })}
            className="mt-1 w-full rounded-lg border border-border-light px-3 py-2 text-sm outline-none focus:border-primary"
            placeholder="Nom de la personne"
            required
          />
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
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="mt-1 w-full rounded-lg border border-border-light px-3 py-2 text-sm outline-none focus:border-primary"
            placeholder="À quoi correspond cette somme ?"
            rows={2}
          />
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
            onClick={onClose}
            className="rounded-lg border border-border-light px-4 py-2 text-sm font-medium text-on-surface hover:bg-surface-alt transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={saving || !form.person || !form.amount}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:bg-primary-light disabled:opacity-50 transition-colors"
          >
            {saving ? "Enregistrement…" : "Enregistrer"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
