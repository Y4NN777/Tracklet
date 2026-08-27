import * as pocketRepo from "../db/repositories/pocket";
import * as txnRepo from "../db/repositories/transaction";
import type { Pocket } from "../types";

export interface PocketBalance {
  pocket: Pocket;
  balance: number;
  income: number;
  expense: number;
}

export async function getPocketBalance(
  pocketId: string,
  expectedRealm?: string,
): Promise<PocketBalance> {
  const pocket = await pocketRepo.getPocket(pocketId);
  if (!pocket || (expectedRealm && pocket.realm !== expectedRealm)) throw new Error("Poche introuvable");

  const txns = await txnRepo.getAllTransactions({ pocketId });
  let balance = 0;
  let income = 0;
  let expense = 0;

  for (const t of txns) {
    if (t.type === "income") {
      balance += t.amount;
      income += t.amount;
    } else if (t.type === "expense") {
      balance -= t.amount;
      expense += t.amount;
    } else if (t.transferDirection === "in") {
      balance += t.amount;
      income += t.amount;
    } else if (t.transferDirection === "out") {
      balance -= t.amount;
      expense += t.amount;
    }
  }

  return { pocket, balance, income, expense };
}

export async function getAllBalances(
  realm?: string,
): Promise<PocketBalance[]> {
  const pockets = await pocketRepo.getActivePockets(realm);
  const balances = await Promise.all(
    pockets.map((p) => getPocketBalance(p.id)),
  );
  return balances;
}

export async function getTotalBalance(realm?: string): Promise<number> {
  const balances = await getAllBalances(realm);
  return balances.reduce((sum, b) => sum + b.balance, 0);
}
