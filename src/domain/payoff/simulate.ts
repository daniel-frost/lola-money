import type { Debt } from "@/domain/debt/debt";
import type { Strategy } from "@/domain/payoff/strategy";
import { attackOrder } from "@/domain/payoff/order";
import { addMonths, startOfMonth } from "@/lib/date";

export type PayoffPlanInput = {
  strategy: Strategy;
  monthlyExtra: number;
  customOrder?: string[];
};

export type DebtPayoff = {
  debtId: string;
  payoffOn: Date | null;
  monthsToPayoff: number | null;
  interestPaid: number;
};

export type PayoffProjection = {
  focusDebtId: string | null;
  debtFreeOn: Date | null;
  months: number | null;
  totalInterest: number;
  perDebt: Record<string, DebtPayoff>;
};

const MAX_MONTHS = 600;

function monthlyInterest(balance: number, apr: number): number {
  return Math.round((balance * apr) / 120_000);
}

export function projectPayoff(
  debts: Debt[],
  plan: PayoffPlanInput,
  asOf: Date = new Date(),
): PayoffProjection {
  const order = attackOrder(
    debts.filter((debt) => debt.status === "active"),
    plan.strategy,
    plan.customOrder,
  );
  const start = startOfMonth(asOf);
  const totalBudget =
    plan.monthlyExtra +
    order.reduce((sum, debt) => sum + debt.minimumPayment, 0);

  const balances = new Map(order.map((debt) => [debt.id, debt.currentBalance]));
  const result = new Map<string, DebtPayoff>(
    order.map((debt) => [
      debt.id,
      {
        debtId: debt.id,
        payoffOn: null,
        monthsToPayoff: null,
        interestPaid: 0,
      },
    ]),
  );

  let totalInterest = 0;
  let cleared = 0;
  let month = 0;

  while (cleared < order.length && month < MAX_MONTHS) {
    month += 1;

    for (const debt of order) {
      const balance = balances.get(debt.id)!;
      if (balance <= 0) continue;
      const interest = monthlyInterest(balance, debt.apr);
      balances.set(debt.id, balance + interest);
      result.get(debt.id)!.interestPaid += interest;
      totalInterest += interest;
    }

    let budget = totalBudget;

    for (const debt of order) {
      const balance = balances.get(debt.id)!;
      if (balance <= 0) continue;
      const pay = Math.min(debt.minimumPayment, balance, budget);
      balances.set(debt.id, balance - pay);
      budget -= pay;
    }

    for (const debt of order) {
      if (budget <= 0) break;
      const balance = balances.get(debt.id)!;
      if (balance <= 0) continue;
      const pay = Math.min(balance, budget);
      balances.set(debt.id, balance - pay);
      budget -= pay;
    }

    for (const debt of order) {
      const entry = result.get(debt.id)!;
      if (entry.payoffOn === null && balances.get(debt.id)! <= 0) {
        entry.payoffOn = addMonths(start, month - 1);
        entry.monthsToPayoff = month;
        cleared += 1;
      }
    }
  }

  const payoffs = order.map((debt) => result.get(debt.id)!);
  const allCleared = payoffs.every((entry) => entry.payoffOn !== null);
  const debtFreeOn = allCleared
    ? payoffs.reduce<Date | null>((latest, entry) => {
        if (!entry.payoffOn) return latest;
        return !latest || entry.payoffOn > latest ? entry.payoffOn : latest;
      }, null)
    : null;
  const months = allCleared
    ? payoffs.reduce((max, entry) => Math.max(max, entry.monthsToPayoff ?? 0), 0)
    : null;

  return {
    focusDebtId: order[0]?.id ?? null,
    debtFreeOn,
    months,
    totalInterest,
    perDebt: Object.fromEntries(result),
  };
}
