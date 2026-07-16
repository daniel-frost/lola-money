import type { Debt } from "@/domain/debt/debt";
import type { Payment } from "@/domain/payment/payment";
import { startOfMonth } from "@/lib/date";

export type MonthlyPaymentTotals = {
  month: Date;
  minimumsBaseline: number;
  minimumsPaid: number;
  extraPaid: number;
  plannedExtra: number;
  planned: boolean;
};

function monthKey(date: Date): string {
  return `${date.getUTCFullYear()}-${date.getUTCMonth()}`;
}

export function summarizeMonthlyHistory(
  payments: Payment[],
  debts: Debt[],
  plannedExtra: number,
  asOf: Date = new Date(),
): MonthlyPaymentTotals[] {
  const minimumsBaseline = debts
    .filter((debt) => debt.status === "active")
    .reduce((sum, debt) => sum + debt.minimumPayment, 0);

  const paidByMonth = new Map<string, number>();
  for (const payment of payments) {
    const key = monthKey(payment.date);
    paidByMonth.set(key, (paidByMonth.get(key) ?? 0) + payment.amount);
  }

  const current = startOfMonth(asOf);
  const currentKey = monthKey(current);
  const earliest = payments.reduce<Date | null>((min, payment) => {
    const month = startOfMonth(payment.date);
    return !min || month < min ? month : min;
  }, null);

  const cursor =
    earliest && earliest < current ? new Date(earliest) : new Date(current);
  const months: MonthlyPaymentTotals[] = [];

  while (cursor <= current) {
    const key = monthKey(cursor);
    const totalPaid = paidByMonth.get(key) ?? 0;
    months.push({
      month: new Date(cursor),
      minimumsBaseline,
      minimumsPaid: Math.min(totalPaid, minimumsBaseline),
      extraPaid: Math.max(0, totalPaid - minimumsBaseline),
      plannedExtra,
      planned: key === currentKey,
    });
    cursor.setUTCMonth(cursor.getUTCMonth() + 1);
  }

  return months;
}
