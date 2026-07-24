import type { Debt } from "@/domain/debt/debt";

function isCounted(debt: Debt): boolean {
  return debt.status !== "archived";
}

export function totalRemaining(debts: Debt[]): number {
  return debts
    .filter(isCounted)
    .reduce((sum, debt) => sum + debt.currentBalance, 0);
}

export function totalPaidOff(debts: Debt[]): number {
  return debts
    .filter(isCounted)
    .reduce((sum, debt) => sum + (debt.highestBalance - debt.currentBalance), 0);
}

export function paidOffRatio(debts: Debt[]): number {
  const counted = debts.filter(isCounted);
  const highest = counted.reduce((sum, debt) => sum + debt.highestBalance, 0);
  if (highest <= 0) return 0;
  const paid = counted.reduce(
    (sum, debt) => sum + (debt.highestBalance - debt.currentBalance),
    0,
  );
  return Math.max(0, Math.min(1, paid / highest));
}

export function debtPaidOffRatio(debt: Debt): number {
  if (debt.highestBalance <= 0) return 0;
  const paid = debt.highestBalance - debt.currentBalance;
  return Math.max(0, Math.min(1, paid / debt.highestBalance));
}

export function totalMinimum(debts: Debt[]): number {
  return debts
    .filter(isCounted)
    .reduce((sum, debt) => sum + debt.minimumPayment, 0);
}

export function weightedApr(debts: Debt[]): number {
  const counted = debts.filter(isCounted);
  const balance = counted.reduce((sum, debt) => sum + debt.currentBalance, 0);
  if (balance <= 0) return 0;
  const weighted = counted.reduce(
    (sum, debt) => sum + debt.currentBalance * debt.apr,
    0,
  );
  return Math.round(weighted / balance);
}
