import { useState, useMemo } from "react";
import type { Realm, SaleAggregation } from "../types";
import { useSales } from "../hooks/useSales";
import { usePockets } from "../hooks/usePockets";
import { createSale, deleteSale } from "../db/repositories/sale";
import { aggregateByDay, aggregateByWeek, aggregateByMonth } from "../domain/sale";
import { Modal } from "../components/Modal";
import { EmptyState } from "../components/EmptyState";
import { useToast } from "../components/Toast";
import { format } from "date-fns";
import { Plus, Trash2 } from "lucide-react";

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
    try {
      await createSale({
        product: form.product.trim(),
        quantity: Number(form.quantity) || 1,
        unitPrice: Number(form.unitPrice),
        pocketId: form.pocketId,
        date: form.date,
        realm,
        tags: form.tags ? form.tags.split(",").map((tag) => tag.trim()).filter(Boolean) : [],
      });
      setShowCreate(false);
      resetForm();
      addToast("success", `Vente enregistrée : ${form.product.trim()}`);
      await refresh();
    } catch (error) {
      addToast("error", error instanceof Error ? error.message : "Impossible d’enregistrer la vente");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (saleId: string, product: string) => {
    try {
      await deleteSale(saleId);
      addToast("info", `Vente supprimée : ${product}`);
      await refresh();
    } catch (error) {
      addToast("error", error instanceof Error ? error.message : "Impossible de supprimer la vente");
    }
  };

  if (realm === "personal") {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-[-0.05em] text-on-surface sm:text-4xl">Ventes</h1>
        <EmptyState title="Réservé à l’activité" message="Passez dans l’espace Activité pour enregistrer vos ventes." />
      </div>
    );
  }

  if (!loading && sales.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-[-0.05em] text-on-surface sm:text-4xl">Ventes</h1>
        <EmptyState
          title="Aucune vente"
          message="Enregistrez votre première vente pour suivre votre chiffre d’affaires."
          action={{ label: "Enregistrer une vente", onClick: () => setShowCreate(true) }}
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
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-[-0.05em] text-on-surface sm:text-4xl">Ventes</h1>
          <p className="text-sm text-on-surface-muted">
            Chiffre d’affaires total : {totalRevenue.toLocaleString()} FCFA
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="rounded-2xl bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:bg-primary-light transition-colors"
        >
          <Plus aria-hidden="true" className="mr-1 inline h-4 w-4" />
          Enregistrer une vente
        </button>
      </div>

      {/* Search + aggregation toggle */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher une vente…"
          className="w-full rounded-2xl border border-border-light px-3 py-2 text-sm outline-none focus:border-primary sm:max-w-xs"
        />
        <div className="flex gap-1 rounded-2xl border border-border-light p-0.5">
          {(["day", "week", "month"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setAggMode(mode)}
              className={`rounded-2xl px-3 py-1 text-xs font-medium capitalize transition-colors ${
                aggMode === mode
                  ? "bg-primary text-on-primary"
                  : "text-on-surface-muted hover:text-on-surface"
              }`}
            >
              {{ day: "Jour", week: "Semaine", month: "Mois" }[mode]}
            </button>
          ))}
        </div>
      </div>

      {/* Aggregations */}
      <div className="space-y-3">
        {aggregations.length === 0 ? (
          <p className="text-sm text-on-surface-muted">Aucune vente trouvée.</p>
        ) : (
          aggregations.map((agg) => (
            <div
              key={agg.period}
              className="rounded-[1.5rem] border border-border-light bg-card"
            >
              <div className="flex items-center justify-between border-b border-border-light px-4 py-3">
                <span className="text-sm font-semibold text-on-surface">
                  {format(new Date(agg.period), "MMM d, yyyy")}
                  {aggMode === "week" && " (semaine)"}
                  {aggMode === "month" && " (mois)"}
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
                        className="grid h-11 w-11 place-items-center rounded-2xl text-danger opacity-70 transition-opacity hover:bg-danger-container hover:opacity-100"
                        aria-label="Supprimer la vente"
                      >
                        <Trash2 aria-hidden="true" className="h-4 w-4" />
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
    <Modal open={open} onClose={onClose} title="Enregistrer une vente">
      <form
        onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
        className="space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-on-surface">Produit ou service</label>
          <input
            type="text"
            value={form.product}
            onChange={(e) => setForm({ ...form, product: e.target.value })}
            className="mt-1 w-full rounded-2xl border border-border-light px-3 py-2 text-sm outline-none focus:border-primary"
            placeholder="Ex. Gâteaux, couture, photo"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-on-surface">Quantité</label>
            <input
              type="number"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              className="mt-1 w-full rounded-2xl border border-border-light px-3 py-2 text-sm outline-none focus:border-primary"
              min="1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface">Prix unitaire (FCFA)</label>
            <input
              type="number"
              value={form.unitPrice}
              onChange={(e) => setForm({ ...form, unitPrice: e.target.value })}
              className="mt-1 w-full rounded-2xl border border-border-light px-3 py-2 text-sm outline-none focus:border-primary"
              placeholder="0"
              min="1"
              required
            />
          </div>
        </div>
        <div className="rounded-2xl bg-surface-alt px-3 py-2 text-sm">
          <span className="text-on-surface-muted">Total : </span>
          <span className="font-bold text-success">
            +{computedTotal.toLocaleString()} FCFA
          </span>
        </div>
        <div>
          <label className="block text-sm font-medium text-on-surface">Poche de réception</label>
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
        <div>
          <label className="block text-sm font-medium text-on-surface">Mots-clés (facultatif)</label>
          <input
            type="text"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            className="mt-1 w-full rounded-2xl border border-border-light px-3 py-2 text-sm outline-none focus:border-primary"
            placeholder="pâtisserie, commande"
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
            disabled={saving || !form.product || !form.unitPrice || !form.pocketId}
            className="rounded-2xl bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:bg-primary-light disabled:opacity-50 transition-colors"
          >
            {saving ? "Enregistrement…" : "Enregistrer"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
