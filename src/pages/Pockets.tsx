import { useState } from "react";
import { Link } from "react-router-dom";
import type { Realm } from "../types";
import { usePocketBalances } from "../hooks/usePockets";
import { createPocket } from "../db/repositories/pocket";
import { Modal } from "../components/Modal";
import { EmptyState } from "../components/EmptyState";
import { useToast } from "../components/Toast";
import { Plus } from "lucide-react";

interface PocketsProps {
  realm: Realm;
}

export function Pockets({ realm }: PocketsProps) {
  const { balances, total, loading, refresh } = usePocketBalances(realm);
  const { addToast } = useToast();
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      await createPocket({
        name: form.name.trim(),
        description: form.description.trim(),
        realm,
      });
      setForm({ name: "", description: "" });
      setShowCreate(false);
      addToast("success", `Poche « ${form.name.trim()} » créée`);
      await refresh();
    } catch (error) {
      addToast("error", error instanceof Error ? error.message : "Impossible de créer la poche");
    } finally {
      setSaving(false);
    }
  };

  if (!loading && balances.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-[-0.05em] text-on-surface sm:text-4xl">Poches</h1>
        <EmptyState
          title="Aucune poche"
          message="Créez votre première poche : espèces, Orange Money ou Moov Money."
          action={{ label: "Créer une poche", onClick: () => setShowCreate(true) }}
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
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-[-0.05em] text-on-surface sm:text-4xl">Poches</h1>
          <p className="text-sm text-on-surface-muted">
            Solde total : {total.toLocaleString()} FCFA
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="rounded-2xl bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:bg-primary-light transition-colors"
        >
          <Plus aria-hidden="true" className="mr-1 inline h-4 w-4" />
          Nouvelle poche
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {balances.map((b) => (
          <Link
            key={b.pocket.id}
            to={`/pockets/${b.pocket.id}`}
            className="block rounded-[1.5rem] border border-border-light bg-card p-4 transition-shadow hover:shadow-md"
          >
            <h3 className="font-semibold text-on-surface">{b.pocket.name}</h3>
            {b.pocket.description && (
              <p className="mt-0.5 text-xs text-on-surface-muted line-clamp-1">
                {b.pocket.description}
              </p>
            )}
            <p className="mt-3 text-xl font-bold text-on-surface">
              {b.balance.toLocaleString()} FCFA
            </p>
            <div className="mt-2 flex gap-3 text-xs">
              <span className="text-success">
                +{b.income.toLocaleString()}
              </span>
              <span className="text-danger">
                −{b.expense.toLocaleString()}
              </span>
            </div>
          </Link>
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
  form: { name: string; description: string };
  setForm: (f: { name: string; description: string }) => void;
  saving: boolean;
  onSubmit: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose} title="Nouvelle poche">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-on-surface">
            Nom
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-1 w-full rounded-2xl border border-border-light px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
            placeholder="Ex. Espèces, Orange Money"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-on-surface">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="mt-1 w-full rounded-2xl border border-border-light px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
            placeholder="Description facultative"
            rows={2}
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-border-light px-4 py-2 text-sm font-medium text-on-surface hover:bg-surface-alt transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={saving || !form.name.trim()}
            className="rounded-2xl bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:bg-primary-light disabled:opacity-50 transition-colors"
          >
            {saving ? "Création…" : "Créer"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
