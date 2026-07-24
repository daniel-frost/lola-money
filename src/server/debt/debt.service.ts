import type { Debt } from "@/domain/debt/debt";
import type { BalanceHistoryPoint } from "@/domain/debt/balance-history";
import { balanceHistory } from "@/fixtures/balance-history";
import { findDebts } from "@/server/debt/debt.repository";
import type { DebtsTable, DebtTableRow } from "@/domain/debt/debt-table";
import { groupDebtRows } from "@/domain/debt/debt-table";
import {
  debtPaidOffRatio,
  paidOffRatio,
  totalMinimum,
  totalRemaining,
} from "@/domain/debt/progress";

export async function listDebts(): Promise<Debt[]> {
  return findDebts();
}

export async function getBalanceHistory(): Promise<BalanceHistoryPoint[]> {
  return balanceHistory;
}

const PAID_OFF_ON: Record<string, Date> = {
  "old-card": new Date("2026-05-15"),
};

export async function getDebtsTable(): Promise<DebtsTable> {
  const all = await listDebts();
  const rows: DebtTableRow[] = all.map((debt) => ({
    debt,
    paidOffRatio: debtPaidOffRatio(debt),
    paidOffOn: PAID_OFF_ON[debt.id] ?? null,
  }));
  return {
    groups: groupDebtRows(rows),
    totals: {
      balance: totalRemaining(all),
      minimum: totalMinimum(all),
      paidOffRatio: paidOffRatio(all),
    },
  };
}

