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
    await createGoal({
      name: form.name.trim(),
      targetAmount: Number(form.targetAmount),
      savedAmount: Number(form.savedAmount) || 0,
      sourcePocketId: form.sourcePocketId || null,
      realm,
    });
    setSaving(false);
    setShowCreate(false);
    resetForm();
    addToast("success", `Goal "${form.name.trim()}" created`);
    refresh();
  };

  const handleContribute = async (goalId: string, increment: number) => {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;
    const newSaved = goal.savedAmount + increment;
    await updateGoal(goalId, { savedAmount: newSaved });
    addToast("success", `Added ${increment.toLocaleString()} FCFA to "${goal.name}"`);
    refresh();
  };

  const handleDelete = async () => {
    const id = deleteGoalId;
    if (!id) return;
    setDeleteGoalId(null);
    const goal = goals.find((g) => g.id === id);
    await deleteGoal(id);
    addToast("info", `Goal "${goal?.name ?? ''}" deleted`);
    refresh();
  };

  if (!loading && goals.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-on-surface">Goals</h1>
        <EmptyState
          title="No goals yet"
          message="Set a savings goal to start tracking your progress."
          action={{ label: "New Goal", onClick: () => setShowCreate(true) }}
        />
        <GoalModal
          open={showCreate}
          onClose={() => { setShowCreate(false); resetForm(); }}
          form={form}
          setForm={setForm}
          saving={saving}
          pockets={pockets}
          onSubmit={handleCreate}
          title="New Goal"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-on-surface">Goals</h1>
          <p className="text-sm text-on-surface-muted">
            {goals.filter((g) => g.savedAmount >= g.targetAmount).length} of{" "}
            {goals.length} completed
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:bg-primary-light transition-colors"
        >
          + New Goal
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
                      ? `Linked to ${pockets.find((p) => p.id === goal.sourcePocketId)?.name ?? "pocket"}`
                      : "No linked pocket"}
                  </p>
                </div>
                {!progress.isCompleted && (
                  <button
                    type="button"
                    onClick={() => setDeleteGoalId(goal.id)}
                    className="rounded-md px-2 py-0.5 text-xs text-danger hover:bg-danger/10 transition-colors"
                  >
                    Delete
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
                    of {goal.targetAmount.toLocaleString()} FCFA
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
                      {progress.remaining.toLocaleString()} FCFA remaining
                    </span>
                  )}
                  {progress.isCompleted && (
                    <span className="font-medium text-success">Completed</span>
                  )}
                </div>
              </div>

              {/* Quick contribute */}
              {!progress.isCompleted && (
                <div className="mt-3 flex gap-2">
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
        title="New Goal"
      />

      <ConfirmDialog
        open={deleteGoalId !== null}
        onClose={() => setDeleteGoalId(null)}
        onConfirm={handleDelete}
        title="Delete Goal"
        message="Are you sure you want to delete this goal? Progress will be lost."
        confirmLabel="Delete"
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
          <label className="block text-sm font-medium text-on-surface">Goal Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-1 w-full rounded-lg border border-border-light px-3 py-2 text-sm outline-none focus:border-primary"
            placeholder="e.g. New oven"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-on-surface">Target Amount (FCFA)</label>
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
          <label className="block text-sm font-medium text-on-surface">Already Saved (FCFA)</label>
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
          <label className="block text-sm font-medium text-on-surface">Link Pocket (optional)</label>
          <select
            value={form.sourcePocketId}
            onChange={(e) => setForm({ ...form, sourcePocketId: e.target.value })}
            className="mt-1 w-full rounded-lg border border-border-light px-3 py-2 text-sm outline-none focus:border-primary"
          >
            <option value="">No pocket</option>
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
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || !form.name || !form.targetAmount}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:bg-primary-light disabled:opacity-50 transition-colors"
          >
            {saving ? "Creating..." : "Create Goal"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
