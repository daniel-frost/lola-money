import type { Debt } from "@/domain/debt/debt";
import type { BalanceHistoryPoint } from "@/domain/debt/balance-history";
import { debts } from "@/fixtures/debts";
import { balanceHistory } from "@/fixtures/balance-history";
import type { DebtsTable } from "@/domain/debt/debt-table";
import {
  debtPaidOffRatio,
  paidOffRatio,
  totalMinimum,
  totalRemaining,
} from "@/domain/debt/progress";

export async function listDebts(): Promise<Debt[]> {
  return debts;
}

export async function getBalanceHistory(): Promise<BalanceHistoryPoint[]> {
  return balanceHistory;
}

const PAID_OFF_ON: Record<string, Date> = {
  "old-card": new Date("2026-05-15"),
};

export async function getDebtsTable(): Promise<DebtsTable> {
  const all = await listDebts();
  return {
    rows: all.map((debt) => ({
      debt,
      paidOffRatio: debtPaidOffRatio(debt),
      paidOffOn: PAID_OFF_ON[debt.id] ?? null,
    })),
    totals: {
      balance: totalRemaining(all),
      minimum: totalMinimum(all),
      paidOffRatio: paidOffRatio(all),
    },
  };
}

