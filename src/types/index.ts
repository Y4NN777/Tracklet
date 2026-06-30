export type Realm = "personal" | "business";

export type TransactionType = "income" | "expense" | "transfer";

export type DebtDirection = "lent" | "borrowed";

export type DebtStatus = "active" | "settled" | "written-off";

export interface Pocket {
  id: string;
  name: string;
  description: string;
  realm: Realm;
  createdAt: string; // ISO
  updatedAt: string;
  archived: boolean;
}

export interface Transaction {
  id: string;
  pocketId: string;
  type: TransactionType;
  amount: number; // in smallest unit (FCFA = 1 FCFA)
  description: string;
  categoryId: string;
  date: string; // ISO date (YYYY-MM-DD)
  realm: Realm;
  tags: string[];
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
  realm: Realm;
}

export interface Debt {
  id: string;
  person: string;
  amount: number;
  description: string;
  direction: DebtDirection;
  status: DebtStatus;
  date: string; // ISO date
  settledAt: string | null;
  realm: Realm;
  createdAt: string;
  updatedAt: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  sourcePocketId: string | null;
  realm: Realm;
  createdAt: string;
  updatedAt: string;
}

export interface CashPosition {
  available: number;
  committed: number;
  toReceive: number;
  totalBalance: number;
}

export type Page = "dashboard" | "pockets" | "transactions" | "debts" | "goals" | "reports";
