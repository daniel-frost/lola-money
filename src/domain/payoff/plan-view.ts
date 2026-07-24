import type { Debt } from "@/domain/debt/debt";
import { paidOffRatio } from "@/domain/debt/progress";
import { attackOrder } from "@/domain/payoff/order";
import type { PayoffPlanInput, ScheduleMonth } from "@/domain/payoff/simulate";
import { projectPayoff } from "@/domain/payoff/simulate";

export type PlanColumn = { debtId: string; label: string };

export type PlanStats = {
  monthlyBudget: number;
  minimums: number;
  extra: number;
  monthsLeft: number | null;
  progress: number;
};

export type PlanDebtFree = {
  date: Date | null;
  month: number | null;
  finalPayment: number;
  finalBalance: number;
};

export type PlanView = {
  stats: PlanStats;
  columns: PlanColumn[];
  schedule: ScheduleMonth[];
  debtFree: PlanDebtFree | null;
};

export function buildPlanView(
  debts: Debt[],
  plan: PayoffPlanInput,
  asOf?: Date,
): PlanView {
  const projection = projectPayoff(debts, plan, asOf);
  const order = attackOrder(
    debts.filter((debt) => debt.status === "active"),
    plan.strategy,
    plan.customOrder,
  );
  const minimums = order.reduce((sum, debt) => sum + debt.minimumPayment, 0);
  const last = projection.schedule[projection.schedule.length - 1];

  return {
    stats: {
      monthlyBudget: minimums + plan.monthlyExtra,
      minimums,
      extra: plan.monthlyExtra,
      monthsLeft: projection.months,
      progress: paidOffRatio(debts),
    },
    columns: order.map((debt) => ({ debtId: debt.id, label: debt.name })),
    schedule: projection.schedule,
    debtFree:
      projection.months === null || !last
        ? null
        : {
            date: projection.debtFreeOn,
            month: projection.months,
            finalPayment: last.total,
            finalBalance: last.endingBalance,
          },
  };
}
