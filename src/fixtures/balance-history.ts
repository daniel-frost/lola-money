import type { BalanceHistoryPoint } from "@/domain/debt/balance-history";

const MONTHLY_BALANCE = [
  4_900_000, 4_780_000, 4_690_000, 4_600_000, 4_470_000, 4_400_000, 4_320_000,
  4_231_800,
];

function monthsBack(count: number): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - count, 1));
}

export const balanceHistory: BalanceHistoryPoint[] = MONTHLY_BALANCE.map(
  (balance, index) => ({
    month: monthsBack(MONTHLY_BALANCE.length - 1 - index),
    balance,
  }),
);
