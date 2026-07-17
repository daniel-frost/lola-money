import type { BalanceHistoryPoint } from "@/domain/debt/balance-history";

export type OverviewProgress = {
  history: BalanceHistoryPoint[];
  balanceReduced: number;
};
