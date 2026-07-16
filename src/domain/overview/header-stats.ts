import type { Strategy } from "@/domain/payoff/strategy";

export type OverviewHeaderStats = {
  remaining: number;
  debtFreeOn: Date | null;
  paidOffRatio: number;
  strategy: Strategy;
};
