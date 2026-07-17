import type { Debt } from "@/domain/debt/debt";
import type { BalanceHistoryPoint } from "@/domain/debt/balance-history";
import { debts } from "@/fixtures/debts";
import { balanceHistory } from "@/fixtures/balance-history";

export async function listDebts(): Promise<Debt[]> {
  return debts;
}

export async function getBalanceHistory(): Promise<BalanceHistoryPoint[]> {
  return balanceHistory;
}
