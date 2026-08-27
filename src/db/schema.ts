import { deleteDB, type IDBPDatabase, openDB, type IDBPTransaction, type StoreNames, type StoreValue } from "idb";

const DB_NAME = "tracklet";
export const DB_VERSION = 3;

export interface TrackletDB {
  pockets: StoreValue<unknown, "pockets">;
  transactions: StoreValue<unknown, "transactions">;
  categories: StoreValue<unknown, "categories">;
  debts: StoreValue<unknown, "debts">;
  goals: StoreValue<unknown, "goals">;
  sales: StoreValue<unknown, "sales">;
}

export type TrackletTransaction = IDBPTransaction<
  TrackletDB,
  StoreNames<TrackletDB>[],
  "versionchange"
>;

let _dbPromise: Promise<IDBPDatabase<TrackletDB>> | null = null;

export function getDB(): Promise<IDBPDatabase<TrackletDB>> {
  if (!_dbPromise) {
    _dbPromise = openDB<TrackletDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("pockets")) {
          const pocketStore = db.createObjectStore("pockets", { keyPath: "id" });
          pocketStore.createIndex("realm", "realm");
          pocketStore.createIndex("archived", "archived");
        }
        if (!db.objectStoreNames.contains("transactions")) {
          const txnStore = db.createObjectStore("transactions", {
            keyPath: "id",
          });
          txnStore.createIndex("pocketId", "pocketId");
          txnStore.createIndex("date", "date");
          txnStore.createIndex("realm", "realm");
          txnStore.createIndex("type", "type");
          txnStore.createIndex("categoryId", "categoryId");
        }
        if (!db.objectStoreNames.contains("categories")) {
          const catStore = db.createObjectStore("categories", {
            keyPath: "id",
          });
          catStore.createIndex("type", "type");
          catStore.createIndex("realm", "realm");
        }
        if (!db.objectStoreNames.contains("debts")) {
          const debtStore = db.createObjectStore("debts", { keyPath: "id" });
          debtStore.createIndex("status", "status");
          debtStore.createIndex("realm", "realm");
          debtStore.createIndex("person", "person");
        }
        if (!db.objectStoreNames.contains("goals")) {
          const goalStore = db.createObjectStore("goals", { keyPath: "id" });
          goalStore.createIndex("realm", "realm");
          goalStore.createIndex("sourcePocketId", "sourcePocketId");
        }
        if (!db.objectStoreNames.contains("sales")) {
          const saleStore = db.createObjectStore("sales", { keyPath: "id" });
          saleStore.createIndex("realm", "realm");
          saleStore.createIndex("pocketId", "pocketId");
          saleStore.createIndex("date", "date");
        }
      },
    });
  }
  return _dbPromise;
}

export async function resetDatabaseForTests(): Promise<void> {
  if (_dbPromise) (await _dbPromise).close();
  _dbPromise = null;
  await deleteDB(DB_NAME);
}

export async function seedDefaults(db: IDBPDatabase<TrackletDB>) {
  const count = await db.count("categories");
  if (count > 0) return;

  const defaultCategories = [
    // Expense categories
    { id: crypto.randomUUID(), name: "Alimentation", icon: "🍽️", color: "#EF4444", type: "expense" as const, realm: "personal" as const },
    { id: crypto.randomUUID(), name: "Transport", icon: "🚗", color: "#F97316", type: "expense" as const, realm: "personal" as const },
    { id: crypto.randomUUID(), name: "Achats", icon: "🛍️", color: "#EAB308", type: "expense" as const, realm: "personal" as const },
    { id: crypto.randomUUID(), name: "Factures", icon: "💡", color: "#22C55E", type: "expense" as const, realm: "personal" as const },
    { id: crypto.randomUUID(), name: "Santé", icon: "💊", color: "#06B6D4", type: "expense" as const, realm: "personal" as const },
    { id: crypto.randomUUID(), name: "Loisirs", icon: "🎬", color: "#8B5CF6", type: "expense" as const, realm: "personal" as const },
    // Income categories
    { id: crypto.randomUUID(), name: "Salaire", icon: "💰", color: "#16A34A", type: "income" as const, realm: "personal" as const },
    { id: crypto.randomUUID(), name: "Freelance", icon: "💼", color: "#2563EB", type: "income" as const, realm: "personal" as const },
    { id: crypto.randomUUID(), name: "Cadeaux", icon: "🎁", color: "#EC4899", type: "income" as const, realm: "personal" as const },
    // Business categories
    { id: crypto.randomUUID(), name: "Ventes", icon: "📈", color: "#16A34A", type: "income" as const, realm: "business" as const },
    { id: crypto.randomUUID(), name: "Stock et matières", icon: "📦", color: "#F97316", type: "expense" as const, realm: "business" as const },
    { id: crypto.randomUUID(), name: "Communication", icon: "📢", color: "#EC4899", type: "expense" as const, realm: "business" as const },
    { id: crypto.randomUUID(), name: "Personnel", icon: "👥", color: "#8B5CF6", type: "expense" as const, realm: "business" as const },
    { id: crypto.randomUUID(), name: "Loyer", icon: "🏢", color: "#EF4444", type: "expense" as const, realm: "business" as const },
  ];

  const tx = db.transaction("categories", "readwrite");
  for (const cat of defaultCategories) {
    await tx.store.add(cat);
  }
  await tx.done;
}
