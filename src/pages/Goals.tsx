import { useState } from "react";
import type { Realm } from "../types";
import { useGoals } from "../hooks/useGoals";
import { usePockets } from "../hooks/usePockets";
import { createGoal, updateGoal, deleteGoal } from "../db/repositories/goal";
import { computeGoalProgress } from "../domain/goal";
import { Modal } from "../components/Modal";
import { EmptyState } from "../components/EmptyState";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { useToast } from "../components/Toast";

interface GoalsProps {
  realm: Realm;
}

export function Goals({ realm }: GoalsProps) {
  const { goals, loading, refresh } = useGoals(realm);
  const { pockets } = usePockets(realm);
  const { addToast } = useToast();
  const [showCreate, setShowCreate] = useState(false);
  const [deleteGoalId, setDeleteGoalId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    targetAmount: "",
    savedAmount: "0",
    sourcePocketId: "",
  });
  const [saving, setSaving] = useState(false);

  const resetForm = () => {
    setForm({ name: "", targetAmount: "", savedAmount: "0", sourcePocketId: "" });
  };

  const handleCreate = async () => {
    if (!form.name.trim() || !form.targetAmount) return;
    setSaving(true);
    try {
      await createGoal({
        name: form.name.trim(),
        targetAmount: Number(form.targetAmount),
        savedAmount: Number(form.savedAmount) || 0,
        sourcePocketId: form.sourcePocketId || null,
        realm,
      });
      setShowCreate(false);
      resetForm();
      addToast("success", `Objectif « ${form.name.trim()} » créé`);
      await refresh();
    } catch (error) {
      addToast("error", error instanceof Error ? error.message : "Impossible de créer l’objectif");
    } finally {
      setSaving(false);
    }
  };

  const handleContribute = async (goalId: string, increment: number) => {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;
    const newSaved = goal.savedAmount + increment;
    try {
      await updateGoal(goalId, { savedAmount: newSaved });
      addToast("success", `${increment.toLocaleString()} FCFA ajoutés à « ${goal.name} »`);
      await refresh();
    } catch (error) {
      addToast("error", error instanceof Error ? error.message : "Impossible de mettre à jour l’objectif");
    }
  };

  const handleDelete = async () => {
    const id = deleteGoalId;
    if (!id) return;
    setDeleteGoalId(null);
    const goal = goals.find((g) => g.id === id);
    try {
      await deleteGoal(id);
      addToast("info", `Objectif « ${goal?.name ?? ""} » supprimé`);
      await refresh();
    } catch (error) {
      addToast("error", error instanceof Error ? error.message : "Impossible de supprimer l’objectif");
    }
  };

  if (!loading && goals.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-on-surface">Objectifs</h1>
        <EmptyState
          title="Aucun objectif"
          message="Fixez un montant à atteindre et suivez votre progression."
          action={{ label: "Nouvel objectif", onClick: () => setShowCreate(true) }}
        />
        <GoalModal
          open={showCreate}
          onClose={() => { setShowCreate(false); resetForm(); }}
          form={form}
          setForm={setForm}
          saving={saving}
          pockets={pockets}
          onSubmit={handleCreate}
          title="Nouvel objectif"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-on-surface">Objectifs</h1>
          <p className="text-sm text-on-surface-muted">
            {goals.filter((g) => g.savedAmount >= g.targetAmount).length} sur{" "}
            {goals.length} terminé{goals.length > 1 ? "s" : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:bg-primary-light transition-colors"
        >
          + Nouvel objectif
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {goals.map((goal) => {
          const progress = computeGoalProgress(goal);
          return (
            <div
              key={goal.id}
              className={`rounded-xl border bg-white p-5 transition-shadow hover:shadow-md ${
                progress.isCompleted ? "border-success/30" : "border-border-light"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-on-surface">{goal.name}</h3>
                  <p className="mt-0.5 text-xs text-on-surface-muted">
                    {goal.sourcePocketId
                      ? `Lié à ${pockets.find((p) => p.id === goal.sourcePocketId)?.name ?? "une poche"}`
                      : "Aucune poche liée"}
                  </p>
                </div>
                {!progress.isCompleted && (
                  <button
                    type="button"
                    onClick={() => setDeleteGoalId(goal.id)}
                    className="rounded-md px-2 py-0.5 text-xs text-danger hover:bg-danger/10 transition-colors"
                  >
                    Supprimer
                  </button>
                )}
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-on-surface">
                    {goal.savedAmount.toLocaleString()} FCFA
                  </span>
                  <span className="text-on-surface-muted">
                    sur {goal.targetAmount.toLocaleString()} FCFA
                  </span>
                </div>
                <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-surface-alt">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      progress.isCompleted ? "bg-success" : "bg-primary"
                    }`}
                    style={{ width: `${progress.percentage}%` }}
                  />
                </div>
                <div className="mt-1 flex justify-between text-xs text-on-surface-muted">
                  <span>{progress.percentage}%</span>
                  {!progress.isCompleted && (
                    <span>
                      reste {progress.remaining.toLocaleString()} FCFA
                    </span>
                  )}
                  {progress.isCompleted && (
                    <span className="font-medium text-success">Terminé</span>
                  )}
                </div>
              </div>

              {/* Quick contribute */}
              {!progress.isCompleted && (
                <div className="mt-3">
                  <div className="flex gap-2">
                    {[5000, 10000, 25000, 50000].map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => handleContribute(goal.id, amount)}
                        className="flex-1 rounded-md border border-border-light py-1 text-xs font-medium text-on-surface-muted hover:bg-surface-alt hover:text-on-surface transition-colors"
                      >
                        +{amount.toLocaleString()}
                      </button>
                    ))}
                  </div>
                  <p className="mt-1.5 text-[10px] text-on-surface-muted">Suivi uniquement : cette action ne déplace pas l’argent d’une poche.</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <GoalModal
        open={showCreate}
        onClose={() => { setShowCreate(false); resetForm(); }}
        form={form}
        setForm={setForm}
        saving={saving}
        pockets={pockets}
        onSubmit={handleCreate}
        title="Nouvel objectif"
      />

      <ConfirmDialog
        open={deleteGoalId !== null}
        onClose={() => setDeleteGoalId(null)}
        onConfirm={handleDelete}
        title="Supprimer cet objectif ?"
        message="La progression enregistrée sera perdue."
        confirmLabel="Supprimer"
        variant="danger"
      />
    </div>
  );
}

function GoalModal({
  open,
  onClose,
  form,
  setForm,
  saving,
  pockets,
  onSubmit,
  title,
}: {
  open: boolean;
  onClose: () => void;
  form: { name: string; targetAmount: string; savedAmount: string; sourcePocketId: string };
  setForm: (f: typeof form) => void;
  saving: boolean;
  pockets: { id: string; name: string }[];
  onSubmit: () => void;
  title: string;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <form
        onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
        className="space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-on-surface">Nom de l’objectif</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-1 w-full rounded-lg border border-border-light px-3 py-2 text-sm outline-none focus:border-primary"
            placeholder="Ex. Nouveau four"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-on-surface">Montant cible (FCFA)</label>
          <input
            type="number"
            value={form.targetAmount}
            onChange={(e) => setForm({ ...form, targetAmount: e.target.value })}
            className="mt-1 w-full rounded-lg border border-border-light px-3 py-2 text-sm outline-none focus:border-primary"
            placeholder="0"
            min="1"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-on-surface">Déjà épargné (FCFA)</label>
          <input
            type="number"
            value={form.savedAmount}
            onChange={(e) => setForm({ ...form, savedAmount: e.target.value })}
            className="mt-1 w-full rounded-lg border border-border-light px-3 py-2 text-sm outline-none focus:border-primary"
            placeholder="0"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-on-surface">Poche liée (facultatif)</label>
          <select
            value={form.sourcePocketId}
            onChange={(e) => setForm({ ...form, sourcePocketId: e.target.value })}
            className="mt-1 w-full rounded-lg border border-border-light px-3 py-2 text-sm outline-none focus:border-primary"
          >
            <option value="">Aucune poche</option>
            {pockets.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
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
            disabled={saving || !form.name || !form.targetAmount}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:bg-primary-light disabled:opacity-50 transition-colors"
          >
            {saving ? "Création…" : "Créer l’objectif"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
