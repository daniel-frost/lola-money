import type { Payment } from "@/domain/payment/payment";
import { debts } from "@/fixtures/debts";

const FOCUS_ID = "store-card";
const MONTHLY_EXTRA = [30_000, 35_000, 40_000, 45_000, 48_000, 53_500];

function monthsBack(count: number, day: number): Date {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - count, day),
  );
}

function history(): Payment[] {
  const rows: Payment[] = [];
  MONTHLY_EXTRA.forEach((extra, index) => {
    const back = MONTHLY_EXTRA.length - index;
    for (const debt of debts) {
      const date = monthsBack(back, debt.dueDayOfMonth);
      rows.push({
        id: `${debt.id}-m${back}-min`,
        debtId: debt.id,
        amount: debt.minimumPayment,
        date,
        type: "regular",
        createdAt: date,
      });
    }
    const extraDate = monthsBack(back, 18);
    rows.push({
      id: `${FOCUS_ID}-m${back}-extra`,
      debtId: FOCUS_ID,
      amount: extra,
      date: extraDate,
      type: "regular",
      createdAt: extraDate,
    });
  });
  return rows;
}

const windfall: Payment = {
  id: "store-card-windfall",
  debtId: FOCUS_ID,
  amount: 60_000,
  date: monthsBack(3, 20),
  type: "windfall",
  note: "Tax refund",
  createdAt: monthsBack(3, 20),
};

const currentMonth: Payment[] = [
  {
    id: "store-card-jul",
    debtId: "store-card",
    amount: 62_000,
    date: new Date("2026-07-18"),
    type: "regular",
    createdAt: new Date("2026-07-18"),
  },
  {
    id: "auto-loan-jul",
    debtId: "auto-loan",
    amount: 34_000,
    date: new Date("2026-07-22"),
    type: "regular",
    createdAt: new Date("2026-07-22"),
  },
];

export const payments: Payment[] = [...history(), windfall, ...currentMonth];
