import type { OverviewDebtRow } from "@/domain/overview/debt-row";
import type { OverviewHeaderStats } from "@/domain/overview/header-stats";
import type { OverviewPayments } from "@/domain/overview/payments";
import type { PaymentRow } from "@/domain/payment/monthly-payments";
import { summarizePayments } from "@/domain/payment/monthly-payments";
import { listDebts } from "@/server/debt/debt.service";

export async function getOverviewHeaderStats(): Promise<OverviewHeaderStats> {
  return {
    remaining: 4_231_800,
    debtFreeOn: new Date("2029-08-01"),
    paidOffRatio: 0.34,
    strategy: "snowball",
  };
}

const FABRICATED: Record<string, { projectedPayoffOn: Date; isFocus: boolean }> = {
  "store-card": { projectedPayoffOn: new Date("2026-12-01"), isFocus: true },
  "personal-loan": { projectedPayoffOn: new Date("2027-08-01"), isFocus: false },
  "visa-4412": { projectedPayoffOn: new Date("2028-03-01"), isFocus: false },
  "student-loan": { projectedPayoffOn: new Date("2028-11-01"), isFocus: false },
  "auto-loan": { projectedPayoffOn: new Date("2029-08-01"), isFocus: false },
};

export async function getOverviewDebts(): Promise<OverviewDebtRow[]> {
  const debts = await listDebts();
  return debts.map((debt) => ({ debt, ...FABRICATED[debt.id] }));
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
