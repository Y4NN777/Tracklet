import { useRef, useState } from "react";
import { createBackup, downloadBackup, parseBackup, restoreBackup } from "../db/backup";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { useToast } from "../components/Toast";
import type { TrackletBackup } from "../types";
import { HardDrive } from "lucide-react";

export function Settings() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pendingBackup, setPendingBackup] = useState<TrackletBackup | null>(null);
  const [working, setWorking] = useState(false);
  const { addToast } = useToast();

  const handleExport = async () => {
    setWorking(true);
    try {
      downloadBackup(await createBackup());
      addToast("success", "Sauvegarde téléchargée");
    } catch (error) {
      addToast("error", error instanceof Error ? error.message : "Échec de la sauvegarde");
    } finally {
      setWorking(false);
    }
  };

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    try {
      setPendingBackup(parseBackup(await file.text()));
    } catch (error) {
      addToast("error", error instanceof Error ? error.message : "Fichier invalide");
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleRestore = async () => {
    if (!pendingBackup) return;
    setWorking(true);
    try {
      await restoreBackup(pendingBackup);
      addToast("success", "Données restaurées. Actualisation…");
      window.setTimeout(() => window.location.reload(), 600);
    } catch (error) {
      addToast("error", error instanceof Error ? error.message : "Échec de la restauration");
      setWorking(false);
    } finally {
      setPendingBackup(null);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <p className="flex items-center gap-2 text-sm font-semibold text-primary"><HardDrive aria-hidden="true" className="h-4 w-4" /> Appareil actuel</p>
        <h1 className="mt-1 text-3xl font-bold tracking-[-0.05em] text-on-surface sm:text-4xl">Données et sécurité</h1>
        <p className="mt-1 text-sm text-on-surface-muted">
          Vos données restent sur cet appareil. Créez régulièrement une sauvegarde privée.
        </p>
      </div>

      <section className="rounded-2xl border border-border-light bg-card p-5 shadow-sm">
        <h2 className="font-semibold text-on-surface">Sauvegarde complète</h2>
        <p className="mt-1 text-sm text-on-surface-muted">
          Le fichier contient vos poches, opérations, ventes, dettes et objectifs. Gardez-le dans un endroit sûr.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleExport}
            disabled={working}
            className="rounded-[1.5rem] bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-light disabled:opacity-50"
          >
            Télécharger une sauvegarde
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={working}
            className="rounded-[1.5rem] border border-border px-4 py-2.5 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-alt disabled:opacity-50"
          >
            Restaurer un fichier
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(event) => handleFile(event.target.files?.[0])}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-border-light bg-card p-5">
        <h2 className="font-semibold text-on-surface">À propos</h2>
        <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
          <dt className="text-on-surface-muted">Version</dt>
          <dd className="text-right font-medium text-on-surface">{__APP_VERSION__}</dd>
          <dt className="text-on-surface-muted">Stockage</dt>
          <dd className="text-right font-medium text-on-surface">Local · IndexedDB</dd>
          <dt className="text-on-surface-muted">Connexion requise</dt>
          <dd className="text-right font-medium text-success">Non</dd>
        </dl>
      </section>

      <ConfirmDialog
        open={pendingBackup !== null}
        onClose={() => setPendingBackup(null)}
        onConfirm={handleRestore}
        title="Remplacer les données actuelles ?"
        message="La restauration remplace toutes les données présentes sur cet appareil. Téléchargez d’abord une sauvegarde si vous souhaitez les conserver."
        confirmLabel="Restaurer"
        variant="danger"
      />
    </div>
  );
}
