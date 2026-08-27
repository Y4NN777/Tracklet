import type { IDBPDatabase } from "idb";
import type { TrackletBackup } from "../types";
import { DB_VERSION, getDB, type TrackletDB } from "./schema";

const STORES = ["pockets", "transactions", "categories", "debts", "goals", "sales"] as const;

export async function createBackup(
  database?: IDBPDatabase<TrackletDB>,
): Promise<TrackletBackup> {
  const db = database ?? await getDB();
  const [pockets, transactions, categories, debts, goals, sales] = await Promise.all([
    db.getAll("pockets"),
    db.getAll("transactions"),
    db.getAll("categories"),
    db.getAll("debts"),
    db.getAll("goals"),
    db.getAll("sales"),
  ]);

  return {
    format: "tracklet-backup",
    schemaVersion: DB_VERSION,
    appVersion: __APP_VERSION__,
    exportedAt: new Date().toISOString(),
    data: { pockets, transactions, categories, debts, goals, sales },
  };
}

export function parseBackup(text: string): TrackletBackup {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("Ce fichier JSON est invalide");
  }
  if (!parsed || typeof parsed !== "object") throw new Error("Fichier de sauvegarde invalide");
  const candidate = parsed as Partial<TrackletBackup>;
  if (candidate.format !== "tracklet-backup") throw new Error("Ce fichier n’est pas une sauvegarde Tracklet");
  if (!Number.isInteger(candidate.schemaVersion) || (candidate.schemaVersion ?? 0) < 1 || (candidate.schemaVersion ?? 0) > DB_VERSION) {
    throw new Error("Cette sauvegarde provient d’une version plus récente de Tracklet");
  }
  if (!candidate.data || typeof candidate.data !== "object") throw new Error("Les données de sauvegarde sont absentes");
  for (const store of STORES) {
    if (!Array.isArray(candidate.data[store])) throw new Error(`La section « ${store} » est invalide`);
    for (const record of candidate.data[store]) {
      if (!record || typeof record !== "object" || typeof (record as { id?: unknown }).id !== "string") {
        throw new Error(`La section « ${store} » contient un enregistrement invalide`);
      }
    }
  }
  return candidate as TrackletBackup;
}

export async function restoreBackup(
  backup: TrackletBackup,
  database?: IDBPDatabase<TrackletDB>,
): Promise<void> {
  const db = database ?? await getDB();
  const tx = db.transaction([...STORES], "readwrite");
  for (const storeName of STORES) {
    const store = tx.objectStore(storeName);
    await store.clear();
    for (const record of backup.data[storeName]) await store.add(record);
  }
  await tx.done;
}

export function downloadBackup(backup: TrackletBackup): void {
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `tracklet-backup-${backup.exportedAt.slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}
