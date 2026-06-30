import { useState } from "react";
import { Link } from "react-router-dom";
import type { Realm } from "../types";
import { usePocketBalances } from "../hooks/usePockets";
import { createPocket } from "../db/repositories/pocket";
import { Modal } from "../components/Modal";
import { EmptyState } from "../components/EmptyState";
import { useToast } from "../components/Toast";

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
    await createPocket({
      name: form.name.trim(),
      description: form.description.trim(),
      realm,
    });
    setForm({ name: "", description: "" });
    setSaving(false);
    setShowCreate(false);
    addToast("success", `Pocket "${form.name.trim()}" created`);
    refresh();
  };

  if (!loading && balances.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-on-surface">Pockets</h1>
        <EmptyState
          title="No pockets yet"
          message="Create your first pocket to start organizing your money."
          action={{ label: "Create Pocket", onClick: () => setShowCreate(true) }}
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
          <h1 className="text-2xl font-semibold text-on-surface">Pockets</h1>
          <p className="text-sm text-on-surface-muted">
            Total: {total.toLocaleString()} FCFA
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:bg-primary-light transition-colors"
        >
          + New Pocket
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {balances.map((b) => (
          <Link
            key={b.pocket.id}
            to={`/pockets/${b.pocket.id}`}
            className="block rounded-xl border border-border-light bg-white p-4 transition-shadow hover:shadow-md"
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
    <Modal open={open} onClose={onClose} title="New Pocket">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-on-surface">
            Name
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-1 w-full rounded-lg border border-border-light px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
            placeholder="e.g. Daily Expenses"
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
            className="mt-1 w-full rounded-lg border border-border-light px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
            placeholder="Optional description"
            rows={2}
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
            disabled={saving || !form.name.trim()}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:bg-primary-light disabled:opacity-50 transition-colors"
          >
            {saving ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
