import type { OverviewDebtFree } from "@/domain/overview/debt-free";
import type { OverviewDebtRow } from "@/domain/overview/debt-row";
import type { OverviewHeaderStats } from "@/domain/overview/header-stats";
import type { OverviewMonthlyPayments } from "@/domain/overview/monthly-payments";
import type { OverviewPayments } from "@/domain/overview/payments";
import type { PaymentRow } from "@/domain/payment/monthly-payments";
import { summarizePayments } from "@/domain/payment/monthly-payments";
import { summarizeMonthlyHistory } from "@/domain/payment/monthly-history";
import { paidOffRatio, totalRemaining } from "@/domain/debt/progress";
import { projectPayoff } from "@/domain/payoff/simulate";
import { listDebts } from "@/server/debt/debt.service";
import { getPayments } from "@/server/payment/payment.service";
import { getPlan } from "@/server/plan/plan.service";

export async function getOverviewHeaderStats(): Promise<OverviewHeaderStats> {
  const [debts, plan] = await Promise.all([listDebts(), getPlan()]);
  return {
    remaining: totalRemaining(debts),
    paidOffRatio: paidOffRatio(debts),
    strategy: plan.strategy,
  };
}

export async function getOverviewDebtFree(): Promise<OverviewDebtFree> {
  const [debts, plan] = await Promise.all([listDebts(), getPlan()]);
  const projection = projectPayoff(debts, plan);
  return {
    debtFreeOn: projection.debtFreeOn,
    months: projection.months,
  };
}

export async function getOverviewMonthlyPayments(): Promise<OverviewMonthlyPayments> {
  const [payments, debts, plan] = await Promise.all([
    getPayments(),
    listDebts(),
    getPlan(),
  ]);
  return {
    months: summarizeMonthlyHistory(payments, debts, plan.monthlyExtra),
  };
}

export async function getOverviewDebts(): Promise<OverviewDebtRow[]> {
  const [debts, plan] = await Promise.all([listDebts(), getPlan()]);
  const projection = projectPayoff(debts, plan);
  return debts.map((debt) => ({
    debt,
    projectedPayoffOn: projection.perDebt[debt.id]?.payoffOn ?? null,
    isFocus: debt.id === projection.focusDebtId,
  }));
}

const PAYMENT_ROWS: PaymentRow[] = [
  {
    debtId: "store-card",
    debtName: "Store card",
    amount: 62_000,
    status: "paid",
    date: new Date("2026-07-18"),
    breakdown: { minimum: 8_500, extra: 53_500 },
  },
  {
    debtId: "auto-loan",
    debtName: "Auto loan",
    amount: 34_000,
    status: "paid",
    date: new Date("2026-07-22"),
  },
  {
    debtId: "student-loan",
    debtName: "Student loan",
    amount: 18_500,
    status: "next",
    date: new Date("2026-07-28"),
  },
  {
    debtId: "visa-4412",
    debtName: "Visa •• 4412",
    amount: 21_000,
    status: "upcoming",
    date: new Date("2026-07-30"),
  },
];

export async function getOverviewPayments(): Promise<OverviewPayments> {
  return {
    daysLeft: 8,
    rows: PAYMENT_ROWS,
    summary: summarizePayments(PAYMENT_ROWS),
  };
}
